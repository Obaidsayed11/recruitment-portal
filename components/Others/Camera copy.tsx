"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

type FacingMode = "user" | "environment";

const CustomCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode,
        width: { ideal: 720 },
        height: { ideal: 1280 },
        ...(flashOn && { torch: true }),
      },
    };

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode]);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setPreviewImage(imageData);
  };

  const confirmImage = () => {
    if (previewImage) {
      const updated = [...capturedImages, previewImage];
      setCapturedImages(updated);
      setPreviewImage(null);
      // Optional: localStorage.setItem("images", JSON.stringify(updated));
    }
  };

  const retakeImage = () => setPreviewImage(null);

  const toggleCamera = () =>
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));

  const toggleFlashlight = async () => {
    if (stream) {
      const [videoTrack] = stream.getVideoTracks();
      const capabilities = videoTrack.getCapabilities() as any;

      if (capabilities.torch) {
        await videoTrack.applyConstraints({ advanced: [{ torch: !flashOn }] });
        setFlashOn(!flashOn);
      } else {
        alert("Flashlight not supported on this device.");
      }
    }
  };

  return (
    <div className="grid gap-4 items-center justify-center p-4 bg-secondary min-h-screen">
      {!previewImage ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-lg border max-w-md aspect-[3/4] object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex justify-center flex-wrap gap-4">
            <button
              onClick={captureImage}
              className="bg-primary text-white py-2 px-4 rounded-md"
            >
              Capture
            </button>
            <button
              onClick={toggleCamera}
              className="bg-white border text-black py-2 px-4 rounded-md"
            >
              Flip Camera
            </button>
            <button
              onClick={toggleFlashlight}
              className="bg-white border text-black py-2 px-4 rounded-md"
            >
              {flashOn ? "Flash Off" : "Flash On"}
            </button>
          </div>
        </>
      ) : (
        <div className="grid place-items-center gap-4">
          <img
            src={previewImage}
            alt="Preview"
            className="rounded-lg max-w-md w-full border aspect-[3/4] object-cover"
          />
          <div className="flex gap-4">
            <button
              onClick={retakeImage}
              className="bg-white text-black py-2 px-4 border rounded-md"
            >
              Retake
            </button>
            <button
              onClick={confirmImage}
              className="bg-primary text-white py-2 px-4 rounded-md"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Show all captured images */}
      {capturedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-subtext mb-2 font-medium text-center">
            Captured Images ({capturedImages.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {capturedImages.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Captured ${index + 1}`}
                className="rounded-lg border object-cover aspect-[3/4] w-full"
                width={100}
                height={150}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCamera;
