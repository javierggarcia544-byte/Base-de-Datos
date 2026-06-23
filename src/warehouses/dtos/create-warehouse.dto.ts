import { ValidatorsConfig } from "../../common/config/validators.config";

export class CreateWarehouseDto {
    constructor(
        public name: string,
        public location: string,
        public products: string[],
    ) { }

    static validate(data: { [key: string]: any }): [string | undefined, CreateWarehouseDto | undefined] {
        const { name, location, products } = data;

        if (!name) return ["Missing name", undefined];

        if (!location) return ["Missing location", undefined];
        if (location.length < 4) return ["Location too short", undefined];

        if (products) {
            if (!Array.isArray(products)) return ["Products must be an array", undefined];
            for (const id of products) {
                if (!ValidatorsConfig.isMongoId(id)) return [`Invalid product ID: ${id}`, undefined];
            }
        }

        return [undefined, new CreateWarehouseDto(name, location, products || [])];
    }
}
