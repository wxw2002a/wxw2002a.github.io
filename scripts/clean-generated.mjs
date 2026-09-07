import { readdir, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const assetsDirectory = resolve(repositoryRoot, "assets");

if (dirname(assetsDirectory) !== repositoryRoot) {
  throw new Error("Refusing to clean assets outside the repository root.");
}

// Vite uses an eight-character content hash for entry points and lazy chunks.
// Keep static media and un-hashed JavaScript/CSS files intact.
const generatedAsset = /^[A-Za-z0-9_.-]+-[A-Za-z0-9_-]{8}\.(?:css|js)(?:\.map)?$/;

try {
  const entries = await readdir(assetsDirectory, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && generatedAsset.test(entry.name))
      .map((entry) => unlink(resolve(assetsDirectory, entry.name))),
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
