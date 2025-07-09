#!/usr/bin/env node

const { execSync } = require("child_process");
const { copyFileSync, mkdirSync, existsSync, readdirSync, lstatSync } = require("fs");
const { join } = require("path");

const copyRecursiveSync = (src, dest) => {
  if (!existsSync(dest)) mkdirSync(dest);
  readdirSync(src).forEach(name => {
    const srcPath = join(src, name);
    const destPath = join(dest, name);
    if (lstatSync(srcPath).isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  });
};

const projectName = process.argv[2];
if (!projectName) {
  console.error("Usage: npx @hutotpn/nextjs-init <project-name>");
  process.exit(1);
}

const targetDir = join(process.cwd(), projectName);
if (existsSync(targetDir)) {
  console.error(`Error: Directory "${projectName}" already exists.`);
  process.exit(1);
}

console.log(`Creating Next.js app in ${targetDir}...`);
copyRecursiveSync(join(__dirname, "template"), targetDir);
execSync("npm install", { cwd: targetDir, stdio: "inherit" });
console.log("✅ Done!");
