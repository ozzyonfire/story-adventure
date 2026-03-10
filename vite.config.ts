import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import type { Connect, Plugin } from "vite";
import { defineConfig } from "vite";

type StoryRecord = {
  id: string;
  title: string;
  filename: string;
};

const STORIES_DIR = process.env.STORIES_DIR ?? "./stories";
const STORIES_ROOT = path.resolve(process.cwd(), STORIES_DIR);

assertReadableStoriesDir(STORIES_ROOT);

function assertReadableStoriesDir(dirPath: string): void {
  const stats = statSync(dirPath);
  if (!stats.isDirectory()) {
    throw new Error(`STORIES_DIR must be a directory. Resolved: ${dirPath}`);
  }
  readdirSync(dirPath);
}

function toSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "story";
}

function makeUniqueId(baseId: string, usedIds: Set<string>): string {
  let id = baseId;
  let suffix = 1;
  while (usedIds.has(id)) {
    suffix += 1;
    id = `${baseId}-${suffix}`;
  }
  usedIds.add(id);
  return id;
}

function extractTitleFromUnknown(input: unknown): string | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const data = input as Record<string, unknown>;
  const candidates = [
    data.title,
    data.storyTitle,
    (data.metadata as Record<string, unknown> | undefined)?.title,
    (data.info as Record<string, unknown> | undefined)?.title,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

function readStoryTitle(filePath: string): string | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    return extractTitleFromUnknown(JSON.parse(content));
  } catch {
    return null;
  }
}

function buildStoryIndex(storiesRoot: string): StoryRecord[] {
  const usedIds = new Set<string>();
  const files = readdirSync(storiesRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  return files.map((filename) => {
    const basename = filename.replace(/\.json$/i, "");
    const id = makeUniqueId(toSlug(basename), usedIds);
    const filePath = path.join(storiesRoot, filename);
    const title = readStoryTitle(filePath) ?? basename;
    return { id, title, filename };
  });
}

function isAllowedStoryAssetPath(relativePath: string): boolean {
  const normalized = relativePath.toLowerCase();
  return normalized.endsWith(".json")
    || normalized.endsWith(".png")
    || normalized.endsWith(".jpg")
    || normalized.endsWith(".jpeg")
    || normalized.endsWith(".webp")
    || normalized.endsWith(".gif")
    || normalized.endsWith(".svg");
}

function contentTypeForStoryAsset(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".json":
      return "application/json; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

function storiesMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (!req.url || !req.method) {
      next();
      return;
    }

    const method = req.method.toUpperCase();
    const requestPath = req.url.split("?")[0] ?? req.url;

    if (method === "GET" && requestPath === "/api/stories") {
      const stories = buildStoryIndex(STORIES_ROOT);
      res.statusCode = 200;
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ stories }));
      return;
    }

    if (method === "GET" && requestPath.startsWith("/stories/")) {
      const relativePath = decodeURIComponent(requestPath.slice("/stories/".length));
      if (!isAllowedStoryAssetPath(relativePath)) {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }

      const filePath = path.resolve(STORIES_ROOT, relativePath);
      if (!filePath.startsWith(`${STORIES_ROOT}${path.sep}`)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }

      if (!existsSync(filePath)) {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }

      try {
        const stats = statSync(filePath);
        if (!stats.isFile()) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }

        res.statusCode = 200;
        res.setHeader("content-type", contentTypeForStoryAsset(filePath));
        createReadStream(filePath).pipe(res);
      } catch {
        res.statusCode = 500;
        res.end("Failed to read story file");
      }
      return;
    }

    next();
  };
}

function storiesPlugin(): Plugin {
  return {
    name: "stories-api-and-static",
    configureServer(server) {
      server.middlewares.use(storiesMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(storiesMiddleware());
    },
  };
}

export default defineConfig({
  plugins: [storiesPlugin()],
  server: {
    host: true,
    port: Number(process.env.PORT ?? 3000),
  },
  preview: {
    host: true,
    port: Number(process.env.PORT ?? 3000),
  },
});
