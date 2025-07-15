// ./client/src/hooks/useProjects.js

import { useEffect, useState } from "react";
import axios from "axios";

export function useProjects(username) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_FLASK_API_URL}/api/github/${username}/repos`
        );

        const sorted = (res.data || []).sort((a, b) => {
          const pA = a.portfolio_info?.Priority ?? Infinity;
          const pB = b.portfolio_info?.Priority ?? Infinity;
          return pA - pB;
        });

        setProjects(sorted);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [username]);

  return { projects, loading };
}