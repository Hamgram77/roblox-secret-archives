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
];

const archiveList = document.querySelector("#archive-list");
const searchInput = document.querySelector("#archive-search");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const clearSearch = document.querySelector("#clear-search");
const filters = [...document.querySelectorAll(".filter")];
const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector("#site-nav");
let activeFilter = "all";

function recordTemplate(record) {
  return `
    <article class="archive-card">
      <span class="record-number">DOC—${record.number}</span>
      <div class="record-title">
        <h3>${record.title}</h3>
        <time datetime="2026-10-14">Added ${record.date}</time>
      </div>
      <div>
        <p class="record-description">${record.description}</p>
        <div class="record-tags">${record.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </div>
      <div class="record-actions">
        <a href="${record.pdf}" target="_blank" rel="noopener">View PDF <span aria-hidden="true">↗</span></a>
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
  resultCount.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? "record" : "records"}`;
  emptyState.hidden = filtered.length !== 0;
}

searchInput.addEventListener("input", renderRecords);
filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    activeFilter = filter.dataset.filter;
    filters.forEach((item) => {
      const selected = item === filter;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    renderRecords();
  });
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  activeFilter = "all";
  filters.forEach((item) => {
    const selected = item.dataset.filter === "all";
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  renderRecords();
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
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

renderRecords();
