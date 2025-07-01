# COO Backend

Sistema backend desarrollado con Node.js, TypeScript y Fastify siguiendo los principios de Clean Architecture.

## Descripción

Este proyecto implementa una API REST para el sistema COO que maneja órdenes de envío, cotizaciones y gestión de usuarios. Está construido siguiendo los principios de Clean Architecture para mantener el código organizado, testeable y escalable.

## Arquitectura

El proyecto sigue los principios de Clean Architecture organizando el código en las siguientes capas:

- **Domain**: Entidades de negocio y reglas fundamentales
- **Application**: Casos de uso, servicios y DTOs
- **Infrastructure**: Configuración, base de datos, cache y servicios externos
- **Interface**: Controladores, rutas, middleware y validadores

## Requisitos

- Node.js 18 o superior
- npm o yarn
- MySQL 8.0 o superior
- Redis (opcional, se puede usar con Docker)

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno (ver sección Variables de Entorno)

4. Iniciar Redis con Docker (opcional):

```bash
docker-compose up -d
```

5. Configurar la base de datos MySQL y ejecutar las migraciones ubicadas en `src/infrastructure/database/migrations/`

## Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar el proyecto
npm run build

# Iniciar en producción
npm start

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar solo tests unitarios
npm run test:unit

# Ejecutar solo tests de integración
npm run test:integration
```

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

### Servidor

```
PORT=3000
```

### Autenticación JWT

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

### Base de Datos MySQL

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-database-password
DB_NAME=coodb
```

### Redis (Cache)

```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

## Estructura del Proyecto

```
src/
├── domain/           # Entidades de negocio
├── application/      # Casos de uso y servicios
├── infrastructure/   # Base de datos, cache y configuración
├── interface/        # Controladores, rutas y middleware
└── shared/          # Utilidades compartidas
```

## Desarrollo

1. Configurar el entorno de desarrollo con las variables de entorno
2. Ejecutar `npm run dev` para iniciar el servidor con hot reload
3. La API estará disponible en `http://localhost:3000`
4. La documentación Swagger estará disponible en `http://localhost:3000/documentation`

## Testing

El proyecto incluye tests unitarios e integración:

- Tests unitarios para servicios y casos de uso
- Tests de integración para controladores
- Configuración de Jest con TypeScript
- Cobertura de código disponible

## Tecnologías Utilizadas

- **Framework**: Fastify
- **Lenguaje**: TypeScript
- **Base de Datos**: MySQL
- **Cache**: Redis
- **Autenticación**: JWT
- **Testing**: Jest
- **Documentación**: Swagger
- **WebSockets**: Socket.io

## Base de Datos

Las migraciones SQL se encuentran en `src/infrastructure/database/migrations/` y deben ejecutarse en orden:

NOTA: Recordar que las migraciones se hacen automaticamente al ejecutar "npm run dev"

1. `01-rates.sql` - Tabla de tarifas
2. `02-rates-data.sql` - Datos iniciales de tarifas
3. `03-users.sql` - Tabla de usuarios
4. `04-quote-history.sql` - Historial de cotizaciones
5. `05-shipping-orders.sql` - Órdenes de envío
6. `06-order-status-history.sql` - Historial de estados de órdenes
