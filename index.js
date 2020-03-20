const program = require('commander');
const download = require('./download')
const utils = require('./utils')
const path = require('path')
const inquirer = require('inquirer');
const filter = require('./filter');

program
    .version('1.0.0', '-v, --version')
    .option('-u, --url <download url>', '下载地址', 'https://codeload.github.com/shuvigoss/weapp-starter/zip/master')
    .requiredOption('-n, --projectName <name>', '工程名称')
    .parse(process.argv)


const question = [{
    type: 'input',
    name: 'appId',
    message: '请输入appId',
    default: ''
}]

const toDownload = (answers) => {
    const params = { ...answers, projectName: program.projectName }
    download(program.url, '')
        .then(p => {
            //注册清理事件
            process.on('exit', () => {
                utils.info(`清除下载文件:${p}`)
                utils.deleteFolderRecursive(p)
            })

            utils.copyFolderSync(path.join(p, 'weapp-starter-master'), path.join(__dirname, program.projectName))
            utils.info(`生成模板工程:${path.join(__dirname, program.projectName)}`)

            filter(path.join(__dirname, program.projectName), params)

        })
        .catch(err => { })
}

inquirer.prompt(question).then(toDownload)

