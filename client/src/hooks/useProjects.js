// ./client/src/hooks/useProjects.js

import { useEffect, useState } from "react";
import axios from "axios";

export function useProjects(username) {
  const cacheKey = `portfolio_projects_v3_${username}`;

  // Initialize from sessionStorage if available for instant 0ms rendering
  const [projects, setProjects] = useState(() => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every((p) => p.id != null)
        ) {
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return !(
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every((p) => p.id != null)
        );
      }
      return true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const apiUrl = import.meta.env.VITE_FLASK_API_URL || "";
        const res = await axios.get(
          `${apiUrl}/api/github/${username}/repos`
        );

        let localPortfolioInfo = null;
        try {
          const localInfoRes = await fetch("/PortfolioWebsiteInfo.json");
          if (localInfoRes.ok) {
            localPortfolioInfo = await localInfoRes.json();
          }
        } catch {
          // Ignore if local PortfolioWebsiteInfo.json cannot be fetched
        }

        const enriched = (res.data || []).map((repo) => {
          if (repo.name === "Portfolio-Website" && localPortfolioInfo) {
            return {
              ...repo,
              portfolio_info: {
                ...repo.portfolio_info,
                ...localPortfolioInfo,
              },
            };
          }
          return repo;
        });

        const sorted = enriched.sort((a, b) => {
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