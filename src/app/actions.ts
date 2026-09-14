"use server";

import { Resend } from "resend";
import { otpStore } from "@/lib/otp-store";

// Use the API key provided by the user
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtp(email: string) {
  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP with a 10-minute expiration
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    console.log(`Sending OTP ${otp} to ${email}`);

    // Send the email using Resend
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your Extroverts Verification Code",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #1e3a8a, #7e22ce, #f97316); padding: 40px 20px; text-align: center; color: white;">
          <img src="https://extroverts.app/img/logo.png" alt="Extroverts Logo" style="height: 60px; margin-bottom: 20px;" />
          <div style="background: rgba(0, 0, 0, 0.6); padding: 30px; border-radius: 16px; max-width: 400px; margin: 0 auto; backdrop-filter: blur(10px);">
            <h2 style="margin-top: 0;">Verify your email</h2>
            <p>Enter the following code to continue your journey into the night.</p>
            <h1 style="font-size: 42px; letter-spacing: 8px; color: #fff; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">${otp}</h1>
            <p style="font-size: 12px; color: #ccc;">This code expires in 10 minutes.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: "Failed to send email. Please try again." };
    }

    return { success: true };
  } catch (error) {
    console.error("Action error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
