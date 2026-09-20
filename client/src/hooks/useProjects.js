// ./client/src/hooks/useProjects.js

import { useEffect, useState } from "react";
import axios from "axios";

export function useProjects(username) {
  const cacheKey = `portfolio_projects_${username}`;

  // Initialize from sessionStorage if available for instant 0ms rendering
  const [projects, setProjects] = useState(() => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem(cacheKey);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    let isMounted = true;

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

        if (isMounted) {
          setProjects(sorted);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(sorted));
          } catch {
            // ignore storage quota errors
          }
        }
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [username, cacheKey]);

  return { projects, loading };
}