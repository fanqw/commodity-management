const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controllers/category.controller');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: 获取所有商品分类
 *     tags:
 *       - 商品分类
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
 *                   $ref: '#/components/schemas/Categories'
 */
router.get('/', categoryCtrl.findAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: 获取单个商品分类
 *     tags:
 *       - 商品分类
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 商品分类 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取单个商品分类
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
 *                   $ref: '#/components/schemas/Category'
 */
router.get('/:id', categoryCtrl.findById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: 创建新的商品分类
 *     tags:
 *       - 商品分类
 *     requestBody:
 *       description: 新的商品分类信息
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: 成功创建新的商品分类
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
 *                   $ref: '#/components/schemas/Category'
 */
router.post('/', categoryCtrl.create);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: 更新指定的商品分类
 *     tags:
 *       - 商品分类
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 商品分类 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: 成功更新商品分类
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
 *                   $ref: '#/components/schemas/Category'
 */
router.put('/:id', categoryCtrl.updateById);

/**
 * @swagger
 * /api/categories/remove:
 *   delete:
 *     summary: 批量删除商品分类
 *     tags:
 *       - 商品分类
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 description: 商品分类 id 数组
 *                 items:
 *                   type: string
 *             required:
 *               - ids
 *     responses:
 *       200:
 *         description: 成功删除所有商品分类
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
router.delete('/remove', categoryCtrl.remove);

module.exports = router;
