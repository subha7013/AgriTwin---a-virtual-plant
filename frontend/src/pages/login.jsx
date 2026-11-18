
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, User, Lock, Leaf } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("Backend authentication is not connected yet.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-lime-100 p-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-green-100">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-green-800">
            AgriTwin
            <Sprout size={28} className="text-green-600" />
          </h1>

          <p className="text-gray-500 mt-2">
            Smart Agriculture Monitoring System
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back!
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Login to continue to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Username
            </label>

            <div className="flex items-center border border-gray-200 rounded-xl px-3 focus-within:border-green-600">
              <User size={19} className="text-green-600" />

              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full p-3 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>

            <div className="flex items-center border border-gray-200 rounded-xl px-3 focus-within:border-green-600">
              <Lock size={19} className="text-green-600" />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 outline-none bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
          >
            Login
          </button>

        </form>

        {message && (
          <p className="text-center text-sm text-orange-600 mt-4">
            {message}
          </p>
        )}

        <div className="text-center mt-7">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-700 font-semibold hover:underline"
            >
              Register Now
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-green-700 text-sm">
          <Leaf size={16} />
          <span>Growing Smarter with AgriTwin</span>
        </div>

      </div>
    </div>
  );
}

export default Login;
