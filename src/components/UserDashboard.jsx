import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [coinsToSend, setCoinsToSend] = useState(0);
  const [ownedProducts, setOwnedProducts] = useState([]);
  const [goodProducts, setGoodProducts] = useState([]);
  const [badProducts, setBadProducts] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((u) => u.username === username);
    console.log('user detail', foundUser)
    if (foundUser) {
      setUser(foundUser);
      setOwnedProducts(foundUser.products || []);
      setGoodProducts(foundUser.products?.filter(p => p.type === "good") || []);
      setBadProducts(foundUser.products?.filter(p => p.type === "bad") || []);
    }
  }, [username]);

  const sendCoinsToManager = () => {
    if (user && coinsToSend > 0 && user.coins >= coinsToSend) {
      const managers = JSON.parse(localStorage.getItem("managers")) || [];
      const userManager = managers.find((m) => m.username === user.manager);
      
      if (userManager) {
        // Update user's coin balance
        const updatedUser = { ...user, coins: user.coins - coinsToSend };
        setUser(updatedUser);
        
        // Update manager's coin balance
        const updatedManager = { ...userManager, coins: userManager.coins + coinsToSend };

        // Save updated data to localStorage
        const updatedUsers = JSON.parse(localStorage.getItem("users")) || [];
        const newUsers = updatedUsers.map((u) => u.username === username ? updatedUser : u);
        localStorage.setItem("users", JSON.stringify(newUsers));

        const updatedManagers = managers.map((m) => m.username === user.manager ? updatedManager : m);
        localStorage.setItem("managers", JSON.stringify(updatedManagers));
        
        alert(`${coinsToSend} coins sent to Manager ${user.manager}!`);
        setCoinsToSend(0);
      } else {
        alert("Manager not found!");
      }
    } else {
      alert("Not enough coins or invalid amount!");
    }
  };

  const updateUserInLocalStorage = (updatedProducts) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.username === username ? { ...u, products: updatedProducts } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
    <h2 className="text-2xl font-bold mb-4">Welcome, {user?.username}</h2>
    <p className="mb-2">Wallet Balance: {user?.coins} Coins</p>
    <p className="mb-2">Manager: {user?.manager}</p>
  
    <div className="mb-4">
      <input
        type="text"
        placeholder="Enter coins to send"
        value={coinsToSend === 0 ? "" : coinsToSend}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || /^\d+$/.test(value)) {
            setCoinsToSend(value === "" ? "" : Number(value));
          }
        }}
        className="border p-2 mr-2"
      />
      <button onClick={sendCoinsToManager} className="bg-blue-500 text-white px-4 py-2">
        Send to Manager
      </button>
    </div>
  
    <h3 className="text-xl font-semibold mt-4">Owned Products</h3>
    {ownedProducts.length > 0 ? (
      <ul>
        {ownedProducts.map((product) => (
          <li key={product.id} className="border p-2 mt-2">
            {product.name} - 
            Price: {product.price ? product.price.toFixed(1) : "N/A"} Coins - 
            Quantity: {product.quantity ? product.quantity.toFixed(1) : "N/A"} - 
            Total: {(product.price && product.quantity) ? (product.price * product.quantity).toFixed(1) : "N/A"} Coins
          </li>
        ))}
      </ul>
    ) : (
      <p>No products owned.</p>
    )}
  
    <h3 className="text-xl font-semibold mt-4">Good Products</h3>
    {goodProducts.length > 0 ? (
      <ul>
        {goodProducts.map((product) => (
          <li key={product.id} className="border p-2 mt-2">
            {product.name} - Quantity: {product.quantity ? product.quantity.toFixed(1) : "N/A"}
          </li>
        ))}
      </ul>
    ) : (
      <p>No good products owned.</p>
    )}
  
    <h3 className="text-xl font-semibold mt-4">Bad Products</h3>
    {badProducts.length > 0 ? (
      <ul>
        {badProducts.map((product) => (
          <li key={product.id} className="border p-2 mt-2">
            {product.name} - Quantity: {product.quantity ? product.quantity.toFixed(1) : "N/A"}
          </li>
        ))}
      </ul>
    ) : (
      <p>No bad products owned.</p>
    )}
  
    <div className="mt-6">
      <Link
        to={`/products/${username}`}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Go to Product Page
      </Link>
    </div>
  </div>
  

);
};
export default UserDashboard;
