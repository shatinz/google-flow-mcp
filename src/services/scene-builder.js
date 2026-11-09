import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ingredientManager } from "./ingredient-manager.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.FLOW_DATA_DIR || path.resolve(__dirname, "../../data");

export class SceneBuilder {
  constructor() {
    this.scenesFile = path.join(DATA_DIR, "scenes.json");
    this.ensureScenes();
  }

  ensureScenes() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(this.scenesFile)) {
      const defaultScenes = [
        {
          id: "scene-promo-master",
          projectId: "flow-proj-cyberpunk-promo-01",
          title: "Master 30s Cut",
          aspectRatio: "16:9",
          muted: false,
          timeline: [
            {
              clipId: "clip-001",
              title: "Runner Morning Sprint",
              startTime: 0,
              duration: 5,
              inTrim: 0,
              outTrim: 5,
              transitionToNext: "crossfade",
            },
            {
              clipId: "clip-002",
              title: "Smartwatch Biometric Glow",
              startTime: 4.5,
              duration: 5,
              inTrim: 0,
              outTrim: 5,
              transitionToNext: "none",
            },
          ],
          totalDurationSeconds: 9.5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      fs.writeFileSync(this.scenesFile, JSON.stringify(defaultScenes, null, 2), "utf-8");
    }
  }

  loadScenes() {
    try {
      const raw = fs.readFileSync(this.scenesFile, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveScenes(scenes) {
    fs.writeFileSync(this.scenesFile, JSON.stringify(scenes, null, 2), "utf-8");
  }

  listScenes(projectId) {
    const scenes = this.loadScenes();
    if (projectId) {
      return scenes.filter((s) => s.projectId === projectId);
    }
    return scenes;
  }

  getScene(id) {
    const scenes = this.loadScenes();
    const scene = scenes.find((s) => s.id === id);
    if (!scene) throw new Error(`Scene '${id}' not found in Scene Builder.`);
    return scene;
  }

  createScene({ projectId, title, aspectRatio = "16:9" }) {
    const scenes = this.loadScenes();
    const newScene = {
      id: `scene-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      projectId: projectId || "default-project",
      title: title || "Untitled Scene Sequence",
      aspectRatio,
      muted: false,
      timeline: [],
      totalDurationSeconds: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    scenes.unshift(newScene);
    this.saveScenes(scenes);
    return newScene;
  }

  addClipToScene(sceneId, { clipId, title = "Clip", duration = 5, inTrim = 0, outTrim = 5, transitionToNext = "crossfade" }) {
    const scenes = this.loadScenes();
    const index = scenes.findIndex((s) => s.id === sceneId);
    if (index === -1) throw new Error(`Scene '${sceneId}' not found.`);

    const scene = scenes[index];
    const clipDuration = Math.max(0.5, (outTrim || duration) - (inTrim || 0));
    const startTime = scene.timeline.length > 0
      ? scene.timeline[scene.timeline.length - 1].startTime + scene.timeline[scene.timeline.length - 1].duration - 0.5
      : 0;

    const timelineItem = {
      clipId,
      title,
      startTime: Math.max(0, startTime),
      duration: clipDuration,
      inTrim: inTrim || 0,
      outTrim: outTrim || duration,
      transitionToNext,
    };

    scene.timeline.push(timelineItem);
    scene.totalDurationSeconds = scene.timeline.reduce((acc, c) => acc + c.duration, 0);
    scene.updatedAt = new Date().toISOString();

    this.saveScenes(scenes);
    return scene;
  }

  reorderClips(sceneId, orderedClipIds) {
    const scenes = this.loadScenes();
    const index = scenes.findIndex((s) => s.id === sceneId);
    if (index === -1) throw new Error(`Scene '${sceneId}' not found.`);

    const scene = scenes[index];
    const newTimeline = [];
    let currentStartTime = 0;

    for (const cid of orderedClipIds) {
      const item = scene.timeline.find((t) => t.clipId === cid);
      if (item) {
        newTimeline.push({
          ...item,
          startTime: currentStartTime,
        });
        currentStartTime += item.duration;
      }
    }

    scene.timeline = newTimeline;
    scene.totalDurationSeconds = currentStartTime;
    scene.updatedAt = new Date().toISOString();

    this.saveScenes(scenes);
    return scene;
  }

  trimTimelineClip(sceneId, clipId, { inTrim, outTrim }) {
    const scenes = this.loadScenes();
    const index = scenes.findIndex((s) => s.id === sceneId);
    if (index === -1) throw new Error(`Scene '${sceneId}' not found.`);

    const scene = scenes[index];
    const clip = scene.timeline.find((t) => t.clipId === clipId);
    if (!clip) throw new Error(`Clip '${clipId}' not in scene '${sceneId}'.`);

    if (inTrim !== undefined) clip.inTrim = inTrim;
    if (outTrim !== undefined) clip.outTrim = outTrim;
    clip.duration = Math.max(0.5, clip.outTrim - clip.inTrim);

    // Recalculate start times across timeline
    let curTime = 0;
    for (const item of scene.timeline) {
      item.startTime = curTime;
      curTime += item.duration;
    }
    scene.totalDurationSeconds = curTime;
    scene.updatedAt = new Date().toISOString();

    this.saveScenes(scenes);
    return scene;
  }

  saveFrame(sceneId, timecodeSeconds = 0) {
    const scene = this.getScene(sceneId);
    const frameId = `frame-${sceneId}-${Math.round(timecodeSeconds * 100)}`;
    const frameUrl = `https://flow.google.com/assets/frames/${frameId}.jpg`;

    // Add extracted frame as an image ingredient
    ingredientManager.addIngredient({
      name: `Frame @ ${timecodeSeconds}s (${scene.title})`,
      type: "image",
      projectId: scene.projectId,
      mediaUrl: frameUrl,
      tags: ["extracted-frame", scene.id],
      aspectRatio: scene.aspectRatio,
    });

    return {
      sceneId,
      timecodeSeconds,
      frameId,
      frameUrl,
      savedAsIngredient: true,
      message: `Extracted high-res frame from ${scene.title} at ${timecodeSeconds}s and registered as ingredient.`,
    };
  }

  renderScene(sceneId, { resolution = "1080p", audioMix = "normalized" } = {}) {
    const scene = this.getScene(sceneId);
    if (scene.timeline.length === 0) {
      throw new Error(`Cannot render scene '${sceneId}' because the timeline is empty. Add clips first.`);
    }

    const renderId = `render-${sceneId}-${Date.now().toString(36)}`;
    const outputVideoUrl = `https://flow.google.com/assets/renders/${renderId}.mp4`;

    return {
      sceneId: scene.id,
      title: scene.title,
      renderId,
      status: "RENDERED",
      resolution,
      aspectRatio: scene.aspectRatio,
      totalDurationSeconds: scene.totalDurationSeconds,
      clipCount: scene.timeline.length,
      audioMix,
      outputVideoUrl,
      downloadReady: true,
      renderedAt: new Date().toISOString(),
    };
  }
}

export const sceneBuilder = new SceneBuilder();
