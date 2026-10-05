// ./client/src/hooks/useGitHubStats.js

import { useEffect, useState } from "react";
import axios from "axios";

export function useGitHubStats(username = "juhilkbhatt") {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_FLASK_API_URL || "";
        const res = await axios.get(`${apiUrl}/api/github/${username}/stats`);
        if (isMounted) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Error fetching GitHub stats:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [username]);

  return { stats, loading };
}
