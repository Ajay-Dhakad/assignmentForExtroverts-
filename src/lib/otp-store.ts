type OtpEntry = {
  otp: string;
  expiresAt: number;
};

const globalForOtp = global as unknown as { otpStore: Map<string, OtpEntry> };

export const otpStore = globalForOtp.otpStore || new Map<string, OtpEntry>();

// Unconditionally save to global to share memory between API routes and Server Actions
globalForOtp.otpStore = otpStore;
