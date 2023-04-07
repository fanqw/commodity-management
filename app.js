const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerRouter = require('./routes/swagger');
const routers = require('./routes/index');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

dotenv.config();

const port = process.env.PORT;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const dbUrl = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${dbHost}:${dbPort}/${dbName}`
mongoose.connect(dbUrl, {
    useUnifiedTopology: true
}).then(() => {
    console.log('数据库连接成功');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

const app = express()

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('tiny'));
app.use('/', routers);
app.use(swaggerRouter);


app.listen(port, (req, res) => {
    console.log(`Server listening at http://localhost:${port}`)
})