// ============================================
// HTML HANDLER
// Complete HTML File Processing
// ============================================

export default class HTMLHandler {
    constructor() {
        // ==========================================
        // HTML PATTERNS
        // ==========================================
        this.patterns = {
            // Basic structure
            doctype: /<!DOCTYPE\s+html>/i,
            htmlTag: /<html[^>]*>/i,
            headTag: /<head[^>]*>/i,
            bodyTag: /<body[^>]*>/i,
            
            // Meta tags
            meta: /<meta[^>]*>/gi,
            charset: /<meta[^>]*charset[^>]*>/i,
            viewport: /<meta[^>]*viewport[^>]*>/i,
            title: /<title[^>]*>([^<]*)<\/title>/i,
            
            // Links
            link: /<link[^>]*>/gi,
            stylesheet: /<link[^>]*rel=["']stylesheet["'][^>]*>/i,
            icon: /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/i,
            
            // Scripts
            script: /<script[^>]*>([\s\S]*?)<\/script>/gi,
            externalScript: /<script[^>]*src=["']([^"']+)["'][^>]*>/gi,
            inlineScript: /<script[^>]*>([\s\S]*?)<\/script>/gi,
            
            // Styles
            style: /<style[^>]*>([\s\S]*?)<\/style>/gi,
            inlineStyle: /style=["']([^"']*)["']/gi,
            
            // Elements
            div: /<div[^>]*>/gi,
            span: /<span[^>]*>/gi,
            p: /<p[^>]*>/gi,
            a: /<a[^>]*>/gi,
            img: /<img[^>]*>/gi,
            h1: /<h1[^>]*>/gi,
            h2: /<h2[^>]*>/gi,
            h3: /<h3[^>]*>/gi,
            h4: /<h4[^>]*>/gi,
            h5: /<h5[^>]*>/gi,
            h6: /<h6[^>]*>/gi,
            
            // Semantic HTML5
            header: /<header[^>]*>/gi,
            nav: /<nav[^>]*>/gi,
            main: /<main[^>]*>/gi,
            section: /<section[^>]*>/gi,
            article: /<article[^>]*>/gi,
            aside: /<aside[^>]*>/gi,
            footer: /<footer[^>]*>/gi,
            
            // Forms
            form: /<form[^>]*>/gi,
            input: /<input[^>]*>/gi,
            textarea: /<textarea[^>]*>/gi,
            button: /<button[^>]*>/gi,
            select: /<select[^>]*>/gi,
            option: /<option[^>]*>/gi,
            label: /<label[^>]*>/gi,
            
            // Lists
            ul: /<ul[^>]*>/gi,
            ol: /<ol[^>]*>/gi,
            li: /<li[^>]*>/gi,
            
            // Tables
            table: /<table[^>]*>/gi,
            tr: /<tr[^>]*>/gi,
            td: /<td[^>]*>/gi,
            th: /<th[^>]*>/gi,
            thead: /<thead[^>]*>/gi,
            tbody: /<tbody[^>]*>/gi,
            tfoot: /<tfoot[^>]*>/gi,
            
            // Media
            video: /<video[^>]*>/gi,
            audio: /<audio[^>]*>/gi,
            source: /<source[^>]*>/gi,
            iframe: /<iframe[^>]*>/gi,
            embed: /<embed[^>]*>/gi,
            object: /<object[^>]*>/gi,
            
            // Comments
            comment: /<!--[\s\S]*?-->/g,
            
            // Attributes
            id: /id=["']([^"']*)["']/gi,
            class: /class=["']([^"']*)["']/gi,
            src: /src=["']([^"']*)["']/gi,
            href: /href=["']([^"']*)["']/gi,
            alt: /alt=["']([^"']*)["']/gi,
            title: /title=["']([^"']*)["']/gi,
            data: /data-[a-zA-Z-]+=["']([^"']*)["']/gi,
            aria: /aria-[a-zA-Z-]+=["']([^"']*)["']/gi,
            role: /role=["']([^"']*)["']/gi,
            
            // Whitespace
            whitespace: /\s+/g,
            newline: /\n/g
        };
        
        // ==========================================
        // SEMANTIC ELEMENTS
        // ==========================================
        this.semanticElements = [
            'header', 'nav', 'main', 'section', 'article', 'aside', 'footer',
            'figure', 'figcaption', 'mark', 'time', 'details', 'summary'
        ];
        
        // ==========================================
        // VOID ELEMENTS (self-closing)
        // ==========================================
        this.voidElements = [
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'
        ];
        
        // ==========================================
        // ACCESSIBILITY ROLES
        // ==========================================
        this.ariaRoles = [
            'alert', 'alertdialog', 'application', 'article', 'banner',
            'button', 'cell', 'checkbox', 'columnheader', 'combobox',
            'complementary', 'contentinfo', 'definition', 'dialog', 'directory',
            'document', 'feed', 'figure', 'form', 'grid', 'gridcell',
            'group', 'heading', 'img', 'link', 'list', 'listbox',
            'listitem', 'log', 'main', 'marquee', 'math', 'menu',
            'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
            'navigation', 'none', 'note', 'option', 'presentation',
            'progressbar', 'radio', 'radiogroup', 'region', 'row',
            'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox',
            'separator', 'slider', 'spinbutton', 'status', 'switch',
            'tab', 'table', 'tablist', 'tabpanel', 'textbox',
            'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'
        ];
    }

    // ==========================================
    // MAIN ANALYSIS
    // ==========================================
    analyze(content, filename) {
        const analysis = {
            type: 'html',
            name: filename,
            lines: content.split('\n').length,
            characters: content.length,
            timestamp: new Date().toISOString(),
            
            // Structure
            structure: this.analyzeStructure(content),
            meta: this.analyzeMeta(content),
            elements: this.analyzeElements(content),
            attributes: this.analyzeAttributes(content),
            
            // Content
            text: this.analyzeText(content),
            scripts: this.analyzeScripts(content),
            styles: this.analyzeStyles(content),
            links: this.analyzeLinks(content),
            images: this.analyzeImages(content),
            forms: this.analyzeForms(content),
            
            // Quality
            quality: this.analyzeQuality(content),
            accessibility: this.analyzeAccessibility(content),
            performance: this.analyzePerformance(content),
            
            // Security
            security: this.analyzeSecurity(content),
            
            // Preview
            preview: this.getPreview(content, 200)
        };
        
        // Calculate overall score
        analysis.score = this.calculateScore(analysis);
        
        return analysis;
    }

    // ==========================================
    // STRUCTURE ANALYSIS
    // ==========================================
    analyzeStructure(content) {
        return {
            hasDoctype: this.patterns.doctype.test(content),
            hasHtml: this.patterns.htmlTag.test(content),
            hasHead: this.patterns.headTag.test(content),
            hasBody: this.patterns.bodyTag.test(content),
            isWellFormed: this.isWellFormed(content),
            nestingDepth: this.getNestingDepth(content)
        };
    }

    // ==========================================
    // META ANALYSIS
    // ==========================================
    analyzeMeta(content) {
        const metas = {
            charset: null,
            viewport: null,
            title: null,
            description: null,
            keywords: null,
            author: null,
            robots: null,
            ogTitle: null,
            ogDescription: null,
            ogImage: null,
            ogUrl: null,
            twitterCard: null,
            twitterTitle: null,
            twitterDescription: null,
            twitterImage: null
        };

        // Title
        const titleMatch = content.match(this.patterns.title);
        if (titleMatch) {
            metas.title = titleMatch[1] || titleMatch[0];
        }

        // Meta tags
        const metaTags = content.match(this.patterns.meta) || [];
        for (const tag of metaTags) {
            const nameMatch = tag.match(/name=["']([^"']*)["']/i);
            const propertyMatch = tag.match(/property=["']([^"']*)["']/i);
            const contentMatch = tag.match(/content=["']([^"']*)["']/i);
            
            if (contentMatch) {
                const key = nameMatch ? nameMatch[1] : propertyMatch ? propertyMatch[1] : null;
                if (key) {
                    const value = contentMatch[1];
                    if (key === 'charset') metas.charset = value;
                    else if (key === 'viewport') metas.viewport = value;
                    else if (key === 'description') metas.description = value;
                    else if (key === 'keywords') metas.keywords = value;
                    else if (key === 'author') metas.author = value;
                    else if (key === 'robots') metas.robots = value;
                    else if (key === 'og:title') metas.ogTitle = value;
                    else if (key === 'og:description') metas.ogDescription = value;
                    else if (key === 'og:image') metas.ogImage = value;
                    else if (key === 'og:url') metas.ogUrl = value;
                    else if (key === 'twitter:card') metas.twitterCard = value;
                    else if (key === 'twitter:title') metas.twitterTitle = value;
                    else if (key === 'twitter:description') metas.twitterDescription = value;
                    else if (key === 'twitter:image') metas.twitterImage = value;
                }
            }
        }

        return metas;
    }

    // ==========================================
    // ELEMENT ANALYSIS
    // ==========================================
    analyzeElements(content) {
        const elements = {
            total: 0,
            semantic: 0,
            nonSemantic: 0,
            void: 0,
            byType: {}
        };

        // Count all tags
        const allTags = content.match(/<[a-zA-Z][^>]*>/g) || [];
        elements.total = allTags.length;

        // Analyze each tag
        for (const tag of allTags) {
            const tagName = tag.match(/<([a-zA-Z][a-zA-Z0-9]*)/);
            if (tagName) {
                const name = tagName[1].toLowerCase();
                elements.byType[name] = (elements.byType[name] || 0) + 1;
                
                if (this.semanticElements.includes(name)) {
                    elements.semantic++;
                } else {
                    elements.nonSemantic++;
                }
                
                if (this.voidElements.includes(name)) {
                    elements.void++;
                }
            }
        }

        return elements;
    }

    // ==========================================
    // ATTRIBUTE ANALYSIS
    // ==========================================
    analyzeAttributes(content) {
        const attributes = {
            total: 0,
            byType: {},
            idCount: 0,
            classCount: 0,
            dataCount: 0,
            ariaCount: 0,
            roleCount: 0
        };

        // Count various attributes
        const idMatches = content.match(this.patterns.id) || [];
        const classMatches = content.match(this.patterns.class) || [];
        const dataMatches = content.match(this.patterns.data) || [];
        const ariaMatches = content.match(this.patterns.aria) || [];
        const roleMatches = content.match(this.patterns.role) || [];
        const srcMatches = content.match(this.patterns.src) || [];
        const hrefMatches = content.match(this.patterns.href) || [];
        const altMatches = content.match(this.patterns.alt) || [];

        attributes.idCount = idMatches.length;
        attributes.classCount = classMatches.length;
        attributes.dataCount = dataMatches.length;
        attributes.ariaCount = ariaMatches.length;
        attributes.roleCount = roleMatches.length;
        attributes.srcCount = srcMatches.length;
        attributes.hrefCount = hrefMatches.length;
        attributes.altCount = altMatches.length;

        attributes.total = attributes.idCount + attributes.classCount + 
                          attributes.dataCount + attributes.ariaCount + 
                          attributes.roleCount + attributes.srcCount + 
                          attributes.hrefCount + attributes.altCount;

        attributes.byType = {
            id: attributes.idCount,
            class: attributes.classCount,
            data: attributes.dataCount,
            aria: attributes.ariaCount,
            role: attributes.roleCount,
            src: attributes.srcCount,
            href: attributes.hrefCount,
            alt: attributes.altCount
        };

        return attributes;
    }

    // ==========================================
    // TEXT ANALYSIS
    // ==========================================
    analyzeText(content) {
        // Strip tags to get text content
        const text = content.replace(/<[^>]*>/g, ' ');
        const words = text.match(/[a-zA-Z]+/g) || [];
        
        return {
            total: text.length,
            words: words.length,
            sentences: text.split(/[.!?]+/).length - 1,
            paragraphs: text.split(/\n\s*\n/).length,
            averageWordLength: words.length > 0 ? 
                words.reduce((sum, w) => sum + w.length, 0) / words.length : 0,
            readingTime: Math.ceil(words.length / 200), // minutes at 200 wpm
            hasText: text.trim().length > 0
        };
    }

    // ==========================================
    // SCRIPT ANALYSIS
    // ==========================================
    analyzeScripts(content) {
        const scripts = {
            total: 0,
            external: 0,
            inline: 0,
            async: 0,
            defer: 0,
            module: 0,
            sources: [],
            content: []
        };

        const scriptTags = content.match(this.patterns.script) || [];
        scripts.total = scriptTags.length;

        for (const tag of scriptTags) {
            const srcMatch = tag.match(/src=["']([^"']*)["']/);
            const asyncMatch = tag.match(/async/);
            const deferMatch = tag.match(/defer/);
            const moduleMatch = tag.match(/type=["']module["']/);

            if (srcMatch) {
                scripts.external++;
                scripts.sources.push(srcMatch[1]);
            } else {
                scripts.inline++;
                const contentMatch = tag.match(/<script[^>]*>([\s\S]*?)<\/script>/);
                if (contentMatch && contentMatch[1].trim()) {
                    scripts.content.push(contentMatch[1]);
                }
            }

            if (asyncMatch) scripts.async++;
            if (deferMatch) scripts.defer++;
            if (moduleMatch) scripts.module++;
        }

        return scripts;
    }

    // ==========================================
    // STYLE ANALYSIS
    // ==========================================
    analyzeStyles(content) {
        const styles = {
            total: 0,
            external: 0,
            inline: 0,
            internal: 0,
            sources: [],
            content: []
        };

        // External stylesheets
        const linkTags = content.match(this.patterns.stylesheet) || [];
        for (const tag of linkTags) {
            const hrefMatch = tag.match(/href=["']([^"']*)["']/);
            if (hrefMatch) {
                styles.external++;
                styles.sources.push(hrefMatch[1]);
            }
        }

        // Internal styles
        const styleTags = content.match(this.patterns.style) || [];
        for (const tag of styleTags) {
            const match = tag.match(/<style[^>]*>([\s\S]*?)<\/style>/);
            if (match && match[1].trim()) {
                styles.internal++;
                styles.content.push(match[1]);
            }
        }

        // Inline styles
        const inlineMatches = content.match(this.patterns.inlineStyle) || [];
        styles.inline = inlineMatches.length;

        styles.total = styles.external + styles.internal + styles.inline;

        return styles;
    }

    // ==========================================
    // LINK ANALYSIS
    // ==========================================
    analyzeLinks(content) {
        const links = {
            total: 0,
            internal: 0,
            external: 0,
            anchor: 0,
            mailto: 0,
            tel: 0,
            javascript: 0,
            hrefs: []
        };

        const linkTags = content.match(this.patterns.a) || [];
        links.total = linkTags.length;

        for (const tag of linkTags) {
            const hrefMatch = tag.match(/href=["']([^"']*)["']/);
            if (hrefMatch) {
                const href = hrefMatch[1];
                links.hrefs.push(href);
                
                if (href.startsWith('#')) {
                    links.anchor++;
                } else if (href.startsWith('mailto:')) {
                    links.mailto++;
                } else if (href.startsWith('tel:')) {
                    links.tel++;
                } else if (href.startsWith('javascript:')) {
                    links.javascript++;
                } else if (href.startsWith('http://') || href.startsWith('https://')) {
                    links.external++;
                } else {
                    links.internal++;
                }
            }
        }

        return links;
    }

    // ==========================================
    // IMAGE ANALYSIS
    // ==========================================
    analyzeImages(content) {
        const images = {
            total: 0,
            withAlt: 0,
            withoutAlt: 0,
            withTitle: 0,
            withDimensions: 0,
            srcs: []
        };

        const imgTags = content.match(this.patterns.img) || [];
        images.total = imgTags.length;

        for (const tag of imgTags) {
            const srcMatch = tag.match(/src=["']([^"']*)["']/);
            if (srcMatch) {
                images.srcs.push(srcMatch[1]);
            }

            const altMatch = tag.match(/alt=["']([^"']*)["']/);
            if (altMatch) {
                images.withAlt++;
            } else {
                images.withoutAlt++;
            }

            const titleMatch = tag.match(/title=["']([^"']*)["']/);
            if (titleMatch) {
                images.withTitle++;
            }

            const widthMatch = tag.match(/width=["']([^"']*)["']/);
            const heightMatch = tag.match(/height=["']([^"']*)["']/);
            if (widthMatch && heightMatch) {
                images.withDimensions++;
            }
        }

        return images;
    }

    // ==========================================
    // FORM ANALYSIS
    // ==========================================
    analyzeForms(content) {
        const forms = {
            total: 0,
            withMethod: 0,
            withAction: 0,
            inputs: 0,
            textareas: 0,
            buttons: 0,
            selects: 0,
            labels: 0,
            required: 0
        };

        const formTags = content.match(this.patterns.form) || [];
        forms.total = formTags.length;

        for (const tag of formTags) {
            if (tag.match(/method=/i)) forms.withMethod++;
            if (tag.match(/action=/i)) forms.withAction++;
        }

        forms.inputs = (content.match(this.patterns.input) || []).length;
        forms.textareas = (content.match(this.patterns.textarea) || []).length;
        forms.buttons = (content.match(this.patterns.button) || []).length;
        forms.selects = (content.match(this.patterns.select) || []).length;
        forms.labels = (content.match(this.patterns.label) || []).length;
        
        const requiredMatches = content.match(/required/gi) || [];
        forms.required = requiredMatches.length;

        return forms;
    }

    // ==========================================
    // QUALITY ANALYSIS
    // ==========================================
    analyzeQuality(content) {
        const issues = [];
        let score = 100;

        // Check for common issues
        if (!this.patterns.doctype.test(content)) {
            issues.push('Missing DOCTYPE declaration');
            score -= 10;
        }

        if (!this.patterns.htmlTag.test(content)) {
            issues.push('Missing <html> tag');
            score -= 15;
        }

        if (!this.patterns.headTag.test(content)) {
            issues.push('Missing <head> tag');
            score -= 10;
        }

        if (!this.patterns.bodyTag.test(content)) {
            issues.push('Missing <body> tag');
            score -= 10;
        }

        // Check for semantic elements
        const semanticCount = (content.match(/<(header|nav|main|section|article|aside|footer)/gi) || []).length;
        if (semanticCount < 3) {
            issues.push('Limited use of semantic HTML5 elements');
            score -= 5;
        }

        // Check for title
        if (!this.patterns.title.test(content)) {
            issues.push('Missing <title> tag');
            score -= 10;
        }

        // Check for viewport
        if (!this.patterns.viewport.test(content)) {
            issues.push('Missing viewport meta tag (mobile responsiveness)');
            score -= 5;
        }

        // Check for alt text on images
        const imgTags = content.match(this.patterns.img) || [];
        const altTags = content.match(/alt=/gi) || [];
        if (imgTags.length > 0 && altTags.length < imgTags.length) {
            issues.push(`${imgTags.length - altTags.length} images missing alt attributes`);
            score -= 5;
        }

        // Check for inline styles
        const inlineStyles = content.match(this.patterns.inlineStyle) || [];
        if (inlineStyles.length > 10) {
            issues.push(`Excessive inline styles (${inlineStyles.length})`);
            score -= 3;
        }

        // Check for commented code
        const comments = content.match(this.patterns.comment) || [];
        if (comments.length > 10) {
            issues.push(`Excessive comments (${comments.length})`);
            score -= 2;
        }

        return {
            issues: issues,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: issues.length > 0
        };
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

        // Check for alt text
        const imgTags = content.match(this.patterns.img) || [];
        const altTags = content.match(/alt=/gi) || [];
        if (imgTags.length > 0 && altTags.length === imgTags.length) {
            checks.passed.push('All images have alt text');
        } else {
            checks.failed.push(`${imgTags.length - altTags.length} images missing alt text`);
            score -= 10;
        }

        // Check for aria labels
        const ariaLabels = content.match(/aria-label=/gi) || [];
        if (ariaLabels.length > 0) {
            checks.passed.push(`Found ${ariaLabels.length} aria labels`);
        }

        // Check for role attributes
        const roles = content.match(this.patterns.role) || [];
        if (roles.length > 0) {
            checks.passed.push(`Found ${roles.length} ARIA roles`);
        }

        // Check for semantic elements
        const semanticElements = this.semanticElements.filter(el => 
            content.includes(`<${el}`)
        );
        if (semanticElements.length > 0) {
            checks.passed.push(`Using semantic elements: ${semanticElements.join(', ')}`);
        } else {
            checks.warnings.push('No semantic HTML5 elements found');
            score -= 5;
        }

        // Check for label associations
        const labels = content.match(this.patterns.label) || [];
        const inputs = content.match(this.patterns.input) || [];
        if (labels.length > 0 || inputs.length === 0) {
            // Good or no inputs
        } else {
            checks.warnings.push('Inputs without associated labels');
            score -= 5;
        }

        // Check for skip links
        if (content.includes('skip') || content.includes('Skip')) {
            checks.passed.push('Skip link found');
        }

        // Check for language attribute
        if (content.match(/lang=["']/i)) {
            checks.passed.push('Language attribute set');
        } else {
            checks.warnings.push('Missing lang attribute');
            score -= 3;
        }

        return {
            checks: checks,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: checks.failed.length > 0 || checks.warnings.length > 0
        };
    }

    // ==========================================
    // PERFORMANCE ANALYSIS
    // ==========================================
    analyzePerformance(content) {
        const issues = [];
        let score = 100;

        // Check for external CSS
        const externalCSS = content.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || [];
        if (externalCSS.length === 0) {
            issues.push('No external CSS - consider using external stylesheets');
            score -= 5;
        }

        // Check for render-blocking
        const headScripts = content.match(/<head[^>]*>([\s\S]*?)<\/head>/) || [];
        if (headScripts.length > 0 && headScripts[0].includes('<script')) {
            const scriptsInHead = headScripts[0].match(/<script/g) || [];
            if (scriptsInHead.length > 0) {
                issues.push(`${scriptsInHead.length} script(s) in head (render-blocking)`);
                score -= 5;
            }
        }

        // Check for large inline styles
        const styleTags = content.match(this.patterns.style) || [];
        for (const tag of styleTags) {
            const match = tag.match(/<style[^>]*>([\s\S]*?)<\/style>/);
            if (match && match[1].length > 10000) {
                issues.push('Large inline stylesheet (>10KB)');
                score -= 5;
                break;
            }
        }

        // Check for large scripts
        const scriptTags = content.match(this.patterns.script) || [];
        for (const tag of scriptTags) {
            const match = tag.match(/<script[^>]*>([\s\S]*?)<\/script>/);
            if (match && match[1].length > 50000) {
                issues.push('Large inline script (>50KB)');
                score -= 5;
                break;
            }
        }

        // Check for unminified CSS
        if (content.includes('/*') && content.includes('*/')) {
            issues.push('Unminified CSS comments found');
            score -= 2;
        }

        // Check for unminified JS
        if (content.includes('//') && !content.includes('// @license')) {
            const jsContent = content.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
            let hasComments = false;
            for (const js of jsContent) {
                if (js.includes('//') && !js.includes('// @license')) {
                    hasComments = true;
                    break;
                }
            }
            if (hasComments) {
                issues.push('Unminified JavaScript comments found');
                score -= 2;
            }
        }

        return {
            issues: issues,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: issues.length > 0
        };
    }

    // ==========================================
    // SECURITY ANALYSIS
    // ==========================================
    analyzeSecurity(content) {
        const issues = [];
        let score = 100;

        // Check for CSP
        if (!content.includes('Content-Security-Policy') && !content.match(/<meta[^>]*csp/i)) {
            issues.push('Content-Security-Policy not found');
            score -= 10;
        }

        // Check for XSS vulnerabilities
        if (content.includes('innerHTML') || content.includes('document.write')) {
            issues.push('Potential XSS vulnerability (innerHTML or document.write detected)');
            score -= 10;
        }

        // Check for eval
        if (content.includes('eval(')) {
            issues.push('eval() detected - potential security risk');
            score -= 15;
        }

        // Check for inline event handlers
        const inlineHandlers = content.match(/on[a-z]+=["']/gi) || [];
        if (inlineHandlers.length > 0) {
            issues.push(`${inlineHandlers.length} inline event handlers found`);
            score -= 5;
        }

        // Check for HTTPS
        const links = content.match(/href=["']http:/gi) || [];
        if (links.length > 0) {
            issues.push(`${links.length} HTTP links found - consider using HTTPS`);
            score -= 3;
        }

        // Check for mixed content
        const mixedContent = content.match(/src=["']http:/gi) || [];
        if (mixedContent.length > 0) {
            issues.push(`${mixedContent.length} HTTP resources found in HTTPS page`);
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
    
    isWellFormed(content) {
        // Simple check - count opening and closing tags
        const openTags = content.match(/<[a-zA-Z][^>]*>/g) || [];
        const closeTags = content.match(/<\/[a-zA-Z][^>]*>/g) || [];
        const selfClosing = content.match(/\/>/g) || [];
        return openTags.length === closeTags.length + selfClosing.length;
    }

    getNestingDepth(content) {
        let maxDepth = 0;
        let currentDepth = 0;
        const tags = content.match(/<[a-zA-Z][^>]*>/g) || [];
        
        for (const tag of tags) {
            if (!tag.match(/\/>/)) {
                if (!tag.match(/<\//)) {
                    currentDepth++;
                    maxDepth = Math.max(maxDepth, currentDepth);
                } else {
                    currentDepth = Math.max(0, currentDepth - 1);
                }
            }
        }
        
        return maxDepth;
    }

    getPreview(content, length = 200) {
        // Strip tags for preview
        const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        if (text.length <= length) return text;
        return text.slice(0, length) + '...';
    }

    calculateScore(analysis) {
        let score = 100;
        
        // Structure penalties
        if (!analysis.structure.hasDoctype) score -= 10;
        if (!analysis.structure.hasHtml) score -= 15;
        if (!analysis.structure.hasHead) score -= 10;
        if (!analysis.structure.hasBody) score -= 10;
        if (!analysis.structure.isWellFormed) score -= 20;

        // Quality penalties
        if (analysis.quality.hasIssues) {
            score -= analysis.quality.issues.length * 2;
        }

        // Accessibility penalties
        if (analysis.accessibility.hasIssues) {
            score -= 5;
        }

        // Security penalties
        if (analysis.security.hasIssues) {
            score -= 5;
        }

        // Performance penalties
        if (analysis.performance.hasIssues) {
            score -= 3;
        }

        // Add bonuses
        if (analysis.accessibility.checks.passed.length > 3) score += 5;
        if (analysis.elements.semantic > 5) score += 3;
        if (analysis.images.withAlt > 0 && analysis.images.withAlt === analysis.images.total) score += 3;

        return Math.max(0, Math.min(100, score));
    }

    // ==========================================
    // EXTRACTION METHODS
    // ==========================================
    
    extractText(content) {
        return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    extractLinks(content) {
        const links = [];
        const matches = content.match(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
        for (const match of matches) {
            const hrefMatch = match.match(/href=["']([^"']*)["']/);
            if (hrefMatch) {
                const textMatch = match.match(/>([^<]*)<\/a>/);
                links.push({
                    href: hrefMatch[1],
                    text: textMatch ? textMatch[1] : null
                });
            }
        }
        return links;
    }

    extractImages(content) {
        const images = [];
        const matches = content.match(/<img[^>]*>/gi) || [];
        for (const match of matches) {
            const srcMatch = match.match(/src=["']([^"']*)["']/);
            const altMatch = match.match(/alt=["']([^"']*)["']/);
            const titleMatch = match.match(/title=["']([^"']*)["']/);
            images.push({
                src: srcMatch ? srcMatch[1] : null,
                alt: altMatch ? altMatch[1] : null,
                title: titleMatch ? titleMatch[1] : null
            });
        }
        return images;
    }

    extractScripts(content) {
        const scripts = [];
        const matches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
        for (const match of matches) {
            const srcMatch = match.match(/src=["']([^"']*)["']/);
            const contentMatch = match.match(/<script[^>]*>([\s\S]*?)<\/script>/);
            scripts.push({
                src: srcMatch ? srcMatch[1] : null,
                content: contentMatch ? contentMatch[1] : null
            });
        }
        return scripts;
    }

    extractStyles(content) {
        const styles = [];
        const matches = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
        for (const match of matches) {
            const contentMatch = match.match(/<style[^>]*>([\s\S]*?)<\/style>/);
            if (contentMatch) {
                styles.push(contentMatch[1]);
            }
        }
        return styles;
    }
}

export default HTMLHandler;
