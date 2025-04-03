import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [managers, setManagers] = useState(() => {
    const storedManagers = localStorage.getItem("managers");
    return storedManagers ? JSON.parse(storedManagers) : [];
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [coinsToAdd, setCoinsToAdd] = useState("");

  useEffect(() => {
    localStorage.setItem("managers", JSON.stringify(managers));
  }, [managers]);

  const addManager = () => {
    if (username && password) {
      const newManager = {
        id: managers.length + 1,
        username,
        password,
        role: "manager",
        coins: 0,
      };
      setManagers([...managers, newManager]);
      setUsername("");
      setPassword("");
    }
  };

  const addCoinsToManager = () => {
    if (selectedManager && coinsToAdd) {
      const updatedManagers = managers.map((manager) =>
        manager.username === selectedManager
          ? { ...manager, coins: manager.coins + parseInt(coinsToAdd) }
          : manager
      );
      setManagers(updatedManagers);
      setCoinsToAdd("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Admin Dashboard</h1>
      <div className="w-full max-w-lg space-y-6">
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">Add Manager</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-300"
          />
          <button onClick={addManager} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md">
            Add Manager
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">Send Coins to Manager</h2>
          <select
            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-300"
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
          >
            <option value="">Select Manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.username}>
                {manager.username} (Coins: {manager.coins})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Enter Coins"
            value={coinsToAdd}
            onChange={(e) => setCoinsToAdd(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-300"
          />
          <button onClick={addCoinsToManager} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">
            Add Coins
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">Managers List</h2>
          {managers.length === 0 ? (
            <p className="text-gray-500">No managers added yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {managers.map((manager) => (
                <li key={manager.id} className="py-2 flex justify-between text-gray-700">
                  <span className="font-medium">{manager.username}</span>
                  <span className="text-sm text-gray-500">Coins: {manager.coins}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
