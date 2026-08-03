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

// Initialize environment
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// LOGGER CONFIGURATION
// ==========================================
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

// ==========================================
// APP INITIALIZATION
// ==========================================
const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================
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

// ==========================================
= CORS
// ==========================================
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400
}));

// ==========================================
= RATE LIMITING
// ==========================================
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', limiter);

// ==========================================
= BODY PARSERS
// ==========================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==========================================
= STATIC FILES
// ==========================================
app.use(express.static(path.join(__dirname, 'dist')));

// ==========================================
= FILE UPLOAD CONFIGURATION
// ==========================================
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
    const allowedExtensions = (process.env.ALLOWED_EXTENSIONS || 'html,css,js,json,py,sol,xml,txt,md,csv,png,jpg,jpeg,gif,webp,mp3,wav,ogg,mp4,webm,avi,wasm')
        .split(',');
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
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800
    },
    fileFilter: fileFilter
});

// ==========================================
= API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '4.0.0',
        environment: process.env.NODE_ENV || 'development'
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
            uploadedAt: new Date().toISOString()
        }));

        logger.info(`Uploaded ${files.length} files`);
        
        res.json({
            success: true,
            files: files,
            count: files.length
        });
    } catch (error) {
        logger.error('Upload error:', error);
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
        
        // Analysis logic here
        const analysis = {
            success: true,
            results: fileIds.map(id => ({
                id: id,
                type: 'javascript',
                complexity: 'medium',
                elements: 42
            }))
        };
        
        res.json(analysis);
    } catch (error) {
        logger.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Solidity Specific Routes
app.post('/api/solidity/analyze', async (req, res) => {
    try {
        const { content, filename } = req.body;
        
        // Solidity analysis logic
        const analysis = {
            success: true,
            name: filename.replace(/\.sol$/, ''),
            version: '0.8.19',
            contracts: ['MainContract'],
            functions: ['transfer', 'balanceOf'],
            imports: ['@openzeppelin/contracts/token/ERC20/ERC20.sol'],
            securityFeatures: ['require', 'modifiers'],
            gasOptimizations: ['view functions', 'memory usage'],
            complexity: 'medium',
            hasRequire: content.includes('require('),
            hasEmit: content.includes('emit '),
            isAbstract: content.includes('abstract')
        };
        
        res.json(analysis);
    } catch (error) {
        logger.error('Solidity analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/solidity/deploy', async (req, res) => {
    try {
        const { bytecode, abi, network } = req.body;
        
        // Simulate deployment
        const deployment = {
            success: true,
            address: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            transactionHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            network: network || 'mainnet',
            blockNumber: Math.floor(Math.random() * 10000000) + 10000000,
            gasUsed: Math.floor(Math.random() * 1000000) + 100000,
            timestamp: new Date().toISOString()
        };
        
        logger.info(`Deployed contract to ${deployment.address}`);
        
        res.json(deployment);
    } catch (error) {
        logger.error('Deployment error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Integration Routes
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
        
        logger.info(`Created integration: ${integration.name}`);
        
        res.json({
            success: true,
            integration: integration
        });
    } catch (error) {
        logger.error('Integration error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==========================================
= ERROR HANDLING
// ==========================================
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ==========================================
= START SERVER
// ==========================================
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

// ==========================================
= GRACEFUL SHUTDOWN
// ==========================================
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received. Closing server...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received. Closing server...');
    process.exit(0);
});

export default app;
