"use client";

import { CheckCircleIcon, CheckIcon, ChevronDownIcon, PaletteIcon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeChooser() {
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
    "caramellatte",
    "abyss",
    "silk",
  ];
  const { theme, setTheme } = useTheme();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm rounded-field">
        <PaletteIcon size={20} /> <ChevronDownIcon size={15} />
      </div>
      <ul tabIndex={0} className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm">
        {themes.map((choice) => (
          <li key={choice}>
            <button onClick={() => setTheme(choice)} className="flex justify-between">
              {choice}
              {theme === choice && <CheckIcon className="w-4 h-4" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
