// ============================================
// PYTHON HANDLER
// Complete Python File Processing
// ============================================

export default class PythonHandler {
    constructor() {
        // ==========================================
        // PYTHON PATTERNS
        // ==========================================
        this.patterns = {
            // Comments
            singleLineComment: /#.*$/gm,
            docstring: /"""[\s\S]*?"""|'''[\s\S]*?'''/g,
            
            // Strings
            string: /['"]([^'"]*)['"]/g,
            fString: /f['"]([^'"]*)['"]/g,
            rawString: /r['"]([^'"]*)['"]/g,
            bytesString: /b['"]([^'"]*)['"]/g,
            
            // Functions
            function: /\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
            asyncFunction: /\basync\s+def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
            lambda: /\blambda\s+[^:]*:/g,
            
            // Classes
            class: /\bclass\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:\([^)]*\))?\s*:/g,
            
            // Decorators
            decorator: /@([a-zA-Z_][a-zA-Z0-9_\.]*)/g,
            
            // Imports
            import: /\bimport\s+([a-zA-Z_][a-zA-Z0-9_\.]*)/g,
            importFrom: /\bfrom\s+([a-zA-Z_][a-zA-Z0-9_\.]*)\s+import\s+([^#\n]*)/g,
            importAs: /\bimport\s+([a-zA-Z_][a-zA-Z0-9_\.]*)\s+as\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,
            
            // Variables
            variable: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*/g,
            global: /\bglobal\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,
            nonlocal: /\bnonlocal\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,
            
            // Control flow
            ifStatement: /\bif\s+([^:]*):/g,
            elifStatement: /\belif\s+([^:]*):/g,
            elseStatement: /\belse\s*:/g,
            forStatement: /\bfor\s+([^:]*):/g,
            whileStatement: /\bwhile\s+([^:]*):/g,
            tryStatement: /\btry\s*:/g,
            exceptStatement: /\bexcept\s+([^:]*):/g,
            finallyStatement: /\bfinally\s*:/g,
            withStatement: /\bwith\s+([^:]*):/g,
            
            // Context managers
            with: /\bwith\s+([^:]*):/g,
            
            // Exceptions
            raise: /\braise\s+([^#\n]*)/g,
            assert: /\bassert\s+([^#\n]*)/g,
            
            // Yield
            yield: /\byield\s+/g,
            
            // Return
            return: /\breturn\s+/g,
            
            // Type hints
            typeHint: /:\s*([a-zA-Z_][a-zA-Z0-9_\[\]\,\.\s]*)/g,
            arrow: /->\s*([a-zA-Z_][a-zA-Z0-9_\[\]\,\.\s]*)/g,
            
            // Async/Await
            async: /\basync\b/g,
            await: /\bawait\b/g,
            
            // Magic methods
            magicMethod: /__[a-zA-Z_]+__/g,
            
            // Dunder variables
            dunder: /__[a-zA-Z_]+__/g,
            
            // Builtins
            builtin: /\b(print|len|type|str|int|float|bool|list|dict|set|tuple|range|enumerate|zip|map|filter|sum|min|max|sorted|reversed|open|close|read|write|input|exit)\b/g,
            
            // Decorators common
            property: /@property/g,
            staticmethod: /@staticmethod/g,
            classmethod: /@classmethod/g,
            abstractmethod: /@abstractmethod/g,
            
            // Special patterns
            mainGuard: /if\s+__name__\s*==\s*["']__main__["']/g,
            self: /\bself\b/g,
            cls: /\bcls\b/g,
            super: /\bsuper\(\)/g,
            
            // Package management
            requirements: /-r\s+requirements\.txt/g,
            
            // Exception types
            exception: /\b(ValueError|TypeError|KeyError|IndexError|AttributeError|NameError|ImportError|IOError|OSError|RuntimeError|Exception|BaseException)\b/g,
            
            // Logging
            logging: /\b(logging\.(debug|info|warning|error|critical))\b/g,
            
            // Testing
            test: /\b(unittest|pytest|test_|assertEqual|assertTrue|assertFalse)\b/g
        };
        
        // ==========================================
        // PYTHON FRAMEWORKS
        // ==========================================
        this.frameworks = {
            django: {
                patterns: [/django\./, /models\.Model/, /class\s+.*\(models\.Model\)/, /urlpatterns/, /settings\.py/],
                name: 'Django'
            },
            flask: {
                patterns: [/flask\./, /@app\.route/, /Flask\(__name__\)/],
                name: 'Flask'
            },
            fastapi: {
                patterns: [/fastapi\./, /@app\.get/, /@app\.post/, /APIRouter/],
                name: 'FastAPI'
            },
            pyramid: {
                patterns: [/pyramid\./, /@view_config/, /config\.add_route/],
                name: 'Pyramid'
            },
            tornado: {
                patterns: [/tornado\./, /Application/, /RequestHandler/],
                name: 'Tornado'
            },
            sqlalchemy: {
                patterns: [/sqlalchemy\./, /Column\(/, /Table\(/, /MetaData/],
                name: 'SQLAlchemy'
            },
            pandas: {
                patterns: [/pandas\./, /pd\./, /DataFrame/, /Series/],
                name: 'Pandas'
            },
            numpy: {
                patterns: [/numpy\./, /np\./, /array\(/, /ndarray/],
                name: 'NumPy'
            },
            matplotlib: {
                patterns: [/matplotlib\./, /plt\./, /pyplot/, /plot\(/],
                name: 'Matplotlib'
            },
            scikit: {
                patterns: [/sklearn\./, /fit\(/, /predict\(/, /train_test_split/],
                name: 'Scikit-learn'
            },
            tensorflow: {
                patterns: [/tensorflow\./, /tf\./, /keras\./, /models\./],
                name: 'TensorFlow'
            },
            pytorch: {
                patterns: [/torch\./, /nn\./, /optim\./, /DataLoader/],
                name: 'PyTorch'
            }
        };
        
        // ==========================================
        // PYTHON LIBRARIES
        // ==========================================
        this.libraries = {
            standard: ['os', 'sys', 'json', 're', 'math', 'random', 'datetime', 'time', 'collections', 
                      'itertools', 'functools', 'threading', 'multiprocessing', 'subprocess', 'socket', 
                      'http', 'urllib', 'email', 'xml', 'csv', 'sqlite3', 'hashlib', 'hmac', 'logging', 
                      'argparse', 'configparser', 'pathlib', 'shutil', 'tempfile', 'glob', 'pickle', 
                      'struct', 'base64', 'binascii', 'zlib', 'gzip', 'zipfile', 'tarfile'],
            web: ['requests', 'urllib3', 'httpx', 'aiohttp', 'beautifulsoup4', 'scrapy', 'selenium'],
            database: ['psycopg2', 'mysqlclient', 'pymongo', 'redis', 'sqlalchemy', 'peewee', 'django.db'],
            science: ['numpy', 'pandas', 'scipy', 'matplotlib', 'seaborn', 'plotly', 'scikit-learn', 
                     'tensorflow', 'pytorch', 'keras', 'jupyter'],
            testing: ['pytest', 'unittest', 'mock', 'coverage', 'flake8', 'pylint', 'black', 'mypy'],
            async: ['asyncio', 'aiohttp', 'asyncpg', 'aioredis', 'aiofiles'],
            image: ['PIL', 'pillow', 'opencv-python', 'scikit-image'],
            ml: ['xgboost', 'lightgbm', 'catboost', 'transformers', 'openai']
        };
        
        // ==========================================
        // PYTHON KEYWORDS
        // ==========================================
        this.keywords = [
            'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
            'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global',
            'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
            'try', 'while', 'with', 'yield'
        ];
    }

    // ==========================================
    // MAIN ANALYSIS
    // ==========================================
    analyze(content, filename) {
        const analysis = {
            type: 'python',
            name: filename,
            lines: content.split('\n').length,
            characters: content.length,
            timestamp: new Date().toISOString(),
            
            // Structure
            structure: this.analyzeStructure(content),
            functions: this.analyzeFunctions(content),
            classes: this.analyzeClasses(content),
            imports: this.analyzeImports(content),
            
            // Code quality
            quality: this.analyzeQuality(content),
            
            // Frameworks & Libraries
            frameworks: this.detectFrameworks(content),
            libraries: this.detectLibraries(content),
            
            // Style
            style: this.analyzeStyle(content),
            
            // Complexity
            complexity: this.calculateComplexity(content),
            
            // Security
            security: this.analyzeSecurity(content),
            
            // Preview
            preview: this.getPreview(content, 200)
        };
        
        // Calculate score
        analysis.score = this.calculateScore(analysis);
        
        return analysis;
    }

    // ==========================================
    // STRUCTURE ANALYSIS
    // ==========================================
    analyzeStructure(content) {
        const structure = {
            hasMainGuard: this.patterns.mainGuard.test(content),
            hasDocstring: this.patterns.docstring.test(content),
            hasTypeHints: this.patterns.typeHint.test(content),
            hasAsync: this.patterns.async.test(content),
            hasDecorators: this.patterns.decorator.test(content),
            indentStyle: this.detectIndentStyle(content),
            lineCount: content.split('\n').length,
            blankLines: (content.match(/^\s*$/gm) || []).length
        };
        
        return structure;
    }

    // ==========================================
    // FUNCTION ANALYSIS
    // ==========================================
    analyzeFunctions(content) {
        const functions = {
            total: 0,
            async: 0,
            methods: 0,
            static: 0,
            classmethods: 0,
            lambdas: 0,
            names: [],
            withDecorators: 0,
            withTypeHints: 0,
            withDocstrings: 0
        };

        // Count functions
        const funcMatches = content.match(this.patterns.function) || [];
        functions.total = funcMatches.length;
        functions.names = funcMatches.map(f => f.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)/)[1]);

        // Async functions
        const asyncMatches = content.match(this.patterns.asyncFunction) || [];
        functions.async = asyncMatches.length;

        // Lambdas
        const lambdaMatches = content.match(this.patterns.lambda) || [];
        functions.lambdas = lambdaMatches.length;

        // Decorators
        const decoratorMatches = content.match(this.patterns.decorator) || [];
        functions.withDecorators = decoratorMatches.length;

        // Type hints
        const typeHintMatches = content.match(this.patterns.typeHint) || [];
        functions.withTypeHints = typeHintMatches.length;

        // Docstrings
        const docstringMatches = content.match(this.patterns.docstring) || [];
        functions.withDocstrings = docstringMatches.length;

        // Static methods
        const staticMatches = content.match(this.patterns.staticmethod) || [];
        functions.static = staticMatches.length;

        // Class methods
        const classMatches = content.match(this.patterns.classmethod) || [];
        functions.classmethods = classMatches.length;

        return functions;
    }

    // ==========================================
    // CLASS ANALYSIS
    // ==========================================
    analyzeClasses(content) {
        const classes = {
            total: 0,
            names: [],
            withInheritance: 0,
            withDecorators: 0,
            withMethods: 0,
            withProperties: 0,
            withSlots: 0,
            withMetaclass: 0
        };

        const classMatches = content.match(this.patterns.class) || [];
        classes.total = classMatches.length;

        for (const match of classMatches) {
            const nameMatch = match.match(/class\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
            if (nameMatch) classes.names.push(nameMatch[1]);

            if (match.includes('(')) classes.withInheritance++;
        }

        // Check for decorators on classes
        const decoratorMatches = content.match(/@[a-zA-Z_]+\s+class/g) || [];
        classes.withDecorators = decoratorMatches.length;

        // Check for @property
        const propertyMatches = content.match(this.patterns.property) || [];
        classes.withProperties = propertyMatches.length > 0;

        // Check for __slots__
        if (content.includes('__slots__')) classes.withSlots++;

        // Check for metaclass
        if (content.includes('__metaclass__') || content.includes('metaclass=')) {
            classes.withMetaclass++;
        }

        return classes;
    }

    // ==========================================
    // IMPORT ANALYSIS
    // ==========================================
    analyzeImports(content) {
        const imports = {
            standard: [],
            thirdParty: [],
            local: [],
            from: [],
            alias: [],
            total: 0
        };

        // Standard imports
        const importMatches = content.match(this.patterns.import) || [];
        for (const match of importMatches) {
            const parts = match.match(/import\s+([a-zA-Z_][a-zA-Z0-9_\.]*)/);
            if (parts) {
                const module = parts[1];
                if (module.startsWith('.')) {
                    imports.local.push(module);
                } else if (this.isStandardLibrary(module)) {
                    imports.standard.push(module);
                } else {
                    imports.thirdParty.push(module);
                }
                imports.total++;
            }
        }

        // From imports
        const fromMatches = content.match(this.patterns.importFrom) || [];
        for (const match of fromMatches) {
            const parts = match.match(/from\s+([a-zA-Z_][a-zA-Z0-9_\.]*)\s+import\s+([^#\n]*)/);
            if (parts) {
                const module = parts[1];
                const items = parts[2].split(',').map(i => i.trim());
                
                if (module.startsWith('.')) {
                    imports.local.push(module);
                } else if (this.isStandardLibrary(module)) {
                    imports.standard.push(module);
                } else {
                    imports.thirdParty.push(module);
                }
                imports.from.push({ module, items });
                imports.total++;
            }
        }

        // Import as
        const asMatches = content.match(this.patterns.importAs) || [];
        for (const match of asMatches) {
            const parts = match.match(/import\s+([a-zA-Z_][a-zA-Z0-9_\.]*)\s+as\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
            if (parts) {
                imports.alias.push({ original: parts[1], alias: parts[2] });
            }
        }

        // Remove duplicates
        imports.standard = [...new Set(imports.standard)];
        imports.thirdParty = [...new Set(imports.thirdParty)];
        imports.local = [...new Set(imports.local)];

        return imports;
    }

    // ==========================================
    // QUALITY ANALYSIS
    // ==========================================
    analyzeQuality(content) {
        const issues = [];
        let score = 100;
        const lines = content.split('\n');

        // Check for long lines
        const longLines = lines.filter(l => l.length > 100).length;
        if (longLines > lines.length * 0.1) {
            issues.push(`Many long lines (>100 chars) - ${longLines} of ${lines.length}`);
            score -= 5;
        }

        // Check for trailing whitespace
        const trailingWhitespace = lines.filter(l => l.match(/\s+$/)).length;
        if (trailingWhitespace > 5) {
            issues.push('Trailing whitespace detected');
            score -= 3;
        }

        // Check for missing docstrings
        const hasDocstring = this.patterns.docstring.test(content);
        if (!hasDocstring) {
            issues.push('No docstrings found - consider adding documentation');
            score -= 5;
        }

        // Check for TODO comments
        const todos = (content.match(/#\s*TODO/g) || []).length;
        if (todos > 0) {
            issues.push(`${todos} TODO comments found`);
            score -= 2;
        }

        // Check for FIXME comments
        const fixmes = (content.match(/#\s*FIXME/g) || []).length;
        if (fixmes > 0) {
            issues.push(`${fixmes} FIXME comments found`);
            score -= 2;
        }

        // Check for unused imports (simplified)
        const imports = content.match(this.patterns.import) || [];
        const usedImports = imports.filter(i => {
            const parts = i.match(/import\s+([a-zA-Z_][a-zA-Z0-9_\.]*)/);
            return parts && content.includes(parts[1]);
        });
        if (imports.length > usedImports.length + 2) {
            issues.push('Potential unused imports detected');
            score -= 5;
        }

        // Check for bare except
        if (content.includes('except:')) {
            issues.push('Bare except found - use specific exceptions');
            score -= 5;
        }

        // Check for magic numbers
        const numbers = content.match(/\b\d+\b/g) || [];
        if (numbers.length > 10) {
            issues.push('Magic numbers detected - consider using constants');
            score -= 3;
        }

        // Check for commented code
        const commentedCode = content.match(/#\s*def\s+|#\s*class\s+|#\s*if\s+|#\s*for\s+|#\s*while\s+/g) || [];
        if (commentedCode.length > 0) {
            issues.push(`Commented code detected (${commentedCode.length} lines)`);
            score -= 5;
        }

        return {
            issues: issues,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: issues.length > 0
        };
    }

    // ==========================================
    // STYLE ANALYSIS
    // ==========================================
    analyzeStyle(content) {
        const style = {
            indentStyle: this.detectIndentStyle(content),
            lineEnding: this.detectLineEnding(content),
            maxLineLength: this.getMaxLineLength(content),
            averageLineLength: this.getAverageLineLength(content),
            hasTrailingCommas: content.includes(',\n'),
            hasSpacesAfterComma: /,\s+/.test(content),
            hasSpacesAroundOperators: /[a-zA-Z]\s*=\s*[a-zA-Z]/.test(content)
        };

        return style;
    }

    // ==========================================
    // SECURITY ANALYSIS
    // ==========================================
    analyzeSecurity(content) {
        const issues = [];
        let score = 100;

        // Check for eval
        if (content.includes('eval(')) {
            issues.push('eval() detected - potential security risk');
            score -= 15;
        }

        // Check for exec
        if (content.includes('exec(')) {
            issues.push('exec() detected - potential security risk');
            score -= 15;
        }

        // Check for subprocess
        if (content.includes('subprocess.') || content.includes('os.system(')) {
            issues.push('Subprocess calls detected - potential security risk');
            score -= 10;
        }

        // Check for pickle
        if (content.includes('pickle.load') || content.includes('pickle.dump')) {
            issues.push('Pickle usage detected - potential security risk');
            score -= 10;
        }

        // Check for insecure deserialization
        if (content.includes('yaml.load(') || content.includes('json.loads(')) {
            issues.push('Insecure deserialization detected - use safe loaders');
            score -= 5;
        }

        // Check for SQL injection patterns
        if (content.includes('execute(') && content.includes('+') && content.includes('"')) {
            issues.push('Potential SQL injection - use parameterized queries');
            score -= 10;
        }

        // Check for hardcoded secrets
        const secretPatterns = [
            /password\s*=\s*['"][^'"]+['"]/i,
            /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
            /token\s*=\s*['"][^'"]+['"]/i,
            /secret\s*=\s*['"][^'"]+['"]/i
        ];
        for (const pattern of secretPatterns) {
            if (pattern.test(content)) {
                issues.push('Potential hardcoded secret detected');
                score -= 15;
                break;
            }
        }

        return {
            issues: issues,
            score: Math.max(0, Math.min(100, score)),
            hasIssues: issues.length > 0
        };
    }

    // ==========================================
    // FRAMEWORK DETECTION
    // ==========================================
    detectFrameworks(content) {
        const detected = [];

        for (const [key, framework] of Object.entries(this.frameworks)) {
            let matches = 0;
            for (const pattern of framework.patterns) {
                if (pattern.test(content)) {
                    matches++;
                }
                pattern.lastIndex = 0;
            }
            if (matches > 0) {
                detected.push({
                    name: framework.name,
                    confidence: Math.min(100, (matches / framework.patterns.length) * 100)
                });
            }
        }

        return detected;
    }

    // ==========================================
    // LIBRARY DETECTION
    // ==========================================
    detectLibraries(content) {
        const detected = [];

        // Check imports for known libraries
        const imports = content.match(this.patterns.import) || [];
        const fromImports = content.match(this.patterns.importFrom) || [];

        for (const category of ['standard', 'web', 'database', 'science', 'testing', 'async', 'image', 'ml']) {
            for (const lib of this.libraries[category]) {
                const importPattern = new RegExp(`\\b${lib}\\b`);
                const found = imports.some(i => importPattern.test(i)) ||
                             fromImports.some(i => importPattern.test(i));
                if (found) {
                    detected.push({
                        name: lib,
                        category: category
                    });
                }
            }
        }

        return detected;
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================
    
    detectIndentStyle(content) {
        const lines = content.split('\n');
        let spaces = 0;
        let tabs = 0;
        
        for (const line of lines) {
            if (line.startsWith(' ')) {
                spaces++;
            } else if (line.startsWith('\t')) {
                tabs++;
            }
        }
        
        if (spaces > tabs) return 'spaces';
        if (tabs > spaces) return 'tabs';
        return 'mixed';
    }

    detectLineEnding(content) {
        if (content.includes('\r\n')) return 'CRLF';
        if (content.includes('\n')) return 'LF';
        return 'unknown';
    }

    getMaxLineLength(content) {
        const lines = content.split('\n');
        let max = 0;
        for (const line of lines) {
            max = Math.max(max, line.length);
        }
        return max;
    }

    getAverageLineLength(content) {
        const lines = content.split('\n');
        const total = lines.reduce((sum, line) => sum + line.length, 0);
        return Math.round(total / lines.length);
    }

    isStandardLibrary(module) {
        const standardLibs = [
            'os', 'sys', 'json', 're', 'math', 'random', 'datetime', 'time', 'collections',
            'itertools', 'functools', 'threading', 'multiprocessing', 'subprocess', 'socket',
            'http', 'urllib', 'email', 'xml', 'csv', 'sqlite3', 'hashlib', 'hmac', 'logging',
            'argparse', 'configparser', 'pathlib', 'shutil', 'tempfile', 'glob', 'pickle',
            'struct', 'base64', 'binascii', 'zlib', 'gzip', 'zipfile', 'tarfile', 'io',
            'abc', 'bisect', 'calendar', 'cmath', 'contextlib', 'copy', 'curses', 'decimal',
            'difflib', 'dis', 'distutils', 'doctest', 'enum', 'errno', 'fileinput', 'fnmatch',
            'fractions', 'ftplib', 'getopt', 'getpass', 'gettext', 'glob', 'gzip', 'hashlib',
            'heapq', 'hmac', 'html', 'http', 'imaplib', 'imp', 'importlib', 'inspect', 'io',
            'ipaddress', 'itertools', 'json', 'keyword', 'linecache', 'locale', 'logging',
            'lzma', 'mailbox', 'mailcap', 'marshal', 'math', 'mimetypes', 'mmap', 'modulefinder',
            'multiprocessing', 'netrc', 'nis', 'nntplib', 'numbers', 'operator', 'optparse',
            'os', 'pathlib', 'pdb', 'pickle', 'pickletools', 'pipes', 'pkgutil', 'platform',
            'plistlib', 'poplib', 'posix', 'pprint', 'profile', 'pstats', 'pty', 'pwd', 'py_compile',
            'pyclbr', 'pydoc', 'queue', 'quopri', 'random', 're', 'readline', 'reprlib',
            'resource', 'rlcompleter', 'runpy', 'sched', 'secrets', 'select', 'selectors',
            'shelve', 'shlex', 'shutil', 'signal', 'site', 'smtplib', 'sndhdr', 'socket',
            'socketserver', 'spwd', 'sqlite3', 'sre', 'ssl', 'stat', 'statistics', 'string',
            'stringprep', 'struct', 'subprocess', 'sunau', 'symbol', 'symtable', 'sys', 'sysconfig',
            'syslog', 'tabnanny', 'tarfile', 'telnetlib', 'tempfile', 'termios', 'textwrap',
            'threading', 'time', 'timeit', 'tkinter', 'token', 'tokenize', 'trace', 'traceback',
            'tracemalloc', 'tty', 'turtle', 'types', 'typing', 'unicodedata', 'unittest', 'urllib',
            'uu', 'uuid', 'venv', 'warnings', 'wave', 'weakref', 'webbrowser', 'wsgiref', 'xdrlib',
            'xml', 'xmlrpc', 'zipapp', 'zipfile', 'zipimport', 'zlib'
        ];
        return standardLibs.includes(module);
    }

    getPreview(content, length = 200) {
        let preview = content.replace(this.patterns.docstring, '');
        preview = preview.replace(this.patterns.singleLineComment, '');
        preview = preview.replace(/\s+/g, ' ').trim();
        if (preview.length <= length) return preview;
        return preview.slice(0, length) + '...';
    }

    calculateScore(analysis) {
        let score = 100;
        
        // Quality penalties
        if (analysis.quality.hasIssues) {
            score -= analysis.quality.issues.length * 2;
        }
        
        // Security penalties
        if (analysis.security.hasIssues) {
            score -= analysis.security.issues.length * 3;
        }
        
        // Add bonuses
        if (analysis.structure.hasDocstring) score += 5;
        if (analysis.structure.hasTypeHints) score += 3;
        if (analysis.structure.hasMainGuard) score += 3;
        if (analysis.structure.hasAsync) score += 2;
        if (analysis.functions.withDocstrings > 0) score += 3;
        if (analysis.classes.total > 0) score += 2;
        if (analysis.imports.standard.length > 0) score += 2;
        
        // Deduct for style issues
        if (analysis.style.indentStyle === 'mixed') score -= 5;
        if (analysis.style.maxLineLength > 120) score -= 3;
        if (!analysis.style.hasSpacesAfterComma) score -= 2;
        
        return Math.max(0, Math.min(100, score));
    }

    calculateComplexity(content) {
        const factors = {
            lines: content.split('\n').length,
            functions: (content.match(this.patterns.function) || []).length,
            classes: (content.match(this.patterns.class) || []).length,
            imports: (content.match(this.patterns.import) || []).length,
            decorators: (content.match(this.patterns.decorator) || []).length,
            controlFlow: (content.match(/\b(if|elif|else|for|while|try|except|finally|with)\b/g) || []).length
        };
        
        let complexity = 0;
        if (factors.lines > 50) complexity += 10;
        if (factors.lines > 200) complexity += 20;
        if (factors.lines > 500) complexity += 30;
        if (factors.functions > 5) complexity += 10;
        if (factors.functions > 20) complexity += 20;
        if (factors.classes > 2) complexity += 10;
        if (factors.imports > 5) complexity += 10;
        if (factors.decorators > 5) complexity += 10;
        if (factors.controlFlow > 20) complexity += 10;
        
        if (complexity < 30) return 'simple';
        if (complexity < 60) return 'medium';
        if (complexity < 80) return 'complex';
        return 'very-complex';
    }

    // ==========================================
    // EXTRACTION METHODS
    // ==========================================
    
    extractFunctions(content) {
        const functions = [];
        const matches = content.match(this.patterns.function) || [];
        for (const match of matches) {
            const nameMatch = match.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
            if (nameMatch) {
                functions.push({
                    name: nameMatch[1],
                    signature: match,
                    isAsync: false,
                    line: content.substring(0, content.indexOf(match)).split('\n').length
                });
            }
        }
        return functions;
    }

    extractClasses(content) {
        const classes = [];
        const matches = content.match(this.patterns.class) || [];
        for (const match of matches) {
            const nameMatch = match.match(/class\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
            if (nameMatch) {
                classes.push({
                    name: nameMatch[1],
                    inheritance: match.includes('(') ? match.match(/\(([^)]*)\)/)?.[1] || null : null,
                    line: content.substring(0, content.indexOf(match)).split('\n').length
                });
            }
        }
        return classes;
    }

    extractImportsList(content) {
        const imports = [];
        const matches = content.match(this.patterns.import) || [];
        for (const match of matches) {
            const parts = match.match(/import\s+([a-zA-Z_][a-zA-Z0-9_\.]*)/);
            if (parts) imports.push(parts[1]);
        }
        return imports;
    }

    extractDecorators(content) {
        const decorators = [];
        const matches = content.match(this.patterns.decorator) || [];
        for (const match of matches) {
            const name = match.replace('@', '');
            decorators.push(name);
        }
        return decorators;
    }
}

export default PythonHandler;
