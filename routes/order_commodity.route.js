const express = require('express');

const router = express.Router();
const orderCommodityCtrl = require('../controllers/order_commodity.controller');

/**
 * @swagger
 * /api/order_commodities/{orderId}:
 *   get:
 *     summary: 获取所有订单下的商品信息
 *     tags:
 *       - 订单商品
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 订单 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取订单下的商品信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: 错误信息
 *                 data:
 *                   $ref: '#/components/schemas/OrderCommodities'
 */
router.get('/:orderId', orderCommodityCtrl.findAll);

/**
 * @swagger
 * /api/order_commodities/{id}:
 *   get:
 *     summary: 获取单个订单商品信息
 *     tags:
 *       - 订单商品
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 订单商品 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取单个订单商品信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 200
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/OrderCommodity'
 */
router.get('/:id', orderCommodityCtrl.findById);

/**
 * @swagger
 * /api/order_commodities:
 *   post:
 *     summary: 创建订单商品信息
 *     tags:
 *       - 订单商品
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCommodityInput'
 *     responses:
 *       200:
 *         description: 成功创建订单商品信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: 错误信息
 *                 data:
 *                   $ref: '#/components/schemas/OrderCommodity'
 */
router.post('/', orderCommodityCtrl.create);

/**
 * @swagger
 * /api/order_commodities/{id}:
 *   put:
 *     summary: 更新订单商品信息
 *     tags:
 *       - 订单商品
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 订单商品 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCommodityInput'
 *     responses:
 *       200:
 *         description: 成功更新订单商品信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: 错误信息
 *                 data:
 *                   $ref: '#/components/schemas/OrderCommodity'
 */
router.put('/:id', orderCommodityCtrl.updateById);

// 参考之前的代码，添加swagger注释
/**
 * @swagger
 * /api/order_commodities/remove:
 *   delete:
 *     summary: 删除订单商品信息
 *     tags:
 *       - 订单商品
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 description: 订单商品 id 数组
 *                 items:
 *                   type: string
 *             required:
 *               - ids
 *     responses:
 *       200:
 *         description: 成功删除订单商品信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: 错误信息
 *                 data:
 *                   type: null
 *                   example: null
 */
router.delete('/remove/:id', orderCommodityCtrl.removeOrderCommodityById);

module.exports = router;
