const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./src/persistence/config/db');
const { sequelize } = require('./src/persistence/models');
const { errorHandler } = require('./src/infrastructure/middlewares/errorMiddleware');
const { swaggerUi, swaggerSpec } = require('./src/infrastructure/swagger/swagger');

// Connect to Database via Sequelize
connectDB();
sequelize.sync().then(() => {
  console.log('Modelos de Sequelize sincronizados correctamente.');
}).catch((err) => {
  console.error('Sincronización opcional de Sequelize diferida:', err.message);
});

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Swagger UI served at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { background-color: #F05454; }',
  customSiteTitle: 'Chazin Food - Documentación API'
}));

// API Routes (Presentation Layer)
app.use('/api/auth', require('./src/presentation/routes/authRoutes'));
app.use('/api/categories', require('./src/presentation/routes/categoryRoutes'));
app.use('/api/users', require('./src/presentation/routes/userRoutes'));
app.use('/api/products', require('./src/presentation/routes/productRoutes'));
app.use('/api/orders', require('./src/presentation/routes/orderRoutes'));

// Rutas en Español
app.use('/api/autenticacion', require('./src/presentation/routes/authRoutes'));
app.use('/api/categorias', require('./src/presentation/routes/categoryRoutes'));
app.use('/api/usuarios', require('./src/presentation/routes/userRoutes'));
app.use('/api/productos', require('./src/presentation/routes/productRoutes'));
app.use('/api/pedidos', require('./src/presentation/routes/orderRoutes'));
app.use('/api/roles', require('./src/presentation/routes/roleRoutes'));
app.use('/api/insumos', require('./src/presentation/routes/insumoRoutes'));
app.use('/api/categorias-insumo', require('./src/presentation/routes/categoriaInsumoRoutes'));
app.use('/api/insumos-preparados', require('./src/presentation/routes/insumoPreparadoRoutes'));
app.use('/api/proveedores', require('./src/presentation/routes/proveedorRoutes'));
app.use('/api/trazabilidad', require('./src/presentation/routes/trazabilidadRoutes'));

// Root route redirects to Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor monolítico unificado escuchando en el puerto ${PORT} en modo ${process.env.NODE_ENV || 'development'}`);
});
