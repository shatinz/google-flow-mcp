import { IMAGE_MODELS } from "../constants/models.js";
import { studioSettings } from "./studio-settings.js";
import { ingredientManager } from "./ingredient-manager.js";

export class ImageGenerator {
  generateImage({
    projectId,
    prompt,
    model = "🍌 Nano Banana Pro",
    aspectRatio = "16:9",
    thinkingLevel = "High - Extra thorough",
    variations = 2,
    seed = null,
  }) {
    const modelKey = Object.keys(IMAGE_MODELS).find(
      (k) => IMAGE_MODELS[k].name.toLowerCase() === model.toLowerCase() || IMAGE_MODELS[k].id.toLowerCase() === model.toLowerCase()
    );
    const modelSpec = modelKey ? IMAGE_MODELS[modelKey] : IMAGE_MODELS.NANO_BANANA_PRO;

    const creditCost = modelSpec.creditCost * variations;
    studioSettings.deductCredits(creditCost, `Image Generation (${modelSpec.name} x${variations})`);

    const generationId = `gen-img-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const effectiveSeed = seed || Math.floor(Math.random() * 99999999);

    const images = [];
    for (let i = 1; i <= variations; i++) {
      const imageId = `img-${Date.now().toString(36)}-var${i}`;
      const imgData = {
        id: imageId,
        title: prompt.slice(0, 32).trim() + ` (Image Var ${i})`,
        prompt,
        model: modelSpec.name,
        aspectRatio,
        thinkingLevel,
        seed: effectiveSeed + i * 29,
        generationId,
        imageUrl: `https://flow.google.com/assets/images/${imageId}.png`,
        resolution: aspectRatio === "16:9" ? "1920x1080" : aspectRatio === "9:16" ? "1080x1920" : "1080x1080",
        creditCost: modelSpec.creditCost,
        createdAt: new Date().toISOString(),
      };
      images.push(imgData);

      // Register as ingredient for use in video frames / characters
      ingredientManager.addIngredient({
        name: imgData.title,
        type: "image",
        projectId,
        mediaUrl: imgData.imageUrl,
        tags: ["generated-image", modelSpec.id.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()],
        aspectRatio,
      });
    }

    return {
      generationId,
      prompt,
      model: modelSpec.name,
      aspectRatio,
      thinkingLevel,
      variationsCount: variations,
      creditsDeducted: creditCost,
      remainingCredits: studioSettings.getSettings().creditsRemaining,
      images,
    };
  }
}

export const imageGenerator = new ImageGenerator();
