import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Upload, Info } from 'lucide-react'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  
  const menuItems = [
    { path: '/upload', icon: Upload, label: 'Upload Scan' },
    { path: '/about', icon: Info, label: 'About' },
  ]

  return (
    <>
      <div 
        className={`fixed inset-y-0 left-0 z-50 ${
          isOpen ? 'w-64' : 'w-16'
        } bg-surface dark:bg-gray-800 shadow-xl transition-all duration-300 ease-in-out flex flex-col justify-between`}
      >
        <div>
          {/* Header */}
          <div className={`flex items-center ${isOpen ? 'justify-between px-4' : 'justify-center px-2'} py-4 border-b border-border-color dark:border-gray-700 min-h-[73px]`}>
            {isOpen && (
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <div className="whitespace-nowrap overflow-hidden">
                  <h1 className="font-bold text-base text-text-primary dark:text-white leading-tight">KidneyAI Pro</h1>
                  <p className="text-xs text-text-secondary dark:text-gray-400">Medical AI Platform</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-[0_2px_0_#cbd5e1] dark:shadow-[0_2px_0_#334155] active:translate-y-0.5 active:shadow-none transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 group"
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
              title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <span 
                  className={`h-0.5 w-5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                    isOpen ? 'translate-y-[7px] rotate-45' : ''
                  }`} 
                />
                <span 
                  className={`h-0.5 w-5 bg-current rounded-full transition-all duration-200 ease-in-out ${
                    isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                  }`} 
                />
                <span 
                  className={`h-0.5 w-5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                    isOpen ? '-translate-y-[7px] -rotate-45' : ''
                  }`} 
                />
              </div>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className={`py-4 ${isOpen ? 'px-3 space-y-2' : 'px-2 space-y-3'} flex flex-col`}>
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || (item.path === '/upload' && location.pathname === '/')
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={!isOpen ? item.label : undefined}
                  aria-label={item.label}
                  className={`sidebar-item group relative flex items-center ${
                    isOpen 
                      ? 'gap-3 px-4 py-3 rounded-xl w-full hover:translate-x-1' 
                      : 'justify-center w-10 h-10 p-0 rounded-xl mx-auto hover:scale-105'
                  } ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  {isOpen && (
                    <span className="font-medium whitespace-nowrap overflow-hidden transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}

                  {/* Floating tooltip when folded */}
                  {!isOpen && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-slate-700/50">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Status */}
        {isOpen ? (
          <div className="p-4">
            <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse-slow"></div>
                <span className="text-sm font-semibold text-primary">AI System Online</span>
              </div>
              <p className="text-xs text-text-secondary dark:text-gray-400">
                Ready for medical image analysis
              </p>
            </div>
          </div>
        ) : (
          <div className="pb-6 flex justify-center" title="AI System Online">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse-slow"></div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar