export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      {/* Game Information */}
      <div className="w-full p-8 md:p-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="neon-tubes-styling text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center">Welcome to MusicMosaic</h1>
          <div className="space-y-6 text-base md:text-lg">
            <p className="text-muted-foreground text-center">
              Test your music knowledge and compete with friends in this exciting music guessing game!
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="neon-tubes-styling text-xl md:text-2xl font-semibold">How to Play</h2>
                <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                  <li>Connect your Spotify account to access your playlists</li>
                  <li>Create a new game and invite your friends</li>
                  <li>Listen to song snippets and guess the title and artist</li>
                  <li>Earn points for correct guesses and compete for the top spot</li>
                  <li>Track your progress on the global leaderboard</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="neon-tubes-styling text-xl md:text-2xl font-semibold">Features</h2>
                <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                  <li>Create custom game rooms with your own playlists</li>
                  <li>Real-time multiplayer gameplay</li>
                  <li>Global leaderboard and statistics</li>
                  <li>Track your progress and achievements</li>
                  <li>Connect with friends and share your results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
