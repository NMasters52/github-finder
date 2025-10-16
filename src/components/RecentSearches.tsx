import { FaUser, FaClock } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { fetchGitHubUser } from "../api/github";

type RecentSearchesProps = {
  users: string[];
  updateUsername: (arg: string) => void;
  updateSubmittedUsername: (arg: string) => void;
};

const RecentSearches = ({
  users,
  updateUsername,
  updateSubmittedUsername,
}: RecentSearchesProps) => {
  const queryClient = useQueryClient();

  return (
    <div className="recent-searches">
      <div className="recent-header">
        <FaClock />
        <h3>Recent Searches</h3>
      </div>
      <ul>
        {users.map((user) => (
          <li key={user}>
            <button
              onClick={() => {
                updateUsername(user);
                updateSubmittedUsername(user);
              }}
              onMouseEnter={() => {
                queryClient.prefetchQuery({
                  queryKey: ["users", user],
                  queryFn: () => fetchGitHubUser(user),
                });
              }}
            >
              <FaUser className="user-icon" />
              {user}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;
