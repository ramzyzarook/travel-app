"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

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
  const [editingPostId, setEditingPostId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) =>
        setCountries(
          data.sort((a, b) => a.name.common.localeCompare(b.name.common))
        )
      );
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios.get("/api/posts").then((res) => {
        const userPosts = res.data.filter(
          (p) => String(p.user_id) === String(userId)
        );
        setPosts(userPosts);
      });
    }
  }, [userId]);

  const handleSelectCountry = (countryName) => {
    const selected = countries.find((c) => c.name.common === countryName);
    if (selected) {
      const flag = selected.flags?.png;
      const currency = Object.values(selected.currencies || {})[0]?.name;
      const capital = selected.capital?.[0];
      setSelectedData({ flag, currency, capital });
      setForm((prev) => ({ ...prev, country: countryName }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!userId) return;

    const payload = {
      ...form,
      user_id: userId,
      ...selectedData,
    };

    if (editingPostId) {
      await axios.put(`/api/posts/${editingPostId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post("/api/posts", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setEditingPostId(null);
    setForm({ title: "", content: "", country: "", visit_date: "" });
    setSelectedData({});
    location.reload();
  };

  const handleEdit = (post) => {
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
    const token = localStorage.getItem("token");
    await axios.delete(`/api/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleHomeRedirect = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#A1E3F9] text-[#002366] font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-[#002366] text-white shadow-lg fixed top-0 left-0 w-full z-10">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={handleHomeRedirect}
        >
          TravelTales 🌍
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleHomeRedirect}
            className="bg-[#0F52BA] text-white px-4 py-2 rounded-lg hover:bg-[#002366] text-sm"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Blog Post Form */}
      <div className="pt-[6rem] px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Manage Your Blog Posts</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full p-4 bg-white border border-[#0F52BA] text-black text-sm rounded-lg focus:ring-2 focus:ring-[#002366]"
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            className="w-full p-4 bg-white border border-[#0F52BA] text-black text-sm rounded-lg focus:ring-2 focus:ring-[#002366]"
          />
          <select
            value={form.country}
            onChange={(e) => handleSelectCountry(e.target.value)}
            required
            className="w-full p-4 bg-white border border-[#0F52BA] text-black text-sm rounded-lg focus:ring-2 focus:ring-[#002366]"
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
            className="w-full p-4 bg-white border border-[#0F52BA] text-black text-sm rounded-lg focus:ring-2 focus:ring-[#002366]"
          />
          {selectedData.flag && (
            <div className="flex items-center gap-4 text-sm">
              <img src={selectedData.flag} alt="flag" className="w-10 h-6" />
              <span>Capital: {selectedData.capital}</span>
              <span>Currency: {selectedData.currency}</span>
            </div>
          )}
          <button
            type="submit"
            className="bg-[#0F52BA] text-white px-6 py-3 rounded-lg hover:bg-[#002366] text-sm"
          >
            {editingPostId ? "Update Post" : "Create Post"}
          </button>
        </form>
      </div>

      {/* Posts Section */}
      <div className="pt-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No posts found for your account.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-gradient-to-r from-[#020407] to-[#330381] text-white p-6 rounded-lg mb-6"
            >
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p className="text-sm my-2">{post.content}</p>
              <p className="text-xs text-blue-300 mb-2">
                Visited: {post.country} on {post.visit_date}
              </p>
              {post.flag && (
                <img src={post.flag} alt="flag" className="w-12 mb-2" />
              )}
              <p className="text-xs">
                Capital: {post.capital} | Currency: {post.currency}
              </p>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
