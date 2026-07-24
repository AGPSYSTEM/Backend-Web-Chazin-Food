const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'chazinfood',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD ?? '12345',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
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
    await sequelize.authenticate();
    console.log('MySQL Conectado exitosamente con Sequelize ORM a "chazinfood"');
  } catch (error) {
    console.error(`Error de conexión a MySQL vía Sequelize: ${error.message}`);
    console.log('El backend continuará ejecutándose. Por favor asegúrate de que MySQL esté activo.');
  }
};

connectDB.sequelize = sequelize;
connectDB.pool = sequelize;

module.exports = connectDB;
