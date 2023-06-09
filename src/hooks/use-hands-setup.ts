import { Hands, Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { useEffect, useRef } from "react";
import { distanceBetweenTwo3dPoints } from "../utils/3d-distance";
import { PointsAvg } from "../utils/points-avg";
import { useCanvas } from "../hooks/use-canvas";
import { useStats } from "../hooks/use-stats";
/**
 * THUMB_TIP index for landmarks array
 */
const THUMB_TIP = 4;
/**
 * INDEX_FINGER_TIP index for landmarks array
 */
const INDEX_FINGER_TIP = 8;
const FINGERS_DISTANCE_THRESHOLD = 0.09;

export const useHandsSetup = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isReady = useRef(false);
  const signatureLimitsRef = useRef<HTMLDivElement>(null);
  const { canvasRef, setupDraw, clearCanvas, closePath } = useCanvas();
  const { stats: fpsStats, setupStats } = useStats("fps");

  const setupHands = (
    onResults: (results: Results) => void,
    videoElement: HTMLVideoElement
  ) => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.55,
      minTrackingConfidence: 0.55,
      selfieMode: true,
    });
    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
      facingMode: "user",
    });
    return camera.start();
  };

  useEffect(() => {
    if (isReady.current || typeof window === "undefined") return;
    const videoElement = videoRef.current as HTMLVideoElement;
    const signatureLimit = signatureLimitsRef.current as HTMLDivElement;

    setupStats(document.body);

    document.body.addEventListener("keydown", (e) => {
      if (e.key == "c") {
        clearCanvas();
      }
    });
    const setupTracking = async () => {
      let pointsAvg: PointsAvg | null = null;
      const onResults = (results: Results) => {
        fpsStats?.begin();
        if (!pointsAvg) {
          const isMobile = window.innerWidth < 1280
          const numPointsToAverage= isMobile ? 2 :3
          pointsAvg = new PointsAvg(numPointsToAverage, setupDraw(signatureLimit, videoElement));
        }
        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            const thumbResult = landmarks[THUMB_TIP];
            const indexFingerResult = landmarks[INDEX_FINGER_TIP];
            const distance = distanceBetweenTwo3dPoints(
              thumbResult,
              indexFingerResult
            );
            if (distance > FINGERS_DISTANCE_THRESHOLD) {
              closePath();
              return;
            }
            pointsAvg?.onResult(indexFingerResult);
          }
        }
        fpsStats?.end();
      };
      await setupHands(onResults, videoElement);
      const stream = videoElement.srcObject as MediaStream;
      const height = stream.getVideoTracks()[0].getSettings().height;
      const width = stream.getVideoTracks()[0].getSettings().width;
      canvasRef.current?.setAttribute("width", `${width}px`);
      canvasRef.current?.setAttribute("height", `${height}px`);
    };
    setupTracking();
    isReady.current = true;
  }, []);

  return { canvasRef, videoRef, signatureLimitsRef, clearCanvas };
};
