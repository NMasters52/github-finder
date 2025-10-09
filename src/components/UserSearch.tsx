import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", submittedUsername],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_GITHUB_API_URL}/users/${submittedUsername}`
      );

      if (!res.ok) throw new Error("User not found");

      const data = await res.json();
      console.log(data);
      return data;
    },
    enabled: !!submittedUsername,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmittedUsername(username.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        value={username}
        placeholder="Enter Github Username..."
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default UserSearch;
