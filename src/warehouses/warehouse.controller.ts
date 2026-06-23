import { Request, Response } from "express";
import { WarehousesService } from "./warehouse.service";
import { CreateWarehouseDto } from "./dtos/create-warehouse.dto";
import { UpdateWarehouseDto } from "./dtos/update-warehouse.dto";
import { PaginationDto } from "../common/dtos/pagination/pagination.dto";
import { HandlerError } from "../errors/handler.error";

export class WarehousesController {
    constructor(
        private readonly warehousesService: WarehousesService
    ) { }

    create = (req: Request, res: Response) => {
        const [error, createWarehouseDto] = CreateWarehouseDto.validate(req.body);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }

        this.warehousesService.create(createWarehouseDto!)
            .then((warehouse) => res.status(201).json(warehouse))
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    update = (req: Request, res: Response) => {
        const [error, updateWarehouseDto] = UpdateWarehouseDto.validate(req.body);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }

        this.warehousesService.update(req.params.id as string, updateWarehouseDto!)
            .then((warehouse) => res.status(200).json(warehouse))
            .catch((error) => HandlerError.error(error,res));
    }

    findAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.validate(req.query);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }
        this.warehousesService.findAll(paginationDto!)
            .then((warehouses) => res.status(200).json(warehouses))
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    findOne = (req: Request, res: Response) => {
        this.warehousesService.findOne(req.params.id as string)
            .then((warehouse) => res.status(200).json(warehouse))
            .catch((error) => HandlerError.error(error,res));
    }

    delete = (req: Request, res: Response) => {
        this.warehousesService.delete(req.params.id as string)
            .then((warehouse) => res.status(200).json(warehouse))
            .catch((error) => HandlerError.error(error,res));
    }
}
