/*
 * @Author: your name
 * @Date: 2019-12-21 14:33:06
 * @LastEditTime : 2019-12-21 17:37:21
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webPack/.eslintrc.js
 */
 
 module.exports = {
    parser:"babel-eslint",
    env: {
        browser: true,
        node: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        sourceType: 'module'
    },
    rules:{
        'for-direction': 0,
    }
  };
/**
    root 限定配置文件的使用范围
    parser 指定eslint的解析器
    parserOptions 设置解析器选项
    extends 指定eslint规范
    plugins 引用第三方的插件
    env 指定代码运行的宿主环境
    rules 启用额外的规则或覆盖默认的规则
    globals 声明在代码中的自定义全局变量 
 */