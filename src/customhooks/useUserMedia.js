import { useState, useCallback } from "react";

const useUserMedia = (initialConstraints) => {
  const [mediaStream, setMediaStream] = useState(null);
  const [error, setError] = useState(null);

  const startMedia = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const error = new Error("Media Devices API not supported");
      setError(error);
      return null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        initialConstraints
      );
      setMediaStream(stream);
      return stream;
    } catch (err) {
      setError(err);
      return null;
    }
  }, [initialConstraints]);

  const stopMedia = useCallback(() => {
    mediaStream?.getTracks().forEach((track) => {
      track.stop();
    });
    setMediaStream(null);
  }, [mediaStream]);

  return { mediaStream, error, startMedia, stopMedia };
};

export default useUserMedia;
