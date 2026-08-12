// ============================================
// MODAL MANAGER - ULTIMATE ADVANCED MODAL ENGINE
// ============================================

export default class ModalManager {
    constructor(options = {}) {
        // ==========================================
        // CORE STATE
        // ==========================================
        this.modals = new Map();
        this.activeModals = [];
        this.modalHistory = [];
        this.stack = [];
        this.idCounter = 0;
        this.isShuttingDown = false;
        this.eventListeners = new Map();
        this.animationQueue = [];
        this.focusTrapStack = [];
        this.stats = {
            totalModals: 0,
            activeModals: 0,
            openedModals: 0,
            closedModals: 0,
            maxConcurrent: 0,
            averageDuration: 0,
            totalDuration: 0
        };

        // ==========================================
        // CONFIGURATION
        // ==========================================
        this.config = {
            // Core
            enableAnimation: options.enableAnimation !== false,
            enableTransitions: options.enableTransitions !== false,
            enableFocusTrap: options.enableFocusTrap !== false,
            enableBackdrop: options.enableBackdrop !== false,
            enableEscToClose: options.enableEscToClose !== false,
            enableClickOutside: options.enableClickOutside !== false,
            enableResize: options.enableResize !== false,
            enableDrag: options.enableDrag !== false,
            enableStacking: options.enableStacking !== false,
            enableZIndexManagement: options.enableZIndexManagement !== false,
            enableAnimationQueue: options.enableAnimationQueue !== false,
            enableHistory: options.enableHistory !== false,
            enablePersistent: options.enablePersistent !== false,
            enableScrollLock: options.enableScrollLock !== false,
            enableBodyClass: options.enableBodyClass !== false,
            enableAria: options.enableAria !== false,
            enableAccessibility: options.enableAccessibility !== false,
            enableKeyboardNavigation: options.enableKeyboardNavigation !== false,
            enableScreenReaderSupport: options.enableScreenReaderSupport !== false,

            // Animation
            animationDuration: options.animationDuration || 300,
            animationEasing: options.animationEasing || 'ease',
            animationType: options.animationType || 'fade',
            transitionDuration: options.transitionDuration || 200,

            // Styling
            backdropOpacity: options.backdropOpacity || 0.5,
            backdropColor: options.backdropColor || 'rgba(0,0,0,0.5)',
            modalMinWidth: options.modalMinWidth || 300,
            modalMaxWidth: options.modalMaxWidth || 800,
            modalMinHeight: options.modalMinHeight || 200,
            modalMaxHeight: options.modalMaxHeight || '90vh',
            borderRadius: options.borderRadius || 8,
            boxShadow: options.boxShadow || '0 20px 60px rgba(0,0,0,0.3)',

            // Behavior
            defaultPosition: options.defaultPosition || 'center',
            defaultSize: options.defaultSize || 'medium',
            closeOnEscape: options.closeOnEscape !== false,
            closeOnBackdrop: options.closeOnBackdrop !== false,
            closeOnOutsideClick: options.closeOnOutsideClick !== false,
            preventBodyScroll: options.preventBodyScroll !== false,

            // Limits
            maxModals: options.maxModals || 100,
            maxConcurrentModals: options.maxConcurrentModals || 10,
            maxQueueSize: options.maxQueueSize || 50,

            // Logging
            enableLogging: options.enableLogging !== false,
            logLevel: options.logLevel || 'info'
        };

        // ==========================================
        // DEFAULT ANIMATIONS
        // ==========================================
        this.animations = {
            fade: {
                in: {
                    opacity: [0, 1],
                    transform: ['none', 'none']
                },
                out: {
                    opacity: [1, 0],
                    transform: ['none', 'none']
                }
            },
            slide: {
                in: {
                    opacity: [0, 1],
                    transform: ['translateY(-20px)', 'translateY(0)']
                },
                out: {
                    opacity: [1, 0],
                    transform: ['translateY(0)', 'translateY(20px)']
                }
            },
            scale: {
                in: {
                    opacity: [0, 1],
                    transform: ['scale(0.95)', 'scale(1)']
                },
                out: {
                    opacity: [1, 0],
                    transform: ['scale(1)', 'scale(0.95)']
                }
            },
            slideUp: {
                in: {
                    opacity: [0, 1],
                    transform: ['translateY(50px)', 'translateY(0)']
                },
                out: {
                    opacity: [1, 0],
                    transform: ['translateY(0)', 'translateY(50px)']
                }
            },
            slideDown: {
                in: {
                    opacity: [0, 1],
                    transform: ['translateY(-50px)', 'translateY(0)']
                },
                out: {
                    opacity: [1, 0],
                    transform: ['translateY(0)', 'translateY(-50px)']
                }
            },
            slideLeft: {
                in: {
                    opacity: [0, 1],
                    transform: ['translateX(50px)', 'translateX(0)']
                },
                out: {
                    opacity: [1, 0],
                    transform: ['translateX(0)', 'translateX(50px)']
                }
            },
            slideRight: {
                in: {
                    opacity: [0, 1],
                    transform: ['translateX(-50px)', 'translateX(0)']
                },
                out: {
                    opacity: [1, 0],
                    transform: ['translateX(0)', 'translateX(-50px)']
                }
            },
            zoom: {
                in: {
                    opacity: [0, 1],
                    transform: ['scale(0.9)', 'scale(1)']
                },
                out: {
                    opacity: [1, 0],
                    transform: ['scale(1)', 'scale(0.9)']
                }
            },
            flip: {
                in: {
                    opacity: [0, 1],
                    transform: ['rotateY(-90deg)', 'rotateY(0)']
                },
                out: {
                    opacity: [1, 0],
                    transform: ['rotateY(0)', 'rotateY(90deg)']
                }
            },
            bounce: {
                in: {
                    opacity: [0, 1],
                    transform: ['scale(0.3)', 'scale(1)']
                },
                out: {
                    opacity: [1, 0],
                    transform: ['scale(1)', 'scale(0.3)']
                }
            },
            custom: {
                in: {
                    opacity: [0, 1],
                    transform: ['none', 'none']
                },
                out: {
                    opacity: [1, 0],
                    transform: ['none', 'none']
                }
            }
        };

        // ==========================================
        // DEFAULT SIZES
        // ==========================================
        this.sizes = {
            tiny: {
                width: 300,
                height: 200,
                maxWidth: 400,
                maxHeight: 300
            },
            small: {
                width: 400,
                height: 300,
                maxWidth: 500,
                maxHeight: 400
            },
            medium: {
                width: 600,
                height: 400,
                maxWidth: 800,
                maxHeight: 600
            },
            large: {
                width: 800,
                height: 600,
                maxWidth: 1000,
                maxHeight: 800
            },
            xlarge: {
                width: 1000,
                height: 800,
                maxWidth: 1200,
                maxHeight: 1000
            },
            fullscreen: {
                width: '100vw',
                height: '100vh',
                maxWidth: '100vw',
                maxHeight: '100vh'
            },
            auto: {
                width: 'auto',
                height: 'auto',
                maxWidth: '90vw',
                maxHeight: '90vh'
            }
        };

        // ==========================================
        // DEFAULT POSITIONS
        // ==========================================
        this.positions = {
            center: {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            },
            top: {
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)'
            },
            bottom: {
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)'
            },
            left: {
                top: '50%',
                left: '20px',
                transform: 'translateY(-50%)'
            },
            right: {
                top: '50%',
                right: '20px',
                transform: 'translateY(-50%)'
            },
            topLeft: {
                top: '20px',
                left: '20px'
            },
            topRight: {
                top: '20px',
                right: '20px'
            },
            bottomLeft: {
                bottom: '20px',
                left: '20px'
            },
            bottomRight: {
                bottom: '20px',
                right: '20px'
            }
        };

        this.log('🎯 ModalManager Ultimate initialized');
        this.log(`📦 Animations: ${Object.keys(this.animations).length}`);
        this.log(`📐 Sizes: ${Object.keys(this.sizes).length}`);
        this.log(`📍 Positions: ${Object.keys(this.positions).length}`);
    }

    // ==========================================
    // MAIN MODAL METHODS
    // ==========================================

    open(content, options = {}) {
        if (this.isShuttingDown) {
            throw new Error('ModalManager is shutting down');
        }

        if (this.activeModals.length >= this.config.maxConcurrentModals) {
            this.log(`⚠️ Max concurrent modals reached (${this.config.maxConcurrentModals})`);
            return this.queueModal(content, options);
        }

        const id = this.generateId();
        const modal = this.createModal(id, content, options);

        // Add to stack
        this.stack.push(modal);
        this.activeModals.push(modal);
        this.modals.set(id, modal);

        // Update stats
        this.stats.totalModals++;
        this.stats.openedModals++;
        this.stats.activeModals = this.activeModals.length;
        this.stats.maxConcurrent = Math.max(this.stats.maxConcurrent, this.activeModals.length);

        // Render modal
        this.renderModal(modal);

        // Apply animations
        if (this.config.enableAnimation) {
            this.animateModalIn(modal);
        }

        // Lock scroll
        if (this.config.enableScrollLock) {
            this.lockScroll();
        }

        // Setup focus trap
        if (this.config.enableFocusTrap) {
            this.setupFocusTrap(modal);
        }

        // Setup event listeners
        this.setupModalListeners(modal);

        this.log(`📂 Opened modal: ${id} (${modal.title || 'unnamed'})`);
        this.emit('modalOpened', { id, modal });

        return {
            id,
            modal,
            close: () => this.close(id),
            update: (newContent) => this.update(id, newContent),
            on: (event, callback) => this.onModalEvent(id, event, callback)
        };
    }

    close(id) {
        const modal = this.modals.get(id);
        if (!modal) {
            this.log(`⚠️ Modal ${id} not found`);
            return false;
        }

        // Animate out
        if (this.config.enableAnimation) {
            this.animateModalOut(modal);
        }

        // Remove from active
        const index = this.activeModals.indexOf(modal);
        if (index !== -1) {
            this.activeModals.splice(index, 1);
        }

        // Remove from stack
        const stackIndex = this.stack.indexOf(modal);
        if (stackIndex !== -1) {
            this.stack.splice(stackIndex, 1);
        }

        // Remove modal
        this.removeModal(modal);

        // Update stats
        this.stats.closedModals++;
        this.stats.activeModals = this.activeModals.length;
        this.stats.totalDuration += Date.now() - modal.timestamp;

        // Unlock scroll
        if (this.config.enableScrollLock && this.activeModals.length === 0) {
            this.unlockScroll();
        }

        // Remove focus trap
        if (this.config.enableFocusTrap) {
            this.removeFocusTrap(modal);
        }

        this.log(`📂 Closed modal: ${id} (${modal.title || 'unnamed'})`);
        this.emit('modalClosed', { id, modal });

        // Process queue
        this.processQueue();

        return true;
    }

    closeAll() {
        const count = this.activeModals.length;
        const ids = this.activeModals.map(m => m.id);

        for (const id of ids) {
            this.close(id);
        }

        this.log(`📂 Closed all ${count} modals`);
        this.emit('allModalsClosed', { count });

        return count;
    }

    closeTop() {
        if (this.activeModals.length === 0) {
            return false;
        }

        const top = this.activeModals[this.activeModals.length - 1];
        return this.close(top.id);
    }

    // ==========================================
    // MODAL CREATION
    // ==========================================

    createModal(id, content, options) {
        const size = this.sizes[options.size || this.config.defaultSize] || this.sizes.medium;
        const position = this.positions[options.position || this.config.defaultPosition] || this.positions.center;
        const animation = this.animations[options.animation || this.config.animationType] || this.animations.fade;

        return {
            id,
            content,
            title: options.title || null,
            subtitle: options.subtitle || null,
            size: options.size || this.config.defaultSize,
            position: options.position || this.config.defaultPosition,
            animation: options.animation || this.config.animationType,
            width: options.width || size.width,
            height: options.height || size.height,
            maxWidth: options.maxWidth || size.maxWidth,
            maxHeight: options.maxHeight || size.maxHeight,
            positionStyle: position,
            animationStyle: animation,
            backdrop: options.backdrop !== false,
            closeOnEscape: options.closeOnEscape !== undefined ? options.closeOnEscape : this.config.closeOnEscape,
            closeOnBackdrop: options.closeOnBackdrop !== undefined ? options.closeOnBackdrop : this.config.closeOnBackdrop,
            closeOnOutsideClick: options.closeOnOutsideClick !== undefined ? options.closeOnOutsideClick : this.config.closeOnOutsideClick,
            preventBodyScroll: options.preventBodyScroll !== undefined ? options.preventBodyScroll : this.config.preventBodyScroll,
            draggable: options.draggable || this.config.enableDrag,
            resizable: options.resizable || this.config.enableResize,
            persistent: options.persistent || this.config.enablePersistent,
            zIndex: options.zIndex || (1000 + this.stack.length * 10),
            className: options.className || '',
            style: options.style || {},
            data: options.data || {},
            timestamp: Date.now(),
            events: new Map(),
            element: null,
            backdropElement: null,
            isAnimating: false,
            isOpen: false
        };
    }

    // ==========================================
    // RENDERING
    // ==========================================

    renderModal(modal) {
        // Create backdrop
        if (modal.backdrop) {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop';
            backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: ${this.config.backdropColor};
                opacity: ${this.config.backdropOpacity};
                z-index: ${modal.zIndex - 1};
                transition: opacity ${this.config.animationDuration}ms ${this.config.animationEasing};
            `;
            document.body.appendChild(backdrop);
            modal.backdropElement = backdrop;

            // Backdrop click
            if (modal.closeOnBackdrop || modal.closeOnOutsideClick) {
                backdrop.addEventListener('click', (e) => {
                    if (e.target === backdrop) {
                        this.close(modal.id);
                    }
                });
            }
        }

        // Create modal element
        const element = document.createElement('div');
        element.className = `modal ${modal.className}`;
        element.id = `modal-${modal.id}`;
        element.style.cssText = `
            position: fixed;
            ${this.getPositionCSS(modal.positionStyle)}
            width: ${typeof modal.width === 'number' ? modal.width + 'px' : modal.width};
            height: ${typeof modal.height === 'number' ? modal.height + 'px' : modal.height};
            max-width: ${typeof modal.maxWidth === 'number' ? modal.maxWidth + 'px' : modal.maxWidth};
            max-height: ${typeof modal.maxHeight === 'number' ? modal.maxHeight + 'px' : modal.maxHeight};
            z-index: ${modal.zIndex};
            background: white;
            border-radius: ${this.config.borderRadius}px;
            box-shadow: ${this.config.boxShadow};
            opacity: 0;
            transform: ${this.getInitialTransform(modal.animationStyle)};
            transition: all ${this.config.animationDuration}ms ${this.config.animationEasing};
            overflow: auto;
            ${this.getAdditionalStyles(modal)}
        `;

        // Add content
        element.innerHTML = this.buildModalContent(modal);

        document.body.appendChild(element);
        modal.element = element;
        modal.isOpen = true;

        // Setup resize
        if (modal.resizable) {
            this.setupResize(modal);
        }

        // Setup drag
        if (modal.draggable) {
            this.setupDrag(modal);
        }

        // Setup focus trap
        if (this.config.enableFocusTrap) {
            this.setupFocusTrap(modal);
        }

        // Setup close buttons
        const closeButtons = element.querySelectorAll('[data-close-modal]');
        for (const btn of closeButtons) {
            btn.addEventListener('click', () => this.close(modal.id));
        }

        this.emit('modalRendered', { id: modal.id, modal });
    }

    buildModalContent(modal) {
        let html = '';

        // Header
        if (modal.title) {
            html += `
                <div class="modal-header">
                    ${modal.title ? `<h2 class="modal-title">${modal.title}</h2>` : ''}
                    ${modal.subtitle ? `<p class="modal-subtitle">${modal.subtitle}</p>` : ''}
                    <button class="modal-close" data-close-modal aria-label="Close modal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `;
        }

        // Body
        html += `
            <div class="modal-body">
                ${typeof modal.content === 'function' ? modal.content() : modal.content}
            </div>
        `;

        // Footer (if provided)
        if (modal.footer) {
            html += `
                <div class="modal-footer">
                    ${typeof modal.footer === 'function' ? modal.footer() : modal.footer}
                </div>
            `;
        }

        return html;
    }

    // ==========================================
    // ANIMATIONS
    // ==========================================

    animateModalIn(modal) {
        if (!modal.element) return;

        modal.isAnimating = true;

        // Set initial state
        const animation = modal.animationStyle;
        const initialTransform = this.getInitialTransform(animation);
        const initialOpacity = this.getInitialOpacity(animation);

        modal.element.style.transform = initialTransform;
        modal.element.style.opacity = initialOpacity;

        // Trigger animation
        requestAnimationFrame(() => {
            modal.element.style.transform = this.getFinalTransform(animation);
            modal.element.style.opacity = '1';

            // Update backdrop
            if (modal.backdropElement) {
                modal.backdropElement.style.opacity = this.config.backdropOpacity;
            }

            setTimeout(() => {
                modal.isAnimating = false;
                this.emit('modalAnimationComplete', { id: modal.id, direction: 'in' });
            }, this.config.animationDuration);
        });
    }

    animateModalOut(modal) {
        if (!modal.element || modal.isAnimating) return;

        modal.isAnimating = true;

        const animation = modal.animationStyle;

        modal.element.style.transform = this.getOutTransform(animation);
        modal.element.style.opacity = '0';

        // Update backdrop
        if (modal.backdropElement) {
            modal.backdropElement.style.opacity = '0';
        }

        setTimeout(() => {
            modal.isAnimating = false;
            this.emit('modalAnimationComplete', { id: modal.id, direction: 'out' });
        }, this.config.animationDuration);
    }

    getInitialTransform(animation) {
        switch (animation) {
            case 'fade': return 'none';
            case 'slide': return 'translateY(-20px)';
            case 'scale': return 'scale(0.95)';
            case 'slideUp': return 'translateY(50px)';
            case 'slideDown': return 'translateY(-50px)';
            case 'slideLeft': return 'translateX(50px)';
            case 'slideRight': return 'translateX(-50px)';
            case 'zoom': return 'scale(0.9)';
            case 'flip': return 'rotateY(-90deg)';
            case 'bounce': return 'scale(0.3)';
            default: return 'none';
        }
    }

    getFinalTransform(animation) {
        return 'none';
    }

    getOutTransform(animation) {
        switch (animation) {
            case 'fade': return 'none';
            case 'slide': return 'translateY(20px)';
            case 'scale': return 'scale(0.95)';
            case 'slideUp': return 'translateY(-50px)';
            case 'slideDown': return 'translateY(50px)';
            case 'slideLeft': return 'translateX(-50px)';
            case 'slideRight': return 'translateX(50px)';
            case 'zoom': return 'scale(0.9)';
            case 'flip': return 'rotateY(90deg)';
            case 'bounce': return 'scale(0.3)';
            default: return 'none';
        }
    }

    getInitialOpacity(animation) {
        return '0';
    }

    // ==========================================
    // POSITIONING
    // ==========================================

    getPositionCSS(position) {
        return Object.entries(position)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
    }

    getAdditionalStyles(modal) {
        const styles = modal.style || {};
        return Object.entries(styles)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
    }

    // ==========================================
    // DRAG AND RESIZE
    // ==========================================

    setupDrag(modal) {
        if (!modal.element) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const header = modal.element.querySelector('.modal-header');
        if (!header) return;

        header.style.cursor = 'grab';

        const onMouseDown = (e) => {
            if (e.target.closest('.modal-close')) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = modal.element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            header.style.cursor = 'grabbing';

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            modal.element.style.left = `${startLeft + dx}px`;
            modal.element.style.top = `${startTop + dy}px`;
            modal.element.style.transform = 'none';
        };

        const onMouseUp = () => {
            isDragging = false;
            header.style.cursor = 'grab';

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        header.addEventListener('mousedown', onMouseDown);
    }

    setupResize(modal) {
        if (!modal.element) return;

        // Create resize handle
        const handle = document.createElement('div');
        handle.className = 'modal-resize-handle';
        handle.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: nwse-resize;
            background: linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%);
        `;

        modal.element.style.position = 'relative';
        modal.element.appendChild(handle);

        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        const onMouseDown = (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = modal.element.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!isResizing) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const newWidth = Math.max(
                this.config.modalMinWidth,
                Math.min(this.config.modalMaxWidth, startWidth + dx)
            );
            const newHeight = Math.max(
                this.config.modalMinHeight,
                Math.min(parseInt(this.config.modalMaxHeight), startHeight + dy)
            );

            modal.element.style.width = `${newWidth}px`;
            modal.element.style.height = `${newHeight}px`;
        };

        const onMouseUp = () => {
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        handle.addEventListener('mousedown', onMouseDown);
    }

    // ==========================================
    // FOCUS TRAP
    // ==========================================

    setupFocusTrap(modal) {
        if (!modal.element) return;

        const focusableElements = modal.element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Focus first element
        setTimeout(() => firstFocusable.focus(), 100);

        const handleKeyDown = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        };

        modal.element.addEventListener('keydown', handleKeyDown);
        modal.focusTrapHandler = handleKeyDown;

        this.focusTrapStack.push(modal);
    }

    removeFocusTrap(modal) {
        if (modal.element && modal.focusTrapHandler) {
            modal.element.removeEventListener('keydown', modal.focusTrapHandler);
        }

        const index = this.focusTrapStack.indexOf(modal);
        if (index !== -1) {
            this.focusTrapStack.splice(index, 1);
        }
    }

    // ==========================================
    // SCROLL LOCK
    // ==========================================

    lockScroll() {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
    }

    unlockScroll() {
        const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================

    setupModalListeners(modal) {
        // ESC key
        if (modal.closeOnEscape && this.config.enableEscToClose) {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape' && this.activeModals[this.activeModals.length - 1]?.id === modal.id) {
                    this.close(modal.id);
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            modal.escapeHandler = handleKeyDown;
        }

        // Window resize
        const handleResize = () => {
            this.emit('modalResized', { id: modal.id });
        };

        window.addEventListener('resize', handleResize);
        modal.resizeHandler = handleResize;
    }

    // ==========================================
    // MODAL EVENTS
    // ==========================================

    onModalEvent(id, event, callback) {
        const modal = this.modals.get(id);
        if (!modal) return false;

        if (!modal.events.has(event)) {
            modal.events.set(event, []);
        }
        modal.events.get(event).push(callback);
        return true;
    }

    emitModalEvent(id, event, data) {
        const modal = this.modals.get(id);
        if (!modal) return;

        if (modal.events.has(event)) {
            for (const callback of modal.events.get(event)) {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in modal event ${event}:`, error);
                }
            }
        }
    }

    // ==========================================
    // QUEUE MANAGEMENT
    // ==========================================

    queueModal(content, options) {
        return new Promise((resolve) => {
            this.animationQueue.push({
                content,
                options,
                resolve
            });

            this.log(`📥 Modal queued (position: ${this.animationQueue.length})`);
            this.emit('modalQueued', { queueLength: this.animationQueue.length });
        });
    }

    processQueue() {
        if (this.animationQueue.length === 0) return;
        if (this.activeModals.length >= this.config.maxConcurrentModals) return;

        const queued = this.animationQueue.shift();
        if (!queued) return;

        const result = this.open(queued.content, queued.options);
        queued.resolve(result);
    }

    // ==========================================
    // UPDATE
    // ==========================================

    update(id, newContent) {
        const modal = this.modals.get(id);
        if (!modal) return false;

        modal.content = newContent;

        // Re-render content
        if (modal.element) {
            const body = modal.element.querySelector('.modal-body');
            if (body) {
                body.innerHTML = typeof newContent === 'function' ? newContent() : newContent;
            }
        }

        modal.timestamp = Date.now();
        this.emit('modalUpdated', { id, modal });

        return true;
    }

    // ==========================================
    // REMOVE
    // ==========================================

    removeModal(modal) {
        // Remove element
        if (modal.element && modal.element.parentNode) {
            modal.element.parentNode.removeChild(modal.element);
        }

        // Remove backdrop
        if (modal.backdropElement && modal.backdropElement.parentNode) {
            modal.backdropElement.parentNode.removeChild(modal.backdropElement);
        }

        // Remove from map
        this.modals.delete(modal.id);

        // Cleanup event listeners
        if (modal.escapeHandler) {
            document.removeEventListener('keydown', modal.escapeHandler);
        }
        if (modal.resizeHandler) {
            window.removeEventListener('resize', modal.resizeHandler);
        }

        this.emit('modalRemoved', { id: modal.id });
    }

    // ==========================================
    // GETTERS
    // ==========================================

    getModal(id) {
        return this.modals.get(id) || null;
    }

    getActiveModals() {
        return [...this.activeModals];
    }

    getModalCount() {
        return this.activeModals.length;
    }

    getStack() {
        return [...this.stack];
    }

    getStats() {
        return {
            ...this.stats,
            averageDuration: this.stats.totalModals > 0 
                ? this.stats.totalDuration / this.stats.totalModals 
                : 0
        };
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    generateId() {
        this.idCounter++;
        return 'modal_' + Date.now() + '_' + this.idCounter + '_' + 
               Math.random().toString(36).substr(2, 6);
    }

    log(message) {
        if (this.config.enableLogging) {
            const timestamp = new Date().toISOString();
            console.log(`[ModalManager] ${timestamp} - ${message}`);
        }
    }

    // ==========================================
    // EVENT SYSTEM
    // ==========================================

    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
        return this;
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const callbacks = this.eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
        return this;
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            const callbacks = this.eventListeners.get(event);
            for (const callback of callbacks) {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            }
        }
        return this;
    }

    // ==========================================
    // SERIALIZATION
    // ==========================================

    toJSON() {
        return {
            version: '2.0.0',
            stats: this.stats,
            config: this.config,
            modals: Array.from(this.modals.entries()).map(([id, modal]) => ({
                id,
                ...modal,
                element: null,
                backdropElement: null
            }))
        };
    }

    static fromJSON(data) {
        const manager = new ModalManager(data.config);
        manager.stats = data.stats || manager.stats;
        if (data.modals) {
            for (const modalData of data.modals) {
                const { id, ...modal } = modalData;
                manager.modals.set(id, {
                    ...modal,
                    element: null,
                    backdropElement: null
                });
                manager.activeModals.push(modal);
            }
        }
        return manager;
    }

    // ==========================================
    // SHUTDOWN
    // ==========================================

    shutdown() {
        this.isShuttingDown = true;
        this.closeAll();
        this.modals.clear();
        this.activeModals = [];
        this.stack = [];
        this.focusTrapStack = [];
        this.animationQueue = [];
        this.modalHistory = [];
        this.log('🛑 ModalManager shutdown complete');
    }
}
