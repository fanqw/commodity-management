const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const swaggerRouter = require('./routes/swagger');
const routers = require('./routes/index');

dotenv.config();

const port = process.env.PORT;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const dbUrl = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${dbHost}:${dbPort}/${dbName}`;
mongoose
  .connect(dbUrl, {
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

const app = express();

// 注册解析请求体的中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(morgan('tiny'));

// 自定义处理数据的中间件
app.use((req, res, next) => {
  // 为 res 对象添加一个 sendResponse 方法，用于发送响应数据
  res.sendResponse = (data, code = 200, message) => {
    const response = {
      code,
      data,
      message
    };
    res.status(code).json(response);
  };
  next();

  // 捕获业务逻辑错误并交给全局错误处理中间件处理
  // try {
  //   // 调用下一个中间件处理请求
  // } catch (err) {
  //   // 抛出一个自定义的 HttpError
  //   next(createError(500, '服务器内部错误'));
  // }
});
app.use('/api', routers);
app.use(swaggerRouter);
// 全局错误处理中间件
app.use((err, req, res, next) => {
  const code = err.code || 500;
  const message = err.message || '服务器内部错误';
  res.sendResponse(null, code, message);
  next();
});

app.listen(port, (req, res) => {
  console.log(`Server listening at http://localhost:${port}`);
});
