import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/reducer/cartSlice";
import { getSingleProduct, getAllProducts } from "../../api/product";
import { Carousel, Modal, Progress, Badge, Tag, notification } from "antd";
import {
  ShoppingCartOutlined,
  HeartFilled,
  HeartOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
  FireFilled,
  ThunderboltFilled,
  CheckOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) =>
      i < rating ? (
        <StarFilled key={i} className="text-yellow-400 text-lg" />
      ) : (
        <StarOutlined key={i} className="text-gray-300 text-lg" />
      )
    )}
    <span className="text-gray-500 ml-2">({rating}.0)</span>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getSingleProduct(id);
      setProduct(data);
      const all = await getAllProducts();
      const filtered = all.filter(p => (p.id || p._id) !== (data.id || data._id));
      setRelatedProducts(filtered.slice(0, 4));
      // Simulate checking if product is in wishlist
      setIsWishlisted(Math.random() > 0.7);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      notification.warning({
        message: "Please select a size",
        description: "This product requires size selection before adding to cart",
      });
      return;
    }
    
    dispatch(addToCart({ 
      ...product, 
      quantity,
      selectedSize,
      selectedColor
    }));
    
    notification.success({
      message: "Added to Cart",
      description: `${quantity}x ${product.name} added to your cart`,
      icon: <CheckOutlined style={{ color: '#52c41a' }} />,
    });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    notification[isWishlisted ? 'info' : 'success']({
      message: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: isWishlisted 
        ? `${product.name} removed from your wishlist` 
        : `${product.name} added to your wishlist`,
    });
  };

  const shareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    notification.success({
      message: "Link Copied!",
      description: "Product link copied to clipboard",
      placement: 'topRight',
    });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-10">
          <Progress type="circle" percent={75} width={80} className="mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading product details...</h2>
          <p className="text-gray-500">Just a moment while we fetch this amazing product</p>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const productStats = {
    popularity: Math.floor(Math.random() * 100),
    fastDelivery: Math.random() > 0.3,
    stock: Math.floor(Math.random() * 50) + 10,
  };

  const availableSizes = product.sizes || ['S', 'M', 'L', 'XL'];
  const availableColors = product.colors || ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ArrowRightOutlined className="mx-2 text-xs" />
          <Link to="/products" className="hover:text-indigo-600">Products</Link>
          <ArrowRightOutlined className="mx-2 text-xs" />
          <span className="text-gray-800 font-medium">{product.category || 'Product'}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Product Images */}
          <div className="sticky top-4">
            <Badge.Ribbon 
              text={product.discount ? `Save ${product.discount}%` : "Popular"} 
              color={product.discount ? "#f5222d" : "#faad14"}
              className="z-10"
            >
              <Carousel 
                autoplay 
                effect="fade" 
                className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
                dots={{ className: "custom-dots" }}
              >
                {(product.images?.length > 0 ? product.images : [product.imageUrl]).map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img || "https://placehold.co/600x450"}
                      alt={product.name}
                      className="w-full h-[400px] object-cover rounded-xl cursor-zoom-in"
                      onClick={() => setZoomImage(img)}
                    />
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"
                      onClick={() => setZoomImage(img)}
                    />
                  </div>
                ))}
              </Carousel>
            </Badge.Ribbon>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 mt-4 overflow-x-auto py-2">
              {(product.images?.length > 0 ? product.images : [product.imageUrl]).map((img, i) => (
                <img
                  key={i}
                  src={img || "https://placehold.co/600x450"}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-16 h-16 object-cover rounded-md cursor-pointer border-2 hover:border-indigo-400 transition-all"
                  onClick={() => setZoomImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <Tag color="volcano" className="text-sm font-medium mb-2">
                  {product.category || 'General'}
                </Tag>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={toggleWishlist}
                className="p-2 rounded-full bg-white hover:bg-gray-100 shadow-md"
              >
                {isWishlisted ? (
                  <HeartFilled className="text-red-500 text-xl" />
                ) : (
                  <HeartOutlined className="text-gray-600 text-xl" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${parseFloat(product.originalPrice).toFixed(2)}
                  </span>
                )}
                <p className="text-indigo-600 text-2xl sm:text-3xl font-semibold">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
                {product.discount && (
                  <Tag color="red" className="font-bold">
                    {product.discount}% OFF
                  </Tag>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <StarRating rating={product.rating || 4} />
              <span className="text-gray-500">|</span>
              <span className="text-green-600 font-medium flex items-center gap-1">
                <CheckOutlined /> In Stock ({productStats.stock} left)
              </span>
              {productStats.fastDelivery && (
                <>
                  <span className="text-gray-500">|</span>
                  <span className="text-blue-500 font-medium flex items-center gap-1">
                    <ThunderboltFilled /> Fast Delivery
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Progress 
                percent={productStats.popularity} 
                size="small" 
                status="active" 
                showInfo={false}
                strokeColor="#722ed1"
              />
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <FireFilled className="text-orange-500" /> 
                {productStats.popularity}% popularity
              </span>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Flash Deal</h4>
                  <p className="text-sm text-gray-600">Offer ends in 12:34:56</p>
                </div>
              </div>
            </div>

            {product.colors?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-800">Color:</h3>
                <div className="flex gap-2">
                  {availableColors.map((color, i) => (
                    <div 
                      key={i}
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selectedColor === color ? 'border-indigo-600' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-800">Size:</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size, i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 rounded-md border ${selectedSize === size ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300 hover:border-indigo-400'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="text-sm text-gray-600 mt-1">
                    <CheckOutlined className="text-green-500" /> Selected: {selectedSize}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-medium text-gray-800">Quantity:</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                  <button 
                    className="px-3 py-2 text-lg font-medium hover:bg-gray-100"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-lg font-medium border-x">
                    {quantity}
                  </span>
                  <button 
                    className="px-3 py-2 text-lg font-medium hover:bg-gray-100"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {productStats.stock} available
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 flex-1 justify-center"
              >
                <ShoppingCartOutlined /> Add to Cart
              </button>

              <button
                onClick={shareProduct}
                className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md hover:shadow-lg transition-all"
              >
                <ShareAltOutlined className="text-gray-600 text-xl" />
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "description" ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "specs" ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "reviews" ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Reviews (24)
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "shipping" ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Shipping & Returns
              </button>
            </nav>
          </div>
          <div className="py-6">
            {activeTab === "description" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "No detailed description provided."}
                </p>
                <ul className="mt-4 space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckOutlined className="text-green-500 mt-1 mr-2" />
                    <span>High-quality materials for durability</span>
                  </li>
                  <li className="flex items-start">
                    <CheckOutlined className="text-green-500 mt-1 mr-2" />
                    <span>Designed for comfort and style</span>
                  </li>
                  <li className="flex items-start">
                    <CheckOutlined className="text-green-500 mt-1 mr-2" />
                    <span>Easy to clean and maintain</span>
                  </li>
                </ul>
              </div>
            )}
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Technical Specifications</h4>
                  <dl className="space-y-3">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <dt className="text-gray-600">Material</dt>
                      <dd className="text-gray-900">Premium Cotton Blend</dd>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <dt className="text-gray-600">Weight</dt>
                      <dd className="text-gray-900">0.5 kg</dd>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <dt className="text-gray-600">Dimensions</dt>
                      <dd className="text-gray-900">30 x 20 x 5 cm</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Additional Information</h4>
                  <dl className="space-y-3">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <dt className="text-gray-600">Brand</dt>
                      <dd className="text-gray-900">FashionHub</dd>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <dt className="text-gray-600">SKU</dt>
                      <dd className="text-gray-900">FH-{Math.floor(Math.random() * 10000)}</dd>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <dt className="text-gray-600">Care Instructions</dt>
                      <dd className="text-gray-900">Machine wash cold</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
                    <div className="flex items-center mt-1">
                      <StarRating rating={4.5} />
                      <span className="ml-2 text-gray-600">Based on 24 reviews</span>
                    </div>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Write a Review
                  </button>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Customer {review}</h4>
                          <StarRating rating={5 - review} />
                        </div>
                        <span className="text-sm text-gray-500">2 days ago</span>
                      </div>
                      <p className="mt-2 text-gray-700">
                        {[
                          "Absolutely love this product! The quality exceeded my expectations.",
                          "Good product but the color was slightly different than shown.",
                          "It's okay, but I expected better quality for the price."
                        ][review - 1]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Shipping Information</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Free standard shipping on all orders</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Express delivery available for an additional charge</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Estimated delivery time: 3-5 business days</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Returns Policy</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>30-day easy returns</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Free return shipping</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Full refund upon return</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 relative">
            <span className="relative inline-block">
              You May Also Like
              <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-200 -z-10"></span>
            </span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                to={`/product/${item.id || item._id}`}
                key={item.id || item._id}
                className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={item.imageUrl || "https://placehold.co/400x300"}
                    alt={item.name}
                    className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  {Math.random() > 0.7 && (
                    <Tag color="red" className="absolute top-2 left-2 font-bold">
                      {Math.floor(Math.random() * 30) + 10}% OFF
                    </Tag>
                  )}
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <HeartOutlined className="text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{item.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-indigo-500 font-semibold text-xl">
                        ${parseFloat(item.price).toFixed(2)}
                      </p>
                      {item.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ${parseFloat(item.originalPrice).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <StarRating rating={item.rating || Math.floor(Math.random() * 2) + 3} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <Modal
        visible={!!zoomImage}
        onCancel={() => setZoomImage(null)}
        footer={null}
        width="80%"
        bodyStyle={{ padding: 0 }}
        centered
        closable={false}
      >
        <img
          src={zoomImage || "https://placehold.co/600x450"}
          alt="Zoomed product"
          className="w-full h-auto max-h-[80vh] object-contain"
        />
      </Modal>
    </div>
  );
};

export default ProductDetails;