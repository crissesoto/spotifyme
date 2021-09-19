import {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

import { accessToken, logout, getCurrentUserProfile } from './spofify';

function App() {
  const [token, setToken] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      try {
        const { data } = await getCurrentUserProfile();
        setCurrentProfile(data);
      } catch(e) {
        console.error(e);
      }
    };
    
  },[]);

  return (
    <div className="App">
      <header className="App-header">
        {
          !token ? (
            <a
          className="App-link"
          href="http://localhost:8000/login"
        >
          log into shopify
        </a>
          ) : (
            <>
              <h1>Logged in</h1>
              <button onClick={logout}>Log out</button>
            </>
            
          )
        }
      </header>
    </div>
  );
}

export default App;
