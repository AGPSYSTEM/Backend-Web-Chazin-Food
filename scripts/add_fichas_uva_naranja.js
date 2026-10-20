const { sequelize } = require('../src/persistence/models');

async function addFichas() {
  try {
    const [existing] = await sequelize.query('SELECT idFichaTecnica FROM fichatecnica WHERE idProducto IN (38, 39)');
    if (existing.length === 0) {
      await sequelize.query(`
        INSERT INTO fichatecnica (idVariante, descripcion, fechaCreacion, idProducto, tipo, procedimiento, tiempoPreparacion, rendimiento, especificaciones, caracteristicas, informacionNutricional, condicionesAlmacenamiento, vidaUtil, observaciones, estado) VALUES
        (56, 'Gaseosa Postobón sabor Uva tradicional bien fría con burbujas intensas y dulce aroma frutal.', NOW(), 38, 'PRODUCTO', '1. Tomar insumo de inventario refrigerado entre 2°C y 4°C.\\n2. Servir con hielo o cerrada según preferencia del cliente.', 1, '1 porción (400ml)', 'Bebida fría entre 2°C y 4°C. Envase PET sellado de fábrica.', 'Color púrpura translúcido brillante, intenso aroma a uva dulce, alta efervescencia.', 'Calorías: 160 kcal | Carbohidratos: 40g | Azúcares: 40g | Sodio: 35mg', 'Mantener en refrigeración constante. Proteger de la luz solar.', 'Según fecha de vencimiento (6 a 9 meses)', 'Gaseosa Postobón colombiana sabor Uva.', 1),
        (59, 'Gaseosa Postobón sabor Naranja refrescante y cítrica con notas dulces frutales.', NOW(), 39, 'PRODUCTO', '1. Tomar insumo de inventario refrigerado entre 2°C y 4°C.\\n2. Servir con hielo o cerrada según preferencia del cliente.', 1, '1 porción (400ml)', 'Bebida fría entre 2°C y 4°C. Envase PET sellado de fábrica.', 'Color naranja brillante translúcido, aroma cítrico vibrante, refrescante burbujeante.', 'Calorías: 155 kcal | Carbohidratos: 38g | Azúcares: 38g | Sodio: 30mg', 'Mantener en refrigeración constante. Proteger de la luz solar.', 'Según fecha de vencimiento (6 a 9 meses)', 'Gaseosa Postobón colombiana sabor Naranja.', 1)
      `);
      console.log('Fichas técnicas creadas para Uva y Naranja');
    } else {
      console.log('Fichas ya existentes');
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

addFichas();
