// ============================================
// INTEGRATOR PRO - The Most Advanced Integration Engine
// 30+ Integration Types | Zero Node.js Dependencies | 100% Browser Compatible
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
        this.queue = [];
        this.processing = false;
        this.idCounter = 0;

        // ==========================================
        // CONFIGURATION
        // ==========================================
        this.config = {
            enableCaching: options.enableCaching !== false,
            enableLogging: options.enableLogging !== false,
            maxConcurrent: options.maxConcurrent || 5,
            timeout: options.timeout || 30000,
            cacheTTL: options.cacheTTL || 3600000 // 1 hour
        };

        // ==========================================
        // 30+ INTEGRATION TYPES
        // ==========================================
        this.integrationTypes = {
            // Web & Frontend
            'app': this.integrateApp.bind(this),
            'web': this.integrateWeb.bind(this),
            'spa': this.integrateSPA.bind(this),
            'pwa': this.integratePWA.bind(this),
            'ssr': this.integrateSSR.bind(this),
            'static': this.integrateStatic.bind(this),

            // Backend & API
            'service': this.integrateService.bind(this),
            'api': this.integrateAPI.bind(this),
            'microservice': this.integrateMicroservice.bind(this),
            'graphql': this.integrateGraphQL.bind(this),
            'websocket': this.integrateWebSocket.bind(this),

            // Blockchain & Smart Contracts
            'solidity': this.integrateSolidity.bind(this),
            'blockchain': this.integrateBlockchain.bind(this),
            'dapp': this.integrateDApp.bind(this),
            'nft': this.integrateNFT.bind(this),
            'defi': this.integrateDeFi.bind(this),

            // Data & AI
            'database': this.integrateDatabase.bind(this),
            'ml': this.integrateML.bind(this),
            'ai': this.integrateAI.bind(this),
            'analytics': this.integrateAnalytics.bind(this),
            'bigdata': this.integrateBigData.bind(this),

            // Desktop & Mobile
            'desktop': this.integrateDesktop.bind(this),
            'mobile': this.integrateMobile.bind(this),
            'electron': this.integrateElectron.bind(this),
            'react-native': this.integrateReactNative.bind(this),

            // Development & Tools
            'tool': this.integrateTool.bind(this),
            'plugin': this.integratePlugin.bind(this),
            'library': this.integrateLibrary.bind(this),
            'cli': this.integrateCLI.bind(this),

            // Other
            'game': this.integrateGame.bind(this),
            'iot': this.integrateIoT.bind(this),
            'default': this.integrateDefault.bind(this)
        };

        // ==========================================
        // DETECTION PATTERNS
        // ==========================================
        this.patterns = {
            routing: /router|Route|Routes|routing|BrowserRouter|HashRouter/i,
            state: /redux|store|mobx|zustand|state|context|provider/i,
            api: /api|endpoint|axios|fetch|http|https|request/i,
            lazy: /lazy|React\.lazy|import\(|dynamic/i,
            auth: /auth|jwt|token|login|logout|authenticate|authorization/i,
            database: /db|database|sql|mongodb|postgres|mysql|redis/i,
            caching: /cache|redis|memcached/i,
            validation: /validate|validator|schema|joi|yup|zod/i,
            graphql: /graphql|gql|schema|resolver|subscription|apollo/i,
            websocket: /socket|ws|wss|Socket\.io|websocket/i,
            web3: /web3|ethers|ethereum|blockchain|wallet|solidity/i,
            nft: /nft|erc721|erc1155|tokenURI|metadata|mint/i,
            defi: /defi|swap|pool|liquidity|farm|stake|yield|token/i,
            ml: /train|model|inference|tensorflow|pytorch|keras/i,
            ai: /ai|llm|openai|claude|gemini|agent|rag|vector|embedding/i,
            iot: /sensor|actuator|mqtt|gpio|arduino|esp/i,
            game: /game|physics|canvas|phaser|pixi|three|unity/i,
            cli: /cli|command|arg|flag|help|commander/i,
            pwa: /manifest|service-worker|offline|cache-storage/i,
            ssr: /server|ssr|hydrate|renderToString/i,
            electron: /electron|main\.js|renderer|ipc/i,
            native: /native|bridge|Java|Objective-C|C\+\+/i,
            fs: /fs\.|readFile|writeFile|file system|FileSystem/i,
            notification: /notification|push|notify|web-push/i,
            help: /help|usage|--help|helpCommand/i,
            version: /version|--version|ver/i,
            health: /health|ping|status|healthcheck/i,
            queue: /queue|rabbitmq|kafka|sqs|bull/i,
            rate: /rate|limit|throttle|limiter/i,
            sensor: /sensor|temperature|humidity|pressure|light|motion/i,
            physics: /physics|gravity|collision|body|velocity/i,
            token: /token|erc20|fungible|transfer|balanceOf/i,
            lending: /lend|loan|borrow|collateral|interest/i,
            staking: /stake|staking|validator|reward/i,
            liquidity: /liquidity|pool|LP|swap/i,
            yield: /yield|farm|harvest|reinvest/i,
            subscription: /subscription|subscribe|pubsub/i,
            migration: /migration|migrate|upgrade/i,
            seed: /seed|seeder|populate/i,
            backup: /backup|dump|restore/i,
            dashboard: /dashboard|panel|admin/i,
            report: /report|analytics|metrics/i,
            visualization: /plot|chart|graph|visualization/i,
            autoupdater: /autoupdater|auto-updater|update/i,
            hook: /hook|useEffect|useState|useCallback|useMemo/i,
            mqtt: /mqtt|mosquitto|paho/i
        };

        // ==========================================
        // FILE TYPE MAP
        // ==========================================
        this.typeMap = {
            html: ['html', 'htm', 'xhtml'],
            css: ['css', 'scss', 'sass', 'less'],
            js: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'],
            json: ['json', 'json5', 'jsonl'],
            py: ['py', 'pyc', 'pyo'],
            sol: ['sol', 'vyper'],
            image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'bmp', 'tiff'],
            audio: ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac', 'wma'],
            video: ['mp4', 'avi', 'mov', 'webm', 'mkv', 'flv', 'wmv'],
            sql: ['sql', 'sqlite', 'db', 'db3'],
            csv: ['csv', 'tsv', 'psv'],
            sh: ['sh', 'bash', 'zsh', 'fish'],
            xml: ['xml', 'xsd', 'xsl', 'xslt'],
            yaml: ['yaml', 'yml'],
            md: ['md', 'markdown'],
            txt: ['txt', 'log', 'text'],
            pdf: ['pdf'],
            doc: ['doc', 'docx', 'odt'],
            xls: ['xls', 'xlsx', 'ods'],
            ppt: ['ppt', 'pptx', 'odp']
        };

        this.log('🚀 Integrator Pro initialized (Most Advanced Version)');
        this.log(`📦 Integration Types: ${Object.keys(this.integrationTypes).length}`);
        this.log(`🔍 Detection Patterns: ${Object.keys(this.patterns).length}`);

        // Start cache cleanup interval
        if (this.config.enableCaching) {
            setInterval(() => this.cleanCache(), this.config.cacheTTL / 2);
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
                if (Date.now() - cached.timestamp < this.config.cacheTTL) {
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

            // Step 2: Analyze file structure
            const structure = this.analyzeStructure(files);

            // Step 3: Analyze dependencies
            const dependencies = this.analyzeDependencies(files);

            // Step 4: Analyze complexity
            const complexity = this.calculateComplexity(files);

            // Step 5: Security scan
            const security = this.scanForSecurity(files);

            // Step 6: Performance analysis
            const performance = this.analyzePerformance(files);

            // Step 7: Execute integration
            const handler = this.integrationTypes[type] || this.integrationTypes.default;
            const result = await handler(files, options);

            // Step 8: Build full integration
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
                structure: structure,
                dependencies: dependencies,
                complexity: complexity,
                security: security,
                performance: performance,

                // Integration result
                result: result,

                // Metadata
                metadata: {
                    totalSize: files.reduce((sum, f) => sum + (f.size || 0), 0),
                    fileTypes: this.getFileTypeDistribution(files),
                    hasBinaries: files.some(f => f.isBinary || false),
                    hasSolidity: files.some(f => f.extension === 'sol' || f.extension === 'vyper'),
                    hasTests: files.some(f => f.name.includes('test') || f.name.includes('spec')),
                    hasDocs: files.some(f => f.name.includes('README') || f.name.includes('docs')),
                    averageFileSize: files.reduce((sum, f) => sum + (f.size || 0), 0) / files.length,
                    maxFileSize: Math.max(...files.map(f => f.size || 0)),
                    minFileSize: Math.min(...files.map(f => f.size || 0))
                }
            };

            // Store integration
            this.integrations.push(integration);
            this.activeIntegrations.set(integrationId, integration);
            this.integrationHistory.push({
                id: integrationId,
                type: type,
                timestamp: new Date().toISOString(),
                duration: integration.duration,
                files: files.length
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
                warnings: this.collectWarnings(integration),
                metrics: {
                    duration: integration.duration,
                    files: files.length,
                    type: type
                }
            };

        } catch (error) {
            this.log(`❌ Integration ${integrationId} failed: ${error.message}`);
            this.log(`Stack: ${error.stack}`);

            return {
                success: false,
                error: error.message,
                message: `❌ Integration failed: ${error.message}`,
                integrationId: integrationId,
                stack: error.stack
            };
        }
    }

    // ==========================================
    // 30+ INTEGRATION HANDLERS
    // ==========================================

    // ----- Web & Frontend -----

    async integrateApp(files, options = {}) {
        const htmlFiles = files.filter(f => this.isType(f, 'html'));
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const cssFiles = files.filter(f => this.isType(f, 'css'));
        const jsonFiles = files.filter(f => this.isType(f, 'json'));

        return {
            type: 'app',
            name: options.name || 'Web Application',
            entry: htmlFiles[0]?.name || jsFiles[0]?.name || 'index.html',
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
                configs: jsonFiles.map(f => f.name),
                rootFiles: files.filter(f => f.path?.split('/').length === 1 || !f.path).map(f => f.name)
            },
            dependencies: this.findDependencies(files),
            bundleSize: files.reduce((sum, f) => sum + (f.size || 0), 0),
            components: this.extractComponents(files),
            hasRouting: this.detectPattern(files, 'routing'),
            hasState: this.detectPattern(files, 'state'),
            hasAPI: this.detectPattern(files, 'api'),
            hasLazyLoading: this.detectPattern(files, 'lazy'),
            framework: this.detectFramework(files)
        };
    }

    async integrateWeb(files, options = {}) {
        const result = await this.integrateApp(files, options);
        result.type = 'web';
        result.pages = files.filter(f => this.isType(f, 'html')).map(f => f.name);
        result.isStatic = true;
        result.canDeploy = true;
        return result;
    }

    async integrateSPA(files, options = {}) {
        const result = await this.integrateApp(files, options);
        result.type = 'spa';
        result.routing = this.detectPattern(files, 'routing');
        result.stateManagement = this.detectPattern(files, 'state');
        result.hasLazyLoading = this.detectPattern(files, 'lazy');
        result.hasAPIClients = this.detectPattern(files, 'api');
        result.hasAuthentication = this.detectPattern(files, 'auth');
        result.singlePage = true;
        return result;
    }

    async integratePWA(files, options = {}) {
        const result = await this.integrateSPA(files, options);
        result.type = 'pwa';
        result.hasManifest = files.some(f => f.name === 'manifest.json' || f.name === 'manifest.webmanifest');
        result.hasServiceWorker = files.some(f => f.name.includes('service-worker') || f.name.includes('sw.') || f.name.includes('sw.js'));
        result.offlineSupport = result.hasServiceWorker;
        result.hasPushNotifications = this.detectPattern(files, 'notification');
        result.hasCacheStrategy = this.detectPattern(files, 'cache');
        result.canInstall = result.hasManifest && result.hasServiceWorker;
        return result;
    }

    async integrateSSR(files, options = {}) {
        const result = await this.integrateApp(files, options);
        result.type = 'ssr';
        result.hasServerSideRendering = true;
        result.serverEntry = files.find(f => f.name.includes('server') && (f.name.includes('entry') || f.name.includes('index')))?.name;
        result.clientEntry = files.find(f => f.name.includes('client') || f.name === 'index.js' || f.name === 'app.js')?.name;
        result.hydrationEnabled = true;
        result.hasServerAPI = this.detectPattern(files, 'api');
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
            canDeploy: true,
            hasFavicon: files.some(f => f.name.includes('favicon'))
        };
    }

    // ----- Backend & API -----

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
            hasValidation: this.detectPattern(files, 'validation'),
            hasLogging: files.some(f => f.content?.includes('logger') || f.content?.includes('winston') || f.content?.includes('pino')),
            framework: this.detectBackendFramework(files)
        };
    }

    async integrateAPI(files, options = {}) {
        const result = await this.integrateService(files, options);
        result.type = 'api';
        result.rateLimiting = this.detectPattern(files, 'rate');
        result.caching = this.detectPattern(files, 'caching');
        result.validation = this.detectPattern(files, 'validation');
        result.hasOpenAPI = files.some(f => f.name.includes('openapi') || f.name.includes('swagger') || f.name.includes('api-docs'));
        result.hasWebhooks = files.some(f => f.content?.includes('webhook'));
        result.hasMiddleware = files.some(f => f.content?.includes('middleware') || f.content?.includes('use('));
        return result;
    }

    async integrateMicroservice(files, options = {}) {
        const result = await this.integrateService(files, options);
        result.type = 'microservice';
        result.serviceName = options.name || 'microservice';
        result.port = this.findPort(files) || 3000;
        result.hasHealthCheck = this.detectPattern(files, 'health');
        result.hasMessageQueue = this.detectPattern(files, 'queue');
        result.hasServiceDiscovery = this.detectPattern(files, 'discovery');
        result.hasDocker = files.some(f => f.name === 'Dockerfile' || f.name === 'docker-compose.yml');
        result.hasKubernetes = files.some(f => f.name.includes('k8s') || f.name.includes('deployment.yml'));
        return result;
    }

    async integrateGraphQL(files, options = {}) {
        const result = await this.integrateService(files, options);
        result.type = 'graphql';
        result.hasSchema = files.some(f => f.content?.includes('type') || f.content?.includes('schema') || f.content?.includes('gql`'));
        result.hasResolvers = this.detectPattern(files, 'graphql');
        result.hasSubscriptions = this.detectPattern(files, 'subscription');
        result.hasDirectives = files.some(f => f.content?.includes('@') && f.content?.includes('directive'));
        result.federationEnabled = files.some(f => f.content?.includes('federation') || f.content?.includes('@key'));
        return result;
    }

    async integrateWebSocket(files, options = {}) {
        const result = await this.integrateService(files, options);
        result.type = 'websocket';
        result.hasWebSocket = true;
        result.protocol = options.protocol || 'wss';
        result.hasChannels = this.detectPattern(files, 'subscription');
        result.hasHeartbeat = files.some(f => f.content?.includes('heartbeat') || f.content?.includes('ping'));
        result.hasBroadcasting = files.some(f => f.content?.includes('broadcast') || f.content?.includes('emit'));
        return result;
    }

    // ----- Blockchain & Smart Contracts -----

    async integrateSolidity(files, options = {}) {
        const solFiles = files.filter(f => f.extension === 'sol' || f.type === 'solidity' || f.name.endsWith('.sol'));
        const contractData = solFiles.map(f => ({
            name: f.name.replace(/\.sol$/, ''),
            functions: this.extractFunctions(f.content),
            events: this.extractEvents(f.content),
            imports: this.extractImports(f.content),
            hasRequire: f.content?.includes('require(') || false,
            hasAssert: f.content?.includes('assert(') || false,
            hasEmit: f.content?.includes('emit ') || false,
            hasOnlyOwner: f.content?.includes('onlyOwner') || false,
            hasModifier: f.content?.includes('modifier') || false,
            version: this.extractSolidityVersion(f.content),
            isAbstract: f.content?.includes('abstract') || false,
            hasConstructor: f.content?.includes('constructor(') || false,
            hasFallback: f.content?.includes('fallback()') || false,
            hasReceive: f.content?.includes('receive()') || false
        }));

        return {
            type: 'solidity',
            name: options.name || 'Smart Contract Suite',
            contracts: contractData,
            totalContracts: contractData.length,
            imports: [...new Set(contractData.flatMap(c => c.imports))],
            versions: [...new Set(contractData.map(c => c.version))],
            hasSecurityFeatures: contractData.some(c => c.hasRequire || c.hasAssert),
            hasAccessControl: contractData.some(c => c.hasOnlyOwner || c.hasModifier),
            hasEvents: contractData.some(c => c.hasEmit),
            hasAbstractContracts: contractData.some(c => c.isAbstract),
            hasConstructors: contractData.some(c => c.hasConstructor),
            deploymentReady: true,
            averageSecurityScore: contractData.reduce((sum, c) => {
                let score = 50;
                if (c.hasRequire) score += 15;
                if (c.hasAssert) score += 10;
                if (c.hasOnlyOwner) score += 10;
                if (c.hasModifier) score += 10;
                if (c.hasEmit) score += 5;
                return sum + score;
            }, 0) / (contractData.length || 1),
            deploymentInfo: {
                network: options.network || 'mainnet',
                gasLimit: options.gasLimit || 3000000,
                estimatedCost: (0.01 + (contractData.reduce((sum, c) => sum + (c.functions?.length || 0), 0) * 0.001)).toFixed(4)
            }
        };
    }

    async integrateBlockchain(files, options = {}) {
        const result = await this.integrateSolidity(files, options);
        result.type = 'blockchain';
        result.hasTokens = this.detectPattern(files, 'token');
        result.hasNFTs = this.detectPattern(files, 'nft');
        result.hasDeFi = this.detectPattern(files, 'defi');
        result.hasWeb3 = this.detectPattern(files, 'web3');
        result.hasIPFS = files.some(f => f.content?.includes('ipfs'));
        result.hasOracles = files.some(f => f.content?.includes('oracle') || f.content?.includes('chainlink'));
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
            hasSmartContracts: solidityResult.totalContracts > 0,
            deploymentReady: true,
            network: options.network || 'mainnet'
        };
    }

    async integrateNFT(files, options = {}) {
        const result = await this.integrateSolidity(files, options);
        result.type = 'nft';
        result.hasNFTStandard = this.detectPattern(files, 'nft');
        result.hasMetadata = files.some(f => f.content?.includes('metadata') || f.content?.includes('tokenURI'));
        result.hasRoyalties = files.some(f => f.content?.includes('royalty') || f.content?.includes('fee'));
        result.hasMinting = files.some(f => f.content?.includes('mint'));
        result.hasBurning = files.some(f => f.content?.includes('burn'));
        result.hasIPFS = files.some(f => f.content?.includes('ipfs'));
        return result;
    }

    async integrateDeFi(files, options = {}) {
        const result = await this.integrateSolidity(files, options);
        result.type = 'defi';
        result.hasLending = this.detectPattern(files, 'lending');
        result.hasStaking = this.detectPattern(files, 'staking');
        result.hasLiquidity = this.detectPattern(files, 'liquidity');
        result.hasYieldFarming = this.detectPattern(files, 'yield');
        result.hasFlashLoans = files.some(f => f.content?.includes('flashloan'));
        result.hasGovernance = files.some(f => f.content?.includes('governance') || f.content?.includes('proposal'));
        return result;
    }

    // ----- Data & AI -----

    async integrateDatabase(files, options = {}) {
        const sqlFiles = files.filter(f => this.isType(f, 'sql'));
        const jsonFiles = files.filter(f => this.isType(f, 'json'));

        return {
            type: 'database',
            name: options.name || 'Database Schema',
            sql: sqlFiles.length,
            json: jsonFiles.length,
            totalFiles: files.length,
            hasMigrations: this.detectPattern(files, 'migration'),
            hasSeeds: this.detectPattern(files, 'seed'),
            hasBackups: this.detectPattern(files, 'backup'),
            hasRelationships: files.some(f => f.content?.includes('FOREIGN KEY') || f.content?.includes('relationship')),
            hasIndexes: files.some(f => f.content?.includes('CREATE INDEX') || f.content?.includes('INDEX')),
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
            hasInference: files.some(f => f.content?.includes('infer') || f.content?.includes('predict')),
            hasEvaluation: files.some(f => f.content?.includes('eval') || f.content?.includes('metric')),
            hasDataPreprocessing: files.some(f => f.content?.includes('preprocess') || f.content?.includes('clean')),
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
        result.hasEmbeddings = this.detectPattern(files, 'embedding');
        result.hasReinforcement = files.some(f => f.content?.includes('reinforcement') || f.content?.includes('RL'));
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
            hasDashboards: this.detectPattern(files, 'dashboard'),
            hasReports: this.detectPattern(files, 'report'),
            hasVisualizations: this.detectPattern(files, 'visualization'),
            hasETL: files.some(f => f.content?.includes('ETL') || f.content?.includes('extract') || f.content?.includes('transform')),
            hasRealTime: files.some(f => f.content?.includes('stream') || f.content?.includes('real-time'))
        };
    }

    async integrateBigData(files, options = {}) {
        const result = await this.integrateAnalytics(files, options);
        result.type = 'bigdata';
        result.hasSpark = files.some(f => f.content?.includes('spark'));
        result.hasHadoop = files.some(f => f.content?.includes('hadoop'));
        result.hasKafka = this.detectPattern(files, 'queue');
        result.hasDatabricks = files.some(f => f.content?.includes('databricks'));
        result.dataVolume = files.reduce((sum, f) => sum + (f.size || 0), 0);
        result.hasPartitioning = files.some(f => f.content?.includes('partition'));
        return result;
    }

    // ----- Desktop & Mobile -----

    async integrateDesktop(files, options = {}) {
        const htmlFiles = files.filter(f => this.isType(f, 'html'));
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const cssFiles = files.filter(f => this.isType(f, 'css'));

        return {
            type: 'desktop',
            name: options.name || 'Desktop Application',
            entry: files.find(f => f.name.includes('main') || f.name.includes('index'))?.name || 'index.html',
            files: {
                html: htmlFiles.length,
                js: jsFiles.length,
                css: cssFiles.length,
                total: files.length
            },
            hasNativeIntegration: this.detectPattern(files, 'native'),
            hasFileSystem: this.detectPattern(files, 'fs'),
            hasSystemTray: files.some(f => f.content?.includes('tray') || f.content?.includes('systemTray')),
            hasNotifications: this.detectPattern(files, 'notification'),
            platform: options.platform || 'cross-platform',
            framework: this.detectDesktopFramework(files)
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
            hasPushNotifications: this.detectPattern(files, 'notification'),
            hasOfflineSupport: this.detectPattern(files, 'offline'),
            hasDeepLinking: files.some(f => f.content?.includes('deep') || f.content?.includes('linking')),
            hasBiometrics: files.some(f => f.content?.includes('biometric') || f.content?.includes('fingerprint'))
        };
    }

    async integrateElectron(files, options = {}) {
        const result = await this.integrateDesktop(files, options);
        result.type = 'electron';
        result.mainProcess = files.find(f => f.name.includes('main') && f.name.includes('electron'))?.name;
        result.rendererProcess = files.find(f => f.name.includes('renderer') && f.name.includes('electron'))?.name;
        result.hasNativeModules = this.detectPattern(files, 'native');
        result.hasAutoUpdater = this.detectPattern(files, 'autoupdater');
        result.hasIPC = files.some(f => f.content?.includes('ipc') || f.content?.includes('on('));
        result.hasTray = files.some(f => f.content?.includes('tray'));
        return result;
    }

    async integrateReactNative(files, options = {}) {
        const result = await this.integrateMobile(files, options);
        result.type = 'react-native';
        result.hasExpo = files.some(f => f.content?.includes('expo') || f.name.includes('expo'));
        result.hasNativeModules = this.detectPattern(files, 'native');
        result.hasNavigation = this.detectPattern(files, 'navigation');
        result.hasAnimations = files.some(f => f.content?.includes('animated') || f.content?.includes('Animated'));
        result.hasHermes = files.some(f => f.content?.includes('hermes'));
        return result;
    }

    // ----- Development & Tools -----

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
            dependencies: this.findDependencies(files),
            hasCLI: this.detectPattern(files, 'cli'),
            hasConfig: files.some(f => f.name.includes('config') || f.name.includes('settings'))
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
            hasHooks: this.detectPattern(files, 'hook'),
            hasEvents: files.some(f => f.content?.includes('event') || f.content?.includes('on('))
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
            hasTests: this.detectPattern(files, 'test'),
            hasDocs: this.detectPattern(files, 'docs'),
            hasTypes: files.some(f => f.name.includes('.d.ts') || f.name.includes('.d.ts.map'))
        };
    }

    async integrateCLI(files, options = {}) {
        const result = await this.integrateTool(files, options);
        result.type = 'cli';
        result.hasHelp = this.detectPattern(files, 'help');
        result.hasVersion = this.detectPattern(files, 'version');
        result.hasCommands = files.some(f => f.content?.includes('command') || f.content?.includes('Command'));
        result.hasFlags = files.some(f => f.content?.includes('flag') || f.content?.includes('option'));
        return result;
    }

    // ----- Other -----

    async integrateGame(files, options = {}) {
        const jsFiles = files.filter(f => this.isType(f, 'js'));
        const htmlFiles = files.filter(f => this.isType(f, 'html'));
        const imageFiles = files.filter(f => this.isType(f, 'image'));
        const audioFiles = files.filter(f => this.isType(f, 'audio'));

        return {
            type: 'game',
            name: options.name || 'Game',
            entry: htmlFiles[0]?.name || jsFiles[0]?.name || 'index.html',
            files: {
                js: jsFiles.length,
                html: htmlFiles.length,
                images: imageFiles.length,
                audio: audioFiles.length,
                total: files.length
            },
            hasPhysics: this.detectPattern(files, 'physics'),
            hasGameAI: this.detectPattern(files, 'ai'),
            hasAudio: audioFiles.length > 0,
            hasGraphics: imageFiles.length > 0,
            hasLevels: files.some(f => f.content?.includes('level') || f.content?.includes('scene')),
            engine: this.detectGameEngine(files),
            genre: this.detectGameGenre(files)
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
            hasCloud: files.some(f => f.content?.includes('cloud') || f.content?.includes('aws') || f.content?.includes('azure')),
            deviceType: this.detectDeviceType(files),
            hasRealTime: files.some(f => f.content?.includes('real-time') || f.content?.includes('RTOS'))
        };
    }

    async integrateDefault(files, options = {}) {
        return {
            type: 'default',
            name: options.name || 'General Integration',
            files: files.map(f => f.name),
            types: [...new Set(files.map(f => f.extension || 'unknown'))],
            size: files.reduce((sum, f) => sum + (f.size || 0), 0),
            count: files.length,
            extensions: [...new Set(files.map(f => f.extension || 'unknown'))]
        };
    }

    // ==========================================
    // TYPE DETECTION ENGINE
    // ==========================================

    detectIntegrationType(files) {
        const types = files.map(f => f.extension || 'unknown');
        const names = files.map(f => f.name);
        const contents = files.filter(f => f.content && typeof f.content === 'string').map(f => f.content);

        // Blockchain / Smart Contracts
        if (types.some(t => t === 'sol' || t === 'vyper')) return 'solidity';
        if (names.some(n => n.includes('DApp') || n.includes('dapp') || n.includes('web3'))) return 'dapp';
        if (names.some(n => n.includes('NFT') || n.includes('nft'))) return 'nft';
        if (names.some(n => n.includes('DeFi') || n.includes('defi') || n.includes('lending') || n.includes('borrow'))) return 'defi';
        if (names.some(n => n.includes('blockchain') || n.includes('ethereum') || n.includes('web3'))) return 'blockchain';

        // Web / Frontend
        if (types.some(t => t === 'html') && types.some(t => t === 'js')) {
            if (names.some(n => n.includes('manifest.json') || n.includes('service-worker'))) return 'pwa';
            if (names.some(n => n.includes('server') || n.includes('ssr') || contents.some(c => c.includes('renderToString')))) return 'ssr';
            if (names.some(n => n.includes('spa') || n.includes('router') || contents.some(c => c.includes('BrowserRouter')))) return 'spa';
            return 'app';
        }
        if (types.some(t => t === 'html') && types.some(t => t === 'css')) {
            if (types.every(t => t === 'html' || t === 'css' || t === 'png' || t === 'jpg' || t === 'svg' || t === 'js')) return 'static';
            return 'web';
        }

        // Service / API
        if (types.some(t => t === 'js') && types.some(t => t === 'json')) {
            if (names.some(n => n.includes('graphql') || n.includes('schema') || contents.some(c => c.includes('graphql')))) return 'graphql';
            if (names.some(n => n.includes('microservice') || n.includes('service'))) return 'microservice';
            if (names.some(n => n.includes('api') || n.includes('endpoint'))) return 'api';
            if (names.some(n => n.includes('socket') || n.includes('ws') || contents.some(c => c.includes('websocket')))) return 'websocket';
            return 'service';
        }

        // Data & AI
        if (types.some(t => t === 'py' || t === 'python')) {
            if (names.some(n => n.includes('model') || n.includes('train') || contents.some(c => c.includes('tensorflow') || c.includes('pytorch')))) return 'ml';
            if (names.some(n => n.includes('ai') || n.includes('agent') || n.includes('llm') || n.includes('rag') || contents.some(c => c.includes('openai') || c.includes('claude')))) return 'ai';
            if (names.some(n => n.includes('analytics') || n.includes('dashboard') || n.includes('report'))) return 'analytics';
            if (names.some(n => n.includes('spark') || n.includes('hadoop') || n.includes('big'))) return 'bigdata';
            return 'tool';
        }
        if (types.some(t => t === 'sql' || t === 'sqlite' || t === 'db' || t === 'db3')) return 'database';

        // Desktop & Mobile
        if (names.some(n => n.includes('electron')) || contents.some(c => c.includes('electron'))) return 'electron';
        if (names.some(n => n.includes('react-native') || n.includes('expo')) || contents.some(c => c.includes('react-native'))) return 'react-native';
        if (names.some(n => n.includes('mobile') || n.includes('android') || n.includes('ios'))) return 'mobile';
        if (names.some(n => n.includes('desktop'))) return 'desktop';

        // Other
        if (names.some(n => n.includes('cli') || n.includes('command'))) return 'cli';
        if (names.some(n => n.includes('game') || n.includes('player') || n.includes('engine'))) return 'game';
        if (names.some(n => n.includes('iot') || n.includes('sensor') || n.includes('device'))) return 'iot';
        if (names.some(n => n.includes('plugin') || n.includes('extension'))) return 'plugin';
        if (names.some(n => n.includes('lib') || n.includes('library') || n.includes('module'))) return 'library';

        return 'default';
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    isType(file, type) {
        const ext = file.extension || '';
        const analysisType = file.analysis?.type || '';
        const fileType = file.type || '';

        const typeMap = this.typeMap[type] || [];
        return typeMap.includes(ext) || typeMap.includes(analysisType) || typeMap.includes(fileType);
    }

    detectPattern(files, pattern) {
        const regex = this.patterns[pattern];
        if (!regex) return false;

        for (const file of files) {
            if (file.content && typeof file.content === 'string') {
                if (regex.test(file.content)) return true;
            }
        }
        return false;
    }

    // ==========================================
    // ANALYSIS METHODS
    // ==========================================

    validateFiles(files) {
        const errors = [];
        const warnings = [];

        for (const file of files) {
            if (!file.name) errors.push('File missing name');
            if (!file.content && !file.size) errors.push(`File ${file.name || 'unknown'} has no content`);
            if (file.size > 50 * 1024 * 1024) {
                warnings.push(`File ${file.name} is very large (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
            }
            if (file.name && file.name.length > 255) {
                warnings.push(`File ${file.name} has a very long name (${file.name.length} chars)`);
            }
        }

        return { success: errors.length === 0, errors, warnings };
    }

    analyzeStructure(files) {
        const structure = {
            totalFiles: files.length,
            directories: new Set(),
            extensions: new Set(),
            depth: 0
        };

        for (const file of files) {
            const path = file.path || file.name;
            const parts = path.split('/');
            structure.depth = Math.max(structure.depth, parts.length - 1);
            if (parts.length > 1) {
                structure.directories.add(parts.slice(0, -1).join('/'));
            }
            structure.extensions.add(file.extension || 'unknown');
        }

        return {
            totalFiles: structure.totalFiles,
            directories: structure.directories.size,
            depth: structure.depth,
            extensions: Array.from(structure.extensions),
            hasNestedStructure: structure.depth > 1
        };
    }

    analyzeDependencies(files) {
        const dependencies = this.findDependencies(files);
        return {
            total: dependencies.length,
            dependencies: dependencies,
            duplicates: dependencies.filter((d, i) => dependencies.indexOf(d) !== i),
            unique: [...new Set(dependencies)]
        };
    }

    calculateComplexity(files) {
        let totalLines = 0;
        let totalFunctions = 0;
        let totalClasses = 0;
        let totalImports = 0;

        for (const file of files) {
            if (file.content && typeof file.content === 'string') {
                const content = file.content;
                totalLines += content.split('\n').length;
                totalFunctions += (content.match(/function\s+[a-zA-Z_]/g) || []).length;
                totalClasses += (content.match(/class\s+[a-zA-Z_]/g) || []).length;
                totalImports += (content.match(/import\s+|require\s*\(/g) || []).length;
            }
        }

        const score = (totalLines / 100) + (totalFunctions * 2) + (totalClasses * 3) + (totalImports * 0.5);
        const level = score < 50 ? 'simple' : score < 100 ? 'medium' : score < 200 ? 'complex' : 'very-complex';

        return {
            level: level,
            score: Math.round(score),
            lines: totalLines,
            functions: totalFunctions,
            classes: totalClasses,
            imports: totalImports
        };
    }

    scanForSecurity(files) {
        const vulnerabilities = [];
        const patterns = [
            { pattern: /password|passwd|pwd/i, severity: 'high', type: 'Credential' },
            { pattern: /api[_-]?key|apikey|token|secret/i, severity: 'high', type: 'API Key' },
            { pattern: /private[_-]?key/i, severity: 'critical', type: 'Private Key' },
            { pattern: /eval\s*\(/i, severity: 'medium', type: 'Eval Usage' },
            { pattern: /innerHTML\s*=/i, severity: 'medium', type: 'XSS Risk' },
            { pattern: /document\.write/i, severity: 'medium', type: 'XSS Risk' },
            { pattern: /SQL\s+(?:INSERT|UPDATE|DELETE|SELECT)/i, severity: 'medium', type: 'SQL Injection Risk' }
        ];

        for (const file of files) {
            if (file.content && typeof file.content === 'string') {
                for (const check of patterns) {
                    if (check.pattern.test(file.content)) {
                        vulnerabilities.push({
                            type: check.type,
                            severity: check.severity,
                            file: file.name,
                            description: `Potential ${check.type} found in ${file.name}`,
                            recommendation: `Review and remove ${check.type} if not needed`
                        });
                    }
                }
            }
        }

        const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
        const highCount = vulnerabilities.filter(v => v.severity === 'high').length;

        return {
            vulnerabilities,
            total: vulnerabilities.length,
            critical: criticalCount,
            high: highCount,
            hasIssues: vulnerabilities.length > 0,
            score: Math.max(0, 100 - (criticalCount * 20) - (highCount * 10))
        };
    }

    analyzePerformance(files) {
        const suggestions = [];
        const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);

        for (const file of files) {
            if (file.size > 1000000) {
                suggestions.push({
                    file: file.name,
                    issue: 'Large file size',
                    suggestion: 'Consider splitting into smaller modules',
                    benefit: 'Reduced load time'
                });
            }

            if (file.content && typeof file.content === 'string') {
                const lines = file.content.split('\n').length;
                if (lines > 500) {
                    suggestions.push({
                        file: file.name,
                        issue: 'Large JavaScript file',
                        suggestion: 'Consider code splitting and lazy loading',
                        benefit: 'Better performance and faster initial load'
                    });
                }

                if (file.content.includes('console.log')) {
                    suggestions.push({
                        file: file.name,
                        issue: 'Console.log statements found',
                        suggestion: 'Remove console.log in production code',
                        benefit: 'Better performance'
                    });
                }
            }
        }

        return {
            suggestions: suggestions,
            totalSize: totalSize,
            averageSize: files.reduce((sum, f) => sum + (f.size || 0), 0) / files.length,
            hasIssues: suggestions.length > 0,
            score: Math.max(0, 100 - (suggestions.length * 5))
        };
    }

    // ==========================================
    // EXTRACTION METHODS
    // ==========================================

    findDependencies(files) {
        const deps = [];
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;

            const requires = file.content.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g) || [];
            const imports = file.content.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/g) || [];

            for (const r of requires) {
                const match = r.match(/['"]([^'"]+)['"]/);
                if (match && !match[1].startsWith('.')) deps.push(match[1]);
            }
            for (const i of imports) {
                const match = i.match(/['"]([^'"]+)['"]/);
                if (match && !match[1].startsWith('.')) deps.push(match[1]);
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
                if (name && !name.startsWith('default')) exports.push(name);
            }
        }
        return exports;
    }

    extractComponents(files) {
        const components = [];
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const matches = file.content.match(/class\s+([A-Z][a-zA-Z]*)/g) || [];
            const functionMatches = file.content.match(/function\s+([A-Z][a-zA-Z]*)/g) || [];
            const arrowMatches = file.content.match(/const\s+([A-Z][a-zA-Z]*)\s*=/g) || [];

            for (const match of [...matches, ...functionMatches, ...arrowMatches]) {
                const name = match.replace(/class\s+/, '').replace(/function\s+/, '').replace(/const\s+/, '').replace(/\s*=$/, '');
                if (name && !components.includes(name) && name.length > 0) {
                    components.push(name);
                }
            }
        }
        return components;
    }

    extractFunctions(content) {
        if (!content) return [];
        const functions = [];
        const matches = content.match(/function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g) || [];
        for (const match of matches) {
            const name = match.replace(/function\s+/, '').replace(/\s*\(/, '');
            if (name) functions.push(name);
        }
        return functions;
    }

    extractEvents(content) {
        if (!content) return [];
        const events = [];
        const matches = content.match(/event\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g) || [];
        for (const match of matches) {
            const name = match.replace(/event\s+/, '').replace(/\s*\(/, '');
            if (name) events.push(name);
        }
        return events;
    }

    extractImports(content) {
        if (!content) return [];
        const imports = [];
        const matches = content.match(/import\s+['"]([^'"]+)['"]/g) || [];
        for (const match of matches) {
            const path = match.replace(/import\s+/, '').replace(/['"]/g, '');
            if (path) imports.push(path);
        }
        return imports;
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
                const dotenvMatch = file.content.match(/PORT['"]?\s*[:=]\s*['"]?(\d+)['"]?/);
                if (dotenvMatch) return parseInt(dotenvMatch[1]);
            }
        }
        return null;
    }

    // ==========================================
    // DETECTION HELPERS
    // ==========================================

    detectFramework(files) {
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const content = file.content;
            if (content.includes('react') || content.includes('React')) return 'react';
            if (content.includes('vue') || content.includes('Vue')) return 'vue';
            if (content.includes('angular') || content.includes('Angular')) return 'angular';
            if (content.includes('svelte') || content.includes('Svelte')) return 'svelte';
            if (content.includes('next') || content.includes('Next')) return 'nextjs';
            if (content.includes('nuxt') || content.includes('Nuxt')) return 'nuxt';
        }
        return 'unknown';
    }

    detectBackendFramework(files) {
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const content = file.content;
            if (content.includes('express')) return 'express';
            if (content.includes('koa')) return 'koa';
            if (content.includes('fastify')) return 'fastify';
            if (content.includes('nestjs') || content.includes('NestJS')) return 'nestjs';
            if (content.includes('django')) return 'django';
            if (content.includes('flask')) return 'flask';
            if (content.includes('fastapi')) return 'fastapi';
            if (content.includes('spring')) return 'spring';
        }
        return 'unknown';
    }

    detectDesktopFramework(files) {
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const content = file.content;
            if (content.includes('electron')) return 'electron';
            if (content.includes('tauri')) return 'tauri';
            if (content.includes('nwjs')) return 'nwjs';
            if (content.includes('qt')) return 'qt';
        }
        return 'unknown';
    }

    detectDatabaseType(files) {
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const content = file.content;
            if (content.includes('postgres') || content.includes('PostgreSQL')) return 'postgresql';
            if (content.includes('mysql') || content.includes('MySQL')) return 'mysql';
            if (content.includes('mongodb') || content.includes('MongoDB')) return 'mongodb';
            if (content.includes('sqlite') || content.includes('SQLite')) return 'sqlite';
            if (content.includes('redis') || content.includes('Redis')) return 'redis';
        }
        return 'unknown';
    }

    detectMLFramework(files) {
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const content = file.content;
            if (content.includes('tensorflow') || content.includes('tf.')) return 'tensorflow';
            if (content.includes('pytorch') || content.includes('torch.')) return 'pytorch';
            if (content.includes('sklearn') || content.includes('scikit')) return 'scikit-learn';
            if (content.includes('keras')) return 'keras';
            if (content.includes('jax')) return 'jax';
            if (content.includes('mxnet')) return 'mxnet';
        }
        return 'unknown';
    }

    detectMobilePlatform(files) {
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const content = file.content;
            if (content.includes('android') || content.includes('java')) return 'android';
            if (content.includes('ios') || content.includes('swift') || content.includes('objective-c')) return 'ios';
            if (content.includes('expo')) return 'expo';
            if (content.includes('flutter')) return 'flutter';
            if (content.includes('xamarin')) return 'xamarin';
            if (content.includes('cordova') || content.includes('phonegap')) return 'cordova';
            if (content.includes('react-native')) return 'react-native';
        }
        return 'react-native';
    }

    detectGameEngine(files) {
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const content = file.content;
            if (content.includes('phaser')) return 'phaser';
            if (content.includes('pixi')) return 'pixi.js';
            if (content.includes('three')) return 'three.js';
            if (content.includes('babylon')) return 'babylon.js';
            if (content.includes('unity')) return 'unity';
            if (content.includes('godot')) return 'godot';
            if (content.includes('unreal') || content.includes('ue4') || content.includes('ue5')) return 'unreal';
        }
        return 'custom';
    }

    detectGameGenre(files) {
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const content = file.content;
            if (content.includes('platformer') || content.includes('platform')) return 'platformer';
            if (content.includes('rpg') || content.includes('role-playing')) return 'rpg';
            if (content.includes('puzzle')) return 'puzzle';
            if (content.includes('shooter') || content.includes('fps')) return 'shooter';
            if (content.includes('strategy') || content.includes('rts')) return 'strategy';
            if (content.includes('adventure')) return 'adventure';
        }
        return 'unknown';
    }

    detectDeviceType(files) {
        for (const file of files) {
            if (!file.content || typeof file.content !== 'string') continue;
            const content = file.content;
            if (content.includes('arduino')) return 'arduino';
            if (content.includes('esp8266')) return 'esp8266';
            if (content.includes('esp32')) return 'esp32';
            if (content.includes('raspberry') || content.includes('pi')) return 'raspberrypi';
            if (content.includes('stm32')) return 'stm32';
            if (content.includes('teensy')) return 'teensy';
            if (content.includes('particle')) return 'particle';
        }
        return 'generic';
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

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
            'websocket': 'WebSocket Server',
            'solidity': 'Smart Contract Suite',
            'blockchain': 'Blockchain Project',
            'dapp': 'Decentralized App',
            'nft': 'NFT Project',
            'defi': 'DeFi Protocol',
            'database': 'Database Schema',
            'ml': 'Machine Learning Model',
            'ai': 'AI System',
            'analytics': 'Analytics Dashboard',
            'bigdata': 'Big Data Pipeline',
            'desktop': 'Desktop Application',
            'mobile': 'Mobile Application',
            'electron': 'Electron App',
            'react-native': 'React Native App',
            'tool': 'Development Tool',
            'plugin': 'Plugin',
            'library': 'Library',
            'cli': 'CLI Tool',
            'game': 'Game',
            'iot': 'IoT Project',
            'default': 'Integration'
        };
        return names[type] || 'Integration';
    }

    generateId() {
        this.idCounter++;
        return 'int_' + Date.now() + '_' + this.idCounter + '_' + Math.random().toString(36).substr(2, 4);
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
            if (now - value.timestamp > this.config.cacheTTL) {
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
        if (integration.security?.hasIssues) {
            warnings.push(`${integration.security.total} security issues found`);
        }
        if (integration.performance?.hasIssues) {
            warnings.push(`${integration.performance.suggestions.length} performance suggestions`);
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
            successRate: (this.integrations.filter(i => i.status === 'completed').length / this.integrations.length) * 100,
            totalSize: this.integrations.reduce((sum, i) => sum + (i.metadata?.totalSize || 0), 0)
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
        this.integrationHistory = [];
        this.log(`🧹 Cleared ${count} integrations`);
        return count;
    }

    reset() {
        const count = this.clearIntegrations();
        this.queue = [];
        this.processing = false;
        this.idCounter = 0;
        return count;
    }

    // ==========================================
    // EXPORT / IMPORT
    // ==========================================

    exportIntegrations(format = 'json') {
        const data = {
            version: '4.0.0',
            exportedAt: new Date().toISOString(),
            total: this.integrations.length,
            integrations: this.integrations,
            stats: this.getIntegrationStats()
        };

        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            let csv = 'id,type,files,status,duration,timestamp,name\n';
            for (const integration of this.integrations) {
                csv += `${integration.id},${integration.type},${integration.files},${integration.status},${integration.duration},${integration.timestamp},"${integration.name}"\n`;
            }
            return csv;
        } else if (format === 'xml') {
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<integrations>\n';
            for (const integration of this.integrations) {
                xml += `  <integration id="${integration.id}" type="${integration.type}" status="${integration.status}">\n`;
                xml += `    <name>${integration.name}</name>\n`;
                xml += `    <files>${integration.files}</files>\n`;
                xml += `    <duration>${integration.duration}</duration>\n`;
                xml += `    <timestamp>${integration.timestamp}</timestamp>\n`;
                xml += `  </integration>\n`;
            }
            xml += '</integrations>';
            return xml;
        }

        return JSON.stringify(data, null, 2);
    }

    importIntegrations(data) {
        try {
            let parsed;
            if (typeof data === 'string') {
                parsed = JSON.parse(data);
            } else {
                parsed = data;
            }

            const integrations = parsed.integrations || parsed;
            if (!Array.isArray(integrations)) {
                return { success: false, error: 'Invalid data format: expected array of integrations' };
            }

            let imported = 0;
            for (const integration of integrations) {
                if (!integration.id) {
                    integration.id = this.generateId();
                }
                if (!integration.timestamp) {
                    integration.timestamp = new Date().toISOString();
                }
                if (!integration.status) {
                    integration.status = 'imported';
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
    // SEARCH & FILTER
    // ==========================================

    searchIntegrations(query) {
        const lowerQuery = query.toLowerCase();
        return this.integrations.filter(integration =>
            integration.name?.toLowerCase().includes(lowerQuery) ||
            integration.type?.toLowerCase().includes(lowerQuery) ||
            integration.id?.toLowerCase().includes(lowerQuery) ||
            integration.fileList?.some(f => f.toLowerCase().includes(lowerQuery))
        );
    }

    filterIntegrations(criteria = {}) {
        return this.integrations.filter(integration => {
            let match = true;

            if (criteria.type && integration.type !== criteria.type) match = false;
            if (criteria.status && integration.status !== criteria.status) match = false;
            if (criteria.minFiles !== undefined && integration.files < criteria.minFiles) match = false;
            if (criteria.maxFiles !== undefined && integration.files > criteria.maxFiles) match = false;
            if (criteria.dateAfter && new Date(integration.timestamp) < new Date(criteria.dateAfter)) match = false;
            if (criteria.dateBefore && new Date(integration.timestamp) > new Date(criteria.dateBefore)) match = false;
            if (criteria.hasWarnings !== undefined) {
                const hasWarnings = integration.warnings && integration.warnings.length > 0;
                if (criteria.hasWarnings && !hasWarnings) match = false;
                if (!criteria.hasWarnings && hasWarnings) match = false;
            }
            if (criteria.hasSecurityIssues !== undefined) {
                const hasIssues = integration.security?.hasIssues || false;
                if (criteria.hasSecurityIssues && !hasIssues) match = false;
                if (!criteria.hasSecurityIssues && hasIssues) match = false;
            }

            return match;
        });
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
}
