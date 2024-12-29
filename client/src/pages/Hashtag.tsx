import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const Hashtag = () => {
  const [searchTerm, setSearchTerm] = useState(""); // To store the user input for search
  const [images, setImages] = useState([]); // To store the images fetched from the database
  const [loading, setLoading] = useState(false); // To show a loading spinner
  const [error, setError] = useState(""); // To handle errors
interface imageResponseFromDataBase{
   _id:string,
   hashtag:string,
   urls:Array<any>


}

  // Fetch images from the database on component mount
  const fetchImagesFromDatabase = async () => {
    try {
      setLoading(true);
      console.log("Sending the Requse")
      const response = await axios.post("http://localhost:4000/get-image");
      setImages(response.data.data); // Assuming `data` is the array of image objects
      setLoading(false);
      console.log(response)
    } catch (error) {
      console.error("Error fetching images from the database:", error);
      setError("Failed to load images. Please try again later.");
      setLoading(false);
    }
  };
  

  // Fetch new images from the Unsplash API and save to the database
  const fetchNewImages = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a valid hashtag.");
      toast.error("Enter a valid hashtag");
      return;
    }
    try {
      setError(""); // Clear any previous errors
      setLoading(true);
      await axios.post("http://localhost:4000/hashtag", {
        hashtag: searchTerm,
      });
      fetchImagesFromDatabase(); // Refresh images from the database after adding new ones
      setSearchTerm(""); // Clear the search input
    } catch (error) {
      console.error("Error fetching new images:", error);
      setError("Failed to fetch new images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load database images on component mount
  useEffect(() => {
    fetchImagesFromDatabase();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Hashtag Image Viewer</h1>

      {/* Search Input */}
      <div className="flex justify-center items-center mb-4">
        <input
          type="text"
          className="border rounded-lg px-4 py-2 w-1/2"
          placeholder="Enter a hashtag (e.g., nature)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={fetchNewImages}
          disabled={loading}
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {/* Image Grid */}
      <div className="flex justify-center items-center flex-col">
        {images.length > 0 ? (
          images.map((image:imageResponseFromDataBase) => (
            <div
              key={image._id}
              className="bg-white p-3 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="m-2 text-lg font-bold text-center p-2 bg-blue-100 rounded-t-lg">
                #{image.hashtag}
              </h3>
              <div className="p-2  w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {image.urls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={image.hashtag}
                    className="w-full h-48 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center text-gray-500">No images found.</p>
        )}
      </div>
    </div>
  );
};

export default Hashtag;
