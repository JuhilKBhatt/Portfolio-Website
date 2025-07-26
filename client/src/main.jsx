/// ./client/src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Carousel: {
            dotHeight: 24,
            dotWidth: 24,
            dotActiveWidth: 42,
            dotGap: 12,
            dotOffset: 24,
            colorBgContainer: '#F04B24',
            arrowSize: 32,
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);