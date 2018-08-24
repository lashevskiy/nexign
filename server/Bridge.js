class Bridge {
  constructor(steamApi) {
    this.steamApi = steamApi;
  }

  getSteamId(username) {
    return this.steamApi.resolveVanityUrl(username)
      .then(({ response }) => ({
        steamid: response.success === 1 ? response.steamid : null
      }))
  }

  getPlayerInfo(steamid) {
    return Promise.all([
      this.steamApi.getPlayerSummaries(steamid),
      this.steamApi.getOwnedGames(steamid)
    ])
      .then(([playerSummaries, ownedGames]) => ({
        info: playerSummaries.response.players.player[0],
        ownedGames: ownedGames.response.games || []
      }))
  }

    getPlayerInfoGamesNew(steamid) {
        return Promise.all([
            this.steamApi.getOwnedGames(steamid)
        ])
            .then(([ownedGames]) => ({
                artem: ownedGames.response.games || []
            }))
    }
}

module.exports = Bridge;
