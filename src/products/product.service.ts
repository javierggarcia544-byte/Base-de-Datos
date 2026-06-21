import { Category } from "../common/databases/mongodb/models/category.model";
import { Product } from "../common/databases/mongodb/models/product.model";
import { PaginationDto } from "../common/dtos/pagination/pagination.dto";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

export class ProductsService {
    async create(createProductDto: CreateProductDto) {
        try {

            const category = await Category.findById(createProductDto.category);
            if (!category) throw new Error(`Category with id #${category} not found`);

            const product = await Product.create(createProductDto);
            if (!product) throw new Error("Failed to create product");

            return product;
        } catch (error) {
            throw error;
        }
    }

    async findAll(paginationDto: PaginationDto) {
        try {
            const { page, limit } = paginationDto;
            const skip = (page - 1) * limit;

            const products = await Product.find()
                .skip(skip)
                .limit(limit)
                .populate("category", "id name");
            const total = await Product.countDocuments();
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

    async update(id: string, updateProductDto: UpdateProductDto) {

        try {

            if (updateProductDto.category) {
                const category = await Category.findById(updateProductDto.category);
                if (!category) throw new Error(`Category with id #${category} not found`);
            }

            const product = await Product.findOneAndUpdate({ _id: id }, updateProductDto, { new: true });
            if (!product) throw new Error("Product not found");

            return product;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string) {
        try {
            const product = await Product.findOneAndDelete({ _id: id }); //! Nunca aplicar eliminación física en un producto, lo ideal es marcarlo como inactivo o eliminado
            if (!product) throw new Error("Product not found");

            return product;
        } catch (error) {
            throw error;
        }
    }

    async findOne(id: string) {
        try {
            const product = await Product.findOne({ _id: id }).populate("category", "id name");
            if (!product) throw new Error("Product not found");

            return product;
        } catch (error) {
            throw error;
        }
    }
}