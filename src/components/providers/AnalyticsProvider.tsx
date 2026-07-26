"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@/lib/analytics";

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize analytics once
    Analytics.init();
  }, []);

  useEffect(() => {
    if (pathname) {
      Analytics.trackPageview(pathname);
    }
  }, [pathname]);

  return <>{children}</>;
}
