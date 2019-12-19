'use strict';
//生产环境 webpack 配置
const path = require('path'); 
// css 提取为一个文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//css 压缩 需要配合 cssnano 使用
const optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//js 压缩 webpack 内置uglifyjs-webpack-plugin 打包时默认压缩，也可以自行安装 并配置一些信息
//为html文件中引入的外部资源如script、link动态添加每次compile后的hash html压缩
const htmlWebpackPlugin = require('html-webpack-plugin');   //导入插件
const {CleanWebpackPlugin} = require('clean-webpack-plugin');   //导入清理打包目录
//遍历文件目录匹配文件
const glob = require('glob')

const setMPA = () =>{
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname,'./src/*/*.js'));
    Object.keys(entryFiles).map((index) =>{
        const entryFile = entryFiles[index];
        const pageMatch = entryFile.match(/src\/(.*)\/(.*)\.js/);
        const pageName = pageMatch && pageMatch[1];
        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(
            new htmlWebpackPlugin({
                template: path.join(__dirname, `src/${pageName}/${pageName}.html`),
                filename: `${pageName}.html`,
                chunks: ['common',pageName],
                inject: true,
                minify:{
                    html5:true,
                    collapseWhitespace:true,
                    preserveLineBreaks:false,
                    minifyCSS:true,
                    minifyJS:true,
                    removeComments:false,
                }
            })
        )
    })
    console.log(entry);
    return {entry,htmlWebpackPlugins}
}
const {entry,htmlWebpackPlugins} =  setMPA();
module.exports = {
    entry:entry,
    output:{
        path:path.join(__dirname,'dist'),
        filename:'[name]_[chunkhash:8].js'
    },
    mode:'production',
    module:{
        rules:[
            {
                test:/.js$/,
                use:'babel-loader'
            },
            {
                test:/.css$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test:/.less$/,
                use:[
                    //style-loader 把css添加到页面head头部 与MiniCssExtractPlugin功能冲突，如果使用MiniCssExtractPlugin 需要去掉 style-loader 用MiniCssExtractPlugin
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            // {
            //     test:/.(png|jpg|jpeg|gif)$/,
            //     use:[
            //         'file-loader',
            //     ]
            // }
            {
                test:/.(png|jpg|jpeg|gif)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:10240,
                            name:'[name]_[hash:8][ext]'
                        }
                    }
                ]
            }
        ]
    },
    watch:false,//默认为false
    //watch 为true时 watchOptions 配置才有意义
    watchOptions:{
        //不监听的文件或者文件夹，默认为空
        ignored:/node_modules/,
        //监听到变化后等300毫秒在执行，默认300毫秒
        aggregateTimeout:300,
        //判断文件是否发生变化是通过不断轮询系统指定文件有没有变化实现的，默认每秒1000次。
        poll:1000,
    },
    plugins: [
        //MiniCssExtractPlugin 插件把 css提取出为独立的文件，
        new MiniCssExtractPlugin({
          // 类似 webpackOptions.output里面的配置 可以忽略
          filename: '[name]_[contenthash:8].css',
          chunkFilename: '[id].css',
        }),
        new optimizeCssAssetsPlugin({
            assetNameRegExp:/\.css$/g,
            cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
            cssProcessorOptions: { 
            	discardComments: { removeAll: true } 
            },
            canPrint: true //是否将插件信息打印到控制台
        }),
        //通过模板文件生成html并自动添加css js
        new CleanWebpackPlugin(),
    ].concat(htmlWebpackPlugins),
    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                common: {
                    name: "common",
                    chunks: "all",
                    minChunks: 8
                }
            }
        }
    },
    //生产环境不需要代码热更新
    // plugins:[
    //     //webpack.HotModuleReplacementPlugin 没有必要加，官网文档说配置了 hot: true 会自动引入这个 plugin。
    //     //new webapck.HotModuleReplacementPlugin()
    // ],
    // //wds 热更新 内容是放在内存中的
    // devServer:{
    //     contentBase:'./dist',
    //     hot:true
    // }
}