-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-06-2025 a las 00:00:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `his_internacion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admisiones`
--

CREATE TABLE `admisiones` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `cama_id` int(11) NOT NULL,
  `medico_responsable_id` int(11) NOT NULL,
  `fecha_ingreso` datetime NOT NULL,
  `motivo_internacion` text NOT NULL,
  `diagnostico_presuntivo` text DEFAULT NULL,
  `estado` enum('activa','alta','cancelada') DEFAULT 'activa',
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario_creacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `admisiones`
--

INSERT INTO `admisiones` (`id`, `paciente_id`, `cama_id`, `medico_responsable_id`, `fecha_ingreso`, `motivo_internacion`, `diagnostico_presuntivo`, `estado`, `observaciones`, `fecha_creacion`, `usuario_creacion`) VALUES
(1, 1, 1, 2, '2025-06-03 14:30:00', 'Dolor precordial y disnea', 'Síndrome coronario agudo a descartar', 'activa', NULL, '2025-06-05 15:01:43', 1),
(2, 2, 3, 4, '2025-06-04 09:15:00', 'Dolor abdominal intenso', 'Apendicitis aguda', 'activa', NULL, '2025-06-05 15:01:43', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alas`
--

CREATE TABLE `alas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('activa','inactiva') DEFAULT 'activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `alas`
--

INSERT INTO `alas` (`id`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Ala Norte', 'Medicina General y Cardiología', 'activa'),
(2, 'Ala Sur', 'Cirugía y Traumatología', 'activa'),
(3, 'Ala Este', 'Pediatría y Ginecología', 'activa'),
(4, 'Ala Oeste', 'Cuidados Intensivos', 'activa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `altas`
--

CREATE TABLE `altas` (
  `id` int(11) NOT NULL,
  `admision_id` int(11) NOT NULL,
  `medico_id` int(11) NOT NULL,
  `fecha_alta` datetime NOT NULL,
  `tipo_alta` enum('medica','voluntaria','derivacion','obito') NOT NULL,
  `diagnostico_final` text DEFAULT NULL,
  `instrucciones_alta` text DEFAULT NULL,
  `medicacion_domicilio` text DEFAULT NULL,
  `seguimiento_requerido` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camas`
--

CREATE TABLE `camas` (
  `id` int(11) NOT NULL,
  `numero_cama` int(11) NOT NULL,
  `habitacion_id` int(11) NOT NULL,
  `estado` enum('libre','ocupada','higienizando','mantenimiento') DEFAULT 'libre',
  `fecha_ultimo_cambio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `camas`
--

INSERT INTO `camas` (`id`, `numero_cama`, `habitacion_id`, `estado`, `fecha_ultimo_cambio`) VALUES
(1, 1, 1, 'libre', '2025-06-05 15:01:43'),
(2, 1, 2, 'libre', '2025-06-05 15:01:43'),
(3, 2, 2, 'libre', '2025-06-05 15:01:43'),
(4, 1, 3, 'libre', '2025-06-05 15:01:43'),
(5, 2, 3, 'libre', '2025-06-05 15:01:43'),
(6, 1, 4, 'libre', '2025-06-05 15:01:43'),
(7, 1, 5, 'libre', '2025-06-05 15:01:43'),
(8, 2, 5, 'libre', '2025-06-05 15:01:43'),
(9, 1, 6, 'libre', '2025-06-05 15:01:43'),
(10, 1, 7, 'libre', '2025-06-05 15:01:43'),
(11, 2, 7, 'libre', '2025-06-05 15:01:43'),
(12, 1, 8, 'libre', '2025-06-05 15:01:43'),
(13, 1, 9, 'libre', '2025-06-05 15:01:43'),
(14, 1, 10, 'libre', '2025-06-05 15:01:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cancelaciones_admision`
--

CREATE TABLE `cancelaciones_admision` (
  `id` int(11) NOT NULL,
  `admision_id` int(11) NOT NULL,
  `motivo_cancelacion` text NOT NULL,
  `usuario_cancela` int(11) NOT NULL,
  `fecha_cancelacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudios`
--

CREATE TABLE `estudios` (
  `id` int(11) NOT NULL,
  `admision_id` int(11) NOT NULL,
  `medico_solicitante` int(11) NOT NULL,
  `tipo_estudio` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_solicitud` datetime NOT NULL,
  `fecha_realizacion` datetime DEFAULT NULL,
  `resultados` text DEFAULT NULL,
  `estado` enum('solicitado','en_proceso','completado','cancelado') DEFAULT 'solicitado',
  `urgente` tinyint(1) DEFAULT 0,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estudios`
--

INSERT INTO `estudios` (`id`, `admision_id`, `medico_solicitante`, `tipo_estudio`, `descripcion`, `fecha_solicitud`, `fecha_realizacion`, `resultados`, `estado`, `urgente`, `observaciones`) VALUES
(1, 1, 2, 'Electrocardiograma', 'ECG de 12 derivaciones', '2025-06-03 14:45:00', NULL, NULL, 'completado', 1, NULL),
(2, 1, 2, 'Enzimas cardíacas', 'Troponina, CK-MB', '2025-06-03 14:45:00', NULL, NULL, 'completado', 1, NULL),
(3, 2, 4, 'Ecografía abdominal', 'Evaluación de fosa ilíaca derecha', '2025-06-04 09:30:00', NULL, NULL, 'en_proceso', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_enfermeria`
--

CREATE TABLE `evaluaciones_enfermeria` (
  `id` int(11) NOT NULL,
  `admision_id` int(11) NOT NULL,
  `enfermero_id` int(11) NOT NULL,
  `fecha_evaluacion` datetime NOT NULL,
  `signos_vitales` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`signos_vitales`)),
  `estado_general` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `plan_cuidados` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_medicas`
--

CREATE TABLE `evaluaciones_medicas` (
  `id` int(11) NOT NULL,
  `admision_id` int(11) NOT NULL,
  `medico_id` int(11) NOT NULL,
  `fecha_evaluacion` datetime NOT NULL,
  `diagnostico` text DEFAULT NULL,
  `plan_tratamiento` text DEFAULT NULL,
  `medicamentos_prescritos` text DEFAULT NULL,
  `estudios_solicitados` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id` int(11) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `ala_id` int(11) NOT NULL,
  `tipo_habitacion` enum('individual','doble') NOT NULL,
  `estado` enum('disponible','ocupada','mantenimiento') DEFAULT 'disponible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`id`, `numero`, `ala_id`, `tipo_habitacion`, `estado`) VALUES
(1, '101', 1, 'individual', 'disponible'),
(2, '102', 1, 'doble', 'disponible'),
(3, '103', 1, 'doble', 'disponible'),
(4, '201', 2, 'individual', 'disponible'),
(5, '202', 2, 'doble', 'disponible'),
(6, '203', 2, 'individual', 'disponible'),
(7, '301', 3, 'doble', 'disponible'),
(8, '302', 3, 'individual', 'disponible'),
(9, '401', 4, 'individual', 'disponible'),
(10, '402', 4, 'individual', 'disponible');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos`
--

CREATE TABLE `medicamentos` (
  `id` int(11) NOT NULL,
  `admision_id` int(11) NOT NULL,
  `medico_prescriptor` int(11) NOT NULL,
  `nombre_medicamento` varchar(200) NOT NULL,
  `dosis` varchar(100) DEFAULT NULL,
  `frecuencia` varchar(100) DEFAULT NULL,
  `via_administracion` varchar(50) DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `estado` enum('activo','suspendido','completado') DEFAULT 'activo',
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicamentos`
--

INSERT INTO `medicamentos` (`id`, `admision_id`, `medico_prescriptor`, `nombre_medicamento`, `dosis`, `frecuencia`, `via_administracion`, `fecha_inicio`, `fecha_fin`, `estado`, `observaciones`, `fecha_creacion`) VALUES
(1, 1, 2, 'Aspirina', '100mg', 'Cada 24 horas', 'Oral', '2025-06-03 15:30:00', NULL, 'activo', NULL, '2025-06-05 15:01:43'),
(2, 1, 2, 'Atorvastatina', '20mg', 'Cada 24 horas', 'Oral', '2025-06-03 15:30:00', NULL, 'activo', NULL, '2025-06-05 15:01:43'),
(3, 2, 4, 'Ibuprofeno', '600mg', 'Cada 8 horas', 'Oral', '2025-06-04 10:30:00', NULL, 'activo', NULL, '2025-06-05 15:01:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo` enum('M','F','X') NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `contacto_emergencia_nombre` varchar(200) DEFAULT NULL,
  `contacto_emergencia_telefono` varchar(20) DEFAULT NULL,
  `contacto_emergencia_relacion` varchar(100) DEFAULT NULL,
  `obra_social` varchar(150) DEFAULT NULL,
  `numero_afiliado` varchar(100) DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `antecedentes_medicos` text DEFAULT NULL,
  `medicamentos_habituales` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `dni`, `nombre`, `apellido`, `fecha_nacimiento`, `sexo`, `telefono`, `email`, `direccion`, `contacto_emergencia_nombre`, `contacto_emergencia_telefono`, `contacto_emergencia_relacion`, `obra_social`, `numero_afiliado`, `alergias`, `antecedentes_medicos`, `medicamentos_habituales`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, '12345678', 'Pedro', 'Martínez', '1980-05-15', 'M', '011-4444-5555', 'pedro.martinez@email.com', 'Av. Corrientes 1234, CABA', 'María Martínez', '011-5555-6666', 'Esposa', 'OSDE', NULL, 'Penicilina', 'Hipertensión arterial', NULL, '2025-06-05 15:01:43', '2025-06-05 15:01:43'),
(2, '87654321', 'Laura', 'Fernández', '1992-12-03', 'F', '011-7777-8888', 'laura.fernandez@email.com', 'San Martín 567, La Plata', 'Carlos Fernández', '011-8888-9999', 'Padre', 'Swiss Medical', NULL, 'Ninguna conocida', 'Sin antecedentes relevantes', NULL, '2025-06-05 15:01:43', '2025-06-05 15:01:43'),
(3, '11111111', 'Roberto', 'García', '1965-08-22', 'M', '011-2222-3333', 'roberto.garcia@email.com', 'Belgrano 890, Quilmes', 'Elena García', '011-3333-4444', 'Hija', 'IOMA', NULL, 'Mariscos', 'Diabetes tipo 2, Colesterol alto', NULL, '2025-06-05 15:01:43', '2025-06-05 15:01:43'),
(4, '22222222', 'Silvia', 'Torres', '1988-03-10', 'F', '011-6666-7777', 'silvia.torres@email.com', 'Rivadavia 456, San Isidro', 'Miguel Torres', '011-7777-8888', 'Hermano', 'Medicus', NULL, 'Polen', 'Asma bronquial', NULL, '2025-06-05 15:01:43', '2025-06-05 15:01:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `signos_vitales`
--

CREATE TABLE `signos_vitales` (
  `id` int(11) NOT NULL,
  `admision_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_registro` datetime NOT NULL,
  `presion_sistolica` decimal(5,2) DEFAULT NULL,
  `presion_diastolica` decimal(5,2) DEFAULT NULL,
  `frecuencia_cardiaca` int(11) DEFAULT NULL,
  `frecuencia_respiratoria` int(11) DEFAULT NULL,
  `temperatura` decimal(4,2) DEFAULT NULL,
  `saturacion_oxigeno` decimal(5,2) DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `signos_vitales`
--

INSERT INTO `signos_vitales` (`id`, `admision_id`, `usuario_id`, `fecha_registro`, `presion_sistolica`, `presion_diastolica`, `frecuencia_cardiaca`, `frecuencia_respiratoria`, `temperatura`, `saturacion_oxigeno`, `observaciones`) VALUES
(1, 1, 3, '2025-06-03 15:00:00', 140.00, 90.00, 95, 22, 36.80, 98.00, NULL),
(2, 1, 3, '2025-06-03 21:00:00', 135.00, 85.00, 88, 20, 36.50, 99.00, NULL),
(3, 2, 5, '2025-06-04 10:00:00', 120.00, 70.00, 78, 18, 37.20, 98.50, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','medico','enfermero','administrativo') NOT NULL DEFAULT 'administrativo',
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `password`, `rol`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Admin', 'Sistema', 'admin@hospital.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'activo', '2025-06-05 15:01:42', '2025-06-05 15:01:42'),
(2, 'Dr. Juan', 'Pérez', 'medico@hospital.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'medico', 'activo', '2025-06-05 15:01:42', '2025-06-05 15:01:42'),
(3, 'Lic. María', 'González', 'enfermera@hospital.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'enfermero', 'activo', '2025-06-05 15:01:42', '2025-06-05 15:01:42'),
(4, 'Dr. Ana', 'López', 'ana.lopez@hospital.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'medico', 'activo', '2025-06-05 15:01:42', '2025-06-05 15:01:42'),
(5, 'Enf. Carlos', 'Ruiz', 'carlos.ruiz@hospital.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'enfermero', 'activo', '2025-06-05 15:01:42', '2025-06-05 15:01:42');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admisiones`
--
ALTER TABLE `admisiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `cama_id` (`cama_id`),
  ADD KEY `medico_responsable_id` (`medico_responsable_id`),
  ADD KEY `usuario_creacion` (`usuario_creacion`),
  ADD KEY `idx_fecha_ingreso` (`fecha_ingreso`),
  ADD KEY `idx_estado` (`estado`);

--
-- Indices de la tabla `alas`
--
ALTER TABLE `alas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `altas`
--
ALTER TABLE `altas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_admision_alta` (`admision_id`),
  ADD KEY `medico_id` (`medico_id`);

--
-- Indices de la tabla `camas`
--
ALTER TABLE `camas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_cama_habitacion` (`numero_cama`,`habitacion_id`),
  ADD KEY `habitacion_id` (`habitacion_id`);

--
-- Indices de la tabla `cancelaciones_admision`
--
ALTER TABLE `cancelaciones_admision`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admision_id` (`admision_id`),
  ADD KEY `usuario_cancela` (`usuario_cancela`);

--
-- Indices de la tabla `estudios`
--
ALTER TABLE `estudios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admision_id` (`admision_id`),
  ADD KEY `medico_solicitante` (`medico_solicitante`);

--
-- Indices de la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admision_id` (`admision_id`),
  ADD KEY `enfermero_id` (`enfermero_id`);

--
-- Indices de la tabla `evaluaciones_medicas`
--
ALTER TABLE `evaluaciones_medicas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admision_id` (`admision_id`),
  ADD KEY `medico_id` (`medico_id`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_habitacion_ala` (`numero`,`ala_id`),
  ADD KEY `ala_id` (`ala_id`);

--
-- Indices de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admision_id` (`admision_id`),
  ADD KEY `medico_prescriptor` (`medico_prescriptor`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD KEY `idx_dni` (`dni`),
  ADD KEY `idx_nombre_apellido` (`nombre`,`apellido`);

--
-- Indices de la tabla `signos_vitales`
--
ALTER TABLE `signos_vitales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admision_id` (`admision_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `idx_fecha_registro` (`fecha_registro`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_rol` (`rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admisiones`
--
ALTER TABLE `admisiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `alas`
--
ALTER TABLE `alas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `altas`
--
ALTER TABLE `altas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `camas`
--
ALTER TABLE `camas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `cancelaciones_admision`
--
ALTER TABLE `cancelaciones_admision`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estudios`
--
ALTER TABLE `estudios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evaluaciones_medicas`
--
ALTER TABLE `evaluaciones_medicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `signos_vitales`
--
ALTER TABLE `signos_vitales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `admisiones`
--
ALTER TABLE `admisiones`
  ADD CONSTRAINT `admisiones_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `admisiones_ibfk_2` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `admisiones_ibfk_3` FOREIGN KEY (`medico_responsable_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `admisiones_ibfk_4` FOREIGN KEY (`usuario_creacion`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `altas`
--
ALTER TABLE `altas`
  ADD CONSTRAINT `altas_ibfk_1` FOREIGN KEY (`admision_id`) REFERENCES `admisiones` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `altas_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `camas`
--
ALTER TABLE `camas`
  ADD CONSTRAINT `camas_ibfk_1` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `cancelaciones_admision`
--
ALTER TABLE `cancelaciones_admision`
  ADD CONSTRAINT `cancelaciones_admision_ibfk_1` FOREIGN KEY (`admision_id`) REFERENCES `admisiones` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cancelaciones_admision_ibfk_2` FOREIGN KEY (`usuario_cancela`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudios`
--
ALTER TABLE `estudios`
  ADD CONSTRAINT `estudios_ibfk_1` FOREIGN KEY (`admision_id`) REFERENCES `admisiones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_2` FOREIGN KEY (`medico_solicitante`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  ADD CONSTRAINT `evaluaciones_enfermeria_ibfk_1` FOREIGN KEY (`admision_id`) REFERENCES `admisiones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `evaluaciones_enfermeria_ibfk_2` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `evaluaciones_medicas`
--
ALTER TABLE `evaluaciones_medicas`
  ADD CONSTRAINT `evaluaciones_medicas_ibfk_1` FOREIGN KEY (`admision_id`) REFERENCES `admisiones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `evaluaciones_medicas_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `habitaciones_ibfk_1` FOREIGN KEY (`ala_id`) REFERENCES `alas` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD CONSTRAINT `medicamentos_ibfk_1` FOREIGN KEY (`admision_id`) REFERENCES `admisiones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `medicamentos_ibfk_2` FOREIGN KEY (`medico_prescriptor`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `signos_vitales`
--
ALTER TABLE `signos_vitales`
  ADD CONSTRAINT `signos_vitales_ibfk_1` FOREIGN KEY (`admision_id`) REFERENCES `admisiones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
