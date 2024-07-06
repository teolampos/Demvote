"use client";

import Image from "next/image";
import Link from "next/link";
import { roboto } from "../../_lib/fonts";
import LoginButton from "@/app/_components/sign-up/LoginButton";
import { useFormState } from "react-dom";
import { loginUser } from "@/app/_lib/actions";
import { ButtonTypeEnum } from "@/app/_lib/entities";
import { useState } from "react";
import Logo from "@/app/_components/shared/Logo";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [state, loginAction] = useFormState(loginUser, undefined);

  return (
    <>
      <div className="flex flex-row max-w-full min-h-[100vh] border border-solid border-black bg-slate-50">
        <div
          className={`flex flex-col  gap-2 py-7 px-7 md:px-10 w-screen lg:min-w-[45%] ${roboto.className}`}
        >
          <Logo />

          <h1 className="mt-10 text-2xl md:text-3xl text-gray-900 font-bold text-justify">
            Sign In
          </h1>
          <p className=" text-lg md:text-xl text-gray-600 tracking-tight">
            Welcome back fellow voter!
          </p>
          <form
            action={loginAction}
            className=" lg:max-w-[90%] min-h-[50vh] shadow-[5px_10px_20px_lightgray] flex flex-col justify-center gap-3 bg-white p-5 lg:p-10 mt-3"
          >
            <div className="flex flex-col ">
              <label htmlFor="email" className="text-gray-900 font-bold">
                Email *
              </label>
              <input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                className={`border border-solid ${
                  state?.err == "User Not Found"
                    ? "border-red-600"
                    : "border-gray-900"
                }  py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-blue-700 focus:border-solid`}
                required
              />

              {state?.err === "User Not Found" && (
                <span className="text-sm lg:text-md text-red-600 tracking-tight">
                  Invalid Email
                </span>
              )}
            </div>
            <div className="flex flex-col ">
              <label htmlFor="password" className="text-gray-900 font-bold  ">
                Password
              </label>
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                id="password"
                className={`border border-solid ${
                  state?.err === "Invalid Password"
                    ? "border-red-600"
                    : "border-gray-900"
                }  py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-blue-700 focus:border-solid`}
                name="password"
                required
              />
              {state?.err === "Invalid Password" && (
                <span className="text-sm lg:text-md text-red-600 tracking-tight">
                  Invalid Password
                </span>
              )}
              <div className="flex gap-1 self-end">
                <span className="text-sm lg:text-md tracking-tight">
                  Show password
                </span>
                <input type="checkbox" onChange={(e) => setShow(!show)} />
              </div>
            </div>

            <LoginButton text={ButtonTypeEnum.LOGIN} />
            <Link
              href={"/sign-up"}
              className="text-gray-900 text-sm text-center underline "
            >
              Don't have an account? Sign up.
            </Link>
          </form>
        </div>
        <div className="max-[900px]:hidden min-w-[55%] bg-[url('/voting.jpg')] bg-no-repeat bg-cover bg-right  grayscale-[20%]"></div>
      </div>
    </>
  );
};

export default SignUp;
