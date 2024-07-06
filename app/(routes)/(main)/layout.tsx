import Logo from "@/app/_components/shared/Logo";
import LogoutButton from "@/app/_components/shared/LogoutButton";
import { roboto } from "@/app/_lib/fonts";
import Link from "next/link";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="max-w-[100vw]">
        <div className="bg-white h-[5vh] sm:h-[7vh] flex items-center px-2.5 sm:px-4  ">
          <Logo />
        </div>
        <div className="w-[100vw] min-h-[95vh] sm:min-h-[93vh]   flex">
          <div className="min-w-[30%] sm:min-w-[20%] min-h-full  bg-gray-900 px-1 pt-5 ">
            <ul
              className={`flex flex-col gap-3 text-white font-bold text-xs sm:text-lg lg:text-xl list-none ${roboto.className}`}
            >
              <Link
                href={"/dashboard"}
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-blue-700 transition-all duration-100 active:scale-[0.97]"
              >
                <svg
                  className="w-3 h-3 sm:w-6 sm:h-6 text-white "
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
                    d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"
                  />
                </svg>
                <span>Dashboard</span>
              </Link>
              <Link
                href={"/view-polls"}
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-blue-700 transition-all duration-100 active:scale-[0.97]"
              >
                <svg
                  className="w-3 h-3 sm:w-6 sm:h-6 text-white "
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
                    d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 5.5-5.5"
                  />
                </svg>
                <span>Polls List </span>
              </Link>
              <LogoutButton>
                <svg
                  className="w-3 h-3 sm:w-6 sm:h-6 text-white "
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
                    d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                  />
                </svg>
              </LogoutButton>
            </ul>
          </div>
          <div className="min-w-[70%] sm:min-w-[80%] bg-slate-100  px-3 ">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
