import React, { useState, useRef, useEffect } from 'react';
// FIX: Added InspectionType to imports
import { Property, Inspection, Photo, GeoLocation, InspectionType } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import { CameraIcon, TrashIcon } from './Icons';

// --- Camera Component ---
interface CameraProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
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


// --- InspectionView Component ---

interface InspectionViewProps {
  property: Property;
  onFinish: (inspection: Inspection) => void;
}

const waterMarkPhoto = (file: File, location: GeoLocation | null, propertyAddress: string): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        const now = new Date();
        const watermarkText = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        const locationText = location ? `GPS: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'GPS: N/A';
        
        ctx.font = '24px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        
        const padding = 20;
        ctx.fillText(watermarkText, padding, canvas.height - padding - 30);
        ctx.fillText(locationText, padding, canvas.height - padding);
        ctx.fillText(propertyAddress, padding, canvas.height - padding - 60);

        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const InspectionView: React.FC<InspectionViewProps> = ({ property, onFinish }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { location, isLoading: isGeoLoading, error: geoError, getLocation } = useGeolocation();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleTakePhoto = () => {
    getLocation();
    setIsCameraOpen(true);
  };

  const handleCapture = async (blob: Blob) => {
    setIsCameraOpen(false);
    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });

    const watermarkedDataUrl = await waterMarkPhoto(file, location, property.address);
    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      name: '',
      dataUrl: watermarkedDataUrl,
      comment: '',
      timestamp: Date.now(),
      location: location,
    };
    setPhotos((prev) => [...prev, newPhoto]);
  };
  
  const updateName = (photoId: string, name: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, name } : p))
    );
  };

  const updateComment = (photoId: string, comment: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, comment } : p))
    );
  };
  
  const deletePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };
  
  const handleFinishInspection = () => {
    // FIX: Added missing properties to conform to the Inspection type.
    const newInspection: Inspection = {
      id: `insp-${Date.now()}`,
      date: Date.now(),
      photos: photos,
      establishmentName: property.address,
      address: property.address,
      type: property.type as InspectionType,
      // FIX: Changed `poiStatuses` to `poiInstances` to match the `Inspection` type definition.
      poiInstances: [],
    };
    onFinish(newInspection);
  };

  return (
    <div className="p-4 space-y-6">
      {isCameraOpen && <Camera onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <img src={photo.dataUrl} alt={photo.name || "Foto da Vistoria"} className="w-full h-48 object-cover" />
            <div className="p-4 space-y-2">
              <input
                type="text"
                value={photo.name}
                onChange={(e) => updateName(photo.id, e.target.value)}
                placeholder="Nome da foto (ex: Fachada)"
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 font-semibold text-sm"
              />
              <textarea
                value={photo.comment}
                onChange={(e) => updateComment(photo.id, e.target.value)}
                placeholder="Adicionar comentário..."
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              ></textarea>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>{new Date(photo.timestamp).toLocaleString()}</span>
                <button onClick={() => deletePhoto(photo.id)} className="text-red-500 hover:text-red-700">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="sticky bottom-0 pb-4 bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={handleTakePhoto}
                disabled={isGeoLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
                <CameraIcon />
                {isGeoLoading ? 'Obtendo GPS...' : 'Tirar Foto'}
            </button>
            <button
                onClick={handleFinishInspection}
                className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                disabled={photos.length === 0}
            >
                Finalizar Vistoria
            </button>
        </div>
        {geoError && <p className="text-red-500 text-sm mt-2 text-center">{geoError}</p>}
      </div>
    </div>
  );
};
