import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrendingUp, FiTrendingDown, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

const CryptoGrid = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [error, setError] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "market_cap_rank", direction: "asc" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        setCryptoData(response.data);
      } catch (error) {
        setError("Error fetching cryptocurrency data. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const handleItemClick = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...cryptoData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-500 text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Cryptocurrency Market
      </h1>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search cryptocurrencies"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => handleSort("market_cap_rank")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
          >
            Sort by Rank
          </button>
          <button
            onClick={() => handleSort("current_price")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
          >
            Sort by Price
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.map((crypto) => (
          <motion.div
            key={crypto.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            aria-label={`${crypto.name} cryptocurrency information`}
          >
            <div
              className="p-6 cursor-pointer"
              onClick={() => handleItemClick(crypto.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={crypto.image}
                    alt={`${crypto.name} icon`}
                    className="w-10 h-10 mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {crypto.name}
                    </h2>
                    <p className="text-sm text-gray-500">Rank: {crypto.market_cap_rank}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-medium ${crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <FiTrendingUp className="inline mr-1" />
                  ) : (
                    <FiTrendingDown className="inline mr-1" />
                  )}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${crypto.current_price.toLocaleString()}
              </p>
            </div>
            {expandedItem === crypto.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Market Cap:</p>
                    <p className="font-semibold">
                      ${crypto.market_cap.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">24h Volume:</p>
                    <p className="font-semibold">
                      ${crypto.total_volume.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Circulating Supply:</p>
                    <p className="font-semibold">
                      {crypto.circulating_supply.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">All-Time High:</p>
                    <p className="font-semibold">
                      ${crypto.ath.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CryptoGrid;
