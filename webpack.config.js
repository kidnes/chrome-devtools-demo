/**
 * @file 配置文件
 */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const pkg = require('./package.json');
const resolve = p => path.resolve(__dirname, p);
const baseManifest = require('./chrome/manifest.json');

module.exports = {
    entry: {
        background: './src/background.ts',
        panel: './src/panel.ts',
        devtools: './src/devtools.ts',
        popup: './src/popup.ts',
        inject: './src/inject.ts',
        content_script: './src/contentScript.ts', // eslint-disable-line
        // san_devtools_backend: './src/backend.ts' // eslint-disable-line
    },
    output: {
        path: resolve('dist'),
        publicPath: '/',
        filename: 'js/[name].js'
    },
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: ['.js', '.json', '.ts']
    },
    plugins: [
        new HtmlWebpackPlugin({
            templateParameters: {
                ...pkg
            },
            template: resolve('template/popup.ejs'),
            filename: 'popup.html',
            chunks: ['popup']
        }),
        new HtmlWebpackPlugin({
            template: resolve('template/default.ejs'),
            filename: 'panel.html',
            chunks: ['panel']
        }),
        new HtmlWebpackPlugin({
            filename: 'devtools.html',
            chunks: ['devtools']
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './icons',
                    to: 'icons'
                }
            ]
        }),
        new WebpackExtensionManifestPlugin({
            config: {
                base: baseManifest,
                extend: {version: pkg.version}
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                '@babel/plugin-proposal-export-default-from',
                                '@babel/plugin-transform-modules-commonjs',
                                '@babel/plugin-proposal-optional-chaining',
                                require.resolve('@babel/plugin-proposal-class-properties')
                            ],
                            presets: [
                                require.resolve('@babel/preset-env'),
                                [require.resolve('@babel/preset-typescript'), {allExtensions: true}]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            rootMode: 'upward'
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: resolve('build-tools/icons-loader.js'),
                include: /node_modules[\\/]@ant-design[\\/]/
            },
            {
                oneOf: [
                    {
                        test: /\.svg$/,
                        resourceQuery: /inline/,
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    limit: 8192
                                }
                            }
                        ]
                    },
                    {
                        test: /\.(eot|woff|woff2|ttf|svg)$/,
                        loader: 'file-loader',
                        options: {
                            limit: 6000,
                            name: 'icons/[name]-[hash:8].[ext]'
                        }
                    },
                    {
                        test: /\.less$/,
                        use: [
                            'style-loader',
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    config: {
                                        path: './postcss.config.js'
                                    }
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    lessOptions: {
                                        // strictMath: true,
                                        javascriptEnabled: true
                                    }
                                }
                            }
                        ]
                    },
                    {
                        test: /\.css$/,
                        use: [
                            'style-loader',
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    config: {
                                        path: './postcss.config.js'
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            mimetype: 'image/png',
                            limit: 6000,
                            name: 'icons/[name]-[hash:8].[ext]',
                            esModule: false
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            esModule: false,
                            minimize: false,
                            attributes: {
                                list: [
                                    {
                                        tag: 'img',
                                        attribute: 'src',
                                        type: 'src'
                                    },
                                    {
                                        tag: 'san-avatar',
                                        attribute: 'src',
                                        type: 'src'
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    }
};
