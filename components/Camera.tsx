import React, { useRef, useEffect } from 'react';
import { GeoLocation } from '../types';
import { CameraIcon } from './Icons';


interface CameraProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing rear camera:", err);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (fallbackErr) {
            console.error("Error accessing any camera:", fallbackErr);
            alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
            onClose();
        }
      }
    };

    openCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 flex justify-center items-center gap-8">
        <button onClick={onClose} className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold">Cancelar</button>
        <button onClick={handleCapture} className="bg-white text-blue-600 rounded-full w-20 h-20 flex items-center justify-center border-4 border-blue-600">
          <CameraIcon className="w-10 h-10" />
        </button>
        <div className="w-24"></div>
      </div>
    </div>
  );
};

export const waterMarkPhoto = (file: File, location: GeoLocation | null, establishment: string, address: string): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const footerHeight = 160; // Extra space for the legend below the photo
          
          canvas.width = img.width;
          canvas.height = img.height + footerHeight; // Increase height
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
  
          // Draw the photo
          ctx.drawImage(img, 0, 0);
  
          // Draw the white footer background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, img.height, canvas.width, footerHeight);
          
          const now = new Date();
          const watermarkText = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
          const locationText = location ? `GPS: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'GPS: N/A';
          
          // Draw text in black within the footer
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          
          const padding = 30;
          const lineSpacing = 45;
          let textY = img.height + 40;

          ctx.font = 'bold 36px Arial';
          ctx.fillText(establishment, padding, textY);
          
          textY += lineSpacing;
          ctx.font = '28px Arial';
          ctx.fillText(watermarkText, padding, textY);
          
          textY += lineSpacing;
          ctx.fillText(locationText, padding, textY);
  
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };