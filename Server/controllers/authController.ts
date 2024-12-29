import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from "../db/Schema/UserSchema"; 

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_keyasgood";
interface DecodedToken {
  id: string;
  email:string,
  name:string,
  iat: number;
}

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
       res.status(404).json({ message: "User not found" });
       return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
       res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id,email:user.email,name:user.name},JWT_SECRET);
    
    const userWithoutPassword = user.toObject() as { [key: string]: any };
    delete userWithoutPassword.password;
    // Send successful login response along with the user details and token
     res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,  // Sending user details without the password
    });
  } catch (error) {
    console.error("Login error:", error);
     res.status(500).json({ message: "Internal server error" });
  }
};
export const verifyTokenHandler = async(req:Request,res:Response):Promise<void>=>{
  
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming token is sent as 'Bearer <token>'

  if (!token) {
     res.status(400).json({ message: 'No token provided' });
     return 
  }

  try {
    // Verify the token
    const verify: DecodedToken = await jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (!verify) {
       res.status(401).json({ message: 'Invalid Token' });
       return 
    }
   
    res.json({email:verify.email,name:verify.name});

  } catch (error) {
    console.log(error);
     res.status(500).json({ message: 'Internal Server Error' });
     return ;
  }


}
export const registerHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  try {
    const ifUserExists = await UserModel.find({
      $or: [{ email: email }, { name: name }]
    });
    
    if (ifUserExists.length > 0) {
      res.json({message:"User Already Registerd"}).status(300);
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ email, password: hashedPassword, name });
    await newUser.save();

  res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
  res.status(500).json({ message: "Internal server error" });
  }
};
