// ============================================
// ARCHIVE HANDLER
// Complete Archive File Processing
// ============================================

export default class ArchiveHandler {
    constructor() {
        // ==========================================
        // ARCHIVE PATTERNS
        // ==========================================
        this.patterns = {
            // Archive extensions
            zip: /\.zip$/i,
            rar: /\.rar$/i,
            '7z': /\.7z$/i,
            tar: /\.tar$/i,
            gz: /\.gz$/i,
            bz2: /\.bz2$/i,
            xz: /\.xz$/i,
            zst: /\.zst$/i,
            lz4: /\.lz4$/i,
            lzma: /\.lzma$/i,
            tgz: /\.tgz$/i,
            tbz: /\.tbz$/i,
            txz: /\.txz$/i,
            
            // Magic bytes (file signatures)
            zipMagic: /PK\x03\x04/,
            rarMagic: /Rar!\x1a\x07/,
            '7zMagic': /7z\xbc\xaf\x27\x1c/,
            gzMagic: /\x1f\x8b\x08/,
            bz2Magic: /BZh/,
            xzMagic: /\xfd7zXZ/,
            zstMagic: /\x28\xb5\x2f\xfd/,
            
            // File names
            readme: /readme/i,
            license: /license/i,
            changelog: /changelog/i,
            manifest: /manifest/i,
            
            // Metadata
            created: /created|date/i,
            modified: /modified|updated/i,
            size: /size|length/i,
            compression: /compression|method/i
        };
        
        // ==========================================
        // ARCHIVE TYPES
        // ==========================================
        this.archiveTypes = {
            zip: {
                name: 'ZIP Archive',
                extension: 'zip',
                mime: 'application/zip',
                isCompressed: true,
                supports: ['deflate', 'store', 'bzip2', 'lzma']
            },
            rar: {
                name: 'RAR Archive',
                extension: 'rar',
                mime: 'application/x-rar-compressed',
                isCompressed: true,
                supports: ['store', 'fast', 'normal', 'good', 'best']
            },
            '7z': {
                name: '7-Zip Archive',
                extension: '7z',
                mime: 'application/x-7z-compressed',
                isCompressed: true,
                supports: ['lzma2', 'lzma', 'ppmd', 'bzip2', 'deflate']
            },
            tar: {
                name: 'TAR Archive',
                extension: 'tar',
                mime: 'application/x-tar',
                isCompressed: false,
                supports: ['ustar', 'gnu', 'posix']
            },
            gz: {
                name: 'GZIP Archive',
                extension: 'gz',
                mime: 'application/gzip',
                isCompressed: true,
                supports: ['deflate']
            },
            bz2: {
                name: 'BZIP2 Archive',
                extension: 'bz2',
                mime: 'application/x-bzip2',
                isCompressed: true,
                supports: ['bzip2']
            },
            xz: {
                name: 'XZ Archive',
                extension: 'xz',
                mime: 'application/x-xz',
                isCompressed: true,
                supports: ['lzma2']
            },
            zst: {
                name: 'Zstandard Archive',
                extension: 'zst',
                mime: 'application/zstd',
                isCompressed: true,
                supports: ['zstd']
            },
            lz4: {
                name: 'LZ4 Archive',
                extension: 'lz4',
                mime: 'application/x-lz4',
                isCompressed: true,
                supports: ['lz4']
            },
            lzma: {
                name: 'LZMA Archive',
                extension: 'lzma',
                mime: 'application/x-lzma',
                isCompressed: true,
                supports: ['lzma']
            },
            tgz: {
                name: 'TAR.GZ Archive',
                extension: 'tgz',
                mime: 'application/x-compressed-tar',
                isCompressed: true,
                supports: ['deflate']
            },
            tbz: {
                name: 'TAR.BZ2 Archive',
                extension: 'tbz',
                mime: 'application/x-compressed-tar',
                isCompressed: true,
                supports: ['bzip2']
            },
            txz: {
                name: 'TAR.XZ Archive',
                extension: 'txz',
                mime: 'application/x-compressed-tar',
                isCompressed: true,
                supports: ['lzma2']
            }
        };
        
        // ==========================================
        // COMPRESSION LEVELS
        // ==========================================
        this.compressionLevels = {
            'store': 0,
            'fast': 1,
            'normal': 3,
            'good': 5,
            'best': 9,
            'ultra': 10
        };
    }

    // ==========================================
    // MAIN ANALYSIS
    // ==========================================
    analyze(content, filename) {
        const extension = this.getExtension(filename);
        const typeInfo = this.archiveTypes[extension] || this.archiveTypes.zip;
        
        const analysis = {
            type: 'archive',
            name: filename,
            extension: extension,
            format: typeInfo.name,
            mimeType: typeInfo.mime,
            isCompressed: typeInfo.isCompressed,
            lines: 0,
            characters: content ? content.length : 0,
            timestamp: new Date().toISOString(),
            
            // Structure
            structure: this.analyzeStructure(content, filename),
            metadata: this.analyzeMetadata(content),
            
            // Content
            content: this.analyzeContent(content, filename),
            
            // Quality
            quality: this.analyzeQuality(content, filename),
            
            // Security
            security: this.analyzeSecurity(content, filename),
            
            // Preview
            preview: this.getPreview(content, 200)
        };
        
        // Calculate score
        analysis.score = this.calculateScore(analysis);
        
        return analysis;
    }

    // ==========================================
    // STRUCTURE ANALYSIS
    // ==========================================
    analyzeStructure(content, filename) {
        const structure = {
            hasFileList: false,
            hasDirectories: false,
            hasNested: false,
            fileCount: 0,
            directoryCount: 0,
            totalSize: 0
        };

        // Try to detect if archive has content
        if (content) {
            // Check for file list patterns
            const filePatterns = content.match(/[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+/g) || [];
            if (filePatterns.length > 0) {
                structure.hasFileList = true;
                structure.fileCount = filePatterns.length;
                
                // Check for directories
                const dirPatterns = content.match(/[a-zA-Z0-9_\-.]+\//g) || [];
                if (dirPatterns.length > 0) {
                    structure.hasDirectories = true;
                    structure.directoryCount = dirPatterns.length;
                }
                
                // Check for nested structure
                const nestedPatterns = content.match(/[a-zA-Z0-9_\-.]+\/[a-zA-Z0-9_\-.]+\//g) || [];
                if (nestedPatterns.length > 0) {
                    structure.hasNested = true;
                }
            }
        }

        return structure;
    }

    // ==========================================
    // METADATA ANALYSIS
    // ==========================================
    analyzeMetadata(content) {
        const metadata = {
            hasReadme: false,
            hasLicense: false,
            hasChangelog: false,
            hasManifest: false,
            fileCount: 0,
            totalSize: 0,
            createdDate: null,
            modifiedDate: null,
            compressionMethod: null
        };

        if (content) {
            // Check for common files
            if (this.patterns.readme.test(content)) {
                metadata.hasReadme = true;
            }
            if (this.patterns.license.test(content)) {
                metadata.hasLicense = true;
            }
            if (this.patterns.changelog.test(content)) {
                metadata.hasChangelog = true;
            }
            if (this.patterns.manifest.test(content)) {
                metadata.hasManifest = true;
            }

            // Try to extract file count
            const fileMatches = content.match(/[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+/g) || [];
            metadata.fileCount = fileMatches.length;
        }

        return metadata;
    }

    // ==========================================
    // CONTENT ANALYSIS
    // ==========================================
    analyzeContent(content, filename) {
        const result = {
            files: [],
            directories: [],
            totalFiles: 0,
            totalDirectories: 0,
            largestFiles: [],
            fileTypes: {}
        };

        if (!content) return result;

        // Extract files
        const fileMatches = content.match(/[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+/g) || [];
        const dirMatches = content.match(/[a-zA-Z0-9_\-.]+\//g) || [];
        
        result.totalFiles = fileMatches.length;
        result.totalDirectories = dirMatches.length;
        result.files = fileMatches.slice(0, 10); // First 10 files
        result.directories = dirMatches.slice(0, 10); // First 10 directories

        // Count file types
        const typeCount = {};
        for (const file of fileMatches) {
            const ext = file.split('.').pop().toLowerCase();
            typeCount[ext] = (typeCount[ext] || 0) + 1;
        }
        result.fileTypes = typeCount;

        return result;
    }

    // ==========================================
    // QUALITY ANALYSIS
    // ==========================================
    analyzeQuality(content, filename) {
        const issues = [];
        let score = 100;
        const extension = this.getExtension(filename);

        // Check if archive is empty
        if (!content || content.length < 100) {
            issues.push('Archive appears to be empty or very small');
            score -= 20;
        }

        // Check for valid archive format
        if (!this.isValidArchive(content, extension)) {
            issues.push('Archive may be corrupt or invalid');
            score -= 30;
        }

        // Check for compression ratio
        const compressionRatio = this.estimateCompressionRatio(content);
        if (compressionRatio < 0.1) {
            issues.push('Poor compression ratio - may not be compressed effectively');
            score -= 10;
        }

        // Check for file count
        const fileCount = (content.match(/[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+/g) || []).length;
        if (fileCount === 0) {
            issues.push('No files detected in archive');
            score -= 15;
        } else if (fileCount > 1000) {
            issues.push('Archive contains many files (>1000) - may be slow to extract');
            score -= 5;
        }

        // Check for file name length
        const fileNames = content.match(/[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+/g) || [];
        const longNames = fileNames.filter(name => name.length > 100);
        if (longNames.length > 0) {
            issues.push('Very long file names detected (>100 chars) - potential compatibility issues');
            score -= 3;
        }

        return {
            issues: issues,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: issues.length > 0
        };
    }

    // ==========================================
    // SECURITY ANALYSIS
    // ==========================================
    analyzeSecurity(content, filename) {
        const issues = [];
        let score = 100;

        // Check for suspicious file extensions
        const suspiciousExts = ['exe', 'dll', 'scr', 'bat', 'cmd', 'vbs', 'js', 'jar', 'apk'];
        const fileMatches = content.match(/[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+/g) || [];
        
        const suspiciousFiles = fileMatches.filter(file => {
            const ext = file.split('.').pop().toLowerCase();
            return suspiciousExts.includes(ext);
        });

        if (suspiciousFiles.length > 0) {
            issues.push(`Suspicious files detected: ${suspiciousFiles.slice(0, 5).join(', ')}${suspiciousFiles.length > 5 ? '...' : ''}`);
            score -= 15;
        }

        // Check for excessive path depth
        const deepPaths = fileMatches.filter(file => (file.match(/\//g) || []).length > 5);
        if (deepPaths.length > 0) {
            issues.push('Deep directory structure detected - potential extraction issues');
            score -= 5;
        }

        // Check for potentially malicious patterns
        const maliciousPatterns = [
            /\.\.\/\.\.\//, // Path traversal
            /[<>:"|?*]/,    // Invalid characters
            /^\._/         // Mac resource fork
        ];

        for (const pattern of maliciousPatterns) {
            if (pattern.test(content)) {
                issues.push('Potentially malicious file patterns detected');
                score -= 10;
                break;
            }
        }

        return {
            issues: issues,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: issues.length > 0
        };
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================
    
    getExtension(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        // Handle multi-part extensions like .tar.gz
        const parts = filename.split('.');
        if (parts.length > 2) {
            const lastTwo = parts.slice(-2).join('.');
            if (['tar.gz', 'tar.bz2', 'tar.xz', 'tar.zst'].includes(lastTwo)) {
                return lastTwo;
            }
        }
        return ext;
    }

    isValidArchive(content, extension) {
        if (!content) return false;
        
        // Check magic bytes based on extension
        switch (extension) {
            case 'zip':
                return this.patterns.zipMagic.test(content);
            case 'rar':
                return this.patterns.rarMagic.test(content);
            case '7z':
                return this.patterns['7zMagic'].test(content);
            case 'gz':
            case 'tgz':
                return this.patterns.gzMagic.test(content);
            case 'bz2':
            case 'tbz':
                return this.patterns.bz2Magic.test(content);
            case 'xz':
            case 'txz':
                return this.patterns.xzMagic.test(content);
            case 'zst':
                return this.patterns.zstMagic.test(content);
            default:
                return true; // Unknown format
        }
    }

    estimateCompressionRatio(content) {
        if (!content) return 0;
        // Simple estimation based on entropy
        const uniqueChars = new Set(content).size;
        const totalChars = content.length;
        return uniqueChars / totalChars;
    }

    getPreview(content, length = 200) {
        if (!content) return 'No content available';
        const preview = content.slice(0, length);
        return preview + (content.length > length ? '...' : '');
    }

    calculateScore(analysis) {
        let score = 100;
        
        // Quality penalties
        if (analysis.quality.hasIssues) {
            score -= analysis.quality.issues.length * 2;
        }
        
        // Security penalties
        if (analysis.security.hasIssues) {
            score -= analysis.security.issues.length * 3;
        }
        
        // Add bonuses
        if (analysis.structure.hasFileList) score += 10;
        if (analysis.structure.fileCount > 0) score += 5;
        if (analysis.metadata.hasReadme) score += 3;
        if (analysis.metadata.hasLicense) score += 3;
        if (analysis.metadata.hasChangelog) score += 2;
        if (analysis.metadata.hasManifest) score += 2;
        if (analysis.content.totalFiles > 10) score += 5;
        if (analysis.content.totalDirectories > 0) score += 3;
        
        return Math.max(0, Math.min(100, score));
    }

    // ==========================================
    // EXTRACTION METHODS (PLACEHOLDER)
    // ==========================================
    
    // Note: Full extraction would require external libraries
    // These methods are placeholders for future implementation
    
    async extract(file, targetPath) {
        // Placeholder - would use libraries like adm-zip, node-7z, etc.
        return {
            success: true,
            message: 'Extraction would happen here with proper libraries',
            files: [],
            totalSize: 0
        };
    }

    async listContents(file) {
        // Placeholder - would list archive contents
        return {
            success: true,
            files: [],
            directories: [],
            totalFiles: 0,
            totalSize: 0
        };
    }

    async testArchive(file) {
        // Placeholder - would test archive integrity
        return {
            success: true,
            valid: true,
            errors: [],
            warnings: []
        };
    }
}

export default ArchiveHandler;
