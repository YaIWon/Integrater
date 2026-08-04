// ============================================
// JAVASCRIPT HANDLER
// Complete JavaScript File Processing
// ============================================

export default class JSHandler {
    constructor() {
        // ==========================================
        // JS PATTERNS
        // ==========================================
        this.patterns = {
            // Comments
            singleLineComment: /\/\/.*$/gm,
            multiLineComment: /\/\*[\s\S]*?\*\//g,
            
            // Strings
            string: /['"`]([^'"`]*)['"`]/g,
            templateLiteral: /`([^`]*)`/g,
            
            // Functions
            function: /\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)/g,
            arrowFunction: /\([^)]*\)\s*=>\s*{/g,
            asyncFunction: /\basync\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)/g,
            
            // Variables
            varDeclaration: /\bvar\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            letDeclaration: /\blet\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            constDeclaration: /\bconst\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            
            // Classes
            class: /\bclass\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            constructor: /\bconstructor\s*\([^)]*\)/g,
            
            // Imports
            import: /\bimport\s+.*\s+from\s+['"]([^'"]+)['"]/g,
            importDefault: /\bimport\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s+['"]([^'"]+)['"]/g,
            importNamed: /\bimport\s*{\s*([^}]*)\s*}\s*from\s+['"]([^'"]+)['"]/g,
            importAll: /\bimport\s*\*\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s+['"]([^'"]+)['"]/g,
            
            // Exports
            exportDefault: /\bexport\s+default\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            exportNamed: /\bexport\s+{\s*([^}]*)\s*}/g,
            exportFunction: /\bexport\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            exportClass: /\bexport\s+class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            exportConst: /\bexport\s+const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            
            // Control flow
            ifStatement: /\bif\s*\([^)]*\)/g,
            elseStatement: /\belse\s*/g,
            forStatement: /\bfor\s*\([^)]*\)/g,
            whileStatement: /\bwhile\s*\([^)]*\)/g,
            doWhile: /\bdo\s*{/g,
            switch: /\bswitch\s*\([^)]*\)/g,
            case: /\bcase\s+[^:]+:/g,
            try: /\btry\s*{/g,
            catch: /\bcatch\s*\([^)]*\)\s*{/g,
            finally: /\bfinally\s*{/g,
            
            // Operators
            equality: /==/g,
            strictEquality: /===/g,
            inequality: /!=/g,
            strictInequality: /!==/g,
            
            // Keywords
            this: /\bthis\b/g,
            new: /\bnew\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            await: /\bawait\s+/g,
            yield: /\byield\s+/g,
            return: /\breturn\s+/g,
            throw: /\bthrow\s+/g,
            
            // Patterns
            consoleLog: /console\.log\s*\(/g,
            consoleError: /console\.error\s*\(/g,
            consoleWarn: /console\.warn\s*\(/g,
            consoleInfo: /console\.info\s*\(/g,
            debugger: /\bdebugger\b/g,
            eval: /\beval\s*\(/g,
            
            // DOM
            document: /\bdocument\./g,
            window: /\bwindow\./g,
            globalThis: /\bglobalThis\./g,
            
            // Node.js
            require: /\brequire\s*\(['"]([^'"]+)['"]\)/g,
            moduleExports: /\bmodule\.exports\s*=/g,
            exports: /\bexports\./g,
            process: /\bprocess\./g,
            __dirname: /\b__dirname\b/g,
            __filename: /\b__filename\b/g,
            
            // ES6+
            spread: /\.\.\./g,
            rest: /\.\.\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            destructuring: /{\s*([^}]*)\s*}\s*=/g,
            optionalChaining: /\?\./g,
            nullishCoalescing: /\?\?/g,
            
            // Strict mode
            useStrict: /['"]use strict['"]/g,
            
            // Async/Await
            async: /\basync\b/g,
            await: /\bawait\b/g
        };
        
        // ==========================================
        // FRAMEWORK DETECTION PATTERNS
        // ==========================================
        this.frameworks = {
            react: {
                patterns: [/React\./, /useState/, /useEffect/, /useReducer/, /useContext/],
                name: 'React'
            },
            vue: {
                patterns: [/Vue\./, /new Vue/, /createApp/, /Vue\.component/],
                name: 'Vue.js'
            },
            angular: {
                patterns: [/@Component/, /@Injectable/, /@NgModule/, /@Directive/],
                name: 'Angular'
            },
            express: {
                patterns: [/express\(\)/, /app\.get/, /app\.post/, /app\.use/],
                name: 'Express.js'
            },
            node: {
                patterns: [/require\('fs'\)/, /require\('http'\)/, /process\./],
                name: 'Node.js'
            },
            jquery: {
                patterns: [/\$\(/, /jQuery\(/],
                name: 'jQuery'
            },
            reactNative: {
                patterns: [/react-native/, /TextInput/, /TouchableOpacity/],
                name: 'React Native'
            }
        };
        
        // ==========================================
        // LIBRARY DETECTION PATTERNS
        // ==========================================
        this.libraries = {
            lodash: /lodash/,
            moment: /moment/,
            axios: /axios/,
            fetch: /fetch\(/,
            graphql: /graphql/,
            apollo: /apollo/,
            redux: /redux/,
            mobx: /mobx/,
            jest: /jest/,
            mocha: /mocha/,
            chai: /chai/,
            webpack: /webpack/,
            babel: /babel/,
            eslint: /eslint/,
            prettier: /prettier/
        };
    }

    // ==========================================
    // MAIN ANALYSIS
    // ==========================================
    analyze(content, filename) {
        const analysis = {
            type: 'javascript',
            name: filename,
            lines: content.split('\n').length,
            characters: content.length,
            timestamp: new Date().toISOString(),
            
            // Structure
            structure: this.analyzeStructure(content),
            variables: this.analyzeVariables(content),
            functions: this.analyzeFunctions(content),
            classes: this.analyzeClasses(content),
            
            // Imports & Exports
            imports: this.analyzeImports(content),
            exports: this.analyzeExports(content),
            
            // Control Flow
            controlFlow: this.analyzeControlFlow(content),
            
            // Patterns
            patterns: this.analyzePatterns(content),
            
            // Quality
            quality: this.analyzeQuality(content),
            
            // Dependencies
            dependencies: this.analyzeDependencies(content),
            
            // Frameworks
            frameworks: this.detectFrameworks(content),
            
            // Security
            security: this.analyzeSecurity(content),
            
            // Preview
            preview: this.getPreview(content, 200)
        };
        
        // Calculate overall score
        analysis.score = this.calculateScore(analysis);
        analysis.complexity = this.calculateComplexity(analysis);
        
        return analysis;
    }

    // ==========================================
    // STRUCTURE ANALYSIS
    // ==========================================
    analyzeStructure(content) {
        return {
            hasStrictMode: this.patterns.useStrict.test(content),
            isModule: this.isModule(content),
            isCommonJS: this.isCommonJS(content),
            isES6: this.isES6(content),
            hasAsync: this.patterns.async.test(content),
            hasAwait: this.patterns.await.test(content),
            hasGenerators: this.patterns.yield.test(content),
            hasProxies: content.includes('Proxy')
        };
    }

    // ==========================================
    // VARIABLE ANALYSIS
    // ==========================================
    analyzeVariables(content) {
        const varDeclarations = {
            var: (content.match(this.patterns.varDeclaration) || []).length,
            let: (content.match(this.patterns.letDeclaration) || []).length,
            const: (content.match(this.patterns.constDeclaration) || []).length,
            total: 0
        };
        
        varDeclarations.total = varDeclarations.var + varDeclarations.let + varDeclarations.const;
        
        // Extract variable names
        const varNames = [];
        const matches = content.match(/(?:var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
        for (const match of matches) {
            const name = match.split(/\s+/)[1];
            if (name) varNames.push(name);
        }
        
        return {
            declarations: varDeclarations,
            names: varNames,
            hasVar: varDeclarations.var > 0,
            hasLet: varDeclarations.let > 0,
            hasConst: varDeclarations.const > 0
        };
    }

    // ==========================================
    // FUNCTION ANALYSIS
    // ==========================================
    analyzeFunctions(content) {
        const functions = {
            named: (content.match(this.patterns.function) || []).length,
            arrow: (content.match(this.patterns.arrowFunction) || []).length,
            async: (content.match(this.patterns.asyncFunction) || []).length,
            total: 0
        };
        
        functions.total = functions.named + functions.arrow + functions.async;
        
        // Extract function names
        const names = [];
        const matches = content.match(/\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g) || [];
        for (const match of matches) {
            const name = match.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
            if (name) names.push(name[1]);
        }
        
        return {
            counts: functions,
            names: names,
            hasArrowFunctions: functions.arrow > 0,
            hasAsyncFunctions: functions.async > 0,
            hasNamedFunctions: functions.named > 0
        };
    }

    // ==========================================
    // CLASS ANALYSIS
    // ==========================================
    analyzeClasses(content) {
        const classes = {
            total: (content.match(this.patterns.class) || []).length,
            hasConstructor: this.patterns.constructor.test(content)
        };
        
        // Extract class names
        const names = [];
        const matches = content.match(/\bclass\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
        for (const match of matches) {
            const name = match.match(/class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
            if (name) names.push(name[1]);
        }
        
        return {
            total: classes.total,
            names: names,
            hasConstructor: classes.hasConstructor,
            hasClasses: classes.total > 0
        };
    }

    // ==========================================
    // IMPORT ANALYSIS
    // ==========================================
    analyzeImports(content) {
        const imports = {
            default: [],
            named: [],
            all: [],
            dynamic: [],
            total: 0
        };
        
        // Default imports
        const defaultMatches = content.match(this.patterns.importDefault) || [];
        for (const match of defaultMatches) {
            const parts = match.match(/import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s+['"]([^'"]+)['"]/);
            if (parts) {
                imports.default.push({
                    name: parts[1],
                    source: parts[2]
                });
            }
        }
        
        // Named imports
        const namedMatches = content.match(this.patterns.importNamed) || [];
        for (const match of namedMatches) {
            const parts = match.match(/import\s*{\s*([^}]*)\s*}\s*from\s+['"]([^'"]+)['"]/);
            if (parts) {
                imports.named.push({
                    names: parts[1].split(',').map(n => n.trim()),
                    source: parts[2]
                });
            }
        }
        
        // All imports
        const allMatches = content.match(this.patterns.importAll) || [];
        for (const match of allMatches) {
            const parts = match.match(/import\s*\*\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s+['"]([^'"]+)['"]/);
            if (parts) {
                imports.all.push({
                    name: parts[1],
                    source: parts[2]
                });
            }
        }
        
        // Dynamic imports
        const dynamicMatches = content.match(/import\s*\([^)]+\)/g) || [];
        imports.dynamic = dynamicMatches.length;
        
        imports.total = imports.default.length + imports.named.length + imports.all.length + imports.dynamic;
        
        return imports;
    }

    // ==========================================
    // EXPORT ANALYSIS
    // ==========================================
    analyzeExports(content) {
        const exports = {
            default: [],
            named: [],
            function: [],
            class: [],
            const: [],
            total: 0
        };
        
        // Default exports
        const defaultMatches = content.match(this.patterns.exportDefault) || [];
        for (const match of defaultMatches) {
            const parts = match.match(/export\s+default\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
            if (parts) exports.default.push(parts[1]);
        }
        
        // Named exports
        const namedMatches = content.match(this.patterns.exportNamed) || [];
        for (const match of namedMatches) {
            const parts = match.match(/export\s*{\s*([^}]*)\s*}/);
            if (parts) {
                const names = parts[1].split(',').map(n => n.trim());
                exports.named.push(...names);
            }
        }
        
        // Function exports
        const functionMatches = content.match(this.patterns.exportFunction) || [];
        for (const match of functionMatches) {
            const parts = match.match(/export\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
            if (parts) exports.function.push(parts[1]);
        }
        
        // Class exports
        const classMatches = content.match(this.patterns.exportClass) || [];
        for (const match of classMatches) {
            const parts = match.match(/export\s+class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
            if (parts) exports.class.push(parts[1]);
        }
        
        // Const exports
        const constMatches = content.match(this.patterns.exportConst) || [];
        for (const match of constMatches) {
            const parts = match.match(/export\s+const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
            if (parts) exports.const.push(parts[1]);
        }
        
        exports.total = exports.default.length + exports.named.length + 
                       exports.function.length + exports.class.length + 
                       exports.const.length;
        
        return exports;
    }

    // ==========================================
    // CONTROL FLOW ANALYSIS
    // ==========================================
    analyzeControlFlow(content) {
        return {
            if: (content.match(this.patterns.ifStatement) || []).length,
            else: (content.match(this.patterns.elseStatement) || []).length,
            for: (content.match(this.patterns.forStatement) || []).length,
            while: (content.match(this.patterns.whileStatement) || []).length,
            doWhile: (content.match(this.patterns.doWhile) || []).length,
            switch: (content.match(this.patterns.switch) || []).length,
            case: (content.match(this.patterns.case) || []).length,
            try: (content.match(this.patterns.try) || []).length,
            catch: (content.match(this.patterns.catch) || []).length,
            finally: (content.match(this.patterns.finally) || []).length,
            total: 0
        };
        
        const control = arguments[0];
        control.total = control.if + control.else + control.for + control.while + 
                       control.doWhile + control.switch + control.case + 
                       control.try + control.catch + control.finally;
        
        return control;
    }

    // ==========================================
    // PATTERN ANALYSIS
    // ==========================================
    analyzePatterns(content) {
        return {
            // Operators
            equality: (content.match(this.patterns.equality) || []).length,
            strictEquality: (content.match(this.patterns.strictEquality) || []).length,
            inequality: (content.match(this.patterns.inequality) || []).length,
            strictInequality: (content.match(this.patterns.strictInequality) || []).length,
            
            // Keywords
            this: (content.match(this.patterns.this) || []).length,
            new: (content.match(this.patterns.new) || []).length,
            await: (content.match(this.patterns.await) || []).length,
            yield: (content.match(this.patterns.yield) || []).length,
            return: (content.match(this.patterns.return) || []).length,
            throw: (content.match(this.patterns.throw) || []).length,
            
            // Console
            consoleLog: (content.match(this.patterns.consoleLog) || []).length,
            consoleError: (content.match(this.patterns.consoleError) || []).length,
            consoleWarn: (content.match(this.patterns.consoleWarn) || []).length,
            consoleInfo: (content.match(this.patterns.consoleInfo) || []).length,
            debugger: (content.match(this.patterns.debugger) || []).length,
            
            // DOM
            document: (content.match(this.patterns.document) || []).length,
            window: (content.match(this.patterns.window) || []).length,
            globalThis: (content.match(this.patterns.globalThis) || []).length,
            
            // Node.js
            require: (content.match(this.patterns.require) || []).length,
            moduleExports: (content.match(this.patterns.moduleExports) || []).length,
            exports: (content.match(this.patterns.exports) || []).length,
            process: (content.match(this.patterns.process) || []).length,
            
            // ES6+
            spread: (content.match(this.patterns.spread) || []).length,
            rest: (content.match(this.patterns.rest) || []).length,
            destructuring: (content.match(this.patterns.destructuring) || []).length,
            optionalChaining: (content.match(this.patterns.optionalChaining) || []).length,
            nullishCoalescing: (content.match(this.patterns.nullishCoalescing) || []).length
        };
    }

    // ==========================================
    // QUALITY ANALYSIS
    // ==========================================
    analyzeQuality(content) {
        const issues = [];
        let score = 100;

        // Check for missing strict mode
        if (!this.patterns.useStrict.test(content)) {
            issues.push('Missing "use strict" directive');
            score -= 5;
        }

        // Check for console.log usage
        const consoleLogs = (content.match(this.patterns.consoleLog) || []).length;
        if (consoleLogs > 5) {
            issues.push(`Excessive console.log usage (${consoleLogs})`);
            score -= 3;
        }

        // Check for var usage
        const varUsage = (content.match(this.patterns.varDeclaration) || []).length;
        if (varUsage > 0) {
            issues.push(`Using var (${varUsage} times) - consider let/const`);
            score -= 3;
        }

        // Check for debugger statements
        const debuggerCount = (content.match(this.patterns.debugger) || []).length;
        if (debuggerCount > 0) {
            issues.push(`Debugger statements found (${debuggerCount})`);
            score -= 5;
        }

        // Check for eval
        if (this.patterns.eval.test(content)) {
            issues.push('eval() used - security risk');
            score -= 10;
        }

        // Check for == vs ===
        const equality = (content.match(this.patterns.equality) || []).length;
        const strictEquality = (content.match(this.patterns.strictEquality) || []).length;
        if (equality > strictEquality) {
            issues.push(`More == (${equality}) than === (${strictEquality}) - use strict equality`);
            score -= 3;
        }

        // Check for long lines
        const lines = content.split('\n');
        const longLines = lines.filter(l => l.length > 120).length;
        if (longLines > lines.length * 0.1) {
            issues.push(`Many long lines (>120 chars) - ${longLines} of ${lines.length}`);
            score -= 3;
        }

        // Check for comments
        const comments = (content.match(this.patterns.singleLineComment) || []).length +
                        (content.match(this.patterns.multiLineComment) || []).length;
        if (comments < lines.length * 0.02) {
            issues.push('Limited comments - consider adding documentation');
            score -= 2;
        }

        return {
            issues: issues,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: issues.length > 0
        };
    }

    // ==========================================
    // DEPENDENCY ANALYSIS
    // ==========================================
    analyzeDependencies(content) {
        const deps = {
            npm: [],
            local: [],
            builtin: []
        };

        // Extract require dependencies
        const requireMatches = content.match(this.patterns.require) || [];
        for (const match of requireMatches) {
            const parts = match.match(/require\s*\(['"]([^'"]+)['"]\)/);
            if (parts) {
                const dep = parts[1];
                if (dep.startsWith('.')) {
                    deps.local.push(dep);
                } else if (this.isBuiltinModule(dep)) {
                    deps.builtin.push(dep);
                } else {
                    deps.npm.push(dep);
                }
            }
        }

        // Extract import dependencies
        const importMatches = content.match(this.patterns.import) || [];
        for (const match of importMatches) {
            const parts = match.match(/from\s+['"]([^'"]+)['"]/);
            if (parts) {
                const dep = parts[1];
                if (dep.startsWith('.')) {
                    deps.local.push(dep);
                } else if (this.isBuiltinModule(dep)) {
                    deps.builtin.push(dep);
                } else {
                    deps.npm.push(dep);
                }
            }
        }

        // Remove duplicates
        deps.npm = [...new Set(deps.npm)];
        deps.local = [...new Set(deps.local)];
        deps.builtin = [...new Set(deps.builtin)];

        return deps;
    }

    // ==========================================
    // FRAMEWORK DETECTION
    // ==========================================
    detectFrameworks(content) {
        const detected = [];

        for (const [key, framework] of Object.entries(this.frameworks)) {
            let matches = 0;
            for (const pattern of framework.patterns) {
                if (pattern.test(content)) {
                    matches++;
                }
                pattern.lastIndex = 0; // Reset for next test
            }
            if (matches > 0) {
                detected.push({
                    name: framework.name,
                    confidence: Math.min(100, (matches / framework.patterns.length) * 100)
                });
            }
        }

        return detected;
    }

    // ==========================================
    // SECURITY ANALYSIS
    // ==========================================
    analyzeSecurity(content) {
        const issues = [];
        let score = 100;

        // Check for eval
        if (this.patterns.eval.test(content)) {
            issues.push('eval() detected - security risk');
            score -= 15;
        }

        // Check for innerHTML
        if (content.includes('innerHTML')) {
            issues.push('innerHTML detected - XSS risk');
            score -= 10;
        }

        // Check for document.write
        if (content.includes('document.write')) {
            issues.push('document.write detected - XSS risk');
            score -= 10;
        }

        // Check for unsafe regex
        if (content.includes('new RegExp(') && content.match(/new RegExp\([^,]+\)/)) {
            issues.push('Unsafe RegExp - potential ReDoS vulnerability');
            score -= 5;
        }

        // Check for prototype pollution
        if (content.includes('__proto__') || content.includes('constructor.prototype')) {
            issues.push('Prototype pollution vulnerability detected');
            score -= 15;
        }

        // Check for sensitive data patterns
        const sensitivePatterns = [
            /password/i,
            /secret/i,
            /key["']?\s*[:=]/i,
            /token["']?\s*[:=]/i,
            /auth/i
        ];
        for (const pattern of sensitivePatterns) {
            if (pattern.test(content)) {
                issues.push(`Potential sensitive data: ${pattern.source}`);
                score -= 5;
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
    
    isModule(content) {
        return this.patterns.import.test(content) || 
               this.patterns.exportDefault.test(content) ||
               this.patterns.exportNamed.test(content);
    }

    isCommonJS(content) {
        return this.patterns.require.test(content) || 
               this.patterns.moduleExports.test(content);
    }

    isES6(content) {
        return this.patterns.letDeclaration.test(content) ||
               this.patterns.constDeclaration.test(content) ||
               this.patterns.class.test(content) ||
               this.patterns.arrowFunction.test(content);
    }

    isBuiltinModule(moduleName) {
        const builtins = [
            'fs', 'path', 'http', 'https', 'url', 'querystring', 'crypto',
            'stream', 'events', 'util', 'child_process', 'os', 'net',
            'dns', 'zlib', 'cluster', 'readline', 'vm', 'assert', 'buffer'
        ];
        return builtins.includes(moduleName);
    }

    getPreview(content, length = 200) {
        // Remove comments for preview
        let preview = content;
        preview = preview.replace(this.patterns.multiLineComment, '');
        preview = preview.replace(this.patterns.singleLineComment, '');
        preview = preview.replace(/\s+/g, ' ').trim();
        
        if (preview.length <= length) return preview;
        return preview.slice(0, length) + '...';
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
        if (analysis.structure.hasStrictMode) score += 3;
        if (analysis.structure.isES6) score += 3;
        if (analysis.functions.async > 0) score += 2;
        if (analysis.imports.total > 0) score += 2;
        if (analysis.exports.total > 0) score += 2;
        if (analysis.classes.total > 0) score += 2;
        if (analysis.patterns.strictEquality > analysis.patterns.equality) score += 3;
        
        return Math.max(0, Math.min(100, score));
    }

    calculateComplexity(analysis) {
        const factors = {
            lines: analysis.lines,
            functions: analysis.functions.counts.total,
            classes: analysis.classes.total,
            imports: analysis.imports.total,
            exports: analysis.exports.total,
            controlFlow: analysis.controlFlow.total,
            dependencies: analysis.dependencies.npm.length
        };
        
        // Calculate complexity score
        let complexity = 0;
        if (factors.lines > 50) complexity += 10;
        if (factors.lines > 200) complexity += 20;
        if (factors.lines > 500) complexity += 30;
        if (factors.functions > 5) complexity += 10;
        if (factors.functions > 20) complexity += 20;
        if (factors.classes > 2) complexity += 10;
        if (factors.imports > 5) complexity += 10;
        if (factors.controlFlow > 20) complexity += 10;
        if (factors.dependencies > 5) complexity += 10;
        
        if (complexity < 30) return 'simple';
        if (complexity < 60) return 'medium';
        if (complexity < 80) return 'complex';
        return 'very-complex';
    }

    // ==========================================
    // EXTRACTION METHODS
    // ==========================================
    
    extractFunctions(content) {
        const functions = [];
        const matches = content.match(/\b(function|async function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)/g) || [];
        for (const match of matches) {
            const parts = match.match(/(async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
            if (parts) {
                functions.push({
                    name: parts[2],
                    isAsync: !!parts[1],
                    signature: match
                });
            }
        }
        return functions;
    }

    extractClasses(content) {
        const classes = [];
        const matches = content.match(/\bclass\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s+extends\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?/g) || [];
        for (const match of matches) {
            const parts = match.match(/class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s+extends\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?/);
            if (parts) {
                classes.push({
                    name: parts[1],
                    extends: parts[2] || null
                });
            }
        }
        return classes;
    }

    extractImportsList(content) {
        const imports = [];
        const matches = content.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/g) || [];
        for (const match of matches) {
            const parts = match.match(/from\s+['"]([^'"]+)['"]/);
            if (parts) imports.push(parts[1]);
        }
        return imports;
    }

    extractExportsList(content) {
        const exports = [];
        const matches = content.match(/export\s+(?:default\s+)?(?:function|class|const|let|var|{)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
        for (const match of matches) {
            const parts = match.match(/export\s+(?:default\s+)?(?:function|class|const|let|var|{)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/);
            if (parts) exports.push(parts[1]);
        }
        return exports;
    }
}

export default JSHandler;
