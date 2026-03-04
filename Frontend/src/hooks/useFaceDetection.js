import { useEffect, useRef, useState } from "react";
import {
    FaceLandmarker,
    FilesetResolver,
} from "@mediapipe/tasks-vision";
import { getEmotionFromBlendshapes } from "../utils/emotion";

export function useFaceDetection() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);

    const [emotion, setEmotion] = useState("Neutral");
    const [faceDetected, setFaceDetected] = useState(false);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        initializeCamera();
        initializeModel();
    }, []);

    async function initializeCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            console.error("camera init failed", err);
        }
    }

    async function initializeModel() {
        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
            );

            landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                },
                runningMode: "VIDEO",
                numFaces: 1,
                outputFaceBlendshapes: true,
            });
        } catch (err) {
            console.error("model init failed", err);
        }
    }

    function detectOnce() {
        const video = videoRef.current;
        if (!landmarkerRef.current || !video || video.readyState < 2) {
            setFaceDetected(false);
            setEmotion("Camera or model not ready");
            return;
        }

        const results = landmarkerRef.current.detectForVideo(video, Date.now());

        if (results.faceLandmarks.length > 0) {
            setFaceDetected(true);
            const emotionDetected = getEmotionFromBlendshapes(results.faceBlendshapes);
            setEmotion(emotionDetected);
        } else {
            setFaceDetected(false);
            setEmotion("No Face");
        }
    }

    function startDetection() {
        if (running) return;

        setRunning(true);
        try {
            detectOnce();
        } finally {
            setRunning(false);
        }
    }

    function stopDetection() {
        setRunning(false);
        setFaceDetected(false);
        setEmotion("Neutral");
    }

    return {
        videoRef,
        faceDetected,
        emotion,
        running,
        startDetection,
        stopDetection,
    };
}
