
--TABLAS 08/03/2019--

-----------------------PRECIO RENTA -----------------------

CREATE TABLE precios_renta (
	`id_precio`       INT(11) NOT NULL AUTO_INCREMENT,
	`id_tipo_evento`  INT(11) NULL DEFAULT NULL,
	`id_lugar`        INT(11) NULL DEFAULT NULL,
	`precio_alta`     FLOAT NULL DEFAULT NULL,
	`precio_baja`     FLOAT NULL DEFAULT NULL,
	PRIMARY KEY(`id_precio`),
	INDEX `FK__tipo_eventos`(`id_tipo_evento`),
	INDEX `FK__lugares`(`id_lugar`),
	CONSTRAINT `FK__lugares` FOREIGN KEY(`id_lugar`) REFERENCES `lugares`(`id_lugar`)
   ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT `FK__tipo_eventos` FOREIGN KEY(`id_tipo_evento`)
   REFERENCES `tipo_eventos`(`id_tipo_evento`)
   ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-----------------------COTIZACION RENTA-------------------

CREATE TABLE cot_renta (
	`id_cot`       INT(11) NOT NULL AUTO_INCREMENT,
	`cliente`      VARCHAR(200) NOT NULL,
	`telefono`     VARCHAR(200) NOT NULL,
	`email`        VARCHAR(200) NULL DEFAULT NULL,
	`pax`          INT(11) UNSIGNED NULL DEFAULT NULL,
	`tipo_evento`  INT(11) NULL DEFAULT NULL,
	`lugar`        INT(11) UNSIGNED NULL DEFAULT NULL,
	`fecha_inicio` DATETIME NULL DEFAULT NULL,
	`fecha_final`  DATETIME NULL DEFAULT NULL,
	PRIMARY KEY(`id_cot`)
) ENGINE=InnoDB;

-----------------------DETALLE USUARIO-------------------

CREATE TABLE detalle_usuario (
	`id_detalle`   INT(11) NOT NULL AUTO_INCREMENT,
	`id_usuario`   INT(11) NOT NULL,
	`nombre`       VARCHAR(50) NOT NULL,
	`apellidos`    VARCHAR(50) NULL DEFAULT NULL,
	`correo`       VARCHAR(50) NULL DEFAULT NULL,
	`telefono`     VARCHAR(50) NULL DEFAULT NULL,
	`depto`        VARCHAR(100) NULL DEFAULT NULL,
	PRIMARY KEY(`id_detalle`),
	UNIQUE INDEX `id_usuario`(`id_usuario`),
	CONSTRAINT `FK__usuarios` FOREIGN KEY(`id_usuario`) REFERENCES `usuarios`(`id_usuario`)
   ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

---------------------LUGARES ------------------------------

CREATE TABLE lugares (
	`id_lugar`  INT(11) NOT NULL AUTO_INCREMENT,
	`lugar`     VARCHAR(200) NULL DEFAULT NULL,
	PRIMARY KEY(`id_lugar`)
) ENGINE=InnoDB;

--------------------- USUARIOS ----------------------------

CREATE TABLE usuarios (
	`id_usuario`   INT(11) NOT NULL AUTO_INCREMENT,
	`username`     VARCHAR(100) NOT NULL,
	`pass`         VARCHAR(100) NULL DEFAULT NULL,
	`nivel`        VARCHAR(200) NULL DEFAULT NULL,
	`estado`       INT(11) NULL DEFAULT '0',
	PRIMARY KEY(`id_usuario`),
	UNIQUE INDEX `username`(`username`)
) ENGINE=InnoDB;

-------------------------DETALLE USUARIO------------------------

CREATE TABLE detalle_usuario (
	`id_detalle`   INT(11) NOT NULL AUTO_INCREMENT,
	`id_usuario`   INT(11) NOT NULL,
	`nombre`       VARCHAR(50) NOT NULL,
	`apellidos`    VARCHAR(50) NULL DEFAULT NULL,
	`correo`       VARCHAR(50) NULL DEFAULT NULL,
	`telefono`     VARCHAR(50) NULL DEFAULT NULL,
	`depto`        VARCHAR(100) NULL DEFAULT NULL,
	PRIMARY KEY(`id_detalle`),
	UNIQUE INDEX `id_usuario`(`id_usuario`),
	CONSTRAINT `FK__usuarios` FOREIGN KEY(`id_usuario`) REFERENCES `usuarios`(`id_usuario`)
   ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-------------------------EVENTOS------------------------------

CREATE TABLE eventos (
	`id_evento`    INT(11) NOT NULL AUTO_INCREMENT,
	`title`        VARCHAR(200) NOT NULL,
	`evento`       VARCHAR(200) NULL DEFAULT NULL,
	`folio`        VARCHAR(200) NOT NULL,
	`contacto`     VARCHAR(200) NOT NULL,
	`cord_resp`    VARCHAR(200) NOT NULL,
	`cord_apoyo`   VARCHAR(200) NULL DEFAULT NULL,
	`description`  TEXT NULL DEFAULT NULL,
	`id_lugar`     INT(11) NULL DEFAULT NULL,
	`start`        DATETIME NULL DEFAULT NULL,
	`end`          DATETIME NULL DEFAULT NULL,
	`personas`     INT(11) NULL DEFAULT NULL,
	`categoria`    VARCHAR(50) NULL DEFAULT NULL,
	`color`        VARCHAR(100) NULL DEFAULT NULL,
	`id_usuario`   INT(11) NULL DEFAULT NULL,
	PRIMARY KEY(`id_evento`),
	INDEX `FK_eventos_lugares`(`id_lugar`),
	CONSTRAINT `FK_eventos_lugares` FOREIGN KEY(`id_lugar`) REFERENCES `lugares`(`id_lugar`)
   ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

--------------------------ORDENES----------------------------
CREATE TABLE campos_ordenes
(
	`id_campo`     INT(11) NOT NULL AUTO_INCREMENT,
	`id_orden`     INT(11) NOT NULL,
	`tag`          VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`content`      TEXT NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	PRIMARY KEY(`id_campo`),
	INDEX `id_orden`(`id_orden`)
) ENGINE=InnoDB;

-------------------------- MENUS-------------------------------
use banquetes_lm;

CREATE TABLE menus (
   `id`                INT NOT NULL AUTO_INCREMENT,
   `nombre`            VARCHAR(200) NOT NULL,
   `precio_unitario`   FLOAT(11,2) NOT NULL,
   `detalle`           TEXT,
   CONSTRAINT pk_menu PRIMARY KEY(id)
) ENGINE=InnoDB;

-------------------------- COTIZACIONES-------------------------

CREATE TABLE cotizaciones (
   `id`            INT(11) NOT NULL AUTO_INCREMENT,
   `menu_id`		 INT(11) NOT NULL,
   `evento_id`		 INT(11) NOT NULL,
   `costo_total`	 FLOAT(11,2),
   `fecha` 			 DATE NOT NULL,
   CONSTRAINT pk_cotizacion PRIMARY KEY(id),
   CONSTRAINT fk_cotizacion_menu  FOREIGN KEY(menu_id) REFERENCES menus(id),
   CONSTRAINT fk_cotizacion_evento FOREIGN KEY(evento_id) REFERENCES eventos(id_evento)
) ENGINE=InnoDB;

-------------------------ORDENES DE SERVICIO----------------------

CREATE TABLE ordenes_servicio (
	`id_orden`           INT(11) NOT NULL AUTO_INCREMENT,
	`id_evento`          INT(11) NOT NULL,
	`fecha`              DATETIME NOT NULL,
	`orden`              VARCHAR(200) NOT NULL,
	`garantia`           VARCHAR(250) NULL DEFAULT NULL,
	`lugar`              VARCHAR(200) NULL DEFAULT NULL,
	`montaje`            VARCHAR(200) NULL DEFAULT NULL,
	`nota`               VARCHAR(200) NULL DEFAULT NULL,
	`canapes`            TEXT NULL DEFAULT NULL,
	`entrada`            TEXT NULL DEFAULT NULL,
	`fuerte`             TEXT NULL DEFAULT NULL,
	`postre`             TEXT NULL DEFAULT NULL,
	`bebidas`            TEXT NULL DEFAULT NULL,
	`cocteleria`         TEXT NULL DEFAULT NULL,
	`mezcladores`        TEXT NULL DEFAULT NULL,
	`detalle_montaje`    TEXT NULL DEFAULT NULL,
	`ama_llaves`         TEXT NULL DEFAULT NULL,
	`chief_steward`      TEXT NULL DEFAULT NULL,
	`mantenimiento`      TEXT NULL DEFAULT NULL,
	`seguridad`          TEXT NULL DEFAULT NULL,
	`proveedores`        TEXT NULL DEFAULT NULL,
	`recursos_humanos`   TEXT NULL DEFAULT NULL,
	`contabilidad`       TEXT NULL DEFAULT NULL,
	`observaciones`      TEXT NULL DEFAULT NULL,
	`tipo_formato`       VARCHAR(200) NULL DEFAULT NULL,
	`aguas_frescas`      TEXT NULL DEFAULT NULL,
	PRIMARY KEY(`id_orden`),
	INDEX `FK_ordenes_servicio_eventos`(`id_evento`),
	CONSTRAINT `FK_ordenes_servicio_eventos` FOREIGN KEY(`id_evento`)
   REFERENCES `eventos`(`id_evento`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-------------------------------LOGISTICA --------------------------

CREATE TABLE `sub_evento` (
	`id_sub_evento`   INT(11) NOT NULL AUTO_INCREMENT,
	`id_evento`       INT(11) NOT NULL,
	`start`           DATETIME NULL DEFAULT NULL,
	`end`             DATETIME NULL DEFAULT NULL,
	`title`           VARCHAR(200) NULL DEFAULT NULL,
	`lugar`           VARCHAR(200) NULL DEFAULT NULL,
	PRIMARY KEY(`id_sub_evento`),
	INDEX `FK_sub_evento_eventos`(`id_evento`),
	CONSTRAINT `FK_sub_evento_eventos` FOREIGN KEY(`id_evento`) REFERENCES `eventos`(`id_evento`)
   ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;