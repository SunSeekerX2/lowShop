const express = require('express'),
    router = express.Router(),
    index = require('./controllers/common/index'),
    admin = require('./controllers/admin/admin'),
    log = require('./controllers/log'),
    upload = require('./controllers/upload')

router
    /*
    * @name: indexControllers
    * @version: v1
    * */
    .get('/', index.index)                                      // Hello, World
    .post('/api/v1/login', index.login)                         // Login
    .get('/api/v1/goods', index.getIndexGoods)                  // getIndexGoods
    .get('/api/v1/goods_info', index.getGoodsDetails)           // getGoodsDetails
    .get('/api/v1/notices', index.getNotice)                    // getNotice

    /*
    * @name: adminControllers
    * @version: v1
    * */
    .post('/api/v1/admin/good', admin.addGoods)                                         // 管理员添加商品
    .get('/api/v1/admin/publish_goods', admin.getGoodsList)                             // 管理员获取商品列表
    .put('/api/v1/admin/unsale_goods', admin.unSaleGoods)                               // 管理员下架商品
    .delete('/api/v1/admin/good', admin.deleteGoods)                                    // 管理员删除商品
    .post('/api/v1/admin/upload_image', upload.single("file"), admin.uploadImg)         // 管理员上传商品图片

    .get('/api/v1/admin/notices', admin.getNoticeList)                                  // 管理员获取商品列表
    .post('/api/v1/admin/notice', admin.addNotices)                                     // 管理员添加公告
    .delete('/api/v1/admin/notice', admin.deleteNotice)                                 // 管理员删除公告

module.exports = router
