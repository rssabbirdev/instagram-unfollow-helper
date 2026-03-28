import React from 'react';

function UserCard({ user, onMarkUnfollowed, mode = 'queue' }) {
  const canMarkUnfollowed = typeof onMarkUnfollowed === 'function' && mode === 'queue';

  // Fallback placeholder avatar until real API photo resolution is implemented
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  const handleCardClick = (e) => {
    // Prevent card click when clicking on buttons/links
    if (e.target.closest('a')) return;
    // Open app link and mark as unfollowed
    window.location.href = user.appLink;
    if (canMarkUnfollowed) onMarkUnfollowed(user.username);
  };

  const handleAppLinkClick = () => {
    if (canMarkUnfollowed) onMarkUnfollowed(user.username);
  };

  const handleWebLinkClick = () => {
    if (canMarkUnfollowed) onMarkUnfollowed(user.username);
  };

  // Function to get relative time string
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const timeDiff = now - new Date(timestamp);
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 md:p-4 flex flex-col items-center hover:shadow-md transition cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={avatarUrl}
        alt={user.username}
        loading="lazy"
        decoding="async"
        className="w-12 h-12 md:w-16 md:h-16 rounded-full mb-2 md:mb-3 shadow-sm border-2 border-slate-50"
      />
      <span
        className="font-bold text-slate-800 text-sm md:text-base mb-1 truncate w-full text-center"
        title={user.username}
      >
        {user.username}
      </span>
      {user.timestamp && (
        <span className="text-xs text-slate-500 mb-3 block w-full text-center">
          {getRelativeTime(user.timestamp)}
        </span>
      )}

      {/* Mobile view */}
      <div className="w-full flex flex-col gap-1.5 mt-auto md:hidden">
        <a
          href={user.appLink}
          onClick={handleAppLinkClick}
          className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold rounded-lg text-xs transition text-center flex justify-center items-center gap-1"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          App
        </a>
      </div>

      {/* Desktop view */}
      <div className="w-full mt-auto hidden md:block">
        <a
          href={user.webLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWebLinkClick}
          className="w-full py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold rounded-lg text-sm transition text-center block"
        >
          Open Profile
        </a>
      </div>
    </div>
  );
}

export default UserCard;