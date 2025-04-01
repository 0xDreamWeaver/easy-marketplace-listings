"use client";
import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useDropzone } from 'react-dropzone';
import { ArrowLeftIcon, CameraIcon, PhotoIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface PhotoCaptureProps {
  onPhotosTaken: (photos: string[]) => void;
  onBack: () => void;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onPhotosTaken, onBack }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCameraMode, setIsCameraMode] = useState(true);
  const webcamRef = useRef<Webcam>(null);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhotos((prevPhotos) => [...prevPhotos, imageSrc]);
        toast.success('Photo captured!');
      }
    }
  }, [webcamRef]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((prevPhotos) => [...prevPhotos, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    toast.success(`${acceptedFiles.length} photo(s) uploaded!`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    }
  });

  const handleNext = () => {
    if (photos.length > 0) {
      onPhotosTaken(photos);
    } else {
      toast.error('Please take at least one photo');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold mx-auto">Take Photo</h1>
      </div>

      <div className="flex-1 flex flex-col">
        {isCameraMode ? (
          <div className="flex-1 flex flex-col">
            <div className="relative flex-1 bg-black">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "environment"
                }}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 flex justify-center">
              <button
                onClick={capturePhoto}
                className="rounded-full bg-white border-4 border-gray-300 p-4"
              >
                <div className="w-12 h-12 rounded-full bg-gray-800"></div>
              </button>
            </div>
          </div>
        ) : (
          <div 
            {...getRootProps()} 
            className={`flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg m-4 ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <PhotoIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-center text-gray-500">
              {isDragActive
                ? 'Drop the images here...'
                : 'Drag & drop images here, or click to select files'}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setIsCameraMode(true)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isCameraMode ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            Camera
          </button>
          <button
            onClick={() => setIsCameraMode(false)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              !isCameraMode ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <PhotoIcon className="w-5 h-5 mr-2" />
            Upload
          </button>
        </div>

        <div className="flex overflow-x-auto pb-2 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative flex-shrink-0 w-16 h-16">
              <img
                src={photo}
                alt={`Captured ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">{photos.length} items</p>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCapture;
