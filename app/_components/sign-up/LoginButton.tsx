"use client";
import { ButtonTypeEnum } from "@/app/_lib/entities";
import { useFormStatus } from "react-dom";

const LoginButton = ({ text }: { text: ButtonTypeEnum }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-3 p-4  text-slate-100 font-bold bg-blue-700 border border-solid border-blue-700 rounded-[4px] px-3 py-1.5 hover:bg-white hover:text-blue-700 active:bg-blue-700 active:text-white transition "
    >
      {pending ? (
        <div
          className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default LoginButton;
