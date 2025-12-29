import { useState } from "react";
import {
  FaHome,
  FaClipboardList,
  FaAngleDown,
  FaGavel,
  FaThList,
  FaSignOutAlt,
  FaExclamation,
  FaPlus, FaMoneyCheckAlt,
  FaBoxes,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { FaUser } from "react-icons/fa";

const AdminSidebar = ({ selected, setSelected, isOpen, setIsOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#F6EEEE] p-3 rounded-lg shadow-md touch-manipulation"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:static w-85 h-screen bg-[#F6EEEE] p-5 flex flex-col shadow-md shadow-gray-400 z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
      <div className="flex items-center gap-3 mb-20 pl-3">
        <h1
          className="text-[24px] cursor-pointer"
          style={{ fontFamily: "'Lily Script One', cursive" }}
          onClick={() => navigate("/")}
        >
          Craftopia
        </h1>

        <h1 className="text-[22px]" style={{ fontFamily: "'Lisu Bosa', sans-serif" }}>Admin</h1>
      </div>

      <div className="flex flex-col rounded-lg p-2 mx-2 gap-2">
        <SidebarButton
          icon={<FaHome />}
          text="Home"
          selected={selected === "Home"}
          onClick={() => setSelected("Home")}
        />

        <div>
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className={`w-full flex justify-between items-center p-2 rounded-lg transition-all ${selected === "Requests" ? "bg-[#DEC5C2] shadow-md border-l-4 border-[#8A6F6D]" : "hover:bg-[#E7D8D7]"
              }`}
          >
            <span className="flex items-center gap-2">
              <FaClipboardList /> Requests
            </span>
            <FaAngleDown className={`transition-transform ${openDropdown ? "rotate-180" : "rotate-0"}`} />
          </button>

          <div className={`ml-6 transition-all ${openDropdown ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
            <SidebarButton
              icon={<FaGavel />}
              text="Auctions"
              selected={selected === "Auctions"}
              onClick={() => setSelected("Auctions")}
            />
            <SidebarButton
              icon={<FaThList />}
              text="Categories"
              selected={selected === "Categories"}
              onClick={() => setSelected("Categories")}
            />
          </div>
        </div>
        <SidebarButton
          icon={<FaPlus />}
          text="Add Category"
          selected={selected === "Add Category"}
          onClick={() => setSelected("Add Category")}
        />

        <SidebarButton
          icon={<FaExclamation />}
          text="Reports"
          selected={selected === "Reports"}
          onClick={() => setSelected("Reports")}
        />
        <SidebarButton
          icon={<FaMoneyCheckAlt />}
          text="Payments"
          selected={selected === "Payments"}
          onClick={() => setSelected("Payments")}
        />
        <SidebarButton
          icon={<FaUsers />}
          text="User Management"
          selected={selected === "User Management"}
          onClick={() => setSelected("User Management")}
        />
        <SidebarButton
          icon={<FaBoxes />}
          text="Product Management"
          selected={selected === "Product Management"}
          onClick={() => setSelected("Product Management")}
        />
        <SidebarButton
          icon={<FaUser />}
          text="Profile"
          selected={selected === "Profile"}
          onClick={() => setSelected("Profile")}
        />
      </div>
      <div className="mt-auto pl-3">
        <SidebarButton
          icon={<FaSignOutAlt />}
          text="Logout"
          selected={false}
          onClick={() => {
            logout();
            navigate('/login');
          }}
        />
      </div>

      </div>
    </>
  );
};

const SidebarButton = ({ icon, text, selected, onClick }) => {
  return (
    <button
      className={`w-full flex items-center gap-2 p-2.5 sm:p-2 rounded-lg transition-all touch-manipulation text-sm sm:text-base ${selected ? "bg-[#DEC5C2] shadow-md" : "hover:bg-[#E7D8D7] active:bg-[#D1B4B2]"}`}
      onClick={onClick}
    >
      {icon} {text}
    </button>
  );
};

export default AdminSidebar;
