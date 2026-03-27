import React from 'react';
import QueueGrid from './QueueGrid';
import UnfollowedSidebar from './UnfollowedSidebar';
import PendingRequestsGrid from './PendingRequestsGrid';
import HandledPendingRequestsSidebar from './HandledPendingRequestsSidebar';
import VirtualizedUserGrid from './VirtualizedUserGrid';

function InsightGrid({ users, resetKey, apiService }) {
  const PAGE_SIZE = 200;
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [resetKey]);

  const canLoadMore = visibleCount < users.length;

  return (
    <VirtualizedUserGrid
      users={users}
      mode="insight"
      canLoadMore={canLoadMore}
      onLoadMore={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, users.length))}
      visibleCount={visibleCount}
      apiService={apiService}
    />
  );
}

function ResultsView({
  queueList,
  unfollowedList,
  onMarkUnfollowed,
  onRestoreToQueue,
  activeTab,
  onChangeTab,
  fansList,
  closeFriendsList,
  pendingRequestsList,
  handledPendingRequests,
  onMarkAsHandled,
  onRestorePendingRequest,
  recentlyUnfollowedList,
  apiService
}) {
  const tabs = [
    { id: 'not_following_back', label: 'Not Following Back' },
    { id: 'fans', label: 'Fans' },
    { id: 'close_friends', label: 'Close Friends' },
    { id: 'pending_requests', label: 'Pending Requests' },
    { id: 'unfollowed', label: 'Unfollowed' } // recently unfollowed profiles
  ];

  const navButtonClass = (tabId) => {
    const isActive = activeTab === tabId;
    return isActive
      ? 'bg-indigo-600 text-white border-indigo-600'
      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50';
  };

  const insightConfig = () => {
    switch (activeTab) {
      case 'fans':
        return { title: 'Fans', count: fansList.length, list: fansList };
      case 'close_friends':
        return { title: 'Close Friends', count: closeFriendsList.length, list: closeFriendsList };
      case 'pending_requests':
        return { title: 'Pending Requests', count: pendingRequestsList.length, list: pendingRequestsList };
      case 'unfollowed':
        return { title: 'Recently Unfollowed', count: recentlyUnfollowedList.length, list: recentlyUnfollowedList };
      default:
        return { title: '', count: 0, list: [] };
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex-1 min-h-0 overflow-hidden flex">
      {/* Desktop navigation */}
      <aside className="hidden lg:block w-64 border-r border-slate-200 bg-white flex-shrink-0">
        <div className="h-full overflow-y-auto custom-scrollbar p-3">
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-semibold border transition ${navButtonClass(tab.id)}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col min-h-0">
        {/* Mobile navigation */}
        <div className="lg:hidden border-b border-slate-200 bg-white px-3 py-2 flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-semibold border transition ${navButtonClass(tab.id)}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden px-2 md:px-4">
          {activeTab === 'not_following_back' ? (
            <div className="w-full h-full flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
              <div className="flex-1 flex flex-col lg:w-2/3 min-h-0">
                <QueueGrid queueList={queueList} onMarkUnfollowed={onMarkUnfollowed} apiService={apiService} />
              </div>

              <div className="flex-none lg:w-1/3 xl:w-96 flex flex-col min-h-0">
                <UnfollowedSidebar unfollowedList={unfollowedList} onRestoreToQueue={onRestoreToQueue} />
              </div>
            </div>
          ) : activeTab === 'pending_requests' ? (
            <div className="w-full h-full flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
              <div className="flex-1 flex flex-col lg:w-2/3 min-h-0">
                <PendingRequestsGrid pendingRequestsList={pendingRequestsList} onMarkAsHandled={onMarkAsHandled} apiService={apiService} />
              </div>

              <div className="flex-none lg:w-1/3 xl:w-96 flex flex-col min-h-0">
                <HandledPendingRequestsSidebar handledPendingRequests={handledPendingRequests} onRestorePendingRequest={onRestorePendingRequest} />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
              {(() => {
                const cfg = insightConfig();
                return (
                  <>
                    <div className="flex justify-between items-end mb-2 border-b border-slate-200 pb-2 flex-shrink-0">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-800">{cfg.title}</h2>
                      <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">
                        {cfg.count}
                      </span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden">
                      <InsightGrid users={cfg.list} resetKey={activeTab} apiService={apiService} />
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsView;