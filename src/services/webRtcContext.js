import React, { createContext, useContext, useState } from "react";

const WebRTCContext = createContext();

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error("useWebRTC must be used within a WebRTCProvider");
  }
  return context;
};

export const WebRTCProvider = ({ children }) => {
  const [remoteDescriptionSet, setRemoteDescriptionSet] = useState(false);
  const [iceCandidateQueue, setIceCandidateQueue] = useState([]);

  return (
    <WebRTCContext.Provider
      value={{
        remoteDescriptionSet,
        setRemoteDescriptionSet,
        addIceCandidate,
        flushIceCandidateQueue,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};
