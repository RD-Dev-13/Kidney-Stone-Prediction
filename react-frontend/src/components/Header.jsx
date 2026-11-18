import React from 'react'
import { Moon, Sun, Settings } from 'lucide-react'

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className="bg-surface dark:bg-gray-800 border-b border-border-color dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary dark:text-white">
            AI Medical Diagnostics
          </h2>
          <p className="text-text-secondary dark:text-gray-400">
            Advanced kidney stone detection system
          </p>
        </div>

        <div className="flex items-center gap-4">


          <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary dark:text-gray-300 shadow-[0_2px_0_#e2e8f0] dark:shadow-[0_2px_0_#374151] active:translate-y-0.5 active:shadow-none transition-all duration-150 cursor-pointer group">
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-[0_2px_0_#e2e8f0] dark:shadow-[0_2px_0_#374151] active:translate-y-0.5 active:shadow-none transition-all duration-150 cursor-pointer"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-500 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon size={20} className="text-text-secondary hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>


        </div>
      </div>
    </header>
  )
}

export default Header