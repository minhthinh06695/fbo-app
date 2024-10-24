import React, { useState } from "react";
import { FaBell, FaCog, FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Import useNavigate để chuyển hướng

const Header = ({ username, setIsAuthenticated, setUsername }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate(); // Khai báo hook useNavigate

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  // Hàm xử lý logout
  const handleLogout = () => {
    // Xóa dữ liệu từ localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    
    // Cập nhật trạng thái
    setIsAuthenticated(false);
    setUsername('');

    // Chuyển hướng về trang login
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80"
            alt="App Logo"
            className="w-10 h-10 mr-3 rounded-full transition-transform duration-300 hover:scale-110"
          />
          <h1 className="text-2xl font-bold text-white">Fast e-Invoice</h1>
        </div>

        <nav className="mb-4 md:mb-0">
          <ul className="flex space-x-4 text-white">
            <li><a href="#" className="hover:text-yellow-300 transition-colors duration-300">Home</a></li>
            <li><a href="#" className="hover:text-yellow-300 transition-colors duration-300">About</a></li>
            <li><a href="#" className="hover:text-yellow-300 transition-colors duration-300">Services</a></li>
            <li><a href="#" className="hover:text-yellow-300 transition-colors duration-300">Contact</a></li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="text-white hover:text-yellow-300 transition-colors duration-300"
              aria-label="Notifications"
            >
              <FaBell className="text-xl" />
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notification 1</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notification 2</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notification 3</a>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-300"
              aria-label="User menu"
            >
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=40&q=80"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span>{username}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
