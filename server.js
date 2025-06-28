import express from "express"
import adminRouter from "./routes/adminRoutes.js"
import movieRouter from "./routes/movieroute.js";
import authRouter from "./routes/authRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import mongoose from "mongoose";
import 'dotenv/config'

mongoose.connect(process.env.MONGO_URI)
    .then(console.log("Connection Successful"))
    .catch((err) => {
        console.log(err)
    })

const app = express()
app.use(express.json())


app.use("/api/auth", authRouter);
app.use("/api", movieRouter);


app.use("/api/admin", adminRouter);
app.use("/api", bookingRouter);

const port = process.env.PORT;
app.listen(port, () => {
    console.log("Server is Running on Port", port);
})