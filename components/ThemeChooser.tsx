"use client";

import { themes } from "@/lib/utilities";
import { ChevronDownIcon, PaletteIcon } from "lucide-react";

export default function ThemeChooser() {
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
              className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
              aria-label={choice}
              value={choice}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
