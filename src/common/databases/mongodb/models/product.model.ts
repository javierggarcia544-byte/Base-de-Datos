import mongoose, { Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    stock: number;
    category: mongoose.Types.ObjectId;
    description: string | undefined;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        min: [0, "Stock cannot be negative"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"],
    },
    description: {
        type: String,
        maxlength: [200, "Description cannot exceed 200 characters"]
    }
},
    {
        timestamps: true
    }
);

// delete __v and change _id to id
productSchema.set("toJSON", {
    versionKey: false,
    virtuals: false,
    transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const Product = mongoose.model<IProduct>("Product", productSchema);