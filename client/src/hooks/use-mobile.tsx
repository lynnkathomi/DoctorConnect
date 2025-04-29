import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Standard md breakpoint in Tailwind
    };

    // Initial check
    checkIfMobile();

    // Listen for window resize events
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return isMobile;
}