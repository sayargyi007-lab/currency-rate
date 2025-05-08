import { Router } from "express";
import { deletePaymentMethod, getPaymentMethodByCurrency, upsertPaymentMethod } from "../controller/paymentMethodController.js";

const paymentRoute = Router()

paymentRoute.get("/:currency",getPaymentMethodByCurrency)
paymentRoute.delete("/:currency",deletePaymentMethod)
paymentRoute.put("/update",upsertPaymentMethod)

export default paymentRoute