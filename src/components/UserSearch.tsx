import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubUser } from "../api/github";
import UserCard from "./UserCard";

const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", submittedUsername],
    queryFn: () => fetchGitHubUser(submittedUsername),
    enabled: !!submittedUsername,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmittedUsername(username.trim());
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
    </>
  );
};

export default UserSearch;
