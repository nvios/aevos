"use client";

import { useState, useEffect } from "react";
import { ScreeningWizard } from "@/components/screening/screening-wizard";

export function ScreeningWizardLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="text-center py-12 text-zinc-500">
        Caricamento...
      </div>
    );
  }

  return <ScreeningWizard />;
}
