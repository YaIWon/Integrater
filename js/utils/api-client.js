// ============================================
// API CLIENT
// Complete HTTP Client with Retry Logic
// ============================================

export class APIClient {
    constructor(options = {}) {
        // ==========================================
        // CONFIGURATION
        // ==========================================
        this.baseURL = options.baseURL || '';
        this.timeout = options.timeout || 30000;
        this.retryAttempts = options.retryAttempts || 3;
        this.retryDelay = options.retryDelay || 1000;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };
        this.cache = new Map();
        this.cacheTTL = options.cacheTTL || 3600000; // 1 hour
    }

    // ==========================================
    // MAIN REQUEST METHOD
    // ==========================================
    async request(endpoint, method = 'GET', data = null, options = {}) {
        const url = this.buildURL(endpoint);
        const headers = { ...this.defaultHeaders, ...options.headers };
        const cacheKey = this.getCacheKey(url, method, data);

        // Check cache for GET requests
        if (method === 'GET' && options.cache !== false) {
            const cached = this.getCache(cacheKey);
            if (cached) {
                console.log(`📦 Cache hit: ${url}`);
                return cached;
            }
        }

        // Build request options
        const fetchOptions = {
            method: method,
            headers: headers,
            credentials: options.credentials || 'include',
            mode: options.mode || 'cors',
            signal: options.signal || this.createTimeoutSignal()
        };

        // Add body for non-GET requests
        if (data && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            if (data instanceof FormData) {
                fetchOptions.body = data;
                delete fetchOptions.headers['Content-Type'];
            } else {
                fetchOptions.body = JSON.stringify(data);
            }
        }

        // Execute with retry logic
        let lastError = null;
        for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await fetch(url, fetchOptions);
                const responseData = await this.parseResponse(response);

                const result = {
                    status: response.status,
                    ok: response.ok,
                    statusText: response.statusText,
                    data: responseData,
                    headers: Object.fromEntries(response.headers.entries()),
                    url: response.url,
                    method: method,
                    timestamp: new Date().toISOString()
                };

                // Cache successful GET requests
                if (method === 'GET' && response.ok && options.cache !== false) {
                    this.setCache(cacheKey, result);
                }

                return result;

            } catch (error) {
                lastError = error;
                console.warn(`⚠️ Request attempt ${attempt + 1} failed: ${error.message}`);
                
                if (attempt < this.retryAttempts && this.shouldRetry(error)) {
                    await this.delay(this.retryDelay * (attempt + 1));
                    continue;
                }
                break;
            }
        }

        throw new Error(`Request failed after ${this.retryAttempts} attempts: ${lastError?.message || 'Unknown error'}`);
    }

    // ==========================================
    // HTTP METHODS
    // ==========================================
    
    async get(endpoint, options = {}) {
        return this.request(endpoint, 'GET', null, options);
    }

    async post(endpoint, data, options = {}) {
        return this.request(endpoint, 'POST', data, options);
    }

    async put(endpoint, data, options = {}) {
        return this.request(endpoint, 'PUT', data, options);
    }

    async patch(endpoint, data, options = {}) {
        return this.request(endpoint, 'PATCH', data, options);
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, 'DELETE', null, options);
    }

    async head(endpoint, options = {}) {
        return this.request(endpoint, 'HEAD', null, options);
    }

    async options(endpoint, options = {}) {
        return this.request(endpoint, 'OPTIONS', null, options);
    }

    // ==========================================
    // FILE UPLOAD
    // ==========================================
    
    async uploadFile(endpoint, file, onProgress = null, options = {}) {
        const formData = new FormData();
        formData.append('file', file);

        // Add additional fields
        if (options.fields) {
            for (const [key, value] of Object.entries(options.fields)) {
                formData.append(key, value);
            }
        }

        // Use XMLHttpRequest for progress tracking
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const url = this.buildURL(endpoint);

            xhr.open('POST', url, true);
            
            // Set headers (except Content-Type for FormData)
            const headers = { ...this.defaultHeaders, ...options.headers };
            delete headers['Content-Type'];
            for (const [key, value] of Object.entries(headers)) {
                xhr.setRequestHeader(key, value);
            }

            // Progress tracking
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        onProgress({
                            loaded: e.loaded,
                            total: e.total,
                            percent: Math.round((e.loaded / e.total) * 100)
                        });
                    }
                });
            }

            // Response handling
            xhr.addEventListener('load', () => {
                try {
                    const responseData = JSON.parse(xhr.responseText);
                    resolve({
                        status: xhr.status,
                        ok: xhr.status >= 200 && xhr.status < 300,
                        statusText: xhr.statusText,
                        data: responseData,
                        headers: this.parseHeaders(xhr.getAllResponseHeaders())
                    });
                } catch (e) {
                    reject(new Error('Invalid response from server'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed - network error'));
            });

            xhr.addEventListener('abort', () => {
                reject(new Error('Upload aborted'));
            });

            // Timeout
            xhr.timeout = options.timeout || this.timeout;
            xhr.ontimeout = () => {
                reject(new Error('Upload timeout'));
            };

            xhr.send(formData);
        });
    }

    // ==========================================
    // BATCH REQUESTS
    // ==========================================
    
    async batch(requests, options = {}) {
        const results = await Promise.allSettled(
            requests.map(req => 
                this.request(req.endpoint, req.method || 'GET', req.data, { ...options, ...req.options })
            )
        );

        return results.map((result, index) => ({
            index,
            success: result.status === 'fulfilled',
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason : null,
            request: requests[index]
        }));
    }

    // ==========================================
    // SPECIALIZED API METHODS
    // ==========================================

    // Blockchain / Etherscan
    async verifyContract(address, apiKey, network = 'mainnet') {
        const endpoint = 'https://api.etherscan.io/api';
        const params = {
            module: 'contract',
            action: 'getsourcecode',
            address: address,
            apikey: apiKey
        };

        const response = await this.get(endpoint, { 
            params: params,
            cache: true 
        });

        if (response.data && response.data.status === '1') {
            const result = response.data.result[0];
            return {
                verified: !!result.SourceCode,
                contractName: result.ContractName || 'Unknown',
                compilerVersion: result.CompilerVersion || 'Unknown',
                optimizationUsed: result.OptimizationUsed === '1',
                runs: parseInt(result.Runs) || 0,
                license: result.LicenseType || 'Unknown',
                sourceCode: result.SourceCode || null
            };
        }

        return {
            verified: false,
            error: response.data?.message || 'Verification failed'
        };
    }

    async getContractABI(address, apiKey) {
        const endpoint = 'https://api.etherscan.io/api';
        const params = {
            module: 'contract',
            action: 'getabi',
            address: address,
            apikey: apiKey
        };

        const response = await this.get(endpoint, { params });
        
        if (response.data && response.data.status === '1') {
            try {
                return {
                    success: true,
                    abi: JSON.parse(response.data.result)
                };
            } catch (e) {
                return {
                    success: false,
                    error: 'Invalid ABI format'
                };
            }
        }

        return {
            success: false,
            error: response.data?.message || 'Failed to get ABI'
        };
    }

    // IPFS
    async getIPFSContent(cid, gateway = null) {
        const gateways = gateway ? [gateway] : [
            `https://ipfs.io/ipfs/${cid}`,
            `https://gateway.pinata.cloud/ipfs/${cid}`,
            `https://cloudflare-ipfs.com/ipfs/${cid}`,
            `https://ipfs.infura.io/ipfs/${cid}`
        ];

        let lastError = null;
        for (const url of gateways) {
            try {
                const response = await this.get(url, { 
                    timeout: 10000,
                    cache: true,
                    cacheTTL: 3600000
                });
                if (response.ok) {
                    return {
                        success: true,
                        data: response.data,
                        gateway: url,
                        cid: cid
                    };
                }
            } catch (error) {
                lastError = error;
                continue;
            }
        }

        return {
            success: false,
            error: `Failed to fetch from all gateways: ${lastError?.message || 'Unknown error'}`
        };
    }

    async uploadToIPFS(file, options = {}) {
        const { apiKey, apiSecret, endpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS' } = options;
        
        const formData = new FormData();
        formData.append('file', file);

        if (options.metadata) {
            formData.append('pinataMetadata', JSON.stringify(options.metadata));
        }

        if (options.options) {
            formData.append('pinataOptions', JSON.stringify(options.options));
        }

        const headers = {};
        if (apiKey && apiSecret) {
            headers['pinata_api_key'] = apiKey;
            headers['pinata_secret_api_key'] = apiSecret;
        }

        const response = await this.uploadFile(endpoint, file, options.onProgress, {
            headers: headers,
            fields: {
                pinataMetadata: options.metadata ? JSON.stringify(options.metadata) : '',
                pinataOptions: options.options ? JSON.stringify(options.options) : ''
            }
        });

        if (response.ok && response.data) {
            return {
                success: true,
                ipfsHash: response.data.IpfsHash,
                pinSize: response.data.PinSize,
                timestamp: response.data.Timestamp || new Date().toISOString()
            };
        }

        return {
            success: false,
            error: response.data?.error || 'Upload failed'
        };
    }

    // Webhooks
    async sendWebhook(url, data, options = {}) {
        const response = await this.post(url, data, {
            headers: {
                'X-Webhook-Source': 'Universal-Integrator',
                ...options.headers
            },
            timeout: options.timeout || 5000,
            retryAttempts: options.retryAttempts || 2
        });

        return {
            success: response.ok,
            status: response.status,
            data: response.data,
            timestamp: new Date().toISOString()
        };
    }

    // ==========================================
    // CACHE MANAGEMENT
    // ==========================================
    
    getCacheKey(url, method, data) {
        let key = `${method}:${url}`;
        if (data) {
            key += `:${JSON.stringify(data)}`;
        }
        return key;
    }

    getCache(key) {
        const cached = this.cache.get(key);
        if (cached) {
            const age = Date.now() - cached.timestamp;
            if (age < this.cacheTTL) {
                return cached.data;
            }
            this.cache.delete(key);
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }

    // ==========================================
    // HELPERS
    // ==========================================
    
    buildURL(endpoint) {
        if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
            return endpoint;
        }
        return `${this.baseURL}${endpoint}`;
    }

    createTimeoutSignal() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        controller.signal.addEventListener('abort', () => clearTimeout(timeoutId));
        return controller.signal;
    }

    async parseResponse(response) {
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
            return await response.json();
        } else if (contentType.includes('text/')) {
            return await response.text();
        } else if (contentType.includes('application/octet-stream')) {
            return await response.arrayBuffer();
        } else {
            // Try JSON anyway
            try {
                return await response.json();
            } catch (e) {
                return await response.text();
            }
        }
    }

    parseHeaders(headersString) {
        const headers = {};
        const pairs = headersString.trim().split(/[\r\n]+/);
        for (const pair of pairs) {
            const [key, value] = pair.split(': ');
            if (key && value) {
                headers[key] = value;
            }
        }
        return headers;
    }

    shouldRetry(error) {
        // Don't retry on abort
        if (error.name === 'AbortError') return false;
        
        // Don't retry on 4xx errors (except 429 too many requests)
        if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
            return false;
        }
        
        return true;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==========================================
    // AUTH HELPERS
    // ==========================================
    
    setAuthToken(token, type = 'Bearer') {
        this.defaultHeaders['Authorization'] = `${type} ${token}`;
    }

    setBasicAuth(username, password) {
        const encoded = btoa(`${username}:${password}`);
        this.defaultHeaders['Authorization'] = `Basic ${encoded}`;
    }

    setHeader(key, value) {
        this.defaultHeaders[key] = value;
    }

    removeHeader(key) {
        delete this.defaultHeaders[key];
    }

    // ==========================================
    // CONVENIENCE METHODS
    // ==========================================
    
    async getJSON(endpoint, options = {}) {
        const response = await this.get(endpoint, { 
            ...options, 
            headers: { ...options.headers, 'Accept': 'application/json' }
        });
        return response.data;
    }

    async postJSON(endpoint, data, options = {}) {
        const response = await this.post(endpoint, data, {
            ...options,
            headers: { ...options.headers, 'Content-Type': 'application/json' }
        });
        return response.data;
    }

    async putJSON(endpoint, data, options = {}) {
        const response = await this.put(endpoint, data, {
            ...options,
            headers: { ...options.headers, 'Content-Type': 'application/json' }
        });
        return response.data;
    }

    async patchJSON(endpoint, data, options = {}) {
        const response = await this.patch(endpoint, data, {
            ...options,
            headers: { ...options.headers, 'Content-Type': 'application/json' }
        });
        return response.data;
    }

    // ==========================================
    // STREAMING SUPPORT
    // ==========================================
    
    async stream(endpoint, options = {}) {
        const url = this.buildURL(endpoint);
        const headers = { ...this.defaultHeaders, ...options.headers };
        
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Stream request failed: ${response.status}`);
        }

        return response.body;
    }

    async* streamJSON(endpoint, options = {}) {
        const body = await this.stream(endpoint, options);
        const reader = body.getReader();
        const decoder = new TextDecoder();

        let buffer = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') return;
                    try {
                        yield JSON.parse(data);
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    }
}

// ============================================
// CREATE SINGLETON INSTANCE
// ============================================
const apiClient = new APIClient();
export default apiClient;
