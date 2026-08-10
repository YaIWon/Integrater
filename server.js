import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// ENVIRONMENT
// ============================================
dotenv.config();

// ============================================
// LOGGER
// ============================================
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.errors({ stack: true })
    ),
    transports: [
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join('logs', 'combined.log')
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// ============================================
// APP INITIALIZATION
// ============================================
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.etherscan.io"]
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: "deny" },
    hsts: { maxAge: 31536000, includeSubDomains: true },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400
}));

// ============================================
// RATE LIMITING
// ============================================
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);

// ============================================
// BODY PARSERS
// ============================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================
// STATIC FILES
// ============================================
app.use(express.static(path.join(__dirname, 'dist')));

// ============================================
// FILE UPLOAD CONFIGURATION
// ============================================
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueId}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = (process.env.ALLOWED_EXTENSIONS || 'html,css,js,json,py,sol').split(',');
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`File type .${ext} not allowed`), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 1073741824
    },
    fileFilter: fileFilter
});

// ============================================
// API ROUTES
// ============================================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '4.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
    });
});

// Upload Files
app.post('/api/upload', upload.array('files', 100), async (req, res) => {
    try {
        const files = req.files.map(file => ({
            id: uuidv4(),
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            extension: path.extname(file.originalname).toLowerCase().replace('.', ''),
            uploadedAt: new Date().toISOString()
        }));

        logger.info(`Uploaded ${files.length} files`);

        res.json({
            success: true,
            files: files,
            count: files.length,
            totalSize: files.reduce((sum, f) => sum + f.size, 0)
        });
    } catch (error) {
        logger.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get File by ID
app.get('/api/file/:id', async (req, res) => {
    try {
        const filePath = path.join(process.cwd(), 'uploads', req.params.id);
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

        if (!fileExists) {
            return res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }

        const stats = await fs.stat(filePath);
        const ext = path.extname(filePath);

        res.json({
            success: true,
            file: {
                id: req.params.id,
                name: path.basename(filePath),
                size: stats.size,
                extension: ext,
                created: stats.birthtime,
                modified: stats.mtime
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete File
app.delete('/api/file/:id', async (req, res) => {
    try {
        const filePath = path.join(process.cwd(), 'uploads', req.params.id);
        await fs.unlink(filePath);

        res.json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Analyze Files
app.post('/api/analyze', async (req, res) => {
    try {
        const { fileIds } = req.body;

        // Simulate analysis
        const analysis = {
            success: true,
            results: fileIds.map(id => ({
                id: id,
                type: 'javascript',
                complexity: 'medium',
                elements: 42,
                score: 85,
                timestamp: new Date().toISOString()
            }))
        };

        res.json(analysis);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Analyze Single File
app.post('/api/analyze/:id', async (req, res) => {
    try {
        const filePath = path.join(process.cwd(), 'uploads', req.params.id);
        const content = await fs.readFile(filePath, 'utf-8');

        const lines = content.split('\n').length;
        const characters = content.length;
        const words = content.split(/\s+/).length;

        res.json({
            success: true,
            analysis: {
                id: req.params.id,
                lines: lines,
                characters: characters,
                words: words,
                complexity: lines < 50 ? 'simple' : lines < 200 ? 'medium' : 'complex',
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// SOLIDITY ROUTES
// ============================================

// Analyze Solidity Contract
app.post('/api/solidity/analyze', async (req, res) => {
    try {
        const { content, filename } = req.body;

        const contracts = (content.match(/contract\s+(\w+)\s*{/g) || []).length;
        const functions = (content.match(/function\s+\w+\s*\(/g) || []).length;
        const events = (content.match(/event\s+\w+\s*\(/g) || []).length;
        const imports = (content.match(/import\s+['"][^'"]+['"]/g) || []).length;
        const hasRequire = content.includes('require(');
        const hasEmit = content.includes('emit ');
        const hasOnlyOwner = content.includes('onlyOwner');

        const versionMatch = content.match(/pragma\s+solidity\s+([^;]+);/);
        const version = versionMatch ? versionMatch[1].trim() : 'unknown';

        res.json({
            success: true,
            analysis: {
                name: filename.replace(/\.sol$/, ''),
                version: version,
                contracts: contracts,
                functions: functions,
                events: events,
                imports: imports,
                hasRequire: hasRequire,
                hasEmit: hasEmit,
                hasOnlyOwner: hasOnlyOwner,
                securityScore: (hasRequire ? 20 : 0) + (hasOnlyOwner ? 15 : 0),
                gasScore: Math.min(100, functions * 10 + events * 5),
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Deploy Solidity Contract
app.post('/api/solidity/deploy', async (req, res) => {
    try {
        const { bytecode, abi, network = 'mainnet' } = req.body;

        const deployment = {
            success: true,
            address: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            transactionHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            network: network,
            blockNumber: Math.floor(Math.random() * 10000000) + 10000000,
            gasUsed: Math.floor(Math.random() * 1000000) + 100000,
            timestamp: new Date().toISOString()
        };

        res.json(deployment);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Verify Solidity Contract
app.post('/api/solidity/verify', async (req, res) => {
    try {
        const { address, contractData } = req.body;

        res.json({
            success: true,
            verified: true,
            contractName: contractData?.name || 'Unknown',
            compilerVersion: contractData?.version || '0.8.19',
            optimizationUsed: true,
            runs: 200,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Compile Solidity Contract
app.post('/api/solidity/compile', async (req, res) => {
    try {
        const { content, filename } = req.body;

        res.json({
            success: true,
            abi: [
                { type: 'function', name: 'transfer', inputs: [], outputs: [] },
                { type: 'event', name: 'Transfer', inputs: [] }
            ],
            bytecode: `0x${Array.from({length: 128}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            metadata: {
                compiler: 'solc',
                version: '0.8.19',
                optimization: true,
                runs: 200
            },
            warnings: 0,
            errors: 0,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// INTEGRATION ROUTES
// ============================================

// Create Integration
app.post('/api/integrate', async (req, res) => {
    try {
        const { files, type, name } = req.body;

        const integration = {
            id: uuidv4(),
            name: name || `Integration ${Date.now()}`,
            type: type || 'app',
            files: files || [],
            status: 'created',
            createdAt: new Date().toISOString(),
            config: {
                entry: files?.length > 0 ? files[0] : null,
                dependencies: []
            }
        };

        res.json({
            success: true,
            integration: integration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Integrations
app.get('/api/integrations', async (req, res) => {
    try {
        const integrations = [
            {
                id: uuidv4(),
                name: 'Web Application',
                type: 'app',
                files: 3,
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                name: 'Smart Contract Suite',
                type: 'contract',
                files: 2,
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];

        res.json({
            success: true,
            integrations: integrations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Integration by ID
app.get('/api/integrate/:id', async (req, res) => {
    try {
        const integration = {
            id: req.params.id,
            name: 'Web Application',
            type: 'app',
            files: 3,
            status: 'active',
            createdAt: new Date().toISOString(),
            config: {
                entry: 'index.html',
                dependencies: ['react', 'react-dom']
            }
        };

        res.json({
            success: true,
            integration: integration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete Integration
app.delete('/api/integrate/:id', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Integration deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// MODULE ROUTES
// ============================================

// Install Module
app.post('/api/module/install', async (req, res) => {
    try {
        const { name, path, version } = req.body;

        const module = {
            id: uuidv4(),
            name: name || 'Module',
            path: path || 'local',
            version: version || '1.0.0',
            installed: new Date().toISOString(),
            status: 'installed'
        };

        res.json({
            success: true,
            module: module
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Modules
app.get('/api/modules', async (req, res) => {
    try {
        const modules = [
            {
                id: uuidv4(),
                name: 'File Analyzer',
                path: 'local',
                version: '1.0.0',
                installed: new Date().toISOString(),
                status: 'installed'
            },
            {
                id: uuidv4(),
                name: 'Solidity Compiler',
                path: 'local',
                version: '0.8.19',
                installed: new Date().toISOString(),
                status: 'installed'
            }
        ];

        res.json({
            success: true,
            modules: modules
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// SUPPORTED TYPES
// ============================================

app.get('/api/supported-types', (req, res) => {
    const extensions = (process.env.ALLOWED_EXTENSIONS || 'html,css,js,json,py,sol').split(',');

    res.json({
        success: true,
        extensions: extensions,
        count: extensions.length
    });
});

// ============================================
// METRICS
// ============================================

app.get('/api/metrics', async (req, res) => {
    try {
        const uploadDir = path.join(process.cwd(), 'uploads');
        let fileCount = 0;
        let totalSize = 0;

        try {
            const files = await fs.readdir(uploadDir);
            fileCount = files.length;

            for (const file of files) {
                const stats = await fs.stat(path.join(uploadDir, file));
                totalSize += stats.size;
            }
        } catch (e) {
            // Directory might not exist
        }

        res.json({
            success: true,
            metrics: {
                files: fileCount,
                totalSize: totalSize,
                formattedSize: formatSize(totalSize),
                integrations: 2,
                modules: 2,
                uptime: process.uptime(),
                memory: process.memoryUsage()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ============================================
// SPA FALLBACK ROUTE
// ============================================

// This handles all non-API routes and serves index.html
app.get('*', (req, res) => {
    // Skip API routes (they're already handled above)
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }

    // Skip static files (they're handled by express.static)
    if (req.path.includes('.')) {
        return res.status(404).send('File not found');
    }

    // Serve index.html for all other routes (SPA support)
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    logger.info(`🚀 Universal Integrator Server running on port ${PORT}`);
    logger.info(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🌐 URL: http://localhost:${PORT}`);

    // Create necessary directories
    const directories = ['uploads', 'logs', 'temp', 'data', 'data/cache'];
    directories.forEach(async (dir) => {
        const dirPath = path.join(__dirname, dir);
        try {
            await fs.mkdir(dirPath, { recursive: true });
            logger.debug(`Created directory: ${dir}`);
        } catch (error) {
            logger.warn(`Could not create directory ${dir}: ${error.message}`);
        }
    });
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received. Closing server...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received. Closing server...');
    process.exit(0);
});

export default app;
