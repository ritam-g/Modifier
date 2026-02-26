import { useEffect, useRef, useState } from "react";
import {
    FaceLandmarker,
    FilesetResolver,
} from "@mediapipe/tasks-vision";
import { getEmotionFromBlendshapes } from "../utils/emotion";

export function useFaceDetection() {
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
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
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
    }

    function detectFrame() {
        const video = videoRef.current;
        if (!landmarkerRef.current || !video) return;

        const results = landmarkerRef.current.detectForVideo(video, Date.now());

        if (results.faceLandmarks.length > 0) {
            setFaceDetected(true);
            const emotionDetected = getEmotionFromBlendshapes(results.faceBlendshapes);

            // smoothing buffer
            emotionBufferRef.current.push(emotionDetected);
            if (emotionBufferRef.current.length > 10) emotionBufferRef.current.shift();

            const emotionCount = {};
            emotionBufferRef.current.forEach((emo) => {
                emotionCount[emo] = (emotionCount[emo] || 0) + 1;
            });

            const stableEmotion = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0][0];
            setEmotion(stableEmotion);
        } else {
            setFaceDetected(false);
            setEmotion("No Face ❌");
        }

        animationRef.current = requestAnimationFrame(detectFrame);
    }

    function startDetection() {
        if (!running) {
            setRunning(true);
            detectFrame();
        }
    }

    function stopDetection() {
        setRunning(false);
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        // reset values
        setFaceDetected(false);
        setEmotion("Neutral 😐");
        emotionBufferRef.current = [];

        
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
