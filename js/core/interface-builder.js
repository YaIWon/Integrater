// ============================================
// INTERFACE BUILDER
// Entry Point & UI Component Generator
// ============================================

export default class InterfaceBuilder {
    constructor() {
        // ==========================================
        // TEMPLATES
        // ==========================================
        this.templates = {
            // HTML entry points
            basic: this.buildBasicHTML.bind(this),
            app: this.buildAppHTML.bind(this),
            dashboard: this.buildDashboardHTML.bind(this),
            tool: this.buildToolHTML.bind(this),
            
            // Code entry points
            javascript: this.buildJavaScriptEntry.bind(this),
            python: this.buildPythonEntry.bind(this),
            solidity: this.buildSolidityEntry.bind(this),
            
            // UI components
            button: this.buildButtonComponent.bind(this),
            card: this.buildCardComponent.bind(this),
            modal: this.buildModalComponent.bind(this),
            form: this.buildFormComponent.bind(this),
            table: this.buildTableComponent.bind(this),
            chart: this.buildChartComponent.bind(this)
        };
        
        // ==========================================
        // COMPONENT PRESETS
        // ==========================================
        this.presets = {
            colors: {
                primary: '#4a9eff',
                secondary: '#a855f7',
                success: '#4CAF50',
                warning: '#ffd700',
                danger: '#ff4757',
                dark: '#0a0e1a',
                light: '#f0f2f5'
            },
            fonts: {
                sans: "'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                mono: "'Courier New', monospace",
                display: "'Segoe UI', system-ui, sans-serif"
            },
            breakpoints: {
                mobile: '480px',
                tablet: '768px',
                desktop: '1024px',
                wide: '1400px'
            }
        };
    }

    // ==========================================
    // MAIN BUILD METHOD
    // ==========================================
    async buildEntryPoint(file, options = {}) {
        const type = file.analysis?.type || this.detectType(file);
        const builder = this.templates[type] || this.templates.basic;
        
        try {
            const entryPoint = await builder(file, options);
            return {
                name: `${file.name.replace(/\.[^.]+$/, '')}-entry`,
                type: type,
                content: entryPoint,
                metadata: {
                    generated: new Date().toISOString(),
                    sourceFile: file.name,
                    sourceType: type,
                    options: options
                }
            };
        } catch (error) {
            console.error('Entry point build error:', error);
            return this.buildFallbackEntry(file);
        }
    }

    detectType(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        const typeMap = {
            'html': 'html',
            'htm': 'html',
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'py': 'python',
            'sol': 'solidity'
        };
        return typeMap[ext] || 'basic';
    }

    // ==========================================
    // HTML TEMPLATES
    // ==========================================

    buildBasicHTML(file) {
        const content = file.content || '';
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${file.name.replace(/\.[^.]+$/, '')}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0e1a;
            color: #e0e0e0;
            font-family: 'Segoe UI', system-ui, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            width: 100%;
            background: rgba(13, 26, 42, 0.85);
            backdrop-filter: blur(12px);
            border-radius: 24px;
            padding: 40px;
            border: 1px solid rgba(74, 158, 255, 0.15);
        }
        h1 { 
            color: #4a9eff;
            margin-bottom: 16px;
        }
        .content {
            color: #8899aa;
            line-height: 1.6;
        }
        .btn {
            background: linear-gradient(135deg, #4a9eff, #a855f7);
            color: #fff;
            padding: 10px 24px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 0.95rem;
            transition: all 0.3s;
            margin-top: 16px;
        }
        .btn:hover { transform: scale(1.02); }
    </style>
</head>
<body>
    <div class="container">
        <h1>${file.name.replace(/\.[^.]+$/, '')}</h1>
        <div class="content">
            ${content || '<!-- Content goes here -->'}
        </div>
        <button class="btn">Click to Interact</button>
    </div>
</body>
</html>`;
    }

    buildAppHTML(file) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${file.name.replace(/\.[^.]+$/, '')}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0e1a;
            color: #e0e0e0;
            font-family: 'Segoe UI', system-ui, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .app {
            max-width: 1200px;
            width: 100%;
            background: rgba(13, 26, 42, 0.85);
            backdrop-filter: blur(12px);
            border-radius: 32px;
            padding: 40px;
            border: 1px solid rgba(74, 158, 255, 0.15);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(74, 158, 255, 0.06);
        }
        .logo { font-size: 1.8rem; font-weight: 700; color: #4a9eff; }
        .nav { display: flex; gap: 16px; }
        .nav a {
            color: #8899aa;
            text-decoration: none;
            transition: color 0.3s;
        }
        .nav a:hover { color: #4a9eff; }
        .content { 
            min-height: 400px;
            padding: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(74, 158, 255, 0.06);
            text-align: center;
            color: #556677;
            font-size: 0.85rem;
        }
        .btn {
            background: linear-gradient(135deg, #4a9eff, #a855f7);
            color: #fff;
            padding: 10px 24px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 0.95rem;
            transition: all 0.3s;
        }
        .btn:hover { transform: scale(1.02); }
    </style>
</head>
<body>
    <div class="app">
        <header class="header">
            <div class="logo">🔮 ${file.name.replace(/\.[^.]+$/, '')}</div>
            <nav class="nav">
                <a href="#">Home</a>
                <a href="#">Features</a>
                <a href="#">Docs</a>
                <a href="#">About</a>
            </nav>
        </header>
        <main class="content">
            <h1>Welcome to ${file.name.replace(/\.[^.]+$/, '')}</h1>
            <p style="color: #8899aa; margin-top: 10px;">This app was generated from: ${file.name}</p>
            ${file.content ? `<pre style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 12px; margin-top: 16px; overflow-x: auto; color: #4a9eff; font-size: 0.85rem;">${this.truncateContent(file.content, 500)}</pre>` : ''}
            <button class="btn" style="margin-top: 20px;">Get Started</button>
        </main>
        <footer class="footer">
            Built with Universal Integrator Pro v4.0
        </footer>
    </div>
    <script>
        console.log('App loaded successfully');
        document.querySelector('.btn').addEventListener('click', () => {
            alert('Hello from ${file.name.replace(/\.[^.]+$/, '')}!');
        });
    </script>
</body>
</html>`;
    }

    buildDashboardHTML(file) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${file.name.replace(/\.[^.]+$/, '')}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0e1a;
            color: #e0e0e0;
            font-family: 'Segoe UI', system-ui, sans-serif;
            min-height: 100vh;
            padding: 20px;
        }
        .dashboard {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(13, 26, 42, 0.85);
            backdrop-filter: blur(12px);
            border-radius: 32px;
            padding: 40px;
            border: 1px solid rgba(74, 158, 255, 0.15);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .title { font-size: 2rem; font-weight: 700; color: #4a9eff; }
        .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 30px;
        }
        .stat {
            background: rgba(0, 0, 0, 0.3);
            padding: 20px;
            border-radius: 16px;
            text-align: center;
            border: 1px solid rgba(74, 158, 255, 0.06);
        }
        .stat-value { font-size: 2.5rem; font-weight: 700; color: #4a9eff; }
        .stat-label { color: #8899aa; font-size: 0.85rem; margin-top: 4px; }
        .grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
        }
        .card {
            background: rgba(0, 0, 0, 0.2);
            padding: 20px;
            border-radius: 16px;
            border: 1px solid rgba(74, 158, 255, 0.06);
        }
        .card-title { color: #4a9eff; margin-bottom: 12px; }
        .card-content { color: #8899aa; line-height: 1.6; }
        @media (max-width: 768px) {
            .stats { grid-template-columns: repeat(2, 1fr); }
            .grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
            .stats { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <header class="header">
            <div class="title">📊 ${file.name.replace(/\.[^.]+$/, '')}</div>
            <span style="color: #8899aa;">${new Date().toLocaleDateString()}</span>
        </header>
        <div class="stats">
            <div class="stat"><div class="stat-value">42</div><div class="stat-label">Files</div></div>
            <div class="stat"><div class="stat-value">12</div><div class="stat-label">Integrations</div></div>
            <div class="stat"><div class="stat-value">87%</div><div class="stat-label">Completion</div></div>
            <div class="stat"><div class="stat-value">3</div><div class="stat-label">Active</div></div>
        </div>
        <div class="grid">
            <div class="card">
                <div class="card-title">📋 Recent Activity</div>
                <div class="card-content">
                    ${file.content ? this.truncateContent(file.content, 200) : 'No activity yet'}
                </div>
            </div>
            <div class="card">
                <div class="card-title">📈 Quick Stats</div>
                <div class="card-content">
                    <div>Total Size: 1.2 GB</div>
                    <div>Last Updated: Today</div>
                    <div>Status: Online</div>
                </div>
            </div>
        </div>
    </div>
    <script>
        console.log('Dashboard loaded');
        // Auto-refresh every 30 seconds
        setInterval(() => {
            document.querySelector('.stat-value').textContent = Math.floor(Math.random() * 100);
        }, 30000);
    </script>
</body>
</html>`;
    }

    buildToolHTML(file) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${file.name.replace(/\.[^.]+$/, '')}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0e1a;
            color: #e0e0e0;
            font-family: 'Segoe UI', system-ui, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .tool {
            max-width: 700px;
            width: 100%;
            background: rgba(13, 26, 42, 0.85);
            backdrop-filter: blur(12px);
            border-radius: 32px;
            padding: 40px;
            border: 1px solid rgba(74, 158, 255, 0.15);
        }
        .tool-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .tool-icon { font-size: 4rem; display: block; margin-bottom: 8px; }
        .tool-title { font-size: 2rem; font-weight: 700; color: #4a9eff; }
        .tool-desc { color: #8899aa; margin-top: 4px; }
        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .input-group input {
            flex: 1;
            padding: 12px 16px;
            border-radius: 12px;
            border: 1px solid rgba(74, 158, 255, 0.15);
            background: rgba(0, 0, 0, 0.3);
            color: #e0e0e0;
            font-size: 1rem;
            outline: none;
        }
        .input-group input:focus { border-color: #4a9eff; }
        .btn {
            padding: 12px 28px;
            border: none;
            border-radius: 12px;
            background: linear-gradient(135deg, #4a9eff, #a855f7);
            color: #fff;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s;
        }
        .btn:hover { transform: scale(1.02); }
        .output {
            background: rgba(0, 0, 0, 0.3);
            padding: 16px;
            border-radius: 12px;
            min-height: 100px;
            color: #8899aa;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            border: 1px solid rgba(74, 158, 255, 0.06);
            margin-top: 16px;
            white-space: pre-wrap;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <div class="tool">
        <div class="tool-header">
            <span class="tool-icon">🛠️</span>
            <div class="tool-title">${file.name.replace(/\.[^.]+$/, '')}</div>
            <div class="tool-desc">Powered by Universal Integrator Pro</div>
        </div>
        <div class="input-group">
            <input type="text" placeholder="Enter input..." id="inputField">
            <button class="btn" id="runBtn">▶ Run</button>
        </div>
        <div class="output" id="output">Ready</div>
        ${file.content ? `<div style="margin-top:12px;font-size:0.75rem;color:#556677;">Source: ${file.name}</div>` : ''}
    </div>
    <script>
        document.getElementById('runBtn').addEventListener('click', () => {
            const input = document.getElementById('inputField').value || 'Hello World!';
            document.getElementById('output').textContent = \`Processing: "\${input}"\nResult: OK\`;
        });
        document.getElementById('inputField').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') document.getElementById('runBtn').click();
        });
        console.log('Tool loaded: ${file.name}');
    </script>
</body>
</html>`;
    }

    // ==========================================
    // CODE ENTRY POINTS
    // ==========================================

    buildJavaScriptEntry(file) {
        const content = file.content || '';
        return `// ============================================
// ${file.name} - Entry Point
// Generated by Universal Integrator Pro
// ============================================

"use strict";

// Main entry point
function main() {
    console.log('🚀 Starting ${file.name}...');
    
    // Your code here
    ${this.extractJSFunctions(content)}
    
    console.log('✅ ${file.name} completed');
}

// Error handling
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
    process.exit(1);
});

// Run main
if (require.main === module) {
    main();
}

export default main;

// Source: ${file.name}
// Generated: ${new Date().toISOString()}`;
    }

    buildPythonEntry(file) {
        const content = file.content || '';
        return `#!/usr/bin/env python3
# ============================================
# ${file.name} - Entry Point
# Generated by Universal Integrator Pro
# ============================================

import sys
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    """Main entry point"""
    logger.info(f"🚀 Starting {__file__}...")
    
    ${self.extractPythonFunctions(content)}
    
    logger.info(f"✅ {__file__} completed")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.warning("⚠️ Interrupted by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        sys.exit(1)

# Source: ${file.name}
# Generated: ${new Date().toISOString()}`;
    }

    buildSolidityEntry(file) {
        const content = file.content || '';
        return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// ============================================
// ${file.name} - Entry Point
// Generated by Universal Integrator Pro
// ============================================

${this.extractSolidityContracts(content)}

// Deployment Instructions:
// 1. Compile with solc ${this.detectSolidityVersion(content)}
// 2. Deploy to Ethereum network
// 3. Verify on Etherscan

// Source: ${file.name}
// Generated: ${new Date().toISOString()}`;
    }

    // ==========================================
    // UI COMPONENTS
    // ==========================================

    buildButtonComponent(options = {}) {
        const {
            text = 'Click Me',
            type = 'primary',
            size = 'medium',
            icon = null,
            onClick = null
        } = options;

        const sizes = {
            small: 'padding: 6px 14px; font-size: 0.8rem;',
            medium: 'padding: 10px 24px; font-size: 0.95rem;',
            large: 'padding: 14px 32px; font-size: 1.1rem;'
        };

        const types = {
            primary: 'background: linear-gradient(135deg, #4a9eff, #a855f7); color: #fff;',
            secondary: 'background: rgba(74, 158, 255, 0.12); color: #4a9eff; border: 1px solid rgba(74, 158, 255, 0.2);',
            success: 'background: linear-gradient(135deg, #00b894, #00cec9); color: #fff;',
            danger: 'background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: #fff;',
            outline: 'background: transparent; color: #4a9eff; border: 2px solid #4a9eff;'
        };

        return `<button style="
            padding: ${sizes[size]};
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            ${types[type] || types.primary}
            ${icon ? `display: flex; align-items: center; gap: 8px;` : ''}
        " onclick="${onClick || 'console.log(\'Button clicked\')'}">
            ${icon ? `<span>${icon}</span>` : ''}
            ${text}
        </button>`;
    }

    buildCardComponent(options = {}) {
        const {
            title = 'Card Title',
            content = 'Card content goes here',
            footer = null,
            actions = null,
            width = '100%'
        } = options;

        return `<div style="
            background: rgba(13, 26, 42, 0.85);
            backdrop-filter: blur(12px);
            border-radius: 16px;
            padding: 20px;
            border: 1px solid rgba(74, 158, 255, 0.1);
            width: ${width};
            transition: all 0.3s ease;
        ">
            ${title ? `<h3 style="color: #4a9eff; margin-bottom: 12px;">${title}</h3>` : ''}
            <div style="color: #8899aa; line-height: 1.6;">${content}</div>
            ${footer ? `<div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(74, 158, 255, 0.06);">${footer}</div>` : ''}
            ${actions ? `<div style="margin-top: 12px; display: flex; gap: 8px;">${actions}</div>` : ''}
        </div>`;
    }

    buildModalComponent(options = {}) {
        const {
            title = 'Modal',
            content = 'Modal content',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            onConfirm = null,
            onCancel = null
        } = options;

        return `<div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        ">
            <div style="
                background: #1a1a2e;
                border-radius: 24px;
                padding: 32px;
                max-width: 500px;
                width: 90%;
                border: 1px solid rgba(74, 158, 255, 0.15);
            ">
                <h3 style="color: #4a9eff; margin-bottom: 16px;">${title}</h3>
                <div style="color: #8899aa; line-height: 1.6; margin-bottom: 20px;">${content}</div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button style="
                        padding: 8px 20px;
                        border: 1px solid rgba(74, 158, 255, 0.2);
                        border-radius: 10px;
                        background: transparent;
                        color: #8899aa;
                        cursor: pointer;
                    " onclick="${onCancel || 'this.closest(\'div\').remove()'}">${cancelText}</button>
                    <button style="
                        padding: 8px 20px;
                        border: none;
                        border-radius: 10px;
                        background: linear-gradient(135deg, #4a9eff, #a855f7);
                        color: #fff;
                        cursor: pointer;
                    " onclick="${onConfirm || 'alert(\'Confirmed!\')'}">${confirmText}</button>
                </div>
            </div>
        </div>`;
    }

    buildFormComponent(options = {}) {
        const {
            fields = [],
            submitText = 'Submit',
            onSubmit = null,
            method = 'POST',
            action = '#'
        } = options;

        let fieldsHtml = fields.map(field => `
            <div style="margin-bottom: 12px;">
                <label style="display: block; font-size: 0.85rem; color: #8899aa; margin-bottom: 4px;">
                    ${field.label || field.name}
                </label>
                <input type="${field.type || 'text'}" 
                       name="${field.name}" 
                       placeholder="${field.placeholder || ''}"
                       ${field.required ? 'required' : ''}
                       style="
                           width: 100%;
                           padding: 10px 14px;
                           background: rgba(0, 0, 0, 0.3);
                           border: 1px solid rgba(74, 158, 255, 0.1);
                           border-radius: 10px;
                           color: #e0e0e0;
                           font-size: 0.95rem;
                           outline: none;
                       ">
            </div>
        `).join('');

        return `<form action="${action}" method="${method}" style="width: 100%; max-width: 400px;">
            ${fieldsHtml}
            <button type="submit" style="
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 12px;
                background: linear-gradient(135deg, #4a9eff, #a855f7);
                color: #fff;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            " onclick="${onSubmit || 'event.preventDefault(); alert(\'Form submitted\')'}">
                ${submitText}
            </button>
        </form>`;
    }

    buildTableComponent(options = {}) {
        const {
            headers = [],
            rows = [],
            caption = ''
        } = options;

        let headersHtml = headers.map(h => `<th style="padding: 10px 14px; text-align: left; border-bottom: 1px solid rgba(74, 158, 255, 0.1); color: #4a9eff;">${h}</th>`).join('');
        let rowsHtml = rows.map(row => `
            <tr>
                ${row.map(cell => `<td style="padding: 10px 14px; border-bottom: 1px solid rgba(74, 158, 255, 0.05); color: #8899aa;">${cell}</td>`).join('')}
            </tr>
        `).join('');

        return `<div style="overflow-x: auto; border-radius: 12px; border: 1px solid rgba(74, 158, 255, 0.06);">
            ${caption ? `<div style="padding: 10px 14px; font-weight: 600; color: #8899aa;">${caption}</div>` : ''}
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                <thead>
                    <tr>${headersHtml}</tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>`;
    }

    buildChartComponent(options = {}) {
        const {
            type = 'bar',
            data = [],
            labels = [],
            title = '',
            height = '300px'
        } = options;

        // Simple SVG bar chart
        let maxVal = Math.max(...data, 1);
        let barWidth = Math.min(60, 100 / data.length);
        let bars = data.map((val, i) => {
            let heightPct = (val / maxVal) * 80;
            return `<rect x="${i * (barWidth + 10) + 10}" 
                        y="${100 - heightPct}" 
                        width="${barWidth}" 
                        height="${heightPct}" 
                        fill="#4a9eff" 
                        rx="4"
                        style="transition: height 0.5s ease;">
                        <title>${labels[i] || i + 1}: ${val}</title>
                    </rect>`;
        }).join('');

        return `<div style="background: rgba(0,0,0,0.2); border-radius: 12px; padding: 20px; border: 1px solid rgba(74, 158, 255, 0.06);">
            ${title ? `<div style="color: #4a9eff; font-weight: 600; margin-bottom: 16px;">${title}</div>` : ''}
            <svg viewBox="0 0 ${data.length * (barWidth + 10) + 20} 120" style="width: 100%; height: ${height};">
                ${bars}
                <!-- Labels -->
                ${labels.map((label, i) => `
                    <text x="${i * (barWidth + 10) + 10 + barWidth/2}" y="115" text-anchor="middle" font-size="10" fill="#8899aa">${label}</text>
                `).join('')}
            </svg>
        </div>`;
    }

    // ==========================================
    // FALLBACK METHODS
    // ==========================================

    buildFallbackEntry(file) {
        return `<!-- ============================================ -->
<!-- Fallback Entry Point for ${file.name} -->
<!-- Generated by Universal Integrator Pro -->
<!-- ============================================ -->

<!DOCTYPE html>
<html>
<head><title>${file.name}</title></head>
<body>
    <h1>${file.name}</h1>
    <p>This is a fallback entry point.</p>
    <p>File type: ${file.analysis?.type || 'unknown'}</p>
    <p>Size: ${this.formatSize(file.size)}</p>
    <pre>${this.truncateContent(file.content || '', 500)}</pre>
</body>
</html>`;
    }

    // ==========================================
    // HELPERS
    // ==========================================

    truncateContent(content, maxLength = 500) {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + '\n... (truncated)';
    }

    extractJSFunctions(content) {
        const matches = content.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*{/g) || [];
        if (matches.length === 0) return '// No functions found';
        return matches.map(f => `    ${f} ...\n    // Implementation here`).join('\n');
    }

    extractPythonFunctions(content) {
        const matches = content.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*:/g) || [];
        if (matches.length === 0) return '    # No functions found';
        return matches.map(f => `    ${f}\n    # Implementation here`).join('\n');
    }

    extractSolidityContracts(content) {
        const matches = content.match(/contract\s+(\w+)\s*{/g) || [];
        if (matches.length === 0) return '// No contracts found';
        return matches.map(f => `${f}\n    // Implementation here\n}`).join('\n\n');
    }

    detectSolidityVersion(content) {
        const match = content.match(/pragma\s+solidity\s+([^;]+);/);
        return match ? match[1].trim() : '^0.8.19';
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export default InterfaceBuilder;
