import mongoose, { Schema } from "mongoose";

export interface ISupplier extends Document {
    name: string;
    email: string;
    phone: string;
    address: string | undefined;
}

const supplierSchema = new Schema<ISupplier>({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
    },
    address: {
        type: String,
        maxlength: [200, "Address cannot exceed 200 characters"]
    }
},
    {
        timestamps: true
    }
);

supplierSchema.set("toJSON", {
    versionKey: false,
    virtuals: false,
    transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const Supplier = mongoose.model<ISupplier>("Supplier", supplierSchema);
