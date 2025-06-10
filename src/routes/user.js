import { Router } from "express";
import { upload } from "../middlewares/multer-storage.js";
import { deleteUser, getAllUser, receivePayment, registerController, showUserController, transferPayment } from "../controller/userController.js";

const userRoute = Router()

userRoute.post("/create",upload.fields([
    {name:"bankQr",maxCount:1},
    {name:"slipImage",maxCount:1}
]),registerController)
userRoute.get("/get-users",getAllUser)
userRoute.get("/:id",showUserController)

userRoute.delete("/delete/:id",deleteUser)
userRoute.patch("/:id/receive-payment",receivePayment)
userRoute.patch("/:id/transfer-payment",transferPayment)

export default userRoute