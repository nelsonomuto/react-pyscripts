const _ = require('lodash');
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {
    config,
    production,
    getLessLoaderConfig,
    CopyPlugin,
    ImagePathResolverPlugin,
    PolyfillPlugin
} = require('./webpack.config.template.js')('./', webpack, _, path, CleanWebpackPlugin);

config.entry = {
    'hotel-details': path.resolve(__dirname, './app/hotel-details.js')
};
const sassThreadLoader = require('thread-loader');

sassThreadLoader.warmup({ workerParallelJobs: 2 }, [
    'sass-loader',
    'postcss-loader',
    'css-loader',
    'style-loader',
    'babel-loader'
]);
const extractPlugins = [];
const extractPluginsRules = [];

config.output.publicPath = '/hotel/assets/ui-hotel-details';
config.plugins = config.plugins.concat([
    new CleanWebpackPlugin(['public'], {
        root: path.resolve(__dirname),
        verbose: true,
        dry: false
    }),
    /* eslint-disable */
    ... !production ? [] : [new UglifyJSPlugin({ // only uglify in production, uglify is slow, no need for this in development even though it happens in parallel which ameliorates the pain
        parallel: true
    })],

    new ImagePathResolverPlugin(),

    ... production ? extractPlugins : [], // use inline css in development for debugging & speed

    new CopyPlugin([
        {
            from: path.resolve(__dirname, 'images'),
            to: [
                path.resolve(__dirname, 'public/images')
            ]
        }
    ]),
    /* eslint-enable */
    new CopyPlugin([
        {
            from: path.resolve(
                __dirname,
                'node_modules/ui-legacy-common/style-guide/app/lib/icons/dist/fonts'
            ),
            to: [path.resolve(__dirname, 'public/lib/icons/dist/fonts')]
        },
        {
            // TODO: Deprecate, will be part of core styles
            from: path.resolve(
                __dirname,
                'node_modules/ui-legacy-common/web/public/stylesheets/lib'
            ),
            to: [path.resolve(__dirname, 'public/stylesheets/lib')]
        }
    ])
]);

config.module.rules = config.module.rules.concat([
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        include: [path.resolve(__dirname, './app')],
        use: [
            {
                loader: 'thread-loader',
                options: {
                    workerParallelJobs: 2
                }
            },
            {
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'env']
                }
            }
        ]
    },
    {
        test: /\.txt$|\.handlebars$/,
        use: 'raw-loader'
    },
    ...(production ? extractPluginsRules : []) // only used in production mode
]);

config.resolve.alias = _.extend(config.resolve.alias, {
    app: path.resolve(__dirname, 'app')
});

module.exports = config;
