import { useEffect, useRef } from "react";
import useMediaRecorder from "./useMediaRecorder";
import "./App.css"; // Assuming you have an external CSS file

const VideoRecorder = () => {
  const {
    mediaBlobUrl,
    isRecording,
    isPaused,
    startRecording,
    stopRecording,
    mediaStream,
  } = useMediaRecorder();

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <div className="video-recorder-container">
      <h2 className="video-recorder-title">Video Recorder</h2>
      <video ref={videoRef} autoPlay muted className="video-player" />
      <div className="controls">
        <p className="status">
          Status:{" "}
          {isRecording ? (isPaused ? "Paused" : "Recording") : "Stopped"}
        </p>
        <div className="buttons">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="control-button"
          >
            Start Recording
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="control-button"
          >
            Stop Recording
          </button>
        </div>
      </div>
      {mediaBlobUrl && (
        <div className="recorded-video">
          <video src={mediaBlobUrl} controls className="video-player" />
          <a
            href={mediaBlobUrl}
            download="recorded-video.mp4"
            className="download-link"
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
