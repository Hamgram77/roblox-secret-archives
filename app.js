const records = [
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

const archiveList = document.querySelector("#archive-list");
const searchInput = document.querySelector("#archive-search");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const clearSearch = document.querySelector("#clear-search");
const filters = [...document.querySelectorAll(".filter")];
const menuButton = document.querySelector(".menu-button");
const menuLabel = menuButton.querySelector(".sr-only");
const siteNav = document.querySelector("#site-nav");
const sitePanels = [...document.querySelectorAll("[data-site-panel]")];
const siteTabs = [...document.querySelectorAll("[data-site-tab]")];
const sitePanelIds = new Set(sitePanels.map((panel) => panel.id));
const templateTabs = [...document.querySelectorAll("[data-template-tab]")];
const templatePanels = [...document.querySelectorAll("[data-template-panel]")];
let activeFilter = "publishing";

const filterLabels = {
  all: "all",
  publishing: "publishing",
  moderation: "moderation",
  economy: "creator economy",
  technical: "technical",
};

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
        <a class="action-primary" href="${record.pdf}" target="_blank" rel="noopener">View PDF <span aria-hidden="true">↗</span></a>
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
  });

  archiveList.innerHTML = filtered.map(recordTemplate).join("");
  const topicLabel = filterLabels[activeFilter];
  const topicText = activeFilter === "all" ? "" : `${topicLabel} `;
  resultCount.textContent = `Showing ${filtered.length} ${topicText}${filtered.length === 1 ? "record" : "records"}`;
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
  if (link.hasAttribute("data-home-contact")) {
    window.setTimeout(() => {
      const contactSection = document.querySelector("#home-contact");
      if (contactSection) window.scrollTo({ top: contactSection.getBoundingClientRect().top + window.scrollY - 76, behavior: "smooth" });
    }, 80);
  }
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

renderRecords();
showSitePanel(panelFromHash());
if (new URLSearchParams(window.location.search).get("contact") === "submitted") {
  document.querySelector("#home-contact-success").hidden = false;
  window.requestAnimationFrame(() => document.querySelector("#home-contact")?.scrollIntoView({ block: "start" }));
}
