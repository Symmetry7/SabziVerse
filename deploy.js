#!/usr/bin/env node

// Simple deployment preparation script
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Preparing SabziVerse for deployment...");

// Check if dist folder exists
const distPath = path.join(__dirname, "dist");
if (!fs.existsSync(distPath)) {
  console.error('❌ dist folder not found. Run "npm run build" first!');
  process.exit(1);
}

// Check for required files
const requiredFiles = ["dist/index.html", "dist/assets"];

const missingFiles = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(__dirname, file)),
);

if (missingFiles.length > 0) {
  console.error("❌ Missing required files:", missingFiles);
  console.error('Run "npm run build" to generate all files.');
  process.exit(1);
}

// Copy deployment configuration files to dist
const configFiles = [
  { src: "public/_redirects", dest: "dist/_redirects" },
  { src: "public/.htaccess", dest: "dist/.htaccess" },
  { src: "public/404.html", dest: "dist/404.html" },
];

configFiles.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied ${src} to ${dest}`);
  }
});

console.log("✅ Deployment preparation complete!");
console.log('📁 Upload the "dist" folder to your hosting service');
console.log("📖 See DEPLOYMENT.md for detailed instructions");
