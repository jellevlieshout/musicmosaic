import '@/app/globals.css';

export default async function SettingsView() {

  return (
    <>
      <div className="max-w-md mx-auto p-6 rounded-lg shadow-md">
        <h1 className="neon-tubes-styling text-5xl mb-6">User Settings</h1>
        <form>
          <div className="mb-4">
            <label className="neon-tubes-styling">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Luca"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none neon-glow-box-shadow"
            />
          </div>
          <div className="mb-4">
            <label className="neon-tubes-styling">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="manzari@kth.se"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none neon-glow-box-shadow"
            />
          </div>
          <div className="mb-4">
            <label className="neon-tubes-styling">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="****"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none neon-glow-box-shadow"
            />
          </div>
          <div className="mb-4">
            <label className="neon-tubes-styling">
              Spotify account
            </label>
            <input
              type="text"
              id="spotify-account"
              placeholder="some_spotify_account_name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none neon-glow-box-shadow"
            />
          </div>
          <div className="mb-4">
            <label className="neon-tubes-styling">
              Location
            </label>
            <input
              type="text"
              id="spotify-account"
              placeholder="the location API takes care of this"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none neon-glow-box-shadow"
              disabled
            />
          </div>
          <button
            type="button"
            className="neon-tubes-styling w-full text-gray-700 font-semibold py-2 rounded-md cursor-not-allowed"
            disabled
          >
            Save Changes
          </button>
        </form>
      </div>

    </>
  );
}
