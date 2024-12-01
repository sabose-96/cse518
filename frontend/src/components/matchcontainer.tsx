export function MatchContainer({clickedSide, postCounter}: {clickedSide: string, postCounter: number}) {

  return (
    <div className="card lg:card-side bg-base-100 shadow-xl">
      <figure>
        <img
          src={`profile_${postCounter+1}.png`}
          alt="Album"
        />
      </figure>
      <div className="card-body">
        <div className="grid grid-cols-2 w-96 h-full">
            <div className="bg-red-400 rounded-l-md h-full w-full">
                {/* <p>Don't Match</p> */}
            </div>
            <div className="bg-green-400 rounded-r-md h-full w-full">
                {/* <p>Match</p> */}
            </div>
        </div>
      </div>
    </div>
  );
}
