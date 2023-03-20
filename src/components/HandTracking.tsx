import { useHandsSetup } from "../hooks/use-hands-setup";

export const HandTracking = () => {
  const { canvasRef, videoRef, signatureLimitsRef, clearCanvas } =
    useHandsSetup();

  return (
    <div className="relative w-full h-full">
      <div className="relative w-fit h-fit">
        <video
          ref={videoRef}
          className="opacity-30  "
          style={{
            transform: "rotateY(180deg)",
          }}
        ></video>
        <canvas
          ref={canvasRef}
          className="border top-0 left-0 absolute border-red-500 w-full h-full"
        ></canvas>
        <div
          ref={signatureLimitsRef}
          className="absolute top-2/4 left-2/4 md:w-2/5 w-3/4 h-72 border-[3px] border-blue-400 border-dashed"
          style={{
            transform: "translate(-50%,-50%)",
          }}
        ></div>
      </div>
      <button className="bg-blue-500 p-5" onClick={clearCanvas}>
        Clear
      </button>
    </div>
  );
};
