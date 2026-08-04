// ============================================
// JSON HANDLER
// Complete JSON File Processing
// ============================================

export default class JSONHandler {
    constructor() {
        // ==========================================
        // JSON PATTERNS
        // ==========================================
        this.patterns = {
            // Structure
            object: /{[^}]*}/g,
            array: /\[[^\]]*\]/g,
            key: /"([^"]+)":/g,
            string: /"([^"]*)"/g,
            number: /\b(\d+\.?\d*)\b/g,
            boolean: /\b(true|false)\b/g,
            null: /\bnull\b/g,
            
            // Comments (JSON with comments - JSONC)
            singleLineComment: /\/\/.*$/gm,
            multiLineComment: /\/\*[\s\S]*?\*\//g,
            
            // Trailing commas
            trailingComma: /,\s*}/g,
            trailingCommaArray: /,\s*\]/g,
            
            // Special patterns
            date: /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)"/g,
            url: /"(https?:\/\/[^\s"]+)"/g,
            email: /"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})"/g
        };
        
        // ==========================================
        // JSON SCHEMA TYPES
        // ==========================================
        this.schemaTypes = {
            string: { type: 'string', example: 'text' },
            number: { type: 'number', example: 0 },
            integer: { type: 'integer', example: 0 },
            boolean: { type: 'boolean', example: true },
            array: { type: 'array', example: [] },
            object: { type: 'object', example: {} },
            null: { type: 'null', example: null }
        };
        
        // ==========================================
        // COMMON JSON STRUCTURES
        // ==========================================
        this.commonStructures = {
            config: ['port', 'host', 'database', 'apiKey', 'timeout'],
            manifest: ['name', 'version', 'description', 'main', 'scripts', 'dependencies'],
            package: ['name', 'version', 'description', 'main', 'scripts', 'dependencies', 'devDependencies'],
            lockfile: ['name', 'version', 'lockfileVersion', 'packages', 'dependencies'],
            tsconfig: ['compilerOptions', 'include', 'exclude', 'extends'],
            eslint: ['root', 'env', 'parser', 'plugins', 'rules', 'extends'],
            prettier: ['printWidth', 'tabWidth', 'singleQuote', 'trailingComma', 'bracketSpacing'],
            jest: ['testEnvironment', 'testMatch', 'coveragePathIgnorePatterns', 'transform'],
            webpack: ['entry', 'output', 'module', 'plugins', 'resolve', 'devServer']
        };
    }

    // ==========================================
    // MAIN ANALYSIS
    // ==========================================
    analyze(content, filename) {
        // Parse JSON
        let data = null;
        let parseError = null;
        let isValid = false;
        
        try {
            data = JSON.parse(content);
            isValid = true;
        } catch (error) {
            parseError = error.message;
        }

        const analysis = {
            type: 'json',
            name: filename,
            lines: content.split('\n').length,
            characters: content.length,
            timestamp: new Date().toISOString(),
            
            // Validation
            valid: isValid,
            parseError: parseError,
            
            // Structure
            structure: this.analyzeStructure(data, content),
            dataTypes: this.analyzeDataTypes(data),
            
            // Content
            content: {
                keys: data ? Object.keys(data) : [],
                values: data ? Object.values(data) : [],
                entries: data ? Object.entries(data) : []
            },
            
            // Properties
            properties: this.analyzeProperties(content, data),
            schema: this.analyzeSchema(content, data),
            
            // Quality
            quality: this.analyzeQuality(content),
            
            // Patterns
            patterns: this.analyzePatterns(content),
            
            // Metadata
            metadata: this.analyzeMetadata(content, data),
            
            // Preview
            preview: this.getPreview(content, 200)
        };
        
        // Calculate score
        analysis.score = this.calculateScore(analysis);
        analysis.complexity = this.calculateComplexity(analysis);
        
        return analysis;
    }

    // ==========================================
    // STRUCTURE ANALYSIS
    // ==========================================
    analyzeStructure(data, content) {
        const structure = {
            type: null,
            depth: 0,
            size: {
                objects: 0,
                arrays: 0,
                strings: 0,
                numbers: 0,
                booleans: 0,
                nulls: 0
            },
            nesting: 0,
            isArray: false,
            isEmpty: false
        };

        if (data === null || data === undefined) {
            structure.isEmpty = true;
            return structure;
        }

        structure.isArray = Array.isArray(data);
        structure.type = Array.isArray(data) ? 'array' : 'object';
        structure.depth = this.getDepth(data);
        structure.nesting = this.getNestingDepth(data);

        // Count types
        const counts = this.countTypes(data);
        structure.size = counts;

        return structure;
    }

    // ==========================================
    // DATA TYPES ANALYSIS
    // ==========================================
    analyzeDataTypes(data) {
        if (!data) return {};

        const types = {
            string: 0,
            number: 0,
            integer: 0,
            float: 0,
            boolean: 0,
            array: 0,
            object: 0,
            null: 0,
            undefined: 0
        };

        const traverse = (obj) => {
            if (obj === null) {
                types.null++;
                return;
            }
            if (obj === undefined) {
                types.undefined++;
                return;
            }

            if (Array.isArray(obj)) {
                types.array++;
                for (const item of obj) {
                    traverse(item);
                }
                return;
            }

            if (typeof obj === 'object') {
                types.object++;
                for (const key in obj) {
                    traverse(obj[key]);
                }
                return;
            }

            // Primitive types
            switch (typeof obj) {
                case 'string':
                    types.string++;
                    break;
                case 'number':
                    types.number++;
                    if (Number.isInteger(obj)) {
                        types.integer++;
                    } else {
                        types.float++;
                    }
                    break;
                case 'boolean':
                    types.boolean++;
                    break;
            }
        };

        traverse(data);
        return types;
    }

    // ==========================================
    // PROPERTIES ANALYSIS
    // ==========================================
    analyzeProperties(content, data) {
        const properties = {
            total: 0,
            unique: 0,
            names: [],
            nested: 0,
            maxDepth: 0
        };

        if (!data) return properties;

        const allKeys = [];
        const traverse = (obj, depth = 0) => {
            if (!obj || typeof obj !== 'object') return;
            
            const keys = Object.keys(obj);
            allKeys.push(...keys);
            properties.total += keys.length;
            properties.maxDepth = Math.max(properties.maxDepth, depth);
            
            for (const key of keys) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    properties.nested++;
                    traverse(value, depth + 1);
                }
            }
        };

        traverse(data);
        
        const uniqueKeys = new Set(allKeys);
        properties.unique = uniqueKeys.size;
        properties.names = Array.from(uniqueKeys);

        return properties;
    }

    // ==========================================
    // SCHEMA ANALYSIS
    // ==========================================
    analyzeSchema(content, data) {
        if (!data) return {};

        const schema = {
            type: Array.isArray(data) ? 'array' : 'object',
            properties: {},
            required: [],
            additionalProperties: true
        };

        const inferType = (value) => {
            if (value === null) return 'null';
            if (Array.isArray(value)) return 'array';
            if (typeof value === 'object') return 'object';
            if (typeof value === 'string') return 'string';
            if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
            if (typeof value === 'boolean') return 'boolean';
            return 'unknown';
        };

        const buildSchema = (obj) => {
            if (!obj || typeof obj !== 'object') return;
            
            for (const key in obj) {
                const value = obj[key];
                const type = inferType(value);
                
                schema.properties[key] = {
                    type: type,
                    required: true
                };
                
                if (type === 'array' && value.length > 0) {
                    schema.properties[key].items = {
                        type: inferType(value[0])
                    };
                }
                
                if (type === 'object' && value !== null) {
                    const nested = this.analyzeSchema(JSON.stringify(value), value);
                    schema.properties[key].properties = nested.properties;
                }
            }
        };

        buildSchema(data);
        schema.required = Object.keys(schema.properties);

        return schema;
    }

    // ==========================================
    // QUALITY ANALYSIS
    // ==========================================
    analyzeQuality(content) {
        const issues = [];
        let score = 100;

        // Check for trailing commas
        if (this.patterns.trailingComma.test(content) || 
            this.patterns.trailingCommaArray.test(content)) {
            issues.push('Trailing commas detected - may cause issues in strict JSON parsers');
            score -= 10;
        }

        // Check for comments (JSONC)
        if (this.patterns.singleLineComment.test(content) || 
            this.patterns.multiLineComment.test(content)) {
            issues.push('Comments detected - not valid JSON, use JSONC or strip comments');
            score -= 10;
        }

        // Check for deep nesting
        const depth = this.getNestingDepth(JSON.parse(content));
        if (depth > 5) {
            issues.push(`Deep nesting detected (depth: ${depth}) - consider flattening`);
            score -= 5;
        }

        // Check for large arrays
        const arrayMatches = content.match(this.patterns.array) || [];
        for (const match of arrayMatches) {
            if (match.split(',').length > 100) {
                issues.push('Large array detected - consider pagination or splitting');
                score -= 5;
                break;
            }
        }

        // Check for long strings
        const stringMatches = content.match(this.patterns.string) || [];
        for (const match of stringMatches) {
            if (match.length > 1000) {
                issues.push('Long string detected - consider breaking into smaller pieces');
                score -= 3;
                break;
            }
        }

        // Check for duplicate keys (simplified)
        const keyMatches = content.match(this.patterns.key) || [];
        const keys = keyMatches.map(k => k.replace(/"/g, '').replace(/:$/, ''));
        const uniqueKeys = new Set(keys);
        if (keys.length > uniqueKeys.size) {
            issues.push('Duplicate keys detected');
            score -= 5;
        }

        return {
            issues: issues,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: issues.length > 0
        };
    }

    // ==========================================
    // PATTERN ANALYSIS
    // ==========================================
    analyzePatterns(content) {
        const patterns = {
            dates: (content.match(this.patterns.date) || []).length,
            urls: (content.match(this.patterns.url) || []).length,
            emails: (content.match(this.patterns.email) || []).length,
            booleans: (content.match(this.patterns.boolean) || []).length,
            nulls: (content.match(this.patterns.null) || []).length,
            numbers: (content.match(this.patterns.number) || []).length
        };

        return patterns;
    }

    // ==========================================
    // METADATA ANALYSIS
    // ==========================================
    analyzeMetadata(content, data) {
        const metadata = {
            structure: null,
            keys: [],
            hasNestedObjects: false,
            hasArrays: false,
            hasDates: false,
            hasUrls: false,
            hasEmails: false
        };

        if (!data) return metadata;

        // Detect structure type
        if (Array.isArray(data)) {
            metadata.structure = 'array';
            if (data.length > 0 && typeof data[0] === 'object') {
                metadata.structure = 'array-of-objects';
            }
        } else if (typeof data === 'object') {
            metadata.structure = 'object';
            metadata.keys = Object.keys(data);
            
            // Check for nested objects
            for (const key in data) {
                const value = data[key];
                if (typeof value === 'object' && value !== null) {
                    metadata.hasNestedObjects = true;
                }
                if (Array.isArray(value)) {
                    metadata.hasArrays = true;
                }
            }
        }

        // Check for special patterns in strings
        const jsonString = JSON.stringify(data);
        metadata.hasDates = this.patterns.date.test(jsonString);
        this.patterns.date.lastIndex = 0;
        metadata.hasUrls = this.patterns.url.test(jsonString);
        this.patterns.url.lastIndex = 0;
        metadata.hasEmails = this.patterns.email.test(jsonString);
        this.patterns.email.lastIndex = 0;

        // Detect common structure types
        const keys = Object.keys(data);
        for (const [type, requiredKeys] of Object.entries(this.commonStructures)) {
            const matches = requiredKeys.filter(k => keys.includes(k));
            if (matches.length > requiredKeys.length * 0.5) {
                metadata.structure = type;
                break;
            }
        }

        return metadata;
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================
    
    getDepth(obj, depth = 0) {
        if (!obj || typeof obj !== 'object') return depth;
        let maxDepth = depth;
        for (const key in obj) {
            const d = this.getDepth(obj[key], depth + 1);
            if (d > maxDepth) maxDepth = d;
        }
        return maxDepth;
    }

    getNestingDepth(obj, depth = 0) {
        if (!obj || typeof obj !== 'object') return depth;
        let maxDepth = depth;
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'object' && value !== null) {
                const d = this.getNestingDepth(value, depth + 1);
                if (d > maxDepth) maxDepth = d;
            }
        }
        return maxDepth;
    }

    countTypes(obj) {
        const counts = {
            objects: 0,
            arrays: 0,
            strings: 0,
            numbers: 0,
            booleans: 0,
            nulls: 0
        };

        const traverse = (value) => {
            if (value === null) {
                counts.nulls++;
                return;
            }
            if (Array.isArray(value)) {
                counts.arrays++;
                for (const item of value) {
                    traverse(item);
                }
                return;
            }
            if (typeof value === 'object') {
                counts.objects++;
                for (const key in value) {
                    traverse(value[key]);
                }
                return;
            }
            switch (typeof value) {
                case 'string': counts.strings++; break;
                case 'number': counts.numbers++; break;
                case 'boolean': counts.booleans++; break;
            }
        };

        traverse(obj);
        return counts;
    }

    getPreview(content, length = 200) {
        // Remove whitespace for preview
        let preview = content.replace(/\s+/g, ' ').trim();
        if (preview.length <= length) return preview;
        return preview.slice(0, length) + '...';
    }

    calculateScore(analysis) {
        let score = 100;
        
        // Validation
        if (!analysis.valid) {
            score -= 30;
        }
        
        // Quality penalties
        if (analysis.quality.hasIssues) {
            score -= analysis.quality.issues.length * 2;
        }
        
        // Structure penalties
        if (analysis.structure.depth > 5) score -= 5;
        if (analysis.structure.nesting > 5) score -= 5;
        
        // Add bonuses
        if (analysis.metadata.structure) score += 5;
        if (analysis.metadata.hasDates) score += 2;
        if (analysis.metadata.hasUrls) score += 2;
        if (analysis.patterns.dates > 0) score += 2;
        
        // Deduct for large files
        if (analysis.characters > 100000) score -= 10;
        if (analysis.characters > 1000000) score -= 20;
        
        return Math.max(0, Math.min(100, score));
    }

    calculateComplexity(analysis) {
        const factors = {
            keys: analysis.properties.total,
            depth: analysis.structure.depth,
            nesting: analysis.structure.nesting,
            objects: analysis.structure.size.objects,
            arrays: analysis.structure.size.arrays,
            lines: analysis.lines
        };
        
        let complexity = 0;
        if (factors.keys > 10) complexity += 10;
        if (factors.keys > 50) complexity += 20;
        if (factors.keys > 100) complexity += 30;
        if (factors.depth > 3) complexity += 10;
        if (factors.depth > 5) complexity += 20;
        if (factors.objects > 10) complexity += 10;
        if (factors.objects > 50) complexity += 20;
        if (factors.arrays > 5) complexity += 10;
        if (factors.arrays > 20) complexity += 20;
        if (factors.lines > 100) complexity += 10;
        if (factors.lines > 500) complexity += 20;
        
        if (complexity < 30) return 'simple';
        if (complexity < 60) return 'medium';
        if (complexity < 80) return 'complex';
        return 'very-complex';
    }

    // ==========================================
    // EXTRACTION METHODS
    // ==========================================
    
    extractKeys(content) {
        const keys = [];
        const matches = content.match(this.patterns.key) || [];
        for (const match of matches) {
            const key = match.replace(/"/g, '').replace(/:$/, '');
            if (key) keys.push(key);
        }
        return keys;
    }

    extractStrings(content) {
        const strings = [];
        const matches = content.match(this.patterns.string) || [];
        for (const match of matches) {
            const str = match.replace(/"/g, '');
            if (str) strings.push(str);
        }
        return strings;
    }

    extractNumbers(content) {
        const numbers = [];
        const matches = content.match(this.patterns.number) || [];
        for (const match of matches) {
            const num = parseFloat(match);
            if (!isNaN(num)) numbers.push(num);
        }
        return numbers;
    }

    // ==========================================
    // TRANSFORMATION METHODS
    // ==========================================
    
    minify(data) {
        return JSON.stringify(data);
    }

    prettyPrint(data, indent = 2) {
        return JSON.stringify(data, null, indent);
    }

    sortKeys(data) {
        if (!data || typeof data !== 'object') return data;
        
        if (Array.isArray(data)) {
            return data.map(item => this.sortKeys(item));
        }
        
        const sorted = {};
        const keys = Object.keys(data).sort();
        for (const key of keys) {
            sorted[key] = this.sortKeys(data[key]);
        }
        return sorted;
    }

    validateSchema(data, schema) {
        // Simple schema validation
        const errors = [];
        
        if (!data || typeof data !== 'object') {
            errors.push('Data must be an object');
            return { valid: false, errors };
        }

        for (const [key, rules] of Object.entries(schema.properties || {})) {
            if (rules.required && !(key in data)) {
                errors.push(`Missing required property: ${key}`);
            }
            if (key in data) {
                const value = data[key];
                if (rules.type) {
                    const actualType = Array.isArray(value) ? 'array' : typeof value;
                    if (actualType !== rules.type) {
                        errors.push(`Property ${key} should be ${rules.type}, got ${actualType}`);
                    }
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // ==========================================
    // DIFF METHODS
    // ==========================================
    
    diff(obj1, obj2) {
        const changes = {
            added: [],
            removed: [],
            modified: []
        };

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        
        // Find added
        for (const key of keys2) {
            if (!keys1.includes(key)) {
                changes.added.push(key);
            }
        }
        
        // Find removed
        for (const key of keys1) {
            if (!keys2.includes(key)) {
                changes.removed.push(key);
            }
        }
        
        // Find modified
        for (const key of keys1) {
            if (keys2.includes(key) && JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
                changes.modified.push(key);
            }
        }
        
        return changes;
    }
}

export default JSONHandler;
