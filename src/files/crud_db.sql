CREATE DATABASE crud;

use crud;
drop database crud;
CREATE TABLE `personas` (
  `id_persona` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `tipo_identificacion` varchar(100) DEFAULT NULL,
  `nuip` int DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `clave` varchar(500) DEFAULT NULL,
  `salario` decimal(10,2) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_registro` date DEFAULT (curdate()),
  `imagen` longblob,
  PRIMARY KEY (`id_persona`)
) 

select * from personas;