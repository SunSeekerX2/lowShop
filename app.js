const express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    code = require('./router/utils/code'),          // Message code
    config = require('./config/config'),            // Project Configuration
    router = require('./router/router')            // router

app
    // parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded({extended: false}))
    // parse application/json
    .use(bodyParser.json())
    // open public
    .use('/public/', express.static(path.resolve('./public/')))

    // Allow CROS
    .all("*", (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "*")
        res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS")
        req.method.toLowerCase() === 'options' ? res.end() : next()
    })

    // router
    .use('/', router)

    // 404
    .use((req, res, next) => {
        res.json({code: code.notFound, message: code.notFoundMsg})
    })

    // 500
    .use((err, req, res, next) => {
        res.json({code: code.serverError, message: code.serverErrorMsg, err: err.message})
    })

    // server at port 3000
    .listen(config.app.port, () => {
        console.log('lowShop is running at port ' + config.app.port)
          // console.log([
  //   "                   _ooOoo_",
  //   "                  o8888888o",
  //   "                  88\" . \"88",
  //   "                  (| -_- |)",
  //   "                  O\\  =  /O",
  //   "               ____/`---'\\____",
  //   "             .'  \\\\|     |//  `.",
  //   "            /  \\\\|||  :  |||//  \\",
  //   "           /  _||||| -:- |||||-  \\",
  //   "           |   | \\\\\\  -  /// |   |",
  //   "           | \\_|  ''\\---/''  |   |",
  //   "           \\  .-\\__  `-`  ___/-. /",
  //   "         ___`. .'  /--.--\\  `. . __",
  //   "      .\"\" '<  `.___\\_<|>_/___.'  >'\"\".",
  //   "     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |",
  //   "     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /",
  //   "======`-.____`-.___\\_____/___.-`____.-'======",
  //   "                   `=---='",
  //   "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
  //   "         佛祖保佑       永无BUG",
  // ].join('\n'))
    })

