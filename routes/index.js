const express = require('express');
const router = express.Router();
const categoryRoute = require('./category.route');
const unitRoute = require('./unit.route');
const commodityRoute = require('./commodity.route');
const orderRoute = require('./order.route');
const orderCommodityRoute = require('./order_commodity.route');

router.use('/categories', categoryRoute);
router.use('/units', unitRoute);
router.use('/commodities', commodityRoute);
router.use('/orders', orderRoute);
router.use('/order_commodities', orderCommodityRoute);

module.exports = router;
