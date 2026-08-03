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
// CORS
// ==========================================
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400
}));

// ==========================================
// RATE LIMITING
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
// BODY PARSERS
// ==========================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==========================================
// STATIC FILES
// ==========================================
app.use(express.static(path.join(__dirname, 'dist')));

// ==========================================
// FILE UPLOAD CONFIGURATION - COMPLETE SUPPORT
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

// Get allowed extensions from environment
const getAllowedExtensions = () => {
    const extString = process.env.ALLOWED_EXTENSIONS || 'html,css,js,json,py,sol,xml,txt,md,csv,png,jpg,jpeg,gif,webp,mp3,wav,ogg,mp4,webm,avi,wasm';
    return extString.split(',').map(ext => ext.trim().toLowerCase());
};

const fileFilter = (req, file, cb) => {
    const allowedExtensions = getAllowedExtensions();
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        logger.warn(`Blocked file: ${file.originalname} (extension: ${ext})`);
        cb(new Error(`File type .${ext} not allowed. Supported: ${allowedExtensions.join(', ')}`), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 1073741824 // 1GB default
    },
    fileFilter: fileFilter
});

// ==========================================
= API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
    const allowed = getAllowedExtensions();
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '4.0.0',
        environment: process.env.NODE_ENV || 'development',
        supportedExtensions: allowed,
        extensionCount: allowed.length
    });
});

// Upload Files - Universal Support
app.post('/api/upload', upload.array('files', 500), async (req, res) => {
    try {
        const files = req.files.map(file => {
            const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
            return {
                id: uuidv4(),
                originalName: file.originalname,
                filename: file.filename,
                path: file.path,
                size: file.size,
                mimetype: file.mimetype,
                extension: ext,
                uploadedAt: new Date().toISOString()
            };
        });

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

// Get supported file types
app.get('/api/supported-types', (req, res) => {
    const allowed = getAllowedExtensions();
    res.json({
        success: true,
        extensions: allowed,
        count: allowed.length
    });
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
    const allowed = getAllowedExtensions();
    logger.info(`🚀 Universal Integrator Server running on port ${PORT}`);
    logger.info(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🌐 URL: http://localhost:${PORT}`);
    logger.info(`📂 Supported file types: ${allowed.length}`);
    logger.info(`📋 Extensions: ${allowed.join(', ')}`);
    
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
