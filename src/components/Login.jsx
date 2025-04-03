import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "harry") {
      console.log("Admin Login Successful:", username);
      navigate(`/admin-dashboard`);
      return;
    }
    localStorage.setItem("forceReload", Date.now());
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    console.log("Stored Users:", storedUsers); 
    const foundUser = storedUsers.find(
      (u) => u.username === username && u.password === password
    );
     console.log('user is', foundUser)
    if (foundUser) {
      console.log("Login Successful:", foundUser.username);
      
      if (foundUser.role ==="User") {
        navigate(`/dashboard/${foundUser.username}`);
      } else {
        navigate(`/manager-dashboard/${foundUser.username}`);
      }
    } else {
      alert("Invalid username or password!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 m-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 m-2"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2">
        Login
      </button>
    </div>
  );
};

export default Login;
