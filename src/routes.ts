import { Router } from "express";
import { ProductsRoute } from "./products/product.route";
import { CategoriesRoute } from "./categories/categories.route";
import { SuppliersRoute } from "./suppliers/suppliers.route";

export class AppRoutes {
  static get route(): Router {
    const route = Router();

    route.use("/products", ProductsRoute.route);
    route.use("/categories", CategoriesRoute.route);
    route.use("/suppliers", SuppliersRoute.route);

    return route;
  }
}
