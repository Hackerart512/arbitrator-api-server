import userSwagger from '../modules/user/user.swagger.js';
import permissionSwagger from '../modules/permission/permission.swagger.js';
import roleSwagger from '../modules/role/role.swagger.js';

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

export default {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'Modular Swagger API docs',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
    },
  ],
  tags: [
    { name: 'User' },
  ],
  paths: {
    ...userSwagger.paths,
    ...permissionSwagger.paths,
    ...roleSwagger.paths,
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token (without Bearer prefix)'
      }
    },
    schemas: {
      ...userSwagger.components?.schemas,
      ...permissionSwagger.components?.schemas,
      ...roleSwagger.components?.schemas,
    },
  },
};
