import React from "react";

const navLinks = [
  // { name: "Dashboard", href: "/dashboard", active: true },
  // { name: "Warranty Details", href: "/WarrantyDetails" },
  { name: "Spin to Win", href: "/spintowin", active: true  },
];

const Header = () => {
  return (
    <nav className="bg-[gray] rounded-t-2xl flex items-center px-6 py-5 sticky top-0 z-50">
      {/* Logo */}
      <div className="mr-8">
        <img
          src="/BridgestoneLOGO.svg"
          width="200"
          height="80"
          alt="Bridgestone Logo"
          className="object-contain h-20"
        />
      </div>
      {/* Nav Links */}
      <div className="ml-auto flex space-x-4">
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
