import "../styles/face.scss";
import { useFaceDetection } from "../hooks/useFaceDetection";

export default function FaceDetection() {
  const { stopDetection, videoRef, faceDetected, emotion, running, startDetection } =
    useFaceDetection();

  return (
    <div className="face-container">
      <div className="video-wrapper">
        <video ref={videoRef} autoPlay playsInline />
      </div>

      <div className="info-panel">
        <h2>Face Emotion Detector</h2>
        <p>
          Face Status: {faceDetected ? "Detected ✅" : "Not Found ❌"}
        </p>
        <p>Expression: {emotion}</p>

        {!running ? (
          <button onClick={startDetection}>Start Detection</button>
        ) : (
          <button onClick={stopDetection}>Stop Detection</button>
        )}
      </div>
    </div>
  );
}