import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

export default {
    mode: isProduction ? 'production' : 'development',
    entry: {
        app: './js/app.js',
        analyzer: './js/core/analyzer.js',
        integrator: './js/core/integrator.js',
        solidity: './js/core/solidity-analyzer.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
        chunkFilename: isProduction ? 'js/[name].[contenthash].chunk.js' : 'js/[name].chunk.js',
        publicPath: '/',
        clean: true
    },
    resolve: {
        extensions: ['.js', '.json', '.css'],
        alias: {
            '@core': path.resolve(__dirname, 'js/core'),
            '@handlers': path.resolve(__dirname, 'js/handlers'),
            '@ui': path.resolve(__dirname, 'js/ui'),
            '@utils': path.resolve(__dirname, 'js/utils'),
            '@api': path.resolve(__dirname, 'api'),
            '@templates': path.resolve(__dirname, 'templates'),
            '@config': path.resolve(__dirname, 'config'),
            '@': path.resolve(__dirname, 'js')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: false
                        }
                    }
                ]
            },
            // Handle ALL file types as assets
            {
                test: /\.(png|svg|jpg|jpeg|gif|webp|avif|ico|cur|psd|ai|eps|raw)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name].[hash][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg|dfont)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[hash][ext]'
                }
            },
            {
                test: /\.(mp3|wav|flac|aac|ogg|opus|m4a|aiff|wma)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'audio/[name].[hash][ext]'
                }
            },
            {
                test: /\.(mp4|webm|avi|mov|wmv|flv|mkv|ogv|3gp)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'video/[name].[hash][ext]'
                }
            },
            {
                test: /\.(pdf|doc|docx|odt|rtf|xls|xlsx|ppt|pptx)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'documents/[name].[hash][ext]'
                }
            },
            {
                test: /\.(zip|rar|7z|tar|gz|bz2|xz|iso|dmg|pkg|deb|rpm|apk|ipa)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'archives/[name].[hash][ext]'
                }
            },
            {
                test: /\.(exe|msi|dll|so|dylib|sys|drv|app)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'binaries/[name].[hash][ext]'
                }
            },
            {
                test: /\.(sol|vyper|yul|wasm|wast)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'blockchain/[name].[hash][ext]'
                }
            },
            // Everything else
            {
                test: /\.(html|xml|txt|md|log|csv|tsv|sql|conf|cfg|ini|env|reg|plist|manifest|lock)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'data/[name].[hash][ext]'
                }
            }
        ]
    },
    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: isProduction,
                        drop_debugger: isProduction
                    },
                    output: {
                        comments: false
                    }
                },
                extractComments: false
            })
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 10
                },
                core: {
                    test: /[\\/]core[\\/]/,
                    name: 'core',
                    chunks: 'all',
                    priority: 5
                },
                common: {
                    minChunks: 2,
                    name: 'common',
                    chunks: 'all',
                    priority: 1,
                    reuseExistingChunk: true
                }
            }
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            inject: true,
            minify: isProduction ? {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            } : false
        }),
        new MiniCssExtractPlugin({
            filename: isProduction ? 'css/[name].[contenthash].css' : 'css/[name].css',
            chunkFilename: isProduction ? 'css/[name].[contenthash].chunk.css' : 'css/[name].chunk.css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'config', to: 'config' },
                { from: 'templates', to: 'templates' },
                { from: 'data', to: 'data' },
                { from: 'api', to: 'api' },
                { from: 'uploads', to: 'uploads', noErrorOnMissing: true }
            ]
        })
    ],
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                pathRewrite: { '^/api': '' }
            }
        }
    },
    target: 'web',
    stats: {
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }
};
