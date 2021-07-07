/*
* name：接口提示码
* author：SunSeekerX
* time：2019年3月17日11点02分
* */
module.exports = {
    // 全局通用返回码
    success: 200, // 成功
    successMsg: 'Request Success',
    fail: 400, // 失败
    failMsg: 'Bad Request',
    notFound: 404, // 未找到
    notFoundMsg: '404 Not Found',
    // 服务端错误
    serverError: 500,
    serverErrorMsg: 'Internal Server Error',
    // 数据库操作
    execSqlFail: 500,// 执行sql语句失败
    execSqlFailMsg: 'ExecSql fail',

    missingParam: 422,// 缺失参数
    missingParamMsg: 'missing param',
    noToken: 423,// token无效或缺失
    noTokenMsg: 'check token fail',

    // 注册
    userExist: 480,// 用户已经存在
    userExist: 'user exist',

    // 登录
    loginFail: 481,// 用户不存在
    loginFailMsg: 'this user does not exists'
}
