// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/header/navbar";
import { getNavList } from "./scripts/getNavList";

const routes = getNavList();

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {routes.map((route, idx) => (
          <Route key={idx} path={route.path} element={<route.element />} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;