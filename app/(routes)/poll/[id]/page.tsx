"use client";
import { fetchPollData, voteAction } from "@/app/_lib/actions";
import { Option, Poll, PollTypeEnum } from "@/app/_lib/entities";
import { roboto } from "@/app/_lib/fonts";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  BarController,
  PieController,
  ArcElement,
  BarElement,
  LinearScale,
  RadialLinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useSearchParams } from "next/navigation";

Chart.register(
  BarElement,
  BarController,
  PieController,
  RadialLinearScale,
  CategoryScale,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const PollView = ({ params }: { params: { id: string } }) => {
  const [state, setState] = useState<{
    poll: Poll;
    votingMap: any;
    genderVotingMap: any;
    userVote: any;
  }>();
  const [expired, setExpired] = useState(false);
  const location = useSearchParams().get("location");

  const fetchPollInfo = async () => {
    const data = await fetchPollData(Number(params.id));
    setState(data);
  };

  useEffect(() => {
    fetchPollInfo();
  }, []);

  useEffect(() => {
    ///We check if poll has expired
    if ((new Date() as any) - (state?.poll.expiryDate as any) >= 0) {
      setExpired(true);
    }
  }, [state]);

  const barData = {
    labels: state?.poll?.options.map((option: Option) => option.title),
    datasets: [
      {
        label: "Votes",
        data: state?.poll?.options.map((option: Option) => {
          if (state.votingMap) {
            return state.votingMap.get(option.title);
          }
        }),
        backgroundColor: "rgb(89, 138, 217)",
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: { display: false },
    },
    aspectRatio: 1,

    scales: {
      y: {
        beginAtZero: true,
        ticks: {},
      },
    },
  };

  const pieData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Votes",
        data: state?.genderVotingMap && [
          state?.genderVotingMap.get("male"),
          state?.genderVotingMap.get("female"),
        ],
        backgroundColor: ["lightblue", "pink"],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      <div
        className={`fixed z-[1] left-0 top-0 w-full h-full overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.7)] ${roboto.className}`}
      >
        <div className=" my-[1%] mx-auto p-[20px] w-[85%] min-h-[90vh] bg-slate-100">
          <div className="flex flex-col  md:flex-row  items-start">
            <div className="min-w-[100%] md:min-w-[70%] flex flex-col gap-7 md:border-r-2 border-solid border-gray-200 0">
              <div className="flex flex-col">
                <div className=" flex items-baseline gap-2 mt-3 ">
                  <span className="font-bold text-lg sm:text-3xl text-gray-900">
                    {(state?.poll && state?.poll.title) || "None"}{" "}
                  </span>
                  <span className="text-2xl text-red-700">
                    {expired && "(Expired)"}
                  </span>
                </div>
                <h1 className="font-bold text-md sm:text-2xl text-gray-900 mt-4">
                  Description
                </h1>
                <span className="text-sm sm:text-lg ">
                  {(state?.poll && state?.poll.description) || "None"}
                </span>
              </div>

              <div className="flex gap-10 items-center ">
                <div className="min-w-[100px]">
                  <h1 className="font-bold text-md sm:text-2xl text-gray-900 ">
                    Expiry Date
                  </h1>
                  <div className=" rounded-md flex items-center gap-1.5">
                    <svg
                      className="w-6 h-6 text-gray-800 dark:text-white"
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
                        d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                      />
                    </svg>
                    <span className="text-sm sm:text-lg ">
                      {state?.poll.expiryDate &&
                        new Date(state.poll.expiryDate).toLocaleDateString()}
                      <span></span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col  ">
                  <h1 className="font-bold text-md sm:text-2xl text-gray-900">
                    Poll Type
                  </h1>

                  <span className="text-sm sm:text-lg ">
                    {(state?.poll && state?.poll.type === "simpleVoting"
                      ? "Simple Voting"
                      : "Referendum") || "None"}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg sm:text-3xl text-center sm:text-start text-gray-900  border-b-2 border-solid border-gray-200">
                  Poll Visualization
                  <span className="2xl">{expired && " - Results"}</span>
                </h1>
                <div className="flex flex-col items-center gap-3 sm:flex-row md:justify-around mt-1  min-h-[300px]">
                  <div className=" w-[200px] h-[250px] md:w-[50%] md:h-[300px] sm:w-[60%]  flex flex-col items-center p-4">
                    <h1 className="text-center text-lg ">Vote Results</h1>
                    <Bar data={barData} options={barOptions} />
                  </div>
                  <div className=" w-[200px] h-[250px]  md:w-[50%] md:h-[300px] sm:w-[60%]  flex flex-col items-center p-4">
                    <h1 className="text-center text-lg ">Votes Per Gender</h1>
                    <Pie className="mt-2" data={pieData} options={pieOptions} />
                  </div>
                </div>
              </div>
            </div>
            <div className=" min-w-[100%] md:min-w-[30%]  flex flex-col justify-center gap-5 items-center  ">
              <Image
                className="mt-10 w-[100px] h-[100px] "
                src="/ballotBox.png"
                alt="Demvote"
                width={200}
                height={200}
              />
              <form
                className=" min-w-[100%] max-h-[30vh] flex flex-col items-center"
                action={voteAction}
              >
                <h1 className="text-lg text-gray-900 font-semibold">
                  {state?.userVote ? (
                    "You voted:"
                  ) : expired ? (
                    <span className="text-red-700 font-normal">
                      Vote unavailable
                    </span>
                  ) : (
                    "Select:"
                  )}
                </h1>
                <input
                  type="hidden"
                  name="pollId"
                  value={state?.poll ? state.poll.id : ""}
                />
                <ul className="flex flex-col gap-3  min-w-[70%] overflow-y-auto  rounded-lg ">
                  {state?.poll &&
                  state.poll.type === PollTypeEnum.SIMPLE_VOTING ? (
                    state?.poll.options.map((option: Option) => {
                      return (
                        <label
                          key={`${option.id}_${option.title}`}
                          htmlFor="vote"
                          className="flex items-center gap-2 p-1.5 bg-slate-200 rounded-md min-w-"
                        >
                          <span className="text-md font-bold text-gray-900">
                            {option.title}
                          </span>
                          {state.userVote?.vote === option.title ? (
                            <input
                              type="radio"
                              name="vote"
                              id="vote"
                              value={option.title}
                              required
                              checked={true}
                            />
                          ) : (
                            <input
                              type="radio"
                              name="vote"
                              id="vote"
                              value={option.title}
                              required
                            />
                          )}
                        </label>
                      );
                    })
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="Yes"
                        className="flex items-center gap-2 p-1.5 bg-white rounded-md "
                      >
                        <span className="text-md font-bold text-gray-900">
                          Yes
                        </span>
                        {state?.userVote?.vote === "Yes" ? (
                          <input
                            type="radio"
                            name="vote"
                            id="vote"
                            value="Yes"
                            required
                            checked={true}
                          />
                        ) : (
                          <input
                            type="radio"
                            name="vote"
                            id="Yes"
                            value="Yes"
                            required
                          />
                        )}
                      </label>
                      <label
                        htmlFor="No"
                        className="flex items-center gap-2 p-1.5 bg-white rounded-md min-w-"
                      >
                        <span className="text-md font-bold text-gray-900">
                          No
                        </span>
                        {state?.userVote?.vote === "No" ? (
                          <input
                            type="radio"
                            name="vote"
                            id="No"
                            value="No"
                            required
                            checked={true}
                          />
                        ) : (
                          <input
                            type="radio"
                            name="vote"
                            id="No"
                            value="No"
                            required
                          />
                        )}
                      </label>
                    </div>
                  )}
                </ul>
                <div className="flex gap-2 min-w-[200px] justify-center mt-3  ">
                  <Link
                    href={`/${location}`}
                    className="text-xs md:text-md  lg:text-[1rem] font-bold text-slate-100 bg-red-700 border border-solid border-red-700 rounded-[4px] px-3 py-1.5 hover:bg-white hover:text-red-700 active:bg-red-700 active:text-white transition"
                  >
                    CANCEL
                  </Link>
                  <button
                    className={`text-xs md:text-md  lg:text-[1rem] font-bold text-slate-100 rounded-[4px] px-3 py-1.5 ${
                      expired || state?.userVote?.vote
                        ? "bg-green-300"
                        : "bg-green-600 hover:bg-white hover:green-red-600 hover:text-gray-900 active:bg-green-700 active:text-white transition"
                    }`}
                    disabled={expired || state?.userVote ? true : false}
                  >
                    VOTE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PollView;
