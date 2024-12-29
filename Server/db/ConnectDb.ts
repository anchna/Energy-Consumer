import mongoose from "mongoose";
export const ConnectDb = async() : Promise<void>  =>{
    try {
      await  mongoose.connect(process.env.MONGODB_URI ||"");
      console.log('Database Connected Succesfuuly ')
    } catch (error) {
        console.log("Error Connecting database",error)
    }
}