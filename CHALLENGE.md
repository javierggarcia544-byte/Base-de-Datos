# **Título del Laboratorio:** Arquitectura Modular Avanzada: Relaciones Complejas e Integridad Logística

**Materia:** Programación / Base de Datos

**Enfoque:** Escalabilidad, Reutilización de Código y Lógica de Negocio Multicapa.

#### **Objetivo del Laboratorio:**

Que el estudiante extienda la API modular añadiendo dos nuevos dominios (`Suppliers` y `Warehouses`) con sus correspondientes operaciones CRUD completas, modelando relaciones de tipo 1:N y N:M (conceptualmente mapeada mediante arreglos) para resolver el flujo logístico de dónde se guardan los productos y quién los provee.

---

### 📋 Criterios de Evaluación del Laboratorio (Total: 20 Puntos)

| Criterio | Descripción Técnica a Evaluar | Puntaje |
| --- | --- | --- |
| **1. Modularidad Total (Nuevos Dominios)** | Creación y aislamiento de los directorios `src/suppliers/` y `src/warehouses/` con toda su estructura de archivos (Routes, Controllers, Services, DTOs). | **4 Pts** |
| **2. Modelado de Datos Avanzado** | Enlazar `Products` con `Supplier` (1:N) e integrar un arreglo de referencias en `Warehouses` para albergar múltiples productos (Relación dimensional), aplicando `toJSON` en ambos. | **4 Pts** |
| **3. Validaciones de Red Estrictas (DTOs)** | Implementación de DTOs de creación y actualización para ambos módulos. Validación estricta de formatos de datos específicos (Ej: teléfono, correos o números). | **4 Pts** |
| **4. Lógica de Negocio e Integridad** | **Control de Stock/Ubicación:** Evitar agregar IDs de productos inexistentes a un almacén. **Regla de Borrado:** Impedir borrar un proveedor si tiene productos asociados. | **5 Pts** |
| **5. Semántica y Carga Dinámica (Populate)** | Uso correcto de verbos HTTP, códigos de estado y anidación profunda de datos usando `.populate()` para mostrar la trazabilidad completa en las consultas de lectura. | **3 Pts** |

---


# 🏬 Laboratorio Avanzado: Módulos de Proveedores (Suppliers) y Almacenes (Warehouses)

## 📌 Contexto del Desafío
Nuestro sistema de inventario modular sigue creciendo. Ahora que tenemos **Productos** debidamente clasificados por **Categorías**, la empresa requiere resolver dos problemas logísticos críticos:
1. ¿Quién nos suministra la mercancía? ➔ **Proveedores (`Suppliers`)**
2. ¿Dónde se almacena físicamente la mercancía y qué stock hay disponible en cada sede? ➔ **Almacenes (`Warehouses`)**

Tu objetivo en este laboratorio es implementar ambos módulos completos (CRUD de 5 rutas cada uno) bajo la misma arquitectura modular basada en clases, TypeScript y Mongoose.

---

## 📂 Nueva Estructura del Sistema Integrado

El mapa de módulos en `src/` debe quedar extendido de la siguiente forma:
```text
src/
├── common/                  # Infraestructura compartida (config, databases, dtos)
├── categories/              # Módulo de Categorías (Ya implementado)
├── products/                # Módulo de Productos (Ya implementado - requiere modificaciones)
├── suppliers/               # 🆕 Módulo de Proveedores (CRUD Completo)
│   ├── dtos/                # create-supplier.dto.ts / update-supplier.dto.ts
│   ├── supplier.controller.ts
│   ├── supplier.model.ts
│   ├── supplier.route.ts
│   └── supplier.service.ts
└── warehouses/              # 🆕 Módulo de Almacenes (CRUD Completo)
    ├── dtos/                # create-warehouse.dto.ts / update-warehouse.dto.ts
    ├── warehouse.controller.ts
    ├── warehouse.model.ts
    ├── warehouse.route.ts
    └── warehouse.service.ts

```

---

## 📐 Modelado de Datos y Relaciones a Implementar

### 1. Módulo de Proveedores (`Suppliers`)

Representa a las empresas externas que nos surten.

* **Modelo Mongoose (`Supplier`):**
* `name` (String, requerido, único).
* `email` (String, requerido, validación de formato de correo).
* `phone` (String, requerido).
* `address` (String, opcional).
* `timestamps: true` + limpieza `toJSON` (Remover `__v`, cambiar `_id` a `id`).


* **Relación con Productos:**
* Modifica el esquema de Productos (`product.model.ts`) para asociarle un proveedor obligatorio:
```typescript
supplierId: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Supplier ID is required']
}

```





### 2. Módulo de Almacenes (`Warehouses`)

Representa los depósitos físicos (Sede Norte, Sede Centro, Sede Principal, etc.).

* **Modelo Mongoose (`Warehouse`):**
* `name` (String, requerido, único - Ej: "Almacén Central").
* `location` (String, requerido - Ej: "Zona Industrial, Galpón 4").
* `products`: Un arreglo de referencias que contendrá los IDs de los productos almacenados en esa sede:
```typescript
products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
}]

```


* `timestamps: true` + limpieza `toJSON`.



---

## 📑 Matriz de Endpoints Requeridos (CRUD x10)

Debes registrar los nuevos puntos de distribución en el enrutador maestro `src/routes.ts`:

* Prefijo: `/api/suppliers`
* Prefijo: `/api/warehouses`

Ambos módulos deben implementar las **5 rutas estándar**:

| Verbo HTTP | Endpoint | Acción Requerida |
| --- | --- | --- |
| **POST** | `/` | Crear registro (Aplica `CreateDto.validate()`) |
| **GET** | `/` | Listar registros de forma paginada (Aplica `PaginationDto`) |
| **GET** | `/:id` | Buscar un registro específico por su ID |
| **PUT** | `/:id` | Actualizar parcialmente (Aplica `UpdateDto.validate()`) |
| **DELETE** | `/:id` | Eliminar registro (Aplicando reglas de integridad) |

---

## ⚠️ Reglas de Negocio Estrictas (Filtros de Integridad)

Para aprobar el laboratorio, los métodos de tus nuevos servicios deben validar la consistencia lógica del sistema antes de tocar la base de datos:

1. **Integridad en Productos (`ProductsService`):** Al crear o actualizar un producto, el sistema ahora debe validar que **tanto** el `categoryId` como el `supplierId` existan en sus respectivas colecciones. Si alguno no existe, la operación se cancela inmediatamente con un error `400`.
2. **Protección de Proveedores (`SuppliersService`):** No se permite la eliminación (`delete`) de un proveedor si este tiene productos asociados en el catálogo actual. Debe responder un error: *"Cannot delete a supplier with active products"*.
3. **Consistencia de Inventario (`WarehousesService`):** Al crear o actualizar un Almacén, el arreglo de `products` provisto en el JSON del cliente puede venir vacío o con IDs de productos. El servicio debe verificar que **todos** los IDs de productos enviados existan realmente en la colección de Productos. Si el cliente envía un ID falso o corrupto, el almacén no se crea.

---

## 🔍 Carga Enriquecida de Datos (Populate Avanzado)

Cuando el cliente consulte un almacén por su ID (`GET /api/warehouses/:id`), la respuesta JSON no debe mostrar una lista de textos planos. Debes usar la función `.populate()` de Mongoose de forma anidada para retornar toda la traza de la cadena de suministros en una sola respuesta:

* El Almacén debe poblar sus `products`.
* A su vez, cada producto dentro del almacén debe venir con su `categoryId` y su `supplierId` completamente resueltos en objetos legibles.

---

## 📥 Instrucciones de Entrega

* Todo el código debe estar completamente tipado en TypeScript. Queda prohibido el uso deliberado de instrucciones `any`.
* El servidor debe encender limpiamente mostrando los logs de conexión.
* Prepara una colección de Postman o un archivo de pruebas HTTP para demostrar el funcionamiento del flujo completo (Crear Proveedor ➔ Crear Categoría ➔ Crear Producto enlazado a ambos ➔ Guardar Producto en un Almacén ➔ Consultar el Almacén).

> 💡 *“En el software empresarial, los datos aislados no tienen valor. La verdadera destreza de un ingeniero se demuestra al programar los hilos que conectan e interrelacionan toda la infraestructura del negocio de forma segura y coherente.”* ¡Manos a la obra!

- Ing. Luis Reyes