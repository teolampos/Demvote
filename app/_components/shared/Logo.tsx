import React from "react";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div className=" flex flex-row items-center gap-1">
      <Image
        src="/ballotBox.png"
        alt="Demvote"
        width={25}
        height={25}
        className="max-[550px]:max-w-[20px]"
      />
      <div>
        <Link
          href={"/"}
          className={`text-sm  sm:text-xl lg:text-2xl font-bold  text-gray-900 `}
        >
          demvote.
        </Link>
        <span className="text-sm sm:text-xl lg:text-2xl text-blue-950">
          com
        </span>
      </div>
    </div>
  );
};

export default Logo;
