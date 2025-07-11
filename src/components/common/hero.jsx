// Hero.jsx
import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/image/home/electronic.png";

const Hero = () => {
  return (
    <div className="
      flex flex-col md:flex-row items-center justify-center
      py-16 px-4 sm:px-6 lg:px-8 xl:px-12 gap-10
      bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900
      min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-100px)] rounded-b-3xl shadow-xl
    ">
      {/* Text Section */}
      <div className="
        w-full md:w-1/2
        text-center md:text-left
        space-y-6
        max-w-xl md:max-w-2xl
        p-4 md:p-0
      ">
        <h2 className="
          text-4xl md:text-5xl lg:text-6xl
          font-extrabold text-gray-900 dark:text-white
          leading-tight md:leading-tight lg:leading-tight
        ">
          The <span className="text-indigo-600 dark:text-indigo-400">future</span> of electronics, with timeless designs
        </h2>
        <p className="
          text-base md:text-lg lg:text-xl
          text-gray-700 dark:text-gray-300
          leading-relaxed
        ">
          Discover the latest technology electronics! Smartphones, laptops, tablets, and AirPods headphones are on sale at affordable prices. We offer models for every taste and budget, combining modern design, high quality, and guaranteed products. Order now and take advantage of fast delivery! Limited stock – don't miss out!
        </p>
        <Link to="/productList">
          <button className="
            cursor-pointer
            px-8 py-3
            bg-indigo-600 hover:bg-indigo-700
            active:bg-indigo-800
            border border-indigo-600
            text-white font-semibold
            rounded-lg shadow-lg
            transition duration-300 ease-in-out
            transform hover:-translate-y-1 hover:scale-105
            focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50
          ">
            View Collection
          </button>
        </Link>
      </div>

      {/* Image part */}
      <div className="w-full md:w-1/2 flex justify-center p-4">
        <img
          className="
            w-full max-w-sm md:max-w-md lg:max-w-lg
            h-auto object-contain
            rounded-2xl shadow-2xl
            transition-transform duration-500 ease-in-out
            hover:scale-105
          "
          src={heroImage}
          alt="Modern electronic devices"
        />
      </div>
    </div>
  );
};

export default Hero;