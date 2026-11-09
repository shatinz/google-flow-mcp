# Google Flow MCP Server 🎬🚀
> **Model Context Protocol (MCP) server turning any connected AI agent into a complete, full-fledged AI video production studio powered by Google Flow (`flow.google.com`).**

---

## 🌟 Overview

**Google Flow MCP** bridges the entire Google Flow video creation ecosystem to AI agents via the standard Model Context Protocol. When connected, an agent is empowered as an end-to-end film director, cinematographer, editor, and producer with deep control over:

* **Video Model Fleet:** Google DeepMind's flagship `Veo 3.1 - Quality`, `Veo 3.1 - Fast`, `Veo 3.1 - Lite`, `Omni 1.2 Flash`, and `Omni 1.1 Flash`.
* **Image Synthesis Suite:** `🍌 Nano Banana Pro`, `🍌 Nano Banana 2 Lite`, and `🍌 Nano Banana 2.1` with multi-level reasoning (`Low`, `Medium`, `High - Extra thorough`).
* **Generation Modes:**
  * **Text/Ingredient-to-Video:** Directional prompt syntax incorporating `@character` visual anchors and `@ingredient` references.
  * **Frames Mode (Keyframe Interpolation):** Seamless motion transformation between Start Frame and End Frame with swap controls.
  * **Conversational Timeline Editing:** Natural language video modification & inpainting using Flow's internal `macaron_cookie_edit` architecture.
* **Aspect Ratios & Dimensions:** Cinematic `16:9`, Vertical `9:16` (Reels/Shorts/TikTok), Square `1:1`, Classic `4:3`, and Editorial `3:4`.
* **Scene Builder (`/scene`):** Multi-track timeline sequencing, clip ordering, in/out point trimming, frame extraction, and master render compilation.
* **Character Consistency Studio (`/character`):** 6 archetype presets (`The Eccentric`, `The Professional`, `The Wildcard`, `The Familiar`, `The Wicked`, `The Fantastical`) and 4-angle character consistency sheets.
* **34 Built-in Micro-Tools:** Image, Video, Prompting, and Experimental tool suites (Shader Effects, Transition Machine, pixelBento, Type Overlays, Storyboard Studio, Datamosh, etc.).
* **AI Tool Creator (`/create-tool`):** Natural language micro-tool synthesizer with zero credit cost.
* **Studio Export & Distribution:** Multi-tier downloads (`270p Animated GIF`, `720p Original size`, `1080p Upscaled`, `4K Upscaled`), Project ZIP archives, and direct YouTube publishing.

---

## 📦 Installation & Setup

### Prerequisites
* **Node.js** v18.0.0 or higher (Tested on Node.js v24)
* **npm** v9.0.0 or higher

### Installation
```bash
git clone https://github.com/shatinz/google-flow-mcp.git
cd google-flow-mcp
npm install
```

---

## 🔌 Connecting to MCP Hosts

### 1. Antigravity IDE (`agy`)
Add to your Antigravity global (`~/.gemini/antigravity/mcp_config.json`) or workspace configuration:
```json
{
  "mcpServers": {
    "google-flow": {
      "command": "node",
      "args": ["<absolute-path-to-repo>/google-flow-mcp/src/index.js"]
    }
  }
}
```

### 2. Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "google-flow": {
      "command": "node",
      "args": ["<absolute-path-to-repo>/google-flow-mcp/src/index.js"]
    }
  }
}
```

### 3. Cursor / Cline / Windsurf
Add as a stdio server:
* Command: `node`
* Args: `["<absolute-path-to-repo>/google-flow-mcp/src/index.js"]`

---

## 🛠️ Complete MCP Tool Reference (33 Tools)

### 1. Projects Management
| Tool | Description |
| :--- | :--- |
| `flow_list_projects` | List all user video projects, covers, clip counts, and last modified dates. |
| `flow_create_project` | Create a new filmmaking workspace with default aspect ratio and model. |
| `flow_get_project` | Retrieve full project details, including clips, timeline scenes, and settings. |
| `flow_delete_project` | Delete a project from Google Flow. |
| `flow_set_project_cover` | Set a specific clip or keyframe thumbnail as the project cover. |

### 2. Studio Preferences & Credits
| Tool | Description |
| :--- | :--- |
| `flow_get_studio_settings` | Get current layout (`grid`/`batch`), tile sizes (`S`/`M`/`L`), and credit ledger. |
| `flow_update_studio_settings` | Toggle sound on hover, silent video generation, prompt auto-clear, and tile details. |

### 3. Directorial Prompt Compiler
| Tool | Description |
| :--- | :--- |
| `flow_build_cinematic_prompt` | Directorial prompt compiler with camera motions (Dolly In, Steadicam Glide, Crane, Orbit 360, FPV Drone), framings (ECU, MCU, Wide, Cowboy), lighting setups (Chiaroscuro, Golden Hour, Neon Cyberpunk, Volumetric Rays), optics (Anamorphic, 85mm f/1.4, Kodak 5219), and Flow `[Audio: ...]` syntax. |

### 4. Video Generation & Inpainting
| Tool | Description |
| :--- | :--- |
| `flow_generate_video` | Core video synthesis using `Veo 3.1 - Quality`, `Veo 3.1 - Fast`, `Veo 3.1 - Lite`, or `Omni 1.2 Flash` with duration (1-15s) and variation controls (`x1` to `x4`). |
| `flow_generate_video_frames` | Frames Mode: Keyframe interpolation between Start Frame and End Frame with swap toggle and metamorphosis prompt. |
| `flow_conversational_edit_clip` | Natural language timeline clip editing & inpainting (`macaron_cookie_edit` / `Omni 1.2 Flash`). |

### 5. Image Generation (Nano Banana)
| Tool | Description |
| :--- | :--- |
| `flow_generate_image` | Image synthesis using `🍌 Nano Banana Pro`, `🍌 Nano Banana 2 Lite`, or `🍌 Nano Banana 2.1` with thinking levels (`Low`, `Medium`, `High - Extra thorough`). |

### 6. Ingredients Drawer & Asset Ingestion
| Tool | Description |
| :--- | :--- |
| `flow_list_ingredients` | Filter assets across category tabs (`all`, `images`, `videos`, `voices`, `characters`, `uploads`). |
| `flow_upload_ingredient` | Register new media assets into the project library. |
| `flow_trim_ingredient` | Precision in/out trimming (`trim_start`, `trim_end`) for video and audio ingredients. |

### 7. Character Consistency Studio
| Tool | Description |
| :--- | :--- |
| `flow_list_characters` | List all persistent character identities. |
| `flow_create_character` | Create character with archetype (`The Eccentric`, `The Professional`, `The Wildcard`, `The Familiar`, `The Wicked`, `The Fantastical`), costume specs, and bio. |
| `flow_generate_character_sheet` | Generate 4-angle consistency sheet (Front, 3/4 Profile, Side Silhouette, Macro Expression) to lock character identity across generations. |

### 8. Scene Builder & Timeline Sequencing
| Tool | Description |
| :--- | :--- |
| `flow_list_scenes` | List timeline scenes in a project. |
| `flow_create_scene` | Create a new timeline sequence in Scene Builder. |
| `flow_get_scene_timeline` | Inspect timeline tracks, clip sequence order, timecodes, and transitions. |
| `flow_add_clip_to_scene` | Add video clips with start time, in/out trimming, and transition types. |
| `flow_reorder_clips` | Reorder clip sequencing on the timeline. |
| `flow_trim_timeline_clip` | Adjust clip in/out trim points directly on the scene timeline. |
| `flow_save_scene_frame` | Extract a full-resolution keyframe at any timecode point and register it as an ingredient. |
| `flow_render_scene` | Compile and render the multi-clip sequence into a master cut. |

### 9. Flow Micro-Tools (All 34 Cataloged) & AI Tool Creator
| Tool | Description |
| :--- | :--- |
| `flow_list_internal_tools` | List all 34 internal Flow tools across Image (8), Video (10), Prompting (5), and Experimental (11) categories. |
| `flow_call_internal_tool` | Execute any Flow micro-tool (e.g. `shader-effects`, `type-overlays`, `transition-machine`, `pixel-bento`, `video-resizer`, `storyboard-studio`, `character-xray`, `depthwarp-4d`, `datamosh`). |
| `flow_create_custom_tool` | Synthesize new custom tools using natural language or presets (`image-filter`, `style-morph`, `voice-over`, `time-stretcher`) at zero credit cost. |

### 10. Video Export & Distribution
| Tool | Description |
| :--- | :--- |
| `flow_download_video` | Download in `270p Animated GIF`, `720p Original size`, `1080p Upscaled`, or `4K Upscaled`. |
| `flow_download_project_zip` | Download complete project archive as a `.ZIP` containing all clips, character sheets, and manifests. |
| `flow_publish_to_youtube` | Direct export & publishing to YouTube with title, description, tags, and privacy settings. |
| `flow_share_video` | Generate shareable web links and responsive embed iframes. |

---

## 🎨 Catalog of the 34 Google Flow Micro-Tools

### Image Tools (8)
* `simple-sketch`: Turn rough hand-drawn doodles or line drawings into photoreal cinematic frames.
* `scene-explorer`: Explore alternate camera angles and perspectives of an existing scene image.
* `mockup`: Project generated artwork onto 3D merchandise, billboards, devices, and packaging.
* `image-editor`: Inpainting, selective object removal, and color-grade balancing.
* `shot-explorer`: Generate directorial coverage packs (extreme wide, medium, close-up, Dutch angle).
* `mask-magic`: Semantic segmentation and alpha mask isolation for actors, props, and sky.
* `converge`: Blend visual motifs, textures, and lighting from two reference images into one.
* `grid-architect`: Create multi-panel comic book layouts or 4-panel storyboard grids.

### Video Tools (10)
* `shader-effects`: WebGL post-processing shaders (chromatic aberration, VHS retro, CRT scanlines, dream bloom).
* `type-overlays`: Animated typographic titles, lower thirds, and credit sequences.
* `pixel-bento`: Retro 8-bit, 16-bit, and voxel video transformations.
* `poster-designer`: Selects striking keyframes and designs theatrical film posters with billing blocks.
* `video-sketch`: Rotoscope video into pencil sketches, charcoal drawings, or watercolor paintings.
* `transition-machine`: AI-driven seamless morphological transitions and whip pans between two clips.
* `weirdcore`: Surreal dreamcore and liminal space aesthetic synthesis.
* `video-resizer`: Content-aware AI reframing between aspect ratios (16:9 to 9:16 vertical).
* `stringout-creator`: Quick assembly of selected clips into a continuous rough cut with normalized audio.
* `video-granulator`: 35mm/16mm Kodak 500T film grain simulation and optical halation.

### Prompting Tools (5)
* `character-xray`: Deep visual anchors, silhouette specs, and costume dossiers.
* `style-writer`: Translates aesthetic concepts into Veo and Omni prompt modifiers.
* `storyboard-studio`: Translates script synopses into shot-by-shot sequence plans.
* `prompt-tree`: Generates 4 diverse visual branches from 1 core concept.
* `story-sketch`: 3-act narrative beat sheets with lighting and camera setup recommendations.

### Experimental Tools (11)
* `frame-deconstructor`: Extracts foreground, midground, background layers, and optical flow passes.
* `blob-tracking`: 3D spatial feature tracks to anchor virtual lights or text onto moving actors.
* `depthwarp-4d`: Stereoscopic 3D camera pushes and Vertigo dolly zooms from a 2D still.
* `webcam-set`: Live performance capture driving AI character avatars.
* `datamosh`: Intentional MPEG frame corruption and delta motion bleeding.
* `3d-model-visualizer`: Projects AI video textures onto 3D geometric meshes.
* `scout-360`: 360° equirectangular panoramic virtual location scouting.
* `ribbit`: Audio-reactive procedural visual modulation.
* `whisk`: Combinatorial visual blender mixing subject, medium, and mood tokens.
* `pose-text`: Typographic letterforms sculpted from human poses and silhouettes.
* `3d-face-swap`: Identity transfer preserving natural expressions and skin subsurface scattering.

---

## 🎬 Example Director Workflow: 30s Commercial Promo

```javascript
// 1. Create a Project
const project = await callTool("flow_create_project", {
  title: "Aura Smartwatch - The Dawn of Biometrics",
  description: "Kinetic commercial promo for luxury biometric wearable",
  aspectRatio: "16:9",
  defaultModel: "Veo 3.1 - Quality"
});

// 2. Lock Character Consistency
const hero = await callTool("flow_create_character", {
  name: "Dr. Kaelen Cruz",
  archetype: "The Professional",
  bio: "Lead neuro-engineer in matte charcoal minimalist attire with piercing gaze."
});

// 3. Compile Cinematography Prompt
const prompt = await callTool("flow_build_cinematic_prompt", {
  subjectAndAction: "Dr. Cruz taps holographic interface on wrist bracer, biometric data pulses outward",
  environment: "High-altitude glass laboratory at dusk overlooking cloud layer",
  lighting: "VOLUMETRIC_GOD_RAYS",
  cameraMotion: "DOLLY_IN",
  framing: "MEDIUM_CLOSE_UP",
  optics: "PORTRAIT_85MM",
  audioSoundscape: "subtle high-frequency data hum, soft orchestral swell",
  characters: ["@kaelencruz"]
});

// 4. Generate Video Clip
const video = await callTool("flow_generate_video", {
  projectId: project.id,
  prompt: prompt.compiledPrompt,
  model: "Veo 3.1 - Quality",
  durationSeconds: 5,
  variations: 2
});

// 5. Assemble Sequence in Scene Builder
const scene = await callTool("flow_create_scene", {
  projectId: project.id,
  title: "Commercial Master Cut"
});

await callTool("flow_add_clip_to_scene", {
  sceneId: scene.id,
  clipId: video.clips[0].id,
  title: "Hero Reveal Shot"
});

// 6. Apply Shader Effects & Render Master
await callTool("flow_call_internal_tool", {
  toolId: "shader-effects",
  parameters: {
    videoClipId: video.clips[0].id,
    shaderType: "film_halation",
    intensity: 0.6
  }
});

const render = await callTool("flow_render_scene", {
  sceneId: scene.id,
  resolution: "4K"
});

// 7. Download in 4K
const download = await callTool("flow_download_video", {
  clipIdOrRenderId: render.renderId,
  format: "4K Upscaled"
});
```

---

## 🧪 Testing

Run the full verification test suite (covers all 10 domain areas and 28 assertions):
```bash
npm test
```

Test MCP stdio protocol handshakes:
```bash
node src/test/mcp-client-test.js
```

---

## 📄 License
Apache-2.0. Built with Google DeepMind & Google Flow architecture specifications.
