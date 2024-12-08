"use client";

import HeaderAuth from "../auth/header-auth";

export default function Header() {
  return (
    <header className="bg-neutral-200 text-white px-12 flex justify-between items-center py-5">
      <p className="text-2xl ml-5 font-bold text-neutral-700">Dolphin</p>
      <HeaderAuth />
    </header>
  );
}
