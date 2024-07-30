import { useState, useRef, useEffect } from "react";

const useMediaRecorder = () => {
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorderRef = useRef(null);
  const mediaChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.pause();
    } else if (mediaRecorderRef.current && !isPaused && isRecording) {
      mediaRecorderRef.current.resume();
    }
  }, [isPaused, isRecording]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    mediaStreamRef.current = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        mediaChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(mediaChunksRef.current, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setMediaBlobUrl(url);
      mediaChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
    setIsPaused(false);
  };

  const pauseRecording = () => {
    setIsPaused(true);
  };

  const resumeRecording = () => {
    setIsPaused(false);
  };

  return {
    mediaBlobUrl,
    isRecording,
    isPaused,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    mediaStream: mediaStreamRef.current,
  };
};

export default useMediaRecorder;
