// ============================================
// API VERIFIER
// Complete API Verification Engine
// ============================================

import { APIClient } from '../utils/api-client.js';

export default class APIVerifier {
    constructor() {
        // ==========================================
        // CONFIGURATION
        // ==========================================
        this.defaultTimeout = 30000;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        this.cache = new Map();
        this.cacheTTL = 3600000; // 1 hour
        
        // ==========================================
        // VERIFICATION RULES
        // ==========================================
        this.rules = {
            // Code verification
            javascript: this.verifyJavaScript.bind(this),
            typescript: this.verifyJavaScript.bind(this),
            python: this.verifyPython.bind(this),
            solidity: this.verifySolidity.bind(this),
            html: this.verifyHTML.bind(this),
            css: this.verifyCSS.bind(this),
            json: this.verifyJSON.bind(this),
            yaml: this.verifyYAML.bind(this),
            xml: this.verifyXML.bind(this),
            
            // Security
            security: this.verifySecurity.bind(this),
            malware: this.verifyMalware.bind(this),
            
            // Blockchain
            contract: this.verifyContract.bind(this),
            abi: this.verifyABI.bind(this),
            
            // Generic
            binary: this.verifyBinary.bind(this),
            unknown: this.verifyUnknown.bind(this)
        };
        
        // ==========================================
        // API ENDPOINTS
        // ==========================================
        this.endpoints = {
            virusTotal: 'https://www.virustotal.com/api/v3',
            etherscan: 'https://api.etherscan.io/api',
            solscan: 'https://public-api.solscan.io',
            npm: 'https://registry.npmjs.org',
            pypi: 'https://pypi.org/pypi',
            github: 'https://api.github.com',
            googleSafeBrowsing: 'https://safebrowsing.googleapis.com/v4'
        };
    }

    // ==========================================
    // MAIN VERIFICATION METHOD
    // ==========================================
    async verify(files, options = {}) {
        const results = {
            success: true,
            timestamp: new Date().toISOString(),
            verified: [],
            errors: [],
            warnings: [],
            summary: {
                total: files.length,
                passed: 0,
                failed: 0,
                warnings: 0
            }
        };

        for (const file of files) {
            try {
                const type = this.detectType(file);
                const verifier = this.rules[type] || this.rules.unknown;
                const result = await verifier(file, options);
                
                // Add file info
                result.name = file.name;
                result.type = type;
                result.fileSize = file.size;
                result.formattedSize = this.formatSize(file.size);
                
                results.verified.push(result);
                
                if (result.valid) {
                    results.summary.passed++;
                } else {
                    results.summary.failed++;
                    results.success = false;
                }
                
                if (result.warnings && result.warnings.length > 0) {
                    results.summary.warnings += result.warnings.length;
                    results.warnings.push(...result.warnings.map(w => `${file.name}: ${w}`));
                }
                
                if (result.errors && result.errors.length > 0) {
                    results.errors.push(...result.errors.map(e => `${file.name}: ${e}`));
                }
                
            } catch (error) {
                results.success = false;
                results.errors.push(`${file.name}: ${error.message}`);
                results.verified.push({
                    name: file.name,
                    valid: false,
                    errors: [error.message],
                    warnings: [],
                    type: 'error'
                });
            }
        }

        return results;
    }

    // ==========================================
    // TYPE DETECTION
    // ==========================================
    detectType(file) {
        if (file.analysis && file.analysis.type) {
            return file.analysis.type;
        }
        
        const ext = file.name.split('.').pop().toLowerCase();
        const typeMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'py': 'python',
            'sol': 'solidity',
            'html': 'html',
            'htm': 'html',
            'css': 'css',
            'scss': 'css',
            'sass': 'css',
            'less': 'css',
            'json': 'json',
            'yml': 'yaml',
            'yaml': 'yaml',
            'xml': 'xml',
            'xsd': 'xml',
            'xsl': 'xml',
            'exe': 'executable',
            'dll': 'binary',
            'so': 'binary',
            'wasm': 'binary',
            'abi': 'abi',
            'bin': 'binary'
        };
        return typeMap[ext] || 'unknown';
    }

    // ==========================================
    // VERIFICATION METHODS
    // ==========================================
    
    // JavaScript / TypeScript
    async verifyJavaScript(file, options = {}) {
        const content = typeof file.content === 'string' ? file.content : '';
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check for strict mode
        if (!content.includes('"use strict"') && !content.includes("'use strict'")) {
            warnings.push('"use strict" not found - recommend adding');
            score -= 5;
        }

        // Check for console logs
        if (content.includes('console.log')) {
            warnings.push('console.log found - remove for production');
            score -= 3;
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

        // Check for common JS errors
        if (content.includes('==') && !content.includes('===')) {
            warnings.push('== used - consider using === for strict equality');
            score -= 2;
        }

        // Check for unused variables (simple check)
        const declared = content.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
        const used = content.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g) || [];
        const declaredVars = declared.map(d => d.split(/\s+/)[1]);
        const usedVars = used.filter(u => declaredVars.includes(u));
        
        if (declaredVars.length > usedVars.length) {
            warnings.push('Potential unused variables detected');
            score -= 3;
        }

        // Check dependencies
        if (options.checkDependencies !== false) {
            const deps = this.extractDependencies(content);
            if (deps.length > 0) {
                const depResults = await this.checkNPMDependencies(deps);
                if (depResults.length > 0) {
                    warnings.push(`Dependencies: ${depResults.join(', ')}`);
                }
            }
        }

        // ESLint-like basic checks
        const lines = content.split('\n');
        let lineErrors = 0;
        for (const line of lines) {
            if (line.trim().length > 120) {
                lineErrors++;
            }
            if (line.includes(';') && !line.trim().endsWith(';') && !line.trim().endsWith('}') && !line.trim().endsWith('{')) {
                // Missing semicolon check - simplified
            }
        }
        
        if (lineErrors > lines.length * 0.1) {
            warnings.push('Many long lines (>120 chars) - consider formatting');
            score -= 3;
        }

        // Check for async/await patterns
        const hasAsync = content.includes('async');
        const hasAwait = content.includes('await');
        if (hasAsync && !hasAwait) {
            warnings.push('async functions without await detected - possible unnecessary async');
            score -= 2;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            metrics: {
                lines: lines.length,
                functions: (content.match(/function\s+[a-zA-Z_]/g) || []).length + (content.match(/=>/g) || []).length,
                classes: (content.match(/class\s+[a-zA-Z_]/g) || []).length,
                imports: (content.match(/import\s+.*from/g) || []).length,
                exports: (content.match(/export\s+/g) || []).length,
                dependencies: this.extractDependencies(content)
            }
        };
    }

    // Python
    async verifyPython(file, options = {}) {
        const content = typeof file.content === 'string' ? file.content : '';
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check for proper indentation
        const tabs = (content.match(/\t/g) || []).length;
        if (tabs > 0) {
            warnings.push('Tabs used for indentation - consider using spaces');
            score -= 3;
        }

        // Check for print statements in non-main files
        if (content.includes('print(') && !content.includes('if __name__ == "__main__"')) {
            warnings.push('print() found - consider using logging');
            score -= 3;
        }

        // Check for common issues
        if (content.includes('eval(')) {
            warnings.push('eval() used - potential security risk');
            score -= 10;
        }

        if (content.includes('exec(')) {
            warnings.push('exec() used - potential security risk');
            score -= 10;
        }

        // Check for type hints
        if (!content.includes(': ') && !content.includes('->')) {
            warnings.push('No type hints found - consider adding type annotations');
            score -= 2;
        }

        // Check for docstrings
        if (!content.includes('"""') && !content.includes("'''")) {
            warnings.push('No docstrings found - consider adding documentation');
            score -= 3;
        }

        // Check for long lines
        const lines = content.split('\n');
        const longLines = lines.filter(l => l.length > 100).length;
        if (longLines > lines.length * 0.1) {
            warnings.push('Many long lines (>100 chars) - consider formatting');
            score -= 3;
        }

        // Check for imports
        const imports = (content.match(/^import\s+\w+/gm) || []).length;
        const fromImports = (content.match(/^from\s+\w+\s+import/gm) || []).length;
        if (imports + fromImports === 0) {
            warnings.push('No imports found - unusual for a Python file');
        }

        // Check for __main__ guard
        const hasMainGuard = content.includes('if __name__ == "__main__"');
        if (!hasMainGuard && !content.includes('def ')) {
            warnings.push('No __main__ guard and no functions - may not be reusable');
            score -= 2;
        }

        // Check dependencies
        if (options.checkDependencies !== false) {
            const deps = this.extractPythonDependencies(content);
            if (deps.length > 0) {
                const depResults = await this.checkPyPIDependencies(deps);
                if (depResults.length > 0) {
                    warnings.push(`Dependencies: ${depResults.join(', ')}`);
                }
            }
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
                imports: imports + fromImports,
                hasDocstrings: content.includes('"""') || content.includes("'''"),
                hasMainGuard: hasMainGuard
            }
        };
    }

    // Solidity
    async verifySolidity(file, options = {}) {
        const content = typeof file.content === 'string' ? file.content : '';
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
            errors.push('No contract found');
            score -= 30;
        }

        // Extract version
        const versionMatch = content.match(/pragma\s+solidity\s+([^;]+);/);
        const version = versionMatch ? versionMatch[1].trim() : 'unknown';

        // Security checks
        if (content.includes('tx.origin')) {
            warnings.push('tx.origin used - potential security risk. Use msg.sender instead.');
            score -= 15;
        }

        if (content.includes('block.timestamp')) {
            warnings.push('block.timestamp used - can be manipulated by miners');
            score -= 10;
        }

        if (content.includes('block.number')) {
            warnings.push('block.number used - ensure logic accounts for variable block times');
            score -= 5;
        }

        // Reentrancy check
        if (content.includes('.call(') || content.includes('.send(') || content.includes('.transfer(')) {
            warnings.push('External calls detected - potential reentrancy vulnerability');
            score -= 10;
        }

        // SafeMath check
        if (!content.includes('SafeMath') && !content.includes('using SafeMath') && !content.includes('unchecked {')) {
            warnings.push('No SafeMath or unchecked blocks - potential overflow vulnerabilities');
            score -= 10;
        }

        // Events check
        if (!content.includes('event')) {
            warnings.push('No events defined - consider adding events for transparency');
            score -= 5;
        }

        // Visibility check
        if (!content.includes('public') && !content.includes('private') && 
            !content.includes('internal') && !content.includes('external')) {
            warnings.push('No visibility specifiers found - functions default to public');
            score -= 5;
        }

        // Modifiers check
        if (!content.includes('modifier') && !content.includes('onlyOwner')) {
            warnings.push('No modifiers found - consider adding access control');
            score -= 5;
        }

        // Gas optimization checks
        if (!content.includes('view') && !content.includes('pure')) {
            warnings.push('No view/pure functions - potential gas inefficiency');
            score -= 5;
        }

        // Import check
        const imports = (content.match(/import\s+['"][^'"]+['"]/g) || []);
        if (imports.length === 0) {
            warnings.push('No imports - may be standalone contract');
        }

        // Check for OpenZeppelin imports
        const hasOZ = imports.some(i => i.includes('@openzeppelin'));
        if (!hasOZ && !options.skipOZCheck) {
            warnings.push('No OpenZeppelin imports - consider using battle-tested libraries');
            score -= 5;
        }

        // Check for upgrade patterns
        if (content.includes('initialize') && content.includes('initializer')) {
            warnings.push('Upgradeable pattern detected - ensure proper initialization');
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            version: version,
            metrics: {
                lines: content.split('\n').length,
                contracts: (content.match(/contract\s+\w+/g) || []).length,
                functions: (content.match(/function\s+\w+/g) || []).length,
                events: (content.match(/event\s+\w+/g) || []).length,
                modifiers: (content.match(/modifier\s+\w+/g) || []).length,
                imports: imports.length,
                hasSafeMath: content.includes('SafeMath') || content.includes('using SafeMath'),
                hasOwnable: content.includes('Ownable'),
                hasReentrancyGuard: content.includes('ReentrancyGuard')
            }
        };
    }

    // HTML
    async verifyHTML(file, options = {}) {
        const content = typeof file.content === 'string' ? file.content : '';
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check basic structure
        if (!content.includes('<!DOCTYPE html>')) {
            warnings.push('<!DOCTYPE html> not found');
            score -= 5;
        }

        if (!content.includes('<html')) {
            errors.push('No <html> tag found');
            score -= 20;
        }

        if (!content.includes('<head')) {
            warnings.push('No <head> tag found');
            score -= 3;
        }

        if (!content.includes('<body')) {
            warnings.push('No <body> tag found');
            score -= 5;
        }

        // Check for title
        if (!content.includes('<title')) {
            warnings.push('No <title> tag found - important for SEO');
            score -= 3;
        }

        // Check for meta viewport
        if (!content.includes('viewport')) {
            warnings.push('No viewport meta tag - may not be mobile-friendly');
            score -= 3;
        }

        // Check for charset
        if (!content.includes('charset')) {
            warnings.push('No charset meta tag - recommended for proper encoding');
            score -= 2;
        }

        // Check for accessibility
        const altTags = (content.match(/alt=/g) || []).length;
        const imgTags = (content.match(/<img/g) || []).length;
        if (imgTags > 0 && altTags === 0) {
            warnings.push('Images without alt attributes - accessibility issue');
            score -= 5;
        }

        // Check for semantic HTML
        const semanticTags = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'];
        const hasSemantic = semanticTags.some(tag => content.includes(`<${tag}`));
        if (!hasSemantic) {
            warnings.push('No semantic HTML5 tags found - consider using header, nav, main, etc.');
            score -= 3;
        }

        // Check for inline styles
        const inlineStyles = (content.match(/style=/g) || []).length;
        if (inlineStyles > 5) {
            warnings.push('Many inline styles found - consider using external CSS');
            score -= 3;
        }

        // Check for script tags
        const scripts = (content.match(/<script/g) || []).length;
        const externalScripts = (content.match(/<script\s+src=/g) || []).length;
        if (scripts > externalScripts) {
            warnings.push('Inline scripts found - consider using external files');
            score -= 3;
        }

        // Check for security
        if (!content.includes('Content-Security-Policy') && !content.includes('csp')) {
            warnings.push('Content-Security-Policy not found - security best practice');
            score -= 5;
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
                styles: (content.match(/<style/g) || []).length,
                semanticTags: hasSemantic,
                hasViewport: content.includes('viewport')
            }
        };
    }

    // CSS
    async verifyCSS(file, options = {}) {
        const content = typeof file.content === 'string' ? file.content : '';
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check basic structure
        if (!content.includes('{') || !content.includes('}')) {
            warnings.push('No CSS rules found');
            score -= 10;
        }

        // Check for !important
        const importantCount = (content.match(/!important/g) || []).length;
        if (importantCount > 0) {
            warnings.push(`!important used ${importantCount} times - consider using more specific selectors`);
            score -= Math.min(importantCount * 3, 15);
        }

        // Check for vendor prefixes
        const vendorPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
        const hasPrefixes = vendorPrefixes.some(p => content.includes(p));
        if (!hasPrefixes) {
            warnings.push('No vendor prefixes found - may not work in all browsers');
            score -= 3;
        }

        // Check for duplicate selectors
        const selectors = content.match(/[.#][a-zA-Z_-][^{]*/g) || [];
        const uniqueSelectors = new Set(selectors);
        if (selectors.length > uniqueSelectors.size) {
            warnings.push('Duplicate selectors found - potential redundancy');
            score -= 3;
        }

        // Check for long selectors
        const longSelectors = selectors.filter(s => s.length > 50);
        if (longSelectors.length > 0) {
            warnings.push('Very long selectors found - consider simplifying');
            score -= 2;
        }

        // Check for !important overuse
        if (importantCount > 5) {
            warnings.push('Excessive !important usage - maintainability issue');
            score -= 5;
        }

        // Check for animations
        const hasAnimations = content.includes('@keyframes') || content.includes('animation:');
        const hasTransitions = content.includes('transition:') || content.includes('transition-');
        if (!hasAnimations && !hasTransitions) {
            warnings.push('No animations or transitions - consider adding for better UX');
            score -= 2;
        }

        // Check for media queries
        const mediaQueries = (content.match(/@media/g) || []).length;
        if (mediaQueries === 0) {
            warnings.push('No media queries - may not be responsive');
            score -= 5;
        }

        // Check for custom properties (CSS variables)
        const customProps = (content.match(/--[a-zA-Z-]+:/g) || []).length;
        if (customProps > 0) {
            // Good - using custom properties
        } else {
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
                importantCount: importantCount,
                customProperties: customProps
            }
        };
    }

    // JSON
    async verifyJSON(file, options = {}) {
        const content = typeof file.content === 'string' ? file.content : '';
        const errors = [];
        const warnings = [];
        let data = null;

        try {
            data = JSON.parse(content);
        } catch (error) {
            errors.push(`Invalid JSON: ${error.message}`);
            return {
                valid: false,
                errors: errors,
                warnings: warnings,
                score: 0,
                metrics: {
                    valid: false
                }
            };
        }

        let score = 100;

        // Check size
        const size = content.length;
        if (size > 1000000) {
            warnings.push('Large JSON file (>1MB) - consider optimization');
            score -= 5;
        }

        // Check for deep nesting
        const depth = this.getJSONDepth(data);
        if (depth > 5) {
            warnings.push(`Deep nesting detected (depth: ${depth}) - consider flattening`);
            score -= 5;
        }

        // Check for array of objects
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
            // Good - structured data
        }

        // Check for null values
        const nullCount = JSON.stringify(data).match(/null/g) || [];
        if (nullCount.length > 10) {
            warnings.push('Many null values found - consider using undefined or default values');
            score -= 2;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            data: data,
            metrics: {
                keys: Object.keys(data).length,
                isArray: Array.isArray(data),
                depth: depth,
                size: size,
                formattedSize: this.formatSize(size)
            }
        };
    }

    // YAML
    async verifyYAML(file, options = {}) {
        const content = typeof file.content === 'string' ? file.content : '';
        const errors = [];
        const warnings = [];
        let score = 100;

        // Basic YAML validation
        try {
            // Simple validation - check for proper key-value pairs
            const lines = content.split('\n');
            let hasValidStructure = false;
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && trimmed.includes(':') && !trimmed.startsWith('#') && !trimmed.startsWith('-')) {
                    hasValidStructure = true;
                    break;
                }
            }
            
            if (!hasValidStructure) {
                warnings.push('No key-value pairs found - may not be valid YAML');
                score -= 10;
            }

            // Check indentation consistency
            let indentType = null;
            let indentIssues = false;
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const indent = line.match(/^(\s+)/);
                    if (indent) {
                        const spaces = indent[1].length;
                        if (indentType === null) {
                            indentType = spaces;
                        } else if (spaces % indentType !== 0) {
                            indentIssues = true;
                            break;
                        }
                    }
                }
            }
            
            if (indentIssues) {
                warnings.push('Inconsistent indentation - YAML requires consistent spacing');
                score -= 5;
            }

        } catch (error) {
            warnings.push(`YAML validation issue: ${error.message}`);
            score -= 5;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            metrics: {
                lines: content.split('\n').length,
                size: content.length,
                formattedSize: this.formatSize(content.length)
            }
        };
    }

    // XML
    async verifyXML(file, options = {}) {
        const content = typeof file.content === 'string' ? file.content : '';
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check XML declaration
        if (!content.includes('<?xml')) {
            warnings.push('XML declaration not found');
            score -= 5;
        }

        // Check for root element
        const rootMatch = content.match(/<([a-zA-Z][a-zA-Z0-9]*)[\s>]/);
        if (!rootMatch) {
            errors.push('No root element found');
            score -= 20;
        }

        // Check tag balance (simplified)
        const openTags = content.match(/<[a-zA-Z][^>]*>/g) || [];
        const closeTags = content.match(/<\/[a-zA-Z][^>]*>/g) || [];
        const selfClosing = content.match(/\/>/g) || [];
        
        if (openTags.length !== closeTags.length + selfClosing.length) {
            warnings.push('Unbalanced tags detected');
            score -= 10;
        }

        // Check for attributes
        if (openTags.length > 0) {
            const hasAttributes = openTags.some(tag => tag.includes('='));
            if (!hasAttributes) {
                warnings.push('No attributes found on any tag');
                score -= 2;
            }
        }

        // Check for namespaces
        const hasNamespaces = content.includes('xmlns:');
        if (!hasNamespaces) {
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

    // Security Verification
    async verifySecurity(file, options = {}) {
        const content = typeof file.content === 'string' ? file.content : '';
        const errors = [];
        const warnings = [];
        let score = 100;

        // Check for known patterns
        const securityPatterns = [
            { pattern: /password|passwd|pwd/i, message: 'Potential password or credential in file', severity: 10 },
            { pattern: /api[_-]?key|apikey|token|secret/i, message: 'Potential API key or token in file', severity: 15 },
            { pattern: /private[_-]?key/i, message: 'Potential private key in file', severity: 20 },
            { pattern: /jwt|bearer/i, message: 'Potential JWT or bearer token in file', severity: 10 },
            { pattern: /https?:\/\/[^\s"']+/i, message: 'URL found - verify it\'s not leaking sensitive data', severity: 3 },
            { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, message: 'Email found - verify it\'s not sensitive', severity: 3 }
        ];

        for (const check of securityPatterns) {
            if (check.pattern.test(content)) {
                warnings.push(check.message);
                score -= check.severity;
            }
        }

        // Check for SQL injection patterns
        const sqlPatterns = [
            /SELECT\s+.*\s+FROM/i,
            /INSERT\s+INTO/i,
            /UPDATE\s+.*\s+SET/i,
            /DELETE\s+FROM/i
        ];
        for (const pattern of sqlPatterns) {
            if (pattern.test(content) && !content.includes('prepared') && !content.includes('parameterized')) {
                warnings.push('SQL queries found - ensure you use parameterized queries');
                score -= 10;
                break;
            }
        }

        // Check for XSS patterns
        if (content.includes('innerHTML') || content.includes('document.write') || content.includes('eval(')) {
            warnings.push('Potential XSS vulnerability (innerHTML, document.write, or eval detected)');
            score -= 10;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            metrics: {
                hasCredentials: warnings.some(w => w.includes('credential') || w.includes('key') || w.includes('token')),
                hasUrls: content.includes('http'),
                hasEmails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(content)
            }
        };
    }

    // Malware Verification
    async verifyMalware(file, options = {}) {
        const results = {
            valid: true,
            errors: [],
            warnings: [],
            score: 100,
            metrics: {
                scanned: false,
                hasKnownPatterns: false
            }
        };

        // Check file extension for known malicious patterns
        const ext = file.name.split('.').pop().toLowerCase();
        const suspiciousExts = ['exe', 'dll', 'scr', 'bat', 'cmd', 'com', 'pif', 'vbs', 'js', 'jar'];
        if (suspiciousExts.includes(ext)) {
            results.warnings.push(`File extension .${ext} could be executable - ensure you trust the source`);
            results.score -= 10;
        }

        // Check for known suspicious patterns in content
        const content = typeof file.content === 'string' ? file.content : '';
        const suspiciousPatterns = [
            /eval\s*\(/i,
            /exec\s*\(/i,
            /system\s*\(/i,
            /shell_exec/i,
            /base64_decode/i,
            /gzinflate/i,
            /str_rot13/i,
            /chr\s*\(/i,
            /ord\s*\(/i
        ];

        for (const pattern of suspiciousPatterns) {
            if (pattern.test(content)) {
                results.warnings.push(`Suspicious pattern detected: ${pattern.source}`);
                results.score -= 15;
                results.metrics.hasKnownPatterns = true;
                break;
            }
        }

        // VirusTotal integration (if API key provided)
        if (options.virusTotalApiKey) {
            try {
                const vtResults = await this.checkVirusTotal(file, options.virusTotalApiKey);
                if (vtResults && vtResults.positives > 0) {
                    results.warnings.push(`VirusTotal: ${vtResults.positives} detections found`);
                    results.score -= Math.min(vtResults.positives * 5, 50);
                }
                results.metrics.scanned = true;
                results.metrics.vtResults = vtResults;
            } catch (error) {
                results.warnings.push(`VirusTotal scan failed: ${error.message}`);
            }
        }

        return results;
    }

    // Contract Verification (Etherscan)
    async verifyContract(file, options = {}) {
        const results = {
            valid: true,
            errors: [],
            warnings: [],
            score: 100,
            metrics: {}
        };

        // Check if it's a Solidity file
        const content = typeof file.content === 'string' ? file.content : '';
        if (!content.includes('contract') && !file.name.endsWith('.sol')) {
            results.warnings.push('Not a Solidity contract file');
            results.score -= 20;
            return results;
        }

        // Extract contract name
        const nameMatch = content.match(/contract\s+(\w+)\s*{/);
        const contractName = nameMatch ? nameMatch[1] : null;

        // Check for OpenZeppelin imports
        const imports = (content.match(/import\s+['"][^'"]+['"]/g) || []);
        const hasOZ = imports.some(i => i.includes('@openzeppelin'));

        // Check for common contract patterns
        const hasConstructor = content.includes('constructor(');
        const hasEvents = content.includes('event');
        const hasModifiers = content.includes('modifier');
        
        if (!hasConstructor && !hasEvents) {
            results.warnings.push('No constructor or events - may be incomplete contract');
            results.score -= 10;
        }

        // Verify with Etherscan (if address provided)
        if (options.contractAddress && options.etherscanApiKey) {
            try {
                const verification = await this.verifyWithEtherscan(
                    options.contractAddress,
                    options.etherscanApiKey
                );
                results.metrics.etherscan = verification;
                if (!verification.verified) {
                    results.warnings.push('Contract not verified on Etherscan');
                    results.score -= 20;
                }
            } catch (error) {
                results.warnings.push(`Etherscan verification failed: ${error.message}`);
            }
        }

        return results;
    }

    // ABI Verification
    async verifyABI(file, options = {}) {
        const content = typeof file.content === 'string' ? file.content : '';
        const errors = [];
        const warnings = [];
        let score = 100;

        try {
            const abi = JSON.parse(content);
            
            if (!Array.isArray(abi)) {
                errors.push('ABI must be an array');
                score -= 30;
                return { valid: false, errors, warnings, score };
            }

            // Check ABI entries
            let hasFunctions = false;
            let hasEvents = false;
            let hasConstructors = false;

            for (const entry of abi) {
                if (entry.type === 'function') hasFunctions = true;
                if (entry.type === 'event') hasEvents = true;
                if (entry.type === 'constructor') hasConstructors = true;
                
                // Validate required fields
                if (entry.type === 'function' || entry.type === 'event') {
                    if (!entry.name) {
                        warnings.push('Function/event without name');
                        score -= 5;
                    }
                    if (entry.inputs && !Array.isArray(entry.inputs)) {
                        warnings.push('Function inputs must be array');
                        score -= 5;
                    }
                }
            }

            if (!hasFunctions && !hasConstructors) {
                warnings.push('No functions or constructors in ABI');
                score -= 10;
            }

            if (!hasEvents) {
                warnings.push('No events in ABI');
                score -= 5;
            }

        } catch (error) {
            errors.push(`Invalid ABI: ${error.message}`);
            score -= 30;
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            score: Math.max(0, Math.min(100, score)),
            metrics: {
                functions: (content.match(/"type":"function"/g) || []).length,
                events: (content.match(/"type":"event"/g) || []).length
            }
        };
    }

    // Binary Verification
    async verifyBinary(file, options = {}) {
        const results = {
            valid: true,
            errors: [],
            warnings: [],
            score: 100,
            metrics: {}
        };

        const ext = file.name.split('.').pop().toLowerCase();
        const size = file.size;

        // Check size limits
        if (size > 100 * 1024 * 1024) { // 100MB
            results.warnings.push('Large binary file (>100MB) - may be slow to process');
            results.score -= 5;
        }

        // Check for known binary types
        const binaryTypes = {
            'exe': 'Windows Executable',
            'dll': 'Windows Library',
            'so': 'Linux Shared Library',
            'dylib': 'macOS Library',
            'wasm': 'WebAssembly Module',
            'elf': 'Linux Executable',
            'out': 'Compiled Binary'
        };

        if (binaryTypes[ext]) {
            results.metrics.type = binaryTypes[ext];
        } else {
            results.warnings.push('Unknown binary format');
            results.score -= 10;
        }

        // Check for potential malware (basic)
        if (options.scanForMalware !== false) {
            const malwareCheck = await this.verifyMalware(file);
            if (malwareCheck.warnings.length > 0) {
                results.warnings.push(...malwareCheck.warnings);
                results.score = Math.min(results.score, malwareCheck.score);
            }
        }

        return results;
    }

    // Unknown file verification
    async verifyUnknown(file, options = {}) {
        return {
            valid: true,
            errors: [],
            warnings: ['Unknown file type - limited verification available'],
            score: 50,
            metrics: {
                type: 'unknown',
                size: file.size,
                formattedSize: this.formatSize(file.size)
            }
        };
    }

    // ==========================================
    // EXTERNAL API INTEGRATIONS
    // ==========================================

    // VirusTotal
    async checkVirusTotal(file, apiKey) {
        const endpoint = `${this.endpoints.virusTotal}/files/${file.id || 'unknown'}`;
        try {
            const response = await APIClient.get(endpoint, {
                'x-apikey': apiKey
            });
            if (response.data && response.data.data) {
                const attributes = response.data.data.attributes;
                return {
                    positives: attributes.last_analysis_stats?.malicious || 0,
                    total: Object.values(attributes.last_analysis_stats || {}).reduce((a, b) => a + b, 0),
                    scanDate: attributes.last_analysis_date
                };
            }
        } catch (error) {
            throw new Error(`VirusTotal API error: ${error.message}`);
        }
        return null;
    }

    // Etherscan
    async verifyWithEtherscan(address, apiKey) {
        const endpoint = this.endpoints.etherscan;
        const params = {
            module: 'contract',
            action: 'getsourcecode',
            address: address,
            apikey: apiKey
        };

        try {
            const response = await APIClient.get(endpoint, params);
            if (response.data && response.data.status === '1') {
                const result = response.data.result[0];
                return {
                    verified: result.SourceCode !== '',
                    contractName: result.ContractName,
                    compilerVersion: result.CompilerVersion,
                    optimizationUsed: result.OptimizationUsed === '1',
                    runs: result.Runs
                };
            }
        } catch (error) {
            throw new Error(`Etherscan API error: ${error.message}`);
        }
        return { verified: false };
    }

    // NPM Package Check
    async checkNPMDependencies(deps) {
        const issues = [];
        for (const dep of deps) {
            try {
                const response = await APIClient.get(`${this.endpoints.npm}/${dep}`);
                const data = response.data;
                if (data && data.versions) {
                    // Check if package exists
                    const latestVersion = Object.keys(data.versions).pop();
                    const hasSecurityIssues = data.versions[latestVersion]?.security || false;
                    if (hasSecurityIssues) {
                        issues.push(`${dep} has known security issues`);
                    }
                }
            } catch (error) {
                issues.push(`${dep}: ${error.message}`);
            }
        }
        return issues;
    }

    // PyPI Package Check
    async checkPyPIDependencies(deps) {
        const issues = [];
        for (const dep of deps) {
            try {
                const response = await APIClient.get(`${this.endpoints.pypi}/${dep}/json`);
                const data = response.data;
                if (data && data.info) {
                    // Check if package exists
                    if (data.info.license === '') {
                        issues.push(`${dep}: Missing license info`);
                    }
                }
            } catch (error) {
                issues.push(`${dep}: ${error.message}`);
            }
        }
        return issues;
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    extractDependencies(content) {
        const deps = [];
        // CommonJS
        const requireMatches = content.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g) || [];
        for (const match of requireMatches) {
            const dep = match.match(/['"]([^'"]+)['"]/);
            if (dep && !dep[1].startsWith('.')) {
                deps.push(dep[1]);
            }
        }
        // ES6 imports
        const importMatches = content.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/g) || [];
        for (const match of importMatches) {
            const dep = match.match(/['"]([^'"]+)['"]/);
            if (dep && !dep[1].startsWith('.')) {
                deps.push(dep[1]);
            }
        }
        return [...new Set(deps)];
    }

    extractPythonDependencies(content) {
        const deps = [];
        const importMatches = content.match(/^(?:import|from)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm) || [];
        for (const match of importMatches) {
            const dep = match.match(/(?:import|from)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
            if (dep && !dep[1].startsWith('.')) {
                deps.push(dep[1]);
            }
        }
        return [...new Set(deps)];
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

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export default APIVerifier;
