export default class BinaryHandler {
    constructor() {
        this.binaryTypes = {
            'exe': { name: 'Windows Executable', category: 'executable' },
            'msi': { name: 'Windows Installer', category: 'executable' },
            'app': { name: 'Mac Application', category: 'executable' },
            'deb': { name: 'Debian Package', category: 'executable' },
            'rpm': { name: 'RPM Package', category: 'executable' },
            'pkg': { name: 'Package Installer', category: 'executable' },
            'dmg': { name: 'Disk Image', category: 'disk-image' },
            'apk': { name: 'Android Package', category: 'executable' },
            'ipa': { name: 'iOS App Package', category: 'executable' },
            'xapk': { name: 'Android XAPK', category: 'executable' },
            'crx': { name: 'Chrome Extension', category: 'executable' },
            'nexe': { name: 'Node Executable', category: 'executable' },
            'elf': { name: 'Linux Executable', category: 'executable' },
            'out': { name: 'Compiled Binary', category: 'binary' },
            'o': { name: 'Object File', category: 'binary' },
            'obj': { name: 'Object File', category: 'binary' },
            'lib': { name: 'Library', category: 'binary' },
            'a': { name: 'Static Library', category: 'binary' },
            'so': { name: 'Shared Library', category: 'binary' },
            'dylib': { name: 'Dynamic Library', category: 'binary' },
            'dll': { name: 'Dynamic Link Library', category: 'binary' },
            'sys': { name: 'System File', category: 'binary' },
            'drv': { name: 'Driver', category: 'binary' },
            'bin': { name: 'Binary File', category: 'binary' },
            'iso': { name: 'ISO Image', category: 'disk-image' },
            'img': { name: 'Disk Image', category: 'disk-image' },
            'zip': { name: 'ZIP Archive', category: 'archive' },
            'rar': { name: 'RAR Archive', category: 'archive' },
            '7z': { name: '7-Zip Archive', category: 'archive' },
            'tar': { name: 'TAR Archive', category: 'archive' },
            'gz': { name: 'GZIP Archive', category: 'archive' },
            'bz2': { name: 'BZIP2 Archive', category: 'archive' },
            'xz': { name: 'XZ Archive', category: 'archive' },
            'zst': { name: 'Zstandard Archive', category: 'archive' },
            'wasm': { name: 'WebAssembly Module', category: 'webassembly' },
            'wast': { name: 'WebAssembly Text', category: 'webassembly' }
        };

        this.magicBytes = {
            'pdf': '25504446',
            'zip': '504B0304',
            'rar': '52617221',
            '7z': '377ABCAF',
            'gz': '1F8B08',
            'bz2': '425A68',
            'xz': 'FD377A585A',
            'zst': '28B52FFD',
            'exe': '4D5A9000',
            'elf': '7F454C46',
            'wasm': '0061736D',
            'png': '89504E47',
            'jpg': 'FFD8FF',
            'gif': '47494638',
            'webp': '52494646',
            'mp3': 'FFFB',
            'mp4': '000000',
            'avi': '52494646',
            'wav': '52494646'
        };
    }

    analyze(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        const typeInfo = this.binaryTypes[ext] || { 
            name: 'Unknown Binary', 
            category: 'binary' 
        };

        let size = file.size;
        let isExecutable = this.isExecutable(ext);
        let isArchive = this.isArchive(ext);
        let isCompressed = this.isCompressed(ext);

        // Try to detect magic bytes if we have the content
        let detectedType = 'unknown';
        if (file.content && file.content instanceof ArrayBuffer) {
            detectedType = this.detectMagicBytes(new Uint8Array(file.content));
        }

        return {
            type: 'binary',
            category: typeInfo.category,
            name: typeInfo.name,
            extension: ext,
            size: size,
            formattedSize: this.formatSize(size),
            isExecutable: isExecutable,
            isArchive: isArchive,
            isCompressed: isCompressed,
            detectedType: detectedType,
            complexity: 'simple',
            preview: `Binary file: ${typeInfo.name} (${this.formatSize(size)})`,
            metadata: {
                extension: ext,
                category: typeInfo.category,
                isExecutable: isExecutable,
                isArchive: isArchive,
                isCompressed: isCompressed
            }
        };
    }

    detectMagicBytes(buffer) {
        const hex = Array.from(buffer.slice(0, 8))
            .map(b => b.toString(16).padStart(2, '0').toUpperCase())
            .join('');
        
        for (const [type, magic] of Object.entries(this.magicBytes)) {
            if (hex.startsWith(magic)) {
                return type;
            }
        }
        return 'unknown';
    }

    isExecutable(ext) {
        return ['exe', 'msi', 'app', 'deb', 'rpm', 'pkg', 'apk', 'ipa', 'xapk', 
                'crx', 'nexe', 'elf', 'out'].includes(ext);
    }

    isArchive(ext) {
        return ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'zst', 'lz4', 'lzma', 
                'tgz', 'tbz', 'txz', 'zipx', 'sitx', 'arj', 'zoo', 'lzh'].includes(ext);
    }

    isCompressed(ext) {
        return ['gz', 'bz2', 'xz', 'zst', 'lz4', 'lzma', 'zip', 'rar', '7z'].includes(ext);
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async extractMetadata(file) {
        // For binary files, we can extract limited metadata
        return {
            fileName: file.name,
            fileSize: file.size,
            extension: file.name.split('.').pop().toLowerCase(),
            isExecutable: this.isExecutable(file.name.split('.').pop().toLowerCase()),
            isArchive: this.isArchive(file.name.split('.').pop().toLowerCase())
        };
    }
}
