import { Request, Response } from "express";
import { ProductsService } from "./product.service";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { PaginationDto } from "../common/dtos/pagination/pagination.dto";
import { HandlerError } from "../errors/handler.error";

export class ProductsController {
    constructor(
        private readonly productsService: ProductsService
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
        const [error, createProductDto] = CreateProductDto.validate(req.body);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }

        this.handleResult(res, this.productsService.create(createProductDto!), 201);
    }

    update = (req: Request, res: Response) => {
        const [error, updateProductDto] = UpdateProductDto.validate(req.body);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }

        this.handleResult(res, this.productsService.update(req.params.id as string, updateProductDto!));
    }

    findAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.validate(req.query);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }
        this.handleResult(res, this.productsService.findAll(paginationDto!));
    }

    findOne = (req: Request, res: Response) => {
        this.productsService.findOne(req.params.id as string)
        .catch((error) => HandlerError.error(error,res))
    }

    delete = (req: Request, res: Response) => {
        this.productsService.delete(req.params.id as string)
        .catch((error) => HandlerError.error(error,res))   
    }
}
