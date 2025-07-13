 
import React, { useState } from 'react';
import { searchBooks } from '../../api/book';  

const SearchBooks = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    if (query.trim() === '') {
      setLoading(false);
      return;
    }

    try {
      const data = await searchBooks(query); // API funksiyasını çağırın
      setResults(data);
    } catch (err) {
      setError(err.message || 'Axtarış zamanı xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kitab axtarışı..."
          className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-3 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Axtarılır...' : 'Axtar'}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm max-h-60 overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {results.map((book) => (
              <li key={book.id} className="p-3 hover:bg-gray-50 cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                <p className="text-gray-600 text-sm">Müəllif: {book.author}</p>
                <p className="text-gray-500 text-xs">Janr: {book.genre}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 && !loading && !error && query.trim() !== '' && (
        <p className="text-gray-600 text-center mt-4">Axtarış nəticəsi tapılmadı.</p>
      )}
    </div>
  );
};

export default SearchBooks;