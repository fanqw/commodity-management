const express = require('express');
const router = express.Router();
const orderCommodityCtrl = require('../controllers/order_commodity.controller');

/**
 * 获取所有订单商品信息
 */
router.get('/', orderCommodityCtrl.findAll);

/**
 * 获取单个订单商品信息
 */
router.get('/:id', orderCommodityCtrl.findById);

/**
 * 创建新的订单商品信息
 */
router.post('/', orderCommodityCtrl.create);

/**
 * 更新订单商品信息
 */
router.put('/:id', orderCommodityCtrl.updateById);

/**
 * 删除订单商品信息
 */
router.delete('/remove', orderCommodityCtrl.remove);

module.exports = router;
