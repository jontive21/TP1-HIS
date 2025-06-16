-- schema.sql

-- Elimina tablas si ya existen (opcional)
DROP TABLE IF EXISTS signos_vitales;
DROP TABLE IF EXISTS medicamentos;
DROP TABLE IF EXISTS estudios;
DROP TABLE IF EXISTS altas;
DROP TABLE IF EXISTS cancelaciones_admision;
DROP TABLE IF EXISTS evaluaciones_medicas;
DROP TABLE IF EXISTS evaluaciones_enfermeria;
DROP TABLE IF EXISTS admisiones;
DROP TABLE IF EXISTS camas;
DROP TABLE IF EXISTS habitaciones;
DROP TABLE IF EXISTS alas;
DROP TABLE IF EXISTS pacientes;
DROP TABLE IF EXISTS usuarios;

-- Tabla: usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin','medico','enfermero','administrativo') DEFAULT 'administrativo',
    estado ENUM('activo','inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla: alas
CREATE TABLE alas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado ENUM('activa','inactiva') DEFAULT 'activa'
);

-- Tabla: habitaciones
CREATE TABLE habitaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10) NOT NULL,
    ala_id INT NOT NULL,
    tipo_habitacion ENUM('individual','doble') NOT NULL,
    estado ENUM('disponible','ocupada','mantenimiento') DEFAULT 'disponible',
    FOREIGN KEY (ala_id) REFERENCES alas(id)
);

-- Tabla: camas
CREATE TABLE camas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_cama INT NOT NULL,
    habitacion_id INT NOT NULL,
    estado ENUM('libre','ocupada','higienizando','mantenimiento') DEFAULT 'libre',
    fecha_ultimo_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id)
);

-- Tabla: pacientes
CREATE TABLE pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo ENUM('M','F','X') NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(150),
    direccion TEXT,
    contacto_emergencia_nombre VARCHAR(200),
    contacto_emergencia_telefono VARCHAR(20),
    contacto_emergencia_relacion VARCHAR(100),
    obra_social VARCHAR(150),
    numero_afiliado VARCHAR(100),
    alergias TEXT,
    antecedentes_medicos TEXT,
    medicamentos_habituales TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla: admisiones
CREATE TABLE admisiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    cama_id INT NOT NULL,
    medico_responsable_id INT NOT NULL,
    fecha_ingreso DATETIME NOT NULL,
    motivo_internacion TEXT NOT NULL,
    diagnostico_presuntivo TEXT,
    estado ENUM('activa','alta','cancelada') DEFAULT 'activa',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion INT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (cama_id) REFERENCES camas(id),
    FOREIGN KEY (medico_responsable_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_creacion) REFERENCES usuarios(id)
);

-- Tabla: cancelaciones_admision
CREATE TABLE cancelaciones_admision (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admision_id INT NOT NULL,
    motivo_cancelacion TEXT NOT NULL,
    usuario_cancela INT NOT NULL,
    fecha_cancelacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (admision_id) REFERENCES admisiones(id),
    FOREIGN KEY (usuario_cancela) REFERENCES usuarios(id)
);

-- Tabla: altas
CREATE TABLE altas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admision_id INT NOT NULL,
    medico_id INT NOT NULL,
    fecha_alta DATETIME NOT NULL,
    tipo_alta ENUM('medica','voluntaria','derivacion','obito') NOT NULL,
    diagnostico_final TEXT,
    instrucciones_alta TEXT,
    medicacion_domicilio TEXT,
    seguimiento_requerido TEXT,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admision_id) REFERENCES admisiones(id),
    FOREIGN KEY (medico_id) REFERENCES usuarios(id)
);

-- Tabla: evaluaciones_enfermeria
CREATE TABLE evaluaciones_enfermeria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admision_id INT NOT NULL,
    enfermero_id INT NOT NULL,
    fecha_evaluacion DATETIME NOT NULL,
    signos_vitales LONGTEXT,
    estado_general TEXT,
    observaciones TEXT,
    plan_cuidados TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admision_id) REFERENCES admisiones(id),
    FOREIGN KEY (enfermero_id) REFERENCES usuarios(id)
);

-- Tabla: signos_vitales
CREATE TABLE signos_vitales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admision_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha_registro DATETIME NOT NULL,
    presion_sistolica DECIMAL(5,2),
    presion_diastolica DECIMAL(5,2),
    frecuencia_cardiaca INT,
    frecuencia_respiratoria INT,
    temperatura DECIMAL(4,2),
    saturacion_oxigeno DECIMAL(5,2),
    observaciones TEXT,
    FOREIGN KEY (admision_id) REFERENCES admisiones(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla: evaluaciones_medicas
CREATE TABLE evaluaciones_medicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admision_id INT NOT NULL,
    medico_id INT NOT NULL,
    fecha_evaluacion DATETIME NOT NULL,
    diagnostico TEXT,
    plan_tratamiento TEXT,
    medicamentos_prescritos TEXT,
    estudios_solicitados TEXT,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admision_id) REFERENCES admisiones(id),
    FOREIGN KEY (medico_id) REFERENCES usuarios(id)
);

-- Tabla: medicamentos
CREATE TABLE medicamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admision_id INT NOT NULL,
    medico_prescriptor INT NOT NULL,
    nombre_medicamento VARCHAR(200) NOT NULL,
    dosis VARCHAR(100),
    frecuencia VARCHAR(100),
    via_administracion VARCHAR(50),
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME,
    estado ENUM('activo','suspendido','completado') DEFAULT 'activo',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admision_id) REFERENCES admisiones(id),
    FOREIGN KEY (medico_prescriptor) REFERENCES usuarios(id)
);

-- Tabla: estudios
CREATE TABLE estudios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admision_id INT NOT NULL,
    medico_solicitante INT NOT NULL,
    tipo_estudio VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_solicitud DATETIME NOT NULL,
    fecha_realizacion DATETIME,
    resultados TEXT,
    estado ENUM('solicitado','en_proceso','completado','cancelado') DEFAULT 'solicitado',
    urgente BOOLEAN DEFAULT FALSE,
    observaciones TEXT,
    FOREIGN KEY (admision_id) REFERENCES admisiones(id),
    FOREIGN KEY (medico_solicitante) REFERENCES usuarios(id)
);

-- Insertar usuarios de prueba
INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES
('Admin', 'Prueba', 'admin@example.com', '$2a$10$zxCU9.xIwZqj6LkGJf8wCeQ7YrRvK7tBpA7NnWZxHhZPb55T2', 'admin'),
('Medico', 'Prueba', 'medico@example.com', '$2a$10$zxCU9.xIwZqj6LkGJf8wCeQ7YrRvK7tBpA7NnWZxHhZPb55T2', 'medico'),
('Enfermera', 'Prueba', 'enfermera@example.com', '$2a$10$zxCU9.xIwZqj6LkGJf8wCeQ7YrRvK7tBpA7NnWZxHhZPb55T2', 'enfermero'),
('Administrativo', 'Prueba', 'administrativo@example.com', '$2a$10$zxCU9.xIwZqj6LkGJf8wCeQ7YrRvK7tBpA7NnWZxHhZPb55T2', 'administrativo');

-- Insertar alas por defecto
INSERT INTO alas (nombre, descripcion, estado) VALUES
('Medicina', 'Ala de medicina interna', 'activa'),
('Cirugía', 'Ala de cirugía general', 'activa'),
('UTI', 'Unidad de terapia intensiva', 'activa');