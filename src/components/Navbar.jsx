import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Wallet Exchange</h1>
      <Link to="/login" className="bg-blue-500 px-4 py-2 rounded-lg">
        Login
      </Link>
    </nav>
  );
};

export default Navbar;
