"use client"; 

import { useState, useEffect } from 'react';

interface BannerWrapperProps {
  children: React.ReactNode;
  storageKey: string; // Kita butuh key yang sama dengan Banner
}

export function BannerWrapper({ children, storageKey }: BannerWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(storageKey);

    if (!isDismissed) {
      setIsVisible(true);
    }
  }, [storageKey]);

  if (!isVisible) return null; 

  return <>{children}</>;
}