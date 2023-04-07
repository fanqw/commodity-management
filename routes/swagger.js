const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');

const router = express.Router();

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: '商品分类接口',
        version: '1.0.0',
        description: '商品分类接口的文档',
    },
    servers: [
        {
            url: 'http://localhost:3000',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

router.use('/docs', swaggerUi.serve);
router.get(
    '/docs',
    swaggerUi.setup(swaggerSpec, {
        explorer: true,
    })
);

module.exports = router;
