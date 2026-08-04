// ============================================
// GRID BUILDER
// Complete Dynamic Grid System
// ============================================

export default class GridBuilder {
    constructor() {
        // ==========================================
        // STATE
        // ==========================================
        this.grids = new Map();
        this.gridIdCounter = 0;
        this.defaultConfig = {
            columns: 3,
            gap: 16,
            responsive: true,
            draggable: false,
            sortable: false,
            animate: true,
            breakpoints: {
                mobile: { columns: 1, gap: 8 },
                tablet: { columns: 2, gap: 12 },
                desktop: { columns: 3, gap: 16 },
                wide: { columns: 4, gap: 20 }
            }
        };
        
        // ==========================================
        // CARD TEMPLATES
        // ==========================================
        this.cardTemplates = {
            basic: this.createBasicCard.bind(this),
            file: this.createFileCard.bind(this),
            analysis: this.createAnalysisCard.bind(this),
            integration: this.createIntegrationCard.bind(this),
            contract: this.createContractCard.bind(this),
            module: this.createModuleCard.bind(this),
            stat: this.createStatCard.bind(this)
        };
    }

    // ==========================================
    // GRID CREATION
    // ==========================================
    createGrid(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return null;
        }

        const config = { ...this.defaultConfig, ...options };
        const gridId = `grid-${++this.gridIdCounter}`;
        
        // Create grid element
        const grid = document.createElement('div');
        grid.className = 'dynamic-grid';
        grid.dataset.gridId = gridId;
        grid.style.cssText = this.getGridStyles(config);
        
        // Add responsive classes
        if (config.responsive) {
            grid.classList.add('grid-responsive');
        }
        
        // Add animation
        if (config.animate) {
            grid.classList.add('grid-animated');
        }
        
        // Add drag and drop
        if (config.draggable || config.sortable) {
            grid.classList.add('grid-draggable');
            this.setupDragAndDrop(grid);
        }

        // Store grid data
        this.grids.set(gridId, {
            id: gridId,
            element: grid,
            config: config,
            cards: [],
            container: container
        });

        // Add to container
        container.appendChild(grid);
        
        return gridId;
    }

    // ==========================================
    // CARD CREATION
    // ==========================================
    addCard(gridId, cardData) {
        const grid = this.grids.get(gridId);
        if (!grid) {
            console.error(`Grid ${gridId} not found`);
            return null;
        }

        const card = document.createElement('div');
        card.className = 'grid-card';
        card.dataset.cardId = `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        
        // Build card content
        this.buildCardContent(card, cardData);
        
        // Add actions
        if (cardData.actions) {
            this.addCardActions(card, cardData.actions);
        }
        
        // Add click handler
        if (cardData.onClick) {
            card.addEventListener('click', cardData.onClick);
        }
        
        // Add to grid
        grid.element.appendChild(card);
        grid.cards.push({
            id: card.dataset.cardId,
            element: card,
            data: cardData
        });
        
        return card.dataset.cardId;
    }

    // ==========================================
    // CARD BUILDING
    // ==========================================
    buildCardContent(card, data) {
        let html = '';
        
        // Icon
        if (data.icon) {
            html += `<span class="card-icon">${data.icon}</span>`;
        }
        
        // Badge
        if (data.badge) {
            html += `<span class="card-badge ${data.badgeType || 'info'}">${data.badge}</span>`;
        }
        
        // Title
        if (data.title) {
            html += `<h4 class="card-title">${data.title}</h4>`;
        }
        
        // Subtitle
        if (data.subtitle) {
            html += `<p class="card-subtitle">${data.subtitle}</p>`;
        }
        
        // Content
        if (data.content) {
            html += `<div class="card-content">${data.content}</div>`;
        }
        
        // Details
        if (data.details) {
            html += `<div class="card-details">${data.details}</div>`;
        }
        
        // Progress
        if (data.progress !== undefined) {
            html += `
                <div class="card-progress">
                    <div class="progress-bar" style="width: ${Math.min(100, Math.max(0, data.progress))}%"></div>
                    <span class="progress-label">${data.progress}%</span>
                </div>
            `;
        }
        
        // Status
        if (data.status) {
            html += `<span class="card-status ${data.statusType || 'info'}">${data.status}</span>`;
        }
        
        // Meta
        if (data.meta) {
            html += `<div class="card-meta">${data.meta}</div>`;
        }
        
        card.innerHTML = html;
    }

    addCardActions(card, actions) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'card-actions';
        
        for (const action of actions) {
            const btn = document.createElement('button');
            btn.className = `btn ${action.class || 'secondary'} small`;
            btn.textContent = action.label;
            if (action.onClick) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    action.onClick(e);
                });
            }
            actionsContainer.appendChild(btn);
        }
        
        card.appendChild(actionsContainer);
    }

    // ==========================================
    // CARD TEMPLATES
    // ==========================================
    createBasicCard(data) {
        return {
            icon: data.icon || '📄',
            title: data.title || 'Card',
            content: data.content || 'Card content goes here',
            ...data
        };
    }

    createFileCard(file) {
        return {
            icon: file.icon || '📄',
            title: file.name,
            subtitle: file.size ? this.formatSize(file.size) : null,
            badge: file.type || 'file',
            badgeType: file.type === 'solidity' ? 'warning' : 'info',
            details: `
                <span>📅 ${file.date || 'Today'}</span>
                <span>📊 ${file.status || 'Ready'}</span>
            `,
            actions: [
                { label: '👁️ View', class: 'secondary' },
                { label: '📥 Download', class: 'primary' }
            ],
            ...file
        };
    }

    createAnalysisCard(result) {
        const score = result.score || 0;
        const scoreColor = score >= 80 ? 'success' : score >= 50 ? 'warning' : 'danger';
        
        return {
            icon: result.icon || '🔍',
            title: result.name,
            badge: result.type || 'analysis',
            badgeType: scoreColor,
            progress: score,
            details: `
                <span>📊 Score: ${score}%</span>
                <span>🔢 ${result.elements || 0} elements</span>
                <span>📏 ${result.complexity || 'Unknown'}</span>
            `,
            status: score >= 80 ? '✅ Passed' : score >= 50 ? '⚠️ Needs Review' : '❌ Failed',
            statusType: scoreColor,
            actions: [
                { label: '👁️ View', class: 'secondary' },
                { label: '📤 Export', class: 'primary' }
            ],
            ...result
        };
    }

    createIntegrationCard(integration) {
        return {
            icon: '🔗',
            title: integration.name,
            badge: integration.type || 'integration',
            badgeType: 'accent',
            details: `
                <span>📁 ${integration.files || 0} files</span>
                <span>📅 ${integration.date || 'Today'}</span>
                <span>✅ ${integration.status || 'Active'}</span>
            `,
            meta: `Created: ${integration.created || 'Today'}`,
            actions: [
                { label: '🚀 Launch', class: 'primary' },
                { label: '🗑️ Remove', class: 'danger' }
            ],
            ...integration
        };
    }

    createContractCard(contract) {
        return {
            icon: '⛓️',
            title: contract.name,
            badge: contract.version || 'v1.0',
            badgeType: 'warning',
            details: `
                <span>🔢 ${contract.functions || 0} functions</span>
                <span>📦 ${contract.events || 0} events</span>
                <span>${contract.hasRequire ? '✅ Require' : '⚠️ No Require'}</span>
            `,
            status: contract.verified ? '✅ Verified' : '⚠️ Unverified',
            statusType: contract.verified ? 'success' : 'warning',
            actions: [
                { label: '🚀 Deploy', class: 'success' },
                { label: '✅ Verify', class: 'primary' },
                { label: '🔧 Compile', class: 'secondary' }
            ],
            ...contract
        };
    }

    createModuleCard(module) {
        return {
            icon: '🧩',
            title: module.name,
            badge: `v${module.version || '1.0.0'}`,
            badgeType: 'info',
            details: `
                <span>📂 ${module.path || 'local'}</span>
                <span>📅 ${module.installed || 'Today'}</span>
            `,
            status: module.status || 'installed',
            statusType: 'success',
            actions: [
                { label: '▶️ Run', class: 'primary' },
                { label: '🗑️ Remove', class: 'danger' }
            ],
            ...module
        };
    }

    createStatCard(stat) {
        return {
            icon: stat.icon || '📊',
            title: stat.value || '0',
            subtitle: stat.label,
            content: stat.change ? `<span class="stat-change ${stat.changeType || 'neutral'}">${stat.change}</span>` : '',
            badge: stat.period || 'Today',
            badgeType: 'info',
            ...stat
        };
    }

    // ==========================================
    // GRID MANAGEMENT
    // ==========================================
    getGrid(gridId) {
        return this.grids.get(gridId);
    }

    getAllGrids() {
        return Array.from(this.grids.values());
    }

    clearGrid(gridId) {
        const grid = this.grids.get(gridId);
        if (grid) {
            grid.element.innerHTML = '';
            grid.cards = [];
        }
    }

    removeGrid(gridId) {
        const grid = this.grids.get(gridId);
        if (grid) {
            grid.element.remove();
            this.grids.delete(gridId);
        }
    }

    updateGrid(gridId, config) {
        const grid = this.grids.get(gridId);
        if (grid) {
            grid.config = { ...grid.config, ...config };
            grid.element.style.cssText = this.getGridStyles(grid.config);
        }
    }

    // ==========================================
    // DRAG AND DROP
    // ==========================================
    setupDragAndDrop(grid) {
        let dragStartIndex = null;
        let dragOverIndex = null;
        
        grid.addEventListener('dragstart', (e) => {
            const card = e.target.closest('.grid-card');
            if (card) {
                dragStartIndex = Array.from(grid.children).indexOf(card);
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        grid.addEventListener('dragend', (e) => {
            const card = e.target.closest('.grid-card');
            if (card) {
                card.classList.remove('dragging');
                card.style.opacity = '1';
            }
            if (dragStartIndex !== null && dragOverIndex !== null) {
                this.swapCards(grid, dragStartIndex, dragOverIndex);
            }
            dragStartIndex = null;
            dragOverIndex = null;
        });

        grid.addEventListener('dragover', (e) => {
            e.preventDefault();
            const card = e.target.closest('.grid-card');
            if (card) {
                const index = Array.from(grid.children).indexOf(card);
                if (index !== dragStartIndex) {
                    dragOverIndex = index;
                    grid.children.forEach((child, i) => {
                        child.style.opacity = i === index ? '0.5' : '1';
                    });
                }
            }
        });

        grid.addEventListener('dragleave', () => {
            grid.children.forEach(child => child.style.opacity = '1');
        });
    }

    swapCards(grid, fromIndex, toIndex) {
        const cards = Array.from(grid.children);
        const [removed] = cards.splice(fromIndex, 1);
        cards.splice(toIndex, 0, removed);
        grid.innerHTML = '';
        cards.forEach(card => grid.appendChild(card));
        grid.children.forEach(child => child.style.opacity = '1');
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================
    getGridStyles(config) {
        const styles = `
            display: grid;
            grid-template-columns: repeat(${config.columns || 3}, 1fr);
            gap: ${config.gap || 16}px;
            padding: ${config.padding || 0}px;
            width: 100%;
            height: ${config.height || 'auto'};
        `;
        
        // Responsive styles
        if (config.responsive && config.breakpoints) {
            const responsiveStyles = [];
            for (const [breakpoint, settings] of Object.entries(config.breakpoints)) {
                const [min, max] = this.getBreakpointRange(breakpoint);
                responsiveStyles.push(`
                    @media (min-width: ${min}px) and (max-width: ${max}px) {
                        .grid-responsive {
                            grid-template-columns: repeat(${settings.columns || 1}, 1fr);
                            gap: ${settings.gap || 8}px;
                        }
                    }
                `);
            }
            return styles + responsiveStyles.join('');
        }
        
        return styles;
    }

    getBreakpointRange(breakpoint) {
        const breakpoints = {
            mobile: [0, 480],
            tablet: [481, 768],
            desktop: [769, 1024],
            wide: [1025, Infinity]
        };
        return breakpoints[breakpoint] || [0, Infinity];
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // ==========================================
    // BULK OPERATIONS
    // ==========================================
    addCards(gridId, cardsData) {
        const ids = [];
        for (const data of cardsData) {
            const id = this.addCard(gridId, data);
            if (id) ids.push(id);
        }
        return ids;
    }

    removeCard(gridId, cardId) {
        const grid = this.grids.get(gridId);
        if (grid) {
            const index = grid.cards.findIndex(c => c.id === cardId);
            if (index !== -1) {
                grid.cards[index].element.remove();
                grid.cards.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    clearAllGrids() {
        for (const [id, grid] of this.grids) {
            this.clearGrid(id);
        }
    }

    // ==========================================
    // SEARCH & FILTER
    // ==========================================
    filterGrid(gridId, filterFn) {
        const grid = this.grids.get(gridId);
        if (!grid) return [];

        const matched = [];
        for (const card of grid.cards) {
            const shouldShow = filterFn(card.data);
            card.element.style.display = shouldShow ? '' : 'none';
            if (shouldShow) matched.push(card);
        }
        return matched;
    }

    searchGrid(gridId, query) {
        const searchLower = query.toLowerCase();
        return this.filterGrid(gridId, (data) => {
            return (data.title || '').toLowerCase().includes(searchLower) ||
                   (data.content || '').toLowerCase().includes(searchLower) ||
                   (data.subtitle || '').toLowerCase().includes(searchLower);
        });
    }
}

export default GridBuilder;
