// src/scripts/setNavIcon.js
// Set the icons for each navigation item

import {
  HomeOutlined,
  FolderOpenOutlined,
  MailOutlined,
  BookOutlined,
  IdcardOutlined,
  CodeOutlined,
} from "@ant-design/icons";

// Export an object mapping navigation keys to their respective icons
export const setNavIcon = {
  home: HomeOutlined,
  projects: FolderOpenOutlined,
  "tech stack": CodeOutlined,
  "tech-stack": CodeOutlined,
  techstack: CodeOutlined,
  work: IdcardOutlined,
  experience: IdcardOutlined,
  education: BookOutlined,
  contact: MailOutlined,
};
