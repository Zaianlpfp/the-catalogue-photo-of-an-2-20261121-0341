// The Catalogue Photo of an Impossible Gadget — "THE CORDLESS EXTENSION CORD"
//
// A studio catalogue photograph of an impossible gadget: a premium orange/white
// extension cord reel whose two ends are plugged into each other, forming a neat
// closed loop — a cord that reaches nothing. One accessory only: a single unused
// wall socket, slightly out of focus, on the background.
//
// The hero image is a photorealistic studio shot generated inside the recorded
// build session and stored as assets/hero.png. This program does no network
// access, no randomness and no timestamps: it deterministically copies that
// image to /output/entry.png, byte for byte, every run.
//
// Before writing, it validates the asset itself: a real PNG signature, IHDR
// dimensions within the 1024x1024 cap, and a file size within the 1,048,576
// byte cap — so a bad asset fails loudly here instead of failing the gate.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576;
const MAX_DIMENSION = 1024;

const SOURCE = join(dirname(fileURLToPath(import.meta.url)), "assets", "hero.png");
const OUTPUT = process.env.MAKEFUN_OUTPUT_DIR
  ? join(process.env.MAKEFUN_OUTPUT_DIR, "entry.png")
  : "/output/entry.png";

const bytes = readFileSync(SOURCE);

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error("assets/hero.png is not a PNG file");
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
  throw new Error(`hero.png is ${width}x${height}, over the ${MAX_DIMENSION}x${MAX_DIMENSION} cap`);
}
if (bytes.length > MAX_BYTES) {
  throw new Error(`hero.png is ${bytes.length} bytes, over the ${MAX_BYTES} byte cap`);
}

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, bytes);
console.log(`wrote ${OUTPUT} (${bytes.length} bytes, ${width}x${height} PNG)`);
