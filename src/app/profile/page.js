"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    country: "",
    visit_date: "",
  });
  const [countries, setCountries] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [userId, setUserId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null); // Track post being edited

  useEffect(() => {
    // Load countries
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) =>
        setCountries(
          data.sort((a, b) => a.name.common.localeCompare(b.name.common))
        )
      );

    // Decode the JWT token and get the user ID
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (token) {
      const decoded = jwtDecode(token); // Decode the token
      setUserId(decoded.userId); // Set userId from the token
    }

    // Fetch user posts
    if (userId) {
      axios
        .get("/api/posts")
        .then((res) => setPosts(res.data.filter((p) => p.user_id === userId)));
    }
  }, [userId]); // Re-run the effect when userId changes

  const handleSelectCountry = (countryName) => {
    const selected = countries.find((c) => c.name.common === countryName);
    if (selected) {
      setSelectedData({
        flag: selected.flags?.png,
        currency: Object.values(selected.currencies || {})[0]?.name,
        capital: selected.capital?.[0],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingPostId) {
      // Update existing post
      await axios.put(
        `/api/posts/${editingPostId}`,
        {
          ...form,
          user_id: userId,
          ...selectedData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach token
          },
        }
      );
    } else {
      // Create new post
      await axios.post("/api/posts", {
        ...form,
        user_id: userId,
        ...selectedData,
      });
    }

    setEditingPostId(null); // Reset editing state
    setForm({
      title: "",
      content: "",
      country: "",
      visit_date: "",
    }); // Clear the form
    location.reload(); // Refresh the posts
  };

  const handleEdit = (post) => {
    // Pre-fill the form with post data for editing
    setEditingPostId(post.id);
    setForm({
      title: post.title,
      content: post.content,
      country: post.country,
      visit_date: post.visit_date,
    });
    setSelectedData({
      flag: post.flag,
      currency: post.currency,
      capital: post.capital,
    });
  };

  const handleDelete = async (postId) => {
    // Delete the post
    await axios.delete(`/api/posts/${postId}`);
    setPosts(posts.filter((post) => post.id !== postId)); // Remove from state
  };

  return (
    <div className="p-6 text-white bg-[#0d1b2a] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Your Blog Posts</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full p-2 bg-[#1b263b] text-white rounded"
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          className="w-full p-2 bg-[#1b263b] text-white rounded"
        ></textarea>

        <select
          value={form.country}
          onChange={(e) => {
            setForm({ ...form, country: e.target.value });
            handleSelectCountry(e.target.value);
          }}
          required
          className="w-full p-2 bg-[#1b263b] text-white rounded"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.cca3} value={c.name.common}>
              {c.name.common}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.visit_date}
          onChange={(e) => setForm({ ...form, visit_date: e.target.value })}
          required
          className="w-full p-2 bg-[#1b263b] text-white rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingPostId ? "Update Post" : "Create Post"}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="bg-[#1b263b] p-4 rounded mb-4">
          <h3 className="text-xl font-bold">{post.title}</h3>
          <p>{post.content}</p>
          <p className="text-sm text-blue-300">
            Visited: {post.country} on {post.visit_date}
          </p>
          {post.flag && (
            <img src={post.flag} alt="flag" className="w-12 mt-2" />
          )}
          <p className="text-sm">
            Capital: {post.capital}, Currency: {post.currency}
          </p>

          <div className="mt-4">
            <button
              onClick={() => handleEdit(post)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
