#!/usr/bin/env bash
#
# sync-upstream.sh - Local script to sync forks with upstream and analyze changes
#
# This script mirrors the GitHub Action functionality but runs on developer's machine.
# It syncs ausard/kilocode and ausard/opencode forks with their upstream repositories,
# generates diff reports, and uses Kilo AI to analyze and apply changes.
#
# Usage: ./scripts/sync-upstream.sh [OPTIONS]
#
# Options:
#   --dry-run     Only analyze, don't apply changes
#   --skip-sync   Skip syncing forks with upstream (use existing state)
#   --verbose     Verbose output
#   --yes         Skip confirmation prompts
#   --help        Show this help message
#
# Environment variables:
#   SAP_AI_CORE_URL           - SAP AI Core URL (optional)
#   SAP_AI_CORE_CLIENT_ID     - SAP AI Core client ID (optional)
#   SAP_AI_CORE_CLIENT_SECRET - SAP AI Core client secret (optional)
#   KILO_MODEL                - Override default model (optional)
#

set -eo pipefail

# Script configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly REPOS_DIR="$(cd "${PROJECT_ROOT}/.." && pwd)"
readonly KILO_PATH="/opt/homebrew/bin/kilo"
readonly LAST_SYNC_FILE="${PROJECT_ROOT}/.github/last-sync-commits.json"
readonly DEFAULT_MODEL="sap-ai-core/anthropic--claude-sonnet-4"

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Flags
DRY_RUN=false
SKIP_SYNC=false
VERBOSE=false
AUTO_YES=false

# Repository configurations (simple arrays to avoid associative array issues)
REPO_NAMES=("kilocode" "opencode" "claude-code")
REPO_KILOCODE_FULL="ausard/kilocode"
REPO_OPENCODE_FULL="ausard/opencode"
REPO_CLAUDE_CODE_FULL="anthropics/claude-code"  # Direct from Anthropic (no fork due to EMU restrictions)

# Get full repo name for a given repo name
get_repo_full() {
    local repo_name="$1"
    case "$repo_name" in
        kilocode) echo "$REPO_KILOCODE_FULL" ;;
        opencode) echo "$REPO_OPENCODE_FULL" ;;
        claude-code) echo "$REPO_CLAUDE_CODE_FULL" ;;
        *) echo "" ;;
    esac
}

#######################################
# Logging functions
#######################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

log_verbose() {
    if [[ "$VERBOSE" == true ]]; then
        echo -e "${BLUE}[VERBOSE]${NC} $*"
    fi
}

#######################################
# Show usage information
#######################################
show_usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Local script to sync forks with upstream and analyze changes using Kilo AI.

Options:
  --dry-run     Only analyze, don't apply changes
  --skip-sync   Skip syncing forks with upstream (use existing state)
  --verbose     Verbose output
  --yes         Skip confirmation prompts
  --help        Show this help message

Environment variables:
  SAP_AI_CORE_URL           - SAP AI Core URL (optional)
  SAP_AI_CORE_CLIENT_ID     - SAP AI Core client ID (optional)
  SAP_AI_CORE_CLIENT_SECRET - SAP AI Core client secret (optional)
  KILO_MODEL                - Override default model (optional)

Examples:
  $(basename "$0")                    # Full sync and analysis
  $(basename "$0") --dry-run          # Analyze without applying changes
  $(basename "$0") --skip-sync        # Use existing repo state
  $(basename "$0") --verbose --yes    # Verbose output, auto-confirm

EOF
}

#######################################
# Parse command line arguments
#######################################
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --skip-sync)
                SKIP_SYNC=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --yes)
                AUTO_YES=true
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

#######################################
# Check required dependencies
#######################################
check_dependencies() {
    log_info "Checking dependencies..."
    
    local missing_deps=()
    
    # Check git
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    else
        log_verbose "git: $(git --version)"
    fi
    
    # Check gh (GitHub CLI)
    if ! command -v gh &> /dev/null; then
        missing_deps+=("gh (GitHub CLI)")
    else
        log_verbose "gh: $(gh --version | head -1)"
        
        # Check if gh is authenticated
        if ! gh auth status &> /dev/null; then
            log_error "GitHub CLI is not authenticated. Run 'gh auth login' first."
            exit 1
        fi
    fi
    
    # Check kilo
    if [[ ! -x "$KILO_PATH" ]]; then
        if ! command -v kilo &> /dev/null; then
            missing_deps+=("kilo (at $KILO_PATH or in PATH)")
        else
            log_verbose "kilo: found in PATH"
        fi
    else
        log_verbose "kilo: $KILO_PATH"
    fi
    
    # Check jq for JSON processing
    if ! command -v jq &> /dev/null; then
        missing_deps+=("jq")
    else
        log_verbose "jq: $(jq --version)"
    fi
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log_error "Missing dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        exit 1
    fi
    
    log_success "All dependencies satisfied"
}

#######################################
# Get kilo command with proper path
#######################################
get_kilo_cmd() {
    if [[ -x "$KILO_PATH" ]]; then
        echo "$KILO_PATH"
    else
        echo "kilo"
    fi
}

#######################################
# Clone repository if not exists, pull if exists
# Arguments:
#   $1 - Repository name (e.g., "kilocode")
#   $2 - Repository full name (e.g., "ausard/kilocode")
#######################################
clone_or_update_repo() {
    local repo_name="$1"
    local repo_full="$2"
    local repo_path="${REPOS_DIR}/${repo_name}"
    
    log_info "Processing repository: ${repo_full}"
    
    if [[ -d "$repo_path" ]]; then
        log_verbose "Repository exists at ${repo_path}, updating..."
        
        pushd "$repo_path" > /dev/null
        
        # Ensure we're on the default branch
        local default_branch
        default_branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")
        
        log_verbose "Switching to default branch: ${default_branch}"
        git checkout "$default_branch" 2>/dev/null || git checkout main 2>/dev/null || git checkout master
        
        # Fetch and pull latest
        log_verbose "Fetching latest changes..."
        git fetch origin
        git pull origin "$default_branch" --ff-only || {
            log_warn "Fast-forward pull failed, attempting rebase..."
            git pull origin "$default_branch" --rebase
        }
        
        popd > /dev/null
        log_success "Updated ${repo_name}"
    else
        log_verbose "Cloning ${repo_full} to ${repo_path}..."
        gh repo clone "$repo_full" "$repo_path"
        log_success "Cloned ${repo_name}"
    fi
}

#######################################
# Sync fork with upstream repository
# Arguments:
#   $1 - Repository name (e.g., "kilocode")
#######################################
sync_fork_with_upstream() {
    local repo_name="$1"
    local repo_path="${REPOS_DIR}/${repo_name}"
    local repo_full
    repo_full=$(get_repo_full "$repo_name")
    
    log_info "Syncing ${repo_full} with upstream..."
    
    pushd "$repo_path" > /dev/null
    
    # Use gh repo sync to sync fork with upstream
    if gh repo sync "$repo_full" --force 2>&1; then
        log_success "Synced ${repo_name} with upstream"
        
        # Pull the synced changes locally
        git fetch origin
        git pull origin --ff-only 2>/dev/null || git pull origin --rebase
    else
        log_warn "Could not sync ${repo_name} with upstream (may not be a fork or no upstream configured)"
    fi
    
    popd > /dev/null
}

#######################################
# Get current commit SHA for a repository
# Arguments:
#   $1 - Repository path
#######################################
get_current_commit() {
    local repo_path="$1"
    git -C "$repo_path" rev-parse HEAD
}

#######################################
# Read last sync commits from JSON file
#######################################
read_last_sync_commits() {
    if [[ -f "$LAST_SYNC_FILE" ]]; then
        cat "$LAST_SYNC_FILE"
    else
        echo '{}'
    fi
}

#######################################
# Generate diff report between commits
# Arguments:
#   $1 - Repository name
#   $2 - From commit (can be empty for full diff)
#   $3 - To commit
#######################################
generate_diff_report() {
    local repo_name="$1"
    local from_commit="$2"
    local to_commit="$3"
    local repo_path="${REPOS_DIR}/${repo_name}"
    local diff_file="${PROJECT_ROOT}/diff-report-${repo_name}.txt"
    
    log_info "Generating diff report for ${repo_name}..."
    
    pushd "$repo_path" > /dev/null
    
    {
        echo "========================================"
        echo "Diff Report: ${repo_name}"
        echo "========================================"
        echo ""
        echo "Repository: $(get_repo_full "$repo_name")"
        echo "Generated: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
        echo ""
        
        if [[ -n "$from_commit" ]]; then
            echo "From commit: ${from_commit}"
            echo "To commit: ${to_commit}"
            echo ""
            
            # Check if from_commit exists
            if git cat-file -t "$from_commit" &>/dev/null; then
                echo "--- Commit Log ---"
                git log --oneline "${from_commit}..${to_commit}" 2>/dev/null || echo "No new commits"
                echo ""
                
                echo "--- Changed Files ---"
                git diff --stat "${from_commit}..${to_commit}" 2>/dev/null || echo "No changes"
                echo ""
                
                echo "--- Full Diff ---"
                git diff "${from_commit}..${to_commit}" 2>/dev/null || echo "No diff available"
            else
                log_warn "From commit ${from_commit} not found, showing recent commits"
                echo "--- Recent Commits (last 20) ---"
                git log --oneline -20
                echo ""
            fi
        else
            echo "No previous sync commit found. Showing recent changes."
            echo ""
            echo "--- Recent Commits (last 20) ---"
            git log --oneline -20
            echo ""
        fi
    } > "$diff_file"
    
    popd > /dev/null
    
    log_verbose "Diff report saved to ${diff_file}"
    echo "$diff_file"
}

#######################################
# Check if there are meaningful changes
# Arguments:
#   $1 - Repository name
#   $2 - From commit
#   $3 - To commit
#######################################
has_changes() {
    local repo_name="$1"
    local from_commit="$2"
    local to_commit="$3"
    local repo_path="${REPOS_DIR}/${repo_name}"
    
    if [[ -z "$from_commit" ]]; then
        # No previous commit, assume there are changes to review
        return 0
    fi
    
    pushd "$repo_path" > /dev/null
    
    # Check if commits are the same
    if [[ "$from_commit" == "$to_commit" ]]; then
        popd > /dev/null
        return 1
    fi
    
    # Check if from_commit exists and there are differences
    if git cat-file -t "$from_commit" &>/dev/null; then
        local diff_count
        diff_count=$(git diff --stat "${from_commit}..${to_commit}" 2>/dev/null | wc -l)
        popd > /dev/null
        [[ $diff_count -gt 0 ]]
    else
        popd > /dev/null
        return 0
    fi
}

#######################################
# Build the analysis prompt
# Arguments:
#   $1 - Kilocode diff file
#   $2 - Opencode diff file
#######################################
build_analysis_prompt() {
    local kilocode_diff="$1"
    local opencode_diff="$2"
    local claude_code_diff="$3"
    
    cat << 'PROMPT_EOF'
You are analyzing upstream changes from three AI coding assistant repositories to identify updates that should be applied to the Alexi project:
- **kilocode** (Kilo-Org/kilocode) - Kilo AI coding assistant
- **opencode** (anomalyco/opencode) - OpenCode AI terminal assistant  
- **claude-code** (anthropics/claude-code) - Anthropic's Claude Code CLI

## Task
Review the diff reports below and identify:
1. Bug fixes that should be applied
2. New features that are relevant
3. Security updates
4. Performance improvements
5. Breaking changes that need attention

## Diff Reports

### Kilocode Changes
PROMPT_EOF
    
    if [[ -f "$kilocode_diff" ]]; then
        cat "$kilocode_diff"
    else
        echo "No diff report available"
    fi
    
    cat << 'PROMPT_EOF'

### Opencode Changes
PROMPT_EOF
    
    if [[ -f "$opencode_diff" ]]; then
        cat "$opencode_diff"
    else
        echo "No diff report available"
    fi
    
    cat << 'PROMPT_EOF'

### Claude-Code Changes (Anthropic)
PROMPT_EOF
    
    if [[ -f "$claude_code_diff" ]]; then
        cat "$claude_code_diff"
    else
        echo "No diff report available"
    fi
    
    cat << 'PROMPT_EOF'

## Instructions
1. Analyze the changes above from all three upstream repositories
2. Identify which changes are relevant to Alexi
3. Suggest specific updates to apply (prioritize security fixes, then bug fixes, then features)
4. Highlight any breaking changes or potential issues
5. Provide a summary of recommended actions

Please provide your analysis in a structured format.
PROMPT_EOF
}

#######################################
# Run Kilo AI analysis
# Arguments:
#   $1 - Prompt text
#######################################
run_kilo_analysis() {
    local prompt="$1"
    local kilo_cmd
    kilo_cmd=$(get_kilo_cmd)
    
    # Determine which model to use
    local model="${KILO_MODEL:-$DEFAULT_MODEL}"
    
    # Check if SAP AI Core is configured
    if [[ -n "${SAP_AI_CORE_URL:-}" ]] && [[ -n "${SAP_AI_CORE_CLIENT_ID:-}" ]] && [[ -n "${SAP_AI_CORE_CLIENT_SECRET:-}" ]]; then
        log_info "Using SAP AI Core with model: ${model}"
    else
        log_warn "SAP AI Core not configured, using default model"
        model=""  # Let kilo use its default
    fi
    
    log_info "Running Kilo analysis..."
    log_verbose "Model: ${model:-default}"
    
    # Create a temporary file for the prompt
    local prompt_file
    prompt_file=$(mktemp)
    echo "$prompt" > "$prompt_file"
    
    # Run kilo
    local kilo_output
    if [[ -n "$model" ]]; then
        kilo_output=$("$kilo_cmd" run --model "$model" "$(cat "$prompt_file")" 2>&1) || {
            log_warn "Kilo run with specified model failed, trying without model flag..."
            kilo_output=$("$kilo_cmd" run "$(cat "$prompt_file")" 2>&1) || {
                log_error "Kilo analysis failed"
                rm -f "$prompt_file"
                return 1
            }
        }
    else
        kilo_output=$("$kilo_cmd" run "$(cat "$prompt_file")" 2>&1) || {
            log_error "Kilo analysis failed"
            rm -f "$prompt_file"
            return 1
        }
    fi
    
    rm -f "$prompt_file"
    
    echo "$kilo_output"
}

#######################################
# Create backup branch
#######################################
create_backup_branch() {
    local backup_branch="backup/pre-sync-$(date +%Y%m%d-%H%M%S)"
    
    log_info "Creating backup branch: ${backup_branch}"
    
    pushd "$PROJECT_ROOT" > /dev/null
    git branch "$backup_branch"
    popd > /dev/null
    
    log_success "Backup branch created: ${backup_branch}"
    echo "$backup_branch"
}

#######################################
# Show git diff of current changes
#######################################
show_pending_changes() {
    log_info "Pending changes in Alexi:"
    echo ""
    
    pushd "$PROJECT_ROOT" > /dev/null
    
    if git diff --stat | grep -q .; then
        git diff --stat
        echo ""
        if [[ "$VERBOSE" == true ]]; then
            git diff
        fi
    else
        echo "No pending changes"
    fi
    
    popd > /dev/null
}

#######################################
# Update last sync commits file
# Arguments:
#   $1 - Kilocode commit
#   $2 - Opencode commit
#   $3 - Claude-code commit
#######################################
update_last_sync_commits() {
    local kilocode_commit="$1"
    local opencode_commit="$2"
    local claude_code_commit="$3"
    
    log_info "Updating last sync commits..."
    
    # Ensure .github directory exists
    mkdir -p "$(dirname "$LAST_SYNC_FILE")"
    
    local synced_at
    synced_at="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    
    # Write JSON file with nested structure
    cat > "$LAST_SYNC_FILE" << EOF
{
  "kilocode": {
    "last_synced_commit": "${kilocode_commit}",
    "last_synced_at": "${synced_at}",
    "upstream": "Kilo-Org/kilocode",
    "fork": "ausard/kilocode"
  },
  "opencode": {
    "last_synced_commit": "${opencode_commit}",
    "last_synced_at": "${synced_at}",
    "upstream": "anomalyco/opencode",
    "fork": "ausard/opencode"
  },
  "claude-code": {
    "last_synced_commit": "${claude_code_commit}",
    "last_synced_at": "${synced_at}",
    "upstream": "anthropics/claude-code",
    "fork": "direct-clone"
  },
  "metadata": {
    "version": "1.1.0",
    "created_at": "2026-02-28T00:00:00Z",
    "description": "Tracks last synced commits from upstream repositories"
  }
}
EOF
    
    log_success "Updated ${LAST_SYNC_FILE}"
}

#######################################
# Prompt user for confirmation
# Arguments:
#   $1 - Prompt message
# Returns:
#   0 if confirmed, 1 otherwise
#######################################
confirm_action() {
    local message="$1"
    
    if [[ "$AUTO_YES" == true ]]; then
        return 0
    fi
    
    echo ""
    read -r -p "${message} [y/N] " response
    case "$response" in
        [yY][eE][sS]|[yY])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

#######################################
# Main execution
#######################################
main() {
    echo ""
    echo "=========================================="
    echo "  Alexi - Upstream Sync"
    echo "=========================================="
    echo ""
    
    # Parse command line arguments
    parse_arguments "$@"
    
    # Show configuration
    log_info "Configuration:"
    echo "  Dry run:    ${DRY_RUN}"
    echo "  Skip sync:  ${SKIP_SYNC}"
    echo "  Verbose:    ${VERBOSE}"
    echo "  Auto-yes:   ${AUTO_YES}"
    echo "  Repos dir:  ${REPOS_DIR}"
    echo ""
    
    # Step 1: Check dependencies
    check_dependencies
    echo ""
    
    # Step 2: Clone or update repositories
    log_info "Step 1/7: Preparing repositories..."
    clone_or_update_repo "kilocode" "ausard/kilocode"
    clone_or_update_repo "opencode" "ausard/opencode"
    clone_or_update_repo "claude-code" "anthropics/claude-code"
    echo ""
    
    # Step 3: Sync forks with upstream (unless --skip-sync)
    if [[ "$SKIP_SYNC" == false ]]; then
        log_info "Step 2/7: Syncing forks with upstream..."
        sync_fork_with_upstream "kilocode"
        sync_fork_with_upstream "opencode"
        # claude-code is direct clone from Anthropic, just fetch latest
        log_info "Fetching latest claude-code from Anthropic..."
        pushd "${REPOS_DIR}/claude-code" > /dev/null
        git fetch origin && git pull origin main --ff-only 2>/dev/null || git pull origin master --ff-only 2>/dev/null || log_warn "Could not pull claude-code updates"
        popd > /dev/null
        echo ""
    else
        log_info "Step 2/7: Skipping fork sync (--skip-sync)"
        echo ""
    fi
    
    # Step 4: Read last sync commits
    log_info "Step 3/7: Reading last sync state..."
    local last_sync_data
    last_sync_data=$(read_last_sync_commits)
    
    local last_kilocode_commit=""
    local last_opencode_commit=""
    local last_claude_code_commit=""
    
    if [[ "$last_sync_data" != "{}" ]]; then
        # Handle both flat format (kilocode: "commit") and nested format (kilocode: {last_synced_commit: "commit"})
        last_kilocode_commit=$(echo "$last_sync_data" | jq -r 'if .kilocode | type == "object" then .kilocode.last_synced_commit else .kilocode end // empty')
        last_opencode_commit=$(echo "$last_sync_data" | jq -r 'if .opencode | type == "object" then .opencode.last_synced_commit else .opencode end // empty')
        last_claude_code_commit=$(echo "$last_sync_data" | jq -r 'if .["claude-code"] | type == "object" then .["claude-code"].last_synced_commit else .["claude-code"] end // empty')
        log_verbose "Last kilocode commit: ${last_kilocode_commit:-none}"
        log_verbose "Last opencode commit: ${last_opencode_commit:-none}"
        log_verbose "Last claude-code commit: ${last_claude_code_commit:-none}"
    else
        log_info "No previous sync data found"
    fi
    echo ""
    
    # Get current commits
    local current_kilocode_commit
    local current_opencode_commit
    local current_claude_code_commit
    current_kilocode_commit=$(get_current_commit "${REPOS_DIR}/kilocode")
    current_opencode_commit=$(get_current_commit "${REPOS_DIR}/opencode")
    current_claude_code_commit=$(get_current_commit "${REPOS_DIR}/claude-code")
    
    log_verbose "Current kilocode commit: ${current_kilocode_commit}"
    log_verbose "Current opencode commit: ${current_opencode_commit}"
    log_verbose "Current claude-code commit: ${current_claude_code_commit}"
    
    # Step 5: Generate diff reports
    log_info "Step 4/7: Generating diff reports..."
    local kilocode_diff
    local opencode_diff
    local claude_code_diff
    kilocode_diff=$(generate_diff_report "kilocode" "$last_kilocode_commit" "$current_kilocode_commit")
    opencode_diff=$(generate_diff_report "opencode" "$last_opencode_commit" "$current_opencode_commit")
    claude_code_diff=$(generate_diff_report "claude-code" "$last_claude_code_commit" "$current_claude_code_commit")
    echo ""
    
    # Step 6: Check if there are changes
    log_info "Step 5/7: Checking for changes..."
    local has_kilocode_changes=false
    local has_opencode_changes=false
    local has_claude_code_changes=false
    
    if has_changes "kilocode" "$last_kilocode_commit" "$current_kilocode_commit"; then
        has_kilocode_changes=true
        log_info "Kilocode has new changes"
    else
        log_info "No new changes in kilocode"
    fi
    
    if has_changes "opencode" "$last_opencode_commit" "$current_opencode_commit"; then
        has_opencode_changes=true
        log_info "Opencode has new changes"
    else
        log_info "No new changes in opencode"
    fi
    
    if has_changes "claude-code" "$last_claude_code_commit" "$current_claude_code_commit"; then
        has_claude_code_changes=true
        log_info "Claude-code has new changes"
    else
        log_info "No new changes in claude-code"
    fi
    echo ""
    
    if [[ "$has_kilocode_changes" == false ]] && [[ "$has_opencode_changes" == false ]] && [[ "$has_claude_code_changes" == false ]]; then
        log_success "No new upstream changes to process"
        
        # Clean up diff files
        rm -f "$kilocode_diff" "$opencode_diff" "$claude_code_diff" 2>/dev/null || true
        
        exit 0
    fi
    
    # Step 7: Create backup branch (if not dry-run)
    if [[ "$DRY_RUN" == false ]]; then
        log_info "Step 6/7: Creating backup branch..."
        local backup_branch
        backup_branch=$(create_backup_branch)
        echo ""
    else
        log_info "Step 6/7: Skipping backup (dry-run mode)"
        echo ""
    fi
    
    # Step 8: Run Kilo analysis
    log_info "Step 7/7: Running Kilo AI analysis..."
    local prompt
    prompt=$(build_analysis_prompt "$kilocode_diff" "$opencode_diff" "$claude_code_diff")
    
    local analysis_result
    analysis_result=$(run_kilo_analysis "$prompt") || {
        log_error "Kilo analysis failed"
        exit 1
    }
    
    echo ""
    echo "=========================================="
    echo "  Analysis Results"
    echo "=========================================="
    echo ""
    echo "$analysis_result"
    echo ""
    
    # Show pending changes
    show_pending_changes
    echo ""
    
    # Handle dry-run mode
    if [[ "$DRY_RUN" == true ]]; then
        log_info "Dry-run mode - no changes will be applied"
        log_info "Diff reports saved to:"
        echo "  - ${kilocode_diff}"
        echo "  - ${opencode_diff}"
        echo "  - ${claude_code_diff}"
        exit 0
    fi
    
    # Prompt for confirmation
    if confirm_action "Apply changes and update sync state?"; then
        log_info "Applying changes..."
        
        # Stage any changes made by kilo
        pushd "$PROJECT_ROOT" > /dev/null
        if git diff --stat | grep -q .; then
            git add -A
            log_success "Changes staged"
        fi
        popd > /dev/null
        
        # Update last sync commits
        update_last_sync_commits "$current_kilocode_commit" "$current_opencode_commit" "$current_claude_code_commit"
        
        log_success "Sync completed successfully!"
        echo ""
        log_info "Next steps:"
        echo "  1. Review the staged changes: git diff --cached"
        echo "  2. Commit the changes: git commit -m 'Sync with upstream'"
        echo "  3. Push to remote: git push"
    else
        log_info "Changes not applied"
        log_info "You can review the diff reports at:"
        echo "  - ${kilocode_diff}"
        echo "  - ${opencode_diff}"
        echo "  - ${claude_code_diff}"
    fi
    
    # Clean up diff files
    if confirm_action "Remove diff report files?"; then
        rm -f "$kilocode_diff" "$opencode_diff" "$claude_code_diff"
        log_success "Diff files cleaned up"
    fi
}

# Run main function
main "$@"
