import {app} from "./app.js"
import dotenv from "dotenv"
import { connectDb } from "./db/index.js"
import fs from "fs"
import path from "path"

const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

dotenv.config({
    path:".env"
})

const PORT = process.env.PORT||8000

connectDb()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((err)=>console.log("Db connection error at index.js",err)
)




