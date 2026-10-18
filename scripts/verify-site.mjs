import fs from "node:fs";
import vm from "node:vm";

const failures = [];
const context = { window: {} };
vm.runInNewContext(fs.readFileSync("archive-records.js", "utf8"), context);
const records = context.window.archiveRecords;

if (records.length !== 11) failures.push(`Expected 11 records, found ${records.length}.`);

for (const record of records) {
  for (const file of [record.pdf, `records/${record.slug}.html`]) {
    if (!fs.existsSync(file)) failures.push(`Missing ${file}.`);
  }

  const page = fs.readFileSync(`records/${record.slug}.html`, "utf8");
  if (!page.includes('<link rel="canonical"')) failures.push(`Missing canonical URL for ${record.slug}.`);
  if (!page.includes('type="application/ld+json"')) failures.push(`Missing JSON-LD for ${record.slug}.`);
}

const uniqueNumbers = new Set(records.map((record) => record.number));
const uniqueSlugs = new Set(records.map((record) => record.slug));
if (uniqueNumbers.size !== records.length) failures.push("Record numbers are not unique.");
if (uniqueSlugs.size !== records.length) failures.push("Record slugs are not unique.");

const index = fs.readFileSync("index.html", "utf8");
for (const id of ["archive-sort", "sort-summary", "home-pdf-permission-wrap", "home-pdf-permission", "home-pdf-remove", "changelog", "contact"]) {
  if (!index.includes(`id="${id}"`)) failures.push(`Missing required element #${id}.`);
}

if (!index.includes('href="#contact" role="tab" data-site-tab')) failures.push("Contact is not configured as a site subtab.");
if ((index.match(/https:\/\/www\.youtube\.com\/@Hamgram773/g) || []).length < 3) failures.push("Expected YouTube links on Home, About, and in the shared footer.");
if (!index.includes('class="home-youtube-card"')) failures.push("Home YouTube channel card is missing.");
if (!fs.existsSync("assets/hamgram773-youtube-avatar.jpg")) failures.push("YouTube channel avatar asset is missing.");

const ids = [...index.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) failures.push(`Duplicate IDs: ${duplicateIds.join(", ")}.`);

const sitemap = fs.readFileSync("sitemap.xml", "utf8");
for (const record of records) {
  if (!sitemap.includes(`/records/${record.slug}.html`)) failures.push(`Sitemap omits ${record.slug}.`);
}

console.log(JSON.stringify({
  records: records.length,
  uniqueNumbers: uniqueNumbers.size,
  uniqueSlugs: uniqueSlugs.size,
  sitemapRecordUrls: (sitemap.match(/\/records\//g) || []).length,
  failures,
}, null, 2));

if (failures.length) process.exitCode = 1;
