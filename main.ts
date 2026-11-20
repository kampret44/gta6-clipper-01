// main.ts — entrypoint for the make.fun bounty "gta6-clipper-01".
//
// Job: hand the house the video link. It reads VIDEO.json from this
// repository's root and copies it, byte for byte, into the output
// directory. That is all it has to do: the house reads the video
// itself through the YouTube Data API, so nothing this program
// writes about the video counts.
//
// Runs on Node 22 with the standard library only. No network, no
// arguments, no randomness: two runs write the same bytes.
// Paths resolve from this file's own location, never from the
// working directory, so it works from any cwd.
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const videoFile = join(repoRoot, "VIDEO.json");

// The grader sets MAKEFUN_OUTPUT_DIR to its output folder (/output);
// locally the kit's run command sets it to out/.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "VIDEO.json");

// Fail loudly on a malformed link file instead of copying garbage.
let raw;
try {
  raw = await readFile(videoFile, "utf8");
} catch (err) {
  console.error(`VIDEO.json not found next to main.ts (${videoFile}): ${err.message}`);
  process.exit(1);
}
const parsed = JSON.parse(raw);
if (typeof parsed !== "object" || parsed === null || typeof parsed.url !== "string") {
  throw new Error("VIDEO.json must be a JSON object with a string url");
}

await mkdir(outDir, { recursive: true });
await copyFile(videoFile, outFile);
console.log(`VIDEO.json -> ${outFile} (${parsed.url})`);
