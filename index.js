require('dotenv').config()
const express = require('express');
const querystring = require('querystring');

const app = express();
const axios = require('axios');
const port = 8000;

const CLIENT_ID  = process.env.CLIENT_ID;
const CLIENT_SECRET  = process.env.CLIENT_SECRET;
const REDIRECT_URI  = process.env.REDIRECT_URI;

app.get('/', (req, res) => {
  res.json({data:"Hellow world"})
})

/**
 * Generates a random string containing numbers and letters
 * we use it to generate a random state 
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
 const generateRandomString = length => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

//1. Have your application request authorization
app.get('/login', (req, res) => { 
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email user-read-recently-played";
  //set a cookie
  res.cookie(stateKey, state);

  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`)
})

//2. Use authorization code we got from the authorize endpoint to request access token
//3. Use the access token from the callback to access the Spotify Web API; Spotify returns requested data
app.get('/callback', (req, res) => {
  const code = req.query.code || null;

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  }).then(response => {
      if (response.status === 200) {

        const { access_token, refresh_token } = response.data;

        const queryParams = querystring.stringify({
          access_token,
          refresh_token
        });

        res.redirect(`http://localhost:3000/?${queryParams}`);

      } else {
        res.redirect(`/?${querystring.stringify({ error: 'invalid_token' })}`);
      }
    }).catch(error => {
      res.send(error);
    });
});

app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query;

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  }).then(response => {
      res.send(response.data);
    }).catch(error => {
      res.send(error);
    });
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})