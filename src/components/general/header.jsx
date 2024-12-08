"use client";

import Link from "next/link";
import HeaderAuth from "../auth/header-auth";

export default function Header() {
  return (
    <header className="bg-neutral-200 text-white px-12 flex justify-between items-center py-5">
      <div className="text-2xl ml-5 font-bold text-neutral-700 cursor-pointer">
        <Link href="/">Dolphin</Link>
      </div>
      <HeaderAuth />
    </header>
  );
}
