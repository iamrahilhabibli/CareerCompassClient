import { useState, useCallback } from "react";

const useUserMedia = (initialConstraints) => {
  const [mediaStream, setMediaStream] = useState(null);
  const [error, setError] = useState(null);

  const startMedia = useCallback(async () => {
    console.log("startMedia called");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("Media Devices API not supported.");
      const error = new Error("Media Devices API not supported");
      setError(error);
      return null;
    }

    try {
      console.log("About to call getUserMedia");
      const stream = await navigator.mediaDevices.getUserMedia(
        initialConstraints
      );
      console.log("getUserMedia call finished");

      console.log("Stream:", stream);
      console.log("Audio tracks:", stream.getAudioTracks());
      console.log("Video tracks:", stream.getVideoTracks());
      setMediaStream(stream);
      return stream;
    } catch (err) {
      console.log(
        "An error occurred in getUserMedia:",
        err,
        err.name,
        err.message
      );
      setError(err);
      return null;
    }
  }, [initialConstraints]);

  const stopMedia = useCallback(() => {
    console.log("Stopping media stream...");
    mediaStream?.getTracks().forEach((track) => {
      console.log("Before stopping", track.readyState);
      track.stop();
      console.log("After stopping", track.readyState);
    });
    setMediaStream(null);
  }, [mediaStream]);

  return { mediaStream, error, startMedia, stopMedia };
};

export default useUserMedia;
