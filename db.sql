
CREATE DATABASE IF NOT EXISTS crud_backend;
use crud_backend;

CREATE TABLE IF NOT EXISTS personas (
id_persona INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100),
apellido VARCHAR(100),
tipo_identificacion VARCHAR(50),
nuip INT,
email VARCHAR(100),
clave VARCHAR(500),
salario DECIMAL(10,2),
activo BOOLEAN DEFAULT TRUE,
fecha_registro DATE DEFAULT (CURRENT_DATE),
imagen LONGBLOB
);

SELECT * FROM personas;

INSERT INTO personas (nombre, apellido, tipo_identificacion, nuip, email, clave, salario, activo, fecha_registro, imagen) 
VALUES ('Juan', 'Pérez', 'Cédula de Ciudadanía', 123456789, 'juan.perez@example.com', 'clave_encriptada', 3500.50, TRUE, '2025-04-25', NULL);
