import { cp, mkdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const filesToPrepare = [
  {
    source: path.join(rootDir, "demo-assets", "welcome-pack.html"),
    target: path.join(rootDir, "storage", "files", "welcome-pack.html"),
  },
  {
    source: path.join(rootDir, "demo-assets", "pricing-sheet.html"),
    target: path.join(rootDir, "storage", "files", "pricing-sheet.html"),
  },
];

async function exists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(path.join(rootDir, "storage", "files"), { recursive: true });
  await mkdir(path.join(rootDir, "storage", "pictures"), { recursive: true });

  for (const file of filesToPrepare) {
    if (await exists(file.source) && !(await exists(file.target))) {
      await cp(file.source, file.target);
    }
  }
}

main().catch((error) => {
  console.error("Storage preparation failed:", error.message);
  process.exitCode = 1;
});
