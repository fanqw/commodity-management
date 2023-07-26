const express = require('express');

const router = express.Router();
const orderCtrl = require('../controllers/order.controller');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: 获取所有订单
 *     tags:
 *       - 订单信息
 *     responses:
 *       200:
 *         description: 成功获取所有订单
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
 *                   $ref: '#/components/schemas/Orders'
 */
router.get('/', orderCtrl.findAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: 获取单个订单
 *     tags:
 *       - 订单信息
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 订单的ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取单个订单
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
 *                   $ref: '#/components/schemas/Order'
 */
router.get('/:id', orderCtrl.findById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: 创建订单
 *     tags:
 *       - 订单信息
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       200:
 *         description: 创建订单成功
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
 *                   $ref: '#/components/schemas/Order'
 */
router.post('/', orderCtrl.create);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: 更新订单信息
 *     tags:
 *       - 订单信息
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 订单的ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       200:
 *         description: 更新订单信息成功
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
 *                   $ref: '#/components/schemas/Order'
 */
router.put('/:id', orderCtrl.updateById);

/**
 * @swagger
 * /api/orders/remove:
 *   delete:
 *     summary: 删除订单
 *     tags:
 *       - 订单信息
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 description: 订单 id 数组
 *                 items:
 *                   type: string
 *             required:
 *               - ids
 *     responses:
 *       200:
 *         description: 删除订单成功
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
 */
router.delete('/remove/:id', orderCtrl.removeOrderById);

module.exports = router;
