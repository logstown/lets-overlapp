import { MoonIcon, SunIcon } from 'lucide-react'

export default function ThemeController() {
  return (
    <label className='swap swap-rotate'>
      {/* this hidden checkbox controls the state */}
      <input type='checkbox' className='theme-controller' value='dracula' />

      {/* sun icon */}
      <SunIcon className='swap-on h-7 w-7' strokeWidth={1.5} />

      {/* moon icon */}
      <MoonIcon className='swap-off h-7 w-7' strokeWidth={1.5} />
    </label>
  )
}
