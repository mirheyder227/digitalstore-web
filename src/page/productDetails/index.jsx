import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSingleProduct, getAllProducts } from "../../api/product";
import { Skeleton, message, Tooltip, Carousel } from "antd";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/reducer/cartSlice";
import Card from "../../components/common/aboutUs";
import { HeartOutlined, ShoppingCartOutlined, ShareAltOutlined, StarFilled, StarOutlined } from "@ant-design/icons";

const StarRating = ({ rating, setRating, editable = false }) => {
  const stars = [...Array(5)].map((_, i) => {
    const starValue = i + 1;
    return (
      <span
        key={i}
        className={`cursor-pointer ${editable ? "hover:scale-110 transition-transform duration-200" : ""}`}
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
          // productData.imageUrl artıq tam Cloudinary URL-i olmalıdır
          setMainImage(productData.imageUrl || "https://via.placeholder.com/600x450?text=No+Image+Available");
          setReviews([
            { id: 1, reviewerName: "Ali Mammadov", rating: 5, comment: "Absolutely loved this product! Highly recommend it to everyone.", date: "July 1, 2025" },
            { id: 2, reviewerName: "Nigar Hasanova", rating: 4, comment: "Good quality, but the delivery was a bit slow.", date: "June 25, 2025" }
          ]);
          const allProductsData = await getAllProducts();
          const filteredRelated = allProductsData.filter((p) => (p.id || p._id) !== (productData.id || productData._id));
          const shuffledRelated = filteredRelated.sort(() => 0.5 - Math.random());
          setRelatedProducts(shuffledRelated.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading product or related products:", err);
        setError("An error occurred while loading the product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      message.success(`${quantity} x ${product.name} added to cart!`);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity(prev => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToWishlist = () => {
    message.info(`${product.name} added to wishlist!`);
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description ? product.description.substring(0, 100) + "..." : "Check out this product!",
        url: window.location.href
      }).then(() => message.success("Product link successfully shared!")).catch(error => message.error("Share error: " + error.message));
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
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    };
    setReviews([...reviews, newReview]);
    setNewReviewText("");
    setNewReviewRating(0);
    message.success("Your review was successfully submitted!");
  };

  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "0.0";
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

  // product.images artıq tam Cloudinary URL-ləri ehtiva etməlidir
  const productImages = product.images && product.images.length > 0 ? product.images : [mainImage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden md:flex md:items-center p-8 lg:p-12 mb-12">
          <div className="md:w-1/2 lg:w-2/5 flex justify-center items-center p-4">
            <Carousel autoplay className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
              {productImages.map((imgSrc, index) => (
                <div key={index}>
                  <img
                    src={imgSrc}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-auto object-contain max-h-96 rounded-2xl"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600x450?text=Image+Error"; }}
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="md:w-1/2 lg:w-3/5 md:pl-12 mt-8 md:mt-0">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-indigo-600 text-5xl lg:text-6xl font-extrabold mb-6">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <div className="flex items-center mb-6">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-gray-600 ml-3 text-lg">
                ({totalReviewsCount} Reviews)
              </span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {product.description || "No detailed description available for this product."}
            </p>

            <div className="flex items-center mb-8 space-x-4">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  -
                </button>
                <span className="px-4 py-2 text-gray-900 font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white text-lg font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <ShoppingCartOutlined className="mr-2 text-xl" /> Add to Cart
              </button>
            </div>

            <div className="flex space-x-4 mb-8">
              <Tooltip title="Add to Wishlist">
                <button
                  onClick={handleAddToWishlist}
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 shadow-md"
                >
                  <HeartOutlined className="text-2xl" />
                </button>
              </Tooltip>
              <Tooltip title="Share Product">
                <button
                  onClick={handleShareProduct}
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 shadow-md"
                >
                  <ShareAltOutlined className="text-2xl" />
                </button>
              </Tooltip>
            </div>

            <div className="text-gray-700 text-sm">
              <p>
                <span className="font-semibold">Category:</span> {product.category}
              </p>
              <p>
                <span className="font-semibold">Availability:</span> In Stock
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews ({totalReviewsCount})</h2>
          <div className="mb-10">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex items-center mb-3">
                    <StarRating rating={review.rating} />
                    <span className="ml-4 text-gray-800 font-semibold">{review.reviewerName}</span>
                    <span className="ml-auto text-gray-500 text-sm">{review.date}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No reviews yet. Be the first to review this product!</p>
            )}
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label htmlFor="reviewText" className="block text-gray-700 text-lg font-semibold mb-2">Your Review</label>
              <textarea
                id="reviewText"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 resize-y min-h-[100px]"
                rows="4"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Share your thoughts about the product..."
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-lg font-semibold mb-2">Your Rating</label>
              <StarRating rating={newReviewRating} setRating={setNewReviewRating} editable={true} />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white text-lg font-semibold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Related Products Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <Link
                to={`/product/${p.id || p._id}`}
                key={p.id || p._id}
                className="bg-gray-50 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col group border border-gray-200"
              >
                <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                  <img
                    src={p.imageUrl || "https://placehold.co/400x300?text=No+Image"} // product.imageUrl artıq tam Cloudinary URL-i olmalıdır
                    alt={p.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {p.name}
                  </h3>
                  <p className="text-indigo-600 text-xl font-extrabold mb-2">
                    ${parseFloat(p.price).toFixed(2)}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {p.description || "No description provided."}
                  </p>
                </div>
                <div className="p-4 pt-0">
                  <button className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-600 transition duration-300">
                    View Product
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
