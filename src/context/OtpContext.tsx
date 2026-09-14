"use client";

import React, { createContext, useContext, useState } from "react";

type OtpContextType = {
  expectedOtp: string | null;
  email: string | null;
  setOtpData: (email: string, otp: string) => void;
  clearOtpData: () => void;
};

const OtpContext = createContext<OtpContextType | undefined>(undefined);

export function OtpProvider({ children }: { children: React.ReactNode }) {
  const [expectedOtp, setExpectedOtp] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const setOtpData = (newEmail: string, newOtp: string) => {
    setEmail(newEmail);
    setExpectedOtp(newOtp);
  };

  const clearOtpData = () => {
    setEmail(null);
    setExpectedOtp(null);
  };

  return (
    <OtpContext.Provider value={{ expectedOtp, email, setOtpData, clearOtpData }}>
      {children}
    </OtpContext.Provider>
  );
}

export function useOtp() {
  const context = useContext(OtpContext);
  if (context === undefined) {
    throw new Error("useOtp must be used within an OtpProvider");
  }
  return context;
}
