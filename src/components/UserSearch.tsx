import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubUser } from "../api/github";
import UserCard from "./UserCard";
import { FaClock, FaUser } from "react-icons/fa";

const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", submittedUsername],
    queryFn: () => fetchGitHubUser(submittedUsername),
    enabled: !!submittedUsername,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    setSubmittedUsername(trimmed);

    setRecentSearches((prev) => {
      const searches = [trimmed, ...prev.filter((u) => u !== trimmed)];
      return searches.slice(0, 5);
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={username}
          placeholder="Enter Github Username..."
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}

      {data && <UserCard user={data} />}
      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <div className="recent-header">
            <FaClock />
            <h3>Recent Searches</h3>
          </div>
          <ul>
            {recentSearches.map((user) => (
              <li key={user}>
                <button
                  onClick={() => {
                    setUsername(user);
                    setSubmittedUsername(user);
                  }}
                >
                  <FaUser className="user-icon" />
                  {user}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default UserSearch;
