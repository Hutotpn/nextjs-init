#!/usr/bin/env node

import path from "path";
import { fileURLToPath } from "url";
import { cpSync } from "fs";

// Resolve paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.join(__dirname, "template");
const targetDir = process.argv[2] || ".";
const targetPath = path.resolve(process.cwd(), targetDir);

// Copy template to target
cpSync(templateDir, targetPath, { recursive: true });

console.log(`✅ Project initialized in ${targetDir}`);
