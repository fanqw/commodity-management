const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const express = require('express');

const router = express.Router();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: '商品管理系统',
    version: '1.0.0',
    description: '商品管理系统接口的文档'
  },
  servers: [
    {
      url: 'http://localhost:3000'
    }
  ],
  components: {
    schemas: {
      Unit: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '计量单位ID'
          },
          name: {
            type: 'string',
            description: '计量单位名称'
          },
          desc: {
            type: 'string',
            description: '计量单位描述'
          },
          create_at: {
            type: 'string',
            description: '创建时间'
          },
          update_at: {
            type: 'string',
            description: '更新时间'
          }
        }
      },
      Units: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Unit'
        }
      },
      UnitInput: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: '计量单位名称'
          },
          desc: {
            type: 'string',
            description: '计量单位描述'
          }
        }
      },
      Category: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '商品分类ID'
          },
          name: {
            type: 'string',
            description: '商品分类名称'
          },
          desc: {
            type: 'string',
            description: '商品分类描述'
          },
          create_at: {
            type: 'string',
            description: '创建时间'
          },
          update_at: {
            type: 'string',
            description: '更新时间'
          }
        }
      },
      Categories: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Category'
        }
      },
      CategoryInput: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: '商品分类名称'
          },
          desc: {
            type: 'string',
            description: '商品分类描述'
          }
        }
      },
      Commodity: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '商品ID'
          },
          name: {
            type: 'string',
            description: '商品名称'
          },
          desc: {
            type: 'string',
            description: '商品描述'
          },
          unit: {
            $ref: '#/components/schemas/Unit'
          },
          category: {
            $ref: '#/components/schemas/Category'
          },
          create_at: {
            type: 'string',
            description: '创建时间'
          },
          update_at: {
            type: 'string',
            description: '更新时间'
          }
        }
      },
      Commodities: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Commodity'
        }
      },
      CommodityInput: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: '商品名称'
          },
          desc: {
            type: 'string',
            description: '商品描述'
          },
          unit_id: {
            type: 'string',
            description: '计量单位ID'
          },
          category_id: {
            type: 'string',
            description: '商品分类ID'
          }
        }
      },
      Order: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '订单ID'
          },
          name: {
            type: 'string',
            description: '订单名称'
          },
          desc: {
            type: 'string',
            description: '订单描述'
          },
          create_at: {
            type: 'string',
            description: '创建时间'
          },
          update_at: {
            type: 'string',
            description: '更新时间'
          }
        }
      },
      Orders: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Order'
        }
      },
      OrderInput: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: '订单名称'
          },
          desc: {
            type: 'string',
            description: '订单描述'
          }
        }
      },
      OrderCommodity: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '订单商品ID'
          },
          count: {
            type: 'number',
            description: '商品数量'
          },
          price: {
            type: 'number',
            description: '商品单价'
          },
          order: {
            $ref: '#/components/schemas/Order'
          },
          commodity: {
            $ref: '#/components/schemas/Commodity'
          },
          create_at: {
            type: 'string',
            description: '创建时间'
          },
          update_at: {
            type: 'string',
            description: '更新时间'
          }
        }
      },
      OrderCommodities: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/OrderCommodity'
        }
      },
      OrderCommodityInput: {
        type: 'object',
        properties: {
          order_id: {
            type: 'string',
            description: '订单ID'
          },
          commodity_id: {
            type: 'string',
            description: '商品ID'
          },
          count: {
            type: 'number',
            description: '商品数量'
          },
          price: {
            type: 'number',
            description: '商品单价'
          },
          desc: {
            type: 'string',
            description: '商品描述'
          }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

router.use('/docs', swaggerUi.serve);
router.get(
  '/docs',
  swaggerUi.setup(swaggerSpec, {
    explorer: true
  })
);

module.exports = router;
