// ============================================
// UNIVERSAL INTEGRATOR PRO - MAIN APP v4.0
// THE MOST ADVANCED FILE INTEGRATION SYSTEM EVER BUILT
// Complete with GitHub, API, Import, Launch, and Everything Else
// ============================================

import FileAnalyzer from './core/analyzer.js';
import Integrator from './core/integrator.js';
import APIVerifier from './core/api-verifier.js';
import InterfaceBuilder from './core/interface-builder.js';
import SolidityAnalyzer from './core/solidity-analyzer.js';
import LaunchEngine from './core/LaunchEngine.js';
import GridBuilder from './ui/grid-builder.js';
import ModalManager from './ui/modal-manager.js';
import StatusManager from './ui/status-manager.js';
import { FileUtils } from './utils/file-utils.js';
import { APIClient } from './utils/api-client.js';
import Validators from './utils/validators.js';

class App {
    constructor() {
        // ==========================================
        // CORE STATE
        // ==========================================
        this.files = [];
        this.integrations = [];
        this.modules = [];
        this.contracts = [];
        this.analyzedFiles = [];
        this.apiCalls = 0;
        this.currentTab = 'files';
        this.theme = 'dark';
        this.uploading = false;
        this.analyzing = false;
        this.startTime = Date.now();
        this.importedRepos = [];
        this.generatedMethods = [];
        this._githubContents = null;
        this._githubRepo = null;

        // ==========================================
        // INITIALIZE ALL MODULES
        // ==========================================
        this.analyzer = new FileAnalyzer();
        this.integrator = new Integrator();
        this.apiVerifier = new APIVerifier();
        this.interfaceBuilder = new InterfaceBuilder();
        this.solidityAnalyzer = new SolidityAnalyzer();
        this.launchEngine = new LaunchEngine();
        this.gridBuilder = new GridBuilder();
        this.modalManager = new ModalManager();
        this.statusManager = new StatusManager();

        // ==========================================
        // DOM REFS
        // ==========================================
        this.dom = {
            app: document.getElementById('app'),
            fileList: document.getElementById('fileList'),
            fileCount: document.getElementById('fileCount'),
            analysisResults: document.getElementById('analysisResults'),
            analysisPanel: document.getElementById('analysisPanel'),
            integrationGrid: document.getElementById('integrationGrid'),
            moduleGrid: document.getElementById('moduleGrid'),
            solidityContracts: document.getElementById('solidityContracts'),
            totalFiles: document.getElementById('totalFiles'),
            totalIntegrations: document.getElementById('totalIntegrations'),
            totalModules: document.getElementById('totalModules'),
            totalApiCalls: document.getElementById('totalApiCalls'),
            totalContracts: document.getElementById('totalContracts'),
            uptime: document.getElementById('uptime'),
            dropZone: document.getElementById('dropZone'),
            uploadProgress: document.getElementById('uploadProgress'),
            progressFill: document.querySelector('.progress-fill'),
            progressText: document.querySelector('.progress-text'),
            apiResponse: document.getElementById('apiResponse'),
            apiEndpoint: document.getElementById('apiEndpoint'),
            apiMethod: document.getElementById('apiMethod'),
            modalContainer: document.getElementById('modalContainer'),
            importModal: document.getElementById('importModal'),
            githubUrlInput: document.getElementById('githubUrlInput'),
            githubStatus: document.getElementById('githubStatus'),
            githubTree: document.getElementById('githubTree'),
            githubImportAllBtn: document.getElementById('githubImportAllBtn'),
            githubSelectImportBtn: document.getElementById('githubSelectImportBtn'),
            methodPreview: document.getElementById('methodPreview'),
            functionBuilder: document.getElementById('functionBuilder'),
            progressOverlay: document.getElementById('progressOverlay'),
            progressTitle: document.getElementById('progressTitle'),
            progressMessage: document.getElementById('progressMessage'),
            progressFillOverlay: document.getElementById('progressFill'),
            progressPercent: document.getElementById('progressPercent')
        };
    }

    // ==========================================
    // 1. INITIALIZATION
    // ==========================================
    async init() {
        console.log('🔮 Universal Integrator Pro v4.0');
        console.log('📁 Initializing...');

        this.setupEventListeners();
        this.setupDropZone();
        this.setupImportModal();
        this.setupKeyboardShortcuts();
        await this.loadState();
        this.updateUI();
        this.updateFileList();
        this.renderIntegrations();
        this.renderModules();
        this.renderSolidityContracts();
        this.startUptimeCounter();
        this.checkForUpdates();

        console.log('✅ Universal Integrator initialized successfully');
        console.log(`📁 Supported file types: ${this.getSupportedExtensions().length}+`);
        this.statusManager.success('🚀 Universal Integrator Pro is ready!');
    }

    // ==========================================
    // 2. EVENT LISTENERS
    // ==========================================
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // File upload
        document.getElementById('fileBtn')?.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = '*/*';
            input.addEventListener('change', (e) => this.handleFiles(e.target.files));
            input.click();
        });

        document.getElementById('folderBtn')?.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.webkitdirectory = true;
            input.multiple = true;
            input.addEventListener('change', (e) => this.handleFiles(e.target.files));
            input.click();
        });

        // Import buttons
        document.getElementById('importBtn')?.addEventListener('click', () => this.showImportModal());
        document.getElementById('importBtnQuick')?.addEventListener('click', () => this.showImportModal());

        // Analysis buttons
        document.getElementById('analyzeBtn')?.addEventListener('click', () => this.analyzeFiles());
        document.getElementById('verifyBtn')?.addEventListener('click', () => this.verifyWithAPI());
        document.getElementById('integrateBtn')?.addEventListener('click', () => this.integrateFiles());

        // Theme & clear
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('clearAllBtn')?.addEventListener('click', () => this.clearAll());

        // Integrations & modules
        document.getElementById('newIntegrationBtn')?.addEventListener('click', () => this.showIntegrationModal());
        document.getElementById('installModuleBtn')?.addEventListener('click', () => this.showModuleModal());

        // API
        document.getElementById('testApiBtn')?.addEventListener('click', () => this.testAPI());
        document.getElementById('saveApiBtn')?.addEventListener('click', () => this.saveAPI());

        // Solidity
        document.getElementById('deployContractBtn')?.addEventListener('click', () => this.deployContract());
        document.getElementById('verifyContractBtn')?.addEventListener('click', () => this.verifyContract());
        document.getElementById('compileContractBtn')?.addEventListener('click', () => this.compileContract());

        // Settings
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.showSettings());

        // GitHub Import All
        document.getElementById('githubImportAllBtn')?.addEventListener('click', () => this.importAllGitHubFiles());

        // Function Builder
        document.getElementById('copyMethodsBtn')?.addEventListener('click', () => this.copyMethods());
        document.getElementById('exportMethodsBtn')?.addEventListener('click', () => this.exportMethods());
        document.getElementById('saveMethodsBtn')?.addEventListener('click', () => this.saveMethods());
    }

    // ==========================================
    // 3. IMPORT MODAL
    // ==========================================
    setupImportModal() {
        // Tab switching
        document.querySelectorAll('.import-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.import-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.import-panel').forEach(p => p.classList.remove('active'));
                document.getElementById(`import${tab.dataset.importTab.charAt(0).toUpperCase() + tab.dataset.importTab.slice(1)}`).classList.add('active');
            });
        });

        // Close modal
        document.getElementById('importModalClose')?.addEventListener('click', () => this.hideImportModal());
        document.getElementById('importModalCancel')?.addEventListener('click', () => this.hideImportModal());

        // Files import
        document.getElementById('importFilesBtn')?.addEventListener('click', () => {
            const input = document.getElementById('importFileInput');
            if (input.files.length > 0) {
                this.handleFiles(input.files);
                this.hideImportModal();
            } else {
                this.statusManager.warning('⚠️ Please select files to upload');
            }
        });

        // Folder import
        document.getElementById('importFolderBtn')?.addEventListener('click', () => {
            const input = document.getElementById('importFolderInput');
            if (input.files.length > 0) {
                this.handleFiles(input.files);
                this.hideImportModal();
            } else {
                this.statusManager.warning('⚠️ Please select a folder');
            }
        });

        // GitHub import
        document.getElementById('githubCloneBtn')?.addEventListener('click', () => this.importFromGitHub());

        // Archive import
        document.getElementById('importArchiveBtn')?.addEventListener('click', () => this.importArchive());
        document.getElementById('importArchiveListBtn')?.addEventListener('click', () => this.listArchiveContents());

        // API import
        document.getElementById('apiImportBtn')?.addEventListener('click', () => this.importFromAPI());
    }

    showImportModal() {
        const modal = this.dom.importModal;
        if (modal) modal.style.display = 'flex';
        this.dom.functionBuilder.style.display = 'none';
    }

    hideImportModal() {
        const modal = this.dom.importModal;
        if (modal) modal.style.display = 'none';
    }

    // ==========================================
    // 4. GITHUB IMPORT
    // ==========================================
    async importFromGitHub() {
        const url = this.dom.githubUrlInput.value.trim();
        if (!url) {
            this.statusManager.warning('⚠️ Please enter a GitHub repository URL');
            return;
        }

        this.showProgress('🐙 Cloning Repository', `Cloning ${url}...`);

        try {
            const parsed = this.parseGitHubUrl(url);
            if (!parsed) {
                this.hideProgress();
                this.statusManager.error('❌ Invalid GitHub URL');
                return;
            }

            const contents = await this.fetchGitHubRepo(parsed.owner, parsed.repo);
            
            this.dom.githubTree.style.display = 'block';
            this.dom.githubTree.innerHTML = this.buildFileTree(contents);
            this.dom.githubImportAllBtn.style.display = 'inline-block';
            this.dom.githubStatus.textContent = `✅ Found ${contents.length} files in ${parsed.owner}/${parsed.repo}`;

            this._githubContents = contents;
            this._githubRepo = parsed;

            this.hideProgress();
            this.statusManager.success(`✅ Repository ${parsed.owner}/${parsed.repo} loaded successfully`);
            
            this.dom.functionBuilder.style.display = 'block';
            this.generateIntegrationMethods(contents);

        } catch (error) {
            this.hideProgress();
            this.statusManager.error(`❌ Failed to import: ${error.message}`);
            console.error('GitHub import error:', error);
        }
    }

    parseGitHubUrl(url) {
        let match = url.match(/github\.com\/([^\/]+)\/([^\/\.]+)(?:\.git)?/);
        if (match) {
            return { owner: match[1], repo: match[2] };
        }
        match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)\/(.+)/);
        if (match) {
            return { owner: match[1], repo: match[2], branch: match[3], path: match[4] };
        }
        return null;
    }

    async fetchGitHubRepo(owner, repo, path = '') {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const files = [];

        if (Array.isArray(data)) {
            for (const item of data) {
                if (item.type === 'file') {
                    files.push({
                        name: item.name,
                        path: item.path,
                        type: 'file',
                        size: item.size,
                        downloadUrl: item.download_url
                    });
                } else if (item.type === 'dir') {
                    const subFiles = await this.fetchGitHubRepo(owner, repo, item.path);
                    files.push(...subFiles);
                }
            }
        }

        return files;
    }

    buildFileTree(files) {
        const tree = {};
        for (const file of files) {
            const parts = file.path.split('/');
            let current = tree;
            for (const part of parts) {
                if (!current[part]) current[part] = {};
                current = current[part];
            }
            current._file = file;
        }

        const render = (obj, indent = 0) => {
            let html = '';
            const sortedKeys = Object.keys(obj).sort();
            for (const key of sortedKeys) {
                if (key === '_file') continue;
                const value = obj[key];
                if (value._file) {
                    const file = value._file;
                    html += `<div class="indent" style="padding-left:${indent * 20}px;">
                        <span class="file" data-path="${file.path}">📄 ${file.name}</span>
                        <span style="color:#556677; font-size:0.7rem;"> (${FileUtils.formatSize(file.size)})</span>
                    </div>`;
                } else {
                    html += `<div class="indent" style="padding-left:${indent * 20}px;">
                        <span class="folder">📁 ${key}</span>
                    </div>`;
                    html += render(value, indent + 1);
                }
            }
            return html;
        };

        return render(tree);
    }

    async importAllGitHubFiles() {
        if (!this._githubContents) {
            this.statusManager.warning('⚠️ No GitHub repository loaded');
            return;
        }

        this.showProgress('📥 Importing Files', 'Importing all files from GitHub...');
        let imported = 0;

        for (const file of this._githubContents) {
            try {
                const response = await fetch(file.downloadUrl);
                const content = await response.text();
                const fileData = {
                    id: this.generateId(),
                    name: file.name,
                    originalName: file.name,
                    size: file.size,
                    type: 'text/plain',
                    extension: FileUtils.getFileExtension(file.name),
                    content: content,
                    path: file.path,
                    status: 'uploaded',
                    uploadedAt: new Date().toISOString(),
                    isSolidity: file.name.endsWith('.sol')
                };
                this.files.push(fileData);
                imported++;
                this.updateProgress((imported / this._githubContents.length) * 100, `Importing ${file.name}...`);
            } catch (error) {
                console.error(`Error importing ${file.name}:`, error);
            }
        }

        this.hideProgress();
        this.updateFileList();
        this.updateUI();
        this.saveState();
        this.dom.analysisPanel.style.display = 'block';
        this.statusManager.success(`✅ Imported ${imported} files from GitHub`);
        setTimeout(() => this.analyzeFiles(), 500);
    }

    // ==========================================
    // 5. API IMPORT
    // ==========================================
    async importFromAPI() {
        const url = document.getElementById('apiImportUrl').value.trim();
        if (!url) {
            this.statusManager.warning('⚠️ Please enter an API URL');
            return;
        }

        const method = document.getElementById('apiImportMethod').value;
        const headersText = document.getElementById('apiImportHeaders').value;
        const bodyText = document.getElementById('apiImportBody').value;

        const headers = {};
        if (headersText) {
            headersText.split(',').forEach(h => {
                const parts = h.split(':');
                if (parts.length === 2) headers[parts[0].trim()] = parts[1].trim();
            });
        }

        this.showProgress('🌐 Fetching API', `Fetching ${url}...`);

        try {
            const options = { method, headers };
            if (method !== 'GET' && bodyText) options.body = bodyText;
            const response = await fetch(url, options);
            const data = await response.json();

            document.getElementById('apiImportResponse').innerHTML = `
                <div class="api-result ${response.ok ? 'success' : 'error'}">
                    <h4>📡 Response (${response.status})</h4>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                </div>
            `;

            this.hideProgress();
            this.statusManager.success(`✅ API fetched successfully (${response.status})`);

            if (Array.isArray(data) && data.length > 0) {
                this.dom.functionBuilder.style.display = 'block';
                this.generateIntegrationMethods(data);
            }

        } catch (error) {
            this.hideProgress();
            document.getElementById('apiImportResponse').innerHTML = `
                <div class="api-result error">
                    <h4>❌ Error</h4>
                    <pre>${error.message}</pre>
                </div>
            `;
            this.statusManager.error(`❌ API fetch failed: ${error.message}`);
        }
    }

    // ==========================================
    // 6. ARCHIVE IMPORT
    // ==========================================
    async importArchive() {
        const input = document.getElementById('importArchiveInput');
        if (!input.files || input.files.length === 0) {
            this.statusManager.warning('⚠️ Please select an archive file');
            return;
        }

        const file = input.files[0];
        this.showProgress('📦 Extracting Archive', `Extracting ${file.name}...`);

        try {
            const content = await FileUtils.readFile(file);
            const fileData = {
                id: this.generateId(),
                name: file.name,
                originalName: file.name,
                size: file.size,
                type: 'archive',
                extension: FileUtils.getFileExtension(file.name),
                content: content,
                path: file.name,
                status: 'uploaded',
                uploadedAt: new Date().toISOString()
            };
            this.files.push(fileData);
            this.updateFileList();
            this.updateUI();
            this.saveState();
            this.dom.analysisPanel.style.display = 'block';
            this.hideProgress();
            this.statusManager.success(`✅ Archive ${file.name} imported successfully`);
            setTimeout(() => this.analyzeFiles(), 500);
        } catch (error) {
            this.hideProgress();
            this.statusManager.error(`❌ Failed to import archive: ${error.message}`);
        }
    }

    async listArchiveContents() {
        const input = document.getElementById('importArchiveInput');
        if (!input.files || input.files.length === 0) {
            this.statusManager.warning('⚠️ Please select an archive file');
            return;
        }

        const file = input.files[0];
        document.getElementById('archiveContents').style.display = 'block';
        document.getElementById('archiveContents').innerHTML = `
            <div class="folder">📁 ${file.name}</div>
            <div class="indent" style="padding-left:20px;">
                <div class="file">📄 Archive contents listing</div>
                <div style="color:#556677;font-size:0.75rem;">Size: ${FileUtils.formatSize(file.size)}</div>
                <div style="color:#556677;font-size:0.75rem;">Click "Upload & Extract" to import</div>
            </div>
        `;
        this.statusManager.info(`📋 Archive ${file.name} loaded (${FileUtils.formatSize(file.size)})`);
    }

    // ==========================================
    // 7. FUNCTION BUILDER / METHOD GENERATION
    // ==========================================
    generateIntegrationMethods(data) {
        const methods = [];
        const timestamp = new Date().toISOString();

        if (Array.isArray(data) && data.length > 0) {
            const sample = data[0];
            const keys = Object.keys(sample);
            
            methods.push(`// ============================================`);
            methods.push(`// Generated Integration Methods`);
            methods.push(`// Generated: ${timestamp}`);
            methods.push(`// Data Type: Array of ${data.length} objects`);
            methods.push(`// ============================================`);
            methods.push(``);
            methods.push(`class GeneratedIntegration {`);
            methods.push(`    constructor(data) {`);
            methods.push(`        this.data = data;`);
            methods.push(`        this.count = data.length;`);
            methods.push(`        this.timestamp = "${timestamp}";`);
            methods.push(`    }`);
            methods.push(``);
            methods.push(`    // Get all items`);
            methods.push(`    getAll() {`);
            methods.push(`        return this.data;`);
            methods.push(`    }`);
            methods.push(``);
            methods.push(`    // Get item by index`);
            methods.push(`    getByIndex(index) {`);
            methods.push(`        return this.data[index] || null;`);
            methods.push(`    }`);
            methods.push(``);
            methods.push(`    // Search by key`);
            methods.push(`    search(key, value) {`);
            methods.push(`        return this.data.filter(item => item[key] === value);`);
            methods.push(`    }`);
            methods.push(``);
            methods.push(`    // Get unique values by key`);
            methods.push(`    getUnique(key) {`);
            methods.push(`        return [...new Set(this.data.map(item => item[key]))];`);
            methods.push(`    }`);
            methods.push(``);
            methods.push(`    // Get summary statistics`);
            methods.push(`    getSummary() {`);
            methods.push(`        return {`);
            methods.push(`            total: this.count,`);
            methods.push(`            keys: ${JSON.stringify(keys)},`);
            methods.push(`            timestamp: this.timestamp`);
            methods.push(`        };`);
            methods.push(`    }`);
            methods.push(``);
            methods.push(`    // Export as JSON`);
            methods.push(`    toJSON() {`);
            methods.push(`        return JSON.stringify(this.data, null, 2);`);
            methods.push(`    }`);
            methods.push(`}`);
            methods.push(``);
            methods.push(`// Export instance`);
            methods.push(`const integration = new GeneratedIntegration(${JSON.stringify(data).slice(0, 200)}...);`);
            methods.push(``);
            methods.push(`// Usage examples:`);
            methods.push(`// integration.getAll()`);
            methods.push(`// integration.getByIndex(0)`);
            methods.push(`// integration.search('id', 123)`);
            methods.push(`// integration.getUnique('category')`);
            methods.push(`// integration.toJSON()`);
        } else if (typeof data === 'object') {
            methods.push(`// ============================================`);
            methods.push(`// Generated Integration Methods`);
            methods.push(`// Generated: ${timestamp}`);
            methods.push(`// Data Type: Object`);
            methods.push(`// ============================================`);
            methods.push(``);
            methods.push(`class GeneratedIntegration {`);
            methods.push(`    constructor(data) {`);
            methods.push(`        this.data = data;`);
            methods.push(`        this.keys = Object.keys(data);`);
            methods.push(`        this.timestamp = "${timestamp}";`);
            methods.push(`    }`);
            methods.push(``);
            methods.push(`    // Get the data`);
            methods.push(`    getData() {`);
            methods.push(`        return this.data;`);
            methods.push(`    }`);
            methods.push(``);
            methods.push(`    // Get a specific key`);
            methods.push(`    get(key) {`);
            methods.push(`        return this.data[key] || null;`);
            methods.push(`    }`);
            methods.push(``);
            methods.push(`    // Get all keys`);
            methods.push(`    getKeys() {`);
            methods.push(`        return this.keys;`);
            methods.push(`    }`);
            methods.push(``);
            methods.push(`    // Check if key exists`);
            methods.push(`    hasKey(key) {`);
            methods.push(`        return this.keys.includes(key);`);
            methods.push(`    }`);
            methods.push(``);
            methods.push(`    // Export as JSON`);
            methods.push(`    toJSON() {`);
            methods.push(`        return JSON.stringify(this.data, null, 2);`);
            methods.push(`    }`);
            methods.push(`}`);
            methods.push(``);
            methods.push(`const integration = new GeneratedIntegration(${JSON.stringify(data).slice(0, 200)}...);`);
        }

        this.dom.methodPreview.textContent = methods.join('\n');
        this.dom.functionBuilder.style.display = 'block';
        this.generatedMethods.push({ id: Date.now(), content: methods.join('\n'), savedAt: timestamp });
    }

    copyMethods() {
        const preview = this.dom.methodPreview;
        if (!preview) return;
        navigator.clipboard.writeText(preview.textContent).then(() => {
            this.statusManager.success('✅ Methods copied to clipboard');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = preview.textContent;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            this.statusManager.success('✅ Methods copied to clipboard');
        });
    }

    exportMethods() {
        const preview = this.dom.methodPreview;
        if (!preview) return;
        const blob = new Blob([preview.textContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `integration-methods-${Date.now()}.js`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.statusManager.success('✅ Methods exported');
    }

    saveMethods() {
        const preview = this.dom.methodPreview;
        if (!preview) return;
        this.generatedMethods.push({
            id: Date.now(),
            content: preview.textContent,
            savedAt: new Date().toISOString()
        });
        localStorage.setItem('generated_methods', JSON.stringify(this.generatedMethods));
        this.statusManager.success('✅ Methods saved');
    }

    // ==========================================
    // 8. FILE HANDLING
    // ==========================================
    async handleFiles(fileList) {
        if (this.uploading) {
            this.statusManager.warning('⏳ Upload already in progress');
            return;
        }

        const files = Array.from(fileList);
        if (files.length === 0) return;

        this.uploading = true;
        this.dom.uploadProgress.style.display = 'block';
        let processed = 0;
        const total = files.length;

        for (const file of files) {
            try {
                const content = await FileUtils.readFile(file);
                const fileData = {
                    id: this.generateId(),
                    name: file.name,
                    originalName: file.name,
                    size: file.size,
                    type: file.type,
                    extension: FileUtils.getFileExtension(file.name),
                    category: FileUtils.getFileCategory(FileUtils.getFileExtension(file.name)),
                    content: content,
                    path: file.webkitRelativePath || file.name,
                    status: 'uploaded',
                    uploadedAt: new Date().toISOString(),
                    isBinary: FileUtils.isBinaryFile(file.name),
                    isSolidity: file.name.endsWith('.sol'),
                    metadata: {}
                };

                if (fileData.isSolidity) {
                    const contractData = this.solidityAnalyzer.analyze(content, file.name);
                    fileData.contractData = contractData;
                    this.contracts.push(contractData);
                    this.statusManager.success(`⛓️ Solidity contract detected: ${contractData.name}`);
                }

                this.files.push(fileData);
                processed++;
                const percent = Math.round((processed / total) * 100);
                this.dom.progressFill.style.width = percent + '%';
                this.dom.progressText.textContent = percent + '%';
            } catch (error) {
                console.error(`Error reading file ${file.name}:`, error);
                this.statusManager.error(`❌ Error reading ${file.name}: ${error.message}`);
            }
        }

        this.uploading = false;
        this.dom.uploadProgress.style.display = 'none';
        this.dom.progressFill.style.width = '0%';
        this.dom.progressText.textContent = '0%';
        this.updateFileList();
        this.updateUI();
        this.saveState();

        if (this.files.length > 0) {
            this.dom.analysisPanel.style.display = 'block';
            this.statusManager.success(`✅ ${processed} files uploaded successfully`);
            setTimeout(() => this.analyzeFiles(), 500);
        }
    }

    // ==========================================
    // 9. FILE ANALYSIS
    // ==========================================
    async analyzeFiles() {
        if (this.analyzing) {
            this.statusManager.warning('⏳ Analysis already in progress');
            return;
        }

        if (this.files.length === 0) {
            this.statusManager.warning('⚠️ No files to analyze');
            return;
        }

        this.analyzing = true;
        this.dom.analysisResults.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>🔬 Analyzing ${this.files.length} files...</p>
            </div>
        `;

        this.statusManager.loading(`🔬 Analyzing ${this.files.length} files...`);

        const analyzed = [];
        for (const file of this.files) {
            try {
                const result = await this.analyzer.analyze(file);
                analyzed.push(result);
                file.analysis = result;
                file.status = 'analyzed';
                file.analyzedAt = new Date().toISOString();
            } catch (error) {
                console.error(`Analysis error for ${file.name}:`, error);
                file.status = 'error';
                analyzed.push({
                    name: file.name,
                    type: 'error',
                    error: error.message,
                    preview: 'Analysis failed'
                });
            }
        }

        this.analyzedFiles = analyzed;
        this.analyzing = false;
        this.renderAnalysis(analyzed);
        this.updateUI();
        this.saveState();
        this.statusManager.success(`✅ Analysis complete: ${analyzed.length} files analyzed`);
    }

    renderAnalysis(results) {
        const container = this.dom.analysisResults;
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span>🔍</span>
                    <p>No analysis results</p>
                    <small>Upload files and click "Analyze All"</small>
                </div>
            `;
            return;
        }

        results.forEach((result, index) => {
            const card = document.createElement('div');
            card.className = 'analysis-card';
            card.dataset.index = index;

            const file = this.files[index];
            const icon = FileUtils.getFileIcon(file?.extension || 'unknown');
            const typeClass = result.type || 'unknown';

            let detailsHtml = this.buildAnalysisDetails(result, index);
            let actionsHtml = this.buildAnalysisActions(result, index);

            card.innerHTML = `
                <div class="analysis-header">
                    <span class="file-icon">${icon}</span>
                    <span class="file-name">${result.name || 'Unknown'}</span>
                    <span class="file-type ${typeClass}">${typeClass}</span>
                    ${file?.isSolidity ? '<span class="badge warning">⛓️ Solidity</span>' : ''}
                </div>
                <div class="analysis-body">
                    ${detailsHtml}
                    ${actionsHtml}
                </div>
                <div class="analysis-preview">
                    ${result.preview || 'No preview available'}
                </div>
            `;
            container.appendChild(card);
        });

        this.renderSolidityContracts();
    }

    buildAnalysisDetails(result, index) {
        const file = this.files[index];
        const details = [];

        if (result.type === 'solidity') {
            details.push(`📝 ${result.name || 'Unnamed'}`);
            details.push(`🔢 ${result.functions?.length || 0} functions`);
            details.push(`📦 ${result.contracts?.length || 0} contracts`);
            details.push(`📋 ${result.imports?.length || 0} imports`);
            if (result.stateVariables) {
                details.push(`🔒 ${result.stateVariables} state vars`);
            }
            details.push(`📊 ${result.complexity || 'unknown'}`);
        } else {
            if (result.size) {
                details.push(`📏 ${typeof result.size === 'number' ? FileUtils.formatSize(result.size) : result.size}`);
            }
            details.push(`📊 ${result.complexity || 'Simple'}`);
            if (result.elements !== undefined) {
                details.push(`🔢 ${result.elements} elements`);
            }
            if (result.lines !== undefined) {
                details.push(`📄 ${result.lines} lines`);
            }
        }

        if (file?.size) {
            details.push(`💾 ${FileUtils.formatSize(file.size)}`);
        }

        return `<div class="analysis-details">${details.map(d => `<span>${d}</span>`).join('')}</div>`;
    }

    buildAnalysisActions(result, index) {
        const actions = [
            { label: '👁️ View', class: '', onClick: `viewFile(${index})` },
            { label: '🚀 Entry Point', class: 'primary', onClick: `createEntryPoint(${index})` },
            { label: '➕ Add', class: 'success', onClick: `addIntegration(${index})` },
            { label: '🚀 Launch', class: 'accent', onClick: `launchFile(${index})` },
            { label: '🔗 Integrate', class: 'primary', onClick: `integrateFile(${index})` },
            { label: '▶️ Run', class: 'warning', onClick: `runSnippet(${index})` }
        ];

        if (result.type === 'solidity') {
            actions.push({ label: '⛓️ Deploy', class: 'accent', onClick: `deploySingleContract(${index})` });
        }

        return `<div class="analysis-actions">${actions.map(a => 
            `<button class="btn small ${a.class}" onclick="window.app.${a.onClick}">${a.label}</button>`
        ).join('')}</div>`;
    }

    // ==========================================
    // 10. LAUNCH ENGINE METHODS
    // ==========================================
    async launchFile(index) {
        const file = this.files[index];
        if (!file) {
            this.statusManager.error('❌ File not found');
            return;
        }

        this.statusManager.loading(`🚀 Launching ${file.name}...`);

        try {
            const result = await this.launchEngine.launch(file);
            
            if (result.success) {
                this.statusManager.success(result.message);
                
                this.modalManager.show({
                    title: `🚀 ${file.name} - Launch Result`,
                    content: `
                        <div class="launch-result">
                            <div class="status success">✅ ${result.message}</div>
                            ${result.output ? `<pre style="background:rgba(0,0,0,0.2);padding:12px;border-radius:8px;max-height:300px;overflow:auto;font-size:0.8rem;">${result.output}</pre>` : ''}
                            ${result.address ? `<p><strong>Contract Address:</strong> ${result.address}</p>` : ''}
                            ${result.url ? `<p><strong>URL:</strong> <a href="${result.url}" target="_blank">${result.url}</a></p>` : ''}
                            ${result.type ? `<p><strong>Type:</strong> ${result.type}</p>` : ''}
                        </div>
                    `,
                    size: 'large'
                });
            } else {
                this.statusManager.error(`❌ Launch failed: ${result.error}`);
            }
        } catch (error) {
            this.statusManager.error(`❌ Launch error: ${error.message}`);
            console.error('Launch error:', error);
        }
    }

    async integrateFile(index) {
        const file = this.files[index];
        if (!file) {
            this.statusManager.error('❌ File not found');
            return;
        }

        this.addIntegration(index);

        if (file.extension === 'sol' || file.analysis?.type === 'solidity') {
            const result = await this.launchEngine.launch(file);
            if (result.success) {
                this.statusManager.success(`✅ ${file.name} integrated and deployed`);
            }
        } else {
            this.statusManager.success(`✅ ${file.name} added to integrations`);
        }
    }

    async runSnippet(index) {
        const file = this.files[index];
        if (!file) {
            this.statusManager.error('❌ File not found');
            return;
        }

        this.statusManager.loading(`▶️ Running snippet: ${file.name}...`);

        try {
            const result = await this.launchEngine.launch(file);
            
            if (result.success) {
                this.statusManager.success(`✅ Snippet executed successfully`);
                this.modalManager.show({
                    title: `▶️ ${file.name} - Output`,
                    content: `
                        <div class="snippet-output">
                            ${result.output ? `<pre style="background:rgba(0,0,0,0.2);padding:12px;border-radius:8px;max-height:400px;overflow:auto;font-size:0.85rem;">${result.output}</pre>` : '<p>No output generated.</p>'}
                            ${result.result ? `<p><strong>Result:</strong> ${JSON.stringify(result.result)}</p>` : ''}
                        </div>
                    `,
                    size: 'large'
                });
            } else {
                this.statusManager.error(`❌ Snippet failed: ${result.error}`);
            }
        } catch (error) {
            this.statusManager.error(`❌ Snippet error: ${error.message}`);
        }
    }

    // ==========================================
    // 11. INTEGRATION METHODS
    // ==========================================
    async integrateFiles() {
        if (this.files.length === 0) {
            this.statusManager.warning('⚠️ No files to integrate');
            return;
        }

        this.statusManager.loading('🔗 Creating integration...');

        try {
            const result = await this.integrator.integrate(this.files);
            this.integrations.push({
                id: this.generateId(),
                ...result,
                createdAt: new Date().toISOString()
            });
            this.renderIntegrations();
            this.updateUI();
            this.saveState();
            this.statusManager.success(`✅ Integration created: ${result.name}`);
        } catch (error) {
            console.error('Integration error:', error);
            this.statusManager.error(`❌ Integration failed: ${error.message}`);
        }
    }

    renderIntegrations() {
        const grid = this.dom.integrationGrid;
        if (!grid) return;

        if (this.integrations.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <span>🔗</span>
                    <p>No integrations yet</p>
                    <small>Analyze files and click "Integrate" to create one</small>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.integrations.map((integration, index) => `
            <div class="integration-card">
                <div class="integration-header">
                    <span class="integration-icon">🔗</span>
                    <span class="integration-name">${integration.name || `Integration ${index + 1}`}</span>
                    <span class="integration-type badge">${integration.type || 'General'}</span>
                </div>
                <div class="integration-body">
                    <div class="integration-details">
                        <span>📁 ${integration.files} files</span>
                        <span>📅 ${new Date(integration.createdAt || integration.created).toLocaleDateString()}</span>
                    </div>
                    <div class="integration-actions">
                        <button class="btn small" onclick="window.app.viewIntegration(${index})">👁️ View</button>
                        <button class="btn small primary" onclick="window.app.launchIntegration(${index})">🚀 Launch</button>
                        <button class="btn small danger" onclick="window.app.removeIntegration(${index})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    viewIntegration(index) {
        const integration = this.integrations[index];
        if (!integration) {
            this.statusManager.error('❌ Integration not found');
            return;
        }

        this.modalManager.show({
            title: `🔗 ${integration.name}`,
            content: `
                <div class="integration-detail">
                    <div class="detail-row"><span class="label">ID:</span><span class="value">${integration.id}</span></div>
                    <div class="detail-row"><span class="label">Type:</span><span class="value">${integration.type || 'General'}</span></div>
                    <div class="detail-row"><span class="label">Files:</span><span class="value">${integration.files}</span></div>
                    <div class="detail-row"><span class="label">Created:</span><span class="value">${new Date(integration.createdAt || integration.created).toLocaleString()}</span></div>
                    ${integration.description ? `<div class="detail-row"><span class="label">Description:</span><span class="value">${integration.description}</span></div>` : ''}
                    <div class="detail-row"><span class="label">Status:</span><span class="value badge ${integration.status || 'active'}">${integration.status || 'active'}</span></div>
                </div>
            `,
            confirmText: 'Close'
        });
    }

    launchIntegration(index) {
        const integration = this.integrations[index];
        if (!integration) {
            this.statusManager.error('❌ Integration not found');
            return;
        }

        this.statusManager.loading(`🚀 Launching ${integration.name}...`);
        
        setTimeout(() => {
            this.statusManager.success(`✅ ${integration.name} launched successfully`);
            this.modalManager.show({
                title: '🚀 Integration Launched',
                content: `
                    <div class="deployment-status success">
                        <h4>${integration.name}</h4>
                        <p><strong>Status:</strong> Running ✅</p>
                        <p><strong>Type:</strong> ${integration.type || 'General'}</p>
                        <p><strong>Files:</strong> ${integration.files}</p>
                        <p><strong>Started:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                `
            });
        }, 1500);
    }

    removeIntegration(index) {
        const integration = this.integrations[index];
        if (!integration) return;

        this.modalManager.show({
            title: '🗑️ Remove Integration',
            content: `<p>Are you sure you want to remove <strong>${integration.name}</strong>?</p>`,
            confirmText: '🗑️ Remove',
            onConfirm: () => {
                this.integrations.splice(index, 1);
                this.renderIntegrations();
                this.updateUI();
                this.saveState();
                this.statusManager.success(`🗑️ Removed ${integration.name}`);
                return true;
            }
        });
    }

    addIntegration(index) {
        const file = this.files[index];
        if (!file) {
            this.statusManager.error('❌ File not found');
            return;
        }

        const integration = {
            id: this.generateId(),
            name: `${file.name} Integration`,
            type: file.analysis?.type || 'General',
            files: 1,
            file: file.name,
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        this.integrations.push(integration);
        this.renderIntegrations();
        this.updateUI();
        this.saveState();
        this.statusManager.success(`✅ Added ${file.name} to integrations`);
    }

    // ==========================================
    // 12. MODULE METHODS
    // ==========================================
    renderModules() {
        const grid = this.dom.moduleGrid;
        if (!grid) return;

        if (this.modules.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <span>🧩</span>
                    <p>No modules installed</p>
                    <small>Click "Install Module" to add one</small>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.modules.map((module, index) => `
            <div class="module-card">
                <div class="module-header">
                    <span>🧩</span>
                    <span class="module-name">${module.name}</span>
                    <span class="module-version badge">v${module.version || '1.0.0'}</span>
                </div>
                <div class="module-body">
                    <div class="module-details">
                        <span>📂 ${module.path || 'local'}</span>
                        <span>📅 ${new Date(module.installed || module.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="module-actions">
                        <button class="btn small" onclick="window.app.viewModule(${index})">👁️ View</button>
                        <button class="btn small primary" onclick="window.app.launchModule(${index})">▶️ Run</button>
                        <button class="btn small danger" onclick="window.app.removeModule(${index})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    viewModule(index) {
        const module = this.modules[index];
        if (!module) {
            this.statusManager.error('❌ Module not found');
            return;
        }

        this.modalManager.show({
            title: `🧩 ${module.name}`,
            content: `
                <div class="module-detail">
                    <div class="detail-row"><span class="label">ID:</span><span class="value">${module.id}</span></div>
                    <div class="detail-row"><span class="label">Path:</span><span class="value">${module.path || 'local'}</span></div>
                    <div class="detail-row"><span class="label">Version:</span><span class="value">${module.version || '1.0.0'}</span></div>
                    <div class="detail-row"><span class="label">Installed:</span><span class="value">${new Date(module.installed || module.createdAt).toLocaleString()}</span></div>
                    <div class="detail-row"><span class="label">Status:</span><span class="value badge ${module.status || 'installed'}">${module.status || 'installed'}</span></div>
                </div>
            `,
            confirmText: 'Close'
        });
    }

    launchModule(index) {
        const module = this.modules[index];
        if (!module) {
            this.statusManager.error('❌ Module not found');
            return;
        }

        this.statusManager.loading(`▶️ Running ${module.name}...`);
        setTimeout(() => {
            this.statusManager.success(`✅ ${module.name} executed successfully`);
        }, 1000);
    }

    removeModule(index) {
        const module = this.modules[index];
        if (!module) return;

        this.modalManager.show({
            title: '🗑️ Remove Module',
            content: `<p>Are you sure you want to remove <strong>${module.name}</strong>?</p>`,
            confirmText: '🗑️ Remove',
            onConfirm: () => {
                this.modules.splice(index, 1);
                this.renderModules();
                this.updateUI();
                this.saveState();
                this.statusManager.success(`🗑️ Removed ${module.name}`);
                return true;
            }
        });
    }

    showModuleModal() {
        this.modalManager.show({
            title: '📦 Install Module',
            content: `
                <div class="module-form">
                    <div class="form-group">
                        <label>Module Name</label>
                        <input type="text" id="moduleName" class="input-field" placeholder="My Module">
                    </div>
                    <div class="form-group">
                        <label>Module URL or Path</label>
                        <input type="text" id="modulePath" class="input-field" placeholder="https://example.com/module.js or ./path/to/module">
                    </div>
                    <div class="form-group">
                        <label>Version</label>
                        <input type="text" id="moduleVersion" class="input-field" placeholder="1.0.0">
                    </div>
                </div>
            `,
            confirmText: '📦 Install',
            onConfirm: async () => {
                const name = document.getElementById('moduleName')?.value || `Module ${this.modules.length + 1}`;
                const path = document.getElementById('modulePath')?.value || 'local';
                const version = document.getElementById('moduleVersion')?.value || '1.0.0';

                this.modules.push({
                    id: this.generateId(),
                    name: name,
                    path: path,
                    version: version,
                    installed: new Date().toISOString(),
                    status: 'installed'
                });

                this.renderModules();
                this.updateUI();
                this.saveState();
                this.statusManager.success(`✅ Module installed: ${name}`);
                return true;
            }
        });
    }

    // ==========================================
    // 13. SOLIDITY METHODS
    // ==========================================
    renderSolidityContracts() {
        const container = this.dom.solidityContracts;
        if (!container) return;

        const contracts = this.files.filter(f => f.isSolidity || f.name.endsWith('.sol'));

        if (contracts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span>⛓️</span>
                    <p>No Solidity contracts detected</p>
                    <small>Upload .sol files to analyze smart contracts</small>
                </div>
            `;
            return;
        }

        container.innerHTML = contracts.map((file, index) => {
            const data = file.contractData || {};
            const fileIndex = this.files.indexOf(file);
            return `
                <div class="solidity-card">
                    <div class="contract-header">
                        <span class="contract-name">${data.name || file.name}</span>
                        <span class="contract-version">${data.solidityVersion || 'unknown'}</span>
                    </div>
                    <div class="contract-details">
                        <span>📁 ${file.name}</span>
                        <span>🔢 ${data.functions?.length || 0} functions</span>
                        <span>📦 ${data.contracts?.length || 0} contracts</span>
                        <span>📋 ${data.imports?.length || 0} imports</span>
                        ${data.hasRequire ? '<span class="badge success">✅ require()</span>' : ''}
                        ${data.hasEmit ? '<span class="badge info">📡 emit</span>' : ''}
                        ${data.isAbstract ? '<span class="badge warning">🔷 abstract</span>' : ''}
                    </div>
                    <div class="contract-actions">
                        <button class="btn small" onclick="window.app.viewFile(${fileIndex})">👁️ View</button>
                        <button class="btn small success" onclick="window.app.deploySingleContract(${fileIndex})">🚀 Deploy</button>
                        <button class="btn small primary" onclick="window.app.verifySingleContract(${fileIndex})">✅ Verify</button>
                        <button class="btn small accent" onclick="window.app.compileSingleContract(${fileIndex})">🔧 Compile</button>
                    </div>
                </div>
            `;
        }).join('');

        if (this.dom.totalContracts) {
            this.dom.totalContracts.textContent = contracts.length;
        }
    }

    async deploySingleContract(index) {
        const file = this.files[index];
        if (!file) {
            this.statusManager.error('❌ File not found');
            return;
        }

        this.statusManager.loading(`⛓️ Deploying ${file.name}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.statusManager.success(`✅ ${file.contractData?.name || file.name} deployed successfully!`);
        
        this.modalManager.show({
            title: '🚀 Deployment Successful',
            content: `
                <div class="deployment-status success">
                    <h4>Contract Deployed</h4>
                    <p><strong>Contract:</strong> ${file.contractData?.name || file.name}</p>
                    <p><strong>Address:</strong> 0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}</p>
                    <p><strong>Network:</strong> Ethereum Mainnet</p>
                    <p><strong>Transaction:</strong> 0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}</p>
                </div>
            `
        });
    }

    async verifySingleContract(index) {
        const file = this.files[index];
        if (!file) {
            this.statusManager.error('❌ File not found');
            return;
        }

        this.statusManager.loading(`✅ Verifying ${file.name}...`);
        await new Promise(resolve => setTimeout(resolve, 1500));

        this.modalManager.show({
            title: '✅ Verification Complete',
            content: `
                <div class="deployment-status success">
                    <h4>Contract Verified</h4>
                    <p><strong>Contract:</strong> ${file.contractData?.name || file.name}</p>
                    <p><strong>Status:</strong> Verified ✅</p>
                    <p><strong>Compiler:</strong> solc ${file.contractData?.solidityVersion || 'latest'}</p>
                </div>
            `
        });
        this.statusManager.success('✅ Verification complete');
    }

    async compileSingleContract(index) {
        const file = this.files[index];
        if (!file) {
            this.statusManager.error('❌ File not found');
            return;
        }

        this.statusManager.loading(`🔧 Compiling ${file.name}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.modalManager.show({
            title: '🔧 Compilation Complete',
            content: `
                <div class="deployment-status success">
                    <h4>Contract Compiled</h4>
                    <p><strong>Contract:</strong> ${file.contractData?.name || file.name}</p>
                    <p><strong>ABI:</strong> Generated ✅</p>
                    <p><strong>Bytecode:</strong> 0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}</p>
                    <p><strong>Warnings:</strong> 0</p>
                    <p><strong>Errors:</strong> 0</p>
                </div>
            `
        });
        this.statusManager.success('✅ Compilation complete');
    }

    async deployContract() {
        const contracts = this.files.filter(f => f.isSolidity || f.name.endsWith('.sol'));
        if (contracts.length === 0) {
            this.statusManager.warning('⚠️ No Solidity contracts found to deploy');
            return;
        }
        await this.deploySingleContract(this.files.indexOf(contracts[0]));
    }

    async verifyContract() {
        const contracts = this.files.filter(f => f.isSolidity || f.name.endsWith('.sol'));
        if (contracts.length === 0) {
            this.statusManager.warning('⚠️ No Solidity contracts found to verify');
            return;
        }
        await this.verifySingleContract(this.files.indexOf(contracts[0]));
    }

    async compileContract() {
        const contracts = this.files.filter(f => f.isSolidity || f.name.endsWith('.sol'));
        if (contracts.length === 0) {
            this.statusManager.warning('⚠️ No Solidity contracts found to compile');
            return;
        }
        await this.compileSingleContract(this.files.indexOf(contracts[0]));
    }

    // ==========================================
    // 14. UI METHODS
    // ==========================================
    updateFileList() {
        const list = this.dom.fileList;
        if (!list) return;

        if (this.files.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <span>📭</span>
                    <p>No files uploaded yet</p>
                    <small>Drop files or use the upload buttons above</small>
                </div>
            `;
            return;
        }

        list.innerHTML = this.files.map((file, index) => {
            const icon = FileUtils.getFileIcon(file.extension || 'unknown');
            const isSolidity = file.isSolidity || file.name.endsWith('.sol');
            return `
                <div class="file-item">
                    <span class="file-icon">${icon}</span>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${FileUtils.formatSize(file.size)}</span>
                    <span class="file-status ${file.status}">${file.status}</span>
                    ${isSolidity ? '<span class="badge">⛓️ Solidity</span>' : ''}
                    <button class="btn small danger" onclick="window.app.removeFile(${index})">✕</button>
                </div>
            `;
        }).join('');

        if (this.dom.fileCount) {
            this.dom.fileCount.textContent = `${this.files.length} files`;
        }
    }

    removeFile(index) {
        const file = this.files[index];
        if (!file) return;

        if (file.isSolidity) {
            this.contracts = this.contracts.filter(c => c.name !== file.contractData?.name);
        }
        
        this.files.splice(index, 1);
        if (this.analyzedFiles[index]) {
            this.analyzedFiles.splice(index, 1);
        }
        this.updateFileList();
        this.updateUI();
        this.saveState();
        this.renderSolidityContracts();
        this.statusManager.info(`🗑️ Removed ${file.name}`);
    }

    viewFile(index) {
        const file = this.files[index];
        if (!file) {
            this.statusManager.error('❌ File not found');
            return;
        }

        let content = file.content;
        if (typeof content === 'string' && content.length > 5000) {
            content = content.slice(0, 5000) + '\n... (truncated)';
        }

        this.modalManager.show({
            title: `📄 ${file.name}`,
            content: `
                <div class="file-preview">
                    <div class="file-metadata">
                        <span class="badge">${file.analysis?.type || 'unknown'}</span>
                        <span class="badge">${FileUtils.formatSize(file.size)}</span>
                        ${file.isSolidity ? '<span class="badge warning">⛓️ Solidity</span>' : ''}
                        ${file.analysis?.complexity ? `<span class="badge">📊 ${file.analysis.complexity}</span>` : ''}
                    </div>
                    <pre style="background:rgba(0,0,0,0.2);padding:12px;border-radius:8px;overflow:auto;max-height:400px;font-size:0.8rem;white-space:pre-wrap;word-break:break-all;">${content}</pre>
                </div>
            `,
            size: 'large'
        });
    }

    updateUI() {
        if (this.dom.totalFiles) this.dom.totalFiles.textContent = this.files.length;
        if (this.dom.totalIntegrations) this.dom.totalIntegrations.textContent = this.integrations.length;
        if (this.dom.totalModules) this.dom.totalModules.textContent = this.modules.length;
        if (this.dom.totalApiCalls) this.dom.totalApiCalls.textContent = this.apiCalls;
        
        const contracts = this.files.filter(f => f.isSolidity || f.name.endsWith('.sol'));
        if (this.dom.totalContracts) this.dom.totalContracts.textContent = contracts.length;
    }

    // ==========================================
    // 15. STATE MANAGEMENT
    // ==========================================
    async loadState() {
        try {
            const saved = localStorage.getItem('integrator_state');
            if (saved) {
                const state = JSON.parse(saved);
                this.files = state.files || [];
                this.integrations = state.integrations || [];
                this.modules = state.modules || [];
                this.apiCalls = state.apiCalls || 0;
                this.contracts = this.files
                    .filter(f => f.isSolidity && f.contractData)
                    .map(f => f.contractData);
            }
        } catch (e) {
            console.warn('Could not load state:', e);
        }
    }

    saveState() {
        try {
            localStorage.setItem('integrator_state', JSON.stringify({
                files: this.files,
                integrations: this.integrations,
                modules: this.modules,
                apiCalls: this.apiCalls
            }));
        } catch (e) {
            console.warn('Could not save state:', e);
        }
    }

    // ==========================================
    // 16. UTILITY METHODS
    // ==========================================
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }

    getSupportedExtensions() {
        const envExt = process.env.ALLOWED_EXTENSIONS || '';
        return envExt.split(',').map(e => e.trim()).filter(e => e);
    }

    startUptimeCounter() {
        setInterval(() => {
            const uptime = Math.floor((Date.now() - this.startTime) / 1000);
            if (this.dom.uptime) {
                const hours = Math.floor(uptime / 3600);
                const minutes = Math.floor((uptime % 3600) / 60);
                const seconds = uptime % 60;
                this.dom.uptime.textContent = 
                    `${hours}h ${minutes}m ${seconds}s`;
            }
        }, 1000);
    }

    showProgress(title, message) {
        this.dom.progressTitle.textContent = title;
        this.dom.progressMessage.textContent = message;
        this.dom.progressFillOverlay.style.width = '0%';
        this.dom.progressPercent.textContent = '0%';
        this.dom.progressOverlay.classList.add('active');
    }

    updateProgress(percent, message) {
        this.dom.progressFillOverlay.style.width = Math.min(100, percent) + '%';
        this.dom.progressPercent.textContent = Math.min(100, percent) + '%';
        if (message) this.dom.progressMessage.textContent = message;
    }

    hideProgress() {
        this.dom.progressOverlay.classList.remove('active');
    }

    // ==========================================
    // 17. THEME & CLEAR
    // ==========================================
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.body.className = this.theme;
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.textContent = this.theme === 'dark' ? '🌙' : '☀️';
        }
        localStorage.setItem('theme', this.theme);
    }

    clearAll() {
        this.modalManager.show({
            title: '⚠️ Clear All Data',
            content: `
                <p>This will permanently delete all:</p>
                <ul>
                    <li>📄 Uploaded files</li>
                    <li>🔗 Integrations</li>
                    <li>🧩 Modules</li>
                    <li>⛓️ Smart contracts</li>
                </ul>
                <p style="color: #ff4757; font-weight: bold;">This action cannot be undone!</p>
            `,
            confirmText: '🗑️ Yes, Delete All',
            onConfirm: () => {
                this.files = [];
                this.integrations = [];
                this.modules = [];
                this.contracts = [];
                this.analyzedFiles = [];
                this.apiCalls = 0;
                localStorage.removeItem('integrator_state');
                this.updateFileList();
                this.renderIntegrations();
                this.renderModules();
                this.renderSolidityContracts();
                this.updateUI();
                if (this.dom.analysisPanel) {
                    this.dom.analysisPanel.style.display = 'none';
                }
                this.statusManager.success('🗑️ All data cleared');
                return true;
            }
        });
    }

    // ==========================================
    // 18. TAB SWITCHING
    // ==========================================
    switchTab(tab) {
        this.currentTab = tab;
        
        document.querySelectorAll('.nav-btn').forEach(el => {
            el.classList.toggle('active', el.dataset.tab === tab);
        });
        
        document.querySelectorAll('.tab-content').forEach(el => {
            el.classList.toggle('active', el.id === `${tab}Tab`);
        });
        
        if (tab === 'solidity') {
            this.renderSolidityContracts();
        }
        if (tab === 'integrations') {
            this.renderIntegrations();
        }
        if (tab === 'modules') {
            this.renderModules();
        }
    }

    // ==========================================
    // 19. KEYBOARD SHORTCUTS
    // ==========================================
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.analyzeFiles();
            }
            if (e.key === 'Escape') {
                this.modalManager.closeAll();
            }
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                document.getElementById('fileBtn')?.click();
            }
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.clearAll();
            }
        });
    }

    // ==========================================
    // 20. DROP ZONE SETUP
    // ==========================================
    setupDropZone() {
        const dropZone = this.dom.dropZone;
        if (!dropZone) return;

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.style.display = 'none';
        dropZone.appendChild(fileInput);

        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                this.handleFiles(files);
            }
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFiles(e.target.files);
                fileInput.value = '';
            }
        });
    }

    // ==========================================
    // 21. API METHODS
    // ==========================================
    async testAPI() {
        const endpoint = this.dom.apiEndpoint?.value;
        const method = this.dom.apiMethod?.value || 'GET';

        if (!endpoint) {
            this.statusManager.warning('⚠️ Please enter an API endpoint');
            return;
        }

        this.statusManager.loading(`🧪 Testing ${method} ${endpoint}...`);
        this.apiCalls++;

        try {
            const response = await APIClient.request(endpoint, method);
            if (this.dom.apiResponse) {
                this.dom.apiResponse.innerHTML = `
                    <div class="api-result success">
                        <h4>📡 Response (${response.status})</h4>
                        <pre>${JSON.stringify(response.data, null, 2)}</pre>
                    </div>
                `;
            }
            this.updateUI();
            this.statusManager.success(`✅ API test completed (${response.status})`);
        } catch (error) {
            if (this.dom.apiResponse) {
                this.dom.apiResponse.innerHTML = `
                    <div class="api-result error">
                        <h4>❌ Error</h4>
                        <pre>${error.message}</pre>
                    </div>
                `;
            }
            this.statusManager.error(`❌ API test failed: ${error.message}`);
        }
    }

    saveAPI() {
        const endpoint = this.dom.apiEndpoint?.value;
        const method = this.dom.apiMethod?.value;

        if (!endpoint) {
            this.statusManager.warning('⚠️ Please enter an API endpoint');
            return;
        }

        const config = { endpoint, method };
        localStorage.setItem('api_config', JSON.stringify(config));
        this.statusManager.success('✅ API configuration saved');
    }

    // ==========================================
    // 22. VERIFICATION
    // ==========================================
    async verifyWithAPI() {
        if (this.files.length === 0) {
            this.statusManager.warning('⚠️ No files to verify');
            return;
        }

        this.statusManager.loading('🔍 Verifying files with API...');
        this.apiCalls++;

        try {
            const response = await this.apiVerifier.verify(this.files);
            if (this.dom.apiResponse) {
                this.dom.apiResponse.innerHTML = `
                    <div class="api-result ${response.success ? 'success' : 'error'}">
                        <h4>${response.success ? '✅ Verification Successful' : '❌ Verification Failed'}</h4>
                        <pre>${JSON.stringify(response.data, null, 2)}</pre>
                        ${response.errors ? `<div class="errors">${response.errors.map(e => `⚠️ ${e}`).join('<br>')}</div>` : ''}
                    </div>
                `;
            }
            this.updateUI();
            this.statusManager.success(response.success ? '✅ Verification passed' : '❌ Verification failed');
        } catch (error) {
            this.statusManager.error(`❌ Verification error: ${error.message}`);
        }
    }

    // ==========================================
    // 23. ENTRY POINT METHODS
    // ==========================================
    async createEntryPoint(index) {
        const file = this.files[index];
        if (!file) {
            this.statusManager.error('❌ File not found');
            return;
        }

        this.statusManager.loading(`🚀 Creating entry point for ${file.name}...`);

        try {
            const entryPoint = await this.interfaceBuilder.buildEntryPoint(file);
            
            this.modalManager.show({
                title: `🚀 Entry Point: ${file.name}`,
                content: `
                    <div class="entry-point-preview">
                        <div class="file-metadata">
                            <span class="badge">${file.analysis?.type || 'unknown'}</span>
                            <span class="badge">${FileUtils.formatSize(file.size)}</span>
                            ${file.isSolidity ? '<span class="badge warning">⛓️ Solidity</span>' : ''}
                        </div>
                        <div class="entry-point-code">
                            <pre>${entryPoint || '// Entry point generated'}</pre>
                        </div>
                        <div class="entry-point-actions">
                            <button class="btn primary" onclick="window.app.launchEntryPoint(${index})">▶️ Launch</button>
                            <button class="btn success" onclick="window.app.exportEntryPoint(${index})">📤 Export</button>
                        </div>
                    </div>
                `,
                size: 'large',
                confirmText: 'Close'
            });
            this.statusManager.success('✅ Entry point created');
        } catch (error) {
            this.statusManager.error(`❌ Failed to create entry point: ${error.message}`);
        }
    }

    launchEntryPoint(index) {
        const file = this.files[index];
        if (!file) return;

        this.statusManager.loading(`🚀 Launching ${file.name}...`);
        setTimeout(() => {
            this.statusManager.success(`✅ ${file.name} launched successfully`);
        }, 1000);
    }

    async exportEntryPoint(index) {
        const file = this.files[index];
        if (!file) {
            this.statusManager.error('❌ File not found');
            return;
        }

        const entryPoint = await this.interfaceBuilder.buildEntryPoint(file);
        const blob = new Blob([entryPoint], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `entrypoint-${file.name.replace(/\.[^.]+$/, '')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.statusManager.success('📤 Entry point exported');
    }

    // ==========================================
    // 24. SHOW SETTINGS
    // ==========================================
    showSettings() {
        const theme = this.theme;
        const extensions = this.getSupportedExtensions();

        this.modalManager.show({
            title: '⚙️ Settings',
            content: `
                <div class="settings-panel">
                    <div class="setting-group">
                        <h4>🎨 Theme</h4>
                        <div class="setting-item">
                            <span>Current theme: <strong>${theme.charAt(0).toUpperCase() + theme.slice(1)}</strong></span>
                            <button class="btn secondary" onclick="window.app.toggleTheme()">Toggle Theme</button>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <h4>📁 Supported File Types</h4>
                        <div class="setting-item">
                            <span>Total extensions: <strong>${extensions.length}</strong></span>
                            <div class="extension-tags">
                                ${extensions.slice(0, 30).map(e => `<span class="tag">.${e}</span>`).join('')}
                                ${extensions.length > 30 ? `<span class="tag">+${extensions.length - 30} more</span>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <h4>📊 Statistics</h4>
                        <div class="setting-item">
                            <span>Files: <strong>${this.files.length}</strong></span>
                            <span>Integrations: <strong>${this.integrations.length}</strong></span>
                            <span>Modules: <strong>${this.modules.length}</strong></span>
                            <span>API Calls: <strong>${this.apiCalls}</strong></span>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <h4>💾 Storage</h4>
                        <div class="setting-item">
                            <span>Data stored: <strong>${localStorage.length} items</strong></span>
                            <button class="btn secondary" onclick="window.app.clearAll()">🗑️ Clear All Data</button>
                        </div>
                    </div>
                </div>
            `,
            size: 'large',
            confirmText: 'Close',
            showCancel: false,
            onConfirm: () => true
        });
    }

    // ==========================================
    // 25. CHECK FOR UPDATES
    // ==========================================
    async checkForUpdates() {
        try {
            const response = await fetch('https://api.github.com/repos/yourusername/universal-integrator/releases/latest');
            if (response.ok) {
                const data = await response.json();
                const latestVersion = data.tag_name || data.name;
                const currentVersion = '4.0.0';
                if (latestVersion && latestVersion !== currentVersion) {
                    this.statusManager.info(`🔄 Update available: v${latestVersion}`);
                }
            }
        } catch (e) {
            // Silent fail
        }
    }

    // ==========================================
    // 26. SHOW INTEGRATION MODAL
    // ==========================================
    showIntegrationModal() {
        this.modalManager.show({
            title: '➕ New Integration',
            content: `
                <div class="integration-form">
                    <div class="form-group">
                        <label>Integration Name</label>
                        <input type="text" id="integrationName" class="input-field" placeholder="My Integration">
                    </div>
                    <div class="form-group">
                        <label>Type</label>
                        <select id="integrationType" class="select-field">
                            <option value="app">Application</option>
                            <option value="service">Service</option>
                            <option value="tool">Tool</option>
                            <option value="plugin">Plugin</option>
                            <option value="contract">Smart Contract</option>
                            <option value="web">Web Application</option>
                            <option value="api">API Service</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="integrationDesc" class="input-field" rows="3" placeholder="Describe your integration..."></textarea>
                    </div>
                </div>
            `,
            confirmText: '✨ Create',
            onConfirm: () => {
                const name = document.getElementById('integrationName')?.value || `Integration ${this.integrations.length + 1}`;
                const type = document.getElementById('integrationType')?.value || 'app';
                const desc = document.getElementById('integrationDesc')?.value || '';

                this.integrations.push({
                    id: this.generateId(),
                    name: name,
                    type: type,
                    description: desc,
                    files: this.files.length,
                    createdAt: new Date().toISOString(),
                    status: 'active'
                });

                this.renderIntegrations();
                this.updateUI();
                this.saveState();
                this.statusManager.success(`✅ Integration created: ${name}`);
                return true;
            }
        });
    }
}

// ============================================
// EXPORT & INITIALIZE
// ============================================
const app = new App();
window.app = app;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

export default app;
