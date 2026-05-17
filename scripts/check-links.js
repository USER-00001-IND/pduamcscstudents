const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const checkedExtensions = new Set([".html", ".css", ".js"]);
const criticalExtensions = new Set([
  ".css",
  ".js",
  ".html",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
]);

const knownContentGaps = new Set([
  "A1.html -> assets/documents/notices/GU_Academic_Calendar_2025.pdf",
  "A1.html -> tests/hs2.html",
  "A1.html -> tests/sem1.html",
  "A1.html -> tests/sem2.html",
  "A1.html -> tests/sem3.html",
  "A1.html -> tests/sem4.html",
  "A1.html -> tests/sem5.html",
  "A1.html -> tests/sem6.html",
  "A1.html -> results.html",
  "S.html -> assets/documents/materials/hs1_computer.pdf",
  "S.html -> assets/documents/materials/hs2_computer.pdf",
  "S.html -> assets/documents/materials/hs_sample_questions.pdf",
  "S.html -> assets/documents/materials/sem1_c_programming.pdf",
  "S.html -> assets/documents/materials/sem2_ds.pdf",
  "S.html -> assets/documents/materials/sem2_dbms.pdf",
  "S.html -> assets/documents/materials/sem3_java.pdf",
  "S.html -> assets/documents/materials/sem3_cn.pdf",
  "S.html -> assets/documents/materials/sem4_os.pdf",
  "S.html -> assets/documents/materials/sem4_webdev.pdf",
  "S.html -> assets/documents/materials/sem5_software_eng.pdf",
  "S.html -> assets/documents/materials/sem5_ai.pdf",
  "S.html -> assets/documents/materials/sem6_project_guide.pdf",
  "S.html -> assets/documents/materials/sem6_ml.pdf",
  "S.html -> assets/documents/materials/python_basics.pdf",
  "S.html -> assets/documents/materials/html_css_js_guide.pdf",
  "S.html -> assets/documents/materials/aptitude_practice.pdf",
]);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "archive") {
        return [];
      }
      return walk(fullPath);
    }
    return [fullPath];
  });
}

function isExternal(link) {
  return /^(https?:|mailto:|tel:|data:|#|$)/.test(link);
}

function normalizeRelative(file, link) {
  const cleanLink = link.split("#")[0].split("?")[0];
  return {
    cleanLink,
    target: path.resolve(path.dirname(file), cleanLink),
  };
}

const files = walk(root).filter((file) => checkedExtensions.has(path.extname(file)));
const missingCritical = [];
const warnings = [];

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const relativeFile = path.relative(root, file).replaceAll(path.sep, "/");
  const matches = source.matchAll(/(?:href|src)=["']([^"']+)["']/g);

  for (const match of matches) {
    const link = match[1];
    if (isExternal(link)) continue;

    const { cleanLink, target } = normalizeRelative(file, link);
    if (!cleanLink || fs.existsSync(target)) continue;

    const label = `${relativeFile} -> ${cleanLink}`;
    const ext = path.extname(cleanLink).toLowerCase();

    if (knownContentGaps.has(label) || !criticalExtensions.has(ext)) {
      warnings.push(label);
    } else {
      missingCritical.push(label);
    }
  }
}

if (warnings.length) {
  console.warn("Known missing content placeholders:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (missingCritical.length) {
  console.error("Broken critical local references:");
  for (const item of missingCritical) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`Checked ${files.length} HTML/CSS/JS files. Critical local references look good.`);
