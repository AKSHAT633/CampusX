import 'dotenv/config'
import express, { application } from "express"
import connectDb from "./config/DB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import notesRouter from "./routes/generateRoute.js";
import CreditRouter from "./routes/creditsRoutes.js";
import { stripeWebhook } from "./controllers/credits.controllers.js";
import itemRouter from "./routes/itemRoutes.js";
import marketplaceRouter from "./routes/MarketRoues.js";
import messageRouter from './routes/messageRoutes.js';
import { app, server } from './socket.js';

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",   
    credentials: true,
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"]
}));

app.post("/api/credits/webhook",express.raw({type:"application/json"}),
stripeWebhook)



app.get("/",(req,res)=>{
    res.send("server is running... ")
})

const PORT = process.env.PORT;

app.use("/api/user",userRouter);
app.use("/api/notes",notesRouter);
app.use("/api/credits",CreditRouter);
app.use("/api/item",itemRouter);
app.use("/api/marketplace",marketplaceRouter);
app.use("/api/user",messageRouter)

server.listen(PORT , ()=>{
    connectDb();
    console.log(`server is running on this PORT ${PORT}`);
})