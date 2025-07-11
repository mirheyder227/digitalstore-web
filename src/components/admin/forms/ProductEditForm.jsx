import React, { useState, useEffect } from 'react';
import { updateProduct } from '../../../api/product';
import { message } from 'antd';

const ProductEditForm = ({ product, onEditSuccess, onCancel, token }) => {
  const [name, setName] = useState(product.name || '');
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price || '');
  const [category, setCategory] = useState(product.category || '');
  const [productImage, setProductImage] = useState(null); // State to hold the new image file
  const [loading, setLoading] = useState(false);

  // Define API_BASE_URL_FOR_IMAGES here for image preview
  const API_BASE_URL_FOR_IMAGES = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
    : "http://localhost:5000";

  useEffect(() => {
    // Reset form fields when a different product is selected for editing
    setName(product.name || '');
    setDescription(product.description || '');
    setPrice(product.price || '');
    setCategory(product.category || '');
    setProductImage(null); // Clear selected image when product changes
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', parseFloat(price));
    formData.append('category', category);

    // IMPORTANT: The field name 'image' must match what Multer expects on the backend.
    // In server/routes/productRout.js, it's 'upload.single('image')'.
    if (productImage) {
      formData.append('image', productImage); // Changed from 'productImage' to 'image'
    }

    try {
      await updateProduct(product.id, formData);
      message.success('Məhsul uğurla yeniləndi!');
      onEditSuccess(); // Callback to refresh product list in Admin component
    } catch (error) {
      console.error('Məhsul yenilənərkən xəta:', error);
      message.error(error.response?.data?.message || 'Məhsul yenilənərkən xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300">Ad</label>
        <input
          type="text"
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>
      <div>
        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-300">Təsvir</label>
        <textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows="3"
        ></textarea>
      </div>
      <div>
        <label htmlFor="edit-price" className="block text-sm font-medium text-gray-300">Qiymət</label>
        <input
          type="number"
          id="edit-price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="edit-category" className="block text-sm font-medium text-gray-300">Kateqoriya</label>
        <input
          type="text"
          id="edit-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>
      <div>
        <label htmlFor="edit-productImage" className="block text-sm font-medium text-gray-300">Məhsul Şəkili (Dəyişmək üçün seçin)</label>
        <input
          type="file"
          id="edit-productImage"
          onChange={(e) => setProductImage(e.target.files[0])}
          className="mt-1 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
        {/* Display current image if no new image is selected */}
        {product.imageUrl && !productImage && (
          <div className="mt-2 text-sm text-gray-400">
            Cari Şəkil: <img src={`${product.imageUrl.startsWith('/') ? API_BASE_URL_FOR_IMAGES : ''}${product.imageUrl}`} alt="Cari Şəkil" className="w-20 h-20 object-cover rounded mt-1" />
          </div>
        )}
        {/* Display preview of new image if selected */}
        {productImage && (
          <div className="mt-2 text-sm text-gray-400">
            Yeni Şəkil Önizləməsi: <img src={URL.createObjectURL(productImage)} alt="Yeni Şəkil" className="w-20 h-20 object-cover rounded mt-1" />
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Ləğv Et
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          {loading ? 'Yenilənir...' : 'Məhsulu Yenilə'}
        </button>
      </div>
    </form>
  );
};

export default ProductEditForm;
