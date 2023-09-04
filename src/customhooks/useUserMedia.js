import { useState, useEffect, useCallback } from "react";

const useUserMedia = (initialConstraints) => {
  const [mediaStream, setMediaStream] = useState(null);
  const [error, setError] = useState(null);

  const startMedia = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      console.log("startMedia is called");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const error = new Error("Media Devices API not supported");
        setError(error);
        reject(error);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          initialConstraints
        );
        setMediaStream(stream);
        resolve(stream);
      } catch (err) {
        setError(err);
        reject(err);
      }
    });
  }, [initialConstraints]);

  useEffect(() => {
    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  return { mediaStream, error, startMedia };
};

export default useUserMedia;
