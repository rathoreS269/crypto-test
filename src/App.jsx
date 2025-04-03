import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
 import AdminDashboard from "./components/AdminDashboard";
 import UserDashboard from "./components/UserDashboard";
 import ProductPage from "./components/Product";
import ManagerDashboard from "./components/ManagerDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
       <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
       <Route path="/manager-dashboard/:managerName" element={<ManagerDashboard />} />
       <Route path="/dashboard/:username" element={<UserDashboard />} />
       <Route path="/products/:username" element={<ProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
