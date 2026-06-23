import { Request, Response } from "express";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { PaginationDto } from "../common/dtos/pagination/pagination.dto";
import { HandlerError } from "../errors/handler.error";

export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService
    ) { }

    create = (req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.validate(req.body);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }

        this.categoriesService.create(createCategoryDto!)
            .then((product) => res.status(201).json(product))
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    update = (req: Request, res: Response) => {
        const [error, updateCategoryDto] = UpdateCategoryDto.validate(req.body);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }

        this.categoriesService.update(req.params.id as string, updateCategoryDto!)
            .then((product) => res.status(200).json(product))
            .catch((error) => HandlerError.error(error,res));
    }

    findAll = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.validate(req.query);
        if (error) {
            res.status(400).json({ message: error, status: 400 });
            return;
        }
        this.categoriesService.findAll(paginationDto!)
            .then((products) => res.status(200).json(products))
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    findOne = (req: Request, res: Response) => {

        this.categoriesService.findOne(req.params.id as string)
            .then((product) => res.status(200).json(product))
            .catch((error) => HandlerError.error(error,res));
    }

    delete = (req: Request, res: Response) => {

        this.categoriesService.delete(req.params.id as string)
            .then((product) => res.status(200).json(product))
            .catch((error) => HandlerError.error(error,res));
    }
}
