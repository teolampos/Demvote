import React from "react";
import Image from "next/image";
import { roboto } from "./_lib/fonts";
import Link from "next/link";
import UseCaseCard from "./_components/homepage/UseCaseCard";

const HomePage = () => {
  return (
    <>
      {/* FIRST SECTION*/}
      <div
        className={` min-w-full min-h-[70vh]  bg-white py-5 md:py-7 px-7 md:px-10   ${roboto.className}`}
      >
        <div className="flex flex-row justify-between ">
          <div className="flex flex-row items-center gap-1">
            <Image src="/ballotBox.png" alt="Demvote" width={25} height={25} />
            <div>
              <Link
                href={"/"}
                className={`md:text-2xl font-bold  text-gray-900 `}
              >
                demvote.
              </Link>
              <span className="md:text-2xl text-blue-950">com</span>
            </div>
          </div>

          <div className="flex flex-row items-center">
            <div className={`flex flex-row gap-2 md:gap-3  tracking-tight`}>
              <Link
                href={"/login"}
                className="text-xs md:text-md lg:text-lg text-blue-700  border border-solid border-blue-700 rounded-[4px] px-2  py-1.5 hover:text-white hover:bg-blue-700 transition  active:bg-white active:text-blue-700 "
              >
                Sign In
              </Link>
              <Link
                href={"/sign-up"}
                className="text-xs md:text-md lg:text-lg text-slate-100 bg-blue-700 border border-solid border-blue-700 rounded-[4px] px-3 py-1.5 hover:bg-white hover:text-blue-700 active:bg-blue-700 active:text-white transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-7 lg:flex-row lg:justify-around lg:gap-10 mt-10 lg:mt-16 ">
          <div className=" flex flex-col text-6xl lg:text-8xl font-bold text-gray-900  ">
            <div>VOTE.</div>
            <div>ANYWHERE.</div>
            <div>ANYTIME.</div>
          </div>
          <div className="lg:max-w-[40%] flex flex-col justify-center gap-3 md:gap-5 py-2.5 px-2.5  bg-slate-100 ">
            <div className=" text-2xl md:text-3xl font-bold flex flex-col gap-1">
              <div>ONE PLATFORM.</div>
              <div className="text-blue-700">UNRIVALED</div>
              <div className="text-blue-700">PERFORMANCE.</div>
            </div>
            <p
              className={`${roboto.className} text-lg  text-gray-600 text-justify tracking-tight`}
            >
              Demvote simplifies creating, sharing, and participating in polls.
              It offers a secure and user-friendly experience. Make every vote
              count with instant results!
            </p>

            <Link
              href={"/sign-up"}
              className={`max-w-[110px] p-10 text-slate-100 bg-blue-700 border border-solid border-blue-700 rounded-[4px] px-3 py-1.5 hover:bg-white hover:text-blue-700 active:bg-blue-700 active:text-white transition `}
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className=" flex flex-wrap gap-10 justify-around mt-10 lg:mt-28">
          <div className="flex flex-col  items-center">
            <div className="text-lg md:text-xl  text-gray-900 font-bold">
              Instantly.
            </div>
            <Image src={"/likeIcon.png"} alt="" width={70} height={70} />
          </div>

          <div className="flex flex-col gap-1 items-center">
            <div className="text-lg md:text-xl text-gray-900 font-bold">
              Securely.
            </div>
            <Image src={"/shieldIcon.png"} alt="" width={70} height={70} />
          </div>
          <div className="flex flex-col  items-center">
            <div className="text-lg md:text-xl text-gray-900 font-bold">
              Fairly.
            </div>
            <Image src={"/likeIcon.png"} alt="" width={70} height={70} />
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="text-lg md:text-xl text-gray-900 font-bold">
              Globally.{" "}
            </div>
            <Image src={"/globeIcon.png"} alt="" width={70} height={70} />
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="text-lg md:text-xl text-gray-900 font-bold">
              All together.{" "}
            </div>
            <Image src={"/teamIcon.png"} alt="" width={70} height={70} />
          </div>
        </div>
      </div>

      {/* SECOND SECTION*/}
      <div className="min-w-full bg-gray-100 pt-16 pb-10 px-7 ">
        <div
          className={` text-2xl md:text-3xl text-center text-gray-900 font-extrabold ${roboto.className}  `}
        >
          One platform. Countless use cases.
        </div>
        <div className="mt-7 grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 gap-6">
          <UseCaseCard
            title="Political Elections"
            subUseCases={[
              {
                subtitle: "National and Local Elections",
                text: "Demvote can be used to streamline the voting process for national, state, and local elections, making it easier for citizens to cast their votes securely and efficiently.",
              },
              {
                subtitle: "Party Primaries and Internal Elections",
                text: "Political parties can use Demvote to conduct internal elections, such as primary elections for selecting candidates or voting on party policies.",
              },
            ]}
            src="/govIcon.png"
            alt=""
          />
          <UseCaseCard
            title=" Corporate and Organizational Settings"
            subUseCases={[
              {
                subtitle: "Shareholder Meetings",
                text: "Companies can use Demvote to allow shareholders to vote on corporate resolutions and board member elections during annual general meetings.",
              },
              {
                subtitle: "Board Elections",
                text: "Organizations, clubs, and associations can use Demvote to elect board members and make key organizational decisions.",
              },
            ]}
            src="/company.png"
            alt=""
          />
          <UseCaseCard
            title="Educational Institutions"
            subUseCases={[
              {
                subtitle: "Student Government Elections",
                text: "Schools, colleges, and universities can use Demvote to facilitate elections for student government positions and other student body decisions.",
              },
              {
                subtitle: "Faculty and Staff Voting",
                text: "Educational institutions can use Demvote for faculty and staff to vote on issues such as policy changes or committee elections.",
              },
            ]}
            src="/educationIcon.png"
            alt=""
          />
          <UseCaseCard
            title=" Clubs and Social Groups"
            subUseCases={[
              {
                subtitle: "Decision-Making in Clubs",
                text: "Social clubs, hobby groups, and sports teams can use voting apps for members to vote on various matters, such as event planning or leadership elections.",
              },
              {
                subtitle: "Surveying Preferences",
                text: "Clubs and groups can use voting apps to survey member preferences on activities, trips, or other group decisions.",
              },
            ]}
            src="/socialIcon.png"
            alt=""
          />
        </div>
      </div>
    </>
  );
};
export default HomePage;
