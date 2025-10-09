import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");

  return (
    <form className="form">
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
