import React from "react";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", active: true },
  { name: "Warranty Details", href: "/WarrantyDetails" },
  { name: "Spin to Win", href: "/spintowin" },
];

const Header = () => {
  return (
    <nav className="bg-[#1e2633] rounded-t-2xl flex items-center px-6 py-3 sticky top-0 z-50">
      {/* Logo */}
      <div className="mr-8">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4Z"
            fill="#6366F1"
          />
          <path
            d="M16 8C12.6863 8 10 10.6863 10 14C10 17.3137 12.6863 20 16 20C19.3137 20 22 17.3137 22 14C22 10.6863 19.3137 8 16 8Z"
            fill="#A5B4FC"
          />
        </svg>
      </div>
      {/* Nav Links */}
      <div className="flex space-x-4">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={`px-4 py-2 rounded-lg font-medium text-base transition-colors duration-200 ${
              link.active
                ? "bg-[#232b3a] text-white"
                : "text-gray-200 hover:bg-[#232b3a] hover:text-white"
            }`}
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Header;
