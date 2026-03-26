import React, { useState } from 'react';

function AccessTokenModal({ isOpen, onClose, onSubmit }) {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please enter an access token');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      await onSubmit(token);
    } catch (err) {
      setError(err.message || 'Failed to validate token');
    } finally {
      setIsValidating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Instagram Graph API Setup</h2>
        <p className="text-slate-600 text-sm mb-6">
          Enter your Instagram access token to display real profile pictures. 
          <a 
            href="https://developers.instagram.com/docs/instagram-graph-api/getting-started"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline ml-1"
          >
            Learn how to get a token
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError('');
            }}
            placeholder="Paste your access token here..."
            className="w-full p-3 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setToken('');
                setError('');
                onClose();
              }}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isValidating || !token.trim()}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Validating...' : 'Confirm'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
          <p className="font-semibold mb-2">🔒 Privacy & Security:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Token is stored locally in your browser only</li>
            <li>Never sent to external servers</li>
            <li>You can revoke it anytime from Instagram Developer Dashboard</li>
            <li>Use a long-lived user access token for best results</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AccessTokenModal;
