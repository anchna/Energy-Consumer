import express, { Request, Response } from 'express';
import 'dotenv/config';

import { ConnectDb } from './db/ConnectDb';
import authRoutes from "./routes/auth";
import hashtag from './routes/hashtag';
import geoLocation from './routes/geoLocation';
import {imageRecongnizeHandler} from './controllers/imageRecognizeController';
import cors from 'cors';
import multer from 'multer';
import ImageHandle from './routes/iamgGet';
const upload = multer({dest:'./uploads'})
const app = express();
app.use(cors())

app.use(express.json());

const PORT: number = parseInt(process.env.PORT || "3000", 10);


ConnectDb();
 app.get("/health",(req:Request,res:Response)=>{
    res.json({message:"working fine "}).status(200);
 })


app.use("/auth", authRoutes);
app.use('/hashtag',hashtag);
app.use('/geoLocation',geoLocation);
app.use('/image-recognize', upload.single('file'),imageRecongnizeHandler);
app.use('/get-image',ImageHandle);
app.listen(PORT, () => {
  console.log(`Http server is listening on the port ${PORT}`);
});
