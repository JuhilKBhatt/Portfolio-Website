// ./client/src/pages/tech-stack.jsx

import { Layout } from "antd";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import LoadingScreen from "../components/LoadingScreen";

export default function TechStack() {
    
    return (
        <Layout.Content className="tech-stack-container">
            <h1>Tech Stack</h1>
            <p>My go-to tools and technologies for building software.</p>
        </Layout.Content>
    );
}