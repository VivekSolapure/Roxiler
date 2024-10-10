import './App.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductListPage = () => {
  const [products, setProducts] = useState({ transactions: [], totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const productsPerPage = 10;

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
      setProducts(res.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedMonth]);

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

  return (
    <div className="product-list-container">
      <h1>Product List</h1>
      <input
        type="text"
        className="search-bar"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />
      <select
        className="month-filter"
        value={selectedMonth}
        onChange={(e) => {
          setSelectedMonth(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="">Select all</option>
        {/* Add more month options */}
        <option value="March">March</option>
      </select>

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
              <td>{product.sold === 'true' ? 'Sold' : 'Available'}</td>
              <td>{new Date(product.dateOfSale).toLocaleString('default', { month: 'long' })}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
  );
};

export default ProductListPage;
