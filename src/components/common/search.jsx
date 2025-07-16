import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchProducts } from '../../api/product'; // searchBooks əvəzinə searchProducts import edirik

/**
 * Məhsul axtarışı komponenti.
 * İstifadəçinin daxil etdiyi sorğuya əsasən məhsulları axtarır və nəticələri göstərir.
 * @param {object} props - Komponentin prop-ları.
 * @param {function} props.onProductSelect - Məhsul seçildikdə çağırılacaq callback funksiyası.
 */
const SearchProducts = ({ onProductSelect }) => {
  const [query, setQuery] = useState(''); // Axtarış sorğusu
  const [results, setResults] = useState([]); // Axtarış nəticələri
  const [loading, setLoading] = useState(false); // Yüklənmə vəziyyəti
  const [error, setError] = useState(null); // Xəta mesajı
  const [showResultsDropdown, setShowResultsDropdown] = useState(false); // Nəticələr açılan pəncərəsinin görünməsi

  const searchContainerRef = useRef(null); // Komponentin xaricinə klikləri aşkar etmək üçün ref
  const debounceTimeoutRef = useRef(null); // Debounce üçün timeout ref-i

  /**
   * Axtarış sorğusunu serverə göndərir və nəticələri alır.
   * @param {string} searchValue - Axtarılacaq dəyər.
   */
  const performSearch = useCallback(async (searchValue) => {
    if (searchValue.trim() === '') {
      setResults([]);
      setShowResultsDropdown(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // searchBooks əvəzinə searchProducts API çağırışı edirik
      const data = await searchProducts(searchValue);
      setResults(data);
      if (data.length > 0) {
        setShowResultsDropdown(true);
      } else {
        // Nəticə olmasa belə "Axtarış nəticəsi tapılmadı" mesajını göstərmək üçün dropdown-u açıq saxlayırıq
        setShowResultsDropdown(true);
      }
    } catch (err) {
      setError(err.message || 'Axtarış zamanı xəta baş verdi.');
      setShowResultsDropdown(true); // Xəta zamanı da dropdown-u göstəririk
    } finally {
      setLoading(false);
    }
  }, []);

  // Komponentin xaricinə klikləri idarə etmək üçün effekt
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResultsDropdown(false); // Klik komponentin xaricindədirsə, dropdown-u bağlayır
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Giriş sahəsindəki dəyişiklikləri idarə edir və debounce tətbiq edir.
   * @param {object} e - Hadisə obyekti.
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Əvvəlki debounce timeout-u təmizləyir
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Əgər sorğu boşdursa, nəticələri təmizləyir və dropdown-u bağlayır
    if (value.trim() === '') {
      setResults([]);
      setShowResultsDropdown(false);
      setError(null);
      return;
    }

    // 300ms gecikmədən sonra axtarışı icra edir
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  /**
   * Giriş sahəsinə fokuslanıldıqda çağırılır.
   */
  const handleFocus = () => {
    // Əgər sorğu varsa və ya nəticələr mövcuddursa, dropdown-u göstərir
    if (query.trim() !== '' || (results.length > 0 && !loading && !error)) {
        setShowResultsDropdown(true);
    }
  };

  /**
   * Axtarış nəticəsindəki məhsul klikləndikdə çağırılır.
   * @param {object} product - Seçilmiş məhsul obyekti.
   */
  const handleResultClick = (product) => {
    if (onProductSelect) {
      // onProductSelect prop-unu məhsulun ID-si ilə çağırır
      onProductSelect(product.id || product._id);
    }
    setQuery(''); // Axtarış sorğusunu təmizləyir
    setResults([]); // Nəticələri təmizləyir
    setShowResultsDropdown(false); // Dropdown-u bağlayır
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Məhsul axtar..."
          className="w-full px-4 py-2 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 pl-10"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        {loading && (
          <div className="absolute inset-y-0 right-3 pr-3 flex items-center pointer-events-none">
            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {showResultsDropdown && (
        <div
          className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-2 max-h-80 overflow-y-auto shadow-xl text-gray-900"
        >
          {loading && <p className="p-3 text-center text-gray-600">Axtarılır...</p>}
          {error && <p className="p-3 text-red-600 text-center">{error}</p>}
          {!loading && !error && results.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {results.map((product) => (
                <li
                  key={product.id || product._id}
                  onClick={() => handleResultClick(product)}
                  className="p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center space-x-3"
                >
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">Şəkil yoxdur</div>
                  )}
                  <div>
                    <h4 className="text-base font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-600">Qiymət: ${product.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!loading && !error && results.length === 0 && query.trim() !== '' && (
            <p className="p-3 text-gray-600 text-center">Axtarış nəticəsi tapılmadı.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProducts;
