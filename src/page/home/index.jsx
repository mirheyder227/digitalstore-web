import React, { useEffect, useState } from "react";
import Hero from "../../components/common/hero";
import { brend } from "../js/db";
import Advertising from "../../components/common/advertising";
import { getAllProducts } from "../../api/product";
import { Link } from "react-router-dom";
import { Skeleton, Badge, Button } from "antd";
import { AboutUs } from "../../components";

const categories = ["Phone", "Computer", "Smart Watch", "Earphone"];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredProduct, setHoveredProduct] = useState(null);

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

    fetchProducts();
  }, []);

  const filteredProducts = activeTab === "all" 
    ? products.slice(0, 4)
    : products.filter(p => p.category === activeTab).slice(0, 4);

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
    <div className="relative w-full min-h-screen text-gray-900 dark:text-white overflow-x-hidden">
      {/* Interactive Particle Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-indigo-500 opacity-10"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <Hero />

      {/* Interactive Category Selector */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              type={activeTab === "all" ? "primary" : "default"}
              shape="round"
              size="large"
              onClick={() => setActiveTab("all")}
              className="transition-all"
            >
              All Products
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                type={activeTab === category ? "primary" : "default"}
                shape="round"
                size="large"
                onClick={() => setActiveTab(category)}
                className="transition-all"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id || product._id}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
                onMouseEnter={() => setHoveredProduct(product.id || product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={product.imageUrl || "https://placehold.co/400x300"}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      hoveredProduct === (product.id || product._id) ? "scale-110" : ""
                    }`}
                  />
                  {hoveredProduct === (product.id || product._id) && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <Link
                        to={`/product/${product.id || product._id}`}
                        className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all"
                      >
                        Quick View
                      </Link>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <Badge 
                      count={product.rating || 4} 
                      style={{ backgroundColor: '#52c41a' }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Flip Brand Cards */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-12">
          Our <span className="text-indigo-600">Brand</span> Advantages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {brend.map(({ id, img, title, text, link }) => (
            <div 
              key={id} 
              className="flip-card h-64"
            >
              <div className="flip-card-inner rounded-xl">
                <div className="flip-card-front bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center shadow-lg rounded-xl">
                  <img src={img} alt={title} className="h-16 w-16 mb-4" />
                  <h3 className="text-xl font-bold text-center">{title}</h3>
                </div>
                <div className="flip-card-back bg-indigo-600 text-white p-6 flex flex-col items-center justify-center rounded-xl">
                  <p className="text-center mb-4">{text}</p>
                  <Link 
                    to={link} 
                    className="px-4 py-2 bg-white text-indigo-600 rounded-full font-bold"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Newsletter */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-2xl overflow-hidden">
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Join Our Tech Community
            </h3>
            <p className="text-indigo-100 mb-6">
              Get exclusive deals and the latest tech news straight to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all">
                Subscribe
              </button>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white rounded-full opacity-10"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white rounded-full opacity-10"></div>
        </div>
      </section>

      <AboutUs />

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:bg-indigo-700 transition-all transform hover:scale-110">
          ↑
        </button>
      </div>

      <style jsx>{`
        .flip-card {
          perspective: 1000px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;