import React from "react";
import { FaFileInvoice, FaBigo, FaHandshake, FaCalendarCheck, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const WorkflowSelector = () => {
  const navigate = useNavigate();

  const workflows = [
    {
      icon: <FaFileInvoice />,
      title: "e-Invoice Report",
      description: "View list e-Invoice input",
      action: () => navigate("/ReportInv"),
    },
    {
      icon: <FaChartLine />,
      title: "Coins Makets",
      description: "Get coins list",
      action: () => navigate("/CryptoReport"),
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <header className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Select a Workflow</h1>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-300 ease-in-out">
            Create your own workflow
          </button>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workflows.map((workflow, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out"
                onClick={workflow.action} // Thêm sự kiện click vào từng workflow
              >
                <div className="text-4xl text-blue-500 mb-4">{workflow.icon}</div>
                <h2 className="text-xl font-semibold mb-2">{workflow.title}</h2>
                <p className="text-gray-600 mb-4">{workflow.description}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-300 ease-in-out"
                  aria-label={`Use ${workflow.title} workflow`}
                >
                  Use workflow
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition duration-300 ease-in-out"
              aria-label="Show more workflows"
            >
              Show more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSelector;