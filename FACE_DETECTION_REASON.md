# Face Detection + Song Matching Issue (Reason Log)

Date: 2026-03-05

## 1) Console message from `vision_wasm_internal.js`

The logs below are **warnings/info from MediaPipe/TensorFlow Lite**, not a crash:

- `INFO: Created TensorFlow Lite XNNPACK delegate for CPU.`
- `Feedback manager requires a model with a single signature inference...`

These lines usually appear with the current face-landmarker model and do not block detection.

## 2) Actual issue causing "No matching song found for this mood"

Backend route order in `Backend/src/app.js` had a wildcard route before API routes.

Because of that, requests like:

- `GET /api/song/getsong?mood=happy`

can be intercepted by the wildcard fallback and return `public/index.html` (HTML) instead of JSON.  
Frontend then receives non-song data and ends up with an empty song list, showing:

- `No matching song found for this mood.`

## 3) Additional backend data issue found

`Backend/src/model/song.model.js` used:

- `default: 'nutral'`

This is a typo and not aligned with enum values. It should be `Neutral`.

## 4) Fix applied

- Move API routes before fallback route.
- Restrict fallback to GET and place it at the end.
- Fix mood default typo in song schema.
- Add frontend response-shape validation in song fetch hook for clearer errors.
