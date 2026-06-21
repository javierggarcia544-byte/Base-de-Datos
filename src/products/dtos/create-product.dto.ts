import { ValidatorsConfig } from "../../common/config/validators.config";

export class CreateProductDto {
    constructor(
        public name: string,
        public price: number,
        public stock: number,
        public category: string,
        public description: string | undefined,
    ){}

    static validate(data: {[key: string]:any}): [string | undefined, CreateProductDto | undefined]{
        const { name, price, stock, category, description } = data;

        if(!name) return ["Missing name", undefined];
        
        if(isNaN(+price)) return ["Price should be a number.", undefined];
        if(+price < 0) return ["Price should be positive.", undefined];
        
        if(isNaN(+stock)) return ["Stock should be a number.", undefined];
        if(+stock < 0) return ["Stock should be positive.", undefined];
        
        if(!category) return ["Missing category", undefined];
        if(!ValidatorsConfig.isMongoId( category )) return ["Category not valid", undefined];
        
        if(description && description.length < 4) return ["Description too short", undefined];
        
        return [undefined, new CreateProductDto(name, price, stock, category, description)];
    }
}