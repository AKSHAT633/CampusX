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

import { app, server } from './socket.js';
import messageRouter from './routes/messageRoutes.js';

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
  "https://campus-sync-gamma.vercel.app",
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api/message",messageRouter);


server.listen(PORT , ()=>{
    connectDb();
    console.log(`server is running on this PORT ${PORT}`);
})
