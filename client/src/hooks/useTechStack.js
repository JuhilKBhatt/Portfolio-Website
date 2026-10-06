// ./client/src/hooks/useTechStack.js

import { useMemo } from "react";
import { useProjects } from "./useProjects";

export const CATEGORIES = [
  "Frontend",
  "Backend",
  "AI",
  "DevSecOps",
  "Test Automation",
];

export const BASELINE_TECH_STACK = {
  Frontend: ["React", "Vite", "CSS", "Ant Design"],
  Backend: ["Python", "Flask", "Gunicorn"],
  AI: ["Gemini API", "Claude API"],
  DevSecOps: ["Docker", "Nginx", "Cloudflare", "AWS", "Cloudinary", "GitHub Actions"],
  "Test Automation": ["Pytest"],
};

const LEGACY_CATEGORY_MAP = {
  // Frontend
  react: "Frontend",
  "react.js": "Frontend",
  "react+vite": "Frontend",
  vite: "Frontend",
  css: "Frontend",
  html: "Frontend",
  javascript: "Frontend",
  typescript: "Frontend",
  "ant design": "Frontend",
  antd: "Frontend",
  tailwind: "Frontend",
  tailwindcss: "Frontend",
  "tailwind css": "Frontend",
  bootstrap: "Frontend",
  vue: "Frontend",
  "next.js": "Frontend",
  nextjs: "Frontend",
  redux: "Frontend",
  ejs: "Frontend",
  "three.js": "Frontend",
  threejs: "Frontend",
  "wallpaper engine": "Frontend",
  unity: "Frontend",

  // Backend
  python: "Backend",
  flask: "Backend",
  django: "Backend",
  fastapi: "Backend",
  gunicorn: "Backend",
  node: "Backend",
  "node.js": "Backend",
  nodejs: "Backend",
  express: "Backend",
  "express.js": "Backend",
  sql: "Backend",
  postgresql: "Backend",
  postgres: "Backend",
  mysql: "Backend",
  mongodb: "Backend",
  redis: "Backend",
  sqlite: "Backend",
  java: "Backend",
  "spring boot": "Backend",
  golang: "Backend",
  "c#": "Backend",
  "c++": "Backend",
  boto3: "Backend",
  "rawg api": "Backend",
  "steam web api": "Backend",
  "aws dynamodb": "Backend",

  // AI
  "gemini api": "AI",
  gemini: "AI",
  "google gemini ai": "AI",
  "claude api": "AI",
  claude: "AI",
  openai: "AI",
  "chatgpt api": "AI",
  langchain: "AI",
  pytorch: "AI",
  tensorflow: "AI",
  huggingface: "AI",
  ollama: "AI",
  rag: "AI",
  llm: "AI",
  agents: "AI",
  "machine learning": "AI",

  // DevSecOps
  docker: "DevSecOps",
  "docker compose": "DevSecOps",
  nginx: "DevSecOps",
  cloudflare: "DevSecOps",
  aws: "DevSecOps",
  "aws ec2": "DevSecOps",
  wireguard: "DevSecOps",
  arduino: "DevSecOps",
  cloudinary: "DevSecOps",
  "github actions": "DevSecOps",
  git: "DevSecOps",
  linux: "DevSecOps",
  ubuntu: "DevSecOps",
  terminal: "DevSecOps",
  kubernetes: "DevSecOps",
  terraform: "DevSecOps",
  ci: "DevSecOps",
  cd: "DevSecOps",
  "ci/cd": "DevSecOps",

  // Test Automation
  pytest: "Test Automation",
  jest: "Test Automation",
  cypress: "Test Automation",
  playwright: "Test Automation",
  selenium: "Test Automation",
  mocha: "Test Automation",
  chai: "Test Automation",
  junit: "Test Automation",
  unittest: "Test Automation",
};

const CANONICAL_NAMES = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  html: "HTML",
  css: "CSS",
  react: "React",
  "react.js": "React",
  vite: "Vite",
  "ant design": "Ant Design",
  antd: "Ant Design",
  tailwind: "TailwindCSS",
  tailwindcss: "TailwindCSS",
  "tailwind css": "TailwindCSS",
  "next.js": "Next.js",
  nextjs: "Next.js",
  python: "Python",
  flask: "Flask",
  gunicorn: "Gunicorn",
  mongodb: "MongoDB",
  fastapi: "FastAPI",
  java: "Java",
  "spring boot": "Spring Boot",
  "c#": "C#",
  "c++": "C++",
  node: "Node.js",
  nodejs: "Node.js",
  "node.js": "Node.js",
  redis: "Redis",
  "three.js": "Three.js",
  ejs: "EJS",
  "wallpaper engine": "Wallpaper Engine",
  "gemini api": "Gemini API",
  "google gemini ai": "Gemini API",
  "claude api": "Claude API",
  docker: "Docker",
  nginx: "Nginx",
  cloudflare: "Cloudflare",
  aws: "AWS",
  "aws ec2": "AWS EC2",
  "aws dynamodb": "DynamoDB",
  wireguard: "WireGuard",
  boto3: "Boto3",
  linux: "Linux",
  ubuntu: "Ubuntu",
  terminal: "Terminal / Linux",
  cloudinary: "Cloudinary",
  "github actions": "GitHub Actions",
  pytest: "Pytest",
  unity: "Unity",
  "steam web api": "Steam Web API",
  "rawg api": "RAWG API",
  arduino: "Arduino",
  "machine learning": "Machine Learning",
};

function canonicalize(name) {
  if (!name || typeof name !== "string") return "";
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  return CANONICAL_NAMES[lower] || trimmed;
}

/**
 * Custom hook to aggregate technical skills and project usage across all projects.
 * Loads and correlates data from all GitHub repositories and local project specifications.
 *
 * @param {string} [username="juhilkbhatt"]
 * @returns {{
 *   techStack: object,
 *   categoryData: object,
 *   categories: string[],
 *   totalProjectsCount: number,
 *   loading: boolean,
 *   projects: Array
 * }}
 */
export function useTechStack(username = "juhilkbhatt") {
  const { projects, loading } = useProjects(username);

  const parsed = useMemo(() => {
    // categoryMap: { [catName]: { [toolLower]: { name, count, projects: Set } } }
    const categoryMap = {};
    const categoryProjects = {};

    CATEGORIES.forEach((cat) => {
      categoryMap[cat] = new Map();
      categoryProjects[cat] = new Set();
    });

    const addToolEntry = (catName, rawTool, projectTitle) => {
      if (!catName || !rawTool) return;
      const cleanName = canonicalize(rawTool);
      if (!cleanName) return;

      if (!categoryMap[catName]) {
        categoryMap[catName] = new Map();
      }
      if (!categoryProjects[catName]) {
        categoryProjects[catName] = new Set();
      }

      if (projectTitle) {
        categoryProjects[catName].add(projectTitle);
      }

      const lower = cleanName.toLowerCase();
      if (!categoryMap[catName].has(lower)) {
        categoryMap[catName].set(lower, {
          name: cleanName,
          count: 0,
          projects: new Set(),
        });
      }

      const entry = categoryMap[catName].get(lower);
      if (projectTitle && !entry.projects.has(projectTitle)) {
        entry.projects.add(projectTitle);
        entry.count += 1;
      }
    };

    // 1. Seed baseline Portfolio-Website data
    const baselineProjectTitle = "Portfolio Website";
    CATEGORIES.forEach((cat) => {
      (BASELINE_TECH_STACK[cat] || []).forEach((tool) => {
        addToolEntry(cat, tool, baselineProjectTitle);
      });
    });

    // 2. Aggregate across all loaded projects
    const allUniqueProjects = new Set([baselineProjectTitle]);

    if (Array.isArray(projects)) {
      projects.forEach((proj) => {
        const info = proj?.portfolio_info;
        if (!info) return;

        const projectTitle = info.title || proj.name || "Untitled Project";
        allUniqueProjects.add(projectTitle);

        // A. If project has categorized techStack, merge directly
        if (info.techStack && typeof info.techStack === "object") {
          Object.entries(info.techStack).forEach(([catName, items]) => {
            if (Array.isArray(items)) {
              items.forEach((tool) => addToolEntry(catName, tool, projectTitle));
            }
          });
        }
        // B. Legacy fallback: classify items from language array
        else if (Array.isArray(info.language)) {
          info.language.forEach((lang) => {
            if (typeof lang !== "string" || !lang.trim()) return;
            const normalized = lang.trim();

            // Special case for combined entries like "React+Vite"
            if (normalized.toLowerCase() === "react+vite") {
              addToolEntry("Frontend", "React", projectTitle);
              addToolEntry("Frontend", "Vite", projectTitle);
              return;
            }

            const targetCat = LEGACY_CATEGORY_MAP[normalized.toLowerCase()];
            if (targetCat) {
              addToolEntry(targetCat, normalized, projectTitle);
            }
          });

          // Check description for AI hints (e.g. "Machine Learning" in Skyrocket)
          if (/machine learning|neural network|deep learning|llm/i.test(info.description || "")) {
            addToolEntry("AI", "Machine Learning", projectTitle);
          }
        }
      });
    }

    // Build structured output
    const techStack = {};
    const categoryData = {};

    CATEGORIES.forEach((cat) => {
      const toolEntries = categoryMap[cat]
        ? Array.from(categoryMap[cat].values()).map((item) => ({
            name: item.name,
            count: item.count,
            projects: Array.from(item.projects),
          }))
        : [];

      // Sort tools by popularity (project count descending)
      toolEntries.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

      const toolNames = toolEntries.map((t) => t.name);
      techStack[cat] = toolNames;

      const projectList = Array.from(categoryProjects[cat] || []);

      categoryData[cat] = {
        name: cat,
        tools: toolEntries,
        toolNames,
        projects: projectList,
        projectCount: projectList.length,
        totalTools: toolEntries.length,
      };
    });

    return {
      techStack,
      categoryData,
      categories: CATEGORIES,
      totalProjectsCount: allUniqueProjects.size,
    };
  }, [projects]);

  return {
    techStack: parsed.techStack,
    categoryData: parsed.categoryData,
    categories: parsed.categories,
    totalProjectsCount: parsed.totalProjectsCount,
    loading,
    projects,
  };
}
