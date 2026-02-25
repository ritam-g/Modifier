import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import "../styles/face.scss";

export default function FaceDetection() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const emotionBufferRef = useRef([]);

  const [emotion, setEmotion] = useState("Neutral 😐");
  const [faceDetected, setFaceDetected] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    initializeCamera();
    initializeModel();

    return () => {
      if (animationRef.current)
        cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // 🎥 Initialize Camera
  const initializeCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoRef.current.srcObject = stream;
  };

  // 🧠 Load MediaPipe Model (WITH blendshapes support)
  const initializeModel = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    landmarkerRef.current =
      await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: true,
      });
  };

  // 🧠 Advanced Emotion Logic
  const getEmotionFromBlendshapes = (blendshapes) => {
    if (!blendshapes || blendshapes.length === 0)
      return "Neutral 😐";

    const categories = blendshapes[0].categories;

    const getScore = (name) =>
      categories.find((c) => c.categoryName === name)?.score || 0;

    // Core muscle groups
    const smile =
      (getScore("mouthSmileLeft") +
        getScore("mouthSmileRight")) / 2;

    const frown =
      (getScore("mouthFrownLeft") +
        getScore("mouthFrownRight")) / 2;

    const browDown =
      (getScore("browDownLeft") +
        getScore("browDownRight")) / 2;

    const browInnerUp = getScore("browInnerUp");

    const browOuterUp =
      (getScore("browOuterUpLeft") +
        getScore("browOuterUpRight")) / 2;

    const jawOpen = getScore("jawOpen");

    const mouthPress =
      (getScore("mouthPressLeft") +
        getScore("mouthPressRight")) / 2;

    // Weighted scoring
    const happyScore = smile * 0.7;
    const sadScore = frown * 0.6 + browInnerUp * 0.4;
    const angryScore = browDown * 0.6 + mouthPress * 0.4;
    const surpriseScore = browOuterUp * 0.5 + jawOpen * 0.5;

    const emotionScores = {
      "Happy 😊": happyScore,
      "Sad 😢": sadScore,
      "Angry 😠": angryScore,
      "Surprised 😮": surpriseScore,
    };

    const detectedEmotion = Object.entries(emotionScores)
      .sort((a, b) => b[1] - a[1])[0];

    if (detectedEmotion[1] < 0.4)
      return "Neutral 😐";

    return detectedEmotion[0];
  };

  // 🔄 Real-time Detection Loop
  const detectFrame = () => {
    const video = videoRef.current;

    if (!landmarkerRef.current || !video) return;

    const results =
      landmarkerRef.current.detectForVideo(
        video,
        Date.now()
      );

    if (results.faceLandmarks.length > 0) {
      setFaceDetected(true);

      const emotionDetected =
        getEmotionFromBlendshapes(
          results.faceBlendshapes
        );

      // 🧠 Emotion smoothing (10-frame buffer)
      emotionBufferRef.current.push(emotionDetected);

      if (emotionBufferRef.current.length > 10)
        emotionBufferRef.current.shift();

      const emotionCount = {};

      emotionBufferRef.current.forEach((emo) => {
        emotionCount[emo] =
          (emotionCount[emo] || 0) + 1;
      });

      const stableEmotion = Object.entries(
        emotionCount
      ).sort((a, b) => b[1] - a[1])[0][0];

      setEmotion(stableEmotion);
    } else {
      setFaceDetected(false);
      setEmotion("No Face ❌");
    }

    animationRef.current =
      requestAnimationFrame(detectFrame);
  };

  // ▶ Start Detection
  const startDetection = () => {
    setRunning(true);
    detectFrame();
  };

  return (
    <div className="face-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          playsInline
        />
      </div>

      <div className="info-panel">
        <h2>Face Emotion Detector</h2>
        <p>
          Face Status:{" "}
          {faceDetected ? "Detected ✅" : "Not Found ❌"}
        </p>
        <p>Expression: {emotion}</p>

        { (
          <button onClick={startDetection}>
            Start Detection
          </button>
        )}
      </div>
    </div>
  );
}