import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ManagerDashboard = () => {
  const { managerName } = useParams(); // Corrected parameter name
  const [manager, setManager] = useState(null);
  const [users, setUsers] = useState([]);
  const [managerWallet, setManagerWallet] = useState(0);
  const [selectedUser, setSelectedUser] = useState("");
  const [coinsToAdd, setCoinsToAdd] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const managers = JSON.parse(localStorage.getItem("managers")) || [];
    const foundManager = managers.find((m) => m.username === managerName);
    console.log('manager detail', foundManager);
    if (foundManager) {
      setManager(foundManager);
      setManagerWallet(foundManager.coins);
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const managerUsers = storedUsers.filter((user) => user.manager === managerName);
    setUsers(managerUsers);
  }, [managerName]);

  const addUser = () => {
    if (newUsername && newPassword) {
      const newUser = {
        id: users.length + 1,
        username: newUsername,
        password: newPassword,
        coins: 0,
        manager: managerName,
        role: "User",
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setNewUsername("");
      setNewPassword("");
    }
  };

  const addCoins = () => {
    if (selectedUser && coinsToAdd && managerWallet >= parseInt(coinsToAdd)) {
      const updatedUsers = users.map((user) =>
        user.username === selectedUser
          ? { ...user, coins: user.coins + parseInt(coinsToAdd) }
          : user
      );
      setUsers(updatedUsers);
      setManagerWallet(managerWallet - parseInt(coinsToAdd));

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      const updatedManagers = JSON.parse(localStorage.getItem("managers")).map((m) =>
        m.username === managerName ? { ...m, coins: managerWallet - parseInt(coinsToAdd) } : m
      );
      localStorage.setItem("managers", JSON.stringify(updatedManagers));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Manager Dashboard</h1>
      <h2 className="text-xl font-semibold">Manager: {manager?.username}</h2>
      <p className="text-lg">Wallet Balance: {managerWallet} Coins</p>
      <p className="text-lg">Total Users Under You: {users.length}</p>

      <div className="w-full max-w-lg space-y-6">
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">Create User</h2>
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
          />
          <button onClick={addUser} className="w-full bg-green-500 text-white py-2 rounded-md">
            Add User
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">Send Coins</h2>
          <select
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.username}>
                {user.username} - {user.coins} Coins
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Enter Coins"
            value={coinsToAdd}
            onChange={(e) => setCoinsToAdd(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
          />
          <button onClick={addCoins} className="w-full bg-blue-500 text-white py-2 rounded-md">
            Add Coins
          </button>
        </div>
      </div>

      <div className="mt-6 w-full max-w-lg bg-white shadow-md rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-600 mb-3">Users Under You</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id} className="border-b border-gray-200 py-2">
                <span className="font-semibold">{user.username}</span> - {user.coins} Coins
              </li>
            ))}
          </ul>
        ) : (
          <p>No users assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;