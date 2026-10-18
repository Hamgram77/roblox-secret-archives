const legacyRecords = [
  {
    number: "01",
    title: "Roblox Publishing System & Creator Economic Flaws",
    date: "October 14, 2026",
    description: "Examines alleged structural and financial barriers in Roblox publishing, including age-based discovery restrictions, review loops, traffic requirements, and expedited-review fees.",
    tags: ["publishing", "economy", "discovery"],
    pdf: "archive/documents/01-roblox-publishing-system-flaws.pdf",
    source: "https://docs.google.com/document/d/1RsO1tzheg3YgcevnZhCY6pyzpSiYLjdTJqp2LKKW4FY/edit",
  },
  {
    number: "02",
    title: "Roblox Appeals & Creator Economic Flaws",
    date: "October 14, 2026",
    description: "Catalogs concerns about automated appeals, review lockouts, publishing-fee forfeiture, linked-account enforcement, diagnostic transparency, and appeal deadlines.",
    tags: ["moderation", "economy", "appeals"],
    pdf: "archive/documents/02-roblox-appeals-creator-economic-flaws.pdf",
    source: "https://docs.google.com/document/d/1dlw7cGDGaTjabJG2lWY_CuwpQF9SBbNVLa2DW5z-t2o/edit",
  },
  {
    number: "03",
    title: "Roblox Automated Reporting System Flaws",
    date: "October 14, 2026",
    description: "Describes alleged weaknesses in automated reporting, including mass-report triggers, ignored low-volume reports, keyword interpretation, evasion techniques, and moderator incentives.",
    tags: ["moderation", "reporting", "automation"],
    pdf: "archive/documents/03-roblox-automated-reporting-flaws.pdf",
    source: "https://docs.google.com/document/d/1BgnrDcPA6U2I2ksVx61vCr9KLHTUAYSVe8cvHE0KsvM/edit",
  },
  {
    number: "04",
    title: "DevEx Conversion Disparity & Economic Corrosion",
    date: "October 14, 2026",
    description: "Examines the gap between consumer spending and creator payouts through marketplace fees, currency conversion, earned-Robux verification, and DevEx eligibility controls.",
    tags: ["economy", "devex", "creator earnings"],
    pdf: "archive/documents/04-devex-conversion-disparity-economic-corrosion.pdf",
    source: "https://docs.google.com/document/d/1urqbMlOSDuBI-pk64XLS-sUKCqMxPKG4N-2012rui9I/edit",
  },
  {
    number: "05",
    title: "Algorithmic Obfuscation: A/B Testing & Discovery Shadows",
    date: "October 14, 2026",
    description: "Documents concerns about opaque discovery changes, unequal A/B-test cohorts, metric shifts, impression crashes, and dependence on paid promotion.",
    tags: ["publishing", "discovery", "algorithms"],
    pdf: "archive/documents/05-algorithmic-obfuscation-ab-testing.pdf",
    source: "https://docs.google.com/document/d/1Qgq1DKEP7BUdKyJFYID1Veh56XUz3xv70p3_h99wmDU/edit",
  },
  {
    number: "06",
    title: "Retroactive Moderation & the Audio Sunset",
    date: "October 14, 2026",
    description: "Preserves the effects of the March 2022 audio privacy change and examines the operational risks of retroactive moderation for legacy assets.",
    tags: ["moderation", "audio", "asset policy"],
    pdf: "archive/documents/06-retroactive-moderation-audio-sunset.pdf",
    source: "https://docs.google.com/document/d/1qZNupm95cmOVX5r6Oh5w-ZF44dIyM_4-WJ5j6KvUWhQ/edit",
  },
  {
    number: "07",
    title: "Weaponized DMCA Pipeline & Extortion",
    date: "October 14, 2026",
    description: "Reviews alleged abuse of automated copyright takedowns, strategically timed claims, counter-notice delays, and their effects on independent developers.",
    tags: ["moderation", "legal", "dmca"],
    pdf: "archive/documents/07-weaponized-dmca-pipeline-extortion.pdf",
    source: "https://docs.google.com/document/d/15Gga-Yj7V7S27KOzotroATtz5JXmRuSTVCXnzJvyGso/edit",
  },
  {
    number: "08",
    title: "Technical Resource: TextChatService Compliance",
    date: "October 14, 2026",
    description: "Provides a technical checklist for TextChatService configuration, filtered message routing, custom chat interfaces, and pre-publication testing.",
    tags: ["publishing", "technical", "chat safety"],
    pdf: "archive/documents/08-textchatservice-compliance.pdf",
    source: "https://docs.google.com/document/d/1NlWPsZ2KjcSQWL2jXr2XvZaNO-Cdx13JEyh0P4TU7U8/edit",
  },
  {
    number: "09",
    title: "The Black Box of the DevEx Compliance Pipeline",
    date: "October 17, 2026",
    isoDate: "2026-10-17",
    description: "Examines transparency gaps between DevEx eligibility, compliance review, settlement, and support escalation, with evidence standards and proposed financial-review reforms.",
    tags: ["economy", "devex", "financial compliance"],
    pdf: "archive/documents/09-devex-compliance-pipeline.pdf",
  },
  {
    number: "10",
    title: "The Desynced Marketplace Appeals Loop",
    date: "October 17, 2026",
    isoDate: "2026-10-17",
    description: "Analyzes post-appeal state mismatches across moderation, creator dashboards, catalog visibility, commerce, support, and fee reconciliation.",
    tags: ["publishing", "moderation", "technical", "ugc"],
    pdf: "archive/documents/10-desynced-marketplace-appeals-loop.pdf",
  },
  {
    number: "11",
    title: "Systemic DataStore Corruption & Infrastructure Compliance",
    date: "October 17, 2026",
    isoDate: "2026-10-17",
    description: "Models DataStore and Cloud API incident triage, separates creator-code faults from platform-wide failures, and proposes evidence, recovery, and status controls.",
    tags: ["technical", "datastore", "infrastructure"],
    pdf: "archive/documents/11-datastore-corruption-infrastructure-compliance.pdf",
  },
];

const records = window.archiveRecords || legacyRecords;
records.forEach((record) => {
  record.slug ||= record.pdf.split("/").pop().replace(/\.pdf$/i, "");
  record.isoDate ||= "2026-10-14";
});
const archiveList = document.querySelector("#archive-list");
const searchInput = document.querySelector("#archive-search");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const clearSearch = document.querySelector("#clear-search");
const sortSelect = document.querySelector("#archive-sort");
const sortSummary = document.querySelector("#sort-summary");
const filters = [...document.querySelectorAll(".filter")];
const menuButton = document.querySelector(".menu-button");
const menuLabel = menuButton.querySelector(".sr-only");
const siteNav = document.querySelector("#site-nav");
const sitePanels = [...document.querySelectorAll("[data-site-panel]")];
const siteTabs = [...document.querySelectorAll("[data-site-tab]")];
const sitePanelIds = new Set(sitePanels.map((panel) => panel.id));
const templateTabs = [...document.querySelectorAll("[data-template-tab]")];
const templatePanels = [...document.querySelectorAll("[data-template-panel]")];
const contactForm = document.querySelector(".contact-form");
const contactPrivacyBlock = document.querySelector("#home-contact-privacy-block");
const contactReplyEmail = document.querySelector("#home-reply-email");
const contactPdfInput = document.querySelector("#home-pdf-attachment");
const contactPdfStatus = document.querySelector("#home-pdf-status");
const contactPdfRemove = document.querySelector("#home-pdf-remove");
const contactPdfPermissionWrap = document.querySelector("#home-pdf-permission-wrap");
const contactPdfPermission = document.querySelector("#home-pdf-permission");
const contactSubmitButton = contactForm?.querySelector('[type="submit"]');
let activeFilter = "publishing";
let activeSort = new URLSearchParams(window.location.search).get("sort") || "number-asc";
let pdfJsModulePromise;
let contactPdfScanInProgress = false;

const filterLabels = {
  all: "all",
  publishing: "publishing",
  moderation: "moderation",
  economy: "creator economy",
  technical: "technical",
};

const sortLabels = {
  "number-asc": "record number · ascending",
  "number-desc": "record number · descending",
  newest: "newest added",
  oldest: "oldest added",
  title: "title · A–Z",
  topic: "topic",
};
if (!sortLabels[activeSort]) activeSort = "number-asc";
sortSelect.value = activeSort;

const contactPrivacyPatterns = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}\b/i,
  /\b(?:i\s+am|i['’]?m|im)\s+(?:aged?\s+)?\d{1,2}(?:\s*(?:years?\s*old|y\/?o))?\b/i,
  /\bage\s*(?:is|:|=)\s*\d{1,2}\b/i,
  /\b\d{1,2}\s*(?:years?\s*old|y\/?o)\b/i,
  /\bmy\s+(?:(?:real|full|legal)\s+)?name\s*(?:is|:)\s*\S+/i,
  /\b(?:real|full|legal)\s+name\s*(?:is|:)\s*\S+/i,
  /\b\d{3}[-\s]\d{2}[-\s]\d{4}\b/,
  /\b(?:my|our)\s+(?:(?:home|street|mailing|residential)\s+)?address\s*(?:is|:|=)\s*\d{1,6}\s+[A-Z0-9.'-]+(?:\s+[A-Z0-9.'-]+){0,5}\s+(?:street|st|road|rd|avenue|ave|boulevard|blvd|lane|ln|drive|dr|court|ct|circle|cir|way|parkway|pkwy)\b/i,
  /\b(?:i|we)\s+live\s+at\s+\d{1,6}\s+[A-Z0-9.'-]+(?:\s+[A-Z0-9.'-]+){0,5}\s+(?:street|st|road|rd|avenue|ave|boulevard|blvd|lane|ln|drive|dr|court|ct|circle|cir|way|parkway|pkwy)\b/i,
  /\bP\.?\s*O\.?\s+Box\s+\d+\b/i,
  /\b(?:passport|driver['’]?s?\s+licen[cs]e|government\s+id|social\s+security)\s*(?:number|no\.?|#)?\s*(?:is|:|=)\s*[A-Z0-9-]{5,}\b/i,
];

const CONTACT_TEXT_BLOCK_MESSAGE = "Submission Blocked: To protect your privacy and remain compliant with COPPA, do not include real names, email addresses, phone numbers, exact ages, or personal identifiers in your record description.";
const CONTACT_PDF_BLOCK_MESSAGE = "Submission Blocked: The selected PDF appears to contain personal information. Remove real names, email addresses, phone numbers, exact ages, home addresses, or personal identifiers before submitting it.";
const CONTACT_PDF_UNREADABLE_MESSAGE = "Submission Blocked: The selected PDF could not be safely scanned. Upload a text-based, unencrypted PDF without embedded attachments.";
const PDF_MAX_BYTES = 10 * 1024 * 1024;

function hasLikelyPhoneNumber(value) {
  const candidatePattern = /(?:(?:\+?\d)|(?:\(\d))[\d\s().-]{5,}\d/g;
  const identifierContextPattern = /\b(?:ticket|case|report|record|asset|universe|place|log|error|code|transaction|reference|ref|id)\s*[:#=-]?\s*$/i;
  const phoneContextPattern = /\b(?:phone|telephone|mobile|cell|call|text(?:\s+me)?|contact\s+number|number\s+is)\b/i;
  const strongPhoneFormatPattern = /(?:\(\d{3}\)\s*\d{3}[-.\s]\d{4}|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b|\b\d{3}[-.\s]\d{4}\b|\+\d{1,3}[-.\s](?:\d{2,4}[-.\s]){1,3}\d{3,4})/;

  for (const match of value.matchAll(candidatePattern)) {
    const digits = match[0].replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 11) continue;

    const start = match.index || 0;
    const before = value.slice(Math.max(0, start - 32), start);
    const context = value.slice(Math.max(0, start - 32), start + match[0].length + 32);
    const hasPhoneContext = phoneContextPattern.test(context);
    if (identifierContextPattern.test(before) && !hasPhoneContext) continue;
    if (hasPhoneContext || strongPhoneFormatPattern.test(match[0])) return true;
  }

  return false;
}

function containsPersonalInformation(value) {
  const normalized = String(value || "").normalize("NFKC");
  return contactPrivacyPatterns.some((pattern) => pattern.test(normalized)) || hasLikelyPhoneNumber(normalized);
}

function contactFormContainsPersonalInformation(form) {
  const editableTextFields = form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="submit"]):not([type="file"]):not([name="_honey"]), textarea');
  return [...editableTextFields].some((field) => field !== contactReplyEmail && containsPersonalInformation(field.value));
}

function syncPdfPermission() {
  const hasPdf = Boolean(contactPdfInput?.files?.length);
  contactPdfPermissionWrap.hidden = !hasPdf;
  contactPdfPermission.required = hasPdf;
  contactPdfRemove.hidden = !hasPdf;
  if (!hasPdf) contactPdfPermission.checked = false;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function showContactBlock(message) {
  contactPrivacyBlock.textContent = message;
  contactPrivacyBlock.hidden = false;
  contactPrivacyBlock.focus({ preventScroll: true });
  contactPrivacyBlock.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function clearContactBlock() {
  contactPrivacyBlock.hidden = true;
}

function setPdfStatus(message, state = "") {
  if (!contactPdfStatus) return;
  contactPdfStatus.textContent = message;
  contactPdfStatus.classList.remove("is-scanning", "is-approved", "is-error");
  if (state) contactPdfStatus.classList.add(`is-${state}`);
}

function pdfTextContainsPersonalInformation(value) {
  const text = String(value || "");
  const punctuationJoined = text
    .replace(/([A-Z0-9._%+-])\s*@\s*([A-Z0-9])/gi, "$1@$2")
    .replace(/([A-Z0-9])\s*\.\s*([A-Z]{2,63})\b/gi, "$1.$2");
  return containsPersonalInformation(text) || containsPersonalInformation(punctuationJoined);
}

async function loadPdfJs() {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import("./vendor/pdfjs/pdf.min.mjs").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("vendor/pdfjs/pdf.worker.min.mjs", document.baseURI).href;
      return pdfjs;
    });
  }
  return pdfJsModulePromise;
}

async function scanPdfAttachment(file) {
  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith(".pdf") || (file.type && file.type !== "application/pdf")) {
    return { approved: false, message: "Submission Blocked: Only PDF document attachments are accepted. Photos, videos, and other file types are not allowed." };
  }
  if (!file.size || file.size > PDF_MAX_BYTES) {
    return { approved: false, message: "Submission Blocked: The PDF must be larger than 0 bytes and no more than 10 MB." };
  }
  if (pdfTextContainsPersonalInformation(file.name)) {
    return { approved: false, message: CONTACT_PDF_BLOCK_MESSAGE };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const signature = new TextDecoder("ascii").decode(bytes.slice(0, 5));
  if (signature !== "%PDF-") {
    return { approved: false, message: "Submission Blocked: The selected file does not contain a valid PDF signature." };
  }

  const pdfjs = await loadPdfJs();
  const loadingTask = pdfjs.getDocument({ data: bytes, isEvalSupported: false, stopAtErrors: true });
  let pdfDocument;

  try {
    pdfDocument = await loadingTask.promise;
    const attachments = await pdfDocument.getAttachments();
    if (attachments && Object.keys(attachments).length) {
      return { approved: false, message: CONTACT_PDF_UNREADABLE_MESSAGE };
    }

    const metadata = await pdfDocument.getMetadata().catch(() => null);
    const metadataText = Object.values(metadata?.info || {}).filter((value) => typeof value === "string").join(" ");
    if (pdfTextContainsPersonalInformation(metadataText)) {
      return { approved: false, message: CONTACT_PDF_BLOCK_MESSAGE };
    }

    let extractableCharacters = 0;
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      setPdfStatus(`Scanning PDF page ${pageNumber} of ${pdfDocument.numPages} locally…`, "scanning");
      const page = await pdfDocument.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter((item) => typeof item.str === "string")
        .map((item) => `${item.str}${item.hasEOL ? "\n" : " "}`)
        .join("");
      extractableCharacters += (pageText.match(/[\p{L}\p{N}]/gu) || []).length;
      page.cleanup();
      if (pdfTextContainsPersonalInformation(pageText)) {
        return { approved: false, message: CONTACT_PDF_BLOCK_MESSAGE };
      }
    }

    if (extractableCharacters < 20) {
      return { approved: false, message: CONTACT_PDF_UNREADABLE_MESSAGE };
    }
    return { approved: true };
  } catch {
    return { approved: false, message: CONTACT_PDF_UNREADABLE_MESSAGE };
  } finally {
    await loadingTask.destroy();
  }
}

function recordTemplate(record) {
  return `
    <article class="archive-card">
      <span class="record-number">DOC—${record.number}</span>
      <div class="record-title">
        <h3>${record.title}</h3>
        <time datetime="${record.isoDate || "2026-10-14"}">Added ${record.date}</time>
      </div>
      <div class="record-copy">
        <p class="record-description">${record.description}</p>
        <div class="record-tags">${record.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </div>
      <div class="record-actions">
        <a class="action-primary" href="records/${record.slug}.html">Record page <span aria-hidden="true">→</span></a>
        <a href="${record.pdf}" target="_blank" rel="noopener">View PDF <span aria-hidden="true">↗</span></a>
        <a href="${record.pdf}" download>Download <span aria-hidden="true">↓</span></a>
        ${record.source ? `<a href="${record.source}" target="_blank" rel="noopener noreferrer">Google source <span aria-hidden="true">↗</span></a>` : ""}
      </div>
    </article>`;
}

function renderRecords() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = records.filter((record) => {
    const searchable = [record.title, record.description, ...record.tags].join(" ").toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesFilter = activeFilter === "all" || record.tags.includes(activeFilter);
    return matchesQuery && matchesFilter;
  }).sort((a, b) => {
    if (activeSort === "number-desc") return Number(b.number) - Number(a.number);
    if (activeSort === "newest") return b.isoDate.localeCompare(a.isoDate) || Number(b.number) - Number(a.number);
    if (activeSort === "oldest") return a.isoDate.localeCompare(b.isoDate) || Number(a.number) - Number(b.number);
    if (activeSort === "title") return a.title.localeCompare(b.title);
    if (activeSort === "topic") return a.tags[0].localeCompare(b.tags[0]) || Number(a.number) - Number(b.number);
    return Number(a.number) - Number(b.number);
  });

  archiveList.innerHTML = filtered.map(recordTemplate).join("");
  const topicLabel = filterLabels[activeFilter];
  const topicText = activeFilter === "all" ? "" : `${topicLabel} `;
  resultCount.textContent = `Showing ${filtered.length} ${topicText}${filtered.length === 1 ? "record" : "records"}`;
  sortSummary.textContent = `Sorted by ${sortLabels[activeSort]}`;
  emptyState.hidden = filtered.length !== 0;
}

function selectFilter(filter, focus = false) {
  activeFilter = filter.dataset.filter;
  filters.forEach((item) => {
    const selected = item === filter;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  archiveList.setAttribute("aria-labelledby", filter.id);
  renderRecords();
  if (focus) filter.focus();
}

function panelFromHash() {
  const requested = window.location.hash.slice(1);
  return sitePanelIds.has(requested) ? requested : "home";
}

function showSitePanel(panelId, updateHistory = false) {
  const targetId = sitePanelIds.has(panelId) ? panelId : "home";
  sitePanels.forEach((panel) => {
    const selected = panel.id === targetId;
    panel.hidden = !selected;
    panel.classList.toggle("is-active", selected);
  });
  siteTabs.forEach((tab) => {
    const selected = tab.getAttribute("href") === `#${targetId}`;
    tab.setAttribute("aria-selected", String(selected));
    if (selected) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
  if (updateHistory && window.location.hash !== `#${targetId}`) {
    window.history.pushState(null, "", `#${targetId}`);
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}

searchInput.addEventListener("input", renderRecords);
sortSelect.addEventListener("change", () => {
  activeSort = sortSelect.value;
  const url = new URL(window.location.href);
  if (activeSort === "number-asc") url.searchParams.delete("sort");
  else url.searchParams.set("sort", activeSort);
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  renderRecords();
});
filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    selectFilter(filter);
  });
});

document.querySelector(".filters").addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const currentIndex = filters.findIndex((filter) => filter.dataset.filter === activeFilter);
  let nextIndex = currentIndex;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % filters.length;
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + filters.length) % filters.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = filters.length - 1;
  selectFilter(filters[nextIndex], true);
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  selectFilter(filters.find((item) => item.dataset.filter === "publishing"));
  searchInput.focus();
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    showSitePanel("archive", true);
    searchInput.focus();
  }
});

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuLabel.textContent = isOpen ? "Open navigation" : "Close navigation";
  siteNav.classList.toggle("is-open", !isOpen);
});

function closeNavigation() {
  siteNav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuLabel.textContent = "Open navigation";
}

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeNavigation();
  }
});

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const panelId = link.getAttribute("href").slice(1);
  if (!sitePanelIds.has(panelId)) return;
  event.preventDefault();
  showSitePanel(panelId, true);
  closeNavigation();
});

window.addEventListener("hashchange", () => showSitePanel(panelFromHash()));

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
    closeNavigation();
    menuButton.focus();
  }
});

function selectTemplateTab(tab, focus = false) {
  const templateId = tab.dataset.templateTab;
  templateTabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  templatePanels.forEach((panel) => {
    panel.hidden = panel.dataset.templatePanel !== templateId;
  });
  if (focus) tab.focus();
}

templateTabs.forEach((tab) => {
  tab.addEventListener("click", () => selectTemplateTab(tab));
});

document.querySelector(".template-tab-list")?.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const currentIndex = templateTabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
  let nextIndex = currentIndex;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % templateTabs.length;
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + templateTabs.length) % templateTabs.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = templateTabs.length - 1;
  selectTemplateTab(templateTabs[nextIndex], true);
});

async function copyAppealTemplate(button) {
  const target = document.getElementById(button.dataset.copyTarget);
  const status = button.parentElement.querySelector(".template-copy-status");
  if (!target) return;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(target.value);
    } else {
      target.focus();
      target.select();
      document.execCommand("copy");
      window.getSelection()?.removeAllRanges();
    }
    button.classList.add("is-copied");
    button.firstChild.textContent = "Copied ";
    status.textContent = "Ready to paste.";
    window.setTimeout(() => {
      button.classList.remove("is-copied");
      button.firstChild.textContent = "Copy template ";
      status.textContent = "";
    }, 1800);
  } catch {
    target.focus();
    target.select();
    status.textContent = "Copy was blocked. Press Ctrl+C or Command+C.";
  }
}

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => copyAppealTemplate(button));
});

if (contactForm && contactPrivacyBlock) {
  contactPdfInput?.addEventListener("change", () => {
    clearContactBlock();
    const file = contactPdfInput.files?.[0];
    syncPdfPermission();
    if (!file) {
      setPdfStatus("No PDF selected. Files are scanned locally before upload.");
      return;
    }
    setPdfStatus(`${file.name} · ${formatFileSize(file.size)} · Privacy scan will run before submission.`);
  });

  contactPdfRemove?.addEventListener("click", () => {
    if (contactPdfScanInProgress) return;
    contactPdfInput.value = "";
    syncPdfPermission();
    clearContactBlock();
    setPdfStatus("No PDF selected. Files are scanned locally before upload.");
    contactPdfInput.focus();
  });

  syncPdfPermission();

  contactForm.addEventListener("submit", async (event) => {
    if (contactFormContainsPersonalInformation(contactForm)) {
      event.preventDefault();
      showContactBlock(CONTACT_TEXT_BLOCK_MESSAGE);
      return;
    }

    const file = contactPdfInput?.files?.[0];
    if (!file) {
      clearContactBlock();
      return;
    }

    event.preventDefault();
    if (contactPdfScanInProgress) return;
    contactPdfScanInProgress = true;
    contactSubmitButton.disabled = true;
    contactPdfRemove.disabled = true;
    contactSubmitButton.setAttribute("aria-busy", "true");
    setPdfStatus("Checking PDF type and content locally…", "scanning");

    try {
      const result = await scanPdfAttachment(file).catch(() => ({ approved: false, message: CONTACT_PDF_UNREADABLE_MESSAGE }));
      if (!result.approved) {
        setPdfStatus("PDF rejected. Nothing was submitted.", "error");
        showContactBlock(result.message);
        return;
      }

      if (contactPdfInput.files?.[0] !== file) {
        setPdfStatus("PDF selection changed during scanning. Nothing was submitted.", "error");
        showContactBlock("Submission Blocked: The selected PDF changed during the privacy scan. Please submit again so the current file can be checked.");
        return;
      }
      if (contactFormContainsPersonalInformation(contactForm)) {
        setPdfStatus("Form text changed during scanning. Nothing was submitted.", "error");
        showContactBlock(CONTACT_TEXT_BLOCK_MESSAGE);
        return;
      }

      clearContactBlock();
      setPdfStatus("PDF scan passed. Submitting through the existing secure route…", "approved");
      HTMLFormElement.prototype.submit.call(contactForm);
    } finally {
      contactPdfScanInProgress = false;
      contactSubmitButton.disabled = false;
      contactPdfRemove.disabled = false;
      contactSubmitButton.removeAttribute("aria-busy");
    }
  });
}

renderRecords();
showSitePanel(panelFromHash());
if (new URLSearchParams(window.location.search).get("contact") === "submitted") {
  document.querySelector("#home-contact-success").hidden = false;
  showSitePanel("contact");
}
