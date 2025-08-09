#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const blogRoot = path.resolve(process.cwd(), 'src/content/blog');

function toKebabCase(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripPrefixes(basename) {
  return basename
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/^\d+-/, '');
}

async function* walk(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.join(dir, dirent.isSymbolicLink() ? await fs.realpath(path.join(dir, dirent.name)) : dirent.name);
    if (dirent.isDirectory()) {
      yield* walk(res);
    } else {
      yield res;
    }
  }
}

async function parseFrontmatter(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const start = raw.indexOf('---');
  if (start !== 0) return { raw, data: {} };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { raw, data: {} };
  const yaml = raw.slice(3, end).trim();

  /** Very light YAML parsing for title, pubDate, draft */
  const data = {};
  const titleMatch = yaml.match(/\btitle\s*:\s*(.*)/);
  const pubDateMatch = yaml.match(/\bpubDate\s*:\s*(.*)/);
  const draftMatch = yaml.match(/\bdraft\s*:\s*(.*)/i);
  if (titleMatch) {
    data.title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '');
  }
  if (pubDateMatch) {
    data.pubDate = pubDateMatch[1].trim().replace(/^['"]|['"]$/g, '');
  }
  if (draftMatch) {
    const val = draftMatch[1].trim().toLowerCase();
    data.draft = val === 'true' || val === 'yes' || val === 'on' || val === '1';
  }
  return { raw, data };
}

function getYearMonthFromDate(pubDate) {
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return null;
  const year = String(d.getUTCFullYear());
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  return { year, month };
}

async function ensureUniquePath(destPath) {
  let candidate = destPath;
  const ext = path.extname(destPath);
  const base = destPath.slice(0, -ext.length);
  let counter = 2;
  while (true) {
    try {
      await fs.access(candidate);
      candidate = `${base}-${counter}${ext}`;
      counter += 1;
    } catch {
      return candidate; // does not exist
    }
  }
}

async function organize() {
  const moved = [];
  for await (const file of walk(blogRoot)) {
    if (!file.endsWith('.md')) continue;

    const rel = path.relative(blogRoot, file);
    const parts = rel.split(path.sep);

    const { data } = await parseFrontmatter(file);

    // Handle drafts first: move to drafts folder regardless of current location (unless already there)
    if (data.draft === true) {
      if (parts[0] === 'drafts') continue; // already in drafts
      const originalBase = path.basename(file, '.md');
      const baseNoPrefix = stripPrefixes(originalBase);
      const title = (data.title && data.title.trim()) || baseNoPrefix;
      const normalized = toKebabCase(title);
      const destDir = path.join(blogRoot, 'drafts');
      await fs.mkdir(destDir, { recursive: true });
      let destPath = path.join(destDir, `${normalized}.md`);
      if (path.resolve(file) !== path.resolve(destPath)) {
        destPath = await ensureUniquePath(destPath);
        await fs.rename(file, destPath);
        moved.push({ from: rel, to: path.relative(blogRoot, destPath) });
      }
      continue;
    }

    // For non-drafts: Skip files already in year/month structure
    if (parts.length >= 3 && /^\d{4}$/.test(parts[0]) && /^\d{2}$/.test(parts[1])) {
      continue;
    }
    const pub = data.pubDate;
    const ym = pub ? getYearMonthFromDate(pub) : null;
    if (!ym) {
      console.warn(`Skipping (no/invalid pubDate): ${rel}`);
      continue;
    }

    const originalBase = path.basename(file, '.md');
    const baseNoPrefix = stripPrefixes(originalBase);
    const title = (data.title && data.title.trim()) || baseNoPrefix;
    const normalized = toKebabCase(title);

    const destDir = path.join(blogRoot, ym.year, ym.month);
    await fs.mkdir(destDir, { recursive: true });
    let destPath = path.join(destDir, `${normalized}.md`);
    if (path.resolve(file) === path.resolve(destPath)) continue;
    destPath = await ensureUniquePath(destPath);

    await fs.rename(file, destPath);
    moved.push({ from: rel, to: path.relative(blogRoot, destPath) });
  }

  if (moved.length === 0) {
    console.log('No files moved.');
  } else {
    console.log('Moved files:');
    for (const m of moved) {
      console.log(`- ${m.from} -> ${m.to}`);
    }
  }
}

organize().catch((err) => {
  console.error(err);
  process.exit(1);
});


