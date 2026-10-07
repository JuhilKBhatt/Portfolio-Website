import { useState, useMemo, useRef, useEffect } from "react";
import { Layout } from "antd";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import PageTitle from "../components/PageTitle";
import "../styles/projects.css";

const BATCH_SIZE = 6;

export default function Projects() {
  const { projects, loading } = useProjects("juhilkbhatt");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("priority");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef(null);

  const visibleProjects = useMemo(() => {
    return projects.filter(
      (p) => p.portfolio_info && p.portfolio_info.Visibilty === true
    );
  }, [projects]);

  // Extract all distinct categories with counts dynamically from visible projects
  const categories = useMemo(() => {
    if (!visibleProjects.length) return [];
    const catMap = new Map();
    visibleProjects.forEach((p) => {
      const cat = (p.portfolio_info?.category || p.portfolio_info?.type || "General").trim();
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });

    const list = [
      { name: "ALL", label: "All Projects", count: visibleProjects.length },
    ];

    Array.from(catMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([name, count]) => {
        list.push({ name, label: name, count });
      });

    return list;
  }, [visibleProjects]);

  // Filter and sort visible projects
  const filteredAndSortedProjects = useMemo(() => {
    let list = visibleProjects;

    // Filter by selected category
    if (selectedCategory !== "ALL") {
      list = list.filter((p) => {
        const cat = (p.portfolio_info?.category || p.portfolio_info?.type || "General").trim();
        return cat.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // Sort projects
    const sorted = [...list];
    if (sortBy === "category") {
      sorted.sort((a, b) => {
        const catA = (a.portfolio_info?.category || a.portfolio_info?.type || "General").toLowerCase();
        const catB = (b.portfolio_info?.category || b.portfolio_info?.type || "General").toLowerCase();
        if (catA !== catB) return catA.localeCompare(catB);
        const pA = a.portfolio_info?.Priority ?? Infinity;
        const pB = b.portfolio_info?.Priority ?? Infinity;
        return pA - pB;
      });
    } else if (sortBy === "name") {
      sorted.sort((a, b) => {
        const nameA = (a.portfolio_info?.title || a.name || "").toLowerCase();
        const nameB = (b.portfolio_info?.title || b.name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else {
      // Default: Priority
      sorted.sort((a, b) => {
        const pA = a.portfolio_info?.Priority ?? Infinity;
        const pB = b.portfolio_info?.Priority ?? Infinity;
        return pA - pB;
      });
    }

    return sorted;
  }, [visibleProjects, selectedCategory, sortBy]);

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    setVisibleCount(BATCH_SIZE);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setVisibleCount(BATCH_SIZE);
  };

  const displayedProjects = useMemo(() => {
    return filteredAndSortedProjects.slice(0, visibleCount);
  }, [filteredAndSortedProjects, visibleCount]);

  const hasMore = visibleCount < filteredAndSortedProjects.length;

  useEffect(() => {
    if (!hasMore || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredAndSortedProjects.length));
        }
      },
      { rootMargin: "450px 0px" } // Pre-fetch next batch 450px before user hits bottom
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, filteredAndSortedProjects.length]);

  let content;
  if (loading) {
    content = (
      <div className="projects-grid fade-in">
        <ProjectCard.Skeleton count={6} />
      </div>
    );
  } else if (visibleProjects.length === 0) {
    content = <p style={{ textAlign: "center", color: "#94a3b8" }}>No visible projects to show.</p>;
  } else if (filteredAndSortedProjects.length === 0) {
    content = (
      <div className="projects-empty-state">
        <p>No projects found in category "{selectedCategory}".</p>
        <button
          type="button"
          className="projects-reset-filter-btn"
          onClick={() => handleCategoryChange("ALL")}
        >
          View All Projects
        </button>
      </div>
    );
  } else {
    content = (
      <>
        <div className="projects-grid fade-in">
          {displayedProjects.map((project, index) => {
            const key = project.id || project.name || index;
            return (
              <div className="projects-grid-item" key={key}>
                <ProjectCard project={project} index={index} />
              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="projects-lazy-footer">
            <div ref={sentinelRef} className="projects-lazy-sentinel" />
            <div className="projects-lazy-status">
              <span className="projects-lazy-pill">
                // BUFFER: {displayedProjects.length} OF {filteredAndSortedProjects.length} BUILDS DEPLOYED
              </span>
              <button
                type="button"
                className="projects-load-all-btn"
                onClick={() => setVisibleCount(filteredAndSortedProjects.length)}
              >
                [ DEPLOY ALL {filteredAndSortedProjects.length} BUILDS ]
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <Layout.Content className="projects-container with-bg">
      <PageTitle
        tag="REPOSITORIES"
        title="Projects"
        subtitle="A showcase of the tools, ideas, and creations I've built from full stack platforms to game prototypes."
        meta={
          !loading && visibleProjects.length > 0
            ? `${filteredAndSortedProjects.length} ACTIVE ${
                filteredAndSortedProjects.length === 1 ? "BUILD" : "BUILDS"
              }`
            : null
        }
      />

      {/* Sorting & Category Tabs below PageTitle */}
      {!loading && visibleProjects.length > 0 && (
        <div className="projects-filter-bar">
          <div className="projects-category-tabs" role="tablist" aria-label="Project categories">
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`project-category-tab ${isActive ? "is-active" : ""}`}
                  onClick={() => handleCategoryChange(cat.name)}
                >
                  <span>{cat.label}</span>
                  <span className="project-tab-count">{cat.count}</span>
                </button>
              );
            })}
          </div>

          <div className="projects-sort-controls">
            <span className="projects-sort-label">SORT:</span>
            <div className="projects-sort-buttons" role="group" aria-label="Sort projects">
              <button
                type="button"
                className={`projects-sort-btn ${sortBy === "priority" ? "is-active" : ""}`}
                onClick={() => handleSortChange("priority")}
                title="Sort by priority"
              >
                Priority
              </button>
              <button
                type="button"
                className={`projects-sort-btn ${sortBy === "category" ? "is-active" : ""}`}
                onClick={() => handleSortChange("category")}
                title="Sort alphabetically by category"
              >
                Category
              </button>
              <button
                type="button"
                className={`projects-sort-btn ${sortBy === "name" ? "is-active" : ""}`}
                onClick={() => handleSortChange("name")}
                title="Sort alphabetically by title"
              >
                Name
              </button>
            </div>
          </div>
        </div>
      )}

      {content}
    </Layout.Content>
  );
}