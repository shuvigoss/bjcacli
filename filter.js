'use strict'

const walk = require('walk')
const fs = require('fs')
const path = require('path')
const __ = require('underscore')
const utils = require('./utils')


const _filter = (_path, _params) => {
    walk.walk(_path, { followLinks: false })
        .on('file', function (root, stat, next) {
            const file = path.join(root, stat.name)
            fs.readFile(file, 'UTF-8', (err, content) => {
                if (err) return
                try {
                    const compiled = __.template(content)
                    const replaced = compiled(_params)

                    fs.writeFile(file, replaced, 'UTF-8', (err) => { if (err) console.log(err) })
                } catch (err) {
                    if (err) utils.error(err)
                }

            })
            next()
        })
        .on('end', function () {
            console.log('finish');
        });
}

module.exports = (_path, _params) => {
    _filter(_path, _params)
}
