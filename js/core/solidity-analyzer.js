// ============================================
// SOLIDITY ANALYZER - ULTIMATE ADVANCED ENGINE
// ============================================

export default class SolidityAnalyzer {
    constructor(options = {}) {
        // ==========================================
        // CORE STATE
        // ==========================================
        this.contracts = new Map();
        this.analysisHistory = [];
        this.activeAnalyses = new Map();
        this.analysisQueue = [];
        this.idCounter = 0;
        this.isShuttingDown = false;
        this.eventListeners = new Map();

        // ==========================================
        // CONFIGURATION
        // ==========================================
        this.config = {
            enableDeepAnalysis: options.enableDeepAnalysis !== false,
            enableSecurityScan: options.enableSecurityScan !== false,
            enableGasAnalysis: options.enableGasAnalysis !== false,
            enableOptimizationAnalysis: options.enableOptimizationAnalysis !== false,
            enableInheritanceAnalysis: options.enableInheritanceAnalysis !== false,
            enableUpgradeabilityAnalysis: options.enableUpgradeabilityAnalysis !== false,
            enableABIAnalysis: options.enableABIAnalysis !== false,
            enableEventAnalysis: options.enableEventAnalysis !== false,
            enableLibraryAnalysis: options.enableLibraryAnalysis !== false,
            enableImportAnalysis: options.enableImportAnalysis !== false,
            enableVersionAnalysis: options.enableVersionAnalysis !== false,
            enableCompilerAnalysis: options.enableCompilerAnalysis !== false,
            enableMetadataAnalysis: options.enableMetadataAnalysis !== false,
            enableStorageAnalysis: options.enableStorageAnalysis !== false,
            enableMemoryAnalysis: options.enableMemoryAnalysis !== false,
            enableCalldataAnalysis: options.enableCalldataAnalysis !== false,
            enableFunctionAnalysis: options.enableFunctionAnalysis !== false,
            enableModifierAnalysis: options.enableModifierAnalysis !== false,
            enableEventEmissionAnalysis: options.enableEventEmissionAnalysis !== false,
            enableErrorAnalysis: options.enableErrorAnalysis !== false,
            enableCustomErrorAnalysis: options.enableCustomErrorAnalysis !== false,
            enableNatSpecAnalysis: options.enableNatSpecAnalysis !== false,
            enableDevDocAnalysis: options.enableDevDocAnalysis !== false,
            enableUserDocAnalysis: options.enableUserDocAnalysis !== false,
            enableLicenseAnalysis: options.enableLicenseAnalysis !== false,

            // Limits
            maxFileSize: options.maxFileSize || 5 * 1024 * 1024,
            maxAnalysisTime: options.maxAnalysisTime || 30000,
            maxConcurrent: options.maxConcurrent || 5,
            maxQueueSize: options.maxQueueSize || 50,

            // Logging
            enableLogging: options.enableLogging !== false,
            logLevel: options.logLevel || 'info',
            enablePerformanceMetrics: options.enablePerformanceMetrics !== false,

            // Security
            enableVulnerabilityScan: options.enableVulnerabilityScan !== false,
            enableReentrancyCheck: options.enableReentrancyCheck !== false,
            enableOverflowCheck: options.enableOverflowCheck !== false,
            enableUnderflowCheck: options.enableUnderflowCheck !== false,
            enableAccessControlCheck: options.enableAccessControlCheck !== false,
            enableFrontRunningCheck: options.enableFrontRunningCheck !== false,
            enableTimestampDependencyCheck: options.enableTimestampDependencyCheck !== false,
            enableBlockNumberDependencyCheck: options.enableBlockNumberDependencyCheck !== false,
            enableUncheckedTransferCheck: options.enableUncheckedTransferCheck !== false,
            enableDelegateCallCheck: options.enableDelegateCallCheck !== false,
            enableSelfDestructCheck: options.enableSelfDestructCheck !== false,
            enablePausableCheck: options.enablePausableCheck !== false,
            enableOwnableCheck: options.enableOwnableCheck !== false,
            enableERC20ComplianceCheck: options.enableERC20ComplianceCheck !== false,
            enableERC721ComplianceCheck: options.enableERC721ComplianceCheck !== false,
            enableERC1155ComplianceCheck: options.enableERC1155ComplianceCheck !== false,
            enableProxyPatternCheck: options.enableProxyPatternCheck !== false,
            enableUpgradeableCheck: options.enableUpgradeableCheck !== false,
            enableImmutableCheck: options.enableImmutableCheck !== false,

            // Gas Optimization
            enableGasOptimization: options.enableGasOptimization !== false,
            enableGasGolfing: options.enableGasGolfing !== false,
            enableStorageOptimization: options.enableStorageOptimization !== false,
            enableMemoryOptimization: options.enableMemoryOptimization !== false,
            enableCalldataOptimization: options.enableCalldataOptimization !== false,
            enableLoopOptimization: options.enableLoopOptimization !== false,
            enableAssemblyAnalysis: options.enableAssemblyAnalysis !== false,
            enableYulAnalysis: options.enableYulAnalysis !== false,

            // Solidity version specific
            solidityVersion: options.solidityVersion || '0.8.25',
            enableNewFeatures: options.enableNewFeatures !== false,
            enableDeprecationWarnings: options.enableDeprecationWarnings !== false,
            enableExperimentalFeatures: options.enableExperimentalFeatures !== false
        };

        // ==========================================
        // SECURITY PATTERNS
        // ==========================================
        this.securityPatterns = this.loadSecurityPatterns();

        // ==========================================
        // GAS OPTIMIZATION PATTERNS
        // ==========================================
        this.gasPatterns = this.loadGasPatterns();

        // ==========================================
        // SOLIDITY VERSION MAP
        // ==========================================
        this.versionMap = {
            '0.8.25': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: true },
            '0.8.24': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.23': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.22': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.21': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.20': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.19': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.18': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.17': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.16': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.15': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.14': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.13': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.12': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.11': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.10': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.9': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.8': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.7': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.6': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.5': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.4': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.3': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.2': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.1': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.8.0': { features: ['CustomError', 'Unchecked', 'Assembly'], latest: false },
            '0.7.6': { features: [], latest: false },
            '0.7.5': { features: [], latest: false },
            '0.7.4': { features: [], latest: false },
            '0.7.3': { features: [], latest: false },
            '0.7.2': { features: [], latest: false },
            '0.7.1': { features: [], latest: false },
            '0.7.0': { features: [], latest: false },
            '0.6.12': { features: [], latest: false },
            '0.6.11': { features: [], latest: false },
            '0.6.10': { features: [], latest: false },
            '0.6.9': { features: [], latest: false },
            '0.6.8': { features: [], latest: false },
            '0.6.7': { features: [], latest: false },
            '0.6.6': { features: [], latest: false },
            '0.6.5': { features: [], latest: false },
            '0.6.4': { features: [], latest: false },
            '0.6.3': { features: [], latest: false },
            '0.6.2': { features: [], latest: false },
            '0.6.1': { features: [], latest: false },
            '0.6.0': { features: [], latest: false },
            '0.5.17': { features: [], latest: false },
            '0.5.16': { features: [], latest: false },
            '0.5.15': { features: [], latest: false },
            '0.5.14': { features: [], latest: false },
            '0.5.13': { features: [], latest: false },
            '0.5.12': { features: [], latest: false },
            '0.5.11': { features: [], latest: false },
            '0.5.10': { features: [], latest: false },
            '0.5.9': { features: [], latest: false },
            '0.5.8': { features: [], latest: false },
            '0.5.7': { features: [], latest: false },
            '0.5.6': { features: [], latest: false },
            '0.5.5': { features: [], latest: false },
            '0.5.4': { features: [], latest: false },
            '0.5.3': { features: [], latest: false },
            '0.5.2': { features: [], latest: false },
            '0.5.1': { features: [], latest: false },
            '0.5.0': { features: [], latest: false },
            '0.4.26': { features: [], latest: false },
            '0.4.25': { features: [], latest: false },
            '0.4.24': { features: [], latest: false },
            '0.4.23': { features: [], latest: false },
            '0.4.22': { features: [], latest: false },
            '0.4.21': { features: [], latest: false },
            '0.4.20': { features: [], latest: false },
            '0.4.19': { features: [], latest: false },
            '0.4.18': { features: [], latest: false }
        };

        // ==========================================
        // NATSPEC TAG REGISTRY
        // ==========================================
        this.natSpecTags = {
            '@title': 'Contract title',
            '@author': 'Contract author',
            '@notice': 'Contract notice',
            '@dev': 'Developer documentation',
            '@param': 'Function parameter',
            '@return': 'Return value',
            '@inheritdoc': 'Inherit documentation',
            '@custom': 'Custom tag',
            '@natspec': 'NatSpec',
            '@version': 'Version',
            '@license': 'License',
            '@custom:security': 'Security notice'
        };

        this.log('🔍 SolidityAnalyzer Ultimate initialized');
        this.log(`📦 Security Patterns: ${Object.keys(this.securityPatterns).length}`);
        this.log(`⚡ Gas Patterns: ${Object.keys(this.gasPatterns).length}`);
        this.log(`📚 Solidity Versions: ${Object.keys(this.versionMap).length}`);
    }

    // ==========================================
    // MAIN ANALYSIS METHOD
    // ==========================================

    async analyze(content, options = {}) {
        if (this.isShuttingDown) {
            throw new Error('SolidityAnalyzer is shutting down');
        }

        const id = this.generateId();
        const startTime = performance.now();
        const analysisOptions = { ...this.config, ...options };

        this.log(`📊 Analyzing Solidity contract...`);

        // Check queue
        if (this.analysisQueue.length >= this.config.maxQueueSize) {
            throw new Error('Analysis queue is full');
        }

        // Check concurrent
        if (this.activeAnalyses.size >= this.config.maxConcurrent) {
            return this.queueAnalysis(content, analysisOptions, id);
        }

        return this.executeAnalysis(content, analysisOptions, id, startTime);
    }

    // ==========================================
    // ANALYSIS EXECUTION
    // ==========================================

    async executeAnalysis(content, options, id, startTime) {
        const analyses = [];
        const warnings = [];
        const errors = [];
        const metrics = {};

        try {
            // Step 1: Pre-processing
            const preprocessed = this.preprocessContent(content);
            this.emit('analysisProgress', { id, stage: 'preprocess', progress: 5 });

            // Step 2: Extract metadata
            const metadata = this.extractMetadata(preprocessed);
            this.emit('analysisProgress', { id, stage: 'metadata', progress: 10 });

            // Step 3: Detect version
            const version = this.detectVersion(preprocessed);
            this.emit('analysisProgress', { id, stage: 'version', progress: 15 });

            // Step 4: Parse contracts
            const contracts = this.parseContracts(preprocessed);
            this.emit('analysisProgress', { id, stage: 'parse', progress: 25 });

            // Step 5: Analyze security
            const security = this.analyzeSecurity(preprocessed, contracts);
            this.emit('analysisProgress', { id, stage: 'security', progress: 35 });

            // Step 6: Analyze gas
            const gas = this.analyzeGas(preprocessed, contracts);
            this.emit('analysisProgress', { id, stage: 'gas', progress: 45 });

            // Step 7: Analyze ABI
            const abi = this.analyzeABI(preprocessed, contracts);
            this.emit('analysisProgress', { id, stage: 'abi', progress: 55 });

            // Step 8: Analyze events
            const events = this.analyzeEvents(preprocessed, contracts);
            this.emit('analysisProgress', { id, stage: 'events', progress: 65 });

            // Step 9: Analyze functions
            const functions = this.analyzeFunctions(preprocessed, contracts);
            this.emit('analysisProgress', { id, stage: 'functions', progress: 75 });

            // Step 10: Analyze modifiers
            const modifiers = this.analyzeModifiers(preprocessed, contracts);
            this.emit('analysisProgress', { id, stage: 'modifiers', progress: 80 });

            // Step 11: Analyze inheritance
            const inheritance = this.analyzeInheritance(preprocessed, contracts);
            this.emit('analysisProgress', { id, stage: 'inheritance', progress: 85 });

            // Step 12: Analyze storage
            const storage = this.analyzeStorage(preprocessed, contracts);
            this.emit('analysisProgress', { id, stage: 'storage', progress: 90 });

            // Step 13: Analyze NatSpec
            const natspec = this.analyzeNatSpec(preprocessed, contracts);
            this.emit('analysisProgress', { id, stage: 'natspec', progress: 93 });

            // Step 14: Generate report
            const report = this.generateReport({
                metadata, version, contracts, security, gas, abi, events, functions, modifiers, inheritance, storage, natspec
            });
            this.emit('analysisProgress', { id, stage: 'report', progress: 98 });

            // Step 15: Build result
            const result = {
                id,
                timestamp: new Date().toISOString(),
                duration: performance.now() - startTime,
                status: 'completed',
                metadata,
                version,
                contracts,
                security,
                gas,
                abi,
                events,
                functions,
                modifiers,
                inheritance,
                storage,
                natspec,
                report,
                warnings,
                errors: errors.length > 0 ? errors : undefined
            };

            // Store in history
            this.analysisHistory.push(result);
            this.activeAnalyses.delete(id);

            this.log(`✅ Analysis ${id} completed in ${result.duration.toFixed(2)}ms`);
            this.emit('analysisComplete', { id, result });

            // Process queue
            this.processNext();

            return {
                success: true,
                result,
                message: `✅ Analysis completed in ${result.duration.toFixed(2)}ms`,
                warnings,
                errors: errors.length > 0 ? errors : undefined
            };

        } catch (error) {
            this.activeAnalyses.delete(id);
            this.log(`❌ Analysis ${id} failed: ${error.message}`);
            this.emit('analysisError', { id, error });

            return {
                success: false,
                error: error.message,
                stack: error.stack,
                id,
                errors
            };
        }
    }

    async queueAnalysis(content, options, id) {
        return new Promise((resolve, reject) => {
            const queueItem = {
                id,
                content,
                options,
                startTime: Date.now(),
                resolve,
                reject
            };
            this.analysisQueue.push(queueItem);
            this.log(`📥 Queued ${id} (position: ${this.analysisQueue.length})`);
            this.emit('analysisQueued', queueItem);
        });
    }

    processNext() {
        if (this.analysisQueue.length === 0) return;
        if (this.activeAnalyses.size >= this.config.maxConcurrent) return;

        const queueItem = this.analysisQueue.shift();
        if (!queueItem) return;

        this.executeAnalysis(queueItem.content, queueItem.options, queueItem.id, Date.now())
            .then(result => {
                if (result.success) {
                    queueItem.resolve(result);
                } else {
                    queueItem.reject(new Error(result.error));
                }
            })
            .catch(error => {
                queueItem.reject(error);
            });
    }

    // ==========================================
    // PRE-PROCESSING
    // ==========================================

    preprocessContent(content) {
        // Remove comments
        let processed = content.replace(/\/\/.*$/gm, '');
        processed = processed.replace(/\/\*[\s\S]*?\*\//g, '');

        // Normalize whitespace
        processed = processed.replace(/\s+/g, ' ');

        // Remove empty lines
        processed = processed.replace(/^\s*$/gm, '');

        // Extract lines
        const lines = content.split('\n');

        return {
            original: content,
            processed,
            lines,
            lineCount: lines.length,
            characterCount: content.length,
            wordCount: content.split(/\s+/).length
        };
    }

    // ==========================================
    // METADATA EXTRACTION
    // ==========================================

    extractMetadata(preprocessed) {
        const content = preprocessed.original;
        const metadata = {
            pragma: null,
            imports: [],
            contracts: [],
            libraries: [],
            interfaces: [],
            enums: [],
            structs: [],
            errors: [],
            events: [],
            modifiers: [],
            functions: [],
            variables: [],
            constants: [],
            immutables: [],
            stateVariables: [],
            customErrors: []
        };

        // Extract pragma
        const pragmaMatch = content.match(/pragma\s+solidity\s+([^;]+);/);
        if (pragmaMatch) {
            metadata.pragma = pragmaMatch[1].trim();
        }

        // Extract imports
        const importMatches = content.match(/import\s+(?:.*?from\s+)?["']([^"']+)["']/g) || [];
        for (const match of importMatches) {
            const path = match.replace(/import\s+(?:.*?from\s+)?["']/, '').replace(/["']$/, '');
            metadata.imports.push(path);
        }

        // Extract contracts
        const contractMatches = content.match(/contract\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of contractMatches) {
            const name = match.replace('contract ', '');
            metadata.contracts.push(name);
        }

        // Extract libraries
        const libraryMatches = content.match(/library\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of libraryMatches) {
            const name = match.replace('library ', '');
            metadata.libraries.push(name);
        }

        // Extract interfaces
        const interfaceMatches = content.match(/interface\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of interfaceMatches) {
            const name = match.replace('interface ', '');
            metadata.interfaces.push(name);
        }

        // Extract enums
        const enumMatches = content.match(/enum\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of enumMatches) {
            const name = match.replace('enum ', '');
            metadata.enums.push(name);
        }

        // Extract structs
        const structMatches = content.match(/struct\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of structMatches) {
            const name = match.replace('struct ', '');
            metadata.structs.push(name);
        }

        // Extract errors
        const errorMatches = content.match(/error\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of errorMatches) {
            const name = match.replace('error ', '');
            metadata.errors.push(name);
        }

        // Extract events
        const eventMatches = content.match(/event\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of eventMatches) {
            const name = match.replace('event ', '');
            metadata.events.push(name);
        }

        // Extract modifiers
        const modifierMatches = content.match(/modifier\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of modifierMatches) {
            const name = match.replace('modifier ', '');
            metadata.modifiers.push(name);
        }

        // Extract functions
        const functionMatches = content.match(/function\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of functionMatches) {
            const name = match.replace('function ', '');
            metadata.functions.push(name);
        }

        // Extract variables
        const variableMatches = content.match(/(?:uint|int|address|bool|string|bytes)\s+(?:public|private|internal|external)?\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of variableMatches) {
            const parts = match.match(/([A-Za-z_][A-Za-z0-9_]*)\s*[=;]/);
            if (parts) {
                metadata.variables.push(parts[1]);
            }
        }

        return metadata;
    }

    // ==========================================
    // VERSION DETECTION
    // ==========================================

    detectVersion(preprocessed) {
        const content = preprocessed.original;
        const versionMatch = content.match(/pragma\s+solidity\s+([^;]+);/);
        
        if (!versionMatch) {
            return {
                version: 'unknown',
                features: [],
                isLatest: false,
                recommendations: ['Add pragma solidity version']
            };
        }

        const version = versionMatch[1].trim();
        const versionInfo = this.versionMap[version] || { features: [], latest: false };

        return {
            version,
            features: versionInfo.features || [],
            isLatest: versionInfo.latest || false,
            recommendations: this.generateVersionRecommendations(version, versionInfo)
        };
    }

    generateVersionRecommendations(version, versionInfo) {
        const recommendations = [];

        if (!versionInfo) {
            recommendations.push(`⚠️ Unknown version: ${version} - consider upgrading`);
        }

        if (!versionInfo?.latest) {
            const latestVersions = Object.keys(this.versionMap).filter(v => this.versionMap[v].latest);
            if (latestVersions.length > 0) {
                recommendations.push(`📈 Consider upgrading to latest version: ${latestVersions[0]}`);
            }
        }

        if (version.startsWith('0.4.') || version.startsWith('0.5.')) {
            recommendations.push('🔧 Outdated version - many security features missing');
        }

        if (version.startsWith('0.6.')) {
            recommendations.push('🔧 Consider upgrading to 0.8.x for latest features');
        }

        return recommendations;
    }

    // ==========================================
    // CONTRACT PARSING
    // ==========================================

    parseContracts(preprocessed) {
        const content = preprocessed.original;
        const contracts = [];

        // Find all contract blocks
        const contractBlocks = this.findContractBlocks(content);

        for (const block of contractBlocks) {
            const contract = this.parseContractBlock(block);
            contracts.push(contract);
        }

        return contracts;
    }

    findContractBlocks(content) {
        const blocks = [];
        let depth = 0;
        let start = -1;
        let inContract = false;

        for (let i = 0; i < content.length; i++) {
            const char = content[i];

            if (char === '{') {
                depth++;
                if (inContract && depth === 1) {
                    start = i;
                }
            } else if (char === '}') {
                depth--;
                if (inContract && depth === 0) {
                    const block = content.substring(start, i + 1);
                    blocks.push(block);
                    inContract = false;
                }
            }

            // Check for contract declaration
            if (!inContract && content.substring(i).startsWith('contract ')) {
                inContract = true;
                start = content.indexOf('{', i);
                if (start !== -1) {
                    // Find the contract name
                    const match = content.substring(i).match(/contract\s+([A-Za-z_][A-Za-z0-9_]*)/);
                    if (match) {
                        // Continue parsing
                    }
                }
            }
        }

        return blocks;
    }

    parseContractBlock(block) {
        const contract = {
            name: '',
            functions: [],
            events: [],
            modifiers: [],
            variables: [],
            constants: [],
            immutables: [],
            stateVariables: [],
            customErrors: [],
            structs: [],
            enums: [],
            inheritance: [],
            libraries: [],
            modifiers: [],
            overrides: [],
            interfaceImplementations: [],
            isAbstract: false,
            isInterface: false,
            isLibrary: false,
            isUpgradeable: false,
            isProxy: false,
            hasConstructor: false,
            hasFallback: false,
            hasReceive: false,
            hasModifiers: false,
            hasCustomErrors: false,
            hasEvents: false,
            hasStructs: false,
            hasEnums: false,
            lines: block.split('\n').length,
            characters: block.length
        };

        // Extract contract name
        const nameMatch = block.match(/contract\s+([A-Za-z_][A-Za-z0-9_]*)/);
        if (nameMatch) {
            contract.name = nameMatch[1];
        }

        // Extract inheritance
        const inheritsMatch = block.match(/is\s+([A-Za-z_][A-Za-z0-9_]*)/g);
        if (inheritsMatch) {
            for (const match of inheritsMatch) {
                const name = match.replace('is ', '');
                contract.inheritance.push(name);
            }
        }

        // Extract functions
        const functionMatches = block.match(/function\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of functionMatches) {
            const name = match.replace('function ', '');
            contract.functions.push(name);
        }

        // Extract events
        const eventMatches = block.match(/event\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of eventMatches) {
            const name = match.replace('event ', '');
            contract.events.push(name);
        }

        // Extract modifiers
        const modifierMatches = block.match(/modifier\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of modifierMatches) {
            const name = match.replace('modifier ', '');
            contract.modifiers.push(name);
        }

        // Extract variables
        const variableMatches = block.match(/(?:uint|int|address|bool|string|bytes)\s+(?:public|private|internal|external)?\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of variableMatches) {
            const parts = match.match(/([A-Za-z_][A-Za-z0-9_]*)\s*[=;]/);
            if (parts) {
                contract.variables.push(parts[1]);
            }
        }

        // Check for constructor
        if (block.includes('constructor(')) {
            contract.hasConstructor = true;
        }

        // Check for fallback
        if (block.includes('fallback(')) {
            contract.hasFallback = true;
        }

        // Check for receive
        if (block.includes('receive(')) {
            contract.hasReceive = true;
        }

        // Check for abstract
        if (block.includes('abstract contract')) {
            contract.isAbstract = true;
        }

        // Check for interface
        if (block.includes('interface ')) {
            contract.isInterface = true;
        }

        // Check for library
        if (block.includes('library ')) {
            contract.isLibrary = true;
        }

        // Check for upgradeable
        if (block.includes('Upgradeable') || block.includes('Proxy')) {
            contract.isUpgradeable = true;
        }

        // Check for proxy
        if (block.includes('Proxy')) {
            contract.isProxy = true;
        }

        return contract;
    }

    // ==========================================
    // SECURITY ANALYSIS
    // ==========================================

    analyzeSecurity(preprocessed, contracts) {
        const content = preprocessed.original;
        const vulnerabilities = [];
        const securityScore = 100;

        // Check for reentrancy
        if (this.config.enableReentrancyCheck) {
            const reentrancyMatches = content.match(/call\.value\s*\(/g) || [];
            if (reentrancyMatches.length > 0) {
                vulnerabilities.push({
                    type: 'reentrancy',
                    severity: 'critical',
                    description: `Potential reentrancy vulnerability: ${reentrancyMatches.length} external calls found`,
                    recommendation: 'Use checks-effects-interactions pattern'
                });
            }
        }

        // Check for overflow/underflow
        if (this.config.enableOverflowCheck) {
            const overflowMatches = content.match(/(?:\+|-)+\s*=\s*/g) || [];
            if (overflowMatches.length > 0) {
                vulnerabilities.push({
                    type: 'arithmetic-overflow',
                    severity: 'high',
                    description: `Potential arithmetic overflow/underflow: ${overflowMatches.length} operations found`,
                    recommendation: 'Use SafeMath library or unchecked blocks (Solidity 0.8+)'
                });
            }
        }

        // Check for unchecked transfers
        if (this.config.enableUncheckedTransferCheck) {
            const transferMatches = content.match(/transfer\s*\(/g) || [];
            if (transferMatches.length > 0) {
                vulnerabilities.push({
                    type: 'unchecked-transfer',
                    severity: 'medium',
                    description: `Potential unchecked transfer: ${transferMatches.length} transfers found`,
                    recommendation: 'Always check return values and use require'
                });
            }
        }

        // Check for delegatecall
        if (this.config.enableDelegateCallCheck) {
            const delegateCallMatches = content.match(/delegatecall\s*\(/g) || [];
            if (delegateCallMatches.length > 0) {
                vulnerabilities.push({
                    type: 'delegatecall',
                    severity: 'high',
                    description: `Potential delegatecall vulnerability: ${delegateCallMatches.length} delegatecalls found`,
                    recommendation: 'Be extremely careful with delegatecall usage'
                });
            }
        }

        // Check for selfdestruct
        if (this.config.enableSelfDestructCheck) {
            const selfdestructMatches = content.match(/selfdestruct\s*\(/g) || [];
            if (selfdestructMatches.length > 0) {
                vulnerabilities.push({
                    type: 'selfdestruct',
                    severity: 'critical',
                    description: `Potential selfdestruct vulnerability: ${selfdestructMatches.length} selfdestructs found`,
                    recommendation: 'Use with extreme caution or avoid entirely'
                });
            }
        }

        // Check for timestamp dependency
        if (this.config.enableTimestampDependencyCheck) {
            const timestampMatches = content.match(/block\.timestamp/gi) || [];
            if (timestampMatches.length > 0) {
                vulnerabilities.push({
                    type: 'timestamp-dependency',
                    severity: 'medium',
                    description: `Potential timestamp dependency: ${timestampMatches.length} references found`,
                    recommendation: 'Avoid using block.timestamp for critical logic'
                });
            }
        }

        // Check for block number dependency
        if (this.config.enableBlockNumberDependencyCheck) {
            const blockNumberMatches = content.match(/block\.number/gi) || [];
            if (blockNumberMatches.length > 0) {
                vulnerabilities.push({
                    type: 'block-number-dependency',
                    severity: 'low',
                    description: `Potential block number dependency: ${blockNumberMatches.length} references found`,
                    recommendation: 'Avoid using block.number for critical logic'
                });
            }
        }

        // Check for front-running
        if (this.config.enableFrontRunningCheck) {
            const frontRunningPatterns = [
                /tx\.origin/,
                /msg\.sender/,
                /require\s*\(.*msg\.sender.*==/g
            ];
            for (const pattern of frontRunningPatterns) {
                const matches = content.match(pattern) || [];
                if (matches.length > 0) {
                    vulnerabilities.push({
                        type: 'front-running',
                        severity: 'medium',
                        description: `Potential front-running vulnerability: ${matches.length} patterns found`,
                        recommendation: 'Use commit-reveal pattern or similar mechanisms'
                    });
                }
            }
        }

        // Check access control
        if (this.config.enableAccessControlCheck) {
            const accessControlMatches = content.match(/onlyOwner|onlyAdmin|onlyRole/gi) || [];
            if (accessControlMatches.length === 0) {
                vulnerabilities.push({
                    type: 'access-control',
                    severity: 'medium',
                    description: 'No access control modifiers found',
                    recommendation: 'Implement access control (Ownable, AccessControl, etc.)'
                });
            }
        }

        // Check for missing pausable
        if (this.config.enablePausableCheck) {
            const pausableMatches = content.match(/Pausable|whenNotPaused|whenPaused/gi) || [];
            if (pausableMatches.length === 0) {
                vulnerabilities.push({
                    type: 'missing-pausable',
                    severity: 'low',
                    description: 'No pausable mechanism found',
                    recommendation: 'Consider implementing Pausable for emergency stops'
                });
            }
        }

        // Check ERC20 compliance
        if (this.config.enableERC20ComplianceCheck) {
            const erc20Functions = ['transfer', 'transferFrom', 'approve', 'allowance', 'totalSupply', 'balanceOf'];
            const erc20Matches = erc20Functions.filter(fn => content.includes(`function ${fn}`));
            if (erc20Matches.length < 6) {
                vulnerabilities.push({
                    type: 'erc20-compliance',
                    severity: 'low',
                    description: `ERC20 compliance: missing ${6 - erc20Matches.length} functions`,
                    recommendation: 'Implement all ERC20 standard functions'
                });
            }
        }

        // Check ERC721 compliance
        if (this.config.enableERC721ComplianceCheck) {
            const erc721Functions = ['ownerOf', 'safeTransferFrom', 'transferFrom', 'approve', 'setApprovalForAll', 'getApproved', 'isApprovedForAll'];
            const erc721Matches = erc721Functions.filter(fn => content.includes(`function ${fn}`));
            if (erc721Matches.length < 7) {
                vulnerabilities.push({
                    type: 'erc721-compliance',
                    severity: 'low',
                    description: `ERC721 compliance: missing ${7 - erc721Matches.length} functions`,
                    recommendation: 'Implement all ERC721 standard functions'
                });
            }
        }

        // Check ERC1155 compliance
        if (this.config.enableERC1155ComplianceCheck) {
            const erc1155Functions = ['safeTransferFrom', 'safeBatchTransferFrom', 'balanceOf', 'balanceOfBatch', 'setApprovalForAll', 'isApprovedForAll'];
            const erc1155Matches = erc1155Functions.filter(fn => content.includes(`function ${fn}`));
            if (erc1155Matches.length < 6) {
                vulnerabilities.push({
                    type: 'erc1155-compliance',
                    severity: 'low',
                    description: `ERC1155 compliance: missing ${6 - erc1155Matches.length} functions`,
                    recommendation: 'Implement all ERC1155 standard functions'
                });
            }
        }

        // Calculate final score
        const finalScore = this.calculateSecurityScore(vulnerabilities);

        return {
            vulnerabilities,
            totalVulnerabilities: vulnerabilities.length,
            critical: vulnerabilities.filter(v => v.severity === 'critical').length,
            high: vulnerabilities.filter(v => v.severity === 'high').length,
            medium: vulnerabilities.filter(v => v.severity === 'medium').length,
            low: vulnerabilities.filter(v => v.severity === 'low').length,
            securityScore: finalScore,
            level: this.getSecurityLevel(finalScore),
            recommendations: this.generateSecurityRecommendations(vulnerabilities)
        };
    }

    calculateSecurityScore(vulnerabilities) {
        let score = 100;
        const weights = {
            critical: 25,
            high: 15,
            medium: 10,
            low: 5
        };

        for (const vuln of vulnerabilities) {
            score -= weights[vuln.severity] || 0;
        }

        return Math.max(0, score);
    }

    getSecurityLevel(score) {
        if (score >= 90) return 'very-secure';
        if (score >= 70) return 'secure';
        if (score >= 50) return 'moderate';
        if (score >= 30) return 'vulnerable';
        return 'very-vulnerable';
    }

    generateSecurityRecommendations(vulnerabilities) {
        const recommendations = [];

        const critical = vulnerabilities.filter(v => v.severity === 'critical');
        const high = vulnerabilities.filter(v => v.severity === 'high');

        if (critical.length > 0) {
            recommendations.push(`🚨 CRITICAL: ${critical.length} critical security issues`);
            for (const vuln of critical.slice(0, 3)) {
                recommendations.push(`  - ${vuln.recommendation}`);
            }
        }

        if (high.length > 0) {
            recommendations.push(`⚠️ HIGH: ${high.length} high security issues`);
            for (const vuln of high.slice(0, 3)) {
                recommendations.push(`  - ${vuln.recommendation}`);
            }
        }

        if (critical.length === 0 && high.length === 0) {
            recommendations.push('✅ No critical or high security issues found');
        }

        return recommendations;
    }

    // ==========================================
    // GAS ANALYSIS
    // ==========================================

    analyzeGas(preprocessed, contracts) {
        const content = preprocessed.original;
        const gasIssues = [];
        const gasOptimizations = [];

        // Check for storage vs memory usage
        const storageMatches = content.match(/\bstorage\b/g) || [];
        const memoryMatches = content.match(/\bmemory\b/g) || [];

        if (storageMatches.length > 50) {
            gasIssues.push({
                type: 'excessive-storage',
                severity: 'medium',
                description: `Excessive storage usage: ${storageMatches.length} storage references`,
                recommendation: 'Use memory for temporary data'
            });
        }

        // Check for loops
        const loopMatches = content.match(/for\s*\(|while\s*\(/g) || [];
        if (loopMatches.length > 5) {
            gasIssues.push({
                type: 'excessive-loops',
                severity: 'low',
                description: `Many loops detected: ${loopMatches.length} loops`,
                recommendation: 'Optimize loops, consider using assembly for gas savings'
            });
        }

        // Check for repeated calculations
        const calculationMatches = content.match(/\b(?:add|sub|mul|div|mod)\s*\(/g) || [];
        if (calculationMatches.length > 20) {
            gasIssues.push({
                type: 'repeated-calculations',
                severity: 'low',
                description: `Many calculations detected: ${calculationMatches.length} calculations`,
                recommendation: 'Store results in memory to avoid recomputation'
            });
        }

        // Check for state variables
        const stateVariableMatches = content.match(/(?:uint|int|address|bool|string|bytes)\s+(?:public|private|internal|external)\s+/g) || [];
        if (stateVariableMatches.length > 20) {
            gasIssues.push({
                type: 'many-state-variables',
                severity: 'low',
                description: `Many state variables: ${stateVariableMatches.length} variables`,
                recommendation: 'Consider using storage slots efficiently'
            });
        }

        // Gas optimization suggestions
        if (this.config.enableGasOptimization) {
            // Suggest using uint256 instead of smaller uints
            if (content.match(/\buint8\b|\buint16\b|\buint32\b/g)) {
                gasOptimizations.push({
                    type: 'use-uint256',
                    description: 'Use uint256 for gas efficiency (smaller uints cost more)',
                    suggestion: 'Replace uint8/16/32 with uint256'
                });
            }

            // Suggest using calldata for read-only parameters
            if (content.match(/function\s+[^(]*\s*\([^)]*\s+memory\s+[a-zA-Z0-9_]+\)/g)) {
                gasOptimizations.push({
                    type: 'use-calldata',
                    description: 'Use calldata instead of memory for read-only parameters',
                    suggestion: 'Replace "memory" with "calldata" for read-only parameters'
                });
            }

            // Suggest using assembly for optimized operations
            if (content.match(/\brequire\s*\(/g)) {
                gasOptimizations.push({
                    type: 'use-assembly',
                    description: 'Consider using assembly for gas-sensitive operations',
                    suggestion: 'Use inline assembly for complex operations'
                });
            }
        }

        // Calculate gas score
        const gasScore = this.calculateGasScore(gasIssues);

        return {
            issues: gasIssues,
            totalIssues: gasIssues.length,
            optimizations: gasOptimizations,
            totalOptimizations: gasOptimizations.length,
            gasScore,
            level: this.getGasLevel(gasScore),
            recommendations: this.generateGasRecommendations(gasIssues, gasOptimizations)
        };
    }

    calculateGasScore(issues) {
        let score = 100;
        const weights = {
            high: 15,
            medium: 10,
            low: 5
        };

        for (const issue of issues) {
            score -= weights[issue.severity] || 5;
        }

        return Math.max(0, score);
    }

    getGasLevel(score) {
        if (score >= 90) return 'excellent';
        if (score >= 70) return 'good';
        if (score >= 50) return 'moderate';
        if (score >= 30) return 'poor';
        return 'very-poor';
    }

    generateGasRecommendations(issues, optimizations) {
        const recommendations = [];

        for (const issue of issues) {
            recommendations.push(`⚡ ${issue.recommendation} (${issue.description})`);
        }

        for (const opt of optimizations) {
            recommendations.push(`💡 ${opt.suggestion} (${opt.description})`);
        }

        if (issues.length === 0 && optimizations.length === 0) {
            recommendations.push('✅ No gas issues detected');
        }

        return recommendations;
    }

    // ==========================================
    // ABI ANALYSIS
    // ==========================================

    analyzeABI(preprocessed, contracts) {
        const content = preprocessed.original;
        const abi = {
            functions: [],
            events: [],
            errors: [],
            constructors: [],
            fallbacks: [],
            receives: []
        };

        // Extract ABI functions
        const functionMatches = content.match(/function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*(?:public|private|internal|external|view|pure|payable)?\s*(?:returns\s*\(([^)]*)\))?/g) || [];
        for (const match of functionMatches) {
            const parts = match.match(/function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/);
            if (parts) {
                const abiFunction = {
                    name: parts[1],
                    inputs: this.parseParameters(parts[2]),
                    outputs: this.parseReturnValues(match),
                    stateMutability: this.detectMutability(match)
                };
                abi.functions.push(abiFunction);
            }
        }

        // Extract ABI events
        const eventMatches = content.match(/event\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/g) || [];
        for (const match of eventMatches) {
            const parts = match.match(/event\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/);
            if (parts) {
                const abiEvent = {
                    name: parts[1],
                    inputs: this.parseParameters(parts[2]),
                    anonymous: match.includes('anonymous')
                };
                abi.events.push(abiEvent);
            }
        }

        // Extract ABI errors
        const errorMatches = content.match(/error\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/g) || [];
        for (const match of errorMatches) {
            const parts = match.match(/error\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/);
            if (parts) {
                const abiError = {
                    name: parts[1],
                    inputs: this.parseParameters(parts[2])
                };
                abi.errors.push(abiError);
            }
        }

        // Check for constructor
        const constructorMatch = content.match(/constructor\s*\(([^)]*)\)/);
        if (constructorMatch) {
            abi.constructors.push({
                inputs: this.parseParameters(constructorMatch[1])
            });
        }

        // Check for fallback
        if (content.includes('fallback(')) {
            abi.fallbacks.push({
                inputs: [],
                outputs: []
            });
        }

        // Check for receive
        if (content.includes('receive(')) {
            abi.receives.push({
                inputs: [],
                outputs: []
            });
        }

        return abi;
    }

    parseParameters(params) {
        if (!params || params.trim() === '') {
            return [];
        }

        const parameters = [];
        const parts = params.split(',');

        for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed) {
                const match = trimmed.match(/([A-Za-z0-9_]+(?:\s*\[\s*\]\s*)?)\s+([A-Za-z_][A-Za-z0-9_]*)/);
                if (match) {
                    parameters.push({
                        type: match[1],
                        name: match[2]
                    });
                } else {
                    parameters.push({
                        type: trimmed,
                        name: 'unnamed'
                    });
                }
            }
        }

        return parameters;
    }

    parseReturnValues(func) {
        const returnMatch = func.match(/returns\s*\(([^)]*)\)/);
        if (returnMatch) {
            const returns = returnMatch[1].split(',').map(r => r.trim());
            return returns.map(r => ({ type: r, name: 'return' }));
        }
        return [];
    }

    detectMutability(func) {
        if (func.includes('pure')) return 'pure';
        if (func.includes('view')) return 'view';
        if (func.includes('payable')) return 'payable';
        return 'nonpayable';
    }

    // ==========================================
    // EVENT ANALYSIS
    // ==========================================

    analyzeEvents(preprocessed, contracts) {
        const content = preprocessed.original;
        const events = [];

        // Extract all events
        const eventMatches = content.match(/event\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/g) || [];
        for (const match of eventMatches) {
            const parts = match.match(/event\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/);
            if (parts) {
                const event = {
                    name: parts[1],
                    parameters: this.parseParameters(parts[2]),
                    anonymous: match.includes('anonymous'),
                    indexed: this.countIndexedParameters(parts[2]),
                    emissionCount: this.countEventEmissions(content, parts[1])
                };
                events.push(event);
            }
        }

        // Event emission analysis
        const eventEmissions = this.analyzeEventEmissions(content);

        return {
            events,
            totalEvents: events.length,
            eventEmissions,
            totalEmissions: eventEmissions.length,
            recommendations: this.generateEventRecommendations(events, eventEmissions)
        };
    }

    countIndexedParameters(params) {
        if (!params) return 0;
        const indexed = params.match(/\bindexed\b/g) || [];
        return indexed.length;
    }

    countEventEmissions(content, eventName) {
        const pattern = new RegExp(`emit\\s+${eventName}\\s*\\(`, 'g');
        const matches = content.match(pattern) || [];
        return matches.length;
    }

    analyzeEventEmissions(content) {
        const emissions = [];
        const matches = content.match(/emit\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g) || [];

        for (const match of matches) {
            const name = match.replace(/emit\s+/, '').replace(/\s*\(/, '');
            emissions.push({
                eventName: name,
                location: content.indexOf(match)
            });
        }

        return emissions;
    }

    generateEventRecommendations(events, emissions) {
        const recommendations = [];

        if (events.length === 0) {
            recommendations.push('📢 No events defined - consider adding events for state changes');
        }

        const eventsWithNoEmissions = events.filter(e => e.emissionCount === 0);
        if (eventsWithNoEmissions.length > 0) {
            recommendations.push(`📢 ${eventsWithNoEmissions.length} events are never emitted`);
            for (const event of eventsWithNoEmissions.slice(0, 3)) {
                recommendations.push(`  - ${event.name}: emit this event when state changes`);
            }
        }

        return recommendations;
    }

    // ==========================================
    // FUNCTION ANALYSIS
    // ==========================================

    analyzeFunctions(preprocessed, contracts) {
        const content = preprocessed.original;
        const functions = [];

        // Extract all functions
        const functionMatches = content.match(/function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/g) || [];
        for (const match of functionMatches) {
            const parts = match.match(/function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/);
            if (parts) {
                const func = {
                    name: parts[1],
                    parameters: this.parseParameters(parts[2]),
                    visibility: this.detectVisibility(match),
                    mutability: this.detectMutability(match),
                    returns: this.parseReturnValues(match),
                    modifiers: this.detectModifiers(match),
                    body: this.extractFunctionBody(content, match),
                    lineCount: 0,
                    complexity: 0
                };

                // Calculate function complexity
                if (func.body) {
                    func.lineCount = func.body.split('\n').length;
                    func.complexity = this.calculateFunctionComplexity(func.body);
                }

                functions.push(func);
            }
        }

        // Analyze function patterns
        const functionAnalysis = {
            total: functions.length,
            public: functions.filter(f => f.visibility === 'public').length,
            private: functions.filter(f => f.visibility === 'private').length,
            internal: functions.filter(f => f.visibility === 'internal').length,
            external: functions.filter(f => f.visibility === 'external').length,
            view: functions.filter(f => f.mutability === 'view').length,
            pure: functions.filter(f => f.mutability === 'pure').length,
            payable: functions.filter(f => f.mutability === 'payable').length,
            nonpayable: functions.filter(f => f.mutability === 'nonpayable').length,
            withModifiers: functions.filter(f => f.modifiers.length > 0).length,
            withReturns: functions.filter(f => f.returns.length > 0).length
        };

        return {
            functions,
            analysis: functionAnalysis,
            recommendations: this.generateFunctionRecommendations(functionAnalysis)
        };
    }

    detectVisibility(func) {
        if (func.includes('public')) return 'public';
        if (func.includes('private')) return 'private';
        if (func.includes('internal')) return 'internal';
        if (func.includes('external')) return 'external';
        return 'unknown';
    }

    detectModifiers(func) {
        const modifiers = [];
        const match = func.match(/(?:public|private|internal|external|view|pure|payable)\s+([A-Za-z_][A-Za-z0-9_]*)/);
        if (match) {
            const modifier = match[1];
            if (!['public', 'private', 'internal', 'external', 'view', 'pure', 'payable'].includes(modifier)) {
                modifiers.push(modifier);
            }
        }
        return modifiers;
    }

    extractFunctionBody(content, funcSignature) {
        const start = content.indexOf(funcSignature);
        if (start === -1) return '';

        // Find the opening brace
        const braceStart = content.indexOf('{', start);
        if (braceStart === -1) return '';

        // Find the matching closing brace
        let depth = 1;
        let i = braceStart + 1;
        while (i < content.length && depth > 0) {
            if (content[i] === '{') depth++;
            if (content[i] === '}') depth--;
            i++;
        }

        if (depth === 0) {
            return content.substring(braceStart + 1, i - 1);
        }

        return '';
    }

    calculateFunctionComplexity(body) {
        let complexity = 1;

        // Count branching
        const branches = (body.match(/\bif\b/g) || []).length +
                        (body.match(/\belse\b/g) || []).length +
                        (body.match(/\bswitch\b/g) || []).length +
                        (body.match(/\bcase\b/g) || []).length;

        complexity += branches;

        // Count loops
        const loops = (body.match(/\bfor\b/g) || []).length +
                     (body.match(/\bwhile\b/g) || []).length;

        complexity += loops;

        // Count logical operators
        const logical = (body.match(/&&/g) || []).length +
                       (body.match(/\|\|/g) || []).length;

        complexity += logical * 0.5;

        // Count nesting
        let maxDepth = 0;
        let currentDepth = 0;
        for (const char of body) {
            if (char === '{') currentDepth++;
            if (char === '}') currentDepth--;
            maxDepth = Math.max(maxDepth, currentDepth);
        }
        complexity += maxDepth * 0.5;

        return Math.round(complexity);
    }

    generateFunctionRecommendations(analysis) {
        const recommendations = [];

        if (analysis.public > analysis.private + analysis.internal) {
            recommendations.push('🔓 Many public functions - consider using private/internal where possible');
        }

        if (analysis.payable === 0 && analysis.total > 0) {
            recommendations.push('💰 No payable functions - consider if any functions need to receive ETH');
        }

        if (analysis.withModifiers < analysis.total * 0.5) {
            recommendations.push('🛡️ Low modifier usage - consider using modifiers for access control and validations');
        }

        return recommendations;
    }

    // ==========================================
    // MODIFIER ANALYSIS
    // ==========================================

    analyzeModifiers(preprocessed, contracts) {
        const content = preprocessed.original;
        const modifiers = [];

        // Extract all modifiers
        const modifierMatches = content.match(/modifier\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/g) || [];
        for (const match of modifierMatches) {
            const parts = match.match(/modifier\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/);
            if (parts) {
                const modifier = {
                    name: parts[1],
                    parameters: this.parseParameters(parts[2]),
                    body: this.extractModifierBody(content, match),
                    usages: this.countModifierUsages(content, parts[1]),
                    lineCount: 0,
                    complexity: 0
                };

                if (modifier.body) {
                    modifier.lineCount = modifier.body.split('\n').length;
                    modifier.complexity = this.calculateFunctionComplexity(modifier.body);
                }

                modifiers.push(modifier);
            }
        }

        return {
            modifiers,
            total: modifiers.length,
            usages: modifiers.reduce((sum, m) => sum + m.usages, 0),
            averageComplexity: modifiers.reduce((sum, m) => sum + m.complexity, 0) / (modifiers.length || 1),
            recommendations: this.generateModifierRecommendations(modifiers)
        };
    }

    extractModifierBody(content, modifierSignature) {
        const start = content.indexOf(modifierSignature);
        if (start === -1) return '';

        const braceStart = content.indexOf('{', start);
        if (braceStart === -1) return '';

        let depth = 1;
        let i = braceStart + 1;
        while (i < content.length && depth > 0) {
            if (content[i] === '{') depth++;
            if (content[i] === '}') depth--;
            i++;
        }

        if (depth === 0) {
            return content.substring(braceStart + 1, i - 1);
        }

        return '';
    }

    countModifierUsages(content, modifierName) {
        const pattern = new RegExp(`\\b${modifierName}\\b`, 'g');
        const matches = content.match(pattern) || [];
        // Subtract 1 for the definition
        return Math.max(0, matches.length - 1);
    }

    generateModifierRecommendations(modifiers) {
        const recommendations = [];

        if (modifiers.length === 0) {
            recommendations.push('🛡️ No modifiers defined - consider using modifiers for reusable logic');
        }

        const unusedModifiers = modifiers.filter(m => m.usages === 0);
        if (unusedModifiers.length > 0) {
            recommendations.push(`🛡️ ${unusedModifiers.length} modifiers are never used`);
            for (const mod of unusedModifiers.slice(0, 3)) {
                recommendations.push(`  - ${mod.name}: remove or use this modifier`);
            }
        }

        return recommendations;
    }

    // ==========================================
    // INHERITANCE ANALYSIS
    // ==========================================

    analyzeInheritance(preprocessed, contracts) {
        const content = preprocessed.original;
        const inheritance = [];

        // Extract inheritance relationships
        const inheritsMatches = content.match(/contract\s+([A-Za-z_][A-Za-z0-9_]*)\s+is\s+([A-Za-z_][A-Za-z0-9_]*)/g) || [];
        for (const match of inheritsMatches) {
            const parts = match.match(/contract\s+([A-Za-z_][A-Za-z0-9_]*)\s+is\s+([A-Za-z_][A-Za-z0-9_]*)/);
            if (parts) {
                inheritance.push({
                    child: parts[1],
                    parent: parts[2],
                    type: 'inherits'
                });
            }
        }

        // Extract multiple inheritance
        const multipleInheritsMatches = content.match(/contract\s+([A-Za-z_][A-Za-z0-9_]*)\s+is\s+([A-Za-z_][A-Za-z0-9_,\s]*)/g) || [];
        for (const match of multipleInheritsMatches) {
            const parts = match.match(/contract\s+([A-Za-z_][A-Za-z0-9_]*)\s+is\s+([A-Za-z_][A-Za-z0-9_,\s]*)/);
            if (parts) {
                const parents = parts[2].split(',').map(p => p.trim());
                for (const parent of parents) {
                    inheritance.push({
                        child: parts[1],
                        parent: parent,
                        type: 'multiple-inherits'
                    });
                }
            }
        }

        // Analyze inheritance tree
        const tree = this.buildInheritanceTree(inheritance);

        return {
            inheritance,
            totalRelationships: inheritance.length,
            tree,
            maxDepth: this.calculateMaxDepth(tree),
            complexity: this.calculateInheritanceComplexity(inheritance),
            recommendations: this.generateInheritanceRecommendations(inheritance, tree)
        };
    }

    buildInheritanceTree(inheritance) {
        const tree = {};

        for (const rel of inheritance) {
            if (!tree[rel.parent]) {
                tree[rel.parent] = [];
            }
            tree[rel.parent].push(rel.child);
        }

        return tree;
    }

    calculateMaxDepth(tree) {
        let maxDepth = 0;

        const traverse = (node, depth) => {
            maxDepth = Math.max(maxDepth, depth);
            if (tree[node]) {
                for (const child of tree[node]) {
                    traverse(child, depth + 1);
                }
            }
        };

        for (const root of Object.keys(tree)) {
            traverse(root, 1);
        }

        return maxDepth;
    }

    calculateInheritanceComplexity(inheritance) {
        // Simple complexity metric: number of relationships + depth
        const relationships = inheritance.length;
        const maxDepth = this.calculateMaxDepth(this.buildInheritanceTree(inheritance));
        return relationships + maxDepth;
    }

    generateInheritanceRecommendations(inheritance, tree) {
        const recommendations = [];

        if (inheritance.length === 0) {
            recommendations.push('📚 No inheritance found - consider using inheritance for code reuse');
        }

        const multipleInherits = inheritance.filter(i => i.type === 'multiple-inherits');
        if (multipleInherits.length > 0) {
            recommendations.push(`⚠️ ${multipleInherits.length} multiple inheritance relationships detected`);
            recommendations.push('  - Be careful with diamond inheritance issues');
        }

        return recommendations;
    }

    // ==========================================
    // STORAGE ANALYSIS
    // ==========================================

    analyzeStorage(preprocessed, contracts) {
        const content = preprocessed.original;
        const storage = {
            variables: [],
            slots: 0,
            usage: 0,
            optimizations: []
        };

        // Extract storage variables
        const variableMatches = content.match(/(?:uint|int|address|bool|string|bytes)\s+(?:public|private|internal|external)?\s+([A-Za-z_][A-Za-z0-9_]*)\s*[=;]/g) || [];
        for (const match of variableMatches) {
            const parts = match.match(/([A-Za-z_][A-Za-z0-9_]*)\s*[=;]/);
            if (parts) {
                const varInfo = {
                    name: parts[1],
                    type: match.match(/(uint|int|address|bool|string|bytes)/)?.[0] || 'unknown',
                    slot: storage.slots,
                    size: this.calculateVariableSize(match)
                };
                storage.variables.push(varInfo);
                storage.slots += varInfo.size;
            }
        }

        // Calculate storage usage
        storage.usage = storage.slots / 32; // Slots are 32 bytes each

        // Storage optimization suggestions
        if (this.config.enableStorageOptimization) {
            // Suggest packing smaller variables
            const smallVars = storage.variables.filter(v => v.size < 32);
            if (smallVars.length > 1) {
                storage.optimizations.push({
                    type: 'pack-variables',
                    description: `Pack ${smallVars.length} small variables into single slots`,
                    suggestion: 'Use structs to pack related variables'
                });
            }

            // Suggest using bytes32 for strings/bytes
            const stringVars = storage.variables.filter(v => v.type === 'string' || v.type === 'bytes');
            if (stringVars.length > 0) {
                storage.optimizations.push({
                    type: 'use-bytes32',
                    description: `Consider using bytes32 for ${stringVars.length} strings/bytes if length is fixed`,
                    suggestion: 'Use bytes32 for fixed-length strings'
                });
            }
        }

        return storage;
    }

    calculateVariableSize(variable) {
        const typeMap = {
            'uint8': 1,
            'uint16': 2,
            'uint32': 4,
            'uint64': 8,
            'uint128': 16,
            'uint256': 32,
            'int8': 1,
            'int16': 2,
            'int32': 4,
            'int64': 8,
            'int128': 16,
            'int256': 32,
            'address': 20,
            'bool': 1,
            'bytes1': 1,
            'bytes2': 2,
            'bytes4': 4,
            'bytes8': 8,
            'bytes16': 16,
            'bytes32': 32
        };

        const typeMatch = variable.match(/(uint|int|address|bool|bytes\d*|string)/);
        if (typeMatch) {
            return typeMap[typeMatch[0]] || 32;
        }

        return 32;
    }

    // ==========================================
    // NATSPEC ANALYSIS
    // ==========================================

    analyzeNatSpec(preprocessed, contracts) {
        const content = preprocessed.original;
        const natspec = {
            tags: {},
            coverage: 0,
            missing: [],
            recommendations: []
        };

        // Extract all NatSpec tags
        for (const [tag, description] of Object.entries(this.natSpecTags)) {
            const pattern = new RegExp(`${tag}\\s+([^\\n]*)`, 'g');
            const matches = content.match(pattern) || [];
            natspec.tags[tag] = matches.length;
        }

        // Calculate coverage
        const totalTags = Object.keys(this.natSpecTags).length;
        const usedTags = Object.values(natspec.tags).filter(v => v > 0).length;
        natspec.coverage = (usedTags / totalTags) * 100;

        // Find missing tags
        for (const [tag, description] of Object.entries(this.natSpecTags)) {
            if (natspec.tags[tag] === 0) {
                natspec.missing.push({
                    tag,
                    description,
                    severity: this.getTagSeverity(tag)
                });
            }
        }

        // Generate recommendations
        natspec.recommendations = this.generateNatSpecRecommendations(natspec);

        return natspec;
    }

    getTagSeverity(tag) {
        const criticalTags = ['@title', '@author', '@notice', '@dev'];
        const importantTags = ['@param', '@return', '@inheritdoc'];

        if (criticalTags.includes(tag)) return 'high';
        if (importantTags.includes(tag)) return 'medium';
        return 'low';
    }

    generateNatSpecRecommendations(natspec) {
        const recommendations = [];

        if (natspec.coverage < 50) {
            recommendations.push(`📝 Low NatSpec coverage (${natspec.coverage.toFixed(0)}%) - add more documentation`);
        }

        const missingCritical = natspec.missing.filter(m => m.severity === 'high');
        if (missingCritical.length > 0) {
            recommendations.push(`📝 Missing critical NatSpec tags: ${missingCritical.map(m => m.tag).join(', ')}`);
        }

        return recommendations;
    }

    // ==========================================
    // REPORT GENERATION
    // ==========================================

    generateReport(data) {
        const {
            metadata, version, contracts, security, gas, abi, events, functions, modifiers, inheritance, storage, natspec
        } = data;

        return {
            summary: {
                totalContracts: contracts.length,
                totalFunctions: functions.functions.length,
                totalEvents: events.events.length,
                totalModifiers: modifiers.modifiers.length,
                totalInheritance: inheritance.inheritance.length,
                totalStorageVariables: storage.variables.length,
                securityScore: security.securityScore,
                gasScore: gas.gasScore,
                natspecCoverage: natspec.coverage
            },
            risks: {
                critical: security.critical,
                high: security.high,
                medium: security.medium,
                low: security.low
            },
            version: {
                current: version.version,
                isLatest: version.isLatest,
                features: version.features,
                recommendations: version.recommendations
            },
            security: {
                vulnerabilities: security.vulnerabilities,
                recommendations: security.recommendations
            },
            gas: {
                issues: gas.issues,
                optimizations: gas.optimizations,
                recommendations: gas.recommendations
            },
            abi: {
                functions: abi.functions.length,
                events: abi.events.length,
                errors: abi.errors.length
            },
            events: {
                total: events.events.length,
                emissions: events.eventEmissions.length,
                recommendations: events.recommendations
            },
            functions: {
                total: functions.analysis.total,
                public: functions.analysis.public,
                private: functions.analysis.private,
                internal: functions.analysis.internal,
                external: functions.analysis.external,
                view: functions.analysis.view,
                pure: functions.analysis.pure,
                payable: functions.analysis.payable,
                recommendations: functions.recommendations
            },
            modifiers: {
                total: modifiers.modifiers.length,
                usages: modifiers.usages,
                recommendations: modifiers.recommendations
            },
            inheritance: {
                total: inheritance.inheritance.length,
                maxDepth: inheritance.maxDepth,
                complexity: inheritance.complexity,
                recommendations: inheritance.recommendations
            },
            storage: {
                variables: storage.variables.length,
                slots: storage.slots,
                usage: storage.usage,
                optimizations: storage.optimizations
            },
            natspec: {
                coverage: natspec.coverage,
                missing: natspec.missing,
                recommendations: natspec.recommendations
            },
            recommendations: this.generateOverallRecommendations(data)
        };
    }

    generateOverallRecommendations(data) {
        const recommendations = [];

        // Security recommendations
        if (data.security.critical > 0) {
            recommendations.push('🚨 Fix critical security vulnerabilities immediately');
        }

        // Gas recommendations
        if (data.gas.gasScore < 70) {
            recommendations.push('⚡ Optimize gas usage to reduce transaction costs');
        }

        // Version recommendations
        if (!data.version.isLatest) {
            recommendations.push('📈 Upgrade to latest Solidity version for better features and security');
        }

        // NatSpec recommendations
        if (data.natspec.coverage < 70) {
            recommendations.push('📝 Improve documentation coverage with more NatSpec tags');
        }

        // Storage recommendations
        if (data.storage.variables.length > 20) {
            recommendations.push('💾 Optimize storage layout to reduce gas costs');
        }

        return recommendations;
    }

    // ==========================================
    // SECURITY PATTERNS
    // ==========================================

    loadSecurityPatterns() {
        return {
            reentrancy: {
                pattern: /call\.value\s*\(/,
                severity: 'critical',
                description: 'External calls after state changes',
                recommendation: 'Use checks-effects-interactions pattern'
            },
            overflow: {
                pattern: /(?:\+|-)+\s*=\s*/,
                severity: 'high',
                description: 'Arithmetic operations without overflow checks',
                recommendation: 'Use SafeMath or Solidity 0.8+ unchecked blocks'
            },
            uncheckedTransfer: {
                pattern: /transfer\s*\(/,
                severity: 'medium',
                description: 'Unchecked transfer operations',
                recommendation: 'Always check return values'
            },
            delegatecall: {
                pattern: /delegatecall\s*\(/,
                severity: 'high',
                description: 'Delegatecall to untrusted contracts',
                recommendation: 'Avoid delegatecall to untrusted addresses'
            },
            selfdestruct: {
                pattern: /selfdestruct\s*\(/,
                severity: 'critical',
                description: 'Selfdestruct can destroy contracts',
                recommendation: 'Use with extreme caution'
            },
            timestampDependency: {
                pattern: /block\.timestamp/,
                severity: 'medium',
                description: 'Timestamp dependency for critical logic',
                recommendation: 'Avoid using block.timestamp for security'
            },
            blockNumberDependency: {
                pattern: /block\.number/,
                severity: 'low',
                description: 'Block number dependency',
                recommendation: 'Avoid using block.number for critical logic'
            },
            frontRunning: {
                pattern: /tx\.origin|msg\.sender/,
                severity: 'medium',
                description: 'Potential front-running vulnerability',
                recommendation: 'Use commit-reveal pattern'
            },
            accessControl: {
                pattern: /onlyOwner|onlyAdmin|onlyRole/,
                severity: 'medium',
                description: 'Missing access control',
                recommendation: 'Implement Ownable or AccessControl'
            },
            pausable: {
                pattern: /Pausable|whenNotPaused|whenPaused/,
                severity: 'low',
                description: 'Missing pausable mechanism',
                recommendation: 'Implement Pausable for emergency stops'
            },
            erc20Compliance: {
                pattern: /(?:transfer|transferFrom|approve|allowance|totalSupply|balanceOf)/,
                severity: 'low',
                description: 'Incomplete ERC20 implementation',
                recommendation: 'Implement all ERC20 standard functions'
            },
            erc721Compliance: {
                pattern: /(?:ownerOf|safeTransferFrom|transferFrom|approve|setApprovalForAll|getApproved|isApprovedForAll)/,
                severity: 'low',
                description: 'Incomplete ERC721 implementation',
                recommendation: 'Implement all ERC721 standard functions'
            },
            erc1155Compliance: {
                pattern: /(?:safeTransferFrom|safeBatchTransferFrom|balanceOf|balanceOfBatch|setApprovalForAll|isApprovedForAll)/,
                severity: 'low',
                description: 'Incomplete ERC1155 implementation',
                recommendation: 'Implement all ERC1155 standard functions'
            }
        };
    }

    // ==========================================
    // GAS PATTERNS
    // ==========================================

    loadGasPatterns() {
        return {
            useUint256: {
                pattern: /\buint8\b|\buint16\b|\buint32\b/,
                severity: 'low',
                description: 'Using smaller uints costs more gas',
                recommendation: 'Use uint256 instead'
            },
            useCalldata: {
                pattern: /function\s+[^(]*\s*\([^)]*\s+memory\s+[a-zA-Z0-9_]+\)/,
                severity: 'medium',
                description: 'Using memory for read-only parameters',
                recommendation: 'Use calldata instead'
            },
            useAssembly: {
                pattern: /\brequire\s*\(/,
                severity: 'low',
                description: 'Require statements can be optimized with assembly',
                recommendation: 'Use inline assembly for gas-critical operations'
            },
            storageVsMemory: {
                pattern: /\bstorage\b/,
                severity: 'medium',
                description: 'Excessive storage usage',
                recommendation: 'Use memory for temporary data'
            },
            loops: {
                pattern: /for\s*\(|while\s*\(/,
                severity: 'low',
                description: 'Loops can be gas-intensive',
                recommendation: 'Optimize loops or use assembly'
            },
            repeatedCalculations: {
                pattern: /(?:add|sub|mul|div|mod)\s*\(/,
                severity: 'low',
                description: 'Repeated calculations waste gas',
                recommendation: 'Store results in memory'
            },
            stateVariables: {
                pattern: /(?:uint|int|address|bool|string|bytes)\s+(?:public|private|internal|external)\s+/,
                severity: 'low',
                description: 'Many state variables increase gas costs',
                recommendation: 'Minimize state variables'
            },
            packVariables: {
                pattern: /(?:uint8|uint16|uint32|address|bool)\s+(?:public|private|internal|external)\s+/,
                severity: 'medium',
                description: 'Small variables can be packed',
                recommendation: 'Use structs to pack related variables'
            }
        };
    }

    // ==========================================
    // EVENT SYSTEM
    // ==========================================

    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
        return this;
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const callbacks = this.eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
        return this;
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            const callbacks = this.eventListeners.get(event);
            for (const callback of callbacks) {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            }
        }
        return this;
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    generateId() {
        this.idCounter++;
        return 'sol_' + Date.now() + '_' + this.idCounter + '_' + 
               Math.random().toString(36).substr(2, 6);
    }

    log(message) {
        if (this.config.enableLogging) {
            const timestamp = new Date().toISOString();
            console.log(`[SolidityAnalyzer] ${timestamp} - ${message}`);
        }
    }

    // ==========================================
    // SERIALIZATION
    // ==========================================

    toJSON() {
        return {
            version: '2.0.0',
            config: this.config,
            analysisHistory: this.analysisHistory.slice(0, 100)
        };
    }

    static fromJSON(data) {
        const analyzer = new SolidityAnalyzer(data.config);
        analyzer.analysisHistory = data.analysisHistory || [];
        return analyzer;
    }

    // ==========================================
    // SHUTDOWN
    // ==========================================

    shutdown() {
        this.isShuttingDown = true;
        this.contracts.clear();
        this.analysisHistory = [];
        this.activeAnalyses.clear();
        this.analysisQueue = [];
        this.log('🛑 SolidityAnalyzer shutdown complete');
    }
}
