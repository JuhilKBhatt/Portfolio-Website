// src/scripts/setNavIcon.js
// Set the icons for each navigation item

import {
  HomeOutlined,
  FolderOpenOutlined,
  MailOutlined,
  BookOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

// Export an object mapping navigation keys to their respective icons
export const setNavIcon = {
  home: HomeOutlined,
  projects: FolderOpenOutlined,
  contact: MailOutlined,
  education: BookOutlined,
  work: IdcardOutlined,
};
