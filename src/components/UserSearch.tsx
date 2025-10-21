import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchGitHubUser, searchGitHubUser } from "../api/github";
import UserCard from "./UserCard";
import RecentSearches from "./RecentSearches";
import type { GitHubUser } from "../types";

const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const stored = localStorage.getItem("recentSearches");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  });
  const [debouncedUsername] = useDebounce(username, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);

  //query for submitted github user search
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", submittedUsername],
    queryFn: () => fetchGitHubUser(submittedUsername),
    enabled: !!submittedUsername,
  });

  //query for suggested github user search
  const { data: suggestions } = useQuery({
    queryKey: ["github-user-suggestions", debouncedUsername],
    queryFn: () => searchGitHubUser(debouncedUsername),
    enabled: debouncedUsername.length > 1,
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
        <div className="dropdown-wrapper">
          <input
            type="text"
            value={username}
            placeholder="Enter Github Username..."
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              setShowSuggestions(val.trim().length > 1);
            }}
          />
          {showSuggestions && suggestions?.length > 0 && (
            <ul className="suggestions">
              {suggestions.slice(0, 5).map((user: GitHubUser) => (
                <li
                  key={user.login}
                  onClick={() => {
                    setUsername(user.login);
                    setShowSuggestions(false);

                    if (submittedUsername !== user.login) {
                      setSubmittedUsername(user.login);
                    } else {
                      refetch();
                    }
                  }}
                >
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="avatar-xs"
                  />
                  {user.login}
                </li>
              ))}
            </ul>
          )}
        </div>
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
