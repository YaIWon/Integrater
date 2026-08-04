// ============================================
// VALIDATORS
// Complete File Validation Utilities
// ============================================

export default class Validators {
    // ==========================================
    // FILE VALIDATION
    // ==========================================
    
    static validateFile(file, options = {}) {
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check file size
        const maxSize = options.maxSize || 1073741824; // 1GB
        if (file.size > maxSize) {
            errors.push(`File size ${this.formatSize(file.size)} exceeds maximum ${this.formatSize(maxSize)}`);
            score -= 30;
        }

        // Check file name
        if (!file.name || file.name.length === 0) {
            errors.push('File has no name');
            score -= 20;
        }

        // Check for invalid characters in filename
        const invalidChars = /[<>:"/\\|?*]/g;
        if (file.name && invalidChars.test(file.name)) {
            warnings.push('File name contains invalid characters');
            score -= 5;
        }

        // Check extension
        const ext = this.getExtension(file.name);
        const allowed = options.allowedExtensions || this.getDefaultExtensions();
        if (!allowed.includes(ext)) {
            warnings.push(`File extension .${ext} may not be supported`);
            score -= 10;
        }

        // Check content
        if (file.content) {
            // Check for binary content in text files
            if (this.isBinaryContent(file.content) && !options.allowBinary) {
                warnings.push('File appears to contain binary data');
                score -= 5;
            }

            // Check for malicious patterns
            const maliciousPatterns = this.getMaliciousPatterns();
            for (const pattern of maliciousPatterns) {
                if (typeof file.content === 'string' && 
                    file.content.toLowerCase().includes(pattern.toLowerCase())) {
                    warnings.push(`Potential malicious pattern found: ${pattern}`);
                    score -= 15;
                    break;
                }
            }
        }

        // Check mime type
        if (file.type && !this.isValidMimeType(file.type, ext)) {
            warnings.push(`Mime type ${file.type} doesn't match extension .${ext}`);
            score -= 5;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            metadata: {
                extension: ext,
                size: file.size,
                formattedSize: this.formatSize(file.size)
            }
        };
    }

    // ==========================================
    // SOLIDITY VALIDATION
    // ==========================================
    
    static validateSolidity(content) {
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check pragma
        if (!content.includes('pragma solidity')) {
            errors.push('Missing pragma statement');
            score -= 20;
        }

        // Check contract
        if (!content.includes('contract')) {
            errors.push('No contract defined');
            score -= 30;
        }

        // Security checks
        if (content.includes('tx.origin')) {
            warnings.push('tx.origin used - potential security risk');
            score -= 15;
        }

        if (content.includes('block.timestamp')) {
            warnings.push('block.timestamp used - potential manipulation');
            score -= 10;
        }

        if (!content.includes('view') && !content.includes('pure')) {
            warnings.push('No view/pure functions - potential gas inefficiency');
            score -= 5;
        }

        if (!content.includes('event')) {
            warnings.push('No events defined - consider adding events');
            score -= 5;
        }

        // Check SafeMath
        if (!content.includes('SafeMath') && !content.includes('using SafeMath')) {
            warnings.push('No SafeMath detected - potential overflow vulnerabilities');
            score -= 10;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score))
        };
    }

    // ==========================================
    // JAVASCRIPT VALIDATION
    // ==========================================
    
    static validateJavaScript(content) {
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check for strict mode
        if (!content.includes('"use strict"') && !content.includes("'use strict'")) {
            warnings.push('"use strict" not found - recommend adding');
            score -= 5;
        }

        // Check for eval
        if (content.includes('eval(')) {
            warnings.push('eval() used - potential security risk');
            score -= 10;
        }

        // Check for document.write
        if (content.includes('document.write')) {
            warnings.push('document.write used - potential performance issue');
            score -= 5;
        }

        // Check for console logs
        const consoleLogs = (content.match(/console\.log/g) || []).length;
        if (consoleLogs > 5) {
            warnings.push(`Excessive console.log usage (${consoleLogs}) - remove for production`);
            score -= 5;
        }

        // Check for var usage
        const varUsage = (content.match(/\bvar\s+/g) || []).length;
        if (varUsage > 0) {
            warnings.push(`var used ${varUsage} times - consider using let or const`);
            score -= 3;
        }

        // Check for == instead of ===
        const looseEquality = (content.match(/[^!]==[^=]/g) || []).length;
        if (looseEquality > 0) {
            warnings.push('== used instead of === - recommend strict equality');
            score -= 3;
        }

        // Check for unused variables (simple check)
        const declared = content.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
        const used = content.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g) || [];
        const declaredVars = declared.map(d => d.split(/\s+/)[1]);
        const usedVars = used.filter(u => declaredVars.includes(u));
        
        if (declaredVars.length > usedVars.length * 1.2) {
            warnings.push('Potential unused variables detected');
            score -= 3;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            metrics: {
                lines: content.split('\n').length,
                functions: (content.match(/function\s+[a-zA-Z_]/g) || []).length,
                classes: (content.match(/class\s+[a-zA-Z_]/g) || []).length,
                imports: (content.match(/import\s+.*from/g) || []).length,
                exports: (content.match(/export\s+/g) || []).length
            }
        };
    }

    // ==========================================
    // PYTHON VALIDATION
    // ==========================================
    
    static validatePython(content) {
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check indentation
        const lines = content.split('\n');
        let hasTabs = false;
        let hasInconsistentIndent = false;
        let prevIndent = 0;
        let indentType = null;

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;

            const indent = line.match(/^(\s+)/);
            if (indent) {
                const spaces = indent[1].length;
                if (indentType === null) {
                    indentType = spaces;
                } else if (spaces % indentType !== 0) {
                    hasInconsistentIndent = true;
                    break;
                }
            }
            
            if (line.includes('\t')) {
                hasTabs = true;
            }
        }

        if (hasTabs) {
            warnings.push('Tabs used for indentation - consider using spaces');
            score -= 5;
        }

        if (hasInconsistentIndent) {
            warnings.push('Inconsistent indentation detected');
            score -= 10;
        }

        // Check for print statements
        if (content.includes('print(') && !content.includes('if __name__ == "__main__"')) {
            warnings.push('print() found in non-main file - consider using logging');
            score -= 5;
        }

        // Check for eval/exec
        if (content.includes('eval(') || content.includes('exec(')) {
            warnings.push('eval/exec used - potential security risk');
            score -= 15;
        }

        // Check for type hints
        if (!content.includes(': ') && !content.includes('->')) {
            warnings.push('No type hints found - consider adding type annotations');
            score -= 3;
        }

        // Check for docstrings
        if (!content.includes('"""') && !content.includes("'''")) {
            warnings.push('No docstrings found - consider adding documentation');
            score -= 3;
        }

        // Check for long lines
        const longLines = lines.filter(l => l.length > 100).length;
        if (longLines > lines.length * 0.1) {
            warnings.push('Many long lines (>100 chars) - consider formatting');
            score -= 3;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            metrics: {
                lines: lines.length,
                functions: (content.match(/def\s+[a-zA-Z_]/g) || []).length,
                classes: (content.match(/class\s+[a-zA-Z_]/g) || []).length,
                imports: (content.match(/^(?:import|from)\s+/gm) || []).length,
                hasDocstrings: content.includes('"""') || content.includes("'''")
            }
        };
    }

    // ==========================================
    // HTML VALIDATION
    // ==========================================
    
    static validateHTML(content) {
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check DOCTYPE
        if (!content.includes('<!DOCTYPE html>')) {
            warnings.push('<!DOCTYPE html> not found');
            score -= 5;
        }

        // Check basic structure
        if (!content.includes('<html')) {
            errors.push('No <html> tag found');
            score -= 20;
        }

        if (!content.includes('<head')) {
            warnings.push('No <head> tag found');
            score -= 5;
        }

        if (!content.includes('<body')) {
            warnings.push('No <body> tag found');
            score -= 5;
        }

        // Check title
        if (!content.includes('<title')) {
            warnings.push('No <title> tag found - important for SEO');
            score -= 3;
        }

        // Check viewport
        if (!content.includes('viewport')) {
            warnings.push('No viewport meta tag - may not be mobile-friendly');
            score -= 3;
        }

        // Check charset
        if (!content.includes('charset')) {
            warnings.push('No charset meta tag - recommended for proper encoding');
            score -= 2;
        }

        // Check alt attributes
        const imgTags = (content.match(/<img/g) || []).length;
        const altTags = (content.match(/alt=/g) || []).length;
        if (imgTags > 0 && altTags < imgTags) {
            warnings.push(`Some images missing alt attributes (${imgTags - altTags} of ${imgTags})`);
            score -= 5;
        }

        // Check semantic HTML
        const semanticTags = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'];
        const hasSemantic = semanticTags.some(tag => content.includes(`<${tag}`));
        if (!hasSemantic) {
            warnings.push('No semantic HTML5 tags found - consider using header, nav, main, etc.');
            score -= 3;
        }

        // Check inline styles
        const inlineStyles = (content.match(/style=/g) || []).length;
        if (inlineStyles > 10) {
            warnings.push(`Many inline styles found (${inlineStyles}) - consider using external CSS`);
            score -= 3;
        }

        // Check script placement
        const scripts = (content.match(/<script/g) || []).length;
        const externalScripts = (content.match(/<script\s+src=/g) || []).length;
        if (scripts > externalScripts && scripts > 3) {
            warnings.push('Multiple inline scripts found - consider using external files');
            score -= 3;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            metrics: {
                lines: content.split('\n').length,
                tags: (content.match(/<[a-zA-Z][^>]*>/g) || []).length,
                images: imgTags,
                links: (content.match(/<link/g) || []).length,
                scripts: scripts,
                styles: (content.match(/<style/g) || []).length
            }
        };
    }

    // ==========================================
    // CSS VALIDATION
    // ==========================================
    
    static validateCSS(content) {
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check for rules
        if (!content.includes('{') || !content.includes('}')) {
            warnings.push('No CSS rules found');
            score -= 10;
        }

        // Check !important usage
        const importantCount = (content.match(/!important/g) || []).length;
        if (importantCount > 0) {
            warnings.push(`!important used ${importantCount} times - consider using more specific selectors`);
            score -= Math.min(importantCount * 3, 15);
        }

        // Check vendor prefixes
        const vendorPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
        const hasPrefixes = vendorPrefixes.some(p => content.includes(p));
        if (!hasPrefixes) {
            warnings.push('No vendor prefixes found - may not work in all browsers');
            score -= 3;
        }

        // Check duplicate selectors
        const selectors = content.match(/[.#][a-zA-Z_-][^{]*/g) || [];
        const uniqueSelectors = new Set(selectors);
        if (selectors.length > uniqueSelectors.size) {
            warnings.push('Duplicate selectors found - potential redundancy');
            score -= 3;
        }

        // Check long selectors
        const longSelectors = selectors.filter(s => s.length > 50);
        if (longSelectors.length > 0) {
            warnings.push('Very long selectors found - consider simplifying');
            score -= 2;
        }

        // Check media queries
        const mediaQueries = (content.match(/@media/g) || []).length;
        if (mediaQueries === 0) {
            warnings.push('No media queries - may not be responsive');
            score -= 5;
        }

        // Check custom properties
        const customProps = (content.match(/--[a-zA-Z-]+:/g) || []).length;
        if (customProps === 0 && content.length > 1000) {
            warnings.push('No CSS custom properties (variables) - consider using for theming');
            score -= 2;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            metrics: {
                lines: content.split('\n').length,
                selectors: selectors.length,
                properties: (content.match(/[a-zA-Z-]+:/g) || []).length,
                mediaQueries: mediaQueries,
                importantCount: importantCount
            }
        };
    }

    // ==========================================
    // JSON VALIDATION
    // ==========================================
    
    static validateJSON(content) {
        try {
            const data = JSON.parse(content);
            
            // Check depth
            const depth = this.getJSONDepth(data);
            if (depth > 10) {
                return {
                    valid: true,
                    errors: [],
                    warnings: [`Deep nesting detected (depth: ${depth}) - consider flattening`],
                    score: 90,
                    data: data,
                    metrics: {
                        keys: Object.keys(data).length,
                        isArray: Array.isArray(data),
                        depth: depth,
                        size: content.length
                    }
                };
            }

            return {
                valid: true,
                errors: [],
                warnings: [],
                score: 100,
                data: data,
                metrics: {
                    keys: Object.keys(data).length,
                    isArray: Array.isArray(data),
                    depth: depth,
                    size: content.length
                }
            };
        } catch (error) {
            return {
                valid: false,
                errors: [`Invalid JSON: ${error.message}`],
                warnings: [],
                score: 0,
                metrics: {
                    size: content.length
                }
            };
        }
    }

    // ==========================================
    // XML VALIDATION
    // ==========================================
    
    static validateXML(content) {
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check XML declaration
        if (!content.includes('<?xml')) {
            warnings.push('XML declaration not found');
            score -= 5;
        }

        // Check root element
        const rootMatch = content.match(/<([a-zA-Z][a-zA-Z0-9]*)[\s>]/);
        if (!rootMatch) {
            errors.push('No root element found');
            score -= 20;
        }

        // Check tag balance
        const openTags = content.match(/<[a-zA-Z][^>]*>/g) || [];
        const closeTags = content.match(/<\/[a-zA-Z][^>]*>/g) || [];
        const selfClosing = content.match(/\/>/g) || [];
        
        if (openTags.length !== closeTags.length + selfClosing.length) {
            warnings.push('Unbalanced tags detected');
            score -= 10;
        }

        // Check namespaces
        if (!content.includes('xmlns:')) {
            warnings.push('No namespaces defined');
            score -= 2;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            metrics: {
                lines: content.split('\n').length,
                tags: openTags.length,
                attributes: (content.match(/[a-zA-Z]+=/g) || []).length,
                hasDeclaration: content.includes('<?xml'),
                rootElement: rootMatch ? rootMatch[1] : null
            }
        };
    }

    // ==========================================
    // ARCHIVE VALIDATION
    // ==========================================
    
    static validateArchive(file) {
        const ext = this.getExtension(file.name);
        const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'zst', 'lz4', 'lzma'];
        
        if (archiveExts.includes(ext)) {
            return {
                valid: true,
                errors: [],
                warnings: [],
                score: 100,
                metadata: {
                    format: ext,
                    isCompressed: ['gz', 'bz2', 'xz', 'zst', 'lz4', 'lzma', 'zip', 'rar', '7z'].includes(ext),
                    size: file.size,
                    formattedSize: this.formatSize(file.size)
                }
            };
        }

        return {
            valid: false,
            errors: [`Unsupported archive format: .${ext}`],
            warnings: [],
            score: 0,
            metadata: {
                format: ext
            }
        };
    }

    // ==========================================
    // EXECUTABLE VALIDATION
    // ==========================================
    
    static validateExecutable(file) {
        const ext = this.getExtension(file.name);
        const execExts = ['exe', 'msi', 'app', 'deb', 'rpm', 'pkg', 'apk', 'ipa', 'elf', 'out'];
        
        if (execExts.includes(ext)) {
            return {
                valid: true,
                errors: [],
                warnings: ['Executable files should be scanned for malware'],
                score: 80,
                metadata: {
                    format: ext,
                    platform: this.getPlatform(ext),
                    size: file.size,
                    formattedSize: this.formatSize(file.size)
                }
            };
        }

        return {
            valid: false,
            errors: [`Unsupported executable format: .${ext}`],
            warnings: [],
            score: 0,
            metadata: {
                format: ext
            }
        };
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================
    
    static getExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    static getDefaultExtensions() {
        return [
            'html', 'htm', 'xhtml', 'css', 'scss', 'sass', 'less',
            'js', 'jsx', 'ts', 'tsx', 'json', 'jsonl', 'yml', 'yaml',
            'xml', 'xsd', 'xsl', 'xslt', 'py', 'rb', 'go', 'rs',
            'c', 'cpp', 'cxx', 'h', 'hpp', 'java', 'class', 'jar',
            'kt', 'kts', 'swift', 'php', 'lua', 'pl', 'pm', 'tcl',
            'sol', 'vyper', 'yul', 'abi', 'bin', 'evm', 'wasm', 'wast',
            'exe', 'msi', 'app', 'deb', 'rpm', 'pkg', 'apk', 'ipa',
            'dll', 'so', 'dylib', 'lib', 'a', 'sys', 'drv',
            'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'zst',
            'pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'md', 'tex',
            'xls', 'xlsx', 'ods', 'csv', 'tsv', 'data', 'dat',
            'db', 'sqlite', 'sql', 'ppt', 'pptx', 'key',
            'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'psd', 'raw',
            'mp3', 'wav', 'flac', 'aac', 'ogg', 'opus', 'm4a',
            'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv',
            'stl', 'obj', 'fbx', 'blend', 'glb', 'gltf',
            'dwg', 'dxf', 'step', 'stp', 'iges',
            'ttf', 'otf', 'woff', 'woff2', 'eot',
            'epub', 'mobi', 'azw', 'fb2', 'djvu',
            'shp', 'shx', 'dbf', 'prj', 'kml', 'kmz', 'gpx', 'geojson',
            'conf', 'config', 'cfg', 'ini', 'properties', 'env', 'reg', 'plist',
            'pem', 'key', 'crt', 'pfx', 'jks', 'asc', 'pgp',
            'ova', 'ovf', 'vmdk', 'vhd', 'vhdx', 'qcow2', 'vdi'
        ];
    }

    static getMaliciousPatterns() {
        return [
            'eval(', 'exec(', 'system(', 'shell_exec(',
            'base64_decode(', 'gzinflate(', 'str_rot13(',
            '/etc/passwd', 'C:\\Windows\\System32',
            'rm -rf', 'format c:', 'del /f',
            'malware', 'virus', 'trojan', 'ransomware',
            'cryptominer', 'keylogger', 'spyware',
            'exploit', 'backdoor', 'rootkit'
        ];
    }

    static isValidMimeType(mimeType, extension) {
        const mimeMap = {
            'html': 'text/html',
            'css': 'text/css',
            'js': 'application/javascript',
            'json': 'application/json',
            'py': 'text/x-python',
            'sol': 'text/x-solidity',
            'xml': 'application/xml',
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
            'mp3': 'audio/mpeg',
            'mp4': 'video/mp4',
            'zip': 'application/zip',
            'rar': 'application/x-rar-compressed',
            '7z': 'application/x-7z-compressed',
            'tar': 'application/x-tar',
            'gz': 'application/gzip',
            'exe': 'application/x-msdownload',
            'dll': 'application/x-msdownload',
            'so': 'application/x-sharedlib',
            'apk': 'application/vnd.android.package-archive',
            'wasm': 'application/wasm'
        };

        const expected = mimeMap[extension];
        if (!expected) return true; // Unknown extension, skip mime check
        return mimeType === expected || mimeType.includes(extension);
    }

    static getPlatform(extension) {
        const platforms = {
            'exe': 'Windows',
            'msi': 'Windows',
            'app': 'macOS',
            'dmg': 'macOS',
            'deb': 'Linux (Debian)',
            'rpm': 'Linux (RPM)',
            'elf': 'Linux',
            'apk': 'Android',
            'ipa': 'iOS'
        };
        return platforms[extension] || 'Unknown';
    }

    static formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static isBinaryContent(content) {
        if (typeof content !== 'string') return true;
        const nonPrintable = content.match(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g);
        return nonPrintable && nonPrintable.length > content.length * 0.1;
    }

    static getJSONDepth(obj, depth = 0) {
        if (!obj || typeof obj !== 'object') return depth;
        let maxDepth = depth;
        for (const key in obj) {
            const d = this.getJSONDepth(obj[key], depth + 1);
            if (d > maxDepth) maxDepth = d;
        }
        return maxDepth;
    }

    // ==========================================
    // COMPOSITE VALIDATION
    // ==========================================
    
    static validateAll(files, options = {}) {
        const results = {
            valid: [],
            invalid: [],
            warnings: [],
            summary: {
                total: files.length,
                valid: 0,
                invalid: 0,
                warnings: 0
            }
        };

        for (const file of files) {
            const result = this.validateFile(file, options);
            
            if (result.valid) {
                results.valid.push({ file, result });
                results.summary.valid++;
            } else {
                results.invalid.push({ file, result });
                results.summary.invalid++;
            }

            if (result.warnings.length > 0) {
                results.warnings.push({ file, warnings: result.warnings });
                results.summary.warnings += result.warnings.length;
            }
        }

        return results;
    }

    // ==========================================
    // SECURITY SCAN
    // ==========================================
    
    static securityScan(content, options = {}) {
        const findings = [];
        let score = 100;

        // Check for credentials
        const credentialPatterns = [
            { pattern: /password\s*[:=]\s*['"][^'"]+['"]/i, severity: 'high', type: 'password' },
            { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i, severity: 'high', type: 'api_key' },
            { pattern: /token\s*[:=]\s*['"][^'"]+['"]/i, severity: 'high', type: 'token' },
            { pattern: /secret\s*[:=]\s*['"][^'"]+['"]/i, severity: 'high', type: 'secret' },
            { pattern: /private[_-]?key/i, severity: 'critical', type: 'private_key' }
        ];

        for (const pattern of credentialPatterns) {
            if (pattern.pattern.test(content)) {
                findings.push({
                    type: pattern.type,
                    severity: pattern.severity,
                    description: `Potential ${pattern.type} found in content`,
                    pattern: pattern.pattern.source
                });
                score -= pattern.severity === 'critical' ? 30 : 20;
            }
        }

        // Check for URLs
        const urls = content.match(/https?:\/\/[^\s"']+/g) || [];
        if (urls.length > 0) {
            findings.push({
                type: 'urls',
                severity: 'low',
                description: `${urls.length} URL(s) found in content`,
                count: urls.length
            });
            score -= Math.min(urls.length, 10);
        }

        // Check for emails
        const emails = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
        if (emails.length > 0) {
            findings.push({
                type: 'emails',
                severity: 'medium',
                description: `${emails.length} email address(es) found in content`,
                count: emails.length
            });
            score -= Math.min(emails.length * 2, 10);
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            findings: findings,
            hasCredentials: findings.some(f => ['password', 'api_key', 'token', 'secret', 'private_key'].includes(f.type)),
            hasUrls: urls.length > 0,
            hasEmails: emails.length > 0
        };
    }
}

export default Validators;
