(() => {
  "use strict";

  const records = window.archiveRecords || [];
  const tabs = [...document.querySelectorAll("[data-tool-tab]")];
  const panels = [...document.querySelectorAll("[data-tool-panel]")];
  if (!tabs.length) return;

  const $ = (selector) => document.querySelector(selector);
  const escapeHtml = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const recordLabel = (record) => `Record ${record.number} — ${record.title}`;
  const siteRoot = "https://hamgram77.github.io/roblox-secret-archives/";

  function selectTool(name, focus = false) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.toolTab === name;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.toolPanel !== name; });
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => selectTool(tab.dataset.toolTab)));
  $(".tool-tab-list")?.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = Math.max(0, tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"));
    let next = current;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (current + 1) % tabs.length;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    selectTool(tabs[next].dataset.toolTab, true);
  });

  async function copyText(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => { button.textContent = original; }, 1400);
    } catch {
      window.prompt("Copy this text:", text);
    }
  }

  function downloadText(filename, text) {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // 01 — Record comparison
  const compareFirst = $("#compare-first");
  const compareSecond = $("#compare-second");
  [compareFirst, compareSecond, $("#citation-record"), $("#packet-records")].forEach((select) => {
    records.forEach((record) => select?.add(new Option(recordLabel(record), record.number)));
  });
  if (compareSecond && records[1]) compareSecond.value = records[1].number;

  function renderComparison() {
    const first = records.find((record) => record.number === compareFirst?.value);
    const second = records.find((record) => record.number === compareSecond?.value);
    const output = $("#compare-output");
    if (!first || !second) return;
    const shared = first.tags.filter((tag) => second.tags.includes(tag));
    const card = (record) => `<article><span>Record ${escapeHtml(record.number)}</span><h4>${escapeHtml(record.title)}</h4><time>${escapeHtml(record.date)}</time><p>${escapeHtml(record.description)}</p><div>${record.tags.map((tag) => `<b>${escapeHtml(tag)}</b>`).join("")}</div><a href="records/${encodeURIComponent(record.slug)}.html">Open record →</a></article>`;
    output.innerHTML = `${card(first)}${card(second)}<aside><strong>${shared.length ? `Shared topics: ${shared.map(escapeHtml).join(", ")}` : "No exact topic tags overlap."}</strong><p>${first.number === second.number ? "You selected the same record twice." : "This comparison uses the archive index; read both PDFs before drawing conclusions."}</p></aside>`;
  }
  compareFirst?.addEventListener("change", renderComparison);
  compareSecond?.addEventListener("change", renderComparison);
  renderComparison();

  // 02 — Privacy redaction assistant
  const privacyRules = [
    ["email address", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}\b/gi],
    ["phone number", /(?<!\d)(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}(?!\d)/g],
    ["exact age", /\b(?:i\s+am|i['’]?m|age\s*(?:is|:|=))\s*\d{1,2}(?:\s*(?:years?\s*old|y\/?o))?/gi],
    ["real-name disclosure", /\bmy\s+(?:(?:real|full|legal)\s+)?name\s*(?:is|:)\s+[^\n,.]{2,60}/gi],
    ["Social Security number", /\b\d{3}[- ]\d{2}[- ]\d{4}\b/g],
    ["street address", /\b\d{1,6}\s+[A-Z0-9.'-]+(?:\s+[A-Z0-9.'-]+){0,5}\s+(?:street|st|road|rd|avenue|ave|boulevard|blvd|lane|ln|drive|dr|court|ct|way|parkway|pkwy)\b/gi],
    ["credential or secret", /\b(?:password|passcode|api\s*key|auth(?:entication)?\s*token)\s*(?:is|:|=)\s*\S+/gi],
  ];
  $("#redaction-scan")?.addEventListener("click", () => {
    const text = $("#redaction-input").value;
    const findings = [];
    privacyRules.forEach(([label, regex]) => {
      regex.lastIndex = 0;
      const count = [...text.matchAll(regex)].length;
      if (count) findings.push({ label, count });
    });
    const result = $("#redaction-result");
    result.className = `tool-result ${findings.length ? "is-warning" : "is-safe"}`;
    result.innerHTML = findings.length
      ? `<strong>Possible personal information found.</strong><p>Review and remove: ${findings.map((item) => `${escapeHtml(item.label)} (${item.count})`).join(", ")}.</p><small>The tool identifies categories only and does not repeat the matched text.</small>`
      : `<strong>No listed pattern was detected.</strong><p>Manually review the text anyway. Automated checks can miss names, context, and unusual formatting.</p>`;
  });
  $("#redaction-clear")?.addEventListener("click", () => {
    $("#redaction-input").value = "";
    $("#redaction-result").className = "tool-result";
    $("#redaction-result").textContent = "No text checked yet.";
  });

  // 03 — Incident timeline builder
  const timelineKey = "rda-incident-timeline-v1";
  let timeline = [];
  try { timeline = JSON.parse(localStorage.getItem(timelineKey) || "[]"); } catch { timeline = []; }
  function timelineText() {
    return [...timeline].sort((a, b) => a.date.localeCompare(b.date)).map((item) => `${new Date(item.date).toLocaleString()} — ${item.event}${item.source ? `\nSource: ${item.source}` : ""}`).join("\n\n");
  }
  function renderTimeline() {
    const output = $("#timeline-output");
    const ordered = [...timeline].sort((a, b) => a.date.localeCompare(b.date));
    output.innerHTML = ordered.length ? ordered.map((item) => `<li><time>${escapeHtml(new Date(item.date).toLocaleString())}</time><strong>${escapeHtml(item.event)}</strong>${item.source ? `<p>${escapeHtml(item.source)}</p>` : ""}<button type="button" data-remove-timeline="${escapeHtml(item.id)}" aria-label="Remove timeline event">Remove</button></li>`).join("") : "<li class=\"timeline-empty\">No events added yet.</li>";
  }
  function saveTimeline() { localStorage.setItem(timelineKey, JSON.stringify(timeline)); renderTimeline(); }
  $("#timeline-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    timeline.push({ id: String(Date.now()), date: $("#timeline-date").value, event: $("#timeline-event").value.trim(), source: $("#timeline-source").value.trim() });
    saveTimeline(); event.currentTarget.reset();
  });
  $("#timeline-output")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-timeline]");
    if (!button) return;
    timeline = timeline.filter((item) => item.id !== button.dataset.removeTimeline); saveTimeline();
  });
  $("#timeline-copy")?.addEventListener("click", (event) => copyText(timelineText() || "No events added.", event.currentTarget));
  $("#timeline-clear")?.addEventListener("click", () => { timeline = []; localStorage.removeItem(timelineKey); renderTimeline(); });
  renderTimeline();

  // 04 — Evidence checklist
  const evidenceLists = {
    moderation: ["Moderation notice and exact displayed reason", "Asset, experience, or account identifier", "Date and time of the action", "Prior appeal or case number", "Relevant policy link", "Short factual chronology", "Requested resolution"],
    billing: ["Transaction ID or receipt number", "Date, amount, and currency", "Redacted proof of purchase", "Account or experience identifier", "Prior case number", "Expected versus actual result", "Requested reconciliation"],
    technical: ["UTC incident times", "Universe ID and affected service", "Exact error code", "Minimal reproduction steps", "Client and server logs with secrets removed", "Status-page or outage reference", "Observed versus expected behavior"],
    security: ["Approximate compromise time", "Affected account identifier", "Security alerts", "Actions already taken", "Known devices or sessions without IP addresses", "Purchase history with sensitive details removed", "Requested security action"],
    discovery: ["Universe or asset ID", "Date the change began", "Before-and-after metrics", "Moderation-status screenshot with personal data removed", "Publishing or catalog status", "Prior case number", "Requested index review"],
  };
  function renderEvidence() {
    const type = $("#evidence-type").value;
    $("#evidence-output").innerHTML = evidenceLists[type].map((item, index) => `<label><input type="checkbox" data-evidence-item /><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(item)}</label>`).join("");
  }
  $("#evidence-type")?.addEventListener("change", renderEvidence);
  $("#evidence-copy")?.addEventListener("click", (event) => copyText([...document.querySelectorAll("#evidence-output label")].map((label) => `${label.querySelector("input").checked ? "[x]" : "[ ]"} ${label.textContent.trim().replace(/^\d{2}/, "")}`).join("\n"), event.currentTarget));
  $("#evidence-reset")?.addEventListener("click", () => document.querySelectorAll("[data-evidence-item]").forEach((box) => { box.checked = false; }));
  renderEvidence();

  // 05 — Draft quality checker
  $("#quality-check")?.addEventListener("click", () => {
    const text = $("#quality-input").value.trim();
    const checks = [
      ["Enough context", text.length >= 100, "Add a concise explanation of what happened."],
      ["Chronology", /\b(?:on|at|after|before|when|date|time|first|then)\b/i.test(text), "Include dates or an ordered sequence."],
      ["Specific identifier", /\b(?:id|case|ticket|universe|asset|transaction|error|log)\b/i.test(text), "Reference a non-sensitive case, asset, or error identifier."],
      ["Clear request", /\b(?:please|request|restore|review|correct|refund|reconcile|verify|escalate)\b/i.test(text), "State the exact action you are requesting."],
      ["Professional wording", !/\b(?:plz|unban me|fix this|i did nothing)\b/i.test(text), "Replace low-detail demands with neutral factual language."],
      ["Readable structure", /[.!?]\s+[A-Z]|\n/.test(text), "Break the draft into complete sentences or short paragraphs."],
    ];
    const passed = checks.filter((check) => check[1]).length;
    const score = Math.round((passed / checks.length) * 100);
    $("#quality-output").innerHTML = `<div class="quality-score"><strong>${score}</strong><span>/ 100<br />structure score</span></div><ul>${checks.map(([name, ok, advice]) => `<li class="${ok ? "is-pass" : "is-improve"}"><b>${ok ? "✓" : "→"} ${escapeHtml(name)}</b><span>${ok ? "Present" : escapeHtml(advice)}</span></li>`).join("")}</ul><p>This score evaluates writing structure only—not truth, eligibility, or likely outcome.</p>`;
  });

  // 06 — Glossary
  const glossary = [
    ["Appeal", "A request for a moderation decision to be reviewed. An appeal does not guarantee reversal."],
    ["DataStore", "A Roblox cloud service used by experiences to persist data between sessions."],
    ["DevEx", "Developer Exchange, the program through which eligible creators may exchange earned Robux under current program rules."],
    ["DMCA counter-notice", "A legal response to a copyright takedown. It carries legal consequences and should not be filed casually."],
    ["HTTP 500", "A general server-side error indicating that a service could not complete a request."],
    ["HttpService", "A Roblox engine service that supports approved web requests and data encoding functions."],
    ["Open Cloud", "Roblox web APIs intended for external tools and automated workflows."],
    ["TextChatService", "The modern Roblox service for in-experience text chat configuration and delivery."],
    ["UGC", "User-generated content, such as creator-made avatar items, experiences, audio, or other assets."],
    ["Universe ID", "The identifier for a Roblox experience as a whole; it differs from an individual place ID."],
    ["SHA-256", "A cryptographic hash used here as a file-integrity fingerprint. Matching hashes strongly indicate identical file bytes."],
    ["HAR file", "A browser network log that may contain sensitive tokens or URLs and should be carefully redacted before sharing."],
  ];
  function renderGlossary() {
    const query = $("#glossary-search").value.trim().toLowerCase();
    const filtered = glossary.filter(([term, definition]) => `${term} ${definition}`.toLowerCase().includes(query));
    $("#glossary-output").innerHTML = filtered.length ? filtered.map(([term, definition]) => `<article><h4>${escapeHtml(term)}</h4><p>${escapeHtml(definition)}</p></article>`).join("") : "<p>No glossary term matches that search.</p>";
  }
  $("#glossary-search")?.addEventListener("input", renderGlossary); renderGlossary();

  // 07 — Archive timeline
  const byDate = Object.groupBy ? Object.groupBy(records, (record) => record.date) : records.reduce((groups, record) => ((groups[record.date] ||= []).push(record), groups), {});
  $("#archive-timeline-output").innerHTML = Object.entries(byDate).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([date, datedRecords]) => `<section><time>${escapeHtml(date)}</time><div>${datedRecords.map((record) => `<a href="records/${encodeURIComponent(record.slug)}.html"><span>${escapeHtml(record.number)}</span><strong>${escapeHtml(record.title)}</strong><small>${record.tags.map(escapeHtml).join(" · ")}</small></a>`).join("")}</div></section>`).join("");

  // 08 — PDF metadata inspector
  $("#pdf-inspector-input")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    const output = $("#pdf-inspector-output");
    if (!file) { output.textContent = "No PDF selected."; return; }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) { output.innerHTML = "<strong>Not a PDF.</strong> Choose a .pdf file."; return; }
    output.textContent = "Inspecting locally…";
    try {
      const pdfjs = await import("./vendor/pdfjs/pdf.min.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("vendor/pdfjs/pdf.worker.min.mjs", document.baseURI).href;
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjs.getDocument({ data: bytes, isEvalSupported: false }).promise;
      const metadata = await pdf.getMetadata().catch(() => ({ info: {}, metadata: null }));
      const info = metadata.info || {};
      const fields = [["Filename", file.name], ["File size", `${(file.size / 1024).toFixed(1)} KB`], ["Pages", pdf.numPages], ["Title", info.Title || "Not set"], ["Author", info.Author || "Not set"], ["Creator", info.Creator || "Not set"], ["Producer", info.Producer || "Not set"]];
      output.innerHTML = `<strong>Local inspection complete</strong><dl>${fields.map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl><p>${[info.Author, info.Creator, info.Producer].some(Boolean) ? "Review the metadata before sharing; identifying or software information is present." : "No author, creator, or producer value was reported."}</p>`;
      await pdf.destroy();
    } catch { output.innerHTML = "<strong>Could not read this PDF.</strong><p>It may be damaged, encrypted, or use an unsupported structure.</p>"; }
  });

  // 09 — Citation builder
  function citationText() {
    const record = records.find((item) => item.number === $("#citation-record")?.value) || records[0];
    const style = $("#citation-style")?.value;
    const url = `${siteRoot}records/${record.slug}.html`;
    if (style === "mla") return `“${record.title}.” Roblox Developer Archives, ${record.date}, ${url}. Accessed ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`;
    if (style === "apa") return `Roblox Developer Archives. (${record.isoDate.slice(0, 4)}, ${new Date(`${record.isoDate}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric" })}). ${record.title}. ${url}`;
    return `Roblox Developer Archives, Record ${record.number}: “${record.title}” (${record.date}). ${url}`;
  }
  function renderCitation() { $("#citation-output").textContent = citationText(); }
  $("#citation-record")?.addEventListener("change", renderCitation); $("#citation-style")?.addEventListener("change", renderCitation);
  $("#citation-copy")?.addEventListener("click", (event) => copyText(citationText(), event.currentTarget)); renderCitation();

  // 11 — Incident packet exporter
  function packetText() {
    const selected = [...$("#packet-records").selectedOptions].map((option) => records.find((record) => record.number === option.value)).filter(Boolean);
    return [`INCIDENT PACKET`, `Generated locally: ${new Date().toLocaleString()}`, "", `TITLE`, $("#packet-title").value.trim() || "Not provided", "", `SUMMARY`, $("#packet-summary").value.trim() || "Not provided", "", `REFERENCED ARCHIVE RECORDS`, selected.length ? selected.map((record) => `- Record ${record.number}: ${record.title}\n  ${siteRoot}records/${record.slug}.html`).join("\n") : "None selected", "", `REQUESTED RESOLUTION`, $("#packet-resolution").value.trim() || "Not provided", "", `PRIVACY REMINDER`, "Review this packet manually and remove personal information before sharing. This file was generated locally and was not submitted to Roblox."].join("\n");
  }
  $("#packet-preview")?.addEventListener("click", () => { $("#packet-output").textContent = packetText(); });
  $("#packet-copy")?.addEventListener("click", (event) => copyText(packetText(), event.currentTarget));
  $("#packet-download")?.addEventListener("click", () => downloadText("roblox-incident-packet.txt", packetText()));

  // 12 — Archive statistics
  const tagCounts = records.flatMap((record) => record.tags).reduce((counts, tag) => ((counts[tag] = (counts[tag] || 0) + 1), counts), {});
  const mainTopics = ["publishing", "moderation", "economy", "technical"].map((tag) => [tag, records.filter((record) => record.tags.includes(tag)).length]);
  $("#stats-summary").innerHTML = [[records.length, "records"], [new Set(records.flatMap((record) => record.tags)).size, "unique topic tags"], [new Set(records.map((record) => record.date)).size, "publication dates"], [records.filter((record) => record.source).length, "external sources linked"]].map(([value, label]) => `<article><strong>${value}</strong><span>${label}</span></article>`).join("");
  const maxCount = Math.max(...mainTopics.map(([, count]) => count), 1);
  $("#stats-chart").innerHTML = `<h4>Records by primary collection topic</h4>${mainTopics.map(([tag, count]) => `<div><span>${escapeHtml(tag)}</span><i><b style="width:${(count / maxCount) * 100}%"></b></i><strong>${count}</strong></div>`).join("")}<p>One record can appear in more than one topic, so topic totals may exceed the record count. Most-used tag: ${escapeHtml(Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "none")}.</p>`;
})();
