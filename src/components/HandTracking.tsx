import { useHandsSetup } from "../hooks/use-hands-setup";

export const HandTracking = () => {
  const { canvasRef, videoRef, signatureLimitsRef, clearCanvas } =
    useHandsSetup();

  return (
    <div className="relative w-full h-full">
      <div className="relative w-fit">
        <video
          ref={videoRef}
          className="opacity-30 absolute "
          style={{
            transform: "rotateY(180deg)",
          }}
        ></video>
        <canvas
          ref={canvasRef}
          width="1280px"
          height="720px"
          className="border border-red-500"
        ></canvas>
        <div
          ref={signatureLimitsRef}
          className="absolute top-2/4 left-2/4 w-2/5 h-72 border-[3px] border-blue-400 border-dashed"
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
