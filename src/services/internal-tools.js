import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { FLOW_TOOLS_CATALOG } from "../constants/tools-catalog.js";
import { TOOL_BUILDER_PRESETS } from "../constants/presets.js";
import { ingredientManager } from "./ingredient-manager.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.FLOW_DATA_DIR || path.resolve(__dirname, "../../data");

export class InternalToolsService {
  constructor() {
    this.customToolsFile = path.join(DATA_DIR, "custom_tools.json");
    this.ensureCustomTools();
  }

  ensureCustomTools() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(this.customToolsFile)) {
      fs.writeFileSync(this.customToolsFile, JSON.stringify([], null, 2), "utf-8");
    }
  }

  loadCustomTools() {
    try {
      const raw = fs.readFileSync(this.customToolsFile, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveCustomTools(tools) {
    fs.writeFileSync(this.customToolsFile, JSON.stringify(tools, null, 2), "utf-8");
  }

  listTools({ category } = {}) {
    let all = [...FLOW_TOOLS_CATALOG];
    const custom = this.loadCustomTools();
    all = all.concat(custom);

    if (category) {
      all = all.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }
    return all;
  }

  getTool(toolId) {
    const all = this.listTools();
    const tool = all.find((t) => t.id === toolId);
    if (!tool) throw new Error(`Flow Tool '${toolId}' not found. Available tools: ${all.map((t) => t.id).join(", ")}`);
    return tool;
  }

  createCustomTool({ name, description, category = "Custom", promptTemplate, presetId }) {
    let baseTemplate = promptTemplate;
    if (presetId) {
      const preset = TOOL_BUILDER_PRESETS.find((p) => p.id === presetId);
      if (preset && !baseTemplate) {
        baseTemplate = preset.promptTemplate;
      }
    }

    const customTools = this.loadCustomTools();
    const toolId = `tool-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`;
    const newTool = {
      id: toolId,
      name,
      category,
      description,
      promptTemplate: baseTemplate,
      presetId: presetId || null,
      inputs: [
        { name: "inputAssetId", type: "string", required: true, description: "Input video or image asset ID" },
        { name: "customParameters", type: "object", required: false, description: "Key-value parameter pairs" },
      ],
      outputType: category.toLowerCase().includes("video") ? "video" : "image",
      createdAt: new Date().toISOString(),
      isCustom: true,
    };

    customTools.unshift(newTool);
    this.saveCustomTools(customTools);
    return newTool;
  }

  executeTool(toolId, params = {}) {
    const tool = this.getTool(toolId);
    const executionId = `exec-${toolId}-${Date.now().toString(36)}`;

    // Domain execution handler per tool type
    switch (toolId) {
      // --- Video Tools ---
      case "shader-effects": {
        const { videoClipId, shaderType = "chromatic_aberration", intensity = 0.7 } = params;
        return {
          executionId,
          toolId,
          toolName: tool.name,
          sourceClipId: videoClipId,
          shaderType,
          intensity,
          outputVideoUrl: `https://flow.google.com/assets/processed/shader_${shaderType}_${executionId}.mp4`,
          status: "SUCCESS",
          appliedEffects: [`WebGL Shader: ${shaderType}`, `Color grading pass: ${intensity * 100}%`],
        };
      }

      case "type-overlays": {
        const { videoClipId, text, style = "cinematic_serif", position = "lower_third" } = params;
        return {
          executionId,
          toolId,
          toolName: tool.name,
          sourceClipId: videoClipId,
          renderedText: text,
          style,
          position,
          outputVideoUrl: `https://flow.google.com/assets/processed/type_${executionId}.mp4`,
          status: "SUCCESS",
        };
      }

      case "transition-machine": {
        const { fromClipId, toClipId, transitionType = "morph_metamorphosis", durationSeconds = 2.0 } = params;
        return {
          executionId,
          toolId,
          toolName: tool.name,
          fromClipId,
          toClipId,
          transitionType,
          durationSeconds,
          outputVideoUrl: `https://flow.google.com/assets/processed/transition_${executionId}.mp4`,
          status: "SUCCESS",
          notes: "Generated latent space morphological interpolation between clip endpoints",
        };
      }

      case "video-resizer": {
        const { videoClipId, targetAspectRatio, reframingMode = "smart_crop_subject_track" } = params;
        return {
          executionId,
          toolId,
          toolName: tool.name,
          sourceClipId: videoClipId,
          targetAspectRatio,
          reframingMode,
          outputVideoUrl: `https://flow.google.com/assets/processed/reframe_${targetAspectRatio.replace(":", "x")}_${executionId}.mp4`,
          status: "SUCCESS",
        };
      }

      // --- Image Tools ---
      case "scene-explorer": {
        const { sourceImageId, targetAngle, additionalGuidance } = params;
        const outUrl = `https://flow.google.com/assets/images/scene_angle_${targetAngle}_${executionId}.png`;
        ingredientManager.addIngredient({
          name: `Scene Explorer (${targetAngle})`,
          type: "image",
          mediaUrl: outUrl,
          tags: ["scene-explorer", targetAngle],
        });
        return {
          executionId,
          toolId,
          sourceImageId,
          targetAngle,
          additionalGuidance,
          outputImageUrl: outUrl,
          status: "SUCCESS",
        };
      }

      case "shot-explorer": {
        const { keyframeId, shotCoverage = ["extreme_wide", "medium", "close_up"] } = params;
        const coverageResults = shotCoverage.map((shot) => ({
          framing: shot,
          imageUrl: `https://flow.google.com/assets/images/coverage_${shot}_${executionId}.png`,
        }));
        return {
          executionId,
          toolId,
          masterKeyframeId: keyframeId,
          coveragePack: coverageResults,
          status: "SUCCESS",
        };
      }

      case "mockup": {
        const { graphicAssetId, mockupType, environment } = params;
        return {
          executionId,
          toolId,
          graphicAssetId,
          mockupType,
          environment,
          outputImageUrl: `https://flow.google.com/assets/images/mockup_${mockupType}_${executionId}.png`,
          status: "SUCCESS",
        };
      }

      // --- Prompting Tools ---
      case "character-xray": {
        const { characterConcept, setting } = params;
        return {
          executionId,
          toolId,
          characterConcept,
          setting,
          xrayDossier: {
            archetypeProfile: "Grounded protagonist with high visual contrast",
            keyVisualAnchors: [
              "Signature silhouette anchor: sharp shoulder geometry",
              "Facial focal point: piercing amber reflective irises",
              "Material palette: weathered canvas, matte carbon fiber, brushed brass",
            ],
            recommendedOmniPrompt: `Cinematic portrait of character (${characterConcept}) in ${setting || "cinematic studio lighting"}, 85mm f/1.4 portrait lens, micro-expressions, 8k resolution.`,
            recommendedVeoMotionPrompt: `Character (${characterConcept}) turns head with deliberate focus, wind catching coat fabric, volumetric atmosphere.`,
          },
          status: "SUCCESS",
        };
      }

      case "storyboard-studio": {
        const { synopsis, totalShots = 5, aspectRatio = "16:9" } = params;
        const shots = [];
        for (let i = 1; i <= totalShots; i++) {
          shots.push({
            shotNumber: i,
            framing: i === 1 ? "Extreme Wide Shot (Establishing)" : i === totalShots ? "Hero Close-Up" : "Medium Tracking Shot",
            action: `Beat ${i} of synopsis: ${synopsis.slice(0, 40)}...`,
            cameraMotion: i % 2 === 0 ? "Tracking left to right" : "Slow push in",
            lighting: "Chiaroscuro with warm golden rim accent",
            prompt: `Cinematic shot ${i}: ${synopsis}. Camera: dynamic motion, 35mm lens, 4K filmic look.`,
          });
        }
        return {
          executionId,
          toolId,
          synopsis,
          aspectRatio,
          totalShots,
          storyboardShots: shots,
          status: "SUCCESS",
        };
      }

      case "prompt-tree": {
        const { coreIdea } = params;
        return {
          executionId,
          toolId,
          coreIdea,
          branches: [
            { direction: "Ultra-Photoreal Cinematic (Veo 3.1)", prompt: `Master shot, 35mm anamorphic, golden hour lighting: ${coreIdea}. Realistic physics, subtle film grain.` },
            { direction: "Stylized Cyberpunk Neo-Noir (Omni 1.2)", prompt: `Hyper-saturated neon reflections in rain-soaked streets, volumetric smoke, high contrast: ${coreIdea}.` },
            { direction: "Documentary Handheld 16mm", prompt: `Raw gritty 16mm documentary footage, natural handheld camera micro-shakes, natural sunlight: ${coreIdea}.` },
            { direction: "Surreal Liminal Dreamscape", prompt: `Ethereal ambient lighting, dreamlike architectural symmetry, floating particulate dust: ${coreIdea}.` },
          ],
          status: "SUCCESS",
        };
      }

      // --- Default fallback for remaining tools & custom tools ---
      default: {
        return {
          executionId,
          toolId,
          toolName: tool.name,
          category: tool.category,
          appliedInputs: params,
          outputArtifactUrl: tool.outputType === "video"
            ? `https://flow.google.com/assets/processed/${toolId}_${executionId}.mp4`
            : `https://flow.google.com/assets/processed/${toolId}_${executionId}.png`,
          status: "SUCCESS",
          message: `Tool '${tool.name}' executed successfully.`,
        };
      }
    }
  }
}

export const internalToolsService = new InternalToolsService();
