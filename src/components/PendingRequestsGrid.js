import React, { useEffect, useState } from 'react';
import VirtualizedUserGrid from './VirtualizedUserGrid';

function PendingRequestsGrid({ pendingRequestsList, onMarkAsHandled, apiService }) {
  const PAGE_SIZE = 200;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filterMode, setFilterMode] = useState('all');

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [pendingRequestsList, filterMode]);

  const filteredPendingRequestsList = React.useMemo(() => {
    if (filterMode === 'all') return pendingRequestsList;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return pendingRequestsList.filter((user) => {
      if (!user?.timestamp) return true;
      const userDate = new Date(user.timestamp);
      if (Number.isNaN(userDate.valueOf())) return true;

      if (filterMode === 'recently_requested') {
        return userDate >= sevenDaysAgo;
      }
      if (filterMode === 'old_requests') {
        return userDate < sevenDaysAgo;
      }
      return true;
    });
  }, [pendingRequestsList, filterMode]);

  const canLoadMore = visibleCount < filteredPendingRequestsList.length;

  console.debug('PendingRequestsGrid filter', filterMode, 'first timestamps', filteredPendingRequestsList.slice(0, 8).map((u) => u.timestamp));

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex justify-between items-end mb-2 border-b border-slate-200 pb-2 flex-shrink-0">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Pending Requests</h2>
        <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">
          {filteredPendingRequestsList.length}
        </span>
      </div>

      <div className="flex gap-2 mb-3 flex-shrink-0">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1 text-xs rounded-full transition ${
            filterMode === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({pendingRequestsList.length})
        </button>
        <button
          onClick={() => setFilterMode('recently_requested')}
          className={`px-3 py-1 text-xs rounded-full transition ${
            filterMode === 'recently_requested'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Recently Requested
        </button>
        <button
          onClick={() => setFilterMode('old_requests')}
          className={`px-3 py-1 text-xs rounded-full transition ${
            filterMode === 'old_requests'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Older Requests
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <VirtualizedUserGrid
          users={filteredPendingRequestsList}
          onMarkUnfollowed={onMarkAsHandled}
          mode="queue"
          canLoadMore={canLoadMore}
          onLoadMore={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredPendingRequestsList.length))}
          visibleCount={visibleCount}
          apiService={apiService}
        />
      </div>
    </div>
  );
}

export default PendingRequestsGrid;
