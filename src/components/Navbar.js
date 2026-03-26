import React from 'react';

function Navbar({ onReset, showReset, onTokenClick, onRemoveToken, hasToken }) {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Follower Tracker
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* API Token Button */}
            <button
              onClick={onTokenClick}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-medium transition ${
                hasToken
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
              title={hasToken ? 'Token configured' : 'Click to add token for real profile pictures'}
            >
              {hasToken ? '✓ API Token' : '+ Add Token'}
            </button>

            {hasToken && (
              <button
                onClick={onRemoveToken}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-amber-100 text-amber-700 font-medium rounded-lg text-sm hover:bg-amber-200 transition"
              >
                Remove Token
              </button>
            )}

            {showReset && (
              <button
                onClick={onReset}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-rose-100 text-rose-700 font-medium rounded-lg text-sm hover:bg-rose-200 transition"
              >
                Reset Data
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;