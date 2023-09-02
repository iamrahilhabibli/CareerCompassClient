import { useState, useEffect } from "react";

const useUserMedia = (initialConstraints) => {
  console.log("useUserMedia re rendering");
  const [mediaStream, setMediaStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMedia = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Media Devices API not supported");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          initialConstraints
        );
        setMediaStream(stream);

        stream.getTracks().forEach((track) => {});
      } catch (err) {
        setError(`Could not get user media: ${err.toString()}`);
      }
    };

    getMedia();

    return () => {
      mediaStream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [initialConstraints]);

  return { mediaStream, error };
};

export default useUserMedia;
