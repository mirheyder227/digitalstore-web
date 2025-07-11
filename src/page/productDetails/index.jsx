import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSingleProduct, getAllProducts } from "../../api/product";
import { Skeleton, message, Tooltip, Carousel } from "antd";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/reducer/cartSlice";
import Card from "../../components/common/aboutUs";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";

const StarRating = ({ rating, setRating, editable = false }) => {
  const stars = [...Array(5)].map((_, i) => {
    const starValue = i + 1;
    return (
      <span
        key={i}
        className={`cursor-pointer ${
          editable ? "hover:scale-110 transition-transform duration-200" : ""
        }`}
        onClick={() => editable && setRating(starValue)}
      >
        {starValue <= rating ? (
          <StarFilled className="text-yellow-500 text-xl" />
        ) : (
          <StarOutlined className="text-gray-400 text-xl" />
        )}
      </span>
    );
  });
  return <div className="flex space-x-1">{stars}</div>;
};

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const API_BASE_URL_FOR_IMAGES = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
    : "http://localhost:5000";

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await getSingleProduct(id);
        if (!productData) {
          setError("Product not found.");
        } else {
          setProduct(productData);
          setMainImage(
            productData.images && productData.images.length > 0
              ? `${API_BASE_URL_FOR_IMAGES}${productData.images[0]}`
              : productData.imageUrl
              ? `${API_BASE_URL_FOR_IMAGES}${productData.imageUrl}`
              : "https://via.placeholder.com/600x450?text=No+Image+Available"
          );

          setReviews([
            {
              id: 1,
              reviewerName: "Ali Mammadov",
              rating: 5,
              comment:
                "Absolutely loved this product! Highly recommend it to everyone.",
              date: "July 1, 2025",
            },
            {
              id: 2,
              reviewerName: "Nigar Hasanova",
              rating: 4,
              comment: "Good quality, but the delivery was a bit slow.",
              date: "June 25, 2025",
            },
          ]);

          const allProductsData = await getAllProducts();
          const filteredRelated = allProductsData.filter(
            (p) => (p.id || p._id) !== (productData.id || productData._id)
          );
          const shuffledRelated = filteredRelated.sort(
            () => 0.5 - Math.random()
          );
          setRelatedProducts(shuffledRelated.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading product or related products:", err);
        setError(
          "An error occurred while loading the product. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [id, API_BASE_URL_FOR_IMAGES]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      message.success(`${quantity} x ${product.name} added to cart!`);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToWishlist = () => {
    message.info(`${product.name} added to wishlist!`);
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description
            ? product.description.substring(0, 100) + "..."
            : "Check out this product!",
          url: window.location.href,
        })
        .then(() => message.success("Product link successfully shared!"))
        .catch((error) => message.error("Share error: " + error.message));
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success("Product link copied to clipboard!");
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!newReviewText.trim()) {
      message.error("Please write your review.");
      return;
    }
    if (newReviewRating === 0) {
      message.error("Please give a rating.");
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      reviewerName: "New User",
      rating: newReviewRating,
      comment: newReviewText.trim(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    setReviews([...reviews, newReview]);
    setNewReviewText("");
    setNewReviewRating(0);
    message.success("Your review was successfully submitted!");
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";
  const totalReviewsCount = reviews.length;

  if (loading) {
    return (
      <div className="container mx-auto p-8 animate-pulse">
        <Skeleton active paragraph={{ rows: 8 }} />
        <Skeleton active avatar paragraph={{ rows: 3 }} className="mt-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600 text-2xl font-semibold p-8 bg-white rounded-lg shadow-lg animate-fade-in">
          {error}
        </div>
      </div>
    );
  }

  const productImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => `${API_BASE_URL_FOR_IMAGES}${img}`)
      : [mainImage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-indigo-700 font-semibold hover:text-indigo-900 transition duration-300 ease-in-out transform hover:-translate-x-1 text-lg"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Shopping
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 lg:flex lg:space-x-12 animate-fade-in-slow transform hover:shadow-3xl transition-shadow duration-300">
          <div className="lg:w-1/2 flex flex-col items-center">
            <div className="w-full h-96 mb-6 rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-gray-50">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain transform transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/600x450?text=No+Image+Available";
                }}
              />
            </div>

            {productImages.length > 1 && (
              <div className="w-full">
                <Carousel
                  dots={{ className: "slick-dots-custom" }}
                  slidesToShow={3}
                  infinite={true}
                  centerMode={true}
                  centerPadding="0px"
                  responsive={[
                    { breakpoint: 768, settings: { slidesToShow: 2 } },
                    { breakpoint: 480, settings: { slidesToShow: 1 } },
                  ]}
                >
                  {productImages.map((imgSrc, index) => (
                    <div
                      key={index}
                      className="px-2 cursor-pointer"
                      onClick={() => setMainImage(imgSrc)}
                    >
                      <img
                        src={imgSrc}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-full h-24 object-cover rounded-lg border-2 ${
                          mainImage === imgSrc
                            ? "border-indigo-600 shadow-md"
                            : "border-transparent"
                        } transform transition-all duration-300 hover:scale-105 hover:border-indigo-500`}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
          </div>

          <div className="lg:w-1/2 flex flex-col justify-center mt-8 lg:mt-0">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight animate-slide-in-top">
              {product.name}
            </h1>
            <p className="text-purple-700 text-4xl lg:text-5xl font-bold mb-6 animate-fade-in-up">
              ${parseFloat(product.price).toFixed(2)}
            </p>

            <div className="flex items-center space-x-3 mb-6 text-gray-600">
              <StarRating rating={parseFloat(averageRating)} />
              <span className="text-xl font-medium text-gray-800">
                {averageRating} ({totalReviewsCount} Reviews)
              </span>
            </div>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-3 rounded-md">
              {product.description ||
                "No detailed description available for this product. Please try again later or contact support."}
            </p>

            <div className="flex items-center mb-8 space-x-4">
              <span className="text-xl font-semibold text-gray-800">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition duration-200 text-gray-700 text-xl font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xl font-semibold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition duration-200 text-gray-700 text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Link to="/cart">
                <button
                  onClick={handleAddToCart}
                  className="mt-4 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                >
                  <ShoppingCartOutlined className="mr-3 text-2xl" /> Add to Cart
                </button>
              </Link>

              <Tooltip title="Add to Wishlist">
                <button
                  onClick={handleAddToWishlist}
                  className="flex-1 flex items-center justify-center bg-white border border-gray-300 text-gray-800 py-4 px-8 rounded-full text-xl font-semibold hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  <HeartOutlined className="mr-3 text-2xl text-red-500" />
                </button>
              </Tooltip>

              <Tooltip title="Share Product">
                <button
                  onClick={handleShareProduct}
                  className="flex-1 flex items-center justify-center bg-white border border-gray-300 text-gray-800 py-4 px-8 rounded-full text-xl font-semibold hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  <ShareAltOutlined className="mr-3 text-2xl" />
                </button>
              </Tooltip>
            </div>

            {product.attributes &&
              Object.keys(product.attributes).length > 0 && (
                <div className="mt-8 p-6 bg-purple-50 rounded-lg shadow-inner">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Product Features
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-lg text-gray-700">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <li key={key} className="flex items-center">
                        <span className="font-semibold text-indigo-600 mr-2">
                          {key}:
                        </span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>

        <div className="mt-20 p-8 bg-white rounded-3xl shadow-2xl animate-fade-in">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Customer Reviews
          </h2>

          <div className="mb-12 p-6 border-2 border-indigo-200 rounded-xl bg-indigo-50 shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Write a Review
            </h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label
                  htmlFor="reviewText"
                  className="block text-gray-700 text-lg font-medium mb-2"
                >
                  Your Review:
                </label>
                <textarea
                  id="reviewText"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-y min-h-[100px]"
                  placeholder="Share your thoughts about the product..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  rows="4"
                ></textarea>
              </div>
              <div className="mb-6 flex items-center space-x-4">
                <span className="text-lg font-medium text-gray-700">
                  Your Rating:
                </span>
                <StarRating
                  rating={newReviewRating}
                  setRating={setNewReviewRating}
                  editable={true}
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                Submit Review
              </button>
            </form>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200"
                >
                  <div className="flex items-center mb-3">
                    <h4 className="text-xl font-bold text-gray-800 mr-4">
                      {review.reviewerName}
                    </h4>
                    <StarRating rating={review.rating} />
                    <span className="ml-auto text-gray-500 text-sm">
                      {review.date}
                    </span>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-xl py-10">
              No reviews yet for this product. Be the first to write a review!
            </p>
          )}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-10 animate-fade-in-up">
            You Might Also Like...
          </h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <Link
                  to={`/product/${p.id || p._id}`}
                  key={p.id || p._id}
                  className="bg-white rounded-xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-102 hover:shadow-xl animate-fade-in flex flex-col"
                >
                  <img
                    src={
                      p.images && p.images.length > 0
                        ? `${API_BASE_URL_FOR_IMAGES}${p.images[0]}`
                        : p.imageUrl
                        ? `${API_BASE_URL_FOR_IMAGES}${p.imageUrl}`
                        : "https://placehold.co/300x200?text=No+Image"
                    }
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/300x200?text=No+Image";
                    }}
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate flex-grow">
                    {p.name}
                  </h3>
                  <p className="text-indigo-600 text-lg font-bold">
                    ${p.price ? parseFloat(p.price).toFixed(2) : "0.00"}
                  </p>
                  <button className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200 text-sm">
                    View Details
                  </button>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg py-10">
              No related products found.
            </p>
          )}
        </div>

        <div className="mt-16">
          <Card />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
