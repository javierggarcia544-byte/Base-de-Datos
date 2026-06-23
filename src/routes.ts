import { Router } from "express";
import { ProductsRoute } from "./products/product.route";
import { CategoriesRoute } from "./categories/categories.route";
import { SuppliersRoute } from "./suppliers/suppliers.route";
import { WarehousesRoute } from "./warehouses/warehouse.route";

export class AppRoutes {
  static get route(): Router {
    const route = Router();

    route.use("/products", ProductsRoute.route);
    route.use("/categories", CategoriesRoute.route);
    route.use("/suppliers", SuppliersRoute.route);
    route.use("/warehouses", WarehousesRoute.route);

    return route;
  }
}
