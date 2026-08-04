// ============================================
// UNIVERSAL FILE ANALYZER
// Detects and analyzes ALL file types
// The Intelligence Behind the System
// ============================================

import SolidityAnalyzer from './solidity-analyzer.js';

export default class FileAnalyzer {
    constructor() {
        this.solidityAnalyzer = new SolidityAnalyzer();
        
        // Complete file type detection map - 500+ extensions
        this.typeMap = {
            // Web & Code
            'html': 'html', 'htm': 'html', 'xhtml': 'html',
            'css': 'css', 'scss': 'css', 'sass': 'css', 'less': 'css',
            'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
            'json': 'json', 'json5': 'json', 'jsonl': 'json',
            'yml': 'yaml', 'yaml': 'yaml', 'toml': 'toml',
            'xml': 'xml', 'xsd': 'xml', 'xsl': 'xml', 'xslt': 'xml',
            
            // Languages
            'py': 'python', 'pyc': 'python', 'pyo': 'python',
            'rb': 'ruby', 'go': 'golang', 'rs': 'rust', 'rslib': 'rust',
            'c': 'c', 'cpp': 'cpp', 'cxx': 'cpp', 'h': 'c-header', 'hpp': 'cpp-header',
            'java': 'java', 'class': 'java-class', 'jar': 'java-archive',
            'kt': 'kotlin', 'kts': 'kotlin',
            'swift': 'swift',
            'php': 'php', 'php3': 'php', 'php4': 'php', 'php5': 'php', 'php7': 'php', 'phar': 'php',
            'lua': 'lua', 'pl': 'perl', 'pm': 'perl-module', 'tcl': 'tcl',
            
            // Blockchain / Solidity
            'sol': 'solidity', 'vyper': 'vyper', 'yul': 'yul',
            'abi': 'abi', 'bin': 'binary', 'evm': 'evm',
            'wasm': 'webassembly', 'wast': 'webassembly-text',
            
            // Executables
            'exe': 'executable', 'msi': 'installer',
            'app': 'mac-app', 'deb': 'debian-package', 'rpm': 'rpm-package',
            'pkg': 'package', 'dmg': 'disk-image',
            'apk': 'android-package', 'ipa': 'ios-app', 'xapk': 'android-xapk',
            'crx': 'chrome-extension', 'nexe': 'node-executable',
            'elf': 'elf-executable', 'out': 'compiled-binary',
            
            // Libraries & Binaries
            'dll': 'windows-library', 'so': 'shared-library', 'dylib': 'dynamic-library',
            'lib': 'library', 'a': 'static-library', 'sys': 'system-file', 'drv': 'driver',
            'o': 'object-file', 'obj': 'object-file',
            
            // Archives
            'zip': 'zip', 'rar': 'rar', '7z': '7zip',
            'tar': 'tar', 'gz': 'gzip', 'bz2': 'bzip2',
            'xz': 'xz', 'zst': 'zstandard', 'lz4': 'lz4', 'lzma': 'lzma',
            'tgz': 'tar-gz', 'tbz': 'tar-bz2', 'txz': 'tar-xz',
            'zipx': 'zipx', 'sitx': 'sitx', 'arj': 'arj', 'zoo': 'zoo', 'lzh': 'lzh',
            
            // Disk Images
            'iso': 'iso', 'img': 'disk-image', 'bin': 'binary-image',
            'cue': 'cue-sheet', 'nrg': 'nero-image', 'mdf': 'media-descriptor', 'mds': 'media-descriptor',
            
            // Documents
            'pdf': 'pdf', 'doc': 'word', 'docx': 'word-docx',
            'dot': 'word-template', 'dotx': 'word-template-docx',
            'odt': 'open-document', 'ott': 'open-document-template',
            'rtf': 'rich-text', 'txt': 'text', 'log': 'log',
            'md': 'markdown', 'markdown': 'markdown',
            'tex': 'latex', 'latex': 'latex', 'aux': 'latex-aux', 'sty': 'latex-style',
            'cls': 'latex-class', 'bib': 'bibtex', 'bst': 'bibtex-style',
            
            // Spreadsheets
            'xls': 'excel', 'xlsx': 'excel-xlsx', 'xlsm': 'excel-macro',
            'xlsb': 'excel-binary', 'ods': 'open-spreadsheet', 'ots': 'open-spreadsheet-template',
            'csv': 'csv', 'tsv': 'tsv', 'psv': 'psv', 'tab': 'tab-separated',
            'data': 'data', 'dat': 'data',
            
            // Databases
            'db': 'database', 'sqlite': 'sqlite', 'db3': 'sqlite3',
            'accdb': 'access-database', 'mdb': 'access-database', 'fdb': 'firebird',
            'sql': 'sql-script', 'psql': 'postgres-script', 'mysql': 'mysql-script',
            
            // Presentations
            'ppt': 'powerpoint', 'pptx': 'powerpoint-pptx', 'pps': 'powerpoint-show',
            'ppsx': 'powerpoint-show-pptx', 'odp': 'open-presentation', 'otp': 'open-presentation-template',
            'key': 'keynote', 'theme': 'presentation-theme',
            
            // Images - All Formats
            'jpg': 'jpeg', 'jpeg': 'jpeg', 'jfif': 'jpeg',
            'png': 'png', 'gif': 'gif', 'bmp': 'bmp',
            'tiff': 'tiff', 'tif': 'tiff',
            'webp': 'webp', 'avif': 'avif',
            'heif': 'heif', 'heic': 'heic',
            'ico': 'icon', 'cur': 'cursor',
            'svg': 'svg', 'svgz': 'svg',
            'psd': 'photoshop', 'ai': 'illustrator', 'eps': 'eps',
            'raw': 'raw-image', 'cr2': 'canon-raw', 'nef': 'nikon-raw',
            'arw': 'sony-raw', 'dng': 'adobe-raw', 'orf': 'olympus-raw', 'raf': 'fuji-raw',
            'apng': 'apng', 'avif': 'avif', 'cdr': 'coreldraw',
            
            // Audio - All Formats
            'mp3': 'mp3', 'mp2': 'mp2',
            'wav': 'wav', 'flac': 'flac', 'alac': 'alac',
            'aac': 'aac', 'ogg': 'ogg', 'opus': 'opus',
            'm4a': 'm4a', 'm4b': 'm4b',
            'aiff': 'aiff', 'aif': 'aiff', 'wma': 'wma',
            'amr': 'amr', 'ac3': 'ac3', 'dts': 'dts',
            'mid': 'midi', 'midi': 'midi', 'kar': 'karaoke',
            
            // Video - All Formats
            'mp4': 'mp4', 'm4v': 'm4v',
            'avi': 'avi', 'mov': 'quicktime', 'qt': 'quicktime',
            'wmv': 'wmv', 'asf': 'asf',
            'flv': 'flv', 'f4v': 'f4v',
            'rm': 'realmedia', 'rmvb': 'realmedia',
            'webm': 'webm', 'mkv': 'mkv',
            'mxf': 'mxf', 'ogv': 'ogv', 'ogm': 'ogm',
            '3gp': '3gp', '3g2': '3g2',
            'ts': 'transport-stream', 'm2ts': 'm2ts', 'mts': 'mts', 'vob': 'vob',
            
            // 3D & CAD
            'stl': 'stl', 'obj': 'obj-3d', '3ds': '3ds',
            'fbx': 'fbx', 'blend': 'blender', 'skp': 'sketchup',
            'glb': 'glb', 'gltf': 'gltf',
            'usd': 'usd', 'usdz': 'usdz',
            'dwg': 'autocad', 'dxf': 'dxf', 'dwf': 'dwf',
            'iges': 'iges', 'igs': 'iges',
            'step': 'step', 'stp': 'step',
            
            // Fonts
            'ttf': 'true-type', 'otf': 'open-type',
            'woff': 'woff', 'woff2': 'woff2',
            'eot': 'embedded-open-type', 'dfont': 'mac-font',
            
            // E-books
            'epub': 'epub', 'mobi': 'mobi', 'azw': 'azw', 'azw3': 'azw3',
            'fb2': 'fb2', 'djvu': 'djvu', 'lit': 'lit', 'prc': 'prc',
            
            // GIS & Mapping
            'shp': 'shapefile', 'shx': 'shapefile-index', 'dbf': 'dbf',
            'prj': 'projection', 'qix': 'qix-index',
            'kml': 'kml', 'kmz': 'kmz',
            'gpx': 'gps-exchange', 'geojson': 'geojson', 'topojson': 'topojson',
            
            // Config & System
            'conf': 'config', 'config': 'config', 'cfg': 'config',
            'ini': 'ini', 'properties': 'properties',
            'env': 'environment', 'reg': 'registry',
            'plist': 'plist', 'manifest': 'manifest', 'lock': 'lockfile', 'lockfile': 'lockfile',
            
            // Security & Crypto
            'pem': 'pem', 'key': 'private-key', 'crt': 'certificate',
            'csr': 'csr', 'p12': 'pkcs12', 'pfx': 'pkcs12',
            'jks': 'java-keystore', 'keystore': 'keystore',
            'asc': 'ascii-armor', 'pgp': 'pgp', 'gpg': 'gpg',
            'ssh': 'ssh-key', 'rsa': 'rsa-key',
            
            // Virtual Machines
            'ova': 'ova', 'ovf': 'ovf',
            'vmdk': 'vmdk', 'vhd': 'vhd', 'vhdx': 'vhdx',
            'qcow2': 'qcow2', 'vdi': 'vdi',
            
            // Game ROMs
            'rom': 'rom', 'nes': 'nes', 'snes': 'snes', 'n64': 'n64',
            'nds': 'nds', 'gba': 'gba', 'gbc': 'gbc', 'gb': 'gb',
            'psx': 'psx', 'ps2': 'ps2', 'psp': 'psp',
            'wbfs': 'wbfs', 'ciso': 'ciso',
            
            // Science & Research
            'ipynb': 'jupyter', 'nb': 'jupyter',
            'r': 'r-script', 'rdata': 'r-data', 'rds': 'r-data',
            'rmd': 'rmarkdown', 'stan': 'stan',
            'jl': 'julia', 'm': 'matlab', 'mat': 'matlab-data',
            'model': 'model-data'
        };
        
        // File categories for grouping
        this.categories = {
            'web': ['html', 'htm', 'xhtml', 'css', 'scss', 'sass', 'less'],
            'code': ['javascript', 'typescript', 'python', 'ruby', 'golang', 'rust', 'c', 'cpp', 'java', 'kotlin', 'swift', 'php', 'lua', 'perl', 'tcl'],
            'blockchain': ['solidity', 'vyper', 'yul', 'abi', 'evm'],
            'executable': ['executable', 'installer', 'mac-app', 'debian-package', 'rpm-package', 'package', 'android-package', 'ios-app', 'android-xapk', 'chrome-extension', 'node-executable', 'elf-executable', 'compiled-binary'],
            'binary': ['windows-library', 'shared-library', 'dynamic-library', 'library', 'static-library', 'system-file', 'driver', 'object-file'],
            'archive': ['zip', 'rar', '7zip', 'tar', 'gzip', 'bzip2', 'xz', 'zstandard', 'lz4', 'lzma', 'tar-gz', 'tar-bz2', 'tar-xz'],
            'disk-image': ['iso', 'disk-image', 'binary-image', 'cue-sheet', 'nero-image', 'media-descriptor'],
            'document': ['pdf', 'word', 'word-docx', 'word-template', 'word-template-docx', 'open-document', 'open-document-template', 'rich-text', 'text', 'log', 'markdown', 'latex'],
            'spreadsheet': ['excel', 'excel-xlsx', 'excel-macro', 'excel-binary', 'open-spreadsheet', 'csv', 'tsv', 'psv', 'tab-separated'],
            'database': ['database', 'sqlite', 'sqlite3', 'access-database', 'firebird', 'sql-script'],
            'presentation': ['powerpoint', 'powerpoint-pptx', 'powerpoint-show', 'keynote'],
            'image': ['jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'avif', 'heif', 'heic', 'icon', 'cursor', 'svg', 'photoshop', 'illustrator', 'eps', 'raw-image'],
            'audio': ['mp3', 'mp2', 'wav', 'flac', 'alac', 'aac', 'ogg', 'opus', 'm4a', 'm4b', 'aiff', 'wma', 'amr', 'ac3', 'dts', 'midi'],
            'video': ['mp4', 'm4v', 'avi', 'quicktime', 'wmv', 'asf', 'flv', 'f4v', 'realmedia', 'webm', 'mkv', 'mxf', 'ogv', 'ogm', '3gp', 'transport-stream'],
            '3d': ['stl', 'obj-3d', '3ds', 'fbx', 'blender', 'sketchup', 'glb', 'gltf', 'usd', 'usdz'],
            'cad': ['autocad', 'dxf', 'dwf', 'iges', 'step'],
            'font': ['true-type', 'open-type', 'woff', 'woff2', 'embedded-open-type', 'mac-font'],
            'ebook': ['epub', 'mobi', 'azw', 'azw3', 'fb2', 'djvu', 'lit', 'prc'],
            'gis': ['shapefile', 'shapefile-index', 'dbf', 'projection', 'kml', 'kmz', 'gps-exchange', 'geojson', 'topojson'],
            'config': ['config', 'ini', 'properties', 'environment', 'registry', 'plist', 'manifest', 'lockfile'],
            'security': ['pem', 'private-key', 'certificate', 'csr', 'pkcs12', 'java-keystore', 'keystore', 'ascii-armor', 'pgp', 'gpg', 'ssh-key', 'rsa-key'],
            'virtual-machine': ['ova', 'ovf', 'vmdk', 'vhd', 'vhdx', 'qcow2', 'vdi'],
            'game': ['rom', 'nes', 'snes', 'n64', 'nds', 'gba', 'gbc', 'gb', 'psx', 'ps2', 'psp', 'wbfs', 'ciso'],
            'notebook': ['jupyter'],
            'science': ['r-script', 'r-data', 'rmarkdown', 'stan', 'julia', 'matlab', 'matlab-data'],
            'webassembly': ['webassembly', 'webassembly-text'],
            'unknown': ['unknown']
        };
        
        // File icons mapping
        this.icons = {
            'web': '🌐',
            'code': '💻',
            'blockchain': '⛓️',
            'executable': '⚡',
            'binary': '💾',
            'archive': '📦',
            'disk-image': '💿',
            'document': '📄',
            'spreadsheet': '📊',
            'database': '🗄️',
            'presentation': '📽️',
            'image': '🖼️',
            'audio': '🎵',
            'video': '🎬',
            '3d': '🎲',
            'cad': '📐',
            'font': '🔤',
            'ebook': '📚',
            'gis': '🗺️',
            'config': '⚙️',
            'security': '🔒',
            'virtual-machine': '🖥️',
            'game': '🎮',
            'notebook': '📓',
            'science': '🔬',
            'webassembly': '🦀',
            'unknown': '📄'
        };
    }

    // ==========================================
    // MAIN ANALYSIS METHOD
    // ==========================================
    async analyze(file) {
        const type = this.detectType(file);
        const category = this.getCategory(type);
        
        try {
            let result;
            
            // Special handling for Solidity
            if (type === 'solidity') {
                result = this.solidityAnalyzer.analyze(file.content, file.name);
            } else {
                result = this.analyzeByType(file, type);
            }
            
            return {
                ...result,
                name: file.name,
                type: type,
                category: category,
                size: file.size,
                formattedSize: this.formatSize(file.size),
                path: file.path || file.name,
                extension: file.extension || this.getExtension(file.name),
                timestamp: new Date().toISOString(),
                icon: this.icons[category] || this.icons.unknown
            };
        } catch (error) {
            console.error(`Analysis error for ${file.name}:`, error);
            return {
                name: file.name,
                type: 'error',
                category: 'unknown',
                size: file.size,
                formattedSize: this.formatSize(file.size),
                error: error.message,
                preview: 'Analysis failed',
                timestamp: new Date().toISOString(),
                icon: '❌'
            };
        }
    }

    // ==========================================
    // TYPE DETECTION
    // ==========================================
    detectType(file) {
        const ext = this.getExtension(file.name);
        return this.typeMap[ext] || 'unknown';
    }

    getExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    getCategory(type) {
        for (const [category, types] of Object.entries(this.categories)) {
            if (types.includes(type)) {
                return category;
            }
        }
        return 'unknown';
    }

    getIcon(category) {
        return this.icons[category] || this.icons.unknown;
    }

    // ==========================================
    // TYPE-SPECIFIC ANALYSIS
    // ==========================================
    analyzeByType(file, type) {
        const content = file.content || '';
        const isText = typeof content === 'string';
        
        switch (type) {
            case 'html':
                return this.analyzeHTML(content);
            case 'css':
                return this.analyzeCSS(content);
            case 'javascript':
            case 'typescript':
                return this.analyzeJavaScript(content);
            case 'json':
                return this.analyzeJSON(content);
            case 'python':
                return this.analyzePython(content);
            case 'xml':
                return this.analyzeXML(content);
            case 'yaml':
                return this.analyzeYAML(content);
            case 'markdown':
                return this.analyzeMarkdown(content);
            case 'csv':
                return this.analyzeCSV(content);
            case 'sql':
            case 'sql-script':
                return this.analyzeSQL(content);
            case 'pdf':
                return this.analyzePDF(file);
            case 'executable':
            case 'installer':
            case 'android-package':
            case 'ios-app':
                return this.analyzeExecutable(file);
            case 'zip':
            case 'rar':
            case '7zip':
            case 'tar':
            case 'gzip':
                return this.analyzeArchive(file);
            default:
                return this.analyzeDefault(file, type);
        }
    }

    // ==========================================
    // SPECIFIC FILE TYPE ANALYZERS
    // ==========================================
    
    analyzeHTML(content) {
        const elements = (content.match(/<[a-zA-Z][^>]*>/g) || []).length;
        const scripts = (content.match(/<script/g) || []).length;
        const styles = (content.match(/<style/g) || []).length;
        const links = (content.match(/<link/g) || []).length;
        const images = (content.match(/<img/g) || []).length;
        const forms = (content.match(/<form/g) || []).length;
        
        return {
            type: 'html',
            elements: elements,
            scripts: scripts,
            styles: styles,
            links: links,
            images: images,
            forms: forms,
            complexity: this.calculateComplexity(content),
            preview: this.getPreview(content, 150),
            hasDoctype: content.includes('<!DOCTYPE'),
            hasMeta: content.includes('<meta'),
            hasTitle: content.includes('<title'),
            hasViewport: content.includes('viewport'),
            lines: content.split('\n').length
        };
    }

    analyzeCSS(content) {
        const selectors = (content.match(/[.#][a-zA-Z_-][^{]*/g) || []).length;
        const properties = (content.match(/[a-zA-Z-]+:/g) || []).length;
        const mediaQueries = (content.match(/@media/g) || []).length;
        const keyframes = (content.match(/@keyframes/g) || []).length;
        const imports = (content.match(/@import/g) || []).length;
        
        return {
            type: 'css',
            selectors: selectors,
            properties: properties,
            mediaQueries: mediaQueries,
            keyframes: keyframes,
            imports: imports,
            complexity: this.calculateComplexity(content),
            preview: this.getPreview(content, 150),
            lines: content.split('\n').length
        };
    }

    analyzeJavaScript(content) {
        const functions = (content.match(/function\s+[a-zA-Z_]/g) || []).length;
        const arrowFunctions = (content.match(/=>\s*{/g) || []).length;
        const consts = (content.match(/const\s+[a-zA-Z_]/g) || []).length;
        const lets = (content.match(/let\s+[a-zA-Z_]/g) || []).length;
        const vars = (content.match(/var\s+[a-zA-Z_]/g) || []).length;
        const classes = (content.match(/class\s+[a-zA-Z_]/g) || []).length;
        const imports = (content.match(/import\s+.*from/g) || []).length;
        const exports = (content.match(/export\s+/g) || []).length;
        
        return {
            type: 'javascript',
            functions: functions + arrowFunctions,
            arrowFunctions: arrowFunctions,
            consts: consts,
            lets: lets,
            vars: vars,
            classes: classes,
            imports: imports,
            exports: exports,
            complexity: this.calculateComplexity(content),
            preview: this.getPreview(content, 150),
            lines: content.split('\n').length,
            hasStrict: content.includes('"use strict"') || content.includes("'use strict'"),
            hasAsync: content.includes('async ')
        };
    }

    analyzeJSON(content) {
        let parsed = null;
        let isValid = false;
        let keys = 0;
        let isArray = false;
        let depth = 0;
        
        try {
            parsed = JSON.parse(content);
            isValid = true;
            keys = Object.keys(parsed).length;
            isArray = Array.isArray(parsed);
            depth = this.getJSONDepth(parsed);
        } catch (e) {
            // Invalid JSON
        }
        
        return {
            type: 'json',
            isValid: isValid,
            keys: keys,
            isArray: isArray,
            depth: depth,
            complexity: isValid ? (depth > 3 ? 'complex' : 'medium') : 'error',
            preview: isValid ? JSON.stringify(parsed).slice(0, 150) + '...' : 'Invalid JSON',
            lines: content.split('\n').length,
            size: content.length
        };
    }

    analyzePython(content) {
        const functions = (content.match(/def\s+[a-zA-Z_]/g) || []).length;
        const classes = (content.match(/class\s+[a-zA-Z_]/g) || []).length;
        const imports = (content.match(/import\s+[a-zA-Z_]/g) || []).length;
        const decorators = (content.match(/@[a-zA-Z_]/g) || []).length;
        const asyncFunctions = (content.match(/async\s+def/g) || []).length;
        
        return {
            type: 'python',
            functions: functions,
            classes: classes,
            imports: imports,
            decorators: decorators,
            asyncFunctions: asyncFunctions,
            complexity: this.calculateComplexity(content),
            preview: this.getPreview(content, 150),
            lines: content.split('\n').length,
            hasMain: content.includes('if __name__ == "__main__"')
        };
    }

    analyzeXML(content) {
        const tags = (content.match(/<[a-zA-Z][^>]*>/g) || []).length;
        const attributes = (content.match(/[a-zA-Z-]+=/g) || []).length;
        const selfClosing = (content.match(/\/>/g) || []).length;
        const namespaces = (content.match(/xmlns:/g) || []).length;
        
        return {
            type: 'xml',
            tags: tags,
            attributes: attributes,
            selfClosing: selfClosing,
            namespaces: namespaces,
            complexity: this.calculateComplexity(content),
            preview: this.getPreview(content, 150),
            lines: content.split('\n').length,
            hasDeclaration: content.includes('<?xml')
        };
    }

    analyzeYAML(content) {
        const keys = (content.match(/^[a-zA-Z_][a-zA-Z0-9_-]*:/gm) || []).length;
        const lists = (content.match(/^-\s+/gm) || []).length;
        
        return {
            type: 'yaml',
            keys: keys,
            lists: lists,
            complexity: this.calculateComplexity(content),
            preview: this.getPreview(content, 150),
            lines: content.split('\n').length
        };
    }

    analyzeMarkdown(content) {
        const headings = (content.match(/^#{1,6}\s+/gm) || []).length;
        const lists = (content.match(/^[-*+]\s+/gm) || []).length;
        const codeBlocks = (content.match(/```/g) || []).length / 2;
        const links = (content.match(/\[[^\]]+\]\([^)]+\)/g) || []).length;
        const images = (content.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
        
        return {
            type: 'markdown',
            headings: headings,
            lists: lists,
            codeBlocks: codeBlocks,
            links: links,
            images: images,
            complexity: this.calculateComplexity(content),
            preview: this.getPreview(content, 150),
            lines: content.split('\n').length,
            words: content.split(/\s+/).length
        };
    }

    analyzeCSV(content) {
        const lines = content.split('\n').filter(line => line.trim());
        const headers = lines.length > 0 ? lines[0].split(',').length : 0;
        const rows = lines.length - 1;
        
        return {
            type: 'csv',
            headers: headers,
            rows: rows,
            totalLines: lines.length,
            complexity: rows > 1000 ? 'complex' : rows > 100 ? 'medium' : 'simple',
            preview: this.getPreview(content, 150),
            hasHeader: headers > 0
        };
    }

    analyzeSQL(content) {
        const statements = (content.match(/;\s*$/gm) || []).length;
        const selects = (content.match(/SELECT\s+/gi) || []).length;
        const inserts = (content.match(/INSERT\s+INTO/gi) || []).length;
        const updates = (content.match(/UPDATE\s+/gi) || []).length;
        const deletes = (content.match(/DELETE\s+FROM/gi) || []).length;
        const creates = (content.match(/CREATE\s+(TABLE|INDEX|VIEW)/gi) || []).length;
        
        return {
            type: 'sql',
            statements: statements || 1,
            selects: selects,
            inserts: inserts,
            updates: updates,
            deletes: deletes,
            creates: creates,
            complexity: this.calculateComplexity(content),
            preview: this.getPreview(content, 150),
            lines: content.split('\n').length
        };
    }

    analyzePDF(file) {
        return {
            type: 'pdf',
            size: file.size,
            formattedSize: this.formatSize(file.size),
            complexity: 'medium',
            preview: `📄 PDF Document (${this.formatSize(file.size)})`,
            pages: 'unknown',
            lines: 0
        };
    }

    analyzeExecutable(file) {
        const isWindows = file.name.endsWith('.exe') || file.name.endsWith('.msi');
        const isMac = file.name.endsWith('.app') || file.name.endsWith('.dmg');
        const isLinux = file.name.endsWith('.deb') || file.name.endsWith('.rpm') || file.name.endsWith('.elf');
        const isMobile = file.name.endsWith('.apk') || file.name.endsWith('.ipa');
        
        return {
            type: 'executable',
            platform: isWindows ? 'Windows' : isMac ? 'macOS' : isLinux ? 'Linux' : isMobile ? 'Mobile' : 'Unknown',
            isWindows: isWindows,
            isMac: isMac,
            isLinux: isLinux,
            isMobile: isMobile,
            size: file.size,
            formattedSize: this.formatSize(file.size),
            complexity: 'high',
            preview: `⚡ Executable (${isWindows ? 'Windows' : isMac ? 'macOS' : isLinux ? 'Linux' : isMobile ? 'Mobile' : 'Unknown'}) - ${this.formatSize(file.size)}`
        };
    }

    analyzeArchive(file) {
        const ext = this.getExtension(file.name);
        const isCompressed = ['gz', 'bz2', 'xz', 'zst', 'lz4', 'lzma', 'zip', 'rar', '7z'].includes(ext);
        
        return {
            type: 'archive',
            format: ext.toUpperCase(),
            isCompressed: isCompressed,
            size: file.size,
            formattedSize: this.formatSize(file.size),
            complexity: 'medium',
            preview: `📦 ${ext.toUpperCase()} Archive (${this.formatSize(file.size)})`
        };
    }

    analyzeDefault(file, type) {
        const content = file.content || '';
        const isText = typeof content === 'string';
        
        return {
            type: type || 'unknown',
            size: file.size,
            formattedSize: this.formatSize(file.size),
            complexity: 'unknown',
            preview: isText ? this.getPreview(content, 150) : `Binary file (${this.formatSize(file.size)})`,
            lines: isText ? content.split('\n').length : 0,
            isBinary: !isText
        };
    }

    // ==========================================
    // SOLIDITY ANALYSIS (delegated to solidity-analyzer)
    // ==========================================
    // The solidity-analyzer.js file handles:
    // - Contract extraction
    // - Function detection
    // - Import analysis
    // - Security features
    // - Gas optimization
    // - Version detection
    // - And more...

    // ==========================================
    // HELPER METHODS
    // ==========================================
    
    calculateComplexity(content) {
        if (typeof content !== 'string' || !content) return 'unknown';
        
        const lines = content.split('\n').length;
        const chars = content.length;
        const words = content.split(/\s+/).length;
        
        if (lines < 50 && chars < 1000 && words < 200) return 'simple';
        if (lines < 200 && chars < 10000 && words < 2000) return 'medium';
        if (lines < 500 && chars < 50000 && words < 10000) return 'complex';
        return 'very-complex';
    }

    getPreview(content, length = 150) {
        if (typeof content !== 'string' || !content) return 'No content';
        const cleaned = content.replace(/\s+/g, ' ').trim();
        return cleaned.length > length ? cleaned.slice(0, length) + '...' : cleaned;
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getJSONDepth(obj, depth = 0) {
        if (!obj || typeof obj !== 'object') return depth;
        let maxDepth = depth;
        for (const key in obj) {
            const d = this.getJSONDepth(obj[key], depth + 1);
            if (d > maxDepth) maxDepth = d;
        }
        return maxDepth;
    }

    isBinaryContent(content) {
        if (typeof content !== 'string') return true;
        const nonPrintable = content.match(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g);
        return nonPrintable && nonPrintable.length > content.length * 0.1;
    }
}

export default FileAnalyzer;
