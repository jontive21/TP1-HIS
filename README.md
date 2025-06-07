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
- URL: http://localhost:3000
- Usuario: admin@hospital.com
- Contraseña: admin123

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
