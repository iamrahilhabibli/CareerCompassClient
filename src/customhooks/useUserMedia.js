import { useState, useEffect, useMemo } from "react";

const useUserMedia = (initialConstraints) => {
  const [mediaStream, setMediaStream] = useState(null);
  const [error, setError] = useState(null);

  const constraints = useMemo(() => {
    return initialConstraints;
  }, [initialConstraints]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setMediaStream(stream);
      } catch (err) {
        setError(`Could not get user media: ${err.toString()}`);
      }
    };

    getMedia();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [constraints]);

  return { mediaStream, error };
};

export default useUserMedia;
