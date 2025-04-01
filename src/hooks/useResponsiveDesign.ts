"use client";
import { useState, useEffect } from 'react';

// Hook to detect device type and screen size
export function useResponsiveDesign() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    // Function to update device type based on screen width
    const updateDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
      setIsDesktop(width >= 1024);
    };
    
    // Set initial device type
    updateDeviceType();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateDeviceType);
    
    // Clean up event listener
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    // Helper classes for responsive design
    containerClass: "w-full px-4 md:px-6 lg:px-8 mx-auto max-w-screen-xl",
    buttonClass: "px-4 py-3 md:px-6 md:py-3 text-base md:text-lg rounded-lg",
    inputClass: "w-full p-3 md:p-2 text-base md:text-base rounded-lg",
    cardClass: "rounded-lg shadow-md p-4 md:p-6 bg-white",
  };
}
