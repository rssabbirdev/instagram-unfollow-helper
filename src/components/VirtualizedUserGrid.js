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
      <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
        <div
          ref={containerRef}
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 overflow-y-auto custom-scrollbar pr-2 content-start pb-4 flex-1 min-h-0"
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
        </div>
      </div>

      {canLoadMore && (
        <div className="pt-3 flex-shrink-0">
          <button
            type="button"
            onClick={onLoadMore}
            className="w-full md:w-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

export default VirtualizedUserGrid;
