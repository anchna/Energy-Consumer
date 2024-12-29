import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface
interface IImage extends Document {
  hashtag: string;
  urls: string[];
  createdAt: Date;
}

// Define the schema
const ImageSchema: Schema<IImage> = new Schema({
  hashtag: { type: String, required: true },
  urls: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create and export the model
const Image = mongoose.model<IImage>("Image", ImageSchema);
export default Image;
