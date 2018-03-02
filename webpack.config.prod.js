const path = require('path')
const ROOT_PATH = path.resolve(__dirname);
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {

    entry: {
        bundle: "./app/index",
        vendor: ["axios", "lodash", "react", "react-dom"]
    },

    output: {
        path: path.resolve(__dirname, './build/js'),
   	    filename: 'bundle.[chunkhash:5].js',
        chunkFilename: `[name].ensure.[chunkhash:5].js`,
        publicPath: '/js/'
  	},

    // externals: {
    //     'react':'React',
    //     'react-dom': 'ReactDOM'
    // },

    plugins: [
        // delete build/js folder
        new CleanWebpackPlugin(path.resolve(__dirname, './build/js')),
        // Scope hosting
        new webpack.optimize.ModuleConcatenationPlugin(),
        // global name
        new webpack.ProvidePlugin({
            React:"react",
            ReactDOM:"react-dom",
            axios:'axios',
            _:'lodash'
        }),
        // 代码中区分开发、生产环境
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
        }),
        // 压缩代码
        new webpack.optimize.UglifyJsPlugin({
            comments: false,        //去掉注释
            compress: {
                warnings: false
            }
        }),
        // 提供公共代码vendor
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: '[name].[chunkhash:5].js',
            minChunks: Infinity,
        }),
        new HtmlWebpackPlugin({
            title:'supermind',
            filename: "../../views/index.html",
            template: "./template.html",
            chunks: ['bundle', 'vendor'],
            showErrors:true,
        })
    ],

    resolve: {
	    extensions: [".js", ".json", ".jsx", ".css"],
        alias: {
            'app_component': ROOT_PATH + "/app/component",
            'actions': ROOT_PATH + "/app/actions",
            'app_api': ROOT_PATH + "/app/api"
        }
    },

    module: {
    	rules:[
      	    {
                test: /\.(jsx|js)$/,
                use: [
                    {
                        loader:'babel-loader',
                        options:{
                            presets: ['react', 'es2015','stage-0'],
                            cacheDirectory: true,
                            plugins: [
                                "transform-decorators-legacy",    //es7 decorators
                                "transform-runtime",
                                [
                                    "import",
                                    {
                                        "libraryName": "antd",
                                        "style": true,
                                    }
                                ]
                            ]
                        }
                    }
                ],
                exclude:/node_modules/,
    		},
            {
                test: /\.bundle\.js$/,
                use: {
                    loader: 'bundle-loader',
                    options: {
                        name: 'my-chunk'
                    }
                }
            },
    		{
                test: /\.(less|css)$/,
                exclude: /^node_modules$/,
                include: [ROOT_PATH],
                use: ['style-loader','css-loader','less-loader']
    		},
	        {
	            test: /\.(jpg|png)$/,
	            use: ['url-loader']
	        }
  		],
    }
};
