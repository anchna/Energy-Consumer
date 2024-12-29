import { data } from "@tensorflow/tfjs-node";
import Image from "../db/Schema/ImageSchema"
import { Request,Response } from "express";
export const imageHandler =async(req:Request,res:Response)=>{
try {
    const response = await  Image.find({});
    console.log("Requset coming ");
    console.log(response)
    if(response){
        res.json({data:response}).status(200);
    }else{
        res.json({data:"Internal Server error"}).status(500);
    }
    
} catch (error) {
    console.log(error)
    res.json({message:error}).status(500);
}
   
}