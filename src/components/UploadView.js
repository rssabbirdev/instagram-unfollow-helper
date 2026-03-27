import React, { useMemo, useState } from 'react';

function UploadView({ onProcessFolder }) {
  const [folderFiles, setFolderFiles] = useState(null);
  const [selectedFolderName, setSelectedFolderName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedCount = useMemo(() => {
    return folderFiles ? folderFiles.length : 0;
  }, [folderFiles]);

  const handleFolderChange = (event) => {
    const files = event.target.files;
    setFolderFiles(files);
    setErrorMsg('');

    if (!files || files.length === 0) {
      setSelectedFolderName('');
      return;
    }

    // webkitRelativePath usually looks like: followers_and_following/followers_1.json
    const firstPath = files[0]?.webkitRelativePath || files[0]?.name || '';
    const folderName = firstPath.split('/')[0] || '';
    setSelectedFolderName(folderName);
  };

  const handleProcessFolder = async () => {
    if (!folderFiles || folderFiles.length === 0) {
      setErrorMsg("Please upload your Instagram `followers_and_following` folder.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      await onProcessFolder(folderFiles);
    } catch (error) {
      setErrorMsg(error.message || "Failed to process folder. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden mt-4 md:mt-8 transition-all flex-shrink-0 border border-slate-200">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 md:p-8 text-white text-center">
        <div className="text-3xl md:text-4xl font-bold mb-2">Instagram Analyzer</div>
        <div className="text-purple-100 text-lg md:text-xl font-medium">by Sabbir Hossain</div>
        <p className="text-purple-100 text-sm md:text-base mt-3">Upload your Instagram data folder to uncover insights about your connections.</p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col">
          <label className="font-semibold text-slate-700 mb-3 text-lg">Select Folder</label>

          <label
            className="flex flex-col items-center justify-center w-full min-h-[150px] border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all duration-300 px-4 text-center shadow-inner"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-12 h-12 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
              <p className="mb-2 text-sm text-slate-600">
                <span className="font-semibold text-indigo-600">Click to upload folder</span>
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Required folder: <span className="font-bold text-indigo-600">followers_and_following</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Contains: <span className="font-semibold">followers_1.json</span> & <span className="font-semibold">following.json</span>
              </p>
              {selectedCount > 0 && (
                <p className="text-xs text-green-600 font-medium mt-2">
                  ✓ Selected: <span className="font-bold">{selectedCount}</span> files from <span className="font-bold">{selectedFolderName}</span>
                </p>
              )}
            </div>

            <input
              type="file"
              accept=".json"
              className="hidden"
              webkitdirectory="true"
              directory="true"
              multiple
              onChange={handleFolderChange}
            />
          </label>
        </div>

        <button
          onClick={handleProcessFolder}
          disabled={isProcessing || !folderFiles}
          className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Analyze Network'
          )}
        </button>

        {errorMsg && (
          <div className="text-center text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="text-sm text-slate-600 space-y-2 bg-slate-50 p-4 rounded-lg">
          <div className="font-semibold text-slate-700">What you'll discover:</div>
          <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
            <li>Fans who follow you back</li>
            <li>Close friends and mutual connections</li>
            <li>Pending follow requests</li>
            <li>Recently unfollowed accounts</li>
            <li>Accounts not following you back (with undo option)</li>
          </ul>
        </div>

        <div className="text-center text-xs text-slate-400 border-t pt-4">
          Developed by <span className="font-semibold text-slate-600">Sabbir Hossain</span>
        </div>
      </div>
    </div>
  );
}

export default UploadView;