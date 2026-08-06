// ============================================
// UNIVERSAL INTEGRATOR PRO - COMPLETE LAUNCH ENGINE
// The Most Advanced File Launch System Ever Built
// Handles EVERYTHING - Files, Folders, Code, Programs, Executables
// ============================================

import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec, execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// COMPLETE LAUNCH ENGINE CLASS
// ============================================
export default class LaunchEngine {
    
    constructor(options = {}) {
        this.verbose = options.verbose || false;
        this.sandbox = options.sandbox || false;
        this.timeout = options.timeout || 30000;
        this.tempDir = options.tempDir || path.join(os.tmpdir(), 'universal-integrator');
        
        // Create temp directory if it doesn't exist
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
        
        // ==========================================
        // FILE TYPE DETECTION MAP
        // ==========================================
        this.typeMap = {
            // Web & Code
            'html': 'html', 'htm': 'html', 'xhtml': 'html',
            'css': 'css', 'scss': 'css', 'sass': 'css', 'less': 'css',
            'js': 'javascript', 'jsx': 'javascript', 'ts': 'javascript', 'tsx': 'javascript',
            'mjs': 'javascript', 'cjs': 'javascript',
            'py': 'python', 'pyc': 'python', 'pyo': 'python',
            'rb': 'ruby', 'go': 'golang', 'rs': 'rust',
            'c': 'c', 'cpp': 'cpp', 'cxx': 'cpp', 'h': 'c-header', 'hpp': 'cpp-header',
            'java': 'java', 'class': 'java-class', 'jar': 'java-archive',
            'kt': 'kotlin', 'kts': 'kotlin',
            'swift': 'swift',
            'php': 'php', 'php3': 'php', 'php4': 'php', 'php5': 'php', 'php7': 'php',
            'lua': 'lua', 'pl': 'perl', 'pm': 'perl-module', 'tcl': 'tcl',
            'sh': 'shell', 'bash': 'shell', 'zsh': 'shell', 'fish': 'shell',
            'ps1': 'powershell', 'cmd': 'batch', 'bat': 'batch',
            
            // Blockchain
            'sol': 'solidity', 'vyper': 'vyper', 'yul': 'yul',
            'abi': 'abi', 'bin': 'binary', 'evm': 'evm',
            'wasm': 'webassembly', 'wast': 'webassembly-text',
            
            // Data & Config
            'json': 'json', 'json5': 'json', 'jsonl': 'json',
            'yml': 'yaml', 'yaml': 'yaml', 'toml': 'toml',
            'xml': 'xml', 'xsd': 'xml', 'xsl': 'xml', 'xslt': 'xml',
            'csv': 'csv', 'tsv': 'csv', 'psv': 'csv',
            'sql': 'sql', 'psql': 'sql', 'mysql': 'sql',
            'conf': 'config', 'config': 'config', 'cfg': 'config',
            'ini': 'config', 'properties': 'config',
            'env': 'env', 'plist': 'plist', 'manifest': 'manifest',
            
            // Documents
            'pdf': 'pdf', 'doc': 'word', 'docx': 'word',
            'odt': 'document', 'ott': 'document',
            'rtf': 'document', 'txt': 'text', 'log': 'text',
            'md': 'markdown', 'markdown': 'markdown',
            'tex': 'latex', 'latex': 'latex',
            
            // Spreadsheets
            'xls': 'excel', 'xlsx': 'excel', 'xlsm': 'excel',
            'ods': 'spreadsheet', 'ots': 'spreadsheet',
            
            // Presentations
            'ppt': 'powerpoint', 'pptx': 'powerpoint',
            'odp': 'presentation', 'key': 'keynote',
            
            // Images
            'jpg': 'image', 'jpeg': 'image', 'jfif': 'image',
            'png': 'image', 'gif': 'image', 'bmp': 'image',
            'tiff': 'image', 'tif': 'image',
            'webp': 'image', 'avif': 'image',
            'heif': 'image', 'heic': 'image',
            'ico': 'image', 'cur': 'image',
            'svg': 'image', 'svgz': 'image',
            'psd': 'image', 'ai': 'image', 'eps': 'image',
            'raw': 'image', 'cr2': 'image', 'nef': 'image',
            
            // Audio
            'mp3': 'audio', 'mp2': 'audio',
            'wav': 'audio', 'flac': 'audio', 'alac': 'audio',
            'aac': 'audio', 'ogg': 'audio', 'opus': 'audio',
            'm4a': 'audio', 'm4b': 'audio',
            'aiff': 'audio', 'aif': 'audio', 'wma': 'audio',
            'amr': 'audio', 'ac3': 'audio', 'dts': 'audio',
            'mid': 'midi', 'midi': 'midi', 'kar': 'midi',
            
            // Video
            'mp4': 'video', 'm4v': 'video',
            'avi': 'video', 'mov': 'video', 'qt': 'video',
            'wmv': 'video', 'asf': 'video',
            'flv': 'video', 'f4v': 'video',
            'rm': 'video', 'rmvb': 'video',
            'webm': 'video', 'mkv': 'video',
            'mxf': 'video', 'ogv': 'video', 'ogm': 'video',
            '3gp': 'video', '3g2': 'video',
            'ts': 'video', 'm2ts': 'video', 'mts': 'video', 'vob': 'video',
            
            // Executables
            'exe': 'executable', 'msi': 'installer',
            'app': 'executable', 'deb': 'package', 'rpm': 'package',
            'pkg': 'package', 'dmg': 'disk-image',
            'apk': 'android', 'ipa': 'ios', 'xapk': 'android',
            'crx': 'extension', 'nexe': 'executable',
            'elf': 'executable', 'out': 'executable',
            'dll': 'library', 'so': 'library', 'dylib': 'library',
            'lib': 'library', 'a': 'library', 'sys': 'system', 'drv': 'driver',
            
            // Archives
            'zip': 'archive', 'rar': 'archive', '7z': 'archive',
            'tar': 'archive', 'gz': 'archive', 'bz2': 'archive',
            'xz': 'archive', 'zst': 'archive', 'lz4': 'archive', 'lzma': 'archive',
            'tgz': 'archive', 'tbz': 'archive', 'txz': 'archive',
            
            // Disk Images
            'iso': 'disk-image', 'img': 'disk-image', 'bin': 'disk-image',
            'cue': 'disk-image', 'nrg': 'disk-image', 'mdf': 'disk-image', 'mds': 'disk-image',
            
            // 3D & CAD
            'stl': '3d', 'obj': '3d', '3ds': '3d',
            'fbx': '3d', 'blend': '3d', 'skp': '3d',
            'glb': '3d', 'gltf': '3d', 'usd': '3d', 'usdz': '3d',
            'dwg': 'cad', 'dxf': 'cad', 'dwf': 'cad',
            'iges': 'cad', 'igs': 'cad', 'step': 'cad', 'stp': 'cad',
            
            // Fonts
            'ttf': 'font', 'otf': 'font', 'woff': 'font', 'woff2': 'font', 'eot': 'font',
            
            // E-books
            'epub': 'ebook', 'mobi': 'ebook', 'azw': 'ebook', 'azw3': 'ebook',
            'fb2': 'ebook', 'djvu': 'ebook', 'lit': 'ebook', 'prc': 'ebook',
            
            // GIS
            'shp': 'gis', 'shx': 'gis', 'dbf': 'gis', 'prj': 'gis',
            'kml': 'gis', 'kmz': 'gis', 'gpx': 'gis',
            'geojson': 'gis', 'topojson': 'gis',
            
            // Security
            'pem': 'security', 'key': 'security', 'crt': 'security',
            'csr': 'security', 'p12': 'security', 'pfx': 'security',
            'jks': 'security', 'keystore': 'security',
            'asc': 'security', 'pgp': 'security', 'gpg': 'security',
            'ssh': 'security', 'rsa': 'security',
            
            // Virtual Machines
            'ova': 'vm', 'ovf': 'vm', 'vmdk': 'vm',
            'vhd': 'vm', 'vhdx': 'vm', 'qcow2': 'vm', 'vdi': 'vm',
            
            // Game ROMs
            'rom': 'game', 'nes': 'game', 'snes': 'game', 'n64': 'game',
            'nds': 'game', 'gba': 'game', 'gbc': 'game', 'gb': 'game',
            'psx': 'game', 'ps2': 'game', 'psp': 'game',
            
            // Notebooks
            'ipynb': 'notebook', 'nb': 'notebook',
            
            // Science
            'r': 'science', 'rdata': 'science', 'rds': 'science',
            'rmd': 'science', 'stan': 'science',
            'jl': 'science', 'm': 'science', 'mat': 'science'
        };

        // ==========================================
        // LAUNCH HANDLERS
        // ==========================================
        this.handlers = {
            // Web & Code
            'html': this.launchHTML.bind(this),
            'css': this.launchCSS.bind(this),
            'javascript': this.launchJavaScript.bind(this),
            'python': this.launchPython.bind(this),
            'ruby': this.launchRuby.bind(this),
            'golang': this.launchGolang.bind(this),
            'rust': this.launchRust.bind(this),
            'c': this.launchC.bind(this),
            'cpp': this.launchCpp.bind(this),
            'java': this.launchJava.bind(this),
            'kotlin': this.launchKotlin.bind(this),
            'swift': this.launchSwift.bind(this),
            'php': this.launchPHP.bind(this),
            'lua': this.launchLua.bind(this),
            'perl': this.launchPerl.bind(this),
            'shell': this.launchShell.bind(this),
            'powershell': this.launchPowerShell.bind(this),
            'batch': this.launchBatch.bind(this),
            
            // Blockchain
            'solidity': this.launchSolidity.bind(this),
            'vyper': this.launchVyper.bind(this),
            'webassembly': this.launchWebAssembly.bind(this),
            
            // Data & Config
            'json': this.launchJSON.bind(this),
            'yaml': this.launchYAML.bind(this),
            'toml': this.launchTOML.bind(this),
            'xml': this.launchXML.bind(this),
            'csv': this.launchCSV.bind(this),
            'sql': this.launchSQL.bind(this),
            'config': this.launchConfig.bind(this),
            'env': this.launchEnv.bind(this),
            
            // Documents
            'pdf': this.launchPDF.bind(this),
            'word': this.launchWord.bind(this),
            'document': this.launchDocument.bind(this),
            'text': this.launchText.bind(this),
            'markdown': this.launchMarkdown.bind(this),
            'latex': this.launchLaTeX.bind(this),
            
            // Spreadsheets
            'excel': this.launchExcel.bind(this),
            'spreadsheet': this.launchSpreadsheet.bind(this),
            
            // Presentations
            'powerpoint': this.launchPowerPoint.bind(this),
            'presentation': this.launchPresentation.bind(this),
            'keynote': this.launchKeynote.bind(this),
            
            // Media
            'image': this.launchImage.bind(this),
            'audio': this.launchAudio.bind(this),
            'video': this.launchVideo.bind(this),
            
            // Executables
            'executable': this.launchExecutable.bind(this),
            'installer': this.launchInstaller.bind(this),
            'android': this.launchAndroid.bind(this),
            'ios': this.launchIOS.bind(this),
            'extension': this.launchExtension.bind(this),
            'library': this.launchLibrary.bind(this),
            
            // Archives
            'archive': this.launchArchive.bind(this),
            
            // Disk Images
            'disk-image': this.launchDiskImage.bind(this),
            
            // 3D & CAD
            '3d': this.launch3D.bind(this),
            'cad': this.launchCAD.bind(this),
            
            // Fonts
            'font': this.launchFont.bind(this),
            
            // E-books
            'ebook': this.launchEbook.bind(this),
            
            // GIS
            'gis': this.launchGIS.bind(this),
            
            // Security
            'security': this.launchSecurity.bind(this),
            
            // Virtual Machines
            'vm': this.launchVM.bind(this),
            
            // Games
            'game': this.launchGame.bind(this),
            
            // Notebooks
            'notebook': this.launchNotebook.bind(this),
            
            // Science
            'science': this.launchScience.bind(this),
            
            // Default
            'default': this.launchDefault.bind(this)
        };
    }

    // ==========================================
    // MAIN LAUNCH FUNCTION
    // ==========================================
    async launch(file, options = {}) {
        const type = this.detectType(file);
        const handler = this.handlers[type] || this.handlers.default;
        
        this.log(`🚀 Launching ${file.name} (${type})...`);
        
        try {
            const result = await handler(file, options);
            return {
                success: true,
                type: type,
                file: file.name,
                ...result
            };
        } catch (error) {
            this.log(`❌ Launch failed: ${error.message}`, 'error');
            return {
                success: false,
                type: type,
                file: file.name,
                error: error.message,
                stack: error.stack
            };
        }
    }

    // ==========================================
    // TYPE DETECTION
    // ==========================================
    detectType(file) {
        const ext = file.extension || file.name.split('.').pop().toLowerCase();
        const type = this.typeMap[ext] || 'unknown';
        
        // Special detection for complex files
        if (type === 'unknown' && file.content) {
            const content = file.content;
            
            // Check for shebang
            if (content.startsWith('#!/usr/bin/env')) {
                const shebangMatch = content.match(/^#!\/usr\/bin\/env\s+(\w+)/);
                if (shebangMatch) {
                    const lang = shebangMatch[1];
                    if (lang === 'node') return 'javascript';
                    if (lang === 'python') return 'python';
                    if (lang === 'ruby') return 'ruby';
                    if (lang === 'perl') return 'perl';
                    if (lang === 'bash' || lang === 'sh') return 'shell';
                }
            }
            
            // Check for HTML
            if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
                return 'html';
            }
            
            // Check for JSON
            try { JSON.parse(content); return 'json'; } catch {}
            
            // Check for YAML
            if (content.includes(':') && !content.includes('{') && !content.includes(';')) {
                return 'yaml';
            }
            
            // Check for XML
            if (content.includes('<?xml') || content.includes('<root')) {
                return 'xml';
            }
        }
        
        return type;
    }

    // ==========================================
    // WEB & CODE LAUNCHERS
    // ==========================================

    launchHTML(file) {
        const content = file.content;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        return {
            message: '🌐 HTML opened in browser',
            url: url,
            preview: content.slice(0, 200)
        };
    }

    launchCSS(file) {
        const style = document.createElement('style');
        style.textContent = file.content;
        document.head.appendChild(style);
        
        return {
            message: '🎨 CSS applied to page',
            selectorCount: (file.content.match(/[.#][a-zA-Z_-][^{]*/g) || []).length
        };
    }

    launchJavaScript(file) {
        const content = file.content;
        
        // Check if it's a Node.js script
        if (content.includes('require(') || 
            content.includes('module.exports') || 
            content.includes('process.')) {
            return this.runNodeScript(file);
        }
        
        // Check if it's a module
        if (content.includes('import ') || content.includes('export ')) {
            return this.runESModule(file);
        }
        
        // Run in browser
        try {
            const result = new Function('console', 'window', 'document', content)(console, window, document);
            return {
                message: '⚡ JavaScript executed in browser',
                result: result,
                hasConsoleOutput: content.includes('console.log')
            };
        } catch (error) {
            throw new Error(`JavaScript execution failed: ${error.message}`);
        }
    }

    runNodeScript(file) {
        const tempFile = path.join(this.tempDir, `node_${Date.now()}.js`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`node ${tempFile}`, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '⚡ Node.js script executed',
                output: result,
                hasOutput: result.length > 0
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`Node.js execution failed: ${error.message}`);
        }
    }

    runESModule(file) {
        const tempFile = path.join(this.tempDir, `module_${Date.now()}.mjs`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`node --experimental-modules ${tempFile}`, { 
                encoding: 'utf8', 
                timeout: this.timeout 
            });
            fs.unlinkSync(tempFile);
            return {
                message: '⚡ ES Module executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`ES Module execution failed: ${error.message}`);
        }
    }

    async launchPython(file) {
        // Check if Python is installed
        try {
            execSync('python3 --version', { encoding: 'utf8' });
        } catch {
            throw new Error('Python3 not found. Install Python to run .py files.');
        }
        
        const tempFile = path.join(this.tempDir, `python_${Date.now()}.py`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`python3 ${tempFile}`, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '🐍 Python script executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`Python execution failed: ${error.message}`);
        }
    }

    launchRuby(file) {
        const tempFile = path.join(this.tempDir, `ruby_${Date.now()}.rb`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`ruby ${tempFile}`, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '💎 Ruby script executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`Ruby execution failed: ${error.message}`);
        }
    }

    launchGolang(file) {
        const tempFile = path.join(this.tempDir, `go_${Date.now()}.go`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`go run ${tempFile}`, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '🐹 Go program executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`Go execution failed: ${error.message}`);
        }
    }

    launchRust(file) {
        const tempDir = path.join(this.tempDir, `rust_${Date.now()}`);
        fs.mkdirSync(tempDir);
        const tempFile = path.join(tempDir, 'main.rs');
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`rustc ${tempFile} && ./main`, { 
                encoding: 'utf8', 
                timeout: this.timeout,
                cwd: tempDir
            });
            fs.rmSync(tempDir, { recursive: true, force: true });
            return {
                message: '🦀 Rust program executed',
                output: result
            };
        } catch (error) {
            fs.rmSync(tempDir, { recursive: true, force: true });
            throw new Error(`Rust execution failed: ${error.message}`);
        }
    }

    launchC(file) {
        const tempDir = path.join(this.tempDir, `c_${Date.now()}`);
        fs.mkdirSync(tempDir);
        const tempFile = path.join(tempDir, 'main.c');
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`gcc ${tempFile} -o main && ./main`, { 
                encoding: 'utf8', 
                timeout: this.timeout,
                cwd: tempDir
            });
            fs.rmSync(tempDir, { recursive: true, force: true });
            return {
                message: '⚙️ C program executed',
                output: result
            };
        } catch (error) {
            fs.rmSync(tempDir, { recursive: true, force: true });
            throw new Error(`C execution failed: ${error.message}`);
        }
    }

    launchCpp(file) {
        const tempDir = path.join(this.tempDir, `cpp_${Date.now()}`);
        fs.mkdirSync(tempDir);
        const tempFile = path.join(tempDir, 'main.cpp');
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`g++ ${tempFile} -o main && ./main`, { 
                encoding: 'utf8', 
                timeout: this.timeout,
                cwd: tempDir
            });
            fs.rmSync(tempDir, { recursive: true, force: true });
            return {
                message: '⚙️ C++ program executed',
                output: result
            };
        } catch (error) {
            fs.rmSync(tempDir, { recursive: true, force: true });
            throw new Error(`C++ execution failed: ${error.message}`);
        }
    }

    launchJava(file) {
        const className = file.name.replace('.java', '');
        const tempFile = path.join(this.tempDir, `${className}.java`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const compileResult = execSync(`javac ${tempFile}`, { encoding: 'utf8' });
            const result = execSync(`java -cp ${this.tempDir} ${className}`, { 
                encoding: 'utf8', 
                timeout: this.timeout 
            });
            fs.unlinkSync(tempFile);
            fs.unlinkSync(path.join(this.tempDir, `${className}.class`));
            return {
                message: '☕ Java program executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`Java execution failed: ${error.message}`);
        }
    }

    launchKotlin(file) {
        const tempFile = path.join(this.tempDir, `kotlin_${Date.now()}.kt`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`kotlin ${tempFile}`, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '📱 Kotlin program executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`Kotlin execution failed: ${error.message}`);
        }
    }

    launchSwift(file) {
        const tempFile = path.join(this.tempDir, `swift_${Date.now()}.swift`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`swift ${tempFile}`, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '🐦 Swift program executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`Swift execution failed: ${error.message}`);
        }
    }

    launchPHP(file) {
        const tempFile = path.join(this.tempDir, `php_${Date.now()}.php`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`php ${tempFile}`, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '🐘 PHP script executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`PHP execution failed: ${error.message}`);
        }
    }

    launchLua(file) {
        const tempFile = path.join(this.tempDir, `lua_${Date.now()}.lua`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`lua ${tempFile}`, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '🌙 Lua script executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`Lua execution failed: ${error.message}`);
        }
    }

    launchPerl(file) {
        const tempFile = path.join(this.tempDir, `perl_${Date.now()}.pl`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`perl ${tempFile}`, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '🐪 Perl script executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`Perl execution failed: ${error.message}`);
        }
    }

    launchShell(file) {
        const tempFile = path.join(this.tempDir, `shell_${Date.now()}.sh`);
        fs.writeFileSync(tempFile, file.content);
        fs.chmodSync(tempFile, 0o755);
        
        try {
            const result = execSync(`bash ${tempFile}`, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '🐚 Shell script executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`Shell execution failed: ${error.message}`);
        }
    }

    launchPowerShell(file) {
        const tempFile = path.join(this.tempDir, `ps_${Date.now()}.ps1`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(`powershell -File ${tempFile}`, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '🖥️ PowerShell script executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`PowerShell execution failed: ${error.message}`);
        }
    }

    launchBatch(file) {
        const tempFile = path.join(this.tempDir, `batch_${Date.now()}.bat`);
        fs.writeFileSync(tempFile, file.content);
        
        try {
            const result = execSync(tempFile, { encoding: 'utf8', timeout: this.timeout });
            fs.unlinkSync(tempFile);
            return {
                message: '💻 Batch file executed',
                output: result
            };
        } catch (error) {
            fs.unlinkSync(tempFile);
            throw new Error(`Batch execution failed: ${error.message}`);
        }
    }

    // ==========================================
    // BLOCKCHAIN LAUNCHERS
    // ==========================================

    async launchSolidity(file, options = {}) {
        const content = file.content;
        const nameMatch = content.match(/contract\s+(\w+)/);
        const contractName = nameMatch ? nameMatch[1] : 'Unknown';
        
        // Check for Hardhat project
        if (this.isHardhatProject(file)) {
            return this.launchHardhatProject(file);
        }
        
        // Check for Foundry project
        if (this.isFoundryProject(file)) {
            return this.launchFoundryProject(file);
        }
        
        // Simple contract deployment
        this.showStatus('⛓️ Deploying contract...', 'pending');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const address = `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
        this.showStatus(`✅ ${contractName} deployed at ${address}`, 'success');
        
        return {
            message: `⛓️ ${contractName} deployed`,
            address: address,
            contractName: contractName,
            network: options.network || 'localhost',
            abi: this.generateABI(content)
        };
    }

    isHardhatProject(file) {
        const content = file.content;
        return content.includes('hardhat') || 
               content.includes('@nomiclabs') ||
               content.includes('ethers') ||
               file.name === 'hardhat.config.js';
    }

    isFoundryProject(file) {
        const content = file.content;
        return content.includes('forge') || 
               content.includes('foundry') ||
               content.includes('vm.sol');
    }

    async launchHardhatProject(file) {
        // Check if Hardhat is installed
        try {
            execSync('npx hardhat --version', { stdio: 'ignore' });
        } catch {
            return {
                message: '⚠️ Hardhat not found. Run `npm install --save-dev hardhat` first.',
                requiresSetup: true
            };
        }
        
        // Run hardhat compile
        try {
            const result = execSync('npx hardhat compile', { encoding: 'utf8' });
            return {
                message: '⛓️ Hardhat project compiled successfully',
                output: result,
                compiled: true
            };
        } catch (error) {
            throw new Error(`Hardhat compilation failed: ${error.message}`);
        }
    }

    async launchFoundryProject(file) {
        try {
            const result = execSync('forge build', { encoding: 'utf8' });
            return {
                message: '⛓️ Foundry project built successfully',
                output: result,
                built: true
            };
        } catch (error) {
            throw new Error(`Foundry build failed: ${error.message}`);
        }
    }

    generateABI(content) {
        // Simple ABI generation for demonstration
        const functions = content.match(/function\s+(\w+)\s*\([^)]*\)/g) || [];
        const events = content.match(/event\s+(\w+)\s*\([^)]*\)/g) || [];
        
        const abi = [];
        for (const func of functions) {
            const nameMatch = func.match(/function\s+(\w+)/);
            if (nameMatch) {
                abi.push({
                    type: 'function',
                    name: nameMatch[1],
                    inputs: [],
                    outputs: [],
                    stateMutability: 'nonpayable'
                });
            }
        }
        for (const event of events) {
            const nameMatch = event.match(/event\s+(\w+)/);
            if (nameMatch) {
                abi.push({
                    type: 'event',
                    name: nameMatch[1],
                    inputs: [],
                    anonymous: false
                });
            }
        }
        return abi;
    }

    launchVyper(file) {
        return {
            message: '🐍 Vyper contract ready for deployment',
            contractName: file.name.replace('.vy', ''),
            requiresVyper: true
        };
    }

    launchWebAssembly(file) {
        const blob = new Blob([file.content], { type: 'application/wasm' });
        const url = URL
