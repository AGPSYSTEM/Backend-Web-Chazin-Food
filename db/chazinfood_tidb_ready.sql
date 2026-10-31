-- ==========================================
-- Chazin Food DB Dump - 100% Compatible con TiDB Cloud Serverless
-- Generado: 2026-10-30T13:56:48.907Z
-- ==========================================
USE chazinfood;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

DROP VIEW IF EXISTS `vwinventario`;
DROP VIEW IF EXISTS `vwproductos`;
DROP VIEW IF EXISTS `vwventas`;

-- --------------------------------------------------------
-- Tabla: `categoriainsumo`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categoriainsumo`;
CREATE TABLE `categoriainsumo` (
  `idCategoriaInsumo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`idCategoriaInsumo`),
  UNIQUE KEY `UK_CategoriaInsumo` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `categoriainsumo`
INSERT INTO `categoriainsumo` (`idCategoriaInsumo`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Panadería y Masas', 'Panes artesanales y bases', 1),
(2, 'Lácteos y Quesos', 'Quesos cheddar, mozzarella y mantequillas', 1),
(3, 'Verduras y Vegetales Frescos', 'Lechuga, tomate, cebolla, papas, aguacate y verduras frescas', 1),
(4, 'Salsas y Aderezos', 'Salsas de la casa, mayonesa y aderezos', 1),
(5, 'Bebidas Embotelladas', 'Gaseosas y aguas', 1),
(6, 'Salsas y Condimentos', NULL, 0),
(7, 'Carnes', 'Res, Cerdo, Frias', 0),
(8, 'Cárnicos y Proteínas', 'Carnes de res, pollo, salchichas y tocinetas', 1);

-- --------------------------------------------------------
-- Tabla: `categoriaproducto`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categoriaproducto`;
CREATE TABLE `categoriaproducto` (
  `idCategoriaProducto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  `icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idCategoriaProducto`),
  UNIQUE KEY `UK_CategoriaProducto` (`nombre`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `nombre_2` (`nombre`),
  UNIQUE KEY `nombre_3` (`nombre`),
  UNIQUE KEY `nombre_4` (`nombre`),
  UNIQUE KEY `nombre_5` (`nombre`),
  UNIQUE KEY `nombre_6` (`nombre`),
  UNIQUE KEY `nombre_7` (`nombre`),
  UNIQUE KEY `nombre_8` (`nombre`),
  UNIQUE KEY `nombre_9` (`nombre`),
  UNIQUE KEY `nombre_10` (`nombre`),
  UNIQUE KEY `nombre_11` (`nombre`),
  UNIQUE KEY `nombre_12` (`nombre`),
  UNIQUE KEY `nombre_13` (`nombre`),
  UNIQUE KEY `nombre_14` (`nombre`),
  UNIQUE KEY `nombre_15` (`nombre`),
  UNIQUE KEY `nombre_16` (`nombre`),
  UNIQUE KEY `nombre_17` (`nombre`),
  UNIQUE KEY `nombre_18` (`nombre`),
  UNIQUE KEY `nombre_19` (`nombre`),
  UNIQUE KEY `nombre_20` (`nombre`),
  UNIQUE KEY `nombre_21` (`nombre`),
  UNIQUE KEY `nombre_22` (`nombre`),
  UNIQUE KEY `nombre_23` (`nombre`),
  UNIQUE KEY `nombre_24` (`nombre`),
  UNIQUE KEY `nombre_25` (`nombre`),
  UNIQUE KEY `nombre_26` (`nombre`),
  UNIQUE KEY `nombre_27` (`nombre`),
  UNIQUE KEY `nombre_28` (`nombre`),
  UNIQUE KEY `nombre_29` (`nombre`),
  UNIQUE KEY `nombre_30` (`nombre`),
  UNIQUE KEY `nombre_31` (`nombre`),
  UNIQUE KEY `nombre_32` (`nombre`),
  UNIQUE KEY `nombre_33` (`nombre`),
  UNIQUE KEY `nombre_34` (`nombre`),
  UNIQUE KEY `nombre_35` (`nombre`),
  UNIQUE KEY `nombre_36` (`nombre`),
  UNIQUE KEY `nombre_37` (`nombre`),
  UNIQUE KEY `nombre_38` (`nombre`),
  UNIQUE KEY `nombre_39` (`nombre`),
  UNIQUE KEY `nombre_40` (`nombre`),
  UNIQUE KEY `nombre_41` (`nombre`),
  UNIQUE KEY `nombre_42` (`nombre`),
  UNIQUE KEY `nombre_43` (`nombre`),
  UNIQUE KEY `nombre_44` (`nombre`),
  UNIQUE KEY `nombre_45` (`nombre`),
  UNIQUE KEY `nombre_46` (`nombre`),
  UNIQUE KEY `nombre_47` (`nombre`),
  UNIQUE KEY `nombre_48` (`nombre`),
  UNIQUE KEY `nombre_49` (`nombre`),
  UNIQUE KEY `nombre_50` (`nombre`),
  UNIQUE KEY `nombre_51` (`nombre`),
  UNIQUE KEY `nombre_52` (`nombre`),
  UNIQUE KEY `nombre_53` (`nombre`),
  UNIQUE KEY `nombre_54` (`nombre`),
  UNIQUE KEY `nombre_55` (`nombre`),
  UNIQUE KEY `nombre_56` (`nombre`),
  UNIQUE KEY `nombre_57` (`nombre`),
  UNIQUE KEY `nombre_58` (`nombre`),
  UNIQUE KEY `nombre_59` (`nombre`),
  UNIQUE KEY `nombre_60` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `categoriaproducto`
INSERT INTO `categoriaproducto` (`idCategoriaProducto`, `nombre`, `descripcion`, `estado`, `icon`) VALUES
(0, '__SISTEMA_VARIANTE_CERO__', 'Registro técnico para fichas de insumos sin variante', 0, NULL),
(1, 'Perros Calientes', 'Perros calientes americanos y especiales con queso gratinado', 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993441/c9pne5jrmjv5po93xhhl.jpg'),
(2, 'Combos', 'Combos familiares y de pareja con papas y bebidas', 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993361/txnwutylvbhjvwhyu9vs.jpg'),
(3, 'Hamburguesas', 'Hamburguesas artesanales de res y pollo', 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993393/bjyqxmdsjyywi3vfkal2.jpg'),
(4, 'Bebidas', 'Gaseosas, jugos y bebidas refrescantes', 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993322/hy2izk0bysbya4mcdd9m.webp'),
(5, 'Salchipapas Gourmet', 'Papas a la francesa con variedad de carnes y salsas', 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788990540/umhitukfpjefhmuovzjf.avif'),
(6, 'Acompañamientos', 'Papas francesas, rústicas en casco, espirales y especialidades para acompañar', 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007803/rozvcptnxp9gg6wbxtgt.jpg');

-- --------------------------------------------------------
-- Tabla: `cliente`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `cliente`;
CREATE TABLE `cliente` (
  `idCliente` int(11) NOT NULL AUTO_INCREMENT,
  `direccion` text DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`idCliente`),
  UNIQUE KEY `UK_Cliente_Usuario` (`idUsuario`),
  KEY `IDX_ClienteUsuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `cliente`
INSERT INTO `cliente` (`idCliente`, `direccion`, `idUsuario`, `estado`) VALUES
(2, '{\"direccion\":\"Calle Falsa 123\",\"tipo\":\"VIP\",\"ciclo\":1,\"inicio\":\"2026-09-24T04:47:41.244Z\",\"vence\":\"2026-10-24T04:47:41.244Z\"}', 6, 1),
(8, '{\"direccion\":\"Calle 34B #112C - 54\",\"tipo\":\"VIP\",\"ciclo\":1,\"inicio\":\"2026-10-22T15:57:50.701Z\",\"vence\":\"2026-11-21T15:57:50.701Z\"}', 1, 1),
(16, '{\"nombre\":\"Cliente\",\"apellidos\":\"Mostrador\",\"tipo\":\"Mostrador\",\"descuentoPorcentaje\":0,\"estado\":\"Activo\"}', NULL, 1),
(17, '{\"direccion\":\"Calle Mas que real\",\"tipo\":\"Nuevo\",\"ciclo\":2,\"inicio\":\"2026-09-23T11:34:05.588Z\",\"vence\":null}', 25, 1),
(20, '{\"direccion\":\"calle E verything R\",\"tipo\":\"Nuevo\",\"descuentoPorcentaje\":0,\"nombre\":\"sofyan\",\"apellidos\":\"amrabat\",\"telefono\":\"3338977654\",\"ciclo\":0}', 26, 1),
(21, '{\"direccion\":\"Calle pripa\",\"tipo\":\"Nuevo\",\"ciclo\":1,\"inicio\":\"2026-10-06T12:26:46.761Z\",\"vence\":null}', 27, 1),
(22, '{\"direccion\":\"Calle 12 # 34-56\",\"tipo\":\"Nuevo\",\"ciclo\":1,\"inicio\":\"2026-10-18T17:44:06.052Z\",\"vence\":null}', 28, 1),
(26, '{\"direccion\":\"\",\"tipo\":\"Nuevo\",\"descuentoPorcentaje\":0,\"nombre\":\"Nuevo Cliente\",\"apellidos\":\"\",\"telefono\":\"\",\"ciclo\":0,\"foto\":null}', 32, 1),
(27, '{\"direccion\":\"\",\"tipo\":\"Nuevo\",\"descuentoPorcentaje\":0,\"nombre\":\"Pedro\",\"apellidos\":\"Jajaja\",\"telefono\":\"\",\"ciclo\":0,\"foto\":\"https://lh3.googleusercontent.com/a/ACg8ocIGFU4ouBL7lt9zWlG2aIR76fZA30Sw3ndhDlD1cxSYpYbyMA=s96-c\"}', 33, 1),
(28, '{\"direccion\":\"\",\"tipo\":\"Nuevo\",\"descuentoPorcentaje\":0,\"nombre\":\"Samuel Gutiérrez franco\",\"apellidos\":\"\",\"telefono\":\"\",\"ciclo\":0,\"foto\":\"https://lh3.googleusercontent.com/a/ACg8ocKmapNwCVpwyd7XnVj1loQQ9a43jOPDmTcBpztbkZAtZms3lti_=s96-c\"}', 34, 1);

-- --------------------------------------------------------
-- Tabla: `compra`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `compra`;
CREATE TABLE `compra` (
  `idCompra` int(11) NOT NULL AUTO_INCREMENT,
  `idProveedor` int(11) DEFAULT NULL,
  `numeroFactura` varchar(100) DEFAULT NULL,
  `fechaFactura` date DEFAULT NULL,
  `fechaCompra` datetime DEFAULT NULL,
  `total` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `iva` decimal(12,2) NOT NULL DEFAULT 0.00,
  `incluyeIva` tinyint(1) NOT NULL DEFAULT 0,
  `estado` varchar(30) NOT NULL DEFAULT 'RECIBIDA',
  `motivoCancelacion` varchar(500) DEFAULT NULL,
  `detallesCancelacion` text DEFAULT NULL,
  `usuarioCancelacionId` int(11) DEFAULT NULL,
  `fechaCancelacion` datetime DEFAULT NULL,
  PRIMARY KEY (`idCompra`),
  KEY `IDX_CompraProveedor` (`idProveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `compra`
INSERT INTO `compra` (`idCompra`, `idProveedor`, `numeroFactura`, `fechaFactura`, `fechaCompra`, `total`, `subtotal`, `iva`, `incluyeIva`, `estado`, `motivoCancelacion`, `detallesCancelacion`, `usuarioCancelacionId`, `fechaCancelacion`) VALUES
(1, 1, NULL, NULL, '2026-08-10 00:00:00', 1.00, 0.00, 0.00, 0, 'RECIBIDA', NULL, NULL, NULL, NULL),
(2, 1, NULL, NULL, '2026-08-25 00:00:00', 100000.00, 0.00, 0.00, 0, 'RECIBIDA', NULL, NULL, NULL, NULL),
(3, 7, NULL, NULL, '2026-09-17 00:00:00', 200000.00, 0.00, 0.00, 0, 'RECIBIDA', NULL, NULL, NULL, NULL),
(4, 7, NULL, NULL, '2026-09-17 00:00:00', 200000.00, 0.00, 0.00, 0, 'RECIBIDA', NULL, NULL, NULL, NULL),
(5, 3, NULL, NULL, '2026-10-02 00:00:00', 2752900.00, 0.00, 0.00, 0, 'RECIBIDA', NULL, NULL, NULL, NULL),
(8, NULL, NULL, NULL, '2026-09-24 00:00:00', 120000.00, 0.00, 0.00, 0, 'CANCELADA', 'Orden de compra duplicada', '[{\"idInsumo\":2,\"nombre\":\"salsa rosada\",\"unidadMedida\":\"paq\",\"cantidadCancelada\":12,\"subtotal\":120000,\"lotes\":[]}]', 4, '2026-09-24 12:32:13'),
(9, NULL, NULL, NULL, '2026-10-08 00:00:00', 230000.00, 0.00, 0.00, 0, 'RECIBIDA', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------
-- Tabla: `descuento`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `descuento`;
CREATE TABLE `descuento` (
  `idDescuento` int(11) NOT NULL AUTO_INCREMENT,
  `idEvento` int(11) NOT NULL,
  `nombreDescuento` varchar(120) NOT NULL,
  `tipoDescuento` enum('PORCENTAJE','VALOR FIJO') NOT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `valorFijo` decimal(10,2) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`idDescuento`),
  KEY `IDX_DescuentoEvento` (`idEvento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `descuento`
INSERT INTO `descuento` (`idDescuento`, `idEvento`, `nombreDescuento`, `tipoDescuento`, `porcentaje`, `valorFijo`, `estado`) VALUES
(1, 2, '2x1 Jueves Burger', 'PORCENTAJE', 50.00, NULL, 1),
(2, 3, '15% Descuento Finde', 'PORCENTAJE', 15.00, NULL, 1),
(3, 4, 'Combo Pareja Promo', 'VALOR FIJO', NULL, 4000.00, 1);

-- --------------------------------------------------------
-- Tabla: `detallecombo`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `detallecombo`;
CREATE TABLE `detallecombo` (
  `idDetalleCombo` int(11) NOT NULL AUTO_INCREMENT,
  `idCombo` int(11) NOT NULL,
  `idProducto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `esOpcional` tinyint(1) NOT NULL DEFAULT 0,
  `grupoSeleccion` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`idDetalleCombo`),
  KEY `idx_combo_id` (`idCombo`),
  KEY `idx_combo_prod` (`idProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Tabla: `detallecomprainsumo`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `detallecomprainsumo`;
CREATE TABLE `detallecomprainsumo` (
  `idDetalleCompra` int(11) NOT NULL AUTO_INCREMENT,
  `idCompra` int(11) NOT NULL,
  `idInsumo` int(11) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `lotes` text DEFAULT NULL,
  `numeroLote` varchar(100) DEFAULT NULL,
  `fechaVencimiento` date DEFAULT NULL,
  PRIMARY KEY (`idDetalleCompra`),
  KEY `IDX_DetalleCompra` (`idCompra`),
  KEY `IDX_DetalleCompraInsumo` (`idInsumo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `detallecomprainsumo`
INSERT INTO `detallecomprainsumo` (`idDetalleCompra`, `idCompra`, `idInsumo`, `cantidad`, `precioUnitario`, `subtotal`, `lotes`, `numeroLote`, `fechaVencimiento`) VALUES
(1, 1, 3, 10.00, 0.10, 1.00, NULL, NULL, NULL),
(2, 2, 1, 100.00, 1000.00, 100000.00, NULL, NULL, NULL),
(3, 3, 46, 100.00, 2000.00, 200000.00, NULL, NULL, NULL),
(4, 4, 46, 100.00, 2000.00, 200000.00, NULL, NULL, NULL),
(5, 5, 8, 10.00, 2790.00, 27900.00, NULL, NULL, NULL),
(6, 5, 2, 10.00, 10000.00, 100000.00, NULL, NULL, NULL),
(7, 5, 9, 10.00, 32000.00, 320000.00, NULL, NULL, NULL),
(8, 5, 10, 10.00, 200000.00, 2000000.00, NULL, NULL, NULL),
(9, 5, 13, 10.00, 1100.00, 11000.00, NULL, NULL, NULL),
(10, 5, 12, 10.00, 1400.00, 14000.00, NULL, NULL, NULL),
(11, 5, 14, 10.00, 28000.00, 280000.00, NULL, NULL, NULL),
(14, 8, 2, 12.00, 10000.00, 120000.00, NULL, NULL, NULL),
(15, 9, 44, 10.00, 5000.00, 50000.00, '[{\"numeroLote\":\"E-001\",\"cantidad\":10,\"fechaVencimiento\":\"2026-10-23\"}]', 'E-001', '2026-10-23'),
(16, 9, 39, 15.00, 12000.00, 180000.00, NULL, NULL, NULL);

-- --------------------------------------------------------
-- Tabla: `detallefichainsumo`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `detallefichainsumo`;
CREATE TABLE `detallefichainsumo` (
  `idDetalleFicha` int(11) NOT NULL AUTO_INCREMENT,
  `idFichaTecnica` int(11) NOT NULL,
  `idInsumo` int(11) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `unidadMedida` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`idDetalleFicha`),
  KEY `IDX_DetalleFichaTecnica` (`idFichaTecnica`),
  KEY `IDX_DetalleFichaInsumo` (`idInsumo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `detallefichainsumo`
INSERT INTO `detallefichainsumo` (`idDetalleFicha`, `idFichaTecnica`, `idInsumo`, `cantidad`, `unidadMedida`) VALUES
(127, 4, 12, 1.00, 'und'),
(128, 4, 14, 0.15, 'kg'),
(129, 4, 19, 1.00, 'und'),
(130, 4, 18, 0.03, 'kg'),
(131, 4, 22, 0.02, 'kg'),
(132, 4, 23, 0.03, 'kg'),
(133, 5, 12, 1.00, 'und'),
(134, 5, 14, 0.30, 'kg'),
(135, 5, 19, 2.00, 'und'),
(136, 5, 18, 0.06, 'kg'),
(137, 5, 24, 0.04, 'kg'),
(138, 6, 12, 1.00, 'und'),
(139, 6, 15, 0.18, 'kg'),
(140, 6, 20, 0.04, 'kg'),
(141, 6, 22, 0.02, 'kg'),
(142, 6, 23, 0.03, 'kg'),
(143, 7, 13, 1.00, 'und'),
(144, 7, 16, 1.00, 'und'),
(145, 7, 18, 0.03, 'kg'),
(146, 7, 20, 0.04, 'kg'),
(147, 8, 13, 1.00, 'und'),
(148, 8, 17, 1.00, 'und'),
(149, 8, 18, 0.03, 'kg'),
(150, 8, 20, 0.05, 'kg'),
(151, 8, 24, 0.03, 'kg'),
(152, 9, 21, 0.25, 'kg'),
(153, 9, 16, 1.00, 'und'),
(154, 9, 17, 1.00, 'und'),
(155, 9, 18, 0.04, 'kg'),
(156, 9, 20, 0.06, 'kg'),
(167, 13, 31, 1.00, 'und'),
(172, 18, 21, 0.15, 'kg'),
(174, 20, 21, 0.22, 'kg'),
(175, 21, 21, 0.15, 'kg'),
(176, 22, 38, 0.24, 'kg'),
(177, 23, 38, 0.16, 'kg'),
(178, 24, 42, 0.20, 'kg'),
(179, 25, 21, 0.16, 'kg'),
(180, 25, 39, 0.08, 'kg'),
(181, 25, 40, 0.04, 'kg'),
(182, 25, 43, 0.04, 'kg'),
(183, 26, 21, 0.16, 'kg'),
(184, 26, 39, 0.08, 'kg'),
(185, 26, 40, 0.04, 'kg'),
(186, 26, 43, 0.04, 'kg'),
(187, 26, 29, 1.00, 'und'),
(188, 27, 21, 0.16, 'kg'),
(189, 27, 18, 0.05, 'kg'),
(190, 27, 41, 0.04, 'kg'),
(191, 27, 43, 0.04, 'kg'),
(192, 28, 21, 0.16, 'kg'),
(193, 28, 18, 0.05, 'kg'),
(194, 28, 41, 0.04, 'kg'),
(195, 28, 43, 0.04, 'kg'),
(196, 28, 29, 1.00, 'und'),
(197, 29, 12, 1.00, 'und'),
(198, 29, 14, 0.18, 'kg'),
(199, 30, 12, 1.00, 'und'),
(200, 30, 14, 0.15, 'kg'),
(201, 30, 18, 0.04, 'kg'),
(202, 30, 19, 2.00, 'und'),
(203, 30, 24, 0.04, 'kg'),
(204, 30, 44, 0.03, 'kg'),
(205, 31, 12, 1.00, 'und'),
(206, 31, 14, 0.15, 'kg'),
(207, 31, 40, 0.05, 'kg'),
(208, 31, 25, 0.02, 'kg'),
(209, 31, 20, 0.04, 'kg'),
(210, 31, 22, 0.02, 'kg'),
(211, 32, 12, 1.00, 'und'),
(212, 32, 14, 0.15, 'kg'),
(213, 32, 20, 0.04, 'kg'),
(214, 32, 18, 0.03, 'kg'),
(215, 32, 24, 0.03, 'kg'),
(216, 32, 23, 0.03, 'kg'),
(217, 32, 22, 0.02, 'kg'),
(218, 32, 45, 0.02, 'kg'),
(219, 33, 13, 1.00, 'und'),
(220, 33, 16, 1.00, 'und'),
(221, 33, 40, 0.04, 'kg'),
(222, 33, 43, 0.03, 'kg'),
(223, 33, 18, 0.02, 'kg'),
(224, 33, 25, 0.02, 'kg'),
(225, 34, 13, 1.00, 'und'),
(226, 34, 16, 1.00, 'und'),
(227, 34, 17, 0.50, 'und'),
(228, 34, 18, 0.03, 'kg'),
(229, 34, 20, 0.04, 'kg'),
(230, 34, 41, 0.03, 'kg'),
(231, 35, 21, 0.25, 'kg'),
(232, 35, 16, 1.50, 'und'),
(233, 35, 18, 0.04, 'kg'),
(234, 35, 20, 0.05, 'kg'),
(235, 35, 41, 0.03, 'kg'),
(236, 35, 43, 0.03, 'kg'),
(237, 36, 21, 0.25, 'kg'),
(238, 36, 17, 1.50, 'und'),
(239, 36, 18, 0.04, 'kg'),
(240, 36, 20, 0.05, 'kg'),
(241, 36, 41, 0.04, 'kg'),
(242, 36, 45, 0.03, 'kg'),
(243, 37, 12, 1.00, 'und'),
(244, 37, 14, 0.15, 'kg'),
(245, 37, 19, 1.00, 'und'),
(246, 37, 18, 0.03, 'kg'),
(247, 37, 21, 0.15, 'kg'),
(248, 37, 29, 1.00, 'und'),
(249, 38, 12, 2.00, 'und'),
(250, 38, 13, 2.00, 'und'),
(251, 38, 14, 0.30, 'kg'),
(252, 38, 16, 2.00, 'und'),
(253, 38, 19, 2.00, 'und'),
(254, 38, 20, 0.08, 'kg'),
(255, 38, 18, 0.10, 'kg'),
(256, 38, 21, 0.40, 'kg'),
(257, 38, 29, 4.00, 'und'),
(258, 39, 13, 2.00, 'und'),
(259, 39, 16, 2.00, 'und'),
(260, 39, 20, 0.08, 'kg'),
(261, 39, 18, 0.06, 'kg'),
(262, 39, 21, 0.25, 'kg'),
(263, 39, 29, 2.00, 'und'),
(272, 40, 12, 1.00, 'und'),
(273, 40, 14, 0.18, 'kg'),
(274, 40, 18, 0.04, 'kg'),
(275, 40, 19, 2.00, 'und'),
(276, 40, 43, 0.03, 'kg'),
(277, 40, 45, 0.03, 'kg'),
(278, 40, 22, 0.02, 'kg'),
(279, 40, 23, 0.03, 'kg'),
(291, 11, 29, 1.00, 'und'),
(292, 14, 33, 1.00, 'und'),
(293, 15, 35, 1.00, 'und'),
(295, 12, 30, 1.00, 'und'),
(296, 16, 36, 1.00, 'und'),
(297, 17, 37, 1.00, 'und'),
(300, 49, 47, 1.00, 'und'),
(303, 50, 48, 1.00, 'und'),
(312, 51, 9, 1.00, 'Kg'),
(313, 51, 12, 1.00, 'und'),
(320, 10, 12, 2.00, 'und'),
(321, 10, 14, 0.30, 'kg'),
(322, 10, 19, 2.00, 'und'),
(323, 10, 18, 0.06, 'kg'),
(324, 10, 21, 0.20, 'kg'),
(325, 10, 29, 2.00, 'und'),
(329, 19, 32, 1.00, 'und');

-- --------------------------------------------------------
-- Tabla: `detalleinsumopreparadoinsumo`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `detalleinsumopreparadoinsumo`;
CREATE TABLE `detalleinsumopreparadoinsumo` (
  `idDetalle` int(11) NOT NULL AUTO_INCREMENT,
  `idPreparado` int(11) NOT NULL,
  `idInsumo` int(11) NOT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `unidadMedida` varchar(255) DEFAULT NULL,
  `precioUnitario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`idDetalle`),
  KEY `fk_detalle_preparado` (`idPreparado`),
  KEY `fk_detalle_insumo_normal` (`idInsumo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `detalleinsumopreparadoinsumo`
INSERT INTO `detalleinsumopreparadoinsumo` (`idDetalle`, `idPreparado`, `idInsumo`, `cantidad`, `unidadMedida`, `precioUnitario`) VALUES
(37, 1, 2, 1.00, 'paq', 800.00),
(60, 7, 28, 0.60, 'kg', 13800.00),
(61, 7, 26, 0.25, 'kg', 12500.00),
(62, 7, 27, 0.15, 'kg', 11500.00),
(63, 8, 24, 1.00, 'kg', 3900.00),
(64, 9, 14, 1.50, 'kg', 28000.00),
(76, 18, 9, 1.00, 'Kg', 0.00),
(77, 18, 12, 1.00, 'und', 0.00);

-- --------------------------------------------------------
-- Tabla: `detalleventaadicion`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `detalleventaadicion`;
CREATE TABLE `detalleventaadicion` (
  `idDetalleVentaAdicion` int(11) NOT NULL AUTO_INCREMENT,
  `idDetalleVenta` int(11) NOT NULL,
  `idAdicion` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT 1,
  `precio` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  PRIMARY KEY (`idDetalleVentaAdicion`),
  KEY `IDX_DetalleVentaAdicion` (`idDetalleVenta`),
  KEY `IDX_Adicion` (`idAdicion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `detalleventaadicion`
INSERT INTO `detalleventaadicion` (`idDetalleVentaAdicion`, `idDetalleVenta`, `idAdicion`, `cantidad`, `precio`, `subtotal`) VALUES
(8, 127, 18, 1, 3500.00, 3500.00),
(9, 134, 18, 1, 3500.00, 3500.00),
(10, 171, 19, 1, 2500.00, 2500.00),
(11, 171, 18, 1, 3500.00, 3500.00),
(12, 172, 17, 1, 2000.00, 2000.00),
(13, 175, 18, 1, 3500.00, 3500.00),
(14, 176, 18, 1, 3500.00, 3500.00),
(15, 187, 18, 1, 3500.00, 3500.00),
(16, 188, 18, 1, 3500.00, 3500.00),
(17, 199, 18, 1, 3500.00, 3500.00),
(18, 200, 18, 1, 3500.00, 3500.00),
(19, 221, 18, 1, 3500.00, 3500.00);

-- --------------------------------------------------------
-- Tabla: `detalleventaproducto`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `detalleventaproducto`;
CREATE TABLE `detalleventaproducto` (
  `idDetalleVenta` int(11) NOT NULL AUTO_INCREMENT,
  `idVenta` int(11) NOT NULL,
  `idVariante` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precioUnitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idDetalleVenta`),
  KEY `IDX_DetalleVenta` (`idVenta`),
  KEY `IDX_DetalleVentaVariante` (`idVariante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `detalleventaproducto`
INSERT INTO `detalleventaproducto` (`idDetalleVenta`, `idVenta`, `idVariante`, `cantidad`, `precioUnitario`, `subtotal`, `observaciones`) VALUES
(126, 117, 10, 1, 18000.00, 18000.00, 'Hamburguesa Clásica Chazin'),
(127, 118, 10, 2, 18000.00, 36000.00, 'Hamburguesa Clásica Chazin'),
(132, 122, 15, 1, 23000.00, 23000.00, 'Salchipapa Salvaje Gourmet'),
(133, 123, 33, 1, 15500.00, 15500.00, 'Papas con Chili Mediana'),
(134, 124, 10, 2, 18000.00, 36000.00, 'Hamburguesa Clásica Chazin'),
(135, 125, 10, 1, 18000.00, 18000.00, 'Clásica 150g'),
(136, 126, 39, 1, 22000.00, 22000.00, 'Individual BBQ Bacon 150g'),
(137, 126, 28, 4, 23500.00, 94000.00, 'Mexicana Clásica'),
(138, 126, 58, 1, 4500.00, 4500.00, 'Gaseosa Coca-Cola 400ml'),
(139, 127, 10, 1, 18000.00, 18000.00, 'Hamburguesa Clásica Chazin (Jueves 2x1 de Burger Artesanal)'),
(140, 127, 11, 1, 20000.00, 20000.00, 'Hamburguesa Doble Carne & Tocineta (20% OFF en Doble Carne & Tocineta)'),
(141, 127, 12, 1, 17500.00, 17500.00, 'Hamburguesa Pollo Crispy Gourmet (Promo Relámpago: Pollo Crispy Gourmet)'),
(142, 127, 13, 1, 11900.00, 11900.00, 'Perro Caliente Especial Americano (Super Fin de Semana Chazin (15% OFF))'),
(143, 127, 14, 1, 17000.00, 17000.00, 'Perro Suizo Chazin (Festival de Toppings: Perro Suizo + Doble Tocineta Gratis)'),
(144, 127, 15, 1, 19550.00, 19550.00, 'Salchipapa Salvaje Gourmet (Super Fin de Semana Chazin (15% OFF))'),
(145, 127, 16, 1, 34000.00, 34000.00, 'Combo Pareja Chazin (Combo Pareja Festivo)'),
(146, 127, 58, 1, 4500.00, 4500.00, 'Coca-Cola Original (400 ml)'),
(147, 127, 59, 1, 8500.00, 8500.00, 'Gaseosa Manzana Postobón (400 ml)'),
(148, 127, 10, 1, 3000.00, 3000.00, 'Agua Cristal sin Gas 600ml'),
(149, 127, 11, 1, 4000.00, 4000.00, 'Pepsi Regular (400 ml)'),
(150, 127, 12, 1, 4000.00, 4000.00, 'Gaseosa Colombiana Postobón (400 ml)'),
(151, 127, 74, 1, 8500.00, 8500.00, ' (400 ml)'),
(152, 127, 76, 1, 8500.00, 8500.00, ' (400 ml)'),
(153, 127, 26, 1, 5000.00, 5000.00, 'Porción Individual 150g'),
(154, 127, 58, 1, 4500.00, 4500.00, 'Coca-Cola Sin Azúcar / Light (400 ml)'),
(155, 127, 28, 1, 10500.00, 10500.00, 'Porción Individual'),
(156, 127, 29, 1, 8500.00, 8500.00, 'Porción Individual'),
(157, 127, 30, 1, 10500.00, 10500.00, 'Porción Individual'),
(158, 127, 31, 1, 8500.00, 8500.00, 'Porción Individual'),
(159, 127, 32, 1, 13500.00, 13500.00, 'Porción Individual'),
(160, 127, 33, 2, 15500.00, 31000.00, 'Porción Individual'),
(161, 127, 34, 1, 17500.00, 17500.00, 'Porción Individual'),
(162, 127, 34, 1, 17500.00, 17500.00, 'Porción Individual'),
(163, 127, 35, 1, 15500.00, 15500.00, 'Porción Individual'),
(164, 128, 11, 1, 20000.00, 20000.00, 'Doble Carne 300g'),
(165, 129, 11, 1, 20000.00, 20000.00, 'Doble Carne 300g'),
(166, 130, 44, 1, 16000.00, 16000.00, 'Perro Mexicano Clásico'),
(167, 130, 58, 1, 4500.00, 4500.00, 'Gaseosa Coca-Cola 400ml'),
(168, 131, 12, 1, 17500.00, 17500.00, 'Hamburguesa Pollo Crispy Gourmet (Promo Relámpago: Pollo Crispy Gourmet)'),
(169, 132, 10, 1, 18000.00, 18000.00, 'Hamburguesa Clásica Chazin (Jueves 2x1 de Burger Artesanal)'),
(170, 133, 37, 1, 24000.00, 24000.00, 'Hamburguesa Burger Fest Trufada (Chazin Burger Fest 2026 - Edicion Limitada)'),
(171, 133, 29, 2, 23000.00, 58000.00, 'Individual Campesina (+Queso Cheddar en Lonchas, Tocineta Ahumada en Tiras)'),
(172, 133, 39, 2, 22000.00, 48000.00, 'Individual BBQ Bacon 150g (+Salchicha Suiza Ahumada)'),
(173, 134, 10, 1, 18000.00, 18000.00, 'Hamburguesa Clásica Chazin (Jueves 2x1 de Burger Artesanal)'),
(174, 135, 10, 1, 18000.00, 18000.00, '¡PROMO 2x1!: Preparar 2 unidades (1 pagada + 1 gratis)'),
(175, 136, 10, 2, 18000.00, 36000.00, 'Hamburguesa Clásica Chazin'),
(176, 137, 10, 2, 18000.00, 36000.00, 'Hamburguesa Clásica Chazin'),
(177, 138, 10, 1, 15000.00, 15000.00, NULL),
(178, 139, 10, 1, 15000.00, 15000.00, NULL),
(179, 140, 10, 1, 15000.00, 15000.00, NULL),
(180, 141, 10, 1, 15000.00, 15000.00, NULL),
(181, 142, 10, 1, 15000.00, 15000.00, NULL),
(182, 143, 10, 1, 15000.00, 15000.00, NULL),
(183, 144, 10, 1, 15000.00, 15000.00, NULL),
(184, 145, 10, 1, 15000.00, 15000.00, NULL),
(185, 146, 10, 2, 15000.00, 30000.00, NULL),
(186, 146, 14, 5, 3000.00, 15000.00, NULL),
(187, 147, 10, 2, 18000.00, 36000.00, 'Hamburguesa Clásica Chazin'),
(188, 148, 10, 2, 18000.00, 36000.00, 'Hamburguesa Clásica Chazin'),
(189, 149, 10, 1, 15000.00, 15000.00, NULL),
(190, 150, 10, 1, 15000.00, 15000.00, NULL),
(191, 151, 10, 1, 15000.00, 15000.00, NULL),
(192, 152, 10, 1, 15000.00, 15000.00, NULL),
(193, 153, 10, 1, 15000.00, 15000.00, NULL),
(194, 154, 10, 1, 15000.00, 15000.00, NULL),
(195, 155, 10, 1, 15000.00, 15000.00, NULL),
(196, 156, 10, 1, 15000.00, 15000.00, NULL),
(197, 157, 10, 2, 15000.00, 30000.00, NULL),
(198, 157, 14, 5, 3000.00, 15000.00, NULL),
(199, 158, 10, 2, 18000.00, 36000.00, 'Hamburguesa Clásica Chazin'),
(200, 159, 10, 2, 18000.00, 36000.00, 'Hamburguesa Clásica Chazin'),
(201, 160, 10, 1, 15000.00, 15000.00, NULL),
(202, 161, 10, 1, 15000.00, 15000.00, NULL),
(203, 162, 10, 1, 15000.00, 15000.00, NULL),
(204, 163, 10, 1, 15000.00, 15000.00, NULL),
(205, 164, 10, 1, 15000.00, 15000.00, NULL),
(206, 165, 10, 1, 15000.00, 15000.00, NULL),
(207, 166, 10, 1, 15000.00, 15000.00, NULL),
(208, 167, 10, 1, 15000.00, 15000.00, NULL),
(209, 168, 10, 2, 15000.00, 30000.00, NULL),
(210, 168, 14, 5, 3000.00, 15000.00, NULL),
(211, 169, 10, 1, 15000.00, 15000.00, NULL),
(212, 170, 10, 1, 15000.00, 15000.00, NULL),
(213, 171, 10, 1, 15000.00, 15000.00, NULL),
(214, 172, 10, 1, 15000.00, 15000.00, NULL),
(215, 173, 10, 1, 15000.00, 15000.00, NULL),
(216, 174, 10, 1, 15000.00, 15000.00, NULL),
(217, 175, 10, 1, 15000.00, 15000.00, NULL),
(218, 176, 10, 1, 15000.00, 15000.00, NULL),
(219, 177, 10, 2, 15000.00, 30000.00, NULL),
(220, 177, 14, 5, 3000.00, 15000.00, NULL),
(221, 178, 10, 2, 18000.00, 36000.00, 'Hamburguesa Clásica Chazin'),
(222, 179, 10, 1, 100.00, 100.00, NULL),
(223, 180, 10, 1, 100.00, 100.00, NULL);

-- --------------------------------------------------------
-- Tabla: `devolucion`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `devolucion`;
CREATE TABLE `devolucion` (
  `idDevolucion` int(11) NOT NULL AUTO_INCREMENT,
  `idVenta` int(11) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `valorDevuelto` decimal(12,2) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `estado` enum('PENDIENTE','ACEPTADA','RECHAZADA') DEFAULT 'PENDIENTE',
  PRIMARY KEY (`idDevolucion`),
  KEY `IDX_DevolucionVenta` (`idVenta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Tabla: `evento`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `evento`;
CREATE TABLE `evento` (
  `idEvento` int(11) NOT NULL AUTO_INCREMENT,
  `nombreEvento` varchar(120) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fechaInicio` date DEFAULT NULL,
  `fechaFin` date DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  `idProducto` int(11) DEFAULT NULL,
  `tipoEvento` varchar(50) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `nuevoPrecio` decimal(10,2) DEFAULT NULL,
  `accionInsumo` varchar(20) DEFAULT NULL,
  `insumosAsociados` text DEFAULT NULL,
  `productosAsociados` text DEFAULT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `imagen` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idEvento`),
  KEY `idProducto` (`idProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `evento`
INSERT INTO `evento` (`idEvento`, `nombreEvento`, `descripcion`, `fechaInicio`, `fechaFin`, `estado`, `idProducto`, `tipoEvento`, `descuento`, `nuevoPrecio`, `accionInsumo`, `insumosAsociados`, `productosAsociados`, `icono`, `imagen`) VALUES
(2, 'Jueves 2x1 de Burger Artesanal', 'Paga 1 y lleva 2 Hamburguesas Clásicas todos los jueves del mes con salsas de la casa.', '2026-09-01', '2026-10-31', 1, 1, 'PROMOCION_2X1', 50.00, 18000.00, NULL, NULL, NULL, NULL, NULL),
(3, 'Super Fin de Semana Chazin (15% OFF)', '15% de descuento en todos los combos y hamburguesas por compras en línea superiores a $30.000 COP.', '2026-09-01', '2026-10-31', 1, 4, 'Descuento', 15.00, NULL, NULL, NULL, '[{\"idProducto\":1,\"nombre\":\"Hamburguesa Clásica Chazin\",\"descuento\":15},{\"idProducto\":4,\"nombre\":\"Perro Caliente Especial Americano\",\"descuento\":15},{\"idProducto\":6,\"nombre\":\"Salchipapa Salvaje Gourmet\",\"descuento\":15}]', 'serving_cloche', NULL),
(4, 'Combo Pareja Festivo', 'Combo Pareja Chazin a precio especial de $34.000 (Ahorro de $4.000) por temporada.', '2026-09-01', '2026-10-31', 1, 7, 'COMBO_ESPECIAL', 10.52, 34000.00, NULL, NULL, NULL, NULL, NULL),
(5, 'Chazin Burger Fest 2026 - Edición Limitada', 'Participante oficial en el festival gastronómico del año. Receta conmemorativa de tiempo limitado con $4.000 de ahorro directo, pan brioche artesanal y salsa trufada secreta.', '2026-09-01', '2026-10-31', 1, 26, 'EDICION_LIMITADA', 14.28, 24000.00, NULL, NULL, NULL, NULL, NULL),
(6, 'Promo Relámpago: Pollo Crispy Gourmet', 'Disfruta de nuestra crujiente pechuga de pollo apanada artesanal con salsa especial a un precio exclusivo de temporada.', '2026-09-01', '2026-10-31', 1, 3, 'Promoción Precio', 16.67, 17500.00, NULL, NULL, NULL, NULL, NULL),
(7, '20% OFF en Doble Carne & Tocineta', 'Aprovecha un 20% de descuento directo en nuestra legendaria Hamburguesa Doble Carne (300g de res seleccionada) con doble tocineta ahumada crujiente y queso cheddar fundido.', '2026-09-01', '2026-10-31', 1, 2, 'Descuento', 20.00, NULL, NULL, NULL, NULL, 'discount', NULL),
(8, 'Festival de Toppings: Perro Suizo + Doble Tocineta Gratis', 'Por tiempo limitado, tu Perro Suizo incluye adición de tocineta ahumada crujiente y queso fundido adicional sin costo extra.', '2026-09-01', '2026-10-31', 1, 5, 'Añadir Insumos', 0.00, 17000.00, 'Agregar', '[{\"idInsumo\":3,\"nombre\":\"Tocineta Ahumada\",\"cantidad\":1,\"unidadMedida\":\"porción\"},{\"idInsumo\":4,\"nombre\":\"Queso Mozzarella Fundido\",\"cantidad\":1,\"unidadMedida\":\"porción\"}]', NULL, NULL, NULL),
(9, 'Chazin Burger Fest 2026 - Edicion Limitada', 'Edición Festival', '2026-09-13', '2026-10-15', 0, 37, 'Edición Especial', 14.00, 24000.00, NULL, NULL, NULL, '', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789364357/ys2eammewmau6wxkjsxm.jpg');

-- --------------------------------------------------------
-- Tabla: `fichatecnica`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `fichatecnica`;
CREATE TABLE `fichatecnica` (
  `idFichaTecnica` int(11) NOT NULL AUTO_INCREMENT,
  `idVariante` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fechaCreacion` datetime DEFAULT NULL,
  `idProducto` int(11) DEFAULT NULL,
  `idInsumo` int(11) DEFAULT NULL,
  `tipo` varchar(20) DEFAULT 'PRODUCTO',
  `procedimiento` text DEFAULT NULL,
  `tiempoPreparacion` int(11) DEFAULT 0,
  `rendimiento` varchar(100) DEFAULT NULL,
  `especificaciones` text DEFAULT NULL,
  `caracteristicas` text DEFAULT NULL,
  `informacionNutricional` text DEFAULT NULL,
  `condicionesAlmacenamiento` text DEFAULT NULL,
  `vidaUtil` varchar(100) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`idFichaTecnica`),
  KEY `IDX_FichaTecnicaVariante` (`idVariante`),
  KEY `idProducto` (`idProducto`),
  KEY `idInsumo` (`idInsumo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `fichatecnica`
INSERT INTO `fichatecnica` (`idFichaTecnica`, `idVariante`, `descripcion`, `fechaCreacion`, `idProducto`, `idInsumo`, `tipo`, `procedimiento`, `tiempoPreparacion`, `rendimiento`, `especificaciones`, `caracteristicas`, `informacionNutricional`, `condicionesAlmacenamiento`, `vidaUtil`, `observaciones`, `estado`) VALUES
(1, 0, 'textura bien maciza y firme con olor penetrante lista para su cocción', '2026-08-18 00:58:08', NULL, 7, 'INSUMO', 'mezcle con el aji que ya esta preparado ', 20, '1 porcion ', 'coordinar bien la mezcla de la carne con el chile carolina reapper', 'textura bien maciza y firme con olor penetrante lista para su cocción', 'calorías 20000', 'temperatura ambiente en el refrigerador ajustar', '15 dias alli donde se almacena', 'altamente irritable he inflamable este chile', 0),
(2, 0, 'Textura sumamente suave, esponjosa y con alta retención de humedad. Sabor ligeramente dulce con notas características a papa y mantequilla. Color miga amarillo pálido y corteza dorada uniforme. Ausencia de magulladuras, deformaciones o desgarros en la superficie.', '2026-08-31 06:17:50', NULL, 8, 'INSUMO', 'Producto listo para el consumo. Para potenciar sus atributos en hamburguesas, se recomienda cortar por la mitad, aplicar una fina capa de mantequilla o mayonesa en las caras internas y sellar a la plancha o tostadora a fuego medio durante 1 a 2 minutos hasta dorar.', 6, '1 unidad por porción (hamburguesa).', 'Ingredientes principales: Harina de trigo fortificada, puré o fécula de papa, agua, azúcar, grasa vegetal o mantequilla, levadura, sal y mejoradores de masa.Humedad: Alta retención de humedad interna (aproximadamente entre un 32% y un 36%), lo que le otorga su suavidad característica.Dimensiones estándar (por unidad): Diámetro de 9 a 10 cm y altura de 4 a 5 cm (medidas promedio para pan de hamburguesa tipo brioche o americano).Peso promedio por unidad: Entre 60 g y 75 g según la marca comercial.Textura de la miga: Alveolado pequeño y cerrado, diseñado para soportar salsas y jugos de la carne sin desarmarse.Empaque de fábrica: Bolsa de polietileno de alta densidad con amarra plástica o sello de calor termoformado.', 'Textura sumamente suave, esponjosa y con alta retención de humedad. Sabor ligeramente dulce con notas características a papa y mantequilla. Color miga amarillo pálido y corteza dorada uniforme. Ausencia de magulladuras, deformaciones o desgarros en la superficie.', 'Por 100g (Aprox. 2 unidades): Calorías 290 kcal, proteínas 8g, carbohidratos 52g (de los cuales azúcares 6g), grasas totales 5g (saturadas 1.5g), fibra alimentaria 2g, sodio 410mg.', 'Conservar en su empaque original cerrado, en un lugar fresco, seco y protegido de la luz solar directa. Temperatura ambiente ideal entre 15°C y 25°C. Evitar zonas de alta humedad o cercanas a fuentes de calor (estufas/hornos) para prevenir el desarrollo de mohos. Una vez abierto, sellar firmemente el empaque.', '14 a 21 días cerrado a temperatura ambiente. Hasta 3 meses congelado (-18°C) en empaque hermético.', 'Contiene gluten (trigo). Puede contener trazas de ajonjolí, leche, huevo o soya debido a líneas de producción compartidas. Almacenar separado de productos químicos o de olor fuerte.', 1),
(3, 0, 'Color rojo brillante y uniforme en la carne, con grasa de color blanco o ligeramente crema. Olor fresco y característico a carne cruda, completamente libre de notas ácidas, rancias o de descomposición. Textura firme, elástica al tacto y compacta, sin presencia de exudados excesivos o consistencia viscosa.', '2026-08-31 06:24:49', NULL, 9, 'INSUMO', 'Porcionar la carne en frío (idealmente moldear las tortas de hamburguesa a temperaturas bajas para no derretir la grasa). Cocinar a la plancha, parrilla o sartén caliente hasta alcanzar una temperatura interna segura de 71°C (160°F).', 5, 'Depende del gramaje de tu receta. (Ejemplos estándar para copiar: 5 porciones de 200g por Kg o 8 por', 'Carne molida de res con un porcentaje de grasa estandarizado de 80/20 (80% magro, 20% grasa) para asegurar jugosidad. Color rojo brillante y uniforme, sin áreas oscuras o marrones. Olor fresco característico a carne cruda, libre de notas ácidas o de descomposición. Textura firme al tacto. Despachada y recibida a una temperatura de refrigeración controlada inferior o igual a 4°C.', 'Color rojo brillante y uniforme en la carne, con grasa de color blanco o ligeramente crema. Olor fresco y característico a carne cruda, completamente libre de notas ácidas, rancias o de descomposición. Textura firme, elástica al tacto y compacta, sin presencia de exudados excesivos o consistencia viscosa.', 'Por 100g: Calorías 250 kcal, proteínas 18g, carbohidratos 0g, grasas totales 20g (de las cuales saturadas 8g), colesterol 75mg, sodio 65mg.', 'Mantener bajo estricta cadena de frío en refrigeración a una temperatura entre 0°C y 4°C, alejada de alimentos cocidos para evitar contaminación cruzada. Si no se va a usar en el corto plazo, almacenar en congelación a -18°C o menos en empaque hermético.', ' 2 a 3 días en refrigeración (0°C a 4°C) desde su molienda. Hasta 6 meses en congelación profunda (-', 'Producto altamente perecedero. No recongelar carne que ya haya sido descongelada. Libre de alérgenos comunes (no contiene gluten, lácteos ni soya), a menos que el proveedor especifique aditivos en su planta.', 1),
(4, 10, 'Carne jugosa y ahumada con costra sellada, queso cheddar cremoso fundido, pan brioche esponjoso y vegetales frescos crocantes.', '2026-09-08 20:37:15', 1, NULL, 'PRODUCTO', '1. Tostar el pan brioche artesanal en plancha con un toque de mantequilla hasta dorado ligero.\n2. Sellar el medallón de carne de res 150g a 200°C por 3 minutos por lado logrando costra caramelizada.\n3. Colocar la loncha de queso cheddar sobre la carne caliente y tapar 30 segundos para fundir.\n4. Dorar las tiras de tocineta ahumada hasta dejarlas crujientes.\n5. Untar salsa Chazin en la base del pan, disponer lechuga fresca, rodajas de tomate chonto, la carne con queso fundido y la tocineta.\n6. Coronar con la tapa superior del pan y servir inmediatamente caliente.', 10, '1 porción (350g)', 'Carne con temperatura interna mínima de 71°C. Pan sellado dorado sin quemar y vegetales frescos seleccionados.', 'Carne jugosa y ahumada con costra sellada, queso cheddar cremoso fundido, pan brioche esponjoso y vegetales frescos crocantes.', 'Calorías: ~650 kcal | Proteína: 38g | Carbohidratos: 42g | Grasas: 34g', 'Consumo inmediato en mesa. Para delivery, envolver en papel térmico antigrasa y despachar en menos de 25 minutos.', 'Consumo inmediato (máx 15-20 minutos servido)', 'Contiene gluten y lactosa.', 1),
(5, 11, 'Sabor profundo a carne a la parrilla, notas dulces de cebolla caramelizada, doble queso fundido cremoso y crocancia intensa de tocineta.', '2026-09-08 20:37:15', 2, NULL, 'PRODUCTO', '1. Tostar pan brioche en plancha.\n2. Asar 2 medallones de carne de res (150g c/u) a la plancha a 200°C por 3-4 min por lado.\n3. Colocar una loncha de cheddar sobre cada medallón para fundir uniformemente.\n4. Dorar 60g de tocineta ahumada en tiras hasta que quede súper crocante.\n5. Saltear cebolla blanca en julianas a fuego lento hasta caramelizar.\n6. Montar en base de pan: salsa especial, primer medallón con cheddar, tocineta, segundo medallón con cheddar, tocineta adicional y cebolla caramelizada.\n7. Cerrar con la tapa del pan y servir caliente.', 12, '1 porción grande (540g)', 'Doble carne término 3/4 a bien cocida (mín. 71°C al centro). Queso fundido entre cada carne.', 'Sabor profundo a carne a la parrilla, notas dulces de cebolla caramelizada, doble queso fundido cremoso y crocancia intensa de tocineta.', 'Calorías: ~980 kcal | Proteína: 65g | Carbohidratos: 45g | Grasas: 58g', 'Consumo inmediato al salir de plancha. Empaque térmico individual para delivery.', 'Consumo inmediato', 'Alto valor proteico. Contiene lácteos y gluten.', 1),
(6, 12, 'Exterior crocante y dorado con interior tierno y jugoso, queso mozzarella gratinado elástico y salsa tártara cremosa.', '2026-09-08 20:37:15', 3, NULL, 'PRODUCTO', '1. Empanizar el filete de pechuga fresca 180g con mezcla crujiente sazonada.\n2. Sumergir en freidora a 175°C por 6 minutos hasta lograr dorado ámbar crocante (mínimo 74°C interno).\n3. Colocar mozzarella rallada sobre el pollo caliente y gratinar brevemente.\n4. Tostar pan brioche, untar salsa tártara artesanal en la base, poner lechuga batavia y rodajas de tomate fresco.\n5. Montar el filete de pollo crispy con queso gratinado y cubrir con la tapa de pan.', 11, '1 porción (380g)', 'Pechuga cocida completamente a mínimo 74°C interno. Exterior súper crujiente sin exceso de aceite.', 'Exterior crocante y dorado con interior tierno y jugoso, queso mozzarella gratinado elástico y salsa tártara cremosa.', 'Calorías: ~720 kcal | Proteína: 45g | Carbohidratos: 48g | Grasas: 32g', 'Servir recién preparado para preservar la textura crujiente del empanizado.', 'Consumo inmediato', 'Contiene gluten y lácteos.', 1),
(7, 13, 'Aroma ahumado característico de salchicha americana, textura crujiente de tocineta, queso elástico suave y pan tierno.', '2026-09-08 20:37:15', 4, NULL, 'PRODUCTO', '1. Calentar el pan para perro al vapor durante 2 minutos hasta textura esponjosa.\n2. Dorar la salchicha americana premium en la plancha a 180°C.\n3. Abrir el pan, colocar la salchicha caliente, añadir tocineta crocante picada.\n4. Cubrir con queso mozzarella rallado y gratinar con soplete o salamandra hasta dorar.\n5. Añadir papas chips trituradas y salsas de la casa.', 8, '1 porción (290g)', 'Salchicha cocida a 75°C mínimo. Pan suave sin humedecer en exceso y queso gratinado hilante.', 'Aroma ahumado característico de salchicha americana, textura crujiente de tocineta, queso elástico suave y pan tierno.', 'Calorías: ~540 kcal | Proteína: 22g | Carbohidratos: 36g | Grasas: 28g', 'Servir caliente en cuna de cartón antigrasa o servir inmediatamente en mesa.', 'Consumo inmediato', 'Contiene gluten, soya y derivados lácteos.', 1),
(8, 14, 'Sabor robusto y especiado de la salchicha suiza ahumada, balance dulce de la cebolla caramelizada y cremosidad del queso fundido.', '2026-09-08 20:37:15', 5, NULL, 'PRODUCTO', '1. Realizar incisiones diagonales superficiales en la salchicha suiza ahumada.\n2. Asar en la plancha a fuego medio-alto rotando para sellar y dorar parejo.\n3. Calentar el pan al vapor y colocar en la base la cebolla caramelizada dulce.\n4. Disponer la salchicha suiza sobre la cebolla, agregar tocineta picada crocante.\n5. Cubrir con 50g de mozzarella y gratinar completamente. Finalizar con salsa tártara artesanal.', 9, '1 porción (340g)', 'Salchicha suiza bien dorada por fuera y jugosa por dentro. Gratinado superior uniforme.', 'Sabor robusto y especiado de la salchicha suiza ahumada, balance dulce de la cebolla caramelizada y cremosidad del queso fundido.', 'Calorías: ~680 kcal | Proteína: 29g | Carbohidratos: 38g | Grasas: 38g', 'Consumo inmediato a temperatura caliente (>60°C). Empaque antigrasa para delivery.', 'Consumo inmediato', 'Contiene derivados cárnicos, lácteos y gluten.', 1),
(9, 15, 'Papas crujientes por fuera y suaves por dentro, abundancia de embutidos ahumados a la plancha, queso mozzarella fundido elástico y sabor intenso.', '2026-09-08 20:37:15', 6, NULL, 'PRODUCTO', '1. Freír 250g de papas a la francesa en aceite limpio a 180°C por 4-5 minutos hasta lograr crocancia dorada.\n2. Cortar en rodajas 1 salchicha americana y 1 salchicha suiza ahumada, y saltear en la plancha con tocineta picada.\n3. Escurrir bien las papas fritas y disponerlas como cama uniforme en la bandeja o plato hondo.\n4. Distribuir encima la mezcla caliente de salchichas y tocineta crocante.\n5. Cubrir con lluvia generosa de queso mozzarella (60g) y gratinar hasta que funda y dore ligeramente.\n6. Acompañar con salsas Chazin de la casa.', 12, '1 porción generosa (560g)', 'Papas crujientes sin exceso de aceite. Carnes bien doradas en plancha y queso fundido uniforme.', 'Papas crujientes por fuera y suaves por dentro, abundancia de embutidos ahumados a la plancha, queso mozzarella fundido elástico y sabor intenso.', 'Calorías: ~890 kcal | Proteína: 35g | Carbohidratos: 68g | Grasas: 52g', 'Servir caliente recién preparado. En delivery usar recipiente con ventilación para evitar que el vapor ablande las papas.', 'Consumo inmediato (máximo 20 min para mantener crujiente)', 'Alérgenos: Lácteos. Libre de gluten en papas y salchichas estándar.', 1),
(10, 16, 'Variedad completa gourmet: carnes jugosas selladas a punto, queso derretido, papas crocantes recién fritas y bebidas burbujeantes frías.', '2026-09-08 20:37:15', 7, NULL, 'PRODUCTO', '1. Sellar 2 carnes de res 150g en plancha a 200°C con tocineta y fundir 1 loncha de cheddar en cada una.\n2. Tostar 2 panes brioche y armar las 2 hamburguesas clásicas completas.\n3. Freír 200g de papas a la francesa a 180°C hasta que queden doradas y crocantes.\n4. Servir en bandeja compartida las dos hamburguesas, la porción de papas al centro y entregar con 2 botellas de gaseosa bien frías.', 14, '2 personas (1.6 kg combo)', 'Sincronizar la salida de ambas hamburguesas y las papas fritas para servir simultáneamente calientes junto a las bebidas frías.', 'Variedad completa gourmet: carnes jugosas selladas a punto, queso derretido, papas crocantes recién fritas y bebidas burbujeantes frías.', 'Calorías: ~1800 kcal total combo (900 kcal por persona aprox.)', 'Servir de inmediato en mesa o empaque doble térmico con separador para bebidas frías.', 'Consumo inmediato', 'Contiene gluten, lácteos y cafeína en gaseosas.', 1),
(11, 58, 'Bebida carbonatada refrescante, color caramelo oscuro brillante, aroma dulce especiado clásico con alta efervescencia.', '2026-09-08 20:37:15', 8, NULL, 'PRODUCTO', '1. Retirar del refrigerador de bebidas manteniendo temperatura controlada entre 2°C y 4°C.\n2. Verificar precinto de seguridad y limpieza del envase.\n3. Servir cerrada o entregar con vaso con hielo según solicitud del cliente.', 1, '1 porción (400ml)', 'Bebida fría entre 2°C y 4°C. Envase PET sellado de fábrica sin abolladuras.', 'Bebida carbonatada refrescante, color caramelo oscuro brillante, aroma dulce especiado clásico con alta efervescencia.', 'Calorías: 170 kcal | Carbohidratos: 42g | Azúcares: 42g | Sodio: 45mg', 'Refrigeración constante entre 2°C y 6°C en lugar seco y protegido de la luz solar directa.', 'Según fecha de vencimiento en envase (6 a 9 meses)', 'Contiene cafeína. No agitar antes de abrir.', 1),
(12, 59, 'Color rosado translúcido característico, sabor dulce y frutal a manzana roja, gasificación media-alta refrescante.', '2026-09-08 20:37:15', 9, NULL, 'PRODUCTO', '1. Tomar de la nevera a temperatura entre 2°C y 4°C.\n2. Inspeccionar que la tapa y sello estén intactos.\n3. Entregar fría al comensal con pitillo o vaso con hielo según preferencia.', 1, '1 porción (400ml)', 'Fría a 2°C - 4°C, envase original con precinto de seguridad intacto.', 'Color rosado translúcido característico, sabor dulce y frutal a manzana roja, gasificación media-alta refrescante.', 'Calorías: 160 kcal | Carbohidratos: 40g | Azúcares: 40g | Sodio: 35mg', 'Mantener en refrigerador de bebidas a 2°C - 4°C. Proteger del calor y luz directa.', 'Según fecha de vencimiento en envase (6 meses)', 'Bebida azucarada sin alcohol.', 1),
(13, 19, 'Líquido transparente, incoloro, inodoro y de sabor neutro 100% puro y limpio.', '2026-09-08 20:37:15', 10, NULL, 'PRODUCTO', '1. Verificar sello de la tapa intacto y fecha de vencimiento vigente.\n2. Mantener refrigerada a 4°C o a temperatura ambiente según preferencia del cliente.\n3. Entregar botella limpia con servilleta.', 1, '1 porción (600ml)', 'Temperatura fresca o fría según preferencia del comensal. Sello de seguridad hermético sin vulnerar.', 'Líquido transparente, incoloro, inodoro y de sabor neutro 100% puro y limpio.', 'Calorías: 0 kcal | Grasas: 0g | Azúcares: 0g | Sodio: 0mg', 'Almacenar en lugar fresco, seco, ventilado y libre de olores penetrantes.', '12 meses a partir de fecha de envasado', 'Agua tratada microbiológicamente segura.', 1),
(14, 63, 'Sabor fresco y auténtico de la marca.', '2026-09-10 00:35:40', 11, NULL, 'PRODUCTO', '1. Tomar insumo de inventario refrigerado o bodega.\n2. Servir a temperatura adecuada.', 2, '1 porción (400ml)', 'Servir en óptimas condiciones.', 'Sabor fresco y auténtico de la marca.', 'Calorías: 165 kcal | Carbohidratos: 41g | Azúcares: 41g | Sodio: 35mg', 'Mantener refrigerado o a temperatura ambiente según el producto.', 'Consumo inmediato.', 'Producto garantizado de alta calidad.', 1),
(15, 66, 'Sabor fresco y auténtico de la marca.', '2026-09-10 00:35:40', 12, NULL, 'PRODUCTO', '1. Tomar insumo de inventario refrigerado o bodega.\n2. Servir a temperatura adecuada.', 2, '1 porción (400ml)', 'Servir en óptimas condiciones.', 'Sabor fresco y auténtico de la marca.', 'Calorías: 170 kcal | Carbohidratos: 43g | Azúcares: 43g | Sodio: 40mg', 'Mantener refrigerado o a temperatura ambiente según el producto.', 'Consumo inmediato.', 'Producto garantizado de alta calidad.', 1),
(16, 74, 'Sabor fresco y auténtico de la marca.', '2026-09-10 00:35:40', 13, NULL, 'PRODUCTO', '1. Tomar insumo de inventario refrigerado o bodega.\n2. Servir a temperatura adecuada.', 2, '1 porción (400ml)', 'Servir en óptimas condiciones.', 'Sabor fresco y auténtico de la marca.', 'Calorías: 155 kcal | Carbohidratos: 38g | Azúcares: 38g | Sodio: 30mg', 'Mantener refrigerado o a temperatura ambiente según el producto.', 'Consumo inmediato.', 'Producto garantizado de alta calidad.', 1),
(17, 76, 'Sabor fresco y auténtico de la marca.', '2026-09-10 00:35:40', 14, NULL, 'PRODUCTO', '1. Tomar insumo de inventario refrigerado o bodega.\n2. Servir a temperatura adecuada.', 2, '1 porción (400ml)', 'Servir en óptimas condiciones.', 'Sabor fresco y auténtico de la marca.', 'Calorías: 160 kcal | Carbohidratos: 40g | Azúcares: 40g | Sodio: 35mg', 'Mantener refrigerado o a temperatura ambiente según el producto.', 'Consumo inmediato.', 'Producto garantizado de alta calidad.', 1),
(18, 26, 'Porción generosa de 150g de papas a la francesa corte delgado doradas y crujientes con sal marina.', '2026-09-10 00:35:40', 15, NULL, 'PRODUCTO', '1. Tomar insumo de inventario refrigerado o bodega.\n2. Servir a temperatura adecuada.', 2, '1 porción (150g)', 'Servir en óptimas condiciones.', 'Sabor fresco y auténtico de la marca.', 'Calorías: 380 kcal | Carbohidratos: 48g | Grasas: 18g | Proteína: 4g', 'Mantener refrigerado o a temperatura ambiente según el producto.', 'Consumo inmediato.', 'Producto garantizado de alta calidad.', 1),
(19, 78, 'Sabor dulce característico de Coca-Cola sin calorías.', '2026-09-10 02:36:47', 16, NULL, 'PRODUCTO', '1. Retirar del refrigerador a temperatura controlada (2°C - 4°C).\n2. Destapar y servir con vaso y servilletas.', 1, '1 botella (400ml)', 'Bebida sin azúcar gasificada en envase sellado.', 'Sabor dulce característico de Coca-Cola sin calorías.', 'Calorías: 0 kcal, Azúcares: 0g, Sodio: 25mg.', 'Mantener refrigerado entre 2°C y 6°C.', '6 meses en envase cerrado.', 'Verificar fecha de caducidad.', 1),
(20, 28, 'Las papas más crocantes: porción grande (220g) de papas corte tradicional delgadas, doradas a la perfección y sazonadas con sal marina.', '2026-09-10 02:36:47', 17, NULL, 'PRODUCTO', '1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 3 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.', 3, '1 porción grande (220g)', 'Papas corte 7x7mm doradas y ultra crocantes, temperatura interior >75°C.', 'Exterior crujiente, interior esponjoso con sal marina fina.', 'Calorías: 450 kcal, Carbohidratos: 58g, Grasas: 20g, Proteína: 4g.', 'Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.', 'Consumo inmediato caliente (máx 15 minutos).', 'Verificar temperatura de aceite a 175°C antes de ingresar el producto.', 1),
(21, 29, 'Las papas más crocantes: porción mediana (150g) de papas corte tradicional delgadas doradas, para acompañar lo que más te gusta.', '2026-09-10 02:36:47', 18, NULL, 'PRODUCTO', '1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 3 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.', 3, '1 porción mediana (150g)', 'Papas corte tradicional delgadas doradas a 175°C por 3 minutos.', 'Crocantes, doradas con sal marina homogénea.', 'Calorías: 310 kcal, Carbohidratos: 40g, Grasas: 14g, Proteína: 3g.', 'Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.', 'Consumo inmediato caliente (máx 15 minutos).', 'Verificar temperatura de aceite a 175°C antes de ingresar el producto.', 1),
(22, 30, 'Las papas en cascos más crocantes: porción grande (240g) de papas rústicas con piel, sazonadas con paprika, romero y sal marina.', '2026-09-10 02:36:47', 19, NULL, 'PRODUCTO', '1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.', 4, '1 porción grande (240g)', 'Cascos de papa con piel dorada crujiente y centro suave.', 'Sabor rústico especiado con corteza crocante.', 'Calorías: 420 kcal, Carbohidratos: 55g, Grasas: 18g, Proteína: 5g.', 'Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.', 'Consumo inmediato caliente (máx 15 minutos).', 'Verificar temperatura de aceite a 175°C antes de ingresar el producto.', 1),
(23, 31, 'Las papas en cascos más crocantes: porción mediana (160g) de papas rústicas con piel dorada y especias de la casa.', '2026-09-10 02:36:47', 20, NULL, 'PRODUCTO', '1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.', 4, '1 porción mediana (160g)', 'Cascos rústicos dorados a 175°C durante 4 minutos.', 'Rústicas, crujientes con especias naturales.', 'Calorías: 290 kcal, Carbohidratos: 38g, Grasas: 12g, Proteína: 3.5g.', 'Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.', 'Consumo inmediato caliente (máx 15 minutos).', 'Verificar temperatura de aceite a 175°C antes de ingresar el producto.', 1),
(24, 32, 'Papas en espiral continua (200g), doradas al punto justo y sazonadas con paprika ahumada, sal marina y finas hierbas para acompañar lo que más te gusta.', '2026-09-10 02:36:47', 21, NULL, 'PRODUCTO', '1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.', 4, '1 brocheta / porción espiral (200g)', 'Corte en espiral continuo y uniforme, textura ultra crocante tipo chip.', 'Textura crujiente en cada aro, sazón gourmet.', 'Calorías: 380 kcal, Carbohidratos: 48g, Grasas: 17g, Proteína: 4g.', 'Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.', 'Consumo inmediato caliente (máx 15 minutos).', 'Verificar temperatura de aceite a 175°C antes de ingresar el producto.', 1),
(25, 33, 'Porción de 160g de papas crocantes bañadas con abundante chili con carne de res artesanal, guacamole fresco y queso cheddar fundido.', '2026-09-10 02:36:47', 22, NULL, 'PRODUCTO', '1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.', 4, '1 canastilla cargada (320g total)', 'Papas calientes cubiertas con chili artesanal (80g), guacamole (40g) y cheddar fundido (40g).', 'Combinación explosiva de texturas crocante, cremosa y queso fundido caliente.', 'Calorías: 680 kcal, Carbohidratos: 62g, Grasas: 34g, Proteína: 22g.', 'Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.', 'Consumo inmediato caliente (máx 15 minutos).', 'Verificar temperatura de aceite a 175°C antes de ingresar el producto.', 1),
(26, 34, 'Porción de 160g de papas con chili con carne, guacamole fresco y queso cheddar fundido + Gaseosa o bebida 400ml a elección.', '2026-09-10 02:36:47', 23, NULL, 'PRODUCTO', '1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.', 4, '1 combo individual completo', 'Papas con chili, guacamole y cheddar fundido acompañadas de bebida 400ml sellada.', 'Combo completo de acompañamiento premium con bebida refrescante.', 'Calorías: 820 kcal, Carbohidratos: 95g, Grasas: 34g, Proteína: 22g.', 'Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.', 'Consumo inmediato caliente (máx 15 minutos).', 'Verificar temperatura de aceite a 175°C antes de ingresar el producto.', 1),
(27, 35, 'Porción de 160g de papas crocantes coronadas con tocineta ahumada crujiente en trozos, suero costeño tradicional y abundante queso cheddar fundido.', '2026-09-10 02:36:47', 24, NULL, 'PRODUCTO', '1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.', 4, '1 canastilla cargada (300g total)', 'Papas calientes cubiertas con tocineta crocante (50g), suero costeño (40g) y cheddar fundido (40g).', 'Sabor ahumado, salado crujiente y cremoso con el toque auténtico del suero.', 'Calorías: 690 kcal, Carbohidratos: 56g, Grasas: 38g, Proteína: 20g.', 'Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.', 'Consumo inmediato caliente (máx 15 minutos).', 'Verificar temperatura de aceite a 175°C antes de ingresar el producto.', 1),
(28, 36, 'Porción de 160g de papas con tocineta ahumada crocante, suero costeño y queso cheddar fundido + Gaseosa o bebida 400ml a elección.', '2026-09-10 02:36:47', 25, NULL, 'PRODUCTO', '1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.', 4, '1 combo individual completo', 'Papas con tocineta, suero costeño y queso cheddar fundido + bebida fría 400ml.', 'Combo completo de acompañamiento tocineta con bebida refrescante.', 'Calorías: 830 kcal, Carbohidratos: 89g, Grasas: 38g, Proteína: 20g.', 'Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.', 'Consumo inmediato caliente (máx 15 minutos).', 'Verificar temperatura de aceite a 175°C antes de ingresar el producto.', 1),
(29, 37, 'Ficha técnica oficial de preparación para Burger Fest 2026', '2026-09-10 03:30:38', 26, NULL, 'PRODUCTO', 'Hamburguesa de autor con carne premium angus 200g, queso brie fundido, reducción de champiñones al tartufo y pan brioche artesanal dorado.', 14, '1 hamburguesa gourmet (430g)', 'Pan brioche sellado, carne 200g, queso brie, salsa trufada especial Chazin.', NULL, 'Calorías: ~790 kcal | Proteína: 44g | Carbohidratos: 48g | Grasas: 46g', NULL, NULL, NULL, 1),
(30, 39, 'Carne artesanal de res 150g a la parrilla bañada en abundante salsa BBQ ahumada, tocineta ahumada crujiente, doble queso cheddar fundido, cebolla caramelizada y pan brioche artesanal dorado con mantequilla.', '2026-09-12 01:43:01', 27, NULL, 'PRODUCTO', '1. Tostar el pan brioche artesanal en plancha con mantequilla por 1 min.\n2. Sellar la carne 150g a 200°C por 3 min por lado.\n3. Glasear la carne con salsa BBQ ahumada y colocar dos lonchas de queso cheddar hasta fundir.\n4. Dorar la tocineta hasta que quede crujiente.\n5. Montar en la base del pan la cebolla caramelizada, la carne glaseada con cheddar, la tocineta y cerrar.', 10, '1 porción', 'Carne jugosa término 3/4 o bien cocida a mínimo 71°C. Salsa BBQ brillante.', 'Sabor intenso ahumado, dulce y salado con textura crocante.', 'Calorías: ~780 kcal | Proteína: 42g | Carbohidratos: 48g | Grasas: 44g', 'Servicio en caliente inmediato.', 'Consumo inmediato (máximo 15 min en mesa)', 'Receta e insumos estandarizados Chazin Food.', 1),
(31, 41, '150g de carne de res 80/20, guacamole fresco artesanal, rodajas de jalapeños picantes, queso mozzarella fundido, lechuga batavia fresca y salsa de la casa en pan brioche suave.', '2026-09-12 01:43:01', 28, NULL, 'PRODUCTO', '1. Dorar suavemente el pan brioche.\n2. Asar la carne 150g a punto perfecto.\n3. Fundir queso mozzarella sobre la carne con campana de vapor.\n4. Untar abundante guacamole fresco en la base del pan, poner la cama de lechuga fresca, montar la carne con queso y coronar con rodajas de jalapeño.', 10, '1 porción', 'Guacamole preparado fresco del día, no oxidado.', 'Equilibrio perfecto entre cremosidad del guacamole y toque picante del jalapeño.', 'Calorías: ~720 kcal | Proteína: 39g | Carbohidratos: 40g | Grasas: 41g', 'Servir recién montada.', 'Consumo inmediato', 'Receta e insumos estandarizados Chazin Food.', 1),
(32, 43, 'Carne de res 150g a la plancha con queso mozzarella gratinado, tocineta ahumada crujiente, cebolla blanca salteada, rodajas de tomate chonto fresco, lechuga batavia y salsa tártara artesanal.', '2026-09-12 01:43:01', 29, NULL, 'PRODUCTO', '1. Sellar carne de res y fundir mozzarella encima.\n2. Saltear cebolla blanca hasta punto cristalino.\n3. Montar base con salsa tártara casera, lechuga, tomate, carne con queso, tocineta crocante y cebolla salteada.', 11, '1 porción', 'Verduras frescas seleccionadas y tocineta bien dorada.', 'Sabor tradicional hogareño y balance vegetal fresco.', 'Calorías: ~690 kcal | Proteína: 40g | Carbohidratos: 38g | Grasas: 38g', 'Servir de inmediato.', 'Consumo inmediato', 'Receta e insumos estandarizados Chazin Food.', 1),
(33, 44, 'Pan tierno de perro americano con salchicha americana premium dorada a la plancha, guacamole fresco artesanal, salsa de queso cheddar fundido, tocineta crujiente picada y rodajas de jalapeños.', '2026-09-12 01:43:01', 30, NULL, 'PRODUCTO', '1. Calentar pan al vapor.\n2. Dorar salchicha americana en plancha.\n3. Colocar salchicha en el pan, bañar con salsa de queso cheddar fundido y guacamole artesanal.\n4. Espolvorear tocineta crujiente y coronar con jalapeños.', 8, '1 porción', 'Pan caliente y suave, salchicha bien caliente.', 'Sabores vivos estilo tex-mex.', 'Calorías: ~560 kcal | Proteína: 21g | Grasas: 31g', 'Servir recién elaborado.', 'Consumo inmediato', 'Receta e insumos estandarizados Chazin Food.', 1),
(34, 45, 'Pan suave americano con salchicha americana y salchicha suiza ahumada, lluvia de tocineta crocante, queso mozzarella gratinado al soplete y cremoso suero costeño artesanal.', '2026-09-12 01:43:01', 31, NULL, 'PRODUCTO', '1. Dorar salchicha americana y trozos de salchicha suiza.\n2. Montar en pan caliente, cubrir con queso mozzarella y gratinar.\n3. Agregar lluvia de tocineta crocante y terminar con hilo de suero costeño cremoso.', 8, '1 porción', 'Queso fundido elástico y tocineta crocante.', 'Toque auténtico colombiano con suero costeño artesanal.', 'Calorías: ~610 kcal | Proteína: 27g | Grasas: 36g', 'Servir caliente.', 'Consumo inmediato', 'Receta e insumos estandarizados Chazin Food.', 1),
(35, 46, 'Cama abundante de papas a la francesa corte delgado doradas y crujientes, rodajas de salchicha americana doradita, tocineta crujiente, queso mozzarella gratinado, salsa de queso cheddar fundido y suero costeño.', '2026-09-12 01:43:01', 32, NULL, 'PRODUCTO', '1. Freír 250g de papas a la francesa a 180°C hasta que estén crujientes y doradas.\n2. Saltear rodajas de salchicha americana y tocineta en la plancha.\n3. Servir papas, colocar salchichas y tocineta, cubrir con mozzarella y gratinar con soplete.\n4. Bañar con salsa cheddar y toques de suero costeño.', 12, '1 porción abundante', 'Papas secas y crocantes, servir inmediatamente para evitar que el queso enfríe.', 'Generosa, quesuda y crocante.', 'Calorías: ~840 kcal | Proteína: 31g | Grasas: 48g', 'Consumo inmediato.', 'Consumo inmediato', 'Receta e insumos estandarizados Chazin Food.', 1),
(36, 48, 'Papas a la francesa doraditas con salchicha suiza ahumada en rodajas, generosa capa de suero costeño tradicional, tocineta ahumada picada, queso mozzarella gratinado y salsa tártara de la casa.', '2026-09-12 01:43:01', 33, NULL, 'PRODUCTO', '1. Freír papas a 180°C.\n2. Dorar en plancha la salchicha suiza ahumada.\n3. Servir cama de papas, colocar la salchicha suiza, fundir mozzarella y bañar con suero costeño abundante y salsa tártara artesanal.', 12, '1 porción grande', 'Sabor ahumado característico de la salchicha suiza.', 'Combinación tradicional costeña con frescura láctea.', 'Calorías: ~890 kcal | Proteína: 34g | Grasas: 52g', 'Servir recién salida.', 'Consumo inmediato', 'Receta e insumos estandarizados Chazin Food.', 1),
(37, 49, 'El combo ideal para disfrutar solo: 1 Hamburguesa Clásica Chazin (150g de carne de res, queso cheddar, tocineta crocante) + Porción individual de Papas a la Francesa (150g) + 1 Gaseosa 400ml bien fría a elección.', '2026-09-12 01:43:01', 34, NULL, 'PRODUCTO', '1. Armar Hamburguesa Clásica en pan brioche con carne 150g, queso cheddar y tocineta.\n2. Freír 150g de papas a la francesa crujientes.\n3. Servir en bandeja combo con bebida fría seleccionada.', 12, '1 persona', 'Todo caliente y listo para entregar al mismo tiempo.', 'Almuerzo o cena completa e individual.', 'Calorías: ~1050 kcal total combo', 'Servicio en caliente con bebida fría.', 'Consumo inmediato', 'Receta e insumos estandarizados Chazin Food.', 1),
(38, 52, 'El banquete perfecto para compartir con familia o amigos: 2 Hamburguesas Clásicas Chazin + 2 Perros Calientes Especiales Americanos + 2 Porciones grandes de Papas a la Francesa (400g total) + 4 Gaseosas 400ml.', '2026-09-12 01:43:01', 35, NULL, 'PRODUCTO', '1. Elaborar simultáneamente las 2 Hamburguesas Clásicas y los 2 Perros Especiales.\n2. Freír 400g de papas a la francesa en freidora hasta dorar.\n3. Disponer todo en bandeja familiar o empaque de fiesta con salsas y las 4 bebidas frías.', 16, '4 personas', 'Coordinar cocina para que todas las preparaciones salgan a la misma temperatura.', 'Máximo ahorro y variedad para 4 comensales.', 'Calorías: ~3600 kcal total combo', 'Servir inmediatamente.', 'Consumo inmediato', 'Receta e insumos estandarizados Chazin Food.', 1),
(39, 53, 'Diseñado para dos: 2 Perros Calientes Especiales Americanos con queso mozzarella fundido y tocineta crocante + Porción doble de Papas Francesas crujientes (250g) + 2 Gaseosas frías 400ml.', '2026-09-12 01:43:01', 36, NULL, 'PRODUCTO', '1. Asar 2 salchichas americanas y calentar los panes.\n2. Montar perros con tocineta picada y queso mozzarella gratinado.\n3. Servir con 250g de papas francesas calientes y 2 bebidas.', 10, '2 personas', 'Servir en conjunto.', 'Dúo delicioso de perros americanos con papas.', 'Calorías: ~1650 kcal total', 'Consumo inmediato.', 'Consumo inmediato', 'Receta e insumos estandarizados Chazin Food.', 1),
(40, 55, 'Aroma ahumado y trufado intenso, textura crocante en tocineta y cremosidad en cheddar fundido.', '2026-09-14 04:54:05', 37, NULL, 'PRODUCTO', '1. Sellar y caramelizar la carne de res 80/20 a la plancha a 200°C por 3 minutos por lado, sazonando con sal marina y pimienta negra.\n2. Fundir las 2 lonchas de queso cheddar sobre la carne durante el último minuto con campana de vapor.\n3. Dorar la tocineta ahumada hasta lograr un crocante perfecto.\n4. Tostar el pan brioche artesanal con mantequilla clarificada.\n5. Untar salsa tártara trufada, disponer lechuga batavia y tomate fresco.\n6. Montar carne con cheddar, tocineta crocante y bañar con salsa cheddar fundido.', 12, '1 hamburguesa gourmet (430g)', 'Carne 100% res 80/20 certificada, pan brioche artesanal, temperatura de servicio > 74°C.', 'Aroma ahumado y trufado intenso, textura crocante en tocineta y cremosidad en cheddar fundido.', '~780 kcal, Proteínas: 44g, Grasas: 42g, Carbohidratos: 48g', 'Refrigeración de insumos 0°C a 4°C. Servir caliente de inmediato.', 'Consumo inmediato caliente (máx 2 horas en empaque térmico)', 'Edición conmemorativa del Chazin Burger Fest 2026.', 1),
(41, 0, 'Color naranja brillante', '2026-09-22 16:41:09', NULL, 10, 'INSUMO_PREPARADO', 'Integrar con batidor a 60°C por 8 minutos', 8, '15 frascos de 250ml', 'Ph 4.2 - Textura semi-densa', 'Color naranja brillante', 'Bajo en sodio', 'Refrigerar a 4°C', '15 días', '', 1),
(42, 0, 'Color naranja brillante', '2026-09-22 16:43:26', NULL, 11, 'INSUMO_PREPARADO', 'Integrar con batidor a 60°C por 8 minutos', 8, '15 frascos de 250ml', 'Ph 4.2 - Textura semi-densa', 'Color naranja brillante', 'Bajo en sodio', 'Refrigerar a 4°C', '15 días', '', 1),
(43, 0, 'Color naranja brillante', '2026-09-22 16:43:49', NULL, 12, 'INSUMO_PREPARADO', 'Integrar con batidor a 60°C por 8 minutos', 8, '15 frascos de 250ml', 'Ph 4.2 - Textura semi-densa', 'Color naranja brillante', 'Bajo en sodio', 'Refrigerar a 4°C', '15 días', '', 1),
(44, 0, 'Color naranja brillante', '2026-09-22 16:47:05', NULL, 13, 'INSUMO_PREPARADO', 'Integrar con batidor a 60°C por 8 minutos', 8, '15 frascos de 250ml', 'Ph 4.2 - Textura semi-densa', 'Color naranja brillante', 'Bajo en sodio', 'Refrigerar a 4°C', '15 días', '', 1),
(45, 0, 'Color naranja brillante', '2026-09-22 17:45:34', NULL, 14, 'INSUMO_PREPARADO', 'Integrar con batidor a 60°C por 8 minutos', 8, '15 frascos de 250ml', 'Ph 4.2 - Textura semi-densa', 'Color naranja brillante', 'Bajo en sodio', 'Refrigerar a 4°C', '15 días', '', 1),
(46, 0, 'Color naranja brillante', '2026-09-22 17:46:35', NULL, 15, 'INSUMO_PREPARADO', 'Integrar con batidor a 60°C por 8 minutos', 8, '15 frascos de 250ml', 'Ph 4.2 - Textura semi-densa', 'Color naranja brillante', 'Bajo en sodio', 'Refrigerar a 4°C', '15 días', '', 1),
(47, 0, 'Color naranja brillante', '2026-09-22 18:06:23', NULL, 16, 'INSUMO_PREPARADO', 'Integrar con batidor a 60°C por 8 minutos', 8, '15 frascos de 250ml', 'Ph 4.2 - Textura semi-densa', 'Color naranja brillante', 'Bajo en sodio', 'Refrigerar a 4°C', '15 días', '', 1),
(48, 0, 'Color naranja brillante', '2026-09-22 18:20:52', NULL, 17, 'INSUMO_PREPARADO', 'Integrar con batidor a 60°C por 8 minutos', 8, '15 frascos de 250ml', 'Ph 4.2 - Textura semi-densa', 'Color naranja brillante', 'Bajo en sodio', 'Refrigerar a 4°C', '15 días', '', 1),
(49, 81, 'Líquido gasificado de color violeta característico, aroma frutal dulce a uva, textura efervescente y sabor dulce refrescante.', '2026-09-22 23:21:52', 38, NULL, 'PRODUCTO', '1. Retirar la botella del refrigerador verificando que esté a la temperatura adecuada.\n\n2. Limpiar el envase y comprobar el sello de seguridad de la tapa.\n\n3. Servir sellada junto con vaso con hielo (y pitillo según protocolo de mesa o entrega).', 1, '1 porción ', 'Presentación personal PET 400 ml. Servir entre 2 °C y 4 °C.', 'Líquido gasificado de color violeta característico, aroma frutal dulce a uva, textura efervescente y sabor dulce refrescante.', 'Porción 400 ml: aprox. 160 kcal, 40 g carbohidratos (azúcares), 0 g grasa, 0 g proteína, 35 mg sodio.', 'Almacenar en lugar seco, fresco y protegido de la luz solar. Mantener en vitrina refrigerada entre 2 °C y 6 °C.', 'Según fecha de vencimiento impresa en la tapa/envase (cerrada). Consumo inmediato una vez abierta.', 'No agitar antes de destapar para evitar derrames. Servir siempre bien fría.', 1),
(50, 86, 'Color naranja brillante traslúcido. Aroma cítrico dulce característico a naranja. Sabor dulce con notas cítricas y acidez equilibrada. Textura líquida carbonatada efervescente.', NULL, 39, NULL, 'PRODUCTO', '1. Retirar la botella del área de refrigeración (4°C a 8°C).\n\n2. Verificar la integridad del sello de seguridad de la tapa y la fecha de vencimiento.\n\n3. Limpiar superficialmente el exterior del envase si es necesario.\n\n4. Servir directamente sellada para consumo inmediato o entregar acompañada de un vaso con hielo y pitillo según preferencia del cliente.', 1, '1 porción', 'Contenido neto: 400 ml. Envase PET sellado herméticamente con tapa rosca. Grado de gasificación: medio-alto. Temperatura de servicio recomendada: 4°C - 8°C.', 'Color naranja brillante traslúcido. Aroma cítrico dulce característico a naranja. Sabor dulce con notas cítricas y acidez equilibrada. Textura líquida carbonatada efervescente.', 'Porción 200 ml (aprox. 2 porciones por envase): Calorías: ~80 kcal, Carbohidratos totales: ~20 g (de los cuales azúcares añadidos: ~19 g), Grasas totales: 0 g, Proteínas: 0 g, Sodio: ~35 mg.', 'Almacenar en lugar fresco, seco y limpio, alejado de la luz solar directa y fuentes de calor. Mantener refrigerado antes de servir para preservar la carbonatación.', 'Consumir antes de la fecha de vencimiento impresa en el envase (aprox. 6 meses sin abrir). Una vez a', 'Bebida lista para el consumo. No contiene alérgenos comunes (sin gluten, sin lactosa). Contiene colorantes artificiales (Tartrazina / Amarillo No. 6). Servir frío.', 1),
(51, 0, 'Salado, olor fuerte', '2026-10-07 07:35:15', NULL, 18, 'INSUMO_PREPARADO', 'Hervimos 5L de agua', 15, '1 porción', 'Amarillo, Textura Suave', 'Salado, olor fuerte', 'Calorias: 1000g, grasas trans: 50g', 'Refrigerar a 24°C', '5 dias', '', 1),
(52, 0, 'Color naranja brillante', '2026-10-20 21:18:04', NULL, 19, 'INSUMO_PREPARADO', 'Integrar con batidor a 60°C por 8 minutos', 8, '15 frascos de 250ml', 'Ph 4.2 - Textura semi-densa', 'Color naranja brillante', 'Bajo en sodio', 'Refrigerar a 4°C', '15 días', '', 1),
(53, 0, 'Color naranja brillante', '2026-10-20 21:25:09', NULL, 20, 'INSUMO_PREPARADO', 'Integrar con batidor a 60°C por 8 minutos', 8, '15 frascos de 250ml', 'Ph 4.2 - Textura semi-densa', 'Color naranja brillante', 'Bajo en sodio', 'Refrigerar a 4°C', '15 días', '', 1),
(54, 0, 'Color naranja brillante', '2026-10-20 21:37:27', NULL, 21, 'INSUMO_PREPARADO', 'Integrar con batidor a 60°C por 8 minutos', 8, '15 frascos de 250ml', 'Ph 4.2 - Textura semi-densa', 'Color naranja brillante', 'Bajo en sodio', 'Refrigerar a 4°C', '15 días', '', 1);

-- --------------------------------------------------------
-- Tabla: `insumo`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `insumo`;
CREATE TABLE `insumo` (
  `idInsumo` int(11) NOT NULL AUTO_INCREMENT,
  `idCategoriaInsumo` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `unidadMedida` varchar(255) DEFAULT NULL,
  `stock` decimal(10,2) DEFAULT 0.00,
  `stockMinimo` decimal(10,2) DEFAULT 0.00,
  `stockMaximo` decimal(10,2) NOT NULL DEFAULT 100.00,
  `fechaExpedicion` date DEFAULT NULL,
  `fechaVencimiento` date DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  `esAdicion` tinyint(1) NOT NULL DEFAULT 0,
  `precioAdicion` decimal(10,2) NOT NULL DEFAULT 0.00,
  `imagen` varchar(255) DEFAULT NULL,
  `incluyeIva` tinyint(1) NOT NULL DEFAULT 0,
  `eliminado` tinyint(4) NOT NULL DEFAULT 0,
  `precioUnitario` decimal(10,2) DEFAULT 0.00,
  `idProveedor` int(11) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idInsumo`),
  KEY `IDX_InsumoCategoria` (`idCategoriaInsumo`),
  KEY `idProveedor` (`idProveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `insumo`
INSERT INTO `insumo` (`idInsumo`, `idCategoriaInsumo`, `nombre`, `unidadMedida`, `stock`, `stockMinimo`, `stockMaximo`, `fechaExpedicion`, `fechaVencimiento`, `estado`, `esAdicion`, `precioAdicion`, `imagen`, `incluyeIva`, `eliminado`, `precioUnitario`, `idProveedor`, `descripcion`) VALUES
(1, 3, 'aguacate', 'und', 0.00, 0.00, 100.00, NULL, NULL, 0, 0, 0.00, NULL, 0, 1, 0.00, 1, NULL),
(2, 4, 'salsa rosada', 'paq', 72.00, 5.00, 100.00, '2026-08-05', '2026-08-07', 1, 1, 1500.00, 'https://img.freepik.com/psd-premium/sauce-rose-dans-recipient-vaisselle-fond-transparent-3d_503253-784.jpg', 0, 0, 10000.00, 4, ''),
(3, 1, 'samuel', 'Kg', 0.00, 5.00, 100.00, NULL, NULL, 0, 0, 0.00, NULL, 0, 1, 0.10, 1, ''),
(4, 2, 'Yeison Food', 'Unidad', 0.00, 5.00, 100.00, NULL, NULL, 0, 1, 2500.00, NULL, 0, 1, 0.00, 3, 'asdfghjkl'),
(5, 1, 'Pan de Arina', 'kg', 0.00, 5.00, 100.00, '2026-08-01', '2026-12-31', 1, 0, 0.00, NULL, 0, 1, 1200.00, 1, 'Harina refinada de trigo multipropósito'),
(6, 3, 'Alexis', 'Paquete', 0.00, 5.00, 100.00, '2026-05-26', '2026-08-26', 0, 1, 3500.00, NULL, 0, 1, 500.00, 4, 'dfghjklñ'),
(7, 8, 'Carne con carolina reapper 150g', 'Unidad', 0.00, 15.00, 100.00, '2026-08-28', '2026-08-31', 1, 0, 0.00, NULL, 0, 1, 20000.00, 6, ''),
(8, 1, 'Pan de papa', 'Gr', 80.00, 5.00, 100.00, '2026-09-21', '2026-09-14', 1, 0, 0.00, NULL, 0, 0, 2790.00, 3, 'Pan de papa gourmet'),
(9, 8, 'Carne de Res', 'Kg', 65.00, 5.00, 100.00, '2026-08-31', '2026-09-04', 1, 0, 0.00, NULL, 0, 0, 32000.00, 1, 'Carne de res premium seleccionada para la preparación de hamburguesas del restaurante. Mantener estrictamente refrigerada entre 0°C y 4°C para asegurar su frescura. Manejar bajo sistema de rotación PEPS (Primeras en Entrar, Primeras en Salir).'),
(10, 3, 'papa', 'Kg', 120.00, 5.00, 100.00, '2026-07-26', '2025-06-10', 1, 0, 0.00, NULL, 0, 0, 200000.00, 1, ''),
(11, 3, 'papa2', 'Kg', 0.00, 5.00, 100.00, '2026-08-30', '2026-09-23', 0, 0, 0.00, NULL, 0, 1, 0.00, 1, ''),
(12, 1, 'Pan Brioche Artesanal', 'und', 110.00, 20.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 1400.00, 1, 'Pan brioche con mantequilla y ajonjolí'),
(13, 1, 'Pan Perro Americano', 'und', 97.00, 15.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 1100.00, 1, 'Pan artesanal para perro caliente'),
(14, 8, 'Carne de Res Molida 80/20', 'kg', 56.27, 8.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 28000.00, 1, 'Carne 100% de res para hamburguesas'),
(15, 8, 'Pechuga de Pollo Fresca', 'kg', 29.64, 6.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 19000.00, 1, 'Filetes de pechuga fresca desmechada o crispy'),
(16, 8, 'Salchicha Americana Premium', 'und', 116.00, 20.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 1800.00, 1, 'Salchicha tipo americana para perros calientes'),
(17, 8, 'Salchicha Suiza Ahumada', 'und', 55.00, 15.00, 100.00, NULL, NULL, 1, 1, 2000.00, 'https://www.ensumesa.com/pix/ingredientes/salchichas-suizas.jpg', 0, 0, 2600.00, 1, 'Salchicha suiza artesanal ahumada'),
(18, 8, 'Tocineta Ahumada en Tiras', 'kg', 15.45, 4.00, 100.00, NULL, NULL, 1, 1, 3500.00, 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80', 0, 0, 34000.00, 1, 'Tiras de tocineta ahumada crujiente'),
(19, 2, 'Queso Cheddar en Lonchas', 'und', 188.00, 30.00, 100.00, NULL, NULL, 1, 1, 2500.00, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp', 0, 0, 700.00, 1, 'Lonchas de queso cheddar fundible'),
(20, 2, 'Queso Mozzarella Rallado', 'kg', 23.71, 5.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 25000.00, 1, 'Queso mozzarella para gratinar'),
(21, 3, 'Papas a la Francesa Corte Delgado', 'kg', 56.96, 10.00, 100.00, NULL, NULL, 1, 1, 5000.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80', 0, 0, 9800.00, 1, 'Papas prefritas congeladas corte fino'),
(22, 3, 'Lechuga Batavia Fresca', 'kg', 16.40, 3.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 4500.00, 1, 'Lechuga fresca crujiente'),
(23, 3, 'Tomate Chonto Maduro', 'kg', 17.60, 4.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 5200.00, 1, 'Tomates frescos en rodajas'),
(24, 3, 'Cebolla Cabezona Blanca', 'kg', 21.13, 4.00, 100.00, NULL, NULL, 1, 1, 2000.00, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg', 0, 0, 3900.00, 1, 'Cebolla fresca para caramelizar y aderezos'),
(25, 3, 'Jalapeños en Rodajas', 'kg', 9.98, 2.00, 100.00, NULL, NULL, 1, 1, 2000.00, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg', 0, 0, 14500.00, 1, 'Jalapeños encurtidos picantes'),
(26, 4, 'Salsa de Tomate Heinz', 'kg', 15.00, 3.00, 100.00, NULL, NULL, 1, 1, 1500.00, 'https://img.magnific.com/fotos-premium/salsa-tomate-fresca-deliciosa-tazon-fuente-blanco-paisaje-decorado-tomates_261158-2163.jpg?semt=ais_hybrid&w=740&q=80', 0, 0, 12500.00, 1, 'Salsa de tomate clásica'),
(27, 4, 'Mostaza Americana', 'kg', 10.00, 2.00, 100.00, NULL, NULL, 1, 1, 1500.00, 'https://i.blogs.es/8674ce/salsa-de-mostaza/650_1200.jpg', 0, 0, 11500.00, 1, 'Mostaza amarilla tradicional'),
(28, 4, 'Mayonesa Real', 'kg', 16.00, 3.00, 100.00, NULL, NULL, 1, 1, 1500.00, 'https://www.lasrecetasdelaura.com/wp-content/uploads/2017/05/mayonesa-cuad.jpg', 0, 0, 13800.00, 1, 'Base de mayonesa cremosa'),
(29, 5, 'Coca-Cola Original 400ml', 'und', 91.00, 24.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 2700.00, 1, 'Gaseosa Coca-Cola botella PET 400ml'),
(30, 5, 'Manzana Postobón 400ml', 'und', 70.00, 20.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 2400.00, 1, 'Gaseosa sabor Manzana Postobón 400ml'),
(31, 5, 'Agua Cristal sin Gas 500ml', 'und', 59.00, 15.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 1800.00, 1, 'Agua purificada sin gas'),
(32, 5, 'Coca-Cola Sin Azúcar / Light 400ml', 'und', 59.00, 10.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 2500.00, NULL, 'Coca-Cola Sin Azúcar / Light 400ml para venta directa'),
(33, 5, 'Pepsi Regular 400ml', 'und', 69.00, 10.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 2500.00, NULL, 'Pepsi Regular 400ml para venta directa'),
(34, 5, 'Pepsi Light / Black 400ml', 'und', 45.00, 10.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 2500.00, NULL, 'Pepsi Light / Black 400ml para venta directa'),
(35, 5, 'Gaseosa Colombiana Postobón 400ml', 'und', 64.00, 10.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 2500.00, NULL, 'Gaseosa Colombiana Postobón 400ml para venta directa'),
(36, 5, 'Gaseosa Sprite 400ml', 'und', 53.00, 10.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 2500.00, NULL, 'Gaseosa Sprite 400ml para venta directa'),
(37, 5, 'Gaseosa Cuatro Toronja 400ml', 'und', 49.00, 10.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 2500.00, NULL, 'Gaseosa Cuatro Toronja 400ml para venta directa'),
(38, 3, 'Papas Rústicas en Casco con Piel', 'kg', 49.60, 10.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 4500.00, NULL, 'Papas Rústicas en Casco con Piel para preparación de acompañamientos Chazin Food'),
(39, 8, 'Chili con Carne de Res Artesanal', 'kg', 54.76, 5.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 12000.00, NULL, 'Chili con Carne de Res Artesanal para preparación de acompañamientos Chazin Food'),
(40, 4, 'Guacamole Fresco Artesanal', 'kg', 19.84, 5.00, 100.00, NULL, NULL, 1, 1, 2500.00, 'https://www.allrecipes.com/thmb/FOHqtfrZVg0WAMdkFE3bnp7SNO4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-RM-14064-easy-guacamole-ddmfs-3x4-9e4a1eb1bb34421a99db675b53a29e53.jpg', 0, 0, 10000.00, 1, 'Guacamole Fresco Artesanal para preparación de acompañamientos Chazin Food'),
(41, 4, 'Suero Costeño Cremoso Artesanal', 'kg', 19.96, 5.00, 100.00, NULL, NULL, 1, 1, 1500.00, 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWatVVl6qluz15bRYYJReKKv3ToT_NMnO2vZcXDByPh4o7b8iXgv5JoKaH-AKgickn_oEVxMPzAyuRvaZmbZVCPRx3810PKcs2pQHAYytIEnKkNyQ4oXgwkyo-jaWzRTFY3wJdcs03S4F6_l3uL3Jom8aXi8omkLxvTqdGQ7AsyMHlVT-FgjZJzem2bKg/s16000', 0, 0, 6500.00, 1, 'Suero Costeño Cremoso Artesanal para preparación de acompañamientos Chazin Food'),
(42, 3, 'Papas Especiales para Espiral', 'kg', 34.80, 8.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 5500.00, NULL, 'Papas Especiales para Espiral para preparación de acompañamientos Chazin Food'),
(43, 4, 'Salsa de Queso Cheddar Fundido', 'kg', 29.81, 6.00, 100.00, NULL, NULL, 1, 1, 2500.00, 'https://cdn.elcocinerocasero.com/imagen/receta/1000/2025-02-20-09-43-01/salsa-de-queso-cheddar.jpeg', 0, 0, 14000.00, 1, 'Salsa de Queso Cheddar Fundido para preparación de acompañamientos Chazin Food'),
(44, 4, 'Salsa BBQ Ahumada Artesanal', 'kg', 21.94, 4.00, 100.00, NULL, NULL, 1, 1, 1500.00, 'https://http2.mlstatic.com/D_NQ_NP_935346-MCO78698224890_092024-O.webp', 0, 0, 5000.00, 1, 'Salsa BBQ Ahumada Artesanal para preparación de acompañamientos Chazin Food'),
(45, 4, 'Salsa Tártara Casera Especial', 'kg', 15.00, 4.00, 100.00, NULL, NULL, 1, 1, 1500.00, 'https://www.pasionthermomix.co/wp-content/uploads/2022/04/Captura-de-pantalla-2022-04-07-a-las-5.00.34-p.-m.-600x333.png', 0, 0, 5000.00, 1, 'Salsa Tártara Casera Especial para preparación de acompañamientos Chazin Food'),
(46, NULL, 'test', 'Kg', 397.00, 50.00, 100.00, '2026-09-16', '2026-09-30', 1, 0, 0.00, NULL, 0, 1, 2000.00, 7, 'test'),
(47, 5, 'Gaseosa Uva Postobón 400ml', 'Unidad', 48.00, 12.00, 100.00, '2026-06-22', '2028-04-30', 1, 0, 0.00, NULL, 0, 0, 2500.00, 1, 'Gaseosa sabor a uva presentación PET y sus variantes 400ml.'),
(48, 4, 'Gaseosa Naranja Postobón 400ml', 'und', 60.00, 10.00, 100.00, NULL, NULL, 1, 0, 0.00, NULL, 0, 0, 2500.00, NULL, 'Gaseosa Naranja Postobón 400ml para venta directa');

-- --------------------------------------------------------
-- Tabla: `insumopreparado`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `insumopreparado`;
CREATE TABLE `insumopreparado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precioVenta` decimal(10,2) DEFAULT 0.00,
  `unidadMedida` varchar(20) DEFAULT 'und',
  `fechaCreacion` datetime DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  `eliminado` tinyint(4) NOT NULL DEFAULT 0,
  `rendimiento` decimal(10,2) DEFAULT 1.00,
  `unidadRendimiento` varchar(255) DEFAULT 'und',
  `costoTotal` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `insumopreparado`
INSERT INTO `insumopreparado` (`id`, `nombre`, `descripcion`, `precioVenta`, `unidadMedida`, `fechaCreacion`, `estado`, `eliminado`, `rendimiento`, `unidadRendimiento`, `costoTotal`) VALUES
(1, 'salsa de la casa', 'salsa de la casa 100% artesanal', 2000.00, 'porción', '2026-07-17 11:00:45', 1, 1, 1.00, 'und', 0.00),
(2, 'Salsa Especial de la Casa', 'Receta casera', 7500.00, 'und', '2026-07-23 05:57:07', 1, 1, 1.00, 'und', 3400.00),
(3, 'Receta Especial Jalapeños', 'Con queso chedart', 10000.00, 'und', '2026-07-23 05:57:52', 0, 1, 1.00, 'und', 3400.00),
(7, 'Salsa Chazin Especial', 'Salsa exclusiva de la casa a base de mayonesa, mostaza y especias', 1500.00, 'lt', '2026-09-08 20:37:15', 1, 0, 1.00, 'lt', 8500.00),
(8, 'Cebolla Caramelizada Chazin', 'Cebolla blanca salteada a fuego lento con mantequilla y azúcar morena', 0.00, 'kg', '2026-09-08 20:37:15', 1, 0, 0.50, 'kg', 4200.00),
(9, 'Carne Sazonada Artesanal 150g', 'Porciones de 150g de carne molida 80/20 sazonada con sal marina y pimienta', 0.00, 'und', '2026-09-08 20:37:15', 1, 0, 10.00, 'und', 42000.00),
(18, 'Queso Pripra', '', 4000.00, 'Unidad', '2026-10-07 12:35:15', 1, 0, 1.00, 'und', 0.00);

-- --------------------------------------------------------
-- Tabla: `loteinsumo`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `loteinsumo`;
CREATE TABLE `loteinsumo` (
  `idLote` int(11) NOT NULL AUTO_INCREMENT,
  `idInsumo` int(11) NOT NULL,
  `idCompra` int(11) DEFAULT NULL,
  `numeroLote` varchar(100) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cantidadDisponible` decimal(10,2) NOT NULL DEFAULT 0.00,
  `fechaVencimiento` date DEFAULT NULL,
  `fechaCreacion` datetime DEFAULT current_timestamp(),
  `estado` varchar(30) DEFAULT 'ACTIVO',
  PRIMARY KEY (`idLote`),
  KEY `idx_lote_insumo` (`idInsumo`),
  KEY `idx_lote_compra` (`idCompra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `loteinsumo`
INSERT INTO `loteinsumo` (`idLote`, `idInsumo`, `idCompra`, `numeroLote`, `cantidad`, `cantidadDisponible`, `fechaVencimiento`, `fechaCreacion`, `estado`) VALUES
(2, 44, 9, 'E-001', 10.00, 10.00, '2026-10-23', '2026-10-08 12:18:46', 'ACTIVO');

-- --------------------------------------------------------
-- Tabla: `pago`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pago`;
CREATE TABLE `pago` (
  `idPago` int(11) NOT NULL AUTO_INCREMENT,
  `idVenta` int(11) NOT NULL,
  `metodoPago` varchar(50) NOT NULL,
  `referenciaExterna` varchar(120) DEFAULT NULL,
  `monto` decimal(12,2) NOT NULL,
  `fechaPago` datetime DEFAULT NULL,
  `estado` enum('PENDIENTE','APROBADO','RECHAZADO') DEFAULT 'APROBADO',
  PRIMARY KEY (`idPago`),
  KEY `IDX_PagoVenta` (`idVenta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Tabla: `pedido`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pedido`;
CREATE TABLE `pedido` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clienteId` int(11) DEFAULT NULL,
  `items` text DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(255) DEFAULT 'pendiente',
  `metodoPago` varchar(255) DEFAULT 'efectivo',
  `fechaCreacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clienteId` (`clienteId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Tabla: `permiso`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `permiso`;
CREATE TABLE `permiso` (
  `idPermiso` int(11) NOT NULL AUTO_INCREMENT,
  `nombrePermiso` varchar(255) NOT NULL,
  PRIMARY KEY (`idPermiso`),
  UNIQUE KEY `UK_Permiso` (`nombrePermiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `permiso`
INSERT INTO `permiso` (`idPermiso`, `nombrePermiso`) VALUES
(3, 'Categoría Insumos'),
(8, 'Categoría Productos'),
(13, 'Clientes'),
(2, 'Compras'),
(16, 'Configuración'),
(1, 'Dashboard'),
(10, 'Fichas Técnicas'),
(6, 'Gestión de Compras'),
(11, 'Gestión de Producción'),
(14, 'Gestión de Ventas'),
(4, 'Insumos'),
(7, 'Producción'),
(9, 'Productos'),
(5, 'Proveedores'),
(15, 'Punto de Venta'),
(18, 'Roles'),
(17, 'Usuarios'),
(19, 'Vendedor'),
(12, 'Ventas');

-- --------------------------------------------------------
-- Tabla: `producto`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `producto`;
CREATE TABLE `producto` (
  `idProducto` int(11) NOT NULL AUTO_INCREMENT,
  `idCategoriaProducto` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  `precio` decimal(10,2) DEFAULT 0.00,
  `categoria` varchar(100) DEFAULT NULL,
  `adiciones` text DEFAULT NULL,
  `configuracionCombo` text DEFAULT NULL,
  PRIMARY KEY (`idProducto`),
  KEY `IDX_ProductoCategoria` (`idCategoriaProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `producto`
INSERT INTO `producto` (`idProducto`, `idCategoriaProducto`, `nombre`, `descripcion`, `imagen`, `estado`, `precio`, `categoria`, `adiciones`, `configuracionCombo`) VALUES
(0, 0, '__SISTEMA_VARIANTE_CERO__', 'Registro técnico para fichas de insumos sin variante', NULL, 0, 0.00, '__SISTEMA_VARIANTE_CERO__', NULL, NULL),
(1, 3, 'Hamburguesa Clásica Chazin', 'Pan brioche artesanal, carne 100% res 150g, queso cheddar fundido, tocineta ahumada, lechuga fresca, tomate y salsa Chazin.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', 1, 18000.00, 'Hamburguesas', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(2, 3, 'Hamburguesa Doble Carne & Tocineta', 'Para los más exigentes: Doble carne 150g (300g total), doble queso cheddar, doble tocineta crujiente, cebolla caramelizada y salsa especial.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993620/dp1cgi2ccfh4dei1cvgb.jpg', 1, 25000.00, 'Hamburguesas', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(3, 3, 'Hamburguesa Pollo Crispy Gourmet', 'Filete de pechuga empanizada estilo sureño super crujiente, queso mozzarella gratinado, lechuga y salsa tártara de la casa.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993555/t6ugmf9ipxt69nqbhb3h.webp', 1, 21000.00, 'Hamburguesas', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(4, 1, 'Perro Caliente Especial Americano', 'Pan suave con salchicha americana premium, tocineta picada crocante, queso mozzarella fundido, papas chips trituradas y salsas.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993866/q43cttividgol6mqagkr.jpg', 1, 14000.00, 'Perros Calientes', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"}]', NULL),
(5, 1, 'Perro Suizo Chazin', 'Salchicha suiza gigante ahumada, cebolla caramelizada dulce, queso mozzarella fundido, tocineta y salsa tártara artesanal.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993817/ki0whs161s4bsrvstx7d.jpg', 1, 17000.00, 'Perros Calientes', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"}]', NULL),
(6, 5, 'Salchipapa Salvaje Gourmet', 'Abundante porción de papas a la francesa crujientes, salchicha americana, salchicha suiza ahumada, tocineta picada y lluvia de queso mozzarella.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788989658/kgt9ufaya3iobscme7rq.jpg', 1, 23000.00, 'Salchipapas Gourmet', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(7, 2, 'Combo Pareja Chazin', 'El favorito para compartir: 2 Hamburguesas Clásicas Chazin + Porción de Papas Grandes + 2 Gaseosas a elección.', 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80', 1, 38000.00, 'Combos', '[{\"idAdicion\":3,\"id\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"id\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"id\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":8,\"id\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"id\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"id\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"id\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"id\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', '{\"esCombo\":true,\"cantidadBebidas\":2,\"bebidasPermitidas\":[]}'),
(8, 4, 'Gaseosa Coca-Cola 400ml', 'Gaseosa Coca-Cola original personal 400ml en botella PET bien fría.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790135864/hynoiytmhuddsnatwcxz.png', 1, 4500.00, 'Bebidas', '[]', '{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),
(9, 4, 'Gaseosa Manzana Postobón 400ml', 'Gaseosa Manzana Postobón tradicional 400ml bien fría.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790135903/lhmojjdrn1bzp3dsz47f.png', 1, 8500.00, 'Bebidas', '[]', '{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),
(10, 4, 'Agua Cristal sin Gas 600ml', 'Agua pura sin gas en botella de 500ml.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789342838/pj5qlfpmxeddkkmjauyw.png', 1, 3000.00, 'Bebidas', '[]', '{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),
(11, 4, 'Gaseosa Pepsi 400ml', 'Gaseosa Pepsi personal 400ml en botella PET bien fría, con su inconfundible sabor burbujeante.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790135953/upv7fsv9osr2f7ap6cbn.png', 1, 8500.00, 'Bebidas', '[]', '{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),
(12, 4, 'Gaseosa Colombiana Postobón 400ml', 'La bebida de nuestra tierra: Gaseosa Colombiana Postobón tradicional 400ml refrescante.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789001495/qy8wy9igmgb0wppnjavw.png', 1, 8500.00, 'Bebidas', '[]', '{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),
(13, 4, 'Gaseosa Sprite 400ml', 'Gaseosa Sprite lima-limón 400ml, refrescante sabor cítrico y gasificación intensa.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136141/cpxa3npdfd0lyxjizicy.png', 1, 8500.00, 'Bebidas', '[]', '{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),
(14, 4, 'Gaseosa Quatro Toronja 400ml', 'Gaseosa Quatro sabor toronja cítrica 400ml, ideal para acompañar tus hamburguesas y perros.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789342730/tqchagzkgl2z1jckvyrb.png', 1, 8500.00, 'Bebidas', '[]', '{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),
(15, 6, 'Porción Papas a la Francesa (150g)', 'Porción generosa de 150g de papas a la francesa corte delgado doradas y crujientes con sal marina.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007797/oqklhyatzijula0tr7kw.jpg', 1, 5000.00, 'Acompañamientos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(16, 4, 'Gaseosa Coca-Cola Sin Azúcar / Light 400ml', 'Gaseosa Coca-Cola Sin Azúcar / Light personal 400ml en botella PET, todo el sabor original sin azúcar ni calorías.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1793062723/givdl1gp71wnqnpw4rue.png', 1, 4500.00, 'Bebidas', '[]', '{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),
(17, 6, 'Papas Corral Grandes', 'Las papas más crocantes: porción grande (220g) de papas corte tradicional delgadas, doradas a la perfección y sazonadas con sal marina.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007797/oqklhyatzijula0tr7kw.jpg', 1, 10500.00, 'Acompañamientos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(18, 6, 'Papas Corral Medianas', 'Las papas más crocantes: porción mediana (150g) de papas corte tradicional delgadas doradas, para acompañar lo que más te gusta.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007797/oqklhyatzijula0tr7kw.jpg', 1, 8500.00, 'Acompañamientos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(19, 6, 'Papas en Casco Grandes', 'Las papas en cascos más crocantes: porción grande (240g) de papas rústicas con piel, sazonadas con paprika, romero y sal marina.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007798/jehlrurcbohsfg4bxd4v.jpg', 1, 10500.00, 'Acompañamientos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(20, 6, 'Papas en Casco Medianas', 'Las papas en cascos más crocantes: porción mediana (160g) de papas rústicas con piel dorada y especias de la casa.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007798/jehlrurcbohsfg4bxd4v.jpg', 1, 8500.00, 'Acompañamientos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(21, 6, 'Papa Espiral', 'Papas en espiral continua (200g), doradas al punto justo y sazonadas con paprika ahumada, sal marina y finas hierbas para acompañar lo que más te gusta.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007799/nymnuei88w1dss2gvtft.jpg', 1, 13500.00, 'Acompañamientos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(22, 6, 'Papas con Chili Mediana', 'Porción de 160g de papas crocantes bañadas con abundante chili con carne de res artesanal, guacamole fresco y queso cheddar fundido.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007800/kima4gvqtjeb2yxjqnoi.jpg', 1, 15500.00, 'Acompañamientos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(23, 6, 'Papas con Chili Mediana + Bebida', 'Porción de 160g de papas con chili con carne, guacamole fresco y queso cheddar fundido + Gaseosa o bebida 400ml a elección.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007800/kima4gvqtjeb2yxjqnoi.jpg', 1, 17500.00, 'Acompañamientos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', '{\"esCombo\":true,\"cantidadBebidas\":1,\"bebidasPermitidas\":[]}'),
(24, 6, 'Papas con Tocineta Mediana', 'Porción de 160g de papas crocantes coronadas con tocineta ahumada crujiente en trozos, suero costeño tradicional y abundante queso cheddar fundido.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007801/rbjuwv4049ggpnzgo3p0.jpg', 1, 15500.00, 'Acompañamientos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(25, 6, 'Papas con Tocineta Mediana + Bebida', 'Porción de 160g de papas con tocineta ahumada crocante, suero costeño y queso cheddar fundido + Gaseosa o bebida 400ml a elección.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007802/daa85plkedcdsauoricw.jpg', 1, 17500.00, 'Acompañamientos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', '{\"esCombo\":true,\"cantidadBebidas\":1,\"bebidasPermitidas\":[]}'),
(26, 3, 'Hamburguesa Burger Fest Trufada Chazin (Edición Especial)', 'Creada exclusivamente para el Burger Fest 2026. 180g de carne angus madurada a la parrilla, queso gouda ahumado fundido, reducción de cebolla al vino tinto, tocineta crocante caramelizada en maple y nuestra legendaria mayonesa trufada en pan brioche dorado artesanal.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789011032/xpk8envk39i0hgpu3d5r.jpg', 1, 28000.00, NULL, '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(27, 3, 'Hamburguesa BBQ Bacon Chazin', 'Carne artesanal de res 150g a la parrilla bañada en abundante salsa BBQ ahumada, tocineta ahumada crujiente, doble queso cheddar fundido, cebolla caramelizada y pan brioche artesanal dorado con mantequilla.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', 1, 22000.00, 'Hamburguesas', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(28, 3, 'Hamburguesa Mexicana Chazin', '150g de carne de res 80/20, guacamole fresco artesanal, rodajas de jalapeños picantes, queso mozzarella fundido, lechuga batavia fresca y salsa de la casa en pan brioche suave.', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80', 1, 23500.00, 'Hamburguesas', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(29, 3, 'Hamburguesa Campesina Chazin', 'Carne de res 150g a la plancha con queso mozzarella gratinado, tocineta ahumada crujiente, cebolla blanca salteada, rodajas de tomate chonto fresco, lechuga batavia y salsa tártara artesanal.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80', 1, 23000.00, 'Hamburguesas', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(30, 1, 'Perro Caliente Mexicano', 'Pan tierno de perro americano con salchicha americana premium dorada a la plancha, guacamole fresco artesanal, salsa de queso cheddar fundido, tocineta crujiente picada y rodajas de jalapeños.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789340644/el9c094ykrqjixkm3rmm.jpg', 1, 16000.00, 'Perros Calientes', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"}]', NULL),
(31, 1, 'Perro Criollo Especial Chazin', 'Pan suave americano con salchicha americana y salchicha suiza ahumada, lluvia de tocineta crocante, queso mozzarella gratinado al soplete y cremoso suero costeño artesanal.', 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80', 1, 16500.00, 'Perros Calientes', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"}]', NULL),
(32, 5, 'Salchipapa Criolla Chazin', 'Cama abundante de papas a la francesa corte delgado doradas y crujientes, rodajas de salchicha americana doradita, tocineta crujiente, queso mozzarella gratinado, salsa de queso cheddar fundido y suero costeño.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789341834/mebbvy7zzkrpgu1yggko.jpg', 1, 21000.00, 'Salchipapas Gourmet', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', NULL);

INSERT INTO `producto` (`idProducto`, `idCategoriaProducto`, `nombre`, `descripcion`, `imagen`, `estado`, `precio`, `categoria`, `adiciones`, `configuracionCombo`) VALUES
(33, 5, 'Salchipapa Costeña Chazin', 'Papas a la francesa doraditas con salchicha suiza ahumada en rodajas, generosa capa de suero costeño tradicional, tocineta ahumada picada, queso mozzarella gratinado y salsa tártara de la casa.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789340669/zr8zn2hll1t7ytl1sj6x.jpg', 1, 22500.00, 'Salchipapas Gourmet', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]', NULL),
(34, 2, 'Combo Personal Chazin', 'El combo ideal para disfrutar solo: 1 Hamburguesa Clásica Chazin (150g de carne de res, queso cheddar, tocineta crocante) + Porción individual de Papas a la Francesa (150g) + 1 Gaseosa 400ml bien fría a elección.', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&auto=format&fit=crop&q=80', 1, 24500.00, 'Combos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', '{\"esCombo\":true,\"cantidadBebidas\":1,\"bebidasPermitidas\":[]}'),
(35, 2, 'Combo Familiar Chazin (4 Personas)', 'El banquete perfecto para compartir con familia o amigos: 2 Hamburguesas Clásicas Chazin + 2 Perros Calientes Especiales Americanos + 2 Porciones grandes de Papas a la Francesa (400g total) + 4 Gaseosas 400ml.', 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=80', 1, 68000.00, 'Combos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', '{\"esCombo\":true,\"cantidadBebidas\":4,\"bebidasPermitidas\":[]}'),
(36, 2, 'Combo Perro Amigos (2 Personas)', 'Diseñado para dos: 2 Perros Calientes Especiales Americanos con queso mozzarella fundido y tocineta crocante + Porción doble de Papas Francesas crujientes (250g) + 2 Gaseosas frías 400ml.', 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?w=600&auto=format&fit=crop&q=80', 1, 32000.00, 'Combos', '[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', '{\"esCombo\":true,\"cantidadBebidas\":2,\"bebidasPermitidas\":[]}'),
(37, 3, 'Hamburguesa Burger Fest Trufada', 'Edición especial gastronómica de tiempo limitado.', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789364357/ys2eammewmau6wxkjsxm.jpg', 1, 24000.00, NULL, '[{\"idAdicion\":3,\"id\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"id\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"id\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"id\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"id\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"id\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"id\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"id\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":11,\"id\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"id\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"id\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]', '{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),
(38, 4, 'Gaseosa sabor a uva presentación PET 400ml.', 'Bebida gaseosa refrescante sabor a uva en presentación personal PET de 400ml. Servida bien fría. Con sus variantes para compartir ', 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790137310/fxidthj8xu1nuvp0khfo.png', 1, 8500.00, 'Bebidas', '[]', '{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),
(39, 4, 'Gaseosa Naranja Postobón 400ml', 'Refrescante gaseosa sabor a naranja tradicional de Postobón. perfecta para compartir conjunto sus variantes ', '/images/drinks/images__Gaseosa_naranja_-removebg-preview.png', 1, 8500.00, 'Bebidas', '[]', '{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}');

-- --------------------------------------------------------
-- Tabla: `proveedor`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `proveedor`;
CREATE TABLE `proveedor` (
  `idProveedor` int(11) NOT NULL AUTO_INCREMENT,
  `idTipoProveedor` int(11) NOT NULL,
  `idTipoDocumento` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `numeroDocumento` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  `eliminado` tinyint(4) NOT NULL DEFAULT 0,
  `nombreContacto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idProveedor`),
  KEY `IDX_ProveedorTipo` (`idTipoProveedor`),
  KEY `IDX_ProveedorDocumento` (`idTipoDocumento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `proveedor`
INSERT INTO `proveedor` (`idProveedor`, `idTipoProveedor`, `idTipoDocumento`, `nombre`, `numeroDocumento`, `telefono`, `correo`, `direccion`, `estado`, `eliminado`, `nombreContacto`) VALUES
(1, 1, 1, 'Carnes Premium', '900.234.567-8', '604 234 5678', 'info@carnespremium.com', 'Carrera 43A #12-80, Medellín', 1, 0, 'María García'),
(2, 1, 1, 'Avícola del Sur', '900.345.678-9', '604 345 6789', 'ventas@avicolasur.com', 'Calle 10 Sur #48-20, Envigado', 1, 0, 'Carlos López'),
(3, 2, 1, 'Panadería El Trigo', '43.123.456-7', '604 567 8901', 'eltrigo@gmail.com', 'Calle 33 #70-25, Medellín', 1, 0, 'Luis Rodríguez'),
(4, 1, 1, 'Distribuidora Andina', '900.567.890-1', '604 678 9012', 'ventas@distrandina.com', 'Carrera 65 #8B-91, Medellín', 0, 0, 'Pedro Gómez'),
(5, 1, 1, 'Dstribuidora Agricola S.A.S', '900.123.456-7', '3506785679', 'contacto@empresa.com', 'Av Central #48 - 40', 0, 0, 'Carlos Mendoza'),
(6, 2, 3, 'Distribuidora Avícola San Jerónimo', '900123456-7', '3001234567', 'contacto@sanjeronimo.co', 'bla # bla CL ble ble blu blu ', 1, 0, 'Carlos Pérez Pirés'),
(7, 1, 1, 'testeo', '12312323131', '2312443312', 'tester@gmail.com', 'CR 108 C NORTE # 34 CC ESTE - 45 BARRIO BELENCITO LA TORRE', 0, 0, 'tester');

-- --------------------------------------------------------
-- Tabla: `resena`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `resena`;
CREATE TABLE `resena` (
  `idResena` int(11) NOT NULL AUTO_INCREMENT,
  `idProducto` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `puntuacion` tinyint(4) NOT NULL DEFAULT 5,
  `comentario` text DEFAULT NULL,
  `fechaResena` datetime DEFAULT current_timestamp(),
  `estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`idResena`),
  KEY `idx_resena_producto` (`idProducto`),
  KEY `idx_resena_usuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `resena`
INSERT INTO `resena` (`idResena`, `idProducto`, `idUsuario`, `puntuacion`, `comentario`, `fechaResena`, `estado`) VALUES
(2, 1, 1, 5, 'La carne estaba en su punto perfecto y el pan brioche súper suave y fresco. La tocineta crocante le da un toque fenomenal.', '2026-09-07 19:30:00', 1),
(3, 1, 2, 5, 'Poder personalizar y quitar la cebolla directamente desde la web fue excelente. La comida llegó calientita y las salsas deliciosas.', '2026-09-08 20:15:00', 1),
(4, 2, 3, 5, 'Tremenda hamburguesa, las dos carnes son jugosas y el queso cheddar bien derretido. Muy recomendada.', '2026-09-08 21:00:00', 1),
(5, 5, 1, 5, 'La salchicha suiza ahumada es de primera calidad y el queso gratinado espectacular. Excelente servicio.', '2026-09-06 14:20:00', 1);

-- --------------------------------------------------------
-- Tabla: `rol`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `rol`;
CREATE TABLE `rol` (
  `idRol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`idRol`),
  UNIQUE KEY `UK_Rol_Nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `rol`
INSERT INTO `rol` (`idRol`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Administrador', 'Acceso total', 1),
(2, 'Cocinero', 'Acceso a producción y fichas técnicas', 1),
(3, 'Vendedor', 'Módulo de Punto de Venta y Gestión Comercial', 1),
(4, 'Cliente', 'Acceso básico para realizar pedidos', 1),
(5, 'Cajero Especial', 'Atención a mostrar y cobros', 0);

-- --------------------------------------------------------
-- Tabla: `rolpermiso`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `rolpermiso`;
CREATE TABLE `rolpermiso` (
  `idRolPermiso` int(11) NOT NULL AUTO_INCREMENT,
  `idRol` int(11) NOT NULL,
  `idPermiso` int(11) NOT NULL,
  PRIMARY KEY (`idRolPermiso`),
  UNIQUE KEY `UK_Rol_Permiso` (`idRol`,`idPermiso`),
  KEY `IDX_RolPermisoRol` (`idRol`),
  KEY `IDX_RolPermisoPermiso` (`idPermiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `rolpermiso`
INSERT INTO `rolpermiso` (`idRolPermiso`, `idRol`, `idPermiso`) VALUES
(6, 1, 1),
(4, 1, 2),
(1, 1, 3),
(11, 1, 4),
(14, 1, 5),
(8, 1, 6),
(12, 1, 7),
(2, 1, 8),
(13, 1, 9),
(7, 1, 10),
(9, 1, 11),
(18, 1, 12),
(3, 1, 13),
(10, 1, 14),
(15, 1, 15),
(5, 1, 16),
(17, 1, 17),
(16, 1, 18),
(47, 2, 1),
(48, 2, 2),
(49, 2, 3),
(58, 3, 8),
(61, 3, 9),
(64, 3, 12),
(59, 3, 13),
(60, 3, 14),
(62, 3, 15),
(63, 3, 19),
(69, 5, 12),
(70, 5, 14),
(68, 5, 15);

-- --------------------------------------------------------
-- Tabla: `tipodocumento`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `tipodocumento`;
CREATE TABLE `tipodocumento` (
  `idTipoDocumento` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`idTipoDocumento`),
  UNIQUE KEY `UK_TipoDocumento` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `tipodocumento`
INSERT INTO `tipodocumento` (`idTipoDocumento`, `nombre`) VALUES
(1, 'CC'),
(2, 'CE'),
(3, 'NIT'),
(4, 'Pasaporte'),
(5, 'PPT'),
(6, 'TI');

-- --------------------------------------------------------
-- Tabla: `tipoproveedor`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `tipoproveedor`;
CREATE TABLE `tipoproveedor` (
  `idTipoProveedor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`idTipoProveedor`),
  UNIQUE KEY `UK_TipoProveedor` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `tipoproveedor`
INSERT INTO `tipoproveedor` (`idTipoProveedor`, `nombre`) VALUES
(2, 'Distribuidor'),
(3, 'Fabricante'),
(1, 'Mayorista');

-- --------------------------------------------------------
-- Tabla: `trazabilidad`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `trazabilidad`;
CREATE TABLE `trazabilidad` (
  `idTrazabilidad` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) DEFAULT NULL,
  `entidadNombre` varchar(150) DEFAULT NULL,
  `detalle` varchar(255) DEFAULT NULL,
  `leido` tinyint(4) DEFAULT 0,
  `fecha` datetime DEFAULT NULL,
  `idInsumo` int(11) DEFAULT NULL,
  `tipoMovimiento` varchar(50) DEFAULT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `usuarioId` int(11) DEFAULT NULL,
  PRIMARY KEY (`idTrazabilidad`),
  KEY `idInsumo` (`idInsumo`),
  KEY `usuarioId` (`usuarioId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `trazabilidad`
INSERT INTO `trazabilidad` (`idTrazabilidad`, `tipo`, `entidadNombre`, `detalle`, `leido`, `fecha`, `idInsumo`, `tipoMovimiento`, `cantidad`, `motivo`, `usuarioId`) VALUES
(346, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 2.00 und por Venta #136 (2x Prod #1)', 1, '2026-10-21 02:14:31', 12, 'SALIDA', 2.00, 'Venta #136', 24),
(347, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.30 kg por Venta #136 (2x Prod #1)', 1, '2026-10-21 02:14:31', 14, 'SALIDA', 0.30, 'Venta #136', 24),
(348, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 2.00 und por Venta #136 (2x Prod #1)', 1, '2026-10-21 02:14:31', 19, 'SALIDA', 2.00, 'Venta #136', 24),
(349, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.06 kg por Venta #136 (2x Prod #1)', 1, '2026-10-21 02:14:31', 18, 'SALIDA', 0.06, 'Venta #136', 24),
(350, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.04 kg por Venta #136 (2x Prod #1)', 1, '2026-10-21 02:14:31', 22, 'SALIDA', 0.04, 'Venta #136', 24),
(351, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.06 kg por Venta #136 (2x Prod #1)', 1, '2026-10-21 02:14:31', 23, 'SALIDA', 0.06, 'Venta #136', 24),
(352, 'CONSUMO_ADICION', 'Tocineta Ahumada en Tiras', 'Adición Tocineta Ahumada en Tiras (2 kg) en Venta #136', 1, '2026-10-21 02:14:32', 18, 'SALIDA', 2.00, 'Venta #136 (Adición)', 24),
(353, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 2.00 und por Venta #137 (2x Prod #1)', 1, '2026-10-21 02:17:31', 12, 'SALIDA', 2.00, 'Venta #137', 24),
(354, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.30 kg por Venta #137 (2x Prod #1)', 1, '2026-10-21 02:17:31', 14, 'SALIDA', 0.30, 'Venta #137', 24),
(355, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 2.00 und por Venta #137 (2x Prod #1)', 1, '2026-10-21 02:17:31', 19, 'SALIDA', 2.00, 'Venta #137', 24),
(356, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.06 kg por Venta #137 (2x Prod #1)', 1, '2026-10-21 02:17:31', 18, 'SALIDA', 0.06, 'Venta #137', 24),
(357, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.04 kg por Venta #137 (2x Prod #1)', 1, '2026-10-21 02:17:31', 22, 'SALIDA', 0.04, 'Venta #137', 24),
(358, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.06 kg por Venta #137 (2x Prod #1)', 1, '2026-10-21 02:17:31', 23, 'SALIDA', 0.06, 'Venta #137', 24),
(359, 'CONSUMO_ADICION', 'Tocineta Ahumada en Tiras', 'Adición Tocineta Ahumada en Tiras (2 kg) en Venta #137', 1, '2026-10-21 02:17:31', 18, 'SALIDA', 2.00, 'Venta #137 (Adición)', 24),
(360, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #138 (1x Prod #1)', 1, '2026-10-21 02:17:57', 12, 'SALIDA', 1.00, 'Venta #138', 24),
(361, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #138 (1x Prod #1)', 1, '2026-10-21 02:17:57', 14, 'SALIDA', 0.15, 'Venta #138', 24),
(362, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #138 (1x Prod #1)', 1, '2026-10-21 02:17:57', 19, 'SALIDA', 1.00, 'Venta #138', 24),
(363, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #138 (1x Prod #1)', 1, '2026-10-21 02:17:57', 18, 'SALIDA', 0.03, 'Venta #138', 24),
(364, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #138 (1x Prod #1)', 1, '2026-10-21 02:17:57', 22, 'SALIDA', 0.02, 'Venta #138', 24),
(365, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #138 (1x Prod #1)', 1, '2026-10-21 02:17:57', 23, 'SALIDA', 0.03, 'Venta #138', 24),
(366, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #139 (1x Prod #1)', 1, '2026-10-21 02:17:57', 12, 'SALIDA', 1.00, 'Venta #139', 24),
(367, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #139 (1x Prod #1)', 1, '2026-10-21 02:17:57', 14, 'SALIDA', 0.15, 'Venta #139', 24),
(368, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #139 (1x Prod #1)', 1, '2026-10-21 02:17:57', 19, 'SALIDA', 1.00, 'Venta #139', 24),
(369, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #139 (1x Prod #1)', 1, '2026-10-21 02:17:57', 18, 'SALIDA', 0.03, 'Venta #139', 24),
(370, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #139 (1x Prod #1)', 1, '2026-10-21 02:17:57', 22, 'SALIDA', 0.02, 'Venta #139', 24),
(371, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #139 (1x Prod #1)', 1, '2026-10-21 02:17:57', 23, 'SALIDA', 0.03, 'Venta #139', 24),
(372, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #140 (1x Prod #1)', 1, '2026-10-21 02:17:57', 12, 'SALIDA', 1.00, 'Venta #140', 24),
(373, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #140 (1x Prod #1)', 1, '2026-10-21 02:17:57', 14, 'SALIDA', 0.15, 'Venta #140', 24),
(374, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #140 (1x Prod #1)', 1, '2026-10-21 02:17:57', 19, 'SALIDA', 1.00, 'Venta #140', 24),
(375, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #140 (1x Prod #1)', 1, '2026-10-21 02:17:57', 18, 'SALIDA', 0.03, 'Venta #140', 24),
(376, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #140 (1x Prod #1)', 1, '2026-10-21 02:17:57', 22, 'SALIDA', 0.02, 'Venta #140', 24),
(377, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #140 (1x Prod #1)', 1, '2026-10-21 02:17:57', 23, 'SALIDA', 0.03, 'Venta #140', 24),
(378, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #141 (1x Prod #1)', 1, '2026-10-21 02:17:57', 12, 'SALIDA', 1.00, 'Venta #141', 24),
(379, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #141 (1x Prod #1)', 1, '2026-10-21 02:17:57', 14, 'SALIDA', 0.15, 'Venta #141', 24),
(380, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #141 (1x Prod #1)', 1, '2026-10-21 02:17:58', 19, 'SALIDA', 1.00, 'Venta #141', 24),
(381, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #141 (1x Prod #1)', 1, '2026-10-21 02:17:58', 18, 'SALIDA', 0.03, 'Venta #141', 24),
(382, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #141 (1x Prod #1)', 1, '2026-10-21 02:17:58', 22, 'SALIDA', 0.02, 'Venta #141', 24),
(383, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #141 (1x Prod #1)', 1, '2026-10-21 02:17:58', 23, 'SALIDA', 0.03, 'Venta #141', 24),
(384, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #142 (1x Prod #1)', 1, '2026-10-21 02:17:58', 12, 'SALIDA', 1.00, 'Venta #142', 24),
(385, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #142 (1x Prod #1)', 1, '2026-10-21 02:17:58', 14, 'SALIDA', 0.15, 'Venta #142', 24),
(386, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #142 (1x Prod #1)', 1, '2026-10-21 02:17:58', 19, 'SALIDA', 1.00, 'Venta #142', 24),
(387, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #142 (1x Prod #1)', 1, '2026-10-21 02:17:58', 18, 'SALIDA', 0.03, 'Venta #142', 24),
(388, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #142 (1x Prod #1)', 1, '2026-10-21 02:17:58', 22, 'SALIDA', 0.02, 'Venta #142', 24),
(389, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #142 (1x Prod #1)', 1, '2026-10-21 02:17:58', 23, 'SALIDA', 0.03, 'Venta #142', 24),
(390, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #143 (1x Prod #1)', 1, '2026-10-21 02:17:58', 12, 'SALIDA', 1.00, 'Venta #143', 24),
(391, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #143 (1x Prod #1)', 1, '2026-10-21 02:17:58', 14, 'SALIDA', 0.15, 'Venta #143', 24),
(392, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #143 (1x Prod #1)', 1, '2026-10-21 02:17:58', 19, 'SALIDA', 1.00, 'Venta #143', 24),
(393, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #143 (1x Prod #1)', 1, '2026-10-21 02:17:58', 18, 'SALIDA', 0.03, 'Venta #143', 24),
(394, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #143 (1x Prod #1)', 1, '2026-10-21 02:17:58', 22, 'SALIDA', 0.02, 'Venta #143', 24),
(395, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #143 (1x Prod #1)', 1, '2026-10-21 02:17:58', 23, 'SALIDA', 0.03, 'Venta #143', 24),
(396, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #144 (1x Prod #1)', 1, '2026-10-21 02:17:58', 12, 'SALIDA', 1.00, 'Venta #144', 24),
(397, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #144 (1x Prod #1)', 1, '2026-10-21 02:17:58', 14, 'SALIDA', 0.15, 'Venta #144', 24),
(398, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #144 (1x Prod #1)', 1, '2026-10-21 02:17:58', 19, 'SALIDA', 1.00, 'Venta #144', 24),
(399, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #144 (1x Prod #1)', 1, '2026-10-21 02:17:58', 18, 'SALIDA', 0.03, 'Venta #144', 24),
(400, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #144 (1x Prod #1)', 1, '2026-10-21 02:17:58', 22, 'SALIDA', 0.02, 'Venta #144', 24),
(401, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #144 (1x Prod #1)', 1, '2026-10-21 02:17:58', 23, 'SALIDA', 0.03, 'Venta #144', 24),
(402, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #145 (1x Prod #1)', 1, '2026-10-21 02:17:58', 12, 'SALIDA', 1.00, 'Venta #145', 24),
(403, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #145 (1x Prod #1)', 1, '2026-10-21 02:17:58', 14, 'SALIDA', 0.15, 'Venta #145', 24),
(404, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #145 (1x Prod #1)', 1, '2026-10-21 02:17:58', 19, 'SALIDA', 1.00, 'Venta #145', 24),
(405, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #145 (1x Prod #1)', 1, '2026-10-21 02:17:58', 18, 'SALIDA', 0.03, 'Venta #145', 24),
(406, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #145 (1x Prod #1)', 1, '2026-10-21 02:17:58', 22, 'SALIDA', 0.02, 'Venta #145', 24),
(407, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #145 (1x Prod #1)', 1, '2026-10-21 02:17:58', 23, 'SALIDA', 0.03, 'Venta #145', 24),
(408, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 2.00 und por Venta #146 (2x Prod #1)', 1, '2026-10-21 02:17:59', 12, 'SALIDA', 2.00, 'Venta #146', 24),
(409, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.30 kg por Venta #146 (2x Prod #1)', 1, '2026-10-21 02:17:59', 14, 'SALIDA', 0.30, 'Venta #146', 24),
(410, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 2.00 und por Venta #146 (2x Prod #1)', 1, '2026-10-21 02:17:59', 19, 'SALIDA', 2.00, 'Venta #146', 24),
(411, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.06 kg por Venta #146 (2x Prod #1)', 1, '2026-10-21 02:17:59', 18, 'SALIDA', 0.06, 'Venta #146', 24),
(412, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.04 kg por Venta #146 (2x Prod #1)', 1, '2026-10-21 02:17:59', 22, 'SALIDA', 0.04, 'Venta #146', 24),
(413, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.06 kg por Venta #146 (2x Prod #1)', 1, '2026-10-21 02:17:59', 23, 'SALIDA', 0.06, 'Venta #146', 24),
(414, 'CONSUMO_VENTA', 'Pan Perro Americano', 'Consumo de 5.00 und por Venta #146 (5x Prod #5)', 1, '2026-10-21 02:17:59', 13, 'SALIDA', 5.00, 'Venta #146', 24),
(415, 'CONSUMO_VENTA', 'Salchicha Suiza Ahumada', 'Consumo de 5.00 und por Venta #146 (5x Prod #5)', 1, '2026-10-21 02:17:59', 17, 'SALIDA', 5.00, 'Venta #146', 24),
(416, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.15 kg por Venta #146 (5x Prod #5)', 1, '2026-10-21 02:17:59', 18, 'SALIDA', 0.15, 'Venta #146', 24),
(417, 'CONSUMO_VENTA', 'Queso Mozzarella Rallado', 'Consumo de 0.25 kg por Venta #146 (5x Prod #5)', 1, '2026-10-21 02:17:59', 20, 'SALIDA', 0.25, 'Venta #146', 24),
(418, 'CONSUMO_VENTA', 'Cebolla Cabezona Blanca', 'Consumo de 0.15 kg por Venta #146 (5x Prod #5)', 1, '2026-10-21 02:17:59', 24, 'SALIDA', 0.15, 'Venta #146', 24),
(420, 'Creado', 'Salsa Preparada AutoTest 1792549083986', 'Se creó el insumo preparado: Salsa Preparada AutoTest 1792549083986', 1, '2026-10-21 02:18:04', NULL, NULL, NULL, 'Registro inicial de insumo preparado', NULL),
(421, 'Eliminado permanente', 'Salsa Preparada AutoTest 1792549083986', 'Se eliminó permanentemente el insumo preparado: Salsa Preparada AutoTest 1792549083986', 1, '2026-10-21 02:18:04', NULL, NULL, NULL, 'Eliminación física definitiva de preparado', NULL),
(422, 'Eliminado permanente', 'Insumo AutoTest 1792549083953', 'Se eliminó permanentemente el insumo: Insumo AutoTest 1792549083953', 1, '2026-10-21 02:18:04', NULL, NULL, NULL, 'Eliminación física definitiva', NULL),
(425, 'Creado', 'Salsa Preparada AutoTest 1792549509712', 'Se creó el insumo preparado: Salsa Preparada AutoTest 1792549509712', 1, '2026-10-21 02:25:09', NULL, NULL, NULL, 'Registro inicial de insumo preparado', NULL),
(426, 'Eliminado permanente', 'Salsa Preparada AutoTest 1792549509712', 'Se eliminó permanentemente el insumo preparado: Salsa Preparada AutoTest 1792549509712', 1, '2026-10-21 02:25:09', NULL, NULL, NULL, 'Eliminación física definitiva de preparado', NULL),
(427, 'Eliminado permanente', 'Insumo AutoTest Modificado 1792549509685', 'Se eliminó permanentemente el insumo: Insumo AutoTest Modificado 1792549509685', 1, '2026-10-21 02:25:09', NULL, NULL, NULL, 'Eliminación física definitiva', NULL),
(428, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 2.00 und por Venta #147 (2x Prod #1)', 1, '2026-10-21 02:25:18', 12, 'SALIDA', 2.00, 'Venta #147', 24),
(429, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.30 kg por Venta #147 (2x Prod #1)', 1, '2026-10-21 02:25:18', 14, 'SALIDA', 0.30, 'Venta #147', 24),
(430, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 2.00 und por Venta #147 (2x Prod #1)', 1, '2026-10-21 02:25:18', 19, 'SALIDA', 2.00, 'Venta #147', 24),
(431, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.06 kg por Venta #147 (2x Prod #1)', 1, '2026-10-21 02:25:18', 18, 'SALIDA', 0.06, 'Venta #147', 24),
(432, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.04 kg por Venta #147 (2x Prod #1)', 1, '2026-10-21 02:25:18', 22, 'SALIDA', 0.04, 'Venta #147', 24),
(433, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.06 kg por Venta #147 (2x Prod #1)', 1, '2026-10-21 02:25:18', 23, 'SALIDA', 0.06, 'Venta #147', 24),
(434, 'CONSUMO_ADICION', 'Tocineta Ahumada en Tiras', 'Adición Tocineta Ahumada en Tiras (2 kg) en Venta #147', 1, '2026-10-21 02:25:18', 18, 'SALIDA', 2.00, 'Venta #147 (Adición)', 24),
(435, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 2.00 und por Venta #148 (2x Prod #1)', 1, '2026-10-21 02:37:04', 12, 'SALIDA', 2.00, 'Venta #148', 24),
(436, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.30 kg por Venta #148 (2x Prod #1)', 1, '2026-10-21 02:37:04', 14, 'SALIDA', 0.30, 'Venta #148', 24),
(437, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 2.00 und por Venta #148 (2x Prod #1)', 1, '2026-10-21 02:37:04', 19, 'SALIDA', 2.00, 'Venta #148', 24),
(438, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.06 kg por Venta #148 (2x Prod #1)', 1, '2026-10-21 02:37:04', 18, 'SALIDA', 0.06, 'Venta #148', 24),
(439, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.04 kg por Venta #148 (2x Prod #1)', 1, '2026-10-21 02:37:04', 22, 'SALIDA', 0.04, 'Venta #148', 24),
(440, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.06 kg por Venta #148 (2x Prod #1)', 1, '2026-10-21 02:37:04', 23, 'SALIDA', 0.06, 'Venta #148', 24),
(441, 'CONSUMO_ADICION', 'Tocineta Ahumada en Tiras', 'Adición Tocineta Ahumada en Tiras (2 kg) en Venta #148', 1, '2026-10-21 02:37:04', 18, 'SALIDA', 2.00, 'Venta #148 (Adición)', 24),
(444, 'Creado', 'Salsa Preparada AutoTest 1792550247809', 'Se creó el insumo preparado: Salsa Preparada AutoTest 1792550247809', 1, '2026-10-21 02:37:27', NULL, NULL, NULL, 'Registro inicial de insumo preparado', NULL),
(445, 'Eliminado permanente', 'Salsa Preparada AutoTest 1792550247809', 'Se eliminó permanentemente el insumo preparado: Salsa Preparada AutoTest 1792550247809', 1, '2026-10-21 02:37:27', NULL, NULL, NULL, 'Eliminación física definitiva de preparado', NULL),
(446, 'Eliminado permanente', 'Insumo AutoTest Modificado 1792550247776', 'Se eliminó permanentemente el insumo: Insumo AutoTest Modificado 1792550247776', 1, '2026-10-21 02:37:27', NULL, NULL, NULL, 'Eliminación física definitiva', NULL),
(447, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #149 (1x Prod #1)', 1, '2026-10-21 02:37:34', 12, 'SALIDA', 1.00, 'Venta #149', 24),
(448, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #149 (1x Prod #1)', 1, '2026-10-21 02:37:34', 14, 'SALIDA', 0.15, 'Venta #149', 24),
(449, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #149 (1x Prod #1)', 1, '2026-10-21 02:37:34', 19, 'SALIDA', 1.00, 'Venta #149', 24),
(450, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #149 (1x Prod #1)', 1, '2026-10-21 02:37:34', 18, 'SALIDA', 0.03, 'Venta #149', 24),
(451, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #149 (1x Prod #1)', 1, '2026-10-21 02:37:34', 22, 'SALIDA', 0.02, 'Venta #149', 24),
(452, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #149 (1x Prod #1)', 1, '2026-10-21 02:37:34', 23, 'SALIDA', 0.03, 'Venta #149', 24),
(453, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #150 (1x Prod #1)', 1, '2026-10-21 02:37:34', 12, 'SALIDA', 1.00, 'Venta #150', 24),
(454, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #150 (1x Prod #1)', 1, '2026-10-21 02:37:34', 14, 'SALIDA', 0.15, 'Venta #150', 24),
(455, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #150 (1x Prod #1)', 1, '2026-10-21 02:37:34', 19, 'SALIDA', 1.00, 'Venta #150', 24),
(456, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #150 (1x Prod #1)', 1, '2026-10-21 02:37:34', 18, 'SALIDA', 0.03, 'Venta #150', 24),
(457, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #150 (1x Prod #1)', 1, '2026-10-21 02:37:34', 22, 'SALIDA', 0.02, 'Venta #150', 24),
(458, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #150 (1x Prod #1)', 1, '2026-10-21 02:37:34', 23, 'SALIDA', 0.03, 'Venta #150', 24),
(459, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #151 (1x Prod #1)', 1, '2026-10-21 02:37:34', 12, 'SALIDA', 1.00, 'Venta #151', 24),
(460, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #151 (1x Prod #1)', 1, '2026-10-21 02:37:34', 14, 'SALIDA', 0.15, 'Venta #151', 24),
(461, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #151 (1x Prod #1)', 1, '2026-10-21 02:37:34', 19, 'SALIDA', 1.00, 'Venta #151', 24),
(462, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #151 (1x Prod #1)', 1, '2026-10-21 02:37:34', 18, 'SALIDA', 0.03, 'Venta #151', 24),
(463, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #151 (1x Prod #1)', 1, '2026-10-21 02:37:34', 22, 'SALIDA', 0.02, 'Venta #151', 24),
(464, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #151 (1x Prod #1)', 1, '2026-10-21 02:37:34', 23, 'SALIDA', 0.03, 'Venta #151', 24),
(465, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #152 (1x Prod #1)', 1, '2026-10-21 02:37:34', 12, 'SALIDA', 1.00, 'Venta #152', 24),
(466, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #152 (1x Prod #1)', 1, '2026-10-21 02:37:34', 14, 'SALIDA', 0.15, 'Venta #152', 24),
(467, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #152 (1x Prod #1)', 1, '2026-10-21 02:37:34', 19, 'SALIDA', 1.00, 'Venta #152', 24),
(468, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #152 (1x Prod #1)', 1, '2026-10-21 02:37:34', 18, 'SALIDA', 0.03, 'Venta #152', 24),
(469, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #152 (1x Prod #1)', 1, '2026-10-21 02:37:34', 22, 'SALIDA', 0.02, 'Venta #152', 24),
(470, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #152 (1x Prod #1)', 1, '2026-10-21 02:37:34', 23, 'SALIDA', 0.03, 'Venta #152', 24),
(471, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #153 (1x Prod #1)', 1, '2026-10-21 02:37:34', 12, 'SALIDA', 1.00, 'Venta #153', 24),
(472, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #153 (1x Prod #1)', 1, '2026-10-21 02:37:34', 14, 'SALIDA', 0.15, 'Venta #153', 24),
(473, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #153 (1x Prod #1)', 1, '2026-10-21 02:37:34', 19, 'SALIDA', 1.00, 'Venta #153', 24),
(474, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #153 (1x Prod #1)', 1, '2026-10-21 02:37:34', 18, 'SALIDA', 0.03, 'Venta #153', 24),
(475, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #153 (1x Prod #1)', 1, '2026-10-21 02:37:34', 22, 'SALIDA', 0.02, 'Venta #153', 24),
(476, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #153 (1x Prod #1)', 1, '2026-10-21 02:37:34', 23, 'SALIDA', 0.03, 'Venta #153', 24),
(477, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #154 (1x Prod #1)', 1, '2026-10-21 02:37:34', 12, 'SALIDA', 1.00, 'Venta #154', 24),
(478, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #154 (1x Prod #1)', 1, '2026-10-21 02:37:34', 14, 'SALIDA', 0.15, 'Venta #154', 24),
(479, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #154 (1x Prod #1)', 1, '2026-10-21 02:37:34', 19, 'SALIDA', 1.00, 'Venta #154', 24),
(480, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #154 (1x Prod #1)', 1, '2026-10-21 02:37:34', 18, 'SALIDA', 0.03, 'Venta #154', 24),
(481, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #154 (1x Prod #1)', 1, '2026-10-21 02:37:34', 22, 'SALIDA', 0.02, 'Venta #154', 24),
(482, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #154 (1x Prod #1)', 1, '2026-10-21 02:37:34', 23, 'SALIDA', 0.03, 'Venta #154', 24),
(483, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #155 (1x Prod #1)', 1, '2026-10-21 02:37:34', 12, 'SALIDA', 1.00, 'Venta #155', 24),
(484, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #155 (1x Prod #1)', 1, '2026-10-21 02:37:34', 14, 'SALIDA', 0.15, 'Venta #155', 24),
(485, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #155 (1x Prod #1)', 1, '2026-10-21 02:37:34', 19, 'SALIDA', 1.00, 'Venta #155', 24),
(486, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #155 (1x Prod #1)', 1, '2026-10-21 02:37:34', 18, 'SALIDA', 0.03, 'Venta #155', 24),
(487, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #155 (1x Prod #1)', 1, '2026-10-21 02:37:34', 22, 'SALIDA', 0.02, 'Venta #155', 24),
(488, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #155 (1x Prod #1)', 1, '2026-10-21 02:37:34', 23, 'SALIDA', 0.03, 'Venta #155', 24),
(489, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #156 (1x Prod #1)', 1, '2026-10-21 02:37:34', 12, 'SALIDA', 1.00, 'Venta #156', 24),
(490, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #156 (1x Prod #1)', 1, '2026-10-21 02:37:34', 14, 'SALIDA', 0.15, 'Venta #156', 24),
(491, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #156 (1x Prod #1)', 1, '2026-10-21 02:37:34', 19, 'SALIDA', 1.00, 'Venta #156', 24),
(492, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #156 (1x Prod #1)', 1, '2026-10-21 02:37:34', 18, 'SALIDA', 0.03, 'Venta #156', 24),
(493, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #156 (1x Prod #1)', 1, '2026-10-21 02:37:35', 22, 'SALIDA', 0.02, 'Venta #156', 24),
(494, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #156 (1x Prod #1)', 1, '2026-10-21 02:37:35', 23, 'SALIDA', 0.03, 'Venta #156', 24),
(495, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 2.00 und por Venta #157 (2x Prod #1)', 1, '2026-10-21 02:37:35', 12, 'SALIDA', 2.00, 'Venta #157', 24),
(496, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.30 kg por Venta #157 (2x Prod #1)', 1, '2026-10-21 02:37:35', 14, 'SALIDA', 0.30, 'Venta #157', 24),
(497, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 2.00 und por Venta #157 (2x Prod #1)', 1, '2026-10-21 02:37:35', 19, 'SALIDA', 2.00, 'Venta #157', 24),
(498, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.06 kg por Venta #157 (2x Prod #1)', 1, '2026-10-21 02:37:35', 18, 'SALIDA', 0.06, 'Venta #157', 24),
(499, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.04 kg por Venta #157 (2x Prod #1)', 1, '2026-10-21 02:37:35', 22, 'SALIDA', 0.04, 'Venta #157', 24),
(500, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.06 kg por Venta #157 (2x Prod #1)', 1, '2026-10-21 02:37:35', 23, 'SALIDA', 0.06, 'Venta #157', 24),
(501, 'CONSUMO_VENTA', 'Pan Perro Americano', 'Consumo de 5.00 und por Venta #157 (5x Prod #5)', 1, '2026-10-21 02:37:35', 13, 'SALIDA', 5.00, 'Venta #157', 24),
(502, 'CONSUMO_VENTA', 'Salchicha Suiza Ahumada', 'Consumo de 5.00 und por Venta #157 (5x Prod #5)', 1, '2026-10-21 02:37:35', 17, 'SALIDA', 5.00, 'Venta #157', 24),
(503, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.15 kg por Venta #157 (5x Prod #5)', 1, '2026-10-21 02:37:35', 18, 'SALIDA', 0.15, 'Venta #157', 24),
(504, 'CONSUMO_VENTA', 'Queso Mozzarella Rallado', 'Consumo de 0.25 kg por Venta #157 (5x Prod #5)', 1, '2026-10-21 02:37:35', 20, 'SALIDA', 0.25, 'Venta #157', 24),
(505, 'CONSUMO_VENTA', 'Cebolla Cabezona Blanca', 'Consumo de 0.15 kg por Venta #157 (5x Prod #5)', 1, '2026-10-21 02:37:35', 24, 'SALIDA', 0.15, 'Venta #157', 24),
(506, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 2.00 und por Venta #158 (2x Prod #1)', 1, '2026-10-21 02:37:45', 12, 'SALIDA', 2.00, 'Venta #158', 24),
(507, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.30 kg por Venta #158 (2x Prod #1)', 1, '2026-10-21 02:37:45', 14, 'SALIDA', 0.30, 'Venta #158', 24),
(508, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 2.00 und por Venta #158 (2x Prod #1)', 1, '2026-10-21 02:37:45', 19, 'SALIDA', 2.00, 'Venta #158', 24),
(509, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.06 kg por Venta #158 (2x Prod #1)', 1, '2026-10-21 02:37:45', 18, 'SALIDA', 0.06, 'Venta #158', 24),
(510, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.04 kg por Venta #158 (2x Prod #1)', 1, '2026-10-21 02:37:45', 22, 'SALIDA', 0.04, 'Venta #158', 24),
(511, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.06 kg por Venta #158 (2x Prod #1)', 1, '2026-10-21 02:37:45', 23, 'SALIDA', 0.06, 'Venta #158', 24),
(512, 'CONSUMO_ADICION', 'Tocineta Ahumada en Tiras', 'Adición Tocineta Ahumada en Tiras (2 kg) en Venta #158', 1, '2026-10-21 02:37:45', 18, 'SALIDA', 2.00, 'Venta #158 (Adición)', 24),
(513, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 2.00 und por Venta #159 (2x Prod #1)', 1, '2026-10-22 15:09:36', 12, 'SALIDA', 2.00, 'Venta #159', 24),
(514, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.30 kg por Venta #159 (2x Prod #1)', 1, '2026-10-22 15:09:36', 14, 'SALIDA', 0.30, 'Venta #159', 24),
(515, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 2.00 und por Venta #159 (2x Prod #1)', 1, '2026-10-22 15:09:36', 19, 'SALIDA', 2.00, 'Venta #159', 24),
(516, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.06 kg por Venta #159 (2x Prod #1)', 1, '2026-10-22 15:09:36', 18, 'SALIDA', 0.06, 'Venta #159', 24),
(517, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.04 kg por Venta #159 (2x Prod #1)', 1, '2026-10-22 15:09:36', 22, 'SALIDA', 0.04, 'Venta #159', 24),
(518, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.06 kg por Venta #159 (2x Prod #1)', 1, '2026-10-22 15:09:36', 23, 'SALIDA', 0.06, 'Venta #159', 24),
(519, 'CONSUMO_ADICION', 'Tocineta Ahumada en Tiras', 'Adición Tocineta Ahumada en Tiras (2 kg) en Venta #159', 1, '2026-10-22 15:09:36', 18, 'SALIDA', 2.00, 'Venta #159 (Adición)', 24),
(520, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #160 (1x Prod #1)', 1, '2026-10-22 15:33:22', 12, 'SALIDA', 1.00, 'Venta #160', 24),
(521, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #160 (1x Prod #1)', 1, '2026-10-22 15:33:22', 14, 'SALIDA', 0.15, 'Venta #160', 24),
(522, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #160 (1x Prod #1)', 1, '2026-10-22 15:33:22', 19, 'SALIDA', 1.00, 'Venta #160', 24),
(523, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #160 (1x Prod #1)', 1, '2026-10-22 15:33:22', 18, 'SALIDA', 0.03, 'Venta #160', 24),
(524, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #160 (1x Prod #1)', 1, '2026-10-22 15:33:22', 22, 'SALIDA', 0.02, 'Venta #160', 24),
(525, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #160 (1x Prod #1)', 1, '2026-10-22 15:33:22', 23, 'SALIDA', 0.03, 'Venta #160', 24),
(526, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #161 (1x Prod #1)', 1, '2026-10-22 15:33:22', 12, 'SALIDA', 1.00, 'Venta #161', 24),
(527, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #161 (1x Prod #1)', 1, '2026-10-22 15:33:22', 14, 'SALIDA', 0.15, 'Venta #161', 24),
(528, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #161 (1x Prod #1)', 1, '2026-10-22 15:33:22', 19, 'SALIDA', 1.00, 'Venta #161', 24),
(529, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #161 (1x Prod #1)', 1, '2026-10-22 15:33:22', 18, 'SALIDA', 0.03, 'Venta #161', 24),
(530, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #161 (1x Prod #1)', 1, '2026-10-22 15:33:22', 22, 'SALIDA', 0.02, 'Venta #161', 24),
(531, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #161 (1x Prod #1)', 1, '2026-10-22 15:33:22', 23, 'SALIDA', 0.03, 'Venta #161', 24),
(532, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #162 (1x Prod #1)', 1, '2026-10-22 15:33:22', 12, 'SALIDA', 1.00, 'Venta #162', 24),
(533, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #162 (1x Prod #1)', 1, '2026-10-22 15:33:22', 14, 'SALIDA', 0.15, 'Venta #162', 24),
(534, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #162 (1x Prod #1)', 1, '2026-10-22 15:33:22', 19, 'SALIDA', 1.00, 'Venta #162', 24),
(535, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #162 (1x Prod #1)', 1, '2026-10-22 15:33:22', 18, 'SALIDA', 0.03, 'Venta #162', 24),
(536, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #162 (1x Prod #1)', 1, '2026-10-22 15:33:22', 22, 'SALIDA', 0.02, 'Venta #162', 24),
(537, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #162 (1x Prod #1)', 1, '2026-10-22 15:33:22', 23, 'SALIDA', 0.03, 'Venta #162', 24),
(538, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #163 (1x Prod #1)', 1, '2026-10-22 15:33:22', 12, 'SALIDA', 1.00, 'Venta #163', 24),
(539, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #163 (1x Prod #1)', 1, '2026-10-22 15:33:22', 14, 'SALIDA', 0.15, 'Venta #163', 24),
(540, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #163 (1x Prod #1)', 1, '2026-10-22 15:33:22', 19, 'SALIDA', 1.00, 'Venta #163', 24),
(541, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #163 (1x Prod #1)', 1, '2026-10-22 15:33:22', 18, 'SALIDA', 0.03, 'Venta #163', 24),
(542, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #163 (1x Prod #1)', 1, '2026-10-22 15:33:22', 22, 'SALIDA', 0.02, 'Venta #163', 24),
(543, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #163 (1x Prod #1)', 1, '2026-10-22 15:33:22', 23, 'SALIDA', 0.03, 'Venta #163', 24),
(544, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #164 (1x Prod #1)', 1, '2026-10-22 15:33:22', 12, 'SALIDA', 1.00, 'Venta #164', 24),
(545, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #164 (1x Prod #1)', 1, '2026-10-22 15:33:22', 14, 'SALIDA', 0.15, 'Venta #164', 24),
(546, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #164 (1x Prod #1)', 1, '2026-10-22 15:33:22', 19, 'SALIDA', 1.00, 'Venta #164', 24),
(547, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #164 (1x Prod #1)', 1, '2026-10-22 15:33:22', 18, 'SALIDA', 0.03, 'Venta #164', 24),
(548, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #164 (1x Prod #1)', 1, '2026-10-22 15:33:22', 22, 'SALIDA', 0.02, 'Venta #164', 24),
(549, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #164 (1x Prod #1)', 1, '2026-10-22 15:33:22', 23, 'SALIDA', 0.03, 'Venta #164', 24),
(550, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #165 (1x Prod #1)', 1, '2026-10-22 15:33:22', 12, 'SALIDA', 1.00, 'Venta #165', 24),
(551, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #165 (1x Prod #1)', 1, '2026-10-22 15:33:22', 14, 'SALIDA', 0.15, 'Venta #165', 24),
(552, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #165 (1x Prod #1)', 1, '2026-10-22 15:33:22', 19, 'SALIDA', 1.00, 'Venta #165', 24),
(553, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #165 (1x Prod #1)', 1, '2026-10-22 15:33:22', 18, 'SALIDA', 0.03, 'Venta #165', 24),
(554, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #165 (1x Prod #1)', 1, '2026-10-22 15:33:22', 22, 'SALIDA', 0.02, 'Venta #165', 24),
(555, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #165 (1x Prod #1)', 1, '2026-10-22 15:33:22', 23, 'SALIDA', 0.03, 'Venta #165', 24),
(556, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #166 (1x Prod #1)', 1, '2026-10-22 15:33:23', 12, 'SALIDA', 1.00, 'Venta #166', 24),
(557, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #166 (1x Prod #1)', 1, '2026-10-22 15:33:23', 14, 'SALIDA', 0.15, 'Venta #166', 24),
(558, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #166 (1x Prod #1)', 1, '2026-10-22 15:33:23', 19, 'SALIDA', 1.00, 'Venta #166', 24),
(559, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #166 (1x Prod #1)', 1, '2026-10-22 15:33:23', 18, 'SALIDA', 0.03, 'Venta #166', 24),
(560, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #166 (1x Prod #1)', 1, '2026-10-22 15:33:23', 22, 'SALIDA', 0.02, 'Venta #166', 24),
(561, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #166 (1x Prod #1)', 1, '2026-10-22 15:33:23', 23, 'SALIDA', 0.03, 'Venta #166', 24),
(562, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #167 (1x Prod #1)', 1, '2026-10-22 15:33:23', 12, 'SALIDA', 1.00, 'Venta #167', 24),
(563, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #167 (1x Prod #1)', 1, '2026-10-22 15:33:23', 14, 'SALIDA', 0.15, 'Venta #167', 24),
(564, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #167 (1x Prod #1)', 1, '2026-10-22 15:33:23', 19, 'SALIDA', 1.00, 'Venta #167', 24),
(565, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #167 (1x Prod #1)', 1, '2026-10-22 15:33:23', 18, 'SALIDA', 0.03, 'Venta #167', 24),
(566, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #167 (1x Prod #1)', 1, '2026-10-22 15:33:23', 22, 'SALIDA', 0.02, 'Venta #167', 24),
(567, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #167 (1x Prod #1)', 1, '2026-10-22 15:33:23', 23, 'SALIDA', 0.03, 'Venta #167', 24),
(568, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 2.00 und por Venta #168 (2x Prod #1)', 1, '2026-10-22 15:33:23', 12, 'SALIDA', 2.00, 'Venta #168', 24),
(569, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.30 kg por Venta #168 (2x Prod #1)', 1, '2026-10-22 15:33:23', 14, 'SALIDA', 0.30, 'Venta #168', 24),
(570, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 2.00 und por Venta #168 (2x Prod #1)', 1, '2026-10-22 15:33:23', 19, 'SALIDA', 2.00, 'Venta #168', 24),
(571, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.06 kg por Venta #168 (2x Prod #1)', 1, '2026-10-22 15:33:23', 18, 'SALIDA', 0.06, 'Venta #168', 24),
(572, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.04 kg por Venta #168 (2x Prod #1)', 1, '2026-10-22 15:33:23', 22, 'SALIDA', 0.04, 'Venta #168', 24),
(573, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.06 kg por Venta #168 (2x Prod #1)', 1, '2026-10-22 15:33:23', 23, 'SALIDA', 0.06, 'Venta #168', 24),
(574, 'CONSUMO_VENTA', 'Pan Perro Americano', 'Consumo de 5.00 und por Venta #168 (5x Prod #5)', 1, '2026-10-22 15:33:23', 13, 'SALIDA', 5.00, 'Venta #168', 24),
(575, 'CONSUMO_VENTA', 'Salchicha Suiza Ahumada', 'Consumo de 5.00 und por Venta #168 (5x Prod #5)', 1, '2026-10-22 15:33:23', 17, 'SALIDA', 5.00, 'Venta #168', 24),
(576, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.15 kg por Venta #168 (5x Prod #5)', 1, '2026-10-22 15:33:23', 18, 'SALIDA', 0.15, 'Venta #168', 24),
(577, 'CONSUMO_VENTA', 'Queso Mozzarella Rallado', 'Consumo de 0.25 kg por Venta #168 (5x Prod #5)', 1, '2026-10-22 15:33:23', 20, 'SALIDA', 0.25, 'Venta #168', 24),
(578, 'CONSUMO_VENTA', 'Cebolla Cabezona Blanca', 'Consumo de 0.15 kg por Venta #168 (5x Prod #5)', 1, '2026-10-22 15:33:23', 24, 'SALIDA', 0.15, 'Venta #168', 24),
(579, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #169 (1x Prod #1)', 1, '2026-10-22 15:57:49', 12, 'SALIDA', 1.00, 'Venta #169', 24),
(580, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #169 (1x Prod #1)', 1, '2026-10-22 15:57:49', 14, 'SALIDA', 0.15, 'Venta #169', 24),
(581, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #169 (1x Prod #1)', 1, '2026-10-22 15:57:49', 19, 'SALIDA', 1.00, 'Venta #169', 24),
(582, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #169 (1x Prod #1)', 1, '2026-10-22 15:57:49', 18, 'SALIDA', 0.03, 'Venta #169', 24),
(583, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #169 (1x Prod #1)', 1, '2026-10-22 15:57:49', 22, 'SALIDA', 0.02, 'Venta #169', 24),
(584, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #169 (1x Prod #1)', 1, '2026-10-22 15:57:49', 23, 'SALIDA', 0.03, 'Venta #169', 24),
(585, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #170 (1x Prod #1)', 1, '2026-10-22 15:57:49', 12, 'SALIDA', 1.00, 'Venta #170', 24),
(586, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #170 (1x Prod #1)', 1, '2026-10-22 15:57:49', 14, 'SALIDA', 0.15, 'Venta #170', 24),
(587, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #170 (1x Prod #1)', 1, '2026-10-22 15:57:49', 19, 'SALIDA', 1.00, 'Venta #170', 24),
(588, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #170 (1x Prod #1)', 1, '2026-10-22 15:57:49', 18, 'SALIDA', 0.03, 'Venta #170', 24),
(589, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #170 (1x Prod #1)', 1, '2026-10-22 15:57:49', 22, 'SALIDA', 0.02, 'Venta #170', 24),
(590, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #170 (1x Prod #1)', 1, '2026-10-22 15:57:49', 23, 'SALIDA', 0.03, 'Venta #170', 24),
(591, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #171 (1x Prod #1)', 1, '2026-10-22 15:57:49', 12, 'SALIDA', 1.00, 'Venta #171', 24),
(592, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #171 (1x Prod #1)', 1, '2026-10-22 15:57:49', 14, 'SALIDA', 0.15, 'Venta #171', 24),
(593, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #171 (1x Prod #1)', 1, '2026-10-22 15:57:49', 19, 'SALIDA', 1.00, 'Venta #171', 24),
(594, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #171 (1x Prod #1)', 1, '2026-10-22 15:57:49', 18, 'SALIDA', 0.03, 'Venta #171', 24),
(595, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #171 (1x Prod #1)', 1, '2026-10-22 15:57:49', 22, 'SALIDA', 0.02, 'Venta #171', 24),
(596, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #171 (1x Prod #1)', 1, '2026-10-22 15:57:49', 23, 'SALIDA', 0.03, 'Venta #171', 24),
(597, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #172 (1x Prod #1)', 1, '2026-10-22 15:57:49', 12, 'SALIDA', 1.00, 'Venta #172', 24),
(598, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #172 (1x Prod #1)', 1, '2026-10-22 15:57:49', 14, 'SALIDA', 0.15, 'Venta #172', 24),
(599, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #172 (1x Prod #1)', 1, '2026-10-22 15:57:49', 19, 'SALIDA', 1.00, 'Venta #172', 24),
(600, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #172 (1x Prod #1)', 1, '2026-10-22 15:57:49', 18, 'SALIDA', 0.03, 'Venta #172', 24),
(601, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #172 (1x Prod #1)', 1, '2026-10-22 15:57:49', 22, 'SALIDA', 0.02, 'Venta #172', 24),
(602, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #172 (1x Prod #1)', 1, '2026-10-22 15:57:49', 23, 'SALIDA', 0.03, 'Venta #172', 24),
(603, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #173 (1x Prod #1)', 1, '2026-10-22 15:57:49', 12, 'SALIDA', 1.00, 'Venta #173', 24),
(604, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #173 (1x Prod #1)', 1, '2026-10-22 15:57:49', 14, 'SALIDA', 0.15, 'Venta #173', 24),
(605, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #173 (1x Prod #1)', 1, '2026-10-22 15:57:49', 19, 'SALIDA', 1.00, 'Venta #173', 24),
(606, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #173 (1x Prod #1)', 1, '2026-10-22 15:57:49', 18, 'SALIDA', 0.03, 'Venta #173', 24),
(607, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #173 (1x Prod #1)', 1, '2026-10-22 15:57:49', 22, 'SALIDA', 0.02, 'Venta #173', 24),
(608, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #173 (1x Prod #1)', 1, '2026-10-22 15:57:49', 23, 'SALIDA', 0.03, 'Venta #173', 24),
(609, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #174 (1x Prod #1)', 1, '2026-10-22 15:57:49', 12, 'SALIDA', 1.00, 'Venta #174', 24),
(610, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #174 (1x Prod #1)', 1, '2026-10-22 15:57:49', 14, 'SALIDA', 0.15, 'Venta #174', 24),
(611, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #174 (1x Prod #1)', 1, '2026-10-22 15:57:49', 19, 'SALIDA', 1.00, 'Venta #174', 24),
(612, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #174 (1x Prod #1)', 1, '2026-10-22 15:57:49', 18, 'SALIDA', 0.03, 'Venta #174', 24),
(613, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #174 (1x Prod #1)', 1, '2026-10-22 15:57:49', 22, 'SALIDA', 0.02, 'Venta #174', 24),
(614, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #174 (1x Prod #1)', 1, '2026-10-22 15:57:49', 23, 'SALIDA', 0.03, 'Venta #174', 24),
(615, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #175 (1x Prod #1)', 1, '2026-10-22 15:57:49', 12, 'SALIDA', 1.00, 'Venta #175', 24),
(616, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #175 (1x Prod #1)', 1, '2026-10-22 15:57:49', 14, 'SALIDA', 0.15, 'Venta #175', 24),
(617, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #175 (1x Prod #1)', 1, '2026-10-22 15:57:49', 19, 'SALIDA', 1.00, 'Venta #175', 24),
(618, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #175 (1x Prod #1)', 1, '2026-10-22 15:57:49', 18, 'SALIDA', 0.03, 'Venta #175', 24),
(619, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #175 (1x Prod #1)', 1, '2026-10-22 15:57:49', 22, 'SALIDA', 0.02, 'Venta #175', 24),
(620, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #175 (1x Prod #1)', 1, '2026-10-22 15:57:49', 23, 'SALIDA', 0.03, 'Venta #175', 24),
(621, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #176 (1x Prod #1)', 1, '2026-10-22 15:57:49', 12, 'SALIDA', 1.00, 'Venta #176', 24),
(622, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #176 (1x Prod #1)', 1, '2026-10-22 15:57:49', 14, 'SALIDA', 0.15, 'Venta #176', 24),
(623, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #176 (1x Prod #1)', 1, '2026-10-22 15:57:49', 19, 'SALIDA', 1.00, 'Venta #176', 24),
(624, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #176 (1x Prod #1)', 1, '2026-10-22 15:57:49', 18, 'SALIDA', 0.03, 'Venta #176', 24),
(625, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #176 (1x Prod #1)', 1, '2026-10-22 15:57:49', 22, 'SALIDA', 0.02, 'Venta #176', 24),
(626, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #176 (1x Prod #1)', 1, '2026-10-22 15:57:49', 23, 'SALIDA', 0.03, 'Venta #176', 24),
(627, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 2.00 und por Venta #177 (2x Prod #1)', 1, '2026-10-22 15:57:50', 12, 'SALIDA', 2.00, 'Venta #177', 24),
(628, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.30 kg por Venta #177 (2x Prod #1)', 1, '2026-10-22 15:57:50', 14, 'SALIDA', 0.30, 'Venta #177', 24),
(629, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 2.00 und por Venta #177 (2x Prod #1)', 1, '2026-10-22 15:57:50', 19, 'SALIDA', 2.00, 'Venta #177', 24),
(630, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.06 kg por Venta #177 (2x Prod #1)', 1, '2026-10-22 15:57:50', 18, 'SALIDA', 0.06, 'Venta #177', 24),
(631, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.04 kg por Venta #177 (2x Prod #1)', 1, '2026-10-22 15:57:50', 22, 'SALIDA', 0.04, 'Venta #177', 24),
(632, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.06 kg por Venta #177 (2x Prod #1)', 1, '2026-10-22 15:57:50', 23, 'SALIDA', 0.06, 'Venta #177', 24),
(633, 'CONSUMO_VENTA', 'Pan Perro Americano', 'Consumo de 5.00 und por Venta #177 (5x Prod #5)', 1, '2026-10-22 15:57:50', 13, 'SALIDA', 5.00, 'Venta #177', 24),
(634, 'CONSUMO_VENTA', 'Salchicha Suiza Ahumada', 'Consumo de 5.00 und por Venta #177 (5x Prod #5)', 1, '2026-10-22 15:57:50', 17, 'SALIDA', 5.00, 'Venta #177', 24),
(635, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.15 kg por Venta #177 (5x Prod #5)', 1, '2026-10-22 15:57:50', 18, 'SALIDA', 0.15, 'Venta #177', 24),
(636, 'CONSUMO_VENTA', 'Queso Mozzarella Rallado', 'Consumo de 0.25 kg por Venta #177 (5x Prod #5)', 1, '2026-10-22 15:57:50', 20, 'SALIDA', 0.25, 'Venta #177', 24),
(637, 'CONSUMO_VENTA', 'Cebolla Cabezona Blanca', 'Consumo de 0.15 kg por Venta #177 (5x Prod #5)', 1, '2026-10-22 15:57:50', 24, 'SALIDA', 0.15, 'Venta #177', 24),
(638, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 2.00 und por Venta #178 (2x Prod #1)', 1, '2026-10-22 15:58:01', 12, 'SALIDA', 2.00, 'Venta #178', 24),
(639, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.30 kg por Venta #178 (2x Prod #1)', 1, '2026-10-22 15:58:01', 14, 'SALIDA', 0.30, 'Venta #178', 24),
(640, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 2.00 und por Venta #178 (2x Prod #1)', 1, '2026-10-22 15:58:01', 19, 'SALIDA', 2.00, 'Venta #178', 24),
(641, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.06 kg por Venta #178 (2x Prod #1)', 1, '2026-10-22 15:58:01', 18, 'SALIDA', 0.06, 'Venta #178', 24),
(642, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.04 kg por Venta #178 (2x Prod #1)', 1, '2026-10-22 15:58:01', 22, 'SALIDA', 0.04, 'Venta #178', 24),
(643, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.06 kg por Venta #178 (2x Prod #1)', 1, '2026-10-22 15:58:01', 23, 'SALIDA', 0.06, 'Venta #178', 24),
(644, 'CONSUMO_ADICION', 'Tocineta Ahumada en Tiras', 'Adición Tocineta Ahumada en Tiras (2 kg) en Venta #178', 1, '2026-10-22 15:58:01', 18, 'SALIDA', 2.00, 'Venta #178 (Adición)', 24),
(645, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #179 (1x Prod #1)', 0, '2026-10-28 15:51:59', 12, 'SALIDA', 1.00, 'Venta #179', 4),
(646, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #179 (1x Prod #1)', 0, '2026-10-28 15:51:59', 14, 'SALIDA', 0.15, 'Venta #179', 4),
(647, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #179 (1x Prod #1)', 0, '2026-10-28 15:51:59', 19, 'SALIDA', 1.00, 'Venta #179', 4),
(648, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #179 (1x Prod #1)', 0, '2026-10-28 15:51:59', 18, 'SALIDA', 0.03, 'Venta #179', 4),
(649, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #179 (1x Prod #1)', 0, '2026-10-28 15:51:59', 22, 'SALIDA', 0.02, 'Venta #179', 4),
(650, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #179 (1x Prod #1)', 0, '2026-10-28 15:51:59', 23, 'SALIDA', 0.03, 'Venta #179', 4);

INSERT INTO `trazabilidad` (`idTrazabilidad`, `tipo`, `entidadNombre`, `detalle`, `leido`, `fecha`, `idInsumo`, `tipoMovimiento`, `cantidad`, `motivo`, `usuarioId`) VALUES
(651, 'CONSUMO_VENTA', 'Pan Brioche Artesanal', 'Consumo de 1.00 und por Venta #180 (1x Prod #1)', 0, '2026-10-28 15:53:06', 12, 'SALIDA', 1.00, 'Venta #180', 4),
(652, 'CONSUMO_VENTA', 'Carne de Res Molida 80/20', 'Consumo de 0.15 kg por Venta #180 (1x Prod #1)', 0, '2026-10-28 15:53:06', 14, 'SALIDA', 0.15, 'Venta #180', 4),
(653, 'CONSUMO_VENTA', 'Queso Cheddar en Lonchas', 'Consumo de 1.00 und por Venta #180 (1x Prod #1)', 0, '2026-10-28 15:53:06', 19, 'SALIDA', 1.00, 'Venta #180', 4),
(654, 'CONSUMO_VENTA', 'Tocineta Ahumada en Tiras', 'Consumo de 0.03 kg por Venta #180 (1x Prod #1)', 0, '2026-10-28 15:53:06', 18, 'SALIDA', 0.03, 'Venta #180', 4),
(655, 'CONSUMO_VENTA', 'Lechuga Batavia Fresca', 'Consumo de 0.02 kg por Venta #180 (1x Prod #1)', 0, '2026-10-28 15:53:06', 22, 'SALIDA', 0.02, 'Venta #180', 4),
(656, 'CONSUMO_VENTA', 'Tomate Chonto Maduro', 'Consumo de 0.03 kg por Venta #180 (1x Prod #1)', 0, '2026-10-28 15:53:06', 23, 'SALIDA', 0.03, 'Venta #180', 4);

-- --------------------------------------------------------
-- Tabla: `usuario`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `tipoDocumento` varchar(255) DEFAULT NULL,
  `numeroDocumento` varchar(50) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `estado` varchar(255) DEFAULT 'ACTIVO',
  `fechaRegistro` datetime DEFAULT NULL,
  `idRol` int(11) NOT NULL,
  `foto` text DEFAULT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `UK_Usuario_Email` (`email`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`),
  UNIQUE KEY `email_43` (`email`),
  UNIQUE KEY `email_44` (`email`),
  UNIQUE KEY `email_45` (`email`),
  UNIQUE KEY `email_46` (`email`),
  UNIQUE KEY `email_47` (`email`),
  UNIQUE KEY `email_48` (`email`),
  UNIQUE KEY `email_49` (`email`),
  UNIQUE KEY `email_50` (`email`),
  UNIQUE KEY `email_51` (`email`),
  UNIQUE KEY `email_52` (`email`),
  UNIQUE KEY `email_53` (`email`),
  UNIQUE KEY `email_54` (`email`),
  UNIQUE KEY `email_55` (`email`),
  UNIQUE KEY `email_56` (`email`),
  UNIQUE KEY `email_57` (`email`),
  UNIQUE KEY `email_58` (`email`),
  UNIQUE KEY `email_59` (`email`),
  UNIQUE KEY `email_60` (`email`),
  UNIQUE KEY `email_61` (`email`),
  KEY `IDX_UsuarioRol` (`idRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `usuario`
INSERT INTO `usuario` (`idUsuario`, `nombre`, `apellidos`, `tipoDocumento`, `numeroDocumento`, `telefono`, `email`, `contrasena`, `estado`, `fechaRegistro`, `idRol`, `foto`) VALUES
(1, 'Fernando', 'Gómez Jaramillo', 'C.C.', '1', '3014599890', 'gomezjaramillofer@gmail.com', '$2a$10$85QpBu8Uj3qXzVtWTjCLveU8HpnJ1.uHuQfL1izYlVRe67hhDK3yO', 'ACTIVO', '2026-07-26 20:09:41', 4, NULL),
(4, 'Admin', 'Sistema', 'C.C.', '4', '3190000001', 'admin@chazinfood.com', '$2a$10$dS5LiLdTlcXUBSRahZAYNexfLybhvFXykk9833rsPuWz.iFzW1TcW', 'ACTIVO', '2026-07-18 11:53:44', 1, NULL),
(6, 'María', 'García', 'C.C.', '6432234344', '3190000002', 'cliente@chazinfood.com', '$2a$10$5Y9vYponOKrFOkM8Tl92CO3kA2gx2U88w5g2hkAI0Bqzjwr/.6c8y', 'ACTIVO', '2026-07-18 13:02:36', 4, NULL),
(24, 'Vendedor Principal', 'Chazin', 'C.C.', '24', '3001234567', 'vendedor@chazinfood.com', '$2a$10$YizLrUBkaC5CXWb8GUGq6.cxRe9Xxwl8WGJrFP0pEze9MAsjNphMm', 'ACTIVO', '2026-08-14 09:36:36', 3, NULL),
(25, 'Mariana', 'Silva Vergara', 'C.C.', '1056783045', '3054675789', 'mariana123@mailinator.com', '$2a$10$CHcvOtoR3eI4BrXf0LGDI.aCqb16qwcpMddDMW0DochM5BsRt0WEm', 'ACTIVO', '2026-09-23 11:29:37', 4, NULL),
(26, 'sofyan', 'amrabat', 'C.C.', '8765432198', '3338977654', 'sofyan@mailinator.com', '$2a$10$gHexTX7kKBlxJCNPcufUX.7q0TXNr5n4l/jWkWM8XJ9VSSoNl2OKa', 'ACTIVO', '2026-09-24 05:13:59', 4, NULL),
(27, 'Magnolia', 'Pripra', 'C.C.', '1010101010', '1010101010', 'magnolia@gmail.com', '$2a$10$/z23BjiussU6jhOO.5D6ZuOlovSMyCzhdEb/CwcKm0LsU3nLpdKk6', 'ACTIVO', '2026-10-06 12:19:50', 2, NULL),
(28, 'Juan', 'PPerez', 'C.C.', '12345678', '3001234567', 'juanperez@gmail.com', '$2a$10$jGN8TU1E8U36jTA4nP7YPumzttjJo2uBtVVUBT49p9cWLsltyvQEe', 'ACTIVO', '2026-10-18 17:42:29', 4, NULL),
(32, 'Nuevo Cliente', '', 'C.C.', '32', NULL, 'nuevocliente@gmail.com', '$2a$10$23BT7J5O62odP42cfRGxm.p6LqvSjDdcXtSqlxgKynTjzjO6KDBRa', 'ACTIVO', '2026-10-19 05:05:00', 4, NULL),
(33, 'Pedro', 'Jajaja', 'C.C.', '33', NULL, 'jajajapedro2@gmail.com', '$2a$10$z651yjoa0c7saLp4VdVIzuG.y7kzMBlnQSvrKsb3q00KuFzg.NAKO', 'ACTIVO', '2026-10-20 14:42:48', 4, 'https://lh3.googleusercontent.com/a/ACg8ocIGFU4ouBL7lt9zWlG2aIR76fZA30Sw3ndhDlD1cxSYpYbyMA=s96-c'),
(34, 'Samuel Gutiérrez franco', '', 'C.C.', '34', NULL, 'samu36669@gmail.com', '$2a$10$XNIfoAMcbHGAg9aU4crLte/uL87RHrZJ1uEN4SYtH8WHOgcP.Ww..', 'ACTIVO', '2026-10-21 02:49:04', 4, 'https://lh3.googleusercontent.com/a/ACg8ocKmapNwCVpwyd7XnVj1loQQ9a43jOPDmTcBpztbkZAtZms3lti_=s96-c');

-- --------------------------------------------------------
-- Tabla: `variante`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `variante`;
CREATE TABLE `variante` (
  `idVariante` int(11) NOT NULL AUTO_INCREMENT,
  `idProducto` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` tinyint(4) DEFAULT 1,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idVariante`),
  KEY `IDX_VarianteProducto` (`idProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `variante`
INSERT INTO `variante` (`idVariante`, `idProducto`, `nombre`, `precio`, `estado`, `imagen`) VALUES
(0, 0, '__SISTEMA_VARIANTE_CERO__', 0.00, 0, NULL),
(10, 1, 'Clásica 150g', 18000.00, 1, NULL),
(11, 2, 'Doble Carne 300g', 25000.00, 1, NULL),
(12, 3, 'Pollo Crispy 180g', 21000.00, 1, NULL),
(13, 4, 'Perro Especial', 14000.00, 1, NULL),
(14, 5, 'Perro Suizo Gourmet', 17000.00, 1, NULL),
(15, 6, 'Salchipapa Personal Grande', 23000.00, 1, NULL),
(16, 7, 'Combo Pareja Completo', 38000.00, 1, NULL),
(19, 10, 'Botella 500ml', 3000.00, 1, NULL),
(26, 15, 'Porción Individual 150g', 5000.00, 1, NULL),
(28, 17, 'Porción Individual', 10500.00, 1, NULL),
(29, 18, 'Porción Individual', 8500.00, 1, NULL),
(30, 19, 'Porción Individual', 10500.00, 1, NULL),
(31, 20, 'Porción Individual', 8500.00, 1, NULL),
(32, 21, 'Porción Individual', 13500.00, 1, NULL),
(33, 22, 'Porción Individual', 15500.00, 1, NULL),
(34, 23, 'Porción Individual', 17500.00, 1, NULL),
(35, 24, 'Porción Individual', 15500.00, 1, NULL),
(36, 25, 'Porción Individual', 17500.00, 1, NULL),
(37, 26, 'Edición Especial Burger Fest', 24000.00, 1, NULL),
(39, 27, 'Individual BBQ Bacon 150g', 22000.00, 1, NULL),
(40, 27, 'Doble Carne BBQ Bacon 300g', 28000.00, 1, NULL),
(41, 28, 'Mexicana Clásica', 23500.00, 1, NULL),
(42, 28, 'Extra Picante con Doble Jalapeño', 25000.00, 1, NULL),
(43, 29, 'Individual Campesina', 23000.00, 1, NULL),
(44, 30, 'Perro Mexicano Clásico', 16000.00, 1, NULL),
(45, 31, 'Perro Criollo Gourmet', 16500.00, 1, NULL),
(46, 32, 'Porción Personal Grande', 21000.00, 1, NULL),
(47, 32, 'Familiar para Compartir (2 Personas)', 34000.00, 1, NULL),
(48, 33, 'Porción Costeña Grande', 22500.00, 1, NULL),
(49, 34, 'Combo con Coca-Cola Original 400ml', 24500.00, 1, NULL),
(50, 34, 'Combo con Postobón Manzana 400ml', 24500.00, 1, NULL),
(51, 34, 'Combo con Coca-Cola Sin Azúcar 400ml', 24500.00, 1, NULL),
(52, 35, 'Combo Familiar 4 Personas', 68000.00, 1, NULL),
(53, 36, 'Combo Dúo Perros Calientes', 32000.00, 1, NULL),
(55, 37, 'Edición Especial', 24000.00, 1, NULL),
(58, 8, 'Sin Azúcar / Light 400ml', 4500.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789342941/rcxdoursw1roe9f8bmpw.png'),
(59, 9, 'Botella 1.5 Litros', 8500.00, 1, '/images/drinks/manzana_1.5_L-removebg-preview.png'),
(60, 9, 'Mega Botella 2.5 Litros', 12000.00, 1, '/images/drinks/Manzana-Super-Gigante-25-Litros-223182_a-removebg-preview.png'),
(61, 8, 'Botella 1.5 Litros', 9500.00, 1, '/images/drinks/coca_cola_1.5-LITROS-removebg-preview.png'),
(62, 8, 'Mega Botella 2.5 Litros', 13500.00, 1, '/images/drinks/mega_coca_cola-removebg-preview.png'),
(63, 11, 'Botella 1.5 Litros', 8500.00, 1, '/images/drinks/pepsi_1.5-removebg-preview.png'),
(64, 11, 'Mega Botella 2.5 Litros', 12000.00, 1, '/images/drinks/mega_pepsi-removebg-preview.png'),
(65, 11, 'Sin Azúcar / Light 400ml', 4000.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789872832/akjyapmemvunluyjl0vo.png'),
(66, 12, 'Botella 1.5 Litros', 8500.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136012/cvrko0myywmpm9uu29y6.png'),
(67, 12, 'Mega Botella 2.5 Litros', 12000.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136012/vkjyox7pahkfvpvvd704.png'),
(68, 12, 'Sabor Uva 400ml', 4000.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136013/fdhjpw2iyq3jrp5y4val.png'),
(69, 12, 'Sabor Naranja 400ml', 4000.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136013/upl99pgij1ibrm5bga6o.png'),
(70, 12, 'Sabor Manzana 400ml', 4000.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136013/puq7ofiaex69bes5yhly.png'),
(71, 9, 'Sabor Uva 400ml', 8500.00, 1, '/images/drinks/uva_postobon-removebg-preview.png'),
(72, 9, 'Sabor Naranja 400ml', 8500.00, 1, '/images/drinks/images__Gaseosa_naranja_-removebg-preview.png'),
(73, 9, 'Gaseosa Colombiana Postobón 400ml', 8500.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136069/w7lobhfvjxbjafr2co3x.png'),
(74, 13, 'Botella 1.5 Litros', 8500.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136146/krtmjhqcdyagp6jlk1t0.webp'),
(75, 13, 'Mega Botella 2.5 Litros', 12000.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136142/yh8hi4excjrn95lxsvpi.png'),
(76, 14, 'Botella 1.5 Litros', 8500.00, 1, '/images/drinks/gaseosa-quatro-15-lt-removebg-preview.png'),
(77, 14, 'Mega Botella 2.5 Litros', 12000.00, 1, '/images/drinks/quatro_mega-removebg-preview.png'),
(78, 16, 'Con Azúcar 400ml', 4500.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136235/wrexzfrkodlfb3n4cp7w.png'),
(79, 16, 'Botella 1.5 Litros', 4500.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136235/cuhvubrfxj5vcwbedq24.jpg'),
(80, 16, 'Mega Botella 2.5 Litros', 4500.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790136235/sianbch6fdcmoasvwugn.jpg'),
(81, 38, 'Botella 1.5 Litros', 8500.00, 1, '/images/drinks/bebida-uva-1500ml_00-600x600-removebg-preview.png'),
(82, 38, 'Mega Botella 2.5 Litros', 12000.00, 1, '/images/drinks/Uva_mega-removebg-preview.png'),
(83, 38, 'Sabor Naranja 400ml', 8500.00, 1, '/images/drinks/images__Gaseosa_naranja_-removebg-preview.png'),
(84, 38, 'Sabor Manzana 400ml', 8500.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790137311/kiyyjb6ar74oyzdtdcyg.png'),
(85, 38, 'Sabor Colombiana 400ml', 8500.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790137311/uhp9lcertbfyn5wzicpb.png'),
(86, 39, 'Botella 1.5 Litros', 8500.00, 1, '/images/drinks/naranga_1.5-removebg-preview.png'),
(87, 39, 'Mega Botella 2.5 Litros', 12000.00, 1, '/images/drinks/postob_n_naranja_2.5l_1_-removebg-preview.png'),
(88, 39, 'Sabor Uva 400ml', 8500.00, 1, '/images/drinks/uva_postobon-removebg-preview.png'),
(89, 39, 'Sabor Manzana 400ml', 8500.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790140466/xnkmahkxmrvwlrueok5y.png'),
(90, 39, 'Sabor Colombiana 400ml', 8500.00, 1, 'https://res.cloudinary.com/dckwtknmq/image/upload/v1790140466/mwzer41bv7rr3y5xbela.png');

-- --------------------------------------------------------
-- Tabla: `venta`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `venta`;
CREATE TABLE `venta` (
  `idVenta` int(11) NOT NULL AUTO_INCREMENT,
  `idCliente` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idDescuento` int(11) DEFAULT NULL,
  `fechaVenta` datetime DEFAULT NULL,
  `tipoVenta` varchar(50) DEFAULT 'PUNTO_DE_VENTA',
  `subtotal` decimal(12,2) NOT NULL,
  `descuentoAplicado` decimal(12,2) DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL,
  `estadoEntrega` enum('PENDIENTE','PREPARANDO','LISTO','EN_CAMINO','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE',
  `observaciones` text DEFAULT NULL,
  `origen` varchar(30) DEFAULT NULL,
  `tiempoEstimadoEntrega` varchar(60) DEFAULT NULL,
  `estadoAprobacion` enum('PENDIENTE','APROBADO','RECHAZADO') DEFAULT 'PENDIENTE',
  PRIMARY KEY (`idVenta`),
  KEY `IDX_VentaCliente` (`idCliente`),
  KEY `IDX_VentaUsuario` (`idUsuario`),
  KEY `IDX_VentaDescuento` (`idDescuento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `venta`
INSERT INTO `venta` (`idVenta`, `idCliente`, `idUsuario`, `idDescuento`, `fechaVenta`, `tipoVenta`, `subtotal`, `descuentoAplicado`, `total`, `estadoEntrega`, `observaciones`, `origen`, `tiempoEstimadoEntrega`, `estadoAprobacion`) VALUES
(117, 2, 6, NULL, '2026-09-14 11:48:35', 'DOMICILIO', 18000.00, 2700.00, 15300.00, 'PENDIENTE', '{\"horario\":\"06:48 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-5939\",\"clienteNombre\":\"María García\",\"productos\":[{\"id\":1,\"idVariante\":1,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":1,\"precioUnitario\":18000,\"total\":18000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\"}', NULL, NULL, 'PENDIENTE'),
(118, 8, 24, NULL, '2026-09-14 16:01:28', 'PUNTO_DE_VENTA', 43000.00, 6450.00, 36550.00, 'ENTREGADO', '{\"horario\":\"11:01 a. m.\",\"tipoEntrega\":\"Mesa\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-8661\",\"clienteNombre\":\"Fernando Gómez Jaramillo\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":2,\"precioUnitario\":18000,\"total\":36000,\"observaciones\":\"\",\"adiciones\":[{\"idAdicion\":3,\"id\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"cantidad\":1,\"precio\":3500}]}],\"especificaciones\":\"Prueba Automatizada de Descuento de Stock Chazin Food\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\"}', NULL, NULL, 'PENDIENTE'),
(119, 16, 4, NULL, '2026-09-17 01:29:21', 'PUNTO_DE_VENTA', 40000.00, 0.00, 40000.00, 'PENDIENTE', '{\"horario\":\"08:29 p. m.\",\"tipoEntrega\":\"Recoger\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-1738\",\"clienteNombre\":\"Cliente Mostrador\",\"productos\":[{\"idVariante\":56,\"nombre\":\"tester\",\"cantidad\":1,\"precioUnitario\":20000,\"total\":20000,\"observaciones\":\"\",\"adiciones\":[]},{\"idVariante\":38,\"nombre\":\"tester\",\"cantidad\":1,\"precioUnitario\":20000,\"total\":20000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":{\"tipoEntrega\":\"Recoger\",\"direccion\":\"Recoger en Local\",\"metodoPago\":\"Efectivo\",\"clienteNombre\":\"Cliente Mostrador\",\"efectivoConCuanto\":40000,\"vueltoEfectivo\":null,\"tarjetaNumero\":null,\"transferBanco\":null,\"transferenciaReferencia\":null,\"especificaciones\":\"\",\"productos\":[{\"idVariante\":56,\"nombre\":\"tester\",\"cantidad\":1,\"precioUnitario\":20000,\"total\":20000,\"observaciones\":\"\",\"adiciones\":[]},{\"idVariante\":38,\"nombre\":\"tester\",\"cantidad\":1,\"precioUnitario\":20000,\"total\":20000,\"observaciones\":\"\",\"adiciones\":[]}]},\"efectivoConCuanto\":40000,\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\"}', NULL, NULL, 'PENDIENTE'),
(120, 16, 4, NULL, '2026-09-17 01:30:00', 'PUNTO_DE_VENTA', 20000.00, 0.00, 20000.00, 'PENDIENTE', '{\"horario\":\"08:30 p. m.\",\"tipoEntrega\":\"Recoger\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-0665\",\"clienteNombre\":\"Cliente Mostrador\",\"productos\":[{\"idVariante\":56,\"nombre\":\"tester\",\"cantidad\":1,\"precioUnitario\":20000,\"total\":20000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":{\"tipoEntrega\":\"Recoger\",\"direccion\":\"Recoger en Local\",\"metodoPago\":\"Efectivo\",\"clienteNombre\":\"Cliente Mostrador\",\"efectivoConCuanto\":20000,\"vueltoEfectivo\":null,\"tarjetaNumero\":null,\"transferBanco\":null,\"transferenciaReferencia\":null,\"especificaciones\":\"\",\"productos\":[{\"idVariante\":56,\"nombre\":\"tester\",\"cantidad\":1,\"precioUnitario\":20000,\"total\":20000,\"observaciones\":\"\",\"adiciones\":[]}]},\"efectivoConCuanto\":20000,\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\"}', NULL, NULL, 'PENDIENTE'),
(121, 2, 6, NULL, '2026-09-17 01:53:09', 'DOMICILIO', 60000.00, 9000.00, 51000.00, 'PENDIENTE', '{\"horario\":\"08:53 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-9092\",\"clienteNombre\":\"María García\",\"productos\":[{\"id\":38,\"idVariante\":38,\"nombre\":\"tester\",\"cantidad\":3,\"precioUnitario\":20000,\"total\":60000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"51000\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\"}', NULL, NULL, 'PENDIENTE'),
(122, 16, 4, NULL, '2026-09-22 23:53:08', 'PUNTO_DE_VENTA', 23000.00, 3450.00, 19550.00, 'PENDIENTE', '{\"horario\":\"06:53 p. m.\",\"tipoEntrega\":\"Recoger\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-8328\",\"clienteNombre\":\"Cliente Mostrador\",\"productos\":[{\"idProducto\":6,\"idVariante\":15,\"nombre\":\"Salchipapa Salvaje Gourmet\",\"cantidad\":1,\"precioUnitario\":23000,\"total\":19550,\"observaciones\":\"\",\"adiciones\":[],\"descuento\":15,\"evento\":\"Super Fin de Semana Chazin (15% OFF)\"}],\"especificaciones\":{\"tipoEntrega\":\"Recoger\",\"direccion\":\"Recoger en Local\",\"metodoPago\":\"Efectivo\",\"clienteNombre\":\"Cliente Mostrador\",\"efectivoConCuanto\":23000,\"vueltoEfectivo\":null,\"tarjetaNumero\":null,\"transferBanco\":null,\"transferenciaReferencia\":null,\"especificaciones\":\"\",\"productos\":[{\"idProducto\":6,\"idVariante\":15,\"nombre\":\"Salchipapa Salvaje Gourmet\",\"cantidad\":1,\"precioUnitario\":23000,\"total\":19550,\"observaciones\":\"\",\"adiciones\":[],\"descuento\":15,\"evento\":\"Super Fin de Semana Chazin (15% OFF)\"}]},\"efectivoConCuanto\":23000,\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\",\"descuentoPorcentaje\":15,\"descuentoAplicado\":3450,\"eventoPromocional\":\"Super Fin de Semana Chazin (15% OFF)\"}', NULL, NULL, 'PENDIENTE'),
(123, 16, 4, NULL, '2026-09-22 23:53:51', 'PUNTO_DE_VENTA', 15500.00, 0.00, 15500.00, 'PENDIENTE', '{\"horario\":\"06:53 p. m.\",\"tipoEntrega\":\"Recoger\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-1276\",\"clienteNombre\":\"Cliente Mostrador\",\"productos\":[{\"idProducto\":22,\"idVariante\":33,\"nombre\":\"Papas con Chili Mediana\",\"cantidad\":1,\"precioUnitario\":15500,\"total\":15500,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":{\"tipoEntrega\":\"Recoger\",\"direccion\":\"Recoger en Local\",\"metodoPago\":\"Efectivo\",\"clienteNombre\":\"Cliente Mostrador\",\"efectivoConCuanto\":15500,\"vueltoEfectivo\":null,\"tarjetaNumero\":null,\"transferBanco\":null,\"transferenciaReferencia\":null,\"especificaciones\":\"\",\"productos\":[{\"idProducto\":22,\"idVariante\":33,\"nombre\":\"Papas con Chili Mediana\",\"cantidad\":1,\"precioUnitario\":15500,\"total\":15500,\"observaciones\":\"\",\"adiciones\":[]}]},\"efectivoConCuanto\":15500,\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\",\"descuentoPorcentaje\":0,\"descuentoAplicado\":0}', NULL, NULL, 'PENDIENTE'),
(124, 8, 24, NULL, '2026-09-22 23:55:53', 'PUNTO_DE_VENTA', 36000.00, 5400.00, 30600.00, 'ENTREGADO', '{\"horario\":\"06:55 p. m.\",\"tipoEntrega\":\"Mesa\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-3672\",\"clienteNombre\":\"Fernando Gómez Jaramillo\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":2,\"precioUnitario\":18000,\"total\":36000,\"observaciones\":\"\",\"adiciones\":[{\"idAdicion\":18,\"id\":18,\"nombre\":\"Tocineta Ahumada en Tiras\",\"cantidad\":1,\"precio\":null}]}],\"especificaciones\":\"Prueba Automatizada de Descuento de Stock Chazin Food\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\"}', NULL, NULL, 'PENDIENTE'),
(125, 16, 4, NULL, '2026-09-23 06:13:57', 'PUNTO_DE_VENTA', 18000.00, 0.00, 18000.00, 'PENDIENTE', '{\"horario\":\"01:13 a. m.\",\"tipoEntrega\":\"Recoger\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-7132\",\"clienteNombre\":\"Cliente Mostrador\",\"productos\":[{\"idProducto\":1,\"idVariante\":10,\"nombre\":\"Clásica 150g\",\"cantidad\":1,\"precioUnitario\":18000,\"total\":18000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":{\"tipoEntrega\":\"Recoger\",\"direccion\":\"Recoger en Local\",\"metodoPago\":\"Efectivo\",\"clienteNombre\":\"Cliente Mostrador\",\"efectivoConCuanto\":20000,\"vueltoEfectivo\":2000,\"tarjetaNumero\":null,\"transferBanco\":null,\"transferenciaReferencia\":null,\"especificaciones\":\"\",\"productos\":[{\"idProducto\":1,\"idVariante\":10,\"nombre\":\"Clásica 150g\",\"cantidad\":1,\"precioUnitario\":18000,\"total\":18000,\"observaciones\":\"\",\"adiciones\":[]}]},\"efectivoConCuanto\":20000,\"vueltoEfectivo\":2000,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\"}', NULL, NULL, 'PENDIENTE'),
(126, 17, 25, NULL, '2026-09-23 11:34:05', 'DOMICILIO', 120500.00, 0.00, 120500.00, 'ENTREGADO', '{\"horario\":\"06:34 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi (CARD)\",\"direccion\":\"Calle 102A #22D - 40\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-5367\",\"clienteNombre\":\"Mariana Silva Vergara\",\"productos\":[{\"id\":27,\"idVariante\":27,\"nombre\":\"Individual BBQ Bacon 150g\",\"cantidad\":1,\"precioUnitario\":22000,\"total\":22000,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":28,\"idVariante\":28,\"nombre\":\"Mexicana Clásica\",\"cantidad\":4,\"precioUnitario\":23500,\"total\":94000,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":58,\"idVariante\":58,\"nombre\":\"Gaseosa Coca-Cola 400ml\",\"cantidad\":1,\"precioUnitario\":4500,\"total\":4500,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\",\"wompiTransactionId\":\"12178141-1790163366-39770\",\"wompiStatus\":\"APPROVED\",\"paymentMethodType\":\"CARD\",\"wompiPaymentMethod\":{\"type\":\"CARD\",\"extra\":{\"bin\":\"424242\",\"name\":\"VISA-4242\",\"brand\":\"VISA\",\"issuer\":\"STRIPE PAYMENTS UK LIMITED\",\"card_type\":\"CREDIT\",\"last_four\":\"4242\",\"card_holder\":\"Mariana\",\"is_three_ds\":true,\"country_iso2\":\"GB\",\"three_ds_auth\":{\"current_step\":\"AUTHENTICATION\",\"current_step_status\":\"COMPLETED\"},\"three_ds_auth_type\":null,\"external_identifier\":\"SacwRk9iTF\",\"processor_response_code\":\"00\"},\"installments\":1,\"is_click_to_pay\":false}}', NULL, NULL, 'APROBADO'),
(127, 17, 24, NULL, '2026-09-23 11:43:45', 'PUNTO_DE_VENTA', 321450.00, 0.00, 321450.00, 'PENDIENTE', '{\"horario\":\"06:43 a. m.\",\"tipoEntrega\":\"Recoger\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-5567\",\"clienteNombre\":\"Mariana Silva Vergara\",\"productos\":[{\"id\":1,\"idVariante\":1,\"nombre\":\"Hamburguesa Clásica Chazin (Jueves 2x1 de Burger Artesanal)\",\"cantidad\":1,\"cantidadCocina\":2,\"is2x1Promo\":true,\"precioUnitario\":18000,\"total\":18000,\"observaciones\":\"¡PROMO 2x1!: Preparar 2 unidades (1 pagada + 1 gratis)\",\"adiciones\":[]},{\"id\":2,\"idVariante\":2,\"nombre\":\"Hamburguesa Doble Carne & Tocineta (20% OFF en Doble Carne & Tocineta)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":20000,\"total\":20000,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":3,\"idVariante\":3,\"nombre\":\"Hamburguesa Pollo Crispy Gourmet (Promo Relámpago: Pollo Crispy Gourmet)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":17500,\"total\":17500,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":4,\"idVariante\":4,\"nombre\":\"Perro Caliente Especial Americano (Super Fin de Semana Chazin (15% OFF))\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":11900,\"total\":11900,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":5,\"idVariante\":5,\"nombre\":\"Perro Suizo Chazin (Festival de Toppings: Perro Suizo + Doble Tocineta Gratis)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":17000,\"total\":17000,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":6,\"idVariante\":6,\"nombre\":\"Salchipapa Salvaje Gourmet (Super Fin de Semana Chazin (15% OFF))\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":19550,\"total\":19550,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":7,\"idVariante\":7,\"nombre\":\"Combo Pareja Chazin (Combo Pareja Festivo)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":34000,\"total\":34000,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":8,\"idVariante\":8,\"nombre\":\"Coca-Cola Original (400 ml)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":4500,\"total\":4500,\"observaciones\":\"Sabor: Coca-Cola Original, Presentación: 400 ml\",\"adiciones\":[]},{\"id\":9,\"idVariante\":9,\"nombre\":\"Gaseosa Manzana Postobón (400 ml)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":8500,\"total\":8500,\"observaciones\":\"Sabor: Gaseosa Manzana Postobón, Presentación: 400 ml\",\"adiciones\":[]},{\"id\":10,\"idVariante\":10,\"nombre\":\"Agua Cristal sin Gas 600ml\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":3000,\"total\":3000,\"observaciones\":\"Sabor: Agua Cristal sin Gas\",\"adiciones\":[]},{\"id\":11,\"idVariante\":11,\"nombre\":\"Pepsi Regular (400 ml)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":4000,\"total\":4000,\"observaciones\":\"Sabor: Pepsi Regular, Presentación: 400 ml\",\"adiciones\":[]},{\"id\":12,\"idVariante\":12,\"nombre\":\"Gaseosa Colombiana Postobón (400 ml)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":4000,\"total\":4000,\"observaciones\":\"Sabor: Gaseosa Colombiana Postobón, Presentación: 400 ml\",\"adiciones\":[]},{\"id\":13,\"idVariante\":13,\"nombre\":\" (400 ml)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":8500,\"total\":8500,\"observaciones\":\"Sabor: Botella 400 ml, Presentación: 400 ml\",\"adiciones\":[]},{\"id\":14,\"idVariante\":14,\"nombre\":\" (400 ml)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":8500,\"total\":8500,\"observaciones\":\"Sabor: Botella 400 ml, Presentación: 400 ml\",\"adiciones\":[]},{\"id\":15,\"idVariante\":15,\"nombre\":\"Porción Individual 150g\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":5000,\"total\":5000,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":16,\"idVariante\":16,\"nombre\":\"Coca-Cola Sin Azúcar / Light (400 ml)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":4500,\"total\":4500,\"observaciones\":\"Sabor: Coca-Cola Sin Azúcar / Light, Presentación: 400 ml\",\"adiciones\":[]},{\"id\":17,\"idVariante\":17,\"nombre\":\"Porción Individual\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":10500,\"total\":10500,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":18,\"idVariante\":18,\"nombre\":\"Porción Individual\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":8500,\"total\":8500,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":19,\"idVariante\":19,\"nombre\":\"Porción Individual\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":10500,\"total\":10500,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":20,\"idVariante\":20,\"nombre\":\"Porción Individual\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":8500,\"total\":8500,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":21,\"idVariante\":21,\"nombre\":\"Porción Individual\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":13500,\"total\":13500,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":22,\"idVariante\":22,\"nombre\":\"Porción Individual\",\"cantidad\":2,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":15500,\"total\":31000,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":23,\"idVariante\":23,\"nombre\":\"Porción Individual\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":17500,\"total\":17500,\"observaciones\":\"Bebidas combo: 1x Gaseosa Manzana Postobón 400ml\",\"adiciones\":[]},{\"id\":23,\"idVariante\":23,\"nombre\":\"Porción Individual\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":17500,\"total\":17500,\"observaciones\":\"Bebidas combo: 1x Gaseosa Sprite 400ml\",\"adiciones\":[]},{\"id\":24,\"idVariante\":24,\"nombre\":\"Porción Individual\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":15500,\"total\":15500,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"322000\",\"vueltoEfectivo\":550,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\"}', NULL, NULL, 'PENDIENTE'),
(128, 16, 4, NULL, '2026-09-23 11:55:45', 'PUNTO_DE_VENTA', 20000.00, 0.00, 20000.00, 'ENTREGADO', '{\"horario\":\"06:55 a. m.\",\"tipoEntrega\":\"Recoger\",\"metodoPago\":\"Transferencia\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-5872\",\"clienteNombre\":\"Cliente Mostrador\",\"productos\":[{\"idProducto\":2,\"idVariante\":11,\"nombre\":\"Doble Carne 300g\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":20000,\"total\":20000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":{\"tipoEntrega\":\"Recoger\",\"direccion\":\"Recoger en Local\",\"metodoPago\":\"Transferencia\",\"clienteNombre\":\"Cliente Mostrador\",\"efectivoConCuanto\":null,\"vueltoEfectivo\":null,\"tarjetaNumero\":null,\"transferBanco\":\"Otro\",\"transferenciaReferencia\":\"12345678\",\"especificaciones\":\"\",\"productos\":[{\"idProducto\":2,\"idVariante\":11,\"nombre\":\"Doble Carne 300g\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":20000,\"total\":20000,\"observaciones\":\"\",\"adiciones\":[]}]},\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"12345678\",\"transferBanco\":\"Otro\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(129, 16, 4, NULL, '2026-09-23 11:57:01', 'PUNTO_DE_VENTA', 20000.00, 0.00, 20000.00, 'ENTREGADO', '{\"horario\":\"06:57 a. m.\",\"tipoEntrega\":\"Recoger\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-1300\",\"clienteNombre\":\"Yeison Barrios\",\"productos\":[{\"idProducto\":2,\"idVariante\":11,\"nombre\":\"Doble Carne 300g\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":20000,\"total\":20000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":{\"tipoEntrega\":\"Recoger\",\"direccion\":\"Recoger en Local\",\"metodoPago\":\"Efectivo\",\"clienteNombre\":\"Yeison Barrios\",\"efectivoConCuanto\":20000,\"vueltoEfectivo\":null,\"tarjetaNumero\":null,\"transferBanco\":null,\"transferenciaReferencia\":null,\"especificaciones\":\"\",\"productos\":[{\"idProducto\":2,\"idVariante\":11,\"nombre\":\"Doble Carne 300g\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":20000,\"total\":20000,\"observaciones\":\"\",\"adiciones\":[]}]},\"efectivoConCuanto\":20000,\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(130, 2, 6, NULL, '2026-09-24 04:47:02', 'DOMICILIO', 20500.00, 3075.00, 17425.00, 'PENDIENTE', '{\"horario\":\"11:47 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-2306\",\"clienteNombre\":\"María García\",\"productos\":[{\"id\":30,\"idVariante\":30,\"nombre\":\"Perro Mexicano Clásico\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":16000,\"total\":16000,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":58,\"idVariante\":58,\"nombre\":\"Gaseosa Coca-Cola 400ml\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":4500,\"total\":4500,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"20500\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\"}', NULL, NULL, 'PENDIENTE'),
(131, 2, 6, NULL, '2026-09-24 04:47:41', 'DOMICILIO', 17500.00, 2625.00, 14875.00, 'LISTO', '{\"horario\":\"11:47 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-1098\",\"clienteNombre\":\"María García\",\"productos\":[{\"id\":3,\"idVariante\":3,\"nombre\":\"Hamburguesa Pollo Crispy Gourmet (Promo Relámpago: Pollo Crispy Gourmet)\",\"cantidad\":1,\"cantidadCocina\":1,\"is2x1Promo\":false,\"precioUnitario\":17500,\"total\":17500,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"20000\",\"vueltoEfectivo\":2500,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\",\"horaEstado\":\"06:37 a. m.\",\"fechaCambioEstado\":\"2026-10-29T11:37:31.209Z\",\"historialEstados\":[{\"estado\":\"LISTO\",\"hora\":\"06:37 a. m.\",\"fecha\":\"2026-10-29T11:37:31.209Z\"}]}', NULL, NULL, 'APROBADO'),
(132, 2, 6, NULL, '2026-09-24 11:51:30', 'DOMICILIO', 18000.00, 2700.00, 15300.00, 'ENTREGADO', '{\"horario\":\"06:51 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-0797\",\"clienteNombre\":\"María García\",\"productos\":[{\"id\":1,\"idVariante\":1,\"nombre\":\"Hamburguesa Clásica Chazin (Jueves 2x1 de Burger Artesanal)\",\"cantidad\":1,\"cantidadCocina\":2,\"is2x1Promo\":true,\"precioUnitario\":18000,\"total\":18000,\"observaciones\":\"¡PROMO 2x1!: Preparar 2 unidades (1 pagada + 1 gratis)\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"20000\",\"vueltoEfectivo\":4700,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(133, 21, 27, NULL, '2026-10-06 12:26:46', 'DOMICILIO', 130000.00, 0.00, 130000.00, 'ENTREGADO', '{\"horario\":\"07:26 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi (CARD)\",\"direccion\":\"Casa de mi mamá\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-6171\",\"clienteNombre\":\"Magnolia Pripra\",\"productos\":[{\"id\":37,\"idVariante\":37,\"nombre\":\"Hamburguesa Burger Fest Trufada (Chazin Burger Fest 2026 - Edicion Limitada)\",\"cantidad\":1,\"precioUnitario\":24000,\"total\":24000,\"observaciones\":\"\",\"adiciones\":[]},{\"id\":29,\"idVariante\":29,\"nombre\":\"Individual Campesina\",\"cantidad\":2,\"precioUnitario\":23000,\"total\":58000,\"observaciones\":\"Sin Lechuga Batavia Fresca\",\"adiciones\":[{\"idAdicion\":19,\"nombre\":\"Queso Cheddar en Lonchas\",\"precio\":2500,\"cantidad\":1},{\"idAdicion\":18,\"nombre\":\"Tocineta Ahumada en Tiras\",\"precio\":3500,\"cantidad\":1}]},{\"id\":27,\"idVariante\":27,\"nombre\":\"Individual BBQ Bacon 150g\",\"cantidad\":2,\"precioUnitario\":22000,\"total\":48000,\"observaciones\":\"\",\"adiciones\":[{\"idAdicion\":17,\"nombre\":\"Salchicha Suiza Ahumada\",\"precio\":2000,\"cantidad\":1}]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\",\"wompiTransactionId\":\"12178141-1791289821-97279\",\"wompiStatus\":\"APPROVED\",\"paymentMethodType\":\"CARD\",\"wompiPaymentMethod\":{\"type\":\"CARD\",\"extra\":{\"bin\":\"424242\",\"name\":\"VISA-4242\",\"brand\":\"VISA\",\"issuer\":\"STRIPE PAYMENTS UK LIMITED\",\"card_type\":\"CREDIT\",\"last_four\":\"4242\",\"card_holder\":\"Magnolia\",\"is_three_ds\":true,\"country_iso2\":\"GB\",\"three_ds_auth\":{\"current_step\":\"AUTHENTICATION\",\"current_step_status\":\"COMPLETED\"},\"three_ds_auth_type\":null,\"external_identifier\":\"u46505xGU4\",\"processor_response_code\":\"00\"},\"installments\":1,\"is_click_to_pay\":false}}', NULL, NULL, 'APROBADO'),
(134, 22, 28, NULL, '2026-10-18 17:44:05', 'DOMICILIO', 18000.00, 0.00, 18000.00, 'PENDIENTE', '{\"horario\":\"12:44 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle 12 # 34-56\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-5844\",\"clienteNombre\":\"Juan Perez\",\"productos\":[{\"id\":1,\"idVariante\":1,\"nombre\":\"Hamburguesa Clásica Chazin (Jueves 2x1 de Burger Artesanal)\",\"cantidad\":1,\"precioUnitario\":18000,\"total\":18000,\"observaciones\":\"¡PROMO 2x1!: Preparar 2 unidades (1 pagada + 1 gratis)\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\",\"tiempoEstimadoEntrega\":\"Aprox. 45 min\"}', NULL, NULL, 'PENDIENTE'),
(135, 16, 4, NULL, '2026-10-19 04:18:45', 'PUNTO_DE_VENTA', 18000.00, 0.00, 18000.00, 'PENDIENTE', '{\"horario\":\"11:18 p. m.\",\"tipoEntrega\":\"Recoger\",\"metodoPago\":\"Tarjeta\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-5801\",\"clienteNombre\":\"Juan Perez\",\"productos\":[{\"idProducto\":1,\"idVariante\":10,\"nombre\":\"Clásica 150g (Promo 2x1 - Paga 1 Lleva 2)\",\"cantidad\":1,\"cantidadCocina\":2,\"is2x1Promo\":true,\"precioUnitario\":18000,\"total\":18000,\"observaciones\":\"¡PROMO 2x1!: Preparar 2 unidades (1 pagada + 1 gratis)\",\"adiciones\":[]}],\"especificaciones\":{\"tipoEntrega\":\"Recoger\",\"direccion\":\"Recoger en Local\",\"metodoPago\":\"Tarjeta\",\"clienteNombre\":\"Juan Perez\",\"efectivoConCuanto\":50000,\"vueltoEfectivo\":32000,\"tarjetaNumero\":\"4000 1234 5678 9010\",\"transferBanco\":null,\"transferenciaReferencia\":null,\"especificaciones\":\"\",\"productos\":[{\"idProducto\":1,\"idVariante\":10,\"nombre\":\"Clásica 150g (Promo 2x1 - Paga 1 Lleva 2)\",\"cantidad\":1,\"cantidadCocina\":2,\"is2x1Promo\":true,\"precioUnitario\":18000,\"total\":18000,\"observaciones\":\"¡PROMO 2x1!: Preparar 2 unidades (1 pagada + 1 gratis)\",\"adiciones\":[]}]},\"efectivoConCuanto\":50000,\"vueltoEfectivo\":32000,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"4000 1234 5678 9010\",\"estadoAprobacion\":\"PENDIENTE\"}', NULL, NULL, 'PENDIENTE'),
(136, 8, 24, NULL, '2026-10-21 02:14:31', 'PUNTO_DE_VENTA', 36000.00, 5400.00, 30600.00, 'ENTREGADO', '{\"horario\":\"09:14 p. m.\",\"tipoEntrega\":\"Mesa\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-1905\",\"clienteNombre\":\"Fernando Gómez Jaramillo\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":2,\"precioUnitario\":18000,\"total\":36000,\"observaciones\":\"\",\"adiciones\":[{\"idAdicion\":18,\"id\":18,\"nombre\":\"Tocineta Ahumada en Tiras\",\"cantidad\":1,\"precio\":null}]}],\"especificaciones\":\"Prueba Automatizada de Descuento de Stock Chazin Food\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(137, 8, 24, NULL, '2026-10-21 02:17:31', 'PUNTO_DE_VENTA', 36000.00, 5400.00, 30600.00, 'ENTREGADO', '{\"horario\":\"09:17 p. m.\",\"tipoEntrega\":\"Mesa\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-1834\",\"clienteNombre\":\"Fernando Gómez Jaramillo\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":2,\"precioUnitario\":18000,\"total\":36000,\"observaciones\":\"\",\"adiciones\":[{\"idAdicion\":18,\"id\":18,\"nombre\":\"Tocineta Ahumada en Tiras\",\"cantidad\":1,\"precio\":null}]}],\"especificaciones\":\"Prueba Automatizada de Descuento de Stock Chazin Food\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(138, 8, 24, NULL, '2026-10-21 02:17:57', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:17 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-7577\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(139, 8, 24, NULL, '2026-10-21 02:17:57', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:17 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-7743\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(140, 8, 24, NULL, '2026-10-21 02:17:57', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:17 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-7852\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(141, 8, 24, NULL, '2026-10-21 02:17:57', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:17 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-7953\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(142, 8, 24, NULL, '2026-10-21 02:17:58', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:17 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-8063\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(143, 8, 24, NULL, '2026-10-21 02:17:58', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:17 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-8170\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(144, 8, 24, NULL, '2026-10-21 02:17:58', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:17 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-8262\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(145, 8, 24, NULL, '2026-10-21 02:17:58', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:17 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-8383\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(146, 8, 24, NULL, '2026-10-21 02:17:59', 'PUNTO_DE_VENTA', 45000.00, 6750.00, 38250.00, 'PENDIENTE', '{\"horario\":\"09:17 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Carrera 10 #20-30, Bogotá\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-9014\",\"clienteNombre\":\"Carlos Prueba\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":2,\"precioUnitario\":15000,\"total\":30000,\"observaciones\":\"\",\"adiciones\":[]},{\"nombre\":\"Producto\",\"cantidad\":5,\"precioUnitario\":3000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"Sin cebolla, dejar en portería\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(147, 8, 24, NULL, '2026-10-21 02:25:17', 'PUNTO_DE_VENTA', 36000.00, 5400.00, 30600.00, 'ENTREGADO', '{\"horario\":\"09:25 p. m.\",\"tipoEntrega\":\"Mesa\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-7970\",\"clienteNombre\":\"Fernando Gómez Jaramillo\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":2,\"precioUnitario\":18000,\"total\":36000,\"observaciones\":\"\",\"adiciones\":[{\"idAdicion\":18,\"id\":18,\"nombre\":\"Tocineta Ahumada en Tiras\",\"cantidad\":1,\"precio\":null}]}],\"especificaciones\":\"Prueba Automatizada de Descuento de Stock Chazin Food\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(148, 8, 24, NULL, '2026-10-21 02:37:04', 'PUNTO_DE_VENTA', 36000.00, 5400.00, 30600.00, 'ENTREGADO', '{\"horario\":\"09:37 p. m.\",\"tipoEntrega\":\"Mesa\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-4827\",\"clienteNombre\":\"Fernando Gómez Jaramillo\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":2,\"precioUnitario\":18000,\"total\":36000,\"observaciones\":\"\",\"adiciones\":[{\"idAdicion\":18,\"id\":18,\"nombre\":\"Tocineta Ahumada en Tiras\",\"cantidad\":1,\"precio\":null}]}],\"especificaciones\":\"Prueba Automatizada de Descuento de Stock Chazin Food\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(149, 8, 24, NULL, '2026-10-21 02:37:34', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:37 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-4236\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(150, 8, 24, NULL, '2026-10-21 02:37:34', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:37 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-4366\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(151, 8, 24, NULL, '2026-10-21 02:37:34', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:37 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-4471\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(152, 8, 24, NULL, '2026-10-21 02:37:34', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:37 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-4574\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(153, 8, 24, NULL, '2026-10-21 02:37:34', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:37 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-4675\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(154, 8, 24, NULL, '2026-10-21 02:37:34', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:37 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-4771\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(155, 8, 24, NULL, '2026-10-21 02:37:34', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:37 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-4863\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(156, 8, 24, NULL, '2026-10-21 02:37:34', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"09:37 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-4953\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(157, 8, 24, NULL, '2026-10-21 02:37:35', 'PUNTO_DE_VENTA', 45000.00, 6750.00, 38250.00, 'PENDIENTE', '{\"horario\":\"09:37 p. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Carrera 10 #20-30, Bogotá\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-5642\",\"clienteNombre\":\"Carlos Prueba\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":2,\"precioUnitario\":15000,\"total\":30000,\"observaciones\":\"\",\"adiciones\":[]},{\"nombre\":\"Producto\",\"cantidad\":5,\"precioUnitario\":3000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"Sin cebolla, dejar en portería\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(158, 8, 24, NULL, '2026-10-21 02:37:45', 'PUNTO_DE_VENTA', 36000.00, 5400.00, 30600.00, 'ENTREGADO', '{\"horario\":\"09:37 p. m.\",\"tipoEntrega\":\"Mesa\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-5083\",\"clienteNombre\":\"Fernando Gómez Jaramillo\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":2,\"precioUnitario\":18000,\"total\":36000,\"observaciones\":\"\",\"adiciones\":[{\"idAdicion\":18,\"id\":18,\"nombre\":\"Tocineta Ahumada en Tiras\",\"cantidad\":1,\"precio\":null}]}],\"especificaciones\":\"Prueba Automatizada de Descuento de Stock Chazin Food\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(159, 8, 24, NULL, '2026-10-22 15:09:36', 'PUNTO_DE_VENTA', 36000.00, 5400.00, 30600.00, 'ENTREGADO', '{\"horario\":\"10:09 a. m.\",\"tipoEntrega\":\"Mesa\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-6396\",\"clienteNombre\":\"Fernando Gómez Jaramillo\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":2,\"precioUnitario\":18000,\"total\":36000,\"observaciones\":\"\",\"adiciones\":[{\"idAdicion\":18,\"id\":18,\"nombre\":\"Tocineta Ahumada en Tiras\",\"cantidad\":1,\"precio\":null}]}],\"especificaciones\":\"Prueba Automatizada de Descuento de Stock Chazin Food\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(160, 8, 24, NULL, '2026-10-22 15:33:22', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:33 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-2309\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(161, 8, 24, NULL, '2026-10-22 15:33:22', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:33 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-2482\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(162, 8, 24, NULL, '2026-10-22 15:33:22', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:33 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-2601\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(163, 8, 24, NULL, '2026-10-22 15:33:22', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:33 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-2709\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(164, 8, 24, NULL, '2026-10-22 15:33:22', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:33 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-2814\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(165, 8, 24, NULL, '2026-10-22 15:33:22', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:33 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-2924\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(166, 8, 24, NULL, '2026-10-22 15:33:23', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:33 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-3029\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO');

INSERT INTO `venta` (`idVenta`, `idCliente`, `idUsuario`, `idDescuento`, `fechaVenta`, `tipoVenta`, `subtotal`, `descuentoAplicado`, `total`, `estadoEntrega`, `observaciones`, `origen`, `tiempoEstimadoEntrega`, `estadoAprobacion`) VALUES
(167, 8, 24, NULL, '2026-10-22 15:33:23', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:33 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-3151\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(168, 8, 24, NULL, '2026-10-22 15:33:23', 'PUNTO_DE_VENTA', 45000.00, 6750.00, 38250.00, 'PENDIENTE', '{\"horario\":\"10:33 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Carrera 10 #20-30, Bogotá\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-3730\",\"clienteNombre\":\"Carlos Prueba\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":2,\"precioUnitario\":15000,\"total\":30000,\"observaciones\":\"\",\"adiciones\":[]},{\"nombre\":\"Producto\",\"cantidad\":5,\"precioUnitario\":3000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"Sin cebolla, dejar en portería\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(169, 8, 24, NULL, '2026-10-22 15:57:49', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:57 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-9137\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(170, 8, 24, NULL, '2026-10-22 15:57:49', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:57 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-9292\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(171, 8, 24, NULL, '2026-10-22 15:57:49', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:57 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-9412\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(172, 8, 24, NULL, '2026-10-22 15:57:49', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:57 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-9517\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(173, 8, 24, NULL, '2026-10-22 15:57:49', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:57 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-9614\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(174, 8, 24, NULL, '2026-10-22 15:57:49', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:57 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-9722\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(175, 8, 24, NULL, '2026-10-22 15:57:49', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:57 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-9816\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(176, 8, 24, NULL, '2026-10-22 15:57:49', 'PUNTO_DE_VENTA', 15000.00, 2250.00, 12750.00, 'PENDIENTE', '{\"horario\":\"10:57 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-9911\",\"clienteNombre\":\"Test Wompi\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":15000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(177, 8, 24, NULL, '2026-10-22 15:57:50', 'PUNTO_DE_VENTA', 45000.00, 6750.00, 38250.00, 'PENDIENTE', '{\"horario\":\"10:57 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Carrera 10 #20-30, Bogotá\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-0544\",\"clienteNombre\":\"Carlos Prueba\",\"productos\":[{\"nombre\":\"Producto\",\"cantidad\":2,\"precioUnitario\":15000,\"total\":30000,\"observaciones\":\"\",\"adiciones\":[]},{\"nombre\":\"Producto\",\"cantidad\":5,\"precioUnitario\":3000,\"total\":15000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"Sin cebolla, dejar en portería\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(178, 8, 24, NULL, '2026-10-22 15:58:01', 'PUNTO_DE_VENTA', 36000.00, 5400.00, 30600.00, 'ENTREGADO', '{\"horario\":\"10:58 a. m.\",\"tipoEntrega\":\"Mesa\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-1516\",\"clienteNombre\":\"Fernando Gómez Jaramillo\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":2,\"precioUnitario\":18000,\"total\":36000,\"observaciones\":\"\",\"adiciones\":[{\"idAdicion\":18,\"id\":18,\"nombre\":\"Tocineta Ahumada en Tiras\",\"cantidad\":1,\"precio\":null}]}],\"especificaciones\":\"Prueba Automatizada de Descuento de Stock Chazin Food\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"APROBADO\"}', NULL, NULL, 'APROBADO'),
(179, 16, 4, NULL, '2026-10-28 15:51:59', 'PUNTO_DE_VENTA', 100.00, 0.00, 100.00, 'CANCELADO', '{\"horario\":\"10:51 a. m.\",\"tipoEntrega\":\"Recoger\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-9647\",\"clienteNombre\":\"Admin Sistema\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":100,\"total\":100,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"QA_SECURITY_TEST_PRICE_MANIPULATION\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"origen\":\"PUNTO_FISICO\",\"tiempoEstimadoEntrega\":\"15 - 20 min\",\"empaqueParaLlevar\":false,\"estadoAprobacion\":\"APROBADO\",\"horaEstado\":\"10:52 a. m.\",\"fechaCambioEstado\":\"2026-10-28T15:52:00.016Z\",\"historialEstados\":[{\"estado\":\"CANCELADO\",\"hora\":\"10:52 a. m.\",\"fecha\":\"2026-10-28T15:52:00.016Z\"}]}', 'PUNTO_FISICO', '15 - 20 min', 'RECHAZADO'),
(180, 16, 4, NULL, '2026-10-28 15:53:06', 'PUNTO_DE_VENTA', 100.00, 0.00, 100.00, 'CANCELADO', '{\"horario\":\"10:53 a. m.\",\"tipoEntrega\":\"Recoger\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-6822\",\"clienteNombre\":\"Admin Sistema\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Producto\",\"cantidad\":1,\"precioUnitario\":100,\"total\":100,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"QA_SECURITY_TEST_PRICE_MANIPULATION\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"origen\":\"PUNTO_FISICO\",\"tiempoEstimadoEntrega\":\"15 - 20 min\",\"empaqueParaLlevar\":false,\"estadoAprobacion\":\"APROBADO\",\"horaEstado\":\"10:53 a. m.\",\"fechaCambioEstado\":\"2026-10-28T15:53:07.008Z\",\"historialEstados\":[{\"estado\":\"CANCELADO\",\"hora\":\"10:53 a. m.\",\"fecha\":\"2026-10-28T15:53:07.008Z\"}]}', 'PUNTO_FISICO', '15 - 20 min', 'RECHAZADO');

-- --------------------------------------------------------
-- Vistas
-- --------------------------------------------------------
DROP VIEW IF EXISTS `vwinventario`;
CREATE VIEW `vwinventario` AS SELECT `i`.`idInsumo` AS `idInsumo`, `i`.`nombre` AS `nombre`, `c`.`nombre` AS `Categoria`, `i`.`stock` AS `stock`, `i`.`stockMinimo` AS `stockMinimo`, `i`.`unidadMedida` AS `unidadMedida`, `i`.`fechaVencimiento` AS `fechaVencimiento` FROM (`insumo` `i` join `categoriainsumo` `c` on(`c`.`idCategoriaInsumo` = `i`.`idCategoriaInsumo`));

DROP VIEW IF EXISTS `vwproductos`;
CREATE VIEW `vwproductos` AS SELECT `p`.`idProducto` AS `idProducto`, `p`.`nombre` AS `nombre`, `cp`.`nombre` AS `Categoria`, `v`.`nombre` AS `Variante`, `v`.`precio` AS `precio` FROM ((`producto` `p` join `categoriaproducto` `cp` on(`cp`.`idCategoriaProducto` = `p`.`idCategoriaProducto`)) join `variante` `v` on(`v`.`idProducto` = `p`.`idProducto`));

DROP VIEW IF EXISTS `vwventas`;
CREATE VIEW `vwventas` AS SELECT `v`.`idVenta` AS `idVenta`, concat(`u`.`nombre`,' ',`u`.`apellidos`) AS `Cliente`, `v`.`fechaVenta` AS `fechaVenta`, `v`.`subtotal` AS `subtotal`, `v`.`descuentoAplicado` AS `descuentoAplicado`, `v`.`total` AS `total`, `v`.`estadoEntrega` AS `estadoEntrega` FROM ((`venta` `v` join `cliente` `c` on(`c`.`idCliente` = `v`.`idCliente`)) join `usuario` `u` on(`u`.`idUsuario` = `c`.`idUsuario`));

-- --------------------------------------------------------
-- Claves foráneas (Restricciones)
-- --------------------------------------------------------
ALTER TABLE `cliente`
  ADD CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`idProveedor`) REFERENCES `proveedor` (`idProveedor`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `descuento`
  ADD CONSTRAINT `descuento_ibfk_1` FOREIGN KEY (`idEvento`) REFERENCES `evento` (`idEvento`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `detallecomprainsumo`
  ADD CONSTRAINT `detallecomprainsumo_ibfk_115` FOREIGN KEY (`idCompra`) REFERENCES `compra` (`idCompra`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detallecomprainsumo_ibfk_116` FOREIGN KEY (`idInsumo`) REFERENCES `insumo` (`idInsumo`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `detallefichainsumo`
  ADD CONSTRAINT `detallefichainsumo_ibfk_115` FOREIGN KEY (`idFichaTecnica`) REFERENCES `fichatecnica` (`idFichaTecnica`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detallefichainsumo_ibfk_116` FOREIGN KEY (`idInsumo`) REFERENCES `insumo` (`idInsumo`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `detalleinsumopreparadoinsumo`
  ADD CONSTRAINT `detalleinsumopreparadoinsumo_ibfk_119` FOREIGN KEY (`idPreparado`) REFERENCES `insumopreparado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalleinsumopreparadoinsumo_ibfk_120` FOREIGN KEY (`idInsumo`) REFERENCES `insumo` (`idInsumo`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `detalleventaadicion`
  ADD CONSTRAINT `detalleventaadicion_ibfk_115` FOREIGN KEY (`idDetalleVenta`) REFERENCES `detalleventaproducto` (`idDetalleVenta`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalleventaadicion_insumo` FOREIGN KEY (`idAdicion`) REFERENCES `insumo` (`idInsumo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dva_insumo` FOREIGN KEY (`idAdicion`) REFERENCES `insumo` (`idInsumo`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `detalleventaproducto`
  ADD CONSTRAINT `detalleventaproducto_ibfk_119` FOREIGN KEY (`idVenta`) REFERENCES `venta` (`idVenta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalleventaproducto_ibfk_120` FOREIGN KEY (`idVariante`) REFERENCES `variante` (`idVariante`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `devolucion`
  ADD CONSTRAINT `devolucion_ibfk_1` FOREIGN KEY (`idVenta`) REFERENCES `venta` (`idVenta`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `evento`
  ADD CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `fichatecnica`
  ADD CONSTRAINT `fichatecnica_ibfk_177` FOREIGN KEY (`idVariante`) REFERENCES `variante` (`idVariante`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fichatecnica_ibfk_178` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fichatecnica_ibfk_179` FOREIGN KEY (`idInsumo`) REFERENCES `insumo` (`idInsumo`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `insumo`
  ADD CONSTRAINT `insumo_ibfk_119` FOREIGN KEY (`idCategoriaInsumo`) REFERENCES `categoriainsumo` (`idCategoriaInsumo`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `insumo_ibfk_120` FOREIGN KEY (`idProveedor`) REFERENCES `proveedor` (`idProveedor`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `pago`
  ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`idVenta`) REFERENCES `venta` (`idVenta`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`clienteId`) REFERENCES `cliente` (`idCliente`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`idCategoriaProducto`) REFERENCES `categoriaproducto` (`idCategoriaProducto`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `proveedor`
  ADD CONSTRAINT `proveedor_ibfk_121` FOREIGN KEY (`idTipoProveedor`) REFERENCES `tipoproveedor` (`idTipoProveedor`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `proveedor_ibfk_122` FOREIGN KEY (`idTipoDocumento`) REFERENCES `tipodocumento` (`idTipoDocumento`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `rolpermiso`
  ADD CONSTRAINT `rolpermiso_ibfk_167` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rolpermiso_ibfk_168` FOREIGN KEY (`idPermiso`) REFERENCES `permiso` (`idPermiso`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `trazabilidad`
  ADD CONSTRAINT `trazabilidad_ibfk_119` FOREIGN KEY (`idInsumo`) REFERENCES `insumo` (`idInsumo`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `trazabilidad_ibfk_120` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`idUsuario`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `variante`
  ADD CONSTRAINT `variante_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_178` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `venta_ibfk_179` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `venta_ibfk_180` FOREIGN KEY (`idDescuento`) REFERENCES `descuento` (`idDescuento`) ON DELETE NO ACTION ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
