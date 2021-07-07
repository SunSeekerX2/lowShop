const code = require('../../utils/code'),
    mysql = require('../../utils/mysql'),
    jwt = require('../../utils/jwt');

//访问记录
accessLog: function accessLog(headers) {
    if (headers) {
        const sqlobj = {
            sql: 'INSERT INTO `webapp_access_log`(`host`, `origin`, `userAgent`, `accept`, `referer`) VALUES (?, ?, ?, ?, ?)',
            params: [
                headers.host,
                headers.origin,
                headers['user-agent'],
                headers.accept,
                headers.referer
            ]
        }
		
        mysql.query(sqlobj)
            .then(data => {
            }, err => {
                console.log('记录访问日志失败', 'time：' + util.dateFormat(new Date(), '"yyyy-MM-dd hh:mm:ss"') + ' 原因：' + err)
            })
    }
}

class Index {
    // Hello,World
    static index(req, res) {
        res.json({code: code.success, message: code.successMsg, data: 'Hello, Wrold'})
    }
    // Login
    static login(req, res) {
        if (req.body.userPhone && req.body.userPwd) {
            const [userPhone, userPwd] = [req.body.userPhone, req.body.userPwd],
                sqlObj = {
                    sql: 'SELECT * FROM `webapp_user` WHERE userPhone = ? AND userPwd = ?',
                    params: [userPhone, userPwd]
                }
            mysql.query(sqlObj)
                .then(data => {
                        if (data.length === 1) {
                            //登陆成功，生成token
                            const id = data[0].id,
                                userRelName = data[0].userRelName,
                                userGroup = data[0].userGroup,
                                oldToken = data[0].token,
                                token = jwt.getToken(id, userPhone, new Date())// 存在输入用户名和密码的数据，生成token返回

                            if(oldToken){
                                // 检查oldtoken是否过期
                                jwt.checkToken(oldToken, 'webapp_user', checkTokenRes => {
                                    if (checkTokenRes) {
                                        // 旧的token未过期
                                        res.json({
                                            code: code.success, message: code.success,
                                            userInfo: {
                                                id,
                                                token: oldToken,
                                                userPhone,
                                                userRelName,
                                                userGroup
                                            }
                                        })
                                    } else {
                                        // 旧的token已过期, 把token存入数据库
                                        mysql.query({sql: 'UPDATE `webapp_user` SET token = ? WHERE id = ?', params: [token, id]})
                                            .then(data => {
                                                // console.log(res)
                                                // 登录成功，返回token
                                                res.json({
                                                    code: code.success, message: code.success,
                                                    userInfo: {
                                                        id,
                                                        token,
                                                        userPhone,
                                                        userRelName,
                                                        userGroup
                                                    }
                                                })
                                            }, err => {
                                                res.json({code: code.execSqlFail, message: code.execSqlFailMsg}) //execSql fail
                                            })
                                    }
                                })
                            }else{
                                // 不存在token
                                mysql.query({sql: 'UPDATE `webapp_user` SET token = ? WHERE id = ?', params: [token, id]})
                                    .then(data => {
                                        // console.log(res)
                                        // 登录成功，返回token
                                        res.json({
                                            code: code.success, message: code.success,
                                            userInfo: {
                                                id,
                                                token,
                                                userPhone,
                                                userRelName,
                                                userGroup
                                            }
                                        })
                                    }, err => {
                                        res.json({code: code.execSqlFail, message: code.execSqlFailMsg}) //execSql fail
                                    })
                            }

                        } else {
                            res.json({code: code.fail, message: 'This user does not exist'}) //This user does not exist
                        }
                    },
                    err => {
                        res.json({code: code.execSqlFail, message: code.execSqlFailMsg}) //execSql fail
                    })
        } else {
            res.json({
                code: code.missingParam,
                message: '缺少参数'
            })
        }
    }

    static getIndexGoods(req, res) {
        let limit = 6,
            page = limit * req.query.page,
            type = req.query.type,
            sqlObj = {
                sql: 'SELECT id,goodsName,goodsPrice,indexImg FROM webapp_goods WHERE goodsStatus = ? AND goodsPrice > 0 LIMIT ?,?',
                params: ['显示', page, limit]
            }
        if (type === '1') {//免费送
            sqlObj = {
                sql: 'SELECT id,goodsName,goodsPrice,indexImg FROM webapp_goods WHERE goodsStatus = ? AND goodsPrice = 0 LIMIT ?,?',
                params: ['显示', page, limit]
            }
        } else if (type === '2') {//已售出
            sqlObj = {
                sql: 'SELECT id,goodsName,goodsPrice,indexImg FROM webapp_goods WHERE goodsStatus = ? LIMIT ?,?',
                params: ['下架', page, limit]
            }
        }

        mysql.query(sqlObj)
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].goodsPrice <= 0) {
                        //data.splice(i, 1)
                        //console.log(data[i]);
                    }
                }
                res.json({code: code.success, message: code.successMsg, data: {goodsList: data}})//request success
            }, err => {
                res.status(500).json({code: code.fail, message: code.execSqlFailMsg, err: err.message}) //execSql fail
            })
    }

    static getGoodsDetails(req, res) {
        if (req.query.id) {
            const sqlObj = {
                sql: 'SELECT * FROM webapp_goods WHERE id = ?',
                params: [req.query.id]
            }
            mysql.query(sqlObj)
                .then(data => {
                    res.json({code: code.success, message: code.successMsg, data}) //request success
                }, err => {
                    res.json({code: code.execSqlFail, message: code.execSqlFailMsg, err: err}) //execSql fail
                })
        } else {
            //缺少id
            res.json({code: code.missingParam, message: code.missingParamMsg, err: err}) //missing param
        }
    }

    static getNotice(req, res) {
        const sqlObj = {
            sql: 'SELECT id,noticeTitle,noticeContent,DATE_FORMAT(createTime,"%Y-%m-%d %T") as createTime FROM `webapp_notice`'
        }
        mysql.query(sqlObj)
            .then(data => {
                res.json({code: code.success, message: code.successMsg, data}) //request success
            }, err => {
                res.json({code: code.execSqlFail, message: code.execSqlFailMsg, err: err}) //execSql fail
            })
    }
}

const v1 = {
    // hello, world
    index(req, res) {
        res.json({code: code.success, message: code.successMsg, data: 'Hello, Wrold'})
    },
    // register
    register(req, res) {
        //暂时关闭注册
        res.json({code: 900, message: 'register off'})
        // let [userRelName, userPhone, userPwd] = [req.body.userRelName, req.body.userPhone, req.body.userPwd]
        // if(userPhone && userPwd){
        //     let sqlObj = {
        //         sql: 'SELECT COUNT(*) FROM `webapp_user` WHERE `userPhone` = ?',
        //         params: [userPhone]
        //     }
        //     //判断用户是否已经存在
        //     mysql.query(sqlObj)
        //         .then(data => {
        //             if(data[0]['COUNT(*)'] === 0){
        //                 //用户不存在
        //                 sqlObj = {sql: 'INSERT INTO `ssx_lowshop`.`webapp_user`(`userRelName`, `userPhone`, `userPwd`, `userGroup`) VALUES (?, ?, ?, ?)', params:[userRelName, userPhone, userPwd, 'user']}
        //                 mysql.query(sqlObj)
        //                     .then(data => {
        //                         res.json({code: code.success, message: message.success, data })
        //                     }, err => {
        //                         res.json({code: code.execSqlFail, message: message.execSqlFail, err})
        //                     })
        //             }else{
        //                 return res.json({code: code.userExist, message: message.userExist})
        //             }
        //         }, err => {
        //             res.json({code: code.execSqlFail, message: message.execSqlFail, err})
        //         })
        //
        // }else{
        //     res.json({
        //         code: code.missingParam,
        //         message: message.missingParam
        //     })
        // }
    },
    // login
    login(req, res) {
        if (req.body.userPhone && req.body.userPwd) {
            const [userPhone, userPwd] = [req.body.userPhone, req.body.userPwd],
                sqlObj = {
                    sql: 'SELECT * FROM `webapp_user` WHERE userPhone = ? AND userPwd = ?',
                    params: [userPhone, userPwd]
                }
            mysql.query(sqlObj)
                .then(data => {
                        if (data.length === 1) {
                            //登陆成功，生成token
                            const id = data[0].id,
                                userRelName = data[0].userRelName,
                                userGroup = data[0].userGroup,
                                oldToken = data[0].token,
                                token = jwt.getToken(id, userPhone, new Date())// 存在输入用户名和密码的数据，生成token返回

                            if(oldToken){
                                // 检查oldtoken是否过期
                                jwt.checkToken(oldToken, 'webapp_user', checkTokenRes => {
                                    if (checkTokenRes) {
                                        // 旧的token未过期
                                        res.json({
                                            code: code.success, message: code.success,
                                            userInfo: {
                                                id,
                                                token: oldToken,
                                                userPhone,
                                                userRelName,
                                                userGroup
                                            }
                                        })
                                    } else {
                                        // 旧的token已过期, 把token存入数据库
                                        mysql.query({sql: 'UPDATE `webapp_user` SET token = ? WHERE id = ?', params: [token, id]})
                                            .then(data => {
                                                // console.log(res)
                                                // 登录成功，返回token
                                                res.json({
                                                    code: code.success, message: code.success,
                                                    userInfo: {
                                                        id,
                                                        token,
                                                        userPhone,
                                                        userRelName,
                                                        userGroup
                                                    }
                                                })
                                            }, err => {
                                                res.json({code: code.execSqlFail, message: code.execSqlFailMsg}) //execSql fail
                                            })
                                    }
                                })
                            }else{
                                // 不存在token
                                mysql.query({sql: 'UPDATE `webapp_user` SET token = ? WHERE id = ?', params: [token, id]})
                                    .then(data => {
                                        // console.log(res)
                                        // 登录成功，返回token
                                        res.json({
                                            code: code.success, message: code.success,
                                            userInfo: {
                                                id,
                                                token,
                                                userPhone,
                                                userRelName,
                                                userGroup
                                            }
                                        })
                                    }, err => {
                                        res.json({code: code.execSqlFail, message: code.execSqlFailMsg}) //execSql fail
                                    })
                            }

                        } else {
                            res.json({code: code.fail, message: 'This user does not exist'}) //This user does not exist
                        }
                    },
                    err => {
                        res.json({code: code.execSqlFail, message: code.execSqlFailMsg}) //execSql fail
                    })
        } else {
            res.json({
                code: code.missingParam,
                message: '缺少参数'
            })
        }
    },
    // 首页商品
    getIndexGoods(req, res) {
        let limit = 6,
            page = limit * req.query.page,
            type = req.query.type,
            sqlObj = {
                sql: 'SELECT id,goodsName,goodsPrice,indexImg FROM webapp_goods WHERE goodsStatus = ? AND goodsPrice > 0 LIMIT ?,?',
                params: ['显示', page, limit]
            }
        if (type === '1') {//免费送
            sqlObj = {
                sql: 'SELECT id,goodsName,goodsPrice,indexImg FROM webapp_goods WHERE goodsStatus = ? AND goodsPrice = 0 LIMIT ?,?',
                params: ['显示', page, limit]
            }
        } else if (type === '2') {//已售出
            sqlObj = {
                sql: 'SELECT id,goodsName,goodsPrice,indexImg FROM webapp_goods WHERE goodsStatus = ? LIMIT ?,?',
                params: ['下架', page, limit]
            }
        }

        mysql.query(sqlObj)
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].goodsPrice <= 0) {
                        //data.splice(i, 1)
                        //console.log(data[i]);
                    }
                }
                res.json({code: code.success, message: code.successMsg, data: {goodsList: data}})//request success
            }, err => {
                res.status(500).json({code: code.fail, message: code.execSqlFailMsg, err: err.message}) //execSql fail
            })
    },
    // 商品详情
    getGoodsDetails(req, res) {
        if (req.query.id) {
            const sqlObj = {
                sql: 'SELECT * FROM webapp_goods WHERE id = ?',
                params: [req.query.id]
            }
            mysql.query(sqlObj)
                .then(data => {
                    res.json({code: code.success, message: code.successMsg, data}) //request success
                }, err => {
                    res.json({code: code.execSqlFail, message: code.execSqlFailMsg, err: err}) //execSql fail
                })
        } else {
            //缺少id
            res.json({code: code.missingParam, message: code.missingParamMsg, err: err}) //missing param
        }
    },
    // 通知
    getNotice(req, res) {
        const sqlObj = {
            sql: 'SELECT id,noticeTitle,noticeContent,DATE_FORMAT(createTime,"%Y-%m-%d %T") as createTime FROM `webapp_notice`'
        }
        mysql.query(sqlObj)
            .then(data => {
                res.json({code: code.success, message: code.successMsg, data}) //request success
            }, err => {
                res.json({code: code.execSqlFail, message: code.execSqlFailMsg, err: err}) //execSql fail
            })
    },
}


module.exports = v1
