// utility to translate MediaPipe blendshapes into human-readable emotion labels
export function getEmotionFromBlendshapes(blendshapes) {
    if (!blendshapes || blendshapes.length === 0) return "Neutral 😐";

    const categories = blendshapes[0].categories;

    const getScore = (name) => categories.find((c) => c.categoryName === name)?.score || 0;

    // Core muscle groups
    const smile = (getScore("mouthSmileLeft") + getScore("mouthSmileRight")) / 2;
    const frown = (getScore("mouthFrownLeft") + getScore("mouthFrownRight")) / 2;
    const browDown = (getScore("browDownLeft") + getScore("browDownRight")) / 2;
    const browInnerUp = getScore("browInnerUp");
    const browOuterUp = (getScore("browOuterUpLeft") + getScore("browOuterUpRight")) / 2;
    const jawOpen = getScore("jawOpen");
    const mouthPress = (getScore("mouthPressLeft") + getScore("mouthPressRight")) / 2;

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

    const detectedEmotion = Object.entries(emotionScores).sort((a, b) => b[1] - a[1])[0];

    if (detectedEmotion[1] < 0.4) return "Neutral 😐";
    return detectedEmotion[0];
}
