/**
 * Presets and Templates for Google Flow Custom Micro-Tools
 */

export const TOOL_BUILDER_PRESETS = [
  {
    id: "image-filter",
    name: "Image filter",
    description: "Applies custom visual aesthetic grading, retro LUTs, and color tone remapping.",
    promptTemplate: "Transform the visual style and color grading of the input image to match: {styleDescription}. Retain core subject composition and geometry.",
    defaultCategory: "Image",
  },
  {
    id: "style-morph",
    name: "Style morph",
    description: "Metamorphosize footage dynamically across multiple distinct artistic mediums.",
    promptTemplate: "Progressively morph the visual aesthetic of the clip from {startingStyle} to {targetStyle} across the timeline.",
    defaultCategory: "Video",
  },
  {
    id: "voice-over",
    name: "Voice over",
    description: "Generate contextual AI vocal narration, tone pacing, and timing-aligned subtitles.",
    promptTemplate: "Synthesize vocal narration for the scene with voice archetype {voiceArchetype}: '{scriptText}'. Align cadence to visual cuts.",
    defaultCategory: "Prompting",
  },
  {
    id: "time-stretcher",
    name: "Time stretcher",
    description: "Cinematic optical flow speed-ramping, slow-motion freezing, and temporal pacing modulation.",
    promptTemplate: "Apply speed ramp to video clip: {speedCurve} from normal speed to {slowMotionFactor}x hyper-slow motion.",
    defaultCategory: "Video",
  },
];
