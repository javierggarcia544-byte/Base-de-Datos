import { Router } from "express";
import { WarehousesService } from "./warehouse.service";
import { WarehousesController } from "./warehouse.controller";

export class WarehousesRoute {
    static get route(): Router {
        const router = Router();

        const warehousesService = new WarehousesService();
        const warehousesController = new WarehousesController(warehousesService);

        router.post("/", warehousesController.create);
        router.get("/", warehousesController.findAll);
        router.get("/:id", warehousesController.findOne);
        router.put("/:id", warehousesController.update);
        router.delete("/:id", warehousesController.delete);

        return router;
    }
}
