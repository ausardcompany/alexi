#!/usr/bin/env bash
#
# generate-diff-report.sh
# Generates a detailed diff report showing changes in kilocode and opencode
# repositories since the last sync.
#

set -eo pipefail

# =============================================================================
# Constants and Defaults
# =============================================================================

readonly SCRIPT_NAME="$(basename "$0")"
readonly DEFAULT_KILOCODE_DIR="../kilocode"
readonly DEFAULT_OPENCODE_DIR="../opencode"
readonly DEFAULT_LAST_SYNC_FILE=".github/last-sync-commits.json"
readonly DEFAULT_FORMAT="markdown"
readonly MAX_DIFF_LINES=50

# File category patterns (used in categorize_file function):
# - Tool System: **/tool/**
# - Agent System: **/agent/**
# - Permission System: **/permission/**
# - Event Bus: **/bus/** **/event/**
# - Core: **/core/** **/orchestrat**

# =============================================================================
# Color Support
# =============================================================================

# Check if output is a terminal for color support
if [[ -t 1 ]]; then
    readonly COLOR_RED='\033[0;31m'
    readonly COLOR_GREEN='\033[0;32m'
    readonly COLOR_YELLOW='\033[0;33m'
    readonly COLOR_BLUE='\033[0;34m'
    readonly COLOR_MAGENTA='\033[0;35m'
    readonly COLOR_CYAN='\033[0;36m'
    readonly COLOR_BOLD='\033[1m'
    readonly COLOR_RESET='\033[0m'
else
    readonly COLOR_RED=''
    readonly COLOR_GREEN=''
    readonly COLOR_YELLOW=''
    readonly COLOR_BLUE=''
    readonly COLOR_MAGENTA=''
    readonly COLOR_CYAN=''
    readonly COLOR_BOLD=''
    readonly COLOR_RESET=''
fi

# =============================================================================
# Utility Functions
# =============================================================================

log_info() {
    echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $*" >&2
}

log_warn() {
    echo -e "${COLOR_YELLOW}[WARN]${COLOR_RESET} $*" >&2
}

log_error() {
    echo -e "${COLOR_RED}[ERROR]${COLOR_RESET} $*" >&2
}

die() {
    log_error "$@"
    exit 1
}

usage() {
    cat <<EOF
Usage: $SCRIPT_NAME [options]

Generates a detailed diff report showing changes in kilocode and opencode
repositories since the last sync.

Options:
  --kilocode-dir DIR     Path to kilocode repo (default: $DEFAULT_KILOCODE_DIR)
  --opencode-dir DIR     Path to opencode repo (default: $DEFAULT_OPENCODE_DIR)
  --last-sync FILE       Path to last-sync-commits.json (default: $DEFAULT_LAST_SYNC_FILE)
  --output FILE          Output file for report (default: stdout)
  --format FORMAT        Output format: text, markdown, json (default: $DEFAULT_FORMAT)
  -h, --help             Show this help message

Examples:
  $SCRIPT_NAME
  $SCRIPT_NAME --format json --output report.json
  $SCRIPT_NAME --kilocode-dir /path/to/kilocode --opencode-dir /path/to/opencode
EOF
}

# =============================================================================
# Git Helper Functions
# =============================================================================

# Get the first commit in a repository
get_first_commit() {
    local repo_dir="$1"
    git -C "$repo_dir" rev-list --max-parents=0 HEAD 2>/dev/null | head -1
}

# Get current HEAD commit
get_head_commit() {
    local repo_dir="$1"
    git -C "$repo_dir" rev-parse HEAD 2>/dev/null
}

# Get short commit hash
get_short_hash() {
    local repo_dir="$1"
    local commit="$2"
    git -C "$repo_dir" rev-parse --short "$commit" 2>/dev/null
}

# Get commit count between two commits
get_commit_count() {
    local repo_dir="$1"
    local old_commit="$2"
    local new_commit="$3"
    git -C "$repo_dir" rev-list --count "${old_commit}..${new_commit}" 2>/dev/null || echo "0"
}

# Get changed file count between two commits
get_changed_file_count() {
    local repo_dir="$1"
    local old_commit="$2"
    local new_commit="$3"
    git -C "$repo_dir" diff --name-only "${old_commit}..${new_commit}" 2>/dev/null | wc -l | tr -d ' '
}

# Get commit log between two commits
get_commit_log() {
    local repo_dir="$1"
    local old_commit="$2"
    local new_commit="$3"
    local format="$4"
    
    case "$format" in
        json)
            git -C "$repo_dir" log --pretty=format:'{"hash": "%h", "subject": "%s", "author": "%an", "date": "%ci"},' \
                "${old_commit}..${new_commit}" 2>/dev/null | sed '$ s/,$//'
            ;;
        markdown)
            git -C "$repo_dir" log --pretty=format:'- %h - %s (%an, %cd)' --date=short \
                "${old_commit}..${new_commit}" 2>/dev/null
            ;;
        text)
            git -C "$repo_dir" log --pretty=format:'  %h - %s (%an, %cd)' --date=short \
                "${old_commit}..${new_commit}" 2>/dev/null
            ;;
    esac
}

# Get diff stat for files
get_diff_stat() {
    local repo_dir="$1"
    local old_commit="$2"
    local new_commit="$3"
    git -C "$repo_dir" diff --stat "${old_commit}..${new_commit}" 2>/dev/null
}

# Get changed files list with stats
get_changed_files_with_stats() {
    local repo_dir="$1"
    local old_commit="$2"
    local new_commit="$3"
    git -C "$repo_dir" diff --numstat "${old_commit}..${new_commit}" 2>/dev/null
}

# Get diff for a specific file (limited lines)
get_file_diff() {
    local repo_dir="$1"
    local old_commit="$2"
    local new_commit="$3"
    local file="$4"
    local max_lines="$5"
    
    git -C "$repo_dir" diff "${old_commit}..${new_commit}" -- "$file" 2>/dev/null | head -n "$max_lines"
}

# =============================================================================
# File Categorization
# =============================================================================

# Categorize a file path - returns category name
categorize_file() {
    local file="$1"
    
    if [[ "$file" == *"/tool/"* ]]; then
        echo "tool_system"
    elif [[ "$file" == *"/agent/"* ]]; then
        echo "agent_system"
    elif [[ "$file" == *"/permission/"* ]]; then
        echo "permission_system"
    elif [[ "$file" == *"/bus/"* ]] || [[ "$file" == *"/event/"* ]]; then
        echo "event_bus"
    elif [[ "$file" == *"/core/"* ]] || [[ "$file" == *"orchestrat"* ]]; then
        echo "core"
    else
        echo "other"
    fi
}

# Get human-readable category name
get_category_display_name() {
    local category="$1"
    case "$category" in
        tool_system) echo "Tool System" ;;
        agent_system) echo "Agent System" ;;
        permission_system) echo "Permission System" ;;
        event_bus) echo "Event Bus" ;;
        core) echo "Core" ;;
        other) echo "Other Changes" ;;
        *) echo "$category" ;;
    esac
}

# Get category pattern description
get_category_pattern() {
    local category="$1"
    case "$category" in
        tool_system) echo "packages/*/src/tool/" ;;
        agent_system) echo "packages/*/src/agent/" ;;
        permission_system) echo "**/permission/" ;;
        event_bus) echo "**/bus/, **/event/" ;;
        core) echo "**/core/" ;;
        other) echo "" ;;
        *) echo "" ;;
    esac
}

# =============================================================================
# JSON Parsing
# =============================================================================

# Parse JSON value using basic tools (no jq dependency)
# Handles flat key-value pairs like: "key": "value"
parse_json_value() {
    local json="$1"
    local key="$2"
    echo "$json" | grep -o "\"$key\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | sed 's/.*: *"\([^"]*\)"/\1/' | head -1
}

# Extract nested object from JSON (returns content between { })
# For input like: "repo": { ... }, extracts the inner content
parse_json_nested_object() {
    local json="$1"
    local key="$2"
    # Match "key": { ... } and extract the braced content
    # Uses awk to handle nested braces properly
    echo "$json" | awk -v key="\"$key\"" '
    BEGIN { found=0; depth=0; result="" }
    {
        line = $0
        if (!found) {
            # Look for the key
            idx = index(line, key)
            if (idx > 0) {
                # Find the opening brace after the key
                rest = substr(line, idx + length(key))
                if (match(rest, /:[[:space:]]*\{/)) {
                    found = 1
                    # Start after the opening brace
                    rest = substr(rest, RSTART + RLENGTH)
                    depth = 1
                    line = rest
                }
            }
        }
        if (found) {
            for (i = 1; i <= length(line); i++) {
                c = substr(line, i, 1)
                if (c == "{") depth++
                else if (c == "}") {
                    depth--
                    if (depth == 0) {
                        print result
                        exit
                    }
                }
                if (depth > 0) result = result c
            }
            if (depth > 0) result = result "\n"
        }
    }
    '
}

# Read last sync commits from JSON file
# Handles nested JSON structure like: {"repo": {"last_synced_commit": "hash", ...}}
read_last_sync_commits() {
    local sync_file="$1"
    local repo="$2"
    
    if [[ ! -f "$sync_file" ]]; then
        echo ""
        return
    fi
    
    local content
    content=$(cat "$sync_file")
    
    # First, try to extract nested object for the repo
    local repo_object
    repo_object=$(parse_json_nested_object "$content" "$repo")
    
    if [[ -n "$repo_object" ]]; then
        # Extract last_synced_commit from the nested object
        parse_json_value "$repo_object" "last_synced_commit"
    else
        # Fallback: try flat structure (for backwards compatibility)
        parse_json_value "$content" "$repo"
    fi
}

# =============================================================================
# Report Generation - Markdown Format
# =============================================================================

generate_repo_report_markdown() {
    local repo_name="$1"
    local repo_dir="$2"
    local old_commit="$3"
    local new_commit="$4"
    
    local short_old short_new
    short_old=$(get_short_hash "$repo_dir" "$old_commit")
    short_new=$(get_short_hash "$repo_dir" "$new_commit")
    
    echo ""
    echo "## $repo_name Changes (${short_old}..${short_new})"
    echo ""
    
    # Commits section
    echo "### Commits"
    echo ""
    local commits
    commits=$(get_commit_log "$repo_dir" "$old_commit" "$new_commit" "markdown")
    if [[ -n "$commits" ]]; then
        echo "$commits"
    else
        echo "(no commits)"
    fi
    echo ""
    
    # Changed Files by Category
    echo "### Changed Files by Category"
    echo ""
    
    # Get all changed files with stats
    local changed_files
    changed_files=$(get_changed_files_with_stats "$repo_dir" "$old_commit" "$new_commit")
    
    # Categorize files using temporary files (bash 3.x compatible)
    local tmpdir
    tmpdir=$(mktemp -d)
    trap "rm -rf $tmpdir" EXIT
    
    # Initialize category files
    local categories="tool_system agent_system permission_system event_bus core other"
    for cat in $categories; do
        touch "$tmpdir/$cat"
    done
    
    # Process changed files
    while IFS=$'\t' read -r added removed file; do
        [[ -z "$file" ]] && continue
        local category
        category=$(categorize_file "$file")
        echo "- \`$file\` (+$added, -$removed)" >> "$tmpdir/$category"
    done <<< "$changed_files"
    
    # Output each category
    for cat in $categories; do
        local display_name pattern
        display_name=$(get_category_display_name "$cat")
        pattern=$(get_category_pattern "$cat")
        
        if [[ -n "$pattern" ]]; then
            echo "#### $display_name ($pattern)"
        else
            echo "#### $display_name"
        fi
        
        if [[ -s "$tmpdir/$cat" ]]; then
            cat "$tmpdir/$cat"
        else
            echo "(no changes)"
        fi
        echo ""
    done
    
    # Key Diffs section
    echo "### Key Diffs"
    echo ""
    
    # Get important files for diff (tool, agent, permission, core)
    local important_files=""
    while IFS=$'\t' read -r added removed file; do
        [[ -z "$file" ]] && continue
        local category
        category=$(categorize_file "$file")
        if [[ "$category" != "other" ]]; then
            important_files="$important_files$file"$'\n'
        fi
    done <<< "$changed_files"
    
    if [[ -z "$important_files" ]]; then
        echo "(no key diffs to show)"
    else
        local count=0
        local max_files=5
        while IFS= read -r file; do
            [[ -z "$file" ]] && continue
            if [[ $count -ge $max_files ]]; then
                echo ""
                echo "*... and more files (showing first $max_files)*"
                break
            fi
            
            echo "#### $file"
            echo "\`\`\`diff"
            get_file_diff "$repo_dir" "$old_commit" "$new_commit" "$file" "$MAX_DIFF_LINES"
            echo "\`\`\`"
            echo ""
            count=$((count + 1))
        done <<< "$important_files"
    fi
    
    # Clean up trap
    rm -rf "$tmpdir"
    trap - EXIT
}

generate_recommendations_markdown() {
    local kilocode_dir="$1"
    local opencode_dir="$2"
    local kilo_old="$3"
    local kilo_new="$4"
    local open_old="$5"
    local open_new="$6"
    
    echo "## Recommendations"
    echo ""
    echo "Based on the changes, the following files in sap-bot-orchestrator should be reviewed:"
    echo ""
    
    local recommendations=""
    
    # Check kilocode changes
    if [[ -d "$kilocode_dir" ]] && [[ -n "$kilo_old" ]] && [[ -n "$kilo_new" ]]; then
        local kilo_files
        kilo_files=$(get_changed_files_with_stats "$kilocode_dir" "$kilo_old" "$kilo_new" 2>/dev/null || true)
        
        while IFS=$'\t' read -r added removed file; do
            [[ -z "$file" ]] && continue
            local category
            category=$(categorize_file "$file")
            
            case "$category" in
                tool_system)
                    local tool_name
                    tool_name=$(basename "$file" .ts)
                    recommendations="$recommendations- \`src/tool/${tool_name}.ts\` - update based on kilocode $file changes"$'\n'
                    ;;
                agent_system)
                    recommendations="$recommendations- \`src/agent/index.ts\` - incorporate new agent patterns from $file"$'\n'
                    ;;
                permission_system)
                    recommendations="$recommendations- \`src/permission/\` - review permission changes from $file"$'\n'
                    ;;
                core)
                    recommendations="$recommendations- \`src/core/\` - review core changes from $file"$'\n'
                    ;;
            esac
        done <<< "$kilo_files"
    fi
    
    # Check opencode changes
    if [[ -d "$opencode_dir" ]] && [[ -n "$open_old" ]] && [[ -n "$open_new" ]]; then
        local open_files
        open_files=$(get_changed_files_with_stats "$opencode_dir" "$open_old" "$open_new" 2>/dev/null || true)
        
        while IFS=$'\t' read -r added removed file; do
            [[ -z "$file" ]] && continue
            local category
            category=$(categorize_file "$file")
            
            case "$category" in
                tool_system)
                    local tool_name
                    tool_name=$(basename "$file" .ts)
                    recommendations="$recommendations- \`src/tool/${tool_name}.ts\` - update based on opencode $file changes"$'\n'
                    ;;
                agent_system)
                    recommendations="$recommendations- \`src/agent/index.ts\` - incorporate patterns from opencode $file"$'\n'
                    ;;
            esac
        done <<< "$open_files"
    fi
    
    # Remove duplicates and print
    if [[ -n "$recommendations" ]]; then
        echo "$recommendations" | sort -u | grep -v '^$'
    else
        echo "- No specific recommendations - review changes manually"
    fi
}

generate_markdown_report() {
    local kilocode_dir="$1"
    local opencode_dir="$2"
    local kilo_old="$3"
    local kilo_new="$4"
    local open_old="$5"
    local open_new="$6"
    
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Header
    echo "# Upstream Changes Report"
    echo "Generated: $timestamp"
    echo ""
    
    # Summary
    echo "## Summary"
    
    local kilo_commits=0 kilo_files=0
    local open_commits=0 open_files=0
    
    if [[ -d "$kilocode_dir" ]] && [[ -n "$kilo_old" ]] && [[ -n "$kilo_new" ]]; then
        kilo_commits=$(get_commit_count "$kilocode_dir" "$kilo_old" "$kilo_new")
        kilo_files=$(get_changed_file_count "$kilocode_dir" "$kilo_old" "$kilo_new")
    fi
    
    if [[ -d "$opencode_dir" ]] && [[ -n "$open_old" ]] && [[ -n "$open_new" ]]; then
        open_commits=$(get_commit_count "$opencode_dir" "$open_old" "$open_new")
        open_files=$(get_changed_file_count "$opencode_dir" "$open_old" "$open_new")
    fi
    
    echo "- kilocode: $kilo_commits commits, $kilo_files files changed"
    echo "- opencode: $open_commits commits, $open_files files changed"
    
    # Repo reports
    if [[ -d "$kilocode_dir" ]] && [[ -n "$kilo_old" ]] && [[ -n "$kilo_new" ]]; then
        generate_repo_report_markdown "kilocode" "$kilocode_dir" "$kilo_old" "$kilo_new"
    fi
    
    if [[ -d "$opencode_dir" ]] && [[ -n "$open_old" ]] && [[ -n "$open_new" ]]; then
        generate_repo_report_markdown "opencode" "$opencode_dir" "$open_old" "$open_new"
    fi
    
    # Recommendations
    echo ""
    generate_recommendations_markdown "$kilocode_dir" "$opencode_dir" \
        "$kilo_old" "$kilo_new" "$open_old" "$open_new"
}

# =============================================================================
# Report Generation - Text Format
# =============================================================================

generate_text_report() {
    local kilocode_dir="$1"
    local opencode_dir="$2"
    local kilo_old="$3"
    local kilo_new="$4"
    local open_old="$5"
    local open_new="$6"
    
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "==============================================================================="
    echo "                         UPSTREAM CHANGES REPORT"
    echo "==============================================================================="
    echo "Generated: $timestamp"
    echo ""
    
    # Summary
    echo "SUMMARY"
    echo "-------"
    
    local kilo_commits=0 kilo_files=0
    local open_commits=0 open_files=0
    
    if [[ -d "$kilocode_dir" ]] && [[ -n "$kilo_old" ]] && [[ -n "$kilo_new" ]]; then
        kilo_commits=$(get_commit_count "$kilocode_dir" "$kilo_old" "$kilo_new")
        kilo_files=$(get_changed_file_count "$kilocode_dir" "$kilo_old" "$kilo_new")
    fi
    
    if [[ -d "$opencode_dir" ]] && [[ -n "$open_old" ]] && [[ -n "$open_new" ]]; then
        open_commits=$(get_commit_count "$opencode_dir" "$open_old" "$open_new")
        open_files=$(get_changed_file_count "$opencode_dir" "$open_old" "$open_new")
    fi
    
    echo "  kilocode: $kilo_commits commits, $kilo_files files changed"
    echo "  opencode: $open_commits commits, $open_files files changed"
    echo ""
    
    # kilocode section
    if [[ -d "$kilocode_dir" ]] && [[ -n "$kilo_old" ]] && [[ -n "$kilo_new" ]]; then
        local short_old short_new
        short_old=$(get_short_hash "$kilocode_dir" "$kilo_old")
        short_new=$(get_short_hash "$kilocode_dir" "$kilo_new")
        
        echo "==============================================================================="
        echo "KILOCODE CHANGES (${short_old}..${short_new})"
        echo "==============================================================================="
        echo ""
        echo "Commits:"
        get_commit_log "$kilocode_dir" "$kilo_old" "$kilo_new" "text"
        echo ""
        echo ""
        echo "Changed Files:"
        get_diff_stat "$kilocode_dir" "$kilo_old" "$kilo_new"
        echo ""
    fi
    
    # opencode section
    if [[ -d "$opencode_dir" ]] && [[ -n "$open_old" ]] && [[ -n "$open_new" ]]; then
        local short_old short_new
        short_old=$(get_short_hash "$opencode_dir" "$open_old")
        short_new=$(get_short_hash "$opencode_dir" "$open_new")
        
        echo "==============================================================================="
        echo "OPENCODE CHANGES (${short_old}..${short_new})"
        echo "==============================================================================="
        echo ""
        echo "Commits:"
        get_commit_log "$opencode_dir" "$open_old" "$open_new" "text"
        echo ""
        echo ""
        echo "Changed Files:"
        get_diff_stat "$opencode_dir" "$open_old" "$open_new"
        echo ""
    fi
    
    echo "==============================================================================="
    echo "END OF REPORT"
    echo "==============================================================================="
}

# =============================================================================
# Report Generation - JSON Format
# =============================================================================

generate_json_repo_section() {
    local repo_name="$1"
    local repo_dir="$2"
    local old_commit="$3"
    local new_commit="$4"
    
    local short_old short_new commits files
    short_old=$(get_short_hash "$repo_dir" "$old_commit")
    short_new=$(get_short_hash "$repo_dir" "$new_commit")
    commits=$(get_commit_count "$repo_dir" "$old_commit" "$new_commit")
    files=$(get_changed_file_count "$repo_dir" "$old_commit" "$new_commit")
    
    cat <<EOF
    "$repo_name": {
      "old_commit": "$old_commit",
      "new_commit": "$new_commit",
      "old_commit_short": "$short_old",
      "new_commit_short": "$short_new",
      "commit_count": $commits,
      "file_count": $files,
      "commits": [
        $(get_commit_log "$repo_dir" "$old_commit" "$new_commit" "json")
      ],
      "changed_files": {
EOF
    
    # Categorize files for JSON using temporary files
    local changed_files
    changed_files=$(get_changed_files_with_stats "$repo_dir" "$old_commit" "$new_commit")
    
    local tmpdir
    tmpdir=$(mktemp -d)
    trap "rm -rf $tmpdir" EXIT
    
    # Initialize category files
    local categories="tool_system agent_system permission_system event_bus core other"
    for cat in $categories; do
        touch "$tmpdir/$cat"
    done
    
    # Process changed files
    while IFS=$'\t' read -r added removed file; do
        [[ -z "$file" ]] && continue
        local category
        category=$(categorize_file "$file")
        echo "{\"file\": \"$file\", \"added\": $added, \"removed\": $removed}" >> "$tmpdir/$category"
    done <<< "$changed_files"
    
    local first=true
    for cat in $categories; do
        if [[ "$first" == "true" ]]; then
            first=false
        else
            printf ",\n"
        fi
        
        if [[ -s "$tmpdir/$cat" ]]; then
            local json_array
            json_array=$(cat "$tmpdir/$cat" | tr '\n' ',' | sed 's/,$//')
            printf "        \"%s\": [%s]" "$cat" "$json_array"
        else
            printf "        \"%s\": []" "$cat"
        fi
    done
    echo ""
    
    rm -rf "$tmpdir"
    trap - EXIT
    
    echo "      }"
    echo "    }"
}

generate_json_report() {
    local kilocode_dir="$1"
    local opencode_dir="$2"
    local kilo_old="$3"
    local kilo_new="$4"
    local open_old="$5"
    local open_new="$6"
    
    local timestamp
    timestamp=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
    
    echo "{"
    echo "  \"generated\": \"$timestamp\","
    echo "  \"repos\": {"
    
    local has_kilo=false
    local has_open=false
    
    if [[ -d "$kilocode_dir" ]] && [[ -n "$kilo_old" ]] && [[ -n "$kilo_new" ]]; then
        has_kilo=true
        generate_json_repo_section "kilocode" "$kilocode_dir" "$kilo_old" "$kilo_new"
    fi
    
    if [[ -d "$opencode_dir" ]] && [[ -n "$open_old" ]] && [[ -n "$open_new" ]]; then
        has_open=true
        if [[ "$has_kilo" == "true" ]]; then
            echo ","
        fi
        generate_json_repo_section "opencode" "$opencode_dir" "$open_old" "$open_new"
    fi
    
    echo "  }"
    echo "}"
}

# =============================================================================
# Main Function
# =============================================================================

main() {
    # Parse arguments
    local kilocode_dir="$DEFAULT_KILOCODE_DIR"
    local opencode_dir="$DEFAULT_OPENCODE_DIR"
    local last_sync_file="$DEFAULT_LAST_SYNC_FILE"
    local output_file=""
    local format="$DEFAULT_FORMAT"
    
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --kilocode-dir)
                kilocode_dir="$2"
                shift 2
                ;;
            --opencode-dir)
                opencode_dir="$2"
                shift 2
                ;;
            --last-sync)
                last_sync_file="$2"
                shift 2
                ;;
            --output)
                output_file="$2"
                shift 2
                ;;
            --format)
                format="$2"
                shift 2
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                die "Unknown option: $1. Use --help for usage information."
                ;;
        esac
    done
    
    # Validate format
    case "$format" in
        text|markdown|json) ;;
        *) die "Invalid format: $format. Must be one of: text, markdown, json" ;;
    esac
    
    # Check if repos exist
    local repos_found=0
    
    if [[ -d "$kilocode_dir" ]]; then
        if [[ ! -d "$kilocode_dir/.git" ]]; then
            die "kilocode directory exists but is not a git repository: $kilocode_dir"
        fi
        repos_found=$((repos_found + 1))
        log_info "Found kilocode repository at: $kilocode_dir"
    else
        log_warn "kilocode repository not found at: $kilocode_dir"
    fi
    
    if [[ -d "$opencode_dir" ]]; then
        if [[ ! -d "$opencode_dir/.git" ]]; then
            die "opencode directory exists but is not a git repository: $opencode_dir"
        fi
        repos_found=$((repos_found + 1))
        log_info "Found opencode repository at: $opencode_dir"
    else
        log_warn "opencode repository not found at: $opencode_dir"
    fi
    
    if [[ $repos_found -eq 0 ]]; then
        die "No repositories found. Please ensure at least one of kilocode or opencode repositories exists."
    fi
    
    # Read last sync commits
    local kilo_last_sync="" open_last_sync=""
    
    if [[ -f "$last_sync_file" ]]; then
        log_info "Reading last sync commits from: $last_sync_file"
        kilo_last_sync=$(read_last_sync_commits "$last_sync_file" "kilocode")
        open_last_sync=$(read_last_sync_commits "$last_sync_file" "opencode")
    else
        log_warn "Last sync file not found: $last_sync_file - will use initial commits"
    fi
    
    # Get commit ranges for each repo
    local kilo_old="" kilo_new=""
    local open_old="" open_new=""
    
    if [[ -d "$kilocode_dir" ]]; then
        kilo_new=$(get_head_commit "$kilocode_dir")
        if [[ -n "$kilo_last_sync" ]]; then
            kilo_old="$kilo_last_sync"
        else
            kilo_old=$(get_first_commit "$kilocode_dir")
            log_info "Using first commit for kilocode: $kilo_old"
        fi
        log_info "kilocode range: $(get_short_hash "$kilocode_dir" "$kilo_old")..$(get_short_hash "$kilocode_dir" "$kilo_new")"
    fi
    
    if [[ -d "$opencode_dir" ]]; then
        open_new=$(get_head_commit "$opencode_dir")
        if [[ -n "$open_last_sync" ]]; then
            open_old="$open_last_sync"
        else
            open_old=$(get_first_commit "$opencode_dir")
            log_info "Using first commit for opencode: $open_old"
        fi
        log_info "opencode range: $(get_short_hash "$opencode_dir" "$open_old")..$(get_short_hash "$opencode_dir" "$open_new")"
    fi
    
    # Generate report
    local report=""
    
    case "$format" in
        markdown)
            report=$(generate_markdown_report "$kilocode_dir" "$opencode_dir" \
                "$kilo_old" "$kilo_new" "$open_old" "$open_new")
            ;;
        text)
            report=$(generate_text_report "$kilocode_dir" "$opencode_dir" \
                "$kilo_old" "$kilo_new" "$open_old" "$open_new")
            ;;
        json)
            report=$(generate_json_report "$kilocode_dir" "$opencode_dir" \
                "$kilo_old" "$kilo_new" "$open_old" "$open_new")
            ;;
    esac
    
    # Output report
    if [[ -n "$output_file" ]]; then
        echo "$report" > "$output_file"
        log_info "Report written to: $output_file"
    else
        echo "$report"
    fi
}

# Run main function
main "$@"
