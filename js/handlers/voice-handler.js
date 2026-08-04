// ============================================
// VOICE HANDLER
// Complete Voice Configuration Processing
// ============================================

export default class VoiceHandler {
    constructor() {
        // ==========================================
        // VOICE PATTERNS
        // ==========================================
        this.patterns = {
            // Voice configuration
            voiceMap: /(?:const|let|var)\s+VOICE_MAP\s*=\s*{/i,
            voiceConfig: /voice\s*[:=]\s*{/i,
            
            // Voice properties
            name: /name\s*[:=]\s*['"]([^'"]+)['"]/i,
            pattern: /pattern\s*[:=]\s*\/([^\/]+)\//i,
            language: /language\s*[:=]\s*['"]([^'"]+)['"]/i,
            gender: /gender\s*[:=]\s*['"]([^'"]+)['"]/i,
            accent: /accent\s*[:=]\s*['"]([^'"]+)['"]/i,
            pitch: /pitch\s*[:=]\s*([\d.]+)/i,
            rate: /rate\s*[:=]\s*([\d.]+)/i,
            volume: /volume\s*[:=]\s*([\d.]+)/i,
            
            // Voice types
            female: /female|woman|girl/i,
            male: /male|man|boy/i,
            child: /child|kid|young/i,
            elderly: /old|elder|grand/i,
            
            // Cuss words
            cussWords: /cuss|curse|swear|bad\s*words/i,
            
            // TTS engines
            ttsEngine: /(?:speechSynthesis|SpeechSynthesis|TTS|text-to-speech)/i,
            
            // Voice commands
            command: /command\s*[:=]\s*['"]([^'"]+)['"]/i,
            trigger: /trigger\s*[:=]\s*['"]([^'"]+)['"]/i,
            
            // Comments
            comment: /\/\/.*$/gm,
            multiLineComment: /\/\*[\s\S]*?\*\//g
        };
        
        // ==========================================
        // VOICE TYPES
        // ==========================================
        this.voiceTypes = {
            female: {
                category: 'female',
                icon: '👩',
                defaultPitch: 1.2,
                defaultRate: 1.0,
                defaultVolume: 0.8
            },
            male: {
                category: 'male',
                icon: '👨',
                defaultPitch: 0.8,
                defaultRate: 1.0,
                defaultVolume: 0.8
            },
            child: {
                category: 'child',
                icon: '👦',
                defaultPitch: 1.5,
                defaultRate: 1.2,
                defaultVolume: 0.7
            },
            elderly: {
                category: 'elderly',
                icon: '👴',
                defaultPitch: 0.6,
                defaultRate: 0.7,
                defaultVolume: 0.9
            },
            cussing: {
                category: 'cussing',
                icon: '🤬',
                defaultPitch: 1.0,
                defaultRate: 1.0,
                defaultVolume: 0.8
            }
        };
        
        // ==========================================
        // TTS ENGINES
        // ==========================================
        this.ttsEngines = {
            web: 'Web Speech API',
            google: 'Google Cloud TTS',
            amazon: 'Amazon Polly',
            microsoft: 'Azure TTS',
            ibm: 'IBM Watson TTS'
        };
    }

    // ==========================================
    // MAIN ANALYSIS
    // ==========================================
    analyze(content, filename) {
        const analysis = {
            type: 'voice',
            name: filename,
            lines: content.split('\n').length,
            characters: content.length,
            timestamp: new Date().toISOString(),
            
            // Structure
            structure: this.analyzeStructure(content),
            voices: this.analyzeVoices(content),
            
            // Configuration
            config: this.analyzeConfig(content),
            
            // Features
            features: this.analyzeFeatures(content),
            
            // Quality
            quality: this.analyzeQuality(content),
            
            // Preview
            preview: this.getPreview(content, 200)
        };
        
        // Calculate score
        analysis.score = this.calculateScore(analysis);
        
        return analysis;
    }

    // ==========================================
    // STRUCTURE ANALYSIS
    // ==========================================
    analyzeStructure(content) {
        const structure = {
            hasVoiceMap: this.patterns.voiceMap.test(content),
            hasVoiceConfig: this.patterns.voiceConfig.test(content),
            hasComments: this.patterns.comment.test(content),
            hasTtsEngine: this.patterns.ttsEngine.test(content),
            hasCommands: this.patterns.command.test(content),
            hasTriggers: this.patterns.trigger.test(content)
        };
        
        return structure;
    }

    // ==========================================
    // VOICES ANALYSIS
    // ==========================================
    analyzeVoices(content) {
        const voices = {
            total: 0,
            list: [],
            types: {
                female: 0,
                male: 0,
                child: 0,
                elderly: 0,
                cussing: 0,
                other: 0
            },
            withPatterns: 0,
            withCustomPitch: 0,
            withCustomRate: 0,
            withCustomVolume: 0
        };

        // Extract voice configurations
        const voiceMatches = content.match(/['"]([a-zA-Z]+)['"]\s*:\s*\{[^}]*\}/g) || [];
        voices.total = voiceMatches.length;

        for (const match of voiceMatches) {
            const nameMatch = match.match(/['"]([a-zA-Z]+)['"]/);
            const voiceData = {
                name: nameMatch ? nameMatch[1] : 'unknown'
            };

            // Extract properties
            const nameProp = match.match(this.patterns.name);
            if (nameProp) voiceData.displayName = nameProp[1];

            const patternProp = match.match(this.patterns.pattern);
            if (patternProp) {
                voiceData.pattern = patternProp[1];
                voices.withPatterns++;
            }

            const pitchProp = match.match(this.patterns.pitch);
            if (pitchProp) {
                voiceData.pitch = parseFloat(pitchProp[1]);
                voices.withCustomPitch++;
            }

            const rateProp = match.match(this.patterns.rate);
            if (rateProp) {
                voiceData.rate = parseFloat(rateProp[1]);
                voices.withCustomRate++;
            }

            const volumeProp = match.match(this.patterns.volume);
            if (volumeProp) {
                voiceData.volume = parseFloat(volumeProp[1]);
                voices.withCustomVolume++;
            }

            // Detect voice type
            if (this.patterns.female.test(match)) {
                voiceData.type = 'female';
                voices.types.female++;
            } else if (this.patterns.male.test(match)) {
                voiceData.type = 'male';
                voices.types.male++;
            } else if (this.patterns.child.test(match)) {
                voiceData.type = 'child';
                voices.types.child++;
            } else if (this.patterns.elderly.test(match)) {
                voiceData.type = 'elderly';
                voices.types.elderly++;
            } else if (this.patterns.cussWords.test(match)) {
                voiceData.type = 'cussing';
                voices.types.cussing++;
            } else {
                voiceData.type = 'other';
                voices.types.other++;
            }

            voices.list.push(voiceData);
        }

        return voices;
    }

    // ==========================================
    // CONFIG ANALYSIS
    // ==========================================
    analyzeConfig(content) {
        const config = {
            defaultVoice: null,
            defaultLanguage: 'en-US',
            defaultPitch: 1.0,
            defaultRate: 1.0,
            defaultVolume: 0.8,
            ttsEngine: null,
            hasCustomConfig: false
        };

        // Extract default voice
        const defaultMatch = content.match(/defaultVoice\s*[:=]\s*['"]([^'"]+)['"]/i);
        if (defaultMatch) {
            config.defaultVoice = defaultMatch[1];
            config.hasCustomConfig = true;
        }

        // Extract language
        const langMatch = content.match(/language\s*[:=]\s*['"]([^'"]+)['"]/i);
        if (langMatch) {
            config.defaultLanguage = langMatch[1];
            config.hasCustomConfig = true;
        }

        // Extract TTS engine
        const engineMatch = content.match(/ttsEngine\s*[:=]\s*['"]([^'"]+)['"]/i);
        if (engineMatch) {
            config.ttsEngine = engineMatch[1];
            config.hasCustomConfig = true;
        }

        // Extract pitch
        const pitchMatch = content.match(/defaultPitch\s*[:=]\s*([\d.]+)/i);
        if (pitchMatch) {
            config.defaultPitch = parseFloat(pitchMatch[1]);
            config.hasCustomConfig = true;
        }

        // Extract rate
        const rateMatch = content.match(/defaultRate\s*[:=]\s*([\d.]+)/i);
        if (rateMatch) {
            config.defaultRate = parseFloat(rateMatch[1]);
            config.hasCustomConfig = true;
        }

        // Extract volume
        const volumeMatch = content.match(/defaultVolume\s*[:=]\s*([\d.]+)/i);
        if (volumeMatch) {
            config.defaultVolume = parseFloat(volumeMatch[1]);
            config.hasCustomConfig = true;
        }

        return config;
    }

    // ==========================================
    // FEATURES ANALYSIS
    // ==========================================
    analyzeFeatures(content) {
        const features = {
            hasCussWords: this.patterns.cussWords.test(content),
            hasMultipleVoices: false,
            hasPatternMatching: this.patterns.pattern.test(content),
            hasCustomPitch: this.patterns.pitch.test(content),
            hasCustomRate: this.patterns.rate.test(content),
            hasCustomVolume: this.patterns.volume.test(content),
            hasCommands: this.patterns.command.test(content),
            hasTriggers: this.patterns.trigger.test(content)
        };

        // Check for multiple voices
        const voiceMatches = content.match(/['"]([a-zA-Z]+)['"]\s*:\s*\{/g) || [];
        features.hasMultipleVoices = voiceMatches.length > 1;

        return features;
    }

    // ==========================================
    // QUALITY ANALYSIS
    // ==========================================
    analyzeQuality(content) {
        const issues = [];
        let score = 100;

        // Check for voice map
        if (!this.patterns.voiceMap.test(content) && !this.patterns.voiceConfig.test(content)) {
            issues.push('No voice configuration found');
            score -= 20;
        }

        // Check for voice names
        const voiceMatches = content.match(/['"]([a-zA-Z]+)['"]\s*:\s*\{/g) || [];
        if (voiceMatches.length === 0) {
            issues.push('No voice definitions found');
            score -= 20;
        }

        // Check for patterns
        const patternMatches = content.match(this.patterns.pattern) || [];
        if (patternMatches.length === 0 && voiceMatches.length > 0) {
            issues.push('No voice patterns defined - voices may not match');
            score -= 10;
        }

        // Check for comments
        if (!this.patterns.comment.test(content)) {
            issues.push('No comments - consider documenting voice configurations');
            score -= 5;
        }

        // Check for cuss words
        if (this.patterns.cussWords.test(content)) {
            issues.push('Cuss words detected - may be inappropriate for some users');
            score -= 3;
        }

        // Check for duplicate voice names
        const names = voiceMatches.map(m => m.match(/['"]([a-zA-Z]+)['"]/)).filter(Boolean);
        const uniqueNames = new Set(names.map(n => n[1]));
        if (names.length > uniqueNames.size) {
            issues.push('Duplicate voice names detected');
            score -= 5;
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
        preview = preview.replace(this.patterns.comment, '');
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
        
        // Add bonuses
        if (analysis.structure.hasVoiceMap) score += 10;
        if (analysis.structure.hasVoiceConfig) score += 5;
        if (analysis.voices.total > 0) score += 5;
        if (analysis.voices.withPatterns > 0) score += 5;
        if (analysis.voices.withCustomPitch > 0) score += 3;
        if (analysis.voices.withCustomRate > 0) score += 3;
        if (analysis.voices.withCustomVolume > 0) score += 3;
        if (analysis.config.hasCustomConfig) score += 5;
        if (analysis.features.hasMultipleVoices) score += 5;
        if (analysis.features.hasPatternMatching) score += 3;
        
        return Math.max(0, Math.min(100, score));
    }

    // ==========================================
    // EXTRACTION METHODS
    // ==========================================
    
    extractVoices(content) {
        const voices = [];
        const matches = content.match(/['"]([a-zA-Z]+)['"]\s*:\s*\{[^}]*\}/g) || [];
        
        for (const match of matches) {
            const nameMatch = match.match(/['"]([a-zA-Z]+)['"]/);
            if (nameMatch) {
                const voice = {
                    name: nameMatch[1],
                    displayName: null,
                    pattern: null,
                    pitch: null,
                    rate: null,
                    volume: null,
                    type: 'other'
                };

                const nameProp = match.match(this.patterns.name);
                if (nameProp) voice.displayName = nameProp[1];

                const patternProp = match.match(this.patterns.pattern);
                if (patternProp) voice.pattern = patternProp[1];

                const pitchProp = match.match(this.patterns.pitch);
                if (pitchProp) voice.pitch = parseFloat(pitchProp[1]);

                const rateProp = match.match(this.patterns.rate);
                if (rateProp) voice.rate = parseFloat(rateProp[1]);

                const volumeProp = match.match(this.patterns.volume);
                if (volumeProp) voice.volume = parseFloat(volumeProp[1]);

                // Detect type
                if (this.patterns.female.test(match)) voice.type = 'female';
                else if (this.patterns.male.test(match)) voice.type = 'male';
                else if (this.patterns.child.test(match)) voice.type = 'child';
                else if (this.patterns.elderly.test(match)) voice.type = 'elderly';
                else if (this.patterns.cussWords.test(match)) voice.type = 'cussing';

                voices.push(voice);
            }
        }
        
        return voices;
    }

    extractCommands(content) {
        const commands = [];
        const matches = content.match(this.patterns.command) || [];
        for (const match of matches) {
            const cmdMatch = match.match(/['"]([^'"]+)['"]/);
            if (cmdMatch) commands.push(cmdMatch[1]);
        }
        return commands;
    }

    extractTriggers(content) {
        const triggers = [];
        const matches = content.match(this.patterns.trigger) || [];
        for (const match of matches) {
            const triggerMatch = match.match(/['"]([^'"]+)['"]/);
            if (triggerMatch) triggers.push(triggerMatch[1]);
        }
        return triggers;
    }
}

export default VoiceHandler;
