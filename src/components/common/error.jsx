import React from 'react';
import { Link } from 'react-router-dom'; // Ensure Link is imported
import error from "../../assets/image/home/error.png";

const Index = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6 bg-cover bg-center relative" // Changed justify-start to justify-center and removed pt-20
      style={{ backgroundImage: `url(${error})` }}
    >
       <nav className="absolute top-6 left-6 flex items-center text-sm text-gray-600 space-x-2 text-white bg-black bg-opacity-40 px-3 py-1 rounded-md">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="font-semibold text-white">Error</span>
      </nav>

       <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-xl text-center max-w-md mx-auto">
        <h1 className="text-7xl font-extrabold text-red-500 mb-4 animate-pulse">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">PAGE NOT FOUND</h2>
        <p className="text-white text-lg mb-6">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
};

export default Index;
