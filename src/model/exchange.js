import mongoose,{Schema} from "mongoose";

const exchangeSchema = new Schema({
    currency: { 
        type: String, 
        required: true, 
        unique: true
        },
    buyRate: { 
        type: Number, 
        required: true
     },
    sellRate: { 
        type: Number, 
        required: true 
    },
    base: { 
        type: String, 
        default: 'MMK' 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
})

export const Exchange = mongoose.model("Exchange",exchangeSchema)