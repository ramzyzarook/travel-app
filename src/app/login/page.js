"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Import toast

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.text();
      setError(data);
      return;
    }

    const { token } = await response.json();
    localStorage.setItem("token", token); // Store token in localStorage

    toast.success("Login successful!"); // Show success toast

    setTimeout(() => {
      router.push("/profile"); // Redirect to profile page after toast
    }, 2000); // Delay redirection to allow the toast to appear
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#010912] via-[#0f43a3] to-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
          Welcome Back
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#050337] text-gray-200 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#050337] text-gray-200 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Do not have an account?{" "}
            <a
              href="/register"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
