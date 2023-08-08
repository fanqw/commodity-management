const express = require('express');

const router = express.Router();
const commodityCtrl = require('../controllers/commodity.controller');

/**
 * @swagger
 * /api/commodities:
 *   get:
 *     summary: 获取所有商品分类
 *     tags:
 *       - 商品信息
 *     responses:
 *       200:
 *         description: 成功获取所有商品分类
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
 *                   $ref: '#/components/schemas/Commodities'
 */
router.post('/list', commodityCtrl.findAll);

/**
 * @swagger
 * /api/commodities/{id}:
 *   get:
 *     summary: 获取单个商品
 *     tags:
 *       - 商品信息
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 商品的ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取单个商品
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
 *                   $ref: '#/components/schemas/Commodity'
 */
router.get('/:id', commodityCtrl.findById);

/**
 * @swagger
 * /api/commodities:
 *   post:
 *     summary: 创建商品
 *     tags:
 *       - 商品信息
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommodityInput'
 *     responses:
 *       200:
 *         description: 成功创建商品
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
 *                   $ref: '#/components/schemas/Commodity'
 */
router.post('/', commodityCtrl.create);

/**
 * @swagger
 * /api/commodities/{id}:
 *   put:
 *     summary: 更新商品
 *     tags:
 *       - 商品信息
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 商品的ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommodityInput'
 *     responses:
 *       200:
 *         description: 成功更新商品
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
 *                   $ref: '#/components/schemas/Commodity'
 */
router.put('/:id', commodityCtrl.updateById);

/**
 * @swagger
 * /api/commodities/remove:
 *   delete:
 *     summary: 删除商品
 *     tags:
 *       - 商品信息
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - ids
 *     responses:
 *       200:
 *         description: 成功删除商品
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
 *                   type: null
 *                   example: null
 */
router.delete('/remove/:id', commodityCtrl.removeCommodityById);

module.exports = router;
