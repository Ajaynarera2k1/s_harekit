import { model,  Schema} from "mongoose";

const planSchema = new Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    storage: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {timestamps: true})

const PlanModel = model("Plan", planSchema)
export default PlanModel