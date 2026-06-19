# 📝 Documentación de la Actividad Práctica

### **Título de la Actividad:** CRUD Completo y Relaciones en Arquitectura Modular

**Materia:** Programación / Base de Datos

**Enfoque:** Cohesión Arquitectónica y Consistencia de Datos Avanzada.

#### **Objetivo de Aprendizaje:**

Que el estudiante diseñe, codifique e integre un módulo secundario completo (`Categories`) con sus 5 operaciones fundamentales (CRUD RESTful), conectándolo mediante una relación 1:N con el módulo de `Products` y manejando las restricciones de negocio correspondientes (como evitar el borrado de categorías con productos activos).

---

### 📋 Rubricado y Criterios de Evaluación Actualizado (Total: 20 Puntos)

| Criterio | Descripción Técnica a Evaluar | Puntaje |
| --- | --- | --- |
| **1. CRUD Completo de Categorías** | Implementación correcta de las 5 rutas en `Categories`: Creación, Lectura (Individual y Paginada), Actualización (Parcial/PATCH o PUT) y Eliminación. | **5 Pts** |
| **2. Modelado y Relación (Mongoose)** | Configuración del esquema de Categorías y la inyección correcta del `categoryId` (como `ObjectId` y referencia `ref`) en el esquema e interfaz de Productos. | **4 Pts** |
| **3. Validación de Frontera (DTOs del CRUD)** | Creación y uso de `CreateCategoryDto` y `UpdateCategoryDto` con el patrón *Either* (`[error, dto]`). Uso de `PaginationDto` en el `findAll` de categorías. | **4 Pts** |
| **4. Restricciones de Negocio Avanzadas** | **Validación Cruzada:** El servicio de productos valida que la categoría exista antes de crear/editar. **Protección de Borrado:** El servicio de categorías impide eliminar una categoría si existen productos asociados a ella. | **4 Pts** |
| **5. Semántica REST y Buenas Prácticas** | Uso de verbos HTTP apropiados (`POST`, `GET`, `PUT/PATCH`, `DELETE`), códigos de estado (`201`, `200`, `400`, `404`, `500`) y limpieza estricta del JSON de salida (`toJSON`). | **3 Pts** |

---


# 🛠️ Actividad Práctica: Implementación del Módulo Completo de Categorías y Relaciones

## 📌 Contexto del Desafío
Partiendo de la arquitectura modular de nuestra **API de Productos**, el equipo de negocio requiere clasificar los productos del inventario y administrar dicho catálogo. Tu misión como Ingeniero de Desarrollo Backend es diseñar, codificar e integrar el módulo completo de **Categorías (`Categories`)** con sus 5 rutas fundamentales (CRUD) y establecer una relación de **Uno a Muchos (1:N)** hacia el módulo de Productos.

---

## 🎯 Requerimientos Técnicos

### 1. Estructura del Nuevo Módulo (`Categories`)
Debes crear la carpeta `src/categories/` respetando de forma estricta la arquitectura del proyecto:
* `categories/dtos/create-category.dto.ts` ➔ Validación para creación (Campos obligatorios).
* `categories/dtos/update-category.dto.ts` ➔ Validación para actualización (Campos opcionales).
* `category.controller.ts` ➔ Manejo de req, res y códigos de estado HTTP para las 5 rutas.
* `category.service.ts` ➔ Lógica de negocio e interacción con el modelo de Mongoose.
* `category.route.ts` ➔ Inyección de dependencias manual y cableado local de Express.

Debes registrar el módulo en el Enrutador Maestro (`src/routes.ts`) bajo el prefijo:
➔ `/api/categories`

### 2. Modelado de Datos y Relación
* **Modelo de Categoría (`Category`):** Debe registrar `name` (string, único, requerido) y `description` (string, opcional). Incluye `timestamps: true` y la limpieza del JSON (`toJSON`) para mutar `_id` a `id` y remover `__v`.
* **Modificación del Modelo de Producto:** Altera `product.model.ts` (e `IProduct`) para inyectar de forma obligatoria el enlace a la categoría:
  ```typescript
  categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required']
  }


### 3. Matriz de Endpoints a Implementar (CRUD Completo)

#### A. Módulo de Categorías (`/api/categories`)

| Método | Endpoint | Descripción | Parámetros / Body Esperado | Código HTTP |
| --- | --- | --- | --- | --- |
| **POST** | `/` | Crear Categoría | **Body:** `name` (req), `description` (opcional) | `201 Created` |
| **GET** | `/` | Listar Categorías | **Query Params:** `?page=1&limit=10` (Usa el `PaginationDto` global) | `200 OK` |
| **GET** | `/:id` | Obtener una Categoría | **URL Param:** `:id` de la categoría | `200 OK` / `404` |
| **PUT** | `/:id` | Actualizar Categoría | **URL Param:** `:id` + **Body:** campos opcionales a modificar | `200 OK` / `404` |
| **DELETE** | `/:id` | Eliminar Categoría | **URL Param:** `:id` *(Aplica regla de protección)* | `200 OK` / `400` |

#### B. Módulo de Productos Modificado (`/api/products`)

* `POST /` y `PUT /:id` ➔ Ahora deben procesar obligatoriamente el `categoryId`.
* `GET /` y `GET /:id` ➔ Deben retornar la información del producto utilizando `.populate('categoryId')` para incrustar los detalles de la categoría anidada en el JSON.

---

## ⚠️ Reglas de Negocio Cruzadas (Validaciones Críticas)

Para asegurar la integridad de la base de datos a nivel de ingeniería, tus servicios deben cumplir las siguientes dos reglas operativas:

1. **Protección en Productos (`ProductsService`):** Antes de crear o actualizar un producto, el servicio debe verificar si el `categoryId` provisto por el cliente realmente existe en la colección de categorías. Si no existe, debe abortar y lanzar un error (*"Category not found"*), impidiendo la creación de productos huérfanos.
2. **Protección en Categorías (`CategoriesService`):** Al intentar ejecutar el método `delete(id)`, el servicio de categorías debe verificar primero si existen productos asociados a ese `categoryId` en la base de datos. **Si la categoría tiene productos asignados, se debe denegar el borrado** retornando un error descriptivo (*"Cannot delete category with active products"*).

---

## 📥 Criterios de Entrega y Evaluación

1. **Tipado Estricto:** Cero uso del tipo `any` en firmas de métodos, interfaces o DTOs.
2. **Clean Code:** Aplicación del patrón *Early Return* en validaciones y nombres de variables descriptivos en español/inglés estandarizado.
3. **Robustez:** Control total de excepciones. Si un ID buscado en `findOne` o `delete` no existe en MongoDB, la API debe responder un estado `404 Not Found` o un error controlado, nunca colapsar el proceso de Node.

> 💡 *“Un buen arquitecto de software no es el que escribe el código más complejo, sino el que diseña las reglas necesarias para que los datos nunca pierdan su integridad.”* ¡Mucho éxito en el desarrollo del módulo!

