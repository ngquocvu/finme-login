import axios from "axios";
import { useState, useEffect } from "react";
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export default function useFetchData(query) {
  const [data, setData] = useState({
    isLoading: false,
    apiData: undefined,
    status: null,
    serverError: null,
  });
  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));
        const { data, status } = await axios.get(`/api/${query}`);
        if (status === 201) {
          setData((prev) => ({
            ...prev,
            isLoading: false,
            apiData: data,
            status: status,
          }));
        } else {
          setData((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        setData((prev) => ({ ...prev, isLoading: false, serverError: error }));
      }
    };
    fetchData();
  }, [query]);

  return [data, setData];
}
