// ============================================
// MODAL MANAGER
// Advanced Modal Dialog System
// ============================================

export default class ModalManager {
    constructor() {
        // ==========================================
        // STATE
        // ==========================================
        this.modalContainer = document.getElementById('modalContainer') || this.createContainer();
        this.activeModals = [];
        this.zIndex = 1000;
        this.defaultConfig = {
            size: 'medium',
            closeOnOverlayClick: true,
            closeOnEscape: true,
            showCloseButton: true,
            showFooter: true,
            showConfirm: true,
            showCancel: true,
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            confirmClass: 'primary',
            cancelClass: 'secondary',
            animation: 'fade',
            draggable: false,
            resizable: false,
            width: null,
            height: null
        };
        
        // Size presets
        this.sizes = {
            small: { width: '400px', maxWidth: '90%' },
            medium: { width: '600px', maxWidth: '90%' },
            large: { width: '800px', maxWidth: '95%' },
            xlarge: { width: '1000px', maxWidth: '98%' },
            full: { width: '100%', maxWidth: '100%', height: '100%', maxHeight: '100%' }
        };
        
        // Animation classes
        this.animations = {
            fade: 'modal-animation-fade',
            slide: 'modal-animation-slide',
            scale: 'modal-animation-scale',
            slideUp: 'modal-animation-slide-up',
            slideDown: 'modal-animation-slide-down'
        };
    }

    // ==========================================
    // CONTAINER CREATION
    // ==========================================
    createContainer() {
        const container = document.createElement('div');
        container.id = 'modalContainer';
        container.className = 'modal-container';
        document.body.appendChild(container);
        return container;
    }

    // ==========================================
    // SHOW MODAL
    // ==========================================
    show(options = {}) {
        const config = {
            ...this.defaultConfig,
            ...options,
            size: options.size || 'medium'
        };

        // Validate
        if (!config.content && !config.html) {
            console.error('Modal content is required');
            return null;
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = `modal-overlay ${this.animations[config.animation] || 'modal-animation-fade'}`;
        overlay.style.zIndex = this.zIndex++;

        // Create modal
        const modal = document.createElement('div');
        modal.className = `modal modal-${config.size}`;
        modal.style.width = config.width || this.sizes[config.size]?.width || '600px';
        modal.style.maxWidth = config.maxWidth || this.sizes[config.size]?.maxWidth || '90%';
        if (config.height) modal.style.height = config.height;
        if (config.maxHeight) modal.style.maxHeight = config.maxHeight;

        // Build header
        let headerHtml = '';
        if (config.title) {
            headerHtml = `
                <div class="modal-header">
                    <h3>${config.title}</h3>
                    ${config.showCloseButton ? '<button class="modal-close" aria-label="Close modal">&times;</button>' : ''}
                </div>
            `;
        } else if (config.showCloseButton) {
            headerHtml = `
                <div class="modal-header modal-header-empty">
                    <button class="modal-close" aria-label="Close modal">&times;</button>
                </div>
            `;
        }

        // Build body
        let bodyHtml = '';
        if (config.content) {
            bodyHtml = `<div class="modal-body">${config.content}</div>`;
        } else if (config.html) {
            bodyHtml = config.html;
        }

        // Build footer
        let footerHtml = '';
        if (config.showFooter) {
            const cancelBtn = config.showCancel ? 
                `<button class="btn modal-cancel ${config.cancelClass}">${config.cancelText}</button>` : '';
            const confirmBtn = config.showConfirm ? 
                `<button class="btn modal-confirm ${config.confirmClass}">${config.confirmText}</button>` : '';
            
            if (cancelBtn || confirmBtn) {
                footerHtml = `
                    <div class="modal-footer">
                        ${cancelBtn}
                        ${confirmBtn}
                    </div>
                `;
            }
        }

        // Assemble modal
        modal.innerHTML = `
            ${headerHtml}
            ${bodyHtml}
            ${footerHtml}
        `;

        overlay.appendChild(modal);
        this.modalContainer.appendChild(overlay);

        // Store modal data
        const modalData = {
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            overlay: overlay,
            modal: modal,
            config: config,
            onClose: config.onClose || null,
            onConfirm: config.onConfirm || null,
            onCancel: config.onCancel || null,
            onOpen: config.onOpen || null,
            isOpen: true,
            closeOnOverlayClick: config.closeOnOverlayClick,
            closeOnEscape: config.closeOnEscape
        };

        this.activeModals.push(modalData);

        // Setup event listeners
        this.setupModalEvents(modalData);

        // Call onOpen callback
        if (modalData.onOpen) {
            modalData.onOpen(modalData);
        }

        // Focus management
        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
            setTimeout(() => focusable[0].focus(), 100);
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        return modalData;
    }

    // ==========================================
    // SETUP MODAL EVENTS
    // ==========================================
    setupModalEvents(modalData) {
        const { overlay, modal, config } = modalData;

        // Close button
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close(modalData));
        }

        // Cancel button
        const cancelBtn = modal.querySelector('.modal-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                if (modalData.onCancel) {
                    const result = modalData.onCancel(e);
                    if (result !== false) {
                        this.close(modalData);
                    }
                } else {
                    this.close(modalData);
                }
            });
        }

        // Confirm button
        const confirmBtn = modal.querySelector('.modal-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', (e) => {
                if (modalData.onConfirm) {
                    const result = modalData.onConfirm(e);
                    if (result !== false) {
                        this.close(modalData);
                    }
                } else {
                    this.close(modalData);
                }
            });
        }

        // Overlay click
        if (modalData.closeOnOverlayClick) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(modalData);
                }
            });
        }

        // Escape key
        if (modalData.closeOnEscape) {
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    this.close(modalData);
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
            modalData._escapeHandler = escapeHandler;
        }

        // Draggable
        if (config.draggable) {
            this.makeDraggable(modal);
        }

        // Resizable
        if (config.resizable) {
            this.makeResizable(modal);
        }

        // Handle click outside to close
        if (config.clickOutsideToClose) {
            document.addEventListener('click', (e) => {
                if (!modal.contains(e.target) && e.target !== overlay) {
                    this.close(modalData);
                }
            });
        }
    }

    // ==========================================
    // DRAGGABLE MODAL
    // ==========================================
    makeDraggable(modal) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        const header = modal.querySelector('.modal-header');
        if (!header) return;

        header.style.cursor = 'move';

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = modal.offsetLeft;
            initialY = modal.offsetTop;
            modal.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            modal.style.left = (initialX + dx) + 'px';
            modal.style.top = (initialY + dy) + 'px';
            modal.style.position = 'relative';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            modal.style.cursor = '';
        });
    }

    // ==========================================
    // RESIZABLE MODAL
    // ==========================================
    makeResizable(modal) {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'modal-resize-handle';
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: nwse-resize;
            background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.2) 50%);
        `;
        modal.appendChild(resizeHandle);

        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = modal.offsetWidth;
            startHeight = modal.offsetHeight;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);
            if (newWidth > 200) modal.style.width = newWidth + 'px';
            if (newHeight > 100) modal.style.height = newHeight + 'px';
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    }

    // ==========================================
    // CLOSE MODAL
    // ==========================================
    close(modalData) {
        if (!modalData) {
            // Close the most recent modal
            const lastModal = this.activeModals[this.activeModals.length - 1];
            if (lastModal) {
                this.close(lastModal);
            }
            return;
        }

        // Remove from active modals
        const index = this.activeModals.indexOf(modalData);
        if (index !== -1) {
            this.activeModals.splice(index, 1);
        }

        // Remove escape handler
        if (modalData._escapeHandler) {
            document.removeEventListener('keydown', modalData._escapeHandler);
        }

        // Call onClose callback
        if (modalData.onClose) {
            modalData.onClose(modalData);
        }

        // Animate out
        modalData.overlay.classList.add('modal-closing');
        setTimeout(() => {
            modalData.overlay.remove();
        }, 300);

        modalData.isOpen = false;

        // Restore body scroll if no modals left
        if (this.activeModals.length === 0) {
            document.body.style.overflow = '';
        }

        // Focus management - return focus to previous element
        if (modalData._previousFocus) {
            modalData._previousFocus.focus();
        }
    }

    // ==========================================
    // CLOSE ALL MODALS
    // ==========================================
    closeAll() {
        while (this.activeModals.length > 0) {
            const modalData = this.activeModals.pop();
            if (modalData.onClose) {
                modalData.onClose(modalData);
            }
            modalData.overlay.remove();
        }
        document.body.style.overflow = '';
    }

    // ==========================================
    // UPDATE MODAL
    // ==========================================
    update(modalData, options = {}) {
        if (!modalData || !modalData.isOpen) {
            console.warn('Cannot update closed modal');
            return;
        }

        const { modal } = modalData;

        // Update content
        if (options.content) {
            const body = modal.querySelector('.modal-body');
            if (body) {
                body.innerHTML = options.content;
            }
        }

        // Update title
        if (options.title) {
            const header = modal.querySelector('.modal-header h3');
            if (header) {
                header.textContent = options.title;
            }
        }

        // Update buttons
        if (options.confirmText) {
            const confirmBtn = modal.querySelector('.modal-confirm');
            if (confirmBtn) {
                confirmBtn.textContent = options.confirmText;
            }
        }

        if (options.cancelText) {
            const cancelBtn = modal.querySelector('.modal-cancel');
            if (cancelBtn) {
                cancelBtn.textContent = options.cancelText;
            }
        }

        // Update size
        if (options.size) {
            modal.className = `modal modal-${options.size}`;
        }
    }

    // ==========================================
    // GET MODAL DATA
    // ==========================================
    getActiveModals() {
        return this.activeModals;
    }

    getLatestModal() {
        return this.activeModals[this.activeModals.length - 1] || null;
    }

    isModalOpen() {
        return this.activeModals.length > 0;
    }

    // ==========================================
    // CONVENIENCE METHODS
    // ==========================================
    alert(message, title = 'Alert', options = {}) {
        return this.show({
            title: title,
            content: `<div class="modal-alert"><p>${message}</p></div>`,
            showCancel: false,
            confirmText: 'OK',
            ...options
        });
    }

    confirm(message, title = 'Confirm', options = {}) {
        return new Promise((resolve) => {
            this.show({
                title: title,
                content: `<div class="modal-confirm-content"><p>${message}</p></div>`,
                confirmText: options.confirmText || 'Yes',
                cancelText: options.cancelText || 'No',
                onConfirm: () => {
                    resolve(true);
                },
                onCancel: () => {
                    resolve(false);
                },
                ...options
            });
        });
    }

    prompt(message, title = 'Prompt', options = {}) {
        return new Promise((resolve) => {
            const inputHtml = `
                <div class="modal-prompt-content">
                    <p>${message}</p>
                    <input type="${options.inputType || 'text'}" 
                           id="modalPromptInput" 
                           class="input-field" 
                           placeholder="${options.placeholder || ''}"
                           value="${options.defaultValue || ''}">
                </div>
            `;

            this.show({
                title: title,
                content: inputHtml,
                confirmText: options.confirmText || 'OK',
                cancelText: options.cancelText || 'Cancel',
                onConfirm: () => {
                    const input = document.getElementById('modalPromptInput');
                    resolve(input ? input.value : null);
                },
                onCancel: () => {
                    resolve(null);
                },
                ...options
            });
        });
    }

    toast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `modal-toast modal-toast-${type}`;
        
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        toast.innerHTML = `
            <span class="modal-toast-icon">${icons[type] || 'ℹ️'}</span>
            <span class="modal-toast-message">${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('modal-toast-show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('modal-toast-show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
        
        return toast;
    }

    // ==========================================
    // STYLE INJECTION
    // ==========================================
    injectStyles() {
        const styles = `
            /* Modal Container */
            .modal-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
                pointer-events: none;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: all;
                animation: modalFadeIn 0.3s ease;
            }

            .modal-overlay.modal-closing {
                animation: modalFadeOut 0.3s ease forwards;
            }

            /* Modal */
            .modal {
                background: #1a1a2e;
                border-radius: 16px;
                padding: 24px;
                max-height: 90vh;
                overflow-y: auto;
                border: 1px solid rgba(74, 158, 255, 0.15);
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
                position: relative;
                pointer-events: all;
                width: 600px;
                max-width: 90%;
                transition: all 0.3s ease;
            }

            body.light .modal {
                background: #ffffff;
                border-color: rgba(0, 0, 0, 0.1);
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
            }

            /* Modal Sizes */
            .modal-small { width: 400px; max-width: 90%; }
            .modal-medium { width: 600px; max-width: 90%; }
            .modal-large { width: 800px; max-width: 95%; }
            .modal-xlarge { width: 1000px; max-width: 98%; }
            .modal-full { width: 100%; max-width: 100%; height: 100%; max-height: 100%; border-radius: 0; }

            /* Modal Header */
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(74, 158, 255, 0.08);
            }

            .modal-header h3 {
                color: #4a9eff;
                font-size: 1.2rem;
                margin: 0;
            }

            .modal-header-empty {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
                justify-content: flex-end;
            }

            .modal-close {
                background: none;
                border: none;
                color: #8899aa;
                font-size: 1.5rem;
                cursor: pointer;
                transition: color 0.3s;
                padding: 4px 8px;
                line-height: 1;
            }

            .modal-close:hover {
                color: #ff4757;
            }

            body.light .modal-close {
                color: #666;
            }

            body.light .modal-close:hover {
                color: #ff4757;
            }

            /* Modal Body */
            .modal-body {
                margin-bottom: 20px;
                max-height: 60vh;
                overflow-y: auto;
                padding: 4px 0;
            }

            .modal-body::-webkit-scrollbar {
                width: 4px;
            }

            .modal-body::-webkit-scrollbar-thumb {
                background: rgba(74, 158, 255, 0.3);
                border-radius: 2px;
            }

            /* Modal Footer */
            .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding-top: 16px;
                border-top: 1px solid rgba(74, 158, 255, 0.08);
            }

            /* Animations */
            .modal-animation-fade {
                animation: modalFadeIn 0.3s ease;
            }

            .modal-animation-slide {
                animation: modalSlideIn 0.3s ease;
            }

            .modal-animation-scale {
                animation: modalScaleIn 0.3s ease;
            }

            .modal-animation-slide-up {
                animation: modalSlideUp 0.3s ease;
            }

            .modal-animation-slide-down {
                animation: modalSlideDown 0.3s ease;
            }

            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes modalFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            @keyframes modalSlideIn {
                from { transform: translateY(-30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes modalScaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            @keyframes modalSlideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes modalSlideDown {
                from { transform: translateY(-30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            /* Toast */
            .modal-toast {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: rgba(13, 26, 42, 0.95);
                backdrop-filter: blur(12px);
                padding: 14px 24px;
                border-radius: 12px;
                border: 1px solid rgba(74, 158, 255, 0.15);
                color: #e0e0e0;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 9999;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                transform: translateX(100px);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .modal-toast.modal-toast-show {
                transform: translateX(0);
                opacity: 1;
            }

            .modal-toast-icon {
                font-size: 1.2rem;
            }

            .modal-toast-info { border-left: 4px solid #4a9eff; }
            .modal-toast-success { border-left: 4px solid #4CAF50; }
            .modal-toast-warning { border-left: 4px solid #ffd700; }
            .modal-toast-error { border-left: 4px solid #ff4757; }

            body.light .modal-toast {
                background: rgba(255, 255, 255, 0.95);
                color: #1a1a2e;
                border-color: rgba(0, 0, 0, 0.1);
            }

            /* Prompt Input */
            .modal-prompt-content .input-field {
                width: 100%;
                margin-top: 10px;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .modal {
                    padding: 16px;
                    max-height: 95vh;
                }
                .modal-small,
                .modal-medium,
                .modal-large,
                .modal-xlarge {
                    width: 95%;
                }
                .modal-footer {
                    flex-direction: column;
                }
                .modal-footer .btn {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;

        const styleTag = document.createElement('style');
        styleTag.textContent = styles;
        document.head.appendChild(styleTag);
    }

    // ==========================================
    // INIT
    // ==========================================
    init() {
        this.injectStyles();
        console.log('🪟 Modal Manager initialized');
    }
}

// Auto-initialize
const modalManager = new ModalManager();
modalManager.init();

export default ModalManager;
