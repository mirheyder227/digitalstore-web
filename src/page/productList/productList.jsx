import React, { useState, useEffect } from "react";
import { getAllProducts } from "../../api/product";
import { Skeleton, message } from "antd"; // Import message for notifications
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/reducer/cartSlice";
import basketIcon from "../../assets/image/header/basket-image.png";

const categories = ["All", "Phone", "Computer", "Smart Watch", "Earphone", "Charger"];
const PRODUCT_PER_PAGE = 8;

const ProductList = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PRODUCT_PER_PAGE);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category') || "All";

  // Dynamically construct base URL for images
  const API_BASE_URL_FOR_IMAGES = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
    : "http://localhost:5000";

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setVisibleCount(PRODUCT_PER_PAGE);
  }, [categoryFromUrl]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllProducts();
        setProducts(response);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const inCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const price = parseFloat(product.price);
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    const inMinPrice = isNaN(min) || price >= min;
    const inMaxPrice = isNaN(max) || price <= max;

    return inCategory && inMinPrice && inMaxPrice;
  });

  const productsToDisplay = filteredProducts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PRODUCT_PER_PAGE);
  };

  const handleAddToCart = (product, event) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(addToCart(product));
    message.success(`${product.name} added to cart!`); // Use Ant Design message
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(PRODUCT_PER_PAGE)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden p-4">
              <Skeleton.Image style={{ width: "100%", height: "192px" }} />
              <Skeleton active paragraph={{ rows: 2 }} title={false} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 bg-red-100 border border-red-400 rounded-lg mx-auto max-w-md">
        <p className="text-lg font-semibold">{error}</p>
        <p className="text-sm mt-2">Please refresh the page or try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900">Our Products</h2>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-10 p-4 bg-white rounded-xl shadow-lg">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Price Filters */}
        <div className="flex flex-wrap gap-4 justify-center items-center mb-10 p-4 bg-white rounded-xl shadow-lg">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price ($)"
            className="border-2 border-gray-300 p-3 rounded-lg w-36 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-600 text-lg font-semibold">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price ($)"
            className="border-2 border-gray-300 p-3 rounded-lg w-36 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
            }}
            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>

        {/* Products List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productsToDisplay.length > 0 ? (
            productsToDisplay.map((product) => (
              <Link
                to={`/product/${product.id || product._id}`}
                key={product.id || product._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 flex flex-col"
              >
                <img
                  src={
                    product.imageUrl
                      ? `${API_BASE_URL_FOR_IMAGES}${product.imageUrl}` // Use the consistent base URL
                      : "https://placehold.co/400x300?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x300?text=No+Image";
                  }}
                />
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
                    <p className="text-gray-700 text-lg font-semibold mb-3">
                      ${product.price ? parseFloat(product.price).toFixed(2) : "0.00"}
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-3">
                      {product.description || "No description provided for this product."}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="mt-4 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                  >
                    <img src={basketIcon} alt="Basket" className="w-5 h-5 mr-2 text-white" />
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 text-lg py-10">
              No products match your current filters. Please adjust your selections.
            </p>
          )}
        </div>

          {visibleCount < filteredProducts.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out text-lg"
              >
                Load More
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default ProductList;