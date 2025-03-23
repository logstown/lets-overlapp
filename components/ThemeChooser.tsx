"use client";

import { themes } from "@/lib/utilities";
import { CheckIcon, ChevronDownIcon, PaletteIcon } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

export default function ThemeChooser() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    setTheme(localStorage.getItem("lets-overlapp-theme") ?? "default");
  }, []);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("lets-overlapp-theme", theme);
    }
  }, [theme]);

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost rounded-field gap-3">
        <PaletteIcon size={20} /> <ChevronDownIcon size={15} />
      </div>
      <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
        {themes.map((choice) => (
          <li key={choice}>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-block btn-sm btn-ghost justify-start"
              aria-label={choice + (theme === choice ? " ✓" : "")}
              value={choice}
              checked={theme === choice}
              onChange={() => setTheme(choice)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
