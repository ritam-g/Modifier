import "../styles/face.scss";
import { useFaceDetection } from "../hooks/useFaceDetection";

export default function FaceDetection() {
  const { videoRef, faceDetected, emotion, running, startDetection } = useFaceDetection();

  return (
    <main className="face-container">
      <div className="video-wrapper">
        <video ref={videoRef} autoPlay playsInline />
      </div>

      <div className="info-panel">
        <h2>Face Emotion Detector</h2>
        <p>Face Status: {faceDetected ? "Detected" : "Not Found"}</p>
        <p>Expression: {emotion}</p>

        <button onClick={startDetection} disabled={running}>
          {running ? "Detecting..." : "Detect Face"}
        </button>
      </div>
    </main>
  );
}
