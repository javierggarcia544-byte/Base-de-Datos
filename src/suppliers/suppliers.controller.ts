import { Request, Response } from "express";
import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDto } from "./dtos/create-supplier.dto";
import { UpdateSupplierDto } from "./dtos/update-supplier.dto";
import { PaginationDto } from "../common/dtos/pagination/pagination.dto";
import { HandlerError } from "../errors/handler.error";

export class SuppliersController {
    constructor(
        private readonly suppliersService: SuppliersService
    ) { }

    private handleResult<T>(res: Response, promise: Promise<T>, successStatus: number = 200) {
        promise
            .then((result) => {
                if (typeof result === "string") {
                    res.status(400).json({ message: result, status: 400 });
                } else {
                    res.status(successStatus).json(result);
                }
            })
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    create = (req: Request, res: Response) => {
        const [error, createSupplierDto] = CreateSupplierDto.validate(req.body);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }

        this.handleResult(res, this.suppliersService.create(createSupplierDto!), 201);
    }

    update = (req: Request, res: Response) => {
        const [error, updateSupplierDto] = UpdateSupplierDto.validate(req.body);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }

        this.suppliersService.update(req.params.id as string, updateSupplierDto!)
        .catch((error) => HandlerError.error(error,res));
    }

    findAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.validate(req.query);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }
        this.handleResult(res, this.suppliersService.findAll(paginationDto!));
    }

    findOne = (req: Request, res: Response) => {
        this.suppliersService.findOne(req.params.id as string)
        .catch((error) => HandlerError.error(error,res))
    }

    delete = (req: Request, res: Response) => {
        this.suppliersService.delete(req.params.id as string)
        .catch((error) => HandlerError.error(error,res));
    }
}
