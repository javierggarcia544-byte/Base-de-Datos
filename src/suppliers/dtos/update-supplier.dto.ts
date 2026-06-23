export class UpdateSupplierDto {
    constructor(
        public name: string | undefined,
        public email: string | undefined,
        public phone: string | undefined,
        public address: string | undefined,
    ) { }

    set fields(data: Partial<UpdateSupplierDto>) {
        const { name, email, phone, address } = data;

        if (name) this.name = name;
        if (email) this.email = email;
        if (phone) this.phone = phone;
        if (address) this.address = address;
    }

    static validate(data: { [key: string]: any }): [string | undefined, UpdateSupplierDto | undefined] {
        const { name, email, phone, address } = data;

        if (name && name.length < 2) return ["Name too short.", undefined];
        if (address && address.length < 4) return ["Address too short", undefined];

        return [undefined, new UpdateSupplierDto(name, email, phone, address)];
    }
}
