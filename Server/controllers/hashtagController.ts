import { Request, Response } from "express";
import axios from "axios";
import Image from "../db/Schema/ImageSchema"; // Adjust the path to your Mongoose model

export const hashtagHandler = async (req: Request, res: Response): Promise<void> => {
  const { hashtag } = req.body; // Extract the hashtag from the request body
  const accessKey = 'PXFPb1d4EOBd4vwHYAwQiwyCidy9-2XDkGtVVThWBMs'; // Replace with your Unsplash API key
  const url = `https://api.unsplash.com/search/photos`;

  try {
    // Fetch data from Unsplash API using the hashtag as a query parameter
    const apiResponse = await axios.get(url, {
      params: {
        query: hashtag, // Use the hashtag as a search query
        per_page: 10 // Limit the number of results (adjust as needed)
      },
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    });

    // Extract URLs from the response
    const imageUrls = apiResponse.data.results.map((image: any) => image.urls.regular);

    // Save images to the database
    const newImageEntry = new Image({
      hashtag,
      urls: imageUrls
    });

    await newImageEntry.save();

    // Send the array of URLs to the frontend
    res.json({ urls: imageUrls });
  } catch (error) {
    console.error('Error fetching or saving images:', error);
    res.status(500).json({ error: 'Failed to fetch or save images' });
  }
};
