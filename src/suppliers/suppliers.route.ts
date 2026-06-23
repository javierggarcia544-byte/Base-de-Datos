import { Router } from "express";
import { SuppliersService } from "./suppliers.service";
import { SuppliersController } from "./suppliers.controller";

export class SuppliersRoute {
    static get route(): Router {
        const router = Router();

        const suppliersService = new SuppliersService();
        const suppliersController = new SuppliersController(suppliersService);

        router.post("/", suppliersController.create);
        router.get("/", suppliersController.findAll);
        router.get("/:id", suppliersController.findOne);
        router.put("/:id", suppliersController.update);
        router.delete("/:id", suppliersController.delete);

        return router;
    }
}
