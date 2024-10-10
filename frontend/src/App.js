import './App.css';
import './components/PopupForNotes.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PopupForNotes from './components/PopupForNotes';
import Barchart from './Barchart';

function App() {
  const [products, setProducts] = useState({ transactions: [], totalPages: 1 }); // Update initial state structure
  const [statistics, setstatistics] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [selectedMonth, setSelectedMonth] = useState('March'); // Selected month filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenBar, setIsPopupOpenBar] = useState(false);
  const popupRef = useRef(null);
  const popupRefBar = useRef(null);
  const buttonRef = useRef(null);


  const productsPerPage = 10; // Show 10 rows per page
  useEffect(() => {
    function handleClickOutside(event) {
      if (!popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
      if (!popupRefBar.current.contains(event.target)) {
        setIsPopupOpenBar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Fetch data from API based on current filters
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/product', {
        params: {
          page: currentPage,
          perPage: productsPerPage,
          search: searchTerm,
          month: selectedMonth,
        },
      });
      setProducts(res.data); // Set products based on API response
      setTotalPages(res.data.totalPages); // Set total pages from API response
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };
  const fetchStatistics = async () => {
    try {
      const res = await axios.get('http://localhost:8080/product/statistics', {
        params: {
          month: selectedMonth
        },
      });
      setstatistics(res.data)
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  // useEffect to fetch data when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedMonth]); // Rerun effect when currentPage, searchTerm, or selectedMonth changes

  // Function to get month from date string
  const getMonthFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.getMonth(); // Returns month index (0 for Jan, 1 for Feb, etc.)
  };

  // List of month names, indexed by month number
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openPopup = () => {
    fetchStatistics();
    setIsPopupOpen(true);
  };
  const openPopupBar = () => {
    fetchStatistics();
    setIsPopupOpenBar(true);
  };
  console.log(statistics);
  return (
    <>
      <div className={`home_popup ${isPopupOpen ? 'acticehome_popup' : ''}`} onClick={() => setIsPopupOpen(false)}>
        <section ref={popupRef} className="home_popupForNotes" onClick={(e) => e.stopPropagation()}>
          {
            Object.entries(statistics).map(([key, value]) => (
              <div key={key}>
                <strong>{key}</strong>: {value}
              </div>
            ))
          }

        </section >


      </div>
      <div className={`home_popup ${isPopupOpenBar ? 'acticehome_popup' : ''}`} onClick={() => setIsPopupOpenBar(false)}>
        <section ref={popupRefBar} className="home_popupForNotes" onClick={(e) => e.stopPropagation()}>
          <Barchart statistics={statistics}></Barchart>

        </section >


      </div>

      <div className='product-list-container'>
        <h1>Product List</h1>

        {/* Search Bar */}
        <input
          type="text"
          className="search-bar"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 when changing search
          }}
        />
        {/* Month Filter */}
        <select
          className="month-filter"
          value={products.selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setCurrentPage(1); // Reset to page 1 when changing filters
          }}
        >
          <option value="">Select all</option>
          {monthNames.map((monthIndex) => (
            <option key={monthIndex} value={monthIndex}>
              {monthIndex}
            </option>
          ))}
        </select>
        <button onClick={() => openPopup()} className='statistics-btn'>Statistics</button>
        <button onClick={() => openPopupBar()} className='statistics-btn'>Barchart</button>

        {/* Product Table */}
        <table className="product-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Status</th>
              <th>Month of Sale</th>
            </tr>
          </thead>
          <tbody>
            {products.transactions.map((product, index) => (
              <tr key={product.id}>
                <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                <td>
                  <img src={product.image} alt={product.title} className="product-image" />
                </td>
                <td>{product.title}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>{product.sold == 'true' ? 'Sold' : 'Available'}</td>
                <td>{monthNames[getMonthFromDate(product.dateOfSale)]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="pagination">
          <button className="page-btn" onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button className="page-btn" onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
