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
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden mt-4 md:mt-8 transition-all flex-shrink-0">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8 text-white text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Analyze Your Network</h1>
        <p className="text-blue-100 text-sm md:text-base">Upload the extracted Instagram folder to generate insights.</p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col">
          <label className="font-semibold text-slate-700 mb-2">Folder Upload</label>

          <label
            className="flex flex-col items-center justify-center w-full min-h-[130px] border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition px-4 text-center"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-1 text-sm text-slate-500">
                <span className="font-semibold">Click to select folder</span>
              </p>
              <p className="text-xs text-indigo-600 font-medium mt-1">
                Expected folder: <span className="font-semibold">followers_and_following</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Must contain: <span className="font-semibold">followers_1.json</span> and <span className="font-semibold">following.json</span>
              </p>
              <p className="text-xs text-slate-500 mt-3">
                {selectedCount > 0 ? (
                  <>
                    Selected: <span className="font-semibold">{selectedCount}</span> files {selectedFolderName ? <>from <span className="font-semibold">{selectedFolderName}</span></> : null}
                  </>
                ) : (
                  ''
                )}
              </p>
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
          className="w-full px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Process Folder'}
        </button>

        {errorMsg && (
          <div className="text-center text-red-500 font-medium">{errorMsg}</div>
        )}

        <div className="text-sm text-slate-600 space-y-1">
          <div>What you get:</div>
          <div className="text-xs text-slate-500">
            Tabs for Fans, Close Friends, Pending Requests, Recently Unfollowed, and Not Following Back (with undo queue).
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadView;