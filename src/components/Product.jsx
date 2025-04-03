import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { username } = useParams();
  const [ownedProducts, setOwnedProducts] = useState([]);
  const [wallet, setWallet] = useState(1000);
  const [products, setProducts] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [randomStatus, setRandomStatus] = useState({});

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=5&page=1&sparkline=false"
        );
        const data = await response.json();
        const formattedProducts = data.map((coin) => ({
          id: coin.id,
          name: coin.name,
          price: coin.current_price,
          image: coin.image,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((u) => u.username === username);

    if (foundUser) {
      setWallet(foundUser.coins);
      setOwnedProducts(foundUser.products || []);
    }
  }, [username]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomStatus((prev) => {
        const newStatus = {};
        products.forEach((product) => {
          newStatus[product.id] = Math.random() > 0.5 ? "good" : "bad";
        });
        return newStatus;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [products]);

  useEffect(() => {
    if (Object.keys(randomStatus).length > 0) {
      let updatedWallet = wallet;
      let updatedOwnedProducts = [...ownedProducts];

      updatedOwnedProducts = updatedOwnedProducts.filter((product) => {
        const status = randomStatus[product.id];
        if (status === "good" && product.goodQuantity > 0) {
          const reward = product.price * 0.1 * product.goodQuantity;
          updatedWallet += reward;
          alert(`You received a reward of ₹${reward.toFixed(2)} from ${product.name}!`);
          product.goodQuantity = 0;
        } else if (status === "bad" && product.badQuantity > 0) {
          const loss = product.price * 0.1 * product.badQuantity;
          updatedWallet -= loss;
          alert(`You lost ₹${loss.toFixed(2)} due to ${product.name}.`);
        }
        return product.goodQuantity > 0 || product.badQuantity > 0;
      });

      setWallet(updatedWallet);
      setOwnedProducts(updatedOwnedProducts);
     
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.map((u) =>
        u.username === username ? { ...u, coins: updatedWallet, products: updatedOwnedProducts } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
  }, [randomStatus]);


  const handleAmountChange = (productId, value) => {
    setAmounts((prev) => ({ ...prev, [productId]: value }));
  };

  const buyProduct = (product, type) => {
    const amount = parseFloat(amounts[product.id]) || 0;
    const quantity = amount / product.price;
    if (wallet >= amount && quantity > 0) {
      const updatedWallet = wallet - amount;
      const updatedOwnedProducts = [...ownedProducts];
      const existingProduct = updatedOwnedProducts.find((p) => p.id === product.id);

      if (existingProduct) {
        if (type === "good") existingProduct.goodQuantity = (existingProduct.goodQuantity || 0) + quantity;
        if (type === "bad") existingProduct.badQuantity = (existingProduct.badQuantity || 0) + quantity;
      } else {
        updatedOwnedProducts.push({ ...product, goodQuantity: type === "good" ? quantity : 0, badQuantity: type === "bad" ? quantity : 0 });
      }

      setWallet(updatedWallet);
      setOwnedProducts(updatedOwnedProducts);

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.map((u) =>
        u.username === username ? { ...u, coins: updatedWallet, products: updatedOwnedProducts } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    } else {
      alert("Not enough coins or invalid amount!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Product Market</h2>
      <p className="mb-4">Wallet Balance: {wallet} coins</p>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => {
          const enteredAmount = parseFloat(amounts[product.id]) || 0;
          const purchasableQuantity = enteredAmount / product.price;
          return (
            <div key={product.id} className="border p-4 rounded-lg shadow-md bg-white">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-600">Price: ₹{product.price}</p>
              <p>Status: {randomStatus[product.id] || "Waiting..."}</p>
              <input
                type="number"
                placeholder="Enter amount"
                value={amounts[product.id] || ""}
                onChange={(e) => handleAmountChange(product.id, e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              />
              <p className="text-gray-700 mt-1">You will get: {purchasableQuantity.toFixed(2)} units</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => buyProduct(product, "good")}
                  className="w-1/2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                >
                  Y(₹{product.price})
                </button>
                <button
                  onClick={() => buyProduct(product, "bad")}
                  className="w-1/2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                >
                  N(₹{product.price})
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductPage;