import axios from 'axios';
import { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';

const PaginationBasic = ({ setResponse, setError, count,search }) => {
  const [activePage, setActivePage] = useState(1);
  const totalPages = Math.ceil(count / 10);

  const handlePageChange = async (page) => {
    try {
      const response = await axios.get(`https://swapi.dev/api/people/?search=${search}&page=${page}`);
      setResponse(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError('Failed to fetch data. Please try again later.');
      setResponse(null); // Clear the response on error
    }
  };

  const paginationItems = Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;
    return (
      <Pagination.Item
        key={pageNumber}
        active={activePage === pageNumber}
        onClick={() => {
          handlePageChange(pageNumber);
          setActivePage(pageNumber);
        }}
      >
        {pageNumber}
      </Pagination.Item>
    );
  });

  return (
    <div>
      <Pagination size="sm">
        {paginationItems}
      </Pagination>
    </div>
  );
};

export default PaginationBasic;
