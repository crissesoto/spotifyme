import React from 'react'
import {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';

import { accessToken, logout, getCurrentUserProfile } from './spofify';
import {catchErrors} from './utils';

import styled from 'styled-components/macro';
import { GlobalStyle } from './styles';

const StyledLoginButton = styled.a`
  background-color: var(--green);
  color: var(--white);
  padding: 10px 20px;
  margin: 20px;
  border-radius: 30px;
  display: inline-block;
`;


// Scroll to top of page when changing routes
// https://reactrouter.com/web/guides/scroll-restoration/scroll-to-top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [token, setToken] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
        const { data } = await getCurrentUserProfile();
        setCurrentProfile(data);
        console.log(data)
    };

    catchErrors(fetchData());
    
  },[]);

  return (
    <div className="App">
      <GlobalStyle />

      <header className="App-header">
        {
          !token ? (
            <StyledLoginButton
          href="http://localhost:8000/login"
        >
          log into shopify
        </StyledLoginButton>
          ) : (
            <Router>
              <ScrollToTop />
              <Switch>
                <Route path="/top-artists">
                  <h1>Top Artists</h1>
                </Route>
                <Route path="/top-tracks">
                  <h1>Top Tracks</h1>
                </Route>
                <Route path="/playlists/:id">
                  <h1>Playlist</h1>
                </Route>
                <Route path="/playlists">
                  <h1>Playlists</h1>
                </Route>
                <Route path="/">
                  <div>
                    <button onClick={logout}>Log Out</button>

                    {currentProfile && (
                      <div>
                        <h1>{currentProfile.display_name}</h1>
                        <p>{currentProfile.followers.total} Followers</p>
                        {currentProfile.images.length > 0 && currentProfile.images[0].url && (
                          <img src={currentProfile.images[0].url} alt="Avatar"/>
                        )}
                      </div>
                    )}
                  </div>
                </Route>
              </Switch>
            </Router>       
          )
        }
      </header>
    </div>
  );
}

export default App;
