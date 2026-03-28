import React, { useEffect, useState } from 'react';
import VirtualizedUserGrid from './VirtualizedUserGrid';

function PendingRequestsGrid({ pendingRequestsList, onMarkAsHandled, apiService }) {
  const PAGE_SIZE = 200;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [pendingRequestsList]);

  const filteredPendingRequestsList = pendingRequestsList;

  const canLoadMore = visibleCount < filteredPendingRequestsList.length;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex justify-between items-end mb-2 border-b border-slate-200 pb-2 flex-shrink-0">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Pending Requests</h2>
        <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">
          {filteredPendingRequestsList.length}
        </span>
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
