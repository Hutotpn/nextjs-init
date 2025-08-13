#!/usr/bin/env node

import path from "path";
import { fileURLToPath } from "url";
import { cpSync, readFileSync, writeFileSync, existsSync } from "fs";
import readline from "readline";

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templateDir = path.join(__dirname, "template");
  const targetDir = process.argv[2] || ".";
  const targetPath = path.resolve(process.cwd(), targetDir);

  // Ask for project info
  const projectName = await ask("Project name: ");
  const projectDescription = await ask("Project description: ");

  // Copy template
  cpSync(templateDir, targetPath, { recursive: true });

  // Rewrite package.json
  const pkgPath = path.join(targetPath, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    pkg.name = projectName || pkg.name;
    pkg.description = projectDescription || pkg.description;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  // Rewrite src/app/layout.jsx
  const layoutPath = path.join(targetPath, "src", "app", "layout.jsx");
  if (existsSync(layoutPath)) {
    let layoutContent = readFileSync(layoutPath, "utf-8");
    layoutContent = layoutContent
      .replace(/__PROJECT_NAME__/g, projectName)
      .replace(/__PROJECT_DESCRIPTION__/g, projectDescription);
    writeFileSync(layoutPath, layoutContent);
  }

  console.log(`✅ Project initialized in ${targetDir}`);
}

main();