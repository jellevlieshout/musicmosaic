# vt25-Project
Grading criteria: [https://docs.google.com/document/d/1luWXvJT\_WEqAl4P2Fg3hNTVBOaEBdAbKADENtYJE3oo/edit?tab=t.0](https://docs.google.com/document/d/1luWXvJT_WEqAl4P2Fg3hNTVBOaEBdAbKADENtYJE3oo/edit?tab=t.0)

## !!! IMPORTANT !!!
Please reach out to Jelle van Lieshout through jellevl@kth.se or by sending me a message on canvas, with an email address connected to a spotify account that you have access to. Without this, the application is practically unusable. We will need to whitelist your spotify-email such that you can use your spotify account in the context of our application. 

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
* Zustand \- [https://zustand-demo.pmnd.rs/](https://zustand-demo.pmnd.rs/)
    
## What has been done so far
* Spotify API integration
  * When playing the game, a user must authenticate themselve using OAuth, after which they can access their personal playlists and songs through the Spotify Web API, and stream the songs using the Spotify Web Playback SDK, where the browser session acts as a device. Currently, we are working within a free developer environment of the Spotify API, meaning we have to whitelist users to authenticate. Please reach out to us at jellevl@kth.se such that we can whitelist you! 
* Geolocation API integration
  * ADD DETAILS HERE
* Zustand store for game logic
  * ADD DETAILS HERE
* Persistence of game state in Supabase
  * We have defined a hitsterModelObserver, which is subscribed to our Zustand game model using publish/subscribe functionality offered by Zustand. Whenever a change is detected in (part of) the model, the observer notices this change, and can choose to persist information to our Supabase backend/database. Supabase is built using a PostgreSQL database. 
* User authentication and authorization with Supabase
  * We've implemented a complete authentication flow using Supabase Auth, which provides secure user management with email/password sign-up and login. The authentication state is maintained across sessions using Supabase's built-in token handling, allowing users to remain logged in. Protected routes in our application verify the auth state before rendering content, making sure only authenticated users can access game features. The auth flow includes sign-up, login, password reset, and session management.
  * Authorization is taken care of using Row Level security policies; this means that for every row fetched from the PostgreSQL database behind Supabase, a check is executed to compare the requested row with the user requesting the row. The most straight-forward example is comparing a user_id connected to a certain row with the user_id of the authenticated user, and only allowing the user to interact with/alter/fetch this row if those user_ids are equal. 
* Round 1 user testing using [Figma prototype](https://www.figma.com/design/6l1eyXHB5kgG2A1sHp9EhZ/iprog-musicmosaic?node-id=10-21&t=NT6HPIzAVA24s9Ei-1)
* Initial gameplay UI implementation

## Next steps
* Solve issue of Spotify account whitelist
  * ADD DETAILS HERE
* UI/Interaction improvements
  * Enhance card/timeline component to be draggable/more like real cards in a game
  * Add visual animation for when music is playing
* Additional game logic
  * Steal mode
  * Song name bonus
* Player leaderboard 

## File structure
Your project file structure (short description/purpose of each file)
```
.
├── app                     # ADD DETAILS
│   ├── (auth-pages)
│   ├── auth                # pages related to authentication: logging in, signing up, reset password etc. 
│   ├── protected           # pages only accessible to authenticated users. 
│   └── spotify             # pages we've used to test spotify functionality. 
├── components              # custom and from shadcn/ui
│   ├── GameCard.tsx
│   ├── NeonTitle.tsx
│   └── Timeline.tsx
|   ... 
├── hooks                   # this contains the logic which sets up connectivity to the game model, and initiates necessary observers to handle persistence.
│   └── useHisterPersistence.ts  
├── lib       
├── model_in_devtools       # ADD DETAILS (maybe we can delete this?)
├── stores                  # ADD DETAILS
│   ├── histerModelStore.ts
│   └── spotifyStore.ts  
├── styles
├── utils                   # ADD DETAILS    
└── views                   # application views
│   ├── GameplayView.tsx
│   ├── HomeView.tsx
│   ├── LeaderboardView.tsx
│   ├── NewGameView.tsx
│   ├── PlayerSelectionView.tsx
│   └── SettingsView.tsx                
...
```
