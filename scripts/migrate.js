const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../src/persistence/config/db');
const { sequelize } = require('../src/persistence/models');
const {
  resequenceAllCoreTables,
  ensureFichaTecnicaTrashSchema,
  ensureFichaTecnicaInsumoVariantZero,
  ensureEventoColumnsSchema,
  syncVentasTotals,
  ensureCategoriaProductoIconSchema,
  ensureCategoriaInsumoIconSchema,
  ensureConfiguracionComboSchema,
  ensureVarianteImagenSchema,
  ensureVentaAprobacionSchema,
  ensureUsuarioDocumentoSchema,
  ensureResenaSchema,
  ensureNoNegativeStock,
  ensureInsumoEliminadoSchema,
  ensureInsumoCategoriaNullableSchema,
  ensureInsumoAdicionSchema,
  ensureProductoAdicionesDefaultSchema,
  ensureCompraLotesYCancelacionSchema,
  ensureActaRevisionSchema,
  ensureEmpleadoSchema,
  ensureDevolucionSchema,
  ensureInsumoIvaManualSchema,
  ensurePreciosRealesInsumosYStock,
  ensureVarianteInsumoSchema
} = require('../src/infrastructure/utils/dbUtils');

async function initializeDatabaseSchema() {
  try {
    await connectDB();
    await ensureActaRevisionSchema();
    await ensureInsumoEliminadoSchema();
    await ensureInsumoCategoriaNullableSchema();
    await ensureInsumoAdicionSchema();
    await ensureVarianteImagenSchema();
    await ensureVarianteInsumoSchema();
    await ensureUsuarioDocumentoSchema();
    await ensureFichaTecnicaTrashSchema();
    await ensureFichaTecnicaInsumoVariantZero();
    await ensureEventoColumnsSchema();
    await ensureCategoriaProductoIconSchema();
    await ensureCategoriaInsumoIconSchema();
    await ensureConfiguracionComboSchema();
    await ensureVentaAprobacionSchema();
    await syncVentasTotals();
    await resequenceAllCoreTables();
    await ensureResenaSchema();
    await ensureNoNegativeStock();
    await ensureProductoAdicionesDefaultSchema();
    await ensureCompraLotesYCancelacionSchema();
    await ensureEmpleadoSchema();
    await ensureDevolucionSchema();
    await ensureInsumoIvaManualSchema();
    await ensurePreciosRealesInsumosYStock();
    try {
      const [results] = await sequelize.query(
        "SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'venta' AND COLUMN_NAME = 'tipoVenta'"
      );
      const columnExists = results[0].cnt > 0;
      if (!columnExists) {
        await sequelize.query(
          "ALTER TABLE venta ADD COLUMN tipoVenta VARCHAR(50) NOT NULL DEFAULT 'PUNTO_DE_VENTA'"
        );
        console.log('Added venta.tipoVenta column');
      }
    } catch (err) {
      console.warn('Could not ensure venta.tipoVenta column:', err.message);
    }
    console.log('Esquema y modelos de base de datos verificados correctamente.');
  } catch (err) {
    console.error('Error al verificar esquemas de base de datos:', err.message);
    throw err;
  }
}

if (require.main === module) {
  initializeDatabaseSchema()
    .then(async () => {
      await sequelize.close().catch(() => {});
      process.exit(0);
    })
    .catch(async () => {
      await sequelize.close().catch(() => {});
      process.exit(1);
    });
}

module.exports = { initializeDatabaseSchema };

