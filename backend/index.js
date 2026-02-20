import express, { application } from "express"
import dotenv from "dotenv"
import connectDb from "./config/DB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import notesRouter from "./routes/generateRoute.js";
import CreditRouter from "./routes/creditsRoutes.js";
import { stripeWebhook } from "./controllers/credits.controllers.js";
import itemRouter from "./routes/itemRoutes.js";
import marketplaceRouter from "./routes/MarketRoues.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

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

app.listen(PORT , ()=>{
    connectDb();
    console.log(`server is running on this PORT ${PORT}`);
})