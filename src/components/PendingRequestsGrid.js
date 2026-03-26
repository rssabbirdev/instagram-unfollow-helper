import React, { useEffect, useState } from 'react';
import VirtualizedUserGrid from './VirtualizedUserGrid';

function PendingRequestsGrid({ pendingRequestsList, onMarkAsHandled, apiService }) {
  const PAGE_SIZE = 200;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [pendingRequestsList]);

  const canLoadMore = visibleCount < pendingRequestsList.length;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex justify-between items-end mb-3 border-b border-slate-200 pb-2 flex-shrink-0">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Pending Requests</h2>
        <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">
          {pendingRequestsList.length}
        </span>
      </div>

      <VirtualizedUserGrid
        users={pendingRequestsList}
        onMarkUnfollowed={onMarkAsHandled}
        mode="queue"
        canLoadMore={canLoadMore}
        onLoadMore={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, pendingRequestsList.length))}
        visibleCount={visibleCount}
        apiService={apiService}
      />
    </div>
  );
}

export default PendingRequestsGrid;
