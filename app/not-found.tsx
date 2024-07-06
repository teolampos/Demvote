import Link from "next/link";

export default function NotFound() {
  return (
    <div className=" min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-5">
        <h2 className="text-2xl text-gray-900 font-bold">
          404: Page Not Found
        </h2>
        <Link
          href="/dashboard"
          className="text-xs md:text-md  lg:text-[1rem] font-bold text-slate-100 bg-green-700 border border-solid border-green-700 rounded-[4px] px-3 py-1.5 hover:bg-white hover:green-red-700 hover:text-gray-900 active:bg-green-700 active:text-white transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
