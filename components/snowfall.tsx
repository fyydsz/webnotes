"use client";
import React, { useSyncExternalStore } from "react";
import Snowfall from "react-snowfall";

interface SnowfallWrapperProps {
  children: React.ReactNode;
}

// Helper to subscribe to reduced motion preference changes
function subscribeToPrefersReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getServerSnapshot() {
  return false; // Default to no reduced motion on server
}

function getClientSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const SnowfallWrapper: React.FC<SnowfallWrapperProps> = ({ children }) => {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToPrefersReducedMotion,
    getClientSnapshot,
    getServerSnapshot
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {children}
      {!prefersReducedMotion && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <Snowfall />
        </div>
      )}
    </div>
  );
};

export default SnowfallWrapper;
