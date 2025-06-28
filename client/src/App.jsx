// ./client/src/App.jsx
import { useState, useEffect, use } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [data, setData] = useState(null);
  const API_BASE = import.meta.env.VITE_FLASK_API_URL;

  const fetchAPI = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/ping`);
      setData(response.data);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <div>
      </div>
      <div className="card">
        <p>
          {
            data ? `Response from Flask API: ${data.message}` : 'Loading...'
          }
        </p>
      </div>
    </>
  )
}

export default App
