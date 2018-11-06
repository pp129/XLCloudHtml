const path = require("path");
const HtmlwebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ROOT_PATH = path.resolve(__dirname, "src");
const TEM_PATH = path.resolve(ROOT_PATH, "html");
const APP_PATH = path.resolve(ROOT_PATH, "js");
module.exports = {
    devtool: "#source-map",
    entry: {
        // cmsLogin: [APP_PATH + "/login.js"],
        // cms: ['babel-polyfill',APP_PATH + "/cms.js"],
        cms: [APP_PATH + "/cms.js"],
        map: [APP_PATH + "/map.js"],
        login: [APP_PATH + "/login.js"],
        vendor: [
            "vue/dist/vue.common.js",
            "vue-router",
            "moment",
            "lodash" ,
            "jquery" ,
            "querystring" ,
            "url"
        ],
        element: ["element-ui"]
    },
    resolve: {
        alias: {
            vue: "vue/dist/vue.common.js"
        }
    },
    module: {
        rules: [
            {
                test: /\.vue/,
                use: ["vue-loader"]
            },
            {
                test: /\.(js|jsx)$/,
                enforce: "pre",
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.(doc)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            conf: path.resolve(__dirname, './src/config/config')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendor", "element", "manifest"],
            minChunks: Infinity
        }),
        new HtmlwebpackPlugin({
            title: "cms",
            template: path.resolve(TEM_PATH, "cms.html"),
            filename: "index.html",
            chunks: ["cms", "vendor", "manifest", "element"],
            inject: "body"
        }),
        new HtmlwebpackPlugin({
            template: path.resolve(TEM_PATH, "login.html"),
            filename: "login.html",
            chunks: ["login", "vendor", "manifest", "element"],
            inject: "body"
        }),
        new HtmlwebpackPlugin({
            template: path.resolve(TEM_PATH, "map.html"),
            filename: "map.html",
            chunks: ["map", "vendor", "manifest", "element"],
            inject: "body"
        })
    ]
};
