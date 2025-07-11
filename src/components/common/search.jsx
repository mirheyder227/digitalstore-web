import React, { useState } from 'react';
import axios from 'axios';

const SearchBooks = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/search?q=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Axtarış..."
        className="border p-2"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 ml-2">
        Axtar
      </button>

      <ul className="mt-4">
        {results.map((book) => (
          <li key={book._id}>{book.title} — {book.author}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBooks;
