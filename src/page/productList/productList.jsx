import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../api/product";
import { Skeleton, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/reducer/cartSlice";
import { ShoppingCartOutlined, StarFilled, FireFilled } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

// Custom Notification Component
const Notification = ({ title, message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-6 right-6 z-50 pointer-events-none"
    >
      <div
        className={`p-4 rounded-xl shadow-xl ${bgColor} text-white flex items-start space-x-3 max-w-sm pointer-events-auto`}
        role="alert"
      >
        <div className="flex-1">
          <h4 className="font-bold text-lg">{title}</h4>
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-xl leading-none text-white opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>
    </motion.div>
  );
};

const ProductList = () => {
  const dispatch = useDispatch();
  // Ensure cartItems is always an array, even if undefined initially
  const cartItems = useSelector(state => state.cart?.items || []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notification, setNotification] = useState(null);

  const getCartQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item._id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  const showNotification = useCallback((title, message, type = "success") => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = useCallback((product) => {
    const currentQuantity = getCartQuantity(product._id);
    dispatch(addToCart({ ...product, quantity: 1 }));
    showNotification(
      `${product.name} added to cart!`,
      `You now have ${currentQuantity + 1} of ${product.name} in your cart.`,
      "success"
    );
  }, [dispatch, getCartQuantity, showNotification]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean));
    return ["all", ...Array.from(uniqueCategories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
              <Skeleton.Image active className="!w-full !h-60 rounded-t-2xl" />
              <div className="p-5">
                <Skeleton active paragraph={{ rows: 2 }} title={false} />
                <Skeleton.Button active size="large" className="!w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4"
      >
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-6xl mb-4" role="img" aria-label="Sad face emoji">😞</div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">Error Occurred!</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      {/* Floating Notification */}
      <AnimatePresence>
        {notification && (
          <Notification
            title={notification.title}
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Discover Amazing Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Handpicked collection of premium quality items for your everyday needs
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 overflow-x-auto pb-3 scrollbar-hide"
        >
          <div className="flex space-x-3 justify-center min-w-max px-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-6 py-2 rounded-full font-medium text-sm md:text-base transition-all duration-300 ease-in-out
                  ${selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
              >
                {category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto p-4"
          >
            <div className="text-6xl mb-6" role="img" aria-label="Magnifying glass emoji">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We couldn't find any products in this category. Try another one!
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              View All Products
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ y: -6, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col cursor-pointer"
              >
                {/* Product Image with Badges */}
                <Link
                  to={`/product/${product._id || product.id}`}
                  className="relative block w-full h-60 overflow-hidden"
                >
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/600x400.png?text=Image+Coming+Soon"}
                    alt={product.name || "Product image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/600x400.png?text=Image+Load+Error";
                    }}
                  />

                  {/* Product Badges (Improved positioning/stacking if multiple) */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {product.isNew && (
                      <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-md">
                        <StarFilled className="mr-1 text-sm" /> NEW
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="bg-purple-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-md">
                        <StarFilled className="mr-1 text-sm" /> FEATURED
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-md">
                        <FireFilled className="mr-1 text-sm" /> BESTSELLER
                      </span>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="mb-3">
                    {product.category && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    )}
                    <Link to={`/product/${product._id || product.id}`} className="block">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors duration-200 leading-tight">
                        {product.name || "Unknown Product"}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {product.description || "No description available."}
                    </p>
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-2xl md:text-3xl font-extrabold text-gray-900">
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </span>
                      {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${parseFloat(product.originalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                      aria-label={`Add to cart: ${product.name}`}
                    >
                      <ShoppingCartOutlined className="text-lg md:text-xl" />
                      {getCartQuantity(product._id) > 0 && (
                        <Badge
                          count={getCartQuantity(product._id)}
                          className="absolute -top-1 -right-1"
                          style={{ backgroundColor: '#ff4d4f', boxShadow: '0 0 0 2px #fff' }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View More Button */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: filteredProducts.length * 0.05 + 0.2 }}
            className="text-center mt-16"
          >
            <button className="px-10 py-3.5 bg-white text-blue-600 font-semibold rounded-full border border-blue-200 hover:bg-blue-50 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              Load More Products
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductList;