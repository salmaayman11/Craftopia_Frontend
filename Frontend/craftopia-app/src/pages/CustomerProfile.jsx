import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import Profile from "../Components/Profile";
import CompleteProfile from "../Components/CompleteProfile";
import Wishlist from "../Components/Wishlist";
import Footer from "../Components/Footer";
import RequestCustomization from "../Components/RequestCustomization";
import CompareProducts from "../Components/CompareProducts";
import { MdCompare } from "react-icons/md";
import MyOrders from "./MyOrders";
import { FiPackage } from "react-icons/fi";

const CustomerProfile = ({ setIsLoggedIn }) => {
    const location = useLocation();
    const navigate = useNavigate();
      const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("customerActiveTab") || "profile";
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        navigate("/");
        }
    }, []);
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location]);

    useEffect(() => {
        localStorage.setItem("customerActiveTab", activeTab);
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("customerActiveTab");
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
        <div className={`fixed md:static w-64 bg-white p-4 shadow-md md:ml-30 md:mt-20 rounded-2xl md:h-[60vh] z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <nav>
            <ul className="space-y-3">
              <li
                onClick={() => handleTabClick("profile")}
                className={`hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base ${activeTab === "profile" ? "bg-gray-200 font-semibold" : ""}`}
              >
                <FaUser className="text-black" />
                My Profile
              </li>

              <li
                onClick={() => handleTabClick("wishlist")}
                className={`hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base ${activeTab === "wishlist" ? "bg-gray-200 font-semibold" : ""}`}
              >
                <FaHeart className="text-black" />
                Wishlist
              </li>

              <li
                onClick={() => {
                  navigate("/orders");
                  setSidebarOpen(false);
                }}
                className="hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base"
              >
                <FiPackage className="text-black" />
                My Orders
              </li>

              <li
                onClick={() => handleTabClick("compare")}
                className={`hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base ${activeTab === "compare" ? "bg-gray-200 font-semibold" : ""}`}
              >
                <MdCompare className="text-black" />
                Compare Products
              </li>

              <li
                onClick={() => handleTabClick("customization")}
                className={`hover:bg-gray-100 p-2.5 sm:p-2 rounded cursor-pointer flex items-center gap-2 touch-manipulation text-sm sm:text-base ${activeTab === "customization" ? "bg-gray-200 font-semibold" : ""}`}
              >
                Custom products
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex-1 p-4 sm:p-8 mt-20 md:mt-20">
          <div className="max-w-6xl mx-auto bg-[#FAF9F6] rounded-lg shadow-md p-4 sm:p-6 -mt-8">
            {activeTab === "profile" && <Profile setActiveTab={setActiveTab} />}
            {activeTab === "edit" && <CompleteProfile />}
            {activeTab === "wishlist" && <Wishlist />}
            {activeTab === "orders" && <MyOrders />}
            {activeTab === "compare" && <CompareProducts />}
            {activeTab === "customization" && <RequestCustomization />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerProfile;