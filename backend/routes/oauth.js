require("dotenv").config();

const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Fetch top games
router.get('/top-games', async (req, res) => {
  try {
    const tokenResponse = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      null,
      {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'client_credentials'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const topGamesResponse = await axios.get('https://api.twitch.tv/helix/games/top', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-ID': CLIENT_ID
      }
    });

    const topGames = topGamesResponse.data.data;

    res.json(topGames);

  } catch (error) {
    console.error('Error fetching top games:', error);
    res.status(500).send('Error fetching top games');
  }
});

module.exports = router;
