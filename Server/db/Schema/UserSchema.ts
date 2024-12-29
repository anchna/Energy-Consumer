import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {

  email: string;
  password: string;
  name: string;
}

const userSchema: Schema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Simple email regex
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
  },
  name: {
    type: String,
    required: true,
  },
});


const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
