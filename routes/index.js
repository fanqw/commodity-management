
const express = require('express');
const router = express.Router();
const categoryRoute = require('./category.route');

router.use('/api', categoryRoute);

module.exports = router;
