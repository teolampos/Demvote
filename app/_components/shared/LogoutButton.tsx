"use client";
import { logout } from "@/app/_lib/actions";
import React from "react";

const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button
      className="flex items-center gap-3 p-2 cursor-pointer hover:bg-blue-700 transition-all duration-100 active:scale-[0.97]"
      onClick={() => logout()}
    >
      {children}
      Logout
    </button>
  );
};

export default LogoutButton;
