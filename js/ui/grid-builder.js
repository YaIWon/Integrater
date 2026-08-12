// ============================================
// GRID BUILDER - ULTIMATE ADVANCED GRID ENGINE
// ============================================

export default class GridBuilder {
    constructor(options = {}) {
        // ==========================================
        // CORE STATE
        // ==========================================
        this.grids = new Map();
        this.activeGrids = new Map();
        this.gridHistory = [];
        this.cache = new Map();
        this.queue = [];
        this.idCounter = 0;
        this.isShuttingDown = false;
        this.eventListeners = new Map();
        this.stats = {
            totalGrids: 0,
            activeGrids: 0,
            totalCells: 0,
            totalRows: 0,
            totalColumns: 0,
            renderTime: 0,
            buildTime: 0,
            cacheHits: 0,
            cacheMisses: 0
        };

        // ==========================================
        // CONFIGURATION
        // ==========================================
        this.config = {
            // Core
            enableVirtualDOM: options.enableVirtualDOM !== false,
            enableReactiveUpdates: options.enableReactiveUpdates !== false,
            enableCaching: options.enableCaching !== false,
            enableAsyncRendering: options.enableAsyncRendering !== false,
            enableConcurrentRendering: options.enableConcurrentRendering !== false,
            enableProgressiveRendering: options.enableProgressiveRendering !== false,
            enableIncrementalRendering: options.enableIncrementalRendering !== false,
            enableSuspense: options.enableSuspense !== false,
            enableErrorBoundaries: options.enableErrorBoundaries !== false,

            // Grid Features
            enableSorting: options.enableSorting !== false,
            enableFiltering: options.enableFiltering !== false,
            enableGrouping: options.enableGrouping !== false,
            enablePagination: options.enablePagination !== false,
            enableInfiniteScroll: options.enableInfiniteScroll !== false,
            enableVirtualScrolling: options.enableVirtualScrolling !== false,
            enableRowSelection: options.enableRowSelection !== false,
            enableColumnSelection: options.enableColumnSelection !== false,
            enableCellSelection: options.enableCellSelection !== false,
            enableMultiSelection: options.enableMultiSelection !== false,
            enableDragAndDrop: options.enableDragAndDrop !== false,
            enableResize: options.enableResize !== false,
            enableReorder: options.enableReorder !== false,
            enableExport: options.enableExport !== false,
            enableImport: options.enableImport !== false,
            enablePrint: options.enablePrint !== false,
            enableCopy: options.enableCopy !== false,
            enablePaste: options.enablePaste !== false,
            enableCut: options.enableCut !== false,
            enableUndo: options.enableUndo !== false,
            enableRedo: options.enableRedo !== false,
            enableAutoSave: options.enableAutoSave !== false,
            enableAutoResize: options.enableAutoResize !== false,
            enableAutoFit: options.enableAutoFit !== false,

            // Data
            enableDataValidation: options.enableDataValidation !== false,
            enableDataTransformation: options.enableDataTransformation !== false,
            enableDataAggregation: options.enableDataAggregation !== false,
            enableDataPivot: options.enableDataPivot !== false,
            enableDataCharting: options.enableDataCharting !== false,
            enableDataExport: options.enableDataExport !== false,
            enableDataImport: options.enableDataImport !== false,

            // Styling
            enableTheming: options.enableTheming !== false,
            enableCustomStyles: options.enableCustomStyles !== false,
            enableResponsiveDesign: options.enableResponsiveDesign !== false,
            enableAccessibility: options.enableAccessibility !== false,
            enableKeyboardNavigation: options.enableKeyboardNavigation !== false,
            enableScreenReaderSupport: options.enableScreenReaderSupport !== false,

            // Performance
            enablePerformanceMonitoring: options.enablePerformanceMonitoring !== false,
            enableOptimization: options.enableOptimization !== false,
            enableLazyLoading: options.enableLazyLoading !== false,
            enableMemoization: options.enableMemoization !== false,
            enableDebouncing: options.enableDebouncing !== false,
            enableThrottling: options.enableThrottling !== false,

            // Limits
            maxRows: options.maxRows || 10000,
            maxColumns: options.maxColumns || 100,
            maxCells: options.maxCells || 100000,
            maxCacheSize: options.maxCacheSize || 1000,
            maxConcurrent: options.maxConcurrent || 5,
            maxQueueSize: options.maxQueueSize || 50,

            // Logging
            enableLogging: options.enableLogging !== false,
            logLevel: options.logLevel || 'info',
            enablePerformanceMetrics: options.enablePerformanceMetrics !== false
        };

        // ==========================================
        // DEFAULT COLUMN TYPES
        // ==========================================
        this.columnTypes = {
            string: {
                type: 'string',
                align: 'left',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 150,
                minWidth: 50,
                maxWidth: 500,
                format: (value) => String(value),
                parse: (value) => String(value)
            },
            number: {
                type: 'number',
                align: 'right',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 120,
                minWidth: 50,
                maxWidth: 300,
                format: (value) => value?.toLocaleString() || '',
                parse: (value) => Number(value)
            },
            boolean: {
                type: 'boolean',
                align: 'center',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 80,
                minWidth: 40,
                maxWidth: 150,
                format: (value) => value ? '✓' : '✗',
                parse: (value) => value === true || value === 'true'
            },
            date: {
                type: 'date',
                align: 'center',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 150,
                minWidth: 100,
                maxWidth: 300,
                format: (value) => {
                    if (!value) return '';
                    const date = new Date(value);
                    return date.toLocaleDateString();
                },
                parse: (value) => new Date(value)
            },
            datetime: {
                type: 'datetime',
                align: 'center',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 180,
                minWidth: 150,
                maxWidth: 400,
                format: (value) => {
                    if (!value) return '';
                    const date = new Date(value);
                    return date.toLocaleString();
                },
                parse: (value) => new Date(value)
            },
            currency: {
                type: 'currency',
                align: 'right',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 150,
                minWidth: 100,
                maxWidth: 400,
                format: (value, currency = 'USD') => {
                    if (value == null) return '';
                    return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency
                    }).format(value);
                },
                parse: (value) => Number(value.replace(/[^0-9.-]/g, ''))
            },
            percent: {
                type: 'percent',
                align: 'right',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 100,
                minWidth: 60,
                maxWidth: 200,
                format: (value) => {
                    if (value == null) return '';
                    return (value * 100).toFixed(1) + '%';
                },
                parse: (value) => Number(value.replace('%', '')) / 100
            },
            email: {
                type: 'email',
                align: 'left',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 200,
                minWidth: 100,
                maxWidth: 500,
                format: (value) => String(value),
                parse: (value) => String(value)
            },
            phone: {
                type: 'phone',
                align: 'left',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 150,
                minWidth: 100,
                maxWidth: 300,
                format: (value) => {
                    if (!value) return '';
                    const cleaned = String(value).replace(/\D/g, '');
                    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : value;
                },
                parse: (value) => String(value)
            },
            url: {
                type: 'url',
                align: 'left',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 200,
                minWidth: 100,
                maxWidth: 600,
                format: (value) => {
                    if (!value) return '';
                    const url = new URL(value);
                    return url.hostname;
                },
                parse: (value) => String(value)
            },
            image: {
                type: 'image',
                align: 'center',
                sortable: false,
                filterable: false,
                groupable: false,
                width: 60,
                minWidth: 40,
                maxWidth: 100,
                format: (value) => value,
                parse: (value) => String(value)
            },
            color: {
                type: 'color',
                align: 'center',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 80,
                minWidth: 40,
                maxWidth: 150,
                format: (value) => value,
                parse: (value) => String(value)
            },
            rating: {
                type: 'rating',
                align: 'center',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 120,
                minWidth: 60,
                maxWidth: 200,
                format: (value, max = 5) => {
                    if (value == null) return '';
                    return '★'.repeat(Math.round(value)) + '☆'.repeat(max - Math.round(value));
                },
                parse: (value) => Number(value)
            },
            progress: {
                type: 'progress',
                align: 'center',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 120,
                minWidth: 60,
                maxWidth: 300,
                format: (value) => {
                    if (value == null) return '';
                    const percent = Math.min(100, Math.max(0, value * 100));
                    return `${percent.toFixed(0)}%`;
                },
                parse: (value) => Number(value.replace('%', '')) / 100
            },
            custom: {
                type: 'custom',
                align: 'left',
                sortable: true,
                filterable: true,
                groupable: true,
                width: 150,
                minWidth: 50,
                maxWidth: 600,
                format: (value) => String(value),
                parse: (value) => value
            }
        };

        // ==========================================
        // DEFAULT FILTER OPERATORS
        // ==========================================
        this.filterOperators = {
            eq: {
                label: 'Equals',
                apply: (value, filter) => value === filter
            },
            neq: {
                label: 'Not Equals',
                apply: (value, filter) => value !== filter
            },
            gt: {
                label: 'Greater Than',
                apply: (value, filter) => value > filter
            },
            gte: {
                label: 'Greater Than or Equal',
                apply: (value, filter) => value >= filter
            },
            lt: {
                label: 'Less Than',
                apply: (value, filter) => value < filter
            },
            lte: {
                label: 'Less Than or Equal',
                apply: (value, filter) => value <= filter
            },
            contains: {
                label: 'Contains',
                apply: (value, filter) => String(value).toLowerCase().includes(String(filter).toLowerCase())
            },
            notContains: {
                label: 'Not Contains',
                apply: (value, filter) => !String(value).toLowerCase().includes(String(filter).toLowerCase())
            },
            startsWith: {
                label: 'Starts With',
                apply: (value, filter) => String(value).toLowerCase().startsWith(String(filter).toLowerCase())
            },
            endsWith: {
                label: 'Ends With',
                apply: (value, filter) => String(value).toLowerCase().endsWith(String(filter).toLowerCase())
            },
            in: {
                label: 'In',
                apply: (value, filter) => filter.includes(value)
            },
            notIn: {
                label: 'Not In',
                apply: (value, filter) => !filter.includes(value)
            },
            between: {
                label: 'Between',
                apply: (value, filter) => value >= filter[0] && value <= filter[1]
            },
            notBetween: {
                label: 'Not Between',
                apply: (value, filter) => value < filter[0] || value > filter[1]
            },
            isNull: {
                label: 'Is Null',
                apply: (value) => value == null
            },
            isNotNull: {
                label: 'Is Not Null',
                apply: (value) => value != null
            },
            isEmpty: {
                label: 'Is Empty',
                apply: (value) => value === '' || value == null
            },
            isNotEmpty: {
                label: 'Is Not Empty',
                apply: (value) => value !== '' && value != null
            }
        };

        // ==========================================
        // DEFAULT SORT STRATEGIES
        // ==========================================
        this.sortStrategies = {
            ascending: {
                label: 'Ascending',
                compare: (a, b) => {
                    if (a == null && b == null) return 0;
                    if (a == null) return 1;
                    if (b == null) return -1;
                    if (typeof a === 'number' && typeof b === 'number') return a - b;
                    return String(a).localeCompare(String(b));
                }
            },
            descending: {
                label: 'Descending',
                compare: (a, b) => {
                    if (a == null && b == null) return 0;
                    if (a == null) return -1;
                    if (b == null) return 1;
                    if (typeof a === 'number' && typeof b === 'number') return b - a;
                    return String(b).localeCompare(String(a));
                }
            },
            caseInsensitive: {
                label: 'Case Insensitive',
                compare: (a, b) => {
                    if (a == null && b == null) return 0;
                    if (a == null) return 1;
                    if (b == null) return -1;
                    return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
                }
            },
            natural: {
                label: 'Natural',
                compare: (a, b) => {
                    if (a == null && b == null) return 0;
                    if (a == null) return 1;
                    if (b == null) return -1;
                    return this.naturalCompare(String(a), String(b));
                }
            }
        };

        // ==========================================
        // DEFAULT AGGREGATION FUNCTIONS
        // ==========================================
        this.aggregationFunctions = {
            sum: {
                label: 'Sum',
                apply: (values) => values.reduce((sum, v) => sum + (v || 0), 0)
            },
            average: {
                label: 'Average',
                apply: (values) => {
                    const valid = values.filter(v => v != null);
                    return valid.length > 0 ? valid.reduce((sum, v) => sum + v, 0) / valid.length : 0;
                }
            },
            min: {
                label: 'Minimum',
                apply: (values) => Math.min(...values.filter(v => v != null))
            },
            max: {
                label: 'Maximum',
                apply: (values) => Math.max(...values.filter(v => v != null))
            },
            count: {
                label: 'Count',
                apply: (values) => values.filter(v => v != null).length
            },
            countAll: {
                label: 'Count All',
                apply: (values) => values.length
            },
            distinct: {
                label: 'Distinct Count',
                apply: (values) => new Set(values.filter(v => v != null)).size
            },
            variance: {
                label: 'Variance',
                apply: (values) => {
                    const valid = values.filter(v => v != null);
                    if (valid.length < 2) return 0;
                    const mean = valid.reduce((sum, v) => sum + v, 0) / valid.length;
                    return valid.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / valid.length;
                }
            },
            standardDeviation: {
                label: 'Standard Deviation',
                apply: (values) => {
                    const valid = values.filter(v => v != null);
                    if (valid.length < 2) return 0;
                    const mean = valid.reduce((sum, v) => sum + v, 0) / valid.length;
                    const variance = valid.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / valid.length;
                    return Math.sqrt(variance);
                }
            },
            first: {
                label: 'First',
                apply: (values) => values.find(v => v != null)
            },
            last: {
                label: 'Last',
                apply: (values) => values.filter(v => v != null).pop()
            },
            median: {
                label: 'Median',
                apply: (values) => {
                    const sorted = values.filter(v => v != null).sort((a, b) => a - b);
                    if (sorted.length === 0) return 0;
                    const mid = Math.floor(sorted.length / 2);
                    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
                }
            },
            mode: {
                label: 'Mode',
                apply: (values) => {
                    const freq = {};
                    for (const v of values) {
                        if (v != null) {
                            freq[v] = (freq[v] || 0) + 1;
                        }
                    }
                    let max = 0;
                    let mode = null;
                    for (const [key, count] of Object.entries(freq)) {
                        if (count > max) {
                            max = count;
                            mode = key;
                        }
                    }
                    return mode;
                }
            }
        };

        this.log('📊 GridBuilder Ultimate initialized');
        this.log(`📦 Column Types: ${Object.keys(this.columnTypes).length}`);
        this.log(`🔧 Filter Operators: ${Object.keys(this.filterOperators).length}`);
        this.log(`📊 Sort Strategies: ${Object.keys(this.sortStrategies).length}`);
        this.log(`📈 Aggregation Functions: ${Object.keys(this.aggregationFunctions).length}`);
    }

    // ==========================================
    // MAIN BUILD METHOD
    // ==========================================

    build(config) {
        const startTime = performance.now();
        const id = this.generateId();

        this.log(`🔨 Building grid: ${config.name || 'unnamed'}`);

        try {
            // Validate config
            const validation = this.validateConfig(config);
            if (!validation.success) {
                throw new Error(`Config validation failed: ${validation.errors.join(', ')}`);
            }

            // Create grid
            const grid = this.createGrid(config, id);

            // Cache grid
            if (this.config.enableCaching) {
                const cacheKey = this.generateCacheKey(config);
                this.cache.set(cacheKey, {
                    grid,
                    timestamp: Date.now()
                });
            }

            // Store grid
            this.grids.set(id, grid);
            this.activeGrids.set(id, grid);
            this.gridHistory.push({
                id,
                name: config.name || 'unnamed',
                timestamp: new Date().toISOString(),
                rows: grid.rows.length,
                columns: grid.columns.length,
                cells: grid.rows.length * grid.columns.length
            });

            this.stats.totalGrids++;
            this.stats.activeGrids = this.activeGrids.size;
            this.stats.totalRows += grid.rows.length;
            this.stats.totalColumns += grid.columns.length;
            this.stats.totalCells += grid.rows.length * grid.columns.length;

            const buildTime = performance.now() - startTime;
            this.stats.buildTime += buildTime;

            this.log(`✅ Grid ${id} built in ${buildTime.toFixed(2)}ms`);
            this.emit('gridBuilt', { id, grid, buildTime });

            return {
                success: true,
                id,
                grid,
                message: `✅ Grid built in ${buildTime.toFixed(2)}ms`,
                stats: {
                    rows: grid.rows.length,
                    columns: grid.columns.length,
                    cells: grid.rows.length * grid.columns.length,
                    buildTime
                }
            };

        } catch (error) {
            this.log(`❌ Grid build failed: ${error.message}`);
            this.emit('gridError', { error });
            return {
                success: false,
                error: error.message,
                message: `❌ Grid build failed: ${error.message}`
            };
        }
    }

    // ==========================================
    // GRID CREATION
    // ==========================================

    createGrid(config, id) {
        const grid = {
            id,
            name: config.name || 'Grid',
            description: config.description || '',
            version: config.version || '1.0.0',
            columns: this.createColumns(config.columns || []),
            rows: config.data || [],
            options: {
                ...this.config,
                ...config.options
            },
            state: {
                sort: config.initialSort || null,
                filters: config.initialFilters || [],
                groups: config.initialGroups || [],
                selected: config.initialSelection || [],
                page: config.initialPage || 1,
                pageSize: config.pageSize || 20,
                scrollPosition: 0,
                expanded: config.initialExpanded || [],
                pinned: config.initialPinned || [],
                hidden: config.initialHidden || []
            },
            metadata: {
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                dataVersion: 1,
                totalRows: config.data?.length || 0
            },
            statistics: {
                rowCount: config.data?.length || 0,
                columnCount: config.columns?.length || 0,
                cellCount: (config.data?.length || 0) * (config.columns?.length || 0),
                dataSize: this.calculateDataSize(config.data || []),
                lastUpdated: new Date().toISOString()
            }
        };

        return grid;
    }

    // ==========================================
    // COLUMN CREATION
    // ==========================================

    createColumns(columnConfigs) {
        const columns = [];

        for (const config of columnConfigs) {
            const column = this.createColumn(config);
            columns.push(column);
        }

        return columns;
    }

    createColumn(config) {
        const type = this.columnTypes[config.type] || this.columnTypes.string;

        return {
            id: config.id || this.generateId(),
            field: config.field || config.id || 'column',
            name: config.name || config.field || 'Column',
            type: config.type || 'string',
            align: config.align || type.align || 'left',
            width: config.width || type.width || 150,
            minWidth: config.minWidth || type.minWidth || 50,
            maxWidth: config.maxWidth || type.maxWidth || 600,
            sortable: config.sortable !== undefined ? config.sortable : type.sortable !== false,
            filterable: config.filterable !== undefined ? config.filterable : type.filterable !== false,
            groupable: config.groupable !== undefined ? config.groupable : type.groupable !== false,
            resizable: config.resizable !== undefined ? config.resizable : true,
            reorderable: config.reorderable !== undefined ? config.reorderable : true,
            pinned: config.pinned || null,
            hidden: config.hidden || false,
            format: config.format || type.format || ((v) => String(v)),
            parse: config.parse || type.parse || ((v) => v),
            validator: config.validator || null,
            formatter: config.formatter || null,
            parser: config.parser || null,
            renderer: config.renderer || null,
            filter: config.filter || null,
            sort: config.sort || null,
            aggregate: config.aggregate || null,
            summary: config.summary || null,
            footer: config.footer || null,
            header: config.header || null,
            cellStyle: config.cellStyle || null,
            headerStyle: config.headerStyle || null,
            footerStyle: config.footerStyle || null,
            className: config.className || '',
            headerClassName: config.headerClassName || '',
            footerClassName: config.footerClassName || '',
            cellClassName: config.cellClassName || '',
            tooltip: config.tooltip || null,
            description: config.description || null
        };
    }

    // ==========================================
    // DATA OPERATIONS
    // ==========================================

    getCell(gridId, rowIndex, columnField) {
        const grid = this.grids.get(gridId);
        if (!grid) return null;

        const column = grid.columns.find(c => c.field === columnField);
        if (!column) return null;

        const row = grid.rows[rowIndex];
        if (!row) return null;

        const value = row[columnField];
        return {
            value,
            formatted: column.format(value),
            raw: value,
            rowIndex,
            columnField,
            column
        };
    }

    setCell(gridId, rowIndex, columnField, value) {
        const grid = this.grids.get(gridId);
        if (!grid) return false;

        const column = grid.columns.find(c => c.field === columnField);
        if (!column) return false;

        const row = grid.rows[rowIndex];
        if (!row) return false;

        // Validate
        if (column.validator) {
            const validation = column.validator(value);
            if (!validation.valid) {
                throw new Error(validation.message || 'Validation failed');
            }
        }

        // Parse
        const parsed = column.parse(value);
        row[columnField] = parsed;

        grid.metadata.updated = new Date().toISOString();
        grid.metadata.dataVersion++;

        this.emit('cellUpdated', {
            gridId,
            rowIndex,
            columnField,
            value: parsed,
            previousValue: value
        });

        return true;
    }

    addRow(gridId, rowData) {
        const grid = this.grids.get(gridId);
        if (!grid) return false;

        // Validate row data
        for (const column of grid.columns) {
            const value = rowData[column.field];
            if (column.validator) {
                const validation = column.validator(value);
                if (!validation.valid) {
                    throw new Error(validation.message || `Validation failed for ${column.field}`);
                }
            }
        }

        // Parse data
        const parsedRow = {};
        for (const column of grid.columns) {
            const value = rowData[column.field];
            parsedRow[column.field] = column.parse(value);
        }

        grid.rows.push(parsedRow);
        grid.metadata.updated = new Date().toISOString();
        grid.metadata.dataVersion++;
        grid.metadata.totalRows = grid.rows.length;
        grid.statistics.rowCount = grid.rows.length;
        grid.statistics.cellCount = grid.rows.length * grid.columns.length;

        this.stats.totalRows++;
        this.stats.totalCells += grid.columns.length;

        this.emit('rowAdded', {
            gridId,
            rowIndex: grid.rows.length - 1,
            rowData: parsedRow
        });

        return true;
    }

    deleteRow(gridId, rowIndex) {
        const grid = this.grids.get(gridId);
        if (!grid) return false;

        if (rowIndex < 0 || rowIndex >= grid.rows.length) {
            return false;
        }

        const removed = grid.rows.splice(rowIndex, 1)[0];
        grid.metadata.updated = new Date().toISOString();
        grid.metadata.dataVersion++;
        grid.metadata.totalRows = grid.rows.length;
        grid.statistics.rowCount = grid.rows.length;
        grid.statistics.cellCount = grid.rows.length * grid.columns.length;

        this.stats.totalRows--;
        this.stats.totalCells -= grid.columns.length;

        this.emit('rowDeleted', {
            gridId,
            rowIndex,
            rowData: removed
        });

        return true;
    }

    // ==========================================
    // SORTING
    // ==========================================

    sort(gridId, field, direction = 'ascending') {
        const grid = this.grids.get(gridId);
        if (!grid) return false;

        const column = grid.columns.find(c => c.field === field);
        if (!column) return false;

        if (!column.sortable) {
            throw new Error(`Column ${field} is not sortable`);
        }

        const strategy = this.sortStrategies[direction] || this.sortStrategies.ascending;
        const compare = column.sort || strategy.compare;

        grid.rows.sort((a, b) => {
            const valueA = a[field];
            const valueB = b[field];
            return compare(valueA, valueB);
        });

        grid.state.sort = { field, direction };
        grid.metadata.updated = new Date().toISOString();

        this.emit('gridSorted', {
            gridId,
            field,
            direction
        });

        return true;
    }

    // ==========================================
    // FILTERING
    // ==========================================

    filter(gridId, filters) {
        const grid = this.grids.get(gridId);
        if (!grid) return false;

        // Apply filters
        const filteredRows = grid.rows.filter(row => {
            for (const filter of filters) {
                const column = grid.columns.find(c => c.field === filter.field);
                if (!column) continue;

                const value = row[filter.field];
                const operator = this.filterOperators[filter.operator];
                if (!operator) continue;

                if (!operator.apply(value, filter.value)) {
                    return false;
                }
            }
            return true;
        });

        // Store filtered rows
        grid.filteredRows = filteredRows;
        grid.state.filters = filters;
        grid.metadata.updated = new Date().toISOString();

        this.emit('gridFiltered', {
            gridId,
            filters,
            originalCount: grid.rows.length,
            filteredCount: filteredRows.length
        });

        return true;
    }

    // ==========================================
    // GROUPING
    // ==========================================

    group(gridId, fields) {
        const grid = this.grids.get(gridId);
        if (!grid) return false;

        // Group rows
        const groups = {};
        for (const row of grid.rows) {
            const key = fields.map(f => row[f]).join('|');
            if (!groups[key]) {
                groups[key] = {
                    key,
                    fields: fields.map(f => ({ field: f, value: row[f] })),
                    rows: []
                };
            }
            groups[key].rows.push(row);
        }

        grid.groups = groups;
        grid.state.groups = fields;
        grid.metadata.updated = new Date().toISOString();

        this.emit('gridGrouped', {
            gridId,
            fields,
            groupCount: Object.keys(groups).length
        });

        return true;
    }

    // ==========================================
    // PAGINATION
    // ==========================================

    paginate(gridId, page, pageSize) {
        const grid = this.grids.get(gridId);
        if (!grid) return false;

        const rows = grid.filteredRows || grid.rows;
        const total = rows.length;
        const totalPages = Math.ceil(total / pageSize);

        if (page < 1 || page > totalPages) {
            return false;
        }

        const start = (page - 1) * pageSize;
        const end = Math.min(start + pageSize, total);
        const pageRows = rows.slice(start, end);

        grid.pageRows = pageRows;
        grid.state.page = page;
        grid.state.pageSize = pageSize;
        grid.metadata.updated = new Date().toISOString();

        this.emit('gridPaginated', {
            gridId,
            page,
            pageSize,
            total,
            totalPages,
            start,
            end,
            count: pageRows.length
        });

        return true;
    }

    // ==========================================
    // SELECTION
    // ==========================================

    selectRow(gridId, rowIndex, selected = true) {
        const grid = this.grids.get(gridId);
        if (!grid) return false;

        const index = grid.state.selected.indexOf(rowIndex);
        if (selected && index === -1) {
            grid.state.selected.push(rowIndex);
        } else if (!selected && index !== -1) {
            grid.state.selected.splice(index, 1);
        }

        this.emit('rowSelected', {
            gridId,
            rowIndex,
            selected,
            selection: grid.state.selected
        });

        return true;
    }

    selectAll(gridId, selected = true) {
        const grid = this.grids.get(gridId);
        if (!grid) return false;

        if (selected) {
            grid.state.selected = grid.rows.map((_, i) => i);
        } else {
            grid.state.selected = [];
        }

        this.emit('selectionChanged', {
            gridId,
            selected,
            selection: grid.state.selected
        });

        return true;
    }

    // ==========================================
    // EXPORT
    // ==========================================

    exportToCSV(gridId, options = {}) {
        const grid = this.grids.get(gridId);
        if (!grid) return null;

        const rows = grid.filteredRows || grid.rows;
        const columns = grid.columns.filter(c => !c.hidden);

        // Generate CSV header
        let csv = columns.map(c => `"${c.name}"`).join(',') + '\n';

        // Generate rows
        for (const row of rows) {
            const values = columns.map(c => {
                const value = row[c.field];
                const formatted = c.format(value);
                return `"${String(formatted).replace(/"/g, '""')}"`;
            });
            csv += values.join(',') + '\n';
        }

        return csv;
    }

    exportToJSON(gridId, options = {}) {
        const grid = this.grids.get(gridId);
        if (!grid) return null;

        const rows = grid.filteredRows || grid.rows;
        const columns = grid.columns.filter(c => !c.hidden);

        const data = rows.map(row => {
            const obj = {};
            for (const column of columns) {
                const value = row[column.field];
                obj[column.field] = column.format(value);
            }
            return obj;
        });

        return JSON.stringify(data, null, 2);
    }

    exportToXLSX(gridId, options = {}) {
        // This would require a library like xlsx
        // For now, return CSV as fallback
        return this.exportToCSV(gridId, options);
    }

    // ==========================================
    // AGGREGATION
    // ==========================================

    aggregate(gridId, field, functionName) {
        const grid = this.grids.get(gridId);
        if (!grid) return null;

        const column = grid.columns.find(c => c.field === field);
        if (!column) return null;

        const rows = grid.filteredRows || grid.rows;
        const values = rows.map(row => row[field]);

        const aggFunction = this.aggregationFunctions[functionName];
        if (!aggFunction) return null;

        const result = aggFunction.apply(values);

        this.emit('gridAggregated', {
            gridId,
            field,
            function: functionName,
            result
        });

        return result;
    }

    // ==========================================
    // VALIDATION
    // ==========================================

    validateConfig(config) {
        const errors = [];
        const warnings = [];

        if (!config) {
            errors.push('Config is required');
            return { success: false, errors, warnings };
        }

        if (config.columns && !Array.isArray(config.columns)) {
            errors.push('Columns must be an array');
        }

        if (config.data && !Array.isArray(config.data)) {
            errors.push('Data must be an array');
        }

        if (config.columns) {
            for (let i = 0; i < config.columns.length; i++) {
                const column = config.columns[i];
                if (!column.field && !column.id) {
                    errors.push(`Column at index ${i} missing field or id`);
                }
            }
        }

        return { success: errors.length === 0, errors, warnings };
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    calculateDataSize(data) {
        try {
            return new Blob([JSON.stringify(data)]).size;
        } catch {
            return 0;
        }
    }

    naturalCompare(a, b) {
        const chunk = /(\d+)|(\D+)/g;
        const aChunks = a.match(chunk) || [];
        const bChunks = b.match(chunk) || [];

        for (let i = 0; i < Math.min(aChunks.length, bChunks.length); i++) {
            const aChunk = aChunks[i];
            const bChunk = bChunks[i];

            const aNum = parseInt(aChunk, 10);
            const bNum = parseInt(bChunk, 10);

            if (!isNaN(aNum) && !isNaN(bNum)) {
                if (aNum !== bNum) return aNum - bNum;
            } else {
                const comparison = aChunk.localeCompare(bChunk);
                if (comparison !== 0) return comparison;
            }
        }

        return aChunks.length - bChunks.length;
    }

    generateId() {
        this.idCounter++;
        return 'grid_' + Date.now() + '_' + this.idCounter + '_' + 
               Math.random().toString(36).substr(2, 6);
    }

    generateCacheKey(config) {
        const components = [
            JSON.stringify(config.columns || []),
            JSON.stringify(config.data || []),
            config.name || ''
        ];
        return 'grid_' + this.hash(components.join('|'));
    }

    hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
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
    // LOGGING
    // ==========================================

    log(message) {
        if (this.config.enableLogging) {
            const timestamp = new Date().toISOString();
            console.log(`[GridBuilder] ${timestamp} - ${message}`);
        }
    }

    // ==========================================
    // SERIALIZATION
    // ==========================================

    toJSON() {
        return {
            version: '2.0.0',
            stats: this.stats,
            config: this.config,
            grids: Array.from(this.grids.entries()).map(([id, grid]) => ({
                id,
                ...grid
            }))
        };
    }

    static fromJSON(data) {
        const builder = new GridBuilder(data.config);
        builder.stats = data.stats || builder.stats;
        if (data.grids) {
            for (const gridData of data.grids) {
                const { id, ...grid } = gridData;
                builder.grids.set(id, grid);
            }
        }
        return builder;
    }

    // ==========================================
    // SHUTDOWN
    // ==========================================

    shutdown() {
        this.isShuttingDown = true;
        this.grids.clear();
        this.activeGrids.clear();
        this.gridHistory = [];
        this.cache.clear();
        this.queue = [];
        this.log('🛑 GridBuilder shutdown complete');
    }
}
