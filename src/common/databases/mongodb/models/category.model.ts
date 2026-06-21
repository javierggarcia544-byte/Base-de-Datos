import mongoose, { Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    description: string | undefined;
}

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: [true, "Name is required"],
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
categorySchema.set("toJSON", {
    versionKey: false,
    virtuals: false,
    transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);