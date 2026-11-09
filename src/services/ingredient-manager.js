import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.FLOW_DATA_DIR || path.resolve(__dirname, "../../data");

export class IngredientManager {
  constructor() {
    this.ingredientsFile = path.join(DATA_DIR, "ingredients.json");
    this.ensureIngredients();
  }

  ensureIngredients() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(this.ingredientsFile)) {
      const defaultIngredients = [
        {
          id: "ing-char-marcus",
          name: "Marcus - Cyberpunk Courier",
          type: "character",
          projectId: "flow-proj-cyberpunk-promo-01",
          tags: ["hero", "runner", "cyberpunk"],
          mediaUrl: "https://flow.google.com/assets/characters/marcus_full.png",
          aspectRatio: "1:1",
          createdAt: new Date().toISOString(),
        },
        {
          id: "ing-img-neon-city",
          name: "Neo-Tokyo Rain Background",
          type: "image",
          projectId: "flow-proj-cyberpunk-promo-01",
          tags: ["environment", "neon", "rain"],
          mediaUrl: "https://flow.google.com/assets/images/neo_tokyo.png",
          aspectRatio: "16:9",
          createdAt: new Date().toISOString(),
        },
        {
          id: "ing-voice-deep-narrator",
          name: "Narrator - Deep Cinematic",
          type: "voice",
          projectId: "flow-proj-cyberpunk-promo-01",
          tags: ["voiceover", "trailer", "baritone"],
          mediaUrl: "https://flow.google.com/assets/audio/voice_deep.wav",
          durationSeconds: 15.2,
          trimStart: 0.0,
          trimEnd: 15.2,
          createdAt: new Date().toISOString(),
        },
      ];
      fs.writeFileSync(this.ingredientsFile, JSON.stringify(defaultIngredients, null, 2), "utf-8");
    }
  }

  loadIngredients() {
    try {
      const raw = fs.readFileSync(this.ingredientsFile, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveIngredients(items) {
    fs.writeFileSync(this.ingredientsFile, JSON.stringify(items, null, 2), "utf-8");
  }

  listIngredients({ projectId, tab = "all", searchQuery } = {}) {
    let items = this.loadIngredients();
    if (projectId) {
      items = items.filter((i) => !i.projectId || i.projectId === projectId);
    }
    if (tab && tab !== "all") {
      const typeMapping = {
        images: "image",
        videos: "video",
        voices: "voice",
        characters: "character",
        uploads: "upload",
      };
      const matchType = typeMapping[tab.toLowerCase()] || tab;
      items = items.filter((i) => i.type === matchType);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.tags && i.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return items;
  }

  getIngredient(id) {
    const items = this.loadIngredients();
    const item = items.find((i) => i.id === id);
    if (!item) throw new Error(`Ingredient '${id}' not found.`);
    return item;
  }

  addIngredient({ name, type, projectId, mediaUrl, tags = [], durationSeconds = 0, aspectRatio = "16:9" }) {
    const items = this.loadIngredients();
    const newIngredient = {
      id: `ing-${type.substring(0, 3)}-${Date.now().toString(36)}`,
      name,
      type,
      projectId,
      mediaUrl: mediaUrl || `https://flow.google.com/assets/generated/${name.toLowerCase().replace(/\\s+/g, "_")}.mp4`,
      tags,
      durationSeconds,
      trimStart: 0,
      trimEnd: durationSeconds || 5,
      aspectRatio,
      createdAt: new Date().toISOString(),
    };
    items.unshift(newIngredient);
    this.saveIngredients(items);
    return newIngredient;
  }

  trimIngredient(id, { trimStart, trimEnd }) {
    const items = this.loadIngredients();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Ingredient '${id}' not found.`);

    if (trimStart !== undefined) items[index].trimStart = Math.max(0, trimStart);
    if (trimEnd !== undefined) items[index].trimEnd = trimEnd;
    items[index].updatedAt = new Date().toISOString();

    this.saveIngredients(items);
    return items[index];
  }

  deleteIngredient(id) {
    let items = this.loadIngredients();
    const initialLen = items.length;
    items = items.filter((i) => i.id !== id);
    if (items.length === initialLen) throw new Error(`Ingredient '${id}' not found.`);
    this.saveIngredients(items);
    return { success: true, deletedIngredientId: id };
  }
}

export const ingredientManager = new IngredientManager();
