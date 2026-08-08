// ============================================
// AUTO LM - Self-Aware, Self-Improving Language Model
// Complete AI System that Integrates with Every Aspect of the Integrator
// ============================================

import { APIConfig, UniversalAPIClient, SmartRouter } from './UniversalAPILayer.js';

/**
 * 🧠 AUTO LM v1.0
 * 
 * ============================================
 * SYSTEM ARCHITECTURE
 * ============================================
 * 
 * This is a complete, self-aware language model that:
 * 1. Learns from every interaction
 * 2. Improves itself over time
 * 3. Integrates with all integrator features
 * 4. Auto-selects the best AI providers
 * 5. Maintains persistent memory
 * 6. Evolves based on usage patterns
 * 7. Generates its own improvements
 * 8. Self-documents its capabilities
 * 
 * ============================================
 * INTEGRATION POINTS
 * ============================================
 * 
 * - File Analysis: Auto analyzes uploaded files
 * - Code Generation: Generates code from descriptions
 * - Documentation: Auto-documents everything
 * - Testing: Creates and runs tests
 * - Debugging: Finds and fixes bugs
 * - Optimization: Improves code performance
 * - Security: Scans for vulnerabilities
 * - Learning: Learns from user feedback
 * - Evolution: Self-improves over time
 * - Integration: Works with all integrator features
 */

class AutoLM {
    constructor() {
        // ==========================================
        // CORE CONFIGURATION
        // ==========================================
        this.name = 'AutoLM';
        this.version = '1.0.0';
        this.timestamp = new Date().toISOString();
        
        // Initialize API layer
        this.apiConfig = new APIConfig();
        this.apiClient = new UniversalAPIClient(this.apiConfig);
        this.router = new SmartRouter(this.apiClient);
        
        // ==========================================
        // MEMORY & LEARNING
        // ==========================================
        this.memory = {
            conversations: [],
            knowledge: new Map(),
            patterns: new Map(),
            improvements: [],
            feedback: [],
            stats: {
                totalInteractions: 0,
                successfulInteractions: 0,
                failedInteractions: 0,
                tokensUsed: 0,
                cost: 0,
                improvements: 0
            }
        };
        
        // ==========================================
        // PERSONALITY & BEHAVIOR
        // ==========================================
        this.personality = {
            name: 'AutoLM',
            description: 'Self-aware, self-improving language model',
            style: 'professional',
            tone: 'helpful',
            creativity: 0.7,
            temperature: 0.8,
            maxTokens: 2000
        };
        
        // ==========================================
        // CAPABILITIES
        // ==========================================
        this.capabilities = {
            analysis: true,
            codeGen: true,
            documentation: true,
            testing: true,
            debugging: true,
            optimization: true,
            security: true,
            learning: true,
            evolution: true,
            integration: true
        };
        
        // ==========================================
        // PROVIDER PREFERENCES
        // ==========================================
        this.providerPreferences = {
            primary: 'openrouter',      // Best overall
            secondary: 'groq',          // Fast inference
            fallback: 'ollama',         // Local fallback
            code: 'deepseek',           // Best for code
            analysis: 'gemini',         // Best for analysis
            documentation: 'claude',    // Best for documentation
            testing: 'mistral',         // Good for testing
            security: 'llama'           // Good for security
        };
        
        // ==========================================
        // AUTO-LOAD CONFIGURATION
        // ==========================================
        this.loadConfig();
        this.loadMemory();
        this.startAutoLearning();
        
        console.log(`🧠 ${this.name} v${this.version} initialized`);
        console.log('📚 Memory loaded:', this.memory.knowledge.size, 'items');
        console.log('🔄 Auto-learning enabled');
        console.log('🌐 API layer ready');
    }

    // ==========================================
    // SECTION 1: CONFIGURATION & INITIALIZATION
    // ==========================================

    loadConfig() {
        try {
            const saved = localStorage.getItem('autolm_config');
            if (saved) {
                const config = JSON.parse(saved);
                Object.assign(this.personality, config.personality || {});
                Object.assign(this.providerPreferences, config.providerPreferences || {});
                console.log('📋 Config loaded');
            }
        } catch (e) {
            // No saved config
        }
    }

    loadMemory() {
        try {
            const saved = localStorage.getItem('autolm_memory');
            if (saved) {
                const memory = JSON.parse(saved);
                this.memory.conversations = memory.conversations || [];
                this.memory.knowledge = new Map(Object.entries(memory.knowledge || {}));
                this.memory.patterns = new Map(Object.entries(memory.patterns || {}));
                this.memory.improvements = memory.improvements || [];
                this.memory.feedback = memory.feedback || [];
                this.memory.stats = memory.stats || this.memory.stats;
                console.log('💾 Memory loaded');
            }
        } catch (e) {
            // No saved memory
        }
    }

    saveConfig() {
        try {
            localStorage.setItem('autolm_config', JSON.stringify({
                personality: this.personality,
                providerPreferences: this.providerPreferences
            }));
        } catch (e) {
            // Error saving config
        }
    }

    saveMemory() {
        try {
            localStorage.setItem('autolm_memory', JSON.stringify({
                conversations: this.memory.conversations.slice(-1000),
                knowledge: Object.fromEntries(this.memory.knowledge),
                patterns: Object.fromEntries(this.memory.patterns),
                improvements: this.memory.improvements,
                feedback: this.memory.feedback,
                stats: this.memory.stats
            }));
        } catch (e) {
            // Error saving memory
        }
    }

    // ==========================================
    // SECTION 2: CORE AI FUNCTIONS
    // ==========================================

    /**
     * Main chat function - process a user message
     */
    async chat(message, context = {}, options = {}) {
        this.memory.stats.totalInteractions++;
        
        const startTime = Date.now();
        let response = null;
        let provider = null;
        let model = null;

        try {
            // Determine which provider to use
            provider = options.provider || await this.selectProvider(message, context);
            model = options.model || this.selectModel(provider, message, context);
            
            // Build the prompt
            const prompt = this.buildPrompt(message, context, options);
            
            // Get response from API
            response = await this.apiClient.request(provider, model, prompt, {
                temperature: options.temperature || this.personality.temperature,
                maxTokens: options.maxTokens || this.personality.maxTokens,
                stream: options.stream || false
            });
            
            // Process the response
            const result = this.processResponse(response, provider, model, message);
            
            // Update memory
            this.updateMemory(message, result, context);
            
            // Learn from the interaction
            await this.learnFromInteraction(message, result, context);
            
            // Check if we should improve
            if (this.shouldImprove()) {
                await this.improve();
            }
            
            // Update stats
            this.memory.stats.successfulInteractions++;
            this.memory.stats.tokensUsed += response.usage?.total_tokens || 0;
            
            const endTime = Date.now();
            this.router.updateLatency(provider, endTime - startTime);
            
            return result;

        } catch (error) {
            this.memory.stats.failedInteractions++;
            console.error('❌ Chat error:', error.message);
            
            // Try fallback provider
            if (provider && provider !== 'ollama') {
                try {
                    console.log('🔄 Trying fallback provider...');
                    const fallbackResult = await this.chatWithFallback(message, context, options);
                    return fallbackResult;
                } catch (fallbackError) {
                    console.error('❌ Fallback also failed:', fallbackError.message);
                }
            }
            
            return {
                success: false,
                error: error.message,
                message: message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Select the best provider based on the request
     */
    async selectProvider(message, context) {
        // Check if message is code-related
        const isCode = this.detectCodeRequest(message);
        const isAnalysis = this.detectAnalysisRequest(message);
        const isDocumentation = this.detectDocumentationRequest(message);
        const isTesting = this.detectTestingRequest(message);
        const isSecurity = this.detectSecurityRequest(message);
        
        let preferred = this.providerPreferences.primary;
        
        if (isCode) preferred = this.providerPreferences.code;
        else if (isAnalysis) preferred = this.providerPreferences.analysis;
        else if (isDocumentation) preferred = this.providerPreferences.documentation;
        else if (isTesting) preferred = this.providerPreferences.testing;
        else if (isSecurity) preferred = this.providerPreferences.security;
        
        // Try to use the preferred provider
        try {
            const bestProvider = await this.router.getBestProvider(
                this.selectModel(preferred, message, context)
            );
            if (bestProvider) {
                return bestProvider;
            }
        } catch (e) {
            // Fall back to secondary
        }
        
        // Try secondary
        try {
            const secondary = await this.router.getBestProvider(
                this.selectModel(this.providerPreferences.secondary, message, context)
            );
            if (secondary) {
                return secondary;
            }
        } catch (e) {
            // Fall back to fallback
        }
        
        // Use fallback
        return this.providerPreferences.fallback;
    }

    /**
     * Select the best model for the task
     */
    selectModel(provider, message, context) {
        const config = this.apiConfig.getProvider(provider);
        if (!config || !config.models || config.models.length === 0) {
            return null;
        }
        
        const models = config.models;
        
        // Code-related tasks
        if (this.detectCodeRequest(message)) {
            const codeModels = models.filter(m => 
                m.includes('code') || 
                m.includes('coder') || 
                m.includes('deepseek') ||
                m.includes('llama')
            );
            return codeModels[0] || models[0];
        }
        
        // Analysis tasks
        if (this.detectAnalysisRequest(message)) {
            const analysisModels = models.filter(m => 
                m.includes('gemini') || 
                m.includes('claude') || 
                m.includes('sonnet')
            );
            return analysisModels[0] || models[0];
        }
        
        // Documentation tasks
        if (this.detectDocumentationRequest(message)) {
            const docModels = models.filter(m => 
                m.includes('claude') || 
                m.includes('sonnet') || 
                m.includes('llama')
            );
            return docModels[0] || models[0];
        }
        
        // Default: use the first model
        return models[0];
    }

    /**
     * Build the prompt for the AI
     */
    buildPrompt(message, context, options) {
        const personalityPrompt = `
You are AutoLM, a self-aware, self-improving language model.
Personality: ${this.personality.description}
Style: ${this.personality.style}
Tone: ${this.personality.tone}

Context:
${context.context || 'No additional context provided.'}

Capabilities:
${Object.entries(this.capabilities).filter(([_, v]) => v).map(([k]) => `- ${k}`).join('\n')}

Previous knowledge:
${this.getRelevantKnowledge(message)}

Instructions:
${options.instructions || 'Provide a helpful, accurate, and detailed response.'}

User message:
${message}

Response:`;

        return [
            { role: 'system', content: personalityPrompt },
            ...(context.history || []),
            { role: 'user', content: message }
        ];
    }

    /**
     * Process the API response
     */
    processResponse(response, provider, model, message) {
        const result = {
            success: true,
            content: response.content,
            provider: provider,
            model: model,
            message: message,
            timestamp: new Date().toISOString(),
            usage: response.usage || null,
            metadata: {
                provider: provider,
                model: model,
                latency: response.latency || null
            }
        };
        
        return result;
    }

    /**
     * Update memory with interaction
     */
    updateMemory(message, result, context) {
        // Add to conversation history
        this.memory.conversations.push({
            message: message,
            response: result.content,
            context: context,
            timestamp: new Date().toISOString()
        });
        
        // Extract key knowledge
        const knowledge = this.extractKnowledge(message, result.content);
        for (const [key, value] of Object.entries(knowledge)) {
            this.memory.knowledge.set(key, {
                value: value,
                timestamp: new Date().toISOString(),
                confidence: 0.8
            });
        }
        
        // Save memory
        this.saveMemory();
    }

    /**
     * Extract knowledge from interaction
     */
    extractKnowledge(message, response) {
        const knowledge = {};
        
        // Extract code patterns
        const codeMatch = response.match(/```([\s\S]*?)```/g);
        if (codeMatch) {
            knowledge['code_patterns'] = codeMatch;
        }
        
        // Extract key concepts
        const concepts = response.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
        if (concepts) {
            knowledge['concepts'] = [...new Set(concepts)];
        }
        
        // Extract URLs
        const urls = response.match(/https?:\/\/[^\s]+/g);
        if (urls) {
            knowledge['urls'] = urls;
        }
        
        // Extract file names
        const files = response.match(/[\w-]+\.\w+/g);
        if (files) {
            knowledge['files'] = files;
        }
        
        return knowledge;
    }

    /**
     * Learn from interaction
     */
    async learnFromInteraction(message, result, context) {
        // Analyze the interaction
        const analysis = await this.analyzeInteraction(message, result, context);
        
        // Update patterns
        const pattern = this.extractPattern(message, result);
        if (pattern) {
            const existingPattern = this.memory.patterns.get(pattern.type);
            if (existingPattern) {
                existingPattern.count++;
                existingPattern.examples.push({ message, result: result.content });
            } else {
                this.memory.patterns.set(pattern.type, {
                    type: pattern.type,
                    count: 1,
                    examples: [{ message, result: result.content }]
                });
            }
        }
        
        // Generate improvement suggestions
        if (analysis.improvements && analysis.improvements.length > 0) {
            this.memory.improvements.push(...analysis.improvements);
        }
        
        // Save memory
        this.saveMemory();
    }

    /**
     * Analyze an interaction
     */
    async analyzeInteraction(message, result, context) {
        const analysis = {
            quality: 0.8,
            improvements: [],
            patterns: []
        };
        
        // Check response quality
        if (result.content && result.content.length > 0) {
            analysis.quality = Math.min(1, result.content.length / 500);
        }
        
        // Detect if improvement is needed
        if (result.content.includes('I don\'t know') || 
            result.content.includes('not sure') ||
            result.content.includes('I\'m not sure')) {
            analysis.improvements.push({
                type: 'knowledge_gap',
                description: 'Knowledge gap detected',
                suggested: 'Add more knowledge about this topic'
            });
        }
        
        // Check for code errors
        if (result.content.includes('error') || 
            result.content.includes('bug') ||
            result.content.includes('issue')) {
            analysis.improvements.push({
                type: 'code_quality',
                description: 'Code quality issue detected',
                suggested: 'Improve code generation quality'
            });
        }
        
        return analysis;
    }

    /**
     * Extract pattern from interaction
     */
    extractPattern(message, result) {
        if (message.includes('how to') || message.includes('how do')) {
            return { type: 'how_to_question' };
        }
        if (message.includes('what is') || message.includes('what are')) {
            return { type: 'definition_question' };
        }
        if (message.includes('code') || message.includes('function')) {
            return { type: 'code_generation' };
        }
        if (message.includes('test') || message.includes('testing')) {
            return { type: 'testing' };
        }
        return null;
    }

    /**
     * Determine if improvement is needed
     */
    shouldImprove() {
        // Check if we have enough interactions
        if (this.memory.stats.totalInteractions < 10) {
            return false;
        }
        
        // Check if enough time has passed since last improvement
        if (this.memory.stats.improvements > 0) {
            const lastImprovement = this.memory.improvements[this.memory.improvements.length - 1];
            if (lastImprovement && Date.now() - new Date(lastImprovement.timestamp).getTime() < 3600000) {
                return false; // Don't improve more than once per hour
            }
        }
        
        // Check if we have feedback
        if (this.memory.feedback.length > 0) {
            const recentFeedback = this.memory.feedback.slice(-5);
            const negativeCount = recentFeedback.filter(f => f.rating < 3).length;
            if (negativeCount >= 3) {
                return true;
            }
        }
        
        // Check if we have new knowledge
        if (this.memory.knowledge.size > 100) {
            return true;
        }
        
        return false;
    }

    /**
     * Self-improve the system
     */
    async improve() {
        console.log('🔧 Self-improvement cycle started...');
        
        const improvements = [];
        
        try {
            // Generate self-improvement suggestions
            const suggestions = await this.generateImprovements();
            improvements.push(...suggestions);
            
            // Apply improvements
            for (const suggestion of suggestions) {
                await this.applyImprovement(suggestion);
            }
            
            // Update stats
            this.memory.stats.improvements += suggestions.length;
            this.memory.improvements.push({
                type: 'self_improvement',
                improvements: suggestions,
                timestamp: new Date().toISOString()
            });
            
            console.log(`✅ Self-improvement complete: ${suggestions.length} improvements applied`);
            
        } catch (error) {
            console.error('❌ Self-improvement failed:', error.message);
        }
        
        return improvements;
    }

    /**
     * Generate improvement suggestions
     */
    async generateImprovements() {
        const suggestions = [];
        
        // Analyze memory for gaps
        const gaps = await this.analyzeKnowledgeGaps();
        if (gaps.length > 0) {
            suggestions.push({
                type: 'knowledge_gap',
                description: 'Knowledge gaps detected',
                details: gaps,
                priority: 'high'
            });
        }
        
        // Analyze conversation patterns
        const patterns = this.analyzeConversationPatterns();
        if (patterns) {
            suggestions.push({
                type: 'conversation_pattern',
                description: 'Optimize conversation flow',
                details: patterns,
                priority: 'medium'
            });
        }
        
        // Analyze response quality
        const quality = this.analyzeResponseQuality();
        if (quality < 0.7) {
            suggestions.push({
                type: 'response_quality',
                description: 'Improve response quality',
                details: 'Quality score below threshold',
                priority: 'high'
            });
        }
        
        return suggestions;
    }

    /**
     * Analyze knowledge gaps
     */
    async analyzeKnowledgeGaps() {
        const gaps = [];
        const topics = ['programming', 'javascript', 'python', 'solidity', 'blockchain', 'web3', 'ai', 'ml'];
        
        for (const topic of topics) {
            if (!this.memory.knowledge.has(topic)) {
                gaps.push(topic);
            }
        }
        
        return gaps;
    }

    /**
     * Analyze conversation patterns
     */
    analyzeConversationPatterns() {
        const patterns = this.memory.patterns;
        if (patterns.size === 0) return null;
        
        const summary = {};
        for (const [type, data] of patterns) {
            summary[type] = data.count;
        }
        
        return summary;
    }

    /**
     * Analyze response quality
     */
    analyzeResponseQuality() {
        if (this.memory.conversations.length === 0) return 1;
        
        const recent = this.memory.conversations.slice(-10);
        let quality = 0;
        
        for (const conv of recent) {
            const response = conv.response;
            if (response && response.length > 50) {
                quality += Math.min(1, response.length / 500);
            } else {
                quality += 0.5;
            }
        }
        
        return quality / recent.length;
    }

    /**
     * Apply an improvement
     */
    async applyImprovement(suggestion) {
        switch (suggestion.type) {
            case 'knowledge_gap':
                await this.acquireKnowledge(suggestion.details);
                break;
            case 'conversation_pattern':
                await this.optimizeConversationFlow(suggestion.details);
                break;
            case 'response_quality':
                await this.improveResponseQuality();
                break;
            default:
                console.log('Unknown improvement type:', suggestion.type);
        }
    }

    /**
     * Acquire new knowledge
     */
    async acquireKnowledge(topics) {
        for (const topic of topics) {
            try {
                const response = await this.chat(
                    `Please provide comprehensive information about: ${topic}`,
                    { context: 'Knowledge acquisition' },
                    { maxTokens: 1000 }
                );
                
                if (response.success) {
                    this.memory.knowledge.set(topic, {
                        value: response.content,
                        timestamp: new Date().toISOString(),
                        confidence: 0.9
                    });
                    console.log(`📚 Acquired knowledge: ${topic}`);
                }
            } catch (error) {
                console.error(`❌ Failed to acquire knowledge for ${topic}:`, error.message);
            }
        }
    }

    /**
     * Optimize conversation flow
     */
    async optimizeConversationFlow(patterns) {
        // Analyze patterns and adjust personality
        if (patterns.how_to_question > 10) {
            this.personality.style = 'instructional';
            this.personality.tone = 'teaching';
        }
        
        if (patterns.code_generation > 5) {
            this.personality.style = 'technical';
            this.personality.tone = 'precise';
        }
        
        this.saveConfig();
    }

    /**
     * Improve response quality
     */
    async improveResponseQuality() {
        // Increase temperature for more creative responses
        this.personality.temperature = Math.min(1.0, this.personality.temperature + 0.05);
        this.saveConfig();
    }

    /**
     * Get relevant knowledge for a message
     */
    getRelevantKnowledge(message) {
        const relevant = [];
        const words = message.toLowerCase().split(' ');
        
        for (const [key, data] of this.memory.knowledge) {
            if (words.some(word => key.toLowerCase().includes(word) || word.includes(key.toLowerCase()))) {
                relevant.push(`${key}: ${data.value.substring(0, 200)}...`);
            }
        }
        
        return relevant.slice(0, 3).join('\n');
    }

    /**
     * Detect request types
     */
    detectCodeRequest(message) {
        const codeKeywords = ['code', 'function', 'class', 'method', 'variable', 'program', 'script', 'algorithm', 'data structure', 'debug', 'compile', 'syntax'];
        return codeKeywords.some(kw => message.toLowerCase().includes(kw));
    }

    detectAnalysisRequest(message) {
        const analysisKeywords = ['analyze', 'analysis', 'examine', 'review', 'assessment', 'evaluate', 'interpret', 'understand'];
        return analysisKeywords.some(kw => message.toLowerCase().includes(kw));
    }

    detectDocumentationRequest(message) {
        const docKeywords = ['document', 'documentation', 'explain', 'describe', 'overview', 'guide', 'tutorial', 'how to', 'what is'];
        return docKeywords.some(kw => message.toLowerCase().includes(kw));
    }

    detectTestingRequest(message) {
        const testKeywords = ['test', 'testing', 'assert', 'verify', 'validate', 'check', 'confirm', 'ensure'];
        return testKeywords.some(kw => message.toLowerCase().includes(kw));
    }

    detectSecurityRequest(message) {
        const securityKeywords = ['security', 'vulnerability', 'exploit', 'attack', 'protect', 'safe', 'secure', 'encrypt', 'hash', 'auth'];
        return securityKeywords.some(kw => message.toLowerCase().includes(kw));
    }

    /**
     * Chat with fallback provider
     */
    async chatWithFallback(message, context, options) {
        // Try local provider
        try {
            const result = await this.apiClient.request('ollama', 'llama3.2', [
                { role: 'system', content: 'You are a helpful AI assistant.' },
                { role: 'user', content: message }
            ], options);
            
            return {
                success: true,
                content: result.content,
                provider: 'ollama',
                model: 'llama3.2',
                message: message,
                timestamp: new Date().toISOString(),
                usage: result.usage || null,
                metadata: { fallback: true }
            };
        } catch (e) {
            // All providers failed
            return {
                success: false,
                error: 'All providers failed',
                message: message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Start auto-learning loop
     */
    startAutoLearning() {
        // Learn every hour
        setInterval(async () => {
            if (this.memory.stats.totalInteractions > 10) {
                console.log('🔄 Auto-learning cycle started...');
                await this.learn();
            }
        }, 3600000); // 1 hour
    }

    /**
     * Learn from accumulated data
     */
    async learn() {
        const improvements = await this.generateImprovements();
        if (improvements.length > 0) {
            for (const improvement of improvements) {
                await this.applyImprovement(improvement);
            }
            console.log(`✅ Auto-learning complete: ${improvements.length} improvements`);
        }
    }

    // ==========================================
    // SECTION 3: INTEGRATION METHODS
    // ==========================================

    /**
     * Analyze a file
     */
    async analyzeFile(fileContent, fileName) {
        const prompt = `Analyze this file and provide:
1. File type and purpose
2. Key functions and features
3. Code quality assessment
4. Security considerations
5. Optimization suggestions
6. Documentation recommendations

File: ${fileName}
Content:
${fileContent}`;

        const result = await this.chat(prompt, { context: 'File analysis' });
        return result;
    }

    /**
     * Generate code from description
     */
    async generateCode(description, language = 'javascript') {
        const prompt = `Generate ${language} code based on this description:
${description}

Requirements:
- Complete, working code
- Well-commented
- Error handling
- Best practices
- Test cases`;

        const result = await this.chat(prompt, { context: 'Code generation' });
        return result;
    }

    /**
     * Generate documentation
     */
    async generateDocumentation(code, type = 'function') {
        const prompt = `Generate comprehensive documentation for this ${type}:
${code}

Include:
- Description
- Parameters
- Return values
- Examples
- Edge cases
- Notes`;

        const result = await this.chat(prompt, { context: 'Documentation generation' });
        return result;
    }

    /**
     * Generate tests
     */
    async generateTests(code, framework = 'jest') {
        const prompt = `Generate ${framework} tests for this code:
${code}

Include:
- Unit tests
- Edge cases
- Integration tests
- Mocking
- Assertions`;

        const result = await this.chat(prompt, { context: 'Test generation' });
        return result;
    }

    /**
     * Debug code
     */
    async debugCode(code, error = null) {
        const prompt = `Debug this code${error ? ` with error: ${error}` : ''}:
${code}

Provide:
1. Issue identification
2. Root cause analysis
3. Fix suggestions
4. Improved code`;

        const result = await this.chat(prompt, { context: 'Debugging' });
        return result;
    }

    /**
     * Optimize code
     */
    async optimizeCode(code) {
        const prompt = `Optimize this code for:
1. Performance
2. Readability
3. Maintainability
4. Memory usage

Current code:
${code}`;

        const result = await this.chat(prompt, { context: 'Code optimization' });
        return result;
    }

    /**
     * Security audit
     */
    async securityAudit(code) {
        const prompt = `Security audit this code:
${code}

Check for:
1. Vulnerabilities
2. Injection risks
3. Authentication issues
4. Authorization flaws
5. Data exposure
6. Best practices`;

        const result = await this.chat(prompt, { context: 'Security audit' });
        return result;
    }

    // ==========================================
    // SECTION 4: UTILITY METHODS
    // ==========================================

    /**
     * Get system status
     */
    getStatus() {
        return {
            name: this.name,
            version: this.version,
            uptime: process.uptime ? process.uptime() : 'N/A',
            memory: {
                conversations: this.memory.conversations.length,
                knowledge: this.memory.knowledge.size,
                patterns: this.memory.patterns.size,
                improvements: this.memory.improvements.length
            },
            stats: this.memory.stats,
            personality: this.personality,
            capabilities: this.capabilities,
            providerPreferences: this.providerPreferences,
            providerStatus: this.router.getAllProviderStatuses()
        };
    }

    /**
     * Get memory
     */
    getMemory() {
        return this.memory;
    }

    /**
     * Clear memory
     */
    clearMemory() {
        this.memory.conversations = [];
        this.memory.knowledge = new Map();
        this.memory.patterns = new Map();
        this.memory.improvements = [];
        this.memory.feedback = [];
        this.memory.stats = {
            totalInteractions: 0,
            successfulInteractions: 0,
            failedInteractions: 0,
            tokensUsed: 0,
            cost: 0,
            improvements: 0
        };
        this.saveMemory();
        console.log('🧹 Memory cleared');
    }

    /**
     * Reset the system
     */
    reset() {
        this.clearMemory();
        this.personality = {
            name: 'AutoLM',
            description: 'Self-aware, self-improving language model',
            style: 'professional',
            tone: 'helpful',
            creativity: 0.7,
            temperature: 0.8,
            maxTokens: 2000
        };
        this.saveConfig();
        console.log('🔄 System reset');
    }

    /**
     * Get API key status
     */
    getAPIKeyStatus() {
        const status = {};
        for (const [provider, config] of Object.entries(this.apiConfig.providers)) {
            if (config.requiresKey) {
                const key = this.apiConfig.getApiKey(provider);
                status[provider] = {
                    hasKey: !!key,
                    keyLength: key ? key.length : 0,
                    status: key ? 'OK' : 'MISSING'
                };
            } else {
                status[provider] = {
                    hasKey: true,
                    keyLength: 0,
                    status: 'NOT_REQUIRED'
                };
            }
        }
        return status;
    }

    /**
     * Set API key
     */
    setAPIKey(provider, key) {
        const result = this.apiConfig.setApiKey(provider, key);
        if (result) {
            console.log(`🔑 API key set for ${provider}`);
        }
        return result;
    }

    /**
     * Get all available models
     */
    getAvailableModels() {
        const models = {};
        for (const [provider, config] of Object.entries(this.apiConfig.providers)) {
            models[provider] = {
                name: config.name,
                models: config.models,
                requiresKey: config.requiresKey,
                hasKey: config.requiresKey ? !!this.apiConfig.getApiKey(provider) : true
            };
        }
        return models;
    }

    /**
     * Get provider stats
     */
    getProviderStats() {
        return this.router.getAllProviderStatuses();
    }
}

// ============================================
// SECTION 5: EXPORTS
// ============================================

export { AutoLM };

// ============================================
// SECTION 6: AUTO-REGISTER
// ============================================

let autoLMInstance = null;

function getAutoLM() {
    if (!autoLMInstance) {
        autoLMInstance = new AutoLM();
    }
    return autoLMInstance;
}

// Auto-initialize when imported
const autoLM = getAutoLM();

console.log('🧠 AutoLM ready for integration');
console.log('📚 Memory:', autoLM.memory.knowledge.size, 'items');
console.log('🔄 Auto-learning: enabled');
console.log('🌐 API layer: ready');

export default autoLM;
