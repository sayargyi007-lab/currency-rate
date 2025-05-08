import express from 'express';
import cors from 'cors'
import route from "./routes/rate.js"
import paymentRoute from "./routes/paymentMethod.js"

const app = express()

const allowedOrigins = [process.env.ORIGIN, 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))

app.use("/api",route)
app.use("/payment",paymentRoute)

export {app};