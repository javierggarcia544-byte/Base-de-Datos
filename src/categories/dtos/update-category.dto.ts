export class UpdateCategoryDto {
    constructor(
        public name: string | undefined,
        public description: string | undefined,
    ) { }

    set fields(data: Partial<UpdateCategoryDto>) {
        const { name, description } = data;

        if (name) this.name = name;
        if (description) this.description = description;
    }

    static validate(data: { [key: string]: any }): [string | undefined, UpdateCategoryDto | undefined] {
        const { name, price, stock, description } = data;

        if (name && name.length < 2) return ["Name too short.", undefined];
        if (description && description.length < 4) return ["Description too short", undefined];

        return [undefined, new UpdateCategoryDto(name, description)];
    }
}