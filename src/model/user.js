import mongoose, { Schema } from "mongoose";

const bankSchema = new Schema(
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
    },{_id: false}
)

const userSchema = new Schema(
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
            required: true
        },
        bankQr:{
            type: String
        },
        slipImage: {
            type: String,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "received", "not-received", "transferred"],
            default: "pending"
        }
    },{timestamps: true}  
)

export const User = mongoose.model("User",userSchema) 