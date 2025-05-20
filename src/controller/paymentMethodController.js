import { Exchange } from "../model/exchange.js"
import { Payment } from "../model/paymentMethod.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import fs from "fs"

export const getPaymentMethodByCurrency = async(req,res)=>{
    const {currency} = req.params
    try {
        const existed = await Payment.findOne({currency: currency.toUpperCase()})
        if(!existed){
            return res.status(404).json({message:"The currency is not found"})
        }
        return res.status(200).json({existed})
    } catch (error) {
        return res.status(500).json({message:"Error at fetching payment method"})
    }
}

export const deletePaymentMethod = async (req, res) => {
    const { currency } = req.params
    try {
      await Payment.deleteOne({ currency: currency.toUpperCase() })
      res.status(200).json({ message: 'Payment method deleted' })
    } catch (error) {
      res.status(500).json({ message: 'Error deleting payment method'})
    }
}



export const upsertPaymentMethod = async (req, res) => {
  console.log("BODY:", req.body);
console.log("FILES:", req.files);

  const { currency,  accountName, accountNumber, bankName  } = req.body

   let qrImageUrl = ""
   const qrImageUrl_path = req.files.qrImageUrl?.[0].path;


  if(!currency ||   !accountName || !accountNumber || !bankName){
    return res.status(400).json({message:"All fields are required"})
  }


  try {
    
    const existedInExchange = await Exchange.findOne({ currency: currency.toUpperCase() })
    if (!existedInExchange) {
      return res.status(404).json({ message: "Please add that currency in the Exchange Rate" })
    }

    if(qrImageUrl_path){
      qrImageUrl = await uploadToCloudinary(qrImageUrl_path)
    }

    const bank = {accountName, accountNumber, bankName }
    
    const updatedPayment = await Payment.findOneAndUpdate(
      { currency: currency.toUpperCase() },
      { qrImageUrl, bank },
      { new: true, upsert: true } 
    )

    res.status(200).json({ message: "Payment method is updated/added successfully", updatedPayment })

  } catch (error) {
    if (qrImageUrl_path) {
      try {
        fs.unlinkSync(qrImageUrl_path);
      } catch (unlinkErr) {
        console.error("Error deleting temp file:", unlinkErr.message);
      }
    }

    console.error("Upload error:", error);
    return res.status(500).json({ message: "Error updating/adding payment method", error });
  
  }
}
