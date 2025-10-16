import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubUser } from "../api/github";
import UserCard from "./UserCard";
import { FaClock } from "react-icons/fa";
import RecentSearches from "./RecentSearches";

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
