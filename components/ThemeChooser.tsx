"use client";

import { ChevronDownIcon, PaletteIcon } from "lucide-react";

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
  // const { theme, setTheme } = useTheme();

  return (
    <>
      {/* <div className="dropdown dropdown-end">
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
    </div> */}

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
                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                aria-label={choice}
                value={choice}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
