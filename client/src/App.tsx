import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Image_Classification from './pages/Image_Classification';
import Hashtag from './pages/Hashtag';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Home Page Route */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
     
      <Route path="/image-recognition" element={<Image_Classification />} />
      <Route path="/hashtag" element={<Hashtag />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default App;
