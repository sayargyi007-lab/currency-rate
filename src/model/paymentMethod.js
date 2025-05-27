import mongoose, { Schema } from "mongoose";

const bankSchema = new Schema({
    accountName: { 
        type: String, 
        required: true
    },
    accountNumber: { 
        type: String, 
        required: true
    },
    bankName: { 
        type: String, 
        required: true 
    }
},{_id: false})


const paymentSchmea = new Schema({
    currency:{
        type: String,
        required: true,
        unique: true
    },
    qrImageUrl:{
        type: String,
        required: true
    },
    bank:{
        type: bankSchema,
        required: true
    }
},{timestamps: true})

export const Payment = mongoose.model("Payment", paymentSchmea)