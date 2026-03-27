import React, { useEffect, useState } from 'react';
import VirtualizedUserGrid from './VirtualizedUserGrid';

function QueueGrid({ queueList, onMarkUnfollowed, apiService }) {
  const PAGE_SIZE = 200;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filterMode, setFilterMode] = useState('all'); // all, recently_requested, old_requests

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [queueList, filterMode]);

  const filteredQueueList = React.useMemo(() => {
    if (filterMode === 'all') return queueList;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return queueList.filter((user) => {
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
  }, [queueList, filterMode]);

  const canLoadMore = visibleCount < filteredQueueList.length;

  // Debugging: log timestamps and filtered list details
  console.debug('QueueGrid filter', filterMode, 'first timestamps', filteredQueueList.slice(0, 8).map((u) => u.timestamp));

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex justify-between items-end mb-2 border-b border-slate-200 pb-2 flex-shrink-0">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Queue</h2>
        <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">
          {filteredQueueList.length}
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
          All ({queueList.length})
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
          users={filteredQueueList}
          onMarkUnfollowed={onMarkUnfollowed}
          mode="queue"
          canLoadMore={canLoadMore}
          onLoadMore={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredQueueList.length))}
          visibleCount={visibleCount}
          apiService={apiService}
        />
      </div>
    </div>
  );
}

export default QueueGrid;