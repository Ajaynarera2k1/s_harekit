import { cp, mkdir, readdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const filesToCopy = [
  "index.js",
  "package.json",
  "package-lock.json",
];

const directoriesToCopy = [
  "controller",
  "demo-assets",
  "middleware",
  "model",
  "scripts",
  "view",
];

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function safeCopyFile(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const targetPath = path.join(distDir, relativePath);

  if (!(await pathExists(sourcePath))) {
    return;
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await cp(sourcePath, targetPath, { recursive: false });
}

async function safeCopyDirectory(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const targetPath = path.join(distDir, relativePath);

  if (!(await pathExists(sourcePath))) {
    return;
  }

  await cp(sourcePath, targetPath, {
    recursive: true,
    force: true,
  });
}

async function ensureStorageLayout() {
  const storageRoot = path.join(distDir, "storage");
  const requiredDirectories = ["files", "pictures"];

  await mkdir(storageRoot, { recursive: true });

  for (const name of requiredDirectories) {
    await mkdir(path.join(storageRoot, name), { recursive: true });
  }

  const sourceStorage = path.join(rootDir, "storage");
  if (!(await pathExists(sourceStorage))) {
    return;
  }

  const entries = await readdir(sourceStorage, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const sourcePath = path.join(sourceStorage, entry.name);
    const targetPath = path.join(storageRoot, entry.name);
    await cp(sourcePath, targetPath, { recursive: true, force: true });
  }
}

async function build() {
  await mkdir(distDir, { recursive: true });

  for (const file of filesToCopy) {
    await safeCopyFile(file);
  }

  for (const directory of directoriesToCopy) {
    await safeCopyDirectory(directory);
  }

  await ensureStorageLayout();

  console.log(`Build complete: ${distDir}`);
}

build().catch((error) => {
  console.error("Build failed:", error);
  process.exitCode = 1;
});
