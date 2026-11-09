/**
 * Google Flow Directorial Prompt Compiler & Cinematography Engine
 * Formulates studio-grade cinematic prompts for Veo 3.1 & Omni 1.2 Flash
 */

export const CAMERA_MOTIONS = {
  DOLLY_IN: "slow dolly-in moving steadily toward the subject",
  DOLLY_OUT: "smooth dolly-out pulling back to reveal the expanding environment",
  CRANE_DOWN: "high crane shot swooping down to subject eye-level",
  CRANE_UP: "crane shot elevating into an expansive aerial perspective",
  TRUCK_LEFT: "lateral tracking truck shot gliding smoothly to the left",
  TRUCK_RIGHT: "lateral tracking truck shot gliding smoothly to the right",
  ORBIT_360: "360-degree seamless circular orbit around the subject",
  TRACKING_RUN: "dynamic forward tracking shot pacing alongside the moving subject",
  STEADICAM_GLIDE: "floating steadicam shot smoothly navigating through the space",
  HANDHELD_CINEMA: "subtle realistic handheld camera motion with organic micro-shakes",
  FPV_DRONE: "high-speed acrobatic FPV drone dive carving through the environment",
  DUTCH_ANGLE_ROLL: "dramatic slow Dutch tilt camera roll creating psychological tension",
  CRASH_ZOOM: "rapid snap zoom pushing directly into a high-intensity focal point",
  STATIC_LOCK: "rock-solid tripod locked-off static shot focusing on interior motion",
};

export const FRAMINGS = {
  EXTREME_CLOSE_UP: "extreme close-up macro framing capturing micro-expressions and surface details",
  CLOSE_UP: "intimate close-up framing focusing on facial emotion and nuanced gaze",
  MEDIUM_CLOSE_UP: "medium close-up framing from the chest up with shallow depth of field",
  MEDIUM_SHOT: "standard cinematic medium shot framed from the waist up",
  COWBOY_SHOT: "cowboy shot framed from mid-thigh up conveying confidence and stance",
  FULL_SHOT: "full body shot capturing complete character posture, wardrobe, and immediate surroundings",
  WIDE_SHOT: "wide establishing shot balancing subject action within the broader environment",
  EXTREME_WIDE: "extreme wide panoramic landscape shot emphasizing immense scale and atmosphere",
  BIRD_EYE: "direct top-down 90-degree bird's-eye view looking straight down",
  LOW_ANGLE: "dramatic low-angle hero perspective looking upward with imposing stature",
  OVER_THE_SHOULDER: "cinematic over-the-shoulder (OTS) composition looking past a foreground silhouette",
};

export const LIGHTINGS = {
  GOLDEN_HOUR: "warm low-angled golden hour sunlight with long atmospheric shadows and soft amber haze",
  BLUE_HOUR: "cool ambient twilight blue hour with soft diffused dusk illumination",
  CHIAROSCURO: "high-contrast chiaroscuro lighting with sharp cuts between deep noir shadow and bright directional illumination",
  VOLUMETRIC_GOD_RAYS: "dense atmospheric haze pierced by dramatic volumetric God rays of sunlight",
  NEON_CYBERPUNK: "vibrant saturated neon edge-lights in electric cyan, magenta, and amber reflecting off wet pavement",
  DIFFUSE_SOFTBOX: "soft wrap-around studio lighting with silky graduated highlights and clean shadow rolloff",
  BIOLUMINESCENT: "eerie ethereal bioluminescent glow emanating from organic elements in darkness",
  CANDLELIGHT: "intimate warm flickering candlelight with soft falloff and natural orange warmth",
  HARSH_MIDDAY: "unforgiving direct vertical midday sunlight creating sharp crisp silhouettes",
};

export const OPTICS = {
  ANAMORPHIC: "anamorphic cinema lens with horizontal blue streak flares, oval bokeh, and subtle edge aberration",
  PORTRAIT_85MM: "85mm prime lens at f/1.4 with creamy defocused background separation",
  WIDE_35MM: "35mm focal length rendering natural human-eye perspective with minimal geometric distortion",
  ULTRA_WIDE_16MM: "16mm ultra-wide cine lens with dynamic corner perspective stretching",
  TELEPHOTO_135MM: "135mm telephoto lens with compressed background depth bringing distant layers close",
  VINTAGE_KODAK: "shot on 35mm Kodak 5219 film stock with authentic photochemical grain and gentle highlight halation",
};

/**
 * Directorial Prompt Builder
 */
export function buildCinematicPrompt({
  subjectAndAction,
  environment,
  lighting,
  cameraMotion,
  framing,
  optics,
  audioSoundscape,
  characters = [],
  ingredients = [],
  styleModifiers = [],
}) {
  let parts = [];

  // 1. Subject & Action with @character references
  let subjectText = subjectAndAction.trim();
  if (characters && characters.length > 0) {
    const characterRefs = characters.map((c) => (c.startsWith("@") ? c : `@${c}`)).join(", ");
    subjectText = `${subjectText} [Featuring ${characterRefs}]`;
  }
  parts.push(subjectText);

  // 2. Environment & Atmosphere
  if (environment) {
    parts.push(`Environment: ${environment.trim()}`);
  }

  // 3. Lighting setup
  const lightDesc = LIGHTINGS[lighting] || lighting;
  if (lightDesc) {
    parts.push(`Lighting: ${lightDesc}`);
  }

  // 4. Camera Framing & Movement
  const framingDesc = FRAMINGS[framing] || framing;
  const motionDesc = CAMERA_MOTIONS[cameraMotion] || cameraMotion;
  const cameraSpecs = [framingDesc, motionDesc].filter(Boolean).join(", ");
  if (cameraSpecs) {
    parts.push(`Camera: ${cameraSpecs}`);
  }

  // 5. Optics and Film Stock
  const opticsDesc = OPTICS[optics] || optics;
  if (opticsDesc) {
    parts.push(`Optics: ${opticsDesc}`);
  }

  // 6. Ingredients references
  if (ingredients && ingredients.length > 0) {
    const ingredientRefs = ingredients.map((i) => (i.startsWith("@") ? i : `@${i}`)).join(" ");
    parts.push(`Assets: ${ingredientRefs}`);
  }

  // 7. Style Modifiers
  if (styleModifiers && styleModifiers.length > 0) {
    parts.push(`Style: ${styleModifiers.join(", ")}`);
  }

  // 8. Audio Soundscape directive (Flow audio syntax)
  if (audioSoundscape) {
    parts.push(`[Audio: ${audioSoundscape.trim()}]`);
  }

  return parts.join(" | ");
}
