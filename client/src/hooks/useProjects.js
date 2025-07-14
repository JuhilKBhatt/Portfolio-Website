// ./client/src/hooks/useProjects.js

import { useEffect, useState } from "react";
import axios from "axios";

export function useProjects(username) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_FLASK_API_URL+"/api/github/"+username+"/repos");
        setProjects(res.data || []);
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