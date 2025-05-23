import { Router } from "express";
import { deletePaymentMethod, getPaymentMethodByCurrency, upsertPaymentMethod } from "../controller/paymentMethodController.js";
import { upload } from "../middlewares/multer-storage.js";

const paymentRoute = Router()

paymentRoute.get("/:currency",getPaymentMethodByCurrency)
paymentRoute.delete("/:currency",deletePaymentMethod)
paymentRoute.post("/update",
    upload.fields([
        {name:"qrImageUrl",maxCount:1}
    ])
    ,upsertPaymentMethod)

export default paymentRoute