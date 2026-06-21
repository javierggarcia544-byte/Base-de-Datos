import { Router } from "express";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";

export class CategoriesRoute {
    static get route(): Router {
        const router = Router();

        const categoriesService = new CategoriesService();
        const categoriesController = new CategoriesController(categoriesService);

        router.post("/", categoriesController.create);
        router.get("/", categoriesController.findAll);
        router.get("/:id", categoriesController.findOne);
        router.put("/:id", categoriesController.update);
        router.delete("/:id", categoriesController.delete);

        return router;
    }
}