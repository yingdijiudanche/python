const http = require('http');
const express = require('express');
const apis = require('./api/index');
const jwt = require('jsonwebtoken');
const path = require('path');
const { connectDB } = require('./db/connetDB');

connectDB();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.static(path.join(__dirname, '/pdf')));
app.use(express.static(path.join(__dirname, '/build')));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT,PATCH,POST,GET,DELETE,OPTIONS');

  //跨域配置 start 如果不想支持跨域，注释下面代码
  // res.header('Access-Control-Allow-Origin', '*');
  // if (req.method === 'OPTIONS') {
  //   //浏览器处理跨域原理，发出请求前先发出一个option请求 询问是否允许
  //   res.sendStatus(200);
  //   return;
  // }
  //跨域配置 end

  if (/\/api/.test(req.url)) {
    preHandleApi(req, res, next);
    return;
  }

  if (req.method !== 'GET') {
    next();
    return;
  }

  if (/\/uploads\//.test(req.url)) {
    //用户上传的静态文件
    res.sendFile(path.join(__dirname + req.url));
    return;
  }
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apis);

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.send('error');
});
app.set('port', port);
var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

/** 接口白名单，不用登录就可访问，所以handler里它也不会有userId */
const whiteListApi = [/\/app\/download/, /\/export\/.*/, /\/login/];

/**
 *@type {import('express').RequestHandler}
 */
function preHandleApi(req, res, next) {
  res.header('Content-Type', 'application/json;charset=utf-8');

  if (whiteListApi.some(reg => reg.test(req.url))) {
    next();
    return;
  }
  let token = jwt.decode(req.get('Authorization'));
  if (!token) {
    res.status(401).send('Please login first!');
    return;
  }
  res.locals.userId = token.userId;
  next();
}
