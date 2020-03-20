# 脚手架生成工具

## 设计思路
* step 1: download from https://github.com/shuvigoss/weapp-starter
* step 2: unzip and copy to process dir (命令行执行目录)
* step 3: filter replace by underscore tempalte [underscore](https://underscorejs.bootcss.com/#template)


`weapp-start -> local temp dir -> copy to current dir -> replace by template` 

## 本地安装
``` bash
#安装依赖
npm install 
#安装本地
npm link
#执行命令,可查看帮助
bjcacli --help

#删除命令
npm rm --global bjcacli

Usage: bjcacli [options]

Options:
  -v, --version             output the version number
  -u, --url <download url>  下载地址 (default: "https://codeload.github.com/shuvigoss/weapp-starter/zip/master")
  -n, --projectName <name>  工程名称
  -h, --help                display help for command
```

TODO:发布到npm registry