"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { sendOtp } from "@/app/actions";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

const steps = ["Landing", "Email", "OTP", "Profile", "Location", "Success"];

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [profile, setProfile] = useState({ name: "", age: "", pronouns: "" });
  const [location, setLocation] = useState({ state: "", city: "", college: "" });

  const nextStep = () => {
    setError("");
    setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const res = await sendOtp(email);
    setLoading(false);
    if (res.success) {
      nextStep();
    } else {
      setError(res.error || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      otp: enteredOtp,
    });
    setLoading(false);
    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        setError("Invalid or expired OTP. Please try again.");
      } else {
        setError(res.error);
      }
    } else {
      nextStep();
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!profile.name.trim()) return setError("Name is required.");
    const ageNum = parseInt(profile.age);
    if (isNaN(ageNum) || ageNum < 18) {
      return setError("You must be 18 or older to sign up.");
    }
    if (!profile.pronouns) return setError("Please select your pronouns.");
    nextStep();
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!location.state || !location.city || !location.college) {
      return setError("Please complete all location details.");
    }
    // Simulate final submission
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      nextStep();
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-neutral-950/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="text-center">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="Extroverts Logo" className="h-20 w-auto object-contain rounded-xl" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">
              Extroverts
            </h1>
            <p className="text-neutral-300 mb-8">Discover parties, meet people, and go out. Start your journey today.</p>
            <button onClick={nextStep} className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold rounded-full py-3 px-4 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              Get Started <ArrowRight size={18} />
            </button>
            <p className="text-xs text-neutral-400 mt-6">
              By continuing, you agree to our <a href="#" className="underline hover:text-white">Terms & Conditions</a>
            </p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit">
            <button onClick={prevStep} className="text-neutral-400 hover:text-white mb-6 flex items-center gap-1 text-sm"><ArrowLeft size={16} /> Back</button>
            <h2 className="text-2xl font-semibold mb-2">What's your email?</h2>
            <p className="text-neutral-400 text-sm mb-6">We'll send you a verification code.</p>
            <form onSubmit={handleSendOtp}>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-4"
                required
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold rounded-xl py-3 px-4 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Continue"}
              </button>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit">
            <button onClick={prevStep} className="text-neutral-400 hover:text-white mb-6 flex items-center gap-1 text-sm"><ArrowLeft size={16} /> Back</button>
            <h2 className="text-2xl font-semibold mb-2">Verify your email</h2>
            <p className="text-neutral-400 text-sm mb-6">Enter the 6-digit code sent to <span className="text-white font-medium">{email}</span></p>
            <form onSubmit={handleVerifyOtp}>
              <div className="flex justify-between gap-2 mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 bg-neutral-900 border border-neutral-800 rounded-xl text-center text-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                ))}
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold rounded-xl py-3 px-4 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Verify Code"}
              </button>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit">
            <h2 className="text-2xl font-semibold mb-6">Tell us about yourself</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 block mb-1">Age</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={profile.age}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setProfile({ ...profile, age: e.target.value });
                    }
                  }}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="18"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 block mb-1">Pronouns</label>
                <select
                  value={profile.pronouns}
                  onChange={(e) => setProfile({ ...profile, pronouns: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                >
                  <option value="" disabled>Select pronouns</option>
                  <option value="he/him">He/Him</option>
                  <option value="she/her">She/Her</option>
                  <option value="they/them">They/Them</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold rounded-xl py-3 px-4 hover:opacity-90 transition-opacity mt-6 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                Continue
              </button>
            </form>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" variants={slideVariants} initial="initial" animate="animate" exit="exit">
            <button onClick={prevStep} className="text-neutral-400 hover:text-white mb-6 flex items-center gap-1 text-sm"><ArrowLeft size={16} /> Back</button>
            <h2 className="text-2xl font-semibold mb-6">Where are you based?</h2>
            <form onSubmit={handleLocationSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400 block mb-1">State</label>
                <select
                  value={location.state}
                  onChange={(e) => setLocation({ ...location, state: e.target.value, city: "", college: "" })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="" disabled>Select State</option>
                  <option value="California">California</option>
                  <option value="New York">New York</option>
                  <option value="Texas">Texas</option>
                </select>
              </div>
              {location.state && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <label className="text-sm text-neutral-400 block mb-1 mt-4">City</label>
                  <select
                    value={location.city}
                    onChange={(e) => setLocation({ ...location, city: e.target.value, college: "" })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="" disabled>Select City</option>
                    {location.state === "California" && <><option>Los Angeles</option><option>San Francisco</option></>}
                    {location.state === "New York" && <><option>New York City</option><option>Buffalo</option></>}
                    {location.state === "Texas" && <><option>Austin</option><option>Dallas</option></>}
                  </select>
                </motion.div>
              )}
              {location.city && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <label className="text-sm text-neutral-400 block mb-1 mt-4">College</label>
                  <select
                    value={location.college}
                    onChange={(e) => setLocation({ ...location, college: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="" disabled>Select College</option>
                    <option value="University A">University A</option>
                    <option value="University B">University B</option>
                    <option value="College C">College C</option>
                  </select>
                </motion.div>
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold rounded-xl py-3 px-4 hover:opacity-90 transition-opacity disabled:opacity-50 mt-6 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Complete Profile"}
              </button>
            </form>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="text-center py-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 size={40} />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
            <p className="text-neutral-400 mb-8">Your profile has been created successfully. Welcome to the Extroverts community.</p>
            <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold rounded-full py-3 px-8 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
