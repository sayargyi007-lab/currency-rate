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


import fs from "fs";
import { Exchange } from "../models/Exchange.js";
import { Payment } from "../models/Payment.js";
import { uploadToCloudinary } from "../utils/upload.js"; // assuming you have this

export const upsertPaymentMethod = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  const { currency, accountName, accountNumber, bankName } = req.body;

  let qrImageUrl = "";
  const qrImageUrl_path = req.files.qrImageUrl?.[0]?.path;

  // Validate required fields
  if (!currency || !accountName || !accountNumber || !bankName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Ensure currency exists in the Exchange database
    let existedInExchange = await Exchange.findOne({ currency: currency.toUpperCase() });
    if (!existedInExchange) {
      existedInExchange = await Exchange.create({
        currency: currency.toUpperCase(),
        buyRate: 0,
        sellRate: 0,
        updatedAt: new Date(),
      });
    }

    // Upload QR image if provided
    if (qrImageUrl_path && fs.existsSync(qrImageUrl_path)) {
      try {
        qrImageUrl = await uploadToCloudinary(qrImageUrl_path);
      } catch (error) {
        console.error("Cloudinary upload error:", error);
      } finally {
        // Clean up local file
        fs.unlinkSync(qrImageUrl_path);
      }
    }

    // Save payment method
    const bank = { accountName, accountNumber, bankName };

    const updatedPayment = await Payment.findOneAndUpdate(
      { currency: currency.toUpperCase() },
      { qrImageUrl, bank },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Payment method is updated/added successfully",
      updatedPayment,
    });

  } catch (error) {
    // Clean up local temp file on failure
    if (qrImageUrl_path && fs.existsSync(qrImageUrl_path)) {
      fs.unlinkSync(qrImageUrl_path);
    }

    console.error("Error updating payment method:", error);
    res.status(500).json({
      message: "Error updating/adding payment method",
      error: error.message,
    });
  }
};






// export const upsertPaymentMethod = async (req, res) => {
//   console.log("BODY:", req.body);
//   console.log( req.files);

//   const { currency, accountName, accountNumber, bankName } = req.body;

//   let qrImageUrl = "";
//   const qrImageUrl_path = req.files.qrImageUrl?.[0].path;

//   if (!currency || !accountName || !accountNumber || !bankName) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     const existedInExchange = await Exchange.findOne({ currency: currency.toUpperCase() });
//     if (!existedInExchange) {
//       return res.status(404).json({ message: "Please add that currency in the Exchange Rate" });
//     }

//     if (qrImageUrl_path && fs.existsSync(qrImageUrl_path)) {
//      try {
//        qrImageUrl = await uploadToCloudinary(qrImageUrl_path);
       
//      } catch (error) {
//       console.log(error);
      
//       fs.unlink(qrImageUrl_path);

//      } // remove local temp file after upload
//     }

//     const bank = { accountName, accountNumber, bankName };

//     const updatedPayment = await Payment.findOneAndUpdate(
//       { currency: currency.toUpperCase() },
//       { qrImageUrl, bank },
//       { new: true, upsert: true }
//     );

//     res.status(200).json({
//       message: "Payment method is updated/added successfully",
//       updatedPayment,
//     });
//   } catch (error) {
//     // Clean up temp file if any
//     if (qrImageUrl_path && fs.existsSync(qrImageUrl_path)) {
//       fs.unlinkSync(qrImageUrl_path);
//     }

//     res.status(500).json({
//       message: "Error updating/adding payment method",
//       error: error.message,
//     });
//   }
// };


// export const upsertPaymentMethod = async (req, res) => {
//   console.log("BODY:", req.body);
// console.log("FILES:", req.files);

//   const { currency,  accountName, accountNumber, bankName  } = req.body

//    let qrImageUrl = ""
//    const qrImageUrl_path = req.files.qrImageUrl?.[0].path;


//   if(!currency ||   !accountName || !accountNumber || !bankName){
//     return res.status(400).json({message:"All fields are required"})
//   }


//   try {
    
//     const existedInExchange = await Exchange.findOne({ currency: currency.toUpperCase() })
//     if (!existedInExchange) {
//       return res.status(404).json({ message: "Please add that currency in the Exchange Rate" })
//     }

//     if(qrImageUrl_path){
//       qrImageUrl = await uploadToCloudinary(qrImageUrl_path)
//     }

//     const bank = {accountName, accountNumber, bankName }
    
//     const updatedPayment = await Payment.findOneAndUpdate(
//       { currency: currency.toUpperCase() },
//       { qrImageUrl, bank },
//       { new: true, upsert: true } 
//     )

//     res.status(200).json({ message: "Payment method is updated/added successfully", updatedPayment })

//   } catch (error) {
    
//     fs.unlinkSync(qrImageUrl)
//     res.status(500).json({ message: 'Error updating/adding payment method', error })
//   }
// }
