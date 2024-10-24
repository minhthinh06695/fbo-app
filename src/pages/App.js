import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Login from './Login';
import Main from './Main';
import ReportInv from './ReportInv';
import CryptoReport from './CryptoReport';
import ProtectedRoute from '../components/ProtectedRoute';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  useEffect(() => {
    // Cập nhật trạng thái khi người dùng refresh trang
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedUsername = localStorage.getItem('username') || '';
    setIsAuthenticated(storedIsAuthenticated);
    setUsername(storedUsername);
  }, []);

  return (
    <>
      {isAuthenticated && (
        <Header 
          username={username} 
          setIsAuthenticated={setIsAuthenticated} 
          setUsername={setUsername} 
        />
      )}
      <Routes>
        <Route 
          path="/" 
          element={<Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />} 
        />
        <Route 
          path="/Main" 
          element={<ProtectedRoute element={<Main />} isAuthenticated={isAuthenticated} />} 
        />
        <Route 
          path="/ReportInv" 
          element={<ProtectedRoute element={<ReportInv />} isAuthenticated={isAuthenticated} />} 
        />
        <Route 
          path="/CryptoReport" 
          element={<ProtectedRoute element={<CryptoReport />} isAuthenticated={isAuthenticated} />} 
        />
      </Routes>
    </>
  );
};

export default App;
