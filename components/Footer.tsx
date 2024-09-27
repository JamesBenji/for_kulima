import React from "react";
import { ThemeSwitcher } from "./theme-switcher";

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs py-4 max-h-18">
      <p>Powered by Impact Developers</p>
      <ThemeSwitcher />
    </footer>
  );
}
