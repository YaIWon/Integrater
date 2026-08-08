// ============================================
// UNIVERSAL INTEGRATOR PRO - HUB WATCHER
// Auto-Discovery Engine - Constant Environment Scanner
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// WATCHER CONFIG
// ============================================
const WATCHER_CONFIG = {
    watchDirs: [
        './js/core',
        './js/handlers',
        './js/ui',
        './js/utils',
        './js/services',
        './js/models',
        './js/controllers',
        './js/middleware',
        './api',
        './config',
        './modules',
        './templates',
        './data'
    ],
    
    patterns: [
        '**/*.js',
        '**/*.mjs',
        '**/*.cjs',
        '**/*.json',
        '**/*.html',
        '**/*.css',
        '**/*.md',
        '**/*.yml',
        '**/*.yaml',
        '**/*.xml',
        '**/*.sql'
    ],
    
    ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/*.test.js',
        '**/*.spec.js',
        '**/coverage/**',
        '**/.git/**',
        '**/logs/**',
        '**/temp/**',
        '**/uploads/**'
    ],
    
    settings: {
        persistent: true,
        ignoreInitial: false,
        followSymlinks: false,
        usePolling: true,
        interval: 1000,
        binaryInterval: 3000,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
        }
    }
};

// ============================================
// HUB WATCHER CLASS
// ============================================
class HubWatcher {
    constructor() {
        this.watcher = null;
        this.hub = null;
        this.isWatching = false;
        this.eventQueue = [];
        this.isProcessing = false;
        this.fileMap = new Map();
        this.stats = {
            filesAdded: 0,
            filesChanged: 0,
            filesRemoved: 0,
            importsUpdated: 0,
            lastScan: null
        };
        
        console.log('🔍 Hub Watcher Initializing...');
    }

    // ==========================================
    // ENSURE DEPENDENCIES
    // ==========================================
    async ensureDependencies() {
        console.log('📦 Checking dependencies...');
        
        try {
            await import('chokidar');
            console.log('✅ chokidar found');
            return true;
        } catch {
            console.log('📦 Installing chokidar...');
            try {
                execSync('npm install chokidar --save', { stdio: 'inherit' });
                console.log('✅ chokidar installed');
                return true;
            } catch (error) {
                console.error('❌ Failed to install chokidar:', error.message);
                return false;
            }
        }
    }

    // ==========================================
    // INITIALIZE
    // ==========================================
    async init() {
        await this.ensureDependencies();
        
        const chokidar = await import('chokidar');
        this.chokidar = chokidar.default;
        
        try {
            const hubModule = await import('./hub.js');
            this.hub = hubModule.default;
            console.log('✅ Hub loaded successfully');
        } catch (error) {
            console.warn('⚠️ Hub not found, creating new instance...');
            const { default: Hub } = await import('./hub.js');
            this.hub = new Hub();
            await this.hub.init();
        }
        
        return this;
    }

    // ==========================================
    // START WATCHING
    // ==========================================
    start() {
        if (this.isWatching) {
            console.warn('⚠️ Watcher is already running');
            return;
        }
        
        console.log('👀 Starting file watcher...');
        
        const watchPaths = [];
        for (const dir of WATCHER_CONFIG.watchDirs) {
            const fullPath = path.join(process.cwd(), dir);
            if (fs.existsSync(fullPath)) {
                watchPaths.push(fullPath);
            } else {
                console.warn(`⚠️ Directory not found: ${dir}`);
            }
        }
        
        if (watchPaths.length === 0) {
            console.error('❌ No valid directories to watch');
            return;
        }
        
        this.watcher = this.chokidar.watch(watchPaths, WATCHER_CONFIG.settings);
        this.setupEventHandlers();
        
        this.isWatching = true;
        console.log(`✅ Watching ${watchPaths.length} directories`);
        console.log(`📁 Directories: ${watchPaths.map(p => path.basename(p)).join(', ')}`);
        
        return this.watcher;
    }

    // ==========================================
    // SETUP EVENT HANDLERS
    // ==========================================
    setupEventHandlers() {
        this.watcher.on('add', (filePath) => {
            this.queueEvent('add', filePath);
        });

        this.watcher.on('change', (filePath) => {
            this.queueEvent('change', filePath);
        });

        this.watcher.on('unlink', (filePath) => {
            this.queueEvent('remove', filePath);
        });

        this.watcher.on('addDir', (dirPath) => {
            this.queueEvent('addDir', dirPath);
        });

        this.watcher.on('unlinkDir', (dirPath) => {
            this.queueEvent('removeDir', dirPath);
        });

        this.watcher.on('error', (error) => {
            console.error('❌ Watcher error:', error.message);
        });

        this.watcher.on('ready', () => {
            console.log('✅ Watcher ready - monitoring for changes');
            this.scanAndUpdate();
        });
    }

    // ==========================================
    // EVENT QUEUE
    // ==========================================
    queueEvent(type, filePath) {
        if (this.isIgnored(filePath)) return;
        if (!this.isValidFile(filePath)) return;
        
        this.eventQueue.push({
            type: type,
            path: filePath,
            timestamp: Date.now()
        });
        
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.isProcessing) return;
        if (this.eventQueue.length === 0) return;
        
        this.isProcessing = true;
        
        try {
            while (this.eventQueue.length > 0) {
                const events = this.eventQueue.splice(0, 10);
                
                for (const event of events) {
                    await this.handleEvent(event);
                }
                
                this.stats.lastScan = new Date();
            }
            
            if (this.eventQueue.length === 0) {
                await this.updateHub();
            }
        } catch (error) {
            console.error('❌ Error processing queue:', error.message);
        } finally {
            this.isProcessing = false;
            
            if (this.eventQueue.length > 0) {
                this.processQueue();
            }
        }
    }

    // ==========================================
    // HANDLE EVENTS
    // ==========================================
    async handleEvent(event) {
        const { type, path } = event;
        const fileName = path.basename(path);
        
        switch (type) {
            case 'add':
                console.log(`➕ File added: ${fileName}`);
                this.stats.filesAdded++;
                await this.handleFileAdded(path);
                break;
                
            case 'change':
                console.log(`📝 File changed: ${fileName}`);
                this.stats.filesChanged++;
                await this.handleFileChanged(path);
                break;
                
            case 'remove':
                console.log(`➖ File removed: ${fileName}`);
                this.stats.filesRemoved++;
                await this.handleFileRemoved(path);
                break;
                
            case 'addDir':
                console.log(`📁 Directory added: ${fileName}`);
                await this.handleDirectoryAdded(path);
                break;
                
            case 'removeDir':
                console.log(`📁 Directory removed: ${fileName}`);
                await this.handleDirectoryRemoved(path);
                break;
        }
    }

    // ==========================================
    // FILE EVENT HANDLERS
    // ==========================================
    async handleFileAdded(filePath) {
        const fileInfo = await this.getFileInfo(filePath);
        if (!fileInfo) return;
        
        this.fileMap.set(filePath, fileInfo);
        
        if (this.hub) {
            this.hub.discoveredFiles.set(filePath, fileInfo);
            const module = await this.hub.importFile(fileInfo);
            if (module) {
                this.hub.moduleRegistry.set(fileInfo.moduleName, {
                    module: module,
                    path: filePath,
                    importedAt: new Date(),
                    exports: Object.keys(module)
                });
                console.log(`✅ Imported new module: ${fileInfo.moduleName}`);
                this.stats.importsUpdated++;
            }
        }
    }

    async handleFileChanged(filePath) {
        if (this.hub) {
            this.hub.importCache.delete(filePath);
        }
        await this.handleFileAdded(filePath);
    }

    async handleFileRemoved(filePath) {
        this.fileMap.delete(filePath);
        
        if (this.hub) {
            this.hub.discoveredFiles.delete(filePath);
            this.hub.importCache.delete(filePath);
            
            for (const [name, info] of this.hub.moduleRegistry) {
                if (info.path === filePath) {
                    this.hub.moduleRegistry.delete(name);
                    console.log(`🗑️ Removed module: ${name}`);
                    break;
                }
            }
        }
    }

    async handleDirectoryAdded(dirPath) {
        if (this.watcher) {
            this.watcher.add(dirPath);
        }
        
        const files = await this.scanDirectory(dirPath);
        for (const file of files) {
            this.queueEvent('add', file);
        }
    }

    async handleDirectoryRemoved(dirPath) {
        if (this.watcher) {
            this.watcher.unwatch(dirPath);
        }
        
        for (const [filePath] of this.fileMap) {
            if (filePath.startsWith(dirPath)) {
                this.handleFileRemoved(filePath);
            }
        }
    }

    // ==========================================
    // SCAN AND UPDATE
    // ==========================================
    async scanAndUpdate() {
        console.log('📊 Performing initial scan...');
        
        for (const dir of WATCHER_CONFIG.watchDirs) {
            const fullPath = path.join(process.cwd(), dir);
            if (fs.existsSync(fullPath)) {
                await this.scanDirectory(fullPath);
            }
        }
        
        await this.updateHub();
        
        console.log(`✅ Initial scan complete: ${this.fileMap.size} files found`);
    }

    async scanDirectory(dirPath) {
        const files = [];
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            if (this.isIgnored(itemPath)) continue;
            
            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                await this.scanDirectory(itemPath);
            } else if (this.isValidFile(itemPath)) {
                files.push(itemPath);
                const fileInfo = await this.getFileInfo(itemPath);
                if (fileInfo) {
                    this.fileMap.set(itemPath, fileInfo);
                }
            }
        }
        
        return files;
    }

    // ==========================================
    // UPDATE HUB
    // ==========================================
    async updateHub() {
        if (!this.hub) return;
        
        try {
            for (const [filePath, fileInfo] of this.fileMap) {
                if (!this.hub.discoveredFiles.has(filePath)) {
                    this.hub.discoveredFiles.set(filePath, fileInfo);
                }
            }
            
            await this.hub.importDiscoveredFiles();
            await this.hub.generateIndex();
            
            console.log(`🔄 Hub updated: ${this.hub.moduleRegistry.size} modules loaded`);
        } catch (error) {
            console.error('❌ Failed to update hub:', error.message);
        }
    }

    // ==========================================
    // FILE INFO HELPERS
    // ==========================================
    async getFileInfo(filePath) {
        try {
            const stats = fs.statSync(filePath);
            const ext = path.extname(filePath);
            const moduleName = path.basename(filePath, ext);
            
            return {
                name: path.basename(filePath),
                moduleName: moduleName,
                path: filePath,
                importPath: this.getImportPath(filePath),
                extension: ext,
                size: stats.size,
                modified: stats.mtime,
                isESModule: this.isESModule(filePath),
                isCommonJS: this.isCommonJS(filePath),
                exports: await this.getExports(filePath)
            };
        } catch (error) {
            return null;
        }
    }

    getImportPath(filePath) {
        const root = process.cwd();
        const relPath = path.relative(root, filePath);
        return relPath.startsWith('.') ? relPath : `./${relPath}`;
    }

    isESModule(filePath) {
        const ext = path.extname(filePath);
        return ext === '.mjs' || ext === '.js' && this.hasESModuleSyntax(filePath);
    }

    isCommonJS(filePath) {
        const ext = path.extname(filePath);
        return ext === '.cjs' || ext === '.js' && this.hasCommonJSSyntax(filePath);
    }

    hasESModuleSyntax(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return content.includes('import ') || content.includes('export ') || content.includes('export default');
        } catch {
            return false;
        }
    }

    hasCommonJSSyntax(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return content.includes('require(') || content.includes('module.exports') || content.includes('exports.');
        } catch {
            return false;
        }
    }

    async getExports(filePath) {
        try {
            const fileInfo = await this.getFileInfo(filePath);
            if (!fileInfo) return [];
            const module = await this.hub.importFile(fileInfo);
            return module ? Object.keys(module) : [];
        } catch {
            return [];
        }
    }

    isValidFile(filePath) {
        const ext = path.extname(filePath);
        const name = path.basename(filePath);
        
        if (name.startsWith('.')) return false;
        if (name === 'hub.js') return false;
        if (name === 'hub-index.js') return false;
        if (name === 'hub-watcher.js') return false;
        
        const validExtensions = ['.js', '.mjs', '.cjs', '.json', '.html', '.css', '.md', '.yml', '.yaml', '.xml', '.sql'];
        return validExtensions.includes(ext);
    }

    isIgnored(filePath) {
        const relPath = path.relative(process.cwd(), filePath);
        for (const pattern of WATCHER_CONFIG.ignore) {
            if (relPath.includes(pattern.replace('**/', ''))) {
                return true;
            }
        }
        return false;
    }

    // ==========================================
    // STATS
    // ==========================================
    getStats() {
        return {
            ...this.stats,
            filesWatched: this.fileMap.size,
            isWatching: this.isWatching,
            queueLength: this.eventQueue.length
        };
    }

    // ==========================================
    // STOP
    // ==========================================
    stop() {
        if (this.watcher) {
            this.watcher.close();
            this.isWatching = false;
            console.log('⏹️ Watcher stopped');
        }
    }

    // ==========================================
    // RUN
    // ==========================================
    async run() {
        await this.init();
        this.start();
        return this;
    }
}

// ============================================
// EXPORT
// ============================================
const watcher = new HubWatcher();
export default watcher;

if (import.meta.url === `file://${process.argv[1]}`) {
    watcher.run().catch(console.error);
}
