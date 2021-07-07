const multer = require('multer'),//图片上传中间件
    util = require('../utils/util'),//工具模块
    // 图片上传模块
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/images/')
        },
        filename: (req, file, cb) => {
            // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785.jpg
            const date = new Date()

            const fileformat = (file.originalname).split('.');
            cb(null, util.dateFormat(date, 'yyyyMMdd_hhmmss_') + date.getTime() + '.' + fileformat[fileformat.length - 1]);
        }
    }),

    upload = multer({ storage: storage })

module.exports = upload
