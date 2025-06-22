import React, {useState, useEffect} from "react";

function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/ping').then(
      response => response.json()
    ).then(
      data => {
        setData(data)
        console.log('Data fetched:', data)
      }
    ).catch(
      error => console.error('Error fetching data:', error)
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the React App</h1>
        {data ? (
          <p>Data from server: {JSON.stringify(data)}</p>
        ) : (
          <p>Loading data...</p>
        )}
      </header>
      <main>
        <p>This is a simple React application.</p>
      </main>
    </div>
  );
}

export default App;