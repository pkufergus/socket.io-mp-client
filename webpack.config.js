const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const merge = require('webpack-merge');

const baseConfig = {
    entry: {
        index: path.resolve(__dirname, 'src/index'),
    },
    output: {
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'commonjs2',
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: false,
        }),
        new webpack.NormalModuleReplacementPlugin(/^engine.io-client$/, 'engine.io-mp-client'),
    ],
};

// 只打包socket.io-client
const commonJsConfig = merge(baseConfig, {
    output: {
        filename: 'index.js',
    },
    externals: [
        (context, request, callback) => {
            if (/^socket\.io-client$/.test(request)) {
                return callback();
            }
            if (/^[^/\\]*$/.test(request)) {
                return callback(null, `commonjs ${request}`);
            }
            callback();
        },
    ],
    plugins: [
        new Visualizer({
            filename: './statistics/commonJs.html',
        }),
    ],
});

// 单文件打包配置
const singleConfig = merge(baseConfig, {
    output: {
        filename: 'socket.io-mp.js',
    },
    resolve: {
        alias: {
            debug: path.resolve(path.join(__dirname, 'node_modules', 'debug')),
        },
    },
    plugins: [
        new Visualizer({
            filename: './statistics/single.html',
        }),
    ],
});


module.exports = [commonJsConfig, singleConfig];
