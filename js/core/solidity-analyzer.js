// ============================================
// SOLIDITY SMART CONTRACT ANALYZER
// Complete Solidity Analysis Engine
// ============================================

export default class SolidityAnalyzer {
    constructor() {
        // ==========================================
        // SOLIDITY PATTERNS FOR EXTRACTION
        // ==========================================
        this.patterns = {
            // Contract structures
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
            
            // Data structures
            struct: /struct\s+(\w+)\s*{([^}]*)}/g,
            enum: /enum\s+(\w+)\s*{([^}]*)}/g,
            mapping: /mapping\s*\(([^)]*)\)\s*(?:public|private|internal)?\s+(\w+)/g,
            
            // Imports
            import: /import\s+['"]([^'"]+)['"]/g,
            importFrom: /import\s*{([^}]*)}\s*from\s+['"]([^'"]+)['"]/g,
            
            // Version
            pragma: /pragma\s+solidity\s+([^;]+);/g,
            
            // State variables
            stateVariable: /(?:public|private|internal)?\s*(?:uint|int|bool|address|string|bytes)\s+(\w+)/g,
            stateVariableWithValue: /(?:public|private|internal)?\s*(?:uint|int|bool|address|string|bytes)\s+(\w+)\s*=\s*([^;]+);/g,
            
            // Security features
            require: /require\s*\(/g,
            assert: /assert\s*\(/g,
            revert: /revert\s*\(/g,
            emit: /emit\s+/g,
            
            // Access control
            onlyOwner: /onlyOwner/g,
            owner: /\bowner\b/g,
            
            // Security patterns
            reentrancy: /(?:call|send|transfer)\s*\(/g,
            txOrigin: /tx\.origin/g,
            blockTimestamp: /block\.timestamp/g,
            blockNumber: /block\.number/g,
            msgSender: /msg\.sender/g,
            
            // Gas optimizations
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
            
            // Custom modifiers
            modifierDefinition: /modifier\s+(\w+)\s*\([^)]*\)\s*{/g
        };
        
        // ==========================================
        // SECURITY CHECK LIST
        // ==========================================
        this.securityChecks = {
            'Reentrancy': this.checkReentrancy.bind(this),
            'TX Origin': this.checkTxOrigin.bind(this),
            'Block Timestamp': this.checkBlockTimestamp.bind(this),
            'Block Number': this.checkBlockNumber.bind(this),
            'Integer Overflow': this.checkIntegerOverflow.bind(this),
            'Access Control': this.checkAccessControl.bind(this),
            'Unchecked Calls': this.checkUncheckedCalls.bind(this),
            'Denial of Service': this.checkDoS.bind(this),
            'Front Running': this.checkFrontRunning.bind(this),
            'Delegate Call': this.checkDelegateCall.bind(this)
        };
        
        // ==========================================
        // GAS OPTIMIZATION CHECK LIST
        // ==========================================
        this.gasChecks = {
            'View Functions': this.checkViewFunctions.bind(this),
            'Pure Functions': this.checkPureFunctions.bind(this),
            'External Visibility': this.checkExternalVisibility.bind(this),
            'Memory Usage': this.checkMemoryUsage.bind(this),
            'Calldata Usage': this.checkCalldataUsage.bind(this),
            'Storage vs Memory': this.checkStorageVsMemory.bind(this),
            'Public Variables': this.checkPublicVariables.bind(this),
            'Constant Variables': this.checkConstantVariables.bind(this)
        };
    }

    // ==========================================
    // MAIN ANALYSIS METHOD
    // ==========================================
    analyze(content, filename) {
        try {
            const analysis = {
                // Basic info
                name: this.extractContractName(content, filename),
                version: this.extractPragmaVersion(content),
                solidityVersion: this.extractPragmaVersion(content),
                
                // Structure
                contracts: this.extractContracts(content),
                interfaces: this.extractInterfaces(content),
                libraries: this.extractLibraries(content),
                abstractContracts: this.extractAbstractContracts(content),
                
                // Functions
                functions: this.extractFunctions(content),
                constructor: this.extractConstructor(content),
                hasFallback: this.hasFallback(content),
                hasReceive: this.hasReceive(content),
                
                // Data
                events: this.extractEvents(content),
                modifiers: this.extractModifiers(content),
                structs: this.extractStructs(content),
                enums: this.extractEnums(content),
                mappings: this.extractMappings(content),
                stateVariables: this.extractStateVariables(content),
                errors: this.extractErrors(content),
                
                // Imports
                imports: this.extractImports(content),
                
                // Security
                securityFeatures: this.analyzeSecurity(content),
                securityIssues: this.findSecurityIssues(content),
                securityScore: 0,
                
                // Gas
                gasOptimizations: this.analyzeGasOptimizations(content),
                gasScore: 0,
                
                // Complexity
                complexity: this.calculateComplexity(content),
                lines: content.split('\n').length,
                characters: content.length,
                
                // Flags
                hasRequire: content.includes('require('),
                hasAssert: content.includes('assert('),
                hasRevert: content.includes('revert('),
                hasEmit: content.includes('emit '),
                hasConstructor: content.includes('constructor('),
                hasFallback: content.includes('fallback()'),
                hasReceive: content.includes('receive()'),
                hasOverride: content.includes('override'),
                hasVirtual: content.includes('virtual'),
                isAbstract: content.includes('abstract'),
                hasModifierUsage: content.includes('_;'),
                hasPayable: content.includes('payable'),
                hasView: content.includes('view'),
                hasPure: content.includes('pure'),
                
                // Preview
                preview: this.getPreview(content, 200)
            };
            
            // Calculate scores
            analysis.securityScore = this.calculateSecurityScore(analysis);
            analysis.gasScore = this.calculateGasScore(analysis);
            
            return analysis;
        } catch (error) {
            console.error('Solidity analysis error:', error);
            return {
                name: filename.replace(/\.sol$/, ''),
                type: 'solidity',
                error: error.message,
                preview: 'Analysis failed'
            };
        }
    }

    // ==========================================
    // EXTRACTION METHODS
    // ==========================================
    
    extractContractName(content, filename) {
        const match = content.match(/contract\s+(\w+)\s*(?:is\s+[^{]+)?\s*{/);
        if (match) return match[1];
        return filename.replace(/\.sol$/, '');
    }

    extractPragmaVersion(content) {
        const match = content.match(/pragma\s+solidity\s+([^;]+);/);
        return match ? match[1].trim() : 'unknown';
    }

    extractContracts(content) {
        const contracts = [];
        let match;
        while ((match = this.patterns.contract.exec(content)) !== null) {
            contracts.push({
                name: match[1],
                inherits: match[2] ? match[2].split(',').map(s => s.trim()) : []
            });
        }
        return contracts;
    }

    extractInterfaces(content) {
        const interfaces = [];
        let match;
        while ((match = this.patterns.interface.exec(content)) !== null) {
            interfaces.push(match[1]);
        }
        return interfaces;
    }

    extractLibraries(content) {
        const libraries = [];
        let match;
        while ((match = this.patterns.library.exec(content)) !== null) {
            libraries.push(match[1]);
        }
        return libraries;
    }

    extractAbstractContracts(content) {
        const abstracts = [];
        let match;
        while ((match = this.patterns.abstract.exec(content)) !== null) {
            abstracts.push(match[1]);
        }
        return abstracts;
    }

    extractFunctions(content) {
        const functions = [];
        let match;
        while ((match = this.patterns.function.exec(content)) !== null) {
            functions.push({
                name: match[1],
                params: match[2] || '',
                returns: match[3] || '',
                isView: match[0].includes('view'),
                isPure: match[0].includes('pure'),
                isPayable: match[0].includes('payable'),
                visibility: this.extractVisibility(match[0])
            });
        }
        return functions;
    }

    extractVisibility(content) {
        if (content.includes('public')) return 'public';
        if (content.includes('private')) return 'private';
        if (content.includes('internal')) return 'internal';
        if (content.includes('external')) return 'external';
        return 'default';
    }

    extractConstructor(content) {
        const match = content.match(/constructor\s*\(([^)]*)\)\s*(?:public|internal)?/);
        if (match) {
            return {
                params: match[1] || '',
                isPublic: match[0].includes('public'),
                isInternal: match[0].includes('internal')
            };
        }
        return null;
    }

    hasFallback(content) {
        return content.includes('fallback()');
    }

    hasReceive(content) {
        return content.includes('receive()');
    }

    extractEvents(content) {
        const events = [];
        let match;
        while ((match = this.patterns.event.exec(content)) !== null) {
            events.push({
                name: match[1],
                params: match[2] || ''
            });
        }
        return events;
    }

    extractModifiers(content) {
        const modifiers = [];
        let match;
        while ((match = this.patterns.modifier.exec(content)) !== null) {
            modifiers.push({
                name: match[1],
                params: match[2] || ''
            });
        }
        return modifiers;
    }

    extractStructs(content) {
        const structs = [];
        let match;
        while ((match = this.patterns.struct.exec(content)) !== null) {
            structs.push({
                name: match[1],
                fields: match[2] ? match[2].split(';').map(s => s.trim()).filter(s => s) : []
            });
        }
        return structs;
    }

    extractEnums(content) {
        const enums = [];
        let match;
        while ((match = this.patterns.enum.exec(content)) !== null) {
            enums.push({
                name: match[1],
                values: match[2] ? match[2].split(',').map(s => s.trim()) : []
            });
        }
        return enums;
    }

    extractMappings(content) {
        const mappings = [];
        let match;
        while ((match = this.patterns.mapping.exec(content)) !== null) {
            mappings.push({
                type: match[1],
                name: match[2]
            });
        }
        return mappings;
    }

    extractStateVariables(content) {
        const variables = [];
        let match;
        while ((match = this.patterns.stateVariable.exec(content)) !== null) {
            variables.push(match[1]);
        }
        return variables;
    }

    extractErrors(content) {
        const errors = [];
        let match;
        while ((match = this.patterns.error.exec(content)) !== null) {
            errors.push({
                name: match[1],
                params: match[2] || ''
            });
        }
        return errors;
    }

    extractImports(content) {
        const imports = [];
        let match;
        while ((match = this.patterns.import.exec(content)) !== null) {
            imports.push(match[1]);
        }
        return imports;
    }

    // ==========================================
    // SECURITY ANALYSIS
    // ==========================================
    
    analyzeSecurity(content) {
        const features = [];
        
        if (content.includes('require(')) features.push('require');
        if (content.includes('assert(')) features.push('assert');
        if (content.includes('revert(')) features.push('revert');
        if (content.includes('modifier')) features.push('modifiers');
        if (content.includes('onlyOwner')) features.push('onlyOwner');
        if (content.includes('ReentrancyGuard')) features.push('reentrancyGuard');
        if (content.includes('Pausable')) features.push('pausable');
        if (content.includes('Ownable')) features.push('ownable');
        if (content.includes('SafeMath')) features.push('safeMath');
        if (content.includes('using SafeMath')) features.push('safeMath');
        
        return features;
    }

    findSecurityIssues(content) {
        const issues = [];
        let score = 100;
        
        // Check each security pattern
        for (const [name, check] of Object.entries(this.securityChecks)) {
            const result = check(content);
            if (result.found) {
                issues.push({
                    name: name,
                    severity: result.severity,
                    description: result.description,
                    line: result.line || 'unknown'
                });
                score -= result.severity === 'high' ? 20 : result.severity === 'medium' ? 10 : 5;
            }
        }
        
        return {
            issues: issues,
            score: Math.max(0, score)
        };
    }

    checkReentrancy(content) {
        const found = this.patterns.reentrancy.test(content);
        this.patterns.reentrancy.lastIndex = 0;
        return {
            found: found,
            severity: 'high',
            description: 'External calls detected - potential reentrancy vulnerability. Use checks-effects-interactions pattern.'
        };
    }

    checkTxOrigin(content) {
        const found = this.patterns.txOrigin.test(content);
        this.patterns.txOrigin.lastIndex = 0;
        return {
            found: found,
            severity: 'high',
            description: 'tx.origin used - potential phishing vulnerability. Use msg.sender instead.'
        };
    }

    checkBlockTimestamp(content) {
        const found = this.patterns.blockTimestamp.test(content);
        this.patterns.blockTimestamp.lastIndex = 0;
        return {
            found: found,
            severity: 'medium',
            description: 'block.timestamp used - can be manipulated by miners. Use cautiously.'
        };
    }

    checkBlockNumber(content) {
        const found = this.patterns.blockNumber.test(content);
        this.patterns.blockNumber.lastIndex = 0;
        return {
            found: found,
            severity: 'low',
            description: 'block.number used - ensure your logic accounts for varying block times.'
        };
    }

    checkIntegerOverflow(content) {
        // Check for SafeMath usage
        const hasSafeMath = content.includes('SafeMath') || content.includes('using SafeMath');
        const hasUnchecked = content.includes('unchecked {');
        return {
            found: !hasSafeMath && !hasUnchecked,
            severity: 'high',
            description: hasSafeMath ? 'SafeMath found' : 'No SafeMath or unchecked blocks detected. Use SafeMath or unchecked for arithmetic.'
        };
    }

    checkAccessControl(content) {
        const hasOwner = this.patterns.owner.test(content);
        this.patterns.owner.lastIndex = 0;
        const hasOnlyOwner = this.patterns.onlyOwner.test(content);
        this.patterns.onlyOwner.lastIndex = 0;
        return {
            found: !hasOwner || !hasOnlyOwner,
            severity: 'medium',
            description: hasOwner && hasOnlyOwner ? 'Access control found' : 'Limited access control detected. Consider using Ownable or custom modifiers.'
        };
    }

    checkUncheckedCalls(content) {
        const hasUnchecked = content.includes('unchecked {');
        return {
            found: !hasUnchecked,
            severity: 'low',
            description: 'No unchecked blocks found. Consider using unchecked for safe arithmetic.'
        };
    }

    checkDoS(content) {
        const hasLoops = (content.match(/for\s*\(/g) || []).length > 0;
        const hasArrays = content.includes('[]') || content.includes('array');
        return {
            found: hasLoops && hasArrays,
            severity: 'medium',
            description: 'Loops over dynamic arrays detected - potential DoS vulnerability. Use mappings where possible.'
        };
    }

    checkFrontRunning(content) {
        const hasAuction = content.includes('auction') || content.includes('bid');
        const hasCommitment = content.includes('commitment') || content.includes('reveal');
        return {
            found: hasAuction && !hasCommitment,
            severity: 'medium',
            description: 'Auction pattern detected without commitment/reveal - potential front-running vulnerability.'
        };
    }

    checkDelegateCall(content) {
        const hasDelegateCall = content.includes('delegatecall');
        return {
            found: hasDelegateCall,
            severity: 'high',
            description: 'delegatecall used - ensure proper security measures are in place.'
        };
    }

    // ==========================================
    // GAS OPTIMIZATION ANALYSIS
    // ==========================================
    
    analyzeGasOptimizations(content) {
        const optimizations = [];
        
        for (const [name, check] of Object.entries(this.gasChecks)) {
            const result = check(content);
            if (result.found) {
                optimizations.push({
                    name: name,
                    description: result.description,
                    benefit: result.benefit || 'medium'
                });
            }
        }
        
        return optimizations;
    }

    checkViewFunctions(content) {
        const hasView = this.patterns.view.test(content);
        this.patterns.view.lastIndex = 0;
        return {
            found: hasView,
            description: 'View functions found - these save gas on reads.',
            benefit: 'medium'
        };
    }

    checkPureFunctions(content) {
        const hasPure = this.patterns.pure.test(content);
        this.patterns.pure.lastIndex = 0;
        return {
            found: hasPure,
            description: 'Pure functions found - these save gas and are safe.',
            benefit: 'medium'
        };
    }

    checkExternalVisibility(content) {
        const hasExternal = this.patterns.external.test(content);
        this.patterns.external.lastIndex = 0;
        return {
            found: hasExternal,
            description: 'External functions found - external visibility is more gas efficient than public.',
            benefit: 'medium'
        };
    }

    checkMemoryUsage(content) {
        const hasMemory = this.patterns.memory.test(content);
        this.patterns.memory.lastIndex = 0;
        return {
            found: hasMemory,
            description: 'Memory usage detected - use memory for temporary data to save gas.',
            benefit: 'medium'
        };
    }

    checkCalldataUsage(content) {
        const hasCalldata = this.patterns.calldata.test(content);
        this.patterns.calldata.lastIndex = 0;
        return {
            found: hasCalldata,
            description: 'Calldata usage detected - calldata is cheaper than memory for external functions.',
            benefit: 'high'
        };
    }

    checkStorageVsMemory(content) {
        const hasStorage = this.patterns.storage.test(content);
        this.patterns.storage.lastIndex = 0;
        return {
            found: hasStorage && !hasMemory,
            description: hasStorage ? 'Storage usage detected - consider using memory for temporary variables.' : 'Good use of memory/storage.',
            benefit: 'high'
        };
    }

    checkPublicVariables(content) {
        const hasPublic = content.includes('public');
        return {
            found: hasPublic,
            description: 'Public variables found - consider making them private with getters for better gas efficiency.',
            benefit: 'low'
        };
    }

    checkConstantVariables(content) {
        const hasConstant = content.includes('constant');
        return {
            found: hasConstant,
            description: 'Constant variables found - these save gas and are safe.',
            benefit: 'medium'
        };
    }

    // ==========================================
    // SCORE CALCULATIONS
    // ==========================================
    
    calculateSecurityScore(analysis) {
        let score = 100;
        
        // Deduct for missing security features
        if (!analysis.hasRequire) score -= 10;
        if (!analysis.securityFeatures.includes('onlyOwner')) score -= 5;
        if (!analysis.securityFeatures.includes('reentrancyGuard')) score -= 10;
        if (!analysis.securityFeatures.includes('safeMath')) score -= 5;
        if (analysis.hasFallback && !analysis.hasReceive) score -= 5;
        
        // Add for security features
        if (analysis.securityFeatures.includes('onlyOwner')) score += 5;
        if (analysis.securityFeatures.includes('reentrancyGuard')) score += 10;
        if (analysis.securityFeatures.includes('safeMath')) score += 5;
        if (analysis.securityFeatures.includes('pausable')) score += 5;
        if (analysis.securityFeatures.includes('ownable')) score += 5;
        
        // Deduct for complexity
        if (analysis.complexity === 'complex') score -= 10;
        if (analysis.complexity === 'very-complex') score -= 15;
        
        return Math.max(0, Math.min(100, score));
    }

    calculateGasScore(analysis) {
        let score = 50; // Base score
        
        // Add for gas optimizations
        if (analysis.hasView) score += 10;
        if (analysis.hasPure) score += 10;
        if (analysis.gasOptimizations.length > 2) score += 10;
        if (analysis.gasOptimizations.length > 4) score += 10;
        
        return Math.max(0, Math.min(100, score));
    }

    // ==========================================
    // COMPLEXITY CALCULATION
    // ==========================================
    
    calculateComplexity(content) {
        const lines = content.split('\n').length;
        const functions = this.extractFunctions(content).length;
        const contracts = this.extractContracts(content).length;
        const imports = this.extractImports(content).length;
        const events = this.extractEvents(content).length;
        
        if (lines < 50 && functions < 3 && contracts < 2 && imports < 2) return 'simple';
        if (lines < 200 && functions < 10 && contracts < 3 && imports < 5) return 'medium';
        if (lines < 500 && functions < 20 && contracts < 5 && imports < 10) return 'complex';
        return 'very-complex';
    }

    // ==========================================
    // HELPERS
    // ==========================================
    
    getPreview(content, length = 200) {
        if (!content) return 'Empty file';
        const cleaned = content.replace(/\s+/g, ' ').trim();
        return cleaned.length > length ? cleaned.slice(0, length) + '...' : cleaned;
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export default SolidityAnalyzer;
