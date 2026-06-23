export class CreateSupplierDto {
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public address: string | undefined,
    ) { }

    static validate(data: { [key: string]: any }): [string | undefined, CreateSupplierDto | undefined] {
        const { name, email, phone, address } = data;

        if (!name) return ["Missing name", undefined];
        if (!email) return ["Missing email", undefined];
        if (!phone) return ["Missing phone", undefined];
        if (address && address.length < 4) return ["Address too short", undefined];

        return [undefined, new CreateSupplierDto(name, email, phone, address)];
    }
}
