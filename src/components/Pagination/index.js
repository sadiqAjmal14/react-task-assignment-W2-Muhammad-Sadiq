import { useMemo } from 'react';
import Pagination from 'react-bootstrap/Pagination';
const PaginationBasic = ({ totalPages,setActivePage,activePage,next,prev,...props }) => {

  const paginationItems = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => {
      const pageNumber = index + 1;
      return (
        <Pagination.Item
          key={pageNumber}
          active={activePage === pageNumber}
          onClick={() => {
            window.scrollTo({top:0,behavior:'smooth'})
            setActivePage(pageNumber)}}
        >
          {pageNumber}
        </Pagination.Item>
      );
    });
  }, [totalPages, activePage,setActivePage]);

  return (
    (totalPages!==0)?<div>
      <Pagination size="sm" {...props}>
      <Pagination.Prev disabled={activePage===1} onClick={prev} />
        
        {paginationItems}
        <Pagination.Next disabled={activePage===totalPages} onClick={next}/>
      </Pagination>
    </div>:<></>
  );
};

export default PaginationBasic;
