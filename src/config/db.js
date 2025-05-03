// Se importar la version de mysql2 que trabaja con promesas (mejor utilidad para async/await)
const mysql = require("mysql2/promise");

// Importar dotenv para manejar variables de entorno desde un archivo .env
const dotenv = require("dotenv"); //dotenv permite leer valores como usuario, contraseña o nombre de base de datos desde un .env y asi evitar poner informacion 
const { createPool } = require("mysql2");


dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;