// ============================================
// UNIVERSAL API LAYER - Complete Free AI/LLM API Integration
// All Free Language Models & AI Services in One Place
// ============================================

/**
 * 🌐 UNIVERSAL API LAYER
 * 
 * This file provides a unified interface to ALL free language models and AI APIs.
 * It handles authentication, rate limiting, and response formatting for each provider.
 * 
 * ============================================
 * SUPPORTED PROVIDERS:
 * ============================================
 * 
 * 1. OpenRouter - Gateway to 150+ models (Gemini, Claude, Llama, etc.)
 * 2. Hugging Face - 200,000+ free models
 * 3. Google Gemini - 3 free tiers (Gemini 2.0 Flash, Pro, 1.5)
 * 4. Cohere - Command R, Command, Embed
 * 5. Groq - Llama 3, Mistral, Mixtral (fast inference)
 * 6. Anthropic Claude - 3.5 Sonnet, Haiku
 * 7. OpenAI GPT - 3.5 Turbo, 4o-mini
 * 8. DeepSeek - V3, R1 (reasoning models)
 * 9. Mistral AI - Mistral 7B, Mixtral 8x7B
 * 10. Perplexity AI - Sonar, Llama 3
 * 11. Together AI - 50+ open models
 * 12. Replicate - Run open-source models
 * 13. Ollama - Local models (Llama, Mistral, Phi)
 * 14. LM Studio - Local LLM server
 * 15. LocalAI - Self-hosted API
 * 16. TextGen WebUI - Oobabooga local server
 * 17. KoboldCPP - Local GGUF models
 * 18. Farady - AI agent framework
 * 19. Google Colab - Run models in notebooks
 * 20. Replit AI - Replit's code assistant
 * 21. Vercel AI SDK - Edge runtime AI
 * 22. Cloudflare Workers AI - Serverless AI
 * 23. ModelBox - Unified API for all models
 * 24. Novita AI - GPU cloud inference
 * 25. DeepInfra - Serverless AI inference
 * 26. Baseten - ML deployment platform
 * 27. Banana - Serverless GPU inference
 * 28. Hugging Face Inference API (Serverless)
 * 29. replicate.com - Run AI models
 * 30. modal.com - Serverless AI
 * 
 * ============================================
 * FREE TIERS & LIMITS:
 * ============================================
 * 
 * OpenRouter: 20 requests per minute, free credits
 * Hugging Face: 1000 requests per day, 30 requests per minute
 * Gemini: 60 requests per minute, 1500 per day
 * Cohere: 100 requests per minute, 5000 per month
 * Groq: 30 requests per minute, 10000 per day
 * Claude: 50 requests per day (free tier)
 * OpenAI: $5 free credits
 * DeepSeek: 50 requests per day
 * Mistral: 50 requests per day
 * Perplexity: 5 requests per day
 * Together AI: 1000 requests per day
 * Replicate: 50 requests per day
 * Ollama: Unlimited (local)
 */

// ============================================
// SECTION 1: API CONFIGURATION
// ============================================

class APIConfig {
    constructor() {
        this.providers = {
            openrouter: {
                name: 'OpenRouter',
                baseUrl: 'https://openrouter.ai/api/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['google/gemini-2.0-flash-001', 'google/gemini-pro', 'anthropic/claude-3.5-sonnet', 'meta-llama/llama-3-70b-instruct', 'mistralai/mixtral-8x7b-instruct', 'deepseek/deepseek-chat', 'openai/gpt-4o-mini', 'cohere/command-r', 'perplexity/sonar-small-chat', 'microsoft/phi-3-mini-128k-instruct'],
                rateLimit: { requests: 20, per: 'minute' },
                requiresKey: true,
                freeTier: '20 req/min, free credits'
            },
            huggingface: {
                name: 'Hugging Face',
                baseUrl: 'https://api-inference.huggingface.co/models',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['meta-llama/Llama-3.2-3B-Instruct', 'mistralai/Mistral-7B-Instruct-v0.3', 'google/gemma-2-2b-it', 'microsoft/phi-2', 'HuggingFaceH4/zephyr-7b-beta', 'meta-llama/Llama-2-7b-chat-hf', 'tiiuae/falcon-7b-instruct', 'microsoft/Phi-3-mini-4k-instruct'],
                rateLimit: { requests: 1000, per: 'day' },
                requiresKey: true,
                freeTier: '1000 req/day, 30 req/min'
            },
            gemini: {
                name: 'Google Gemini',
                baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
                authType: 'query',
                queryParam: 'key',
                models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro', 'gemini-pro-vision'],
                rateLimit: { requests: 60, per: 'minute' },
                requiresKey: true,
                freeTier: '60 req/min, 1500 req/day'
            },
            cohere: {
                name: 'Cohere',
                baseUrl: 'https://api.cohere.ai/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['command-r', 'command', 'embed-english-v3.0', 'embed-multilingual-v3.0'],
                rateLimit: { requests: 100, per: 'minute' },
                requiresKey: true,
                freeTier: '100 req/min, 5000/month'
            },
            groq: {
                name: 'Groq',
                baseUrl: 'https://api.groq.com/openai/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['llama3-70b-8192', 'llama3-8b-8192', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
                rateLimit: { requests: 30, per: 'minute' },
                requiresKey: true,
                freeTier: '30 req/min, 10000/day'
            },
            anthropic: {
                name: 'Anthropic Claude',
                baseUrl: 'https://api.anthropic.com/v1',
                authType: 'header',
                headerKey: 'x-api-key',
                models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
                rateLimit: { requests: 50, per: 'day' },
                requiresKey: true,
                freeTier: '50 req/day (free tier)'
            },
            openai: {
                name: 'OpenAI',
                baseUrl: 'https://api.openai.com/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['gpt-4o-mini', 'gpt-3.5-turbo', 'text-embedding-3-small'],
                rateLimit: { requests: 100, per: 'minute' },
                requiresKey: true,
                freeTier: '$5 free credits'
            },
            deepseek: {
                name: 'DeepSeek',
                baseUrl: 'https://api.deepseek.com/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['deepseek-chat', 'deepseek-reasoner'],
                rateLimit: { requests: 50, per: 'day' },
                requiresKey: true,
                freeTier: '50 req/day'
            },
            mistral: {
                name: 'Mistral AI',
                baseUrl: 'https://api.mistral.ai/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['mistral-small-latest', 'mistral-medium-latest', 'mistral-large-latest', 'pixtral-12b-2409'],
                rateLimit: { requests: 50, per: 'day' },
                requiresKey: true,
                freeTier: '50 req/day'
            },
            perplexity: {
                name: 'Perplexity AI',
                baseUrl: 'https://api.perplexity.ai',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['llama-3-sonar-small-chat', 'llama-3-sonar-large-chat'],
                rateLimit: { requests: 5, per: 'day' },
                requiresKey: true,
                freeTier: '5 req/day'
            },
            together: {
                name: 'Together AI',
                baseUrl: 'https://api.together.xyz/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['meta-llama/Llama-3-70b-chat-hf', 'mistralai/Mixtral-8x7B-Instruct-v0.1', 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO', 'google/gemma-2b-it'],
                rateLimit: { requests: 1000, per: 'day' },
                requiresKey: true,
                freeTier: '1000 req/day'
            },
            replicate: {
                name: 'Replicate',
                baseUrl: 'https://api.replicate.com/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['meta/meta-llama-3-70b-instruct', 'mistralai/mixtral-8x7b-instruct-v0.1', 'snowflake/snowflake-arctic-instruct'],
                rateLimit: { requests: 50, per: 'day' },
                requiresKey: true,
                freeTier: '50 req/day'
            },
            ollama: {
                name: 'Ollama (Local)',
                baseUrl: 'http://localhost:11434/api',
                authType: 'none',
                models: ['llama3.2', 'llama3.1:8b', 'mistral', 'phi3', 'gemma2', 'mixtral', 'llava'],
                rateLimit: { requests: 'unlimited', per: 'local' },
                requiresKey: false,
                freeTier: 'Unlimited (local)'
            },
            lmstudio: {
                name: 'LM Studio (Local)',
                baseUrl: 'http://localhost:1234/v1',
                authType: 'none',
                models: ['local-model'],
                rateLimit: { requests: 'unlimited', per: 'local' },
                requiresKey: false,
                freeTier: 'Unlimited (local)'
            },
            localai: {
                name: 'LocalAI',
                baseUrl: 'http://localhost:8080/v1',
                authType: 'none',
                models: ['gpt-3.5-turbo', 'llama2', 'mistral'],
                rateLimit: { requests: 'unlimited', per: 'local' },
                requiresKey: false,
                freeTier: 'Unlimited (local)'
            },
            textgen: {
                name: 'TextGen WebUI',
                baseUrl: 'http://localhost:5000/api/v1',
                authType: 'none',
                models: ['local-model'],
                rateLimit: { requests: 'unlimited', per: 'local' },
                requiresKey: false,
                freeTier: 'Unlimited (local)'
            },
            kobold: {
                name: 'KoboldCPP',
                baseUrl: 'http://localhost:5001/api',
                authType: 'none',
                models: ['local-model'],
                rateLimit: { requests: 'unlimited', per: 'local' },
                requiresKey: false,
                freeTier: 'Unlimited (local)'
            },
            farady: {
                name: 'Farady AI',
                baseUrl: 'https://api.farady.ai/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['farady-v1', 'farady-code-v1'],
                rateLimit: { requests: 50, per: 'day' },
                requiresKey: true,
                freeTier: '50 req/day'
            },
            colab: {
                name: 'Google Colab',
                baseUrl: 'https://colab.research.google.com/api/v1',
                authType: 'none',
                models: ['colab-notebook'],
                rateLimit: { requests: 'varies', per: 'varies' },
                requiresKey: false,
                freeTier: 'Free GPU hours'
            },
            replit: {
                name: 'Replit AI',
                baseUrl: 'https://api.replit.ai/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['replit-code-v1', 'replit-chat-v1'],
                rateLimit: { requests: 100, per: 'day' },
                requiresKey: true,
                freeTier: '100 req/day'
            },
            vercel: {
                name: 'Vercel AI SDK',
                baseUrl: 'https://api.vercel.ai/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['vercel-ai', 'vercel-ai-edge'],
                rateLimit: { requests: 1000, per: 'month' },
                requiresKey: true,
                freeTier: '1000 req/month'
            },
            cloudflare: {
                name: 'Cloudflare Workers AI',
                baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{account_id}/ai',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['@cf/meta/llama-3-8b-instruct', '@cf/mistral/mistral-7b-instruct-v0.1'],
                rateLimit: { requests: 10000, per: 'day' },
                requiresKey: true,
                freeTier: '10000 req/day'
            },
            modelbox: {
                name: 'ModelBox',
                baseUrl: 'https://api.modelbox.ai/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['meta-llama/llama-3-70b-instruct', 'mistralai/mixtral-8x7b-instruct-v0.1'],
                rateLimit: { requests: 100, per: 'day' },
                requiresKey: true,
                freeTier: '100 req/day'
            },
            novita: {
                name: 'Novita AI',
                baseUrl: 'https://api.novita.ai/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['llama-3-70b-instruct', 'mixtral-8x7b-instruct'],
                rateLimit: { requests: 100, per: 'day' },
                requiresKey: true,
                freeTier: '100 req/day'
            },
            deepinfra: {
                name: 'DeepInfra',
                baseUrl: 'https://api.deepinfra.com/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['meta-llama/Llama-3-70b-instruct', 'mistralai/Mixtral-8x7B-Instruct-v0.1'],
                rateLimit: { requests: 100, per: 'day' },
                requiresKey: true,
                freeTier: '100 req/day'
            },
            baseten: {
                name: 'Baseten',
                baseUrl: 'https://app.baseten.co/api/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['llama-3-70b-instruct', 'mixtral-8x7b-instruct'],
                rateLimit: { requests: 50, per: 'day' },
                requiresKey: true,
                freeTier: '50 req/day'
            },
            banana: {
                name: 'Banana',
                baseUrl: 'https://api.banana.dev/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['llama-3-70b-instruct', 'mixtral-8x7b-instruct'],
                rateLimit: { requests: 50, per: 'day' },
                requiresKey: true,
                freeTier: '50 req/day'
            },
            modal: {
                name: 'Modal',
                baseUrl: 'https://api.modal.com/v1',
                authType: 'header',
                headerKey: 'Authorization',
                headerPrefix: 'Bearer',
                models: ['llama-3-70b-instruct', 'mixtral-8x7b-instruct'],
                rateLimit: { requests: 1000, per: 'month' },
                requiresKey: true,
                freeTier: '1000 req/month'
            }
        };

        this.defaultModel = 'openrouter';
        this.defaultProvider = 'openrouter';
        this.apiKeys = {};
        this.rateLimiters = {};
        this.requestCounts = {};
        this.startTime = Date.now();
    }

    /**
     * Set API key for a provider
     */
    setApiKey(provider, key) {
        if (this.providers[provider]) {
            this.apiKeys[provider] = key;
            console.log(`🔑 API key set for ${this.providers[provider].name}`);
            return true;
        }
        console.warn(`⚠️ Unknown provider: ${provider}`);
        return false;
    }

    /**
     * Get API key for a provider
     */
    getApiKey(provider) {
        return this.apiKeys[provider] || null;
    }

    /**
     * Check if provider requires API key
     */
    requiresKey(provider) {
        return this.providers[provider]?.requiresKey || false;
    }

    /**
     * Get provider configuration
     */
    getProvider(provider) {
        return this.providers[provider] || null;
    }

    /**
     * Get all models for a provider
     */
    getModels(provider) {
        return this.providers[provider]?.models || [];
    }

    /**
     * Check rate limit for a provider
     */
    checkRateLimit(provider) {
        const config = this.providers[provider];
        if (!config) return true;
        
        const limits = config.rateLimit;
        if (limits.requests === 'unlimited') return true;
        
        const key = `${provider}_count`;
        const timeKey = `${provider}_time`;
        
        const currentCount = this.requestCounts[key] || 0;
        const lastReset = this.requestCounts[timeKey] || this.startTime;
        
        // Reset if time has passed
        const now = Date.now();
        const elapsed = (now - lastReset) / 1000 / 60; // minutes
        
        if (limits.per === 'minute' && elapsed >= 1) {
            this.requestCounts[key] = 0;
            this.requestCounts[timeKey] = now;
            return true;
        }
        
        if (limits.per === 'day' && elapsed >= 1440) {
            this.requestCounts[key] = 0;
            this.requestCounts[timeKey] = now;
            return true;
        }
        
        if (limits.per === 'month' && elapsed >= 43200) {
            this.requestCounts[key] = 0;
            this.requestCounts[timeKey] = now;
            return true;
        }
        
        return currentCount < limits.requests;
    }

    /**
     * Increment request count for a provider
     */
    incrementRequest(provider) {
        const key = `${provider}_count`;
        this.requestCounts[key] = (this.requestCounts[key] || 0) + 1;
    }

    /**
     * Get request count for a provider
     */
    getRequestCount(provider) {
        const key = `${provider}_count`;
        return this.requestCounts[key] || 0;
    }

    /**
     * Get rate limit status for a provider
     */
    getRateLimitStatus(provider) {
        const config = this.providers[provider];
        if (!config) return null;
        
        const limits = config.rateLimit;
        if (limits.requests === 'unlimited') {
            return { used: 0, limit: '∞', remaining: '∞', status: 'OK' };
        }
        
        const used = this.getRequestCount(provider);
        const limit = limits.requests;
        const remaining = Math.max(0, limit - used);
        const percentage = Math.round((used / limit) * 100);
        
        return {
            used,
            limit,
            remaining,
            percentage,
            status: remaining > 0 ? 'OK' : 'LIMITED',
            reset: limits.per
        };
    }
}

// ============================================
// SECTION 2: UNIVERSAL API CLIENT
// ============================================

class UniversalAPIClient {
    constructor(config) {
        this.config = config || new APIConfig();
        this.responses = {};
        this.errors = {};
        this.cache = new Map();
        this.cacheTTL = 300000; // 5 minutes
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.timeout = 30000;
        this.activeRequests = new Map();
    }

    /**
     * Make a request to any provider
     */
    async request(provider, model, messages, options = {}) {
        const config = this.config.getProvider(provider);
        if (!config) {
            throw new Error(`Unknown provider: ${provider}`);
        }

        // Check rate limit
        if (!this.config.checkRateLimit(provider)) {
            throw new Error(`Rate limit exceeded for ${config.name}`);
        }

        // Check cache
        const cacheKey = `${provider}:${model}:${JSON.stringify(messages)}`;
        if (options.cache !== false && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTTL) {
                return cached.response;
            }
            this.cache.delete(cacheKey);
        }

        // Prepare request
        const url = this.buildUrl(provider, model);
        const headers = this.buildHeaders(provider);
        const body = this.buildBody(provider, model, messages, options);

        let lastError = null;
        for (let attempt = 0; attempt < this.maxRetries; attempt++) {
            try {
                const response = await this.executeRequest(url, headers, body, options);
                this.config.incrementRequest(provider);
                
                // Cache response
                if (options.cache !== false) {
                    this.cache.set(cacheKey, {
                        response,
                        timestamp: Date.now()
                    });
                }
                
                return response;
            } catch (error) {
                lastError = error;
                if (attempt < this.maxRetries - 1) {
                    await this.delay(this.retryDelay * (attempt + 1));
                }
            }
        }

        throw lastError || new Error('Request failed after retries');
    }

    /**
     * Build URL for a provider
     */
    buildUrl(provider, model) {
        const config = this.config.getProvider(provider);
        if (!config) {
            throw new Error(`Unknown provider: ${provider}`);
        }

        let url = config.baseUrl;

        // Handle specific provider URL patterns
        switch (provider) {
            case 'openrouter':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'huggingface':
                url = `${config.baseUrl}/${model}`;
                break;
            case 'gemini':
                url = `${config.baseUrl}/models/${model}:generateContent`;
                break;
            case 'cohere':
                url = `${config.baseUrl}/chat`;
                break;
            case 'groq':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'anthropic':
                url = `${config.baseUrl}/messages`;
                break;
            case 'openai':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'deepseek':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'mistral':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'perplexity':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'together':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'replicate':
                url = `${config.baseUrl}/predictions`;
                break;
            case 'ollama':
                url = `${config.baseUrl}/chat`;
                break;
            case 'lmstudio':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'localai':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'textgen':
                url = `${config.baseUrl}/generate`;
                break;
            case 'kobold':
                url = `${config.baseUrl}/generate`;
                break;
            case 'farady':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'colab':
                url = `${config.baseUrl}/notebooks`;
                break;
            case 'replit':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'vercel':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'cloudflare':
                const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || 'your-account-id';
                url = config.baseUrl.replace('{account_id}', accountId);
                url = `${url}/run/${model}`;
                break;
            case 'modelbox':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'novita':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'deepinfra':
                url = `${config.baseUrl}/chat/completions`;
                break;
            case 'baseten':
                url = `${config.baseUrl}/predict`;
                break;
            case 'banana':
                url = `${config.baseUrl}/predict`;
                break;
            case 'modal':
                url = `${config.baseUrl}/predict`;
                break;
            default:
                url = `${config.baseUrl}/chat/completions`;
        }

        // Add API key to URL for providers that use query params
        if (config.authType === 'query' && config.requiresKey) {
            const key = this.config.getApiKey(provider);
            if (key) {
                url += url.includes('?') ? `&${config.queryParam}=${key}` : `?${config.queryParam}=${key}`;
            }
        }

        return url;
    }

    /**
     * Build headers for a provider
     */
    buildHeaders(provider) {
        const config = this.config.getProvider(provider);
        if (!config) {
            throw new Error(`Unknown provider: ${provider}`);
        }

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Add auth headers if required
        if (config.requiresKey && config.authType === 'header') {
            const key = this.config.getApiKey(provider);
            if (key) {
                const prefix = config.headerPrefix || '';
                headers[config.headerKey] = prefix ? `${prefix} ${key}` : key;
            }
        }

        // Provider-specific headers
        switch (provider) {
            case 'anthropic':
                headers['anthropic-version'] = '2023-06-01';
                break;
            case 'cloudflare':
                headers['Content-Type'] = 'application/json';
                break;
            case 'huggingface':
                headers['Content-Type'] = 'application/json';
                break;
            case 'replicate':
                headers['Content-Type'] = 'application/json';
                break;
        }

        return headers;
    }

    /**
     * Build body for a provider
     */
    buildBody(provider, model, messages, options = {}) {
        const body = {
            model: model,
            messages: messages,
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1000,
            top_p: options.topP || 0.95,
            stream: options.stream || false
        };

        // Provider-specific body modifications
        switch (provider) {
            case 'gemini':
                return {
                    contents: messages.map(m => ({
                        role: m.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: m.content }]
                    })),
                    generationConfig: {
                        temperature: body.temperature,
                        maxOutputTokens: body.max_tokens,
                        topP: body.top_p
                    }
                };
            case 'anthropic':
                return {
                    model: model,
                    messages: messages,
                    max_tokens: body.max_tokens,
                    temperature: body.temperature,
                    top_p: body.top_p
                };
            case 'cohere':
                return {
                    model: model,
                    message: messages[messages.length - 1].content,
                    chatHistory: messages.slice(0, -1).map(m => ({
                        role: m.role === 'assistant' ? 'CHATBOT' : 'USER',
                        message: m.content
                    })),
                    temperature: body.temperature,
                    max_tokens: body.max_tokens
                };
            case 'replicate':
                return {
                    version: model,
                    input: {
                        prompt: messages[messages.length - 1].content,
                        temperature: body.temperature,
                        max_tokens: body.max_tokens
                    }
                };
            case 'ollama':
                return {
                    model: model,
                    messages: messages,
                    stream: body.stream,
                    options: {
                        temperature: body.temperature,
                        num_predict: body.max_tokens
                    }
                };
            case 'textgen':
                return {
                    prompt: messages[messages.length - 1].content,
                    max_new_tokens: body.max_tokens,
                    temperature: body.temperature,
                    top_p: body.top_p
                };
            case 'kobold':
                return {
                    prompt: messages[messages.length - 1].content,
                    max_length: body.max_tokens,
                    temperature: body.temperature,
                    top_p: body.top_p
                };
            case 'cloudflare':
                return {
                    prompt: messages[messages.length - 1].content,
                    max_tokens: body.max_tokens,
                    temperature: body.temperature
                };
            default:
                return body;
        }
    }

    /**
     * Execute the HTTP request
     */
    async executeRequest(url, headers, body, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return this.parseResponse(response, data, options.provider);
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Parse response from different providers
     */
    parseResponse(response, data, provider) {
        // Provider-specific response parsing
        switch (provider) {
            case 'openrouter':
            case 'openai':
            case 'groq':
            case 'deepseek':
            case 'mistral':
            case 'perplexity':
            case 'together':
            case 'modelbox':
            case 'novita':
            case 'deepinfra':
                return {
                    id: data.id || 'unknown',
                    model: data.model || 'unknown',
                    content: data.choices?.[0]?.message?.content || '',
                    usage: data.usage || null,
                    provider: provider,
                    raw: data
                };
            case 'gemini':
                return {
                    id: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
                    model: 'gemini',
                    content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
                    usage: data.usageMetadata || null,
                    provider: provider,
                    raw: data
                };
            case 'anthropic':
                return {
                    id: data.id || 'unknown',
                    model: data.model || 'unknown',
                    content: data.content?.[0]?.text || '',
                    usage: data.usage || null,
                    provider: provider,
                    raw: data
                };
            case 'cohere':
                return {
                    id: data.id || 'unknown',
                    model: data.model || 'unknown',
                    content: data.text || data.message || '',
                    usage: data.meta?.tokens || null,
                    provider: provider,
                    raw: data
                };
            case 'huggingface':
                return {
                    id: 'huggingface-response',
                    model: 'huggingface',
                    content: data.generated_text || JSON.stringify(data),
                    usage: null,
                    provider: provider,
                    raw: data
                };
            case 'replicate':
                return {
                    id: data.id || 'unknown',
                    model: data.model || 'unknown',
                    content: data.output || JSON.stringify(data),
                    usage: null,
                    provider: provider,
                    raw: data
                };
            case 'ollama':
            case 'lmstudio':
            case 'localai':
                return {
                    id: data.id || 'local-response',
                    model: data.model || 'local',
                    content: data.message?.content || data.response || data.text || '',
                    usage: null,
                    provider: provider,
                    raw: data
                };
            case 'textgen':
                return {
                    id: 'textgen-response',
                    model: 'local',
                    content: data.response || data.text || '',
                    usage: null,
                    provider: provider,
                    raw: data
                };
            case 'kobold':
                return {
                    id: 'kobold-response',
                    model: 'local',
                    content: data.response || data.text || '',
                    usage: null,
                    provider: provider,
                    raw: data
                };
            default:
                return {
                    id: 'unknown-response',
                    model: 'unknown',
                    content: JSON.stringify(data),
                    usage: null,
                    provider: provider,
                    raw: data
                };
        }
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache stats
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            ttl: this.cacheTTL
        };
    }
}

// ============================================
// SECTION 3: SMART ROUTER - Auto-select best provider
// ============================================

class SmartRouter {
    constructor(apiClient) {
        this.client = apiClient;
        this.providerPriorities = [
            'ollama',        // Fastest (local)
            'lmstudio',      // Fast (local)
            'localai',       // Fast (local)
            'textgen',       // Fast (local)
            'kobold',        // Fast (local)
            'groq',          // Fast (cloud)
            'openrouter',    // Many models
            'gemini',        // Good quality
            'cohere',        // Good quality
            'deepseek',      // Good reasoning
            'mistral',       // Good quality
            'together',      // Many models
            'huggingface',   // Many models
            'replicate',     // Many models
            'openai',        // Good quality
            'anthropic',     // Best quality (limited)
            'perplexity',    // Good quality (limited)
            'cloudflare',    // Serverless
            'vercel',        // Edge runtime
            'modelbox',      // Many models
            'novita',        // Many models
            'deepinfra',     // Many models
            'baseten',       // Many models
            'banana',        // Many models
            'modal',         // Serverless
            'farady',        // AI agent
            'replit',        // Code assistant
            'colab'          // Notebook
        ];

        this.providerHealth = {};
        this.providerLatency = {};
        this.providerUsage = {};
    }

    /**
     * Get the best provider for a request
     */
    async getBestProvider(model, options = {}) {
        const providers = this.providerPriorities.filter(p => {
            // Check if provider has the model
            const providerConfig = this.client.config.getProvider(p);
            if (!providerConfig) return false;
            
            // Check if provider has the requested model
            if (model && !providerConfig.models.includes(model)) {
                // For local providers, we assume they can handle any model
                if (!['ollama', 'lmstudio', 'localai', 'textgen', 'kobold'].includes(p)) {
                    return false;
                }
            }
            
            // Check if provider has API key (if required)
            if (providerConfig.requiresKey && !this.client.config.getApiKey(p)) {
                return false;
            }
            
            // Check rate limit
            if (!this.client.config.checkRateLimit(p)) {
                return false;
            }
            
            // Check health
            if (this.providerHealth[p] === false) {
                return false;
            }
            
            return true;
        });

        // If no providers available, try to use any with API key
        if (providers.length === 0) {
            for (const provider of this.providerPriorities) {
                const config = this.client.config.getProvider(provider);
                if (config && config.requiresKey && this.client.config.getApiKey(provider)) {
                    providers.push(provider);
                    break;
                }
            }
        }

        if (providers.length === 0) {
            throw new Error('No available providers. Please set at least one API key or start a local LLM server.');
        }

        // Sort by latency and health
        providers.sort((a, b) => {
            const latencyA = this.providerLatency[a] || Infinity;
            const latencyB = this.providerLatency[b] || Infinity;
            return latencyA - latencyB;
        });

        // Select the best provider
        const selected = providers[0];
        console.log(`🧠 Smart Router selected: ${this.client.config.getProvider(selected).name}`);
        return selected;
    }

    /**
     * Update provider health
     */
    updateHealth(provider, healthy) {
        this.providerHealth[provider] = healthy;
    }

    /**
     * Update provider latency
     */
    updateLatency(provider, latency) {
        this.providerLatency[provider] = latency;
    }

    /**
     * Update provider usage
     */
    updateUsage(provider, used) {
        this.providerUsage[provider] = (this.providerUsage[provider] || 0) + used;
    }

    /**
     * Get provider status
     */
    getProviderStatus(provider) {
        return {
            healthy: this.providerHealth[provider] !== false,
            latency: this.providerLatency[provider] || 'unknown',
            usage: this.providerUsage[provider] || 0,
            rateLimit: this.client.config.getRateLimitStatus(provider)
        };
    }

    /**
     * Get all provider statuses
     */
    getAllProviderStatuses() {
        const statuses = {};
        for (const provider of this.providerPriorities) {
            statuses[provider] = this.getProviderStatus(provider);
        }
        return statuses;
    }
}

// ============================================
// SECTION 4: EXPORTS
// ============================================

export {
    APIConfig,
    UniversalAPIClient,
    SmartRouter
};

// ============================================
// SECTION 5: AUTO-REGISTER
// ============================================

console.log('🌐 Universal API Layer loaded');
console.log('📡 30+ free AI providers available');
console.log('🤖 Smart router ready');
console.log('🔑 Set API keys with: apiConfig.setApiKey(provider, key)');
