// AboutUs.jsx
import React from "react";
import techno from "../../assets/image/home/techno-2.png"; // Ensure this path is correct
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 rounded-xl shadow-xl">
      {/* Text Section */}
      <div className="flex flex-col items-center md:items-start justify-center max-w-xl space-y-6 text-center md:text-left">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Innovating the Future: Where Technology Meets <span className="text-indigo-600 dark:text-indigo-400">Possibility</span>
        </h2>
        <p className="text-lg md:text-xl font-normal text-gray-700 dark:text-gray-300 leading-relaxed">
          Discover a world where cutting-edge technology transforms everyday
          life. From powerful smartphones and ultra-fast laptops to smart
          wearables and intelligent accessories, innovation is shaping the way
          we live, work, and connect. Stay ahead with devices designed to
          inspire, empower, and simplify your digital experience.
        </p>
       <Link to="/aboutUs">
        <button className=" flex flex-center justify-center mt-6 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-1 hover:scale-105">
          Learn More About Us
        </button>
       </Link>
      </div>

       <div className="w-full md:w-1/2 flex justify-center p-4">
        <img
          src={techno}
          alt="technology devices"
          className="w-full max-w-md h-auto object-contain rounded-xl shadow-2xl transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default AboutUs;