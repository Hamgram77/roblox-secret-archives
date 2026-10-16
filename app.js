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
        <time datetime="2026-10-14">Added ${record.date}</time>
      </div>
      <div class="record-copy">
        <p class="record-description">${record.description}</p>
        <div class="record-tags">${record.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </div>
      <div class="record-actions">
        <a class="action-primary" href="${record.pdf}" target="_blank" rel="noopener">View PDF <span aria-hidden="true">↗</span></a>
        <a href="${record.pdf}" download>Download <span aria-hidden="true">↓</span></a>
        <a href="${record.source}" target="_blank" rel="noopener noreferrer">Google source <span aria-hidden="true">↗</span></a>
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
  if (!event.target.closest(".site-header")) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
    closeNavigation();
    menuButton.focus();
  }
});

renderRecords();
