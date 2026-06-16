# Sistema Base

## Configuracion inicial

```bash
## Clonar el proyecto
git clone <url-git>

## Al clonar el proyecto debes ejecutar
npm install

## Ademas, debes ejecutar (Debe estar ejecuntandose Docker en segundo plano)
docker compose up -d

## Luego, cambia el nombre de .env.template a .env

## Por ultimo, ejecuta la aplicacion
npm run start:dev
```


# 🔬 Actividad Práctica: Implementación de un Nuevo Módulo (Modular)

¡Bienvenidos al laboratorio práctico del backend! En esta actividad pondrán a prueba su comprensión de la **arquitectura modular** y el flujo de datos utilizando **Express, Mongoose y TypeScript**.

Partiendo de la estructura base que ya está configurada en este proyecto, su objetivo es diseñar e integrar por completo un nuevo módulo funcional enfocado en la gestión de inventario.

---

## 🎯 Objetivo General
Implementar un módulo llamado **Productos (`products`)** siguiendo rigurosamente el patrón de diseño modular y las 7 capas de desarrollo explicadas en clase.

---

## 📋 Requerimientos del Módulo a Crear

El módulo debe ser capaz de registrar productos y listarlos de forma paginada. A continuación, se detallan las especificaciones técnicas obligatorias para cada archivo:

### 1. Modelo de MongoDB (`product.model.ts`)
Deben estructurar la colección en MongoDB con las siguientes propiedades:
* `name`: Tipo `String`, obligatorio (requerido).
* `price`: Tipo `Number`, obligatorio (requerido).
* `stock`: Tipo `Number`, obligatorio (requerido), con un valor por defecto de `0`.
* `description`: Tipo `String`, opcional.
* `isActive`: Tipo `Boolean`, por defecto en true.
* **Configuración extra:** Habilitar los `timestamps` automáticos de Mongoose.

### 2. Data Transfer Object (`create-product.dto.ts`)
El DTO debe validar estrictamente que los datos recibidos en el cuerpo de la petición HTTP cumplan con lo siguiente:
* El `name` debe existir. Si falta, retornar el error: `"Missing product name"`.
* El `price` debe existir. Si falta, retornar el error: `"Missing product price"`.
* El `stock` debe existir. Si falta, retornar el error: `"Missing product stock"`.
* Debe incluir un método estático `validate(data)` que devuelva la clásica tupla `[error?, dto?]`.

### 3. Servicio (`products.service.ts`)
Debe contener la lógica de negocio y métodos asíncronos para interactuar con la base de datos:
* `create(createProductDto)`: Recibe el DTO validado y guarda el producto en la base de datos.
* `findAll(paginationDto)`: Recupera los productos aplicando paginación (`limit` y `page`). Debe retornar los datos junto con el objeto de metadatos (`total`, `lastPage`, `page`, `limit`). 
* `findOne(id: string)`: Recibe el id validado y retorna el producto de la base de datos.

### 4. Controlador (`products.controller.ts`)
Encargado de manejar el ciclo de vida HTTP. No debe contener lógica de base de datos directa:
* Debe recibir el servicio mediante **inyección de dependencias** en el constructor.
* Método `create`: Valida el `req.body` con el DTO. Si falla, responde con `status 400`. Si es exitoso, delega al servicio y responde con `status 201`.
* Método `findAll`: Valida los parámetros de consulta (`req.query`) usando el `PaginationDto` existente. Responde con `status 200`.
* Método `findOne`: Obtiene el id del params (`req.params`). Responde con `status 200`.

### 5. Enrutador (`products.route.ts`)
* Debe exponer un método estático `get route(): Router`.
* Instanciar internamente el servicio, inyectarlo al controlador y definir las siguientes rutas:
    * `POST /` ➡️ Vinculado al método `create` del controlador.
    * `GET /` ➡️ Vinculado al método `findAll` del controlador.
    * `GET /:id` ➡️ Vinculado al método `findOne` del controlador.

### 6. Registro Global (`app.routes.ts` o `routes.ts`)
* Deben conectar el nuevo enrutador local al enrutador central de la aplicación bajo el prefijo `/api/products`.

---

## 📂 Estructura de Carpetas Esperada al Finalizar

Al terminar el laboratorio, la estructura de su proyecto deberá verse así (enfóquense en la nueva carpeta `products`):

```text
src/
 ├── products/                         <-- Carpeta creada por ustedes
 │    ├── dtos/
 │    │    └── create-product.dto.ts
 │    ├── entities/
 │    │    └── product.entity.ts       (Opcional, según lo requiera el docente)
 │    ├── products.controller.ts
 │    ├── products.service.ts
 │    └── products.route.ts
 ├── common/
 │    ├── databases/
 │    │    └── mongodb/
 │    │         └── models/
 │    │              └── product.model.ts  <-- Modelo del producto
 │    └── dtos/
 │         └── pagination/
 │              └── pagination.dto.ts      <-- (Ya existente, reutilizar)
 └── app.routes.ts                         <-- Modificar para registrar la ruta

```

---

## 🧪 Pruebas de Verificación (Criterios de Aceptación)

Para comprobar que el laboratorio funciona correctamente, pueden utilizar herramientas como **Postman**, **Thunder Client** o **Insomnia**:

1. **Prueba de Creación Exitosa (`POST`)**
* **URL:** `http://localhost:[PUERTO]/api/products`
* **Body (JSON):**
```json
{
  "name": "Laptop HP Pavilion",
  "price": 750,
  "stock": 15,
  "description": "Laptop para desarrollo de software"
}

```


* **Resultado esperado:** Status `201 Created` y el objeto guardado con su `_id` de Mongo.


2. **Prueba de Validación Fallida (`POST`)**
* Enviar el mismo JSON anterior pero removiendo la propiedad `"price"`.
* **Resultado esperado:** Status `400 Bad Request` con el mensaje `"Missing product price"`.


3. **Prueba de Paginación (`GET`)**
* **URL:** `http://localhost:[PUERTO]/api/products?page=1&limit=5`
* **Resultado esperado:** Status `200 OK` con la estructura de respuesta que incluye el arreglo de productos en `data` y los datos de paginación en `meta`.



---

## 🛑 Reglas del Laboratorio

* **Código Limpio:** Mantener el uso correcto de TypeScript (tipado fuerte, evitar el uso innecesario de `any`).
* **Manejo de Errores:** Asegurar el uso de bloques `try/catch` en los servicios y promesas `.catch()` en los controladores para evitar que el servidor se caiga en caso de fallas.
