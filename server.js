// Environment Configuration
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

const {
  resequenceAllCoreTables,
  ensureFichaTecnicaTrashSchema,
  ensureFichaTecnicaInsumoVariantZero,
  ensureEventoColumnsSchema,
  syncVentasTotals,
  ensureCategoriaProductoIconSchema
} = require('./src/infrastructure/utils/dbUtils');

// Connect to Database via Sequelize
connectDB();
sequelize.sync({ alter: true }).then(async () => {
  await ensureFichaTecnicaTrashSchema();
  await ensureFichaTecnicaInsumoVariantZero();
  await ensureEventoColumnsSchema();
  await ensureCategoriaProductoIconSchema();
  await syncVentasTotals();
  console.log('Modelos de Sequelize sincronizados correctamente.');
  await resequenceAllCoreTables();
}).catch((err) => {
  console.error('Sincronización opcional de Sequelize diferida:', err.message);
});

const app = express();

// ── Configuración de CORS Explícita para Frontend (Vite en puerto 5173) ──
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL // Por si luego configuras la URL en el .env
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman, Swagger o herramientas locales)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // En desarrollo permitimos la petición para evitar bloqueos
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middlewares
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" } // Permite recursos cruzados entre puertos
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
app.use('/api/orders', require('./src/presentation/routes/ventaRoutes'));
app.use('/api/upload', require('./src/presentation/routes/uploadRoutes'));

// Rutas en Español
app.use('/api/autenticacion', require('./src/presentation/routes/authRoutes'));
app.use('/api/categorias', require('./src/presentation/routes/categoriaProductoRoutes'));
app.use('/api/usuarios', require('./src/presentation/routes/userRoutes'));
app.use('/api/productos', require('./src/presentation/routes/productRoutes'));
app.use('/api/pedidos', require('./src/presentation/routes/ventaRoutes'));
app.use('/api/roles', require('./src/presentation/routes/roleRoutes'));
app.use('/api/insumos', require('./src/presentation/routes/insumoRoutes'));
app.use('/api/categorias-insumo', require('./src/presentation/routes/categoriaInsumoRoutes'));
app.use('/api/insumos-preparados', require('./src/presentation/routes/insumoPreparadoRoutes'));
app.use('/api/proveedores', require('./src/presentation/routes/proveedorRoutes'));
app.use('/api/trazabilidad', require('./src/presentation/routes/trazabilidadRoutes'));
app.use('/api/clientes', require('./src/presentation/routes/clienteRoutes'));
app.use('/api/categorias-producto', require('./src/presentation/routes/categoriaProductoRoutes'));
app.use('/api/compras', require('./src/presentation/routes/compraRoutes'));
app.use('/api/ventas', require('./src/presentation/routes/ventaRoutes'));
app.use('/api/fichas-tecnicas', require('./src/presentation/routes/fichaTecnicaRoutes'));
app.use('/api/produccion', require('./src/presentation/routes/produccionRoutes'));
app.use('/api/dashboard', require('./src/presentation/routes/dashboardRoutes'));
app.use('/api/eventos', require('./src/presentation/routes/eventoRoutes'));
app.use('/api/adiciones', require('./src/presentation/routes/adicionRoutes'));

// Root route redirects to Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Servidor monolítico unificado escuchando en el puerto ${PORT} en modo ${process.env.NODE_ENV || 'development'}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ El puerto ${PORT} ya está en uso. Cierra el proceso anterior o cambia el valor de PORT.`);
  } else {
    console.error('❌ Error al iniciar el servidor:', error.message);
  }
  process.exit(1);
});

// Manejo de cierre limpio para evitar errores EADDRINUSE con nodemon
const handleShutdown = (signal) => {
  console.log(`Recibida señal ${signal}. Cerrando servidor en puerto ${PORT}...`);
  server.close(() => {
    console.log('Servidor HTTP cerrado correctamente.');
    process.exit(0);
  });
};

process.once('SIGUSR2', () => {
  server.close(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));