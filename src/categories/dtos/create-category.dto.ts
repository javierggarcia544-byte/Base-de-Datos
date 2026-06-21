export class CreateCategoryDto {
    constructor(
        public name: string,
        public description: string | undefined,
    ) { }

    static validate(data: { [key: string]: any }): [string | undefined, CreateCategoryDto | undefined] {
        const { name, description } = data;

        if (!name) return ["Missing name", undefined];
        if (description && description.length < 4) return ["Description too short", undefined];

        return [undefined, new CreateCategoryDto(name, description)];
    }
}