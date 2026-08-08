// ============================================
// UNIVERSAL INTEGRATOR PRO - HUB ENTRY POINT
// The Brain - Automatically Discovers and Imports Files
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// ============================================
// HUB CONFIGURATION
// ============================================
const HUB_CONFIG = {
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
    
    exclude: [
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
    
    autoImport: {
        enabled: true,
        interval: 5000,
        importAll: true,
        createIndex: true,
        updatePackageJson: true
    }
};

// ============================================
// HUB CLASS
// ============================================
class UniversalHub {
    constructor() {
        this.imports = {};
        this.modules = {};
        this.fileMap = {};
        this.watchers = [];
        this.scanInterval = null;
        this.isInitialized = false;
        this.lastScanTime = null;
        this.discoveredFiles = new Map();
        this.directoryTree = {};
        this.importCache = new Map();
        this.moduleRegistry = new Map();
        
        console.log('🔮 Universal Hub Initializing...');
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================
    async init() {
        console.log('📁 Scanning for files...');
        
        await this.buildDirectoryTree();
        await this.discoverFiles();
        await this.importDiscoveredFiles();
        await this.generateIndex();
        
        if (HUB_CONFIG.autoImport.enabled) {
            this.startAutoDiscovery();
        }
        
        this.isInitialized = true;
        this.lastScanTime = new Date();
        
        console.log('✅ Hub initialized successfully');
        console.log(`📦 Loaded ${Object.keys(this.imports).length} modules`);
        console.log(`📄 Discovered ${this.discoveredFiles.size} files`);
        
        return this;
    }

    // ==========================================
    // BUILD DIRECTORY TREE
    // ==========================================
    async buildDirectoryTree() {
        const root = process.cwd();
        this.directoryTree = {
            name: 'root',
            path: root,
            children: {},
            files: []
        };

        for (const dir of HUB_CONFIG.watchDirs) {
            const fullPath = path.join(root, dir);
            if (fs.existsSync(fullPath)) {
                this.directoryTree.children[dir] = await this.scanDirectory(fullPath);
            }
        }
    }

    async scanDirectory(dirPath) {
        const stats = fs.statSync(dirPath);
        const node = {
            name: path.basename(dirPath),
            path: dirPath,
            isDirectory: stats.isDirectory(),
            children: {},
            files: []
        };

        if (stats.isDirectory()) {
            const items = fs.readdirSync(dirPath);
            for (const item of items) {
                const itemPath = path.join(dirPath, item);
                const itemStats = fs.statSync(itemPath);
                
                if (this.isExcluded(itemPath)) continue;
                
                if (itemStats.isDirectory()) {
                    node.children[item] = await this.scanDirectory(itemPath);
                } else if (this.isValidFile(itemPath)) {
                    node.files.push({
                        name: item,
                        path: itemPath,
                        extension: path.extname(item),
                        size: itemStats.size,
                        modified: itemStats.mtime
                    });
                }
            }
        }

        return node;
    }

    // ==========================================
    // DISCOVER FILES
    // ==========================================
    async discoverFiles() {
        this.discoveredFiles.clear();
        
        const root = process.cwd();
        for (const dir of HUB_CONFIG.watchDirs) {
            const fullPath = path.join(root, dir);
            if (fs.existsSync(fullPath)) {
                await this.discoverFilesInDir(fullPath);
            }
        }
    }

    async discoverFilesInDir(dirPath, basePath = '') {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const relPath = path.join(basePath, item);
            
            if (this.isExcluded(itemPath)) continue;
            
            const stats = fs.statSync(itemPath);
            
            if (stats.isDirectory()) {
                await this.discoverFilesInDir(itemPath, relPath);
            } else if (this.isValidFile(itemPath)) {
                const ext = path.extname(item);
                const moduleName = path.basename(item, ext);
                const importPath = this.getImportPath(itemPath);
                
                this.discoveredFiles.set(itemPath, {
                    name: item,
                    moduleName: moduleName,
                    path: itemPath,
                    importPath: importPath,
                    extension: ext,
                    size: stats.size,
                    modified: stats.mtime,
                    isESModule: this.isESModule(itemPath),
                    isCommonJS: this.isCommonJS(itemPath),
                    exports: await this.getExports(itemPath)
                });
            }
        }
    }

    // ==========================================
    // IMPORT DISCOVERED FILES
    // ==========================================
    async importDiscoveredFiles() {
        const imports = {};
        const modules = {};
        
        for (const [filePath, fileInfo] of this.discoveredFiles) {
            try {
                if (filePath.includes('hub.js')) continue;
                if (filePath.includes('hub-index.js')) continue;
                
                const module = await this.importFile(fileInfo);
                
                if (module) {
                    imports[fileInfo.moduleName] = {
                        path: fileInfo.importPath,
                        exports: Object.keys(module),
                        default: module.default || null
                    };
                    
                    modules[fileInfo.moduleName] = module;
                    
                    this.moduleRegistry.set(fileInfo.moduleName, {
                        module: module,
                        path: fileInfo.path,
                        importedAt: new Date(),
                        exports: Object.keys(module)
                    });
                }
            } catch (error) {
                console.warn(`⚠️ Failed to import ${fileInfo.name}:`, error.message);
            }
        }
        
        this.imports = imports;
        this.modules = modules;
        this._importsData = imports;
        this._modulesData = modules;
        
        return { imports, modules };
    }

    // ==========================================
    // IMPORT A SINGLE FILE
    // ==========================================
    async importFile(fileInfo) {
        try {
            if (this.importCache.has(fileInfo.path)) {
                return this.importCache.get(fileInfo.path);
            }
            
            let module;
            const fullPath = path.join(process.cwd(), fileInfo.path);
            
            if (fileInfo.isESModule || fileInfo.extension === '.mjs') {
                module = await import(`file://${fullPath}`);
            } else {
                module = require(fullPath);
            }
            
            this.importCache.set(fileInfo.path, module);
            
            return module;
        } catch (error) {
            console.warn(`⚠️ Could not import ${fileInfo.name}:`, error.message);
            return null;
        }
    }

    // ==========================================
    // GENERATE INDEX
    // ==========================================
    async generateIndex() {
        const indexContent = this.buildIndexContent();
        const indexPath = path.join(process.cwd(), 'hub-index.js');
        
        fs.writeFileSync(indexPath, indexContent, 'utf8');
        console.log(`📄 Generated hub-index.js with ${Object.keys(this.imports).length} imports`);
        
        if (HUB_CONFIG.autoImport.updatePackageJson) {
            await this.updatePackageJson();
        }
        
        return indexContent;
    }

    buildIndexContent() {
        const imports = [];
        const exports = [];
        
        for (const [name, info] of Object.entries(this.imports)) {
            const importPath = info.path;
            const defaultExport = info.default ? `${name}Default` : null;
            
            if (info.default) {
                imports.push(`import ${name}Default from '${importPath}';`);
            }
            
            const namedExports = info.exports.filter(e => e !== 'default');
            if (namedExports.length > 0) {
                imports.push(`import { ${namedExports.join(', ')} } from '${importPath}';`);
                exports.push(`export { ${namedExports.join(', ')} };`);
            }
            
            exports.push(`export * from '${importPath}';`);
        }
        
        return `// ============================================
// UNIVERSAL INTEGRATOR PRO - HUB INDEX
// Auto-generated - DO NOT EDIT MANUALLY
// Generated: ${new Date().toISOString()}
// Total Modules: ${Object.keys(this.imports).length}
// ============================================

${imports.join('\n')}

// ============================================
// EXPORTS
// ============================================
${exports.join('\n')}

// ============================================
// HUB EXPOSURE
// ============================================
export const HUB_VERSION = '4.0.0';
export const HUB_GENERATED = '${new Date().toISOString()}';
export const HUB_MODULES = ${JSON.stringify(Object.keys(this.imports), null, 2)};

export default {
    version: '4.0.0',
    generated: '${new Date().toISOString()}',
    modules: ${JSON.stringify(Object.keys(this.imports), null, 2)},
    imports: ${JSON.stringify(this.imports, null, 2)}
};`;
    }

    // ==========================================
    // AUTO-DISCOVERY ENGINE
    // ==========================================
    startAutoDiscovery() {
        console.log('🔄 Starting auto-discovery engine...');
        
        this.performAutoDiscovery();
        
        this.scanInterval = setInterval(() => {
            this.performAutoDiscovery();
        }, HUB_CONFIG.autoImport.interval);
        
        console.log(`✅ Auto-discovery running (interval: ${HUB_CONFIG.autoImport.interval}ms)`);
    }

    async performAutoDiscovery() {
        try {
            const changes = await this.scanForChanges();
            
            if (changes.added.length > 0 || changes.removed.length > 0 || changes.modified.length > 0) {
                console.log(`📦 Changes detected: +${changes.added.length} -${changes.removed.length} ~${changes.modified.length}`);
                
                for (const file of changes.added) {
                    await this.processNewFile(file);
                }
                
                for (const file of changes.removed) {
                    this.processRemovedFile(file);
                }
                
                for (const file of changes.modified) {
                    await this.processModifiedFile(file);
                }
                
                await this.generateIndex();
                await this.discoverFiles();
                await this.importDiscoveredFiles();
                
                this.lastScanTime = new Date();
                console.log(`✅ Auto-discovery completed at ${this.lastScanTime.toISOString()}`);
            }
        } catch (error) {
            console.error('❌ Auto-discovery error:', error.message);
        }
    }

    async scanForChanges() {
        const changes = {
            added: [],
            removed: [],
            modified: []
        };
        
        const currentFiles = new Map();
        for (const dir of HUB_CONFIG.watchDirs) {
            const fullPath = path.join(process.cwd(), dir);
            if (fs.existsSync(fullPath)) {
                await this.collectFiles(fullPath, currentFiles);
            }
        }
        
        for (const [filePath, fileInfo] of currentFiles) {
            if (!this.discoveredFiles.has(filePath)) {
                changes.added.push(filePath);
            } else if (fileInfo.modified > this.discoveredFiles.get(filePath).modified) {
                changes.modified.push(filePath);
            }
        }
        
        for (const [filePath] of this.discoveredFiles) {
            if (!currentFiles.has(filePath)) {
                changes.removed.push(filePath);
            }
        }
        
        return changes;
    }

    async collectFiles(dirPath, fileMap) {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            if (this.isExcluded(itemPath)) continue;
            
            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                await this.collectFiles(itemPath, fileMap);
            } else if (this.isValidFile(itemPath)) {
                fileMap.set(itemPath, {
                    name: item,
                    path: itemPath,
                    modified: stats.mtime
                });
            }
        }
    }

    // ==========================================
    // PROCESS FILE CHANGES
    // ==========================================
    async processNewFile(filePath) {
        console.log(`➕ New file detected: ${path.basename(filePath)}`);
        
        const fileInfo = await this.getFileInfo(filePath);
        if (fileInfo) {
            this.discoveredFiles.set(filePath, fileInfo);
            
            const module = await this.importFile(fileInfo);
            if (module) {
                this.moduleRegistry.set(fileInfo.moduleName, {
                    module: module,
                    path: filePath,
                    importedAt: new Date(),
                    exports: Object.keys(module)
                });
                
                console.log(`✅ Imported new module: ${fileInfo.moduleName}`);
            }
        }
    }

    processRemovedFile(filePath) {
        console.log(`➖ File removed: ${path.basename(filePath)}`);
        
        this.discoveredFiles.delete(filePath);
        this.importCache.delete(filePath);
        
        for (const [name, info] of this.moduleRegistry) {
            if (info.path === filePath) {
                this.moduleRegistry.delete(name);
                console.log(`🗑️ Removed module: ${name}`);
                break;
            }
        }
    }

    async processModifiedFile(filePath) {
        console.log(`📝 File modified: ${path.basename(filePath)}`);
        
        this.importCache.delete(filePath);
        
        const fileInfo = await this.getFileInfo(filePath);
        if (fileInfo) {
            this.discoveredFiles.set(filePath, fileInfo);
            const module = await this.importFile(fileInfo);
            if (module) {
                this.moduleRegistry.set(fileInfo.moduleName, {
                    module: module,
                    path: filePath,
                    importedAt: new Date(),
                    exports: Object.keys(module)
                });
                
                console.log(`🔄 Updated module: ${fileInfo.moduleName}`);
            }
        }
    }

    // ==========================================
    // FILE INFO HELPERS
    // ==========================================
    async getFileInfo(filePath) {
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
        const content = fs.readFileSync(filePath, 'utf8');
        return content.includes('import ') || content.includes('export ') || content.includes('export default');
    }

    hasCommonJSSyntax(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        return content.includes('require(') || content.includes('module.exports') || content.includes('exports.');
    }

    async getExports(filePath) {
        try {
            const module = await this.importFile(await this.getFileInfo(filePath));
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
        
        const validExtensions = ['.js', '.mjs', '.cjs', '.json', '.html', '.css', '.md', '.yml', '.yaml', '.xml', '.sql'];
        return validExtensions.includes(ext);
    }

    isExcluded(filePath) {
        const relPath = path.relative(process.cwd(), filePath);
        for (const pattern of HUB_CONFIG.exclude) {
            if (relPath.includes(pattern.replace('**/', ''))) {
                return true;
            }
        }
        return false;
    }

    // ==========================================
    // UPDATE PACKAGE.JSON
    // ==========================================
    async updatePackageJson() {
        const packagePath = path.join(process.cwd(), 'package.json');
        if (!fs.existsSync(packagePath)) return;
        
        try {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            
            packageJson.main = 'hub.js';
            packageJson.exports = {
                '.': './hub.js',
                './hub': './hub.js',
                './hub-index': './hub-index.js',
                './*': './*'
            };
            
            packageJson.scripts = packageJson.scripts || {};
            packageJson.scripts['hub'] = 'node hub.js';
            packageJson.scripts['hub:watch'] = 'node hub-watcher.js';
            packageJson.scripts['hub:build'] = 'node hub.js --build';
            
            fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
            console.log('📝 Updated package.json with hub entries');
        } catch (error) {
            console.warn('⚠️ Could not update package.json:', error.message);
        }
    }

    // ==========================================
    // BUILD HUB (CLI Command)
    // ==========================================
    async buildHub() {
        console.log('🔨 Building Hub...');
        
        await this.generateIndex();
        await this.updatePackageJson();
        
        const indexPath = path.join(process.cwd(), 'hub-index.js');
        const indexContent = this.buildIndexContent();
        fs.writeFileSync(indexPath, indexContent, 'utf8');
        
        console.log(`✅ Hub built: ${Object.keys(this.imports).length} modules`);
        
        this.exposeToGlobal();
        
        return this;
    }

    // ==========================================
    // GET MODULE
    // ==========================================
    getModule(name) {
        if (this.moduleRegistry.has(name)) {
            return this.moduleRegistry.get(name).module;
        }
        console.warn(`⚠️ Module "${name}" not found`);
        return null;
    }

    getAllModules() {
        return Object.fromEntries(this.moduleRegistry);
    }

    getModuleExports(name) {
        if (this.moduleRegistry.has(name)) {
            return this.moduleRegistry.get(name).exports;
        }
        return [];
    }

    // ==========================================
    // HUB EXPOSURE
    // ==========================================
    exposeToGlobal() {
        global.__hub = this;
        global.__modules = this.modules;
        global.__imports = this.imports;
        
        console.log('🌐 Hub exposed globally as __hub');
    }

    // ==========================================
    // CLEANUP
    // ==========================================
    stopAutoDiscovery() {
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
            console.log('⏹️ Auto-discovery stopped');
        }
    }

    // ==========================================
    // RUN HUB
    // ==========================================
    async run() {
        await this.init();
        this.exposeToGlobal();
        
        console.log('🚀 Hub is ready!');
        console.log(`📦 ${this.moduleRegistry.size} modules loaded`);
        
        return this;
    }
}

// ============================================
// CREATE AND EXPORT HUB INSTANCE
// ============================================
const hub = new UniversalHub();
export default hub;

// Parse command line arguments
if (process.argv.includes('--build')) {
    hub.buildHub().then(() => {
        console.log('✅ Hub build complete');
        process.exit(0);
    }).catch(err => {
        console.error('❌ Hub build failed:', err);
        process.exit(1);
    });
} else if (process.argv.includes('--watch')) {
    import('./hub-watcher.js').then(module => {
        module.default.run();
    }).catch(err => {
        console.error('❌ Failed to start watcher:', err);
    });
} else {
    hub.run().catch(console.error);
}
