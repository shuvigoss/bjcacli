'use strict'

const path = require('path')
const os = require('os')
const fs = require('fs')
const compressing = require('compressing');
const request = require('request')
const { v4: uuidv4 } = require('uuid')
const utils = require('./utils')
const ora = require('ora');

module.exports = (url, local) => {
    const targetFile = path.join(os.tmpdir(), uuidv4(), 'source')
    const spinner = ora('');
    fs.mkdirSync(path.dirname(targetFile), { recursive: true })

    const downloadFile = (url, pathName) => {
        utils.info(`开始下载模板工程:${url}`)
        spinner.start();
        return new Promise((resolve, reject) => {
            request(url).pipe(fs.createWriteStream(pathName))
                .on('close', () => resolve(pathName))
                .on('error', error => reject(error))
        })
    }


    return new Promise((resolve, reject) => {
        downloadFile(url, targetFile)
            .then(t => {
                utils.info(`下载完成:${t}`)
                spinner.succeed();
                compressing.zip.uncompress(t, path.dirname(t))
                    .then(() => {
                        utils.info(`解压完成:${path.dirname(t)}/weapp-starter-master`)
                        resolve(path.dirname(t))
                    })
                    .catch((err) => {
                        console.error('unzip error', err)
                        reject(err)
                    })
            })
            .catch(err => {
                console.error('download error', err)
                spinner.fail();
                reject(err)
            })

    })
}

