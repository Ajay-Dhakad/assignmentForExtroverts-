"use client";

import { SessionProvider } from "next-auth/react";
import { OtpProvider } from "@/context/OtpContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <OtpProvider>{children}</OtpProvider>
    </SessionProvider>
  );
}
