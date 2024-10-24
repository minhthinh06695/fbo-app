import React, { useState, useEffect } from "react";
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from 'xlsx';

const EInvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [expandedRow, setExpandedRow] = useState(null);
    const [error, setError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Số lượng mục trên mỗi trang

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch('/api/getInvdata');
                const data = await response.json();
                const mappedInvoices = data.map(invoice => ({
                    id: invoice.stt_rec,
                    invoiceNumber: invoice.so_hd,
                    date: new Date(invoice.ngay_hd).toISOString().split('T')[0],
                    amount: invoice.t_tt_nt,
                    customerName: invoice.ten_kh,
                    status: invoice.trang_thai
                }));
                setInvoices(mappedInvoices);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchInvoices();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
        }
    };

    const handleRowExpand = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const filteredInvoices = invoices.filter((invoice) =>
        Object.values(invoice).some(
            (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const sortedInvoices = [...filteredInvoices].sort((a, b) => {
        if (sortColumn) {
            if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
            if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedInvoices.length / pageSize);
    const paginatedInvoices = sortedInvoices.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    useEffect(() => {
        if (filteredInvoices.length === 0 && searchQuery !== "") {
            setError("No results found for the given search query.");
        } else {
            setError(null);
        }
    }, [filteredInvoices, searchQuery]);

    const renderSortIcon = (column) => {
        if (sortColumn === column) {
            return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(sortedInvoices);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
        XLSX.writeFile(workbook, 'invoices.xlsx');
    };

    const handleViewPdf = async (invoiceId) => {
        try {
            const response = await fetch(`/api/getPdfInv?id=${invoiceId}`);
            if (!response.ok) {
                throw new Error('Không thể tải file PDF');
            }
            const buffer = await response.arrayBuffer();
            const blob = new Blob([buffer], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(blob);
            window.open(pdfUrl, '_blank');
        } catch (error) {
            console.error('Lỗi khi tải file PDF:', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-4 flex justify-between items-center">
                <div className="relative flex-grow mr-4">
                    <input
                        type="text"
                        placeholder="Search invoice..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Search invoices"
                    />
                    <FaSearch className="absolute right-3 top-3 text-gray-400" />
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleExportExcel}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        <FaFileExcel className="mr-2" /> Export Excel
                    </button>
                </div>
            </div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            {["Invoice Number", "Date", "Amount", "Customer Name", "Status", "View PDF"].map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort(header.toLowerCase().replace(" ", ""))}
                                >
                                    <div className="flex items-center text-white">
                                        <span>{header}</span>
                                        <span className="ml-2">{renderSortIcon(header.toLowerCase().replace(" ", ""))}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                    {paginatedInvoices.map((invoice) => (
                        <motion.tr
                            key={invoice.id}
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 1 }} // Bạn có thể thử xóa exit nếu không cần
                            className="hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200"
                            onClick={() => handleRowExpand(invoice.id)}
                        >
                            <td className="border px-6 py-4 text-center">{invoice.invoiceNumber}</td>
                            <td className="border px-6 py-4">{invoice.date}</td>
                            <td className="border px-6 py-4">{invoice.amount}</td>
                            <td className="border px-6 py-4">{invoice.customerName}</td>
                            <td className="border px-6 py-4">{invoice.status}</td>
                            <td className="border px-6 py-4">
                                <button onClick={() => handleViewPdf(invoice.id)} className="text-blue-500 hover:underline">
                                    View
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default EInvoiceTable;
