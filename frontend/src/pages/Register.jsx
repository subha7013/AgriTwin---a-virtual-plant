import { useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, User, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    const result = await register(username.trim(), email.trim(), password);

    setSubmitting(false);
    setMessage(result.message);
    setSuccess(result.success);

    if (result.success) {
      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-lime-100 p-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-green-100">

        {/* Logo */}
        <div className="text-center mb-7">
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-green-800">
            AgriTwin
            <Sprout size={28} className="text-green-600" />
          </h1>

          <p className="text-gray-500 mt-2">
            Smart Agriculture Monitoring System
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800">
          Create Account
        </h2>

        <p className="text-gray-500 text-sm mt-1 mb-6">
          Join AgriTwin and manage your plants smartly
        </p>

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
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full p-3 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>

            <div className="flex items-center border border-gray-200 rounded-xl px-3 focus-within:border-green-600">
              <Mail size={19} className="text-green-600" />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full p-3 outline-none bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>

        </form>

        {message && (
          <p
            className={`text-center text-sm mt-4 ${
              success ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-gray-600 text-sm mt-7">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-700 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;