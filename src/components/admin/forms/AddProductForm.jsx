import React, { useState } from 'react';
import { addProduct } from '../../../api/product';
import { message } from 'antd';

const AddProductForm = ({ onAddSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    if (image) {
      formData.append('image', image); // <== burada da 'image' adını istifadə et, backend ilə tam uyğun olsun
    }

    try {
      await addProduct(formData);
      message.success('Məhsul uğurla əlavə edildi!');

      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImage(null);
      e.target.reset();

      if (onAddSuccess) onAddSuccess();
    } catch (err) {
      console.error('Məhsul əlavə edilərkən xəta:', err);
      message.error(err.message || 'Məhsul əlavə edilərkən xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Yeni Məhsul Əlavə Et</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Məhsul Adı:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
            Təsvir:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
            Qiymət:
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            step="0.01"
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
            Kateqoriya:
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
            Məhsul Şəkli:
          </label>
          <input
            id="image"
            type="file"
            name="image"  // Multer backend-in gözlədiyi adla eyni olmalıdır
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Əlavə Edilir...' : 'Məhsulu Əlavə Et'}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
