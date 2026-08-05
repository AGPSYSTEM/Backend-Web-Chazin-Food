const connectDB = require('../config/db');
const { DataTypes } = require('sequelize');

const sequelize = connectDB.sequelize;

// Model Definitions
const Role = sequelize.define('rol', {
  idRol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idRol'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, { tableName: 'rol', timestamps: false });

const Permiso = sequelize.define('permiso', {
  idPermiso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombrePermiso: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { tableName: 'permiso', timestamps: false });

const RolPermiso = sequelize.define('rolpermiso', {
  idRolPermiso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idRol: {
    type: DataTypes.INTEGER
  },
  idPermiso: {
    type: DataTypes.INTEGER
  }
}, { tableName: 'rolpermiso', timestamps: false });

const User = sequelize.define('usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING
  },
  tipoDocumento: {
    type: DataTypes.STRING
  },
  telefono: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idRol: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'ACTIVO'
  },
  fechaRegistro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, { tableName: 'usuario', timestamps: false });

const Cliente = sequelize.define('cliente', {
  idCliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING
  }
}, { tableName: 'cliente', timestamps: false });

const CategoriaInsumo = sequelize.define('categoriainsumo', {
  idCategoriaInsumo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idCategoriaInsumo'
  },
  id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.idCategoriaInsumo;
    }
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, { tableName: 'categoriainsumo', timestamps: false });

const TipoProveedor = sequelize.define('tipoproveedor', {
  idTipoProveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { tableName: 'tipoproveedor', timestamps: false });

const TipoDocumento = sequelize.define('tipodocumento', {
  idTipoDocumento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { tableName: 'tipodocumento', timestamps: false });

const Proveedor = sequelize.define('proveedor', {
  idProveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idTipoProveedor: {
    type: DataTypes.INTEGER
  },
  idTipoDocumento: {
    type: DataTypes.INTEGER
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numeroDocumento: {
    type: DataTypes.STRING
  },
  telefono: {
    type: DataTypes.STRING
  },
  correo: {
    type: DataTypes.STRING
  },
  direccion: {
    type: DataTypes.STRING
  },
  nombreContacto: {
    type: DataTypes.STRING
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, { tableName: 'proveedor', timestamps: false });

const Insumo = sequelize.define('insumo', {
  idInsumo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idCategoriaInsumo: {
    type: DataTypes.INTEGER
  },
  stock: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  stockMinimo: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  fechaExpedicion: {
    type: DataTypes.DATEONLY
  },
  fechaVencimiento: {
    type: DataTypes.DATEONLY
  },
  unidadMedida: {
    type: DataTypes.STRING
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  idProveedor: {
    type: DataTypes.INTEGER
  },
  descripcion: {
    type: DataTypes.STRING
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, { tableName: 'insumo', timestamps: false });

const InsumoPreparado = sequelize.define('insumopreparado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING
  },
  unidadMedida: {
    type: DataTypes.STRING(20),
    defaultValue: 'und'
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  },
  rendimiento: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 1
  },
  unidadRendimiento: {
    type: DataTypes.STRING,
    defaultValue: 'und'
  },
  precioVenta: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  costoTotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, { tableName: 'insumopreparado', timestamps: false });

const DetalleInsumoPreparadoInsumo = sequelize.define('detalleinsumopreparadoinsumo', {
  idDetalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPreparado: {
    type: DataTypes.INTEGER
  },
  idInsumo: {
    type: DataTypes.INTEGER
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2)
  },
  unidadMedida: {
    type: DataTypes.STRING
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, { tableName: 'detalleinsumopreparadoinsumo', timestamps: false });

const Trazabilidad = sequelize.define('trazabilidad', {
  idTrazabilidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idTrazabilidad'
  },
  id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.idTrazabilidad;
    }
  },
  tipo: {
    type: DataTypes.STRING(50)
  },
  entidadNombre: {
    type: DataTypes.STRING(150)
  },
  detalle: {
    type: DataTypes.STRING(255)
  },
  leido: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  idInsumo: {
    type: DataTypes.INTEGER
  },
  tipoMovimiento: {
    type: DataTypes.STRING(50)
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2)
  },
  motivo: {
    type: DataTypes.STRING(255)
  },
  usuarioId: {
    type: DataTypes.INTEGER
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, { tableName: 'trazabilidad', timestamps: false });

const Product = sequelize.define('producto', {
  idProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idProducto'
  },
  id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.idProducto;
    }
  },
  idCategoriaProducto: {
    type: DataTypes.INTEGER
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  descripcion: {
    type: DataTypes.STRING
  },
  imagen: {
    type: DataTypes.STRING
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  categoria: {
    type: DataTypes.STRING
  },
  adiciones: {
    type: DataTypes.TEXT
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, { tableName: 'producto', timestamps: false });

const CategoriaProducto = sequelize.define('categoriaproducto', {
  idCategoriaProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idCategoriaProducto'
  },
  id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.idCategoriaProducto;
    }
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.STRING(255)
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, { tableName: 'categoriaproducto', timestamps: false });

const Venta = sequelize.define('venta', {
  idVenta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idVenta'
  },
  id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.idVenta;
    }
  },
  idCliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idDescuento: {
    type: DataTypes.INTEGER
  },
  fechaVenta: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  descuentoAplicado: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  estadoEntrega: {
    type: DataTypes.ENUM('PENDIENTE', 'PREPARANDO', 'LISTO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'),
    defaultValue: 'PENDIENTE'
  },
  observaciones: {
    type: DataTypes.TEXT
  }
}, { tableName: 'venta', timestamps: false });

const DetalleVentaProducto = sequelize.define('detalleventaproducto', {
  idDetalleVenta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idVenta: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idVariante: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  observaciones: {
    type: DataTypes.STRING(255)
  }
}, { tableName: 'detalleventaproducto', timestamps: false });

const FichaTecnica = sequelize.define('fichatecnica', {
  idFichaTecnica: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idFichaTecnica'
  },
  id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.idFichaTecnica;
    }
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idInsumo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idVariante: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(20),
    defaultValue: 'PRODUCTO'
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  procedimiento: {
    type: DataTypes.TEXT
  },
  tiempoPreparacion: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rendimiento: {
    type: DataTypes.STRING(100)
  },
  especificaciones: {
    type: DataTypes.TEXT
  },
  caracteristicas: {
    type: DataTypes.TEXT
  },
  informacionNutricional: {
    type: DataTypes.TEXT
  },
  condicionesAlmacenamiento: {
    type: DataTypes.TEXT
  },
  vidaUtil: {
    type: DataTypes.STRING(100)
  },
  observaciones: {
    type: DataTypes.TEXT
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, { tableName: 'fichatecnica', timestamps: false });

const DetalleFichaInsumo = sequelize.define('detallefichainsumo', {
  idDetalleFicha: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idFichaTecnica: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idInsumo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  unidadMedida: {
    type: DataTypes.STRING(30),
    allowNull: true
  }
}, { tableName: 'detallefichainsumo', timestamps: false });

const Compra = sequelize.define('compra', {
  idCompra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idCompra'
  },
  id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.idCompra;
    }
  },
  idProveedor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fechaCompra: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'RECIBIDA', 'CANCELADA'),
    defaultValue: 'RECIBIDA'
  }
}, { tableName: 'compra', timestamps: false });

const DetalleCompraInsumo = sequelize.define('detallecomprainsumo', {
  idDetalleCompra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idCompra: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idInsumo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  }
}, { tableName: 'detallecomprainsumo', timestamps: false });


// Relationships / Associations
User.belongsTo(Role, { foreignKey: 'idRol', as: 'rolInfo' });
Role.hasMany(User, { foreignKey: 'idRol' });

User.hasOne(Cliente, { foreignKey: 'idUsuario', as: 'clienteInfo' });
Cliente.belongsTo(User, { foreignKey: 'idUsuario' });

Role.belongsToMany(Permiso, { through: RolPermiso, foreignKey: 'idRol', otherKey: 'idPermiso', as: 'permisos' });
Permiso.belongsToMany(Role, { through: RolPermiso, foreignKey: 'idPermiso', otherKey: 'idRol' });

Insumo.belongsTo(CategoriaInsumo, { foreignKey: 'idCategoriaInsumo', as: 'categoria' });
CategoriaInsumo.hasMany(Insumo, { foreignKey: 'idCategoriaInsumo' });

Insumo.belongsTo(Proveedor, { foreignKey: 'idProveedor', as: 'proveedor' });
Proveedor.hasMany(Insumo, { foreignKey: 'idProveedor' });

Proveedor.belongsTo(TipoProveedor, { foreignKey: 'idTipoProveedor', as: 'tipoProveedor' });
Proveedor.belongsTo(TipoDocumento, { foreignKey: 'idTipoDocumento', as: 'tipoDocumento' });

InsumoPreparado.hasMany(DetalleInsumoPreparadoInsumo, { foreignKey: 'idPreparado', as: 'detalles' });
DetalleInsumoPreparadoInsumo.belongsTo(InsumoPreparado, { foreignKey: 'idPreparado' });
DetalleInsumoPreparadoInsumo.belongsTo(Insumo, { foreignKey: 'idInsumo', as: 'insumo' });

Trazabilidad.belongsTo(Insumo, { foreignKey: 'idInsumo', as: 'insumo' });
Trazabilidad.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

Product.belongsTo(CategoriaProducto, { foreignKey: 'idCategoriaProducto', as: 'categoriaProducto' });
CategoriaProducto.hasMany(Product, { foreignKey: 'idCategoriaProducto' });

Venta.belongsTo(Cliente, { foreignKey: 'idCliente', as: 'cliente' });
Venta.belongsTo(User, { foreignKey: 'idUsuario', as: 'usuario' });
Venta.hasMany(DetalleVentaProducto, { foreignKey: 'idVenta', as: 'detalles' });
DetalleVentaProducto.belongsTo(Venta, { foreignKey: 'idVenta' });

FichaTecnica.hasMany(DetalleFichaInsumo, { foreignKey: 'idFichaTecnica', as: 'detalles' });
DetalleFichaInsumo.belongsTo(FichaTecnica, { foreignKey: 'idFichaTecnica' });
DetalleFichaInsumo.belongsTo(Insumo, { foreignKey: 'idInsumo', as: 'insumo' });
FichaTecnica.belongsTo(Product, { foreignKey: 'idProducto', as: 'producto' });
FichaTecnica.belongsTo(Insumo, { foreignKey: 'idInsumo', as: 'insumoInfo' });

Compra.belongsTo(Proveedor, { foreignKey: 'idProveedor', as: 'proveedor' });
Proveedor.hasMany(Compra, { foreignKey: 'idProveedor' });
Compra.hasMany(DetalleCompraInsumo, { foreignKey: 'idCompra', as: 'detalles' });
DetalleCompraInsumo.belongsTo(Compra, { foreignKey: 'idCompra' });
DetalleCompraInsumo.belongsTo(Insumo, { foreignKey: 'idInsumo', as: 'insumo' });


const Evento = sequelize.define('evento', {
  idEvento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idEvento'
  },
  id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.idEvento;
    }
  },
  nombreEvento: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaFin: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, { tableName: 'evento', timestamps: false });

module.exports = {
  sequelize,
  Role,
  Permiso,
  RolPermiso,
  User,
  Cliente,
  CategoriaInsumo,
  TipoProveedor,
  TipoDocumento,
  Proveedor,
  Insumo,
  InsumoPreparado,
  DetalleInsumoPreparadoInsumo,
  Trazabilidad,
  Product,
  CategoriaProducto,
  Venta,
  DetalleVentaProducto,
  FichaTecnica,
  DetalleFichaInsumo,
  Compra,
  DetalleCompraInsumo,
  Evento
};
