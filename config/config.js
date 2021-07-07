/*
* name: 项目全局配置模块
* author：SunSeekerX
* time: 2019年3月17日11点41分
* */

module.exports = {
    //开发api
    //api:'http://127.0.0.1:3000/',
    //api:'http://yoouu.cn:3000/',
    // mysql配置信息
    mysqlConfig:{
        host: 'localhost',
        port: 3306,
        database: 'ssx_lowshop',
        user: 'root',
        password: '12345678900',
        acquireTimeout: 15000, // 连接超时时间
        connectionLimit: 64, // 最大连接数
        waitForConnections: true, // 超过最大连接时排队
        queueLimit: 0, // 排队最大数量(0 代表不做限制)
        multipleStatements: false,// 是否允许执行多条语句
    },
    //腾讯云cos配置信息
    tencentCos:{
        SecretId: 'AKIDkHXw5ySEIKHYyUQodDeqlsyiBPH7l26L',
        SecretKey: 'PZpoX0VlCPNOOTaXTcWAgwtCui06xSO4',
        Bucket: 'sunseekerx-1258290093',
        Region: 'ap-guangzhou',
        file: 'lowShop/'
    },
    //文件上传目录配置，暂时未使用
    upload:{
        goodsIndexImgs: './public/images/goodsIndexImgs',
        goodsDescImgs: './public/images/goodsDescImgs'
    },
    //项目配置
    app: {
        port: 3000,//开发端口
    }
}