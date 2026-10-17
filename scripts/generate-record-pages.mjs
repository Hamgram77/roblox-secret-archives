import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const dataSource = fs.readFileSync(path.join(root, "archive-records.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(dataSource, context);
const records = context.window.archiveRecords;
const outputDirectory = path.join(root, "records");
fs.mkdirSync(outputDirectory, { recursive: true });

const siteUrl = "https://hamgram77.github.io/roblox-secret-archives";
const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

for (const record of records) {
  const related = records
    .filter((candidate) => candidate.number !== record.number)
    .map((candidate) => ({ candidate, overlap: candidate.tags.filter((tag) => record.tags.includes(tag)).length }))
    .sort((a, b) => b.overlap - a.overlap || Number(a.candidate.number) - Number(b.candidate.number))
    .slice(0, 3)
    .map(({ candidate }) => candidate);

  const canonical = `${siteUrl}/records/${record.slug}.html`;
  const pdfUrl = `${siteUrl}/${record.pdf}`;
  const revisionText = record.status === "Expanded archive edition"
    ? "Expanded archive edition added with a structured analysis and preserved PDF."
    : "Source document preserved as a local PDF and indexed in the public archive.";
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Report",
    name: record.title,
    headline: record.title,
    description: record.description,
    datePublished: record.isoDate,
    dateModified: record.isoDate,
    url: canonical,
    encoding: { "@type": "MediaObject", contentUrl: pdfUrl, encodingFormat: "application/pdf" },
    isPartOf: { "@type": "CollectionPage", name: "Roblox Developer Archives", url: `${siteUrl}/#archive` },
    about: record.tags,
  }).replaceAll("<", "\\u003c");

  const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${escapeHtml(record.description)}" />
    <meta name="theme-color" content="#0a0d12" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Roblox Developer Archives" />
    <meta property="og:title" content="${escapeHtml(record.title)}" />
    <meta property="og:description" content="${escapeHtml(record.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="article:published_time" content="${record.isoDate}" />
    <title>Record ${record.number}: ${escapeHtml(record.title)} | Roblox Developer Archives</title>
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" href="../favicon.ico" sizes="any" />
    <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
    <link rel="stylesheet" href="../styles.css?v=20261017-record-pages" />
    <link rel="stylesheet" href="../professional.css?v=20261017-record-pages" />
    <link rel="stylesheet" href="../record.css?v=20261017-record-pages" />
    <script type="application/ld+json">${structuredData}</script>
  </head>
  <body class="record-body">
    <header class="record-site-header">
      <a class="brand" href="../#home" aria-label="Roblox Developer Archives home"><span class="brand-mark" aria-hidden="true"><span></span></span><span><strong>Developer Archives</strong><small>Independent research library</small></span></a>
      <a class="record-back" href="../#archive">← Back to archive</a>
    </header>
    <main class="record-main">
      <nav class="record-breadcrumb" aria-label="Breadcrumb"><a href="../#home">Home</a><span>/</span><a href="../#archive">Archive</a><span>/</span><span>Record ${record.number}</span></nav>
      <section class="record-hero" aria-labelledby="record-title">
        <div><p class="record-kicker">Roblox Developer Archives · Record ${record.number}</p><h1 id="record-title">${escapeHtml(record.title)}</h1><p class="record-hero-summary">${escapeHtml(record.description)}</p></div>
        <dl class="record-hero-meta"><div><dt>Document status</dt><dd>${escapeHtml(record.status)}</dd></div><div><dt>Published</dt><dd>${escapeHtml(record.date)}</dd></div><div><dt>Format</dt><dd>PDF archive record</dd></div></dl>
      </section>
      <div class="record-layout">
        <div class="record-content">
          <section class="record-section"><h2>Executive summary</h2><p>${escapeHtml(record.description)} This catalog page provides a stable route to the preserved document and its available source material; the complete analysis remains in the PDF.</p></section>
          <section class="record-section"><h2>Topics examined</h2><ul class="record-topic-list">${record.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul></section>
          <section class="record-section"><h2>Revision history</h2><div class="record-revision"><time datetime="${record.isoDate}">${escapeHtml(record.date)}</time><p>${escapeHtml(revisionText)}</p></div></section>
        </div>
        <aside class="record-file-card" aria-labelledby="document-access-title"><div class="record-file-icon" aria-hidden="true">PDF</div><h2 id="document-access-title">Document access</h2><p>Open the complete record in a new tab or download the preserved copy.</p><div class="record-file-actions"><a href="../${record.pdf}" target="_blank" rel="noopener">View PDF <span>↗</span></a><a href="../${record.pdf}" download>Download PDF <span>↓</span></a>${record.source ? `<a href="${record.source}" target="_blank" rel="noopener noreferrer">Original source <span>↗</span></a>` : ""}</div></aside>
      </div>
      <section class="record-related" aria-labelledby="related-records"><h2 id="related-records">Related records</h2><div class="record-related-grid">${related.map((item) => `<a class="record-related-card" href="${item.slug}.html"><span>Record ${item.number}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.tags.join(" · "))}</p></a>`).join("")}</div></section>
    </main>
    <footer class="record-page-footer"><p>© 2026 Roblox Secret Archives · Independent and unaffiliated with Roblox Corporation.</p><a href="../archive/terms-of-service-and-privacy-policy.pdf?v=20261017" target="_blank" rel="noopener">Terms of Service &amp; Privacy Policy</a></footer>
  </body>
</html>`;
  fs.writeFileSync(path.join(outputDirectory, `${record.slug}.html`), page);
}

const sitemapUrls = [
  { location: `${siteUrl}/`, lastModified: "2026-10-17" },
  ...records.map((record) => ({ location: `${siteUrl}/records/${record.slug}.html`, lastModified: record.isoDate })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((item) => `  <url><loc>${item.location}</loc><lastmod>${item.lastModified}</lastmod></url>`).join("\n")}
</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);
console.log(`Generated ${records.length} record pages.`);
