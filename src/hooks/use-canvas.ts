import { useRef } from "react";
import type { Point } from "../typings";

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const clearCanvas = () => {
    const canvasElement = canvasRef.current as HTMLCanvasElement;
    const canvasCtx = canvasElement.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
  };

  const closePath = () => {
    const canvasElement = canvasRef.current as HTMLCanvasElement;
    const canvasCtx = canvasElement.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    canvasCtx.stroke();
    canvasCtx.beginPath();
  };

  const setupDraw = (
    signatureElement: HTMLDivElement,
    videoElement: HTMLVideoElement
  ) => {
    const canvasElement = canvasRef.current as HTMLCanvasElement;
    const canvasCtx = canvasElement.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;
    const signatureBounding = signatureElement.getBoundingClientRect();
    const {leftLimit,topLimit,rightLimit,bottomLimit} = getLimits(videoElement,signatureBounding)

    const draw = ({ x, y, z }: Point) => {
      const drawX = Math.round(videoWidth * x);
      const drawY = Math.round(videoHeight * y);
      const outsideOfHorizontalLimits = drawX < leftLimit || drawX > rightLimit;
      const outsideOfVerticalLimits = drawY < topLimit || drawY > bottomLimit;

      if (outsideOfHorizontalLimits || outsideOfVerticalLimits) {
        canvasCtx.stroke();
        canvasCtx.beginPath();
        return;
      }
      if (drawX < 0 || drawY < 0) return;
      canvasCtx.lineWidth = 5;
      canvasCtx.lineCap = "round";

      canvasCtx.lineTo(drawX, drawY);
      canvasCtx.stroke();
    };
    return draw;
  };

  return { canvasRef, setupDraw, clearCanvas, closePath };
};

const getLimits = (
  videoElement: HTMLVideoElement,
  signatureBounding: DOMRect
) => {
  const isMobile = window.innerWidth < 1280;
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;
  if (isMobile) {
    const leftLimit = videoWidth * 0.125;
    const rightLimit = videoWidth * (0.875);
    const topLimit =
      (videoHeight - (videoHeight * signatureBounding.height) / videoWidth) / 2;
    const bottomLimit = videoHeight - topLimit;
    return {
      topLimit,
      leftLimit,
      bottomLimit,
      rightLimit,
    };
  }
  return {
    topLimit: signatureBounding.top,
    leftLimit: signatureBounding.left,
    bottomLimit: signatureBounding.bottom,
    rightLimit: signatureBounding.right,
  };
};
