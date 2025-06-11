
import { User } from "../model/user.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs"

export const registerController = async (req, res) => {
    console.log(req.files);

    const { bankOwnerName, accountNumber, bankName, fromCurrency, toCurrency, amount } = req.body

    const slipImage_path = req.files.slipImage?.[0].path
    const bankQr_path = req.files.bankQr?.[0].path

    try {
        if (!bankOwnerName || !accountNumber || !bankName || !fromCurrency || !toCurrency || !amount) {  
            res.status(400).json({ message: "All fields are required " });
            throw new Error("All fields are required")
        }

        let slipImage = ""
        let bankQr = ""
        if (slipImage_path || bankQr_path) {
            slipImage = await uploadToCloudinary(slipImage_path)
            bankQr = await uploadToCloudinary(bankQr_path)
        }

        const user = await User.create({
            fromCurrency,
            toCurrency,
            amount,
            slipImage,
            bankQr,
            bank: {
                bankOwnerName,
                accountNumber,
                bankName
            },
        })

        const createdUser = await User.findById(user._id).select();
        if (!createdUser) {
            return res
                .status(500)
                .json({ message: "Something went worng in registration new user." });
        }

        return res
            .status(200)
            .json({ userInfo: createdUser, message: "Registration is success." });

    } catch (error) {
        console.log(error);
        fs.unlinkSync(slipImage_path)
        if (bankQr_path) {
            fs.unlinkSync(bankQr_path);
          }
    }
} 

export const showUserController = async (req,res)=>{
    const {id} = req.params
    try {
        const existed = await User.findById(id)
        if(!existed){
            return res.status(404).json({message:"No User Found"})
        }
        return res.status(200).json(existed)
    } catch (error) {
        return res.status(500).json({message:"Error at finding user"})
    }
}

export const getAllUser = async(req,res)=>{
    try {
        const existed = await User.find()
        if(!existed){
            return res.status(404).json({message:"No User Found"})
        }
        return res.status(200).json(existed)
    } catch (error) {
        console.log("cannot get users" ,error)
        return res.status(500).json({message:"Error at getting users"})
    }
}

export const deleteUser= async (req,res)=>{
    const {id} = req.params

    try {
        await User.deleteOne({_id:id})
        return res.status(200).json({message:"User deleted successfully"})

    } catch (error) {
        return res.status(500).json({message:"Error at deleting user"})
    }
}

export const receivePayment = async (req,res) =>{
    const {id} = req.params

    const existedUser = await User.findById(id)
    if(!existedUser){
        return res.status(404).json({message:"User not found"})

    }
    try {
        const user = await User.findByIdAndUpdate(id,{
            paymentStatus: "received"
        },{new: true})
        return res.status(200).json({message:"Received Payment", user})
    } catch (error) {
        return res.status(500).json({message: "Error at showing reveiving payment"})
    }
}

export const notReceivedPayment = async (req,res) =>{
    const {id} = req.params

    const existedUser = await User.findById(id)
    if(!existedUser){
        return res.status(404).json({message:"User not found"})

    }
    try {
        const user = await User.findByIdAndUpdate(id,{
            paymentStatus: "Not Received"
        },{new: true})
        return res.status(200).json({message:"Transferred Payment", user})
    } catch (error) {
        return res.status(500).json({message: "Error at showing transferring payment"})
    }
}


export const transferPayment = async (req,res) =>{
    const {id} = req.params

    const existedUser = await User.findById(id)
    if(!existedUser){
        return res.status(404).json({message:"User not found"})

    }
    try {
        const user = await User.findByIdAndUpdate(id,{
            paymentStatus: "transferred"
        },{new: true})
        return res.status(200).json({message:"Transferred Payment", user})
    } catch (error) {
        return res.status(500).json({message: "Error at showing transferring payment"})
    }
}


