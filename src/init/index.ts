/**
 * Project Auto-Init System
 * Analyzes project structure and generates context files for AI interactions
 * Inspired by OpenCode's /init command
 */

import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { defineEvent } from '../bus/index.js';

// ============ Type Definitions ============

export type ProjectType = 'nodejs' | 'python' | 'java' | 'rust' | 'go' | 'typescript' | 'unknown';
export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'pip' | 'poetry' | 'maven' | 'gradle' | 'cargo';

export interface ProjectStructure {
  hasTests: boolean;
  hasDocs: boolean;
  hasCI: boolean;
  sourceDir?: string;
  testDir?: string;
  entryPoint?: string;
}

export interface GitInfo {
  isRepo: boolean;
  remoteUrl?: string;
  branch?: string;
  hasUncommitted?: boolean;
}

export interface ProjectStats {
  totalFiles: number;
  codeFiles: number;
  testFiles: number;
  documentationFiles: number;
}

export interface ProjectAnalysis {
  projectPath: string;
  name: string;
  type: ProjectType;
  
  // Package info
  packageManager?: PackageManager;
  dependencies?: string[];
  devDependencies?: string[];
  
  // Structure
  structure: ProjectStructure;
  
  // Git info
  git?: GitInfo;
  
  // Framework detection
  frameworks?: string[];
  
  // File stats
  stats: ProjectStats;
  
  // Additional metadata
  description?: string;
  version?: string;
  scripts?: Record<string, string>;
}

export interface InitOptions {
  force?: boolean;           // Overwrite existing files
  skipGitIgnore?: boolean;   // Don't modify .gitignore
  interactive?: boolean;     // Ask questions during init
  contextOnly?: boolean;     // Only generate AI_CONTEXT.md
}

export interface InitResult {
  success: boolean;
  filesCreated: string[];
  filesModified: string[];
  analysis: ProjectAnalysis;
  contextFilePath?: string;
  configFilePath?: string;
  error?: string;
}

export interface ProjectConfig {
  version: string;
  project: {
    name: string;
    type: ProjectType;
  };
  permissions?: {
    allowedPaths?: string[];
    blockedPaths?: string[];
  };
  commands?: string[];
  skills?: string[];
}

// ============ Events ============

export const ProjectInitialized = defineEvent(
  "project.initialized",
  z.object({
    projectPath: z.string(),
    projectType: z.string(),
    filesCreated: z.array(z.string()),
    timestamp: z.number(),
  })
);

export const ProjectAnalyzed = defineEvent(
  "project.analyzed",
  z.object({
    projectPath: z.string(),
    projectType: z.string(),
    projectName: z.string(),
    timestamp: z.number(),
  })
);

// ============ Detection Functions ============

/**
 * Detect project type from project files
 */
export async function detectProjectType(projectPath: string): Promise<ProjectType> {
  const checks: Array<{ file: string; type: ProjectType }> = [
    { file: 'package.json', type: 'nodejs' },
    { file: 'tsconfig.json', type: 'typescript' },
    { file: 'Cargo.toml', type: 'rust' },
    { file: 'go.mod', type: 'go' },
    { file: 'pom.xml', type: 'java' },
    { file: 'build.gradle', type: 'java' },
    { file: 'build.gradle.kts', type: 'java' },
    { file: 'pyproject.toml', type: 'python' },
    { file: 'setup.py', type: 'python' },
    { file: 'requirements.txt', type: 'python' },
    { file: 'Pipfile', type: 'python' },
  ];

  // Check for TypeScript first (more specific)
  if (fs.existsSync(path.join(projectPath, 'tsconfig.json'))) {
    return 'typescript';
  }

  for (const check of checks) {
    if (fs.existsSync(path.join(projectPath, check.file))) {
      return check.type;
    }
  }

  // Check by file extensions
  try {
    const files = fs.readdirSync(projectPath, { recursive: true }) as string[];
    const extensions = new Map<string, number>();

    for (const file of files) {
      if (typeof file !== 'string') continue;
      if (file.includes('node_modules') || file.includes('.git')) continue;
      
      const ext = path.extname(file).toLowerCase();
      extensions.set(ext, (extensions.get(ext) || 0) + 1);
    }

    const extMap: Record<string, ProjectType> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'nodejs',
      '.jsx': 'nodejs',
      '.py': 'python',
      '.rs': 'rust',
      '.go': 'go',
      '.java': 'java',
    };

    let maxCount = 0;
    let detectedType: ProjectType = 'unknown';

    for (const [ext, count] of extensions) {
      if (extMap[ext] && count > maxCount) {
        maxCount = count;
        detectedType = extMap[ext];
      }
    }

    return detectedType;
  } catch {
    return 'unknown';
  }
}

/**
 * Detect package manager
 */
export async function detectPackageManager(projectPath: string): Promise<PackageManager | undefined> {
  const managerFiles: Array<{ file: string; manager: PackageManager }> = [
    { file: 'pnpm-lock.yaml', manager: 'pnpm' },
    { file: 'yarn.lock', manager: 'yarn' },
    { file: 'package-lock.json', manager: 'npm' },
    { file: 'Cargo.lock', manager: 'cargo' },
    { file: 'Cargo.toml', manager: 'cargo' },
    { file: 'poetry.lock', manager: 'poetry' },
    { file: 'pyproject.toml', manager: 'poetry' },
    { file: 'Pipfile.lock', manager: 'pip' },
    { file: 'requirements.txt', manager: 'pip' },
    { file: 'pom.xml', manager: 'maven' },
    { file: 'build.gradle', manager: 'gradle' },
    { file: 'build.gradle.kts', manager: 'gradle' },
  ];

  for (const check of managerFiles) {
    if (fs.existsSync(path.join(projectPath, check.file))) {
      return check.manager;
    }
  }

  return undefined;
}

/**
 * Detect frameworks used in the project
 */
export async function detectFrameworks(projectPath: string, type: ProjectType): Promise<string[]> {
  const frameworks: string[] = [];

  try {
    if (type === 'nodejs' || type === 'typescript') {
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };

        const frameworkMap: Record<string, string> = {
          'express': 'Express',
          'fastify': 'Fastify',
          'koa': 'Koa',
          'hono': 'Hono',
          'react': 'React',
          'vue': 'Vue',
          'angular': 'Angular',
          '@angular/core': 'Angular',
          'svelte': 'Svelte',
          'next': 'Next.js',
          'nuxt': 'Nuxt',
          'gatsby': 'Gatsby',
          'nest': 'NestJS',
          '@nestjs/core': 'NestJS',
          'jest': 'Jest',
          'vitest': 'Vitest',
          'mocha': 'Mocha',
          'playwright': 'Playwright',
          'cypress': 'Cypress',
          'prisma': 'Prisma',
          '@prisma/client': 'Prisma',
          'typeorm': 'TypeORM',
          'mongoose': 'Mongoose',
          'sequelize': 'Sequelize',
          'tailwindcss': 'Tailwind CSS',
          'redux': 'Redux',
          '@reduxjs/toolkit': 'Redux Toolkit',
          'mobx': 'MobX',
          'zustand': 'Zustand',
          'electron': 'Electron',
          'vite': 'Vite',
          'webpack': 'Webpack',
          'esbuild': 'esbuild',
          'graphql': 'GraphQL',
          'apollo-server': 'Apollo Server',
          '@apollo/client': 'Apollo Client',
          'socket.io': 'Socket.IO',
        };

        for (const [dep, name] of Object.entries(frameworkMap)) {
          if (allDeps[dep]) {
            frameworks.push(name);
          }
        }
      }
    } else if (type === 'python') {
      // Check pyproject.toml
      const pyprojectPath = path.join(projectPath, 'pyproject.toml');
      if (fs.existsSync(pyprojectPath)) {
        const content = fs.readFileSync(pyprojectPath, 'utf-8');
        const pythonFrameworks: Record<string, string> = {
          'django': 'Django',
          'flask': 'Flask',
          'fastapi': 'FastAPI',
          'pytest': 'Pytest',
          'pandas': 'Pandas',
          'numpy': 'NumPy',
          'tensorflow': 'TensorFlow',
          'pytorch': 'PyTorch',
          'sqlalchemy': 'SQLAlchemy',
          'celery': 'Celery',
        };

        for (const [dep, name] of Object.entries(pythonFrameworks)) {
          if (content.toLowerCase().includes(dep)) {
            frameworks.push(name);
          }
        }
      }

      // Check requirements.txt
      const requirementsPath = path.join(projectPath, 'requirements.txt');
      if (fs.existsSync(requirementsPath)) {
        const content = fs.readFileSync(requirementsPath, 'utf-8').toLowerCase();
        const pythonFrameworks: Record<string, string> = {
          'django': 'Django',
          'flask': 'Flask',
          'fastapi': 'FastAPI',
          'pytest': 'Pytest',
          'pandas': 'Pandas',
          'numpy': 'NumPy',
        };

        for (const [dep, name] of Object.entries(pythonFrameworks)) {
          if (content.includes(dep) && !frameworks.includes(name)) {
            frameworks.push(name);
          }
        }
      }
    } else if (type === 'rust') {
      const cargoPath = path.join(projectPath, 'Cargo.toml');
      if (fs.existsSync(cargoPath)) {
        const content = fs.readFileSync(cargoPath, 'utf-8').toLowerCase();
        const rustFrameworks: Record<string, string> = {
          'actix-web': 'Actix Web',
          'axum': 'Axum',
          'rocket': 'Rocket',
          'tokio': 'Tokio',
          'serde': 'Serde',
          'diesel': 'Diesel',
          'sqlx': 'SQLx',
          'warp': 'Warp',
        };

        for (const [dep, name] of Object.entries(rustFrameworks)) {
          if (content.includes(dep)) {
            frameworks.push(name);
          }
        }
      }
    } else if (type === 'go') {
      const goModPath = path.join(projectPath, 'go.mod');
      if (fs.existsSync(goModPath)) {
        const content = fs.readFileSync(goModPath, 'utf-8').toLowerCase();
        const goFrameworks: Record<string, string> = {
          'gin-gonic/gin': 'Gin',
          'labstack/echo': 'Echo',
          'gofiber/fiber': 'Fiber',
          'gorilla/mux': 'Gorilla Mux',
          'gorm.io/gorm': 'GORM',
        };

        for (const [dep, name] of Object.entries(goFrameworks)) {
          if (content.includes(dep)) {
            frameworks.push(name);
          }
        }
      }
    } else if (type === 'java') {
      const pomPath = path.join(projectPath, 'pom.xml');
      const gradlePath = path.join(projectPath, 'build.gradle');

      const checkContent = (content: string) => {
        const javaFrameworks: Record<string, string> = {
          'spring-boot': 'Spring Boot',
          'spring-framework': 'Spring Framework',
          'quarkus': 'Quarkus',
          'micronaut': 'Micronaut',
          'hibernate': 'Hibernate',
          'junit': 'JUnit',
          'mockito': 'Mockito',
        };

        for (const [dep, name] of Object.entries(javaFrameworks)) {
          if (content.toLowerCase().includes(dep) && !frameworks.includes(name)) {
            frameworks.push(name);
          }
        }
      };

      if (fs.existsSync(pomPath)) {
        checkContent(fs.readFileSync(pomPath, 'utf-8'));
      }
      if (fs.existsSync(gradlePath)) {
        checkContent(fs.readFileSync(gradlePath, 'utf-8'));
      }
    }
  } catch {
    // Ignore errors during framework detection
  }

  return [...new Set(frameworks)]; // Remove duplicates
}

/**
 * Detect project structure (tests, docs, CI, etc.)
 */
export async function detectStructure(projectPath: string): Promise<ProjectStructure> {
  const structure: ProjectStructure = {
    hasTests: false,
    hasDocs: false,
    hasCI: false,
  };

  try {
    const entries = fs.readdirSync(projectPath, { withFileTypes: true });
    const dirNames = entries.filter(e => e.isDirectory()).map(e => e.name);
    const fileNames = entries.filter(e => e.isFile()).map(e => e.name);

    // Detect test directory
    const testDirs = ['test', 'tests', '__tests__', 'spec', 'specs'];
    for (const testDir of testDirs) {
      if (dirNames.includes(testDir)) {
        structure.hasTests = true;
        structure.testDir = testDir;
        break;
      }
    }

    // Check for test files in src
    if (!structure.hasTests && dirNames.includes('src')) {
      try {
        const srcFiles = fs.readdirSync(path.join(projectPath, 'src'), { recursive: true }) as string[];
        if (srcFiles.some(f => typeof f === 'string' && (f.includes('.test.') || f.includes('.spec.')))) {
          structure.hasTests = true;
          structure.testDir = 'src';
        }
      } catch {
        // Ignore errors
      }
    }

    // Detect docs directory
    const docsDirs = ['docs', 'doc', 'documentation'];
    for (const docsDir of docsDirs) {
      if (dirNames.includes(docsDir)) {
        structure.hasDocs = true;
        break;
      }
    }

    // Check for README
    if (!structure.hasDocs) {
      structure.hasDocs = fileNames.some(f => f.toLowerCase().startsWith('readme'));
    }

    // Detect CI
    const ciIndicators = ['.github', '.gitlab-ci.yml', '.travis.yml', 'Jenkinsfile', '.circleci', 'azure-pipelines.yml'];
    for (const ci of ciIndicators) {
      if (dirNames.includes(ci) || fileNames.includes(ci)) {
        structure.hasCI = true;
        break;
      }
    }

    // Check .github/workflows
    if (!structure.hasCI && dirNames.includes('.github')) {
      const githubPath = path.join(projectPath, '.github', 'workflows');
      if (fs.existsSync(githubPath)) {
        structure.hasCI = true;
      }
    }

    // Detect source directory
    const srcDirs = ['src', 'lib', 'app', 'source'];
    for (const srcDir of srcDirs) {
      if (dirNames.includes(srcDir)) {
        structure.sourceDir = srcDir;
        break;
      }
    }

    // Detect entry point
    const entryPoints = [
      'src/index.ts', 'src/index.js', 'src/main.ts', 'src/main.js',
      'index.ts', 'index.js', 'main.ts', 'main.js',
      'src/app.ts', 'src/app.js', 'app.ts', 'app.js',
      'lib/index.ts', 'lib/index.js',
    ];

    for (const entry of entryPoints) {
      if (fs.existsSync(path.join(projectPath, entry))) {
        structure.entryPoint = entry;
        break;
      }
    }

    // Check package.json for main field
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath) && !structure.entryPoint) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        if (packageJson.main) {
          structure.entryPoint = packageJson.main;
        }
      } catch {
        // Ignore errors
      }
    }
  } catch {
    // Return defaults on error
  }

  return structure;
}

/**
 * Analyze git repository information
 */
export async function analyzeGit(projectPath: string): Promise<GitInfo | undefined> {
  const gitDir = path.join(projectPath, '.git');
  
  if (!fs.existsSync(gitDir)) {
    return undefined;
  }

  const gitInfo: GitInfo = {
    isRepo: true,
  };

  try {
    // Get current branch
    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', {
        cwd: projectPath,
        encoding: 'utf-8',
        timeout: 5000,
      }).trim();
      gitInfo.branch = branch;
    } catch {
      // Ignore error
    }

    // Get remote URL
    try {
      const remote = execSync('git remote get-url origin', {
        cwd: projectPath,
        encoding: 'utf-8',
        timeout: 5000,
      }).trim();
      gitInfo.remoteUrl = remote;
    } catch {
      // No remote configured
    }

    // Check for uncommitted changes
    try {
      const status = execSync('git status --porcelain', {
        cwd: projectPath,
        encoding: 'utf-8',
        timeout: 5000,
      }).trim();
      gitInfo.hasUncommitted = status.length > 0;
    } catch {
      // Ignore error
    }
  } catch {
    // Return basic info if git commands fail
  }

  return gitInfo;
}

/**
 * Count files by type
 */
async function countFiles(projectPath: string): Promise<ProjectStats> {
  const stats: ProjectStats = {
    totalFiles: 0,
    codeFiles: 0,
    testFiles: 0,
    documentationFiles: 0,
  };

  const codeExtensions = new Set([
    '.ts', '.tsx', '.js', '.jsx', '.py', '.rs', '.go', '.java',
    '.c', '.cpp', '.h', '.hpp', '.cs', '.rb', '.php', '.swift',
    '.kt', '.scala', '.vue', '.svelte',
  ]);

  const docExtensions = new Set(['.md', '.mdx', '.rst', '.txt', '.adoc']);

  try {
    const walkDir = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip common non-source directories
        if (entry.isDirectory()) {
          if (['node_modules', '.git', 'dist', 'build', 'target', '__pycache__', '.venv', 'venv'].includes(entry.name)) {
            continue;
          }
          walkDir(fullPath);
        } else if (entry.isFile()) {
          stats.totalFiles++;
          const ext = path.extname(entry.name).toLowerCase();

          if (codeExtensions.has(ext)) {
            stats.codeFiles++;
            
            // Check if it's a test file
            const name = entry.name.toLowerCase();
            if (name.includes('.test.') || name.includes('.spec.') || 
                name.includes('_test.') || name.includes('_spec.') ||
                name.startsWith('test_')) {
              stats.testFiles++;
            }
          } else if (docExtensions.has(ext)) {
            stats.documentationFiles++;
          }
        }
      }
    };

    walkDir(projectPath);
  } catch {
    // Return zeros on error
  }

  return stats;
}

/**
 * Extract project description from README or package files
 */
async function extractDescription(projectPath: string): Promise<string | undefined> {
  // Try package.json first
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if (packageJson.description) {
        return packageJson.description;
      }
    } catch {
      // Ignore errors
    }
  }

  // Try README
  const readmeNames = ['README.md', 'README.MD', 'readme.md', 'README', 'README.txt'];
  for (const readmeName of readmeNames) {
    const readmePath = path.join(projectPath, readmeName);
    if (fs.existsSync(readmePath)) {
      try {
        const content = fs.readFileSync(readmePath, 'utf-8');
        // Extract first paragraph after title
        const lines = content.split('\n');
        let foundTitle = false;
        let description = '';

        for (const line of lines) {
          if (line.startsWith('#')) {
            foundTitle = true;
            continue;
          }
          if (foundTitle && line.trim()) {
            // Skip badges
            if (line.includes('![') || line.includes('[![')) {
              continue;
            }
            description = line.trim();
            break;
          }
        }

        if (description) {
          return description.slice(0, 200); // Limit length
        }
      } catch {
        // Ignore errors
      }
    }
  }

  // Try Cargo.toml
  const cargoPath = path.join(projectPath, 'Cargo.toml');
  if (fs.existsSync(cargoPath)) {
    try {
      const content = fs.readFileSync(cargoPath, 'utf-8');
      const match = content.match(/description\s*=\s*"([^"]+)"/);
      if (match) {
        return match[1];
      }
    } catch {
      // Ignore errors
    }
  }

  // Try pyproject.toml
  const pyprojectPath = path.join(projectPath, 'pyproject.toml');
  if (fs.existsSync(pyprojectPath)) {
    try {
      const content = fs.readFileSync(pyprojectPath, 'utf-8');
      const match = content.match(/description\s*=\s*"([^"]+)"/);
      if (match) {
        return match[1];
      }
    } catch {
      // Ignore errors
    }
  }

  return undefined;
}

/**
 * Extract dependencies from project files
 */
async function extractDependencies(projectPath: string, type: ProjectType): Promise<{
  dependencies: string[];
  devDependencies: string[];
}> {
  const result = {
    dependencies: [] as string[],
    devDependencies: [] as string[],
  };

  try {
    if (type === 'nodejs' || type === 'typescript') {
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        result.dependencies = Object.keys(packageJson.dependencies || {});
        result.devDependencies = Object.keys(packageJson.devDependencies || {});
      }
    } else if (type === 'rust') {
      const cargoPath = path.join(projectPath, 'Cargo.toml');
      if (fs.existsSync(cargoPath)) {
        const content = fs.readFileSync(cargoPath, 'utf-8');
        const depsMatch = content.match(/\[dependencies\]([\s\S]*?)(?:\[|$)/);
        if (depsMatch) {
          const deps = depsMatch[1].match(/^(\w[\w-]*)\s*=/gm);
          if (deps) {
            result.dependencies = deps.map(d => d.replace(/\s*=/, ''));
          }
        }
        const devDepsMatch = content.match(/\[dev-dependencies\]([\s\S]*?)(?:\[|$)/);
        if (devDepsMatch) {
          const deps = devDepsMatch[1].match(/^(\w[\w-]*)\s*=/gm);
          if (deps) {
            result.devDependencies = deps.map(d => d.replace(/\s*=/, ''));
          }
        }
      }
    }
  } catch {
    // Return empty arrays on error
  }

  return result;
}

/**
 * Get project scripts/commands
 */
async function extractScripts(projectPath: string, type: ProjectType): Promise<Record<string, string>> {
  const scripts: Record<string, string> = {};

  try {
    if (type === 'nodejs' || type === 'typescript') {
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        return packageJson.scripts || {};
      }
    }
  } catch {
    // Return empty object on error
  }

  return scripts;
}

/**
 * Generate directory tree string
 */
function generateDirectoryTree(projectPath: string, maxDepth: number = 3): string {
  const ignoreDirs = new Set(['node_modules', '.git', 'dist', 'build', 'target', '__pycache__', '.venv', 'venv', 'coverage', '.next', '.nuxt']);
  const lines: string[] = [];

  const walk = (dir: string, prefix: string, depth: number) => {
    if (depth > maxDepth) return;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
        .filter(e => !e.name.startsWith('.') || ['.github', '.env.example'].includes(e.name))
        .filter(e => !ignoreDirs.has(e.name))
        .sort((a, b) => {
          // Directories first
          if (a.isDirectory() && !b.isDirectory()) return -1;
          if (!a.isDirectory() && b.isDirectory()) return 1;
          return a.name.localeCompare(b.name);
        });

      entries.forEach((entry, index) => {
        const isLast = index === entries.length - 1;
        const connector = isLast ? '\\u2514\\u2500\\u2500 ' : '\\u251C\\u2500\\u2500 ';
        const childPrefix = isLast ? '    ' : '\\u2502   ';

        if (entry.isDirectory()) {
          lines.push(`${prefix}${connector}${entry.name}/`);
          walk(path.join(dir, entry.name), prefix + childPrefix, depth + 1);
        } else {
          lines.push(`${prefix}${connector}${entry.name}`);
        }
      });
    } catch {
      // Ignore errors
    }
  };

  lines.push(path.basename(projectPath) + '/');
  walk(projectPath, '', 1);

  return lines.join('\n');
}

// ============ ProjectAnalyzer Class ============

export class ProjectAnalyzer {
  private projectPath: string;

  constructor(projectPath?: string) {
    this.projectPath = projectPath || process.cwd();
  }

  /**
   * Analyze project structure
   */
  async analyze(projectPath?: string): Promise<ProjectAnalysis> {
    const targetPath = projectPath || this.projectPath;
    const absolutePath = path.resolve(targetPath);

    // Detect project type
    const type = await detectProjectType(absolutePath);
    
    // Detect package manager
    const packageManager = await detectPackageManager(absolutePath);
    
    // Detect frameworks
    const frameworks = await detectFrameworks(absolutePath, type);
    
    // Detect structure
    const structure = await detectStructure(absolutePath);
    
    // Analyze git
    const git = await analyzeGit(absolutePath);
    
    // Count files
    const stats = await countFiles(absolutePath);
    
    // Extract dependencies
    const { dependencies, devDependencies } = await extractDependencies(absolutePath, type);
    
    // Extract description
    const description = await extractDescription(absolutePath);
    
    // Extract scripts
    const scripts = await extractScripts(absolutePath, type);

    // Get project name
    let name = path.basename(absolutePath);
    const packageJsonPath = path.join(absolutePath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        name = packageJson.name || name;
      } catch {
        // Use directory name
      }
    }

    // Get version
    let version: string | undefined;
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        version = packageJson.version;
      } catch {
        // Ignore
      }
    }

    const analysis: ProjectAnalysis = {
      projectPath: absolutePath,
      name,
      type,
      packageManager,
      dependencies,
      devDependencies,
      structure,
      git,
      frameworks,
      stats,
      description,
      version,
      scripts,
    };

    // Publish event
    ProjectAnalyzed.publish({
      projectPath: absolutePath,
      projectType: type,
      projectName: name,
      timestamp: Date.now(),
    });

    return analysis;
  }

  /**
   * Generate AI_CONTEXT.md file
   */
  async generateContextFile(analysis: ProjectAnalysis, outputPath?: string): Promise<string> {
    const contextPath = outputPath || path.join(analysis.projectPath, 'AI_CONTEXT.md');
    
    const typeDisplay: Record<ProjectType, string> = {
      nodejs: 'Node.js (JavaScript)',
      typescript: 'TypeScript',
      python: 'Python',
      java: 'Java',
      rust: 'Rust',
      go: 'Go',
      unknown: 'Unknown',
    };

    const managerCommands: Record<string, { install: string; build: string; test: string; start: string }> = {
      npm: { install: 'npm install', build: 'npm run build', test: 'npm test', start: 'npm start' },
      yarn: { install: 'yarn install', build: 'yarn build', test: 'yarn test', start: 'yarn start' },
      pnpm: { install: 'pnpm install', build: 'pnpm build', test: 'pnpm test', start: 'pnpm start' },
      pip: { install: 'pip install -r requirements.txt', build: 'python setup.py build', test: 'pytest', start: 'python main.py' },
      poetry: { install: 'poetry install', build: 'poetry build', test: 'poetry run pytest', start: 'poetry run python main.py' },
      cargo: { install: 'cargo build', build: 'cargo build --release', test: 'cargo test', start: 'cargo run' },
      maven: { install: 'mvn install', build: 'mvn package', test: 'mvn test', start: 'mvn exec:java' },
      gradle: { install: 'gradle build', build: 'gradle build', test: 'gradle test', start: 'gradle run' },
    };

    const commands = analysis.packageManager ? managerCommands[analysis.packageManager] : undefined;

    // Generate directory tree
    const directoryTree = generateDirectoryTree(analysis.projectPath);

    // Find config files
    const configFiles: string[] = [];
    const configPatterns = [
      'tsconfig.json', 'package.json', 'Cargo.toml', 'go.mod', 'pom.xml',
      'build.gradle', 'pyproject.toml', '.eslintrc', '.prettierrc',
      'vite.config.ts', 'vite.config.js', 'webpack.config.js',
      'jest.config.js', 'vitest.config.ts', '.env.example',
    ];

    for (const config of configPatterns) {
      if (fs.existsSync(path.join(analysis.projectPath, config))) {
        configFiles.push(config);
      }
    }

    // Build content
    const sections: string[] = [];

    sections.push(`# Project: ${analysis.name}`);
    sections.push('');

    // Overview
    sections.push('## Overview');
    if (analysis.description) {
      sections.push(analysis.description);
    } else {
      sections.push(`A ${typeDisplay[analysis.type]} project${analysis.frameworks?.length ? ` using ${analysis.frameworks.slice(0, 3).join(', ')}` : ''}.`);
    }
    if (analysis.version) {
      sections.push(`\n**Version:** ${analysis.version}`);
    }
    sections.push('');

    // Technology Stack
    sections.push('## Technology Stack');
    sections.push(`- **Language:** ${typeDisplay[analysis.type]}`);
    if (analysis.packageManager) {
      sections.push(`- **Package Manager:** ${analysis.packageManager}`);
    }
    if (analysis.frameworks && analysis.frameworks.length > 0) {
      sections.push(`- **Frameworks:** ${analysis.frameworks.join(', ')}`);
    }
    sections.push('');

    // Project Structure
    sections.push('## Project Structure');
    sections.push('```');
    sections.push(directoryTree);
    sections.push('```');
    sections.push('');

    // Key Files
    sections.push('## Key Files');
    if (analysis.structure.entryPoint) {
      sections.push(`- **Entry Point:** \`${analysis.structure.entryPoint}\``);
    }
    if (analysis.structure.sourceDir) {
      sections.push(`- **Source Directory:** \`${analysis.structure.sourceDir}/\``);
    }
    if (analysis.structure.testDir) {
      sections.push(`- **Tests:** \`${analysis.structure.testDir}/\``);
    }
    if (configFiles.length > 0) {
      sections.push(`- **Configuration:** ${configFiles.map(f => `\`${f}\``).join(', ')}`);
    }
    sections.push('');

    // Development Commands
    if (commands || (analysis.scripts && Object.keys(analysis.scripts).length > 0)) {
      sections.push('## Development Commands');
      
      if (analysis.scripts && Object.keys(analysis.scripts).length > 0) {
        // Use actual scripts from package.json
        const scriptDisplay: Record<string, string> = {
          dev: 'Development',
          start: 'Start',
          build: 'Build',
          test: 'Test',
          lint: 'Lint',
          format: 'Format',
        };

        for (const [key, label] of Object.entries(scriptDisplay)) {
          if (analysis.scripts[key]) {
            const pm = analysis.packageManager || 'npm';
            sections.push(`- **${label}:** \`${pm} run ${key}\``);
          }
        }
      } else if (commands) {
        sections.push(`- **Install:** \`${commands.install}\``);
        sections.push(`- **Build:** \`${commands.build}\``);
        sections.push(`- **Test:** \`${commands.test}\``);
        sections.push(`- **Start:** \`${commands.start}\``);
      }
      sections.push('');
    }

    // Dependencies
    if (analysis.dependencies && analysis.dependencies.length > 0) {
      sections.push('## Key Dependencies');
      const topDeps = analysis.dependencies.slice(0, 10);
      for (const dep of topDeps) {
        sections.push(`- ${dep}`);
      }
      if (analysis.dependencies.length > 10) {
        sections.push(`- ... and ${analysis.dependencies.length - 10} more`);
      }
      sections.push('');
    }

    // Git Info
    if (analysis.git?.isRepo) {
      sections.push('## Git Information');
      if (analysis.git.branch) {
        sections.push(`- **Current Branch:** ${analysis.git.branch}`);
      }
      if (analysis.git.remoteUrl) {
        sections.push(`- **Remote:** ${analysis.git.remoteUrl}`);
      }
      sections.push('');
    }

    // File Statistics
    sections.push('## File Statistics');
    sections.push(`- **Total Files:** ${analysis.stats.totalFiles}`);
    sections.push(`- **Code Files:** ${analysis.stats.codeFiles}`);
    sections.push(`- **Test Files:** ${analysis.stats.testFiles}`);
    sections.push(`- **Documentation Files:** ${analysis.stats.documentationFiles}`);
    sections.push('');

    // AI Instructions
    sections.push('## AI Instructions');
    sections.push('When working with this project:');
    sections.push('');
    sections.push('1. **Code Style:** Follow existing patterns and conventions in the codebase');
    sections.push('2. **Testing:** Write tests for new functionality when applicable');
    sections.push('3. **Documentation:** Update documentation when making significant changes');
    if (analysis.structure.hasCI) {
      sections.push('4. **CI/CD:** Ensure changes pass all CI checks before merging');
    }
    if (analysis.type === 'typescript') {
      sections.push('5. **Types:** Maintain strict TypeScript types, avoid `any`');
    }
    sections.push('');

    // Context Notes
    sections.push('## Context Notes');
    sections.push('<!-- Add custom notes about the project here -->');
    sections.push('');
    sections.push('');

    // Write file
    const content = sections.join('\n');
    fs.writeFileSync(contextPath, content, 'utf-8');

    return contextPath;
  }

  /**
   * Generate .alexi/config.json
   */
  async generateConfig(analysis: ProjectAnalysis): Promise<ProjectConfig> {
    const config: ProjectConfig = {
      version: '1.0.0',
      project: {
        name: analysis.name,
        type: analysis.type,
      },
      permissions: {
        allowedPaths: [analysis.structure.sourceDir || 'src', analysis.structure.testDir || 'tests'].filter(Boolean),
        blockedPaths: ['node_modules', '.git', 'dist', 'build', '.env'],
      },
      commands: [],
      skills: [],
    };

    return config;
  }

  /**
   * Full initialization
   */
  async init(projectPath?: string, options: InitOptions = {}): Promise<InitResult> {
    const targetPath = projectPath || this.projectPath;
    const absolutePath = path.resolve(targetPath);

    const result: InitResult = {
      success: false,
      filesCreated: [],
      filesModified: [],
      analysis: {} as ProjectAnalysis,
    };

    try {
      // Run analysis
      const analysis = await this.analyze(absolutePath);
      result.analysis = analysis;

      // Check for existing files
      const contextFilePath = path.join(absolutePath, 'AI_CONTEXT.md');
      const configDir = path.join(absolutePath, '.alexi');
      const configFilePath = path.join(configDir, 'config.json');

      if (fs.existsSync(contextFilePath) && !options.force) {
        if (!options.contextOnly) {
          result.error = 'AI_CONTEXT.md already exists. Use --force to overwrite.';
          return result;
        }
      }

      // Generate AI_CONTEXT.md
      await this.generateContextFile(analysis, contextFilePath);
      result.filesCreated.push(contextFilePath);
      result.contextFilePath = contextFilePath;

      // Generate config if not contextOnly
      if (!options.contextOnly) {
        // Create .alexi directory if needed
        if (!fs.existsSync(configDir)) {
          fs.mkdirSync(configDir, { recursive: true });
        }

        // Generate config
        const config = await this.generateConfig(analysis);
        
        if (!fs.existsSync(configFilePath) || options.force) {
          fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf-8');
          result.filesCreated.push(configFilePath);
          result.configFilePath = configFilePath;
        }

        // Update .gitignore if needed
        if (!options.skipGitIgnore) {
          const gitignorePath = path.join(absolutePath, '.gitignore');
          const entriesToAdd = ['.alexi/', 'AI_CONTEXT.md'];
          
          if (fs.existsSync(gitignorePath)) {
            const content = fs.readFileSync(gitignorePath, 'utf-8');
            const linesToAdd: string[] = [];
            
            for (const entry of entriesToAdd) {
              if (!content.includes(entry)) {
                linesToAdd.push(entry);
              }
            }
            
            if (linesToAdd.length > 0) {
              const newContent = content.trimEnd() + '\n\n# Alexi\n' + linesToAdd.join('\n') + '\n';
              fs.writeFileSync(gitignorePath, newContent, 'utf-8');
              result.filesModified.push(gitignorePath);
            }
          } else {
            // Create .gitignore
            const content = '# Alexi\n' + entriesToAdd.join('\n') + '\n';
            fs.writeFileSync(gitignorePath, content, 'utf-8');
            result.filesCreated.push(gitignorePath);
          }
        }
      }

      result.success = true;

      // Publish event
      ProjectInitialized.publish({
        projectPath: absolutePath,
        projectType: analysis.type,
        filesCreated: result.filesCreated,
        timestamp: Date.now(),
      });

    } catch (error) {
      result.success = false;
      result.error = error instanceof Error ? error.message : String(error);
    }

    return result;
  }
}

// ============ Global Functions ============

let globalAnalyzer: ProjectAnalyzer | null = null;

/**
 * Get the global project analyzer
 */
export function getProjectAnalyzer(): ProjectAnalyzer {
  if (!globalAnalyzer) {
    globalAnalyzer = new ProjectAnalyzer();
  }
  return globalAnalyzer;
}

/**
 * Reset the global project analyzer
 */
export function resetProjectAnalyzer(): void {
  globalAnalyzer = null;
}

/**
 * Analyze a project
 */
export async function analyzeProject(projectPath?: string): Promise<ProjectAnalysis> {
  return getProjectAnalyzer().analyze(projectPath);
}

/**
 * Initialize a project
 */
export async function initProject(projectPath?: string, options?: InitOptions): Promise<InitResult> {
  return getProjectAnalyzer().init(projectPath, options);
}

// ============ CLI Helper ============

/**
 * Format analysis result for CLI output
 */
export function formatAnalysisForCLI(analysis: ProjectAnalysis): string {
  const lines: string[] = [];

  lines.push(`Project: ${analysis.name}`);
  lines.push(`Type: ${analysis.type}`);
  
  if (analysis.packageManager) {
    lines.push(`Package Manager: ${analysis.packageManager}`);
  }
  
  if (analysis.frameworks && analysis.frameworks.length > 0) {
    lines.push(`Frameworks: ${analysis.frameworks.join(', ')}`);
  }
  
  lines.push('');
  lines.push('Structure:');
  lines.push(`  Source: ${analysis.structure.sourceDir || 'N/A'}`);
  lines.push(`  Tests: ${analysis.structure.testDir || 'N/A'}`);
  lines.push(`  Entry: ${analysis.structure.entryPoint || 'N/A'}`);
  lines.push(`  Has CI: ${analysis.structure.hasCI ? 'Yes' : 'No'}`);
  lines.push(`  Has Docs: ${analysis.structure.hasDocs ? 'Yes' : 'No'}`);
  
  lines.push('');
  lines.push('Stats:');
  lines.push(`  Total Files: ${analysis.stats.totalFiles}`);
  lines.push(`  Code Files: ${analysis.stats.codeFiles}`);
  lines.push(`  Test Files: ${analysis.stats.testFiles}`);
  lines.push(`  Doc Files: ${analysis.stats.documentationFiles}`);

  if (analysis.git?.isRepo) {
    lines.push('');
    lines.push('Git:');
    lines.push(`  Branch: ${analysis.git.branch || 'N/A'}`);
    lines.push(`  Remote: ${analysis.git.remoteUrl || 'N/A'}`);
    lines.push(`  Uncommitted: ${analysis.git.hasUncommitted ? 'Yes' : 'No'}`);
  }

  return lines.join('\n');
}

/**
 * Format init result for CLI output
 */
export function formatInitResultForCLI(result: InitResult): string {
  const lines: string[] = [];

  if (result.success) {
    lines.push('Project initialized successfully!');
    lines.push('');
    
    if (result.filesCreated.length > 0) {
      lines.push('Files created:');
      for (const file of result.filesCreated) {
        lines.push(`  + ${path.relative(result.analysis.projectPath, file)}`);
      }
    }
    
    if (result.filesModified.length > 0) {
      lines.push('');
      lines.push('Files modified:');
      for (const file of result.filesModified) {
        lines.push(`  ~ ${path.relative(result.analysis.projectPath, file)}`);
      }
    }
    
    lines.push('');
    lines.push(`Project type: ${result.analysis.type}`);
    if (result.analysis.frameworks && result.analysis.frameworks.length > 0) {
      lines.push(`Frameworks detected: ${result.analysis.frameworks.join(', ')}`);
    }
  } else {
    lines.push('Project initialization failed!');
    if (result.error) {
      lines.push(`Error: ${result.error}`);
    }
  }

  return lines.join('\n');
}
