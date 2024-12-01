export interface MatchHistory {
  person: number;
  matched: boolean;
}

export function MatchHistoryComponent({
  matchHistory,
}: {
  matchHistory: Array<MatchHistory>;
}) {
  return (
    <div className="mt-5 w-1/3 hadow-lg">
      <div className="mt-2 w-full shadow-md p-3 rounded-lg">
        <p>Match history</p>
      </div>
      <div className="h-[32rem] overflow-y-auto">
        <ul className="timeline timeline-vertical">
          {matchHistory.map((historyItem, idx) => {
            return (
              <li>
                <div className="timeline-start text-sm p-5">
                  Person {historyItem.person}
                </div>
                <div className="timeline-middle">
                  {historyItem.matched ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="text-green-400 h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="text-red-400 h-5 w-5"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"></path>
                      </g>
                    </svg>
                  )}
                </div>
                {idx == matchHistory.length - 1 ? null : historyItem.matched ? (
                  <hr className="bg-green-400" />
                ) : (
                  <hr className="bg-red-400" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
