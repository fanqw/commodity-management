const express = require('express');
const router = express.Router();
const categoryRoute = require('./category.route');
const unitRoute = require('./unit.route');
const commodityRoute = require('./commodity.route');

router.use('/categories', categoryRoute);
router.use('/units', unitRoute);
router.use('/commodities', commodityRoute);

module.exports = router;
