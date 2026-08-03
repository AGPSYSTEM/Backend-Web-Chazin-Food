const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Chazin Food API (Layered Architecture)',
    version: '2.0.0',
    description: 'Documentación interactiva de la API RESTful de Chazin Food estructurada en Arquitectura por Capas con Sequelize ORM.',
    contact: {
      name: 'Soporte Chazin Food'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor Local Monolítico'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Introduce el token JWT devuelto en el login con el formato: Bearer [token]'
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/presentation/routes/*.js', './src/infrastructure/swagger/swagger.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec
};

/**
 * @swagger
 * /api/autenticacion/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación & Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contrasena
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@chazinfood.com
 *               contrasena:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token JWT y los datos del usuario.
 *       401:
 *         description: Credenciales incorrectas o cuenta inactiva.
 * 
 * /api/autenticacion/registro:
 *   post:
 *     summary: Registrar un nuevo usuario (Rol Cliente por defecto)
 *     tags: [Autenticación & Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUsuario
 *               - nombre
 *               - apellidos
 *               - email
 *               - contrasena
 *             properties:
 *               idUsuario:
 *                 type: integer
 *                 description: Número de documento de identidad del usuario
 *                 example: 1033183034
 *               nombre:
 *                 type: string
 *                 example: Alexis
 *               apellidos:
 *                 type: string
 *                 example: Gómez Pavas
 *               tipoDocumento:
 *                 type: string
 *                 example: C.C.
 *               email:
 *                 type: string
 *                 example: gomezpavas34@gmail.com
 *               contrasena:
 *                 type: string
 *                 example: 1033183034
 *               telefono:
 *                 type: string
 *                 example: 3023155969
 *               direccion:
 *                 type: string
 *                 example: Calle 10 # 5-20
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 * 
 * /api/autenticacion/recuperar-contrasena:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Autenticación & Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: gomezpavas34@gmail.com
 *     responses:
 *       200:
 *         description: Instrucciones de restablecimiento enviadas por email.
 * 
 * /api/autenticacion/restablecer-contrasena:
 *   post:
 *     summary: Restablecer contraseña con token JWT
 *     tags: [Autenticación & Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - email
 *               - contrasena
 *             properties:
 *               token:
 *                 type: string
 *               email:
 *                 type: string
 *                 example: gomezpavas34@gmail.com
 *               contrasena:
 *                 type: string
 *                 example: NuevaContrase123
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente.
 * 
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Autenticación & Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios del sistema.
 *   post:
 *     summary: Crear un nuevo usuario administrativamente
 *     tags: [Autenticación & Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documento
 *               - nombre
 *               - apellidos
 *               - email
 *               - password
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "1099888777"
 *               nombre:
 *                 type: string
 *                 example: "Carlos"
 *               apellidos:
 *                 type: string
 *                 example: "López"
 *               email:
 *                 type: string
 *                 example: "carlos@chazinfood.com"
 *               password:
 *                 type: string
 *                 example: "carlos123"
 *               idRolStr:
 *                 type: string
 *                 example: "2"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 * 
 * /api/usuarios/{idUsuario}:
 *   put:
 *     summary: Actualizar usuario existente
 *     tags: [Autenticación & Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *   delete:
 *     summary: Inactivar/Eliminar usuario
 *     tags: [Autenticación & Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario inactivado exitosamente.
 * 
 * /api/productos:
 *   get:
 *     summary: Obtener catálogo de productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente.
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Hamburguesa Especial"
 *               precio:
 *                 type: number
 *                 example: 18000
 *               descripcion:
 *                 type: string
 *                 example: "Carne artesanal, queso cheddar y tocineta"
 *               idCategoria:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Producto creado correctamente.
 * 
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *   put:
 *     summary: Actualizar producto por ID
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente.
 *   delete:
 *     summary: Eliminar producto por ID
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente.
 * 
 * /api/pedidos:
 *   get:
 *     summary: Obtener lista de pedidos
 *     tags: [Pedidos & Ventas]
 *     responses:
 *       200:
 *         description: Lista de pedidos registrados.
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags: [Pedidos & Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - total
 *               - items
 *             properties:
 *               total:
 *                 type: number
 *                 example: 25000
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Pedido registrado exitosamente.
 * 
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtener detalle del pedido por ID
 *     tags: [Pedidos & Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del pedido.
 * 
 * /api/pedidos/{id}/status:
 *   put:
 *     summary: Cambiar estado del pedido (Pendiente, En Preparación, Entregado, Cancelado)
 *     tags: [Pedidos & Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "En Preparación"
 *     responses:
 *       200:
 *         description: Estado de pedido actualizado correctamente.
 * 
 * /api/categorias:
 *   get:
 *     summary: Obtener categorías de productos
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías.
 *   post:
 *     summary: Crear una categoría de producto
 *     tags: [Categorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Comidas Rápidas"
 *     responses:
 *       201:
 *         description: Categoría creada.
 * 
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtener categoría por ID
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada.
 *   put:
 *     summary: Actualizar categoría
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría actualizada.
 *   delete:
 *     summary: Eliminar categoría
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente.
 *       400:
 *         description: No se puede eliminar la categoría porque tiene productos asociados.
 * 
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles con sus permisos asociados
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles del sistema.
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Auxiliar de Cocina
 *               descripcion:
 *                 type: string
 *                 example: Apoyo en preparación de insumos
 *     responses:
 *       201:
 *         description: Rol creado exitosamente.
 * 
 * /api/roles/{idRol}:
 *   put:
 *     summary: Actualizar un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: idRol
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente.
 *   delete:
 *     summary: Eliminar un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: idRol
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol eliminado correctamente.
 * 
 * /api/roles/{idRol}/permisos:
 *   put:
 *     summary: Actualizar los permisos asociados a un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: idRol
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permisos
 *             properties:
 *               permisos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Dashboard", "Productos", "Fichas Técnicas"]
 *     responses:
 *       200:
 *         description: Permisos actualizados exitosamente.
 * 
 * /api/insumos:
 *   get:
 *     summary: Obtener lista de insumos activos
 *     tags: [Insumos & Inventario]
 *     responses:
 *       200:
 *         description: Lista de insumos activos obtenida exitosamente.
 *   post:
 *     summary: Crear un nuevo insumo
 *     tags: [Insumos & Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - idCategoriaInsumo
 *               - stock
 *               - unidadMedida

 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Harina de Trigo
 *               idCategoriaInsumo:
 *                 type: integer
 *                 example: 1
 *               stock:
 *                 type: number
 *                 example: 50
 *               unidadMedida:
 *                 type: string
 *                 example: kg
 *               precioUnitario:
 *                 type: number
 *                 example: 1200.00
 *     responses:
 *       201:
 *         description: Insumo creado correctamente.
 * 
 * /api/insumos/deleted:
 *   get:
 *     summary: Obtener lista de insumos eliminados (papelera)
 *     tags: [Insumos & Inventario]
 *     responses:
 *       200:
 *         description: Lista de insumos eliminados en la papelera.
 * 
 * /api/insumos/{id}:
 *   get:
 *     summary: Obtener insumo por ID
 *     tags: [Insumos & Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insumo encontrado.
 *   put:
 *     summary: Actualizar un insumo existente
 *     tags: [Insumos & Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insumo actualizado correctamente.
 *   delete:
 *     summary: Eliminar lógicamente un insumo (mover a papelera)
 *     tags: [Insumos & Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insumo eliminado correctamente.
 * 
 * /api/insumos/{id}/restore:
 *   put:
 *     summary: Restaurar un insumo eliminado de la papelera
 *     tags: [Insumos & Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insumo restaurado correctamente.
 * 
 * /api/insumos/{id}/permanent:
 *   delete:
 *     summary: Eliminar permanentemente un insumo de la papelera
 *     tags: [Insumos & Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insumo eliminado permanentemente.
 * 
 * /api/categorias-insumo:
 *   get:
 *     summary: Obtener categorías de insumos
 *     tags: [Insumos & Inventario]
 *     responses:
 *       200:
 *         description: Lista de categorías de insumos.
 *   post:
 *     summary: Crear categoría de insumo
 *     tags: [Insumos & Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Cárnicos"
 *     responses:
 *       201:
 *         description: Categoría de insumo creada.
 * 
 * /api/categorias-insumo/{id}:
 *   get:
 *     summary: Obtener categoría de insumo por ID
 *     tags: [Insumos & Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada.
 *   put:
 *     summary: Actualizar categoría de insumo
 *     tags: [Insumos & Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría actualizada.
 *   delete:
 *     summary: Eliminar categoría de insumo
 *     tags: [Insumos & Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada.
 * 
 * /api/insumos-preparados:
 *   get:
 *     summary: Obtener lista de insumos preparados activos
 *     tags: [Insumos Preparados & Producción]
 *     responses:
 *       200:
 *         description: Lista de insumos preparados activos.
 *   post:
 *     summary: Crear un nuevo insumo preparado con componentes
 *     tags: [Insumos Preparados & Producción]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - unidadMedida
 *               - precioVenta

 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Salsa Boloñesa Casa
 *               unidadMedida:
 *                 type: string
 *                 example: L
 *               precioVenta:
 *                 type: number
 *                 example: 15000.00
 *     responses:
 *       201:
 *         description: Insumo preparado creado correctamente.
 * 
 * /api/insumos-preparados/deleted:
 *   get:
 *     summary: Obtener lista de insumos preparados eliminados (papelera)
 *     tags: [Insumos Preparados & Producción]
 *     responses:
 *       200:
 *         description: Lista de insumos preparados eliminados.
 * 
 * /api/insumos-preparados/{id}:
 *   put:
 *     summary: Actualizar un insumo preparado existente
 *     tags: [Insumos Preparados & Producción]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insumo preparado actualizado correctamente.
 *   delete:
 *     summary: Eliminar lógicamente un insumo preparado
 *     tags: [Insumos Preparados & Producción]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insumo preparado eliminado lógicamente.
 * 
 * /api/proveedores:
 *   get:
 *     summary: Obtener lista de proveedores
 *     tags: [Proveedores]
 *     responses:
 *       200:
 *         description: Lista de proveedores.
 *   post:
 *     summary: Crear nuevo proveedor
 *     tags: [Proveedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Distribuidora de Carnes S.A.S."
 *               telefono:
 *                 type: string
 *                 example: "3001234567"
 *               email:
 *                 type: string
 *                 example: "contacto@distcarnes.com"
 *     responses:
 *       201:
 *         description: Proveedor registrado exitosamente.
 * 
 * /api/proveedores/{id}:
 *   get:
 *     summary: Obtener proveedor por ID
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor encontrado.
 *   put:
 *     summary: Actualizar proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor actualizado.
 *   delete:
 *     summary: Eliminar proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor eliminado exitosamente.
 *       400:
 *         description: No se puede eliminar porque tiene insumos o compras asociadas.
 * 
 * /api/proveedores/{id}/estado:
 *   put:
 *     summary: Cambiar estado del proveedor (Activar/Inactivar)
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "Activo"
 *     responses:
 *       200:
 *         description: Estado del proveedor actualizado exitosamente.
 * 
 * /api/trazabilidad:
 *   get:
 *     summary: Obtener historial de movimientos de trazabilidad
 *     tags: [Trazabilidad & Auditoría]
 *     responses:
 *       200:
 *         description: Historial de movimientos de stock / auditoría.
 *   post:
 *     summary: Registrar un movimiento de trazabilidad
 *     tags: [Trazabilidad & Auditoría]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - descripcion
 *             properties:
 *               tipo:
 *                 type: string
 *                 example: "Entrada Stock"
 *               descripcion:
 *                 type: string
 *                 example: "Ingreso de 20kg de carne por compra a proveedor"
 *     responses:
 *       201:
 *         description: Movimiento de trazabilidad registrado.
 *
 * /api/clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes con datos de usuario asociado.
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUsuario
 *             properties:
 *               idUsuario:
 *                 type: integer
 *                 description: ID del usuario existente que será registrado como cliente
 *                 example: 5
 *               direccion:
 *                 type: string
 *                 description: Dirección de entrega del cliente
 *                 example: "Calle 45 # 12-30, Bogotá"
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente.
 *       400:
 *         description: Datos inválidos o usuario no encontrado.
 *
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado con datos de usuario.
 *       404:
 *         description: Cliente no encontrado.
 *   put:
 *     summary: Actualizar datos de un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUsuario:
 *                 type: integer
 *                 example: 5
 *               direccion:
 *                 type: string
 *                 example: "Carrera 7 # 22-15, Medellín"
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente.
 *       404:
 *         description: Cliente no encontrado.
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a eliminar
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente.
 *       404:
 *         description: Cliente no encontrado.
 *
 * /api/ventas:
 *   get:
 *     summary: Obtener todas las ventas
 *     tags: [Gestión de Ventas]
 *     responses:
 *       200:
 *         description: Lista de ventas con cliente, usuario y detalles de productos.
 *   post:
 *     summary: Registrar una nueva venta
 *     tags: [Gestión de Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idCliente
 *               - idUsuario
 *               - subtotal
 *               - total
 *             properties:
 *               idCliente:
 *                 type: integer
 *                 description: ID del cliente que realiza la compra
 *                 example: 1
 *               idUsuario:
 *                 type: integer
 *                 description: ID del usuario (empleado) que registra la venta
 *                 example: 2
 *               idDescuento:
 *                 type: integer
 *                 description: ID del descuento aplicado (opcional)
 *                 example: null
 *               subtotal:
 *                 type: number
 *                 description: Subtotal antes de descuento
 *                 example: 45000.00
 *               descuentoAplicado:
 *                 type: number
 *                 description: Monto del descuento aplicado
 *                 example: 5000.00
 *               total:
 *                 type: number
 *                 description: Total de la venta después de descuento
 *                 example: 40000.00
 *               estadoEntrega:
 *                 type: string
 *                 enum: [PENDIENTE, PREPARANDO, LISTO, EN_CAMINO, ENTREGADO, CANCELADO]
 *                 description: Estado de entrega inicial
 *                 example: "PENDIENTE"
 *               observaciones:
 *                 type: string
 *                 description: Notas adicionales sobre la venta
 *                 example: "Cliente solicita entrega después de las 3pm"
 *               detalles:
 *                 type: array
 *                 description: Lista de productos vendidos
 *                 items:
 *                   type: object
 *                   required:
 *                     - idVariante
 *                     - cantidad
 *                     - precioUnitario
 *                     - subtotal
 *                   properties:
 *                     idVariante:
 *                       type: integer
 *                       description: ID de la variante del producto
 *                       example: 3
 *                     cantidad:
 *                       type: integer
 *                       description: Cantidad de unidades
 *                       example: 2
 *                     precioUnitario:
 *                       type: number
 *                       description: Precio por unidad
 *                       example: 22500.00
 *                     subtotal:
 *                       type: number
 *                       description: Subtotal de la línea (cantidad × precioUnitario)
 *                       example: 45000.00
 *                     observaciones:
 *                       type: string
 *                       example: "Sin cebolla"
 *     responses:
 *       201:
 *         description: Venta registrada exitosamente con detalles.
 *       400:
 *         description: Datos de venta inválidos.
 *
 * /api/ventas/{id}:
 *   get:
 *     summary: Obtener detalle de una venta por ID
 *     tags: [Gestión de Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Detalle completo de la venta con cliente, usuario y productos.
 *       404:
 *         description: Venta no encontrada.
 *
 * /api/ventas/{id}/estado:
 *   put:
 *     summary: Actualizar el estado de entrega de una venta
 *     tags: [Gestión de Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [PENDIENTE, PREPARANDO, LISTO, EN_CAMINO, ENTREGADO, CANCELADO]
 *                 description: Nuevo estado de entrega
 *                 example: "PREPARANDO"
 *     responses:
 *       200:
 *         description: Estado de la venta actualizado exitosamente.
 *       404:
 *         description: Venta no encontrada.
 *
 * /api/ventas/{id}/cancelar:
 *   put:
 *     summary: Cancelar una venta
 *     tags: [Gestión de Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta a cancelar
 *     responses:
 *       200:
 *         description: Venta cancelada exitosamente (estado cambia a CANCELADO).
 *       404:
 *         description: Venta no encontrada.
 *
 * /api/produccion:
 *   get:
 *     summary: Obtener todas las órdenes de producción
 *     tags: [Gestión de Producción]
 *     responses:
 *       200:
 *         description: Lista de órdenes de producción registradas.
 *   post:
 *     summary: Crear una nueva orden de producción
 *     tags: [Gestión de Producción]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platilloNombre
 *               - cantidad
 *             properties:
 *               platilloNombre:
 *                 type: string
 *                 description: Nombre del platillo o receta a producir
 *                 example: "Hamburguesa Especial"
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad de porciones a producir
 *                 example: 20
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha planificada de producción
 *                 example: "2026-07-31"
 *     responses:
 *       201:
 *         description: Orden de producción creada exitosamente.
 *       400:
 *         description: Datos de la orden inválidos.
 *
 * /api/produccion/{id}:
 *   delete:
 *     summary: Eliminar una orden de producción
 *     tags: [Gestión de Producción]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden de producción a eliminar
 *     responses:
 *       200:
 *         description: Orden de producción eliminada exitosamente.
 *       404:
 *         description: Orden de producción no encontrada.
 *
 * /api/produccion/{id}/estado:
 *   put:
 *     summary: Actualizar el estado de una orden de producción
 *     tags: [Gestión de Producción]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden de producción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [Planeada, En Proceso, Finalizada, Cancelada]
 *                 description: Nuevo estado de la orden de producción
 *                 example: "En Proceso"
 *     responses:
 *       200:
 *         description: Estado de la orden actualizado exitosamente.
 *       404:
 *         description: Orden de producción no encontrada.
 *
 * /api/eventos:
 *   get:
 *     summary: Obtener la lista de todos los eventos de fichas técnicas
 *     tags: [Gestión de Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida exitosamente.
 *   post:
 *     summary: Crear un nuevo evento
 *     tags: [Gestión de Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreEvento
 *             properties:
 *               nombreEvento:
 *                 type: string
 *                 example: "Temporada de Verano — Carne extra incluida"
 *               descripcion:
 *                 type: string
 *                 example: "Evento especial de verano con ingredientes adicionales"
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-01"
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-31"
 *               estado:
 *                 type: string
 *                 example: "Activo"
 *     responses:
 *       201:
 *         description: Evento creado exitosamente.
 *
 * /api/eventos/{id}:
 *   get:
 *     summary: Obtener un evento por ID
 *     tags: [Gestión de Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del evento devueltos correctamente.
 *       404:
 *         description: Evento no encontrado.
 *   put:
 *     summary: Actualizar un evento
 *     tags: [Gestión de Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreEvento:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *               fechaFin:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evento actualizado exitosamente.
 *   delete:
 *     summary: Eliminar un evento
 *     tags: [Gestión de Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente.
 */


