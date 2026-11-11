import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";

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
const formatFileSize = (bytes) => bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
const relatedReason = (record, candidate, sharedTags) => {
  if (sharedTags.length) return `Related through shared coverage of ${sharedTags.join(", ")}.`;
  if (record.documentType === candidate.documentType) return `Related as another ${candidate.documentType.toLowerCase()} in the archive.`;
  if (record.sourceType === candidate.sourceType) return `Related through the same ${candidate.sourceType.toLowerCase()} classification.`;
  return "Related through the archive’s broader creator-policy and platform-systems research.";
};

for (const record of records) {
  const related = records
    .filter((candidate) => candidate.number !== record.number)
    .map((candidate) => ({ candidate, sharedTags: candidate.tags.filter((tag) => record.tags.includes(tag)) }))
    .map((item) => ({ ...item, overlap: item.sharedTags.length }))
    .sort((a, b) => b.overlap - a.overlap || Number(a.candidate.number) - Number(b.candidate.number))
    .slice(0, 3);

  const canonical = `${siteUrl}/records/${record.slug}.html`;
  const pdfUrl = `${siteUrl}/${record.pdf}`;
  const pdfBytes = fs.readFileSync(path.join(root, record.pdf));
  const checksum = createHash("sha256").update(pdfBytes).digest("hex");
  const sourceStatus = record.source ? "Original source linked" : "No external original supplied";
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
    dateModified: "2026-11-10",
    url: canonical,
    encoding: { "@type": "MediaObject", contentUrl: pdfUrl, encodingFormat: "application/pdf", contentSize: formatFileSize(pdfBytes.length), identifier: `sha256:${checksum}` },
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
    <meta property="og:image" content="${siteUrl}/assets/social-preview.png" />
    <meta property="og:image:alt" content="Roblox Developer Archives — Independent Research Library" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${siteUrl}/assets/social-preview.png" />
    <meta property="article:published_time" content="${record.isoDate}" />
    <title>Record ${record.number}: ${escapeHtml(record.title)} | Roblox Developer Archives</title>
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" sizes="96x96" href="../favicon-96.png?v=20261024" />
    <link rel="icon" type="image/svg+xml" sizes="any" href="../favicon.svg?v=20261024" />
    <link rel="shortcut icon" href="../favicon.ico?v=20261024" />
    <link rel="stylesheet" href="../styles.css?v=20261023" />
    <link rel="stylesheet" href="../professional.css?v=20261110-source" />
    <link rel="stylesheet" href="../record.css?v=20261110-source" />
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
        <div><p class="record-kicker">Roblox Developer Archives · Record ${record.number}</p><div class="record-page-badges"><span>${escapeHtml(record.documentType)}</span><span>${escapeHtml(record.sourceType)}</span></div><h1 id="record-title">${escapeHtml(record.title)}</h1><p class="record-hero-summary">${escapeHtml(record.description)}</p></div>
        <dl class="record-hero-meta"><div><dt>Document status</dt><dd>${escapeHtml(record.status)}</dd></div><div><dt>Published</dt><dd>${escapeHtml(record.date)}</dd></div><div><dt>Document type</dt><dd>${escapeHtml(record.documentType)}</dd></div><div><dt>Source type</dt><dd>${escapeHtml(record.sourceType)}</dd></div></dl>
      </section>
      <div class="record-layout">
        <div class="record-content">
          ${record.notice ? `<section class="record-section record-notice" role="note"><h2>Archive notice</h2><p>${escapeHtml(record.notice)}</p></section>` : "<!-- No separate archive notice for this record. -->"}
          ${record.filing ? `<section class="record-section record-filing" aria-labelledby="filing-details-title"><h2 id="filing-details-title">SEC filing details</h2><dl><div><dt>Registrant</dt><dd>${escapeHtml(record.filing.registrant)}</dd></div><div><dt>Form</dt><dd>${escapeHtml(record.filing.form)}</dd></div><div><dt>Reporting period</dt><dd>${escapeHtml(record.filing.reportingPeriod)}</dd></div><div><dt>Filing date</dt><dd>${escapeHtml(record.filing.filingDate)}</dd></div><div><dt>SEC accession number</dt><dd><code>${escapeHtml(record.filing.accession)}</code></dd></div><div><dt>CIK</dt><dd><code>${escapeHtml(record.filing.cik)}</code></dd></div></dl><p>This archive record preserves only the identified legal-issues and risk-factors excerpt. <a href="${record.source}" target="_blank" rel="noopener noreferrer">Read the complete filing on SEC.gov ↗</a></p></section>` : "<!-- No regulatory filing metadata for this record. -->"}
          <section class="record-section"><h2>Executive summary</h2><p>${escapeHtml(record.description)} This catalog page provides a stable route to the preserved document and its available source material; the complete excerpt remains in the PDF.</p></section>
          <section class="record-section"><h2>Topics examined</h2><ul class="record-topic-list">${record.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul></section>
          <section class="record-section record-source-verification" aria-labelledby="source-verification-title"><h2 id="source-verification-title">Source verification</h2><p>Use these fields to identify what was preserved and verify that the downloaded PDF matches this catalog entry.</p><dl><div><dt>Document type</dt><dd>${escapeHtml(record.documentType)}</dd></div><div><dt>Source type</dt><dd>${escapeHtml(record.sourceType)}</dd></div><div><dt>Completeness</dt><dd>${escapeHtml(record.completeness)}</dd></div><div><dt>Date preserved</dt><dd>${escapeHtml(record.date)}</dd></div><div><dt>Last reviewed</dt><dd>November 10, 2026</dd></div><div><dt>SHA-256</dt><dd><code>${checksum}</code></dd></div></dl><div class="record-source-links"><a href="../${record.pdf}" target="_blank" rel="noopener">Open archived PDF ↗</a>${record.source ? `<a href="${record.source}" target="_blank" rel="noopener noreferrer">${escapeHtml(record.sourceLabel || "Open original source")} ↗</a>` : `<span>No external original was supplied for this archive-authored edition.</span>`}</div></section>
          <section class="record-section"><h2>Revision history</h2><div class="record-revision"><time datetime="${record.isoDate}">${escapeHtml(record.date)}</time><p>${escapeHtml(record.notice ? "Unofficial public-filing excerpt preserved with an archive cover, source link, and non-endorsement notice." : revisionText)}</p></div><div class="record-revision"><time datetime="2026-11-10">November 10, 2026</time><p>Catalog metadata, file checksum, and source-link status verified.</p></div></section>
        </div>
        <aside class="record-file-card" aria-labelledby="document-access-title"><div class="record-file-icon" aria-hidden="true">PDF</div><h2 id="document-access-title">Document access</h2><p>Open the preserved record in a new tab or download the archive copy.</p><dl class="record-verification"><div><dt>Date archived</dt><dd>${escapeHtml(record.date)}</dd></div><div><dt>Last reviewed</dt><dd>November 10, 2026</dd></div><div><dt>Source status</dt><dd>${escapeHtml(sourceStatus)}</dd></div><div><dt>Completeness</dt><dd>${escapeHtml(record.completeness)}</dd></div><div><dt>File size</dt><dd>${formatFileSize(pdfBytes.length)}</dd></div><div><dt>SHA-256</dt><dd><code>${checksum}</code></dd></div></dl><div class="record-file-actions"><a href="../${record.pdf}" target="_blank" rel="noopener">View PDF <span>↗</span></a><a href="../${record.pdf}" download>Download PDF <span>↓</span></a>${record.source ? `<a href="${record.source}" target="_blank" rel="noopener noreferrer">${escapeHtml(record.sourceLabel || "Original source")} <span>↗</span></a>` : ""}<a href="../?intent=correction&amp;record=${record.number}#contact">Report a correction <span>→</span></a></div></aside>
      </div>
      <section class="record-related" aria-labelledby="related-records"><h2 id="related-records">Related records</h2><div class="record-related-grid">${related.map(({ candidate, sharedTags }) => `<a class="record-related-card" href="${candidate.slug}.html"><span>Record ${candidate.number}</span><h3>${escapeHtml(candidate.title)}</h3><p>${escapeHtml(relatedReason(record, candidate, sharedTags))}</p><small>${escapeHtml(candidate.tags.join(" · "))}</small></a>`).join("")}</div></section>
    </main>
    <footer class="record-page-footer"><p>© 2026 Roblox Secret Archives · Independent and unaffiliated with Roblox Corporation.</p><div><a href="../#disclaimer">Disclaimer</a><a href="../archive/terms-of-service-and-privacy-policy.pdf?v=20261017" target="_blank" rel="noopener">Terms of Service &amp; Privacy Policy</a></div></footer>
  </body>
</html>`;
  fs.writeFileSync(path.join(outputDirectory, `${record.slug}.html`), page);
}

const sitemapUrls = [
  { location: `${siteUrl}/`, lastModified: "2026-11-10" },
  ...records.map((record) => ({ location: `${siteUrl}/records/${record.slug}.html`, lastModified: record.isoDate })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((item) => `  <url><loc>${item.location}</loc><lastmod>${item.lastModified}</lastmod></url>`).join("\n")}
</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);
console.log(`Generated ${records.length} record pages.`);
