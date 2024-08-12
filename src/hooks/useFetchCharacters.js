import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import axios from "axios";

const useFetchCharacters = (searchQuery) => {
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [activePage, setActivePage] = useState(JSON.parse(localStorage.getItem('currentPage'))||1);
  const [isLoading, setIsLoading] = useState(false);
  const previousSearchQuery = useRef(searchQuery);
  const debounceTimer = useRef(null);

  const debouncedFetchCharacters = useCallback(
    (query, page = 1) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const url = `https://swapi.dev/api/people?search=${query}&page=${page}`;
          const response = await axios.get(url);
          setData(response.data);
          setFetchError(null);
        } catch (error) {
          setFetchError("Failed to fetch data. Please try again later.");
          setData(null);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    },
    []
  );

  useEffect(() => {
    if (searchQuery !== previousSearchQuery.current) {
      setActivePage(1);
      localStorage.setItem('currentPage',JSON.stringify(1))
      debouncedFetchCharacters(searchQuery, 1);
      previousSearchQuery.current = searchQuery;
    } else {
      debouncedFetchCharacters(searchQuery, activePage);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, activePage, debouncedFetchCharacters]);

  const totalPages = useMemo(() => {
    return data ? Math.ceil(data.count / 10) : 0; // Assuming 10 results per page
  }, [data]);

  return { 
    data: data ? data.results : null, 
    fetchError,
    isLoading,
    totalPages, 
    currentPage: activePage,
    setCurrentPage: (page)=>{
      setActivePage(page);
      localStorage.setItem('currentPage',JSON.stringify(page));
    },
    next:()=>{
      setActivePage(prev=>prev+1)
    },
    prev:()=>{
      setActivePage(prev=>prev-1)
    }
  };
};

export default useFetchCharacters;
