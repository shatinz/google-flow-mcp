import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.FLOW_DATA_DIR || path.resolve(__dirname, "../../data");

export class ProjectManager {
  constructor() {
    this.projectsFile = path.join(DATA_DIR, "projects.json");
    this.ensureDataDir();
  }

  ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(this.projectsFile)) {
      // Seed with initial clean demo project
      const initialProjects = [
        {
          id: "flow-proj-cyberpunk-promo-01",
          title: "Personal Metric Promo Reel",
          description: "High-energy commercial promo reel showcasing personal fitness metrics and kinetic UI overlays.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          aspectRatio: "16:9",
          defaultModel: "Omni 1.2 Flash",
          coverUrl: "https://flow.google.com/assets/covers/personal-metric-cover.jpg",
          clipCount: 12,
          sceneCount: 2,
          isFavorite: true,
          clips: [
            {
              id: "clip-001",
              title: "Runner Morning Sprint",
              prompt: "Medium tracking shot of a focused runner sprinting on an urban bridge at sunrise [Audio: rhythmic footsteps and synth pulse]",
              model: "Omni 1.2 Flash",
              aspectRatio: "16:9",
              durationSeconds: 5,
              thumbnailUrl: "https://flow.google.com/assets/thumbnails/clip-001.jpg",
              status: "COMPLETED",
              variations: 2,
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: "clip-002",
              title: "Smartwatch Biometric Glow",
              prompt: "Extreme close-up macro shot of glowing smartwatch biometric interface pulsing with heart rate metrics [Audio: gentle digital chimes]",
              model: "Veo 3.1 - Quality",
              aspectRatio: "16:9",
              durationSeconds: 5,
              thumbnailUrl: "https://flow.google.com/assets/thumbnails/clip-002.jpg",
              status: "COMPLETED",
              variations: 2,
              createdAt: new Date(Date.now() - 1800000).toISOString(),
            },
          ],
          scenes: [
            {
              id: "scene-promo-master",
              title: "Master 30s Cut",
              clipIds: ["clip-001", "clip-002"],
              durationSeconds: 10,
              aspectRatio: "16:9",
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      ];
      fs.writeFileSync(this.projectsFile, JSON.stringify(initialProjects, null, 2), "utf-8");
    }
  }

  loadProjects() {
    try {
      const raw = fs.readFileSync(this.projectsFile, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveProjects(projects) {
    fs.writeFileSync(this.projectsFile, JSON.stringify(projects, null, 2), "utf-8");
  }

  listProjects() {
    const projects = this.loadProjects();
    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      aspectRatio: p.aspectRatio,
      clipCount: p.clips ? p.clips.length : 0,
      sceneCount: p.scenes ? p.scenes.length : 0,
      defaultModel: p.defaultModel,
      coverUrl: p.coverUrl,
      updatedAt: p.updatedAt,
      isFavorite: !!p.isFavorite,
    }));
  }

  getProject(id) {
    const projects = this.loadProjects();
    const proj = projects.find((p) => p.id === id);
    if (!proj) {
      throw new Error(`Project with ID '${id}' not found.`);
    }
    return proj;
  }

  createProject({ title, description = "", aspectRatio = "16:9", defaultModel = "Omni 1.2 Flash" }) {
    const projects = this.loadProjects();
    const newProject = {
      id: `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      description,
      aspectRatio,
      defaultModel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      coverUrl: null,
      clipCount: 0,
      sceneCount: 0,
      isFavorite: false,
      clips: [],
      scenes: [],
    };
    projects.unshift(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  updateProjectCover(projectId, coverUrl) {
    const projects = this.loadProjects();
    const index = projects.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error(`Project '${projectId}' not found.`);
    projects[index].coverUrl = coverUrl;
    projects[index].updatedAt = new Date().toISOString();
    this.saveProjects(projects);
    return projects[index];
  }

  addClipToProject(projectId, clip) {
    const projects = this.loadProjects();
    const index = projects.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error(`Project '${projectId}' not found.`);
    if (!projects[index].clips) projects[index].clips = [];
    projects[index].clips.unshift(clip);
    projects[index].clipCount = projects[index].clips.length;
    projects[index].updatedAt = new Date().toISOString();
    this.saveProjects(projects);
    return projects[index];
  }

  deleteProject(projectId) {
    let projects = this.loadProjects();
    const originalLength = projects.length;
    projects = projects.filter((p) => p.id !== projectId);
    if (projects.length === originalLength) {
      throw new Error(`Project '${projectId}' not found.`);
    }
    this.saveProjects(projects);
    return { success: true, deletedProjectId: projectId };
  }
}

export const projectManager = new ProjectManager();
