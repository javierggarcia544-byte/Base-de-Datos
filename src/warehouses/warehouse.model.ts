import mongoose, { Schema, Document } from "mongoose";

export interface IWarehouse extends Document {
    name: string;
    location: string;
    products: mongoose.Types.ObjectId[];
}

const warehouseSchema = new Schema<IWarehouse>({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    location: {
        type: String,
        required: [true, "Location is required"],
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
    }],
},
    {
        timestamps: true,
    }
);

warehouseSchema.set("toJSON", {
    versionKey: false,
    virtuals: false,
    transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const Warehouse = mongoose.model<IWarehouse>("Warehouse", warehouseSchema);
