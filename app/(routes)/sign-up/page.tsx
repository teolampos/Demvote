"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { roboto } from "../../_lib/fonts";
import LoginButton from "@/app/_components/sign-up/LoginButton";
import { signUpUser } from "@/app/_lib/actions";
import { useFormState } from "react-dom";
import { ButtonTypeEnum } from "@/app/_lib/entities";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [state, signUpAction] = useFormState(signUpUser, {});

  return (
    <>
      <div className="flex flex-row max-w-full min-h-[100vh] border border-solid border-black bg-slate-50">
        <div
          className={`flex flex-col  gap-2 py-7 px-7 md:px-10 w-screen lg:min-w-[45%] ${roboto.className}`}
        >
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

          <h1 className="mt-10 text-2xl md:text-3xl text-gray-900 font-bold text-justify">
            Sign Up
          </h1>
          <p className=" text-lg md:text-xl text-gray-600 tracking-tight">
            Fill out your info and begin to vote instantly!
          </p>
          <form
            action={signUpAction}
            className=" lg:max-w-[90%]  shadow-[5px_10px_20px_lightgray] flex flex-col gap-3 bg-white p-5 lg:p-10 mt-3"
          >
            <div className="flex flex-col ">
              <label htmlFor="firstname" className="text-gray-900 font-bold">
                First Name *
              </label>
              <input
                type="text"
                placeholder="First Name"
                id="firstname"
                name="firstname"
                className="border border-solid border-gray-900  py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-blue-700 focus:border-solid"
                pattern="[a-zA-Z]*"
                required
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="lastname" className="text-gray-900 font-bold">
                Last Name *
              </label>
              <input
                type="text"
                placeholder="Last Name"
                id="lastname"
                name="lastname"
                className="border border-solid border-gray-900  py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-blue-700 focus:border-solid"
                pattern="[a-zA-Z]*"
                required
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="lastname" className="text-gray-900 font-bold">
                Username *
              </label>
              <input
                type="text"
                placeholder="Username"
                id="username"
                name="username"
                className={`border border-solid ${
                  state?.err === "Username already in use"
                    ? "border-red-600"
                    : "border-gray-900"
                }  py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-blue-700 focus:border-solid`}
                required
              />
              {state?.err === "Username already exists" && (
                <span className="text-sm lg:text-md text-red-600 tracking-tight">
                  {state.err}
                </span>
              )}
            </div>
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
                  state?.err === "Email address already in use" || state?.email
                    ? "border-red-600"
                    : "border-gray-900"
                }  py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-blue-700 focus:border-solid`}
                required
              />

              {state?.err === "Email address already in use" && (
                <span className="text-sm lg:text-md text-red-600 tracking-tight">
                  {state.err}
                </span>
              )}
              {state?.email && (
                <span className="text-sm lg:text-md text-red-600 tracking-tight">
                  {state.email}
                </span>
              )}
            </div>
            <div className="flex flex-col ">
              <label htmlFor="password" className="text-gray-900 font-bold  ">
                Password *
              </label>
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                id="password"
                name="password"
                className="border border-solid border-gray-900  py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-blue-700 focus:border-solid"
                required
                minLength={8}
              />
              <div className="flex gap-1 self-end">
                <span className="text-sm lg:text-md tracking-tight">
                  Show password
                </span>
                <input type="checkbox" onChange={() => setShow(!show)} />
              </div>
            </div>
            <div className="flex flex-col ">
              <label htmlFor="dateOfBirth" className="text-gray-900 font-bold">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className="border border-solid border-gray-900  py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-blue-700 focus:border-solid"
                required
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="gender" className=" text-gray-900 font-bold">
                Gender *
              </label>

              <select
                id="gender"
                name="gender"
                className="border border-solid border-gray-900  py-1 lg:py-1.5 px-2 lg:px-3 rounded-md outline-none focus:border-[2px] focus:border-blue-700 focus:border-solid"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <LoginButton text={ButtonTypeEnum.SIGN_UP} />
            <Link
              href={"/login"}
              className="text-gray-900 text-sm text-center underline "
            >
              Already have an account? Login.
            </Link>
          </form>
        </div>
        <div className="max-[900px]:hidden min-w-[55%] bg-[url('/voting.jpg')] bg-no-repeat bg-cover bg-right  grayscale-[20%]"></div>
      </div>
    </>
  );
};

export default SignUp;
