export default class ExecutableHandler {
    constructor() {
        this.executableTypes = {
            'exe': 'Windows Executable',
            'msi': 'Windows Installer',
            'app': 'macOS Application',
            'deb': 'Debian Package',
            'rpm': 'RPM Package',
            'pkg': 'Package Installer',
            'dmg': 'macOS Disk Image',
            'apk': 'Android Package',
            'ipa': 'iOS Application',
            'xapk': 'Android XAPK',
            'crx': 'Chrome Extension',
            'nexe': 'Node.js Executable',
            'elf': 'Linux Executable',
            'out': 'Compiled Binary',
            'sh': 'Shell Script',
            'bash': 'Bash Script',
            'zsh': 'Zsh Script',
            'fish': 'Fish Script',
            'ps1': 'PowerShell Script',
            'cmd': 'Command Script',
            'bat': 'Batch Script',
            'jar': 'Java Archive'
        };
    }

    analyze(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        const typeName = this.executableTypes[ext] || 'Unknown Executable';

        return {
            type: 'executable',
            name: typeName,
            extension: ext,
            size: file.size,
            formattedSize: this.formatSize(file.size),
            isScript: this.isScript(ext),
            isBinary: this.isBinaryExecutable(ext),
            isPackage: this.isPackage(ext),
            complexity: 'medium',
            preview: `Executable: ${typeName} (${this.formatSize(file.size)})`,
            metadata: {
                extension: ext,
                type: typeName,
                isScript: this.isScript(ext),
                isBinary: this.isBinaryExecutable(ext),
                isPackage: this.isPackage(ext)
            }
        };
    }

    isScript(ext) {
        return ['sh', 'bash', 'zsh', 'fish', 'ps1', 'cmd', 'bat'].includes(ext);
    }

    isBinaryExecutable(ext) {
        return ['exe', 'msi', 'app', 'deb', 'rpm', 'pkg', 'apk', 'ipa', 
                'xapk', 'crx', 'nexe', 'elf', 'out', 'jar'].includes(ext);
    }

    isPackage(ext) {
        return ['deb', 'rpm', 'pkg', 'apk', 'ipa', 'xapk', 'msi'].includes(ext);
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
