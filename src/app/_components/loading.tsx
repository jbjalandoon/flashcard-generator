"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BlinkBlur } from "react-loading-indicators";

export function GeneratingCardsLoader() {
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    ref.current = document.getElementById("portal");
  }, []);

  if (!ref.current) {
    return null;
  }

  return createPortal(
    <div className="absolute flex h-screen w-full items-center justify-center bg-black/70">
      <BlinkBlur
        color="#ffffff"
        size="medium"
        text="Generating Flashcards"
        textColor="#ffffff"
      />
    </div>,
    ref.current,
  );
}
