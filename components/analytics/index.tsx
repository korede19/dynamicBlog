"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (command: string, id: string, config: object) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-RV6NGH4RBE", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}
