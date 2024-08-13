import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import axios from "axios";

const useFetchCharacters = (searchTerm, filters) => {
  const [characters, setCharacters] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(JSON.parse(localStorage.getItem('currentPage')) || 1);
  const [loading, setLoading] = useState(false);

  const prevSearchTerm = useRef(searchTerm);
  const debounceTimer = useRef(null);
  const prevFilters = useRef(filters);
  const prevCharacters = useRef(characters);

  const fetchCharacters = useCallback(
    async (query, page = 1, filterUrls = null) => {
      setLoading(true);
      try {
        if (!filterUrls) {
          const url = `https://swapi.dev/api/people?search=${query}&page=${page}`;
          const response = await axios.get(url);
          prevCharacters.current = response.data;
          setCharacters(response.data);
        } else {
          if (filterUrls !== prevFilters.current) {
            const responses = await Promise.all(filterUrls.map(url => axios.get(url)));
            let filteredCharacters = responses.map(response => response.data);

            filteredCharacters = filteredCharacters.filter((character) => 
              character.name.toLowerCase().includes(query.toLowerCase())
            );

            prevCharacters.current = filteredCharacters;
            setCharacters({ count: 0, results: filteredCharacters });
          } else {
            setCharacters({ count: 0, results: prevCharacters.current?.filter((character) =>
              character.name.toLowerCase().includes(query.toLowerCase())
            )});
          }
          prevFilters.current = filterUrls;
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Please try again later.");
        prevCharacters.current = null;
        setCharacters(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (searchTerm !== prevSearchTerm.current) {
      setCurrentPage(1);
      localStorage.setItem('currentPage', JSON.stringify(1));
      debounceTimer.current=setTimeout(()=>{fetchCharacters(searchTerm, 1, filters)},500);
      prevSearchTerm.current = searchTerm;
    } else {
      fetchCharacters(searchTerm, currentPage, filters);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, currentPage, fetchCharacters, filters]);

  const totalPages = useMemo(() => {
    return !filters && characters ? Math.ceil(characters.count / 10) : 0;
  }, [characters, filters]);

  return { 
    characters: characters ? characters.results : null, 
    error,
    loading,
    totalPages, 
    currentPage,
    setPage: (page) => {
      setCurrentPage(page);
      localStorage.setItem('currentPage', JSON.stringify(page));
    },
    nextPage: () => setCurrentPage(prev => prev + 1),
    prevPage: () => setCurrentPage(prev => prev - 1),
  };
};

export default useFetchCharacters;
