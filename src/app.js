import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/index.js';
import errorHandler from './common/middlewares/error.middleware.js';

// ROUTES (must be ES module exports)
import userRoutes from './modules/user/user.routes.js';
import roleRoutes from './modules/role/role.routes.js';
import permissionRoutes from './modules/permission/permission.routes.js';
import arbitratorsRoutes from './modules/arbitrator/arbitrator.routes.js';
import caseRoutes from './modules/case/case.routes.js';
 
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ---------- Swagger ----------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ---------- Routes ----------
app.use('/api/users', userRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/arbitrators', arbitratorsRoutes);
app.use('/api/cases', caseRoutes);
 

app.get('/test', (req, res) => res.send('OK'));

// ---------- Error Handler (LAST) ----------
app.use(errorHandler);

export default app;
