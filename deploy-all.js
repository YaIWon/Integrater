#!/usr/bin/env node

// ============================================
// UNIVERSAL INTEGRATOR PRO - DEPLOY ALL
// THE MOST ADVANCED DEPLOYMENT SYSTEM
// Complete with GitHub Pages, Codespaces, Docker, and more
// ============================================

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// COLORS & STYLING
// ============================================
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
};

const symbols = {
    check: '✅',
    cross: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    star: '⭐',
    rocket: '🚀',
    gear: '⚙️',
    folder: '📁',
    file: '📄',
    code: '💻',
    cloud: '☁️',
    docker: '🐳',
    git: '🐙',
    package: '📦',
    test: '🧪',
    build: '🔨',
    deploy: '🚀',
    success: '🎉',
    error: '💥',
    waiting: '⏳',
    done: '✅',
};

function log(message, color = 'white', symbol = '') {
    console.log(`${symbol ? symbol + ' ' : ''}${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
    console.log(`\n${colors.cyan}${symbols.gear} Step ${step}${colors.reset}`);
    console.log(`   ${colors.dim}${message}${colors.reset}`);
}

function logSuccess(message) {
    console.log(`${colors.green}${symbols.check} ${message}${colors.reset}`);
}

function logError(message) {
    console.log(`${colors.red}${symbols.cross} ${message}${colors.reset}`);
}

function logWarning(message) {
    console.log(`${colors.yellow}${symbols.warning} ${message}${colors.reset}`);
}

function logInfo(message) {
    console.log(`${colors.blue}${symbols.info} ${message}${colors.reset}`);
}

function logHeader(message) {
    console.log(`\n${colors.bright}${colors.magenta}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.bright}${colors.magenta}${message}${colors.reset}`);
    console.log(`${colors.bright}${colors.magenta}${'='.repeat(60)}${colors.reset}`);
}

function logSubHeader(message) {
    console.log(`\n${colors.cyan}${'─'.repeat(50)}${colors.reset}`);
    console.log(`${colors.cyan}${message}${colors.reset}`);
    console.log(`${colors.cyan}${'─'.repeat(50)}${colors.reset}`);
}

// ============================================
// PROGRESS BAR
// ============================================
function createProgressBar(total, current, label = '') {
    const width = 40;
    const percent = Math.min(100, Math.round((current / total) * 100));
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `${label} [${bar}] ${percent}%`;
}

// ============================================
// ASYNC COMMAND EXECUTION
// ============================================
function execCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn(command, { shell: true, stdio: 'pipe', ...options });
        let stdout = '';
        let stderr = '';

        proc.stdout.on('data', (data) => {
            stdout += data.toString();
            if (options.verbose) process.stdout.write(data);
        });

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
            if (options.verbose) process.stderr.write(data);
        });

        proc.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout, stderr, code });
            } else {
                reject({ stdout, stderr, code, message: `Command failed with code ${code}` });
            }
        });

        proc.on('error', (err) => {
            reject({ message: err.message, code: -1 });
        });
    });
}

function execCommandSync(command, options = {}) {
    try {
        const result = execSync(command, {
            encoding: 'utf8',
            stdio: options.silent ? 'pipe' : 'inherit',
            ...options
        });
        return { success: true, output: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// FILE UTILITIES
// ============================================
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch {
        return false;
    }
}

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch {
        return null;
    }
}

function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    } catch {
        return false;
    }
}

function copyFile(src, dest) {
    try {
        fs.copyFileSync(src, dest);
        return true;
    } catch {
        return false;
    }
}

function copyDirectory(src, dest) {
    try {
        fs.cpSync(src, dest, { recursive: true, force: true });
        return true;
    } catch {
        return false;
    }
}

function ensureDirectory(dirPath) {
    try {
        fs.mkdirSync(dirPath, { recursive: true });
        return true;
    } catch {
        return false;
    }
}

function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch {
        return 0;
    }
}

function getDirectorySize(dirPath) {
    let size = 0;
    try {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                size += getDirectorySize(filePath);
            } else {
                size += stats.size;
            }
        }
    } catch {
        // Ignore
    }
    return size;
}

function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function countFiles(dirPath) {
    let count = 0;
    try {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                count += countFiles(filePath);
            } else {
                count++;
            }
        }
    } catch {
        // Ignore
    }
    return count;
}

// ============================================
// GIT UTILITIES
// ============================================
function getGitInfo() {
    const info = {
        username: null,
        repo: null,
        url: null,
        pagesUrl: null,
        branch: null,
        remote: null,
    };

    try {
        const remote = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
        info.remote = remote;
        
        const match = remote.match(/github\.com[:\/]([^\/]+)\/([^\/\.]+)(?:\.git)?/);
        if (match) {
            info.username = match[1];
            info.repo = match[2];
            info.url = `https://github.com/${info.username}/${info.repo}`;
            info.pagesUrl = `https://${info.username}.github.io/${info.repo}/`;
        }
    } catch {
        // No git remote
    }

    try {
        info.branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    } catch {
        info.branch = 'main';
    }

    return info;
}

function isGitRepo() {
    return fileExists(path.join(__dirname, '.git'));
}

// ============================================
// DEPLOYMENT CONFIGURATION
// ============================================
const config = {
    build: {
        sourceDir: path.join(__dirname),
        outputDir: path.join(__dirname, 'dist'),
        entryFile: path.join(__dirname, 'index.html'),
        webpackConfig: path.join(__dirname, 'webpack.config.js'),
    },
    deploy: {
        pages: {
            enabled: true,
            branch: 'gh-pages',
            sourceDir: path.join(__dirname, 'dist'),
        },
        docker: {
            enabled: true,
            image: 'universal-integrator',
            tag: 'latest',
        },
        netlify: {
            enabled: false,
            site: null,
        },
        vercel: {
            enabled: false,
            project: null,
        },
    },
    env: {
        node: '>=16.0.0',
        npm: '>=8.0.0',
    },
};

// ============================================
// DEPLOYMENT FUNCTIONS
// ============================================

async function checkPrerequisites() {
    logStep('1/11', 'Checking prerequisites...');
    
    const results = {
        node: false,
        npm: false,
        git: false,
        docker: false,
        webpack: false,
    };

    try {
        const version = execSync('node --version', { encoding: 'utf8' }).trim();
        log(`   ${colors.green}✅ Node.js: ${version}${colors.reset}`);
        results.node = true;
    } catch {
        log(`   ${colors.red}❌ Node.js not found${colors.reset}`);
        results.node = false;
    }

    try {
        const version = execSync('npm --version', { encoding: 'utf8' }).trim();
        log(`   ${colors.green}✅ npm: ${version}${colors.reset}`);
        results.npm = true;
    } catch {
        log(`   ${colors.red}❌ npm not found${colors.reset}`);
        results.npm = false;
    }

    try {
        const version = execSync('git --version', { encoding: 'utf8' }).trim();
        log(`   ${colors.green}✅ Git: ${version}${colors.reset}`);
        results.git = true;
    } catch {
        log(`   ${colors.yellow}⚠️ Git not found${colors.reset}`);
        results.git = false;
    }

    try {
        const version = execSync('docker --version', { encoding: 'utf8' }).trim();
        log(`   ${colors.green}✅ Docker: ${version}${colors.reset}`);
        results.docker = true;
    } catch {
        log(`   ${colors.yellow}⚠️ Docker not found (optional)${colors.reset}`);
        results.docker = false;
    }

    try {
        const version = execSync('npx webpack --version', { encoding: 'utf8' }).trim();
        log(`   ${colors.green}✅ Webpack: ${version}${colors.reset}`);
        results.webpack = true;
    } catch {
        log(`   ${colors.yellow}⚠️ Webpack not found (will install)${colors.reset}`);
        results.webpack = false;
    }

    return results;
}

async function installDependencies() {
    logStep('2/11', 'Installing dependencies...');
    
    logInfo('Running npm install...');
    
    try {
        await execCommand('npm install', { verbose: true });
        logSuccess('Dependencies installed successfully');
        return true;
    } catch (error) {
        logError(`Failed to install dependencies: ${error.message}`);
        return false;
    }
}

async function runTests() {
    logStep('3/11', 'Running tests...');
    
    const pkg = JSON.parse(readFile(path.join(__dirname, 'package.json')) || '{}');
    if (!pkg.scripts || !pkg.scripts.test) {
        logWarning('No test script found, skipping tests');
        return true;
    }

    logInfo('Running tests...');
    
    try {
        await execCommand('npm test -- --passWithNoTests', { verbose: true });
        logSuccess('Tests passed');
        return true;
    } catch (error) {
        logWarning('Tests failed - continuing anyway');
        return false;
    }
}

async function runLinting() {
    logStep('4/11', 'Running linting...');
    
    const pkg = JSON.parse(readFile(path.join(__dirname, 'package.json')) || '{}');
    if (!pkg.scripts || !pkg.scripts.lint) {
        logWarning('No lint script found, skipping linting');
        return true;
    }

    logInfo('Running linter...');
    
    try {
        await execCommand('npm run lint', { verbose: true });
        logSuccess('Linting passed');
        return true;
    } catch (error) {
        logWarning('Linting failed - continuing anyway');
        return false;
    }
}

async function buildProject() {
    logStep('5/11', 'Building project...');
    
    logInfo('Running build...');
    
    try {
        await execCommand('npm run build', { verbose: true });
        logSuccess('Build completed');
        return true;
    } catch (error) {
        logError(`Build failed: ${error.message}`);
        return false;
    }
}

async function buildHub() {
    logStep('5.5/11', 'Building Hub...');
    
    logInfo('Running hub build...');
    
    try {
        if (!fileExists(path.join(__dirname, 'hub.js'))) {
            logWarning('hub.js not found, skipping hub build');
            return true;
        }
        
        await execCommand('npm run hub:build', { verbose: true });
        logSuccess('Hub built successfully');
        return true;
    } catch (error) {
        logWarning(`Hub build failed: ${error.message}`);
        return false;
    }
}

async function startHubWatcher() {
    logStep('5.6/11', 'Starting Hub Watcher...');
    
    try {
        if (!fileExists(path.join(__dirname, 'hub-watcher.js'))) {
            logWarning('hub-watcher.js not found, skipping');
            return true;
        }
        
        try {
            await execCommand('npm list chokidar', { silent: true });
        } catch {
            logInfo('Installing chokidar...');
            await execCommand('npm install chokidar --save', { verbose: true });
        }
        
        logSuccess('Hub watcher ready');
        return true;
    } catch (error) {
        logWarning(`Hub watcher setup failed: ${error.message}`);
        return false;
    }
}

async function checkBuildOutput() {
    logStep('6/11', 'Checking build output...');
    
    const distPath = config.build.outputDir;
    
    if (!fileExists(distPath)) {
        logError('dist directory not found!');
        return false;
    }

    const files = fs.readdirSync(distPath);
    const fileCount = countFiles(distPath);
    const size = getDirectorySize(distPath);
    
    log(`   ${colors.green}✅ Found ${fileCount} files${colors.reset}`);
    log(`   ${colors.green}✅ Total size: ${formatSize(size)}${colors.reset}`);
    
    const indexPath = path.join(distPath, 'index.html');
    if (!fileExists(indexPath)) {
        logWarning('index.html not found in dist');
    } else {
        log(`   ${colors.green}✅ index.html found${colors.reset}`);
    }

    if (files.length > 0 && files.length <= 20) {
        logSubHeader('Files in dist:');
        for (const file of files) {
            const filePath = path.join(distPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                log(`   📁 ${file}/`, 'dim');
            } else {
                log(`   📄 ${file} (${formatSize(stats.size)})`, 'dim');
            }
        }
    }

    return true;
}

async function createDeploymentFiles() {
    logStep('7/11', 'Creating deployment files...');
    
    const distPath = config.build.outputDir;
    
    const nojekyllPath = path.join(distPath, '.nojekyll');
    writeFile(nojekyllPath, '');
    log('   ✅ Created .nojekyll', 'green');

    const _404Path = path.join(distPath, '404.html');
    if (!fileExists(_404Path)) {
        writeFile(_404Path, get404Template());
        log('   ✅ Created 404.html', 'green');
    }

    const gitignorePath = path.join(distPath, '.gitignore');
    if (!fileExists(gitignorePath)) {
        writeFile(gitignorePath, '# Ignore everything\n*\n!.gitignore\n!.nojekyll\n!index.html\n!404.html\n!*.css\n!*.js\n!*.woff2\n!*.png\n!*.jpg\n!*.svg\n!*.json');
        log('   ✅ Created .gitignore', 'green');
    }

    const deployScripts = [
        { src: 'deploy.sh', dest: path.join(distPath, 'deploy.sh') },
        { src: 'deploy-all.js', dest: path.join(distPath, 'deploy-all.js') },
    ];

    for (const script of deployScripts) {
        if (fileExists(script.src)) {
            copyFile(script.src, script.dest);
            log(`   ✅ Copied ${script.src}`, 'green');
        }
    }

    const configFiles = [
        { src: 'package.json', dest: path.join(distPath, 'package.json') },
        { src: 'server.js', dest: path.join(distPath, 'server.js') },
        { src: '.env.example', dest: path.join(distPath, '.env.example') },
    ];

    for (const file of configFiles) {
        if (fileExists(file.src)) {
            copyFile(file.src, file.dest);
            log(`   ✅ Copied ${file.src}`, 'green');
        }
    }

    const assetDirs = ['css', 'js', 'images', 'fonts', 'data'];
    for (const dir of assetDirs) {
        const srcDir = path.join(__dirname, dir);
        const destDir = path.join(distPath, dir);
        if (fileExists(srcDir)) {
            copyDirectory(srcDir, destDir);
            log(`   ✅ Copied ${dir}/`, 'green');
        }
    }

    logSuccess('Deployment files created');
    return true;
}

async function deployToGitHubPages() {
    logStep('8/11', 'Deploying to GitHub Pages...');
    
    const distPath = config.build.outputDir;
    
    try {
        await execCommand('gh-pages --version', { silent: true });
    } catch {
        logWarning('gh-pages not found, installing...');
        try {
            await execCommand('npm install -g gh-pages', { verbose: true });
        } catch {
            logWarning('Could not install gh-pages globally, trying local...');
            try {
                await execCommand('npm install --save-dev gh-pages', { verbose: true });
            } catch {
                logError('Could not install gh-pages');
                return false;
            }
        }
    }

    const gitInfo = getGitInfo();
    if (!gitInfo.username || !gitInfo.repo) {
        logError('Could not determine GitHub repository info');
        return false;
    }

    logInfo(`Deploying to ${gitInfo.pagesUrl}`);

    try {
        await execCommand(`gh-pages -d ${distPath} --no-history`, { verbose: true });
        logSuccess(`Deployed to GitHub Pages: ${gitInfo.pagesUrl}`);
        return true;
    } catch (error) {
        logError(`Failed to deploy to GitHub Pages: ${error.message}`);
        return false;
    }
}

async function deployToDocker() {
    logStep('9/11', 'Building Docker image...');
    
    try {
        await execCommand('docker --version', { silent: true });
    } catch {
        logWarning('Docker not found, skipping Docker deployment');
        return true;
    }

    if (!fileExists(path.join(__dirname, 'Dockerfile'))) {
        logWarning('Dockerfile not found, creating one...');
        writeFile(path.join(__dirname, 'Dockerfile'), getDockerfileTemplate());
    }

    const imageName = config.deploy.docker.image;
    const tag = config.deploy.docker.tag;

    logInfo(`Building Docker image: ${imageName}:${tag}`);

    try {
        await execCommand(`docker build -t ${imageName}:${tag} .`, { verbose: true });
        logSuccess('Docker image built successfully');
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const answer = await new Promise((resolve) => {
            rl.question('\n   Run Docker container now? (y/N): ', resolve);
        });
        rl.close();

        if (answer.toLowerCase() === 'y') {
            logInfo('Running Docker container...');
            try {
                await execCommand(`docker run -d -p 3000:3000 --name universal-integrator ${imageName}:${tag}`, { verbose: true });
                logSuccess('Docker container running on http://localhost:3000');
            } catch (error) {
                logError(`Failed to run Docker container: ${error.message}`);
            }
        }

        return true;
    } catch (error) {
        logError(`Docker build failed: ${error.message}`);
        return false;
    }
}

async function deployToCodespaces() {
    logStep('10/11', 'Setting up Codespaces...');
    
    const devcontainerPath = path.join(__dirname, '.devcontainer');
    const devcontainerJson = path.join(devcontainerPath, 'devcontainer.json');

    if (!fileExists(devcontainerPath)) {
        logInfo('Creating .devcontainer directory...');
        ensureDirectory(devcontainerPath);
    }

    if (!fileExists(devcontainerJson)) {
        logInfo('Creating devcontainer.json...');
        writeFile(devcontainerJson, getDevcontainerTemplate());
        logSuccess('devcontainer.json created');
    } else {
        log('   ✅ devcontainer.json already exists', 'green');
    }

    const codespacesPath = path.join(__dirname, '.codespaces');
    if (!fileExists(codespacesPath)) {
        ensureDirectory(codespacesPath);
        writeFile(path.join(codespacesPath, 'README.md'), getCodespacesReadme());
        log('   ✅ Created .codespaces/README.md', 'green');
    }

    logInfo('Codespaces configuration ready');
    logInfo('To open in Codespaces:');
    log('   1. Push this repository to GitHub', 'dim');
    log('   2. Click the "Code" button', 'dim');
    log('   3. Select "Codespaces"', 'dim');
    log('   4. Click "Create codespace on main"', 'dim');

    return true;
}

// ============================================
// TEMPLATES
// ============================================
function get404Template() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Universal Integrator Pro</title>
    <meta http-equiv="refresh" content="0;url=./">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #0a0e1a;
            color: #e0e0e0;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }
        .container {
            text-align: center;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            background: rgba(13, 26, 42, 0.85);
            backdrop-filter: blur(12px);
            border-radius: 24px;
            border: 1px solid rgba(74, 158, 255, 0.15);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
        }
        .icon { font-size: 4rem; display: block; margin-bottom: 16px; }
        h1 {
            font-size: 1.8rem;
            background: linear-gradient(135deg, #4a9eff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
        }
        p { color: #8899aa; font-size: 0.95rem; }
        .spinner {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 3px solid rgba(74, 158, 255, 0.15);
            border-top-color: #4a9eff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        a { color: #4a9eff; text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
        .footer { margin-top: 16px; font-size: 0.75rem; color: #556677; }
    </style>
</head>
<body>
    <div class="container">
        <span class="icon">🔮</span>
        <h1>Universal Integrator Pro</h1>
        <p>Redirecting to the application...</p>
        <div class="spinner"></div>
        <p style="margin-top: 16px; font-size: 0.85rem;">
            If you're not redirected automatically, 
            <a href="./">click here</a>
        </p>
        <div class="footer">v4.0.0 • The Most Advanced File Integration System</div>
    </div>
    <script>
        window.location.href = './';
    </script>
</body>
</html>`;
}

function getDockerfileTemplate() {
    return `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]`;
}

function getDevcontainerTemplate() {
    return `{
  "name": "Universal Integrator Pro",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:18",

  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-typescript-next",
        "formulahendry.auto-rename-tag",
        "ritwickdey.LiveServer",
        "GitHub.copilot"
      ],
      "settings": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit"
        },
        "liveServer.settings.root": "/workspaces/universal-integrator",
        "liveServer.settings.port": 5500,
        "liveServer.settings.file": "index.html",
        "terminal.integrated.defaultProfile.linux": "bash"
      }
    }
  },

  "postCreateCommand": "npm install && npm run hub:build || echo 'Hub build skipped'",

  "portsAttributes": {
    "3000": { "label": "App", "onAutoForward": "openPreview" },
    "5500": { "label": "Live Server", "onAutoForward": "openPreview" },
    "8000": { "label": "API", "onAutoForward": "notify" }
  },

  "forwardPorts": [3000, 5500, 8000],

  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/git:1": { "version": "latest" },
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },

  "waitFor": "onCreateCommand",
  "updateContentCommand": "npm install && npm run hub:build || echo 'Hub build skipped'",
  "postAttachCommand": "npm run dev",
  "remoteUser": "node",
  "containerEnv": { "NODE_ENV": "development", "PORT": "3000" }
}`;
}

function getCodespacesReadme() {
    return `# Codespaces Setup

## How to use Codespaces

1. **Open in Codespaces**
   - Click the "Code" button on GitHub
   - Select "Codespaces"
   - Click "Create codespace on main"

2. **Wait for setup**
   - The devcontainer will install dependencies
   - Extensions will be installed automatically
   - The development server will start

3. **Access the app**
   - The app will be available at the forwarded port
   - Click "Open in Browser" when prompted

## Development Workflow

\`\`\`bash
npm install
npm run dev
npm run build
npm test
npm run deploy
\`\`\`

## Ports

- \`3000\` - Main application
- \`5500\` - Live Server (static preview)
- \`8000\` - API server

---
Generated by Universal Integrator Pro v4.0`;
}

// ============================================
// DEPLOYMENT SUMMARY
// ============================================
function displaySummary(gitInfo, results) {
    logHeader('📊 DEPLOYMENT SUMMARY');
    
    const completed = results.filter(r => r.success).length;
    const total = results.length;
    const percent = Math.round((completed / total) * 100);
    
    log(`\n${colors.bright}Completion: ${percent}% (${completed}/${total})${colors.reset}`);
    log(createProgressBar(total, completed, ''));
    
    logSubHeader('Step Results:');
    for (const result of results) {
        const icon = result.success ? symbols.check : symbols.cross;
        const color = result.success ? 'green' : 'red';
        log(`   ${icon} ${result.step}: ${result.message}`, color);
        if (result.details) {
            log(`      ${result.details}`, 'dim');
        }
    }
    
    if (gitInfo.pagesUrl) {
        logSubHeader('🌐 Deployment URLs:');
        log(`   ${colors.green}GitHub Pages: ${gitInfo.pagesUrl}${colors.reset}`);
        log(`   ${colors.dim}GitHub Repo: ${gitInfo.url}${colors.reset}`);
    }
    
    const distPath = config.build.outputDir;
    if (fileExists(distPath)) {
        const fileCount = countFiles(distPath);
        const size = getDirectorySize(distPath);
        logSubHeader('📦 Build Info:');
        log(`   ${colors.dim}Files: ${fileCount}${colors.reset}`);
        log(`   ${colors.dim}Size: ${formatSize(size)}${colors.reset}`);
    }
    
    if (results.some(r => r.step === 'Docker' && r.success)) {
        logSubHeader('🐳 Docker Info:');
        log(`   ${colors.dim}Image: ${config.deploy.docker.image}:${config.deploy.docker.tag}${colors.reset}`);
        log(`   ${colors.dim}Run: docker run -p 3000:3000 ${config.deploy.docker.image}:${config.deploy.docker.tag}${colors.reset}`);
    }
    
    logHeader('🎉 DEPLOYMENT COMPLETE!');
}

// ============================================
// MAIN DEPLOYMENT FUNCTION
// ============================================
async function deployAll() {
    logHeader('🔮 UNIVERSAL INTEGRATOR PRO');
    log('      The Most Advanced File Integration System', 'dim');
    log(`      Version 4.0.0 - ${new Date().toISOString().split('T')[0]}`, 'dim');
    log('='.repeat(60), 'dim');
    
    const results = [];
    const gitInfo = getGitInfo();
    
    log(`   ${colors.dim}Platform: ${os.platform()} ${os.arch()}${colors.reset}`);
    log(`   ${colors.dim}Node: ${process.version}${colors.reset}`);
    log(`   ${colors.dim}Working Dir: ${__dirname}${colors.reset}`);
    if (gitInfo.username) {
        log(`   ${colors.dim}GitHub: ${gitInfo.username}/${gitInfo.repo}${colors.reset}`);
    }
    
    // STEP 1
    try {
        const prereqs = await checkPrerequisites();
        const allPassed = Object.values(prereqs).every(v => v === true);
        const missing = Object.entries(prereqs).filter(([_, v]) => v === false).map(([k]) => k);
        results.push({
            step: 'Prerequisites',
            success: allPassed,
            message: allPassed ? 'All prerequisites met' : `Missing: ${missing.join(', ')}`,
            details: allPassed ? null : 'Some dependencies may need to be installed',
        });
    } catch (error) {
        results.push({
            step: 'Prerequisites',
            success: false,
            message: `Failed: ${error.message}`,
        });
    }

    // STEP 2
    try {
        const success = await installDependencies();
        results.push({
            step: 'Dependencies',
            success: success,
            message: success ? 'Dependencies installed' : 'Failed to install dependencies',
        });
    } catch (error) {
        results.push({
            step: 'Dependencies',
            success: false,
            message: `Failed: ${error.message}`,
        });
    }

    // STEP 3
    try {
        const success = await runTests();
        results.push({
            step: 'Tests',
            success: success,
            message: success ? 'Tests passed' : 'Tests failed (continuing)',
        });
    } catch (error) {
        results.push({
            step: 'Tests',
            success: false,
            message: `Failed: ${error.message}`,
        });
    }

    // STEP 4
    try {
        const success = await runLinting();
        results.push({
            step: 'Linting',
            success: success,
            message: success ? 'Linting passed' : 'Linting failed (continuing)',
        });
    } catch (error) {
        results.push({
            step: 'Linting',
            success: false,
            message: `Failed: ${error.message}`,
        });
    }

    // STEP 5
    try {
        const success = await buildProject();
        results.push({
            step: 'Build',
            success: success,
            message: success ? 'Build completed' : 'Build failed',
        });
        if (!success) {
            logError('Build failed - cannot continue');
            displaySummary(gitInfo, results);
            process.exit(1);
        }
    } catch (error) {
        results.push({
            step: 'Build',
            success: false,
            message: `Failed: ${error.message}`,
        });
        displaySummary(gitInfo, results);
        process.exit(1);
    }

    // STEP 5.5
    try {
        const success = await buildHub();
        results.push({
            step: 'Hub Build',
            success: success,
            message: success ? 'Hub built successfully' : 'Hub build failed',
        });
    } catch (error) {
        results.push({
            step: 'Hub Build',
            success: false,
            message: `Failed: ${error.message}`,
        });
    }

    // STEP 5.6
    try {
        const success = await startHubWatcher();
        results.push({
            step: 'Hub Watcher',
            success: success,
            message: success ? 'Hub watcher ready' : 'Hub watcher setup failed',
        });
    } catch (error) {
        results.push({
            step: 'Hub Watcher',
            success: false,
            message: `Failed: ${error.message}`,
        });
    }

    // STEP 6
    try {
        const success = await checkBuildOutput();
        results.push({
            step: 'Build Output',
            success: success,
            message: success ? 'Build output verified' : 'Build output check failed',
        });
    } catch (error) {
        results.push({
            step: 'Build Output',
            success: false,
            message: `Failed: ${error.message}`,
        });
    }

    // STEP 7
    try {
        const success = await createDeploymentFiles();
        results.push({
            step: 'Deployment Files',
            success: success,
            message: success ? 'Deployment files created' : 'Failed to create deployment files',
        });
    } catch (error) {
        results.push({
            step: 'Deployment Files',
            success: false,
            message: `Failed: ${error.message}`,
        });
    }

    // STEP 8
    try {
        const success = await deployToGitHubPages();
        results.push({
            step: 'GitHub Pages',
            success: success,
            message: success ? 'Deployed to GitHub Pages' : 'GitHub Pages deployment failed',
        });
    } catch (error) {
        results.push({
            step: 'GitHub Pages',
            success: false,
            message: `Failed: ${error.message}`,
        });
    }

    // STEP 9
    try {
        const success = await deployToDocker();
        results.push({
            step: 'Docker',
            success: success,
            message: success ? 'Docker image built' : 'Docker build failed',
        });
    } catch (error) {
        results.push({
            step: 'Docker',
            success: false,
            message: `Failed: ${error.message}`,
        });
    }

    // STEP 10
    try {
        const success = await deployToCodespaces();
        results.push({
            step: 'Codespaces',
            success: success,
            message: success ? 'Codespaces configured' : 'Codespaces setup failed',
        });
    } catch (error) {
        results.push({
            step: 'Codespaces',
            success: false,
            message: `Failed: ${error.message}`,
        });
    }

    displaySummary(gitInfo, results);
    
    const criticalSteps = ['Prerequisites', 'Dependencies', 'Build', 'Build Output'];
    const criticalFailed = results.filter(r => criticalSteps.includes(r.step) && !r.success);
    if (criticalFailed.length > 0) {
        process.exit(1);
    }
    process.exit(0);
}

deployAll().catch((error) => {
    logError(`Deployment failed: ${error.message}`);
    process.exit(1);
});
