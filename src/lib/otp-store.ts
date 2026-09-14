type OtpEntry = {
  otp: string;
  expiresAt: number;
};

const globalForOtp = global as unknown as { otpStore: Map<string, OtpEntry> };

export const otpStore = globalForOtp.otpStore || new Map<string, OtpEntry>();

if (process.env.NODE_ENV !== "production") globalForOtp.otpStore = otpStore;
