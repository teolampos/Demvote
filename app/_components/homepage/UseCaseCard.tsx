import React from "react";
import Image from "next/image";

interface Props {
  title: string;
  subUseCases: {
    subtitle: string;
    text: string;
  }[];
  src: string;
  alt: string;
}

const UseCaseCard = ({ title, subUseCases, src, alt }: Props) => {
  return (
    <>
      <div className=" p-7 rounded-lg bg-gray-900 flex flex-col gap-4 transition-all ease-linear hover:scale-[97%] ">
        <div className="text-2xl md:text-3xl text-white flex flex-row  items-center gap-4 ">
          <span>{title}</span>
          <Image
            src={src}
            alt={alt}
            width={40}
            height={40}
            className="bg-white rounded-md"
          />
        </div>

        <ul className="mt-4 flex flex-col gap-4">
          {subUseCases.map((item) => {
            return (
              <li key={`${item.subtitle}_1`}>
                <span className="text-xl text-white font-bold">
                  {item.subtitle}:{" "}
                </span>{" "}
                <span className="text-lg text-slate-300 leading-10">
                  {item.text}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default UseCaseCard;
