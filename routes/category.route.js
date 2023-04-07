const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controllers/category.controller');


/**
 * @swagger
 * tags:
 *   name: Category
 *   description: 商品分类接口
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: 获取所有商品分类
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: 成功获取所有商品分类
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '../schemas/category.yml'
 *       500:
 *         description: 服务器错误
 */
router.get('/categories', categoryCtrl.findAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: 获取单个商品分类
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 分类ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取单个商品分类
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../schemas/category.yml'
 *       404:
 *         description: 商品分类不存在
 *       500:
 *         description: 服务器错误
 */
router.get('/categories/:id', categoryCtrl.findById);

/**
* @swagger
* /api/categories:
*   post:
*     summary: 创建新的商品分类
*     tags: [Category]
*     requestBody:
*       description: 商品分类信息
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CategoryInput'
*     responses:
*       201:
*         description: 成功创建商品分类
*         content:
*           application/json:
*             schema:
*               $ref: '../schemas/category.yml'
*       400:
*         description: 参数错误
*       500:
*         description: 服务器错误
*/
router.post('/categories', categoryCtrl.create);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: 更新商品分类
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 分类ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: 商品分类信息
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
 *               $ref: '../schemas/category.yml'
 *       400:
 *         description: 参数错误
 *       404:
 *         description: 商品分类不存在
 *       500:
 *         description: 服务器错误
 */
router.put('/categories/:id', categoryCtrl.updateById);

/**
* @swagger
* /api/categories/{id}:
*   delete:
*     summary: 删除商品分类
*     tags: [Category]
*     parameters:
*       - name: id
*         in: path
*         description: 分类ID
*         required: true
*         schema:
*           type: string
*     responses:
*       204:
*         description: 成功删除商品分类
*       404:
*         description: 商品分类不存在
*       500:
*         description: 服务器错误
*/
router.delete('/categories/:id', categoryCtrl.deleteById);


module.exports = router;
