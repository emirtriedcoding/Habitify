"use client";

import Link from "next/link";

import axios from "axios";

import { useState, useEffect } from "react";

import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      setShowPopup(false);
      return;
    }

    try {
      const { data } = await axios.get(`/api/search?q=${searchQuery}`);
      setResults(data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (query) {
      const timeoutId = setTimeout(() => {
        handleSearch(query);
      }, 300); // Debounce delay

      return () => clearTimeout(timeoutId);
    } else {
      setShowPopup(false);
    }
  }, [query]);

  useEffect(() => {
    const handler = () => {
      showPopup && setShowPopup(false);
    };

    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, [showPopup]);

  return (
    <div className="card border border-base-200 bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="relative mx-auto w-full max-w-lg">
          <label className="input input-bordered flex items-center">
            <input
              type="text"
              placeholder="جستجو کنید ..."
              className="grow px-3 py-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query && setShowPopup(true)} // Show popup when focused and has query
            />
            <SearchIcon className="mr-2 text-gray-400" />
          </label>

          {showPopup && (
            <div className="absolute left-0 right-0 z-50 mt-2 rounded-lg border border-base-300 bg-base-200 shadow-lg">
              {results.length > 0 ? (
                results.map((result) => (
                  <Link
                    href={`/app/${result.username}`}
                    key={result._id}
                    className="flex cursor-pointer items-center gap-3 p-3 hover:bg-primary/5"
                  >
                    <img src={result.image || "/assets/noavatar.png"} className="h-10 w-10 rounded-full" alt="User" />
                    <p className="font-bold">{result.name}</p>
                  </Link>
                ))
              ) : (
                <div className="p-3 text-sm">
                  هیچ نتیجه‌ای یافت نشد
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
