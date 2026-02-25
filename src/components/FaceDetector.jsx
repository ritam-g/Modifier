import { useEffect, useRef, useState } from "react";
import {
    FaceLandmarker,
    FilesetResolver,
} from "@mediapipe/tasks-vision";
import "../styles/face.scss";

export default function FaceDetection() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const landmarkerRef = useRef(null);
    const animationRef = useRef(null);

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

    // 🎥 Start Camera
    const initializeCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
        });
        videoRef.current.srcObject = stream;
    };

    // 🧠 Load MediaPipe Model
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

    // 😊 Emotion Logic
    const getEmotionFromBlendshapes = (blendshapes) => {
        if (!blendshapes || blendshapes.length === 0)
            return "Neutral 😐";

        const categories = blendshapes[0].categories;

        const getScore = (name) =>
            categories.find((c) => c.categoryName === name)?.score || 0;

        const smile =
            (getScore("mouthSmileLeft") +
                getScore("mouthSmileRight")) / 2;

        const frown =
            (getScore("mouthFrownLeft") +
                getScore("mouthFrownRight")) / 2;

        const browDown =
            (getScore("browDownLeft") +
                getScore("browDownRight")) / 2;


        if (smile > 0.6) return "Happy 😊";
        if (frown > 0.5) return "Sad 😢";
        if (browDown > 0.6) return "Angry 😠";

        return "Neutral 😐";
    };

    // 🔄 Detection Loop
    const detectFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!landmarkerRef.current) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const results =
            landmarkerRef.current.detectForVideo(
                video,
                Date.now()
            );

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.faceLandmarks.length > 0) {
            setFaceDetected(true);

            const emotionDetected =
                getEmotionFromBlendshapes(
                    results.faceBlendshapes
                );

            setEmotion(emotionDetected);

            // Draw landmarks
            results.faceLandmarks.forEach((landmarks) => {
                landmarks.forEach((point) => {
                    ctx.beginPath();
                    ctx.arc(
                        point.x * canvas.width,
                        point.y * canvas.height,
                        2,
                        0,
                        2 * Math.PI
                    );
                    ctx.fillStyle = "#00ff88";
                    ctx.fill();
                });
            });
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
                <canvas ref={canvasRef} />
            </div>

            <div className="info-panel">
                <h2>Face Emotion Detector</h2>
                <p>
                    Face Status:{" "}
                    {faceDetected ? "Detected ✅" : "Not Found ❌"}
                </p>
                <p>Expression: {emotion}</p>

                {!running && (
                    <button onClick={startDetection}>
                        Start Detection
                    </button>
                )}
            </div>
        </div>
    );
}