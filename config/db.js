require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Create the pacientes table if it doesn't exist
const createPacientesTable = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS pacientes (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                dni VARCHAR(15) UNIQUE NOT NULL,
                fecha_nacimiento DATE NOT NULL,
                sexo ENUM('M', 'F', 'X') NOT NULL,
                telefono VARCHAR(30),
                direccion VARCHAR(255),
                email VARCHAR(100),
                activo BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabla pacientes verificada o creada con éxito.');
    } catch (error) {
        console.error('Error al crear la tabla pacientes:', error);
    } finally {
        connection.release();
    }
};

// Create the admisiones table if it doesn't exist
const createAdmisionesTable = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS admisiones (
                id INT PRIMARY KEY AUTO_INCREMENT,
                paciente_id INT NOT NULL,
                cama_id INT,
                fecha_admision DATETIME NOT NULL,
                motivo_internacion VARCHAR(255),
                estado ENUM('activa', 'alta', 'cancelada') DEFAULT 'activa',
                fecha_alta DATETIME,
                FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
                FOREIGN KEY (cama_id) REFERENCES camas(id)
            );
        `);
        console.log('Tabla admisiones verificada o creada con éxito.');
    } catch (error) {
        console.error('Error al crear la tabla admisiones:', error);
    } finally {
        connection.release();
    }
};

// Create the evaluaciones table if it doesn't exist
const createEvaluacionesTable = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS evaluaciones (
                id INT PRIMARY KEY AUTO_INCREMENT,
                admision_id INT NOT NULL,
                usuario_id INT NOT NULL,
                tipo ENUM('medica', 'enfermeria') NOT NULL,
                fecha DATETIME NOT NULL,
                observaciones TEXT,
                FOREIGN KEY (admision_id) REFERENCES admisiones(id),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            );
        `);
        console.log('Tabla evaluaciones verificada o creada con éxito.');
    } catch (error) {
        console.error('Error al crear la tabla evaluaciones:', error);
    } finally {
        connection.release();
    }
};

// Tabla de pacientes
const createPacientesTableSQL = `
    CREATE TABLE IF NOT EXISTS pacientes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        dni VARCHAR(15) UNIQUE NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        sexo ENUM('M', 'F', 'X') NOT NULL,
        telefono VARCHAR(30),
        direccion VARCHAR(255),
        email VARCHAR(100),
        activo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Tabla de admisiones
const createAdmisionesTableSQL = `
    CREATE TABLE IF NOT EXISTS admisiones (
        id INT PRIMARY KEY AUTO_INCREMENT,
        paciente_id INT NOT NULL,
        cama_id INT,
        fecha_admision DATETIME NOT NULL,
        motivo_internacion VARCHAR(255),
        estado ENUM('activa', 'alta', 'cancelada') DEFAULT 'activa',
        fecha_alta DATETIME,
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
        FOREIGN KEY (cama_id) REFERENCES camas(id)
    );
`;

// Tabla de evaluaciones
const createEvaluacionesTableSQL = `
    CREATE TABLE IF NOT EXISTS evaluaciones (
        id INT PRIMARY KEY AUTO_INCREMENT,
        admision_id INT NOT NULL,
        usuario_id INT NOT NULL,
        tipo ENUM('medica', 'enfermeria') NOT NULL,
        fecha DATETIME NOT NULL,
        observaciones TEXT,
        FOREIGN KEY (admision_id) REFERENCES admisiones(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
`;

const createTables = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(createPacientesTableSQL);
        console.log('Tabla pacientes verificada o creada con éxito.');
        await connection.query(createAdmisionesTableSQL);
        console.log('Tabla admisiones verificada o creada con éxito.');
        await connection.query(createEvaluacionesTableSQL);
        console.log('Tabla evaluaciones verificada o creada con éxito.');
    } catch (error) {
        console.error('Error al crear las tablas:', error);
    } finally {
        connection.release();
    }
};

createTables();

// Query to count active admissions
const countActiveAdmisiones = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`SELECT COUNT(*) as count FROM admisiones WHERE estado = 'activa';`);
        return rows[0].count;
    } catch (error) {
        console.error('Error al contar admisiones activas:', error);
        return 0;
    } finally {
        connection.release();
    }
};

// Query to count free beds
const countFreeCamas = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`SELECT COUNT(*) as count FROM camas WHERE estado = 'libre';`);
        return rows[0].count;
    } catch (error) {
        console.error('Error al contar camas libres:', error);
        return 0;
    } finally {
        connection.release();
    }
};

// Query to get daily admission statistics
const getDailyAdmissionStats = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`
            SELECT DATE(fecha_admision) as dia, COUNT(*) as total FROM admisiones GROUP BY dia;
        `);
        return rows;
    } catch (error) {
        console.error('Error al obtener estadísticas diarias de admisiones:', error);
        return [];
    } finally {
        connection.release();
    }
};

module.exports = { pool, countActiveAdmisiones, countFreeCamas, getDailyAdmissionStats };