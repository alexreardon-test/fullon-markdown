const path = require('path');
const validate = require('webpack-validator');
const webpack = require('webpack');

const isDebug = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8080;

const appEntries = [
    './src/entry',
];

const devEntries = [
    `webpack-dev-server/client?http://0.0.0.0:${port}`, // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
];

const productionPlugins = [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
        output: {
            comments: false,
        },
    }),
    // let libraries know to run in production mode
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
    }),
];

const devPlugins = [new webpack.HotModuleReplacementPlugin()];

console.log('debug mode', isDebug);

module.exports = validate({
    devServer: {
        port,
    },
    entry: {
        app: isDebug ? devEntries.concat(appEntries) : appEntries,
    },
    devtool: isDebug ? 'cheap-module-eval-source-map' : undefined,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                },
                exclude: /node_modules/,
            },
            {
                test: /\.md$/,
                loader: 'raw',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.(?:svg|png|jpg)$/,
                loader: 'url-loader?name=build/[name].[ext]&limit=10000',
            },
        ],
    },
    plugins: isDebug ? devPlugins : productionPlugins,
});
