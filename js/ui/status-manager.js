// ============================================
// STATUS MANAGER
// Advanced Notification & Status System
// ============================================

export default class StatusManager {
    constructor() {
        // ==========================================
        // STATE
        // ==========================================
        this.statuses = [];
        this.maxStatuses = 5;
        this.defaultDuration = 3000;
        this.container = null;
        this.isInitialized = false;
        
        // Status types with icons
        this.types = {
            info: { icon: 'ℹ️', className: 'status-info', defaultDuration: 3000 },
            success: { icon: '✅', className: 'status-success', defaultDuration: 3000 },
            warning: { icon: '⚠️', className: 'status-warning', defaultDuration: 5000 },
            error: { icon: '❌', className: 'status-error', defaultDuration: 8000 },
            loading: { icon: '⏳', className: 'status-loading', defaultDuration: 0 },
            progress: { icon: '📊', className: 'status-progress', defaultDuration: 0 }
        };
        
        // Position options
        this.positions = {
            'top-right': { top: '20px', right: '20px', bottom: 'auto', left: 'auto' },
            'top-left': { top: '20px', left: '20px', bottom: 'auto', right: 'auto' },
            'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)', bottom: 'auto', right: 'auto' },
            'bottom-right': { bottom: '20px', right: '20px', top: 'auto', left: 'auto' },
            'bottom-left': { bottom: '20px', left: '20px', top: 'auto', right: 'auto' },
            'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)', top: 'auto', right: 'auto' }
        };
        
        this.position = 'top-right';
        this.autoRemove = true;
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================
    init() {
        if (this.isInitialized) return;
        
        this.createContainer();
        this.injectStyles();
        this.isInitialized = true;
        console.log('📊 Status Manager initialized');
    }

    createContainer() {
        this.container = document.getElementById('statusContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'statusContainer';
            this.container.className = 'status-container';
            this.container.style.cssText = this.getContainerStyles();
            document.body.appendChild(this.container);
        }
    }

    getContainerStyles() {
        const pos = this.positions[this.position] || this.positions['top-right'];
        return `
            position: fixed;
            ${pos.top !== 'auto' ? `top: ${pos.top};` : ''}
            ${pos.right !== 'auto' ? `right: ${pos.right};` : ''}
            ${pos.bottom !== 'auto' ? `bottom: ${pos.bottom};` : ''}
            ${pos.left !== 'auto' ? `left: ${pos.left};` : ''}
            ${pos.transform ? `transform: ${pos.transform};` : ''}
            z-index: 9998;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            width: 100%;
            pointer-events: none;
        `;
    }

    // ==========================================
    // SHOW STATUS
    // ==========================================
    show(message, type = 'info', duration = null) {
        this.init();
        
        const typeConfig = this.types[type] || this.types.info;
        const actualDuration = duration !== null ? duration : typeConfig.defaultDuration;
        
        // Create status element
        const status = document.createElement('div');
        status.className = `status-item ${typeConfig.className}`;
        status.style.cssText = `
            pointer-events: all;
            background: rgba(13, 26, 42, 0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            padding: 14px 18px;
            border-radius: 12px;
            border: 1px solid rgba(74, 158, 255, 0.15);
            color: #e0e0e0;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            animation: statusSlideIn 0.3s ease forwards;
            transition: all 0.3s ease;
            position: relative;
            min-width: 200px;
        `;
        
        // Light theme support
        if (document.body.classList.contains('light')) {
            status.style.background = 'rgba(255, 255, 255, 0.95)';
            status.style.color = '#1a1a2e';
            status.style.borderColor = 'rgba(0, 0, 0, 0.1)';
        }
        
        // Type-specific border
        const borderColors = {
            info: '#4a9eff',
            success: '#4CAF50',
            warning: '#ffd700',
            error: '#ff4757',
            loading: '#4a9eff',
            progress: '#a855f7'
        };
        status.style.borderLeft = `4px solid ${borderColors[type] || borderColors.info}`;
        
        // Icon and message
        const iconSpan = document.createElement('span');
        iconSpan.className = 'status-icon';
        iconSpan.textContent = typeConfig.icon;
        iconSpan.style.fontSize = '1.2rem';
        status.appendChild(iconSpan);
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'status-message';
        messageSpan.textContent = message;
        messageSpan.style.flex = '1';
        messageSpan.style.wordBreak = 'break-word';
        status.appendChild(messageSpan);
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'status-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #8899aa;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0 4px;
            transition: color 0.3s;
            line-height: 1;
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = '#ff4757';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = '#8899aa';
        });
        closeBtn.addEventListener('click', () => {
            this.remove(status);
        });
        status.appendChild(closeBtn);
        
        // Add progress bar for loading types
        let progressBar = null;
        if (type === 'loading' || type === 'progress') {
            progressBar = document.createElement('div');
            progressBar.className = 'status-progress-bar';
            progressBar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #4a9eff, #a855f7);
                border-radius: 0 0 0 4px;
                width: 0%;
                transition: width 0.3s ease;
            `;
            status.appendChild(progressBar);
            status.style.paddingBottom = '18px';
        }
        
        // Add to container
        this.container.appendChild(status);
        
        // Store status data
        const statusData = {
            element: status,
            type: type,
            message: message,
            duration: actualDuration,
            progressBar: progressBar,
            createdAt: Date.now(),
            timeoutId: null,
            progress: 0,
            isRemoving: false
        };
        
        this.statuses.push(statusData);
        
        // Auto-remove after duration
        if (actualDuration > 0 && this.autoRemove) {
            statusData.timeoutId = setTimeout(() => {
                this.remove(status);
            }, actualDuration);
        }
        
        // Limit number of statuses
        if (this.statuses.length > this.maxStatuses) {
            const oldest = this.statuses.shift();
            if (oldest && oldest.element.parentNode) {
                this.remove(oldest.element);
            }
        }
        
        // Click to dismiss (except loading/progress)
        if (type !== 'loading' && type !== 'progress') {
            status.addEventListener('click', (e) => {
                if (e.target === status || e.target.classList.contains('status-message')) {
                    this.remove(status);
                }
            });
        }
        
        // Hover to pause auto-remove
        if (actualDuration > 0) {
            status.addEventListener('mouseenter', () => {
                if (statusData.timeoutId) {
                    clearTimeout(statusData.timeoutId);
                    statusData.timeoutId = null;
                }
            });
            status.addEventListener('mouseleave', () => {
                if (actualDuration > 0 && !statusData.isRemoving) {
                    statusData.timeoutId = setTimeout(() => {
                        this.remove(status);
                    }, Math.max(1000, actualDuration - (Date.now() - statusData.createdAt)));
                }
            });
        }
        
        return statusData;
    }

    // ==========================================
    // REMOVE STATUS
    // ==========================================
    remove(statusElement) {
        if (!statusElement) return;
        
        const index = this.statuses.findIndex(s => s.element === statusElement);
        if (index === -1) return;
        
        const statusData = this.statuses[index];
        if (statusData.isRemoving) return;
        statusData.isRemoving = true;
        
        // Clear timeout
        if (statusData.timeoutId) {
            clearTimeout(statusData.timeoutId);
            statusData.timeoutId = null;
        }
        
        // Remove from array
        this.statuses.splice(index, 1);
        
        // Animate out
        statusElement.style.animation = 'statusSlideOut 0.3s ease forwards';
        setTimeout(() => {
            if (statusElement.parentNode) {
                statusElement.remove();
            }
        }, 300);
    }

    // ==========================================
    // UPDATE STATUS
    // ==========================================
    update(statusElement, options = {}) {
        if (!statusElement) return false;
        
        const index = this.statuses.findIndex(s => s.element === statusElement);
        if (index === -1) return false;
        
        const statusData = this.statuses[index];
        
        // Update message
        if (options.message) {
            const msgEl = statusElement.querySelector('.status-message');
            if (msgEl) {
                msgEl.textContent = options.message;
            }
            statusData.message = options.message;
        }
        
        // Update progress
        if (options.progress !== undefined && statusData.progressBar) {
            const progress = Math.max(0, Math.min(100, options.progress));
            statusData.progress = progress;
            statusData.progressBar.style.width = progress + '%';
            
            // Auto-remove when complete
            if (progress >= 100 && statusData.duration > 0) {
                setTimeout(() => {
                    this.remove(statusElement);
                }, 500);
            }
        }
        
        // Update type
        if (options.type && this.types[options.type]) {
            const typeConfig = this.types[options.type];
            statusElement.className = `status-item ${typeConfig.className}`;
            const icon = statusElement.querySelector('.status-icon');
            if (icon) {
                icon.textContent = typeConfig.icon;
            }
            statusData.type = options.type;
        }
        
        return true;
    }

    // ==========================================
    // CONVENIENCE METHODS
    // ==========================================
    info(message, duration = null) {
        return this.show(message, 'info', duration);
    }

    success(message, duration = null) {
        return this.show(message, 'success', duration);
    }

    warning(message, duration = null) {
        return this.show(message, 'warning', duration);
    }

    error(message, duration = null) {
        return this.show(message, 'error', duration);
    }

    loading(message, duration = 0) {
        return this.show(message, 'loading', duration);
    }

    progress(message, progress = 0, duration = 0) {
        const status = this.show(message, 'progress', duration);
        if (status && status.progressBar) {
            status.progress = progress;
            status.progressBar.style.width = progress + '%';
        }
        return status;
    }

    // ==========================================
    // QUEUE MANAGEMENT
    // ==========================================
    clear() {
        while (this.statuses.length > 0) {
            const status = this.statuses.pop();
            if (status.element.parentNode) {
                status.element.remove();
            }
            if (status.timeoutId) {
                clearTimeout(status.timeoutId);
            }
        }
    }

    removeAll() {
        this.clear();
    }

    getStatuses() {
        return this.statuses.map(s => ({
            type: s.type,
            message: s.message,
            progress: s.progress,
            createdAt: s.createdAt
        }));
    }

    // ==========================================
    // CONFIGURATION
    // ==========================================
    setPosition(position) {
        if (this.positions[position]) {
            this.position = position;
            if (this.container) {
                this.container.style.cssText = this.getContainerStyles();
            }
        }
    }

    setMaxStatuses(max) {
        this.maxStatuses = Math.max(1, max);
        // Remove excess statuses
        while (this.statuses.length > this.maxStatuses) {
            const oldest = this.statuses.shift();
            if (oldest && oldest.element.parentNode) {
                this.remove(oldest.element);
            }
        }
    }

    setAutoRemove(auto) {
        this.autoRemove = auto;
    }

    // ==========================================
    // STYLE INJECTION
    // ==========================================
    injectStyles() {
        if (document.getElementById('status-manager-styles')) return;
        
        const styles = `
            /* Status Container */
            .status-container {
                position: fixed;
                z-index: 9998;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
                width: 100%;
                pointer-events: none;
            }

            /* Status Item */
            .status-item {
                pointer-events: all;
                background: rgba(13, 26, 42, 0.95);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                padding: 14px 18px;
                border-radius: 12px;
                border: 1px solid rgba(74, 158, 255, 0.15);
                color: #e0e0e0;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                animation: statusSlideIn 0.3s ease forwards;
                transition: all 0.3s ease;
                position: relative;
                min-width: 200px;
                padding-bottom: 14px;
            }

            body.light .status-item {
                background: rgba(255, 255, 255, 0.95);
                color: #1a1a2e;
                border-color: rgba(0, 0, 0, 0.1);
            }

            /* Status Types */
            .status-info { border-left: 4px solid #4a9eff; }
            .status-success { border-left: 4px solid #4CAF50; }
            .status-warning { border-left: 4px solid #ffd700; }
            .status-error { border-left: 4px solid #ff4757; }
            .status-loading { border-left: 4px solid #4a9eff; }
            .status-progress { border-left: 4px solid #a855f7; }

            .status-icon {
                font-size: 1.2rem;
                flex-shrink: 0;
            }

            .status-message {
                flex: 1;
                word-break: break-word;
            }

            .status-close {
                background: none;
                border: none;
                color: #8899aa;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0 4px;
                transition: color 0.3s;
                line-height: 1;
                flex-shrink: 0;
            }

            .status-close:hover {
                color: #ff4757;
            }

            .status-progress-bar {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #4a9eff, #a855f7);
                border-radius: 0 0 0 4px;
                width: 0%;
                transition: width 0.3s ease;
            }

            /* Animations */
            @keyframes statusSlideIn {
                from {
                    transform: translateX(100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes statusSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100px);
                    opacity: 0;
                }
            }

            /* Responsive */
            @media (max-width: 480px) {
                .status-container {
                    max-width: 95%;
                    left: 2.5% !important;
                    right: 2.5% !important;
                    transform: none !important;
                    top: 10px !important;
                    bottom: auto !important;
                }
                .status-item {
                    font-size: 0.85rem;
                    padding: 12px 14px;
                }
            }
        `;

        const styleTag = document.createElement('style');
        styleTag.id = 'status-manager-styles';
        styleTag.textContent = styles;
        document.head.appendChild(styleTag);
    }
}

// ==========================================
// AUTO-INITIALIZE
// ==========================================
const statusManager = new StatusManager();
statusManager.init();

export default StatusManager;
