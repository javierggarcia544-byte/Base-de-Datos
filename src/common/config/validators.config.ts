import mongoose from "mongoose"

export class ValidatorsConfig {
    static isMongoId(id: string) {
        return mongoose.Types.ObjectId.isValid(id)
    }
}