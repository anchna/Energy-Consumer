import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Image } from 'canvas';  // To load images for TensorFlow.js

export const imageRecongnizeHandler = async (req: Request, res: Response): Promise<void> => {
  const file = req.file; // multer stores the file data in req.file
  if (!file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  // Log the file information (for debugging purposes)
  console.log(file);

  // Set a path to save the file on the server (ensure the directory exists)
  const uploadDir = path.join(__dirname, '..', 'uploads');
  
  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Set the path where the file will be saved
  const filePath = path.join(uploadDir, file.originalname);

  // Move the file from multer's temporary storage to the desired directory
  fs.renameSync(file.path, filePath); // Move the file from tmp location to permanent location

  // Load the pre-trained MobileNet model
  const model = await mobilenet.load();

  // Load the image into TensorFlow.js (this step might require some conversion)
  const image = await loadImage(filePath);

  // Perform inference on the image to classify it
  const predictions = await model.classify(image);

  // Log predictions (for debugging)
  console.log('Predictions:', predictions);

  // Now, you can decide how to classify the image based on the model's predictions
  let disasterType = 'Unknown';
  for (const prediction of predictions) {
    const label = prediction.className.toLowerCase();
    
    // Check for disaster-related keywords
    if (label.includes('fire')) {
      disasterType = 'Fire';
    } else if (label.includes('flood')) {
      disasterType = 'Flood';
    } else if (label.includes('earthquake')) {
      disasterType = 'Earthquake';
    } else if (label.includes('tornado')) {
      disasterType = 'Tornado';
    } else if (label.includes('storm')) {
      disasterType = 'Storm';
    }
  }

  const topPredictions = predictions.slice(0, 5); // Limit to top 5 predictions
  res.json({
    message: 'File uploaded and processed successfully',
    fileDetails: {
      originalName: file.originalname,
      savedPath: filePath,
    },
    predictions: topPredictions,  // Send only top predictions
  }).status(200);
  
};

// Helper function to load image with TensorFlow.js
async function loadImage(filePath: string): Promise<any> {
  const image = await fs.promises.readFile(filePath);
  const imageTensor = tf.node.decodeImage(image); // Decode image to tensor
  return imageTensor;
} 