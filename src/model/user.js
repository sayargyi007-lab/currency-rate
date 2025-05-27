import mongoose, { Schema } from "mongoose";

const bankSchema = new Schema[
    {
        bankOwnerName:{
            type: String,
            required: true,
            lowercase: true
        },
        accountNumber: { 
            type: String, 
            required: true
        },
        bankName: { 
            type: String, 
            required: true 
        }
    }
]

const userSchema = new Schema[
    {
        fromCurrency:{
            type: String,
            required: true
        },
        toCurrency:{
            type: String,
            required: true
        },
        amount:{
            type: Number,
            required: true
        },
        bank:{
            type: bankSchema,
            requried: true
        },
        bankQr:{
            type: String
        }
    }
]

export const User = mongoose.Schema("User",userSchema) 