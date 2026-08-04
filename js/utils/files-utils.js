export class FileUtils {
    // Complete file type detection map
    static FILE_TYPES = {
        // Web & Code
        'html': 'web',
        'htm': 'web',
        'xhtml': 'web',
        'css': 'web',
        'scss': 'web',
        'sass': 'web',
        'less': 'web',
        'js': 'code',
        'jsx': 'code',
        'ts': 'code',
        'tsx': 'code',
        'json': 'data',
        'json5': 'data',
        'yml': 'config',
        'yaml': 'config',
        'toml': 'config',
        'xml': 'data',
        'xsd': 'data',
        'xsl': 'data',
        'xslt': 'data',

        // Languages
        'py': 'code',
        'pyc': 'binary',
        'pyo': 'binary',
        'rb': 'code',
        'go': 'code',
        'rs': 'code',
        'rslib': 'code',
        'c': 'code',
        'cpp': 'code',
        'cxx': 'code',
        'h': 'code',
        'hpp': 'code',
        'java': 'code',
        'class': 'binary',
        'jar': 'archive',
        'kt': 'code',
        'kts': 'code',
        'swift': 'code',
        'php': 'code',
        'php3': 'code',
        'php4': 'code',
        'php5': 'code',
        'php7': 'code',
        'phar': 'archive',
        'lua': 'code',
        'pl': 'code',
        'pm': 'code',
        'tcl': 'code',
        'sh': 'script',
        'bash': 'script',
        'zsh': 'script',
        'fish': 'script',
        'ps1': 'script',
        'psm1': 'script',
        'cmd': 'script',
        'bat': 'script',

        // Solidity & Blockchain
        'sol': 'blockchain',
        'vyper': 'blockchain',
        'yul': 'blockchain',
        'abi': 'data',
        'bin': 'binary',
        'evm': 'binary',
        'wasm': 'webassembly',
        'wast': 'webassembly',

        // Executables & Binaries
        'exe': 'executable',
        'msi': 'executable',
        'app': 'executable',
        'deb': 'executable',
        'rpm': 'executable',
        'pkg': 'executable',
        'dmg': 'executable',
        'apk': 'executable',
        'ipa': 'executable',
        'xapk': 'executable',
        'crx': 'executable',
        'nexe': 'executable',
        'elf': 'executable',
        'out': 'executable',
        'o': 'binary',
        'obj': 'binary',
        'lib': 'binary',
        'a': 'binary',
        'so': 'binary',
        'dylib': 'binary',
        'dll': 'binary',
        'sys': 'binary',
        'drv': 'binary',

        // Archives & Compressed
        'zip': 'archive',
        'rar': 'archive',
        '7z': 'archive',
        'tar': 'archive',
        'gz': 'archive',
        'bz2': 'archive',
        'xz': 'archive',
        'zst': 'archive',
        'lz4': 'archive',
        'lzma': 'archive',
        'tgz': 'archive',
        'tbz': 'archive',
        'txz': 'archive',
        'zipx': 'archive',
        'sitx': 'archive',
        'arj': 'archive',
        'zoo': 'archive',
        'lzh': 'archive',
        'iso': 'disk-image',
        'img': 'disk-image',
        'dmg': 'disk-image',
        'pkg': 'executable',
        'bin': 'binary',
        'cue': 'disk-image',
        'nrg': 'disk-image',
        'mdf': 'disk-image',
        'mds': 'disk-image',

        // Documents & Office
        'pdf': 'document',
        'doc': 'document',
        'docx': 'document',
        'dot': 'document',
        'dotx': 'document',
        'odt': 'document',
        'ott': 'document',
        'rtf': 'document',
        'txt': 'text',
        'log': 'text',
        'md': 'text',
        'markdown': 'text',
        'tex': 'document',
        'latex': 'document',
        'aux': 'document',
        'sty': 'document',
        'cls': 'document',
        'bib': 'document',
        'bst': 'document',

        // Spreadsheets & Data
        'xls': 'spreadsheet',
        'xlsx': 'spreadsheet',
        'xlsm': 'spreadsheet',
        'xlsb': 'spreadsheet',
        'ods': 'spreadsheet',
        'ots': 'spreadsheet',
        'csv': 'data',
        'tsv': 'data',
        'psv': 'data',
        'tab': 'data',
        'data': 'data',
        'dat': 'data',
        'db': 'database',
        'sqlite': 'database',
        'db3': 'database',
        'accdb': 'database',
        'mdb': 'database',
        'fdb': 'database',

        // Presentations
        'ppt': 'presentation',
        'pptx': 'presentation',
        'pps': 'presentation',
        'ppsx': 'presentation',
        'odp': 'presentation',
        'otp': 'presentation',
        'key': 'presentation',
        'theme': 'presentation',

        // Images
        'jpg': 'image',
        'jpeg': 'image',
        'jfif': 'image',
        'png': 'image',
        'gif': 'image',
        'bmp': 'image',
        'tiff': 'image',
        'tif': 'image',
        'webp': 'image',
        'avif': 'image',
        'heif': 'image',
        'heic': 'image',
        'ico': 'image',
        'cur': 'image',
        'svg': 'image',
        'svgz': 'image',
        'psd': 'image',
        'ai': 'image',
        'eps': 'image',
        'raw': 'image',
        'cr2': 'image',
        'nef': 'image',
        'arw': 'image',
        'dng': 'image',
        'orf': 'image',
        'raf': 'image',

        // Audio
        'mp3': 'audio',
        'mp2': 'audio',
        'wav': 'audio',
        'flac': 'audio',
        'alac': 'audio',
        'aac': 'audio',
        'ogg': 'audio',
        'opus': 'audio',
        'm4a': 'audio',
        'm4b': 'audio',
        'aiff': 'audio',
        'aif': 'audio',
        'wma': 'audio',
        'amr': 'audio',
        'ac3': 'audio',
        'dts': 'audio',
        'mid': 'audio',
        'midi': 'audio',
        'kar': 'audio',

        // Video
        'mp4': 'video',
        'm4v': 'video',
        'avi': 'video',
        'mov': 'video',
        'qt': 'video',
        'wmv': 'video',
        'asf': 'video',
        'flv': 'video',
        'f4v': 'video',
        'rm': 'video',
        'rmvb': 'video',
        'webm': 'video',
        'mkv': 'video',
        'mxf': 'video',
        'ogv': 'video',
        'ogm': 'video',
        '3gp': 'video',
        '3g2': 'video',
        'ts': 'video',
        'm2ts': 'video',
        'mts': 'video',
        'vob': 'video',

        // CAD & 3D
        'dwg': 'cad',
        'dxf': 'cad',
        'dwf': 'cad',
        'iges': 'cad',
        'igs': 'cad',
        'step': 'cad',
        'stp': 'cad',
        'stl': '3d',
        'obj': '3d',
        '3ds': '3d',
        'fbx': '3d',
        'blend': '3d',
        'skp': '3d',
        'glb': '3d',
        'gltf': '3d',
        'usd': '3d',
        'usdz': '3d',

        // Fonts
        'ttf': 'font',
        'otf': 'font',
        'woff': 'font',
        'woff2': 'font',
        'eot': 'font',
        'dfont': 'font',

        // E-books
        'epub': 'ebook',
        'mobi': 'ebook',
        'azw': 'ebook',
        'azw3': 'ebook',
        'fb2': 'ebook',
        'djvu': 'ebook',
        'lit': 'ebook',
        'prc': 'ebook',

        // GIS & Mapping
        'shp': 'gis',
        'shx': 'gis',
        'dbf': 'gis',
        'prj': 'gis',
        'qix': 'gis',
        'kml': 'gis',
        'kmz': 'gis',
        'gpx': 'gis',
        'geojson': 'gis',
        'topojson': 'gis',

        // Database & Data Exchange
        'sql': 'database',
        'psql': 'database',
        'mysql': 'database',
        'jsonl': 'data',
        'ndjson': 'data',
        'avro': 'data',
        'parquet': 'data',
        'feather': 'data',
        'arrow': 'data',
        'orc': 'data',
        'protobuf': 'data',
        'pb': 'data',
        'proto': 'data',

        // Configuration & System
        'conf': 'config',
        'config': 'config',
        'cfg': 'config',
        'ini': 'config',
        'properties': 'config',
        'env': 'config',
        'reg': 'config',
        'plist': 'config',
        'manifest': 'config',
        'lock': 'config',
        'lockfile': 'config',

        // Science & Research
        'ipynb': 'notebook',
        'r': 'code',
        'rdata': 'data',
        'rds': 'data',
        'rmd': 'document',
        'stan': 'code',
        'jl': 'code',
        'm': 'code',
        'mat': 'data',
        'nb': 'notebook',
        'model': 'data',

        // Game Files
        'rom': 'game',
        'nes': 'game',
        'snes': 'game',
        'n64': 'game',
        'nds': 'game',
        'gba': 'game',
        'gbc': 'game',
        'gb': 'game',
        'psx': 'game',
        'ps2': 'game',
        'psp': 'game',
        'wbfs': 'game',
        'ciso': 'game',

        // Security & Crypto
        'pem': 'security',
        'key': 'security',
        'crt': 'security',
        'csr': 'security',
        'p12': 'security',
        'pfx': 'security',
        'jks': 'security',
        'keystore': 'security',
        'asc': 'security',
        'pgp': 'security',
        'gpg': 'security',
        'ssh': 'security',
        'rsa': 'security',

        // Virtual Machine & Container
        'ova': 'virtual-machine',
        'ovf': 'virtual-machine',
        'vmdk': 'virtual-machine',
        'vhd': 'virtual-machine',
        'vhdx': 'virtual-machine',
        'raw': 'disk-image',
        'qcow2': 'virtual-machine',
        'vdi': 'virtual-machine'
    };

    // File category icons
    static ICONS = {
        'web': '🌐',
        'code': '💻',
        'data': '📊',
        'config': '⚙️',
        'binary': '💾',
        'archive': '📦',
        'script': '📜',
        'blockchain': '⛓️',
        'webassembly': '🦀',
        'executable': '⚡',
        'disk-image': '💿',
        'document': '📄',
        'text': '📝',
        'spreadsheet': '📊',
        'database': '🗄️',
        'presentation': '📽️',
        'image': '🖼️',
        'audio': '🎵',
        'video': '🎬',
        'cad': '📐',
        '3d': '🎲',
        'font': '🔤',
        'ebook': '📚',
        'gis': '🗺️',
        'notebook': '📓',
        'game': '🎮',
        'security': '🔒',
        'virtual-machine': '🖥️',
        'unknown': '📄'
    };

    static async readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            
            // Determine how to read based on file type
            const ext = this.getFileExtension(file.name);
            const type = this.getFileCategory(ext);
            
            // Binary files
            if (['binary', 'executable', 'archive', 'disk-image', 'virtual-machine', 
                 'image', 'audio', 'video', '3d', 'game'].includes(type)) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    static getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    static getFileCategory(extension) {
        return this.FILE_TYPES[extension] || 'unknown';
    }

    static getFileIcon(extension) {
        const category = this.getFileCategory(extension);
        return this.ICONS[category] || this.ICONS.unknown;
    }

    static isBinaryFile(filename) {
        const ext = this.getFileExtension(filename);
        const category = this.getFileCategory(ext);
        return ['binary', 'executable', 'archive', 'disk-image', 'virtual-machine', 
                'image', 'audio', 'video', '3d', 'game'].includes(category);
    }

    static formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static getMimeType(filename) {
        const ext = this.getFileExtension(filename);
        const mimeTypes = {
            'html': 'text/html',
            'css': 'text/css',
            'js': 'application/javascript',
            'json': 'application/json',
            'py': 'text/x-python',
            'sol': 'text/x-solidity',
            'xml': 'application/xml',
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
            'mp3': 'audio/mpeg',
            'mp4': 'video/mp4',
            'avi': 'video/x-msvideo',
            'mov': 'video/quicktime',
            'zip': 'application/zip',
            'rar': 'application/x-rar-compressed',
            '7z': 'application/x-7z-compressed',
            'tar': 'application/x-tar',
            'gz': 'application/gzip',
            'exe': 'application/x-msdownload',
            'dll': 'application/x-msdownload',
            'so': 'application/x-sharedlib',
            'apk': 'application/vnd.android.package-archive',
            'iso': 'application/x-iso9660-image',
            'wasm': 'application/wasm'
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }

    static isExecutable(filename) {
        const ext = this.getFileExtension(filename);
        return ['exe', 'msi', 'app', 'deb', 'rpm', 'pkg', 'dmg', 'apk', 'ipa', 'xapk', 
                'crx', 'nexe', 'elf', 'out', 'sh', 'bash', 'zsh', 'fish', 'ps1', 'cmd', 
                'bat', 'jar'].includes(ext);
    }

    static isArchive(filename) {
        const ext = this.getFileExtension(filename);
        return ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'zst', 'lz4', 'lzma', 
                'tgz', 'tbz', 'txz', 'zipx', 'sitx', 'arj', 'zoo', 'lzh'].includes(ext);
    }

    static isExecutableBinary(filename) {
        const ext = this.getFileExtension(filename);
        return ['exe', 'dll', 'so', 'dylib', 'sys', 'drv', 'bin'].includes(ext);
    }
}
