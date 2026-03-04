import { useCallback } from "react";
import { useFaceDetection } from "../hooks/useFaceDetection";

export default function FaceDetection({ onDetect, busy = false }) {
  const { videoRef, faceDetected, emotion, running, startDetection } = useFaceDetection();

  const handleDetect = useCallback(async () => {
    const result = await startDetection();

    if (result && typeof onDetect === "function") {
      onDetect(result);
    }
  }, [onDetect, startDetection]);

  return (
    <section className="face-panel panel-enter">
      <div className="face-panel__video-wrap">
        <video ref={videoRef} autoPlay playsInline muted />
        <div className="face-panel__video-glow" />

        <div className="face-panel__content">
          <div className="face-panel__top-row">
            <h2>Face Layer</h2>
            <span className={`face-pill ${faceDetected ? "is-success" : "is-idle"}`}>
              {faceDetected ? "Face Locked" : "Awaiting Face"}
            </span>
          </div>

          <p className="face-panel__metric">
            Expression: <strong>{emotion}</strong>
          </p>

          <p className="face-panel__caption">
            Keep your face centered, then tap detect for a single scan.
          </p>
        </div>
      </div>

      <div className="face-panel__action">
        <button
          className="detect-button"
          onClick={handleDetect}
          disabled={running || busy}
        >
          {running || busy ? "Processing..." : "Detect Face"}
        </button>
      </div>
    </section>
  );
}
