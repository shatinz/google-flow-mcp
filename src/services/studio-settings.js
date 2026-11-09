import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.FLOW_DATA_DIR || path.resolve(__dirname, "../../data");

export class StudioSettingsManager {
  constructor() {
    this.settingsFile = path.join(DATA_DIR, "settings.json");
    this.ensureSettings();
  }

  ensureSettings() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(this.settingsFile)) {
      const defaultSettings = {
        layout: "grid", // "grid" | "batch"
        thumbnailSize: "M", // "S" | "M" | "L"
        soundOnHover: true,
        returnSilentVideos: true,
        clearPromptOnSubmit: true,
        showTileDetails: true,
        defaultAspectRatio: "16:9",
        defaultVideoModel: "Omni 1.2 Flash",
        defaultImageModel: "🍌 Nano Banana Pro",
        accountTier: "Google One AI Premium",
        creditsRemaining: 1500,
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(this.settingsFile, JSON.stringify(defaultSettings, null, 2), "utf-8");
    }
  }

  getSettings() {
    try {
      const raw = fs.readFileSync(this.settingsFile, "utf-8");
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  updateSettings(patch) {
    const current = this.getSettings();
    const updated = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(this.settingsFile, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  }

  deductCredits(amount, reason = "Generation") {
    const current = this.getSettings();
    const remaining = Math.max(0, (current.creditsRemaining || 0) - amount);
    this.updateSettings({ creditsRemaining: remaining });
    return {
      deducted: amount,
      remainingCredits: remaining,
      reason,
    };
  }
}

export const studioSettings = new StudioSettingsManager();
