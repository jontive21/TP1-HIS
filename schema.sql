-- Schema Simple para TP1-HIS
-- Solo las tablas básicas necesarias
-- Tabla de Pacientes
CREATE TABLE pacientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dni VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo ENUM('M','F') NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    
    -- Contacto de emergencia (obligatorio)
    contacto_emergencia_nombre VARCHAR(100) NOT NULL,
    contacto_emergencia_telefono VARCHAR(20) NOT NULL,
    contacto_emergencia_relacion VARCHAR(50) NOT NULL,
    
    -- Obra social
    obra_social VARCHAR(100),
    numero_afiliado VARCHAR(50),
    
    -- Información médica básica
    alergias TEXT,
    medicamentos TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tabla de Habitaciones
CREATE TABLE habitaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(10) NOT NULL,
    ala VARCHAR(50) NOT NULL,
    capacidad INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tabla de Camas
CREATE TABLE camas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(10) NOT NULL,
    habitacion_id INT NOT NULL,
    estado ENUM('libre','ocupada','mantenimiento') DEFAULT 'libre',
    higienizada BOOLEAN DEFAULT FALSE,
    sexo_ocupante ENUM('M','F') DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id)
);
-- Tabla de Admisiones
CREATE TABLE admisiones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    cama_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT NOT NULL,
    medico_derivante VARCHAR(100),
    estado ENUM('activa','cancelada','finalizada') DEFAULT 'activa',
    desde_guardia BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (cama_id) REFERENCES camas(id)
);
-- Datos de ejemplo
INSERT INTO habitaciones (numero, ala, capacidad) VALUES
('101', 'Norte', 1),
('102', 'Norte', 2),
('201', 'Sur', 1),
('202', 'Sur', 2);
INSERT INTO camas (numero, habitacion_id, estado, higienizada) VALUES
('1', 1, 'libre', TRUE),
('1', 2, 'libre', TRUE),
('2', 2, 'libre', TRUE),
('1', 3, 'libre', TRUE),
('1', 4, 'libre', TRUE),
('2', 4, 'libre', TRUE);