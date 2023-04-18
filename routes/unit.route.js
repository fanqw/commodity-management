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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Unit'
 *       500:
 *          $ref: '#/components/responses/ServerError'
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
 *               $ref: '#/components/schemas/Unit'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', unitCtrl.findById);

/**
 * @swagger
 * /api/units:
 *   post:
 *     summary: 创建新的商品单位
 *     tags:
 *       - Units
 *     requestBody:
 *       description: 新的商品单位信息
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unit'
 *     responses:
 *       201:
 *         description: 成功创建新的商品单位
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unit'
 *       400:
 *         description: 请求参数错误
 *       500:
 *         description: 服务器内部错误
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
 *             $ref: '#/components/schemas/UnitUpdate'
 *     responses:
 *       200:
 *         description: 成功更新商品单位
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unit'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', unitCtrl.updateById);

/**
 * @swagger
 * /api/unit/remove:
 *   delete:
 *     summary: 删除商品单位
 *     tags:
 *       - Unit
 *     description: 删除商品单位
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         description: 商品单位ID，多个ID用逗号隔开
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: 删除成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     ids:
 *                       type: array
 *                       description: 已删除的商品单位ID列表
 *                       items:
 *                         type: string
 *                         example: "60972f36d0a71a6a0fd314f1"
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: 删除失败，请稍后再试
 */
router.delete('/remove', unitCtrl.remove);

module.exports = router;
