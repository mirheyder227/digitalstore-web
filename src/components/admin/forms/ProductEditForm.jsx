

// src/components/admin/forms/ProductEditForm.jsx (Mövcud kodunuzdan götürülüb, düzəlişlər edilə bilər)
import React, { useState, useEffect } from 'react';
import { updateProduct } from '../../../api/product';
import { message } from 'antd';

const ProductEditForm = ({ product, onEditSuccess, onCancel }) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category);
  const [image, setImage] = useState(null); // Yeni fayl obyekti
  const [currentImageUrl, setCurrentImageUrl] = useState(product.imageUrl); // Mövcud şəkil URL-i
  const [clearImage, setClearImage] = useState(false); // Şəkli silmək üçün seçim
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Məhsul dəyişdikdə formu yeniləyin
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setCurrentImageUrl(product.imageUrl);
    setImage(null);
    setClearImage(false);
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    
    if (image) {
      formData.append('productImage', image); // Backend Multer 'productImage' gözləyir
    } else if (clearImage) {
      formData.append('clearImage', 'true'); // Şəkli silmək üçün flag
    }

    try {
      await updateProduct(product.id, formData);
      message.success('Məhsul uğurla yeniləndi!');
      if (onEditSuccess) {
        onEditSuccess(); // Valideyn komponentə uğurlu yeniləmə barədə məlumat verin
      }
    } catch (err) {
      console.error('Məhsul yenilənərkən xəta:', err);
      message.error(err.message || 'Məhsul yenilənərkən xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  const API_BASE_URL_FOR_IMAGES = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
    : "http://localhost:5000";

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Məhsulu Redaktə Et</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="editName" className="block text-gray-700 text-sm font-bold mb-2">
            Məhsul Adı:
          </label>
          <input
            type="text"
            id="editName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="editDescription" className="block text-gray-700 text-sm font-bold mb-2">
            Təsvir:
          </label>
          <textarea
            id="editDescription"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="editPrice" className="block text-gray-700 text-sm font-bold mb-2">
            Qiymət:
          </label>
          <input
            type="number"
            id="editPrice"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="editCategory" className="block text-gray-700 text-sm font-bold mb-2">
            Kateqoriya:
          </label>
          <input
            type="text"
            id="editCategory"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="editImage" className="block text-gray-700 text-sm font-bold mb-2">
            Məhsul Şəkli:
          </label>
          {currentImageUrl && !clearImage && (
            <div className="mb-2">
              <p className="text-gray-600 text-sm">Mövcud Şəkil:</p>
              <img 
                src={currentImageUrl} 
                alt="Mövcud Şəkil" 
                className="w-24 h-24 object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/96x96?text=Image+Error";
                }}
              />
            </div>
          )}
          <input
            type="file"
            id="editImage"
            name="productImage" // Backend Multer 'productImage' gözləyir
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setClearImage(false); // Yeni şəkil yüklənirsə, şəkli silmə seçimini ləğv et
            }}
          />
          {currentImageUrl && (
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={clearImage}
                  onChange={(e) => {
                    setClearImage(e.target.checked);
                    if (e.target.checked) {
                      setImage(null); // Şəkil silinirsə, yeni yüklənən şəkli sıfırla
                    }
                  }}
                />
                <span className="ml-2 text-gray-700 text-sm">Mövcud şəkli sil</span>
              </label>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Yenilənir...' : 'Məhsulu Yenilə'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Ləğv Et
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditForm;
