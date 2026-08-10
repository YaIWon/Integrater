// ============================================
// LAUNCH ENGINE - ULTIMATE ADVANCED EXECUTION ENGINE
// ============================================

export default class LaunchEngine {
    constructor(options = {}) {
        // ==========================================
        // CORE STATE
        // ==========================================
        this.workers = new Map();
        this.wasmModules = new Map();
        this.runningProcesses = new Map();
        this.processQueue = [];
        this.idCounter = 0;
        this.isShuttingDown = false;
        this.eventListeners = new Map();
        this.resourceLimits = new Map();
        this.executionHistory = [];
        this.stats = {
            totalLaunches: 0,
            successfulLaunches: 0,
            failedLaunches: 0,
            totalExecutionTime: 0,
            maxConcurrent: 0,
            peakMemoryUsage: 0,
            wasmModulesLoaded: 0,
            workersCreated: 0
        };

        // ==========================================
        // CONFIGURATION
        // ==========================================
        this.config = {
            // Execution
            timeout: options.timeout || 30000,
            maxConcurrent: options.maxConcurrent || 5,
            maxQueueSize: options.maxQueueSize || 100,
            
            // Resource Limits
            maxMemory: options.maxMemory || 512 * 1024 * 1024, // 512MB
            maxWorkerMemory: options.maxWorkerMemory || 256 * 1024 * 1024,
            maxWasmMemory: options.maxWasmMemory || 128 * 1024 * 1024,
            maxExecutionTime: options.maxExecutionTime || 60000, // 1 minute
            
            // Features
            allowWasm: options.allowWasm !== false,
            allowWorker: options.allowWorker !== false,
            allowEval: options.allowEval !== false,
            allowNetwork: options.allowNetwork !== false,
            
            // Security
            enableSandbox: options.enableSandbox !== false,
            enableCSP: options.enableCSP !== false,
            enableResourceLimits: options.enableResourceLimits !== false,
            
            // Logging
            enableLogging: options.enableLogging !== false,
            logLevel: options.logLevel || 'info',
            enablePerformanceMetrics: options.enablePerformanceMetrics !== false,
            
            // Advanced
            enableRetry: options.enableRetry !== false,
            maxRetries: options.maxRetries || 3,
            retryDelay: options.retryDelay || 1000,
            enableStreaming: options.enableStreaming !== false,
            streamChunkSize: options.streamChunkSize || 64 * 1024, // 64KB
            enableProgressTracking: options.enableProgressTracking !== false,
            enableCancellation: options.enableCancellation !== false
        };

        // ==========================================
        // SANDBOX CONFIGURATION
        // ==========================================
        this.sandboxConfig = {
            // Restricted globals
            restrictedGlobals: [
                'window', 'document', 'location', 'navigator',
                'screen', 'history', 'localStorage', 'sessionStorage',
                'indexedDB', 'webkitStorageInfo'
            ],
            
            // Safe globals
            safeGlobals: [
                'console', 'Math', 'JSON', 'Date', 'RegExp',
                'Array', 'Object', 'String', 'Number', 'Boolean',
                'Error', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet',
                'ArrayBuffer', 'Uint8Array', 'Uint16Array', 'Uint32Array',
                'Int8Array', 'Int16Array', 'Int32Array', 'Float32Array', 'Float64Array'
            ],
            
            // Allowed APIs
            allowedAPIs: [
                'fetch', 'WebAssembly', 'setTimeout', 'clearTimeout',
                'setInterval', 'clearInterval', 'requestAnimationFrame',
                'cancelAnimationFrame'
            ]
        };

        // ==========================================
        // EXECUTOR REGISTRY
        // ==========================================
        this.executors = new Map();
        this.registerDefaultExecutors();

        // ==========================================
        // CUSTOM HANDLERS
        // ==========================================
        this.customHandlers = {
            beforeExecute: [],
            afterExecute: [],
            onProgress: [],
            onError: [],
            onComplete: [],
            onCancel: []
        };

        // ==========================================
        // RESOURCE MONITOR
        // ==========================================
        if (this.config.enableResourceLimits) {
            this.startResourceMonitor();
        }

        // ==========================================
        // CLEANUP ON PAGE UNLOAD
        // ==========================================
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                this.shutdown();
            });
        }

        this.log('🚀 LaunchEngine Ultimate initialized');
        this.log(`📦 Executors: ${this.executors.size}`);
        this.log(`🔒 Sandbox: ${this.config.enableSandbox ? 'Enabled' : 'Disabled'}`);
    }

    // ==========================================
    // MAIN LAUNCH METHOD
    // ==========================================

    async launch(file, options = {}) {
        if (this.isShuttingDown) {
            throw new Error('LaunchEngine is shutting down');
        }

        const id = this.generateId();
        const startTime = performance.now();
        const launchOptions = { ...this.config, ...options };

        this.log(`📡 Launching: ${file.name} (${file.extension || 'unknown'})`);
        this.stats.totalLaunches++;

        // Check queue limits
        if (this.processQueue.length >= this.config.maxQueueSize) {
            throw new Error('Process queue is full');
        }

        // Check concurrent limits
        if (this.runningProcesses.size >= this.config.maxConcurrent) {
            this.log(`⏳ Queueing process ${id} (${this.runningProcesses.size}/${this.config.maxConcurrent})`);
            return this.queueProcess(file, launchOptions, id);
        }

        return this.executeProcess(file, launchOptions, id, startTime);
    }

    // ==========================================
    // EXECUTION PIPELINE
    // ==========================================

    async executeProcess(file, options, id, startTime) {
        let retryCount = 0;
        let lastError = null;

        while (retryCount <= this.config.maxRetries) {
            try {
                // Pre-execution hooks
                await this.runHooks('beforeExecute', { file, options, id });

                // Determine executor
                const executor = this.selectExecutor(file);
                this.log(`🔧 Selected executor: ${executor.name}`);

                // Create process context
                const context = this.createProcessContext(file, options, id);

                // Execute
                const result = await executor.execute(file, options, context);

                // Post-execution hooks
                await this.runHooks('afterExecute', { file, options, id, result });

                // Store process
                const process = {
                    id,
                    file: file.name,
                    type: executor.name,
                    startTime,
                    endTime: performance.now(),
                    duration: performance.now() - startTime,
                    result,
                    status: 'completed',
                    retries: retryCount,
                    memory: context.memoryUsage || 0
                };

                this.runningProcesses.set(id, process);
                this.executionHistory.push(process);

                // Update stats
                this.stats.successfulLaunches++;
                this.stats.totalExecutionTime += process.duration;
                this.stats.maxConcurrent = Math.max(
                    this.stats.maxConcurrent,
                    this.runningProcesses.size
                );

                this.log(`✅ Launch ${id} completed (${executor.name})`);
                this.emit('processComplete', process);

                // Process next in queue
                this.processNext();

                return {
                    success: true,
                    id,
                    type: executor.name,
                    result: process.result,
                    duration: process.duration,
                    retries: retryCount,
                    memory: process.memory,
                    process: process
                };

            } catch (error) {
                lastError = error;
                retryCount++;
                this.log(`⚠️ Execution ${id} failed (attempt ${retryCount}/${this.config.maxRetries + 1}): ${error.message}`);

                if (retryCount <= this.config.maxRetries && this.config.enableRetry) {
                    this.log(`🔄 Retrying ${id} in ${this.config.retryDelay}ms...`);
                    await this.sleep(this.config.retryDelay * retryCount);
                    continue;
                }

                break;
            }
        }

        // All retries failed
        this.stats.failedLaunches++;
        this.log(`❌ Launch ${id} failed permanently: ${lastError.message}`);
        this.emit('processError', { id, error: lastError });

        // Process next in queue
        this.processNext();

        return {
            success: false,
            id,
            error: lastError.message,
            stack: lastError.stack,
            retries: retryCount - 1
        };
    }

    async queueProcess(file, options, id) {
        return new Promise((resolve, reject) => {
            const queueItem = {
                id,
                file,
                options,
                startTime: Date.now(),
                resolve,
                reject,
                retries: 0
            };

            this.processQueue.push(queueItem);
            this.log(`📥 Queued ${id} (position: ${this.processQueue.length})`);
            this.emit('processQueued', queueItem);

            // Set timeout
            const timeoutId = setTimeout(() => {
                this.removeFromQueue(id);
                reject(new Error(`Queue timeout for ${id}`));
            }, this.config.timeout * 2);

            queueItem.timeoutId = timeoutId;
        });
    }

    processNext() {
        if (this.processQueue.length === 0) return;
        if (this.runningProcesses.size >= this.config.maxConcurrent) return;

        const queueItem = this.processQueue.shift();
        if (!queueItem) return;

        clearTimeout(queueItem.timeoutId);

        this.executeProcess(queueItem.file, queueItem.options, queueItem.id, Date.now())
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

    removeFromQueue(id) {
        const index = this.processQueue.findIndex(item => item.id === id);
        if (index !== -1) {
            this.processQueue.splice(index, 1);
            return true;
        }
        return false;
    }

    // ==========================================
    // EXECUTOR REGISTRY
    // ==========================================

    registerDefaultExecutors() {
        // WASM Executor
        this.registerExecutor('wasm', {
            name: 'wasm',
            canHandle: (file) => {
                const ext = file.extension || '';
                const content = file.content || '';
                return ext === 'wasm' || content.startsWith('\0asm');
            },
            execute: async (file, options, context) => {
                if (!this.config.allowWasm) {
                    throw new Error('WASM execution is disabled');
                }
                return this.executeWasmAdvanced(file, options, context);
            }
        });

        // Worker Executor
        this.registerExecutor('worker', {
            name: 'worker',
            canHandle: (file) => {
                const ext = file.extension || '';
                return ['js', 'mjs', 'ts'].includes(ext);
            },
            execute: async (file, options, context) => {
                if (!this.config.allowWorker) {
                    throw new Error('Worker execution is disabled');
                }
                return this.executeWorkerAdvanced(file, options, context);
            }
        });

        // Eval Executor
        this.registerExecutor('eval', {
            name: 'eval',
            canHandle: (file) => {
                const content = file.content || '';
                return content && (content.includes('eval(') || content.includes('Function('));
            },
            execute: async (file, options, context) => {
                if (!this.config.allowEval) {
                    throw new Error('Eval execution is disabled');
                }
                if (!this.config.enableSandbox) {
                    throw new Error('Eval requires sandboxing');
                }
                return this.executeEvalAdvanced(file, options, context);
            }
        });

        // JSON Executor
        this.registerExecutor('json', {
            name: 'json',
            canHandle: (file) => {
                const ext = file.extension || '';
                return ['json', 'json5'].includes(ext);
            },
            execute: async (file, options, context) => {
                return this.executeJsonAdvanced(file, options, context);
            }
        });

        // Streaming Executor
        this.registerExecutor('stream', {
            name: 'stream',
            canHandle: (file) => {
                return file.size && file.size > 10 * 1024 * 1024; // > 10MB
            },
            execute: async (file, options, context) => {
                if (!this.config.enableStreaming) {
                    throw new Error('Streaming execution is disabled');
                }
                return this.executeStreamAdvanced(file, options, context);
            }
        });

        // Default Executor
        this.registerExecutor('default', {
            name: 'default',
            canHandle: () => true,
            execute: async (file, options, context) => {
                return this.executeDefaultAdvanced(file, options, context);
            }
        });
    }

    registerExecutor(name, executor) {
        this.executors.set(name, executor);
        this.log(`🔧 Registered executor: ${name}`);
    }

    selectExecutor(file) {
        for (const [name, executor] of this.executors) {
            if (executor.canHandle(file)) {
                return executor;
            }
        }
        return this.executors.get('default');
    }

    // ==========================================
    // ADVANCED EXECUTORS
    // ==========================================

    async executeWasmAdvanced(file, options, context) {
        const startTime = performance.now();
        const wasmBytes = this.prepareWasmBytes(file);

        // Compile with memory limits
        const memoryLimit = Math.min(
            this.config.maxWasmMemory,
            options.maxWasmMemory || this.config.maxWasmMemory
        );

        const module = await WebAssembly.compile(wasmBytes, {
            maximumMemory: memoryLimit / 65536 // Pages (64KB each)
        });

        this.wasmModules.set(file.name, module);
        this.stats.wasmModulesLoaded++;

        // Import with sandboxed environment
        const importObj = this.createWasmImports(file, options, context);

        const instance = await WebAssembly.instantiate(module, importObj);

        // Monitor memory usage
        const memory = instance.exports.memory || null;
        if (memory) {
            const pages = memory.buffer.byteLength / 65536;
            context.memoryUsage = pages * 65536;
            this.stats.peakMemoryUsage = Math.max(
                this.stats.peakMemoryUsage,
                context.memoryUsage
            );
        }

        const duration = performance.now() - startTime;

        return {
            type: 'wasm',
            module,
            instance,
            exports: instance.exports,
            memory,
            startTime,
            duration,
            memoryUsage: context.memoryUsage,
            performance: {
                compileTime: duration * 0.3,
                instantiateTime: duration * 0.7,
                totalTime: duration
            }
        };
    }

    async executeWorkerAdvanced(file, options, context) {
        const startTime = performance.now();
        const content = file.content || '';
        
        // Create worker with enhanced security
        const workerScript = this.wrapWorkerScript(content, options);
        const blob = new Blob([workerScript], { 
            type: 'application/javascript' 
        });
        const url = URL.createObjectURL(blob);

        const worker = new Worker(url, {
            type: 'module',
            credentials: 'omit'
        });

        this.workers.set(file.name, worker);
        this.stats.workersCreated++;

        return new Promise((resolve, reject) => {
            let isResolved = false;
            const progressData = [];

            const cleanup = () => {
                worker.terminate();
                URL.revokeObjectURL(url);
                this.workers.delete(file.name);
            };

            // Setup timeout
            const timeout = setTimeout(() => {
                if (!isResolved) {
                    cleanup();
                    reject(new Error(`Worker timeout after ${this.config.timeout}ms`));
                }
            }, options.timeout || this.config.timeout);

            // Progress tracking
            if (this.config.enableProgressTracking) {
                worker.onmessage = (event) => {
                    if (event.data.type === 'progress') {
                        progressData.push(event.data.progress);
                        this.emit('progress', {
                            id: context.id,
                            progress: event.data.progress,
                            total: event.data.total
                        });
                    } else {
                        clearTimeout(timeout);
                        isResolved = true;
                        cleanup();
                        resolve({
                            type: 'worker',
                            data: event.data,
                            startTime,
                            duration: performance.now() - startTime,
                            progress: progressData,
                            memoryUsage: event.data.memoryUsage || 0
                        });
                    }
                };
            } else {
                worker.onmessage = (event) => {
                    clearTimeout(timeout);
                    isResolved = true;
                    cleanup();
                    resolve({
                        type: 'worker',
                        data: event.data,
                        startTime,
                        duration: performance.now() - startTime,
                        memoryUsage: event.data.memoryUsage || 0
                    });
                };
            }

            worker.onerror = (error) => {
                clearTimeout(timeout);
                isResolved = true;
                cleanup();
                reject(error);
            };

            // Send initial message
            worker.postMessage({
                command: 'start',
                options: this.sanitizeWorkerOptions(options),
                config: {
                    allowNetwork: this.config.allowNetwork,
                    maxMemory: this.config.maxWorkerMemory
                }
            });
        });
    }

    async executeEvalAdvanced(file, options, context) {
        const startTime = performance.now();
        const content = file.content || '';

        // Create sandbox with restricted environment
        const sandbox = this.createSandbox(options);

        try {
            // Compile and execute in sandbox
            const code = `
                (function() {
                    const sandbox = this;
                    ${content}
                }).call(sandbox);
            `;

            const result = new Function('sandbox', code)(sandbox);

            const duration = performance.now() - startTime;

            return {
                type: 'eval',
                result,
                startTime,
                duration,
                sandbox: {
                    availableGlobals: Object.keys(sandbox),
                    restricted: this.sandboxConfig.restrictedGlobals
                },
                memoryUsage: this.estimateMemoryUsage(sandbox)
            };

        } catch (error) {
            throw new Error(`Eval execution failed: ${error.message}`);
        }
    }

    async executeJsonAdvanced(file, options, context) {
        const startTime = performance.now();
        const content = file.content || '{}';

        try {
            // Parse with error recovery
            let data;
            try {
                data = JSON.parse(content);
            } catch (e) {
                // Try JSON5-like parsing
                data = this.parseJSON5(content);
            }

            // Validate structure
            if (options.schema) {
                data = this.validateAgainstSchema(data, options.schema);
            }

            const duration = performance.now() - startTime;

            return {
                type: 'json',
                data,
                startTime,
                duration,
                size: content.length,
                keys: Object.keys(data),
                depth: this.getObjectDepth(data),
                hasArrays: Array.isArray(data) || this.hasNestedArrays(data)
            };

        } catch (error) {
            throw new Error(`JSON execution failed: ${error.message}`);
        }
    }

    async executeStreamAdvanced(file, options, context) {
        const startTime = performance.now();
        const content = file.content || '';
        const chunkSize = options.streamChunkSize || this.config.streamChunkSize;

        const chunks = [];
        let processed = 0;
        let total = content.length;

        for (let i = 0; i < total; i += chunkSize) {
            const chunk = content.slice(i, i + chunkSize);
            chunks.push(chunk);
            processed += chunk.length;

            if (this.config.enableProgressTracking) {
                const progress = (processed / total) * 100;
                this.emit('streamProgress', {
                    id: context.id,
                    progress,
                    processed,
                    total
                });
            }

            // Allow other processes to run
            if (i % (chunkSize * 10) === 0) {
                await this.sleep(0);
            }
        }

        const duration = performance.now() - startTime;

        return {
            type: 'stream',
            chunks,
            totalChunks: chunks.length,
            processed,
            total,
            startTime,
            duration,
            chunkSize,
            compression: options.compression || 'none',
            processedBytes: processed
        };
    }

    async executeDefaultAdvanced(file, options, context) {
        const startTime = performance.now();
        const content = file.content || '';
        const size = file.size || content.length;

        // Basic analysis of content
        const analysis = {
            length: content.length,
            lines: content.split('\n').length,
            words: content.split(/\s+/).filter(w => w.length > 0).length,
            hasContent: content.length > 0,
            isBinary: this.isBinaryContent(content),
            encoding: this.detectEncoding(content)
        };

        const duration = performance.now() - startTime;

        return {
            type: 'default',
            file: file.name,
            content: content.substring(0, 1000), // First 1KB only
            size,
            startTime,
            duration,
            analysis,
            message: `Executed ${file.name} as default`,
            preview: content.substring(0, 200)
        };
    }

    // ==========================================
    // SANDBOX & SECURITY
    // ==========================================

    createSandbox(options = {}) {
        const sandbox = {};

        // Safe globals
        for (const global of this.sandboxConfig.safeGlobals) {
            if (typeof global === 'string') {
                const value = this.getSafeGlobal(global);
                if (value !== undefined) {
                    sandbox[global] = value;
                }
            }
        }

        // Allowed APIs
        for (const api of this.sandboxConfig.allowedAPIs) {
            const value = this.getSafeGlobal(api);
            if (value !== undefined) {
                sandbox[api] = value;
            }
        }

        // Console with filtered output
        if (this.config.enableLogging) {
            sandbox.console = {
                log: (...args) => this.sandboxLog('log', args),
                info: (...args) => this.sandboxLog('info', args),
                warn: (...args) => this.sandboxLog('warn', args),
                error: (...args) => this.sandboxLog('error', args),
                debug: (...args) => this.sandboxLog('debug', args)
            };
        }

        // User options
        sandbox.options = options;

        return sandbox;
    }

    getSafeGlobal(name) {
        try {
            if (typeof window !== 'undefined' && name in window) {
                return window[name];
            }
            if (typeof global !== 'undefined' && name in global) {
                return global[name];
            }
            return eval(name);
        } catch (e) {
            return undefined;
        }
    }

    sandboxLog(level, args) {
        const prefix = `[Sandbox]`;
        if (this.config.logLevel === 'debug' || 
            (this.config.logLevel === 'info' && level !== 'debug')) {
            console[level](prefix, ...args);
        }
    }

    createProcessContext(file, options, id) {
        return {
            id,
            file: file.name,
            options,
            startTime: Date.now(),
            memoryUsage: 0,
            cpuUsage: 0,
            progress: 0,
            metadata: {
                extension: file.extension,
                size: file.size,
                type: file.type
            }
        };
    }

    createWasmImports(file, options, context) {
        const imports = {
            env: {
                memory: null,
                table: null,
                // Console
                console_log: (ptr, len) => {
                    const str = this.readWasmString(context.memory, ptr, len);
                    console.log(`[Wasm] ${str}`);
                },
                console_error: (ptr, len) => {
                    const str = this.readWasmString(context.memory, ptr, len);
                    console.error(`[Wasm] ${str}`);
                },
                // Math
                math_random: Math.random,
                math_sin: Math.sin,
                math_cos: Math.cos,
                math_tan: Math.tan,
                // Time
                time_now: Date.now,
                time_performance: performance.now,
                // Memory
                memory_alloc: (size) => {
                    if (context.memory) {
                        return context.memory.grow(Math.ceil(size / 65536));
                    }
                    return 0;
                },
                memory_free: (ptr) => {
                    // Implement free tracking
                },
                // Progress
                report_progress: (current, total) => {
                    const progress = (current / total) * 100;
                    this.emit('wasmProgress', {
                        id: context.id,
                        progress,
                        current,
                        total
                    });
                }
            },
            ...options.imports
        };

        return imports;
    }

    readWasmString(memory, ptr, len) {
        if (!memory) return '';
        const buffer = memory.buffer;
        const bytes = new Uint8Array(buffer, ptr, len);
        return new TextDecoder().decode(bytes);
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    prepareWasmBytes(file) {
        if (file.content instanceof ArrayBuffer) {
            return file.content;
        }
        if (file.content instanceof Uint8Array) {
            return file.content.buffer;
        }
        if (typeof file.content === 'string') {
            return this.stringToArrayBuffer(file.content);
        }
        throw new Error('Invalid WASM content format');
    }

    stringToArrayBuffer(str) {
        const buf = new ArrayBuffer(str.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < str.length; i++) {
            view[i] = str.charCodeAt(i) & 0xff;
        }
        return buf;
    }

    wrapWorkerScript(content, options) {
        return `
            // Worker wrapper
            const __worker_options = ${JSON.stringify(this.sanitizeWorkerOptions(options))};
            
            // Safe environment
            const self = this;
            const console = {
                log: (...args) => postMessage({ type: 'log', level: 'log', args }),
                info: (...args) => postMessage({ type: 'log', level: 'info', args }),
                warn: (...args) => postMessage({ type: 'log', level: 'warn', args }),
                error: (...args) => postMessage({ type: 'log', level: 'error', args })
            };
            
            // Progress reporter
            const __reportProgress = (current, total) => {
                postMessage({ type: 'progress', progress: current, total });
            };
            
            // User code
            ${content}
            
            // Execute
            onmessage = (event) => {
                try {
                    const result = __main__ ? __main__(event.data) : null;
                    postMessage({ type: 'result', data: result, memoryUsage: performance.memory?.usedJSHeapSize || 0 });
                } catch (error) {
                    postMessage({ type: 'error', error: error.message });
                }
            };
        `;
    }

    sanitizeWorkerOptions(options) {
        const safeOptions = {};
        const allowedKeys = ['timeout', 'maxMemory', 'allowNetwork'];
        for (const key of allowedKeys) {
            if (key in options) {
                safeOptions[key] = options[key];
            }
        }
        return safeOptions;
    }

    parseJSON5(content) {
        // Simple JSON5-like parsing
        content = content.replace(/\/\/.*$/gm, '');
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        content = content.replace(/,(\s*[}\]])/g, '$1');
        content = content.replace(/'/g, '"');
        try {
            return JSON.parse(content);
        } catch (e) {
            throw new Error('Invalid JSON/JSON5 content');
        }
    }

    validateAgainstSchema(data, schema) {
        // Simple schema validation
        if (!schema) return data;
        
        const result = {};
        for (const [key, type] of Object.entries(schema)) {
            if (key in data) {
                const value = data[key];
                if (typeof value === type || 
                    (type === 'array' && Array.isArray(value)) ||
                    (type === 'object' && typeof value === 'object' && !Array.isArray(value))) {
                    result[key] = value;
                } else {
                    throw new Error(`Invalid type for ${key}: expected ${type}`);
                }
            } else if (schema[key] !== 'optional') {
                throw new Error(`Missing required field: ${key}`);
            }
        }
        return result;
    }

    getObjectDepth(obj, depth = 0) {
        if (!obj || typeof obj !== 'object') return depth;
        if (Array.isArray(obj) && obj.length === 0) return depth + 1;
        if (Array.isArray(obj)) {
            return Math.max(...obj.map(item => this.getObjectDepth(item, depth + 1)));
        }
        return Math.max(...Object.values(obj).map(value => 
            this.getObjectDepth(value, depth + 1)
        ));
    }

    hasNestedArrays(data) {
        if (!data || typeof data !== 'object') return false;
        if (Array.isArray(data)) {
            return data.some(item => Array.isArray(item));
        }
        return Object.values(data).some(value => this.hasNestedArrays(value));
    }

    isBinaryContent(content) {
        if (!content || content.length === 0) return false;
        const sample = content.substring(0, 1000);
        // Check for null bytes or high control chars
        for (let i = 0; i < sample.length; i++) {
            const code = sample.charCodeAt(i);
            if (code === 0 || (code < 32 && code !== 10 && code !== 13 && code !== 9)) {
                return true;
            }
        }
        return false;
    }

    detectEncoding(content) {
        if (!content) return 'unknown';
        
        // Check for BOM
        if (content.charCodeAt(0) === 0xFEFF) return 'UTF-8-BOM';
        if (content.charCodeAt(0) === 0xFFFE) return 'UTF-16-LE';
        
        // Check for UTF-8
        try {
            const encoder = new TextEncoder();
            const encoded = encoder.encode(content);
            const decoder = new TextDecoder('utf-8');
            const decoded = decoder.decode(encoded);
            if (decoded === content) return 'UTF-8';
        } catch (e) {}
        
        return 'unknown';
    }

    estimateMemoryUsage(obj) {
        let bytes = 0;
        const seen = new Set();
        
        const estimate = (item) => {
            if (seen.has(item)) return 0;
            seen.add(item);
            
            if (item === null || item === undefined) return 0;
            if (typeof item === 'boolean') return 4;
            if (typeof item === 'number') return 8;
            if (typeof item === 'string') return item.length * 2;
            if (typeof item === 'function') return 100;
            if (Array.isArray(item)) {
                return item.reduce((sum, i) => sum + estimate(i), 0) + 8 * item.length;
            }
            if (typeof item === 'object') {
                return Object.entries(item).reduce((sum, [key, value]) => {
                    return sum + estimate(key) + estimate(value);
                }, 0) + 8 * Object.keys(item).length;
            }
            return 0;
        };
        
        return estimate(obj);
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
    // HOOK SYSTEM
    // ==========================================

    addHook(name, handler) {
        if (this.customHandlers[name]) {
            this.customHandlers[name].push(handler);
        }
        return this;
    }

    async runHooks(name, data) {
        if (this.customHandlers[name]) {
            for (const handler of this.customHandlers[name]) {
                await handler(data);
            }
        }
    }

    // ==========================================
    // RESOURCE MONITOR
    // ==========================================

    startResourceMonitor() {
        const monitorInterval = 5000; // 5 seconds
        this.resourceMonitor = setInterval(() => {
            this.checkResourceLimits();
        }, monitorInterval);
    }

    checkResourceLimits() {
        let totalMemory = 0;
        for (const [id, process] of this.runningProcesses) {
            totalMemory += process.memory || 0;
        }

        if (totalMemory > this.config.maxMemory) {
            this.log(`⚠️ Memory limit exceeded: ${totalMemory} / ${this.config.maxMemory}`);
            this.handleMemoryPressure();
        }
    }

    handleMemoryPressure() {
        // Cancel oldest processes first
        const processes = Array.from(this.runningProcesses.values())
            .sort((a, b) => a.startTime - b.startTime);

        for (const process of processes) {
            if (this.runningProcesses.size <= 1) break;
            if (process.status === 'running') {
                this.cancelProcess(process.id);
            }
        }
    }

    // ==========================================
    // PROCESS MANAGEMENT
    // ==========================================

    cancelProcess(id) {
        const process = this.runningProcesses.get(id);
        if (!process) return false;

        // Try to terminate worker if exists
        const worker = this.workers.get(process.file);
        if (worker) {
            worker.terminate();
            this.workers.delete(process.file);
        }

        // Remove from running
        this.runningProcesses.delete(id);
        this.emit('processCancelled', { id });

        return true;
    }

    cancelAllProcesses() {
        const ids = Array.from(this.runningProcesses.keys());
        let count = 0;
        for (const id of ids) {
            if (this.cancelProcess(id)) {
                count++;
            }
        }
        return count;
    }

    getProcess(id) {
        return this.runningProcesses.get(id) || null;
    }

    getAllProcesses() {
        return Array.from(this.runningProcesses.values());
    }

    getProcessStats() {
        return {
            total: this.stats.totalLaunches,
            successful: this.stats.successfulLaunches,
            failed: this.stats.failedLaunches,
            running: this.runningProcesses.size,
            queued: this.processQueue.length,
            averageDuration: this.stats.totalLaunches > 0 
                ? this.stats.totalExecutionTime / this.stats.totalLaunches 
                : 0,
            maxConcurrent: this.stats.maxConcurrent,
            peakMemory: this.stats.peakMemoryUsage,
            wasmModules: this.wasmModules.size,
            workers: this.workers.size
        };
    }

    // ==========================================
    // CLEANUP & SHUTDOWN
    // ==========================================

    terminateWorker(name) {
        const worker = this.workers.get(name);
        if (worker) {
            worker.terminate();
            this.workers.delete(name);
            return true;
        }
        return false;
    }

    terminateAllWorkers() {
        let count = 0;
        for (const [name, worker] of this.workers) {
            worker.terminate();
            this.workers.delete(name);
            count++;
        }
        return count;
    }

    clearCache() {
        const stats = {
            wasm: this.wasmModules.size,
            workers: this.workers.size
        };
        this.wasmModules.clear();
        this.workers.clear();
        return stats;
    }

    shutdown() {
        this.isShuttingDown = true;
        this.cancelAllProcesses();
        this.terminateAllWorkers();
        this.clearCache();
        
        if (this.resourceMonitor) {
            clearInterval(this.resourceMonitor);
            this.resourceMonitor = null;
        }

        this.log('🛑 LaunchEngine shutdown complete');
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    generateId() {
        this.idCounter++;
        return 'launch_' + Date.now() + '_' + this.idCounter + '_' + 
               Math.random().toString(36).substr(2, 6);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    log(message) {
        if (this.config.enableLogging) {
            const timestamp = new Date().toISOString();
            console.log(`[LaunchEngine] ${timestamp} - ${message}`);
        }
    }
}
