"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [sortBy, setSortBy] = useState("newest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCommentInput = (e, postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, newComment: e.target.value } : post
      )
    );
  };

  const handleComment = async (postId) => {
    const comment = posts.find((post) => post.id === postId)?.newComment;
    if (!comment?.trim()) return;

    try {
      await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        body: JSON.stringify({ comment }),
        headers: { "Content-Type": "application/json" },
      });

      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), comment],
                newComment: "",
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleLike = async (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        post.likes += 1;
      }
      return post;
    });

    setPosts(updatedPosts);

    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        body: JSON.stringify({
          likes: updatedPosts.find((post) => post.id === postId).likes,
        }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const sortedPosts = [...posts]
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "comments") return b.comments.length - a.comments.length;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#A1E3F9] text-[#002366] font-sans">
      <nav className="flex justify-between items-center px-6 py-4 bg-[#002366] text-white shadow">
        <h1 className="text-2xl font-bold">TravelTales 🌍</h1>
        <div className="space-x-6">
          <Link href="/" className="hover:text-[#A1E3F9] transition">
            Home
          </Link>
          <Link href="/search" className="hover:text-[#A1E3F9] transition">
            Search
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="hover:text-[#A1E3F9] transition">
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                  router.push("/");
                }}
                className="hover:text-[#A1E3F9] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[#A1E3F9] transition">
                Login
              </Link>
              <Link
                href="/register"
                className="hover:text-[#A1E3F9] transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="px-6 py-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-semibold">Recent & Popular Blog Posts</h2>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white text-black placeholder-gray-500 border border-[#0F52BA] focus:outline-none focus:ring-2 focus:ring-[#002366]"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="font-medium">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#0F52BA] text-black py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002366]"
            >
              <option value="newest">Newest</option>
              <option value="likes">Most Liked</option>
              <option value="comments">Most Commented</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-6 pb-12 grid gap-6">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="bg-gradient-to-r from-[#020407] to-[#330381] text-white p-6 rounded-xl shadow-lg"
          >
            {/* Top section */}
            <div className="flex justify-between flex-wrap">
              {/* Left Top */}
              <div className="space-y-1 pr-4 max-w-lg">
                <h2 className="text-2xl font-bold">{post.title}</h2>
                <p className="text-sm">
                  By{" "}
                  <span className="text-[#dbd111] font-medium">
                    {post.author}
                  </span>
                </p>
                <p className="text-sm">
                  Visited: {post.country} on {post.date}
                </p>
                <div className="flex gap-4 text-sm">
                  <span>❤️ {post.likes} likes</span>
                  <span>💬 {post.comments?.length || 0} comments</span>
                </div>
              </div>

              {/* Right Top */}

              {/* Currency & Capital Section - Below the Flag */}
              <div className="mt-4 flex flex-col justify-start ml-4">
                {post.currency && (
                  <p className="text-base mb-2">
                    💱 <span className="font-medium">Currency:</span>{" "}
                    {post.currency}
                  </p>
                )}
                {post.capital && (
                  <p className="text-base">
                    🏙️ <span className="font-medium">Capital:</span>{" "}
                    {post.capital}
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-4">
                {/* Flag Section */}
                {post.flag && (
                  <div className="w-32 h-20 rounded-lg border border-white shadow-md">
                    <img
                      src={post.flag}
                      alt={`${post.country} flag`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="mt-6 text-justify text-base leading-relaxed px-2">
              {post.content}
            </div>

            {/* Like button - center */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => handleLike(post.id)}
                className="bg-gradient-to-r from-[#4e54c8] to-[#8f94fb] text-white px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transform transition-all duration-300"
              >
                ❤️ Like this post
              </button>
            </div>

            {/* Comment input - center */}
            {isLoggedIn && (
              <div className="mt-6 flex flex-col items-center">
                <textarea
                  value={post.newComment || ""}
                  onChange={(e) => handleCommentInput(e, post.id)}
                  placeholder="Share your thoughts..."
                  className="w-full md:w-2/3 p-3 rounded-lg border border-[#0F52BA] bg-[#0a0a23] text-white focus:ring-2 focus:ring-[#4e54c8] outline-none"
                />
                <button
                  onClick={() => handleComment(post.id)}
                  className="mt-3 bg-gradient-to-r from-[#36d1dc] to-[#5b86e5] text-white px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transform transition-all duration-300"
                >
                  💬 Submit Comment
                </button>
              </div>
            )}

            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-6 px-4 py-3 rounded-lg bg-[#1e1e2f] border border-[#4e54c8] shadow-inner">
                <h3 className="text-md font-semibold text-[#dbd111] mb-2">
                  Comments:
                </h3>
                <ul className="text-sm text-white space-y-2">
                  {post.comments.map((comment, index) => (
                    <li
                      key={index}
                      className="bg-[#2a2a3d] p-2 rounded-md shadow-sm"
                    >
                      • {comment}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
