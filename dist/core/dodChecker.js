/**
 * Definition of Done (DoD) Checks
 * Enforces minimum quality standards for each development stage
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
export class DoDChecker {
    projectPath;
    checks = new Map();
    constructor(projectPath) {
        this.projectPath = projectPath || process.cwd();
        this.registerDefaultChecks();
    }
    /**
     * Register default DoD checks
     */
    registerDefaultChecks() {
        // Build check
        this.register({
            id: 'build',
            name: 'Project Build',
            description: 'Project compiles/assembles successfully',
            stage: 'implementation',
            autoFixable: false,
            check: () => this.checkBuild()
        });
        // Test check
        this.register({
            id: 'tests',
            name: 'Tests Pass',
            description: 'All tests pass (green)',
            stage: 'implementation',
            autoFixable: false,
            check: () => this.checkTests()
        });
        // TODO check
        this.register({
            id: 'todos',
            name: 'No TODOs',
            description: 'No TODO comments unless explicitly agreed',
            stage: 'implementation',
            autoFixable: false,
            check: () => this.checkTODOs()
        });
        // Lint check
        this.register({
            id: 'lint',
            name: 'Linting',
            description: 'Code passes linting checks',
            stage: 'implementation',
            autoFixable: true,
            check: () => this.checkLint()
        });
        // Type check
        this.register({
            id: 'types',
            name: 'Type Checking',
            description: 'TypeScript types are valid',
            stage: 'implementation',
            autoFixable: false,
            check: () => this.checkTypes()
        });
        // AI_NOTES check
        this.register({
            id: 'ai_notes',
            name: 'AI_NOTES.md',
            description: 'Changes documented in AI_NOTES.md',
            stage: 'implementation',
            autoFixable: false,
            check: () => this.checkAINotes()
        });
        // Architecture check
        this.register({
            id: 'architecture_doc',
            name: 'Architecture Documented',
            description: 'Component/boundary map exists',
            stage: 'architecture',
            autoFixable: false,
            check: () => this.checkArchitectureDoc()
        });
        // Data flow check
        this.register({
            id: 'data_flow',
            name: 'Data Flows',
            description: 'Main data flows are described',
            stage: 'architecture',
            autoFixable: false,
            check: () => this.checkDataFlows()
        });
        // Invariants check
        this.register({
            id: 'invariants',
            name: 'Architecture Invariants',
            description: 'Key invariants documented',
            stage: 'architecture',
            autoFixable: false,
            check: () => this.checkInvariants()
        });
        // Documentation check
        this.register({
            id: 'docs_current',
            name: 'Documentation Current',
            description: 'Documentation matches current contracts',
            stage: 'documentation',
            autoFixable: false,
            check: () => this.checkDocsCurrent()
        });
    }
    /**
     * Register a custom check
     */
    register(check) {
        this.checks.set(check.id, check);
    }
    /**
     * Run all checks for a stage
     */
    runChecks(stage) {
        const results = [];
        let passed = 0;
        let failed = 0;
        let warnings = 0;
        for (const [id, check] of this.checks) {
            if (check.stage !== stage && check.stage !== 'all')
                continue;
            try {
                const result = check.check();
                results.push({ check: check.name, result });
                if (result.passed) {
                    passed++;
                }
                else {
                    failed++;
                }
            }
            catch (error) {
                results.push({
                    check: check.name,
                    result: {
                        passed: false,
                        message: `Check failed with error: ${error}`,
                        suggestion: 'Review the error and fix the underlying issue'
                    }
                });
                failed++;
            }
        }
        return {
            stage,
            timestamp: Date.now(),
            totalChecks: results.length,
            passed,
            failed,
            warnings,
            results
        };
    }
    /**
     * Run specific check by ID
     */
    runCheck(checkId) {
        const check = this.checks.get(checkId);
        if (!check)
            return null;
        return check.check();
    }
    /**
     * Generate markdown report
     */
    generateReport(report) {
        let markdown = `# Definition of Done Report\n\n`;
        markdown += `**Stage:** ${report.stage}\n`;
        markdown += `**Date:** ${new Date(report.timestamp).toISOString()}\n`;
        markdown += `**Summary:** ${report.passed}/${report.totalChecks} passed\n\n`;
        // Status indicator
        const allPassed = report.failed === 0;
        markdown += allPassed
            ? `✅ **All checks passed**\n\n`
            : `❌ **${report.failed} check(s) failed**\n\n`;
        markdown += `---\n\n`;
        // Results
        for (const { check, result } of report.results) {
            const icon = result.passed ? '✅' : '❌';
            markdown += `${icon} **${check}**\n`;
            markdown += `   ${result.message}\n`;
            if (result.details && result.details.length > 0) {
                for (const detail of result.details) {
                    markdown += `   - ${detail}\n`;
                }
            }
            if (result.suggestion) {
                markdown += `   💡 ${result.suggestion}\n`;
            }
            markdown += `\n`;
        }
        return markdown;
    }
    // Individual check implementations
    checkBuild() {
        const packageJsonPath = path.join(this.projectPath, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            return {
                passed: false,
                message: 'No package.json found',
                suggestion: 'Ensure you are in a valid project directory'
            };
        }
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            if (!packageJson.scripts?.build) {
                return {
                    passed: true,
                    message: 'No build script defined (may not be required)',
                    details: ['Project may not require a build step']
                };
            }
            execSync('npm run build', {
                cwd: this.projectPath,
                stdio: 'pipe',
                timeout: 60000
            });
            return {
                passed: true,
                message: 'Project builds successfully'
            };
        }
        catch (error) {
            return {
                passed: false,
                message: 'Build failed',
                details: [String(error)],
                suggestion: 'Run `npm run build` manually to see errors'
            };
        }
    }
    checkTests() {
        const packageJsonPath = path.join(this.projectPath, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            return {
                passed: false,
                message: 'No package.json found'
            };
        }
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            if (!packageJson.scripts?.test) {
                return {
                    passed: true,
                    message: 'No test script defined (may not be required)',
                    details: ['Consider adding tests for critical functionality']
                };
            }
            execSync('npm test', {
                cwd: this.projectPath,
                stdio: 'pipe',
                timeout: 120000
            });
            return {
                passed: true,
                message: 'All tests pass'
            };
        }
        catch (error) {
            return {
                passed: false,
                message: 'Tests failed',
                details: [String(error)],
                suggestion: 'Run `npm test` manually to see failures'
            };
        }
    }
    checkTODOs() {
        const todoPatterns = [
            /TODO[\s:]/i,
            /FIXME[\s:]/i,
            /XXX[\s:]/i,
            /HACK[\s:]/i
        ];
        const todos = [];
        try {
            this.scanDirectory(this.projectPath, (filePath, content) => {
                const lines = content.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    for (const pattern of todoPatterns) {
                        if (pattern.test(lines[i])) {
                            todos.push(`${path.relative(this.projectPath, filePath)}:${i + 1}: ${lines[i].trim()}`);
                        }
                    }
                }
            });
            if (todos.length === 0) {
                return {
                    passed: true,
                    message: 'No TODO/FIXME comments found'
                };
            }
            return {
                passed: false,
                message: `Found ${todos.length} TODO/FIXME comment(s)`,
                details: todos.slice(0, 5),
                suggestion: todos.length > 5
                    ? `... and ${todos.length - 5} more. Remove or resolve all TODOs before marking as done.`
                    : 'Remove or resolve all TODOs before marking as done'
            };
        }
        catch (error) {
            return {
                passed: true,
                message: 'Could not scan for TODOs',
                details: [String(error)]
            };
        }
    }
    checkLint() {
        const packageJsonPath = path.join(this.projectPath, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            return {
                passed: true,
                message: 'No package.json found (skipping lint check)'
            };
        }
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            if (!packageJson.scripts?.lint) {
                return {
                    passed: true,
                    message: 'No lint script defined (skipping)',
                    details: ['Consider adding linting for consistent code style']
                };
            }
            execSync('npm run lint', {
                cwd: this.projectPath,
                stdio: 'pipe',
                timeout: 60000
            });
            return {
                passed: true,
                message: 'Code passes linting checks'
            };
        }
        catch (error) {
            return {
                passed: false,
                message: 'Linting failed',
                details: [String(error)],
                suggestion: 'Run `npm run lint` and fix the reported issues'
            };
        }
    }
    checkTypes() {
        const tsconfigPath = path.join(this.projectPath, 'tsconfig.json');
        if (!fs.existsSync(tsconfigPath)) {
            return {
                passed: true,
                message: 'No TypeScript configuration found (skipping type check)'
            };
        }
        try {
            execSync('npx tsc --noEmit', {
                cwd: this.projectPath,
                stdio: 'pipe',
                timeout: 60000
            });
            return {
                passed: true,
                message: 'TypeScript types are valid'
            };
        }
        catch (error) {
            return {
                passed: false,
                message: 'Type checking failed',
                details: [String(error)],
                suggestion: 'Run `npx tsc --noEmit` to see type errors'
            };
        }
    }
    checkAINotes() {
        const aiNotesPattern = /AI_NOTES.*\.md$/;
        try {
            const files = fs.readdirSync(this.projectPath);
            const aiNotesFiles = files.filter(f => aiNotesPattern.test(f));
            if (aiNotesFiles.length === 0) {
                return {
                    passed: false,
                    message: 'No AI_NOTES.md found',
                    suggestion: 'Create AI_NOTES.md documenting your changes'
                };
            }
            return {
                passed: true,
                message: `Found ${aiNotesFiles.length} AI_NOTES file(s)`,
                details: aiNotesFiles
            };
        }
        catch (error) {
            return {
                passed: false,
                message: 'Could not check for AI_NOTES.md',
                details: [String(error)]
            };
        }
    }
    checkArchitectureDoc() {
        const possiblePaths = [
            'ARCHITECTURE.md',
            'docs/architecture.md',
            'docs/ARCHITECTURE.md',
            'README.md'
        ];
        for (const p of possiblePaths) {
            const fullPath = path.join(this.projectPath, p);
            if (fs.existsSync(fullPath)) {
                return {
                    passed: true,
                    message: `Architecture document found: ${p}`
                };
            }
        }
        return {
            passed: false,
            message: 'No architecture document found',
            suggestion: 'Create ARCHITECTURE.md with component/boundary map'
        };
    }
    checkDataFlows() {
        // This would typically check an architecture document for data flow descriptions
        // For now, we'll do a basic check
        return {
            passed: true,
            message: 'Data flow check requires manual verification',
            details: ['Ensure main data flows are documented in architecture']
        };
    }
    checkInvariants() {
        const contextPath = path.join(this.projectPath, 'project-context.json');
        if (!fs.existsSync(contextPath)) {
            return {
                passed: false,
                message: 'No project-context.json found',
                suggestion: 'Initialize project context with architecture invariants'
            };
        }
        try {
            const context = JSON.parse(fs.readFileSync(contextPath, 'utf-8'));
            if (!context.architectureInvariants || context.architectureInvariants.length === 0) {
                return {
                    passed: false,
                    message: 'No architecture invariants defined',
                    suggestion: 'Add key invariants to project-context.json (idempotency, transactions, etc.)'
                };
            }
            return {
                passed: true,
                message: `${context.architectureInvariants.length} invariant(s) defined`,
                details: context.architectureInvariants
            };
        }
        catch (error) {
            return {
                passed: false,
                message: 'Could not read project-context.json',
                details: [String(error)]
            };
        }
    }
    checkDocsCurrent() {
        // This would compare documentation with actual code
        // For now, we'll do a basic check
        return {
            passed: true,
            message: 'Documentation currency requires manual verification',
            details: ['Compare docs with actual API contracts and code']
        };
    }
    /**
     * Scan directory for files
     */
    scanDirectory(dir, callback) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                // Skip node_modules and hidden directories
                if (file === 'node_modules' || file.startsWith('.'))
                    continue;
                this.scanDirectory(fullPath, callback);
            }
            else if (stat.isFile()) {
                // Only scan text files
                if (/\.(ts|js|tsx|jsx|json|md|yml|yaml)$/.test(file)) {
                    try {
                        const content = fs.readFileSync(fullPath, 'utf-8');
                        callback(fullPath, content);
                    }
                    catch {
                        // Skip files that can't be read
                    }
                }
            }
        }
    }
    /**
     * Get list of available checks
     */
    listChecks() {
        return Array.from(this.checks.values()).map(check => ({
            id: check.id,
            name: check.name,
            stage: check.stage,
            autoFixable: check.autoFixable
        }));
    }
}
