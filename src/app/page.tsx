"use client";

import SpinToWinWheel from "./spintowin/SpinToWinWheel";

export default function Home() {
  return (
    <div className="min-h-screen flex items-start justify-center bg-[#f7f6f2] pt-2">
      <SpinToWinWheel />
    </div>
  );
}
