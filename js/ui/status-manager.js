// ============================================
// STATUS MANAGER - ULTIMATE ADVANCED STATUS ENGINE
// ============================================

export default class StatusManager {
    constructor(options = {}) {
        // ==========================================
        // CORE STATE
        // ==========================================
        this.statuses = new Map();
        this.activeStatuses = [];
        this.statusHistory = [];
        this.queue = [];
        this.idCounter = 0;
        this.isShuttingDown = false;
        this.eventListeners = new Map();
        this.stats = {
            totalStatuses: 0,
            activeStatuses: 0,
            resolvedStatuses: 0,
            clearedStatuses: 0,
            averageDuration: 0,
            totalDuration: 0,
            maxConcurrent: 0
        };

        // ==========================================
        // CONFIGURATION
        // ==========================================
        this.config = {
            // Core
            enableAutoClear: options.enableAutoClear !== false,
            enableAutoResolve: options.enableAutoResolve !== false,
            enablePersistence: options.enablePersistence !== false,
            enableHistory: options.enableHistory !== false,
            enableQueue: options.enableQueue !== false,
            enableBatchProcessing: options.enableBatchProcessing !== false,
            enableDeduplication: options.enableDeduplication !== false,
            enablePrioritization: options.enablePrioritization !== false,
            enableExpiration: options.enableExpiration !== false,
            enableRetry: options.enableRetry !== false,

            // Status Types
            enableInfo: options.enableInfo !== false,
            enableSuccess: options.enableSuccess !== false,
            enableWarning: options.enableWarning !== false,
            enableError: options.enableError !== false,
            enableDebug: options.enableDebug !== false,
            enableProgress: options.enableProgress !== false,
            enableLoading: options.enableLoading !== false,
            enableIdle: options.enableIdle !== false,
            enableOffline: options.enableOffline !== false,
            enableOnline: options.enableOnline !== false,
            enableMaintenance: options.enableMaintenance !== false,
            enableCritical: options.enableCritical !== false,

            // Behavior
            defaultDuration: options.defaultDuration || 5000,
            defaultPriority: options.defaultPriority || 1,
            maxActive: options.maxActive || 50,
            maxHistory: options.maxHistory || 1000,
            maxQueueSize: options.maxQueueSize || 100,
            autoClearInterval: options.autoClearInterval || 10000,

            // Styling
            enableTheming: options.enableTheming !== false,
            enableCustomStyles: options.enableCustomStyles !== false,
            enableAnimations: options.enableAnimations !== false,
            enableTransitions: options.enableTransitions !== false,
            enableIcons: options.enableIcons !== false,
            enableProgressBars: options.enableProgressBars !== false,

            // Actions
            enableActions: options.enableActions !== false,
            enableUndo: options.enableUndo !== false,
            enableRetry: options.enableRetry !== false,
            enableDismiss: options.enableDismiss !== false,
            enableExpand: options.enableExpand !== false,

            // Logging
            enableLogging: options.enableLogging !== false,
            logLevel: options.logLevel || 'info'
        };

        // ==========================================
        // STATUS LEVELS
        // ==========================================
        this.levels = {
            info: {
                name: 'Info',
                priority: 1,
                icon: 'ℹ️',
                color: '#2196F3',
                bgColor: '#E3F2FD',
                duration: 5000,
                autoClear: true
            },
            success: {
                name: 'Success',
                priority: 2,
                icon: '✅',
                color: '#4CAF50',
                bgColor: '#E8F5E9',
                duration: 5000,
                autoClear: true
            },
            warning: {
                name: 'Warning',
                priority: 3,
                icon: '⚠️',
                color: '#FF9800',
                bgColor: '#FFF3E0',
                duration: 8000,
                autoClear: true
            },
            error: {
                name: 'Error',
                priority: 4,
                icon: '❌',
                color: '#F44336',
                bgColor: '#FFEBEE',
                duration: 10000,
                autoClear: true
            },
            debug: {
                name: 'Debug',
                priority: 0,
                icon: '🔧',
                color: '#9E9E9E',
                bgColor: '#F5F5F5',
                duration: 3000,
                autoClear: true
            },
            progress: {
                name: 'Progress',
                priority: 2,
                icon: '⏳',
                color: '#2196F3',
                bgColor: '#E3F2FD',
                duration: 0,
                autoClear: false
            },
            loading: {
                name: 'Loading',
                priority: 1,
                icon: '🔄',
                color: '#607D8B',
                bgColor: '#ECEFF1',
                duration: 0,
                autoClear: false
            },
            idle: {
                name: 'Idle',
                priority: 0,
                icon: '💤',
                color: '#9E9E9E',
                bgColor: '#F5F5F5',
                duration: 0,
                autoClear: true
            },
            offline: {
                name: 'Offline',
                priority: 5,
                icon: '📡',
                color: '#F44336',
                bgColor: '#FFEBEE',
                duration: 0,
                autoClear: false
            },
            online: {
                name: 'Online',
                priority: 5,
                icon: '🌐',
                color: '#4CAF50',
                bgColor: '#E8F5E9',
                duration: 0,
                autoClear: false
            },
            maintenance: {
                name: 'Maintenance',
                priority: 5,
                icon: '🔧',
                color: '#FF9800',
                bgColor: '#FFF3E0',
                duration: 0,
                autoClear: false
            },
            critical: {
                name: 'Critical',
                priority: 6,
                icon: '🚨',
                color: '#D32F2F',
                bgColor: '#FFCDD2',
                duration: 0,
                autoClear: false
            }
        };

        // ==========================================
        // STATUS ACTIONS
        // ==========================================
        this.actions = {
            dismiss: {
                name: 'Dismiss',
                icon: '✕',
                handler: (id) => this.clear(id)
            },
            retry: {
                name: 'Retry',
                icon: '🔄',
                handler: (id) => this.retry(id)
            },
            undo: {
                name: 'Undo',
                icon: '↩️',
                handler: (id) => this.undo(id)
            },
            expand: {
                name: 'Expand',
                icon: '📋',
                handler: (id) => this.expand(id)
            },
            copy: {
                name: 'Copy',
                icon: '📋',
                handler: (id) => this.copy(id)
            },
            report: {
                name: 'Report',
                icon: '📊',
                handler: (id) => this.report(id)
            }
        };

        // ==========================================
        // STATUS PRIORITIES
        // ==========================================
        this.priorities = {
            low: 0,
            normal: 1,
            high: 2,
            urgent: 3,
            critical: 4
        };

        this.log('📊 StatusManager Ultimate initialized');
        this.log(`📦 Status Levels: ${Object.keys(this.levels).length}`);
        this.log(`🔧 Actions: ${Object.keys(this.actions).length}`);
        this.log(`📊 Priorities: ${Object.keys(this.priorities).length}`);
    }

    // ==========================================
    // MAIN STATUS METHODS
    // ==========================================

    set(status, options = {}) {
        if (this.isShuttingDown) {
            throw new Error('StatusManager is shutting down');
        }

        const id = this.generateId();
        const level = this.levels[status] || this.levels.info;

        // Deduplication
        if (this.config.enableDeduplication) {
            const existing = this.findDuplicate(status, options);
            if (existing) {
                this.update(existing.id, { ...options, timestamp: Date.now() });
                return existing;
            }
        }

        // Queue if max active reached
        if (this.activeStatuses.length >= this.config.maxActive) {
            if (this.config.enableQueue) {
                return this.queueStatus(id, status, options);
            }
            // Auto-clear oldest if no queue
            const oldest = this.activeStatuses.shift();
            if (oldest) {
                this.clear(oldest.id);
            }
        }

        const statusObj = this.createStatus(id, status, options, level);
        this.addStatus(statusObj);

        // Auto-clear
        if (level.autoClear && this.config.enableAutoClear) {
            this.scheduleClear(id, options.duration || level.duration || this.config.defaultDuration);
        }

        this.log(`📊 Status set: ${status} (${id})`);
        this.emit('statusSet', { id, status, statusObj });

        return {
            id,
            status: statusObj,
            clear: () => this.clear(id),
            update: (newOptions) => this.update(id, newOptions),
            on: (event, callback) => this.onStatusEvent(id, event, callback)
        };
    }

    get(id) {
        return this.statuses.get(id) || null;
    }

    clear(id) {
        const status = this.statuses.get(id);
        if (!status) return false;

        // Cancel auto-clear
        if (status.clearTimeout) {
            clearTimeout(status.clearTimeout);
        }

        // Remove from active
        const index = this.activeStatuses.indexOf(status);
        if (index !== -1) {
            this.activeStatuses.splice(index, 1);
        }

        // Add to history
        if (this.config.enableHistory) {
            status.resolvedAt = Date.now();
            status.duration = status.resolvedAt - status.timestamp;
            this.statusHistory.push(status);
            this.stats.resolvedStatuses++;
            this.stats.totalDuration += status.duration;

            // Limit history
            if (this.statusHistory.length > this.config.maxHistory) {
                this.statusHistory = this.statusHistory.slice(-this.config.maxHistory);
            }
        }

        // Remove from map
        this.statuses.delete(id);

        // Update stats
        this.stats.activeStatuses = this.activeStatuses.length;
        this.stats.clearedStatuses++;
        this.stats.averageDuration = this.stats.totalDuration / this.stats.resolvedStatuses;

        this.log(`📊 Status cleared: ${id}`);
        this.emit('statusCleared', { id, status });

        // Process queue
        this.processQueue();

        return true;
    }

    clearAll() {
        const count = this.activeStatuses.length;
        const ids = this.activeStatuses.map(s => s.id);

        for (const id of ids) {
            this.clear(id);
        }

        this.log(`📊 Cleared all ${count} statuses`);
        this.emit('allStatusesCleared', { count });

        return count;
    }

    clearByType(type) {
        const statuses = this.activeStatuses.filter(s => s.type === type);
        const count = statuses.length;

        for (const status of statuses) {
            this.clear(status.id);
        }

        this.log(`📊 Cleared ${count} ${type} statuses`);
        this.emit('statusesClearedByType', { type, count });

        return count;
    }

    clearByLevel(level) {
        const statuses = this.activeStatuses.filter(s => s.level === level);
        const count = statuses.length;

        for (const status of statuses) {
            this.clear(status.id);
        }

        this.log(`📊 Cleared ${count} ${level} statuses`);
        this.emit('statusesClearedByLevel', { level, count });

        return count;
    }

    // ==========================================
    // STATUS CREATION
    // ==========================================

    createStatus(id, type, options, level) {
        const priority = this.priorities[options.priority] || level.priority || this.config.defaultPriority;

        return {
            id,
            type,
            level: options.level || type,
            message: options.message || '',
            description: options.description || '',
            details: options.details || null,
            data: options.data || {},
            priority,
            timestamp: Date.now(),
            duration: 0,
            resolvedAt: null,
            clearTimeout: null,
            autoClear: options.autoClear !== undefined ? options.autoClear : level.autoClear,
            actions: options.actions || [],
            progress: options.progress || null,
            percentage: options.percentage || 0,
            retryCount: options.retryCount || 0,
            maxRetries: options.maxRetries || 3,
            isRetryable: options.isRetryable || false,
            isUndoable: options.isUndoable || false,
            isDismissible: options.isDismissible !== false,
            isExpandable: options.isExpandable || false,
            tags: options.tags || [],
            metadata: options.metadata || {},
            icon: options.icon || level.icon,
            color: options.color || level.color,
            bgColor: options.bgColor || level.bgColor,
            duration: options.duration || level.duration || this.config.defaultDuration
        };
    }

    addStatus(status) {
        this.statuses.set(status.id, status);
        this.activeStatuses.push(status);

        this.stats.totalStatuses++;
        this.stats.activeStatuses = this.activeStatuses.length;
        this.stats.maxConcurrent = Math.max(this.stats.maxConcurrent, this.activeStatuses.length);

        // Sort by priority
        this.activeStatuses.sort((a, b) => b.priority - a.priority);

        this.emit('statusAdded', { status });
    }

    // ==========================================
    // UPDATE
    // ==========================================

    update(id, updates) {
        const status = this.statuses.get(id);
        if (!status) return false;

        // Update properties
        if (updates.message !== undefined) status.message = updates.message;
        if (updates.description !== undefined) status.description = updates.description;
        if (updates.details !== undefined) status.details = updates.details;
        if (updates.data !== undefined) status.data = { ...status.data, ...updates.data };
        if (updates.progress !== undefined) status.progress = updates.progress;
        if (updates.percentage !== undefined) status.percentage = updates.percentage;
        if (updates.tags !== undefined) status.tags = updates.tags;
        if (updates.metadata !== undefined) status.metadata = { ...status.metadata, ...updates.metadata };

        // Update duration
        if (updates.duration !== undefined) {
            status.duration = updates.duration;
            if (status.clearTimeout) {
                clearTimeout(status.clearTimeout);
                this.scheduleClear(id, updates.duration);
            }
        }

        // Update priority
        if (updates.priority !== undefined) {
            status.priority = this.priorities[updates.priority] || updates.priority;
            // Re-sort
            this.activeStatuses.sort((a, b) => b.priority - a.priority);
        }

        status.timestamp = Date.now();

        this.log(`📊 Status updated: ${id}`);
        this.emit('statusUpdated', { id, status, updates });

        return true;
    }

    // ==========================================
    // PROGRESS
    // ==========================================

    progress(id, percentage, message) {
        const status = this.statuses.get(id);
        if (!status) return false;

        status.percentage = Math.min(100, Math.max(0, percentage));
        if (message !== undefined) {
            status.message = message;
        }

        this.log(`📊 Progress ${status.percentage}%: ${id}`);
        this.emit('statusProgress', { id, status, percentage });

        // Auto-clear on complete
        if (percentage >= 100 && status.autoClear) {
            this.scheduleClear(id, 2000);
        }

        return true;
    }

    // ==========================================
    // QUEUE
    // ==========================================

    queueStatus(id, type, options) {
        return new Promise((resolve) => {
            this.queue.push({
                id,
                type,
                options,
                timestamp: Date.now()
            });

            this.log(`📥 Status queued: ${id} (position: ${this.queue.length})`);
            this.emit('statusQueued', { queueLength: this.queue.length });

            // Process if not at max
            if (this.activeStatuses.length < this.config.maxActive) {
                this.processQueue();
            }

            resolve({
                id,
                queued: true,
                position: this.queue.length
            });
        });
    }

    processQueue() {
        if (this.queue.length === 0) return;
        if (this.activeStatuses.length >= this.config.maxActive) return;

        const queued = this.queue.shift();
        if (!queued) return;

        const result = this.set(queued.type, queued.options);
        this.emit('statusProcessed', { id: result.id });
    }

    // ==========================================
    // SCHEDULING
    // ==========================================

    scheduleClear(id, duration) {
        const status = this.statuses.get(id);
        if (!status) return;

        if (duration <= 0) return;

        if (status.clearTimeout) {
            clearTimeout(status.clearTimeout);
        }

        status.clearTimeout = setTimeout(() => {
            this.clear(id);
        }, duration);
    }

    // ==========================================
    // ACTIONS
    // ==========================================

    retry(id) {
        const status = this.statuses.get(id);
        if (!status) return false;

        if (!status.isRetryable) {
            throw new Error('Status is not retryable');
        }

        if (status.retryCount >= status.maxRetries) {
            throw new Error('Max retries reached');
        }

        status.retryCount++;
        status.message = `Retrying (${status.retryCount}/${status.maxRetries})...`;
        status.timestamp = Date.now();

        this.log(`🔄 Retry ${status.retryCount}: ${id}`);
        this.emit('statusRetry', { id, status });

        return true;
    }

    undo(id) {
        const status = this.statuses.get(id);
        if (!status) return false;

        if (!status.isUndoable) {
            throw new Error('Status is not undoable');
        }

        this.log(`↩️ Undo: ${id}`);
        this.emit('statusUndo', { id, status });

        return true;
    }

    expand(id) {
        const status = this.statuses.get(id);
        if (!status) return false;

        if (!status.isExpandable) {
            throw new Error('Status is not expandable');
        }

        this.log(`📋 Expand: ${id}`);
        this.emit('statusExpand', { id, status });

        return true;
    }

    copy(id) {
        const status = this.statuses.get(id);
        if (!status) return false;

        const text = `${status.message}\n${status.description || ''}`;
        navigator.clipboard?.writeText(text);

        this.log(`📋 Copy: ${id}`);
        this.emit('statusCopy', { id, status });

        return true;
    }

    report(id) {
        const status = this.statuses.get(id);
        if (!status) return false;

        this.log(`📊 Report: ${id}`);
        this.emit('statusReport', { id, status });

        return true;
    }

    // ==========================================
    // FINDING
    // ==========================================

    findDuplicate(type, options) {
        return this.activeStatuses.find(s => 
            s.type === type && 
            s.message === options.message &&
            s.description === options.description
        ) || null;
    }

    findByType(type) {
        return this.activeStatuses.filter(s => s.type === type);
    }

    findByLevel(level) {
        return this.activeStatuses.filter(s => s.level === level);
    }

    findByTag(tag) {
        return this.activeStatuses.filter(s => s.tags.includes(tag));
    }

    findByPriority(priority) {
        return this.activeStatuses.filter(s => s.priority === priority);
    }

    // ==========================================
    // STATUS EVENTS
    // ==========================================

    onStatusEvent(id, event, callback) {
        const status = this.statuses.get(id);
        if (!status) return false;

        if (!status.events) {
            status.events = new Map();
        }

        if (!status.events.has(event)) {
            status.events.set(event, []);
        }
        status.events.get(event).push(callback);
        return true;
    }

    emitStatusEvent(id, event, data) {
        const status = this.statuses.get(id);
        if (!status) return;

        if (status.events && status.events.has(event)) {
            for (const callback of status.events.get(event)) {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in status event ${event}:`, error);
                }
            }
        }
    }

    // ==========================================
    // GETTERS
    // ==========================================

    getAll() {
        return [...this.activeStatuses];
    }

    getCount() {
        return this.activeStatuses.length;
    }

    getStats() {
        return {
            ...this.stats,
            averageDuration: this.stats.totalStatuses > 0 
                ? this.stats.totalDuration / this.stats.totalStatuses 
                : 0
        };
    }

    getHistory() {
        return [...this.statusHistory];
    }

    getQueue() {
        return [...this.queue];
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    generateId() {
        this.idCounter++;
        return 'status_' + Date.now() + '_' + this.idCounter + '_' + 
               Math.random().toString(36).substr(2, 6);
    }

    log(message) {
        if (this.config.enableLogging) {
            const timestamp = new Date().toISOString();
            console.log(`[StatusManager] ${timestamp} - ${message}`);
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
            statuses: Array.from(this.statuses.entries()).map(([id, status]) => ({
                id,
                ...status,
                clearTimeout: null
            }))
        };
    }

    static fromJSON(data) {
        const manager = new StatusManager(data.config);
        manager.stats = data.stats || manager.stats;
        if (data.statuses) {
            for (const statusData of data.statuses) {
                const { id, ...status } = statusData;
                manager.statuses.set(id, { ...status, clearTimeout: null });
                manager.activeStatuses.push(status);
            }
        }
        return manager;
    }

    // ==========================================
    // SHUTDOWN
    // ==========================================

    shutdown() {
        this.isShuttingDown = true;
        this.clearAll();
        this.statuses.clear();
        this.activeStatuses = [];
        this.statusHistory = [];
        this.queue = [];
        this.log('🛑 StatusManager shutdown complete');
    }
}
