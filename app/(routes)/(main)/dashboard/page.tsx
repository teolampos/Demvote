"use client";
import {
  fetchCreatedPolls,
  fetchDashboardData,
  submitPollAction,
} from "@/app/_lib/actions";
import { Option, PollTypeEnum } from "@/app/_lib/entities";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const Dashboard = () => {
  const [pollTitle, setPollTitle] = useState("");
  const [pollDescription, setPollDescription] = useState("");
  const [pollType, setPollType] = useState<any>(PollTypeEnum.SIMPLE_VOTING);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [options, setOptions] = useState<Option[]>([]);
  const [option, setOption] = useState("");
  const [state, setState] = useState<
    | {
        userInfo: any;
        userParticipationInPolls: number;
        createdPollsCount: number;
      }
    | any
  >();
  const [createdPolls, setCreatedPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const modalRef = useRef<any>(null);

  const handleAddOption = (e: any) => {
    if (option) {
      const newoption = {
        id: `${option}_id`,
        title: option.toUpperCase(),
      };
      setOptions([...options, newoption]);
      setOption("");
    }
  };

  const handleDeleteOption = (id: string) => {
    const newoptions = options.filter((option) => option.id !== id);
    setOptions(newoptions);
  };

  const handleSubmitPoll = async (e: any) => {
    e.preventDefault();
    if (!pollTitle || !pollDescription || !expiryDate)
      return window.alert("Missing fields");

    if ((new Date(expiryDate) as any) - (new Date() as any) < 0)
      return window.alert("Select a valid date");

    const formData = new FormData();
    formData.set("pollType", pollType);
    formData.set("pollTitle", pollTitle);
    formData.set("pollDescription", pollDescription);
    formData.set("expiryDate", expiryDate);

    if (pollType === PollTypeEnum.SIMPLE_VOTING) {
      if (!options.length) return window.alert("Missing vote options!");
      formData.set("options", JSON.stringify(options));
    }
    if (pollType === PollTypeEnum.REFERENDUM) {
      formData.set(
        "options",
        JSON.stringify([
          { id: "Yes_Id", title: "Yes" },
          { id: "No_Id", title: "No" },
        ])
      );
    }
    await submitPollAction(formData);
    window.location.reload();
  };

  const getDashboardData = async () => {
    const data = await fetchDashboardData();
    setState(data);
  };

  const getCreatedPolls = async () => {
    setLoading(true);
    const { polls } = (await fetchCreatedPolls(limit, offset)) as any;
    polls.length < 5 ? setShowMore(false) : setShowMore(true);
    setCreatedPolls([...createdPolls, ...polls] as any);
    setLimit(limit + 5);
    setOffset(offset + 5);
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
    getCreatedPolls();
  }, []);

  return (
    <>
      <div className="flex justify-between gap-5  mt-3 sm:mt-6 ">
        <div className="flex items-center gap-1 ">
          <svg
            className="w-5 h-5 sm:w-7 sm:h-7 text-gray-900 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
            />
          </svg>

          <h1 className="text-xs  sm:text-lg md:text-2xl min-w-[110px] text-gray-900 font-bold  ">
            Your dashboard
          </h1>
        </div>

        <div>
          <button
            className="flex items-center gap-0.5 sm:gap-1.5 p-1.5 lg:mr-14 bg-green-600 rounded-md font-semibold hover:bg-green-400 "
            onClick={() => modalRef.current.showModal()}
          >
            <svg
              className="w-3 h-3 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span className="text-white text-xs md:text-sm lg:text-lg">
              New Poll
            </span>
          </button>
          <dialog id="my_modal_1" className="modal " ref={modalRef}>
            <div className="modal-box min-w-[90%] min-h-[90vh] sm:min-h-[95vh] relative  ">
              <h3 className="font-bold text-lg sm:text-3xl text-gray-900">
                Create a new poll
              </h3>
              <p className="text-sm sm:text-lg ">
                Specify the title, description, expiry date and type of your
                poll below.
              </p>

              <div className="flex flex-col gap-3 mt-3 sm:mt-5">
                <div className="flex flex-col ">
                  <label
                    htmlFor="title"
                    className="font-bold text-lg sm:text-2xl text-gray-900"
                  >
                    Poll Title
                  </label>

                  <input
                    type="text"
                    placeholder="Specify poll title (Questions work best eg: Who is the best footballer?)"
                    id="title"
                    name="title"
                    className={`text-xs sm:text-xl border border-solid border-gray-900 py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-gray-900 focus:border-solid`}
                    value={pollTitle}
                    onChange={(e) => setPollTitle(e.target.value)}
                    required
                    maxLength={170}
                  />
                </div>
                <div className="flex flex-col ">
                  <label
                    htmlFor="description"
                    className="font-bold text-lg sm:text-2xl text-gray-900"
                  >
                    Description
                  </label>

                  <textarea
                    maxLength={500}
                    placeholder="Specify poll description (What is this voting about)"
                    id="description"
                    name="descriptioin"
                    className={`text-xs sm:text-xl border border-solid border-gray-900 py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none max-h-[20vh] focus:border-[2px] focus:border-gray-900 focus:border-solid`}
                    value={pollDescription}
                    onChange={(e) => setPollDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col  ">
                  <label
                    htmlFor="expiryDate"
                    className="font-bold text-lg sm:text-2xl text-gray-900"
                  >
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    className={`text-xs sm:text-xl max-w-[35%] sm:max-w-[30%] md:max-w-[30%] lg:max-w-[15%] border border-solid border-gray-900 py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-gray-900 focus:border-solid`}
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-3 sm:mt-3">
                  <label className=" text-lg sm:text-2xl font-bold text-gray-900  ">
                    Poll Type
                  </label>
                  <div className="flex flex-col gap-2  max-w-[60%] sm:max-w-[30%] md:max-w-[20%]">
                    <label
                      htmlFor="simpleVoting"
                      className="flex items-center gap-2 p-2 bg-slate-100 rounded-md"
                    >
                      <span className="text-md font-bold text-gray-900">
                        Simple voting
                      </span>
                      <input
                        type="radio"
                        name="pollType"
                        id="simpleVoting"
                        value="simpleVoting"
                        checked={pollType === PollTypeEnum.SIMPLE_VOTING}
                        onChange={(e) => setPollType(e.target.value)}
                      />
                    </label>
                    <label
                      htmlFor="simpleVoting"
                      className="flex items-center gap-2 p-2 bg-slate-100 rounded-md"
                    >
                      <span className="text-md font-bold text-gray-900 ">
                        Referendum
                      </span>
                      <input
                        type="radio"
                        name="pollType"
                        id="referendum"
                        value="referendum"
                        checked={pollType === PollTypeEnum.REFERENDUM}
                        onChange={(e) => setPollType(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
                <div className="h-[25vh] sm:h-[20vh]  bg-slate-100 rounded-md mt-3 p-2">
                  {pollType === PollTypeEnum.SIMPLE_VOTING ? (
                    <div className="flex flex-col gap-3 ">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          maxLength={100}
                          placeholder="Type option's name "
                          value={option}
                          onChange={(e) => setOption(e.target.value)}
                          className="text-xs sm:text-xl border border-solid border-gray-900  py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-gray-900 focus:border-solid"
                          required
                        />
                        <button
                          onClick={handleAddOption}
                          className="text-xs md:text-md  lg:text-lg font-bold text-slate-100 bg-blue-700 border border-solid border-blue-700 rounded-[4px] px-3 py-1.5 hover:bg-white hover:text-blue-700 active:bg-blue-700 active:text-white transition"
                        >
                          Add option
                        </button>
                      </div>
                      <ul className="flex flex-col gap-3 h-[15vh] overflow-y-scroll ">
                        {options.map((option) => {
                          return (
                            <li
                              key={`${option.id}`}
                              className="flex justify-between items-center  bg-gray-900 text-white font-bold max-w-[50%] sm:max-w-[30%] md:max-w-[20%] lg:max-w-[15%] rounded-md p-1"
                            >
                              <span className="text-sm sm:text-md md:text-lg">
                                {option.title}
                              </span>
                              <svg
                                className="w-3 h-3 sm:w-6 sm:h-6 text-red-400 cursor-pointer "
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                                onClick={() => handleDeleteOption(option.id)}
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 ">
                      <div className="text-lg text-gray-900 font-bold">
                        Default options
                      </div>
                      <ul className="flex flex-col gap-2">
                        <li className=" text-sm md:text-lg  bg-gray-900 text-white font-bold max-w-[20%] rounded-md p-1">
                          YES
                        </li>
                        <li className=" text-sm md:text-lg  bg-gray-900 text-white font-bold max-w-[20%] rounded-md p-1">
                          NO
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <form
                method="dialog mt-0"
                className="absolute right-[2%] bottom-[1.5%]  "
              >
                <div className="flex gap-2 ">
                  <button className="text-xs md:text-md  lg:text-[1rem] font-bold text-slate-100 bg-red-700 border border-solid border-red-700 rounded-[4px] px-3 py-1.5 hover:bg-white hover:text-red-700 active:bg-red-700 active:text-white transition">
                    Close
                  </button>
                  <button
                    onClick={handleSubmitPoll}
                    className="text-xs md:text-md  lg:text-[1rem] font-bold text-slate-100 bg-green-700 border border-solid border-green-700 rounded-[4px] px-3 py-1.5 hover:bg-white hover:green-red-700 hover:text-gray-900 active:bg-green-700 active:text-white transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
      </div>
      <div
        className="  flex flex-col xl:flex-row items-stretch gap-3 p-2 md:p-4
      "
      >
        <div className=" flex flex-col items-center p-1 md:p-2 bg-white shadow-[2px_3px_20px_lightgray] min-w-[23%] min-h-[40vh] rounded-lg">
          <h1 className="text-md md:text-xl lg:text-2xl text-gray-900 font-bold">
            User Info
          </h1>
          <ul className="min-w-full flex flex-col items-center ">
            <li className="text-sm md:text-lg lg:text-lg text-gray-900 bg-slate-50 p-2 m-3 rounded-md flex items-center gap-4 w-[90%]">
              <span className="w-[40%] ">Username:</span>{" "}
              <span className=" font-bold">{state?.userInfo?.username}</span>
            </li>
            <li className="text-sm md:text-lg lg:text-lg text-gray-900 bg-slate-50 p-2 m-3 rounded-md flex items-center gap-4 w-[90%]">
              <span className="w-[40%] ">Firstname:</span>
              <span className=" font-bold">{state?.userInfo?.firstname}</span>
            </li>
            <li className="text-sm md:text-lg lg:text-lg text-gray-900 bg-slate-50 p-2 m-3 rounded-md flex items-center gap-4 w-[90%]">
              <span className="w-[40%] ">Lastname:</span>
              <span className=" font-bold">{state?.userInfo?.lastname}</span>
            </li>
            <li className="text-sm md:text-lg lg:text-lg text-gray-900 bg-slate-50 p-2 m-3 rounded-md flex items-center gap-4 w-[90%]">
              <span className="w-[40%] ">Birthday:</span>
              <span className=" font-bold">
                {state?.userInfo?.dateofbirth.toLocaleDateString()}
              </span>
            </li>
            <li className="text-sm md:text-lg lg:text-lg text-gray-900 bg-slate-50 p-2 m-3 rounded-md flex items-center gap-4 w-[90%]">
              <span className="w-[40%] ">Gender:</span>
              <span className=" font-bold">{state?.userInfo?.gender}</span>
            </li>
          </ul>
        </div>
        <div className=" flex flex-col items-center p-1 md:p-2 bg-white shadow-[2px_3px_20px_lightgray] min-w-[23%] h-[20vh] rounded-lg">
          <h1 className="text-md md:text-xl lg:text-2xl text-gray-900 font-bold">
            Poll Stats
          </h1>
          <ul className="min-w-full flex-col items-center ">
            <li className="text-sm md:text-lg lg:text-lg text-gray-900 bg-slate-50 p-2 m-3 rounded-md flex items-center gap-4 w-[90%]">
              <span className="min-w-[40%]">Created Polls:</span>{" "}
              <span className="text-md font-bold">
                {state?.createdPollsCount}
              </span>
            </li>
            <li className="text-sm md:text-lg lg:text-lg text-gray-900 bg-slate-50 p-2 m-3 rounded-md flex items-center gap-4 w-[90%]">
              <span className="min-w-[40%]">Participated in:</span>
              <span className="text-md font-bold">
                {state?.userParticipationInPolls}
              </span>
            </li>
          </ul>
        </div>
        <div className=" bg-white shadow-[2px_3px_20px_lightgray] pt-1 md:pt-2 pb-4 rounded-lg flex flex-col gap-2 items-center min-w-[50%] h-[50vh] ">
          <h1 className="text-md md:text-xl lg:text-2xl text-gray-900 font-bold">
            Created polls
          </h1>
          <div
            className={`min-w-[100%] max-h-[100%] ${
              createdPolls.length >= 4 && "overflow-y-scroll"
            } activePollsScrollbar flex flex-col items-center gap-3`}
          >
            {!loading ? (
              createdPolls.length > 0 ? (
                createdPolls.map((poll: any) => {
                  return (
                    <Link
                      href={`/poll/${poll.id}?location=dashboard`}
                      key={`${poll.id}_poll`}
                      className={`text-xs w-[80%] sm:w-[90%] sm:text-sm p-3 sm:p-2 bg-slate-100  rounded-md cursor-pointer transition-all duration-100 hover:scale-[0.98] hover:bg-blue-100 `}
                    >
                      <div>
                        <h1 className="text-md md:text-xl max-w-2/5 whitespace-nowrap overflow-hidden text-ellipsis font-bold flex justify-between">
                          <span className="max-w-2/5 whitespace-nowrap oveflow-hidden truncate">
                            {poll.title}
                          </span>
                          <span className="text-red-700 text-xs font-normal">
                            {(new Date() as any) - poll.expiry_date >= 0 &&
                              "Expired"}
                          </span>
                        </h1>
                      </div>
                      <h3 className="text-sm md:text-lg max-w-2/5 whitespace-nowrap oveflow-hidden truncate">
                        {poll.description}
                      </h3>
                      <div className="flex flex-col flex-start items-start mt-1.5  sm:gap-2 sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex  items-center gap-2 justify-start ">
                          <span className="text-xs md:text-md font-bold ">
                            Type:
                          </span>
                          <span className="text-xs md:text-md">
                            {poll.type === "simpleVoting"
                              ? "Voting"
                              : "Referendum"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 justify-start ">
                          <span className="text-xs md:text-md font-bold ">
                            Created:
                          </span>
                          <span className="text-xs md:text-md">
                            {poll.posting_date?.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className=" min-h-[40vh] flex items-center justify-center">
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
          </div>

          {showMore && createdPolls.length >= 5 ? (
            <button
              onClick={async (e) => {
                getCreatedPolls();
              }}
              className="justify-self-end text-md text-slate-100 bg-blue-700  border border-solid border-blue-700 rounded-2xl px-3 py-1.5 hover:bg-white hover:text-blue-700 active:bg-blue-700 active:text-white transition "
            >
              Show more...
            </button>
          ) : null}
        </div>
      </div>
      {/*Main*/}
    </>
  );
};

export default Dashboard;
