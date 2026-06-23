# 🚀 API RESTful de Productos - Arquitectura Modular (Express + TypeScript)

Este proyecto es una plantilla base para el desarrollo de APIs profesionales y escalables utilizando **Node.js, Express y TypeScript**. Implementa una **Arquitectura Modular por Dominios**, aplicando principios de Clean Code, inversión de control y el patrón DTO para la validación de datos en la frontera de la red.

---

## 🛠️ Tecnologías y Herramientas Utilizadas

* **Entorno de Ejecución:** Node.js (TypeScript)
* **Framework Web:** Express
* **Base de Datos (ODM):** MongoDB con Mongoose
* **Validación de Entorno:** `env-var` & `dotenv`
* **Contenedores:** Docker & Docker Compose

---

## 📂 Arquitectura del Proyecto

El código está organizado siguiendo un enfoque modular, donde cada módulo de negocio es autosuficiente y se conecta a través de un enrutador maestro.

```text
src/
├── common/                  # Infraestructura global compartida
│   ├── config/              # Configuración y validación de variables de entorno (ENVS)
│   ├── databases/           # Conexiones de infraestructura (MongoDB, esquemas, modelos)
│   └── dtos/                # Data Transfer Objects genéricos (Paginación)
├── products/                # Módulo del Dominio de Productos
│   ├── dtos/                # Validaciones específicas de entrada (Create/Update)
│   ├── product.controller.ts# Manejo del protocolo HTTP (req, res, códigos de estado)
│   ├── product.route.ts     # Instanciación y cableado del módulo (Inyección de dependencias)
│   └── product.service.ts   # Capa de Lógica de Negocio y reglas operativas
├── app.ts                   # Punto de entrada de la aplicación (Bootstrap)
├── routes.ts                # Enrutador maestro (Hub Central de Rutas)
└── server.ts                # Configuración del servidor HTTP Express

```

---

## 🔄 Ciclo de Vida de una Petición (Request-Response)

Para comprender el flujo de datos dentro de esta arquitectura modular, cada petición del cliente sigue rigurosamente el siguiente orden secuencial:

1. **Cliente HTTP:** Dispara una petición (Ej: `POST /api/products`).
2. **AppServer:** Recibe la petición, pre-procesa los middlewares globales (`express.json`) y delega al enrutador maestro.
3. **AppRoutes & ProductsRoute:** Resuelven la ruta jerárquicamente y derivan el flujo al controlador mapeado.
4. **ProductsController & DTOs:** Se interceptan los datos entrantes y se validan en la "aduana" del DTO (`CreateProductDto.validate`). Si falla, responde un `400 Bad Request`. Si pasa, invoca al Servicio.
5. **ProductsService:** Ejecuta la lógica de negocio pura de manera asíncrona.
6. **Mongoose Model:** Interactúa con la base de datos MongoDB para persistir o consultar la información.

---

## 🚀 Configuración Inicial e Instalación

Sigue estos pasos detallados para clonar, configurar y desplegar el entorno de desarrollo local:

### 1. Clonar el Repositorio

```bash
git clone <url-git>
cd <nombre-del-proyecto>

```

### 2. Instalar Dependencias de Node.js

```bash
npm install

```

### 3. Levantar la Base de Datos Local (Docker)

El proyecto incluye un archivo `docker-compose.yml` optimizado para levantar una instancia aislada de MongoDB. Asegúrate de tener Docker corriendo en segundo plano y ejecuta:

```bash
docker compose up -d

```

### 4. Configurar las Variables de Entorno

Duplica el archivo de plantilla para crear tu configuración local personalizable:

```bash
cp .env.template .env

```

*Nota: Abre el archivo `.env` resultante y valida que las credenciales coincidan con los puertos locales y los asignados en tu archivo de Docker.*

### 5. Iniciar el Servidor en Modo de Desarrollo

Arranca la aplicación con recarga en caliente automática (Hot-Reload) gracias a TypeScript:

```bash
npm run start:dev

```

El servidor imprimirá en consola la confirmación de la base de datos y el puerto de escucha activo:

```text
🟢 [Database] Mongo Connected successfully to 'basedb'
🚀 [Server] Running on port 3000

```

---

## 📑 Documentación de la API (Endpoints)

Todas las peticiones deben llevar el prefijo base `/api`.

### Módulo de Productos (`/api/products`)

| Método | Endpoint | Descripción | Parámetros / Body Esperado | Código Exitoso |
| --- | --- | --- | --- | --- |
| **POST** | `/` | Crear un producto | **Body (JSON):** `name`, `price`, `stock`, `description` (opcional) | `201 Created` |
| **GET** | `/` | Listar productos paginados | **Query Params:** `?page=1&limit=10` (por defecto) | `200 OK` |
| **GET** | `/:id` | Buscar un producto por ID | **URL Param:** `:id` (String de MongoDB) | `200 OK` |
| **PUT** | `/:id` | Actualizar parcialmente | **URL Param:** `:id` + **Body (JSON)** con campos a modificar | `200 OK` |
| **DELETE** | `/:id` | Eliminar un producto | **URL Param:** `:id` *(Nota: Aplica eliminación física temporal)* | `200 OK` |

---

## 💡 Buenas Prácticas de Ingeniería Implementadas

* **Patrón Either (Tuplas de control):** Los métodos estáticos de validación de los DTOs retornan una tupla `[error, dto]`, eliminando el sobrecosto de lanzar excepciones constantes (`throw Error`) en la capa de red.
* **Fallo Temprano (Fail-Fast):** Uso estricto de la librería `env-var` para detener de inmediato el encendido del sistema si falta alguna credencial o variable de entorno obligatoria.
* **Single Source of Truth (SSOT):** El archivo `env.config.ts` encapsula el objeto `ENVS`, de modo que ninguna otra capa del software tiene acceso o dependencia directa del objeto global nativo de Node `process.env`.
# Base-de-Datos
