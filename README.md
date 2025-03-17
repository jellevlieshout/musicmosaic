# vt25-Project
Grading criteria: [https://docs.google.com/document/d/1luWXvJT\_WEqAl4P2Fg3hNTVBOaEBdAbKADENtYJE3oo/edit?tab=t.0](https://docs.google.com/document/d/1luWXvJT_WEqAl4P2Fg3hNTVBOaEBdAbKADENtYJE3oo/edit?tab=t.0)
## Group member names and Canvas IDs
* Joachim Olsson, 114913
* Emma Raible, 91737
* Jelle van Lieshout, 173810
* Luca Manzari, 7290
## About the app, “Music Mosaic”
### Description
“Music Mosaic” aims at being a digital version of the board game Hitster, here briefly described.
There is a stack of cards at the center of the table, each card has a qr code on the front pointing to the Spotify URL of a song, and on the back the name, artist and release year of that same song.
Players sit in a circle, each player takes a card and places it in front of themselves with the song info (i.e. name, artist, year) facing up and visible.
The first player will take a card from the stack, and without flipping it (that is, song name/band/year is not visible) they'll scan the QR code with the jukebox phone and start playing it.
Their task is to guess when the song was released: earlier, or later than the song on the card they already have in front of them? They take their guess and place it either left or right of the card they already have in front of them, depending on whether they think it was released earlier or later. They then flip the card: were they right in their guess, they keep the card---were they wrong, they lose the card! It is now the next player's turn.The game ends when the first player manages to collect 10 cards.
Our app would basically be a digital version of this game, but with some potential additional features like:
* Location based score comparison;
* Ability to upload/create your own song list for the game to use;
* Time based scoring.
### Frameworks
* React
* Typescript
* NextJS backend \- [https://nextjs.org/](https://nextjs.org/)
* Supabase \- [https://supabase.com/](https://supabase.com/)
* Vercel \- [https://vercel.com/](https://vercel.com/)
* Component library \- [https://ui.shadcn.com/](https://ui.shadcn.com/)
### API that will be used
* Genius API \- [https://docs.genius.com/\#web\_pages-h2](https://docs.genius.com/#web_pages-h2)
  * Useful for track/artist information, photos, links to youtube and spotify
* Geolocation API [https://developer.mozilla.org/en-US/docs/Web/API/Geolocation\_API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
  * Useful for seeing how you are doing relevant to other people in your area
* Spotify \- [https://developer.spotify.com/](https://developer.spotify.com/)
  * Might need to set up cross authentication with Spotify
### Data the app will work with (all local except when specified)
* List of songs used on the standard version of the game
  * Song information (fetched from API)
* Users
  * Score history
  * Potential \- ability to upload or create your own playlist for the game
  * User location (fetched from API)
* Current game state (persisted)
  * Number of players
  * Timeline for each player
  * Song list \- both available and unavailable
  * Current scores
  * Current card
    * Song data (fetched from API)
