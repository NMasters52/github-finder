import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubUser } from "../api/github";
import UserCard from "./UserCard";
import RecentSearches from "./RecentSearches";

const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const stored = localStorage.getItem("recentSearches");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  });

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
    setUsername("");

    setRecentSearches((prev) => {
      const searches = [trimmed, ...prev.filter((u) => u !== trimmed)];
      return searches.slice(0, 5);
    });
  };

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

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
        <RecentSearches
          updateSubmittedUsername={setSubmittedUsername}
          updateUsername={setUsername}
          users={recentSearches}
        />
      )}
    </>
  );
};

export default UserSearch;
