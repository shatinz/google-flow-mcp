/**
 * Google Flow Model Specifications, Aspect Ratios, and Credit Accounting
 */

export const VIDEO_MODELS = {
  OMNI_1_2_FLASH: {
    id: "Omni 1.2 Flash",
    name: "Omni 1.2 Flash",
    description: "State-of-the-art general video synthesis, high-speed iteration, and conversational timeline editing.",
    creditCostPerVariation: 10,
    maxDurationSeconds: 15,
    supportedAspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    supportsIngredients: true,
    supportsFrameInterpolation: true,
    supportsConversationalEdit: true,
  },
  OMNI_1_1_FLASH: {
    id: "Omni 1.1 Flash",
    name: "Omni 1.1 Flash",
    description: "Previous generation fast video model for quick drafts and animated sketches.",
    creditCostPerVariation: 8,
    maxDurationSeconds: 10,
    supportedAspectRatios: ["16:9", "9:16", "1:1"],
    supportsIngredients: true,
    supportsFrameInterpolation: false,
    supportsConversationalEdit: false,
  },
  VEO_3_1_QUALITY: {
    id: "Veo 3.1 - Quality",
    name: "Veo 3.1 - Quality",
    description: "Google DeepMind's flagship cinematic video model with ultra-photorealistic physics, optical depth, and lighting.",
    creditCostPerVariation: 25,
    maxDurationSeconds: 10,
    supportedAspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    supportsIngredients: true,
    supportsFrameInterpolation: true,
    supportsConversationalEdit: true,
  },
  VEO_3_1_FAST: {
    id: "Veo 3.1 - Fast",
    name: "Veo 3.1 - Fast",
    description: "Optimized Veo model balancing cinematic motion realism and rapid turnaround.",
    creditCostPerVariation: 15,
    maxDurationSeconds: 10,
    supportedAspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    supportsIngredients: true,
    supportsFrameInterpolation: true,
    supportsConversationalEdit: true,
  },
  VEO_3_1_LITE: {
    id: "Veo 3.1 - Lite",
    name: "Veo 3.1 - Lite",
    description: "Lightweight Veo model for rapid shot iteration (20 credits for 2x variations).",
    creditCostPerVariation: 10,
    maxDurationSeconds: 8,
    supportedAspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    supportsIngredients: true,
    supportsFrameInterpolation: true,
    supportsConversationalEdit: false,
  },
};

export const IMAGE_MODELS = {
  NANO_BANANA_PRO: {
    id: "🍌 Nano Banana Pro",
    name: "🍌 Nano Banana Pro",
    description: "Professional high-detail image synthesis with deep multi-pass reasoning and rich composition.",
    creditCost: 5,
    thinkingLevels: ["Low", "Medium", "High - Extra thorough"],
    supportedAspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
  },
  NANO_BANANA_2_LITE: {
    id: "🍌 Nano Banana 2 Lite",
    name: "🍌 Nano Banana 2 Lite",
    description: "Ultra-fast image generation model for rapid concept ideation and storyboard thumbnails.",
    creditCost: 2,
    thinkingLevels: ["Low", "Medium"],
    supportedAspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
  },
  NANO_BANANA_2_1: {
    id: "🍌 Nano Banana 2.1",
    name: "🍌 Nano Banana 2.1",
    description: "Advanced coherent image model with enhanced prompt accuracy and textural rendering.",
    creditCost: 4,
    thinkingLevels: ["Low", "Medium", "High - Extra thorough"],
    supportedAspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
  },
};

export const ASPECT_RATIOS = ["16:9", "9:16", "1:1", "4:3", "3:4"];

export const VARIATION_COUNTS = [1, 2, 3, 4];

export const EXPORT_FORMATS = {
  GIF_270P: {
    id: "270p Animated GIF",
    format: "gif",
    resolution: "480x270",
    description: "Lightweight animated GIF for chat, web previews, and social messaging.",
  },
  ORIGINAL_720P: {
    id: "720p Original size",
    format: "mp4",
    resolution: "1280x720",
    description: "Standard generation resolution MP4 with crystal clear motion.",
  },
  UPSCALED_1080P: {
    id: "1080p Upscaled",
    format: "mp4",
    resolution: "1920x1080",
    description: "Full HD remaster enhanced with AI super-resolution and temporal sharpening.",
  },
  UPSCALED_4K: {
    id: "4K Upscaled",
    format: "mp4",
    resolution: "3840x2160",
    description: "Cinematic 4K UHD master with restored film grain and micro-textures.",
  },
};

export const CHARACTER_ARCHETYPES = [
  "The Eccentric",
  "The Professional",
  "The Wildcard",
  "The Familiar",
  "The Wicked",
  "The Fantastical",
];
