// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/header/sidebar.jsx";
import { getNavList } from "./scripts/getNavList.js";

const routes = getNavList();

function App() {
  return (
    <Router>
      < Sidebar />
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={<route.element />} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;