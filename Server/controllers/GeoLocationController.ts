import { Request,Response } from "express";
import mongoose from "mongoose";
export const geoLocationHandler = async (req:Request,res:Response):Promise<void> =>{
    //her we have to return the photos that are geolcoations
    const {location} =req.body;
   res.json({message:location}).status(200);
}
