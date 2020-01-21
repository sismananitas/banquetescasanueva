
-- TABLAS 08/03/2019--

CREATE DATABASE banquet2_base;
USE banquet2_base;

-- LUGARES -----------

CREATE TABLE lugares (
	`id`  		INT(11) NOT NULL AUTO_INCREMENT,
	`nombre`    VARCHAR(200) NULL DEFAULT NULL,
	CONSTRAINT `pk_lugar` PRIMARY KEY(`id`)
) ENGINE=InnoDB;

-- USUARIOS ---------

CREATE TABLE usuarios (
	`id`   		INT(11) NOT NULL AUTO_INCREMENT,
	`username`  VARCHAR(100) NOT NULL,
	`pass`      VARCHAR(100) NULL DEFAULT NULL,
	`nivel`     VARCHAR(200) NULL DEFAULT NULL,
	`estado`    INT(11) NULL DEFAULT '0',
	`fecha`		DATE NOT NULL,
	CONSTRAINT `pk_usuario` PRIMARY KEY(`id`)
) ENGINE=InnoDB;

-- DETALLE USUARIO -----------------------

CREATE TABLE detalle_usuario (
	`id`   			INT(11) NOT NULL AUTO_INCREMENT,
	`usuario_id`   INT(11) NOT NULL,
	`nombre`       VARCHAR(50) NOT NULL,
	`apellidos`    VARCHAR(50) NULL DEFAULT NULL,
	`email`       	VARCHAR(50) NULL DEFAULT NULL,
	`telefono`     VARCHAR(50) NULL DEFAULT NULL,
	`depto`        VARCHAR(100) NULL DEFAULT NULL,
	CONSTRAINT `pk_detalle_usuario` 	PRIMARY KEY(`id`),
	CONSTRAINT `uk_detalle_usuario` 	UNIQUE(`usuario_id`, `email`),
	CONSTRAINT `fk_usuario`				FOREIGN KEY(`usuario_id`)
	REFERENCES `usuarios`(`id`) 		ON DELETE CASCADE
) ENGINE=InnoDB;

-- ClIENTES ------------------------------

CREATE TABLE clientes (
	`id`   		INT(11) NOT NULL AUTO_INCREMENT,
	`nombre`    VARCHAR(100) NOT NULL,
	`apellido`  VARCHAR(100) NULL DEFAULT NULL,
	`email`   	VARCHAR(200) NOT NULL,
	`telefono`  VARCHAR(200) NOT NULL,
	`fecha`		DATE NOT NULL,
	CONSTRAINT `pk_cliente` PRIMARY KEY(`id`),
	CONSTRAINT `uk_cliente` UNIQUE(`email`)
) ENGINE=InnoDB;

-- MENUS------------

CREATE TABLE menus (
   `id`                	INT NOT NULL AUTO_INCREMENT,
   `nombre`            	VARCHAR(200) NOT NULL,
   `precio_unitario`   	FLOAT(11,2) NOT NULL,
   `detalle`           	TEXT,
   CONSTRAINT `pk_menu`	PRIMARY KEY(`id`)
) ENGINE=InnoDB;

-- TIPO EVENTOS--------

CREATE TABLE tipo_eventos (
	`id` 		INT(11) NOT NULL AUTO_INCREMENT,
	`nombre` VARCHAR(200) NULL DEFAULT NULL,
	CONSTRAINT `pk_tipo_evento` PRIMARY KEY(`id`)
) ENGINE=InnoDB;

-- PRECIOS DE RENTAS---------

CREATE TABLE rentas (
	`id` 					INT(11) NOT NULL AUTO_INCREMENT,
	`tipo_evento_id` 	INT(11) NULL DEFAULT NULL,
	`lugar_id` 			INT(11) NULL DEFAULT NULL,
	`precio_alta` 		FLOAT(11,2) NULL DEFAULT NULL,
	`precio_baja` 		FLOAT(11,2) NULL DEFAULT NULL,
	CONSTRAINT `pk_precio_renta` 		PRIMARY KEY (`id`),
	CONSTRAINT `fk_lugares` 			FOREIGN KEY (`lugar_id`)
	REFERENCES `lugares`(`id`) 		ON DELETE CASCADE,
	CONSTRAINT `fk_tipo_eventos` 		FOREIGN KEY (`tipo_evento_id`)
	REFERENCES `tipo_eventos`(`id`) 	ON DELETE CASCADE
) ENGINE=InnoDB;

-- EVENTOS-----------

CREATE TABLE eventos (
	`id`    				INT(11) NOT NULL AUTO_INCREMENT,
	`usuario_id`   	INT(11) NOT NULL,
	`cliente_id`     	INT(11) NOT NULL,
	`renta_id` 			INT(11) NOT NULL,
	`title`        	VARCHAR(200) NOT NULL,
	`evento`       	VARCHAR(200) NULL DEFAULT NULL,
	`responsable`    	VARCHAR(200) NOT NULL,
	`start`        	DATETIME NOT NULL,
	`end`          	DATETIME NOT NULL,
	`personas`     	INT(11) NOT NULL,
	`color`        	VARCHAR(100) NOT NULL DEFAULT '#d7c735',
	`cord_apoyo`   	VARCHAR(200) NULL DEFAULT NULL,
	`description`  	TEXT NULL DEFAULT NULL,
	CONSTRAINT `pk_evento` 				PRIMARY KEY(`id`),
	CONSTRAINT `fk_usuario_evento` 	FOREIGN KEY(`usuario_id`)
	REFERENCES `usuarios`(`id`)		ON DELETE CASCADE,
	CONSTRAINT `fk_cliente_evento` 	FOREIGN KEY(`cliente_id`)
	REFERENCES `clientes`(`id`)		ON DELETE CASCADE,
	CONSTRAINT `fk_renta_evento` 		FOREIGN KEY(`renta_id`)
	REFERENCES `rentas`(`id`)			ON DELETE CASCADE
) ENGINE=InnoDB;

-- COTIZACIONES------

CREATE TABLE cotizaciones (
   `id`           INT(11) NOT NULL AUTO_INCREMENT,
   `evento_id`		INT(11) NOT NULL,
   `cliente_id`	INT(11) NOT NULL,
	`usuario_id`	INT(11) NOT NULL,
	`folio`			VARCHAR(200) NOT NULL,
   `fecha` 			DATE NOT NULL,
	`renta`			FLOAT(11,2) NOT NULL DEFAULT 0.00,
	`personas`		INT(11) NOT NULL DEFAULT 0,
   `estado` 		INT(11) NOT NULL DEFAULT 0,
   `costo_total`	FLOAT(11,2) NULL,
   CONSTRAINT `pk_cotizacion` 		PRIMARY KEY(`id`),
   CONSTRAINT `fk_cotizacion_evento`FOREIGN KEY(`evento_id`) REFERENCES `eventos`(`id_evento`),
	CONSTRAINT `fk_cotizacion_usuario` FOREIGN KEY(`usuario_id`) REFERENCES `usuarios`(`id_usuario`),
	CONSTRAINT `fk_cotizacion_cliente` FOREIGN KEY(`cliente_id`) REFERENCES `clientes`(`id`)
) ENGINE=InnoDB;

-- DETALLE COTIZACION ---------

CREATE TABLE detalle_cotizacion (
	`id` 					INT(11) NOT NULL AUTO_INCREMENT,
	`cotizacion_id` 	INT(11) NOT NULL,
	`descripcion` 		VARCHAR(200) NOT NULL,
	`precio_unitario` FLOAT(11,2) NOT NULL,
	`cantidad` 			INT(11) NOT NULL,
	`iva` 				FLOAT(11,2) NOT NULL,
	`servicio` 			FLOAT(11,2) NOT NULL,
	`subtotal` 			FLOAT(11,2) NOT NULL,
	CONSTRAINT `pk_detalle_cot` PRIMARY KEY(`id`),
	CONSTRAINT `fk_detalle_cot_cot` FOREIGN KEY(`cotizacion_id`) REFERENCES `cotizaciones`(`id`)
) ENGINE=InnoDB;

-- LOGISTICA-------

CREATE TABLE actividades (
	`id`   			INT(11) NOT NULL AUTO_INCREMENT,
	`evento_id`    INT(11) NOT NULL,
	`start`        DATETIME NOT NULL,
	`end`          DATETIME NOT NULL,
	`title`        VARCHAR(200) NULL DEFAULT 'ACTIVIDAD',
	`lugar`        VARCHAR(200) NULL DEFAULT NULL,
	CONSTRAINT `pk_actividad` 	PRIMARY KEY(`id`),
	CONSTRAINT `fk_evento` 		FOREIGN KEY(`evento_id`)
	REFERENCES `eventos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ORDENES DE SERVICIO---

CREATE TABLE ordenes_servicio (
	`id`           		INT(11) NOT NULL AUTO_INCREMENT,
	`evento_id`          INT(11) NOT NULL,
	`nombre`             VARCHAR(200) NOT NULL,
	`fecha`              DATETIME NOT NULL,
	`garantia`           VARCHAR(250) NULL DEFAULT NULL,
	`lugar`              VARCHAR(200) NULL DEFAULT NULL,
	`montaje`            VARCHAR(200) NULL DEFAULT NULL,
	`nota`               VARCHAR(200) NULL DEFAULT NULL,
	`tipo_formato`       VARCHAR(200) NULL DEFAULT NULL,
	`canapes`            TEXT NULL DEFAULT NULL,
	`entrada`            TEXT NULL DEFAULT NULL,
	`fuerte`             TEXT NULL DEFAULT NULL,
	`postre`             TEXT NULL DEFAULT NULL,
	`bebidas`            TEXT NULL DEFAULT NULL,
	`aguas_frescas`      TEXT NULL DEFAULT NULL,
	`cocteleria`         TEXT NULL DEFAULT NULL,
	`mezcladores`        TEXT NULL DEFAULT NULL,
	`detalle_montaje`    TEXT NULL DEFAULT NULL,
	`observaciones`      TEXT NULL DEFAULT NULL,
	CONSTRAINT `pk_orden_servicio` 				PRIMARY KEY(`id`),
	CONSTRAINT `FK_ordenes_servicio_eventos` 	FOREIGN KEY(`evento_id`)
   REFERENCES `eventos`(`id`) 					ON DELETE CASCADE
) ENGINE=InnoDB;

-- CAMPOS ORDENES---------
CREATE TABLE campos_ordenes (
	`id`     		INT(11) NOT NULL AUTO_INCREMENT,
	`orden_id`     INT(11) NOT NULL,
	`tag`          VARCHAR(200) NULL DEFAULT NULL,
	`content`      TEXT NULL DEFAULT NULL,
	CONSTRAINT `pk_campo_orden` 			PRIMARY KEY(`id`),
	CONSTRAINT `fk_orden_servicio`		FOREIGN KEY(`orden_id`)
	REFERENCES `ordenes_servicio`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- CREATE TABLE PORCENTAJES -----

CREATE TABLE porcentajes (
	`id`		INT(11) NOT NULL AUTO_INCREMENT,
	`nombre` VARCHAR(100) NOT NULL,
	`valor`	FLOAT(11,2) NOT NULL,
	CONSTRAINT `pk_porcentaje` PRIMARY KEY(`id`)
) ENGINE=InnoDB;

-- VALIDACIONES RENTA -------

CREATE TABLE validaciones_renta (
	`id`					INT(11) NOT NULL AUTO_INCREMENT,
	`cliente_id`		INT(11) NOT NULL,
	`evento_id` 		INT NOT NULL,
	`precio_renta_id` INT(11) NOT NULL,
	`usuario_id` 		INT(11) NOT NULL,
	CONSTRAINT `pk_validacion_renta` PRIMARY KEY(`id`),
	CONSTRAINT `fk_validacion_cliente` FOREIGN KEY(`cliente_id`)
	REFERENCES `clientes`(`id`),
	CONSTRAINT `fk_validacion_evento` FOREIGN KEY(`evento_id`)
	REFERENCES `precios_renta`(`id_precio`),
	CONSTRAINT `fk_validacion_usuario` FOREIGN KEY(`usuario_id`)
	REFERENCES `usuarios`(`id_usuario`)
) ENGINE=InnoDB;

-- PROVEEDORES ----------

CREATE TABLE proveedores (
	`id`			INT(11) NOT NULL AUTO_INCREMENT,
	`nombre`		VARCHAR(200) NOT NULL UNIQUE,
	`razon_social`	VARCHAR(200) NOT NULL,
	`direccion` 	VARCHAR(200) NOT NULL,
	`telefono`		VARCHAR(200) NULL,
	`email`			VARCHAR(200) NULL,
	CONSTRAINT `pk_proveedor` PRIMARY KEY(`id`)
) ENGINE=InnoDB;