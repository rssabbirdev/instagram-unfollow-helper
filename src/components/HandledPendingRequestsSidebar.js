import React from 'react';

function HandledPendingRequestsSidebar({ handledPendingRequests, onRestorePendingRequest }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-3 border-b border-slate-200 pb-2 flex-shrink-0">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Handled
        </h2>
        <span className="text-slate-500 text-sm font-semibold">{handledPendingRequests.length}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        <div className="flex flex-col gap-2">
          {handledPendingRequests.length === 0 ? (
            <div className="p-4 text-center text-xs md:text-sm text-slate-400">
              No pending requests handled yet.
            </div>
          ) : (
            handledPendingRequests.map((user) => (
              <HandledRequestItem
                key={user.username}
                user={user}
                onRestore={onRestorePendingRequest}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function HandledRequestItem({ user, onRestore }) {
  const avatarUrl = `https://ui-avatars.com/api/?name=${user.username}&background=f1f5f9&color=64748b&size=64`;

  return (
    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition border border-transparent hover:border-slate-100 group">
      <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
        <img
          src={avatarUrl}
          className="w-6 h-6 md:w-8 md:h-8 rounded-full grayscale opacity-70"
          alt={user.username}
        />
        <span
          className="text-xs md:text-sm font-medium text-slate-600 truncate opacity-70 line-through decoration-slate-300"
          title={user.username}
        >
          {user.username}
        </span>
      </div>
      <button
        onClick={() => onRestore(user.username)}
        className="text-[10px] md:text-xs px-2 py-1 text-slate-400 bg-white border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-700 transition lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100"
      >
        Undo
      </button>
    </div>
  );
}

export default HandledPendingRequestsSidebar;
