import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '../components/ui/form';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';
// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ImageData {
  file: File | null;
}

const Image_Classification = () => {
  const form = useForm<ImageData>({
    defaultValues: {
      file: null,
    },
  });

  const [selected, setSelected] = useState<boolean | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any[]>( [
  
]);  // Store predictions



const onSubmit = async (data:ImageData) => {
  if (data.file) {
    // Create FormData object
    const formData = new FormData();
    formData.append('file', data.file);

    // Create the Axios promise
    const myPromise = axios.post('http://localhost:4000/image-recognize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Use toast.promise to handle the promise with loading, success, and error messages
    toast.promise(myPromise, {
      loading: 'Processing your image...',
      success: 'Prediction successful!',
      error: 'Error when processing image',
    })
    .then((res) => {
      // Handle the response and set predictions
      setPredictions(res.data.predictions);
 
    })
    .catch((err) => {
      // Handle errors if needed
      console.error(err);
    });
  }
};


  // Prepare data for the bar chart
  const chartData = {
    labels: predictions.map((prediction) => prediction.className),
    datasets: [
      {
        label: 'Prediction Probability',
        data: predictions.map((prediction) => prediction.probability),
        backgroundColor: (context:any) => {
          const chart = context.chart;
          const ctx = chart.ctx;

          // Create a gradient
          const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');  // blue-500
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.8)');  // purple-600

          return gradient;
        },
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 h-[91.5vh] flex items-center justify-center p-4">
        
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Image Recognition
          </h1>

          {/* Image Preview Div */}
          <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center mb-6 overflow-hidden">
            {!selected ? (
              <p className="text-gray-400 font-medium text-center">
                No Image Selected
              </p>
            ) : (
              previewURL && (
                <img
                  src={previewURL}
                  alt="Selected Preview"
                  className="h-full w-full object-contain"
                />
              )
            )}
          </div>

          {/* Predictions and Graph */}
          

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4">
              <FormField
                name="file"
                control={form.control}
                render={({ field }) => (
                  <>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Upload an Image
                    </label>
                    <input
                    
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 cursor-pointer"
                      onChange={(e) => {
                        const selectedFile = e.target.files ? e.target.files[0] : null;
                        field.onChange(selectedFile);
                        setSelected(!!selectedFile);

                        // Generate a preview URL
                        if (selectedFile) {
                          const url = URL.createObjectURL(selectedFile);
                          setPreviewURL(url);
                        } else {
                          setPreviewURL(null);
                        }
                      }}
                    />
                  </>
                )}
              />
              <Button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 transition"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
        {predictions.length>0 && 
            <div className="mb-6  bg-white shadow-lg rounded-lg p-4 w-full max-w-lg ml-10">
              <h3 className="text-2xl font-bold text-center">Predictions</h3>
              <Bar 
  data={chartData} 
  options={{
    responsive: true, 
    maintainAspectRatio: true, 
    animation: { duration: 300 }, // Reduce animation duration
  }} 
  height={300} 
/>

              
            </div>
}
      </div>
    </>
  );
};

export default Image_Classification;
