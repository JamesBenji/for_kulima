"use client";
import React from "react";

export default function Action({
  name,
  actionFunction,
  displayAction
}: {
  name: string;
  actionFunction: React.Dispatch<React.SetStateAction<string>>;
  displayAction: string
}) {

    const activeCSS = 'bg-gradient-to-tr from-[#00ff00] to-[#17acff] text-white'
  return (
    <button
      onClick={() => actionFunction(name)}
      className={`bg-white border-[1px] dark:bg-gradient-to-tr dark:from-[#00ff00] dark:to-[#17acff] dark:hover:text-black hover:bg-gradient-to-tr hover:from-[#00ff00] hover:to-[#17acff] px-5 py-4 my-2 rounded-lg shadow-md hover:text-white hover:underline ${displayAction === name ? activeCSS : ''}`}
    >
      <span>{name}</span>
    </button>
  );
}
