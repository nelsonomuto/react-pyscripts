require('colors');
const assert = require('assert');
const fs = require('fs-extra');
const debug = require('debug')('webpack-config');

module.exports = function get(buildRoot, webpack, _, path, CleanWebpackPlugin) {
    // depending on -p flag, we'll tweak some settings
    const production = process.argv.indexOf('-p') > -1;
    debug({ buildRoot, production });
    const sourcePath = path.resolve(__dirname, './app');
    const config = {
        // point to the dir your app code is in
        context: path.resolve(buildRoot),

        // entry point to your app
        // it's possible to have multiple entry points (see docs)
        // this is relative to the context dir above
        entry: {},

        output: {
            // where we want to output built files
            path: path.resolve(__dirname, './public'),
            filename: 'resource/js/[name]-bundle.js',
            chunkFilename: 'resource/js/chunk/[name]-chunk.js',
            publicPath: '/hotel/assets/ui-hotel-details' // will be overriden by product
        },

        // in development we want to produce source-maps
        // (see http://webpack.github.io/docs/configuration.html#devtool)
        // TODO: fix error while creating 'source-map' for production
        devtool: production ? false : 'eval',

        // this is to support older versions of jquery
        amd: { jQuery: true },

        watchOptions: {
            poll: 500,
            ignored: [
                /node_modules/,
                path.resolve('node_modules/ui-legacy-common/client/app/lib'),
                path.resolve('node_modules/ui-legacy-common/client/app/lib-legacy')
            ]
        },

        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                'window.$': 'jquery',
                moment: 'moment'
            }),
            new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|ko|ja|zh-cn)$/),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1
            })
        ],

        module: {
            rules: [
                // {
                //     test: /\.(txt|html)$/,
                //     use: 'raw-loader'
                // },
                {
                    test: /\.(woff|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'base64-inline-loader'
                },
                {
                    test: /\.s?css$/, // scss and css | use scss for the new stuff
                    use: [
                        // cache css output for faster rebuilds
                        'cache-loader',
                        {
                            // build css/sass in threads (faster)
                            loader: 'thread-loader',
                            options: {
                                workerParallelJobs: 2
                            }
                        },
                        {
                            loader: 'style-loader' // creates style nodes from JS strings
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                module: true,
                                sourceMap: !production,
                                localIdentName: production
                                    ? '[hash:base64:5]'
                                    : '[path][name]-[local]'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                outputStyle: 'collapsed',
                                sourceMap: true,
                                includePaths: [sourcePath]
                            }
                        }
                    ]
                },
                {
                    test: /\.less$/, // less has our legacy styles
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: !production
                            }
                        },
                        getLessLoaderConfig(path, buildRoot, production)
                    ]
                },
                {
                    test: /markerclusterer/,
                    loaders: ['exports-loader?MarkerClusterer']
                },
                {
                    test: /detectizr/,
                    loaders: ['imports-loader?this=>window,modernizr', 'exports-loader?Detectizr']
                },
                {
                    test: /modernizr/,
                    loaders: ['imports-loader?this=>window', 'exports-loader?Modernizr']
                },
                {
                    test: /backbone\.js/,
                    loaders: ['imports-loader?this=>window,jquery,_=underscore']
                },
                {
                    test: /jquery\.ui\.core/,
                    loaders: ['imports-loader?jquery']
                },
                {
                    test: /jquery\.ui\.widget/,
                    loaders: ['imports-loader?jquery.ui.core']
                },
                {
                    test: /jquery\.ui\.position/,
                    loaders: ['imports-loader?jquery.ui.core']
                },
                {
                    test: /jquery\.ui\.button/,
                    loaders: ['imports-loader?jquery.ui.core,jquery.ui.widget']
                },
                {
                    test: /jquery\.ui\.datepicker/,
                    loaders: ['imports-loader?jquery.ui.core']
                },
                {
                    test: /jquery\.timepicker/,
                    loaders: ['imports-loader?jquery.ui.datepicker']
                },
                {
                    test: /jquery\.ui\.autocomplete\.js/,
                    loaders: ['imports-loader?jquery.ui.core,jquery.ui.widget,jquery.ui.position']
                },
                {
                    test: /jquery\.ui\.mouse/,
                    loaders: ['imports-loader?jquery.ui.widget']
                },
                {
                    test: /jquery\.ui\.slider/,
                    loaders: ['imports-loader?jquery.ui.core,jquery.ui.mouse,jquery.ui.widget']
                },
                {
                    test: /jquery\.ui\.autocomplete\.categorized/,
                    loaders: ['imports-loader?jquery.ui.autocomplete']
                },
                {
                    test: /backbone-localstorage/,
                    loaders: ['imports-loader?this=>window,backbone,_=underscore']
                }
            ]
        },
        resolve: {
            alias: _.extend(jqueryUiShims(), {
                fonts: path.resolve('node_modules/ui-legacy-common/style-guide/app/fonts'),

                // support AMD style tpl! plugin
                // you could similarly adapt any other existing
                // AMD plugin (e.g. text! or css!)
                tpl: 'underscore-template-loader',

                // 'underscore': path.resolve(`node_modules/ui-legacy-common/client/app/lib/underscore/underscore`),
                underscore: path.resolve('./node_modules/underscore/underscore'),
                ladda: path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib/ladda/dist/ladda.min'
                ),
                'spin.js': path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib/ladda/dist/spin.min'
                ),
                spin: path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib/ladda/dist/spin.min'
                ),
                bootstrap: path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib/bootstrap2.3.2/bootstrap/js/bootstrap'
                ),
                backbone: path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib/backbone/backbone'
                ),
                domReady: path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib/domReady/domReady'
                ),
                moment: path.resolve('node_modules/ui-legacy-common/client/app/lib/moment/moment'),
                markerclusterer: path.resolve(
                    'node_modules/ui-legacy-common/web/public/javascripts/lib/markercluster/markerclustererplus_2.1.2'
                ),
                jquery: path.resolve('node_modules/ui-legacy-common/client/app/lib/jquery/jquery'),
                'jquery.ui': path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib/jquery-ui/ui/jquery-ui'
                ),
                'jquery-ui': path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib/jquery-ui/ui/jquery-ui'
                ),
                jqueryui: path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib/jquery-ui/ui/jquery-ui'
                ),
                'jquery-bxslider': path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib-legacy/bxSlider/jquery-bxslider'
                ),
                'backbone-localstorage': path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib-legacy/backbone-localstorage/backbone-localstorage-webpack.js'
                ),
                'Backbone.LocalStorage': path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib-legacy/backbone-localstorage/backbone-localstorage-webpack.js'
                ),
                'Backbone.ModelBinder': path.resolve(
                    'node_modules/ui-legacy-common/web/public/javascripts/lib/Backbone.ModelBinder'
                ),
                hammer: path.resolve(
                    'node_modules/ui-legacy-common/web/public/javascripts/lib/hammer/1.0.5/hammer'
                ),
                'jquery.timepicker': path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib-legacy/jquery-ui/jquery.timepicker'
                ),
                'jquery.ui.autocomplete.categorized': path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib-legacy/jquery-ui/jquery.ui.autocomplete.categorized'
                ),
                'tst-common': path.resolve(
                    'node_modules/ui-legacy-common/client/app/javascripts/TST/common'
                ),
                'tst-common-app-lib': path.resolve('node_modules/ui-legacy-common/client/app/lib'),
                'tst-common-lib': path.resolve(
                    'node_modules/ui-legacy-common/client/app/javascripts/tst-common-lib'
                ),
                common: path.resolve(
                    'node_modules/ui-legacy-common/client/app/javascripts/TST/common/really-old-common'
                ),
                'TST/common': path.resolve(
                    'node_modules/ui-legacy-common/client/app/javascripts/TST/common'
                ),
                'tst-style-guide': path.resolve('node_modules/ui-legacy-common/style-guide'),
                'tst-common-stylesheets': path.resolve(
                    'node_modules/ui-legacy-common/client/app/stylesheets'
                ),
                'tst-core': path.resolve(
                    'node_modules/ui-legacy-common/client/app/stylesheets/tst-core'
                ),
                'bootstrap2.3.2': path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib/bootstrap2.3.2'
                ),
                'TST/hotel': path.resolve(buildRoot, 'app/javascripts/TST/hotel'),
                stylesheets: path.resolve(buildRoot, 'app/stylesheets'),
                availability: path.resolve(buildRoot, 'app/javascripts/availability'),
                view: path.resolve(
                    'node_modules/ui-legacy-common/client/app/javascripts/util/view'
                ),
                events: path.resolve(
                    'node_modules/ui-legacy-common/client/app/javascripts/util/events'
                ),
                'base-view': path.resolve(
                    'node_modules/ui-legacy-common/client/app/javascripts/util/base-view'
                ),
                'html-component': path.resolve(
                    'node_modules/ui-legacy-common/client/app/javascripts/util/html-component'
                ),
                cards: path.resolve('node_modules/ui-legacy-common/client/app/cards'),
                modules: path.resolve('node_modules/ui-legacy-common/client/app/modules'),
                handlebars: path.resolve('node_modules/handlebars/dist/handlebars'),
                text: path.resolve('node_modules/requirejs-text/text'),
                modernizr: path.resolve(
                    'node_modules/ui-legacy-common/web/public/javascripts/modernizr'
                ),
                detectizr: path.resolve(
                    'node_modules/ui-legacy-common/web/public/javascripts/detectizr'
                ),
                selectBoxIt: path.resolve(
                    'node_modules/ui-legacy-common/client/app/lib/selectBoxIt/jquery.selectBoxIt.min.js'
                )
            })
        }
    };

    function getLessLoaderConfig() {
        return {
            loader: 'less-loader', // compiles Less to CSS
            options: {
                relativeUrls: false,
                sourceMap: !production,
                rootpath: path.resolve('./app/stylesheets'),
                paths: [
                    path.resolve('./node_modules'),
                    path.resolve('node_modules/ui-legacy-common/web/public/stylesheets'),
                    path.resolve(buildRoot, './app/stylesheets'),
                    path.resolve('node_modules/ui-legacy-common/client/app/lib'),
                    path.resolve('node_modules/ui-legacy-common/client/app/stylesheets'),
                    path.resolve('node_modules/ui-legacy-common/style-guide/app/stylesheets')
                ]
            }
        };
    }

    function jqueryUiWidgets() {
        return 'jquery.ui.accordion,jquery.ui.autocomplete,jquery.ui.button,jquery.ui.core,jquery.ui.datepicker,jquery.ui.dialog,jquery.ui.draggable,jquery.ui.droppable,jquery.ui.effect-blind,jquery.ui.effect-bounce,jquery.ui.effect-clip,jquery.ui.effect-drop,jquery.ui.effect-explode,jquery.ui.effect-fade,jquery.ui.effect-fold,jquery.ui.effect-highlight,jquery.ui.effect-pulsate,jquery.ui.effect-scale,jquery.ui.effect-shake,jquery.ui.effect-slide,jquery.ui.effect-transfer,jquery.ui.effect,jquery.ui.menu,jquery.ui.mouse,jquery.ui.position,jquery.ui.progressbar,jquery.ui.resizable,jquery.ui.selectable,jquery.ui.slider,jquery.ui.sortable,jquery.ui.spinner,jquery.ui.tabs,jquery.ui.tooltip,jquery.ui.widget'.split(
            ','
        );
    }
    function jqueryUiShims() {
        let shims = {};
        jqueryUiWidgets().map(
            j =>
                (shims[j] = path.resolve(
                    `node_modules/ui-legacy-common/client/app/lib-legacy/jquery-ui/${j}`
                ))
        );
        return shims;
    }
    // BEGIN: webpack custom plugins
    class CopyPlugin {
        constructor(args) {
            this.args = args;
        }
        apply(compiler) {
            const froms = this.args.reduce((sum, value) => [...sum, value.from], []);
            compiler.plugin('done', stats => {
                [...froms].map(p => {
                    try {
                        assert(fs.existsSync(p));
                    } catch (e) {
                        debug('Copy Plugin error fs.existsSync'.red, p);
                        throw e;
                    }
                });
                debug('CopyPlugin this.args <froms> file sources all exist'.magenta);
                [...this.args].map(arg => [...arg.to].map(to => fs.copySync(arg.from, to)));
            });
        }
    }

    class ImagePathResolverPlugin {
        apply(compiler) {
            compiler.plugin('done', stats => {
                [...Object.keys(stats.compilation.assets)].map(a => {
                    const contents = fs
                        .readFileSync(stats.compilation.assets[a].existsAt)
                        .toString();
                    const targets = contents.match(/url\([a-z0-9\.\-\_\"'\/\\]*\)/gi);
                    if (!targets) return;
                    const replacements = [...targets].map(m => process(m));

                    fs.writeFileSync(
                        stats.compilation.assets[a].existsAt,
                        targets.reduce(
                            (sum, value, i) => sum.replace(value, replacements[i]),
                            contents
                        )
                    );
                    function process(url) {
                        // format url(image.png)
                        const matches = url.match(/url\((.*)\)/);
                        if (!matches) return url;
                        const path = matches[1];
                        let pathError = false;
                        if (path === null || path === '') {
                            debug('Alert, path error image resolver'.red, { matches });
                            pathError = true;
                        }
                        let newPath = path.replace(/\"|\\/g, '');
                        try {
                            newPath = pathError
                                ? path
                                : config.output.publicPath +
                                  path.match(/web\/public\/([a-z0-9\.\/\-]*)/i)[1];
                        } catch (e) {
                            debug('Alert, path error'.red);
                        }
                        if (path !== newPath) {
                            debug(stats.compilation.assets[a].existsAt.blue, newPath, path);
                        }
                        // TODO: process new path relative to public image directory
                        return url.replace(path, newPath);
                    }
                });
            });
        }
    }

    class PolyfillPlugin {
        constructor(args) {
            this.args = args;
        }
        apply(compiler) {
            compiler.plugin('done', stats => {
                const polyfills = this.args.reduce(
                    (sum, value) => `${sum}\n${fs.readFileSync(value).toString()}`,
                    ''
                );
                const k = Object.keys(stats.compilation.assets)[0];
                const contents = fs.readFileSync(stats.compilation.assets[k].existsAt).toString();
                fs.writeFileSync(
                    stats.compilation.assets[k].existsAt,
                    addPolyfill(polyfills, contents)
                );
                function addPolyfill(p, c) {
                    return `${p} ${c}`;
                }
            });
        }
    }
    // END: webpack custom plugins

    return {
        production,
        config,
        getLessLoaderConfig,
        CopyPlugin,
        ImagePathResolverPlugin,
        PolyfillPlugin
    };
};
