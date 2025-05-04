import mongoose from "mongoose";

export const connectDb = async() =>{
    try {
        const connectionResponse = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log("Db connection successful",connectionResponse.connection.host)
    } catch (error) {
        console.log("Db connection error at connectdb",error);
        process.exit(1) 
    }
}