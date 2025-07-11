 import { instance } from "../api/";
import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);  
      try {
        const { data } = await instance.get(url);  
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    if (url) { 
        fetchData();
    } else {
        setLoading(false);
        setData(null);
    }
  }, [url]);

  return { data, loading, error };
};

export default useFetch;