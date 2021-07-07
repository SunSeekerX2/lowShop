const code = require('../../utils/code'),
    mysql = require('../../utils/mysql'),
    jwt = require('../../utils/jwt'),
    uploadImg = require('../../utils/tencentCos');//上传到腾讯云cos;

const v1 = {
    // 管理员添加商品
    addGoods(req, res) {
        jwt.checkToken(req.headers.token, 'webapp_user', checkTokenRes => {
            if (checkTokenRes) {
                const goodsName = req.body.goodsName,
                    goodsDesc = req.body.goodsDesc,
                    goodsPrice = req.body.goodsPrice,
                    publisher = req.body.publisher,
                    goodsIndexImage = req.body.goodsIndexImage,
                    goodsDescImage = req.body.goodsDescImage
                if (goodsName, goodsDesc, goodsPrice, publisher, goodsIndexImage, goodsDescImage) {
                    //添加商品记录
                    const sqlObj = {
                        sql: 'INSERT INTO `webapp_goods` (`goodsName`, `goodsDesc`, `goodsPrice`, `publisher`, `indexImg`, `DescImg`, `goodsStatus`) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        params: [goodsName, goodsDesc, goodsPrice, publisher, goodsIndexImage, goodsDescImage, '显示']
                    }
                    mysql.query(sqlObj)
                        .then(data => {
                            res.json({ code: code.success, message: code.successMsg, data: data }) //request success
                        }, err => {
                            res.json({ code: code.fail, message: code.execSqlFailMsg, err: err }) //execSql fail
                        })

                } else {
                    res.json({ code: code.missingParam, message: code.missingParamMsg }) //missing param
                }

            } else {
                res.json({ code: code.noToken, message: code.noTokenMsg }) //check token fail
            }
        })
    },
    // 获取发布的商品列表
    getGoodsList(req, res) {
        jwt.checkToken(req.headers.token, 'webapp_user', checkTokenRes => {
            if (checkTokenRes) {
                const status = req.query.status,
                    sqlobj = {
                        sql: 'SELECT id,goodsName FROM `webapp_goods` WHERE goodsStatus = ?',
                        params: [status]
                    }
                    if(status){
                        //查询已经发布的商品列表
                        mysql.query(sqlobj)
                            .then(data => {
                                res.json({ code: code.success, message: code.successMsg, data }) //request success
                            }, err => {
                                res.json({ code: code.fail, message: code.execSqlFailMsg, err }) //execSql fail
                            })
                    }else{
                        res.json({ code: code.missingParam, message: code.missingParamMsg }) //missing param
                    }

            } else {
                res.json({ code: code.noToken, message: code.noTokenMsg }) //check token fail
            }
        })
    },
    // 下架商品
    unSaleGoods(req, res) {
        jwt.checkToken(req.headers.token, 'webapp_user', checkTokenRes => {
            if (checkTokenRes) {
                const id = req.body.id,
                    sqlObj = {
                        sql: 'UPDATE `webapp_goods` SET `goodsStatus` = ? WHERE `id` = ?',
                        params: ['下架', id]
                    }
                mysql.query(sqlObj)
                    .then(data => {
                        res.json({ code: code.success, message: code.successMsg, data }) //request success
                    }, err => {
                        res.json({ code: code.fail, message: code.execSqlFailMsg, err }) //execSql fail
                    })
            } else {
                res.json({ code: code.noToken, message: code.noTokenMsg }) //check token fail
            }
        })
    },
    // 删除商品
    deleteGoods(req, res) {
        jwt.checkToken(req.headers.token, 'webapp_user', checkTokenRes => {
            if (checkTokenRes) {
                const id = req.body.id,
                    sqlObj = {
                        sql: 'DELETE FROM `webapp_goods` WHERE `id` = ?',
                        params: [id]
                    }
                mysql.query(sqlObj)
                    .then(data => {
                        res.json({ code: code.success, message: code.successMsg, data }) //request success
                    }, err => {
                        res.json({ code: code.execSqlFail, message: code.execSqlFailMsg, err }) //execSql fail
                    })
            } else {
                res.json({ code: code.noToken, message: code.noTokenMsg }) //check token fail
            }
        })
    },
    // 发布公告
    addNotices(req, res) {
        jwt.checkToken(req.headers.token, 'webapp_user', checkTokenRes => {
            if (checkTokenRes) {
                const noticeTitle = req.body.noticeTitle,
                    noticeContent = req.body.noticeContent,
                    publisher = req.body.publisher
                if (noticeTitle, noticeContent, publisher) {
                    //添加公告记录
                    const sqlObj = {
                        sql: 'INSERT INTO `webapp_notice` (`noticeTitle`, `noticeContent`, `publisher`) VALUES (?, ?, ?)',
                        params: [noticeTitle, noticeContent, publisher]
                    }
                    mysql.query(sqlObj)
                        .then(data => {
                            res.json({ code: code.success, message: code.successMsg, data: data }) //request success
                        }, err => {
                            res.json({ code: code.execSqlFail, message: code.execSqlFailMsg, err: err }) //execSql fail
                        })
                } else {
                    res.json({ code: code.missingParam, message: code.missingParamMsg }) //missing param
                }
            } else {
                res.json({ code: code.noToken, message: code.noTokenMsg }) //check token fail
            }
        })
    },
    // 获取发布的公告列表
    getNoticeList(req, res) {
        jwt.checkToken(req.headers.token, 'webapp_user', checkTokenRes => {
            if (checkTokenRes) {
                sqlobj = {
                    sql: 'SELECT id,noticeTitle FROM `webapp_notice`'
                }
                //查询已经发布的公告列表
                mysql.query(sqlobj)
                    .then(data => {
                        res.json({ code: code.success, message: code.success, data }) //request success
                    }, err => {
                        res.json({ code: code.execSqlFail, message: code.execSqlFailMsg, err }) //execSql fail
                    })
            } else {
                res.json({ code: code.noToken, message: code.noTokenMsg }) //check token fail
            }
        })
    },
    // 删除公告
    deleteNotice(req, res) {
        jwt.checkToken(req.headers.token, 'webapp_user', checkTokenRes => {
            if (checkTokenRes) {
                const id = req.body.id,
                    sqlObj = {
                        sql: 'DELETE FROM `webapp_notice` WHERE `id` = ?',
                        params: [id]
                    }
                mysql.query(sqlObj)
                    .then(data => {
                        res.json({ code: code.success, message: code.successMsg, data }) //request success
                    }, err => {
                        res.json({ code: code.execSqlFail, message: code.execSqlFailMsg, err }) //execSql fail
                    })
            } else {
                res.json({ code: code.noToken, message: code.noTokenMsg }) //check token fail
            }
        })
    },
    uploadImg(req, res){
        jwt.checkToken(req.headers.token, 'webapp_user', checkTokenRes => {
            if (checkTokenRes) {
                const path = '../../' + req.file.path.replace(/\\/g, "/"),
                    key = req.file.filename
                // 上传文件到腾讯云COS
                uploadImg(key, path)
                    .then(data => {
                        // 上传图片成功，返回src链接
                        res.json({ code: code.success, data: { src: data.Location }, msg: 'success' })
                    }, err => {
                        res.json({ code: code.fail, data: err, msg: 'upload fail' })
                    })
            } else {
                res.json({ code: code.noToken, msg: 'token无效' })
            }
        })
    },
}

module.exports = v1
