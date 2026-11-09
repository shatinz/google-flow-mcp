import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CHARACTER_ARCHETYPES } from "../constants/models.js";
import { ingredientManager } from "./ingredient-manager.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.FLOW_DATA_DIR || path.resolve(__dirname, "../../data");

export class CharacterStudio {
  constructor() {
    this.charactersFile = path.join(DATA_DIR, "characters.json");
    this.ensureCharacters();
  }

  ensureCharacters() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(this.charactersFile)) {
      const defaultCharacters = [
        {
          id: "char-elena-vance",
          tag: "@elena",
          name: "Elena Vance",
          archetype: "The Professional",
          bio: "Cyber-security operative in sleek charcoal tailored outerwear with piercing amber eyes and sharp geometric haircut.",
          costumeSpecs: "Tailored matte charcoal tactical overcoat, high collar, biometric wrist bracer, minimalist titanium earring.",
          expressionRange: ["Determined focus", "Subtle calculating smirk", "Hyper-alert intensity"],
          referenceImages: [
            "https://flow.google.com/assets/characters/elena_front.png",
            "https://flow.google.com/assets/characters/elena_profile.png",
          ],
          modelFamily: "Veo 3.1 - Quality",
          createdAt: new Date().toISOString(),
        },
      ];
      fs.writeFileSync(this.charactersFile, JSON.stringify(defaultCharacters, null, 2), "utf-8");
    }
  }

  loadCharacters() {
    try {
      const raw = fs.readFileSync(this.charactersFile, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveCharacters(items) {
    fs.writeFileSync(this.charactersFile, JSON.stringify(items, null, 2), "utf-8");
  }

  listCharacters() {
    return this.loadCharacters();
  }

  getCharacter(idOrTag) {
    const chars = this.loadCharacters();
    const clean = idOrTag.replace(/^@/, "");
    const char = chars.find(
      (c) => c.id === idOrTag || c.tag.replace(/^@/, "") === clean || c.name.toLowerCase() === clean.toLowerCase()
    );
    if (!char) throw new Error(`Character '${idOrTag}' not found in Character Studio.`);
    return char;
  }

  createCharacter({
    name,
    archetype = "The Professional",
    bio,
    costumeSpecs = "",
    referenceImages = [],
    modelFamily = "Veo 3.1 - Quality",
  }) {
    if (!CHARACTER_ARCHETYPES.includes(archetype)) {
      throw new Error(`Invalid archetype '${archetype}'. Valid options are: ${CHARACTER_ARCHETYPES.join(", ")}`);
    }

    const chars = this.loadCharacters();
    const tag = `@${name.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const newChar = {
      id: `char-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      tag,
      name,
      archetype,
      bio,
      costumeSpecs,
      expressionRange: ["Neutral / Focused", "Dynamic action", "Intense dialogue"],
      referenceImages: referenceImages.length > 0 ? referenceImages : [
        `https://flow.google.com/assets/characters/${tag.replace('@', '')}_sheet_master.png`
      ],
      modelFamily,
      createdAt: new Date().toISOString(),
    };

    chars.unshift(newChar);
    this.saveCharacters(chars);

    // Also register as an ingredient asset
    ingredientManager.addIngredient({
      name: `Character: ${name}`,
      type: "character",
      mediaUrl: newChar.referenceImages[0],
      tags: ["character", archetype.toLowerCase().replace(/\\s+/g, "-"), tag],
      aspectRatio: "1:1",
    });

    return newChar;
  }

  generateCharacterSheet(characterId) {
    const char = this.getCharacter(characterId);
    const angles = [
      { view: "Front Full Facing", prompt: `Full body front portrait of ${char.name}, ${char.costumeSpecs}, clean neutral studio background, 85mm prime lens.` },
      { view: "3/4 Hero Profile", prompt: `3/4 angle cinematic shot of ${char.name}, dramatic rim light, looking slightly off-camera.` },
      { view: "Profile Silhouette", prompt: `Pure side profile of ${char.name}, silhouette contour against soft blue studio backdrop.` },
      { view: "Macro Expression Close-Up", prompt: `Extreme close up of ${char.name}'s eyes and facial expression, photorealistic skin texture, high dynamic range.` },
    ];

    return {
      characterId: char.id,
      name: char.name,
      tag: char.tag,
      archetype: char.archetype,
      modelFamily: char.modelFamily,
      angles,
      sheetStatus: "RENDERED",
      sheetUrl: `https://flow.google.com/assets/characters/${char.tag.replace('@', '')}_multi_angle_sheet.png`,
      consistencyToken: `flow_char_anchor_${char.id}`,
    };
  }
}

export const characterStudio = new CharacterStudio();
