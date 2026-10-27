const { Sequelize } = require('sequelize');

const sanitizeEnv = (val, fallback = '') => {
  if (val === undefined || val === null) return fallback;
  return String(val).trim().replace(/^['"]|['"]$/g, '');
};

const dbHost = sanitizeEnv(process.env.DB_HOST, 'localhost');
const dbUser = sanitizeEnv(process.env.DB_USER, 'root');
const dbPassword = sanitizeEnv(process.env.DB_PASSWORD, '');
const dbName = sanitizeEnv(process.env.DB_NAME, 'chazinfood');
const dbPort = Number(sanitizeEnv(process.env.DB_PORT, '3306')) || 3306;

const isCloudHost = Boolean(
  dbHost && (
    dbHost.includes('tidbcloud.com') ||
    dbHost.includes('aivencloud.com') ||
    dbHost.includes('render.com') ||
    dbHost.includes('railway')
  )
);
const enableSSL = process.env.DB_SSL === 'true' || process.env.DB_SSL === '1' || isCloudHost;

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 20000,
      ...(enableSSL ? {
        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
        }
      } : {})
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false,
      freezeTableName: true
    }
  }
);

const connectDB = async () => {
  try {
  const maxRetries = 10;
  const retryDelayMs = 3000;

  console.log(`Intentando conectar a MySQL en ${dbHost}:${dbPort} (DB: ${dbName}, USER: ${dbUser})`);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('MySQL conectado exitosamente con Sequelize ORM');
      return;
    } catch (error) {
      console.error(`Intento ${attempt}/${maxRetries} - Error de conexión a MySQL vía Sequelize: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`Reintentando en ${retryDelayMs / 1000}s...`);
        await new Promise((res) => setTimeout(res, retryDelayMs));
      } else {
        console.log('Máximo de reintentos alcanzado. El backend continuará ejecutándose pero la DB no está disponible.');
      }
    }
  }
  } catch (error) {
    console.error(`Error de conexión a MySQL vía Sequelize: ${error}`);
    console.log('El backend continuará ejecutándose. Por favor asegúrate de que MySQL esté activo o que las variables de entorno de conexión sean correctas.');
  }
};

connectDB.sequelize = sequelize;
connectDB.pool = sequelize;

module.exports = connectDB;