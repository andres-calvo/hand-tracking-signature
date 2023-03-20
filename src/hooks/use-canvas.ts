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

  const setupDraw = (signatureBounding: DOMRect) => {
    const canvasElement = canvasRef.current as HTMLCanvasElement;
    const canvasCtx = canvasElement.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    const canvasBounding = canvasElement.getBoundingClientRect();
    const canvasWidth = canvasBounding.width;
    const canvasHeight = canvasBounding.height;

    const draw = ({ x, y, z }: Point) => {
      // if (x < 0 || x > 1 || y < 0 || y > 1) {
      //   return;
      // }
      const drawX = Math.round(canvasWidth * (1 - x));
      const drawY = Math.round(canvasHeight * y);
      const outsideOfHorizontalLimits =
        drawX < signatureBounding.left || drawX > signatureBounding.right;

      const outsideOfVerticalLimits =
        drawY < signatureBounding.top || drawY > signatureBounding.bottom;

      if (outsideOfHorizontalLimits || outsideOfVerticalLimits) {
        canvasCtx.stroke();
        canvasCtx.beginPath();
        return;
      }
      canvasCtx.lineWidth = 5;
      canvasCtx.lineCap = "round";

      canvasCtx.lineTo(drawX, drawY);
      canvasCtx.stroke();
    };
    return draw;
  };

  return { canvasRef, setupDraw, clearCanvas,closePath };
};
