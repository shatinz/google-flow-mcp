import { EXPORT_FORMATS } from "../constants/models.js";
import { projectManager } from "./project-manager.js";

export class ExportService {
  downloadVideo({ clipIdOrRenderId, format = "1080p Upscaled", qualityProfile = "cinema" }) {
    const formatKey = Object.keys(EXPORT_FORMATS).find(
      (k) =>
        EXPORT_FORMATS[k].id.toLowerCase() === format.toLowerCase() ||
        EXPORT_FORMATS[k].format.toLowerCase() === format.toLowerCase()
    );
    const formatSpec = formatKey ? EXPORT_FORMATS[formatKey] : EXPORT_FORMATS.UPSCALED_1080P;

    const downloadId = `dl-${Date.now().toString(36)}`;
    const extension = formatSpec.format;
    const downloadFilename = `flow_export_${clipIdOrRenderId}_${formatSpec.resolution.replace("x", "_")}.${extension}`;
    const directDownloadUrl = `https://flow.google.com/export/download/${downloadId}/${downloadFilename}`;

    return {
      downloadId,
      clipIdOrRenderId,
      formatChosen: formatSpec.id,
      containerFormat: formatSpec.format,
      resolution: formatSpec.resolution,
      qualityProfile,
      filename: downloadFilename,
      directDownloadUrl,
      fileSizeBytes: formatSpec.format === "gif" ? 8420000 : 45200000,
      status: "READY",
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
  }

  downloadProjectZip(projectId) {
    const project = projectManager.getProject(projectId);
    const archiveId = `archive-${projectId}-${Date.now().toString(36)}`;
    const zipFilename = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_full_studio_archive.zip`;

    return {
      archiveId,
      projectId: project.id,
      projectTitle: project.title,
      totalClipsIncluded: project.clips ? project.clips.length : 0,
      totalScenesIncluded: project.scenes ? project.scenes.length : 0,
      zipFilename,
      downloadUrl: `https://flow.google.com/export/project-archive/${archiveId}/${zipFilename}`,
      includesManifest: true,
      status: "COMPLETED",
    };
  }

  publishToYouTube({
    videoClipId,
    title,
    description = "",
    tags = [],
    privacy = "unlisted",
  }) {
    const publishId = `yt-${Date.now().toString(36)}`;
    const youtubeVideoId = `dQw4w9WgXcQ_${publishId.slice(-4)}`;

    return {
      publishId,
      videoClipId,
      youtubeVideoId,
      youtubeUrl: `https://youtu.be/${youtubeVideoId}`,
      title,
      description,
      tags: ["Google Flow", "Veo 3.1", "AI Filmmaking", ...tags],
      privacyStatus: privacy,
      publishedAt: new Date().toISOString(),
      status: "PUBLISHED",
    };
  }

  shareVideo(videoClipId) {
    const shareToken = `share-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    return {
      videoClipId,
      shareToken,
      shareableWebUrl: `https://flow.google.com/share/${shareToken}`,
      embedHtml: `<iframe src="https://flow.google.com/embed/${shareToken}" width="100%" height="480" frameborder="0" allowfullscreen></iframe>`,
    };
  }
}

export const exportService = new ExportService();
