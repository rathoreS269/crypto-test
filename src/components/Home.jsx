import Navbar from "./Navbar";

const Home = () => {
  return (
    <div className="h-screen bg-gray-200">
      <Navbar />
      <div className="flex justify-center items-center h-full">
        <h1 className="text-4xl font-bold">Welcome to Wallet Exchange ,Log In to Proceed</h1>
      </div>
    </div>
  );
};

export default Home;
