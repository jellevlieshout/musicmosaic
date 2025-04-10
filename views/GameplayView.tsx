
export default async function GameplayView() {
 
  return (
    <>
      <div className="grid grid-cols-5 gap-4 w-screen divide-x-3">
        <div className="col-span-1">
          <p>Sidebar</p>
        </div>
        <div className="col-span-4">
          <p>Game view</p>
        </div>
      </div>
    </>
  );
}