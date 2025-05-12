"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BlogFormCard({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryInfo, setCountryInfo] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await axios.get("https://restcountries.com/v3.1/all");
      const sorted = res.data.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
      setCountries(sorted);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (country) {
      const selected = countries.find((c) => c.name.common === country);
      setCountryInfo(selected);
    }
  }, [country]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!countryInfo) return;

    onSubmit({
      title,
      content,
      country,
      flag: countryInfo.flags?.png,
      currency: Object.values(countryInfo.currencies || {})[0]?.name,
      capital: countryInfo.capital?.[0],
    });

    // Reset form
    setTitle("");
    setContent("");
    setCountry("");
    setCountryInfo(null);
  };

  return (
    <div className="bg-[#1e293b] p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Create / Edit Blog Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-[#0f172a] text-white"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 rounded bg-[#0f172a] text-white"
          placeholder="Write your travel story..."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <select
          className="w-full p-2 rounded bg-[#0f172a] text-white"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        >
          <option value="">Select a country</option>
          {countries.map((c) => (
            <option key={c.cca3} value={c.name.common}>
              {c.name.common}
            </option>
          ))}
        </select>

        {countryInfo && (
          <div className="text-sm text-blue-300 mt-2">
            <p>Capital: {countryInfo.capital?.[0]}</p>
            <p>
              Currency:{" "}
              {Object.values(countryInfo.currencies || {})[0]?.name || "N/A"}
            </p>
            <img
              src={countryInfo.flags?.png}
              alt="Flag"
              className="h-10 mt-1 rounded border"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Post Blog
        </button>
      </form>
    </div>
  );
}
