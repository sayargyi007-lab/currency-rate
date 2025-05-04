import { Router } from "express";
import { buyController, getAllRates, sellController, updateRateController } from "../controller/exchangeController.js";

const router = Router()

router.post("/admin/rates",getAllRates)
router.put("/admin/update_rate", updateRateController)
router.get("/buy_rate",buyController)
router.get("/sell_rate", sellController)

export default router;