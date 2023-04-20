const express = require('express');

const router = express.Router();
const unitCtrl = require('../controllers/unit.controller');

/**
 * @swagger
 * /api/units:
 *   get:
 *     summary: 获取所有商品单位
 *     tags:
 *       - 商品单位
 *     responses:
 *       200:
 *         description: 成功获取所有商品单位
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
 *                   $ref: '#/components/schemas/Units'
 */
router.get('/', unitCtrl.findAll);

/**
 * @swagger
 * /api/units/{id}:
 *   get:
 *     summary: 获取单个商品单位
 *     tags:
 *       - 商品单位
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 商品单位的ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取单个商品单位
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
 *                   $ref: '#/components/schemas/Unit'
 */
router.get('/:id', unitCtrl.findById);

/**
 * @swagger
 * /api/units:
 *   post:
 *     summary: 创建新的商品单位
 *     tags:
 *       - 商品单位
 *     requestBody:
 *       description: 新的商品单位信息
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnitInput'
 *     responses:
 *       201:
 *         description: 成功创建新的商品单位
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
 *                   $ref: '#/components/schemas/Unit'
 */
router.post('/', unitCtrl.create);

/**
 * @swagger
 * /api/units/{id}:
 *   put:
 *     summary: 更新商品单位
 *     description: 根据商品单位 ID 更新商品单位信息
 *     tags:
 *       - 商品单位
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 商品单位 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: 更新商品单位信息
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnitInput'
 *     responses:
 *       200:
 *         description: 成功更新商品单位
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
 *                   $ref: '#/components/schemas/Unit'
 */
router.put('/:id', unitCtrl.updateById);

/**
 * @swagger
 * /api/unit/remove:
 *   delete:
 *     summary: 删除商品单位
 *     tags:
 *       - 商品单位
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 description: 商品单位 id 数组
 *                 items:
 *                   type: string
 *             required:
 *               - ids
 *     responses:
 *       200:
 *         description: 成功删除所有商品单位
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 200
 *                 data:
 *                   type: null
 *                   description: 无返回数据
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: 删除成功
 */
router.delete('/remove', unitCtrl.remove);

module.exports = router;
