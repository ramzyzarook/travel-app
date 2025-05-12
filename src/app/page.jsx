"use client";
import { useState, useEffect } from "react"; // Already imported
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [sortBy, setSortBy] = useState("newest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState(""); // Track new comment input
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch posts from the server when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts"); // Adjust this to your backend API route
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // Handle comment input change
  const handleCommentInput = (e) => {
    setNewComment(e.target.value);
  };

  // Handle comment submission
  const handleComment = async (postId) => {
    if (newComment.trim() === "") return;

    // Make sure that comments is initialized as an array
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        if (!post.comments) {
          post.comments = []; // Initialize the comments array if it doesn't exist
        }
        post.comments.push(newComment); // Add the new comment
      }
      return post;
    });

    setPosts(updatedPosts); // Update the state with the new comment
    setNewComment(""); // Clear the comment input

    // Optionally, send the comment to the backend
    await fetch(`/api/posts/${postId}/comment`, {
      method: "POST",
      body: JSON.stringify({ comment: newComment }),
      headers: { "Content-Type": "application/json" },
    });
  };

  // Sort the posts based on the selected option
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "likes") return b.likes - a.likes;
    if (sortBy === "comments") return b.comments.length - a.comments.length;
    return 0;
  });

  // Handle like functionality
  const handleLike = async (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        post.likes += 1; // Increment the like count
      }
      return post;
    });

    setPosts(updatedPosts); // Update the state with the new like count

    // Optionally, send the updated like count to the backend
    await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      body: JSON.stringify({
        likes: updatedPosts.find((post) => post.id === postId).likes,
      }),
      headers: { "Content-Type": "application/json" },
    });
  };

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
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                  router.push("/");
                }}
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
              <span>
                💬 {post.comments ? post.comments.length : 0} comments
              </span>
            </div>

            {/* Flag and Country Data */}
            {post.countryFlag && (
              <img
                src={post.countryFlag}
                alt="Country Flag"
                className="w-16 h-10 mt-4"
              />
            )}
            {post.currency && (
              <p className="text-sm mt-2 text-gray-200">
                Currency: {post.currency}
              </p>
            )}
            {post.capital && (
              <p className="text-sm mt-1 text-gray-200">
                Capital: {post.capital}
              </p>
            )}

            {/* Blog Content */}
            <p className="mt-4 text-gray-300">{post.content}</p>

            {/* Like Button */}
            <button
              onClick={() => handleLike(post.id)} // Now the function is defined
              className="mt-4 bg-blue-600 px-4 py-2 text-white rounded-full"
            >
              Like
            </button>

            {/* Comment Section */}
            {isLoggedIn && (
              <div className="mt-4">
                <textarea
                  value={newComment}
                  onChange={handleCommentInput}
                  placeholder="Add a comment..."
                  className="w-full p-2 text-black rounded-md"
                />
                <button
                  onClick={() => handleComment(post.id)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-full"
                >
                  Submit Comment
                </button>
              </div>
            )}

            <div className="mt-4">
              {post.comments && post.comments.length > 0 && (
                <ul>
                  {post.comments.map((comment, index) => (
                    <li key={index} className="text-sm text-gray-300">
                      {comment}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
