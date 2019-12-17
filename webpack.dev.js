'use strict';
//开发环境 webpack 配置
const path = require('path');
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
                chunks: [pageName],
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
        filename:'[name].js'
    },
    stats: { children: false },
    mode:'development',
    module:{
        rules:[
            {
                test:/.js$/,
                use:'babel-loader'
            },
            {
                test:/.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/.less$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test:/.(png|jpg|jpeg|gif)$/,
                use:[
                    'file-loader',
                ]
            },
            // {
            //     test:/.(png|jpg|jpeg|gif)$/,
            //     use:[
            //         {
            //             loader:'url-loader',
            //             options:{
            //                 limit:10240,
            //             }
            //         }
            //     ]
            // }
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
    plugins:[
        new CleanWebpackPlugin()
    ].concat(htmlWebpackPlugins),
    //wds 热更新 内容是放在内存中的
    devServer:{
        contentBase:'./dist',
        hot:true
    },
    devtool:'source-map',
}