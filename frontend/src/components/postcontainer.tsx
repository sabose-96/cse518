import { useState } from "react";

const POSTS = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I went to the store today.",
  "I told my wife she was drawing her eyebrows too high. She looked surprised!",
  "It's raining outside.",
  "Parallel lines have so much in common. It's a shame they'll never meet.",
  "I had a sandwich for lunch.",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "I watched TV this evening.",
  "I would tell you a joke about an elevator, but it's an uplifting experience!",
  "I went for a walk in the park.",
];

export function PostContainer({postCounter}: {postCounter: number}) {

  return (
    <div className="card lg:card-side bg-base-100 shadow-xl">
      <figure>
        <img
          src={`profile_${postCounter+1}.png`}
          alt="Album"
        />
      </figure>
      <div className="card-body w-96">
        <h2 className="card-title">Person {postCounter+1}</h2>
        <p>{POSTS[postCounter]}</p>
      </div>
    </div>
  );
}
