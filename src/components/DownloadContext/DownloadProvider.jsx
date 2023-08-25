import React, { useState, createContext } from "react";

export const DownloadContext = createContext();

export const DownloadProvider = ({ children }) => {
  const [triggerDownload, setTriggerDownload] = useState(false);

  return (
    <DownloadContext.Provider value={{ triggerDownload, setTriggerDownload }}>
      {children}
    </DownloadContext.Provider>
  );
};
