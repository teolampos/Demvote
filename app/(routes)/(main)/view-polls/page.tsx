"use client";
import { fetchPollsAction } from "@/app/_lib/actions";
import { SortByEnum, VoteTypeEnum } from "@/app/_lib/entities";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const ActivePolls = () => {
  const [showMore, setShowMore] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [polls, setPolls] = useState<any>([]);
  const [limit, setLimit] = useState(7);
  const [offset, setOffset] = useState(0);
  const [voteType, setVoteType] = useState(VoteTypeEnum.UNVOTED);
  const [sortBy, setSortBy] = useState(SortByEnum.NEWEST);
  const [loading, setLoading] = useState(true);
  const voteTypeRef = useRef<any>(VoteTypeEnum.UNVOTED);
  const sortByRef = useRef<any>(SortByEnum.NEWEST);
  const formRef = useRef<any>();

  async function getPolls(formData: FormData) {
    setDisabled(true);
    if (voteTypeRef.current !== voteType || sortByRef.current !== sortBy) {
      setLoading(true);
      voteTypeRef.current = voteType;
      sortByRef.current = sortBy;
      const data = await fetchPollsAction(formData);
      data.polls.length < 7 ? setShowMore(false) : setShowMore(true);
      setPolls([...data.polls]);
      setLimit(limit + 7);
      setOffset(offset + 7);
      setLoading(false);
      return;
    } else {
      setLoading(true);
      const data = await fetchPollsAction(formData);
      data.polls.length < 7 ? setShowMore(false) : setShowMore(true);
      setPolls([...polls, ...data.polls]);
      setLimit(limit + 7);
      setOffset(offset + 7);
      setLoading(false);
    }
  }

  useEffect(() => {
    getPolls(new FormData(formRef.current));
  }, []);

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mt-4 sm:mt-7">
          <svg
            className="w-4 h-4 sm:w-7 sm:h-7 text-gray-900"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 5.5-5.5"
            />
          </svg>
          <h1 className="text-md md:text-2xl text-gray-900 font-bold ">
            Explore polls
          </h1>
        </div>
        <form
          ref={formRef}
          onSubmit={async (e: any) => {
            e.preventDefault();
            getPolls(new FormData(e.target));
          }}
        >
          <input type="hidden" name="limit" value={limit} />
          <input type="hidden" name="offset" value={offset} />
          <div className="flex flex-col md:flex-row  items-center gap-1.5 md:gap-3 mt-3 md:mt-5 ">
            <div className="flex items-center justify-between gap-2 ">
              <label
                htmlFor="voteType"
                className="text-sm md:text-lg text-gray-900 font-bold "
              >
                Status:
              </label>
              <select
                className="p-1 text-sm md:text-lg  outline-none border-none rounded-md"
                name="voteType"
                id="voteType"
                onChange={(e: any) => {
                  setLimit(7);
                  setOffset(0);
                  setVoteType(e.target.value);
                  setDisabled(false);
                }}
              >
                <option value="unvoted">Unvoted</option>
                <option value="voted">Voted</option>
              </select>
            </div>
            <div className="flex justify-between items-center gap-2">
              <label
                htmlFor="sortBy"
                className="text-sm md:text-lg text-gray-900 font-bold "
              >
                Sort By:
              </label>
              <select
                className="p-1 text-sm md:text-lg  outline-none border-none rounded-md"
                name="sortBy"
                id="sortBy"
                onChange={(e: any) => {
                  setLimit(7);
                  setOffset(0);
                  setSortBy(e.target.value);
                  setDisabled(false);
                }}
              >
                <option value={SortByEnum.NEWEST}>Newest</option>
                <option value={SortByEnum.OLDEST}>Oldest</option>
                <option value={SortByEnum.MOST_VOTES}>Most Votes</option>
                <option value={SortByEnum.LEAST_VOTES}>Least votes</option>
                <option value={SortByEnum.EXPIRED}>Expired</option>
                <option value={SortByEnum.NOT_EXPIRED}>Active</option>
              </select>
            </div>
            <button
              disabled={disabled}
              type="submit"
              className="text-xs md:text-md lg:text-lg font-bold text-slate-100 bg-blue-700 border border-solid border-blue-700 disabled:bg-blue-300 disabled:border-none disabled:text-white disabled:cursor-default rounded-md px-2.5 py-1 md:py-0.5 active:bg-white active:text-blue-600 transition"
            >
              Apply
            </button>
          </div>
        </form>

        <div
          className={`border border-solid border-gray-900 rounded-lg p-3 mt-3 flex flex-col gap-4 h-[75vh] min-w-[100%] ${
            polls.length > 5 && "overflow-y-scroll"
          } activePollsScrollbar`}
        >
          {!loading ? (
            polls.length > 0 ? (
              polls.map((poll: any) => {
                return (
                  <Link
                    href={`/poll/${poll.id}?location=view-polls`}
                    key={`${poll.id}_poll`}
                    className={`md:max-w-[40%] p-3 bg-white shadow-[2px_3px_20px_lightgray] rounded-md cursor-pointer transition-all duration-100 hover:scale-[0.97]  hover:bg-blue-100 `}
                  >
                    <div>
                      <h1 className="text-md sm:text-xl font-bold flex justify-between">
                        <span className="max-w-2/5 whitespace-nowrap oveflow-hidden truncate">
                          {poll.title}
                        </span>
                        <span className="text-red-700 text-sm font-normal">
                          {(new Date() as any) - poll.expiry_date >= 0 &&
                            "Expired"}
                        </span>
                      </h1>
                    </div>
                    <h3 className="text-sm sm:text-lg max-w-2/5 whitespace-nowrap oveflow-hidden truncate">
                      {poll.description}
                    </h3>
                    <div className="flex items-center gap-2 justify-between ">
                      <div className="flex items-center gap-2 justify-start ">
                        <span className="text-xs sm:text-md font-bold ">
                          Type:
                        </span>
                        <span className="text-xs sm:text-md">Voting</span>
                      </div>
                      <div className="flex items-center gap-2 justify-start ">
                        <span className="text-xs sm:text-md font-bold">
                          Created:
                        </span>
                        <span className="text-xs sm:text-md">
                          {poll.posting_date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className=" min-h-full flex items-center justify-center">
                <h1 className="text-md text-gray-900 font-semibold">
                  Wow..No polls found
                </h1>
              </div>
            )
          ) : (
            <div
              className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
            </div>
          )}
          {showMore && polls && polls.length >= 5 ? (
            <button
              onClick={async (e) => {
                await getPolls(new FormData(formRef.current));
              }}
              className="justify-self-end text-md text-slate-100 bg-blue-700  border border-solid border-blue-700 rounded-2xl px-3 py-1.5 hover:bg-white hover:text-blue-700 active:bg-blue-700 active:text-white transition "
            >
              Show more...
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ActivePolls;
