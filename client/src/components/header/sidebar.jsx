// src/components/header/Sidebar.jsx
import { getNavList } from "../../scripts/getNavList";
import { Link, useLocation } from "react-router-dom";

const navItems = getNavList();

function sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col gap-4">
      {navItems.map((item) => {
        const Icon = item.icon; // now this is a component

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 ${
              location.pathname === item.path ? "bg-gray-700" : ""
            }`}
          >
            {Icon && <Icon className="text-xl" />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}

export default sidebar;