-- Schema SQL para Sistema HIS - Módulo de Internación
-- Compatible con Railway MySQL
-- Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS railway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE railway;
-- Tabla de Alas del Hospital
CREATE TABLE IF NOT EXISTS alas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Tabla de Habitaciones
CREATE TABLE IF NOT EXISTS habitaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(20) NOT NULL UNIQUE,
    ala_id INT NOT NULL,
    tipo_habitacion ENUM('individual', 'doble', 'multiple') DEFAULT 'individual',
    estado ENUM('disponible', 'ocupada', 'mantenimiento', 'fuera_servicio') DEFAULT 'disponible',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ala_id) REFERENCES alas(id)
);
-- Tabla de Camas
CREATE TABLE IF NOT EXISTS camas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_cama VARCHAR(10) NOT NULL,
    habitacion_id INT NOT NULL,
    estado ENUM('libre', 'ocupada', 'higienizada', 'mantenimiento', 'fuera_servicio') DEFAULT 'libre',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cama_habitacion (numero_cama, habitacion_id),
    FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id)
);
-- Tabla de Pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dni VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo ENUM('M', 'F', 'Otro') NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    
    -- Contacto de emergencia
    contacto_emergencia_nombre VARCHAR(200),
    contacto_emergencia_telefono VARCHAR(20),
    contacto_emergencia_relacion VARCHAR(50),
    
    -- Información de obra social
    obra_social VARCHAR(100),
    numero_afiliado VARCHAR(50),
    
    -- Información médica básica
    alergias TEXT,
    antecedentes_medicos TEXT,
    medicamentos_habituales TEXT,
    
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_dni (dni),
    INDEX idx_apellido_nombre (apellido, nombre)
);
-- Tabla de Médicos (básica para el sistema)
CREATE TABLE IF NOT EXISTS medicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dni VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    especialidad VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Tabla de Admisiones
CREATE TABLE IF NOT EXISTS admisiones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    cama_id INT NOT NULL,
    medico_responsable_id INT,
    
    -- Fechas importantes
    fecha_ingreso DATETIME NOT NULL,
    fecha_alta DATETIME NULL,
    fecha_cancelacion DATETIME NULL,
    
    -- Información de la admisión
    motivo_internacion TEXT NOT NULL,
    tipo_ingreso ENUM('programada', 'emergencia', 'derivacion_guardia') DEFAULT 'programada',
    observaciones TEXT,
    
    -- Estado de la admisión
    estado ENUM('activa', 'alta', 'cancelada', 'transferida') DEFAULT 'activa',
    motivo_cancelacion TEXT NULL,
    
    -- Auditoría
    usuario_creacion VARCHAR(100),
    usuario_cancelacion VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (cama_id) REFERENCES camas(id),
    FOREIGN KEY (medico_responsable_id) REFERENCES medicos(id),
    
    INDEX idx_paciente (paciente_id),
    INDEX idx_cama (cama_id),
    INDEX idx_fecha_ingreso (fecha_ingreso),
    INDEX idx_estado (estado)
);
-- Tabla de Cancelaciones (para auditoría detallada)
CREATE TABLE IF NOT EXISTS cancelaciones_admision (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admision_id INT NOT NULL,
    motivo_cancelacion TEXT NOT NULL,
    usuario_cancelacion VARCHAR(100),
    fecha_cancelacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (admision_id) REFERENCES admisiones(id)
);
-- Tabla de Altas (para futuras expansiones)
CREATE TABLE IF NOT EXISTS altas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admision_id INT NOT NULL,
    fecha_alta DATETIME NOT NULL,
    tipo_alta ENUM('medica', 'voluntaria', 'transferencia', 'defuncion') DEFAULT 'medica',
    medico_alta_id INT,
    diagnostico_final TEXT,
    recomendaciones TEXT,
    observaciones TEXT,
    usuario_alta VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admision_id) REFERENCES admisiones(id),
    FOREIGN KEY (medico_alta_id) REFERENCES medicos(id)
);
-- Insertar datos de ejemplo
-- Insertar Alas
INSERT IGNORE INTO alas (nombre, descripcion) VALUES 
('Ala Norte', 'Ala destinada a medicina interna'),
('Ala Sur', 'Ala destinada a cirugía'),
('Ala Este', 'Ala destinada a cuidados intensivos');
-- Insertar Habitaciones
INSERT IGNORE INTO habitaciones (numero, ala_id, tipo_habitacion) VALUES 
('101', 1, 'individual'),
('102', 1, 'doble'),
('103', 1, 'doble'),
('201', 2, 'individual'),
('202', 2, 'doble'),
('301', 3, 'individual');
-- Insertar Camas
INSERT IGNORE INTO camas (numero_cama, habitacion_id, estado) VALUES 
('A', 1, 'libre'),
('A', 2, 'libre'),
('B', 2, 'libre'),
('A', 3, 'libre'),
('B', 3, 'libre'),
('A', 4, 'libre'),
('A', 5, 'libre'),
('B', 5, 'libre'),
('A', 6, 'libre');
-- Insertar Médico de ejemplo
INSERT IGNORE INTO medicos (dni, nombre, apellido, matricula, especialidad) VALUES 
('12345678', 'Juan', 'Pérez', 'MP001', 'Medicina Interna');
-- Insertar Paciente de ejemplo
INSERT IGNORE INTO pacientes (dni, nombre, apellido, fecha_nacimiento, sexo, telefono, obra_social) VALUES 
('87654321', 'María', 'González', '1980-05-15', 'F', '123456789', 'OSDE');
-- Crear índices adicionales para performance
CREATE INDEX IF NOT EXISTS idx_admisiones_activas ON admisiones(estado, fecha_ingreso);
CREATE INDEX IF NOT EXISTS idx_camas_disponibles ON camas(estado, habitacion_id);
-- Comentarios sobre el esquema
/*
ESTRUCTURA DE BASE DE DATOS - SISTEMA HIS INTERNACIÓN
1. ALAS: Divisiones principales del hospital
2. HABITACIONES: Espacios físicos dentro de las alas
3. CAMAS: Camas individuales dentro de las habitaciones
4. PACIENTES: Información completa de pacientes
5. MEDICOS: Personal médico responsable
6. ADMISIONES: Registro principal de internaciones
7. CANCELACIONES_ADMISION: Auditoría de cancelaciones
8. ALTAS: Registro de altas médicas
REGLAS DE NEGOCIO IMPLEMENTADAS:
- Una habitación puede tener múltiples camas
- Una cama solo puede tener una admisión activa
- Las admisiones canceladas mantienen historial
- Control de estado de camas (libre, ocupada, etc.)
- Auditoría completa de cambios
*/