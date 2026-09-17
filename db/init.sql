-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: chazinfood
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `chazinfood`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `chazinfood` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `chazinfood`;

--
-- Table structure for table `adicion`
--

DROP TABLE IF EXISTS `adicion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adicion` (
  `idAdicion` int(11) NOT NULL AUTO_INCREMENT,
  `idInsumo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`idAdicion`),
  KEY `FK_AdicionInsumo` (`idInsumo`),
  CONSTRAINT `adicion_ibfk_1` FOREIGN KEY (`idInsumo`) REFERENCES `insumo` (`idInsumo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adicion`
--

LOCK TABLES `adicion` WRITE;
/*!40000 ALTER TABLE `adicion` DISABLE KEYS */;
INSERT INTO `adicion` VALUES (1,6,'Tocineta Extra','panceta 100% de cerdo listo para acompañar','',3500.00,0),(2,4,'Queso extra cheddar','queso especial para derretir ','',2500.00,0),(3,18,'Extra Tocineta Ahumada (2 tiras)','2 tiras crujientes de tocineta ahumada artesanal','https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80',3500.00,1),(4,19,'Extra Queso Cheddar (2 lonchas)','Doble loncha de queso cheddar americano derretido','https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp',2500.00,1),(5,21,'Porción Papas a la Francesa (150g)','Porción individual de papas fritas doradas y crocantes','https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80',5000.00,1),(6,24,'Porción Cebolla Caramelizada (50g)','Cebolla blanca caramelizada al punto dulce','https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg',2000.00,1),(7,25,'Jalapeños Picantes Extra (40g)','Rodajas de jalapeño encurtido con picante medio','https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg',2000.00,1),(8,26,'Salsa Chazin Especial Adicional','Pote extra de 50g con salsa secreta de la casa','https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80',1500.00,1),(9,44,'Salsa BBQ Ahumada Artesanal (50g)','Pote de 50g con salsa BBQ clásica de cocción lenta y toque ahumado','https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',1500.00,1),(10,45,'Salsa Tártara Casera Especial (50g)','Pote de 50g con salsa tártara cremosa con alcaparras y finas hierbas','https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',1500.00,1),(11,41,'Suero Costeño Cremoso Artesanal (50g)','Pote de 50g de auténtico suero costeño tradicional cremoso','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',1500.00,1),(12,43,'Porción Queso Cheddar Fundido (60g)','Pote de 60g de delicioso queso cheddar caliente y fundido para bañar tus papas','https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp',2500.00,1),(13,40,'Porción Guacamole Fresco Artesanal (60g)','Pote de 60g con guacamole fresco preparado con aguacate hass, limón y cilantro','https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',2500.00,1);
/*!40000 ALTER TABLE `adicion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriainsumo`
--

DROP TABLE IF EXISTS `categoriainsumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoriainsumo` (
  `idCategoriaInsumo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`idCategoriaInsumo`),
  UNIQUE KEY `UK_CategoriaInsumo` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriainsumo`
--

LOCK TABLES `categoriainsumo` WRITE;
/*!40000 ALTER TABLE `categoriainsumo` DISABLE KEYS */;
INSERT INTO `categoriainsumo` VALUES (1,'Panadería y Masas','Panes artesanales y bases',1),(2,'Lácteos y Quesos','Quesos cheddar, mozzarella y mantequillas',1),(3,'Vegetales y Frescos','Lechuga, tomate, cebolla y papas',1),(4,'Salsas y Aderezos','Salsas de la casa, mayonesa y aderezos',1),(5,'Bebidas Embotelladas','Gaseosas y aguas',1),(6,'Verduras Especiales',NULL,1),(7,'Salsas y Condimentos',NULL,1),(8,'Carnes','Res, Cerdo, Frias',1),(9,'Cárnicos y Proteínas','Carnes de res, pollo, salchichas y tocinetas',1);
/*!40000 ALTER TABLE `categoriainsumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriaproducto`
--

DROP TABLE IF EXISTS `categoriaproducto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriaproducto`
--

LOCK TABLES `categoriaproducto` WRITE;
/*!40000 ALTER TABLE `categoriaproducto` DISABLE KEYS */;
INSERT INTO `categoriaproducto` VALUES (0,'__SISTEMA_VARIANTE_CERO__','Registro técnico para fichas de insumos sin variante',0,NULL),(1,'Perros Calientes','Perros calientes americanos y especiales con queso gratinado',1,'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993441/c9pne5jrmjv5po93xhhl.jpg'),(2,'Combos','Combos familiares y de pareja con papas y bebidas',1,'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993361/txnwutylvbhjvwhyu9vs.jpg'),(3,'Hamburguesas','Hamburguesas artesanales de res y pollo',1,'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993393/bjyqxmdsjyywi3vfkal2.jpg'),(4,'Bebidas','Gaseosas, jugos y bebidas refrescantes',1,'https://res.cloudinary.com/dckwtknmq/image/upload/v1788993322/hy2izk0bysbya4mcdd9m.webp'),(5,'Salchipapas Gourmet','Papas a la francesa con variedad de carnes y salsas',1,'https://res.cloudinary.com/dckwtknmq/image/upload/v1788990540/umhitukfpjefhmuovzjf.avif'),(6,'Acompañamientos','Papas francesas, rústicas en casco, espirales y especialidades para acompañar',1,'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007803/rozvcptnxp9gg6wbxtgt.jpg');
/*!40000 ALTER TABLE `categoriaproducto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cliente` (
  `idCliente` int(11) NOT NULL AUTO_INCREMENT,
  `direccion` varchar(255) DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`idCliente`),
  UNIQUE KEY `UK_Cliente_Usuario` (`idUsuario`),
  KEY `IDX_ClienteUsuario` (`idUsuario`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'{\"direccion\":\"Avenida Siempre Viva 742\",\"tipo\":\"Nuevo\",\"ciclo\":0}',12),(2,'{\"direccion\":\"Cl. 21 #80 21, Belén, Medellín\",\"tipo\":\"Nuevo\",\"ciclo\":0}',10),(3,'{\"direccion\":\"Calle Falsa 123\",\"tipo\":\"VIP\",\"ciclo\":0,\"inicio\":\"2026-09-14T11:48:36.094Z\",\"vence\":\"2026-10-14T11:48:36.094Z\"}',6),(4,'{\"direccion\":\"Calle 10 # 5-20\",\"tipo\":\"Nuevo\",\"ciclo\":0}',7),(5,'{\"direccion\":\"Avenida 33 # 80-10\",\"tipo\":\"Nuevo\",\"ciclo\":0}',9),(6,'{\"direccion\":\"Calle 45a #36a - 35\",\"tipo\":\"Nuevo\",\"ciclo\":0}',2),(7,'{\"direccion\":\"Callev35a #58b- 56\",\"tipo\":\"Nuevo\",\"ciclo\":0}',3),(8,'{\"direccion\":\"Calle 50a #45b - 60\",\"tipo\":\"Nuevo\",\"ciclo\":0}',11),(10,'{\"direccion\":\"Calle 34B #112C - 54\",\"tipo\":\"VIP\",\"ciclo\":1,\"inicio\":\"2026-09-08T22:22:53.969Z\",\"vence\":\"2026-10-08T22:22:53.969Z\"}',1),(11,'{\"direccion\":\"Calle 50\",\"tipo\":\"Nuevo\",\"ciclo\":0}',13),(13,'{\"direccion\":\"Carrera QA # 100 - 20, Medellín\",\"tipo\":\"Regular\",\"ciclo\":0,\"inicio\":\"2026-08-22T18:12:20.603Z\",\"vence\":\"2026-09-21T18:12:20.603Z\"}',19),(14,'{\"direccion\":\"calle siempre activa 90 \",\"tipo\":\"Nuevo\",\"ciclo\":0}',20),(15,'{\"direccion\":\"CL 76 C C R  910 B 37\",\"tipo\":\"Nuevo\",\"ciclo\":0}',21),(16,'{\"direccion\":\"Calle RR 23 CL 80\",\"tipo\":\"Nuevo\",\"ciclo\":0}',22),(21,'',23),(22,'',14),(26,'{\"direccion\":\"\",\"tipo\":\"Regular\",\"ciclo\":0,\"inicio\":\"2026-09-01T12:05:14.094Z\",\"vence\":\"2026-10-01T12:05:14.094Z\"}',NULL);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compra`
--

DROP TABLE IF EXISTS `compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compra` (
  `idCompra` int(11) NOT NULL AUTO_INCREMENT,
  `idProveedor` int(11) NOT NULL,
  `fechaCompra` datetime DEFAULT NULL,
  `total` decimal(12,2) NOT NULL,
  `estado` enum('PENDIENTE','RECIBIDA','CANCELADA') DEFAULT 'RECIBIDA',
  PRIMARY KEY (`idCompra`),
  KEY `IDX_CompraProveedor` (`idProveedor`),
  CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`idProveedor`) REFERENCES `proveedor` (`idProveedor`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compra`
--

LOCK TABLES `compra` WRITE;
/*!40000 ALTER TABLE `compra` DISABLE KEYS */;
INSERT INTO `compra` VALUES (1,1,'2026-08-10 00:00:00',1.00,'PENDIENTE'),(2,1,'2026-08-25 00:00:00',100000.00,'PENDIENTE');
/*!40000 ALTER TABLE `compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `descuento`
--

DROP TABLE IF EXISTS `descuento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `descuento` (
  `idDescuento` int(11) NOT NULL AUTO_INCREMENT,
  `idEvento` int(11) NOT NULL,
  `nombreDescuento` varchar(120) NOT NULL,
  `tipoDescuento` enum('PORCENTAJE','VALOR FIJO') NOT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `valorFijo` decimal(10,2) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`idDescuento`),
  KEY `IDX_DescuentoEvento` (`idEvento`),
  CONSTRAINT `descuento_ibfk_1` FOREIGN KEY (`idEvento`) REFERENCES `evento` (`idEvento`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descuento`
--

LOCK TABLES `descuento` WRITE;
/*!40000 ALTER TABLE `descuento` DISABLE KEYS */;
INSERT INTO `descuento` VALUES (1,2,'2x1 Jueves Burger','PORCENTAJE',50.00,NULL,1),(2,3,'15% Descuento Finde','PORCENTAJE',15.00,NULL,1),(3,4,'Combo Pareja Promo','VALOR FIJO',NULL,4000.00,1);
/*!40000 ALTER TABLE `descuento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallecomprainsumo`
--

DROP TABLE IF EXISTS `detallecomprainsumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detallecomprainsumo` (
  `idDetalleCompra` int(11) NOT NULL AUTO_INCREMENT,
  `idCompra` int(11) NOT NULL,
  `idInsumo` int(11) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  PRIMARY KEY (`idDetalleCompra`),
  KEY `IDX_DetalleCompra` (`idCompra`),
  KEY `IDX_DetalleCompraInsumo` (`idInsumo`),
  CONSTRAINT `detallecomprainsumo_ibfk_115` FOREIGN KEY (`idCompra`) REFERENCES `compra` (`idCompra`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detallecomprainsumo_ibfk_116` FOREIGN KEY (`idInsumo`) REFERENCES `insumo` (`idInsumo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallecomprainsumo`
--

LOCK TABLES `detallecomprainsumo` WRITE;
/*!40000 ALTER TABLE `detallecomprainsumo` DISABLE KEYS */;
INSERT INTO `detallecomprainsumo` VALUES (1,1,3,10.00,0.10,1.00),(2,2,1,100.00,1000.00,100000.00);
/*!40000 ALTER TABLE `detallecomprainsumo` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_EntradaInventario` AFTER INSERT ON `detallecomprainsumo` FOR EACH ROW BEGIN

    UPDATE insumo
    SET stock = stock + NEW.cantidad
    WHERE idInsumo = NEW.idInsumo;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `detallefichainsumo`
--

DROP TABLE IF EXISTS `detallefichainsumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detallefichainsumo` (
  `idDetalleFicha` int(11) NOT NULL AUTO_INCREMENT,
  `idFichaTecnica` int(11) NOT NULL,
  `idInsumo` int(11) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `unidadMedida` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`idDetalleFicha`),
  KEY `IDX_DetalleFichaTecnica` (`idFichaTecnica`),
  KEY `IDX_DetalleFichaInsumo` (`idInsumo`),
  CONSTRAINT `detallefichainsumo_ibfk_115` FOREIGN KEY (`idFichaTecnica`) REFERENCES `fichatecnica` (`idFichaTecnica`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detallefichainsumo_ibfk_116` FOREIGN KEY (`idInsumo`) REFERENCES `insumo` (`idInsumo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallefichainsumo`
--

LOCK TABLES `detallefichainsumo` WRITE;
/*!40000 ALTER TABLE `detallefichainsumo` DISABLE KEYS */;
INSERT INTO `detallefichainsumo` VALUES (127,4,12,1.00,'und'),(128,4,14,0.15,'kg'),(129,4,19,1.00,'und'),(130,4,18,0.03,'kg'),(131,4,22,0.02,'kg'),(132,4,23,0.03,'kg'),(133,5,12,1.00,'und'),(134,5,14,0.30,'kg'),(135,5,19,2.00,'und'),(136,5,18,0.06,'kg'),(137,5,24,0.04,'kg'),(138,6,12,1.00,'und'),(139,6,15,0.18,'kg'),(140,6,20,0.04,'kg'),(141,6,22,0.02,'kg'),(142,6,23,0.03,'kg'),(143,7,13,1.00,'und'),(144,7,16,1.00,'und'),(145,7,18,0.03,'kg'),(146,7,20,0.04,'kg'),(147,8,13,1.00,'und'),(148,8,17,1.00,'und'),(149,8,18,0.03,'kg'),(150,8,20,0.05,'kg'),(151,8,24,0.03,'kg'),(152,9,21,0.25,'kg'),(153,9,16,1.00,'und'),(154,9,17,1.00,'und'),(155,9,18,0.04,'kg'),(156,9,20,0.06,'kg'),(157,10,12,2.00,'und'),(158,10,14,0.30,'kg'),(159,10,19,2.00,'und'),(160,10,18,0.06,'kg'),(161,10,21,0.20,'kg'),(162,10,29,2.00,'und'),(163,11,29,1.00,'und'),(164,12,30,1.00,'und'),(167,13,31,1.00,'und'),(168,14,33,1.00,'und'),(169,15,35,1.00,'und'),(170,16,36,1.00,'und'),(171,17,37,1.00,'und'),(172,18,21,0.15,'kg'),(173,19,32,1.00,'und'),(174,20,21,0.22,'kg'),(175,21,21,0.15,'kg'),(176,22,38,0.24,'kg'),(177,23,38,0.16,'kg'),(178,24,42,0.20,'kg'),(179,25,21,0.16,'kg'),(180,25,39,0.08,'kg'),(181,25,40,0.04,'kg'),(182,25,43,0.04,'kg'),(183,26,21,0.16,'kg'),(184,26,39,0.08,'kg'),(185,26,40,0.04,'kg'),(186,26,43,0.04,'kg'),(187,26,29,1.00,'und'),(188,27,21,0.16,'kg'),(189,27,18,0.05,'kg'),(190,27,41,0.04,'kg'),(191,27,43,0.04,'kg'),(192,28,21,0.16,'kg'),(193,28,18,0.05,'kg'),(194,28,41,0.04,'kg'),(195,28,43,0.04,'kg'),(196,28,29,1.00,'und'),(197,29,12,1.00,'und'),(198,29,14,0.18,'kg'),(199,30,12,1.00,'und'),(200,30,14,0.15,'kg'),(201,30,18,0.04,'kg'),(202,30,19,2.00,'und'),(203,30,24,0.04,'kg'),(204,30,44,0.03,'kg'),(205,31,12,1.00,'und'),(206,31,14,0.15,'kg'),(207,31,40,0.05,'kg'),(208,31,25,0.02,'kg'),(209,31,20,0.04,'kg'),(210,31,22,0.02,'kg'),(211,32,12,1.00,'und'),(212,32,14,0.15,'kg'),(213,32,20,0.04,'kg'),(214,32,18,0.03,'kg'),(215,32,24,0.03,'kg'),(216,32,23,0.03,'kg'),(217,32,22,0.02,'kg'),(218,32,45,0.02,'kg'),(219,33,13,1.00,'und'),(220,33,16,1.00,'und'),(221,33,40,0.04,'kg'),(222,33,43,0.03,'kg'),(223,33,18,0.02,'kg'),(224,33,25,0.02,'kg'),(225,34,13,1.00,'und'),(226,34,16,1.00,'und'),(227,34,17,0.50,'und'),(228,34,18,0.03,'kg'),(229,34,20,0.04,'kg'),(230,34,41,0.03,'kg'),(231,35,21,0.25,'kg'),(232,35,16,1.50,'und'),(233,35,18,0.04,'kg'),(234,35,20,0.05,'kg'),(235,35,41,0.03,'kg'),(236,35,43,0.03,'kg'),(237,36,21,0.25,'kg'),(238,36,17,1.50,'und'),(239,36,18,0.04,'kg'),(240,36,20,0.05,'kg'),(241,36,41,0.04,'kg'),(242,36,45,0.03,'kg'),(243,37,12,1.00,'und'),(244,37,14,0.15,'kg'),(245,37,19,1.00,'und'),(246,37,18,0.03,'kg'),(247,37,21,0.15,'kg'),(248,37,29,1.00,'und'),(249,38,12,2.00,'und'),(250,38,13,2.00,'und'),(251,38,14,0.30,'kg'),(252,38,16,2.00,'und'),(253,38,19,2.00,'und'),(254,38,20,0.08,'kg'),(255,38,18,0.10,'kg'),(256,38,21,0.40,'kg'),(257,38,29,4.00,'und'),(258,39,13,2.00,'und'),(259,39,16,2.00,'und'),(260,39,20,0.08,'kg'),(261,39,18,0.06,'kg'),(262,39,21,0.25,'kg'),(263,39,29,2.00,'und'),(272,40,12,1.00,'und'),(273,40,14,0.18,'kg'),(274,40,18,0.04,'kg'),(275,40,19,2.00,'und'),(276,40,43,0.03,'kg'),(277,40,45,0.03,'kg'),(278,40,22,0.02,'kg'),(279,40,23,0.03,'kg');
/*!40000 ALTER TABLE `detallefichainsumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalleinsumopreparadoinsumo`
--

DROP TABLE IF EXISTS `detalleinsumopreparadoinsumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detalleinsumopreparadoinsumo` (
  `idDetalle` int(11) NOT NULL AUTO_INCREMENT,
  `idPreparado` int(11) NOT NULL,
  `idInsumo` int(11) NOT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `unidadMedida` varchar(255) DEFAULT NULL,
  `precioUnitario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`idDetalle`),
  KEY `fk_detalle_preparado` (`idPreparado`),
  KEY `fk_detalle_insumo_normal` (`idInsumo`),
  CONSTRAINT `detalleinsumopreparadoinsumo_ibfk_119` FOREIGN KEY (`idPreparado`) REFERENCES `insumopreparado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detalleinsumopreparadoinsumo_ibfk_120` FOREIGN KEY (`idInsumo`) REFERENCES `insumo` (`idInsumo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleinsumopreparadoinsumo`
--

LOCK TABLES `detalleinsumopreparadoinsumo` WRITE;
/*!40000 ALTER TABLE `detalleinsumopreparadoinsumo` DISABLE KEYS */;
INSERT INTO `detalleinsumopreparadoinsumo` VALUES (37,1,2,1.00,'paq',800.00),(60,7,28,0.60,'kg',13800.00),(61,7,26,0.25,'kg',12500.00),(62,7,27,0.15,'kg',11500.00),(63,8,24,1.00,'kg',3900.00),(64,9,14,1.50,'kg',28000.00);
/*!40000 ALTER TABLE `detalleinsumopreparadoinsumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalleventaadicion`
--

DROP TABLE IF EXISTS `detalleventaadicion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detalleventaadicion` (
  `idDetalleVentaAdicion` int(11) NOT NULL AUTO_INCREMENT,
  `idDetalleVenta` int(11) NOT NULL,
  `idAdicion` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT 1,
  `precio` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  PRIMARY KEY (`idDetalleVentaAdicion`),
  KEY `IDX_DetalleVentaAdicion` (`idDetalleVenta`),
  KEY `IDX_Adicion` (`idAdicion`),
  CONSTRAINT `detalleventaadicion_ibfk_115` FOREIGN KEY (`idDetalleVenta`) REFERENCES `detalleventaproducto` (`idDetalleVenta`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `detalleventaadicion_ibfk_116` FOREIGN KEY (`idAdicion`) REFERENCES `adicion` (`idAdicion`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleventaadicion`
--

LOCK TABLES `detalleventaadicion` WRITE;
/*!40000 ALTER TABLE `detalleventaadicion` DISABLE KEYS */;
INSERT INTO `detalleventaadicion` VALUES (8,127,3,1,3500.00,3500.00);
/*!40000 ALTER TABLE `detalleventaadicion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalleventaproducto`
--

DROP TABLE IF EXISTS `detalleventaproducto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  KEY `IDX_DetalleVentaVariante` (`idVariante`),
  CONSTRAINT `detalleventaproducto_ibfk_119` FOREIGN KEY (`idVenta`) REFERENCES `venta` (`idVenta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detalleventaproducto_ibfk_120` FOREIGN KEY (`idVariante`) REFERENCES `variante` (`idVariante`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleventaproducto`
--

LOCK TABLES `detalleventaproducto` WRITE;
/*!40000 ALTER TABLE `detalleventaproducto` DISABLE KEYS */;
INSERT INTO `detalleventaproducto` VALUES (126,117,10,1,18000.00,18000.00,'Hamburguesa Clásica Chazin'),(127,118,10,2,18000.00,36000.00,'Hamburguesa Clásica Chazin');
/*!40000 ALTER TABLE `detalleventaproducto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devolucion`
--

DROP TABLE IF EXISTS `devolucion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devolucion` (
  `idDevolucion` int(11) NOT NULL AUTO_INCREMENT,
  `idVenta` int(11) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `valorDevuelto` decimal(12,2) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `estado` enum('PENDIENTE','ACEPTADA','RECHAZADA') DEFAULT 'PENDIENTE',
  PRIMARY KEY (`idDevolucion`),
  KEY `IDX_DevolucionVenta` (`idVenta`),
  CONSTRAINT `devolucion_ibfk_1` FOREIGN KEY (`idVenta`) REFERENCES `venta` (`idVenta`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devolucion`
--

LOCK TABLES `devolucion` WRITE;
/*!40000 ALTER TABLE `devolucion` DISABLE KEYS */;
/*!40000 ALTER TABLE `devolucion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`idEvento`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
INSERT INTO `evento` VALUES (2,'Jueves 2x1 de Burger Artesanal','Paga 1 y lleva 2 Hamburguesas Clásicas todos los jueves del mes con salsas de la casa.','2026-09-01','2026-10-31',1,1,'PROMOCION_2X1',50.00,18000.00,NULL,NULL,NULL,NULL),(3,'Super Fin de Semana Chazin (15% OFF)','15% de descuento en todos los combos y hamburguesas por compras en línea superiores a $30.000 COP.','2026-09-01','2026-10-31',1,NULL,'DESCUENTO_GENERAL',15.00,NULL,NULL,NULL,'[{\"idProducto\":1,\"nombre\":\"Hamburguesa Clásica Chazin\",\"descuento\":15},{\"idProducto\":4,\"nombre\":\"Perro Caliente Especial Americano\",\"descuento\":15},{\"idProducto\":6,\"nombre\":\"Salchipapa Salvaje Gourmet\",\"descuento\":15}]',NULL),(4,'Combo Pareja Festivo','Combo Pareja Chazin a precio especial de $34.000 (Ahorro de $4.000) por temporada.','2026-09-01','2026-10-31',1,7,'COMBO_ESPECIAL',10.52,34000.00,NULL,NULL,NULL,NULL),(5,'🔥 Chazin Burger Fest 2026 - Edición Limitada','Participante oficial en el festival gastronómico del año. Receta conmemorativa de tiempo limitado con $4.000 de ahorro directo, pan brioche artesanal y salsa trufada secreta.','2026-09-01','2026-10-31',1,26,'EDICION_LIMITADA',14.28,24000.00,NULL,NULL,NULL,NULL),(6,'⚡ Promo Relámpago: Pollo Crispy Gourmet','Disfruta de nuestra crujiente pechuga de pollo apanada artesanal con salsa especial a un precio exclusivo de temporada.','2026-09-01','2026-10-31',1,3,'Promoción Precio',16.67,17500.00,NULL,NULL,NULL,NULL),(7,'💥 20% OFF en Doble Carne & Tocineta','Doble porción de carne jugosa 80/20 y doble tocineta ahumada con el 20% de descuento directo.','2026-09-01','2026-10-31',1,2,'Descuento',20.00,20000.00,NULL,NULL,NULL,NULL),(8,'🥓 Festival de Toppings: Perro Suizo + Doble Tocineta Gratis','Por tiempo limitado, tu Perro Suizo incluye adición de tocineta ahumada crujiente y queso fundido adicional sin costo extra.','2026-09-01','2026-10-31',1,5,'Añadir Insumos',0.00,17000.00,'Agregar','[{\"idInsumo\":3,\"nombre\":\"Tocineta Ahumada\",\"cantidad\":1,\"unidadMedida\":\"porción\"},{\"idInsumo\":4,\"nombre\":\"Queso Mozzarella Fundido\",\"cantidad\":1,\"unidadMedida\":\"porción\"}]',NULL,NULL),(9,'Chazin Burger Fest 2026 - Edicion Limitada','[🔥 Edición Festival] [DESTACADO_WEB]','2026-09-13','2026-10-15',1,37,'EDICION_LIMITADA',14.00,24000.00,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fichatecnica`
--

DROP TABLE IF EXISTS `fichatecnica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  KEY `idInsumo` (`idInsumo`),
  CONSTRAINT `fichatecnica_ibfk_177` FOREIGN KEY (`idVariante`) REFERENCES `variante` (`idVariante`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fichatecnica_ibfk_178` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fichatecnica_ibfk_179` FOREIGN KEY (`idInsumo`) REFERENCES `insumo` (`idInsumo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fichatecnica`
--

LOCK TABLES `fichatecnica` WRITE;
/*!40000 ALTER TABLE `fichatecnica` DISABLE KEYS */;
INSERT INTO `fichatecnica` VALUES (1,0,'textura bien maciza y firme con olor penetrante lista para su cocción','2026-08-18 00:58:08',NULL,7,'INSUMO','mezcle con el aji que ya esta preparado ',20,'1 porcion ','coordinar bien la mezcla de la carne con el chile carolina reapper','textura bien maciza y firme con olor penetrante lista para su cocción','calorías 20000','temperatura ambiente en el refrigerador ajustar','15 dias alli donde se almacena','altamente irritable he inflamable este chile',0),(2,0,'Textura sumamente suave, esponjosa y con alta retención de humedad. Sabor ligeramente dulce con notas características a papa y mantequilla. Color miga amarillo pálido y corteza dorada uniforme. Ausencia de magulladuras, deformaciones o desgarros en la superficie.','2026-08-31 06:17:50',NULL,8,'INSUMO','Producto listo para el consumo. Para potenciar sus atributos en hamburguesas, se recomienda cortar por la mitad, aplicar una fina capa de mantequilla o mayonesa en las caras internas y sellar a la plancha o tostadora a fuego medio durante 1 a 2 minutos hasta dorar.',6,'1 unidad por porción (hamburguesa).','Ingredientes principales: Harina de trigo fortificada, puré o fécula de papa, agua, azúcar, grasa vegetal o mantequilla, levadura, sal y mejoradores de masa.Humedad: Alta retención de humedad interna (aproximadamente entre un 32% y un 36%), lo que le otorga su suavidad característica.Dimensiones estándar (por unidad): Diámetro de 9 a 10 cm y altura de 4 a 5 cm (medidas promedio para pan de hamburguesa tipo brioche o americano).Peso promedio por unidad: Entre 60 g y 75 g según la marca comercial.Textura de la miga: Alveolado pequeño y cerrado, diseñado para soportar salsas y jugos de la carne sin desarmarse.Empaque de fábrica: Bolsa de polietileno de alta densidad con amarra plástica o sello de calor termoformado.','Textura sumamente suave, esponjosa y con alta retención de humedad. Sabor ligeramente dulce con notas características a papa y mantequilla. Color miga amarillo pálido y corteza dorada uniforme. Ausencia de magulladuras, deformaciones o desgarros en la superficie.','Por 100g (Aprox. 2 unidades): Calorías 290 kcal, proteínas 8g, carbohidratos 52g (de los cuales azúcares 6g), grasas totales 5g (saturadas 1.5g), fibra alimentaria 2g, sodio 410mg.','Conservar en su empaque original cerrado, en un lugar fresco, seco y protegido de la luz solar directa. Temperatura ambiente ideal entre 15°C y 25°C. Evitar zonas de alta humedad o cercanas a fuentes de calor (estufas/hornos) para prevenir el desarrollo de mohos. Una vez abierto, sellar firmemente el empaque.','14 a 21 días cerrado a temperatura ambiente. Hasta 3 meses congelado (-18°C) en empaque hermético.','Contiene gluten (trigo). Puede contener trazas de ajonjolí, leche, huevo o soya debido a líneas de producción compartidas. Almacenar separado de productos químicos o de olor fuerte.',1),(3,0,'Color rojo brillante y uniforme en la carne, con grasa de color blanco o ligeramente crema. Olor fresco y característico a carne cruda, completamente libre de notas ácidas, rancias o de descomposición. Textura firme, elástica al tacto y compacta, sin presencia de exudados excesivos o consistencia viscosa.','2026-08-31 06:24:49',NULL,9,'INSUMO','Porcionar la carne en frío (idealmente moldear las tortas de hamburguesa a temperaturas bajas para no derretir la grasa). Cocinar a la plancha, parrilla o sartén caliente hasta alcanzar una temperatura interna segura de 71°C (160°F).',5,'Depende del gramaje de tu receta. (Ejemplos estándar para copiar: 5 porciones de 200g por Kg o 8 por','Carne molida de res con un porcentaje de grasa estandarizado de 80/20 (80% magro, 20% grasa) para asegurar jugosidad. Color rojo brillante y uniforme, sin áreas oscuras o marrones. Olor fresco característico a carne cruda, libre de notas ácidas o de descomposición. Textura firme al tacto. Despachada y recibida a una temperatura de refrigeración controlada inferior o igual a 4°C.','Color rojo brillante y uniforme en la carne, con grasa de color blanco o ligeramente crema. Olor fresco y característico a carne cruda, completamente libre de notas ácidas, rancias o de descomposición. Textura firme, elástica al tacto y compacta, sin presencia de exudados excesivos o consistencia viscosa.','Por 100g: Calorías 250 kcal, proteínas 18g, carbohidratos 0g, grasas totales 20g (de las cuales saturadas 8g), colesterol 75mg, sodio 65mg.','Mantener bajo estricta cadena de frío en refrigeración a una temperatura entre 0°C y 4°C, alejada de alimentos cocidos para evitar contaminación cruzada. Si no se va a usar en el corto plazo, almacenar en congelación a -18°C o menos en empaque hermético.',' 2 a 3 días en refrigeración (0°C a 4°C) desde su molienda. Hasta 6 meses en congelación profunda (-','Producto altamente perecedero. No recongelar carne que ya haya sido descongelada. Libre de alérgenos comunes (no contiene gluten, lácteos ni soya), a menos que el proveedor especifique aditivos en su planta.',1),(4,10,'Carne jugosa y ahumada con costra sellada, queso cheddar cremoso fundido, pan brioche esponjoso y vegetales frescos crocantes.','2026-09-08 20:37:15',1,NULL,'PRODUCTO','1. Tostar el pan brioche artesanal en plancha con un toque de mantequilla hasta dorado ligero.\n2. Sellar el medallón de carne de res 150g a 200°C por 3 minutos por lado logrando costra caramelizada.\n3. Colocar la loncha de queso cheddar sobre la carne caliente y tapar 30 segundos para fundir.\n4. Dorar las tiras de tocineta ahumada hasta dejarlas crujientes.\n5. Untar salsa Chazin en la base del pan, disponer lechuga fresca, rodajas de tomate chonto, la carne con queso fundido y la tocineta.\n6. Coronar con la tapa superior del pan y servir inmediatamente caliente.',10,'1 porción (350g)','Carne con temperatura interna mínima de 71°C. Pan sellado dorado sin quemar y vegetales frescos seleccionados.','Carne jugosa y ahumada con costra sellada, queso cheddar cremoso fundido, pan brioche esponjoso y vegetales frescos crocantes.','Calorías: ~650 kcal | Proteína: 38g | Carbohidratos: 42g | Grasas: 34g','Consumo inmediato en mesa. Para delivery, envolver en papel térmico antigrasa y despachar en menos de 25 minutos.','Consumo inmediato (máx 15-20 minutos servido)','Contiene gluten y lactosa.',1),(5,11,'Sabor profundo a carne a la parrilla, notas dulces de cebolla caramelizada, doble queso fundido cremoso y crocancia intensa de tocineta.','2026-09-08 20:37:15',2,NULL,'PRODUCTO','1. Tostar pan brioche en plancha.\n2. Asar 2 medallones de carne de res (150g c/u) a la plancha a 200°C por 3-4 min por lado.\n3. Colocar una loncha de cheddar sobre cada medallón para fundir uniformemente.\n4. Dorar 60g de tocineta ahumada en tiras hasta que quede súper crocante.\n5. Saltear cebolla blanca en julianas a fuego lento hasta caramelizar.\n6. Montar en base de pan: salsa especial, primer medallón con cheddar, tocineta, segundo medallón con cheddar, tocineta adicional y cebolla caramelizada.\n7. Cerrar con la tapa del pan y servir caliente.',12,'1 porción grande (540g)','Doble carne término 3/4 a bien cocida (mín. 71°C al centro). Queso fundido entre cada carne.','Sabor profundo a carne a la parrilla, notas dulces de cebolla caramelizada, doble queso fundido cremoso y crocancia intensa de tocineta.','Calorías: ~980 kcal | Proteína: 65g | Carbohidratos: 45g | Grasas: 58g','Consumo inmediato al salir de plancha. Empaque térmico individual para delivery.','Consumo inmediato','Alto valor proteico. Contiene lácteos y gluten.',1),(6,12,'Exterior crocante y dorado con interior tierno y jugoso, queso mozzarella gratinado elástico y salsa tártara cremosa.','2026-09-08 20:37:15',3,NULL,'PRODUCTO','1. Empanizar el filete de pechuga fresca 180g con mezcla crujiente sazonada.\n2. Sumergir en freidora a 175°C por 6 minutos hasta lograr dorado ámbar crocante (mínimo 74°C interno).\n3. Colocar mozzarella rallada sobre el pollo caliente y gratinar brevemente.\n4. Tostar pan brioche, untar salsa tártara artesanal en la base, poner lechuga batavia y rodajas de tomate fresco.\n5. Montar el filete de pollo crispy con queso gratinado y cubrir con la tapa de pan.',11,'1 porción (380g)','Pechuga cocida completamente a mínimo 74°C interno. Exterior súper crujiente sin exceso de aceite.','Exterior crocante y dorado con interior tierno y jugoso, queso mozzarella gratinado elástico y salsa tártara cremosa.','Calorías: ~720 kcal | Proteína: 45g | Carbohidratos: 48g | Grasas: 32g','Servir recién preparado para preservar la textura crujiente del empanizado.','Consumo inmediato','Contiene gluten y lácteos.',1),(7,13,'Aroma ahumado característico de salchicha americana, textura crujiente de tocineta, queso elástico suave y pan tierno.','2026-09-08 20:37:15',4,NULL,'PRODUCTO','1. Calentar el pan para perro al vapor durante 2 minutos hasta textura esponjosa.\n2. Dorar la salchicha americana premium en la plancha a 180°C.\n3. Abrir el pan, colocar la salchicha caliente, añadir tocineta crocante picada.\n4. Cubrir con queso mozzarella rallado y gratinar con soplete o salamandra hasta dorar.\n5. Añadir papas chips trituradas y salsas de la casa.',8,'1 porción (290g)','Salchicha cocida a 75°C mínimo. Pan suave sin humedecer en exceso y queso gratinado hilante.','Aroma ahumado característico de salchicha americana, textura crujiente de tocineta, queso elástico suave y pan tierno.','Calorías: ~540 kcal | Proteína: 22g | Carbohidratos: 36g | Grasas: 28g','Servir caliente en cuna de cartón antigrasa o servir inmediatamente en mesa.','Consumo inmediato','Contiene gluten, soya y derivados lácteos.',1),(8,14,'Sabor robusto y especiado de la salchicha suiza ahumada, balance dulce de la cebolla caramelizada y cremosidad del queso fundido.','2026-09-08 20:37:15',5,NULL,'PRODUCTO','1. Realizar incisiones diagonales superficiales en la salchicha suiza ahumada.\n2. Asar en la plancha a fuego medio-alto rotando para sellar y dorar parejo.\n3. Calentar el pan al vapor y colocar en la base la cebolla caramelizada dulce.\n4. Disponer la salchicha suiza sobre la cebolla, agregar tocineta picada crocante.\n5. Cubrir con 50g de mozzarella y gratinar completamente. Finalizar con salsa tártara artesanal.',9,'1 porción (340g)','Salchicha suiza bien dorada por fuera y jugosa por dentro. Gratinado superior uniforme.','Sabor robusto y especiado de la salchicha suiza ahumada, balance dulce de la cebolla caramelizada y cremosidad del queso fundido.','Calorías: ~680 kcal | Proteína: 29g | Carbohidratos: 38g | Grasas: 38g','Consumo inmediato a temperatura caliente (>60°C). Empaque antigrasa para delivery.','Consumo inmediato','Contiene derivados cárnicos, lácteos y gluten.',1),(9,15,'Papas crujientes por fuera y suaves por dentro, abundancia de embutidos ahumados a la plancha, queso mozzarella fundido elástico y sabor intenso.','2026-09-08 20:37:15',6,NULL,'PRODUCTO','1. Freír 250g de papas a la francesa en aceite limpio a 180°C por 4-5 minutos hasta lograr crocancia dorada.\n2. Cortar en rodajas 1 salchicha americana y 1 salchicha suiza ahumada, y saltear en la plancha con tocineta picada.\n3. Escurrir bien las papas fritas y disponerlas como cama uniforme en la bandeja o plato hondo.\n4. Distribuir encima la mezcla caliente de salchichas y tocineta crocante.\n5. Cubrir con lluvia generosa de queso mozzarella (60g) y gratinar hasta que funda y dore ligeramente.\n6. Acompañar con salsas Chazin de la casa.',12,'1 porción generosa (560g)','Papas crujientes sin exceso de aceite. Carnes bien doradas en plancha y queso fundido uniforme.','Papas crujientes por fuera y suaves por dentro, abundancia de embutidos ahumados a la plancha, queso mozzarella fundido elástico y sabor intenso.','Calorías: ~890 kcal | Proteína: 35g | Carbohidratos: 68g | Grasas: 52g','Servir caliente recién preparado. En delivery usar recipiente con ventilación para evitar que el vapor ablande las papas.','Consumo inmediato (máximo 20 min para mantener crujiente)','Alérgenos: Lácteos. Libre de gluten en papas y salchichas estándar.',1),(10,16,'Variedad completa gourmet: carnes jugosas selladas a punto, queso derretido, papas crocantes recién fritas y bebidas burbujeantes frías.','2026-09-08 20:37:15',7,NULL,'PRODUCTO','1. Sellar 2 carnes de res 150g en plancha a 200°C con tocineta y fundir 1 loncha de cheddar en cada una.\n2. Tostar 2 panes brioche y armar las 2 hamburguesas clásicas completas.\n3. Freír 200g de papas a la francesa a 180°C hasta que queden doradas y crocantes.\n4. Servir en bandeja compartida las dos hamburguesas, la porción de papas al centro y entregar con 2 botellas de gaseosa bien frías.',14,'2 personas (1.6 kg combo)','Sincronizar la salida de ambas hamburguesas y las papas fritas para servir simultáneamente calientes junto a las bebidas frías.','Variedad completa gourmet: carnes jugosas selladas a punto, queso derretido, papas crocantes recién fritas y bebidas burbujeantes frías.','Calorías: ~1800 kcal total combo (900 kcal por persona aprox.)','Servir de inmediato en mesa o empaque doble térmico con separador para bebidas frías.','Consumo inmediato','Contiene gluten, lácteos y cafeína en gaseosas.',1),(11,17,'Bebida carbonatada refrescante, color caramelo oscuro brillante, aroma dulce especiado clásico con alta efervescencia.','2026-09-08 20:37:15',8,NULL,'PRODUCTO','1. Retirar del refrigerador de bebidas manteniendo temperatura controlada entre 2°C y 4°C.\n2. Verificar precinto de seguridad y limpieza del envase.\n3. Servir cerrada o entregar con vaso con hielo según solicitud del cliente.',1,'1 porción (400ml)','Bebida fría entre 2°C y 4°C. Envase PET sellado de fábrica sin abolladuras.','Bebida carbonatada refrescante, color caramelo oscuro brillante, aroma dulce especiado clásico con alta efervescencia.','Calorías: 170 kcal | Carbohidratos: 42g | Azúcares: 42g | Sodio: 45mg','Refrigeración constante entre 2°C y 6°C en lugar seco y protegido de la luz solar directa.','Según fecha de vencimiento en envase (6 a 9 meses)','Contiene cafeína. No agitar antes de abrir.',1),(12,18,'Color rosado translúcido característico, sabor dulce y frutal a manzana roja, gasificación media-alta refrescante.','2026-09-08 20:37:15',9,NULL,'PRODUCTO','1. Tomar de la nevera a temperatura entre 2°C y 4°C.\n2. Inspeccionar que la tapa y sello estén intactos.\n3. Entregar fría al comensal con pitillo o vaso con hielo según preferencia.',1,'1 porción (400ml)','Fría a 2°C - 4°C, envase original con precinto de seguridad intacto.','Color rosado translúcido característico, sabor dulce y frutal a manzana roja, gasificación media-alta refrescante.','Calorías: 160 kcal | Carbohidratos: 40g | Azúcares: 40g | Sodio: 35mg','Mantener en refrigerador de bebidas a 2°C - 4°C. Proteger del calor y luz directa.','Según fecha de vencimiento en envase (6 meses)','Bebida azucarada sin alcohol.',1),(13,19,'Líquido transparente, incoloro, inodoro y de sabor neutro 100% puro y limpio.','2026-09-08 20:37:15',10,NULL,'PRODUCTO','1. Verificar sello de la tapa intacto y fecha de vencimiento vigente.\n2. Mantener refrigerada a 4°C o a temperatura ambiente según preferencia del cliente.\n3. Entregar botella limpia con servilleta.',1,'1 porción (600ml)','Temperatura fresca o fría según preferencia del comensal. Sello de seguridad hermético sin vulnerar.','Líquido transparente, incoloro, inodoro y de sabor neutro 100% puro y limpio.','Calorías: 0 kcal | Grasas: 0g | Azúcares: 0g | Sodio: 0mg','Almacenar en lugar fresco, seco, ventilado y libre de olores penetrantes.','12 meses a partir de fecha de envasado','Agua tratada microbiológicamente segura.',1),(14,21,'Gaseosa Pepsi personal 400ml en botella PET bien fría, con su inconfundible sabor burbujeante.','2026-09-10 00:35:40',11,NULL,'PRODUCTO','1. Tomar insumo de inventario refrigerado o bodega.\n2. Servir a temperatura adecuada.',2,'1 porción (400ml)','Servir en óptimas condiciones.','Sabor fresco y auténtico de la marca.','Calorías: 165 kcal | Carbohidratos: 41g | Azúcares: 41g | Sodio: 35mg','Mantener refrigerado o a temperatura ambiente según el producto.','Consumo inmediato.','Producto garantizado de alta calidad.',1),(15,23,'La bebida de nuestra tierra: Gaseosa Colombiana Postobón tradicional 400ml refrescante.','2026-09-10 00:35:40',12,NULL,'PRODUCTO','1. Tomar insumo de inventario refrigerado o bodega.\n2. Servir a temperatura adecuada.',2,'1 porción (400ml)','Servir en óptimas condiciones.','Sabor fresco y auténtico de la marca.','Calorías: 170 kcal | Carbohidratos: 43g | Azúcares: 43g | Sodio: 40mg','Mantener refrigerado o a temperatura ambiente según el producto.','Consumo inmediato.','Producto garantizado de alta calidad.',1),(16,24,'Gaseosa Sprite lima-limón 400ml, refrescante sabor cítrico y gasificación intensa.','2026-09-10 00:35:40',13,NULL,'PRODUCTO','1. Tomar insumo de inventario refrigerado o bodega.\n2. Servir a temperatura adecuada.',2,'1 porción (400ml)','Servir en óptimas condiciones.','Sabor fresco y auténtico de la marca.','Calorías: 155 kcal | Carbohidratos: 38g | Azúcares: 38g | Sodio: 30mg','Mantener refrigerado o a temperatura ambiente según el producto.','Consumo inmediato.','Producto garantizado de alta calidad.',1),(17,25,'Gaseosa Cuatro sabor toronja cítrica 400ml, ideal para acompañar tus hamburguesas y perros.','2026-09-10 00:35:40',14,NULL,'PRODUCTO','1. Tomar insumo de inventario refrigerado o bodega.\n2. Servir a temperatura adecuada.',2,'1 porción (400ml)','Servir en óptimas condiciones.','Sabor fresco y auténtico de la marca.','Calorías: 160 kcal | Carbohidratos: 40g | Azúcares: 40g | Sodio: 35mg','Mantener refrigerado o a temperatura ambiente según el producto.','Consumo inmediato.','Producto garantizado de alta calidad.',1),(18,26,'Porción generosa de 150g de papas a la francesa corte delgado doradas y crujientes con sal marina.','2026-09-10 00:35:40',15,NULL,'PRODUCTO','1. Tomar insumo de inventario refrigerado o bodega.\n2. Servir a temperatura adecuada.',2,'1 porción (150g)','Servir en óptimas condiciones.','Sabor fresco y auténtico de la marca.','Calorías: 380 kcal | Carbohidratos: 48g | Grasas: 18g | Proteína: 4g','Mantener refrigerado o a temperatura ambiente según el producto.','Consumo inmediato.','Producto garantizado de alta calidad.',1),(19,27,'Gaseosa Coca-Cola Sin Azúcar 400ml bien fría','2026-09-10 02:36:47',16,NULL,'PRODUCTO','1. Retirar del refrigerador a temperatura controlada (2°C - 4°C).\n2. Destapar y servir con vaso y servilletas.',1,'1 botella (400ml)','Bebida sin azúcar gasificada en envase sellado.','Sabor dulce característico de Coca-Cola sin calorías.','Calorías: 0 kcal, Azúcares: 0g, Sodio: 25mg.','Mantener refrigerado entre 2°C y 6°C.','6 meses en envase cerrado.','Verificar fecha de caducidad.',1),(20,28,'Las papas más crocantes: porción grande (220g) de papas corte tradicional delgadas, doradas a la perfección y sazonadas con sal marina.','2026-09-10 02:36:47',17,NULL,'PRODUCTO','1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 3 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.',3,'1 porción grande (220g)','Papas corte 7x7mm doradas y ultra crocantes, temperatura interior >75°C.','Exterior crujiente, interior esponjoso con sal marina fina.','Calorías: 450 kcal, Carbohidratos: 58g, Grasas: 20g, Proteína: 4g.','Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.','Consumo inmediato caliente (máx 15 minutos).','Verificar temperatura de aceite a 175°C antes de ingresar el producto.',1),(21,29,'Las papas más crocantes: porción mediana (150g) de papas corte tradicional delgadas doradas, para acompañar lo que más te gusta.','2026-09-10 02:36:47',18,NULL,'PRODUCTO','1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 3 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.',3,'1 porción mediana (150g)','Papas corte tradicional delgadas doradas a 175°C por 3 minutos.','Crocantes, doradas con sal marina homogénea.','Calorías: 310 kcal, Carbohidratos: 40g, Grasas: 14g, Proteína: 3g.','Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.','Consumo inmediato caliente (máx 15 minutos).','Verificar temperatura de aceite a 175°C antes de ingresar el producto.',1),(22,30,'Las papas en cascos más crocantes: porción grande (240g) de papas rústicas con piel, sazonadas con paprika, romero y sal marina.','2026-09-10 02:36:47',19,NULL,'PRODUCTO','1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.',4,'1 porción grande (240g)','Cascos de papa con piel dorada crujiente y centro suave.','Sabor rústico especiado con corteza crocante.','Calorías: 420 kcal, Carbohidratos: 55g, Grasas: 18g, Proteína: 5g.','Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.','Consumo inmediato caliente (máx 15 minutos).','Verificar temperatura de aceite a 175°C antes de ingresar el producto.',1),(23,31,'Las papas en cascos más crocantes: porción mediana (160g) de papas rústicas con piel dorada y especias de la casa.','2026-09-10 02:36:47',20,NULL,'PRODUCTO','1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.',4,'1 porción mediana (160g)','Cascos rústicos dorados a 175°C durante 4 minutos.','Rústicas, crujientes con especias naturales.','Calorías: 290 kcal, Carbohidratos: 38g, Grasas: 12g, Proteína: 3.5g.','Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.','Consumo inmediato caliente (máx 15 minutos).','Verificar temperatura de aceite a 175°C antes de ingresar el producto.',1),(24,32,'Papas en espiral continua (200g), doradas al punto justo y sazonadas con paprika ahumada, sal marina y finas hierbas para acompañar lo que más te gusta.','2026-09-10 02:36:47',21,NULL,'PRODUCTO','1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.',4,'1 brocheta / porción espiral (200g)','Corte en espiral continuo y uniforme, textura ultra crocante tipo chip.','Textura crujiente en cada aro, sazón gourmet.','Calorías: 380 kcal, Carbohidratos: 48g, Grasas: 17g, Proteína: 4g.','Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.','Consumo inmediato caliente (máx 15 minutos).','Verificar temperatura de aceite a 175°C antes de ingresar el producto.',1),(25,33,'Porción de 160g de papas crocantes bañadas con abundante chili con carne de res artesanal, guacamole fresco y queso cheddar fundido.','2026-09-10 02:36:47',22,NULL,'PRODUCTO','1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.',4,'1 canastilla cargada (320g total)','Papas calientes cubiertas con chili artesanal (80g), guacamole (40g) y cheddar fundido (40g).','Combinación explosiva de texturas crocante, cremosa y queso fundido caliente.','Calorías: 680 kcal, Carbohidratos: 62g, Grasas: 34g, Proteína: 22g.','Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.','Consumo inmediato caliente (máx 15 minutos).','Verificar temperatura de aceite a 175°C antes de ingresar el producto.',1),(26,34,'Porción de 160g de papas con chili con carne, guacamole fresco y queso cheddar fundido + Gaseosa o bebida 400ml a elección.','2026-09-10 02:36:47',23,NULL,'PRODUCTO','1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.',4,'1 combo individual completo','Papas con chili, guacamole y cheddar fundido acompañadas de bebida 400ml sellada.','Combo completo de acompañamiento premium con bebida refrescante.','Calorías: 820 kcal, Carbohidratos: 95g, Grasas: 34g, Proteína: 22g.','Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.','Consumo inmediato caliente (máx 15 minutos).','Verificar temperatura de aceite a 175°C antes de ingresar el producto.',1),(27,35,'Porción de 160g de papas crocantes coronadas con tocineta ahumada crujiente en trozos, suero costeño tradicional y abundante queso cheddar fundido.','2026-09-10 02:36:47',24,NULL,'PRODUCTO','1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.',4,'1 canastilla cargada (300g total)','Papas calientes cubiertas con tocineta crocante (50g), suero costeño (40g) y cheddar fundido (40g).','Sabor ahumado, salado crujiente y cremoso con el toque auténtico del suero.','Calorías: 690 kcal, Carbohidratos: 56g, Grasas: 38g, Proteína: 20g.','Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.','Consumo inmediato caliente (máx 15 minutos).','Verificar temperatura de aceite a 175°C antes de ingresar el producto.',1),(28,36,'Porción de 160g de papas con tocineta ahumada crocante, suero costeño y queso cheddar fundido + Gaseosa o bebida 400ml a elección.','2026-09-10 02:36:47',25,NULL,'PRODUCTO','1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante 4 minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.',4,'1 combo individual completo','Papas con tocineta, suero costeño y queso cheddar fundido + bebida fría 400ml.','Combo completo de acompañamiento tocineta con bebida refrescante.','Calorías: 830 kcal, Carbohidratos: 89g, Grasas: 38g, Proteína: 20g.','Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.','Consumo inmediato caliente (máx 15 minutos).','Verificar temperatura de aceite a 175°C antes de ingresar el producto.',1),(29,37,'Ficha técnica oficial de preparación para Burger Fest 2026','2026-09-10 03:30:38',26,NULL,'PRODUCTO','Hamburguesa de autor con carne premium angus 200g, queso brie fundido, reducción de champiñones al tartufo y pan brioche artesanal dorado.',14,'1 hamburguesa gourmet (430g)','Pan brioche sellado, carne 200g, queso brie, salsa trufada especial Chazin.',NULL,'Calorías: ~790 kcal | Proteína: 44g | Carbohidratos: 48g | Grasas: 46g',NULL,NULL,NULL,1),(30,39,'Carne artesanal de res 150g a la parrilla bañada en abundante salsa BBQ ahumada, tocineta ahumada crujiente, doble queso cheddar fundido, cebolla caramelizada y pan brioche artesanal dorado con mantequilla.','2026-09-12 01:43:01',27,NULL,'PRODUCTO','1. Tostar el pan brioche artesanal en plancha con mantequilla por 1 min.\n2. Sellar la carne 150g a 200°C por 3 min por lado.\n3. Glasear la carne con salsa BBQ ahumada y colocar dos lonchas de queso cheddar hasta fundir.\n4. Dorar la tocineta hasta que quede crujiente.\n5. Montar en la base del pan la cebolla caramelizada, la carne glaseada con cheddar, la tocineta y cerrar.',10,'1 porción','Carne jugosa término 3/4 o bien cocida a mínimo 71°C. Salsa BBQ brillante.','Sabor intenso ahumado, dulce y salado con textura crocante.','Calorías: ~780 kcal | Proteína: 42g | Carbohidratos: 48g | Grasas: 44g','Servicio en caliente inmediato.','Consumo inmediato (máximo 15 min en mesa)','Receta e insumos estandarizados Chazin Food.',1),(31,41,'150g de carne de res 80/20, guacamole fresco artesanal, rodajas de jalapeños picantes, queso mozzarella fundido, lechuga batavia fresca y salsa de la casa en pan brioche suave.','2026-09-12 01:43:01',28,NULL,'PRODUCTO','1. Dorar suavemente el pan brioche.\n2. Asar la carne 150g a punto perfecto.\n3. Fundir queso mozzarella sobre la carne con campana de vapor.\n4. Untar abundante guacamole fresco en la base del pan, poner la cama de lechuga fresca, montar la carne con queso y coronar con rodajas de jalapeño.',10,'1 porción','Guacamole preparado fresco del día, no oxidado.','Equilibrio perfecto entre cremosidad del guacamole y toque picante del jalapeño.','Calorías: ~720 kcal | Proteína: 39g | Carbohidratos: 40g | Grasas: 41g','Servir recién montada.','Consumo inmediato','Receta e insumos estandarizados Chazin Food.',1),(32,43,'Carne de res 150g a la plancha con queso mozzarella gratinado, tocineta ahumada crujiente, cebolla blanca salteada, rodajas de tomate chonto fresco, lechuga batavia y salsa tártara artesanal.','2026-09-12 01:43:01',29,NULL,'PRODUCTO','1. Sellar carne de res y fundir mozzarella encima.\n2. Saltear cebolla blanca hasta punto cristalino.\n3. Montar base con salsa tártara casera, lechuga, tomate, carne con queso, tocineta crocante y cebolla salteada.',11,'1 porción','Verduras frescas seleccionadas y tocineta bien dorada.','Sabor tradicional hogareño y balance vegetal fresco.','Calorías: ~690 kcal | Proteína: 40g | Carbohidratos: 38g | Grasas: 38g','Servir de inmediato.','Consumo inmediato','Receta e insumos estandarizados Chazin Food.',1),(33,44,'Pan tierno de perro americano con salchicha americana premium dorada a la plancha, guacamole fresco artesanal, salsa de queso cheddar fundido, tocineta crujiente picada y rodajas de jalapeños.','2026-09-12 01:43:01',30,NULL,'PRODUCTO','1. Calentar pan al vapor.\n2. Dorar salchicha americana en plancha.\n3. Colocar salchicha en el pan, bañar con salsa de queso cheddar fundido y guacamole artesanal.\n4. Espolvorear tocineta crujiente y coronar con jalapeños.',8,'1 porción','Pan caliente y suave, salchicha bien caliente.','Sabores vivos estilo tex-mex.','Calorías: ~560 kcal | Proteína: 21g | Grasas: 31g','Servir recién elaborado.','Consumo inmediato','Receta e insumos estandarizados Chazin Food.',1),(34,45,'Pan suave americano con salchicha americana y salchicha suiza ahumada, lluvia de tocineta crocante, queso mozzarella gratinado al soplete y cremoso suero costeño artesanal.','2026-09-12 01:43:01',31,NULL,'PRODUCTO','1. Dorar salchicha americana y trozos de salchicha suiza.\n2. Montar en pan caliente, cubrir con queso mozzarella y gratinar.\n3. Agregar lluvia de tocineta crocante y terminar con hilo de suero costeño cremoso.',8,'1 porción','Queso fundido elástico y tocineta crocante.','Toque auténtico colombiano con suero costeño artesanal.','Calorías: ~610 kcal | Proteína: 27g | Grasas: 36g','Servir caliente.','Consumo inmediato','Receta e insumos estandarizados Chazin Food.',1),(35,46,'Cama abundante de papas a la francesa corte delgado doradas y crujientes, rodajas de salchicha americana doradita, tocineta crujiente, queso mozzarella gratinado, salsa de queso cheddar fundido y suero costeño.','2026-09-12 01:43:01',32,NULL,'PRODUCTO','1. Freír 250g de papas a la francesa a 180°C hasta que estén crujientes y doradas.\n2. Saltear rodajas de salchicha americana y tocineta en la plancha.\n3. Servir papas, colocar salchichas y tocineta, cubrir con mozzarella y gratinar con soplete.\n4. Bañar con salsa cheddar y toques de suero costeño.',12,'1 porción abundante','Papas secas y crocantes, servir inmediatamente para evitar que el queso enfríe.','Generosa, quesuda y crocante.','Calorías: ~840 kcal | Proteína: 31g | Grasas: 48g','Consumo inmediato.','Consumo inmediato','Receta e insumos estandarizados Chazin Food.',1),(36,48,'Papas a la francesa doraditas con salchicha suiza ahumada en rodajas, generosa capa de suero costeño tradicional, tocineta ahumada picada, queso mozzarella gratinado y salsa tártara de la casa.','2026-09-12 01:43:01',33,NULL,'PRODUCTO','1. Freír papas a 180°C.\n2. Dorar en plancha la salchicha suiza ahumada.\n3. Servir cama de papas, colocar la salchicha suiza, fundir mozzarella y bañar con suero costeño abundante y salsa tártara artesanal.',12,'1 porción grande','Sabor ahumado característico de la salchicha suiza.','Combinación tradicional costeña con frescura láctea.','Calorías: ~890 kcal | Proteína: 34g | Grasas: 52g','Servir recién salida.','Consumo inmediato','Receta e insumos estandarizados Chazin Food.',1),(37,49,'El combo ideal para disfrutar solo: 1 Hamburguesa Clásica Chazin (150g de carne de res, queso cheddar, tocineta crocante) + Porción individual de Papas a la Francesa (150g) + 1 Gaseosa 400ml bien fría a elección.','2026-09-12 01:43:01',34,NULL,'PRODUCTO','1. Armar Hamburguesa Clásica en pan brioche con carne 150g, queso cheddar y tocineta.\n2. Freír 150g de papas a la francesa crujientes.\n3. Servir en bandeja combo con bebida fría seleccionada.',12,'1 persona','Todo caliente y listo para entregar al mismo tiempo.','Almuerzo o cena completa e individual.','Calorías: ~1050 kcal total combo','Servicio en caliente con bebida fría.','Consumo inmediato','Receta e insumos estandarizados Chazin Food.',1),(38,52,'El banquete perfecto para compartir con familia o amigos: 2 Hamburguesas Clásicas Chazin + 2 Perros Calientes Especiales Americanos + 2 Porciones grandes de Papas a la Francesa (400g total) + 4 Gaseosas 400ml.','2026-09-12 01:43:01',35,NULL,'PRODUCTO','1. Elaborar simultáneamente las 2 Hamburguesas Clásicas y los 2 Perros Especiales.\n2. Freír 400g de papas a la francesa en freidora hasta dorar.\n3. Disponer todo en bandeja familiar o empaque de fiesta con salsas y las 4 bebidas frías.',16,'4 personas','Coordinar cocina para que todas las preparaciones salgan a la misma temperatura.','Máximo ahorro y variedad para 4 comensales.','Calorías: ~3600 kcal total combo','Servir inmediatamente.','Consumo inmediato','Receta e insumos estandarizados Chazin Food.',1),(39,53,'Diseñado para dos: 2 Perros Calientes Especiales Americanos con queso mozzarella fundido y tocineta crocante + Porción doble de Papas Francesas crujientes (250g) + 2 Gaseosas frías 400ml.','2026-09-12 01:43:01',36,NULL,'PRODUCTO','1. Asar 2 salchichas americanas y calentar los panes.\n2. Montar perros con tocineta picada y queso mozzarella gratinado.\n3. Servir con 250g de papas francesas calientes y 2 bebidas.',10,'2 personas','Servir en conjunto.','Dúo delicioso de perros americanos con papas.','Calorías: ~1650 kcal total','Consumo inmediato.','Consumo inmediato','Receta e insumos estandarizados Chazin Food.',1),(40,55,'Aroma ahumado y trufado intenso, textura crocante en tocineta y cremosidad en cheddar fundido.','2026-09-14 04:54:05',37,NULL,'PRODUCTO','1. Sellar y caramelizar la carne de res 80/20 a la plancha a 200°C por 3 minutos por lado, sazonando con sal marina y pimienta negra.\n2. Fundir las 2 lonchas de queso cheddar sobre la carne durante el último minuto con campana de vapor.\n3. Dorar la tocineta ahumada hasta lograr un crocante perfecto.\n4. Tostar el pan brioche artesanal con mantequilla clarificada.\n5. Untar salsa tártara trufada, disponer lechuga batavia y tomate fresco.\n6. Montar carne con cheddar, tocineta crocante y bañar con salsa cheddar fundido.',12,'1 hamburguesa gourmet (430g)','Carne 100% res 80/20 certificada, pan brioche artesanal, temperatura de servicio > 74°C.','Aroma ahumado y trufado intenso, textura crocante en tocineta y cremosidad en cheddar fundido.','~780 kcal, Proteínas: 44g, Grasas: 42g, Carbohidratos: 48g','Refrigeración de insumos 0°C a 4°C. Servir caliente de inmediato.','Consumo inmediato caliente (máx 2 horas en empaque térmico)','Edición conmemorativa del Chazin Burger Fest 2026.',1);
/*!40000 ALTER TABLE `fichatecnica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insumo`
--

DROP TABLE IF EXISTS `insumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `insumo` (
  `idInsumo` int(11) NOT NULL AUTO_INCREMENT,
  `idCategoriaInsumo` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `unidadMedida` varchar(255) DEFAULT NULL,
  `stock` decimal(10,2) DEFAULT 0.00,
  `stockMinimo` decimal(10,2) DEFAULT 0.00,
  `fechaExpedicion` date DEFAULT NULL,
  `fechaVencimiento` date DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  `eliminado` tinyint(4) NOT NULL DEFAULT 0,
  `precioUnitario` decimal(10,2) DEFAULT 0.00,
  `idProveedor` int(11) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idInsumo`),
  KEY `IDX_InsumoCategoria` (`idCategoriaInsumo`),
  KEY `idProveedor` (`idProveedor`),
  CONSTRAINT `insumo_ibfk_119` FOREIGN KEY (`idCategoriaInsumo`) REFERENCES `categoriainsumo` (`idCategoriaInsumo`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `insumo_ibfk_120` FOREIGN KEY (`idProveedor`) REFERENCES `proveedor` (`idProveedor`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insumo`
--

LOCK TABLES `insumo` WRITE;
/*!40000 ALTER TABLE `insumo` DISABLE KEYS */;
INSERT INTO `insumo` VALUES (1,6,'aguacate','und',0.00,0.00,NULL,NULL,0,1,0.00,1,NULL),(2,7,'salsa rosada','paq',40.00,5.00,'2026-08-05','2026-08-07',0,0,10000.00,4,''),(3,1,'samuel','Kg',0.00,5.00,NULL,NULL,0,1,0.10,1,''),(4,2,'Yeison Food','Unidad',0.00,5.00,NULL,NULL,0,1,0.00,3,'asdfghjkl'),(5,2,'Pan de Arina','kg',0.00,5.00,'2026-08-01','2026-12-31',1,1,1200.00,1,'Harina refinada de trigo multipropósito'),(6,3,'Alexis','Paquete',0.00,5.00,'2026-05-26','2026-08-26',0,1,500.00,4,'dfghjklñ'),(7,9,'Carne con carolina reapper 150g','Unidad',0.00,15.00,'2026-08-28','2026-08-31',1,1,20000.00,6,''),(8,2,'Pan de papa','Gr',60.00,5.00,'2026-09-21','2026-09-14',1,0,2790.00,3,'Pan de papa gourmet'),(9,8,'Carne de Res','Kg',45.00,5.00,'2026-08-31','2026-09-04',1,0,32000.00,1,'Carne de res premium seleccionada para la preparación de hamburguesas del restaurante. Mantener estrictamente refrigerada entre 0°C y 4°C para asegurar su frescura. Manejar bajo sistema de rotación PEPS (Primeras en Entrar, Primeras en Salir).'),(10,3,'papa','Kg',100.00,5.00,'2026-07-26','2025-06-10',1,0,200000.00,1,''),(11,3,'papa2','Kg',0.00,5.00,'2026-08-30','2026-09-23',0,1,0.00,1,''),(12,1,'Pan Brioche Artesanal','und',149.00,20.00,NULL,NULL,1,0,1400.00,1,'Pan brioche con mantequilla y ajonjolí'),(13,1,'Pan Perro Americano','und',100.00,15.00,NULL,NULL,1,0,1100.00,1,'Pan artesanal para perro caliente'),(14,9,'Carne de Res Molida 80/20','kg',44.85,8.00,NULL,NULL,1,0,28000.00,1,'Carne 100% de res para hamburguesas'),(15,9,'Pechuga de Pollo Fresca','kg',30.00,6.00,NULL,NULL,1,0,19000.00,1,'Filetes de pechuga fresca desmechada o crispy'),(16,9,'Salchicha Americana Premium','und',120.00,20.00,NULL,NULL,1,0,1800.00,1,'Salchicha tipo americana para perros calientes'),(17,9,'Salchicha Suiza Ahumada','und',80.00,15.00,NULL,NULL,1,0,2600.00,1,'Salchicha suiza artesanal ahumada'),(18,9,'Tocineta Ahumada en Tiras','kg',19.97,4.00,NULL,NULL,1,0,34000.00,1,'Tiras de tocineta ahumada crujiente'),(19,2,'Queso Cheddar en Lonchas','und',249.00,30.00,NULL,NULL,1,0,700.00,1,'Lonchas de queso cheddar fundible'),(20,2,'Queso Mozzarella Rallado','kg',25.00,5.00,NULL,NULL,1,0,25000.00,1,'Queso mozzarella para gratinar'),(21,3,'Papas a la Francesa Corte Delgado','kg',60.00,10.00,NULL,NULL,1,0,9800.00,1,'Papas prefritas congeladas corte fino'),(22,3,'Lechuga Batavia Fresca','kg',17.66,3.00,NULL,NULL,1,0,4500.00,1,'Lechuga fresca crujiente'),(23,3,'Tomate Chonto Maduro','kg',19.49,4.00,NULL,NULL,1,0,5200.00,1,'Tomates frescos en rodajas'),(24,3,'Cebolla Cabezona Blanca','kg',22.00,4.00,NULL,NULL,1,0,3900.00,1,'Cebolla fresca para caramelizar y aderezos'),(25,3,'Jalapeños en Rodajas','kg',10.00,2.00,NULL,NULL,1,0,14500.00,1,'Jalapeños encurtidos picantes'),(26,4,'Salsa de Tomate Heinz','kg',15.00,3.00,NULL,NULL,1,0,12500.00,1,'Salsa de tomate clásica'),(27,4,'Mostaza Americana','kg',10.00,2.00,NULL,NULL,1,0,11500.00,1,'Mostaza amarilla tradicional'),(28,4,'Mayonesa Real','kg',16.00,3.00,NULL,NULL,1,0,13800.00,1,'Base de mayonesa cremosa'),(29,5,'Coca-Cola Original 400ml','und',96.00,24.00,NULL,NULL,1,0,2700.00,1,'Gaseosa Coca-Cola botella PET 400ml'),(30,5,'Manzana Postobón 400ml','und',72.00,20.00,NULL,NULL,1,0,2400.00,1,'Gaseosa sabor Manzana Postobón 400ml'),(31,5,'Agua Cristal sin Gas 500ml','und',60.00,15.00,NULL,NULL,1,0,1800.00,1,'Agua purificada sin gas'),(32,4,'Coca-Cola Sin Azúcar / Light 400ml','und',60.00,10.00,NULL,NULL,1,0,2500.00,NULL,'Coca-Cola Sin Azúcar / Light 400ml para venta directa'),(33,4,'Pepsi Regular 400ml','und',70.00,10.00,NULL,NULL,1,0,2500.00,NULL,'Pepsi Regular 400ml para venta directa'),(34,4,'Pepsi Light / Black 400ml','und',45.00,10.00,NULL,NULL,1,0,2500.00,NULL,'Pepsi Light / Black 400ml para venta directa'),(35,4,'Gaseosa Colombiana Postobón 400ml','und',65.00,10.00,NULL,NULL,1,0,2500.00,NULL,'Gaseosa Colombiana Postobón 400ml para venta directa'),(36,4,'Gaseosa Sprite 400ml','und',55.00,10.00,NULL,NULL,1,0,2500.00,NULL,'Gaseosa Sprite 400ml para venta directa'),(37,4,'Gaseosa Cuatro Toronja 400ml','und',50.00,10.00,NULL,NULL,1,0,2500.00,NULL,'Gaseosa Cuatro Toronja 400ml para venta directa'),(38,4,'Papas Rústicas en Casco con Piel','kg',50.00,10.00,NULL,NULL,1,0,4500.00,NULL,'Papas Rústicas en Casco con Piel para preparación de acompañamientos Chazin Food'),(39,4,'Chili con Carne de Res Artesanal','kg',25.00,5.00,NULL,NULL,1,0,12000.00,NULL,'Chili con Carne de Res Artesanal para preparación de acompañamientos Chazin Food'),(40,4,'Guacamole Fresco Artesanal','kg',20.00,5.00,NULL,NULL,1,0,10000.00,NULL,'Guacamole Fresco Artesanal para preparación de acompañamientos Chazin Food'),(41,4,'Suero Costeño Cremoso Artesanal','kg',20.00,5.00,NULL,NULL,1,0,6500.00,NULL,'Suero Costeño Cremoso Artesanal para preparación de acompañamientos Chazin Food'),(42,4,'Papas Especiales para Espiral','kg',35.00,8.00,NULL,NULL,1,0,5500.00,NULL,'Papas Especiales para Espiral para preparación de acompañamientos Chazin Food'),(43,4,'Salsa de Queso Cheddar Fundido','kg',30.00,6.00,NULL,NULL,1,0,14000.00,NULL,'Salsa de Queso Cheddar Fundido para preparación de acompañamientos Chazin Food'),(44,4,'Salsa BBQ Ahumada Artesanal','kg',15.00,4.00,NULL,NULL,1,0,5000.00,NULL,'Salsa BBQ Ahumada Artesanal para preparación de acompañamientos Chazin Food'),(45,4,'Salsa Tártara Casera Especial','kg',15.00,4.00,NULL,NULL,1,0,5000.00,NULL,'Salsa Tártara Casera Especial para preparación de acompañamientos Chazin Food');
/*!40000 ALTER TABLE `insumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insumopreparado`
--

DROP TABLE IF EXISTS `insumopreparado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insumopreparado`
--

LOCK TABLES `insumopreparado` WRITE;
/*!40000 ALTER TABLE `insumopreparado` DISABLE KEYS */;
INSERT INTO `insumopreparado` VALUES (1,'salsa de la casa','salsa de la casa 100% artesanal',2000.00,'porción','2026-07-17 11:00:45',1,1,1.00,'und',0.00),(2,'Salsa Especial de la Casa','Receta casera',7500.00,'und','2026-07-23 05:57:07',1,1,1.00,'und',3400.00),(3,'Receta Especial Jalapeños','Con queso chedart',10000.00,'und','2026-07-23 05:57:52',0,1,1.00,'und',3400.00),(7,'Salsa Chazin Especial','Salsa exclusiva de la casa a base de mayonesa, mostaza y especias',0.00,'lt','2026-09-08 20:37:15',1,0,1.00,'lt',8500.00),(8,'Cebolla Caramelizada Chazin','Cebolla blanca salteada a fuego lento con mantequilla y azúcar morena',0.00,'kg','2026-09-08 20:37:15',1,0,0.50,'kg',4200.00),(9,'Carne Sazonada Artesanal 150g','Porciones de 150g de carne molida 80/20 sazonada con sal marina y pimienta',0.00,'und','2026-09-08 20:37:15',1,0,10.00,'und',42000.00);
/*!40000 ALTER TABLE `insumopreparado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pago` (
  `idPago` int(11) NOT NULL AUTO_INCREMENT,
  `idVenta` int(11) NOT NULL,
  `metodoPago` enum('EFECTIVO','TARJETA','NEQUI','DAVIPLATA','TRANSFERENCIA') NOT NULL,
  `referenciaExterna` varchar(120) DEFAULT NULL,
  `monto` decimal(12,2) NOT NULL,
  `fechaPago` datetime DEFAULT NULL,
  `estado` enum('PENDIENTE','APROBADO','RECHAZADO') DEFAULT 'APROBADO',
  PRIMARY KEY (`idPago`),
  KEY `IDX_PagoVenta` (`idVenta`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`idVenta`) REFERENCES `venta` (`idVenta`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pedido` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clienteId` int(11) DEFAULT NULL,
  `items` text DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(255) DEFAULT 'pendiente',
  `metodoPago` varchar(255) DEFAULT 'efectivo',
  `fechaCreacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clienteId` (`clienteId`),
  CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`clienteId`) REFERENCES `cliente` (`idCliente`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permiso`
--

DROP TABLE IF EXISTS `permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permiso` (
  `idPermiso` int(11) NOT NULL AUTO_INCREMENT,
  `nombrePermiso` varchar(255) NOT NULL,
  PRIMARY KEY (`idPermiso`),
  UNIQUE KEY `UK_Permiso` (`nombrePermiso`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso`
--

LOCK TABLES `permiso` WRITE;
/*!40000 ALTER TABLE `permiso` DISABLE KEYS */;
INSERT INTO `permiso` VALUES (3,'Categoría Insumos'),(8,'Categoría Productos'),(13,'Clientes'),(2,'Compras'),(16,'Configuración'),(1,'Dashboard'),(10,'Fichas Técnicas'),(6,'Gestión de Compras'),(11,'Gestión de Producción'),(14,'Gestión de Ventas'),(4,'Insumos'),(7,'Producción'),(9,'Productos'),(5,'Proveedores'),(15,'Punto de Venta'),(18,'Roles'),(17,'Usuarios'),(19,'Vendedor'),(12,'Ventas');
/*!40000 ALTER TABLE `permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  KEY `IDX_ProductoCategoria` (`idCategoriaProducto`),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`idCategoriaProducto`) REFERENCES `categoriaproducto` (`idCategoriaProducto`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (0,0,'__SISTEMA_VARIANTE_CERO__','Registro técnico para fichas de insumos sin variante',NULL,0,0.00,'__SISTEMA_VARIANTE_CERO__',NULL,NULL),(1,3,'Hamburguesa Clásica Chazin','Pan brioche artesanal, carne 100% res 150g, queso cheddar fundido, tocineta ahumada, lechuga fresca, tomate y salsa Chazin.','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',1,18000.00,'Hamburguesas','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]',NULL),(2,3,'Hamburguesa Doble Carne & Tocineta','Para los más exigentes: Doble carne 150g (300g total), doble queso cheddar, doble tocineta crujiente, cebolla caramelizada y salsa especial.','https://res.cloudinary.com/dckwtknmq/image/upload/v1788993620/dp1cgi2ccfh4dei1cvgb.jpg',1,25000.00,'Hamburguesas','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]',NULL),(3,3,'Hamburguesa Pollo Crispy Gourmet','Filete de pechuga empanizada estilo sureño super crujiente, queso mozzarella gratinado, lechuga y salsa tártara de la casa.','https://res.cloudinary.com/dckwtknmq/image/upload/v1788993555/t6ugmf9ipxt69nqbhb3h.webp',1,21000.00,'Hamburguesas','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]',NULL),(4,1,'Perro Caliente Especial Americano','Pan suave con salchicha americana premium, tocineta picada crocante, queso mozzarella fundido, papas chips trituradas y salsas.','https://res.cloudinary.com/dckwtknmq/image/upload/v1788993866/q43cttividgol6mqagkr.jpg',1,14000.00,'Perros Calientes','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"}]',NULL),(5,1,'Perro Suizo Chazin','Salchicha suiza gigante ahumada, cebolla caramelizada dulce, queso mozzarella fundido, tocineta y salsa tártara artesanal.','https://res.cloudinary.com/dckwtknmq/image/upload/v1788993817/ki0whs161s4bsrvstx7d.jpg',1,17000.00,'Perros Calientes','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"}]',NULL),(6,5,'Salchipapa Salvaje Gourmet','Abundante porción de papas a la francesa crujientes, salchicha americana, salchicha suiza ahumada, tocineta picada y lluvia de queso mozzarella.','https://res.cloudinary.com/dckwtknmq/image/upload/v1788989658/kgt9ufaya3iobscme7rq.jpg',1,23000.00,'Salchipapas Gourmet','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]',NULL),(7,2,'Combo Pareja Chazin','El favorito para compartir: 2 Hamburguesas Clásicas Chazin + Porción de Papas Grandes + 2 Gaseosas a elección.','https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',1,38000.00,'Combos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]','{\"esCombo\":true,\"cantidadBebidas\":2,\"bebidasPermitidas\":[]}'),(8,4,'Gaseosa Coca-Cola 400ml','Gaseosa Coca-Cola original personal 400ml en botella PET bien fría.','https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',1,4500.00,'Bebidas',NULL,NULL),(9,4,'Gaseosa Manzana Postobón 400ml','Gaseosa Manzana Postobón tradicional 400ml bien fría.','https://res.cloudinary.com/dckwtknmq/image/upload/v1788966650/qgto4wgmnjpfrns3zl8c.jpg',1,4000.00,'Bebidas','[]',NULL),(10,4,'Agua Cristal sin Gas 600ml','Agua pura sin gas en botella de 500ml.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789342838/pj5qlfpmxeddkkmjauyw.png',1,3000.00,'Bebidas','[]','{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),(11,4,'Gaseosa Pepsi 400ml','Gaseosa Pepsi personal 400ml en botella PET bien fría, con su inconfundible sabor burbujeante.','https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&auto=format&fit=crop&q=80',1,4000.00,'Bebidas','[]',NULL),(12,4,'Gaseosa Colombiana Postobón 400ml','La bebida de nuestra tierra: Gaseosa Colombiana Postobón tradicional 400ml refrescante.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789001495/qy8wy9igmgb0wppnjavw.png',1,4000.00,'Bebidas','[]',NULL),(13,4,'Gaseosa Sprite 400ml','Gaseosa Sprite lima-limón 400ml, refrescante sabor cítrico y gasificación intensa.','https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80',1,4500.00,'Bebidas','[]',NULL),(14,4,'Gaseosa Quatro Toronja 400ml','Gaseosa Quatro sabor toronja cítrica 400ml, ideal para acompañar tus hamburguesas y perros.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789342730/tqchagzkgl2z1jckvyrb.png',1,4500.00,'Bebidas','[]',NULL),(15,6,'Porción Papas a la Francesa (150g)','Porción generosa de 150g de papas a la francesa corte delgado doradas y crujientes con sal marina.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789007797/oqklhyatzijula0tr7kw.jpg',1,5000.00,'Acompañamientos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]',NULL),(16,4,'Gaseosa Coca-Cola Sin Azúcar / Light 400ml','Gaseosa Coca-Cola Sin Azúcar / Light personal 400ml en botella PET, todo el sabor original sin azúcar ni calorías.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789342941/rcxdoursw1roe9f8bmpw.png',1,4500.00,'Bebidas','[]','{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}'),(17,6,'Papas Corral Grandes','Las papas más crocantes: porción grande (220g) de papas corte tradicional delgadas, doradas a la perfección y sazonadas con sal marina.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789007797/oqklhyatzijula0tr7kw.jpg',1,10500.00,'Acompañamientos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]',NULL),(18,6,'Papas Corral Medianas','Las papas más crocantes: porción mediana (150g) de papas corte tradicional delgadas doradas, para acompañar lo que más te gusta.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789007797/oqklhyatzijula0tr7kw.jpg',1,8500.00,'Acompañamientos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]',NULL),(19,6,'Papas en Casco Grandes','Las papas en cascos más crocantes: porción grande (240g) de papas rústicas con piel, sazonadas con paprika, romero y sal marina.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789007798/jehlrurcbohsfg4bxd4v.jpg',1,10500.00,'Acompañamientos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]',NULL),(20,6,'Papas en Casco Medianas','Las papas en cascos más crocantes: porción mediana (160g) de papas rústicas con piel dorada y especias de la casa.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789007798/jehlrurcbohsfg4bxd4v.jpg',1,8500.00,'Acompañamientos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]',NULL),(21,6,'Papa Espiral','Papas en espiral continua (200g), doradas al punto justo y sazonadas con paprika ahumada, sal marina y finas hierbas para acompañar lo que más te gusta.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789007799/nymnuei88w1dss2gvtft.jpg',1,13500.00,'Acompañamientos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]',NULL),(22,6,'Papas con Chili Mediana','Porción de 160g de papas crocantes bañadas con abundante chili con carne de res artesanal, guacamole fresco y queso cheddar fundido.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789007800/kima4gvqtjeb2yxjqnoi.jpg',1,15500.00,'Acompañamientos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]',NULL),(23,6,'Papas con Chili Mediana + Bebida','Porción de 160g de papas con chili con carne, guacamole fresco y queso cheddar fundido + Gaseosa o bebida 400ml a elección.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789007800/kima4gvqtjeb2yxjqnoi.jpg',1,17500.00,'Acompañamientos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]','{\"esCombo\":true,\"cantidadBebidas\":1,\"bebidasPermitidas\":[]}'),(24,6,'Papas con Tocineta Mediana','Porción de 160g de papas crocantes coronadas con tocineta ahumada crujiente en trozos, suero costeño tradicional y abundante queso cheddar fundido.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789007801/rbjuwv4049ggpnzgo3p0.jpg',1,15500.00,'Acompañamientos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]',NULL),(25,6,'Papas con Tocineta Mediana + Bebida','Porción de 160g de papas con tocineta ahumada crocante, suero costeño y queso cheddar fundido + Gaseosa o bebida 400ml a elección.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789007802/daa85plkedcdsauoricw.jpg',1,17500.00,'Acompañamientos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]','{\"esCombo\":true,\"cantidadBebidas\":1,\"bebidasPermitidas\":[]}'),(26,3,'Hamburguesa Burger Fest Trufada Chazin (Edición Especial)','Creada exclusivamente para el Burger Fest 2026. 180g de carne angus madurada a la parrilla, queso gouda ahumado fundido, reducción de cebolla al vino tinto, tocineta crocante caramelizada en maple y nuestra legendaria mayonesa trufada en pan brioche dorado artesanal.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789011032/xpk8envk39i0hgpu3d5r.jpg',1,28000.00,NULL,'[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]',NULL),(27,3,'Hamburguesa BBQ Bacon Chazin','Carne artesanal de res 150g a la parrilla bañada en abundante salsa BBQ ahumada, tocineta ahumada crujiente, doble queso cheddar fundido, cebolla caramelizada y pan brioche artesanal dorado con mantequilla.','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',1,22000.00,'Hamburguesas','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]',NULL),(28,3,'Hamburguesa Mexicana Chazin','150g de carne de res 80/20, guacamole fresco artesanal, rodajas de jalapeños picantes, queso mozzarella fundido, lechuga batavia fresca y salsa de la casa en pan brioche suave.','https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',1,23500.00,'Hamburguesas','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]',NULL),(29,3,'Hamburguesa Campesina Chazin','Carne de res 150g a la plancha con queso mozzarella gratinado, tocineta ahumada crujiente, cebolla blanca salteada, rodajas de tomate chonto fresco, lechuga batavia y salsa tártara artesanal.','https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',1,23000.00,'Hamburguesas','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]',NULL),(30,1,'Perro Caliente Mexicano','Pan tierno de perro americano con salchicha americana premium dorada a la plancha, guacamole fresco artesanal, salsa de queso cheddar fundido, tocineta crujiente picada y rodajas de jalapeños.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789340644/el9c094ykrqjixkm3rmm.jpg',1,16000.00,'Perros Calientes','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"}]',NULL),(31,1,'Perro Criollo Especial Chazin','Pan suave americano con salchicha americana y salchicha suiza ahumada, lluvia de tocineta crocante, queso mozzarella gratinado al soplete y cremoso suero costeño artesanal.','https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',1,16500.00,'Perros Calientes','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"}]',NULL),(32,5,'Salchipapa Criolla Chazin','Cama abundante de papas a la francesa corte delgado doradas y crujientes, rodajas de salchicha americana doradita, tocineta crujiente, queso mozzarella gratinado, salsa de queso cheddar fundido y suero costeño.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789341834/mebbvy7zzkrpgu1yggko.jpg',1,21000.00,'Salchipapas Gourmet','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]',NULL),(33,5,'Salchipapa Costeña Chazin','Papas a la francesa doraditas con salchicha suiza ahumada en rodajas, generosa capa de suero costeño tradicional, tocineta ahumada picada, queso mozzarella gratinado y salsa tártara de la casa.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789340669/zr8zn2hll1t7ytl1sj6x.jpg',1,22500.00,'Salchipapas Gourmet','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"}]',NULL),(34,2,'Combo Personal Chazin','El combo ideal para disfrutar solo: 1 Hamburguesa Clásica Chazin (150g de carne de res, queso cheddar, tocineta crocante) + Porción individual de Papas a la Francesa (150g) + 1 Gaseosa 400ml bien fría a elección.','https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&auto=format&fit=crop&q=80',1,24500.00,'Combos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]','{\"esCombo\":true,\"cantidadBebidas\":1,\"bebidasPermitidas\":[]}'),(35,2,'Combo Familiar Chazin (4 Personas)','El banquete perfecto para compartir con familia o amigos: 2 Hamburguesas Clásicas Chazin + 2 Perros Calientes Especiales Americanos + 2 Porciones grandes de Papas a la Francesa (400g total) + 4 Gaseosas 400ml.','https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=80',1,68000.00,'Combos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]','{\"esCombo\":true,\"cantidadBebidas\":4,\"bebidasPermitidas\":[]}'),(36,2,'Combo Perro Amigos (2 Personas)','Diseñado para dos: 2 Perros Calientes Especiales Americanos con queso mozzarella fundido y tocineta crocante + Porción doble de Papas Francesas crujientes (250g) + 2 Gaseosas frías 400ml.','https://images.unsplash.com/photo-1541214113241-21578d2d9b62?w=600&auto=format&fit=crop&q=80',1,32000.00,'Combos','[{\"idAdicion\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]','{\"esCombo\":true,\"cantidadBebidas\":2,\"bebidasPermitidas\":[]}'),(37,3,'Hamburguesa Burger Fest Trufada','Edición especial gastronómica de tiempo limitado.','https://res.cloudinary.com/dckwtknmq/image/upload/v1789364357/ys2eammewmau6wxkjsxm.jpg',1,24000.00,NULL,'[{\"idAdicion\":3,\"id\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"precio\":3500,\"imagen\":\"https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":4,\"id\":4,\"nombre\":\"Extra Queso Cheddar (2 lonchas)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":5,\"id\":5,\"nombre\":\"Porción Papas a la Francesa (150g)\",\"precio\":5000,\"imagen\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":6,\"id\":6,\"nombre\":\"Porción Cebolla Caramelizada (50g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959741/dsogrxmfoohur2tscbgq.jpg\"},{\"idAdicion\":7,\"id\":7,\"nombre\":\"Jalapeños Picantes Extra (40g)\",\"precio\":2000,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788959869/sejgbjeuranc6quitnug.jpg\"},{\"idAdicion\":8,\"id\":8,\"nombre\":\"Salsa Chazin Especial Adicional\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":9,\"id\":9,\"nombre\":\"Salsa BBQ Ahumada Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":10,\"id\":10,\"nombre\":\"Salsa Tártara Casera Especial (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":11,\"id\":11,\"nombre\":\"Suero Costeño Cremoso Artesanal (50g)\",\"precio\":1500,\"imagen\":\"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80\"},{\"idAdicion\":12,\"id\":12,\"nombre\":\"Porción Queso Cheddar Fundido (60g)\",\"precio\":2500,\"imagen\":\"https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp\"},{\"idAdicion\":13,\"id\":13,\"nombre\":\"Porción Guacamole Fresco Artesanal (60g)\",\"precio\":2500,\"imagen\":\"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80\"}]','{\"esCombo\":false,\"cantidadBebidas\":0,\"bebidasPermitidas\":[]}');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `nombreContacto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idProveedor`),
  KEY `IDX_ProveedorTipo` (`idTipoProveedor`),
  KEY `IDX_ProveedorDocumento` (`idTipoDocumento`),
  CONSTRAINT `proveedor_ibfk_121` FOREIGN KEY (`idTipoProveedor`) REFERENCES `tipoproveedor` (`idTipoProveedor`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `proveedor_ibfk_122` FOREIGN KEY (`idTipoDocumento`) REFERENCES `tipodocumento` (`idTipoDocumento`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
INSERT INTO `proveedor` VALUES (1,1,1,'Carnes Premium','900.234.567-8','604 234 5678','info@carnespremium.com','Carrera 43A #12-80, Medellín',1,'María García'),(2,1,1,'Avícola del Sur','900.345.678-9','604 345 6789','ventas@avicolasur.com','Calle 10 Sur #48-20, Envigado',1,'Carlos López'),(3,2,1,'Panadería El Trigo','43.123.456-7','604 567 8901','eltrigo@gmail.com','Calle 33 #70-25, Medellín',1,'Luis Rodríguez'),(4,1,1,'Distribuidora Andina','900.567.890-1','604 678 9012','ventas@distrandina.com','Carrera 65 #8B-91, Medellín',0,'Pedro Gómez'),(5,1,1,'Dstribuidora Agricola S.A.S','900.123.456-7','3506785679','contacto@empresa.com','Av Central #48 - 40',0,'Carlos Mendoza'),(6,2,3,'Distribuidora Avícola San Jerónimo','900123456-7','3001234567','contacto@sanjeronimo.co','bla # bla CL ble ble blu blu ',1,'Carlos Pérez Pirés');
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resena`
--

DROP TABLE IF EXISTS `resena`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resena`
--

LOCK TABLES `resena` WRITE;
/*!40000 ALTER TABLE `resena` DISABLE KEYS */;
INSERT INTO `resena` VALUES (2,1,1,5,'La carne estaba en su punto perfecto y el pan brioche súper suave y fresco. La tocineta crocante le da un toque fenomenal.','2026-09-07 19:30:00',1),(3,1,2,5,'Poder personalizar y quitar la cebolla directamente desde la web fue excelente. La comida llegó calientita y las salsas deliciosas.','2026-09-08 20:15:00',1),(4,2,3,5,'Tremenda hamburguesa, las dos carnes son jugosas y el queso cheddar bien derretido. Muy recomendada.','2026-09-08 21:00:00',1),(5,5,1,5,'La salchicha suiza ahumada es de primera calidad y el queso gratinado espectacular. Excelente servicio.','2026-09-06 14:20:00',1);
/*!40000 ALTER TABLE `resena` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rol` (
  `idRol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`idRol`),
  UNIQUE KEY `UK_Rol_Nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador','Acceso total',1),(2,'Cocinero','Acceso a producción y fichas técnicas',1),(3,'Vendedor','Módulo de Punto de Venta y Gestión Comercial',1),(4,'Cliente','Acceso básico para realizar pedidos',1),(5,'Cajero Especial','Atención a mostrar y cobros',0);
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolpermiso`
--

DROP TABLE IF EXISTS `rolpermiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rolpermiso` (
  `idRolPermiso` int(11) NOT NULL AUTO_INCREMENT,
  `idRol` int(11) NOT NULL,
  `idPermiso` int(11) NOT NULL,
  PRIMARY KEY (`idRolPermiso`),
  UNIQUE KEY `UK_Rol_Permiso` (`idRol`,`idPermiso`),
  KEY `IDX_RolPermisoRol` (`idRol`),
  KEY `IDX_RolPermisoPermiso` (`idPermiso`),
  CONSTRAINT `rolpermiso_ibfk_167` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rolpermiso_ibfk_168` FOREIGN KEY (`idPermiso`) REFERENCES `permiso` (`idPermiso`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolpermiso`
--

LOCK TABLES `rolpermiso` WRITE;
/*!40000 ALTER TABLE `rolpermiso` DISABLE KEYS */;
INSERT INTO `rolpermiso` VALUES (6,1,1),(4,1,2),(1,1,3),(11,1,4),(14,1,5),(8,1,6),(12,1,7),(2,1,8),(13,1,9),(7,1,10),(9,1,11),(18,1,12),(3,1,13),(10,1,14),(15,1,15),(5,1,16),(17,1,17),(16,1,18),(47,2,1),(48,2,2),(49,2,3),(58,3,8),(61,3,9),(64,3,12),(59,3,13),(60,3,14),(62,3,15),(63,3,19),(69,5,12),(70,5,14),(68,5,15);
/*!40000 ALTER TABLE `rolpermiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipodocumento`
--

DROP TABLE IF EXISTS `tipodocumento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipodocumento` (
  `idTipoDocumento` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`idTipoDocumento`),
  UNIQUE KEY `UK_TipoDocumento` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipodocumento`
--

LOCK TABLES `tipodocumento` WRITE;
/*!40000 ALTER TABLE `tipodocumento` DISABLE KEYS */;
INSERT INTO `tipodocumento` VALUES (1,'CC'),(2,'CE'),(3,'NIT'),(4,'Pasaporte');
/*!40000 ALTER TABLE `tipodocumento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipoproveedor`
--

DROP TABLE IF EXISTS `tipoproveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipoproveedor` (
  `idTipoProveedor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`idTipoProveedor`),
  UNIQUE KEY `UK_TipoProveedor` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipoproveedor`
--

LOCK TABLES `tipoproveedor` WRITE;
/*!40000 ALTER TABLE `tipoproveedor` DISABLE KEYS */;
INSERT INTO `tipoproveedor` VALUES (2,'Distribuidor'),(3,'Fabricante'),(1,'Mayorista');
/*!40000 ALTER TABLE `tipoproveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trazabilidad`
--

DROP TABLE IF EXISTS `trazabilidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `trazabilidad_ibfk_119` FOREIGN KEY (`idInsumo`) REFERENCES `insumo` (`idInsumo`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `trazabilidad_ibfk_120` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`idUsuario`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trazabilidad`
--

LOCK TABLES `trazabilidad` WRITE;
/*!40000 ALTER TABLE `trazabilidad` DISABLE KEYS */;
INSERT INTO `trazabilidad` VALUES (29,'Creado','Distribuidora Avícola San Jerónimo','Se registró el proveedor en el sistema: Distribuidora Avícola San Jerónimo',1,'2026-08-18 05:42:24',NULL,NULL,NULL,'Registro inicial de proveedor',NULL),(41,'Creado','Carne con carolina reapper 150g','Se creó un nuevo insumo en el inventario: Carne con carolina reapper 150g',1,'2026-08-18 05:58:08',7,'Entrada',10.00,'Registro inicial de insumo',NULL),(42,'Creado','Adición: Queso extra cheddar','Se creó la adición Queso extra cheddar por $2500',1,'2026-08-18 06:10:34',4,NULL,NULL,'Creación de adición',NULL),(43,'Eliminado','samuel','Se movió a la papelera el insumo: samuel',1,'2026-08-31 11:08:00',3,NULL,NULL,'Inactivación / Envío a papelera',NULL),(44,'Eliminado','Yeison Food','Se movió a la papelera el insumo: Yeison Food',1,'2026-08-31 11:08:02',4,NULL,NULL,'Inactivación / Envío a papelera',NULL),(45,'Eliminado','Alexis','Se movió a la papelera el insumo: Alexis',1,'2026-08-31 11:08:06',6,NULL,NULL,'Inactivación / Envío a papelera',NULL),(46,'Creado','Pan de papa','Se creó un nuevo insumo en el inventario: Pan de papa',1,'2026-08-31 11:17:50',8,'Entrada',60.00,'Registro inicial de insumo',NULL),(47,'Creado','Carne de Res','Se creó un nuevo insumo en el inventario: Carne de Res',1,'2026-08-31 11:24:49',9,'Entrada',45.00,'Registro inicial de insumo',NULL),(48,'Eliminado','aguacate','Se movió a la papelera el insumo: aguacate',1,'2026-08-31 11:41:03',1,NULL,NULL,'Inactivación / Envío a papelera',NULL),(49,'Creado','papa','Se creó un nuevo insumo en el inventario: papa',1,'2026-09-01 11:57:44',10,'Entrada',100.00,'Registro inicial de insumo',NULL),(50,'Creado','papa2','Se creó un nuevo insumo en el inventario: papa2',1,'2026-09-01 12:00:01',11,'Entrada',100.00,'Registro inicial de insumo',NULL),(51,'Editado','Carne con carolina reapper 150g','Se actualizaron los datos del insumo: Carne con carolina reapper 150g',1,'2026-09-01 14:24:51',7,NULL,NULL,'Actualización de datos',NULL),(52,'CONSUMO_VENTA','Pan Brioche Artesanal','Consumo de 2.00 und por Venta #82 (2x Prod #10)',1,'2026-09-08 20:53:52',12,'SALIDA',2.00,'Venta #82',24),(53,'CONSUMO_VENTA','Carne de Res Molida 80/20','Consumo de 0.30 kg por Venta #82 (2x Prod #10)',1,'2026-09-08 20:53:52',14,'SALIDA',0.30,'Venta #82',24),(54,'CONSUMO_VENTA','Queso Cheddar en Lonchas','Consumo de 2.00 und por Venta #82 (2x Prod #10)',1,'2026-09-08 20:53:52',19,'SALIDA',2.00,'Venta #82',24),(55,'CONSUMO_VENTA','Tocineta Ahumada en Tiras','Consumo de 0.06 kg por Venta #82 (2x Prod #10)',1,'2026-09-08 20:53:52',18,'SALIDA',0.06,'Venta #82',24),(56,'CONSUMO_VENTA','Lechuga Batavia Fresca','Consumo de 0.04 kg por Venta #82 (2x Prod #10)',1,'2026-09-08 20:53:52',22,'SALIDA',0.04,'Venta #82',24),(57,'CONSUMO_VENTA','Tomate Chonto Maduro','Consumo de 0.06 kg por Venta #82 (2x Prod #10)',1,'2026-09-08 20:53:52',23,'SALIDA',0.06,'Venta #82',24),(58,'CONSUMO_VENTA','Pan Brioche Artesanal','Consumo de 2.00 und por Venta #83 (2x Prod #10)',1,'2026-09-08 20:56:29',12,'SALIDA',2.00,'Venta #83',24),(59,'CONSUMO_VENTA','Carne de Res Molida 80/20','Consumo de 0.30 kg por Venta #83 (2x Prod #10)',1,'2026-09-08 20:56:29',14,'SALIDA',0.30,'Venta #83',24),(60,'CONSUMO_VENTA','Queso Cheddar en Lonchas','Consumo de 2.00 und por Venta #83 (2x Prod #10)',1,'2026-09-08 20:56:29',19,'SALIDA',2.00,'Venta #83',24),(61,'CONSUMO_VENTA','Tocineta Ahumada en Tiras','Consumo de 0.06 kg por Venta #83 (2x Prod #10)',1,'2026-09-08 20:56:29',18,'SALIDA',0.06,'Venta #83',24),(62,'CONSUMO_VENTA','Lechuga Batavia Fresca','Consumo de 0.04 kg por Venta #83 (2x Prod #10)',1,'2026-09-08 20:56:29',22,'SALIDA',0.04,'Venta #83',24),(63,'CONSUMO_VENTA','Tomate Chonto Maduro','Consumo de 0.06 kg por Venta #83 (2x Prod #10)',1,'2026-09-08 20:56:29',23,'SALIDA',0.06,'Venta #83',24),(64,'CONSUMO_ADICION','Tocineta Ahumada en Tiras','Adición Extra Tocineta Ahumada (2 tiras) (2 kg) en Venta #83',1,'2026-09-08 20:56:29',18,'SALIDA',2.00,'Venta #83 (Adición)',24),(65,'CONSUMO_VENTA','Pan Brioche Artesanal','Consumo de 2.00 und por Venta #84 (2x Prod #10)',1,'2026-09-08 20:56:52',12,'SALIDA',2.00,'Venta #84',24),(66,'CONSUMO_VENTA','Carne de Res Molida 80/20','Consumo de 0.30 kg por Venta #84 (2x Prod #10)',1,'2026-09-08 20:56:52',14,'SALIDA',0.30,'Venta #84',24),(67,'CONSUMO_VENTA','Queso Cheddar en Lonchas','Consumo de 2.00 und por Venta #84 (2x Prod #10)',1,'2026-09-08 20:56:52',19,'SALIDA',2.00,'Venta #84',24),(68,'CONSUMO_VENTA','Tocineta Ahumada en Tiras','Consumo de 0.06 kg por Venta #84 (2x Prod #10)',1,'2026-09-08 20:56:52',18,'SALIDA',0.06,'Venta #84',24),(69,'CONSUMO_VENTA','Lechuga Batavia Fresca','Consumo de 0.04 kg por Venta #84 (2x Prod #10)',1,'2026-09-08 20:56:52',22,'SALIDA',0.04,'Venta #84',24),(70,'CONSUMO_VENTA','Tomate Chonto Maduro','Consumo de 0.06 kg por Venta #84 (2x Prod #10)',1,'2026-09-08 20:56:52',23,'SALIDA',0.06,'Venta #84',24),(71,'CONSUMO_ADICION','Tocineta Ahumada en Tiras','Adición Extra Tocineta Ahumada (2 tiras) (2 kg) en Venta #84',1,'2026-09-08 20:56:52',18,'SALIDA',2.00,'Venta #84 (Adición)',24),(72,'CONSUMO_VENTA','Pan Brioche Artesanal','Consumo de 2.00 und por Venta #85 (2x Prod #10)',1,'2026-09-08 20:57:23',12,'SALIDA',2.00,'Venta #85',24),(73,'CONSUMO_VENTA','Carne de Res Molida 80/20','Consumo de 0.30 kg por Venta #85 (2x Prod #10)',1,'2026-09-08 20:57:23',14,'SALIDA',0.30,'Venta #85',24),(74,'CONSUMO_VENTA','Queso Cheddar en Lonchas','Consumo de 2.00 und por Venta #85 (2x Prod #10)',1,'2026-09-08 20:57:23',19,'SALIDA',2.00,'Venta #85',24),(75,'CONSUMO_VENTA','Tocineta Ahumada en Tiras','Consumo de 0.06 kg por Venta #85 (2x Prod #10)',1,'2026-09-08 20:57:23',18,'SALIDA',0.06,'Venta #85',24),(76,'CONSUMO_VENTA','Lechuga Batavia Fresca','Consumo de 0.04 kg por Venta #85 (2x Prod #10)',1,'2026-09-08 20:57:23',22,'SALIDA',0.04,'Venta #85',24),(77,'CONSUMO_VENTA','Tomate Chonto Maduro','Consumo de 0.06 kg por Venta #85 (2x Prod #10)',1,'2026-09-08 20:57:23',23,'SALIDA',0.06,'Venta #85',24),(78,'CONSUMO_ADICION','Tocineta Ahumada en Tiras','Adición Extra Tocineta Ahumada (2 tiras) (2 kg) en Venta #85',1,'2026-09-08 20:57:23',18,'SALIDA',2.00,'Venta #85 (Adición)',24),(79,'Eliminado','Salsa Especial de la Casa','Se movió a la papelera el insumo preparado: Salsa Especial de la Casa',1,'2026-09-08 21:05:10',NULL,NULL,NULL,'Envío a papelera de preparado',NULL),(80,'Eliminado','salsa de la casa','Se movió a la papelera el insumo preparado: salsa de la casa',1,'2026-09-08 21:05:26',NULL,NULL,NULL,'Envío a papelera de preparado',NULL),(81,'Eliminado','Carne con carolina reapper 150g','Se movió a la papelera el insumo: Carne con carolina reapper 150g',1,'2026-09-08 21:05:48',7,NULL,NULL,'Envío a papelera',NULL),(82,'Eliminado','Receta Especial Jalapeños','Se movió a la papelera el insumo preparado: Receta Especial Jalapeños',1,'2026-09-08 21:06:28',NULL,NULL,NULL,'Envío a papelera de preparado',NULL),(83,'CONSUMO_VENTA','Pan Brioche Artesanal','Consumo de 2.00 und por Venta #95 (2x Prod #10)',1,'2026-09-08 21:08:40',12,'SALIDA',2.00,'Venta #95',24),(84,'CONSUMO_VENTA','Carne de Res Molida 80/20','Consumo de 0.30 kg por Venta #95 (2x Prod #10)',1,'2026-09-08 21:08:40',14,'SALIDA',0.30,'Venta #95',24),(85,'CONSUMO_VENTA','Queso Cheddar en Lonchas','Consumo de 2.00 und por Venta #95 (2x Prod #10)',1,'2026-09-08 21:08:40',19,'SALIDA',2.00,'Venta #95',24),(86,'CONSUMO_VENTA','Tocineta Ahumada en Tiras','Consumo de 0.06 kg por Venta #95 (2x Prod #10)',1,'2026-09-08 21:08:40',18,'SALIDA',0.06,'Venta #95',24),(87,'CONSUMO_VENTA','Lechuga Batavia Fresca','Consumo de 0.04 kg por Venta #95 (2x Prod #10)',1,'2026-09-08 21:08:40',22,'SALIDA',0.04,'Venta #95',24),(88,'CONSUMO_VENTA','Tomate Chonto Maduro','Consumo de 0.06 kg por Venta #95 (2x Prod #10)',1,'2026-09-08 21:08:40',23,'SALIDA',0.06,'Venta #95',24),(89,'CONSUMO_ADICION','Tocineta Ahumada en Tiras','Adición Extra Tocineta Ahumada (2 tiras) (2 kg) en Venta #95',1,'2026-09-08 21:08:40',18,'SALIDA',2.00,'Venta #95 (Adición)',24),(90,'CONSUMO_VENTA','Pan Brioche Artesanal','Consumo de 2.00 und por Venta #96 (2x Prod #10)',1,'2026-09-08 21:11:30',12,'SALIDA',2.00,'Venta #96',24),(91,'CONSUMO_VENTA','Carne de Res Molida 80/20','Consumo de 0.30 kg por Venta #96 (2x Prod #10)',1,'2026-09-08 21:11:30',14,'SALIDA',0.30,'Venta #96',24),(92,'CONSUMO_VENTA','Queso Cheddar en Lonchas','Consumo de 2.00 und por Venta #96 (2x Prod #10)',1,'2026-09-08 21:11:30',19,'SALIDA',2.00,'Venta #96',24),(93,'CONSUMO_VENTA','Tocineta Ahumada en Tiras','Consumo de 0.06 kg por Venta #96 (2x Prod #10)',1,'2026-09-08 21:11:30',18,'SALIDA',0.06,'Venta #96',24),(94,'CONSUMO_VENTA','Lechuga Batavia Fresca','Consumo de 0.04 kg por Venta #96 (2x Prod #10)',1,'2026-09-08 21:11:30',22,'SALIDA',0.04,'Venta #96',24),(95,'CONSUMO_VENTA','Tomate Chonto Maduro','Consumo de 0.06 kg por Venta #96 (2x Prod #10)',1,'2026-09-08 21:11:30',23,'SALIDA',0.06,'Venta #96',24),(96,'CONSUMO_ADICION','Tocineta Ahumada en Tiras','Adición Extra Tocineta Ahumada (2 tiras) (2 kg) en Venta #96',1,'2026-09-08 21:11:30',18,'SALIDA',2.00,'Venta #96 (Adición)',24),(97,'CONSUMO_VENTA','Pan Brioche Artesanal','Consumo de 2.00 und por Venta #106 (2x Prod #10)',1,'2026-09-08 21:32:34',12,'SALIDA',2.00,'Venta #106',24),(98,'CONSUMO_VENTA','Carne de Res Molida 80/20','Consumo de 0.30 kg por Venta #106 (2x Prod #10)',1,'2026-09-08 21:32:34',14,'SALIDA',0.30,'Venta #106',24),(99,'CONSUMO_VENTA','Queso Cheddar en Lonchas','Consumo de 2.00 und por Venta #106 (2x Prod #10)',1,'2026-09-08 21:32:34',19,'SALIDA',2.00,'Venta #106',24),(100,'CONSUMO_VENTA','Tocineta Ahumada en Tiras','Consumo de 0.06 kg por Venta #106 (2x Prod #10)',1,'2026-09-08 21:32:34',18,'SALIDA',0.06,'Venta #106',24),(101,'CONSUMO_VENTA','Lechuga Batavia Fresca','Consumo de 0.04 kg por Venta #106 (2x Prod #10)',1,'2026-09-08 21:32:34',22,'SALIDA',0.04,'Venta #106',24),(102,'CONSUMO_VENTA','Tomate Chonto Maduro','Consumo de 0.06 kg por Venta #106 (2x Prod #10)',1,'2026-09-08 21:32:34',23,'SALIDA',0.06,'Venta #106',24),(103,'CONSUMO_ADICION','Tocineta Ahumada en Tiras','Adición Extra Tocineta Ahumada (2 tiras) (2 kg) en Venta #106',1,'2026-09-08 21:32:34',18,'SALIDA',2.00,'Venta #106 (Adición)',24),(104,'CONSUMO_VENTA','Pan Brioche Artesanal','Consumo de 2.00 und por Venta #116 (2x Prod #10)',1,'2026-09-08 22:22:53',12,'SALIDA',2.00,'Venta #116',24),(105,'CONSUMO_VENTA','Carne de Res Molida 80/20','Consumo de 0.30 kg por Venta #116 (2x Prod #10)',1,'2026-09-08 22:22:53',14,'SALIDA',0.30,'Venta #116',24),(106,'CONSUMO_VENTA','Queso Cheddar en Lonchas','Consumo de 2.00 und por Venta #116 (2x Prod #10)',1,'2026-09-08 22:22:53',19,'SALIDA',2.00,'Venta #116',24),(107,'CONSUMO_VENTA','Tocineta Ahumada en Tiras','Consumo de 0.06 kg por Venta #116 (2x Prod #10)',1,'2026-09-08 22:22:53',18,'SALIDA',0.06,'Venta #116',24),(108,'CONSUMO_VENTA','Lechuga Batavia Fresca','Consumo de 0.04 kg por Venta #116 (2x Prod #10)',1,'2026-09-08 22:22:53',22,'SALIDA',0.04,'Venta #116',24),(109,'CONSUMO_VENTA','Tomate Chonto Maduro','Consumo de 0.06 kg por Venta #116 (2x Prod #10)',1,'2026-09-08 22:22:53',23,'SALIDA',0.06,'Venta #116',24),(110,'CONSUMO_ADICION','Tocineta Ahumada en Tiras','Adición Extra Tocineta Ahumada (2 tiras) (2 kg) en Venta #116',1,'2026-09-08 22:22:53',18,'SALIDA',2.00,'Venta #116 (Adición)',24),(111,'Editado','Adición: Porción Cebolla Caramelizada (50g)','Se actualizó la adición Porción Cebolla Caramelizada (50g)',1,'2026-09-09 13:16:06',24,NULL,NULL,'Actualización de adición',NULL),(112,'Editado','Adición: Jalapeños Picantes Extra (40g)','Se actualizó la adición Jalapeños Picantes Extra (40g)',1,'2026-09-09 13:17:54',25,NULL,NULL,'Actualización de adición',NULL),(113,'Editado','Adición: Extra Queso Cheddar (2 lonchas)','Se actualizó la adición Extra Queso Cheddar (2 lonchas)',1,'2026-09-09 15:01:57',19,NULL,NULL,'Actualización de adición',NULL),(114,'CONSUMO_VENTA','Pan Brioche Artesanal','Consumo de 1.00 und por Venta #117 (1x Prod #1)',1,'2026-09-14 11:48:36',12,'SALIDA',1.00,'Venta #117',6),(115,'CONSUMO_VENTA','Carne de Res Molida 80/20','Consumo de 0.15 kg por Venta #117 (1x Prod #1)',1,'2026-09-14 11:48:36',14,'SALIDA',0.15,'Venta #117',6),(116,'CONSUMO_VENTA','Queso Cheddar en Lonchas','Consumo de 1.00 und por Venta #117 (1x Prod #1)',1,'2026-09-14 11:48:36',19,'SALIDA',1.00,'Venta #117',6),(117,'CONSUMO_VENTA','Tocineta Ahumada en Tiras','Consumo de 0.03 kg por Venta #117 (1x Prod #1)',1,'2026-09-14 11:48:36',18,'SALIDA',0.03,'Venta #117',6),(118,'CONSUMO_VENTA','Lechuga Batavia Fresca','Consumo de 0.02 kg por Venta #117 (1x Prod #1)',1,'2026-09-14 11:48:36',22,'SALIDA',0.02,'Venta #117',6),(119,'CONSUMO_VENTA','Tomate Chonto Maduro','Consumo de 0.03 kg por Venta #117 (1x Prod #1)',1,'2026-09-14 11:48:36',23,'SALIDA',0.03,'Venta #117',6),(120,'CONSUMO_VENTA','Pan Brioche Artesanal','Consumo de 2.00 und por Venta #118 (2x Prod #1)',0,'2026-09-14 16:01:28',12,'SALIDA',2.00,'Venta #118',24),(121,'CONSUMO_VENTA','Carne de Res Molida 80/20','Consumo de 0.30 kg por Venta #118 (2x Prod #1)',0,'2026-09-14 16:01:28',14,'SALIDA',0.30,'Venta #118',24),(122,'CONSUMO_VENTA','Queso Cheddar en Lonchas','Consumo de 2.00 und por Venta #118 (2x Prod #1)',0,'2026-09-14 16:01:28',19,'SALIDA',2.00,'Venta #118',24),(123,'CONSUMO_VENTA','Tocineta Ahumada en Tiras','Consumo de 0.06 kg por Venta #118 (2x Prod #1)',0,'2026-09-14 16:01:28',18,'SALIDA',0.06,'Venta #118',24),(124,'CONSUMO_VENTA','Lechuga Batavia Fresca','Consumo de 0.04 kg por Venta #118 (2x Prod #1)',0,'2026-09-14 16:01:28',22,'SALIDA',0.04,'Venta #118',24),(125,'CONSUMO_VENTA','Tomate Chonto Maduro','Consumo de 0.06 kg por Venta #118 (2x Prod #1)',0,'2026-09-14 16:01:28',23,'SALIDA',0.06,'Venta #118',24),(126,'CONSUMO_ADICION','Tocineta Ahumada en Tiras','Adición Extra Tocineta Ahumada (2 tiras) (2 kg) en Venta #118',0,'2026-09-14 16:01:28',18,'SALIDA',2.00,'Venta #118 (Adición)',24);
/*!40000 ALTER TABLE `trazabilidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  KEY `IDX_UsuarioRol` (`idRol`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Fernando','Gómez Jaramillo','C.C.','1','3014599890','gomezjaramillofer@gmail.com','$2a$10$85QpBu8Uj3qXzVtWTjCLveU8HpnJ1.uHuQfL1izYlVRe67hhDK3yO','ACTIVO','2026-07-26 20:09:41',4),(2,'Juan Alberto','Pérez Palermo','C.C.','2','3456457689','testgestionusuarios@gmail.com','$2a$10$e/p3rV1gEKEGUhT3F6FxG.MOTnyYdSh3m533n7UeVifuKffYi6MQC','ACTIVO','2026-07-20 18:40:14',4),(3,'Juan ALbeiro','Perez Oso','C.C.','3','314567897','gomezpavas26@gmail.com','$2a$10$j5oVx6JEwM.KjqhBZyM05uF6.D5f.xRWFtCQQRX47UDhzidE5qvVq','ACTIVO','2026-07-21 17:01:48',4),(4,'Admin','Sistema','C.C.','4','3190000001','admin@chazinfood.com','$2a$10$dS5LiLdTlcXUBSRahZAYNexfLybhvFXykk9833rsPuWz.iFzW1TcW','ACTIVO','2026-07-18 11:53:44',1),(5,'Carlos','Martínez','C.C.','5','3190000003','cocinero@chazinfood.com','$2a$10$KHZuIZ9INvEesGntm9OE.e4JIIQBMBoeWqY3k6YGdni/ZTrPSjDW2','ACTIVO','2026-07-18 13:02:36',2),(6,'María','García','C.C.','6432234344','3190000002','cliente@chazinfood.com','$2a$10$5Y9vYponOKrFOkM8Tl92CO3kA2gx2U88w5g2hkAI0Bqzjwr/.6c8y','ACTIVO','2026-07-18 13:02:36',4),(7,'Ana','Martínez','C.C.','7','3190000004','ana.martinez@chazinfood.com','$2a$10$pgPCLRzjuABNj2teljRYsOGCK.4BNyxpeXmrX/BE4/VkIAiWonOeW','ACTIVO','2026-07-18 13:02:36',4),(8,'Luis','Rodríguez','C.C.','8','3190000005','luis.rodriguez@chazinfood.com','$2a$10$so2k56hBmTlkKkyIE7SOWuHPdIWBHB89vG.3L.dwGWVTXu8aLVsHK','ACTIVO','2026-07-18 13:02:36',2),(9,'Sandra','Gómez','C.C.','9','3190000006','sandra.gomez@chazinfood.com','$2a$10$phMmRnOVMy0225SkqUNtgeL052lNC1TR3Jt1xfWrx9n7J7w.S2g5K','ACTIVO','2026-07-18 13:02:37',4),(10,'Alexis','Gómez Pavas','C.C.','10','3023155969','gomezpavas34@gmail.com','$2a$10$iz/WLUsWy6UdDkJ8MQMxguMy9fjq5JSJGlmNGZ6cA2.hPjM7pnR.e','ACTIVO','2026-07-18 13:02:36',4),(11,'Alejandro','Gómez Plata','T.I.','11','3456897065','agp7ytwxp@gmail.com','$2a$10$gtCAOCDL/8D0XSq/VtQ3XOH9SY16Wn.WTNUDNEUBBsuAOpa5neUky','ACTIVO','2026-07-23 04:07:38',4),(12,'María Modificada','García López','C.C.','12','3190000002','maria@correo.com','$2a$10$4v55hrZPMEk3zLiJfU5fo.J6rRy17QeQHpRQHBfvOh07OsKfiQM.W','ACTIVO','2026-07-18 11:57:25',4),(13,'María Teresa','Pavas Toro','C.C.','13','3143122970','pavasteresa@gmail.com','$2a$10$RTap7rl1N.ZPYC8v.mGVfe5qgwFF4ISPLRGWLSDJp00LgV.JbqYoW','ACTIVO','2026-08-01 00:27:11',4),(14,'Prueba Temp','Cliente Test',NULL,'14','','temp1785814635778@test.com','$2a$10$yfxH94DYnP.U5nS2ioc5AObqQeVsz8j7fLeUHakVEB2WLuJmk0YtG','1','2026-08-04 03:37:15',4),(15,'Clientee','Prueba QA',NULL,'15','5699999999','qa+cliente@example.test','$2a$10$DTl16FqCKS.DjKvj55oUbeuvOORVS5G9Dikcrn3zRvU.8DubJ0O12','1','2026-08-06 03:44:26',4),(19,'Cliente QA Automatizado Prueba SistemaA','Prueba Sistema',NULL,'19','3009998877','qa.test.1785989087646@chazinfood.test','$2a$10$Q9BXFFHAtg8Af8hyUbs2OemDnFkHREmOyhBz67SmulOlE.9kLAn7a','ACTIVO','2026-08-06 04:04:47',4),(20,'iñigo osorio perez','',NULL,'20','300233456','ininguito@gmail.com','$2a$10$Y8/I6UKSLZA1nw1DxTD57OyeyWDzi58W2nQMbwImkLYMQ021Un3Re','1','2026-08-08 22:11:00',4),(21,'jose de la rosa ocampo angeles','','C.C.','21','39908765','delarouse@gmail.com','$2a$10$EriRPtRkc/pFi10A55MXfOVG4M9/cbAXA9jbEO2YjZBS5DuHSErbK','ACTIVO','2026-08-08 22:30:01',4),(22,'jusepe','garcía ruíz','C.C.','22','322890765','jusepito@gmail.com','$2a$10$MYdDVcOrn5A444u2h3pf6OqLCgErKseCbvyFbLyrmiUu7PXrZhdE2','ACTIVO','2026-08-08 23:20:42',4),(23,'Laura','','','23','3001234567','samu36669@gmail.com','$2a$10$eQv7Rw8/ws1JqDdbv0Lr.utO2kcfDaA0UhdltfdGA654PfZpmObFK','ACTIVO','2026-08-09 06:53:45',4),(24,'Vendedor Principal','Chazin','C.C.','24','3001234567','vendedor@chazinfood.com','$2a$10$YizLrUBkaC5CXWb8GUGq6.cxRe9Xxwl8WGJrFP0pEze9MAsjNphMm','ACTIVO','2026-08-14 09:36:36',3);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variante`
--

DROP TABLE IF EXISTS `variante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variante` (
  `idVariante` int(11) NOT NULL AUTO_INCREMENT,
  `idProducto` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`idVariante`),
  KEY `IDX_VarianteProducto` (`idProducto`),
  CONSTRAINT `variante_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variante`
--

LOCK TABLES `variante` WRITE;
/*!40000 ALTER TABLE `variante` DISABLE KEYS */;
INSERT INTO `variante` VALUES (0,0,'__SISTEMA_VARIANTE_CERO__',0.00,0),(10,1,'Clásica 150g',18000.00,1),(11,2,'Doble Carne 300g',25000.00,1),(12,3,'Pollo Crispy 180g',21000.00,1),(13,4,'Perro Especial',14000.00,1),(14,5,'Perro Suizo Gourmet',17000.00,1),(15,6,'Salchipapa Personal Grande',23000.00,1),(16,7,'Combo Pareja Completo',38000.00,1),(17,8,'Coca-Cola Sabor Original 400ml',4500.00,1),(18,9,'Botella 400ml',4000.00,1),(19,10,'Botella 500ml',3000.00,1),(20,8,'Coca-Cola Sin Azúcar / Light 400ml',4500.00,1),(21,11,'Pepsi Regular 400ml',4000.00,1),(22,11,'Pepsi Light / Black 400ml',4000.00,1),(23,12,'Colombiana Botella 400ml',4000.00,1),(24,13,'Sprite Botella 400ml',4500.00,1),(25,14,'Cuatro Botella 400ml',4500.00,1),(26,15,'Porción Individual 150g',5000.00,1),(27,16,'Botella 400ml',4500.00,1),(28,17,'Porción Individual',10500.00,1),(29,18,'Porción Individual',8500.00,1),(30,19,'Porción Individual',10500.00,1),(31,20,'Porción Individual',8500.00,1),(32,21,'Porción Individual',13500.00,1),(33,22,'Porción Individual',15500.00,1),(34,23,'Porción Individual',17500.00,1),(35,24,'Porción Individual',15500.00,1),(36,25,'Porción Individual',17500.00,1),(37,26,'Edición Especial Burger Fest',24000.00,1),(39,27,'Individual BBQ Bacon 150g',22000.00,1),(40,27,'Doble Carne BBQ Bacon 300g',28000.00,1),(41,28,'Mexicana Clásica',23500.00,1),(42,28,'Extra Picante con Doble Jalapeño',25000.00,1),(43,29,'Individual Campesina',23000.00,1),(44,30,'Perro Mexicano Clásico',16000.00,1),(45,31,'Perro Criollo Gourmet',16500.00,1),(46,32,'Porción Personal Grande',21000.00,1),(47,32,'Familiar para Compartir (2 Personas)',34000.00,1),(48,33,'Porción Costeña Grande',22500.00,1),(49,34,'Combo con Coca-Cola Original 400ml',24500.00,1),(50,34,'Combo con Postobón Manzana 400ml',24500.00,1),(51,34,'Combo con Coca-Cola Sin Azúcar 400ml',24500.00,1),(52,35,'Combo Familiar 4 Personas',68000.00,1),(53,36,'Combo Dúo Perros Calientes',32000.00,1),(55,37,'Edición Especial',24000.00,1);
/*!40000 ALTER TABLE `variante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `estadoAprobacion` enum('PENDIENTE','APROBADO','RECHAZADO') DEFAULT 'PENDIENTE',
  PRIMARY KEY (`idVenta`),
  KEY `IDX_VentaCliente` (`idCliente`),
  KEY `IDX_VentaUsuario` (`idUsuario`),
  KEY `IDX_VentaDescuento` (`idDescuento`),
  CONSTRAINT `venta_ibfk_178` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `venta_ibfk_179` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `venta_ibfk_180` FOREIGN KEY (`idDescuento`) REFERENCES `descuento` (`idDescuento`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta`
--

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
INSERT INTO `venta` VALUES (117,3,6,NULL,'2026-09-14 11:48:35','DOMICILIO',18000.00,2700.00,15300.00,'PENDIENTE','{\"horario\":\"06:48 a. m.\",\"tipoEntrega\":\"Domicilio\",\"metodoPago\":\"Wompi\",\"direccion\":\"Calle Falsa 123\",\"estadoPago\":\"Pendiente\",\"codigoPedido\":\"VEN-5939\",\"clienteNombre\":\"María García\",\"productos\":[{\"id\":1,\"idVariante\":1,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":1,\"precioUnitario\":18000,\"total\":18000,\"observaciones\":\"\",\"adiciones\":[]}],\"especificaciones\":\"{\\\"tipoEntrega\\\":\\\"Domicilio\\\",\\\"metodoPago\\\":\\\"Wompi\\\",\\\"direccion\\\":\\\"Calle Falsa 123\\\",\\\"especificaciones\\\":\\\"\\\",\\\"clienteNombre\\\":\\\"María García\\\",\\\"productos\\\":[{\\\"id\\\":1,\\\"idVariante\\\":1,\\\"nombre\\\":\\\"Hamburguesa Clásica Chazin\\\",\\\"cantidad\\\":1,\\\"precioUnitario\\\":18000,\\\"total\\\":18000,\\\"observaciones\\\":\\\"\\\",\\\"adiciones\\\":[]}],\\\"wompiReference\\\":\\\"CHAZIN-1789386515913-3476\\\",\\\"montoEnCentavos\\\":1530000,\\\"moneda\\\":\\\"COP\\\",\\\"estadoPago\\\":\\\"Pendiente\\\",\\\"fechaIntencion\\\":\\\"2026-09-14T11:48:35.914Z\\\"}\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\"}','PENDIENTE'),(118,10,24,NULL,'2026-09-14 16:01:28','PUNTO_DE_VENTA',43000.00,6450.00,36550.00,'ENTREGADO','{\"horario\":\"11:01 a. m.\",\"tipoEntrega\":\"Mesa\",\"metodoPago\":\"Efectivo\",\"direccion\":\"Recoger en Local\",\"estadoPago\":\"Pagado\",\"codigoPedido\":\"VEN-8661\",\"clienteNombre\":\"Fernando Gómez Jaramillo\",\"productos\":[{\"idVariante\":10,\"nombre\":\"Hamburguesa Clásica Chazin\",\"cantidad\":2,\"precioUnitario\":18000,\"total\":36000,\"observaciones\":\"\",\"adiciones\":[{\"idAdicion\":3,\"id\":3,\"nombre\":\"Extra Tocineta Ahumada (2 tiras)\",\"cantidad\":1,\"precio\":3500}]}],\"especificaciones\":\"Prueba Automatizada de Descuento de Stock Chazin Food\",\"efectivoConCuanto\":\"\",\"vueltoEfectivo\":0,\"transferenciaReferencia\":\"\",\"transferBanco\":\"\",\"tarjetaNumero\":\"\",\"estadoAprobacion\":\"PENDIENTE\"}','PENDIENTE');
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `vwinventario`
--

DROP TABLE IF EXISTS `vwinventario`;
/*!50001 DROP VIEW IF EXISTS `vwinventario`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `vwinventario` AS SELECT
 1 AS `idInsumo`,
  1 AS `nombre`,
  1 AS `Categoria`,
  1 AS `stock`,
  1 AS `stockMinimo`,
  1 AS `unidadMedida`,
  1 AS `fechaVencimiento` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vwproductos`
--

DROP TABLE IF EXISTS `vwproductos`;
/*!50001 DROP VIEW IF EXISTS `vwproductos`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `vwproductos` AS SELECT
 1 AS `idProducto`,
  1 AS `nombre`,
  1 AS `Categoria`,
  1 AS `Variante`,
  1 AS `precio` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vwventas`
--

DROP TABLE IF EXISTS `vwventas`;
/*!50001 DROP VIEW IF EXISTS `vwventas`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `vwventas` AS SELECT
 1 AS `idVenta`,
  1 AS `Cliente`,
  1 AS `fechaVenta`,
  1 AS `subtotal`,
  1 AS `descuentoAplicado`,
  1 AS `total`,
  1 AS `estadoEntrega` */;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'chazinfood'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `RegistrarCompra` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `RegistrarCompra`(IN `pProveedor` INT, IN `pTotal` DECIMAL(10,2))
BEGIN

INSERT INTO compra(

idProveedor,

fechaCompra,

total,

estado

)

VALUES(

pProveedor,

NOW(),

pTotal,

'RECIBIDA'

);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `RegistrarVenta` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `RegistrarVenta`(IN `pCliente` INT, IN `pUsuario` INT, IN `pSubtotal` DECIMAL(10,2), IN `pDescuento` DECIMAL(10,2), IN `pTotal` DECIMAL(10,2))
BEGIN

INSERT INTO venta(

idCliente,

idUsuario,

fechaVenta,

subtotal,

descuentoAplicado,

total

)

VALUES(

pCliente,

pUsuario,

NOW(),

pSubtotal,

pDescuento,

pTotal

);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Current Database: `chazinfood`
--

USE `chazinfood`;

--
-- Final view structure for view `vwinventario`
--

/*!50001 DROP VIEW IF EXISTS `vwinventario`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwinventario` AS select `i`.`idInsumo` AS `idInsumo`,`i`.`nombre` AS `nombre`,`c`.`nombre` AS `Categoria`,`i`.`stock` AS `stock`,`i`.`stockMinimo` AS `stockMinimo`,`i`.`unidadMedida` AS `unidadMedida`,`i`.`fechaVencimiento` AS `fechaVencimiento` from (`insumo` `i` join `categoriainsumo` `c` on(`c`.`idCategoriaInsumo` = `i`.`idCategoriaInsumo`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vwproductos`
--

/*!50001 DROP VIEW IF EXISTS `vwproductos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwproductos` AS select `p`.`idProducto` AS `idProducto`,`p`.`nombre` AS `nombre`,`cp`.`nombre` AS `Categoria`,`v`.`nombre` AS `Variante`,`v`.`precio` AS `precio` from ((`producto` `p` join `categoriaproducto` `cp` on(`cp`.`idCategoriaProducto` = `p`.`idCategoriaProducto`)) join `variante` `v` on(`v`.`idProducto` = `p`.`idProducto`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vwventas`
--

/*!50001 DROP VIEW IF EXISTS `vwventas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwventas` AS select `v`.`idVenta` AS `idVenta`,concat(`u`.`nombre`,' ',`u`.`apellidos`) AS `Cliente`,`v`.`fechaVenta` AS `fechaVenta`,`v`.`subtotal` AS `subtotal`,`v`.`descuentoAplicado` AS `descuentoAplicado`,`v`.`total` AS `total`,`v`.`estadoEntrega` AS `estadoEntrega` from ((`venta` `v` join `cliente` `c` on(`c`.`idCliente` = `v`.`idCliente`)) join `usuario` `u` on(`u`.`idUsuario` = `c`.`idUsuario`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-16 18:35:48
