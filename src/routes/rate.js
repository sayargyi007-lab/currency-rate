import { Router } from "express";
import { buyController, deleteController, getAllRates, sellController, updateRateController } from "../controller/exchangeController.js";

const router = Router()

router.post("/admin/rates",getAllRates)
router.post("/admin/update_rate", updateRateController)
router.get("/buy_rate",buyController)
router.get("/sell_rate", sellController)
router.delete("/delete-currency/:currency",deleteController)

export default router;