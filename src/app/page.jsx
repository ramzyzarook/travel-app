"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const dummyPosts = [
  {
    id: 1,
    title: "Exploring Tokyo",
    author: "alice",
    country: "Japan",
    date: "2023-09-10",
    likes: 10,
    comments: 5,
  },
  {
    id: 2,
    title: "Sunset in Santorini",
    author: "bob",
    country: "Greece",
    date: "2024-04-01",
    likes: 22,
    comments: 12,
  },
  {
    id: 3,
    title: "Hiking in Patagonia",
    author: "carol",
    country: "Argentina",
    date: "2023-12-15",
    likes: 5,
    comments: 1,
  },
];

export default function HomePage() {
  const [sortBy, setSortBy] = useState("newest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  const sortedPosts = [...dummyPosts].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "likes") return b.likes - a.likes;
    if (sortBy === "comments") return b.comments - a.comments;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1b2a] via-[#1b263b] to-black text-white font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 bg-[#0d1b2a] shadow-lg border-b border-blue-700">
        <h1 className="text-2xl font-bold tracking-wide">TravelTales 🌍</h1>
        <div className="space-x-6">
          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="/search" className="hover:text-blue-400 transition">
            Search
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="hover:text-blue-400 transition">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-blue-400 hover:text-blue-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-400 transition">
                Login
              </Link>
              <Link href="/register" className="hover:text-blue-400 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Sort Controls */}
      <div className="px-6 py-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">
          Recent & Popular Blog Posts
        </h2>
        <div className="flex items-center space-x-3">
          <label htmlFor="sort" className="text-lg font-medium text-blue-300">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#1e293b] border border-blue-700 text-white py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="likes">Most Liked</option>
              <option value="comments">Most Commented</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="px-6 pb-12 grid gap-6">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="bg-[#1b263b]/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-blue-400/40 transition"
          >
            <h2 className="text-xl font-semibold text-white">{post.title}</h2>
            <p className="text-sm text-blue-200 mb-2">
              By <span className="text-blue-400">{post.author}</span> in{" "}
              <strong>{post.country}</strong> on {post.date}
            </p>
            <div className="flex gap-6 mt-2 text-sm text-gray-300">
              <span>❤️ {post.likes} likes</span>
              <span>💬 {post.comments} comments</span>
            </div>
            <div className="mt-4">
              <Link
                href={`/blog/${post.id}`}
                className="inline-block px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-full text-sm transition"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
