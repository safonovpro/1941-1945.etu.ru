const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');

const dirPath = __dirname;

module.exports = {
    mode: 'development',
    entry: {
        script: './js/script.js'
    },
    output: {
        filename: '[name].js',
        path: `${dirPath}/dist`
    },
    devtool: 'source-map',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "style.css" }),
        new CopyWebpackPlugin([{
            from: `${dirPath}/img`,
            to: `${dirPath}/dist/img`
        }]),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            optipng: { optimizationLevel: 9 },
            plugins: [
                imageminMozjpeg({
                    quality: 85,
                    progressive: true
                }),
                imageminPngquant(),
                imageminGifsicle(),
                imageminSvgo()
            ]
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    devServer: {
        contentBase: `${dirPath}/`,
        index: `index.html`,
        publicPath: '/dist/',
        hot: true,
        compress: true,
        port: 9000
    }
};