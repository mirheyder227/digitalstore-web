import React, { useEffect, useState } from "react";
import Hero from "../../components/common/hero";
import { brend } from "../js/db";
import Advertising from "../../components/common/advertising";
import { getAllProducts } from "../../api/product";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";
import { AboutUs } from "../../components"; // AboutUs komponenti saxlanıldı

const categories = ["Phone", "Computer", "Smart Watch", "Earphone"];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [currentUser, setCurrentUser] = useState(null); // Userə aid olduğu üçün silindi

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    // const loadUserData = () => { // Userə aid olduğu üçün silindi
    //   try {
    //     const storedUser = localStorage.getItem("user");
    //     if (storedUser) {
    //       setCurrentUser(JSON.parse(storedUser));
    //     }
    //   } catch (error) {
    //     console.error("Failed to parse user data from localStorage:", error);
    //     localStorage.removeItem("user");
    //   }
    // };

    fetchProducts();
    // loadUserData(); // Load user data when component mounts // Userə aid olduğu üçün silindi
  }, []);

  const productsByCategory = categories
    .map((category) =>
      products.find((product) => product.category === category)
    )
    .filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 animate-pulse"
              key={index}
            >
              <Skeleton.Image className="w-full h-48 mb-4 rounded-md bg-gray-200 dark:bg-gray-700" />
              <Skeleton
                active
                paragraph={{ rows: 2 }}
                title={false}
                className="mt-4"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-gray-900 dark:text-white bg-fixed bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1611175694984-df2c22b130c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {/* Abstract Blur Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full opacity-20 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

      {/* Hero Section */}
      <Hero />

      {/* Advertising Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-gray-900 bg-opacity-70 rounded-3xl max-w-7xl mx-auto my-12">
        <h2 className="text-4xl font-extrabold text-white mb-12">
          What makes our brand{" "}
          <span className="text-yellow-400">different</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {brend.map(({ id, img, title, text, link }) => (
            <Advertising
              key={id}
              img={img}
              title={title}
              text={text}
              link={link}
            />
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 bg-opacity-80 rounded-3xl max-w-7xl mx-auto my-12">
        <h1 className="text-5xl font-extrabold mb-16 text-center text-white">
          Our <span className="text-yellow-400">Popular</span> Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productsByCategory.map((product) => (
            <Link
              to={`/product/${product.id || product._id}`}
              key={product.id || product._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col group border border-gray-200 dark:border-gray-700"
            >
              <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={
                    product.imageUrl // product.imageUrl should now be the full Cloudinary URL
                      ? product.imageUrl
                      : "https://placehold.co/400x300?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x300?text=No+Image";
                  }}
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 text-2xl font-extrabold mb-3">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {product.description ||
                    "No description provided for this product."}
                </p>
              </div>
              <div className="p-5 pt-0">
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 transform hover:scale-105">
                  View Product
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full bg-gradient-to-br from-gray-800 to-gray-900 py-24 px-6 mt-24 relative overflow-hidden rounded-3xl mx-auto max-w-7xl shadow-3xl border border-gray-700">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-500 rounded-full opacity-10 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 text-center md:text-left">
          <div className="flex flex-col md:w-3/5 gap-6">
            <h3 className="font-extrabold text-white text-5xl md:text-6xl leading-tight drop-shadow-lg">
              Unlock Exclusive{" "}
              <span className="text-yellow-400">Insights</span> &{" "}
              <span className="text-sky-400">Offers</span>!
            </h3>
            <p className="font-light text-gray-300 text-xl md:text-2xl leading-relaxed opacity-95">
              Subscribe to our premium newsletter and be the first to receive
              early access to new product launches, member-only discounts,
              in-depth industry reports, and invitations to exclusive webinars &
              events. Don't miss out!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-center w-full md:w-2/5 max-w-md">
            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Your email address"
              className="w-full border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-4 focus:ring-green-400 focus:border-green-400 rounded-xl p-5 outline-none transition-all duration-300 shadow-xl text-lg font-medium tracking-wide"
            />
            <button className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 active:from-blue-800 active:to-blue-950 border border-blue-600 text-white font-extrabold py-5 px-12 rounded-xl shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105 text-xl tracking-wider uppercase flex items-center justify-center gap-2">
              Subscribe
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <AboutUs />
      </section>
    </div>
  );
};

export default Home;