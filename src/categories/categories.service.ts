import { Category } from "../common/databases/mongodb/models/category.model";
import { PaginationDto } from "../common/dtos/pagination/pagination.dto";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto } from "./dtos/update-category.dto";

export class CategoriesService {
    async create(createCategoryDto: CreateCategoryDto) {
        try {
            const category = await Category.create(createCategoryDto);
            if (!category) throw new Error("Failed to create category");

            return category;
        } catch (error) {
            throw error;
        }
    }

    async findAll(paginationDto: PaginationDto) {
        try {
            const { page, limit } = paginationDto;
            const skip = (page - 1) * limit;

            const products = await Category.find().skip(skip).limit(limit);
            const total = await Category.countDocuments();
            return {
                data: products,
                meta: {
                    page,
                    limit,
                    total,
                    lastPage: Math.ceil(total / limit),
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        try {
            const category = await Category.findOneAndUpdate({ _id: id }, updateCategoryDto, { new: true });
            if (!category) throw new Error("category not found");

            return category;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string) {
        try {
            const category = await Category.findOneAndDelete({ _id: id }); //! Nunca aplicar eliminación física en un categoryo, lo ideal es marcarlo como inactivo o eliminado
            if (!category) throw new Error("Category not found");

            return category;
        } catch (error) {
            throw error;
        }
    }

    async findOne(id: string) {
        try {
            const category = await Category.findOne({ _id: id });
            if (!category) throw new Error("Category not found");

            return category;
        } catch (error) {
            throw error;
        }
    }
}