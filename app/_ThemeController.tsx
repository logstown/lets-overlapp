import { MoonIcon, SunIcon } from 'lucide-react'

export default function ThemeController() {
  return (
    <label className='swap swap-rotate'>
      {/* this hidden checkbox controls the state */}
      <input type='checkbox' className='theme-controller' value='dracula' />

      {/* sun icon */}
      <SunIcon className='swap-off h-7 w-7 fill-current' />

      {/* moon icon */}
      <MoonIcon className='swap-on h-7 w-7 fill-current' />
    </label>
  )
}
