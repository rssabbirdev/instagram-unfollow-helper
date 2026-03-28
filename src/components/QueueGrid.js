import React, { useEffect, useState } from 'react';
import VirtualizedUserGrid from './VirtualizedUserGrid';

function QueueGrid({ queueList, onMarkUnfollowed, apiService }) {
  const PAGE_SIZE = 200;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [queueList]);

  const filteredQueueList = queueList;

  const canLoadMore = visibleCount < filteredQueueList.length;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex justify-between items-end mb-2 border-b border-slate-200 pb-2 flex-shrink-0">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Queue</h2>
        <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">
          {filteredQueueList.length}
        </span>
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