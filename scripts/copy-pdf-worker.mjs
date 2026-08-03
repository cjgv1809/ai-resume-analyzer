// Keeps public/pdf.worker.min.mjs in lockstep with the installed pdfjs-dist
// version. pdf.js throws at runtime if the worker version doesn't exactly
// match the main package version, so this can't be a one-time manual copy.
import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = path.join(root, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
const destination = path.join(root, "public/pdf.worker.min.mjs");

copyFileSync(source, destination);
console.log("Synced public/pdf.worker.min.mjs from installed pdfjs-dist.");
