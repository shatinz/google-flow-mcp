import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { projectManager } from "./services/project-manager.js";
import { studioSettings } from "./services/studio-settings.js";
import { buildCinematicPrompt } from "./services/cinematography.js";
import { videoGenerator } from "./services/video-generator.js";
import { imageGenerator } from "./services/image-generator.js";
import { ingredientManager } from "./services/ingredient-manager.js";
import { characterStudio } from "./services/character-studio.js";
import { sceneBuilder } from "./services/scene-builder.js";
import { internalToolsService } from "./services/internal-tools.js";
import { exportService } from "./services/export-service.js";

export function createServer() {
  const server = new Server(
    {
      name: "google-flow-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // -------------------------------------------------------------
  // TOOLS REGISTRATION
  // -------------------------------------------------------------
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        // 1. Projects
        {
          name: "flow_list_projects",
          description: "List all user video filmmaking projects in Google Flow studio.",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "flow_create_project",
          description: "Create a new filmmaking project in Google Flow.",
          inputSchema: {
            type: "object",
            properties: {
              title: { type: "string", description: "Title of the project" },
              description: { type: "string", description: "Creative synopsis or project description" },
              aspectRatio: { type: "string", enum: ["16:9", "9:16", "1:1", "4:3", "3:4"], default: "16:9" },
              defaultModel: { type: "string", enum: ["Omni 1.2 Flash", "Omni 1.1 Flash", "Veo 3.1 - Quality", "Veo 3.1 - Fast", "Veo 3.1 - Lite"], default: "Omni 1.2 Flash" },
            },
            required: ["title"],
          },
        },
        {
          name: "flow_get_project",
          description: "Retrieve complete project details including all generated clips, scenes, and settings.",
          inputSchema: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Project unique ID" },
            },
            required: ["projectId"],
          },
        },
        {
          name: "flow_delete_project",
          description: "Delete a project from Google Flow studio.",
          inputSchema: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Project ID to delete" },
            },
            required: ["projectId"],
          },
        },
        {
          name: "flow_set_project_cover",
          description: "Set a specific image or clip thumbnail as the project cover.",
          inputSchema: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Project ID" },
              coverUrl: { type: "string", description: "URL or asset path for the cover" },
            },
            required: ["projectId", "coverUrl"],
          },
        },

        // 2. Studio Settings
        {
          name: "flow_get_studio_settings",
          description: "Inspect current Google Flow studio settings, layout, and Google One AI credit balance.",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "flow_update_studio_settings",
          description: "Configure Google Flow studio preferences (grid vs batch layout, thumbnail size, audio toggles).",
          inputSchema: {
            type: "object",
            properties: {
              layout: { type: "string", enum: ["grid", "batch"], description: "Studio view layout" },
              thumbnailSize: { type: "string", enum: ["S", "M", "L"], description: "Tile thumbnail size" },
              soundOnHover: { type: "boolean", description: "Play audio automatically on video card hover" },
              returnSilentVideos: { type: "boolean", description: "Default to silent video generations" },
              clearPromptOnSubmit: { type: "boolean", description: "Clear prompt bar after triggering generation" },
              showTileDetails: { type: "boolean", description: "Display resolution and model overlay on tiles" },
            },
          },
        },

        // 3. Directorial Cinematography Compiler
        {
          name: "flow_build_cinematic_prompt",
          description: "Compile a director-grade cinematic prompt formatted specifically for Google Veo 3.1 & Omni 1.2 Flash with precise camera motions, framings, lighting, and audio soundscapes.",
          inputSchema: {
            type: "object",
            properties: {
              subjectAndAction: { type: "string", description: "Core subject action (e.g. 'Cyberpunk courier runs across wet bridge')" },
              environment: { type: "string", description: "Setting and atmosphere (e.g. 'Neo-Tokyo night, glowing holographic billboards')" },
              lighting: {
                type: "string",
                enum: [
                  "GOLDEN_HOUR", "BLUE_HOUR", "CHIAROSCURO", "VOLUMETRIC_GOD_RAYS",
                  "NEON_CYBERPUNK", "DIFFUSE_SOFTBOX", "BIOLUMINESCENT", "CANDLELIGHT", "HARSH_MIDDAY"
                ],
                description: "Cinematic lighting setup",
              },
              cameraMotion: {
                type: "string",
                enum: [
                  "DOLLY_IN", "DOLLY_OUT", "CRANE_DOWN", "CRANE_UP", "TRUCK_LEFT", "TRUCK_RIGHT",
                  "ORBIT_360", "TRACKING_RUN", "STEADICAM_GLIDE", "HANDHELD_CINEMA", "FPV_DRONE",
                  "DUTCH_ANGLE_ROLL", "CRASH_ZOOM", "STATIC_LOCK"
                ],
                description: "Camera motion direction",
              },
              framing: {
                type: "string",
                enum: [
                  "EXTREME_CLOSE_UP", "CLOSE_UP", "MEDIUM_CLOSE_UP", "MEDIUM_SHOT",
                  "COWBOY_SHOT", "FULL_SHOT", "WIDE_SHOT", "EXTREME_WIDE", "BIRD_EYE",
                  "LOW_ANGLE", "OVER_THE_SHOULDER"
                ],
                description: "Shot framing size and perspective",
              },
              optics: {
                type: "string",
                enum: ["ANAMORPHIC", "PORTRAIT_85MM", "WIDE_35MM", "ULTRA_WIDE_16MM", "TELEPHOTO_135MM", "VINTAGE_KODAK"],
                description: "Lens optics and film stock",
              },
              audioSoundscape: { type: "string", description: "Soundtrack/SFX directive (e.g. 'rhythmic synth pulse, rain on pavement')" },
              characters: { type: "array", items: { type: "string" }, description: "Array of @character tags to anchor" },
              ingredients: { type: "array", items: { type: "string" }, description: "Array of @ingredient tags to incorporate" },
              styleModifiers: { type: "array", items: { type: "string" }, description: "Style tokens (e.g. '4K filmic look', 'Kodak 5219')" },
            },
            required: ["subjectAndAction"],
          },
        },

        // 4. Video Generation Engine
        {
          name: "flow_generate_video",
          description: "Generate video clips using Google Flow's flagship models (Omni 1.2 Flash, Veo 3.1 Quality, Veo 3.1 Fast, Veo 3.1 Lite).",
          inputSchema: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Target project ID" },
              prompt: { type: "string", description: "Cinematic video generation prompt" },
              model: {
                type: "string",
                enum: ["Omni 1.2 Flash", "Omni 1.1 Flash", "Veo 3.1 - Quality", "Veo 3.1 - Fast", "Veo 3.1 - Lite"],
                default: "Omni 1.2 Flash",
                description: "Flow video model family",
              },
              aspectRatio: {
                type: "string",
                enum: ["16:9", "9:16", "1:1", "4:3", "3:4"],
                default: "16:9",
                description: "Target video aspect ratio",
              },
              durationSeconds: { type: "number", minimum: 1, maximum: 15, default: 5, description: "Video duration length" },
              variations: { type: "number", enum: [1, 2, 3, 4], default: 2, description: "Number of parallel video variants (x1 to x4)" },
              ingredients: { type: "array", items: { type: "string" }, description: "Ingredient IDs or @character handles attached" },
              seed: { type: "number", description: "Optional generation seed for reproducible motion" },
            },
            required: ["prompt"],
          },
        },
        {
          name: "flow_generate_video_frames",
          description: "Keyframe interpolation / Frames mode: synthesizes seamless cinematic motion between a Start Frame and an End Frame with transition prompt.",
          inputSchema: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Project ID" },
              startFrameId: { type: "string", description: "Asset ID of the opening keyframe image" },
              endFrameId: { type: "string", description: "Asset ID of the concluding keyframe image" },
              transitionPrompt: { type: "string", description: "Description of the dynamic transformation between the frames" },
              swapFrames: { type: "boolean", default: false, description: "Swap first and last frames toggle" },
              model: { type: "string", default: "Omni 1.2 Flash" },
              aspectRatio: { type: "string", default: "16:9" },
              durationSeconds: { type: "number", default: 5 },
              variations: { type: "number", default: 2 },
            },
            required: ["startFrameId", "endFrameId", "transitionPrompt"],
          },
        },
        {
          name: "flow_conversational_edit_clip",
          description: "Conversational video clip editing & inpainting in Google Flow using the 'macaron_cookie_edit' / Omni 1.2 Flash architecture.",
          inputSchema: {
            type: "object",
            properties: {
              clipId: { type: "string", description: "Video clip ID to edit" },
              editInstruction: { type: "string", description: "Natural language edit prompt (e.g. 'change jacket to red leather', 'add rain pouring')" },
              inpaintMaskRegion: { type: "string", description: "Optional spatial mask region or target object" },
            },
            required: ["clipId", "editInstruction"],
          },
        },

        // 5. Image Generation (Nano Banana suite)
        {
          name: "flow_generate_image",
          description: "Generate still images, storyboards, or concept art in Google Flow using the Nano Banana model suite.",
          inputSchema: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Target project ID" },
              prompt: { type: "string", description: "Image generation prompt" },
              model: {
                type: "string",
                enum: ["🍌 Nano Banana Pro", "🍌 Nano Banana 2 Lite", "🍌 Nano Banana 2.1"],
                default: "🍌 Nano Banana Pro",
              },
              aspectRatio: { type: "string", enum: ["16:9", "9:16", "1:1", "4:3", "3:4"], default: "16:9" },
              thinkingLevel: { type: "string", enum: ["Low", "Medium", "High - Extra thorough"], default: "High - Extra thorough" },
              variations: { type: "number", enum: [1, 2, 3, 4], default: 2 },
              seed: { type: "number" },
            },
            required: ["prompt"],
          },
        },

        // 6. Ingredients Drawer & Asset Management
        {
          name: "flow_list_ingredients",
          description: "List assets in the Ingredients Drawer, filtered by tab category (all, images, videos, voices, characters, uploads).",
          inputSchema: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Filter by project ID" },
              tab: { type: "string", enum: ["all", "images", "videos", "voices", "characters", "uploads"], default: "all" },
              searchQuery: { type: "string", description: "Search query for asset name or tags" },
            },
          },
        },
        {
          name: "flow_upload_ingredient",
          description: "Add an external or generated media asset to the Ingredients Drawer.",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "Ingredient display name" },
              type: { type: "string", enum: ["image", "video", "voice", "character", "upload"], description: "Asset type" },
              projectId: { type: "string", description: "Project ID" },
              mediaUrl: { type: "string", description: "URL or path of the media file" },
              tags: { type: "array", items: { type: "string" }, description: "Tags for categorization" },
              durationSeconds: { type: "number", description: "Duration for video/audio assets" },
              aspectRatio: { type: "string", default: "16:9" },
            },
            required: ["name", "type"],
          },
        },
        {
          name: "flow_trim_ingredient",
          description: "Adjust in/out trimming points (Trim start, Trim end) on an ingredient asset.",
          inputSchema: {
            type: "object",
            properties: {
              ingredientId: { type: "string", description: "Asset ID" },
              trimStart: { type: "number", description: "Start timecode in seconds" },
              trimEnd: { type: "number", description: "End timecode in seconds" },
            },
            required: ["ingredientId"],
          },
        },

        // 7. Character Consistency Studio
        {
          name: "flow_list_characters",
          description: "List all persistent characters created in Character Studio.",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "flow_create_character",
          description: "Create a persistent character with locked visual consistency across scenes using Flow archetypes.",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "Character name (e.g. 'Elena Vance')" },
              archetype: {
                type: "string",
                enum: [
                  "The Eccentric",
                  "The Professional",
                  "The Wildcard",
                  "The Familiar",
                  "The Wicked",
                  "The Fantastical",
                ],
                default: "The Professional",
                description: "Character archetype starter preset",
              },
              bio: { type: "string", description: "Detailed physical description and role" },
              costumeSpecs: { type: "string", description: "Wardrobe, materials, and accessories specifications" },
              referenceImages: { type: "array", items: { type: "string" }, description: "Reference image URLs" },
              modelFamily: { type: "string", default: "Veo 3.1 - Quality" },
            },
            required: ["name", "bio"],
          },
        },
        {
          name: "flow_generate_character_sheet",
          description: "Generate a multi-angle consistency reference sheet (front, 3/4 hero profile, side silhouette, macro expression) for a character.",
          inputSchema: {
            type: "object",
            properties: {
              characterId: { type: "string", description: "Character ID or @tag" },
            },
            required: ["characterId"],
          },
        },

        // 8. Scene Builder & Timeline Sequencing
        {
          name: "flow_list_scenes",
          description: "List all timeline scenes in a project.",
          inputSchema: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Project ID" },
            },
          },
        },
        {
          name: "flow_create_scene",
          description: "Create a new timeline sequence in Scene Builder.",
          inputSchema: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Project ID" },
              title: { type: "string", description: "Scene sequence title" },
              aspectRatio: { type: "string", enum: ["16:9", "9:16"], default: "16:9" },
            },
            required: ["title"],
          },
        },
        {
          name: "flow_get_scene_timeline",
          description: "Retrieve complete timeline track layout, sequenced clips, timecodes, and transitions for a scene.",
          inputSchema: {
            type: "object",
            properties: {
              sceneId: { type: "string", description: "Scene unique ID" },
            },
            required: ["sceneId"],
          },
        },
        {
          name: "flow_add_clip_to_scene",
          description: "Add a video clip to a scene timeline.",
          inputSchema: {
            type: "object",
            properties: {
              sceneId: { type: "string", description: "Scene ID" },
              clipId: { type: "string", description: "Video clip ID" },
              title: { type: "string", description: "Clip label" },
              duration: { type: "number", default: 5 },
              inTrim: { type: "number", default: 0 },
              outTrim: { type: "number", default: 5 },
              transitionToNext: { type: "string", enum: ["none", "crossfade", "whip_pan", "morph"], default: "crossfade" },
            },
            required: ["sceneId", "clipId"],
          },
        },
        {
          name: "flow_reorder_clips",
          description: "Reorder the sequence of clips on a scene timeline.",
          inputSchema: {
            type: "object",
            properties: {
              sceneId: { type: "string", description: "Scene ID" },
              orderedClipIds: { type: "array", items: { type: "string" }, description: "Ordered list of clip IDs" },
            },
            required: ["sceneId", "orderedClipIds"],
          },
        },
        {
          name: "flow_trim_timeline_clip",
          description: "Fine-tune in/out trim points of a clip directly on the scene timeline.",
          inputSchema: {
            type: "object",
            properties: {
              sceneId: { type: "string", description: "Scene ID" },
              clipId: { type: "string", description: "Clip ID on the timeline" },
              inTrim: { type: "number", description: "In-point in seconds" },
              outTrim: { type: "number", description: "Out-point in seconds" },
            },
            required: ["sceneId", "clipId"],
          },
        },
        {
          name: "flow_save_scene_frame",
          description: "Extract a full-resolution keyframe at a specific timecode from a scene and save it as an ingredient.",
          inputSchema: {
            type: "object",
            properties: {
              sceneId: { type: "string", description: "Scene ID" },
              timecodeSeconds: { type: "number", default: 0, description: "Timecode point in seconds" },
            },
            required: ["sceneId"],
          },
        },
        {
          name: "flow_render_scene",
          description: "Render and stitch all timeline clips, transitions, and audio mix into a complete master video sequence.",
          inputSchema: {
            type: "object",
            properties: {
              sceneId: { type: "string", description: "Scene ID to render" },
              resolution: { type: "string", enum: ["720p", "1080p", "4K"], default: "1080p" },
              audioMix: { type: "string", enum: ["normalized", "duck_background", "mute"], default: "normalized" },
            },
            required: ["sceneId"],
          },
        },

        // 9. Built-in Micro-Tools & Sub-Tools (All 34 tools)
        {
          name: "flow_list_internal_tools",
          description: "List all 34 built-in Google Flow creative micro-tools categorized by Image, Video, Prompting, and Experimental.",
          inputSchema: {
            type: "object",
            properties: {
              category: { type: "string", enum: ["Image", "Video", "Prompting", "Experimental"], description: "Optional category filter" },
            },
          },
        },
        {
          name: "flow_call_internal_tool",
          description: "Execute any of the 34 Google Flow micro-tools (e.g. 'shader-effects', 'transition-machine', 'type-overlays', 'scene-explorer', 'storyboard-studio', etc.).",
          inputSchema: {
            type: "object",
            properties: {
              toolId: { type: "string", description: "Unique tool ID (e.g. 'shader-effects', 'transition-machine', 'poster-designer')" },
              parameters: { type: "object", description: "Parameters payload expected by the specific tool" },
            },
            required: ["toolId"],
          },
        },

        // 10. AI Tool Creator (/create-tool)
        {
          name: "flow_create_custom_tool",
          description: "Synthesize a new creative AI micro-tool in Google Flow using natural language or presets (free of credit cost).",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "Tool display name" },
              description: { type: "string", description: "What the tool accomplishes" },
              category: { type: "string", default: "Custom" },
              promptTemplate: { type: "string", description: "Prompt transformation template" },
              presetId: { type: "string", enum: ["image-filter", "style-morph", "voice-over", "time-stretcher"], description: "Optional starter preset" },
            },
            required: ["name", "description"],
          },
        },

        // 11. Video Export & Distribution
        {
          name: "flow_download_video",
          description: "Export and download a generated clip or rendered scene in 270p GIF, 720p Original, 1080p Upscaled, or 4K Upscaled.",
          inputSchema: {
            type: "object",
            properties: {
              clipIdOrRenderId: { type: "string", description: "Clip ID or Scene Render ID" },
              format: {
                type: "string",
                enum: ["270p Animated GIF", "720p Original size", "1080p Upscaled", "4K Upscaled"],
                default: "1080p Upscaled",
                description: "Export resolution format",
              },
              qualityProfile: { type: "string", enum: ["draft", "cinema", "lossless"], default: "cinema" },
            },
            required: ["clipIdOrRenderId"],
          },
        },
        {
          name: "flow_download_project_zip",
          description: "Download entire project archive as a .ZIP package including all video clips, ingredients, character sheets, and manifests.",
          inputSchema: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Project ID to archive" },
            },
            required: ["projectId"],
          },
        },
        {
          name: "flow_publish_to_youtube",
          description: "Export and publish video clip or scene directly to YouTube.",
          inputSchema: {
            type: "object",
            properties: {
              videoClipId: { type: "string", description: "Video clip or render ID" },
              title: { type: "string", description: "YouTube video title" },
              description: { type: "string", description: "YouTube video description" },
              tags: { type: "array", items: { type: "string" }, description: "Tags for video discovery" },
              privacy: { type: "string", enum: ["public", "unlisted", "private"], default: "unlisted" },
            },
            required: ["videoClipId", "title"],
          },
        },
        {
          name: "flow_share_video",
          description: "Generate a public shareable preview link and embed iframe for a video clip.",
          inputSchema: {
            type: "object",
            properties: {
              videoClipId: { type: "string", description: "Video clip ID" },
            },
            required: ["videoClipId"],
          },
        },
      ],
    };
  });

  // -------------------------------------------------------------
  // TOOL EXECUTION DISPATCHER
  // -------------------------------------------------------------
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result;
      switch (name) {
        // Projects
        case "flow_list_projects":
          result = projectManager.listProjects();
          break;
        case "flow_create_project":
          result = projectManager.createProject(args);
          break;
        case "flow_get_project":
          result = projectManager.getProject(args.projectId);
          break;
        case "flow_delete_project":
          result = projectManager.deleteProject(args.projectId);
          break;
        case "flow_set_project_cover":
          result = projectManager.updateProjectCover(args.projectId, args.coverUrl);
          break;

        // Settings
        case "flow_get_studio_settings":
          result = studioSettings.getSettings();
          break;
        case "flow_update_studio_settings":
          result = studioSettings.updateSettings(args);
          break;

        // Cinematography
        case "flow_build_cinematic_prompt":
          result = {
            compiledPrompt: buildCinematicPrompt(args),
            parametersUsed: args,
          };
          break;

        // Video
        case "flow_generate_video":
          result = videoGenerator.generateVideo(args);
          break;
        case "flow_generate_video_frames":
          result = videoGenerator.generateVideoFrames(args);
          break;
        case "flow_conversational_edit_clip":
          result = videoGenerator.conversationalEditClip(args);
          break;

        // Image
        case "flow_generate_image":
          result = imageGenerator.generateImage(args);
          break;

        // Ingredients
        case "flow_list_ingredients":
          result = ingredientManager.listIngredients(args);
          break;
        case "flow_upload_ingredient":
          result = ingredientManager.addIngredient(args);
          break;
        case "flow_trim_ingredient":
          result = ingredientManager.trimIngredient(args.ingredientId, args);
          break;

        // Character Studio
        case "flow_list_characters":
          result = characterStudio.listCharacters();
          break;
        case "flow_create_character":
          result = characterStudio.createCharacter(args);
          break;
        case "flow_generate_character_sheet":
          result = characterStudio.generateCharacterSheet(args.characterId);
          break;

        // Scene Builder
        case "flow_list_scenes":
          result = sceneBuilder.listScenes(args.projectId);
          break;
        case "flow_create_scene":
          result = sceneBuilder.createScene(args);
          break;
        case "flow_get_scene_timeline":
          result = sceneBuilder.getScene(args.sceneId);
          break;
        case "flow_add_clip_to_scene":
          result = sceneBuilder.addClipToScene(args.sceneId, args);
          break;
        case "flow_reorder_clips":
          result = sceneBuilder.reorderClips(args.sceneId, args.orderedClipIds);
          break;
        case "flow_trim_timeline_clip":
          result = sceneBuilder.trimTimelineClip(args.sceneId, args.clipId, args);
          break;
        case "flow_save_scene_frame":
          result = sceneBuilder.saveFrame(args.sceneId, args.timecodeSeconds);
          break;
        case "flow_render_scene":
          result = sceneBuilder.renderScene(args.sceneId, args);
          break;

        // Micro-Tools
        case "flow_list_internal_tools":
          result = internalToolsService.listTools(args);
          break;
        case "flow_call_internal_tool":
          result = internalToolsService.executeTool(args.toolId, args.parameters);
          break;
        case "flow_create_custom_tool":
          result = internalToolsService.createCustomTool(args);
          break;

        // Exports
        case "flow_download_video":
          result = exportService.downloadVideo(args);
          break;
        case "flow_download_project_zip":
          result = exportService.downloadProjectZip(args.projectId);
          break;
        case "flow_publish_to_youtube":
          result = exportService.publishToYouTube(args);
          break;
        case "flow_share_video":
          result = exportService.shareVideo(args.videoClipId);
          break;

        default:
          throw new Error(`Unknown tool name: ${name}`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: err.message, stack: err.stack }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });

  // -------------------------------------------------------------
  // MCP RESOURCES REGISTRATION
  // -------------------------------------------------------------
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "flow://projects",
          name: "Google Flow Projects",
          mimeType: "application/json",
          description: "All studio filmmaking projects, clip counts, and metadata.",
        },
        {
          uri: "flow://settings",
          name: "Studio Settings & Credits",
          mimeType: "application/json",
          description: "Studio view preferences and Google One AI credit ledger.",
        },
        {
          uri: "flow://tools",
          name: "Flow Micro-Tools Catalog",
          mimeType: "application/json",
          description: "The 34 built-in creative micro-tools across Image, Video, Prompting, and Experimental.",
        },
        {
          uri: "flow://characters",
          name: "Character Studio Directory",
          mimeType: "application/json",
          description: "Persistent character sheets and visual identity anchors.",
        },
      ],
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    let data;

    if (uri === "flow://projects") {
      data = projectManager.listProjects();
    } else if (uri === "flow://settings") {
      data = studioSettings.getSettings();
    } else if (uri === "flow://tools") {
      data = internalToolsService.listTools();
    } else if (uri === "flow://characters") {
      data = characterStudio.listCharacters();
    } else {
      throw new Error(`Unknown resource URI: ${uri}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  });

  // -------------------------------------------------------------
  // MCP PROMPTS REGISTRATION
  // -------------------------------------------------------------
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [
        {
          name: "flow_cinematic_director",
          description: "Directs a complete high-impact video shot using Google Veo 3.1 & Omni 1.2 Flash cinematography rules.",
          arguments: [
            { name: "sceneConcept", description: "Narrative concept of the scene", required: true },
            { name: "mood", description: "Cinematic mood or tone", required: false },
          ],
        },
        {
          name: "flow_commercial_reel",
          description: "Directs a complete 30-second multi-shot commercial promo with Scene Builder sequence plan.",
          arguments: [
            { name: "productOrTheme", description: "Product or campaign theme", required: true },
            { name: "targetAudience", description: "Target audience demographic", required: false },
          ],
        },
      ],
    };
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "flow_cinematic_director") {
      const concept = args?.sceneConcept || "Hero character exploring an unknown territory";
      const mood = args?.mood || "Epic, cinematic, atmospheric";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `You are the Lead Cinematographer and Director for Google Flow.
Direct a cinematic shot for the concept: "${concept}" with mood "${mood}".

Follow the Google Flow Cinematography Standard:
1. Subject & Action: Define precise subject posture and physics. Reference characters with @character tags.
2. Environment & Lighting: Choose between Golden Hour, Volumetric God Rays, Chiaroscuro, or Neon Cyberpunk.
3. Camera Motion & Framing: Choose explicit movement (e.g., Steadicam Glide, Crane Down, Orbit 360, Tracking Run).
4. Lens & Optics: Anamorphic, 85mm portrait, 35mm wide, or Kodak 5219 film stock.
5. Audio Soundscape: Specify [Audio: ...] directives.

Use 'flow_build_cinematic_prompt' followed by 'flow_generate_video' using 'Veo 3.1 - Quality' or 'Omni 1.2 Flash'.`,
            },
          },
        ],
      };
    }

    if (name === "flow_commercial_reel") {
      const theme = args?.productOrTheme || "Futuristic Smart Wearable";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `You are the Executive Video Producer in Google Flow Studio.
Create a complete 30-second multi-scene commercial reel for: "${theme}".

Plan:
1. Create a project using 'flow_create_project'.
2. Create or verify the lead character using 'flow_create_character' and 'flow_generate_character_sheet'.
3. Generate 3 to 4 sequential shots:
   - Shot 1: Establishing wide shot (Veo 3.1)
   - Shot 2: Kinetic action medium tracking shot (Omni 1.2 Flash)
   - Shot 3: Macro close-up product detail with optical depth
   - Shot 4: Hero resolution shot with animated title card overlay via 'flow_call_internal_tool' ('type-overlays')
4. Assemble everything into a Scene Builder timeline with 'flow_create_scene' and 'flow_add_clip_to_scene'.
5. Render the final cut with 'flow_render_scene' and export in 4K via 'flow_download_video'.`,
            },
          },
        ],
      };
    }

    throw new Error(`Unknown prompt name: ${name}`);
  });

  return server;
}
