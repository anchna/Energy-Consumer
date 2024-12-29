import React, { useState } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../providers/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

const HeaderComponent = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(false);

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 w-full p-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <div>
        <Link to="/">
          <img
            className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
            src="../../public/logo.png"
            alt="Logo"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-6">
        <Link
          className="text-white font-semibold px-4 py-2 rounded-lg bg-opacity-80 hover:bg-opacity-100 hover:bg-purple-700 transition-all"
          to="/"
        >
          Home
        </Link>
        <Link
          className="text-white font-semibold px-4 py-2 rounded-lg bg-opacity-80 hover:bg-opacity-100 hover:bg-purple-700 transition-all"
          to="/about"
        >
          About
        </Link>
        <Link
          className="text-white font-semibold px-4 py-2 rounded-lg bg-opacity-80 hover:bg-opacity-100 hover:bg-purple-700 transition-all"
          to="/hashtag"
        >
          HashTag Search
        </Link>
        
        <Link
          className="text-white font-semibold px-4 py-2 rounded-lg bg-opacity-80 hover:bg-opacity-100 hover:bg-purple-700 transition-all"
          to="/image-recognition"
        >
          Image Recognition
        </Link>
      </div>

      {/* Card Button */}
      <div className="relative">
     {  user  ?  <Button
          className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-all"
          onClick={() => setShowCard(!showCard)}
        >
         User
        </Button>
          :<Button onClick={()=>{
            navigate('/login')
          }}>Login</Button>    
    }

        {   showCard && (
          <div className="absolute top-full mt-2 right-0 w-96 bg-white shadow-lg rounded-lg border border-gray-300 z-50">
            <Card className=" flex flex-col items-center justify-around">
              <CardHeader>
                <CardTitle className=' text-center'>Hi  {user?.name.toUpperCase()}</CardTitle>
                <CardDescription className=' font-bold text-xl'>{user?.email}.</CardDescription>
              </CardHeader>
              
              <CardFooter className="flex items-center justify-center">
                <Button
                  className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                  onClick={() => {setShowCard(false)
                   
                        setUser(null);
                        localStorage.clear();
                        navigate('/login')
                     
                  }}
                >
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderComponent;
