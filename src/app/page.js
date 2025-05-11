"use client";

import { useState } from "react";

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

  const sortedPosts = [...dummyPosts].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "likes") return b.likes - a.likes;
    if (sortBy === "comments") return b.comments - a.comments;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1b2a] via-[#1b263b] to-black text-white font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-5 bg-[#0d1b2a] shadow-lg border-b border-blue-700">
        <h1 className="text-3xl font-bold text-white tracking-wide">
          TravelTales 🌍
        </h1>
        <div className="space-x-8 text-lg font-medium">
          <a href="/" className="hover:text-blue-400 transition">
            Home
          </a>
          <a href="/search" className="hover:text-blue-400 transition">
            Search
          </a>
          <a href="/login" className="hover:text-blue-400 transition">
            Login
          </a>
          <a href="/profile" className="hover:text-blue-400 transition">
            Profile
          </a>
        </div>
      </nav>

      {/* Sort Controls */}
      <div className="flex items-center justify-between px-8 py-6">
        <h2 className="text-2xl font-semibold">Recent & Popular Blogs</h2>
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
      <div className="px-8 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="bg-[#1e293b] hover:bg-[#334155] transition-all duration-300 rounded-2xl shadow-lg overflow-hidden border border-blue-900"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-sm text-blue-200 mb-4">
                By <span className="text-blue-400">{post.author}</span> in{" "}
                <strong>{post.country}</strong> on{" "}
                {new Date(post.date).toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>❤️ {post.likes} Likes</span>
                <span>💬 {post.comments} Comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
