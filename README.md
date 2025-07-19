# Megadelicias Backend

## Configuración de Base de Datos

Para configurar la conexión a la base de datos:

1. Copia el archivo de ejemplo:
   ```bash
   cp db/connection.example.js db/connection.js
   ```

2. Edita `db/connection.js` con tus credenciales:
   - `user`: Tu usuario de SQL Server
   - `password`: Tu contraseña  
   - `server`: Tu servidor (ej: localhost, DESKTOP-XXX)
   - `database`: Nombre de tu base de datos

3. **IMPORTANTE**: Nunca subas el archivo `connection.js` a Git ya que contiene credenciales sensibles.

## Variables de Entorno

También puedes usar el archivo `.env` para las credenciales:

```
DB_HOST=tu_servidor
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_base_datos
JWT_SECRET=tu_clave_secreta
```

## Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar base de datos (ver arriba)

3. Iniciar servidor:
   ```bash
   npm run dev
   ```

## Endpoints Disponibles

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario
- `GET /api/auth/roles` - Obtener roles

### Contabilidad (Requiere autenticación)
- `GET /api/contabilidad/periodos` - Períodos contables
- `POST /api/contabilidad/asientos` - Crear asiento
- `GET /api/contabilidad/asientos/:id` - Obtener asiento
- Y más...
