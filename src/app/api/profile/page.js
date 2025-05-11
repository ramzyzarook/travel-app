"use client";

import { useState } from "react";
import { toast } from "react-toastify"; // Import toast

export default function ProfilePage() {
  // Dummy user data
  const initialUser = {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    bio: "This is a short bio",
  };

  const [userData, setUserData] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userData.name);
  const [newEmail, setNewEmail] = useState(userData.email);
  const [newBio, setNewBio] = useState(userData.bio);

  // Handle form submission for updating user info
  const handleUpdate = (e) => {
    e.preventDefault();

    // Update the user data
    setUserData({
      ...userData,
      name: newName,
      email: newEmail,
      bio: newBio,
    });

    setIsEditing(false);

    toast.success("Profile updated successfully!");
  };

  // Handle user deletion (this is just for the UI, no real deletion)
  const handleDelete = () => {
    setUserData(null); // Simulate user deletion
    toast.success("User profile deleted.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#010912] via-[#0f43a3] to-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
          Profile
        </h2>

        {/* User Info */}
        {userData ? (
          <>
            {!isEditing ? (
              <div className="text-center">
                <p className="text-lg font-medium">{userData.name}</p>
                <p className="text-gray-600">{userData.email}</p>
                <p className="mt-4 text-sm text-gray-500">{userData.bio}</p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleDelete}
                    className="mt-4 w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-3 bg-[#050337] text-gray-200 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
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
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-3 bg-[#050337] text-gray-200 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="w-full p-3 bg-[#050337] text-gray-200 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <div className="space-x-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-full py-3 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <p className="text-center text-red-500">
            User profile has been deleted.
          </p>
        )}
      </div>
    </div>
  );
}
