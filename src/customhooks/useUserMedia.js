import { useState, useEffect, useCallback } from "react";

const useUserMedia = (initialConstraints) => {
  const [mediaStream, setMediaStream] = useState(null);
  const [error, setError] = useState(null);

  const startMedia = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(new Error("Media Devices API not supported"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        initialConstraints
      );
      setMediaStream(stream);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  return { mediaStream, error, startMedia };
};

export default useUserMedia;
