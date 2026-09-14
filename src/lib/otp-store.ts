import fs from "fs/promises";
import path from "path";

type OtpEntry = {
  otp: string;
  expiresAt: number;
};

const storePath = path.join(process.cwd(), ".otp-store.json");

export const otpStore = {
  async get(email: string): Promise<OtpEntry | null> {
    try {
      const data = await fs.readFile(storePath, "utf-8");
      const store = JSON.parse(data);
      return store[email] || null;
    } catch {
      return null;
    }
  },
  async set(email: string, entry: OtpEntry) {
    let store: Record<string, OtpEntry> = {};
    try {
      const data = await fs.readFile(storePath, "utf-8");
      store = JSON.parse(data);
    } catch {
      // Ignore
    }
    store[email] = entry;
    await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf-8");
  },
  async delete(email: string) {
    try {
      const data = await fs.readFile(storePath, "utf-8");
      const store = JSON.parse(data);
      delete store[email];
      await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf-8");
    } catch {
      // Ignore
    }
  }
};
