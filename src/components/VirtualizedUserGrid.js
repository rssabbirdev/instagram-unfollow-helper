import React, { useEffect, useRef } from 'react';
import UserCard from './UserCard';

/**
 * Virtualized grid using IntersectionObserver for lazy loading.
 * Renders items in groups; hides off-screen items to save memory.
 * Works seamlessly with CSS Grid layout.
 */
function VirtualizedUserGrid({ users, onMarkUnfollowed, mode = 'queue', canLoadMore, onLoadMore, visibleCount, apiService }) {
  const containerRef = useRef(null);
  const itemRefs = useRef(new Map());
  const observerRef = useRef(null);
  const [visibleItems, setVisibleItems] = React.useState(new Set(
    Array.from({ length: Math.min(20, visibleCount) }, (_, i) => i)
  ));

  // Initialize IntersectionObserver for lazy rendering
  useEffect(() => {
    // Create observer that tracks which items are visible
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisible = new Set(visibleItems);
        
        entries.forEach((entry) => {
          const idx = parseInt(entry.target.dataset.index, 10);
          if (entry.isIntersecting) {
            // Item entering viewport - render it
            newVisible.add(idx);
          } else {
            // Item leaving viewport - optionally hide it (keep for smoother scrolling)
            // You can remove this line to render off-screen items
            // newVisible.delete(idx);
          }
        });

        if (newVisible.size > visibleItems.size) {
          setVisibleItems(newVisible);
        }
      },
      { rootMargin: '200px' } // Start loading 200px before item enters viewport
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleItems]);

  // Observe/unobserve items as they're added/removed
  useEffect(() => {
    const itemCount = canLoadMore ? visibleCount : users.length;

    itemRefs.current.forEach((element, idx) => {
      if (idx < itemCount && observerRef.current) {
        observerRef.current.observe(element);
      } else if (observerRef.current) {
        observerRef.current.unobserve(element);
      }
    });

    // Clean up refs for removed items
    itemRefs.current.forEach((_, idx) => {
      if (idx >= itemCount) {
        itemRefs.current.delete(idx);
      }
    });
  }, [users.length, visibleCount, canLoadMore]);

  const itemCount = canLoadMore ? visibleCount : users.length;

  if (itemCount === 0) {
    return (
      <div className="col-span-full p-6 md:p-8 text-center text-slate-500 bg-white rounded-xl shadow border border-slate-100">
        {mode === 'insight' ? 'No accounts found in this tab.' : 'No accounts left in the queue! 🎉'}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        ref={containerRef}
        className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3 overflow-y-auto custom-scrollbar px-2 flex-1 min-h-0 content-start auto-rows-max"
      >
        {Array.from({ length: itemCount }).map((_, index) => {
          const user = users[index];
          if (!user) return null;

          const isVisible = visibleItems.has(index);

          return (
            <div
              key={user.username}
              ref={(el) => {
                if (el) itemRefs.current.set(index, el);
                else itemRefs.current.delete(index);
              }}
              data-index={index}
              className={isVisible ? '' : 'opacity-0'}
            >
              {isVisible && (
                <UserCard
                  user={user}
                  onMarkUnfollowed={onMarkUnfollowed}
                  mode={mode}
                  apiService={apiService}
                />
              )}
            </div>
          );
        })}
        
        {canLoadMore && (
          <div className="col-span-full flex justify-center py-0">
            <button
              type="button"
              onClick={onLoadMore}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualizedUserGrid;
