import { ValidatorsConfig } from "../../common/config/validators.config";

export class UpdateProductDto {
    constructor(
        public name: string | undefined,
        public price: number | undefined,
        public stock: number | undefined,
        public category: string | undefined,
        public description: string | undefined,
    ) { }

    set fields(data: Partial<UpdateProductDto>) {
        const { name, price, stock, category, description } = data;

        if (name) this.name = name;
        if (price) this.price = price;
        if (stock) this.stock = stock;
        if (category) this.category = category;
        if (description) this.description = description;
    }

    static validate(data: { [key: string]: any }): [string | undefined, UpdateProductDto | undefined] {
        const { name, price, stock, category, description } = data;

        if (price && isNaN(+price)) return ["Price should be a number.", undefined];
        if (price && +price < 0) return ["Price should be positive.", undefined];
        if (stock && isNaN(+stock)) return ["Stock should be a number.", undefined];
        if (stock && +stock < 0) return ["Stock should be positive.", undefined];
        if (category && ValidatorsConfig.isMongoId(category)) return ["Category not valid", undefined];
        if (description && description.length < 4) return ["Description too short", undefined];

        return [undefined, new UpdateProductDto(name, +price, +stock, category, description)];
    }
}