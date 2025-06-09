# Sistema HIS - Hospital Information System para Internación

## 📋 Descripción del Proyecto
Sistema de gestión hospitalaria para el manejo integral de internaciones, desarrollado como Práctico Integrador utilizando Node.js, Express y Pug.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- MySQL o MariaDB
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/jontive21/TP1-HIS.git
cd TP1-HIS
2. Instalar dependencias:
    npm install
3. Configurar la base de datos:
- Crear la base de datos ejecutando el script `database.sql`:
  ```
  mysql -u root -p < database.sql
  ```
- Crear un archivo `.env` con la siguiente configuración:
  ```
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=tu_contraseña
  DB_NAME=his_internacion
  SESSION_SECRET=clave_secreta_para_sesiones
  ```

4. Iniciar la aplicación:
    npm start

5. Acceder a la aplicación:
- ## 🔐 Usuarios de Prueba

El sistema incluye los siguientes usuarios de prueba con diferentes roles:

### 👨‍💼 Administrador
- **Email**: admin@hospital.com
- **Contraseña**: admin123
- **Permisos**: Acceso completo al sistema, gestión de usuarios, reportes

### 👨‍⚕️ Médicos
- **Email**: medico1@hospital.com
- **Contraseña**: medico123
- **Especialidad**: Medicina Interna
- **Permisos**: Gestión de pacientes, diagnósticos, evoluciones médicas, altas

- **Email**: medico2@hospital.com
- **Contraseña**: medico123
- **Especialidad**: Cardiología
- **Permisos**: Gestión de pacientes, diagnósticos, evoluciones médicas, altas

### 👩‍⚕️ Enfermeros
- **Email**: enfermero1@hospital.com
- **Contraseña**: enfermero123
- **Permisos**: Evaluaciones de enfermería, signos vitales, administración de medicamentos

- **Email**: enfermero2@hospital.com
- **Contraseña**: enfermero123
- **Permisos**: Evaluaciones de enfermería, signos vitales, administración de medicamentos

### 👩‍💼 Recepcionista
- **Email**: recepcion@hospital.com
- **Contraseña**: recepcion123
- **Permisos**: Admisión de pacientes, gestión de habitaciones, recepción

## Funcionalidades

- Gestión de pacientes (alta, baja, modificación, consulta)
- Proceso de admisión y recepción de pacientes
- Evaluación inicial por enfermería
- Evaluación médica y diagnóstico
- Asignación de habitación
- Alta hospitalaria

## Estructura del Proyecto

- `app.js`: Archivo principal de la aplicación
- `config/`: Configuración de la base de datos
- `controllers/`: Controladores de la aplicación
- `models/`: Modelos de datos
- `routes/`: Rutas de la aplicación
- `views/`: Vistas (plantillas PUG)
- `public/`: Archivos estáticos (CSS, JS, imágenes)    
