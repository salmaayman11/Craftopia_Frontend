import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEdit, FaSignOutAlt, FaPlus, FaBars, FaTimes } from "react-icons/fa";
import { BarChart2 } from "lucide-react";
import GetProfile from "../Components/GetProfile";
import EditProfile from "../Components/EditProfile";
import AddProduct from "../Components/AddProduct";
import Footer from "../Components/Footer";
import ReviewRequests from "../Components/ReviewRequests";
import { Gavel } from "lucide-react";
import AuctionRequest from "../Components/AuctionRequest";
import RequestCategory from "../Components/RequestCategory";
import Messages from "../Components/Messages";
import SalesHistory from "../Components/SalesHistory";
import { useEffect } from "react";

const ArtistProfile = ({ setIsLoggedIn }) => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "profile";
  });
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  localStorage.setItem("activeTab", activeTab);
}, [activeTab]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeTab");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile when selecting a tab
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-20 left-4 z-50 bg-white p-3 rounded-lg shadow-md touch-manipulation"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex w-full flex-grow">
        {/* Sidebar */}
        <div className={`fixed md:static w-64 bg-white p-4 shadow-md md:ml-30 md:mt-20 rounded-2xl md:h-[60vh] z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <nav>
            <ul className="space-y-3">
              <li onClick={() => handleTabClick("profile")} className={`hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base ${activeTab === "profile" ? "bg-gray-200 font-semibold" : ""}`}>
                <FaUser className="text-black" /> My Profile
              </li>
              <li onClick={() => handleTabClick("edit")} className={`hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base ${activeTab === "edit" ? "bg-gray-200 font-semibold" : ""}`}>
                <FaEdit className="text-black" /> Update
              </li>
              <li onClick={() => handleTabClick("addproduct")} className={`hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base ${activeTab === "addproduct" ? "bg-gray-200 font-semibold" : ""}`}>
                <FaPlus className="text-black" /> Add Product
              </li>
              <li onClick={() => handleTabClick("review")} className={`hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base ${activeTab === "review" ? "bg-gray-200 font-semibold" : ""}`}>
                📋 View Requests
              </li>
              <li onClick={() => handleTabClick("auction")} className={`hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base ${activeTab === "auction" ? "bg-gray-200 font-semibold" : ""}`}>
                <Gavel className="h-4 w-4" /> Request Auction
              </li>
              <li onClick={() => handleTabClick("requestcategory")} className={`hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base ${activeTab === "requestcategory" ? "bg-gray-200 font-semibold" : ""}`}>
                📩 Request Category
              </li>
              <li
                onClick={() => handleTabClick("saleshistory")}
                className={`hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base ${activeTab === "saleshistory" ? "bg-gray-200 font-semibold" : ""
                  }`}
              >
                <BarChart2 className="h-4 w-4 text-black" /> Sales History
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 p-4 sm:p-8 mt-20 md:mt-20">
          <div className="max-w-6xl mx-auto bg-cream rounded-lg shadow-md p-4 sm:p-6 -mt-8">
            {activeTab === "profile" && <GetProfile setActiveTab={setActiveTab} />}
            {activeTab === "edit" && <EditProfile />}
            {activeTab === "addproduct" && <AddProduct />}
            {activeTab === "review" && <ReviewRequests onMessageClick={setSelectedMessageId} />}
            {activeTab === "auction" && <AuctionRequest />}
            {activeTab === "requestcategory" && <RequestCategory />}
            {activeTab === "saleshistory" && <SalesHistory />}
          </div>
          {selectedMessageId && (
            <div className="mt-8 max-w-4xl mx-auto">
              <Messages responseId={selectedMessageId} onClose={() => setSelectedMessageId(null)} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArtistProfile;
