/**
 * Comprehensive Verification Test Suite for Google Flow MCP Studio Server
 */

import { projectManager } from "../services/project-manager.js";
import { studioSettings } from "../services/studio-settings.js";
import { buildCinematicPrompt } from "../services/cinematography.js";
import { characterStudio } from "../services/character-studio.js";
import { ingredientManager } from "../services/ingredient-manager.js";
import { videoGenerator } from "../services/video-generator.js";
import { imageGenerator } from "../services/image-generator.js";
import { sceneBuilder } from "../services/scene-builder.js";
import { internalToolsService } from "../services/internal-tools.js";
import { exportService } from "../services/export-service.js";

async function runStudioTests() {
  console.log("=================================================");
  console.log("🎬 GOOGLE FLOW MCP STUDIO - FULL VERIFICATION TEST");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Projects
    console.log("--- 1. Testing Projects Management ---");
    const initialProjects = projectManager.listProjects();
    assert(initialProjects.length > 0, `Initial projects loaded (found ${initialProjects.length})`);
    
    const newProj = projectManager.createProject({
      title: "Cyberpunk Odyssey - Ep 1",
      description: "Sci-fi narrative sequence set in 2099 high-altitude skyline.",
      aspectRatio: "16:9",
      defaultModel: "Veo 3.1 - Quality",
    });
    assert(newProj.id && newProj.title === "Cyberpunk Odyssey - Ep 1", `Project created: ${newProj.id}`);

    // 2. Settings & Credits
    console.log("\n--- 2. Testing Studio Settings & Credits ---");
    const settings = studioSettings.getSettings();
    assert(settings.accountTier === "Google One AI Premium", "Account tier verified");
    const updatedSettings = studioSettings.updateSettings({
      layout: "batch",
      thumbnailSize: "L",
      soundOnHover: true,
      returnSilentVideos: false,
    });
    assert(updatedSettings.layout === "batch" && updatedSettings.thumbnailSize === "L", "Settings updated to batch layout and L thumbnails");

    // 3. Directorial Cinematography Compiler
    console.log("\n--- 3. Testing Directorial Prompt Compiler ---");
    const directorPrompt = buildCinematicPrompt({
      subjectAndAction: "Elena sprint-jumps between neon rooftops in driving rain",
      environment: "Neo-Shinjuku hyper-dense skyline, towering holographic advertisements",
      lighting: "NEON_CYBERPUNK",
      cameraMotion: "TRACKING_RUN",
      framing: "WIDE_SHOT",
      optics: "ANAMORPHIC",
      audioSoundscape: "thunderclap, kinetic electronic beats, rain pelting on asphalt",
      characters: ["@elena"],
      styleModifiers: ["cinematic grain", "8k master"],
    });
    assert(directorPrompt.includes("[Featuring @elena]") && directorPrompt.includes("[Audio:"), `Compiled prompt valid: ${directorPrompt.slice(0, 75)}...`);

    // 4. Character Studio
    console.log("\n--- 4. Testing Character Studio ---");
    const heroChar = characterStudio.createCharacter({
      name: "Marcus Vance",
      archetype: "The Professional",
      bio: "High-level ex-operative in matte black ballistic trench coat with augmented left eye.",
      costumeSpecs: "Tactical trench coat, high cowl collar, carbon-fiber gauntlet.",
    });
    assert(heroChar.id && heroChar.tag === "@marcusvance", `Character created with tag: ${heroChar.tag}`);

    const charSheet = characterStudio.generateCharacterSheet(heroChar.id);
    assert(charSheet.angles.length === 4 && charSheet.sheetStatus === "RENDERED", "Multi-angle character sheet generated (4 camera angles)");

    // 5. Ingredients Drawer
    console.log("\n--- 5. Testing Ingredients Drawer & Trimming ---");
    const allIngredients = ingredientManager.listIngredients();
    assert(allIngredients.length >= 3, `Ingredients drawer loaded (${allIngredients.length} assets)`);

    const newIng = ingredientManager.addIngredient({
      name: "Synthwave Bass Pulse",
      type: "voice",
      durationSeconds: 12.0,
      tags: ["music", "soundtrack"],
    });
    assert(newIng.id, `Ingredient added: ${newIng.name}`);

    const trimmed = ingredientManager.trimIngredient(newIng.id, { trimStart: 2.0, trimEnd: 10.0 });
    assert(trimmed.trimStart === 2.0 && trimmed.trimEnd === 10.0, "Ingredient in/out points trimmed successfully");

    // 6. Video Generation (Omni & Veo)
    console.log("\n--- 6. Testing Video Generation (Omni 1.2 & Veo 3.1) ---");
    const videoGen = videoGenerator.generateVideo({
      projectId: newProj.id,
      prompt: directorPrompt,
      model: "Veo 3.1 - Quality",
      aspectRatio: "16:9",
      durationSeconds: 5,
      variations: 2,
    });
    assert(videoGen.clips.length === 2, `Veo 3.1 generated 2 variants (Credit deduction: ${videoGen.creditsDeducted})`);

    // Keyframe Interpolation
    const morphGen = videoGenerator.generateVideoFrames({
      projectId: newProj.id,
      startFrameId: "frame-start-001",
      endFrameId: "frame-end-002",
      transitionPrompt: "Elena seamlessly morphs from rain-soaked rooftop into high-speed hovercraft cockpit",
      swapFrames: false,
    });
    assert(morphGen.mode === "Frames Interpolation" && morphGen.clips.length === 2, "Keyframe interpolation video generated");

    // Conversational Inpainting / Edit Clip
    const clipToEdit = videoGen.clips[0].id;
    const editedClip = videoGenerator.conversationalEditClip({
      clipId: clipToEdit,
      editInstruction: "Change lighting to warm sunset amber and add sparks flying from the right",
    });
    assert(editedClip.editedClipId && editedClip.status === "COMPLETED", `Conversational edit applied via macaron_cookie_edit`);

    // 7. Image Generation (Nano Banana)
    console.log("\n--- 7. Testing Image Generation (Nano Banana Pro) ---");
    const imgGen = imageGenerator.generateImage({
      projectId: newProj.id,
      prompt: "Photorealistic master keyframe of futuristic skyscraper landing pad at dusk",
      model: "🍌 Nano Banana Pro",
      thinkingLevel: "High - Extra thorough",
      variations: 2,
    });
    assert(imgGen.images.length === 2, "Nano Banana Pro synthesized 2 high-thinking images");

    // 8. Scene Builder & Timeline Sequencing
    console.log("\n--- 8. Testing Scene Builder & Timeline Sequencing ---");
    const scene = sceneBuilder.createScene({
      projectId: newProj.id,
      title: "Opening Sequence - Rooftop Infiltration",
      aspectRatio: "16:9",
    });
    assert(scene.id, `Scene created: ${scene.title}`);

    // Add clips
    sceneBuilder.addClipToScene(scene.id, {
      clipId: videoGen.clips[0].id,
      title: "Shot 1 - Rooftop Jump",
      duration: 5,
      inTrim: 0,
      outTrim: 5,
      transitionToNext: "crossfade",
    });
    sceneBuilder.addClipToScene(scene.id, {
      clipId: videoGen.clips[1].id,
      title: "Shot 2 - Hovercraft Chase",
      duration: 5,
      inTrim: 0.5,
      outTrim: 4.5,
      transitionToNext: "none",
    });

    const updatedTimeline = sceneBuilder.getScene(scene.id);
    assert(updatedTimeline.timeline.length === 2, `Timeline has ${updatedTimeline.timeline.length} clips`);

    // Extract frame
    const extractedFrame = sceneBuilder.saveFrame(scene.id, 2.5);
    assert(extractedFrame.savedAsIngredient === true, "Full-res frame extracted from timeline at 2.5s and saved as ingredient");

    // Render Scene
    const renderedScene = sceneBuilder.renderScene(scene.id, { resolution: "1080p" });
    assert(renderedScene.downloadReady === true && renderedScene.status === "RENDERED", `Scene rendered master cut: ${renderedScene.outputVideoUrl}`);

    // 9. Internal Tools (All 34 Cataloged) & Tool Creator
    console.log("\n--- 9. Testing Flow Micro-Tools & Tool Builder ---");
    const tools = internalToolsService.listTools();
    assert(tools.length >= 34, `All 34 Flow micro-tools cataloged (found ${tools.length})`);

    const shaderResult = internalToolsService.executeTool("shader-effects", {
      videoClipId: videoGen.clips[0].id,
      shaderType: "chromatic_aberration",
      intensity: 0.85,
    });
    assert(shaderResult.status === "SUCCESS" && shaderResult.outputVideoUrl.includes("shader"), "Shader Effects micro-tool executed");

    const transitionResult = internalToolsService.executeTool("transition-machine", {
      fromClipId: videoGen.clips[0].id,
      toClipId: videoGen.clips[1].id,
      transitionType: "morph_metamorphosis",
    });
    assert(transitionResult.status === "SUCCESS", "Transition Machine executed morphological transition");

    const storyboardResult = internalToolsService.executeTool("storyboard-studio", {
      synopsis: "Operative infiltrates high-security server tower and extracts encrypted datapad",
      totalShots: 4,
    });
    assert(storyboardResult.storyboardShots.length === 4, "Storyboard Studio generated 4-shot directorial breakdown");

    // Custom Tool Creator
    const customTool = internalToolsService.createCustomTool({
      name: "Vintage 1970s Technicolor",
      description: "Transform video with rich 3-strip saturated Technicolor film stock hues.",
      presetId: "image-filter",
      category: "Video",
    });
    assert(customTool.id && customTool.isCustom === true, `Custom tool created via Tool Creator: ${customTool.name}`);

    // 10. Export, Download & Distribution
    console.log("\n--- 10. Testing Video Export, 4K Upscale & Distribution ---");
    const dl4k = exportService.downloadVideo({
      clipIdOrRenderId: renderedScene.renderId,
      format: "4K Upscaled",
    });
    assert(dl4k.resolution === "3840x2160" && dl4k.directDownloadUrl, "Exported 4K Upscaled master video");

    const dlGif = exportService.downloadVideo({
      clipIdOrRenderId: videoGen.clips[0].id,
      format: "270p Animated GIF",
    });
    assert(dlGif.containerFormat === "gif", "Exported 270p Animated GIF preview");

    const projectArchive = exportService.downloadProjectZip(newProj.id);
    assert(projectArchive.zipFilename.endsWith(".zip") && projectArchive.status === "COMPLETED", "Generated full project ZIP archive");

    const ytPub = exportService.publishToYouTube({
      videoClipId: renderedScene.renderId,
      title: "Cyberpunk Odyssey - Ep 1 (Official 4K Teaser)",
      description: "Made with Google Flow AI Video Studio",
      privacy: "public",
    });
    assert(ytPub.youtubeUrl && ytPub.status === "PUBLISHED", `Published to YouTube: ${ytPub.youtubeUrl}`);

    const shareInfo = exportService.shareVideo(renderedScene.renderId);
    assert(shareInfo.shareableWebUrl && shareInfo.embedHtml, "Generated shareable web link and embed iframe");

  } catch (err) {
    console.error("Test execution threw exception:", err);
    failed++;
  }

  console.log("\n=================================================");
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runStudioTests();
