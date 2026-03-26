import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UploadView from './components/UploadView';
import ResultsView from './components/ResultsView';
import AccessTokenModal from './components/AccessTokenModal';
import InstagramAPIService from './services/InstagramAPIService';
// CRA supports bundling web workers via new URL().
// This keeps heavy JSON parsing off the main thread.

function App() {
  const [queueList, setQueueList] = useState([]);
  const [unfollowedList, setUnfollowedList] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('not_following_back');
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState(null);

  // Access token management
  const [accessToken, setAccessToken] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [apiService, setApiService] = useState(null);

  // Additional insight lists (NOW persisted to localStorage)
  const [fansList, setFansList] = useState([]);
  const [closeFriendsList, setCloseFriendsList] = useState([]);
  const [pendingRequestsList, setPendingRequestsList] = useState([]);
  const [handledPendingRequests, setHandledPendingRequests] = useState([]);
  const [recentlyUnfollowedList, setRecentlyUnfollowedList] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    // Test localStorage availability
    const testLocalStorage = () => {
      try {
        const testKey = '__localStorage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
      } catch {
        return false;
      }
    };

    if (!testLocalStorage()) {
      setStorageError("localStorage is not available. Data will not persist between sessions.");
      setIsLoaded(true);
      return;
    }

    try {
      // List of all localStorage keys to load
      const storageKeys = {
        queue: "instaQueue",
        unfollowed: "instaUnfollowed",
        fans: "instaFans",
        closeFriends: "instaCloseFriends",
        pendingRequests: "instaPendingRequests",
        handledPendingRequests: "instaHandledPendingRequests",
        recentlyUnfollowed: "instaRecentlyUnfollowed"
      };

      const loadedData = {
        queue: [],
        unfollowed: [],
        fans: [],
        closeFriends: [],
        pendingRequests: [],
        handledPendingRequests: [],
        recentlyUnfollowed: []
      };

      // Load each list from localStorage
      Object.entries(storageKeys).forEach(([key, storageKey]) => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            loadedData[key] = Array.isArray(parsed) ? parsed.map(formatUser) : [];
          } catch (error) {
            console.warn(`Failed to parse saved ${key} data:`, error);
            localStorage.removeItem(storageKey);
          }
        }
      });

      // Show results if any data exists
      const hasAnyData = Object.values(loadedData).some(list => list.length > 0);
      if (hasAnyData) {
        setQueueList(loadedData.queue);
        setUnfollowedList(loadedData.unfollowed);
        setFansList(loadedData.fans);
        setCloseFriendsList(loadedData.closeFriends);
        setPendingRequestsList(loadedData.pendingRequests);
        setHandledPendingRequests(loadedData.handledPendingRequests);
        setRecentlyUnfollowedList(loadedData.recentlyUnfollowed);
        setShowResults(true);
        setActiveTab('not_following_back');
      }
    } catch (error) {
      console.warn("Failed to access localStorage:", error);
      setStorageError("Unable to access browser storage. Data may not persist.");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Load access token from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("instaAccessToken");
      if (savedToken) {
        setAccessToken(savedToken);
        const service = new InstagramAPIService(savedToken);
        setApiService(service);
      }
    } catch (error) {
      console.warn("Failed to load access token:", error);
    }
  }, []);

  // Helper to ensure clean links are always used
  const formatUser = (userOrUsername) => {
    const rawUsername = typeof userOrUsername === "string" ? userOrUsername : userOrUsername?.username;
    const username = (rawUsername || "").toString().trim().replace(/^@/, "");
    return {
      username,
      appLink: `instagram://user?username=${username}`,
      webLink: `https://www.instagram.com/${username}`
    };
  };

  // Handle token submission
  const handleTokenSubmit = async (token) => {
    try {
      const service = new InstagramAPIService(token);
      const isValid = await service.validateToken();

      if (!isValid) {
        throw new Error('Invalid access token. Please check and try again.');
      }

      // Save token to localStorage
      localStorage.setItem("instaAccessToken", token);
      setAccessToken(token);
      setApiService(service);
      setShowTokenModal(false);
    } catch (error) {
      throw error;
    }
  };

  // Handle removing token
  const handleRemoveToken = () => {
    localStorage.removeItem("instaAccessToken");
    setAccessToken('');
    setApiService(null);
  };


  // Save state to localStorage whenever lists change (only after initial load)
  useEffect(() => {
    if (!isLoaded || typeof Storage === "undefined") return;

    try {
      localStorage.setItem("instaQueue", JSON.stringify(queueList));
      localStorage.setItem("instaUnfollowed", JSON.stringify(unfollowedList));
      localStorage.setItem("instaFans", JSON.stringify(fansList));
      localStorage.setItem("instaCloseFriends", JSON.stringify(closeFriendsList));
      localStorage.setItem("instaPendingRequests", JSON.stringify(pendingRequestsList));
      localStorage.setItem("instaHandledPendingRequests", JSON.stringify(handledPendingRequests));
      localStorage.setItem("instaRecentlyUnfollowed", JSON.stringify(recentlyUnfollowedList));
      setStorageError(null); // Clear any previous errors
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
      setStorageError("Unable to save data. Storage may be full.");
    }
  }, [queueList, unfollowedList, fansList, closeFriendsList, pendingRequestsList, handledPendingRequests, recentlyUnfollowedList, isLoaded]);

  const processFolderFiles = async (fileList) => {
    const asArray = fileList ? Array.from(fileList) : [];

    const getFileByName = (targetName) => {
      const target = (targetName || "").toLowerCase();
      return asArray.find((f) => (f?.name || "").toLowerCase() === target) || null;
    };

    const followersFile = getFileByName("followers_1.json");
    const followingFile = getFileByName("following.json");

    if (!followersFile || !followingFile) {
      throw new Error(
        'Invalid folder. Please upload your Instagram folder named "followers_and_following" that contains `followers_1.json` and `following.json`.'
      );
    }

    // Don't reset insight lists - keep them persisted
    // Only update with new data from the upload

    try {
      // Read required + optional file contents on main thread (I/O),
      // then parse/compute on worker thread (CPU).
      const optionalNames = [
        "close_friends.json",
        "pending_follow_requests.json",
        "recent_follow_requests.json",
        "recently_unfollowed_profiles.json",
        "removed_suggestions.json"
      ];

      const filesToRead = [
        followersFile,
        followingFile,
        ...optionalNames.map(getFileByName).filter(Boolean)
      ];

      const fileTextPairs = await Promise.all(
        filesToRead.map(async (f) => [f.name.toLowerCase(), await f.text()])
      );

      const filesPayload = Object.fromEntries(fileTextPairs);

      const worker = new Worker(new URL('./workers/igParser.worker.js', import.meta.url));
      const workerResult = await new Promise((resolve, reject) => {
        worker.onmessage = (e) => resolve(e.data);
        worker.onerror = (e) => reject(e);
        worker.postMessage({
          files: filesPayload,
          unfollowedUsernames: unfollowedList.map((u) => u.username)
        });
      });
      worker.terminate();

      if (!workerResult?.ok) {
        throw new Error(workerResult?.error || "Failed to process folder.");
      }

      const { notFollowingBack, fans, closeFriends, pendingRequests, recentlyUnfollowed } =
        workerResult.result || {};

      setQueueList((notFollowingBack || []).map(formatUser));
      setFansList((fans || []).map(formatUser));
      setCloseFriendsList((closeFriends || []).map(formatUser));
      setPendingRequestsList((pendingRequests || []).map(formatUser));
      setRecentlyUnfollowedList((recentlyUnfollowed || []).map(formatUser));

      setShowResults(true);
      setActiveTab('not_following_back');
    } catch (error) {
      throw new Error(error?.message || "Error parsing folder files. Ensure they are the correct JSON format.");
    }
  };

  const markAsUnfollowed = (username) => {
    const userIndex = queueList.findIndex(u => u.username === username);
    if (userIndex > -1) {
      const user = queueList[userIndex];
      setQueueList(prev => prev.filter((_, index) => index !== userIndex));
      setUnfollowedList(prev => [user, ...prev]);
    }
  };

  const restoreToQueue = (username) => {
    const userIndex = unfollowedList.findIndex(u => u.username === username);
    if (userIndex > -1) {
      const user = unfollowedList[userIndex];
      setUnfollowedList(prev => prev.filter((_, index) => index !== userIndex));
      setQueueList(prev => [user, ...prev]);
    }
  };

  // Similar functions for pending requests
  const markAsHandled = (username) => {
    const userIndex = pendingRequestsList.findIndex(u => u.username === username);
    if (userIndex > -1) {
      const user = pendingRequestsList[userIndex];
      setPendingRequestsList(prev => prev.filter((_, index) => index !== userIndex));
      setHandledPendingRequests(prev => [user, ...prev]);
    }
  };

  const restorePendingRequest = (username) => {
    const userIndex = handledPendingRequests.findIndex(u => u.username === username);
    if (userIndex > -1) {
      const user = handledPendingRequests[userIndex];
      setHandledPendingRequests(prev => prev.filter((_, index) => index !== userIndex));
      setPendingRequestsList(prev => [user, ...prev]);
    }
  };

  const resetData = () => {
    if (!window.confirm("Clear all data and start over?")) return;

    try {
      if (typeof Storage !== "undefined") {
        localStorage.removeItem("instaQueue");
        localStorage.removeItem("instaUnfollowed");
        localStorage.removeItem("instaFans");
        localStorage.removeItem("instaCloseFriends");
        localStorage.removeItem("instaPendingRequests");
        localStorage.removeItem("instaHandledPendingRequests");
        localStorage.removeItem("instaRecentlyUnfollowed");
      }
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
    }

    setQueueList([]);
    setUnfollowedList([]);
    setShowResults(false);

    setActiveTab('not_following_back');
    setFansList([]);
    setCloseFriendsList([]);
    setPendingRequestsList([]);
    setHandledPendingRequests([]);
    setRecentlyUnfollowedList([]);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col overflow-hidden">
      <Navbar 
        onReset={resetData} 
        showReset={showResults}
        onTokenClick={() => setShowTokenModal(true)}
        hasToken={!!accessToken}
      />

      <AccessTokenModal 
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onSubmit={handleTokenSubmit}
      />

      <div className="flex-1 min-h-0 pt-[65px] flex flex-col overflow-hidden">
        {storageError && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex-shrink-0">
            <div className="max-w-screen-2xl mx-auto">
              <p className="text-amber-800 text-sm">
                ⚠️ {storageError}
              </p>
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col items-center p-3 md:p-6 lg:p-8 min-h-0 overflow-y-auto custom-scrollbar">
          {!showResults ? (
            <UploadView onProcessFolder={processFolderFiles} />
          ) : (
            <ResultsView
              queueList={queueList}
              unfollowedList={unfollowedList}
              onMarkUnfollowed={markAsUnfollowed}
              onRestoreToQueue={restoreToQueue}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              fansList={fansList}
              closeFriendsList={closeFriendsList}
              pendingRequestsList={pendingRequestsList}
              handledPendingRequests={handledPendingRequests}
              onMarkAsHandled={markAsHandled}
              onRestorePendingRequest={restorePendingRequest}
              recentlyUnfollowedList={recentlyUnfollowedList}
              apiService={apiService}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;