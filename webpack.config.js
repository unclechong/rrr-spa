const path = require('path')
const ROOT_PATH = path.resolve(__dirname);
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
console.log(JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false')));
module.exports = {
    // devtool: 'cheap-module-eval-source-map',
    // entry: ["babel-polyfill", "./app/index"],
    entry:  "./app/index",


    output: {
   	    filename: 'bundle.js',
        chunkFilename: `[name].ensure.js`,
        publicPath:'/'   //DEV SERVER 绝对路径
  	},

    resolve: {
	    extensions: [".js", ".json", ".jsx", ".css"],
        alias: {
        //     'app_images': ROOT_PATH + "/src/resources/"+APP_NAME+"/images",
        //     'app_constants': ROOT_PATH + "/src/constants/index",
        //     'app_common': ROOT_PATH + "/src/common",
            'app_component': ROOT_PATH + "/app/component",
            'actions': ROOT_PATH + "/app/actions",
            'app_api': ROOT_PATH + "/app/api"
        //     'app_css': ROOT_PATH + "/src/resources/"+APP_NAME+"/css",
        }
        //别名key 要加引号，否则不识别
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
                                // "transform-object-assign",        //Object.assign()  polyfill
                                "transform-decorators-legacy",    //es7 decorators
                                // [
                                //     "transform-runtime",
                                //     {
                                //         "helpers": true, // defaults to true;
                                //         "polyfill": true, // defaults to true
                                //         "regenerator": true, // defaults to true
                                //         "moduleName": "babel-runtime"
                                //     }
                                // ],
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
    },

    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.ProvidePlugin({
            React:"react",
            ReactDOM:"react-dom",
            axios:'axios',
            _:'lodash'
        }),
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
        })
    ],

    devServer: {
        inline: true,                                //自动刷新页面 package.json --inline也要配置
        historyApiFallback: true,                    //配置路由后   解决刷新页面后失去路由问题
        hot:true,                                    //这个坑逼hot不能加， 加完不更新后页面不能自动刷新
        progress: true,                              //显示打包进程
        contentBase: './build'
        // colors:true,
        // host:'192.168.1.132',
        // port:'8088'
        // proxy: {
        //      '/api': {
        //          target: 'http://192.168.1.156',
        //          changeOrigin: true,
        //          secure: false
        //      },
             // '/login': {
             //     target: 'http://172.88.65.59',
             //     changeOrigin: true,
             //     secure: false
             // },
             // '/signOut': {
             //     target: 'http://172.88.65.59',
             //     changeOrigin: true,
             //     secure: false
             // }
        // },

        //  headers: { "X-Custom-Header": "yes" },
    }
};
