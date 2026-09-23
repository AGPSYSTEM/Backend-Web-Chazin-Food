const { sequelize } = require('../src/persistence/models');

(async () => {
  await sequelize.query("UPDATE producto SET imagen = '/images/drinks/postobon_uva.jpg' WHERE idProducto = 38");
  await sequelize.query("UPDATE producto SET imagen = '/images/drinks/postobon_naranja.jpg' WHERE idProducto = 39");
  console.log('Images updated in DB');
  process.exit(0);
})();
