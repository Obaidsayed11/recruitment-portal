"use client";
import React, { useEffect, useRef, useState } from "react";

type FacingMode = "user" | "environment";

interface CustomCameraProps {
  onCapture: (imageData: string, type: "selfie" | "odometer") => void;
  onClose: () => void;
  cameraType: "selfie" | "odometer";
}

const CustomCamera: React.FC<CustomCameraProps> = ({
  onCapture,
  onClose,
  cameraType,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>(
    cameraType === "selfie" ? "user" : "environment"
  );
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // State for loading and error handling for better UX
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startCamera = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    // Ensure any existing stream is stopped before starting a new one
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode,
        width: { ideal: 720 },
        height: { ideal: 1280 },
      },
    };

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setErrorMessage(
        "Camera access denied. Please check browser permissions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startCamera();
    // Cleanup function to stop the camera when the component unmounts
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode]); // Re-run only when the camera facing mode changes

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.paused)
      return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      setErrorMessage("Could not get canvas context.");
      return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageData: string;
    try {
      // Attempt to get a compressed WebP image
      imageData = canvas.toDataURL("image/webp", 0.7);
    } catch (e) {
      console.warn("WebP not supported, falling back to PNG.", e);
      // Fallback to PNG if WebP is not supported by the browser
      imageData = canvas.toDataURL("image/png");
    }

    setPreviewImage(imageData);
    // Stop the stream after capturing to show the preview
    stream?.getTracks().forEach((track) => track.stop());
  };

  const confirmImage = () => {
    if (previewImage) {
      onCapture(previewImage, cameraType);
      setPreviewImage(null);
      onClose(); // This now correctly calls the parent component's close function
    }
  };

  const retakeImage = () => {
    setPreviewImage(null);
    startCamera(); // Restart the camera for a retake
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const toggleFlashlight = async () => {
    if (!stream) {
      setErrorMessage("Camera not active.");
      return;
    }

    const [videoTrack] = stream.getVideoTracks();
    if (!videoTrack) {
      setErrorMessage("No video track found.");
      return;
    }

    // This is the proper way to check for flashlight support
    if (!("torch" in videoTrack.getCapabilities())) {
      setErrorMessage("Flashlight not supported on this device.");
      return;
    }

    try {
      // Apply the new flash state
      await videoTrack.applyConstraints({
        advanced: [{ torch: !flashOn }],
      });
      setFlashOn(!flashOn);
      setErrorMessage(null); // Clear any previous error
    } catch (error) {
      console.error("Flashlight error:", error);
      setErrorMessage("Could not toggle flashlight.");
    }
  };

  return (
    <div className="grid gap-4 items-center justify-center p-4 bg-black h-full w-full absolute top-0 left-0 z-50">
      {/* Display a single, clear error message at the top */}
      {errorMessage && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-3 rounded-md text-center z-10">
          {errorMessage}
        </div>
      )}

      {!previewImage ? (
        <>
          <div className="relative w-full max-w-md aspect-[3/4]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full rounded-lg object-cover"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                Starting Camera...
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex justify-center flex-wrap gap-4">
            <button
              type="button"
              onClick={captureImage}
              disabled={isLoading}
              className="bg-blue-600 text-white py-3 px-6 rounded-full text-lg disabled:bg-gray-500"
            >
              Capture
            </button>
            <button
              type="button"
              onClick={toggleCamera}
              disabled={isLoading}
              className="bg-gray-700 text-white p-3 rounded-full disabled:bg-gray-500"
            >
              Flip
            </button>
            <button
              type="button"
              onClick={toggleFlashlight}
              disabled={isLoading}
              className={`p-3 rounded-full ${
                flashOn ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"
              } disabled:bg-gray-500`}
            >
              Flash
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-600 text-white p-3 rounded-full"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="grid place-items-center gap-4">
          <img
            src={previewImage}
            alt="Preview"
            className="rounded-lg max-w-md w-full border-2 border-gray-500 aspect-[3/4] object-cover"
          />
          <div className="flex gap-4">
            <button
              type="button"
              onClick={retakeImage}
              className="bg-gray-200 text-black py-2 px-6 border rounded-md"
            >
              Retake
            </button>
            <button
              type="button"
              onClick={confirmImage}
              className="bg-blue-600 text-white py-2 px-6 rounded-md"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCamera;
