/*
//
// utilities
//
*/

// return a random integer in the [min, max[ interval,
// i.e. the maximum is exclusive and the minimum is inclusive;
// e.g. getRandomInt(8,12) could return 8, 9, 10, or 11
function getRandomInt(min, max) {
	const minCeiled = Math.ceil(min)
	const maxFloored = Math.floor(max)
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

function sortDeckByYear(deck) {
	function compareYearsCB(songA, songB) {
	    if (songA.year <= songB.year)  // no need to swap card position if two songs have the same year
		return 0
	    else
		return 1
	}
	const sortedDeck = [...deck].sort(compareYearsCB);
	return sortedDeck;
}

/*
//
// demo stuff
//
*/

// a demo playlist to play this game if you're a 90s pop-rock lover
const demoPlaylist = [
	{ id: 91, title: "Bittersweet Symphony", artist: "The Verve", album: "Urban Hymns", year: 1997 },
	{ id: 43, title: "One", artist: "U2", album: "Achtung Baby", year: 1991 },
	{ id: 10, title: "Wonderwall", artist: "Oasis", album: "(What's the Story) Morning Glory?", year: 1995 },
	{ id: 34, title: "Creep", artist: "Radiohead", album: "Pablo Honey", year: 1992 },
	{ id: 44, title: "Champagne Supernova", artist: "Oasis", album: "(What's the Story) Morning Glory?", year: 1995 },
	{ id: 55, title: "Bitter Sweet Symphony", artist: "The Verve", album: "Urban Hymns", year: 1997 },
	{ id: 66, title: "Black", artist: "Pearl Jam", album: "Ten", year: 1991 },
	{ id: 77, title: "Losing My Religion", artist: "R.E.M.", album: "Out of Time", year: 1991 },
	{ id: 58, title: "Zombie", artist: "The Cranberries", album: "No Need to Argue", year: 1994 },
	{ id: 89, title: "Under the Bridge", artist: "Red Hot Chili Peppers", album: "Blood Sugar Sex Magik", year: 1991 },
]

// a list of demo players, will then have to:
// - add a addPlayer function
// - update the highestScore in realtime during gameplay
const demoPlayers = [
	{id: 4560, name: "Luca", highestScore: null, deck: []},
	{id: 1111, name: "Emma", highestScore: null, deck: []},
	{id: 2564, name: "Joachim", highestScore: null, deck: []},
	{id: 3000, name: "Jelle", highestScore: null, deck: []}
]

/*
//
// the game state
//
*/
const model = {
    currentPlayers: null,
    currentPlayerId: null,
	currentPlaylist: null,
	currentSongId: null,

	setPlaylist(playlist){
	    function addHasBeenPlayedFieldCB(playlistItem){
		return {...playlistItem, "hasBeenPlayed": false}
	    }
	    this.currentPlaylist = playlist.map(addHasBeenPlayedFieldCB)
	},

	getSongById(playlistItem_id) {
	    function doesSongIdMatchCB(playlistItem) {
		return playlistItem.id === playlistItem_id
	    }
	    return this.currentPlaylist.find(doesSongIdMatchCB)
	},

	getPlayerById(player_id) {
	    function doesPlayerIdMatchCB(player) {
		return player.id === player_id
	    }
	    return this.currentPlayers.find(doesPlayerIdMatchCB)
	},

	getPlayerIndexById(player_id) {
	    function doesPlayerIdMatchCB(player) {
		return player.id === player_id
	    }
	    return this.currentPlayers.findIndex(doesPlayerIdMatchCB)
	},

	// just a convenience function, will be replaced by a nice view
	showPlayerDeck(player_id) {
	    function printTimelineCB(playlistItem) {
		console.log(playlistItem.year, playlistItem.title)
	    }
	    console.log("~~~", this.getPlayerById(player_id).name + "'s deck ~~~")
	    this.getPlayerById(player_id).deck.forEach(printTimelineCB)
	},

	playRandomNewSongFromCurrentPlaylist(){
	    function songIsStillUnheardCB(playlistItem){
		return playlistItem.hasBeenPlayed === false
	    }
	    const unheardSongs = this.currentPlaylist.filter(songIsStillUnheardCB)
	    if (unheardSongs.length === 0) {
		console.log("We ran out of new songs!")
		return
	    }
	    this.currentSongId = unheardSongs[getRandomInt(0,unheardSongs.length)].id
	    console.log(this.getPlayerById(this.currentPlayerId).name + "'s time to shine!")
	    this.showPlayerDeck(this.currentPlayerId)
	    console.log("Playing", this.getSongById(this.currentSongId).title)
	    this.getSongById(this.currentSongId).hasBeenPlayed = true
	},

	revealSongDetails(){
	    if (this.currentSongId === null) {
		console.log("Choose a song first, using myModel.playRandomNewSongFromCurrentPlaylist()")
		return
	    }
	    console.log("Year of", this.getSongById(this.currentSongId).title, "was", this.getSongById(this.currentSongId).year)
	    console.log(this.getPlayerById(this.currentPlayerId).name + ", did you guess right?")
	},

	seatPlayersInRandomOrder(players){
	    // very elegant, taken from https://stackoverflow.com/a/46545530/2980080
        this.currentPlayers = players.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
	    this.currentPlayerId = this.currentPlayers[0]?.id
    },

	playerWasRight(){
	    // add card to player's timeline and sort deck by year
	    this.getPlayerById(this.currentPlayerId).deck = sortDeckByYear([...this.getPlayerById(this.currentPlayerId).deck, this.getSongById(this.currentSongId)])
	    this.showPlayerDeck(this.currentPlayerId)
	    // change to next player
	    this.currentPlayerId = this.currentPlayers[(this.getPlayerIndexById(this.currentPlayerId) + 1) % 4].id
	},

	playerWasWrong(){
	    this.showPlayerDeck(this.currentPlayerId)
	    console.log("Too bad! Time to pull out a new card!")
	    // change to next player
	    this.currentPlayerId = this.currentPlayers[(this.getPlayerIndexById(this.currentPlayerId) + 1) % 4].id
	}
}

// Expose stuff to the global window object for testing
window.myModel = model
window.myDemoPlaylist = demoPlaylist
window.myDemoPlayers = demoPlayers
