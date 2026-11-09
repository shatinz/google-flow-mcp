/**
 * Google Flow Built-in Micro-Tools Catalog
 * Discovered and mapped from https://flow.google.com/tools
 */

export const FLOW_TOOLS_CATALOG = [
  // --- IMAGE TOOLS (8) ---
  {
    id: "simple-sketch",
    name: "Simple Sketch",
    category: "Image",
    description: "Transform rough hand-drawn line art, wireframes, or doodles into photorealistic cinematic scenes.",
    inputs: [
      { name: "sketchAssetId", type: "string", required: true, description: "ID of the sketch or line drawing image" },
      { name: "prompt", type: "string", required: true, description: "Text description of the desired photoreal scene" },
      { name: "fidelity", type: "number", required: false, default: 0.75, description: "Degree of sketch adherence (0.1 to 1.0)" },
    ],
    outputType: "image",
  },
  {
    id: "scene-explorer",
    name: "Scene Explorer",
    category: "Image",
    description: "Deconstruct an image scene to explore alternative camera angles, positions, and perspectives while maintaining environment consistency.",
    inputs: [
      { name: "sourceImageId", type: "string", required: true, description: "Source keyframe or scene image" },
      { name: "targetAngle", type: "string", required: true, enum: ["wide", "close_up", "top_down", "side_profile", "reverse_angle"] },
      { name: "additionalGuidance", type: "string", required: false, description: "Specific details to focus on in the new angle" },
    ],
    outputType: "image",
  },
  {
    id: "mockup",
    name: "Mockup",
    category: "Image",
    description: "Project generated artwork, keyframes, or logos onto 3D realistic merchandise, billboards, devices, and packaging.",
    inputs: [
      { name: "graphicAssetId", type: "string", required: true, description: "Artwork or graphic to map" },
      { name: "mockupType", type: "string", required: true, enum: ["billboard", "poster_frame", "t_shirt", "smartphone", "vinyl_cover", "laptop"] },
      { name: "environment", type: "string", required: false, description: "Setting description (e.g. 'rainy Tokyo alley billboard')" },
    ],
    outputType: "image",
  },
  {
    id: "image-editor",
    name: "Image Editor",
    category: "Image",
    description: "Selective inpainting, object removal/addition, color grading, and tone adjustment on image assets.",
    inputs: [
      { name: "sourceImageId", type: "string", required: true, description: "Source image to edit" },
      { name: "instruction", type: "string", required: true, description: "Edit prompt (e.g. 'replace background with snowy mountains')" },
      { name: "maskRegion", type: "string", required: false, description: "Optional bounding box or mask keyword" },
    ],
    outputType: "image",
  },
  {
    id: "shot-explorer",
    name: "Shot Explorer",
    category: "Image",
    description: "Generate a full directorial coverage pack (extreme wide, medium, close-up, Dutch angle) from a single concept frame.",
    inputs: [
      { name: "keyframeId", type: "string", required: true, description: "The master keyframe image" },
      { name: "shotCoverage", type: "array", required: false, default: ["extreme_wide", "medium", "close_up"] },
    ],
    outputType: "image_collection",
  },
  {
    id: "mask-magic",
    name: "Mask Magic",
    category: "Image",
    description: "Semantic segmentation and intelligent alpha mask isolation for characters, props, and backgrounds.",
    inputs: [
      { name: "sourceImageId", type: "string", required: true, description: "Image to segment" },
      { name: "targetObject", type: "string", required: true, description: "Name of the entity to isolate (e.g. 'person', 'car', 'sky')" },
    ],
    outputType: "mask",
  },
  {
    id: "converge",
    name: "Converge",
    category: "Image",
    description: "Fuse and harmonize visual motifs, textures, and lighting from two or more reference images into one unified visual.",
    inputs: [
      { name: "primaryAssetId", type: "string", required: true, description: "Base structural image" },
      { name: "styleAssetId", type: "string", required: true, description: "Style or lighting reference image" },
      { name: "blendWeight", type: "number", required: false, default: 0.5 },
    ],
    outputType: "image",
  },
  {
    id: "grid-architect",
    name: "Grid Architect",
    category: "Image",
    description: "Create structured multi-panel comic book strips, moodboards, or 4-panel storyboard layouts with sequential consistency.",
    inputs: [
      { name: "panelsCount", type: "number", required: true, enum: [2, 3, 4, 6], default: 4 },
      { name: "themePrompt", type: "string", required: true, description: "Overarching theme or story arc for the grid" },
      { name: "characterAssetId", type: "string", required: false, description: "Character reference to feature in all panels" },
    ],
    outputType: "image",
  },

  // --- VIDEO TOOLS (10) ---
  {
    id: "shader-effects",
    name: "Shader Effects",
    category: "Video",
    description: "Apply cinematic post-processing shaders including CRT monitor simulation, chromatic aberration, VHS tape glitch, bloom, and night vision.",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Source video clip ID" },
      { name: "shaderType", type: "string", required: true, enum: ["chromatic_aberration", "vhs_retro", "crt_scanlines", "dream_bloom", "thermal_vision", "film_halation"] },
      { name: "intensity", type: "number", required: false, default: 0.7, description: "Effect strength (0.0 to 1.0)" },
    ],
    outputType: "video",
  },
  {
    id: "type-overlays",
    name: "Type Overlays",
    category: "Video",
    description: "Render animated cinematic typography, lower thirds, title cards, and credits directly over video footage.",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Source video clip ID" },
      { name: "text", type: "string", required: true, description: "Text content to display" },
      { name: "style", type: "string", required: false, enum: ["minimal_sans", "cinematic_serif", "neon_glow", "grunge_stamp", "typewriter"], default: "cinematic_serif" },
      { name: "position", type: "string", required: false, enum: ["center", "bottom_left", "lower_third", "top_banner"], default: "lower_third" },
    ],
    outputType: "video",
  },
  {
    id: "pixel-bento",
    name: "pixelBento",
    category: "Video",
    description: "Transform video clips into retro 16-bit pixel art, isometric voxel animation, or Game Boy classic rendering.",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Video clip ID" },
      { name: "resolutionTier", type: "string", required: false, enum: ["8bit", "16bit", "32bit_voxel"], default: "16bit" },
      { name: "colorPalette", type: "string", required: false, enum: ["gameboy", "cyberpunk_neon", "super_nes", "monochrome"], default: "super_nes" },
    ],
    outputType: "video",
  },
  {
    id: "poster-designer",
    name: "Poster Designer",
    category: "Video",
    description: "Auto-select the most visually striking keyframe from a video clip and format it into a theatrical film poster with festival laurels and billing block.",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Source video clip ID" },
      { name: "movieTitle", type: "string", required: true, description: "Film title" },
      { name: "tagline", type: "string", required: false, description: "Catchphrase or subtitle" },
      { name: "creditsBlock", type: "string", required: false, description: "Director and cast credits" },
    ],
    outputType: "image",
  },
  {
    id: "video-sketch",
    name: "Video Sketch",
    category: "Video",
    description: "Convert video footage into hand-drawn rotoscope animations, charcoal drawings, or watercolor motion paintings.",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Video clip ID" },
      { name: "sketchStyle", type: "string", required: false, enum: ["pencil_sketch", "charcoal", "watercolor_wash", "ink_line_art"], default: "pencil_sketch" },
    ],
    outputType: "video",
  },
  {
    id: "transition-machine",
    name: "Transition Machine",
    category: "Video",
    description: "Synthesize seamless AI morphological transitions, whip pans, zoom-throughs, or match-cuts between two video clips.",
    inputs: [
      { name: "fromClipId", type: "string", required: true, description: "Starting video clip ID" },
      { name: "toClipId", type: "string", required: true, description: "Ending video clip ID" },
      { name: "transitionType", type: "string", required: false, enum: ["morph_metamorphosis", "whip_pan", "zoom_dive", "match_cut", "portal_dissolve"], default: "morph_metamorphosis" },
      { name: "durationSeconds", type: "number", required: false, default: 2.0 },
    ],
    outputType: "video",
  },
  {
    id: "weirdcore",
    name: "Weirdcore",
    category: "Video",
    description: "Inject surreal, liminal space, dreamcore, and unsettling uncanny aesthetics into video footage.",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Video clip ID" },
      { name: "flavor", type: "string", required: false, enum: ["liminal_poolrooms", "glitch_nostalgia", "uncanny_valley", "hyperstition"], default: "liminal_poolrooms" },
      { name: "intensity", type: "number", required: false, default: 0.8 },
    ],
    outputType: "video",
  },
  {
    id: "video-resizer",
    name: "Video Resizer",
    category: "Video",
    description: "AI content-aware reframing and dynamic outpainting between aspect ratios (16:9 widescreen to 9:16 vertical TikTok/Shorts or 1:1 square).",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Video clip ID" },
      { name: "targetAspectRatio", type: "string", required: true, enum: ["16:9", "9:16", "1:1", "4:3", "3:4"] },
      { name: "reframingMode", type: "string", required: false, enum: ["smart_crop_subject_track", "ai_outpaint_fill", "blurred_pillarbox"], default: "smart_crop_subject_track" },
    ],
    outputType: "video",
  },
  {
    id: "stringout-creator",
    name: "Stringout Creator",
    category: "Video",
    description: "Instantly assemble a sequence of selected video clips into a single continuous rough cut with normalized audio levels.",
    inputs: [
      { name: "clipIds", type: "array", required: true, description: "Ordered list of video clip IDs" },
      { name: "crossfadeDuration", type: "number", required: false, default: 0.5, description: "Crossfade duration between clips in seconds" },
    ],
    outputType: "video",
  },
  {
    id: "video-granulator",
    name: "Video Granulator",
    category: "Video",
    description: "Authentic film grain simulation, gate weave, emulsion halation, and 35mm/16mm/Super-8 film stock modeling.",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Video clip ID" },
      { name: "filmStock", type: "string", required: false, enum: ["kodak_vision3_500t", "fujifilm_eterna", "kodachrome_64", "super8_grainy"], default: "kodak_vision3_500t" },
      { name: "halation", type: "boolean", required: false, default: true },
      { name: "jitter", type: "boolean", required: false, default: false },
    ],
    outputType: "video",
  },

  // --- PROMPTING TOOLS (5) ---
  {
    id: "character-xray",
    name: "Character X-Ray",
    category: "Prompting",
    description: "Generate deep multi-dimensional character dossiers including costume specs, silhouette anchors, and micro-expressions for generation consistency.",
    inputs: [
      { name: "characterConcept", type: "string", required: true, description: "Brief description or archetype of the character" },
      { name: "setting", type: "string", required: false, description: "Story world or genre" },
    ],
    outputType: "prompt_pack",
  },
  {
    id: "style-writer",
    name: "Style Writer",
    category: "Prompting",
    description: "Convert high-level aesthetic terminology (e.g. 'moody cyberpunk neo-noir') into exact camera, lighting, optics, and rendering directives.",
    inputs: [
      { name: "aestheticKeywords", type: "string", required: true, description: "Vibe or aesthetic terms" },
      { name: "targetModel", type: "string", required: false, enum: ["Veo 3.1", "Omni 1.2 Flash"], default: "Veo 3.1" },
    ],
    outputType: "prompt_modifiers",
  },
  {
    id: "storyboard-studio",
    name: "Storyboard Studio",
    category: "Prompting",
    description: "Translate a high-level narrative synopsis or commercial script into a shot-by-shot sequence with camera directions and continuity tags.",
    inputs: [
      { name: "synopsis", type: "string", required: true, description: "Story synopsis or scene script" },
      { name: "totalShots", type: "number", required: false, default: 5 },
      { name: "aspectRatio", type: "string", required: false, default: "16:9" },
    ],
    outputType: "storyboard",
  },
  {
    id: "prompt-tree",
    name: "Prompt Tree",
    category: "Prompting",
    description: "Branching creative engine: takes 1 core concept and generates 4 dramatically diverse visual treatments (cinematic, surreal, documentary, anime).",
    inputs: [
      { name: "coreIdea", type: "string", required: true, description: "The central concept or logline" },
    ],
    outputType: "prompt_branches",
  },
  {
    id: "story-sketch",
    name: "Story Sketch",
    category: "Prompting",
    description: "Generates 3-act narrative beat sheets with recommended camera setups, lighting moods, and emotional pacing.",
    inputs: [
      { name: "genre", type: "string", required: true, description: "Genre (e.g. sci-fi, psychological thriller, comedy)" },
      { name: "logline", type: "string", required: true, description: "Core premise" },
    ],
    outputType: "beat_sheet",
  },

  // --- EXPERIMENTAL TOOLS (11) ---
  {
    id: "frame-deconstructor",
    name: "Frame Deconstructor",
    category: "Experimental",
    description: "Deconstruct video frames into separate foreground, midground, background layers, optical flow vectors, and depth passes.",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Video clip ID" },
    ],
    outputType: "layer_pack",
  },
  {
    id: "blob-tracking",
    name: "Blob Tracking",
    category: "Experimental",
    description: "Compute 3D spatial feature tracks across frames to anchor virtual lights, annotations, or 3D text onto moving elements.",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Video clip ID" },
      { name: "targetDescription", type: "string", required: true, description: "Element to track (e.g. 'actor hand', 'moving vehicle')" },
    ],
    outputType: "motion_tracks",
  },
  {
    id: "depthwarp-4d",
    name: "DepthWarp 4D",
    category: "Experimental",
    description: "Synthesize stereoscopic 3D camera pushes, dolly zooms (Vertigo effect), and parallax depth orbits from a single 2D still image.",
    inputs: [
      { name: "sourceImageId", type: "string", required: true, description: "Source image ID" },
      { name: "motionPath", type: "string", required: false, enum: ["dolly_in_zoom_out", "orbit_around", "crane_dive", "lateral_truck"], default: "dolly_in_zoom_out" },
      { name: "durationSeconds", type: "number", required: false, default: 4 },
    ],
    outputType: "video",
  },
  {
    id: "webcam-set",
    name: "Webcam Set",
    category: "Experimental",
    description: "Map real-world head pose and facial performance to drive AI character animations.",
    inputs: [
      { name: "characterAssetId", type: "string", required: true, description: "Character reference asset" },
      { name: "performancePrompt", type: "string", required: true, description: "Action or dialogue description" },
    ],
    outputType: "video",
  },
  {
    id: "datamosh",
    name: "Datamosh",
    category: "Experimental",
    description: "Intentional MPEG frame corruption removing I-frames to bleed delta vector motion into new scenes.",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Video clip ID" },
      { name: "moshIntensity", type: "number", required: false, default: 0.8 },
    ],
    outputType: "video",
  },
  {
    id: "3d-model-visualizer",
    name: "3D Model Visualizer",
    category: "Experimental",
    description: "Project AI video textures onto 3D geometric primitives (spheres, cubes, toruses, topography meshes).",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Video clip ID" },
      { name: "meshType", type: "string", required: false, enum: ["sphere", "torus", "hypercube", "topography_mesh"], default: "sphere" },
    ],
    outputType: "video",
  },
  {
    id: "scout-360",
    name: "Scout360",
    category: "Experimental",
    description: "Synthesize 360° equirectangular panoramic environments for virtual filmmaking location scouting and VR backgrounds.",
    inputs: [
      { name: "environmentPrompt", type: "string", required: true, description: "Description of the 360 location" },
    ],
    outputType: "image",
  },
  {
    id: "ribbit",
    name: "Ribbit",
    category: "Experimental",
    description: "Audio-reactive procedural visual modulation where sound amplitudes and frequencies deform shapes, lighting, and camera pulses.",
    inputs: [
      { name: "videoClipId", type: "string", required: true, description: "Video clip ID" },
      { name: "audioAssetId", type: "string", required: false, description: "Audio track driving modulation" },
      { name: "frequencyBand", type: "string", required: false, enum: ["bass", "mids", "treble", "full_mix"], default: "bass" },
    ],
    outputType: "video",
  },
  {
    id: "whisk",
    name: "Whisk",
    category: "Experimental",
    description: "Dynamic combinatorial visual blender mixing subject, artistic medium, environment, and mood tokens in real-time.",
    inputs: [
      { name: "subjectToken", type: "string", required: true, description: "Main subject" },
      { name: "mediumToken", type: "string", required: true, description: "Medium (e.g. oil on canvas, 70mm IMAX film, claymation)" },
      { name: "moodToken", type: "string", required: false, description: "Lighting/mood" },
    ],
    outputType: "image",
  },
  {
    id: "pose-text",
    name: "Pose Text",
    category: "Experimental",
    description: "Render stylized typographic letterforms sculpted from human poses, biomechanical silhouettes, or environmental elements.",
    inputs: [
      { name: "text", type: "string", required: true, description: "Word or acronym to form" },
      { name: "poseTheme", type: "string", required: false, enum: ["acrobats", "martial_artists", "cybernetic_figures", "botanical_vines"], default: "acrobats" },
    ],
    outputType: "image",
  },
  {
    id: "3d-face-swap",
    name: "3D Face Swap",
    category: "Experimental",
    description: "Neural face transfer preserving natural expressions, lighting occlusion, and skin subsurface scattering across video frames.",
    inputs: [
      { name: "targetVideoClipId", type: "string", required: true, description: "Video clip containing the target performance" },
      { name: "sourceFaceAssetId", type: "string", required: true, description: "Reference character image for the face" },
      { name: "blendFidelity", type: "number", required: false, default: 0.9 },
    ],
    outputType: "video",
  },
];
