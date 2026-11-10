import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Keep reader-facing Markdown links valid as generated content changes.
// Scan the repository README and every experience page without enumerating pages by name.
const root = process.cwd();
const docsDirectory = path.join(root, 'docs', 'experience');
const sources = [path.join(root, 'README.md')];

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(absolute);
    return entry.isFile() && entry.name.endsWith('.md') ? [absolute] : [];
  });
}

assert(fs.existsSync(docsDirectory), 'Missing docs/experience directory');
sources.push(...markdownFiles(docsDirectory));

let checked = 0;
const problems = [];
const markdownLink = /!?\[[^\]\r\n]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/g;

for (const source of sources) {
  const markdown = fs.readFileSync(source, 'utf8');
  for (const match of markdown.matchAll(markdownLink)) {
    let href = match[1] || match[2];
    if (href.startsWith('#') || /^(https?:\/\/|mailto:|tel:)/i.test(href)) continue;
    if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('//')) {
      problems.push(`${path.relative(root, source)}: unsupported link ${href}`);
      continue;
    }
    href = href.split(/[?#]/)[0];
    if (!href) continue;
    try {
      href = decodeURIComponent(href);
    } catch {
      problems.push(`${path.relative(root, source)}: invalid URL encoding`);
      continue;
    }
    const resolved = path.resolve(path.dirname(source), href);
    checked++;
    if (resolved !== root && !resolved.startsWith(root + path.sep)) {
      problems.push(`${path.relative(root, source)}: path escapes repository: ${href}`);
    } else if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      problems.push(`${path.relative(root, source)}: missing target: ${href}`);
    }
  }
}

if (problems.length) {
  for (const problem of problems) console.error('BROKEN_LINK:', problem);
  process.exitCode = 1;
} else {
  console.log(`Local links OK: ${sources.length} Markdown files, ${checked} file references.`);
}
