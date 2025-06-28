// src/components/header/navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { getNavList } from "../../scripts/getNavList";

const navItems = getNavList();

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-gray-900 text-white p-4 flex gap-4">
      {navItems.map((item, idx) => (
        <Link
          key={idx}
          to={item.path}
          className={`hover:underline ${
            location.pathname === item.path ? "text-yellow-400" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default Navbar;