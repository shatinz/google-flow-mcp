import { VIDEO_MODELS } from "../constants/models.js";
import { studioSettings } from "./studio-settings.js";
import { projectManager } from "./project-manager.js";
import { ingredientManager } from "./ingredient-manager.js";

export class VideoGenerator {
  generateVideo({
    projectId,
    prompt,
    model = "Omni 1.2 Flash",
    aspectRatio = "16:9",
    durationSeconds = 5,
    variations = 2,
    ingredients = [],
    seed = null,
  }) {
    // Model validation
    const modelKey = Object.keys(VIDEO_MODELS).find(
      (k) => VIDEO_MODELS[k].name.toLowerCase() === model.toLowerCase() || VIDEO_MODELS[k].id.toLowerCase() === model.toLowerCase()
    );
    const modelSpec = modelKey ? VIDEO_MODELS[modelKey] : VIDEO_MODELS.OMNI_1_2_FLASH;

    // Credit calculation
    const creditCost = modelSpec.creditCostPerVariation * variations;
    studioSettings.deductCredits(creditCost, `Video Generation (${modelSpec.name} x${variations})`);

    const generationId = `gen-vid-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const effectiveSeed = seed || Math.floor(Math.random() * 99999999);

    const generatedVariants = [];
    for (let i = 1; i <= variations; i++) {
      const clipId = `clip-${Date.now().toString(36)}-var${i}`;
      const clipData = {
        id: clipId,
        title: prompt.slice(0, 32).trim() + ` (Var ${i})`,
        prompt,
        model: modelSpec.name,
        aspectRatio,
        durationSeconds,
        variationIndex: i,
        seed: effectiveSeed + i * 17,
        generationId,
        resolution: aspectRatio === "16:9" ? "1280x720" : aspectRatio === "9:16" ? "720x1280" : "1080x1080",
        fps: 24,
        creditCost: modelSpec.creditCostPerVariation,
        ingredientsAttached: ingredients,
        thumbnailUrl: `https://flow.google.com/assets/thumbnails/${clipId}.jpg`,
        videoUrl: `https://flow.google.com/assets/renders/${clipId}.mp4`,
        status: "COMPLETED",
        createdAt: new Date().toISOString(),
      };
      generatedVariants.push(clipData);

      // Add to project if specified
      if (projectId) {
        try {
          projectManager.addClipToProject(projectId, clipData);
        } catch {
          // ignore if project not found
        }
      }

      // Add as ingredient
      ingredientManager.addIngredient({
        name: clipData.title,
        type: "video",
        projectId,
        mediaUrl: clipData.videoUrl,
        tags: ["generated", modelSpec.id.toLowerCase().replace(/\\s+/g, "-")],
        durationSeconds,
        aspectRatio,
      });
    }

    return {
      generationId,
      prompt,
      model: modelSpec.name,
      aspectRatio,
      durationSeconds,
      variationsCount: variations,
      creditsDeducted: creditCost,
      remainingCredits: studioSettings.getSettings().creditsRemaining,
      clips: generatedVariants,
    };
  }

  generateVideoFrames({
    projectId,
    startFrameId,
    endFrameId,
    transitionPrompt,
    swapFrames = false,
    model = "Omni 1.2 Flash",
    aspectRatio = "16:9",
    durationSeconds = 5,
    variations = 2,
  }) {
    let firstFrame = startFrameId;
    let secondFrame = endFrameId;
    if (swapFrames) {
      firstFrame = endFrameId;
      secondFrame = startFrameId;
    }

    const fullPrompt = `Seamless cinematic interpolation from [Keyframe A: ${firstFrame}] to [Keyframe B: ${secondFrame}]. Motion transformation: ${transitionPrompt}`;

    const res = this.generateVideo({
      projectId,
      prompt: fullPrompt,
      model,
      aspectRatio,
      durationSeconds,
      variations,
      ingredients: [firstFrame, secondFrame],
    });

    return {
      mode: "Frames Interpolation",
      startFrame: firstFrame,
      endFrame: secondFrame,
      swapped: swapFrames,
      ...res,
    };
  }

  conversationalEditClip({
    clipId,
    editInstruction,
    editModel = "macaron_cookie_edit",
    inpaintMaskRegion = null,
  }) {
    studioSettings.deductCredits(15, `Conversational Edit (${editModel})`);

    const editedClipId = `clip-edited-${Date.now().toString(36)}`;
    const result = {
      originalClipId: clipId,
      editedClipId,
      editInstruction,
      editModel: "macaron_cookie_edit (Omni 1.2 Flash)",
      inpaintMaskRegion: inpaintMaskRegion || "full-frame semantic pass",
      status: "COMPLETED",
      thumbnailUrl: `https://flow.google.com/assets/thumbnails/${editedClipId}.jpg`,
      videoUrl: `https://flow.google.com/assets/renders/${editedClipId}.mp4`,
      changesApplied: [
        `Semantic inpaint: ${editInstruction}`,
        "Motion vector continuity preserved",
        "Color grade & grain matching original clip",
      ],
      createdAt: new Date().toISOString(),
    };

    return result;
  }
}

export const videoGenerator = new VideoGenerator();
