const express = require('express');
const cors = require('cors');
const SteamAPI = require('./SteamAPI');
const Bridge = require('./Bridge');

const app = express();
app.use(cors());

const steamApi = new SteamAPI('7D5F2FA02FF09ACA687DE979BE355B30', 'https://api.steampowered.com/');
const bridge = new Bridge(steamApi);

app.get('/getSteamId', (req, res) => {
  bridge.getSteamId(req.query.username).then(res.json.bind(res));
});

app.get('/getPlayerInfo', (req, res) => {
  bridge.getPlayerInfo(req.query.steamid).then(res.json.bind(res));
});

app.get('/getPlayerGames', (req, res) => {
  bridge.getPlayerGames(req.query.steamid).then(res.json.bind(res));
});

app.get('/getMutualGames', function (req, res) {
    const steamIds = req.query.steamIds.split(',')
    const responses = {}
    let responseCount = 0

    steamIds.forEach(steamId => {
        bridge.getPlayerInfoGamesNew(steamId)
            .then((games) => {
            if (!games) {
                res.status(200).json([])
            } else {
                responseCount++
                responses[steamId] = games.artem

                if (responseCount === steamIds.length) {
                    const mutualGames = filterMutualGames(responses)
                    res.status(200).json(mutualGames)
                }
            }
        })
    })
})

function filterMutualGames(players) {
    const gamesByPlayer = Object
        .values(players)
        .sort((a, b) => b.length - a.length)

    let mutualGames = gamesByPlayer[0]

    for (let i = 1; i < gamesByPlayer.length; i++) {
        const appIds = gamesByPlayer[i].map(g => g.appid)

        mutualGames = mutualGames.filter(({appid}) => appIds.indexOf(appid) >= 0)
    }

    return mutualGames
}


app.listen(4740);
