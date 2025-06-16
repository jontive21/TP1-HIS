// Configuración simple de base de datos - FUNCIONA LOCAL Y RAILWAY
const mysql = require('mysql2/promise');

// Detectar si estamos en Railway o en local
const isRailway = process.env.MYSQLHOST || process.env.RAILWAY_ENVIRONMENT;

let pool;

if (isRailway) {
    // Configuración para Railway
    pool = mysql.createPool({
        host: process.env.MYSQLHOST || 'mysql.railway.internal',
        port: process.env.MYSQLPORT || 3306,
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD || '',
        database: process.env.MYSQLDATABASE || 'railway',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    
    console.log('🌐 Configuración: Railway MySQL');
    
    // Probar conexión a Railway
    pool.getConnection()
        .then(connection => {
            console.log('✅ Conectado a MySQL de Railway');
            connection.release();
        })
        .catch(error => {
            console.error('❌ Error de conexión a Railway:', error.message);
        });
} else {
    // Para desarrollo local - SIN BASE DE DATOS REAL
    console.log('💻 Configuración: Desarrollo local (datos simulados)');
    
    // Pool falso para que funcione sin base de datos
    pool = {
        query: async (sql, params) => {
            console.log('📝 Query simulada:', sql.substring(0, 50) + '...');
            
            // Simular respuestas según el tipo de query
            if (sql.includes('SELECT') && sql.includes('admisiones')) {
                return [[
                    {
                        id: 1,
                        fecha_admision: new Date(),
                        motivo_internacion: 'Ejemplo de admisión local',
                        estado: 'activa',
                        nombre: 'Juan',
                        apellido: 'Pérez',
                        dni: '12345678',
                        habitacion: '101',
                        cama: '1'
                    }
                ]];
            }
            
            if (sql.includes('SELECT') && sql.includes('pacientes')) {
                return [[
                    {
                        id: 1,
                        dni: '12345678',
                        nombre: 'Juan',
                        apellido: 'Pérez',
                        fecha_nacimiento: '1990-01-01',
                        sexo: 'M',
                        telefono: '123456789',
                        obra_social: 'OSDE'
                    }
                ]];
            }
            
            if (sql.includes('SELECT') && sql.includes('camas')) {
                return [[
                    {
                        id: 1,
                        cama_numero: '1',
                        habitacion_numero: '101',
                        ala: 'Norte',
                        estado: 'libre',
                        higienizada: true,
                        sexo_ocupante: null,
                        paciente: null
                    },
                    {
                        id: 2,
                        cama_numero: '2',
                        habitacion_numero: '102',
                        ala: 'Norte',
                        estado: 'ocupada',
                        higienizada: true,
                        sexo_ocupante: 'M',
                        paciente: 'Juan Pérez'
                    }
                ]];
            }
            
            if (sql.includes('INSERT')) {
                console.log('✅ Simulando inserción exitosa');
                return [{ insertId: 1, affectedRows: 1 }];
            }
            
            if (sql.includes('UPDATE')) {
                console.log('✅ Simulando actualización exitosa');
                return [{ affectedRows: 1 }];
            }
            
            return [[]]; // Por defecto, array vacío
        }
    };
    
    console.log('ℹ️  En desarrollo local - Las páginas funcionarán con datos de ejemplo');
}

module.exports = pool;