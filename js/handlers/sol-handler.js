// ============================================
// SOLIDITY HANDLER
// Complete Solidity File Processing
// ============================================

export default class SolidityHandler {
    constructor() {
        // ==========================================
        // SOLIDITY PATTERNS
        // ==========================================
        this.patterns = {
            // Version
            pragma: /pragma\s+solidity\s+([^;]+);/g,
            
            // Contracts
            contract: /contract\s+(\w+)\s*(?:is\s+([^{]+))?\s*{/g,
            interface: /interface\s+(\w+)\s*{/g,
            library: /library\s+(\w+)\s*{/g,
            abstract: /abstract\s+contract\s+(\w+)/g,
            
            // Functions
            function: /function\s+(\w+)\s*\(([^)]*)\)\s*(?:public|private|internal|external)?\s*(?:view|pure|payable)?\s*(?:returns\s*\(([^)]*)\))?/g,
            constructor: /constructor\s*\(([^)]*)\)\s*(?:public|internal)?/g,
            fallback: /fallback\s*\(\)\s*(?:external|public)?\s*(?:payable)?/g,
            receive: /receive\s*\(\)\s*(?:external|public)?\s*(?:payable)?/g,
            
            // Modifiers
            modifier: /modifier\s+(\w+)\s*\(([^)]*)\)/g,
            modifierUsage: /_\s*;/g,
            
            // Events
            event: /event\s+(\w+)\s*\(([^)]*)\)/g,
            
            // Structs & Enums
            struct: /struct\s+(\w+)\s*{([^}]*)}/g,
            enum: /enum\s+(\w+)\s*{([^}]*)}/g,
            
            // Mappings
            mapping: /mapping\s*\(([^)]*)\)\s*(?:public|private|internal)?\s+(\w+)/g,
            
            // Imports
            import: /import\s+['"]([^'"]+)['"]/g,
            importFrom: /import\s*{([^}]*)}\s*from\s+['"]([^'"]+)['"]/g,
            
            // State Variables
            stateVariable: /(?:public|private|internal)?\s*(?:uint|int|bool|address|string|bytes)\s+(\w+)/g,
            
            // Security
            require: /require\s*\(/g,
            assert: /assert\s*\(/g,
            revert: /revert\s*\(/g,
            emit: /emit\s+/g,
            onlyOwner: /onlyOwner/g,
            
            // Gas Optimization
            view: /view/g,
            pure: /pure/g,
            external: /external/g,
            memory: /memory/g,
            calldata: /calldata/g,
            storage: /storage/g,
            
            // Inheritance
            override: /override/g,
            virtual: /virtual/g,
            is: /\bis\s+/g,
            
            // Libraries
            using: /using\s+(\w+)\s+for/g,
            
            // Errors
            error: /error\s+(\w+)\s*\(([^)]*)\)/g,
            
            // Comments
            singleLineComment: /\/\/.*$/gm,
            multiLineComment: /\/\*[\s\S]*?\*\//g,
            natspec: /\/\/\/.*$/gm,
            
            // Strings
            string: /["']([^"']*)["']/g,
            
            // Numbers
            number: /\b(\d+)\b/g,
            hexNumber: /0x[0-9a-fA-F]+/g,
            
            // Addresses
            address: /0x[0-9a-fA-F]{40}/g,
            
            // Events
            eventCall: /emit\s+(\w+)\s*\(/g,
            
            // Modifier calls
            modifierCall: /_\s*;/g
        };
        
        // ==========================================
        // SOLIDITY VERSIONS
        // ==========================================
        this.versions = {
            '0.4.x': { features: ['view', 'pure', 'require', 'revert'] },
            '0.5.x': { features: ['view', 'pure', 'require', 'revert', 'emit', 'abi.encode'] },
            '0.6.x': { features: ['view', 'pure', 'require', 'revert', 'emit', 'try/catch'] },
            '0.7.x': { features: ['view', 'pure', 'require', 'revert', 'emit', 'custom errors'] },
            '0.8.x': { features: ['view', 'pure', 'require', 'revert', 'emit', 'custom errors', 'unchecked'] }
        };
        
        // ==========================================
        // SECURITY PATTERNS
        // ==========================================
        this.securityPatterns = {
            reentrancy: /(?:call|send|transfer)\s*\(/g,
            txOrigin: /tx\.origin/g,
            blockTimestamp: /block\.timestamp/g,
            blockNumber: /block\.number/g,
            msgSender: /msg\.sender/g,
            delegateCall: /delegatecall/g,
            selfDestruct: /selfdestruct/g,
            suicide: /suicide/g
        };
        
        // ==========================================
        // GAS OPTIMIZATION PATTERNS
        // ==========================================
        this.gasPatterns = {
            view: /view/g,
            pure: /pure/g,
            external: /external/g,
            memory: /memory/g,
            calldata: /calldata/g,
            storage: /storage/g,
            constant: /constant/g,
            immutable: /immutable/g
        };
    }

    // ==========================================
    // MAIN ANALYSIS
    // ==========================================
    analyze(content, filename) {
        const analysis = {
            type: 'solidity',
            name: filename,
            lines: content.split('\n').length,
            characters: content.length,
            timestamp: new Date().toISOString(),
            
            // Version
            version: this.extractVersion(content),
            
            // Structure
            structure: this.analyzeStructure(content),
            contracts: this.analyzeContracts(content),
            functions: this.analyzeFunctions(content),
            modifiers: this.analyzeModifiers(content),
            events: this.analyzeEvents(content),
            
            // Data Structures
            structs: this.analyzeStructs(content),
            enums: this.analyzeEnums(content),
            mappings: this.analyzeMappings(content),
            stateVariables: this.analyzeStateVariables(content),
            
            // Imports
            imports: this.analyzeImports(content),
            
            // Security
            security: this.analyzeSecurity(content),
            
            // Gas Optimization
            gasOptimization: this.analyzeGasOptimization(content),
            
            // Quality
            quality: this.analyzeQuality(content),
            
            // Complexity
            complexity: this.calculateComplexity(content),
            
            // Preview
            preview: this.getPreview(content, 200)
        };
        
        // Calculate score
        analysis.score = this.calculateScore(analysis);
        
        return analysis;
    }

    // ==========================================
    // VERSION EXTRACTION
    // ==========================================
    extractVersion(content) {
        const match = content.match(this.patterns.pragma);
        if (match) {
            const versionStr = match[0].replace(/pragma\s+solidity\s+/, '').replace(';', '').trim();
            return {
                raw: versionStr,
                major: this.parseVersion(versionStr)
            };
        }
        return { raw: 'unknown', major: 'unknown' };
    }

    parseVersion(versionStr) {
        if (versionStr.includes('>=') || versionStr.includes('^')) {
            const match = versionStr.match(/\d+\.\d+\.\d+/);
            if (match) return match[0];
        }
        return versionStr;
    }

    // ==========================================
    // STRUCTURE ANALYSIS
    // ==========================================
    analyzeStructure(content) {
        return {
            hasPragma: this.patterns.pragma.test(content),
            hasContract: this.patterns.contract.test(content),
            hasInterface: this.patterns.interface.test(content),
            hasLibrary: this.patterns.library.test(content),
            isAbstract: this.patterns.abstract.test(content),
            hasConstructor: this.patterns.constructor.test(content),
            hasFallback: this.patterns.fallback.test(content),
            hasReceive: this.patterns.receive.test(content)
        };
    }

    // ==========================================
    // CONTRACT ANALYSIS
    // ==========================================
    analyzeContracts(content) {
        const contracts = {
            total: 0,
            names: [],
            interfaces: [],
            libraries: [],
            inheritance: {}
        };

        // Contracts
        const contractMatches = content.match(this.patterns.contract) || [];
        contracts.total = contractMatches.length;
        for (const match of contractMatches) {
            const nameMatch = match.match(/contract\s+(\w+)/);
            if (nameMatch) {
                const name = nameMatch[1];
                contracts.names.push(name);
                
                // Check inheritance
                const inheritsMatch = match.match(/is\s+([^{]+)/);
                if (inheritsMatch) {
                    contracts.inheritance[name] = inheritsMatch[1].split(',').map(s => s.trim());
                }
            }
        }

        // Interfaces
        const interfaceMatches = content.match(this.patterns.interface) || [];
        for (const match of interfaceMatches) {
            const nameMatch = match.match(/interface\s+(\w+)/);
            if (nameMatch) contracts.interfaces.push(nameMatch[1]);
        }

        // Libraries
        const libraryMatches = content.match(this.patterns.library) || [];
        for (const match of libraryMatches) {
            const nameMatch = match.match(/library\s+(\w+)/);
            if (nameMatch) contracts.libraries.push(nameMatch[1]);
        }

        return contracts;
    }

    // ==========================================
    // FUNCTION ANALYSIS
    // ==========================================
    analyzeFunctions(content) {
        const functions = {
            total: 0,
            names: [],
            external: 0,
            public: 0,
            internal: 0,
            private: 0,
            view: 0,
            pure: 0,
            payable: 0,
            returns: 0,
            modifiers: {}
        };

        const funcMatches = content.match(this.patterns.function) || [];
        functions.total = funcMatches.length;

        for (const match of funcMatches) {
            const nameMatch = match.match(/function\s+(\w+)/);
            if (nameMatch) {
                const name = nameMatch[1];
                functions.names.push(name);
                
                if (match.includes('external')) functions.external++;
                if (match.includes('public')) functions.public++;
                if (match.includes('internal')) functions.internal++;
                if (match.includes('private')) functions.private++;
                if (match.includes('view')) functions.view++;
                if (match.includes('pure')) functions.pure++;
                if (match.includes('payable')) functions.payable++;
                if (match.includes('returns')) functions.returns++;
            }
        }

        return functions;
    }

    // ==========================================
    // MODIFIER ANALYSIS
    // ==========================================
    analyzeModifiers(content) {
        const modifiers = {
            total: 0,
            names: [],
            withParams: 0,
            usage: 0
        };

        const modifierMatches = content.match(this.patterns.modifier) || [];
        modifiers.total = modifierMatches.length;

        for (const match of modifierMatches) {
            const nameMatch = match.match(/modifier\s+(\w+)/);
            if (nameMatch) {
                modifiers.names.push(nameMatch[1]);
                if (match.includes('(') && !match.includes('()')) {
                    modifiers.withParams++;
                }
            }
        }

        // Count modifier usage
        const usageMatches = content.match(this.patterns.modifierUsage) || [];
        modifiers.usage = usageMatches.length;

        return modifiers;
    }

    // ==========================================
    // EVENT ANALYSIS
    // ==========================================
    analyzeEvents(content) {
        const events = {
            total: 0,
            names: [],
            withParams: 0,
            emitted: 0
        };

        const eventMatches = content.match(this.patterns.event) || [];
        events.total = eventMatches.length;

        for (const match of eventMatches) {
            const nameMatch = match.match(/event\s+(\w+)/);
            if (nameMatch) {
                events.names.push(nameMatch[1]);
                if (match.includes('(') && !match.includes('()')) {
                    events.withParams++;
                }
            }
        }

        // Count emitted events
        const emitMatches = content.match(this.patterns.eventCall) || [];
        events.emitted = emitMatches.length;

        return events;
    }

    // ==========================================
    // DATA STRUCTURE ANALYSIS
    // ==========================================
    analyzeStructs(content) {
        const structs = {
            total: 0,
            names: [],
            fields: {}
        };

        const structMatches = content.match(this.patterns.struct) || [];
        structs.total = structMatches.length;

        for (const match of structMatches) {
            const nameMatch = match.match(/struct\s+(\w+)/);
            if (nameMatch) {
                const name = nameMatch[1];
                structs.names.push(name);
                
                const fieldsMatch = match.match(/struct\s+\w+\s*{([^}]*)}/);
                if (fieldsMatch) {
                    const fields = fieldsMatch[1].split(';').map(f => f.trim()).filter(f => f);
                    structs.fields[name] = fields;
                }
            }
        }

        return structs;
    }

    analyzeEnums(content) {
        const enums = {
            total: 0,
            names: [],
            values: {}
        };

        const enumMatches = content.match(this.patterns.enum) || [];
        enums.total = enumMatches.length;

        for (const match of enumMatches) {
            const nameMatch = match.match(/enum\s+(\w+)/);
            if (nameMatch) {
                const name = nameMatch[1];
                enums.names.push(name);
                
                const valuesMatch = match.match(/enum\s+\w+\s*{([^}]*)}/);
                if (valuesMatch) {
                    const values = valuesMatch[1].split(',').map(v => v.trim()).filter(v => v);
                    enums.values[name] = values;
                }
            }
        }

        return enums;
    }

    analyzeMappings(content) {
        const mappings = {
            total: 0,
            list: []
        };

        const mappingMatches = content.match(this.patterns.mapping) || [];
        mappings.total = mappingMatches.length;

        for (const match of mappingMatches) {
            const typeMatch = match.match(/mapping\s*\(([^)]*)\)/);
            const nameMatch = match.match(/mapping\s*\([^)]*\)\s*(?:public|private|internal)?\s+(\w+)/);
            if (typeMatch && nameMatch) {
                mappings.list.push({
                    type: typeMatch[1],
                    name: nameMatch[1]
                });
            }
        }

        return mappings;
    }

    analyzeStateVariables(content) {
        const variables = {
            total: 0,
            names: [],
            public: 0,
            private: 0,
            internal: 0,
            constant: 0,
            immutable: 0
        };

        const varMatches = content.match(this.patterns.stateVariable) || [];
        variables.total = varMatches.length;

        for (const match of varMatches) {
            const nameMatch = match.match(/(?:public|private|internal)?\s*(?:uint|int|bool|address|string|bytes)\s+(\w+)/);
            if (nameMatch) {
                variables.names.push(nameMatch[1]);
                if (match.includes('public')) variables.public++;
                if (match.includes('private')) variables.private++;
                if (match.includes('internal')) variables.internal++;
                if (match.includes('constant')) variables.constant++;
                if (match.includes('immutable')) variables.immutable++;
            }
        }

        return variables;
    }

    // ==========================================
    // IMPORT ANALYSIS
    // ==========================================
    analyzeImports(content) {
        const imports = {
            total: 0,
            local: [],
            external: [],
            named: []
        };

        const importMatches = content.match(this.patterns.import) || [];
        imports.total = importMatches.length;

        for (const match of importMatches) {
            const pathMatch = match.match(/import\s+['"]([^'"]+)['"]/);
            if (pathMatch) {
                const path = pathMatch[1];
                if (path.startsWith('.')) {
                    imports.local.push(path);
                } else {
                    imports.external.push(path);
                }
            }
        }

        // Named imports
        const namedMatches = content.match(this.patterns.importFrom) || [];
        for (const match of namedMatches) {
            const pathMatch = match.match(/from\s+['"]([^'"]+)['"]/);
            const namesMatch = match.match(/import\s*{([^}]*)}/);
            if (pathMatch && namesMatch) {
                const names = namesMatch[1].split(',').map(n => n.trim()).filter(n => n);
                imports.named.push({
                    path: pathMatch[1],
                    names: names
                });
            }
        }

        return imports;
    }

    // ==========================================
    // SECURITY ANALYSIS
    // ==========================================
    analyzeSecurity(content) {
        const issues = [];
        let score = 100;

        // Check for reentrancy
        if (this.securityPatterns.reentrancy.test(content)) {
            issues.push('External calls detected - potential reentrancy vulnerability');
            score -= 15;
        }
        this.securityPatterns.reentrancy.lastIndex = 0;

        // Check for tx.origin
        if (this.securityPatterns.txOrigin.test(content)) {
            issues.push('tx.origin used - potential security risk');
            score -= 15;
        }
        this.securityPatterns.txOrigin.lastIndex = 0;

        // Check for block.timestamp
        if (this.securityPatterns.blockTimestamp.test(content)) {
            issues.push('block.timestamp used - can be manipulated by miners');
            score -= 10;
        }
        this.securityPatterns.blockTimestamp.lastIndex = 0;

        // Check for delegatecall
        if (this.securityPatterns.delegateCall.test(content)) {
            issues.push('delegatecall used - ensure proper security');
            score -= 10;
        }
        this.securityPatterns.delegateCall.lastIndex = 0;

        // Check for selfdestruct
        if (this.securityPatterns.selfDestruct.test(content) || 
            this.securityPatterns.suicide.test(content)) {
            issues.push('selfdestruct detected - use with caution');
            score -= 10;
        }
        this.securityPatterns.selfDestruct.lastIndex = 0;
        this.securityPatterns.suicide.lastIndex = 0;

        // Check for require
        if (!this.patterns.require.test(content)) {
            issues.push('No require statements found - consider input validation');
            score -= 5;
        }
        this.patterns.require.lastIndex = 0;

        // Check for onlyOwner
        if (!this.patterns.onlyOwner.test(content)) {
            issues.push('No onlyOwner modifier - consider access control');
            score -= 5;
        }
        this.patterns.onlyOwner.lastIndex = 0;

        // Check for SafeMath
        if (!content.includes('SafeMath') && !content.includes('using SafeMath') && 
            !content.includes('unchecked {')) {
            issues.push('No SafeMath or unchecked blocks - potential overflow');
            score -= 10;
        }

        // Check for events
        if (!this.patterns.event.test(content)) {
            issues.push('No events defined - consider adding events');
            score -= 5;
        }
        this.patterns.event.lastIndex = 0;

        return {
            issues: issues,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: issues.length > 0
        };
    }

    // ==========================================
    // GAS OPTIMIZATION ANALYSIS
    // ==========================================
    analyzeGasOptimization(content) {
        const optimizations = [];
        let score = 100;

        // Check for view functions
        if (this.gasPatterns.view.test(content)) {
            optimizations.push('View functions found - saves gas on reads');
            score += 5;
        }
        this.gasPatterns.view.lastIndex = 0;

        // Check for pure functions
        if (this.gasPatterns.pure.test(content)) {
            optimizations.push('Pure functions found - saves gas');
            score += 5;
        }
        this.gasPatterns.pure.lastIndex = 0;

        // Check for external visibility
        if (this.gasPatterns.external.test(content)) {
            optimizations.push('External functions found - more gas efficient than public');
            score += 5;
        }
        this.gasPatterns.external.lastIndex = 0;

        // Check for calldata usage
        if (this.gasPatterns.calldata.test(content)) {
            optimizations.push('Calldata usage found - cheaper than memory');
            score += 5;
        }
        this.gasPatterns.calldata.lastIndex = 0;

        // Check for memory usage
        if (this.gasPatterns.memory.test(content)) {
            optimizations.push('Memory usage found - good for temporary data');
            score += 3;
        }
        this.gasPatterns.memory.lastIndex = 0;

        // Check for constant/immutable
        if (this.gasPatterns.constant.test(content) || 
            this.gasPatterns.immutable.test(content)) {
            optimizations.push('Constant/immutable variables found - saves gas');
            score += 5;
        }
        this.gasPatterns.constant.lastIndex = 0;
        this.gasPatterns.immutable.lastIndex = 0;

        // Check for storage vs memory
        if (this.gasPatterns.storage.test(content)) {
            optimizations.push('Storage usage detected - consider using memory for temporary data');
            score -= 3;
        }
        this.gasPatterns.storage.lastIndex = 0;

        return {
            optimizations: optimizations,
            score: Math.max(0, Math.min(100, score)),
            hasOptimizations: optimizations.length > 0
        };
    }

    // ==========================================
    // QUALITY ANALYSIS
    // ==========================================
    analyzeQuality(content) {
        const issues = [];
        let score = 100;

        // Check for comments
        const comments = (content.match(this.patterns.singleLineComment) || []).length +
                        (content.match(this.patterns.multiLineComment) || []).length;
        if (comments < 5 && content.length > 500) {
            issues.push('Limited comments - consider adding documentation');
            score -= 5;
        }

        // Check for NatSpec
        if (!this.patterns.natspec.test(content)) {
            issues.push('No NatSpec comments - consider documenting functions');
            score -= 5;
        }
        this.patterns.natspec.lastIndex = 0;

        // Check for long functions
        const funcMatches = content.match(this.patterns.function) || [];
        for (const match of funcMatches) {
            const startIdx = content.indexOf(match);
            const endIdx = content.indexOf('}', startIdx);
            if (endIdx > startIdx) {
                const funcContent = content.substring(startIdx, endIdx);
                const lines = funcContent.split('\n').length;
                if (lines > 50) {
                    issues.push(`Long function detected (${lines} lines)`);
                    score -= 3;
                    break;
                }
            }
        }

        // Check for magic numbers
        const numbers = content.match(this.patterns.number) || [];
        const nonHexNumbers = numbers.filter(n => !n.startsWith('0x'));
        if (nonHexNumbers.length > 10) {
            issues.push('Magic numbers detected - consider using constants');
            score -= 3;
        }

        // Check for long lines
        const lines = content.split('\n');
        const longLines = lines.filter(l => l.length > 120).length;
        if (longLines > lines.length * 0.1) {
            issues.push(`Many long lines (>120 chars) - ${longLines} of ${lines.length}`);
            score -= 3;
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
    
    getPreview(content, length = 200) {
        let preview = content.replace(this.patterns.multiLineComment, '');
        preview = preview.replace(this.patterns.singleLineComment, '');
        preview = preview.replace(/\s+/g, ' ').trim();
        if (preview.length <= length) return preview;
        return preview.slice(0, length) + '...';
    }

    calculateComplexity(content) {
        const factors = {
            lines: content.split('\n').length,
            contracts: (content.match(this.patterns.contract) || []).length,
            functions: (content.match(this.patterns.function) || []).length,
            modifiers: (content.match(this.patterns.modifier) || []).length,
            events: (content.match(this.patterns.event) || []).length,
            imports: (content.match(this.patterns.import) || []).length,
            mappings: (content.match(this.patterns.mapping) || []).length
        };
        
        let complexity = 0;
        if (factors.lines > 50) complexity += 10;
        if (factors.lines > 200) complexity += 20;
        if (factors.lines > 500) complexity += 30;
        if (factors.contracts > 2) complexity += 10;
        if (factors.functions > 5) complexity += 10;
        if (factors.functions > 20) complexity += 20;
        if (factors.modifiers > 3) complexity += 10;
        if (factors.events > 5) complexity += 10;
        if (factors.imports > 5) complexity += 10;
        if (factors.mappings > 5) complexity += 10;
        
        if (complexity < 30) return 'simple';
        if (complexity < 60) return 'medium';
        if (complexity < 80) return 'complex';
        return 'very-complex';
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
        if (analysis.structure.hasPragma) score += 5;
        if (analysis.structure.hasContract) score += 5;
        if (analysis.structure.hasConstructor) score += 3;
        if (analysis.structure.hasReceive) score += 3;
        if (analysis.functions.view > 0) score += 3;
        if (analysis.functions.pure > 0) score += 3;
        if (analysis.modifiers.total > 0) score += 3;
        if (analysis.events.total > 0) score += 3;
        if (analysis.imports.total > 0) score += 2;
        
        // Gas optimization bonuses
        if (analysis.gasOptimization.hasOptimizations) {
            score += analysis.gasOptimization.optimizations.length;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    // ==========================================
    // EXTRACTION METHODS
    // ==========================================
    
    extractContracts(content) {
        const contracts = [];
        const matches = content.match(this.patterns.contract) || [];
        for (const match of matches) {
            const nameMatch = match.match(/contract\s+(\w+)/);
            if (nameMatch) {
                contracts.push({
                    name: nameMatch[1],
                    inherits: match.includes('is') ? match.match(/is\s+([^{]+)/)?.[1] || null : null
                });
            }
        }
        return contracts;
    }

    extractFunctions(content) {
        const functions = [];
        const matches = content.match(this.patterns.function) || [];
        for (const match of matches) {
            const nameMatch = match.match(/function\s+(\w+)/);
            if (nameMatch) {
                functions.push({
                    name: nameMatch[1],
                    visibility: this.extractVisibility(match),
                    isView: match.includes('view'),
                    isPure: match.includes('pure'),
                    isPayable: match.includes('payable'),
                    returns: match.includes('returns')
                });
            }
        }
        return functions;
    }

    extractVisibility(funcStr) {
        if (funcStr.includes('public')) return 'public';
        if (funcStr.includes('private')) return 'private';
        if (funcStr.includes('internal')) return 'internal';
        if (funcStr.includes('external')) return 'external';
        return 'default';
    }

    extractEvents(content) {
        const events = [];
        const matches = content.match(this.patterns.event) || [];
        for (const match of matches) {
            const nameMatch = match.match(/event\s+(\w+)/);
            if (nameMatch) {
                events.push({
                    name: nameMatch[1],
                    params: match.includes('(') ? match.match(/\(([^)]*)\)/)?.[1] || '' : ''
                });
            }
        }
        return events;
    }

    extractModifiersList(content) {
        const modifiers = [];
        const matches = content.match(this.patterns.modifier) || [];
        for (const match of matches) {
            const nameMatch = match.match(/modifier\s+(\w+)/);
            if (nameMatch) {
                modifiers.push({
                    name: nameMatch[1],
                    params: match.includes('(') ? match.match(/\(([^)]*)\)/)?.[1] || '' : ''
                });
            }
        }
        return modifiers;
    }
}

export default SolidityHandler;
