'use strict'

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const symbols = require('log-symbols')

const deleteFolderRecursive = (_path) => {
    if (fs.existsSync(_path)) {
        fs.readdirSync(_path).forEach((file, index) => {
            const curPath = path.join(_path, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        })
        fs.rmdirSync(_path);
    }
}

const copyFolderSync = (from, to) => {
    fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element))
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element))
        }
    })
}

const mkdir = (dir) => {
    try {
        fs.mkdirSync(dir);
    } catch (e) {
        if (e.code != "EEXIST") {
            throw e;
        }
    }
}


const copyDir = (src, dest) => {
    mkdir(dest);
    const files = fs.readdirSync(src);
    for (let i = 0; i < files.length; i++) {
        const current = fs.lstatSync(path.join(src, files[i]));
        if (current.isDirectory()) {
            copyDir(path.join(src, files[i]), path.join(dest, files[i]));
        } else if (current.isSymbolicLink()) {
            const symlink = fs.readlinkSync(path.join(src, files[i]));
            fs.symlinkSync(symlink, path.join(dest, files[i]));
        } else {
            copy(path.join(src, files[i]), path.join(dest, files[i]));
        }
    }
}

const copy = (src, dest) => {
    const oldFile = fs.createReadStream(src);
    const newFile = fs.createWriteStream(dest);
    oldFile.pipe(newFile);
}

const info = (str) => {
    console.log(symbols.info, chalk.green(str))
}

const error = (str) => {
    console.log(symbols.error, chalk.red(str))
}

module.exports = {
    deleteFolderRecursive: deleteFolderRecursive,
    copyFolderSync: copyDir,
    info: info,
    error: error
}
