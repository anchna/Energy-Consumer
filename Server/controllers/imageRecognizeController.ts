import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Image } from 'canvas'; // To load images for TensorFlow.js

export const imageRecongnizeHandler = async (req: Request, res: Response): Promise<void> => {
  const file = req.file; // multer stores the file data in req.file

  if (!file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const uploadDir = path.join(__dirname, '..', 'uploads');

  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, file.originalname);

  // Move the file from multer's temporary storage to the desired directory
  fs.renameSync(file.path, filePath);

  try {
    // Load the pre-trained MobileNet model
    const model = await mobilenet.load();

    // Load the image into TensorFlow.js
    const image = await loadImage(filePath);

    // Perform inference on the image to classify it
    const predictions = await model.classify(image);

    // Determine disaster type
    let disasterType = 'Unknown';
    for (const prediction of predictions) {
      const label = prediction.className.toLowerCase();
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

    // Send response
    res.status(200).json({
      message: 'File uploaded and processed successfully',
      fileDetails: {
        originalName: file.originalname,
        savedPath: filePath,
      },
      predictions,
      disasterType,
    });

    // Delete the file after sending the response
    fs.promises.unlink(filePath).catch((err) => {
      console.error(`Error deleting file: ${filePath}`, err);
    });
  } catch (err) {
    console.error('Error processing the image:', err);
    res.status(500).json({ message: 'Error processing the image' });
  }
};

// Helper function to load image with TensorFlow.js
async function loadImage(filePath: string): Promise<any> {
  const image = await fs.promises.readFile(filePath);
  const imageTensor = tf.node.decodeImage(image); // Decode image to tensor
  return imageTensor;
}
