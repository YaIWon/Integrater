// ============================================
// INTEGRATOR PRO - Most Advanced Browser Version
// Complete Integration Engine with 20+ Integration Types
// Zero Node.js Dependencies - 100% Browser Compatible
// ============================================

export default class Integrator {
    constructor(options = {}) {
        // ==========================================
        // CORE STATE
        // ==========================================
        this.integrations = [];
        this.activeIntegrations = new Map();
        this.integrationHistory = [];
        this.cache = new Map();
        this.processing = false;
        this.queue = [];
        
        // ==========================================
        // CONFIGURATION
        // ==========================================
        this.config = {
            enableCaching: options.enableCaching !== false,
            enableLogging: options.enableLogging !== false,
            maxConcurrent: options.maxConcurrent || 5,
            timeout: options.timeout || 30000
        };
        
        // ==========================================
        // 20+ INTEGRATION TYPES
        // ==========================================
        this.integrationTypes = {
            'app': this.integrateApp.bind(this),
            'web': this.integrateWeb.bind(this),
            'spa': this.integrateSPA.bind(this),
            'pwa': this.integratePWA.bind(this),
            'ssr': this.integrateSSR.bind(this),
            'static': this.integrateStatic.bind(this),
            'service': this.integrateService.bind(this),
            'api': this.integrateAPI.bind(this),
            'microservice': this.integrateMicroservice.bind(this),
            'graphql': this.integrateGraphQL.bind(this),
            'solidity': this.integrateSolidity.bind(this),
            'blockchain': this.integrateBlockchain.bind(this),
            'dapp': this.integrateDApp.bind(this),
            'nft': this.integrateNFT.bind(this),
            'defi': this.integrateDeFi.bind(this),
            'database': this.integrateDatabase.bind(this),
            'ml': this.integrateML.bind(this),
            'ai': this.integrateAI.bind(this),
            'analytics': this.integrateAnalytics.bind(this),
            'desktop': this.integrateDesktop.bind(this),
            'mobile': this.integrateMobile.bind(this),
            'electron': this.integrateElectron.bind(this),
            'react-native': this.integrateReactNative.bind(this),
            'tool': this.integrateTool.bind(this),
            'plugin': this.integratePlugin.bind(this),
            'library': this.integrateLibrary.bind(this),
            'cli': this.integrateCLI.bind(this),
            'game': this.integrateGame.bind(this),
            'iot': this.integrateIoT.bind(this),
            'default': this.integrateDefault.bind(this)
        };
        
        // ==========================================
        // DETECTION PATTERNS
        // ==========================================
        this.patterns = {
            routing: /router|Route|Routes|routing/i,
            state: /redux|store|mobx|zustand|state/i,
            api: /api|endpoint|axios|fetch/i,
            lazy: /lazy|React\.lazy|import\(/i,
            auth: /auth|jwt|token|login|logout/i,
            database: /db|database|sql|mongodb|postgres/i,
            caching: /cache|redis/i,
            validation: /validate|validator|schema|joi/i,
            graphql: /graphql|gql|schema|resolver|subscription/i,
            websocket: /socket|ws|wss/i,
            web3: /web3|ethers|ethereum|blockchain/i,
            nft: /nft|erc721|erc1155|tokenURI/i,
            defi: /defi|swap|pool|liquidity|farm|stake/i,
            ml: /train|model|inference|tensorflow|pytorch/i,
            ai: /ai|llm|openai|agent|rag|vector/i,
            iot: /sensor|actuator|mqtt|gpio/i,
            game: /game|physics|canvas|phaser|pixi/i,
            cli: /cli|command|arg|flag|help/i,
            pwa: /manifest|service-worker|offline/i,
            ssr: /server|ssr|hydrate/i,
            electron: /electron|main\.js|renderer/i
        };
        
        this.log('🚀 Integrator Pro initialized (Most Advanced Version)');
        this.log(`📦 Integration Types: ${Object.keys(this.integrationTypes).length}`);
        
        // Start cache cleanup
        if (this.config.enableCaching) {
            setInterval(() => this.cleanCache(), 600000); // Clean every 10 minutes
        }
    }

    // ==========================================
    // MAIN INTEGRATION METHOD
    // ==========================================
    
    async integrate(files, options = {}) {
        const startTime = Date.now();
        const integrationId = this.generateId();
        const type = this.detectIntegrationType(files);
        
        // Check cache
        if (this.config.enableCaching) {
            const cacheKey = this.generateCacheKey(files);
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < 3600000) {
                    this.log(`📦 Cache hit for ${integrationId}`);
                    return cached.result;
                }
            }
        }
        
        this.log(`🔗 Starting integration ${integrationId} (${type})`);
        this.log(`📁 Processing ${files.length} files`);
        
        try {
            // Step 1: Validate files
            const validation = this.validateFiles(files);
            if (!validation.success) {
                throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }
            
            // Step 2: Analyze dependencies
            const dependencies = this.analyzeDependencies(files);
            
            // Step 3: Analyze complexity
            const complexity = this.calculateComplexity(files);
            
            // Step 4: Execute integration
            const handler = this.integrationTypes[type] || this.integrationTypes.default;
            const result = await handler(files, options);
            
            // Step 5: Build full integration
            const integration = {
                id: integrationId,
                type: type,
                files: files.length,
                fileList: files.map(f => f.name),
                timestamp: new Date().toISOString(),
                duration: Date.now() - startTime,
                status: 'completed',
                name: options.name || this.generateName(type),
                
                // Analysis results
                validation: validation,
                dependencies: dependencies,
                complexity: complexity,
                
                // Result
                result: result,
                
                // Metadata
                metadata: {
                    totalSize: files.reduce((sum, f) => sum + (f.size || 0), 0),
                    fileTypes: this.getFileTypeDistribution(files),
                    hasBinaries: files.some(f => f.isBinary),
                    hasSolidity: files.some(f => f.extension === 'sol')
                }
            };
            
            // Store integration
            this.integrations.push(integration);
            this.activeIntegrations.set(integrationId, integration);
            this.integrationHistory.push({
                id: integrationId,
                type: type,
                timestamp: new Date().toISOString(),
                duration: integration.duration
            });
            
            // Cache result
            if (this.config.enableCaching) {
                const cacheKey = this.generateCacheKey(files);
                this.cache.set(cacheKey, {
                    result: integration,
                    timestamp: Date.now()
                });
            }
            
            this.log(`✅ Integration ${integrationId} completed in ${integration.duration}ms`);
            
            return {
                success: true,
                integration: integration,
                message: `✅ Integration created successfully in ${integration.duration}ms`,
                warnings: this.collectWarnings(integration)
            };
            
        } catch (error) {
            this.log(`❌ Integration ${integrationId} failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                message: `❌ Integration failed: ${error.message}`,
                integrationId: integrationId
            };
        }
    }

    // ==========================================
    // 30+ INTEGRATION HANDLERS
    // ==========================================

    async integrateApp(files, options = {}) {
        const htmlFiles = files.filter(f => this.isType(f, 'html'));
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const cssFiles = files.filter(f => this.isType(f, 'css'));
        const jsonFiles = files.filter(f => this.isType(f, 'json'));
        
        return {
            type: 'app',
            name: options.name || 'Web Application',
            entry: htmlFiles[0]?.name || 'index.html',
            files: {
                html: htmlFiles.length,
                js: jsFiles.length,
                css: cssFiles.length,
                json: jsonFiles.length,
                total: files.length
            },
            structure: {
                pages: htmlFiles.map(f => f.name),
                scripts: jsFiles.map(f => f.name),
                styles: cssFiles.map(f => f.name),
                configs: jsonFiles.map(f => f.name)
            },
            dependencies: this.findDependencies(files),
            bundleSize: files.reduce((sum, f) => sum + (f.size || 0), 0),
            components: this.extractComponents(files),
            hasRouting: this.detectPattern(files, 'routing'),
            hasState: this.detectPattern(files, 'state'),
            hasAPI: this.detectPattern(files, 'api')
        };
    }

    async integrateWeb(files, options = {}) {
        const result = await this.integrateApp(files, options);
        result.type = 'web';
        result.pages = files.filter(f => this.isType(f, 'html')).map(f => f.name);
        result.isStatic = true;
        return result;
    }

    async integrateSPA(files, options = {}) {
        const result = await this.integrateApp(files, options);
        result.type = 'spa';
        result.routing = this.detectPattern(files, 'routing');
        result.stateManagement = this.detectPattern(files, 'state');
        result.hasLazyLoading = this.detectPattern(files, 'lazy');
        result.hasAPIClients = this.detectPattern(files, 'api');
        return result;
    }

    async integratePWA(files, options = {}) {
        const result = await this.integrateSPA(files, options);
        result.type = 'pwa';
        result.hasManifest = files.some(f => f.name === 'manifest.json');
        result.hasServiceWorker = files.some(f => f.name.includes('service-worker') || f.name.includes('sw.'));
        result.offlineSupport = result.hasServiceWorker;
        result.hasPushNotifications = this.detectPattern(files, 'notification');
        return result;
    }

    async integrateSSR(files, options = {}) {
        const result = await this.integrateApp(files, options);
        result.type = 'ssr';
        result.hasServerSideRendering = true;
        result.serverEntry = files.find(f => f.name.includes('server') && f.name.includes('entry'))?.name;
        result.clientEntry = files.find(f => f.name.includes('client') || f.name === 'index.js')?.name;
        result.hydrationEnabled = true;
        return result;
    }

    async integrateStatic(files, options = {}) {
        const htmlFiles = files.filter(f => this.isType(f, 'html'));
        const cssFiles = files.filter(f => this.isType(f, 'css'));
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const imageFiles = files.filter(f => this.isType(f, 'image'));
        
        return {
            type: 'static',
            name: options.name || 'Static Website',
            entry: htmlFiles[0]?.name || 'index.html',
            files: {
                html: htmlFiles.length,
                css: cssFiles.length,
                js: jsFiles.length,
                images: imageFiles.length,
                total: files.length
            },
            pages: htmlFiles.map(f => f.name),
            assets: {
                styles: cssFiles.map(f => f.name),
                scripts: jsFiles.map(f => f.name),
                images: imageFiles.map(f => f.name)
            },
            isStatic: true,
            canDeploy: true
        };
    }

    async integrateService(files, options = {}) {
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const jsonFiles = files.filter(f => this.isType(f, 'json'));
        
        return {
            type: 'service',
            name: options.name || 'API Service',
            entry: jsFiles[0]?.name || 'index.js',
            files: {
                js: jsFiles.length,
                json: jsonFiles.length,
                total: files.length
            },
            endpoints: this.findEndpoints(files),
            dependencies: this.findDependencies(files),
            hasAuthentication: this.detectPattern(files, 'auth'),
            hasDatabase: this.detectPattern(files, 'database'),
            hasCaching: this.detectPattern(files, 'caching'),
            hasValidation: this.detectPattern(files, 'validation')
        };
    }

    async integrateAPI(files, options = {}) {
        const result = await this.integrateService(files, options);
        result.type = 'api';
        result.rateLimiting = this.detectPattern(files, 'rate-limit');
        result.caching = this.detectPattern(files, 'caching');
        result.validation = this.detectPattern(files, 'validation');
        result.hasOpenAPI = files.some(f => f.name.includes('openapi') || f.name.includes('swagger'));
        return result;
    }

    async integrateMicroservice(files, options = {}) {
        const result = await this.integrateService(files, options);
        result.type = 'microservice';
        result.serviceName = options.name || 'microservice';
        result.port = this.findPort(files) || 3000;
        result.hasHealthCheck = this.detectPattern(files, 'health');
        result.hasMessageQueue = this.detectPattern(files, 'queue');
        return result;
    }

    async integrateGraphQL(files, options = {}) {
        const result = await this.integrateService(files, options);
        result.type = 'graphql';
        result.hasSchema = files.some(f => f.content?.includes('type') || f.content?.includes('schema'));
        result.hasResolvers = this.detectPattern(files, 'graphql');
        result.hasSubscriptions = this.detectPattern(files, 'subscription');
        return result;
    }

    async integrateSolidity(files, options = {}) {
        const solFiles = files.filter(f => f.extension === 'sol' || f.type === 'solidity');
        const contractData = solFiles.map(f => ({
            name: f.name.replace(/\.sol$/, ''),
            hasRequire: f.content?.includes('require(') || false,
            hasEmit: f.content?.includes('emit ') || false,
            hasOnlyOwner: f.content?.includes('onlyOwner') || false,
            version: this.extractSolidityVersion(f.content)
        }));
        
        return {
            type: 'solidity',
            name: options.name || 'Smart Contract Suite',
            contracts: contractData,
            totalContracts: contractData.length,
            hasSecurityFeatures: contractData.some(c => c.hasRequire),
            hasAccessControl: contractData.some(c => c.hasOnlyOwner),
            hasEvents: contractData.some(c => c.hasEmit),
            deploymentReady: true,
            averageSecurityScore: contractData.reduce((sum, c) => sum + (c.hasRequire ? 20 : 0) + (c.hasOnlyOwner ? 15 : 0), 0) / (contractData.length || 1),
            version: this.extractSolidityVersion(solFiles[0]?.content)
        };
    }

    async integrateBlockchain(files, options = {}) {
        const result = await this.integrateSolidity(files, options);
        result.type = 'blockchain';
        result.hasTokens = this.detectPattern(files, 'token');
        result.hasNFTs = this.detectPattern(files, 'nft');
        result.hasDeFi = this.detectPattern(files, 'defi');
        result.hasWeb3 = this.detectPattern(files, 'web3');
        return result;
    }

    async integrateDApp(files, options = {}) {
        const solidityResult = await this.integrateSolidity(files, options);
        const appResult = await this.integrateApp(files, options);
        
        return {
            type: 'dapp',
            name: options.name || 'Decentralized Application',
            contracts: solidityResult.contracts,
            frontend: {
                entry: appResult.entry,
                pages: appResult.structure.pages,
                scripts: appResult.structure.scripts,
                styles: appResult.structure.styles
            },
            hasWeb3: this.detectPattern(files, 'web3'),
            hasWallet: this.detectPattern(files, 'wallet'),
            deploymentReady: true
        };
    }

    async integrateNFT(files, options = {}) {
        const result = await this.integrateSolidity(files, options);
        result.type = 'nft';
        result.hasNFTStandard = this.detectPattern(files, 'nft');
        result.hasMetadata = files.some(f => f.content?.includes('metadata') || f.content?.includes('tokenURI'));
        result.hasMinting = files.some(f => f.content?.includes('mint'));
        return result;
    }

    async integrateDeFi(files, options = {}) {
        const result = await this.integrateSolidity(files, options);
        result.type = 'defi';
        result.hasLending = this.detectPattern(files, 'lending');
        result.hasStaking = this.detectPattern(files, 'staking');
        result.hasLiquidity = this.detectPattern(files, 'liquidity');
        result.hasYieldFarming = this.detectPattern(files, 'yield');
        return result;
    }

    async integrateDatabase(files, options = {}) {
        const sqlFiles = files.filter(f => this.isType(f, 'sql'));
        const jsonFiles = files.filter(f => this.isType(f, 'json'));
        
        return {
            type: 'database',
            name: options.name || 'Database Schema',
            sql: sqlFiles.length,
            json: jsonFiles.length,
            totalFiles: files.length,
            hasMigrations: files.some(f => f.name.includes('migration')),
            hasSeeds: files.some(f => f.name.includes('seed')),
            databaseType: this.detectDatabaseType(files)
        };
    }

    async integrateML(files, options = {}) {
        const pyFiles = files.filter(f => this.isType(f, 'py'));
        const jsonFiles = files.filter(f => this.isType(f, 'json'));
        const csvFiles = files.filter(f => this.isType(f, 'csv'));
        
        return {
            type: 'ml',
            name: options.name || 'Machine Learning Project',
            python: pyFiles.length,
            json: jsonFiles.length,
            csv: csvFiles.length,
            totalFiles: files.length,
            hasTraining: this.detectPattern(files, 'train'),
            hasModel: this.detectPattern(files, 'model'),
            framework: this.detectMLFramework(files)
        };
    }

    async integrateAI(files, options = {}) {
        const result = await this.integrateML(files, options);
        result.type = 'ai';
        result.hasLLM = this.detectPattern(files, 'llm');
        result.hasRAG = this.detectPattern(files, 'rag');
        result.hasAgents = this.detectPattern(files, 'agent');
        result.hasVectorDB = this.detectPattern(files, 'vector');
        return result;
    }

    async integrateAnalytics(files, options = {}) {
        const pyFiles = files.filter(f => this.isType(f, 'py'));
        const csvFiles = files.filter(f => this.isType(f, 'csv'));
        const jsonFiles = files.filter(f => this.isType(f, 'json'));
        
        return {
            type: 'analytics',
            name: options.name || 'Analytics Project',
            python: pyFiles.length,
            csv: csvFiles.length,
            json: jsonFiles.length,
            totalFiles: files.length,
            hasDashboards: files.some(f => f.content?.includes('dashboard')),
            hasReports: files.some(f => f.name.includes('report')),
            hasVisualizations: files.some(f => f.content?.includes('plot') || f.content?.includes('chart'))
        };
    }

    async integrateDesktop(files, options = {}) {
        const htmlFiles = files.filter(f => this.isType(f, 'html'));
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const cssFiles = files.filter(f => this.isType(f, 'css'));
        
        return {
            type: 'desktop',
            name: options.name || 'Desktop Application',
            entry: files.find(f => f.name.includes('main'))?.name || 'index.html',
            files: {
                html: htmlFiles.length,
                js: jsFiles.length,
                css: cssFiles.length,
                total: files.length
            },
            hasNativeIntegration: this.detectPattern(files, 'native'),
            hasFileSystem: this.detectPattern(files, 'fs'),
            platform: options.platform || 'cross-platform'
        };
    }

    async integrateMobile(files, options = {}) {
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const jsonFiles = files.filter(f => this.isType(f, 'json'));
        
        return {
            type: 'mobile',
            name: options.name || 'Mobile Application',
            entry: files.find(f => f.name.includes('App') || f.name.includes('app'))?.name || 'index.js',
            files: {
                js: jsFiles.length,
                json: jsonFiles.length,
                total: files.length
            },
            platform: this.detectMobilePlatform(files),
            hasNativeFeatures: this.detectPattern(files, 'native'),
            hasPushNotifications: this.detectPattern(files, 'notification')
        };
    }

    async integrateElectron(files, options = {}) {
        const result = await this.integrateDesktop(files, options);
        result.type = 'electron';
        result.mainProcess = files.find(f => f.name.includes('main'))?.name;
        result.rendererProcess = files.find(f => f.name.includes('renderer'))?.name;
        result.hasNativeModules = this.detectPattern(files, 'native');
        result.hasAutoUpdater = this.detectPattern(files, 'autoupdater');
        return result;
    }

    async integrateReactNative(files, options = {}) {
        const result = await this.integrateMobile(files, options);
        result.type = 'react-native';
        result.hasExpo = files.some(f => f.content?.includes('expo'));
        result.hasNativeModules = this.detectPattern(files, 'native');
        result.hasNavigation = this.detectPattern(files, 'navigation');
        return result;
    }

    async integrateTool(files, options = {}) {
        const pyFiles = files.filter(f => this.isType(f, 'py'));
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const shFiles = files.filter(f => this.isType(f, 'sh'));
        
        return {
            type: 'tool',
            name: options.name || 'Development Tool',
            entry: pyFiles[0]?.name || jsFiles[0]?.name || shFiles[0]?.name || 'main.js',
            files: {
                python: pyFiles.length,
                javascript: jsFiles.length,
                shell: shFiles.length,
                total: files.length
            },
            scripts: [...pyFiles.map(f => f.name), ...jsFiles.map(f => f.name), ...shFiles.map(f => f.name)],
            dependencies: this.findDependencies(files)
        };
    }

    async integratePlugin(files, options = {}) {
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const jsonFiles = files.filter(f => this.isType(f, 'json'));
        
        return {
            type: 'plugin',
            name: options.name || 'Plugin',
            entry: jsFiles[0]?.name || 'index.js',
            files: {
                js: jsFiles.length,
                json: jsonFiles.length,
                total: files.length
            },
            types: [...new Set(files.map(f => f.extension || 'unknown'))],
            hasAPIs: this.detectPattern(files, 'api'),
            hasHooks: this.detectPattern(files, 'hook')
        };
    }

    async integrateLibrary(files, options = {}) {
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const jsonFiles = files.filter(f => this.isType(f, 'json'));
        
        return {
            type: 'library',
            name: options.name || 'Library',
            entry: files.find(f => f.name.includes('index') || f.name.includes('main'))?.name || 'index.js',
            files: {
                js: jsFiles.length,
                json: jsonFiles.length,
                total: files.length
            },
            exports: this.findExports(files),
            dependencies: this.findDependencies(files),
            hasTests: files.some(f => f.name.includes('test') || f.name.includes('spec')),
            hasDocs: files.some(f => f.name.includes('README') || f.name.includes('docs'))
        };
    }

    async integrateCLI(files, options = {}) {
        const result = await this.integrateTool(files, options);
        result.type = 'cli';
        result.hasHelp = this.detectPattern(files, 'help');
        result.hasVersion = this.detectPattern(files, 'version');
        return result;
    }

    async integrateGame(files, options = {}) {
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const htmlFiles = files.filter(f => this.isType(f, 'html'));
        const imageFiles = files.filter(f => this.isType(f, 'image'));
        
        return {
            type: 'game',
            name: options.name || 'Game',
            entry: htmlFiles[0]?.name || jsFiles[0]?.name || 'index.html',
            files: {
                js: jsFiles.length,
                html: htmlFiles.length,
                images: imageFiles.length,
                total: files.length
            },
            hasPhysics: this.detectPattern(files, 'physics'),
            hasGameAI: this.detectPattern(files, 'ai'),
            hasGraphics: imageFiles.length > 0,
            engine: this.detectGameEngine(files)
        };
    }

    async integrateIoT(files, options = {}) {
        const pyFiles = files.filter(f => this.isType(f, 'py'));
        const jsonFiles = files.filter(f => this.isType(f, 'json'));
        
        return {
            type: 'iot',
            name: options.name || 'IoT Project',
            entry: pyFiles[0]?.name || 'main.py',
            files: {
                python: pyFiles.length,
                json: jsonFiles.length,
                total: files.length
            },
            hasSensors: this.detectPattern(files, 'sensor'),
            hasMQTT: this.detectPattern(files, 'mqtt'),
            hasGPIO: this.detectPattern(files, 'gpio'),
            deviceType: this.detectDeviceType(files)
        };
    }

    async integrateDefault(files, options = {}) {
        return {
            type: 'default',
            name: options.name || 'General Integration',
            files: files.map(f => f.name),
            types: [...new Set(files.map(f => f.extension || 'unknown'))],
            size: files.reduce((sum, f) => sum + (f.size || 0), 0),
            count: files.length
        };
    }

    // ==========================================
    // TYPE DETECTION ENGINE
    // ==========================================

    detectIntegrationType(files) {
        const types = files.map(f => f.extension || 'unknown');
        const names = files.map(f => f.name);
        
        // Blockchain / Smart Contracts
        if (types.some(t => t === 'sol' || t === 'vyper')) return 'solidity';
        if (names.some(n => n.includes('DApp') || n.includes('dapp'))) return 'dapp';
        if (names.some(n => n.includes('NFT') || n.includes('nft'))) return 'nft';
        if (names.some(n => n.includes('DeFi') || n.includes('defi'))) return 'defi';
        if (names.some(n => n.includes('blockchain') || n.includes('web3'))) return 'blockchain';
        
        // Web / Frontend
        if (types.some(t => t === 'html') && types.some(t => t === 'js')) {
            if (names.some(n => n.includes('manifest.json') || n.includes('service-worker'))) return 'pwa';
            if (names.some(n => n.includes('server') || n.includes('ssr'))) return 'ssr';
            if (names.some(n => n.includes('spa') || n.includes('router'))) return 'spa';
            return 'app';
        }
        if (types.some(t => t === 'html') && types.some(t => t === 'css')) {
            if (types.every(t => t === 'html' || t === 'css' || t === 'png' || t === 'jpg' || t === 'svg')) return 'static';
            return 'web';
        }
        
        // Service / API
        if (types.some(t => t === 'js') && types.some(t => t === 'json')) {
            if (names.some(n => n.includes('graphql'))) return 'graphql';
            if (names.some(n => n.includes('microservice'))) return 'microservice';
            if (names.some(n => n.includes('api'))) return 'api';
            return 'service';
        }
        
        // Data & AI
        if (types.some(t => t === 'py' || t === 'python')) {
            if (names.some(n => n.includes('model') || n.includes('train'))) return 'ml';
            if (names.some(n => n.includes('ai') || n.includes('agent') || n.includes('llm'))) return 'ai';
            if (names.some(n => n.includes('analytics') || n.includes('dashboard'))) return 'analytics';
            return 'tool';
        }
        if (types.some(t => t === 'sql' || t === 'sqlite' || t === 'db')) return 'database';
        
        // Desktop & Mobile
        if (names.some(n => n.includes('electron'))) return 'electron';
        if (names.some(n => n.includes('react-native') || n.includes('expo'))) return 'react-native';
        if (names.some(n => n.includes('mobile') || n.includes('android') || n.includes('ios'))) return 'mobile';
        if (names.some(n => n.includes('desktop'))) return 'desktop';
        
        // Other
        if (names.some(n => n.includes('cli'))) return 'cli';
        if (names.some(n => n.includes('game') || n.includes('player'))) return 'game';
        if (names.some(n => n.includes('iot') || n.includes('sensor'))) return 'iot';
        if (names.some(n => n.includes('plugin') || n.includes('extension'))) return 'plugin';
        if (names.some(n => n.includes('lib') || n.includes('library'))) return 'library';
        
        return 'default';
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    isType(file, type) {
        const ext = file.extension || '';
        const fileType = file.type || '';
        const analysisType = file.analysis?.type || '';
        
        const typeMap = {
            'html': ['html', 'htm', 'xhtml'],
            'css': ['css', 'scss', 'sass', 'less'],
            'js': ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'],
            'json': ['json', 'json5', 'jsonl'],
            'py': ['py', 'pyc', 'pyo'],
            'sol': ['sol', 'vyper'],
            'image': ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'],
            'audio': ['mp3', 'wav', 'flac', 'ogg', 'm4a'],
            'video': ['mp4', 'avi', 'mov', 'webm', 'mkv'],
            'sql': ['sql', 'sqlite', 'db'],
            'csv': ['csv', 'tsv'],
            'sh': ['sh', 'bash', 'zsh']
        };
        
        const extensions = typeMap[type] || [];
        return extensions.includes(ext) || analysisType === type || fileType.includes(type);
    }

    detectPattern(files, pattern) {
        const patterns = {
            'routing': /router|route|Routes|routing/i,
            'state': /redux|store|mobx|zustand|state/i,
            'api': /api|endpoint|axios|fetch|http/i,
            'lazy': /lazy|React\.lazy|import\(/i,
            'auth': /auth|jwt|token|login|logout|authenticate/i,
            'database': /db|database|sql|mongodb|postgres|mysql/i,
            'caching': /cache|redis|memcached/i,
            'validation': /validate|validator|schema|joi|yup/i,
            'graphql': /graphql|gql|schema|resolver|subscription/i,
            'subscription': /subscription|subscribe/i,
            'web3': /web3|ethers|ethereum|blockchain|wallet/i,
            'wallet': /wallet|metamask|connect/i,
            'token': /token|erc20|fungible/i,
            'nft': /nft|erc721|erc1155|tokenURI|metadata/i,
            'defi': /defi|swap|pool|liquidity|farm|stake|yield/i,
            'lending': /lend|loan|borrow|collateral/i,
            'staking': /stake|staking|validator/i,
            'liquidity': /liquidity|pool|LP/i,
            'yield': /yield|farm|harvest/i,
            'train': /train|training|fit|epoch/i,
            'model': /model|weights|checkpoint/i,
            'llm': /llm|openai|claude|gemini|gpt|language model/i,
            'rag': /rag|retrieval|vector|embedding/i,
            'agent': /agent|tool|function calling/i,
            'vector': /vector|embedding|chroma|pinecone|qdrant/i,
            'mqtt': /mqtt|mosquitto|paho/i,
            'gpio': /gpio|pin|RPi|GPIO/i,
            'sensor': /sensor|temperature|humidity|pressure/i,
            'physics': /physics|gravity|collision|body/i,
            'notification': /notification|push|notify/i,
            'native': /native|bridge|Java|Objective-C/i,
            'fs': /fs\.|readFile|writeFile|file system/i,
            'autoupdater': /autoupdater|auto-updater|update/i,
            'hook': /hook|useEffect|useState|useCallback/i,
            'help': /help|usage|--help/i,
            'version': /version|--version/i,
            'health': /health|ping|status/i,
            'queue': /queue|rabbitmq|kafka|sqs/i,
            'rate-limit': /rate|limit|throttle/i
        };
        
        const regex = patterns[pattern];
        if (!regex) return false;
        
        return files.some(f => {
            if (!f.content || typeof f.content !== 'string') return false;
            return regex.test(f.content);
        });
    }

    findDependencies(files) {
        const deps = [];
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            
            // Find require statements
            const requires = file.content.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g) || [];
            for (const r of requires) {
                const match = r.match(/['"]([^'"]+)['"]/);
                if (match && !match[1].startsWith('.')) {
                    deps.push(match[1]);
                }
            }
            
            // Find import statements
            const imports = file.content.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/g) || [];
            for (const i of imports) {
                const match = i.match(/['"]([^'"]+)['"]/);
                if (match && !match[1].startsWith('.')) {
                    deps.push(match[1]);
                }
            }
        }
        return [...new Set(deps)];
    }

    findEndpoints(files) {
        const endpoints = [];
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const matches = file.content.match(/['"](GET|POST|PUT|DELETE|PATCH)\s+['"]?([^'"]+)['"]?/g) || [];
            for (const match of matches) {
                const parts = match.match(/['"](GET|POST|PUT|DELETE|PATCH)\s+['"]?([^'"]+)['"]?/);
                if (parts) {
                    endpoints.push({ method: parts[1], path: parts[2] });
                }
            }
        }
        return endpoints;
    }

    findExports(files) {
        const exports = [];
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const matches = file.content.match(/export\s+[a-zA-Z_]+/g) || [];
            for (const match of matches) {
                const name = match.replace('export ', '');
                if (name && !name.startsWith('default')) {
                    exports.push(name);
                }
            }
        }
        return exports;
    }

    extractComponents(files) {
        const components = [];
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const matches = file.content.match(/class\s+([A-Z][a-zA-Z]*)/g) || [];
            for (const match of matches) {
                const name = match.replace('class ', '');
                if (!components.includes(name)) components.push(name);
            }
        }
        return components;
    }

    extractSolidityVersion(content) {
        if (!content) return 'unknown';
        const match = content.match(/pragma\s+solidity\s+([^;]+);/);
        return match ? match[1].trim() : 'unknown';
    }

    findPort(files) {
        for (const file of files) {
            if (file.content && typeof file.content === 'string') {
                const match = file.content.match(/PORT\s*=\s*(\d+)/);
                if (match) return parseInt(match[1]);
            }
        }
        return null;
    }

    detectDatabaseType(files) {
        for (const file of files) {
            if (file.content && typeof file.content === 'string') {
                if (file.content.includes('postgres')) return 'postgres';
                if (file.content.includes('mysql')) return 'mysql';
                if (file.content.includes('mongodb')) return 'mongodb';
                if (file.content.includes('sqlite')) return 'sqlite';
            }
        }
        return 'unknown';
    }

    detectMobilePlatform(files) {
        for (const file of files) {
            if (file.content && typeof file.content === 'string') {
                if (file.content.includes('android') || file.content.includes('java')) return 'android';
                if (file.content.includes('ios') || file.content.includes('swift')) return 'ios';
                if (file.content.includes('expo')) return 'expo';
            }
        }
        return 'react-native';
    }

    detectMLFramework(files) {
        for (const file of files) {
            if (file.content && typeof file.content === 'string') {
                if (file.content.includes('tensorflow')) return 'tensorflow';
                if (file.content.includes('pytorch')) return 'pytorch';
                if (file.content.includes('sklearn')) return 'scikit-learn';
                if (file.content.includes('keras')) return 'keras';
            }
        }
        return 'unknown';
    }

    detectGameEngine(files) {
        for (const file of files) {
            if (file.content && typeof file.content === 'string') {
                if (file.content.includes('phaser')) return 'phaser';
                if (file.content.includes('pixi')) return 'pixi.js';
                if (file.content.includes('three')) return 'three.js';
                if (file.content.includes('babylon')) return 'babylon.js';
            }
        }
        return 'custom';
    }

    detectDeviceType(files) {
        for (const file of files) {
            if (file.content && typeof file.content === 'string') {
                if (file.content.includes('arduino')) return 'arduino';
                if (file.content.includes('esp8266')) return 'esp8266';
                if (file.content.includes('esp32')) return 'esp32';
                if (file.content.includes('raspberry')) return 'raspberrypi';
            }
        }
        return 'generic';
    }

    validateFiles(files) {
        const errors = [];
        const warnings = [];
        
        for (const file of files) {
            if (!file.name) errors.push('File missing name');
            if (!file.content && !file.size) errors.push(`File ${file.name || 'unknown'} has no content`);
            if (file.size > 50 * 1024 * 1024) {
                warnings.push(`File ${file.name} is very large (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
            }
        }
        
        return { success: errors.length === 0, errors, warnings };
    }

    analyzeDependencies(files) {
        const dependencies = this.findDependencies(files);
        return {
            total: dependencies.length,
            dependencies: dependencies,
            duplicates: dependencies.filter((d, i) => dependencies.indexOf(d) !== i)
        };
    }

    calculateComplexity(files) {
        let totalLines = 0;
        let totalFunctions = 0;
        let totalClasses = 0;
        
        for (const file of files) {
            if (file.content && typeof file.content === 'string') {
                totalLines += file.content.split('\n').length;
                totalFunctions += (file.content.match(/function\s+[a-zA-Z_]/g) || []).length;
                totalClasses += (file.content.match(/class\s+[a-zA-Z_]/g) || []).length;
            }
        }
        
        const score = (totalLines / 100) + (totalFunctions * 2) + (totalClasses * 3);
        
        if (score < 50) return 'simple';
        if (score < 100) return 'medium';
        if (score < 200) return 'complex';
        return 'very-complex';
    }

    getFileTypeDistribution(files) {
        const distribution = {};
        for (const file of files) {
            const type = file.extension || 'unknown';
            distribution[type] = (distribution[type] || 0) + 1;
        }
        return distribution;
    }

    generateName(type) {
        const names = {
            'app': 'Web Application',
            'web': 'Web Page',
            'spa': 'Single Page Application',
            'pwa': 'Progressive Web App',
            'ssr': 'Server-Side Rendered App',
            'static': 'Static Website',
            'service': 'API Service',
            'api': 'REST API',
            'microservice': 'Microservice',
            'graphql': 'GraphQL API',
            'solidity': 'Smart Contract Suite',
            'blockchain': 'Blockchain Project',
            'dapp': 'Decentralized App',
            'nft': 'NFT Project',
            'defi': 'DeFi Protocol',
            'database': 'Database Schema',
            'ml': 'Machine Learning Model',
            'ai': 'AI System',
            'analytics': 'Analytics Dashboard',
            'desktop': 'Desktop Application',
            'mobile': 'Mobile Application',
            'electron': 'Electron App',
            'react-native': 'React Native App',
            'tool': 'Development Tool',
            'plugin': 'Plugin',
            'library': 'Library',
            'cli': 'CLI Tool',
            'game': 'Game',
            'iot': 'IoT Project'
        };
        return names[type] || 'Integration';
    }

    generateId() {
        return 'int_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }

    generateCacheKey(files) {
        const names = files.map(f => f.name).sort().join('|');
        const sizes = files.map(f => f.size || 0).sort().join('|');
        return 'cache_' + this.hash(names + sizes);
    }

    hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    cleanCache() {
        const now = Date.now();
        for (const [key, value] of this.cache) {
            if (now - value.timestamp > 3600000) {
                this.cache.delete(key);
                this.log(`🧹 Cache cleaned: ${key}`);
            }
        }
    }

    collectWarnings(integration) {
        const warnings = [];
        if (integration.validation?.warnings) {
            warnings.push(...integration.validation.warnings);
        }
        if (integration.dependencies?.duplicates?.length > 0) {
            warnings.push(`${integration.dependencies.duplicates.length} duplicate dependencies found`);
        }
        return warnings;
    }

    log(message) {
        if (this.config.enableLogging) {
            console.log(`[Integrator] ${message}`);
        }
    }

    // ==========================================
    // INTEGRATION MANAGEMENT
    // ==========================================

    getIntegration(id) {
        return this.activeIntegrations.get(id) || null;
    }

    getAllIntegrations() {
        return [...this.integrations];
    }

    getIntegrationByType(type) {
        return this.integrations.filter(i => i.type === type);
    }

    getIntegrationByStatus(status) {
        return this.integrations.filter(i => i.status === status);
    }

    getRecentIntegrations(limit = 10) {
        return this.integrations.slice(-limit).reverse();
    }

    getIntegrationStats() {
        if (this.integrations.length === 0) {
            return { total: 0, byType: {}, byStatus: {}, averageDuration: 0 };
        }
        
        const stats = {
            total: this.integrations.length,
            byType: {},
            byStatus: {},
            averageDuration: this.integrations.reduce((sum, i) => sum + (i.duration || 0), 0) / this.integrations.length,
            totalFiles: this.integrations.reduce((sum, i) => sum + (i.files || 0), 0),
            successRate: (this.integrations.filter(i => i.status === 'completed').length / this.integrations.length) * 100
        };
        
        for (const integration of this.integrations) {
            stats.byType[integration.type] = (stats.byType[integration.type] || 0) + 1;
            stats.byStatus[integration.status] = (stats.byStatus[integration.status] || 0) + 1;
        }
        
        return stats;
    }

    removeIntegration(id) {
        const result = this.activeIntegrations.delete(id);
        if (result) {
            this.integrations = this.integrations.filter(i => i.id !== id);
            this.log(`🗑️ Removed integration ${id}`);
        }
        return result;
    }

    clearIntegrations() {
        const count = this.integrations.length;
        this.integrations = [];
        this.activeIntegrations.clear();
        this.cache.clear();
        this.log(`🧹 Cleared ${count} integrations`);
        return count;
    }

    reset() {
        const count = this.clearIntegrations();
        this.integrationHistory = [];
        this.queue = [];
        this.processing = false;
        return count;
    }

    // ==========================================
    // EXPORT / IMPORT
    // ==========================================

    exportIntegrations() {
        return JSON.stringify({
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            total: this.integrations.length,
            integrations: this.integrations
        }, null, 2);
    }

    importIntegrations(json) {
        try {
            const data = JSON.parse(json);
            const integrations = data.integrations || data;
            
            if (!Array.isArray(integrations)) {
                return { success: false, error: 'Invalid data format: expected array' };
            }
            
            let imported = 0;
            for (const integration of integrations) {
                if (!integration.id) {
                    integration.id = this.generateId();
                }
                if (!integration.timestamp) {
                    integration.timestamp = new Date().toISOString();
                }
                this.integrations.push(integration);
                this.activeIntegrations.set(integration.id, integration);
                imported++;
            }
            
            this.log(`📥 Imported ${imported} integrations`);
            return { success: true, count: imported };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ==========================================
    // BATCH PROCESSING
    // ==========================================

    async batchIntegrate(fileGroups, options = {}) {
        const results = [];
        const totalGroups = fileGroups.length;
        
        this.log(`🔄 Batch integrating ${totalGroups} groups`);
        
        let processed = 0;
        for (const files of fileGroups) {
            try {
                const result = await this.integrate(files, options);
                results.push(result);
                processed++;
                this.log(`📊 Progress: ${processed}/${totalGroups}`);
            } catch (error) {
                results.push({
                    success: false,
                    error: error.message,
                    message: `❌ Batch integration failed: ${error.message}`
                });
            }
        }
        
        const successful = results.filter(r => r.success).length;
        this.log(`✅ Batch complete: ${successful}/${totalGroups} successful`);
        
        return {
            success: true,
            results: results,
            total: totalGroups,
            successful: successful,
            failed: totalGroups - successful
        };
    }

    // ==========================================
    // PERFORMANCE METRICS
    // ==========================================

    getPerformanceMetrics() {
        return {
            totalIntegrations: this.integrations.length,
            activeIntegrations: this.activeIntegrations.size,
            averageDuration: this.integrations.reduce((sum, i) => sum + (i.duration || 0), 0) / (this.integrations.length || 1),
            cacheSize: this.cache.size,
            queueLength: this.queue.length,
            processing: this.processing,
            integrationTypes: Object.keys(this.integrationTypes).length
        };
    }

    // ==========================================
    // SEARCH & FILTER
    // ==========================================

    searchIntegrations(query) {
        const lowerQuery = query.toLowerCase();
        return this.integrations.filter(i => 
            i.name?.toLowerCase().includes(lowerQuery) ||
            i.type?.toLowerCase().includes(lowerQuery) ||
            i.fileList?.some(f => f.toLowerCase().includes(lowerQuery))
        );
    }

    filterIntegrations(criteria) {
        return this.integrations.filter(i => {
            let match = true;
            if (criteria.type && i.type !== criteria.type) match = false;
            if (criteria.status && i.status !== criteria.status) match = false;
            if (criteria.minFiles && i.files < criteria.minFiles) match = false;
            if (criteria.maxFiles && i.files > criteria.maxFiles) match = false;
            if (criteria.dateAfter && new Date(i.timestamp) < new Date(criteria.dateAfter)) match = false;
            if (criteria.dateBefore && new Date(i.timestamp) > new Date(criteria.dateBefore)) match = false;
            return match;
        });
    }
}
