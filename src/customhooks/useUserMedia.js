import { useState, useEffect } from "react";

const useUserMedia = (initialConstraints) => {
  const [mediaStream, setMediaStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMedia = async () => {
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

    getMedia();

    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [initialConstraints]);

  return { mediaStream, error };
};

export default useUserMedia;
