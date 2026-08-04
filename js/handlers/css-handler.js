// ============================================
// CSS HANDLER
// Complete CSS File Processing
// ============================================

export default class CSSHandler {
    constructor() {
        // ==========================================
        // CSS PATTERNS
        // ==========================================
        this.patterns = {
            // Comments
            comment: /\/\*[\s\S]*?\*\//g,
            
            // Selectors
            selector: /[.#]?[a-zA-Z_-][^{]*/g,
            idSelector: /#([a-zA-Z_-][a-zA-Z0-9_-]*)/g,
            classSelector: /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g,
            elementSelector: /^[a-zA-Z][a-zA-Z0-9]*/gm,
            attributeSelector: /\[([a-zA-Z-]+)(?:[~|^$*]?=)["']?([^"'\]]*)["']?\]/g,
            pseudoClass: /:([a-zA-Z-]+)/g,
            pseudoElement: /::([a-zA-Z-]+)/g,
            combinator: /[+>~]\s*/g,
            descendant: /\s+/g,
            
            // Properties
            property: /([a-zA-Z-]+)\s*:/g,
            value: /:\s*([^;]+)/g,
            important: /!important/g,
            
            // At-rules
            atRule: /@([a-zA-Z-]+)\s*/g,
            mediaQuery: /@media\s+([^{]+){/g,
            keyframes: /@keyframes\s+([a-zA-Z-]+)\s*{/g,
            import: /@import\s+['"]([^'"]+)['"]/g,
            fontFace: /@font-face\s*{/g,
            supports: /@supports\s+([^{]+){/g,
            document: /@document\s+([^{]+){/g,
            page: /@page\s+([^{]+){/g,
            viewport: /@viewport\s*{/g,
            counterStyle: /@counter-style\s+([a-zA-Z-]+)\s*{/g,
            
            // Units
            px: /\b(\d+)px\b/g,
            em: /\b(\d+)em\b/g,
            rem: /\b(\d+)rem\b/g,
            percent: /\b(\d+)%\b/g,
            vw: /\b(\d+)vw\b/g,
            vh: /\b(\d+)vh\b/g,
            vmin: /\b(\d+)vmin\b/g,
            vmax: /\b(\d+)vmax\b/g,
            ch: /\b(\d+)ch\b/g,
            ex: /\b(\d+)ex\b/g,
            
            // Colors
            hexColor: /#([0-9a-f]{3,6})/gi,
            rgbColor: /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
            rgbaColor: /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/g,
            hslColor: /hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/g,
            hslaColor: /hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d.]+)\s*\)/g,
            namedColor: /\b(red|blue|green|yellow|black|white|purple|orange|pink|brown|gray|cyan|magenta|lime|teal|indigo|violet|gold|silver)\b/gi,
            
            // Variables
            customProperty: /--([a-zA-Z-]+)/g,
            varFunction: /var\(\s*--([a-zA-Z-]+)\s*(?:,\s*([^)]+))?\s*\)/g,
            
            // Functions
            calc: /calc\([^)]+\)/g,
            url: /url\(['"]?([^'"()]+)['"]?\)/g,
            gradient: /(linear|radial|conic)-gradient\([^)]+\)/g,
            
            // Flexbox
            flex: /\bflex\b/g,
            flexDirection: /flex-direction\s*:/g,
            flexWrap: /flex-wrap\s*:/g,
            justifyContent: /justify-content\s*:/g,
            alignItems: /align-items\s*:/g,
            alignContent: /align-content\s*:/g,
            flexGrow: /flex-grow\s*:/g,
            flexShrink: /flex-shrink\s*:/g,
            flexBasis: /flex-basis\s*:/g,
            order: /order\s*:/g,
            
            // Grid
            grid: /\bgrid\b/g,
            gridTemplateColumns: /grid-template-columns\s*:/g,
            gridTemplateRows: /grid-template-rows\s*:/g,
            gridGap: /grid-gap\s*:/g,
            gridColumn: /grid-column\s*:/g,
            gridRow: /grid-row\s*:/g,
            gridArea: /grid-area\s*:/g,
            
            // Animation
            animation: /\banimation\b/g,
            animationName: /animation-name\s*:/g,
            animationDuration: /animation-duration\s*:/g,
            animationTimingFunction: /animation-timing-function\s*:/g,
            animationDelay: /animation-delay\s*:/g,
            animationIterationCount: /animation-iteration-count\s*:/g,
            animationDirection: /animation-direction\s*:/g,
            animationFillMode: /animation-fill-mode\s*:/g,
            transition: /\btransition\b/g,
            transitionProperty: /transition-property\s*:/g,
            transitionDuration: /transition-duration\s*:/g,
            transitionTimingFunction: /transition-timing-function\s*:/g,
            transitionDelay: /transition-delay\s*:/g,
            
            // Transform
            transform: /\btransform\b/g,
            transformOrigin: /transform-origin\s*:/g,
            
            // Vendor prefixes
            webkit: /-webkit-/g,
            moz: /-moz-/g,
            ms: /-ms-/g,
            o: /-o-/g,
            
            // Specific properties
            boxShadow: /box-shadow\s*:/g,
            textShadow: /text-shadow\s*:/g,
            borderRadius: /border-radius\s*:/g,
            background: /background\s*:/g,
            backgroundImage: /background-image\s*:/g,
            position: /position\s*:/g,
            display: /display\s*:/g,
            width: /width\s*:/g,
            height: /height\s*:/g,
            margin: /margin\s*:/g,
            padding: /padding\s*:/g,
            border: /border\s*:/g,
            color: /color\s*:/g,
            fontSize: /font-size\s*:/g,
            fontFamily: /font-family\s*:/g,
            fontWeight: /font-weight\s*:/g,
            lineHeight: /line-height\s*:/g,
            textAlign: /text-align\s*:/g,
            textDecoration: /text-decoration\s*:/g,
            opacity: /opacity\s*:/g,
            zIndex: /z-index\s*:/g,
            overflow: /overflow\s*:/g,
            cursor: /cursor\s*:/g,
            pointerEvents: /pointer-events\s*:/g,
            userSelect: /user-select\s*:/g,
            
            // Browser prefixes for specific properties
            prefixedBoxShadow: /-(webkit|moz|ms|o)-box-shadow/g,
            prefixedBorderRadius: /-(webkit|moz|ms|o)-border-radius/g,
            prefixedTransform: /-(webkit|moz|ms|o)-transform/g,
            prefixedTransition: /-(webkit|moz|ms|o)-transition/g,
            prefixedAnimation: /-(webkit|moz|ms|o)-animation/g,
            prefixedFlex: /-(webkit|moz|ms|o)-flex/g,
            prefixedGrid: /-(webkit|moz|ms|o)-grid/g,
            
            // CSS variables usage
            varUsage: /var\(\s*--[a-zA-Z-]+\s*\)/g,
            
            // Dark mode detection
            prefersDark: /@media\s*\(prefers-color-scheme:\s*dark\)/g,
            prefersLight: /@media\s*\(prefers-color-scheme:\s*light\)/g,
            
            // Print styles
            printMedia: /@media\s*print/g,
            
            // Accessibility
            prefersReducedMotion: /@media\s*\(prefers-reduced-motion:\s*reduce\)/g,
            
            // Container queries
            containerQuery: /@container\s+([^{]+){/g
        };
        
        // ==========================================
        // CSS PROPERTIES CATEGORIES
        // ==========================================
        this.propertyCategories = {
            layout: ['display', 'position', 'float', 'clear', 'overflow', 'z-index'],
            flexbox: ['flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 
                     'align-content', 'flex-grow', 'flex-shrink', 'flex-basis', 'order'],
            grid: ['grid', 'grid-template', 'grid-template-columns', 'grid-template-rows', 
                   'grid-gap', 'grid-column', 'grid-row', 'grid-area'],
            boxModel: ['width', 'height', 'max-width', 'max-height', 'min-width', 'min-height',
                      'margin', 'padding', 'border', 'box-sizing', 'outline'],
            typography: ['font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
                        'text-align', 'text-decoration', 'text-transform', 'letter-spacing',
                        'word-spacing', 'color', 'white-space'],
            background: ['background', 'background-color', 'background-image', 'background-position',
                        'background-size', 'background-repeat', 'background-attachment'],
            animation: ['animation', 'animation-name', 'animation-duration', 'animation-timing-function',
                       'animation-delay', 'animation-iteration-count', 'animation-direction',
                       'animation-fill-mode', 'transition', 'transition-property', 'transition-duration',
                       'transition-timing-function', 'transition-delay', 'transform', 'transform-origin'],
            effects: ['box-shadow', 'text-shadow', 'filter', 'backdrop-filter', 'opacity'],
            misc: ['cursor', 'pointer-events', 'user-select', 'touch-action', 'will-change']
        };
        
        // ==========================================
        // CSS UNITS
        // ==========================================
        this.units = {
            absolute: ['px', 'pt', 'pc', 'in', 'cm', 'mm'],
            relative: ['em', 'rem', '%', 'vw', 'vh', 'vmin', 'vmax', 'ch', 'ex'],
            flexible: ['fr', 'auto'],
            angle: ['deg', 'rad', 'grad', 'turn'],
            time: ['s', 'ms'],
            frequency: ['Hz', 'kHz'],
            resolution: ['dpi', 'dpcm', 'dppx']
        };
        
        // ==========================================
        // CSS COLOR NAMES
        // ==========================================
        this.colorNames = [
            'red', 'blue', 'green', 'yellow', 'black', 'white', 'purple', 'orange',
            'pink', 'brown', 'gray', 'grey', 'cyan', 'magenta', 'lime', 'teal',
            'indigo', 'violet', 'gold', 'silver', 'maroon', 'navy', 'olive', 'coral',
            'crimson', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen',
            'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange',
            'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue',
            'darkslategray', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue',
            'dimgray', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen',
            'fuchsia', 'gainsboro', 'ghostwhite', 'goldenrod', 'greenyellow',
            'honeydew', 'hotpink', 'indianred', 'ivory', 'khaki', 'lavender',
            'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral',
            'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey',
            'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray',
            'lightsteelblue', 'lightyellow', 'limegreen', 'linen', 'mediumaquamarine',
            'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue',
            'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue',
            'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'oldlace', 'olivedrab'
        ];
        
        // ==========================================
        // RESPONSIVE BREAKPOINTS
        // ==========================================
        this.breakpoints = {
            xs: { min: 0, max: 480, name: 'xs' },
            sm: { min: 481, max: 768, name: 'sm' },
            md: { min: 769, max: 1024, name: 'md' },
            lg: { min: 1025, max: 1280, name: 'lg' },
            xl: { min: 1281, max: Infinity, name: 'xl' }
        };
    }

    // ==========================================
    // MAIN ANALYSIS
    // ==========================================
    analyze(content, filename) {
        const analysis = {
            type: 'css',
            name: filename,
            lines: content.split('\n').length,
            characters: content.length,
            timestamp: new Date().toISOString(),
            
            // Structure
            structure: this.analyzeStructure(content),
            selectors: this.analyzeSelectors(content),
            properties: this.analyzeProperties(content),
            values: this.analyzeValues(content),
            
            // At-rules
            atRules: this.analyzeAtRules(content),
            
            // Features
            features: this.analyzeFeatures(content),
            
            // Quality
            quality: this.analyzeQuality(content),
            
            // Performance
            performance: this.analyzePerformance(content),
            
            // Vendor prefixes
            prefixes: this.analyzePrefixes(content),
            
            // Responsive design
            responsive: this.analyzeResponsive(content),
            
            // Accessibility
            accessibility: this.analyzeAccessibility(content),
            
            // Preview
            preview: this.getPreview(content, 200)
        };
        
        // Calculate overall score
        analysis.score = this.calculateScore(analysis);
        analysis.complexity = this.calculateComplexity(analysis);
        
        return analysis;
    }

    // ==========================================
    // STRUCTURE ANALYSIS
    // ==========================================
    analyzeStructure(content) {
        const rules = content.match(/[.#]?[a-zA-Z_-][^{]*\{[^}]*\}/g) || [];
        
        return {
            ruleCount: rules.length,
            hasNesting: this.hasNesting(content),
            hasComments: this.patterns.comment.test(content),
            hasVariables: this.patterns.customProperty.test(content),
            hasImports: this.patterns.import.test(content)
        };
    }

    // ==========================================
    // SELECTOR ANALYSIS
    // ==========================================
    analyzeSelectors(content) {
        const selectors = {
            total: 0,
            byType: {
                id: 0,
                class: 0,
                element: 0,
                attribute: 0,
                pseudo: 0,
                combinator: 0
            },
            complexity: {
                simple: 0,
                medium: 0,
                complex: 0
            },
            list: []
        };

        const matches = content.match(this.patterns.selector) || [];
        selectors.total = matches.length;

        for (const selector of matches) {
            const clean = selector.trim();
            if (!clean) continue;
            
            selectors.list.push(clean);
            
            // Count types
            if (this.patterns.idSelector.test(clean)) {
                selectors.byType.id++;
                this.patterns.idSelector.lastIndex = 0;
            }
            if (this.patterns.classSelector.test(clean)) {
                selectors.byType.class++;
                this.patterns.classSelector.lastIndex = 0;
            }
            if (this.patterns.elementSelector.test(clean)) {
                selectors.byType.element++;
                this.patterns.elementSelector.lastIndex = 0;
            }
            if (this.patterns.attributeSelector.test(clean)) {
                selectors.byType.attribute++;
                this.patterns.attributeSelector.lastIndex = 0;
            }
            if (this.patterns.pseudoClass.test(clean) || this.patterns.pseudoElement.test(clean)) {
                selectors.byType.pseudo++;
                this.patterns.pseudoClass.lastIndex = 0;
                this.patterns.pseudoElement.lastIndex = 0;
            }
            if (this.patterns.combinator.test(clean) || this.patterns.descendant.test(clean)) {
                selectors.byType.combinator++;
                this.patterns.combinator.lastIndex = 0;
                this.patterns.descendant.lastIndex = 0;
            }
            
            // Complexity
            const parts = clean.split(/[+>~\s]+/).length;
            if (parts <= 2) selectors.complexity.simple++;
            else if (parts <= 4) selectors.complexity.medium++;
            else selectors.complexity.complex++;
        }

        return selectors;
    }

    // ==========================================
    // PROPERTY ANALYSIS
    // ==========================================
    analyzeProperties(content) {
        const properties = {
            total: 0,
            byCategory: {},
            unique: new Set(),
            important: 0,
            vendorPrefixed: 0
        };

        // Initialize categories
        for (const [category, props] of Object.entries(this.propertyCategories)) {
            properties.byCategory[category] = 0;
        }

        const matches = content.match(this.patterns.property) || [];
        properties.total = matches.length;

        for (const match of matches) {
            const prop = match.replace(/:\s*$/, '').trim();
            properties.unique.add(prop);
            
            // Check if important
            if (this.patterns.important.test(content)) {
                properties.important++;
            }
            
            // Check vendor prefix
            if (prop.startsWith('-')) {
                properties.vendorPrefixed++;
            }
            
            // Categorize
            for (const [category, props] of Object.entries(this.propertyCategories)) {
                if (props.includes(prop)) {
                    properties.byCategory[category]++;
                    break;
                }
            }
        }

        properties.uniqueCount = properties.unique.size;
        properties.unique = Array.from(properties.unique);

        return properties;
    }

    // ==========================================
    // VALUE ANALYSIS
    // ==========================================
    analyzeValues(content) {
        const values = {
            colors: {
                hex: 0,
                rgb: 0,
                rgba: 0,
                hsl: 0,
                hsla: 0,
                named: 0
            },
            units: {
                px: 0,
                em: 0,
                rem: 0,
                percent: 0,
                vw: 0,
                vh: 0,
                vmin: 0,
                vmax: 0,
                ch: 0,
                ex: 0,
                fr: 0,
                auto: 0,
                other: 0
            },
            functions: {
                calc: 0,
                url: 0,
                gradient: 0,
                var: 0
            }
        };

        // Count colors
        values.colors.hex = (content.match(this.patterns.hexColor) || []).length;
        values.colors.rgb = (content.match(this.patterns.rgbColor) || []).length;
        values.colors.rgba = (content.match(this.patterns.rgbaColor) || []).length;
        values.colors.hsl = (content.match(this.patterns.hslColor) || []).length;
        values.colors.hsla = (content.match(this.patterns.hslaColor) || []).length;
        values.colors.named = (content.match(this.patterns.namedColor) || []).length;

        // Count units
        values.units.px = (content.match(this.patterns.px) || []).length;
        values.units.em = (content.match(this.patterns.em) || []).length;
        values.units.rem = (content.match(this.patterns.rem) || []).length;
        values.units.percent = (content.match(this.patterns.percent) || []).length;
        values.units.vw = (content.match(this.patterns.vw) || []).length;
        values.units.vh = (content.match(this.patterns.vh) || []).length;
        values.units.vmin = (content.match(this.patterns.vmin) || []).length;
        values.units.vmax = (content.match(this.patterns.vmax) || []).length;
        values.units.ch = (content.match(this.patterns.ch) || []).length;
        values.units.ex = (content.match(this.patterns.ex) || []).length;

        // Count functions
        values.functions.calc = (content.match(this.patterns.calc) || []).length;
        values.functions.url = (content.match(this.patterns.url) || []).length;
        values.functions.gradient = (content.match(this.patterns.gradient) || []).length;
        values.functions.var = (content.match(this.patterns.varFunction) || []).length;

        return values;
    }

    // ==========================================
    // AT-RULES ANALYSIS
    // ==========================================
    analyzeAtRules(content) {
        return {
            media: (content.match(this.patterns.mediaQuery) || []).length,
            keyframes: (content.match(this.patterns.keyframes) || []).length,
            imports: (content.match(this.patterns.import) || []).length,
            fontFace: (content.match(this.patterns.fontFace) || []).length,
            supports: (content.match(this.patterns.supports) || []).length,
            document: (content.match(this.patterns.document) || []).length,
            page: (content.match(this.patterns.page) || []).length,
            viewport: (content.match(this.patterns.viewport) || []).length,
            counterStyle: (content.match(this.patterns.counterStyle) || []).length,
            container: (content.match(this.patterns.containerQuery) || []).length,
            total: 0
        };
        
        const atRules = arguments[0];
        atRules.total = atRules.media + atRules.keyframes + atRules.imports + 
                       atRules.fontFace + atRules.supports + atRules.document +
                       atRules.page + atRules.viewport + atRules.counterStyle +
                       atRules.container;
        
        return atRules;
    }

    // ==========================================
    // FEATURES ANALYSIS
    // ==========================================
    analyzeFeatures(content) {
        const features = {
            flexbox: false,
            grid: false,
            animation: false,
            transition: false,
            transform: false,
            variables: false,
            gradients: false,
            shadows: false,
            filters: false,
            containers: false
        };

        features.flexbox = this.patterns.flex.test(content) || 
                           this.patterns.flexDirection.test(content);
        features.grid = this.patterns.grid.test(content) || 
                        this.patterns.gridTemplateColumns.test(content);
        features.animation = this.patterns.animation.test(content) || 
                             this.patterns.animationName.test(content);
        features.transition = this.patterns.transition.test(content);
        features.transform = this.patterns.transform.test(content);
        features.variables = this.patterns.customProperty.test(content);
        features.gradients = this.patterns.gradient.test(content);
        features.shadows = this.patterns.boxShadow.test(content) || 
                          this.patterns.textShadow.test(content);
        features.filters = content.includes('filter:');
        features.containers = this.patterns.containerQuery.test(content);

        return features;
    }

    // ==========================================
    // QUALITY ANALYSIS
    // ==========================================
    analyzeQuality(content) {
        const issues = [];
        let score = 100;

        // Check for !important overuse
        const importantCount = (content.match(this.patterns.important) || []).length;
        if (importantCount > 5) {
            issues.push(`Excessive !important usage (${importantCount})`);
            score -= Math.min(importantCount * 2, 20);
        }

        // Check for duplicate selectors
        const selectors = content.match(this.patterns.selector) || [];
        const uniqueSelectors = new Set(selectors);
        if (selectors.length > uniqueSelectors.size) {
            issues.push('Duplicate selectors found');
            score -= 5;
        }

        // Check for empty rules
        const rules = content.match(/[.#]?[a-zA-Z_-][^{]*\{\s*\}/g) || [];
        if (rules.length > 0) {
            issues.push(`Empty rules found (${rules.length})`);
            score -= Math.min(rules.length, 10);
        }

        // Check for overly specific selectors
        const complexSelectors = selectors.filter(s => s.split(/[+>~\s]+/).length > 4);
        if (complexSelectors.length > 0) {
            issues.push(`Overly specific selectors found (${complexSelectors.length})`);
            score -= 5;
        }

        // Check for missing vendor prefixes
        const hasPrefixes = this.patterns.webkit.test(content) || 
                           this.patterns.moz.test(content) || 
                           this.patterns.ms.test(content) || 
                           this.patterns.o.test(content);
        if (!hasPrefixes && content.length > 100) {
            issues.push('No vendor prefixes found - may not work in all browsers');
            score -= 5;
        }

        // Check for comments
        const comments = (content.match(this.patterns.comment) || []).length;
        const lines = content.split('\n').length;
        if (comments < lines * 0.01 && content.length > 1000) {
            issues.push('Limited comments - consider adding documentation');
            score -= 2;
        }

        return {
            issues: issues,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: issues.length > 0
        };
    }

    // ==========================================
    // PERFORMANCE ANALYSIS
    // ==========================================
    analyzePerformance(content) {
        const issues = [];
        let score = 100;

        // Check file size
        if (content.length > 100000) {
            issues.push('Large CSS file (>100KB) - consider splitting');
            score -= 10;
        }

        // Check for unused selectors (simplified check)
        const selectors = content.match(/[.#]?[a-zA-Z_-][^{]*/g) || [];
        const uniqueSelectors = new Set(selectors);
        if (selectors.length > uniqueSelectors.size * 1.5) {
            issues.push('Potential unused selectors - consider removing duplicates');
            score -= 5;
        }

        // Check for excessive nesting
        if (this.hasNesting(content)) {
            issues.push('Nested selectors found - may impact performance');
            score -= 5;
        }

        // Check for complex selectors
        const complexSelectors = selectors.filter(s => s.split(/[+>~\s]+/).length > 4);
        if (complexSelectors.length > selectors.length * 0.1) {
            issues.push('Many complex selectors - may impact performance');
            score -= 5;
        }

        // Check for @import
        if (this.patterns.import.test(content)) {
            issues.push('@import used - may cause render blocking');
            score -= 5;
        }

        // Check for unminified CSS (comments and whitespace)
        const comments = (content.match(this.patterns.comment) || []).length;
        if (comments > 10) {
            issues.push('Unminified CSS - consider removing comments for production');
            score -= 3;
        }

        return {
            issues: issues,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: issues.length > 0
        };
    }

    // ==========================================
    // VENDOR PREFIX ANALYSIS
    // ==========================================
    analyzePrefixes(content) {
        const prefixes = {
            webkit: {
                count: (content.match(this.patterns.webkit) || []).length,
                properties: this.extractPrefixedProperties(content, '-webkit-')
            },
            moz: {
                count: (content.match(this.patterns.moz) || []).length,
                properties: this.extractPrefixedProperties(content, '-moz-')
            },
            ms: {
                count: (content.match(this.patterns.ms) || []).length,
                properties: this.extractPrefixedProperties(content, '-ms-')
            },
            o: {
                count: (content.match(this.patterns.o) || []).length,
                properties: this.extractPrefixedProperties(content, '-o-')
            },
            total: 0
        };

        prefixes.total = prefixes.webkit.count + prefixes.moz.count + 
                        prefixes.ms.count + prefixes.o.count;

        return prefixes;
    }

    // ==========================================
    // RESPONSIVE ANALYSIS
    // ==========================================
    analyzeResponsive(content) {
        const responsive = {
            breakpoints: {},
            mediaQueries: [],
            hasMobileFirst: false,
            hasDesktopFirst: false,
            hasDarkMode: this.patterns.prefersDark.test(content),
            hasLightMode: this.patterns.prefersLight.test(content),
            hasPrintStyles: this.patterns.printMedia.test(content),
            hasReducedMotion: this.patterns.prefersReducedMotion.test(content)
        };

        // Extract media queries
        const mediaMatches = content.match(this.patterns.mediaQuery) || [];
        for (const match of mediaMatches) {
            const condition = match.match(/@media\s+([^{]+){/);
            if (condition) {
                responsive.mediaQueries.push(condition[1].trim());
                
                // Check for min-width (mobile-first)
                if (condition[1].includes('min-width')) {
                    responsive.hasMobileFirst = true;
                }
                // Check for max-width (desktop-first)
                if (condition[1].includes('max-width')) {
                    responsive.hasDesktopFirst = true;
                }
            }
        }

        // Count breakpoints
        const breakpointNames = ['xs', 'sm', 'md', 'lg', 'xl'];
        for (const name of breakpointNames) {
            const breakpoint = this.breakpoints[name];
            const regex = new RegExp(`(min|max)-width:\\s*${breakpoint.min}(px|em|rem)`);
            responsive.breakpoints[name] = regex.test(content);
        }

        return responsive;
    }

    // ==========================================
    // ACCESSIBILITY ANALYSIS
    // ==========================================
    analyzeAccessibility(content) {
        const checks = {
            passed: [],
            failed: [],
            warnings: []
        };
        let score = 100;

        // Check for reduced motion support
        if (this.patterns.prefersReducedMotion.test(content)) {
            checks.passed.push('Reduced motion support detected');
        } else {
            checks.warnings.push('No prefers-reduced-motion support');
            score -= 5;
        }

        // Check for high contrast
        const highContrast = content.includes('prefers-contrast');
        if (highContrast) {
            checks.passed.push('High contrast support detected');
        } else {
            checks.warnings.push('No prefers-contrast support');
            score -= 3;
        }

        // Check for focus styles
        if (content.includes(':focus') || content.includes(':focus-visible')) {
            checks.passed.push('Focus styles detected');
        } else {
            checks.warnings.push('No focus styles found - accessibility issue');
            score -= 10;
        }

        // Check for color contrast (simplified)
        const colorCount = (content.match(this.patterns.color) || []).length;
        const bgColorCount = (content.match(/background-color\s*:/g) || []).length;
        if (colorCount > 0 && bgColorCount === 0) {
            checks.warnings.push('Colors without background colors - potential contrast issues');
            score -= 5;
        }

        // Check for animations that might cause issues
        if (this.patterns.animationName.test(content)) {
            checks.warnings.push('Animations found - ensure they respect reduced motion');
            score -= 3;
        }

        return {
            checks: checks,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: checks.failed.length > 0 || checks.warnings.length > 0
        };
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================
    
    hasNesting(content) {
        // Check for nested selectors (simplified)
        const lines = content.split('\n');
        let depth = 0;
        for (const line of lines) {
            if (line.includes('{')) depth++;
            if (line.includes('}')) depth--;
            if (depth > 1) return true;
        }
        return false;
    }

    extractPrefixedProperties(content, prefix) {
        const properties = [];
        const regex = new RegExp(`${prefix}([a-zA-Z-]+)\\s*:`, 'g');
        const matches = content.match(regex) || [];
        for (const match of matches) {
            const prop = match.replace(/:\s*$/, '').trim();
            properties.push(prop);
        }
        return properties;
    }

    getPreview(content, length = 200) {
        // Remove comments for preview
        let preview = content.replace(this.patterns.comment, '');
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
        
        // Performance penalties
        if (analysis.performance.hasIssues) {
            score -= analysis.performance.issues.length * 2;
        }
        
        // Accessibility penalties
        if (analysis.accessibility.hasIssues) {
            score -= 5;
        }
        
        // Add bonuses
        if (analysis.responsive.hasMobileFirst) score += 5;
        if (analysis.responsive.hasDarkMode) score += 3;
        if (analysis.features.variables) score += 3;
        if (analysis.features.flexbox) score += 3;
        if (analysis.features.grid) score += 3;
        if (analysis.features.animation) score += 2;
        if (analysis.features.transition) score += 2;
        
        // Deduct for overuse of certain features
        if (analysis.properties.important > 10) score -= 5;
        if (analysis.prefixes.total > 50) score -= 3;
        
        return Math.max(0, Math.min(100, score));
    }

    calculateComplexity(analysis) {
        const factors = {
            rules: analysis.structure.ruleCount,
            selectors: analysis.selectors.total,
            properties: analysis.properties.total,
            atRules: analysis.atRules.total,
            mediaQueries: analysis.responsive.mediaQueries.length,
            prefixes: analysis.prefixes.total
        };
        
        let complexity = 0;
        if (factors.rules > 50) complexity += 10;
        if (factors.rules > 200) complexity += 20;
        if (factors.rules > 500) complexity += 30;
        if (factors.selectors > 50) complexity += 10;
        if (factors.selectors > 200) complexity += 20;
        if (factors.properties > 100) complexity += 10;
        if (factors.properties > 500) complexity += 20;
        if (factors.atRules > 5) complexity += 10;
        if (factors.mediaQueries > 5) complexity += 10;
        if (factors.prefixes > 20) complexity += 10;
        
        if (complexity < 30) return 'simple';
        if (complexity < 60) return 'medium';
        if (complexity < 80) return 'complex';
        return 'very-complex';
    }

    // ==========================================
    // EXTRACTION METHODS
    // ==========================================
    
    extractSelectors(content) {
        const selectors = [];
        const matches = content.match(/[.#]?[a-zA-Z_-][^{]*/g) || [];
        for (const match of matches) {
            const clean = match.trim();
            if (clean) selectors.push(clean);
        }
        return selectors;
    }

    extractProperties(content) {
        const properties = [];
        const matches = content.match(this.patterns.property) || [];
        for (const match of matches) {
            const prop = match.replace(/:\s*$/, '').trim();
            if (prop) properties.push(prop);
        }
        return properties;
    }

    extractRules(content) {
        const rules = [];
        const matches = content.match(/[.#]?[a-zA-Z_-][^{]*\{[^}]*\}/g) || [];
        for (const match of matches) {
            const parts = match.match(/([^{]*)\{([^}]*)\}/);
            if (parts) {
                rules.push({
                    selector: parts[1].trim(),
                    declarations: parts[2].trim()
                });
            }
        }
        return rules;
    }

    extractMediaQueries(content) {
        const queries = [];
        const matches = content.match(this.patterns.mediaQuery) || [];
        for (const match of matches) {
            const condition = match.match(/@media\s+([^{]+){/);
            if (condition) {
                queries.push({
                    condition: condition[1].trim(),
                    content: match
                });
            }
        }
        return queries;
    }

    extractKeyframes(content) {
        const keyframes = [];
        const matches = content.match(this.patterns.keyframes) || [];
        for (const match of matches) {
            const name = match.match(/@keyframes\s+([a-zA-Z-]+)\s*{/);
            if (name) {
                keyframes.push({
                    name: name[1],
                    content: match
                });
            }
        }
        return keyframes;
    }
}

export default CSSHandler;
