/*
*  name: 腾讯云cos上传模块
*  author: SunSeekerX
*  time：2019年4月5日16点07分
* */

const fs = require('fs'),
    path = require('path'),
    config = require('../../config/config'),
    COS = require('cos-nodejs-sdk-v5'),
    cos = new COS({
        // 必选参数
        SecretId: config.tencentCos.SecretId,
        SecretKey: config.tencentCos.SecretKey,
        // 可选参数
        FileParallelLimit: 3,    // 控制文件上传并发数
        ChunkParallelLimit: 8,   // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
        ChunkSize: 1024 * 1024 * 8,  // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
        Proxy: '',
    }),

    putObject = async (key, filePath) => {
        return new Promise((resolve, reject) => {
            cos.putObject({
                Bucket: config.tencentCos.Bucket, /* 必须 */ // Bucket 格式：test-1250000000
                Region: config.tencentCos.Region,
                Key: config.tencentCos.file + key, /* 必须 */
                // 格式1. 传入文件内容
                Body: fs.readFileSync(path.resolve(__dirname, filePath)),
                // 格式2. 传入文件流，必须需要传文件大小
                // Body: fs.createReadStream(filepath),
                // ContentLength: fs.statSync(filepath).size
            }, function (err, data) {
                err ? reject(err) : resolve(data)
            });
        })
        // 调用方法

    }

module.exports = putObject
