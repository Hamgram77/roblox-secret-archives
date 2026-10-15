(() => {
  "use strict";

  const form = document.querySelector("#discussion-form");
  const tagInput = document.querySelector("#developer-tag");
  const messageInput = document.querySelector("#discussion-message");
  const messageCount = document.querySelector("#message-count");
  const status = document.querySelector("#discussion-status");
  const list = document.querySelector("#discussion-list");
  const emptyState = document.querySelector("#discussion-empty");
  const clearButton = document.querySelector("#clear-local-posts");
  const storageAcknowledgement = document.querySelector("#storage-acknowledgement");

  if (!form) return;

  // Posts stay on this device. The site never sends them to a server.
  const storageKey = "rdaLocalDiscussionPostsV1";
  const maxStoredPosts = 20;
  let localPosts = [];
  const safetyAlert = "For safety reasons, links and inappropriate language are not allowed.";
  const blockedTerms = [
    "asshole", "bastard", "bitch", "bullshit", "crap", "damn", "dick", "fuck", "piss", "shit"
  ];
  const linkPattern = /(?:https?:\/\/|www\.|(?:[a-z0-9-]+\.)+(?:com|net|org|gg|io|co|me|dev|app|xyz|tv|info|biz))(?:\b|\/)/i;
  const discordPattern = /(?:discord(?:app)?\.com\/invite|discord\.gg|discord\s*:\s*\S+|<@!?\d+>|\b[a-z0-9_.-]{2,32}#\d{4}\b)/i;
  const emailPattern = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i;
  const phonePattern = /(?:\+?\d[\s().-]*){7,}/;

  function normalizedText(value) {
    return value
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[013457@$]/g, (character) => ({
        "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s"
      })[character])
      .replace(/[^a-z]+/g, " ")
      .trim();
  }

  function containsBlockedLanguage(value) {
    const normalized = ` ${normalizedText(value)} `;
    const compact = normalized.replace(/\s+/g, "");
    return blockedTerms.some((term) => normalized.includes(` ${term} `) || compact.includes(term));
  }

  function isUnsafe(value) {
    return linkPattern.test(value)
      || discordPattern.test(value)
      || emailPattern.test(value)
      || phonePattern.test(value)
      || containsBlockedLanguage(value);
  }

  function isValidStoredPost(post) {
    return post
      && typeof post.tag === "string"
      && typeof post.message === "string"
      && /^[A-Za-z0-9_-]{2,24}$/.test(post.tag)
      && post.message.length > 0
      && post.message.length <= 600
      && !isUnsafe(post.tag)
      && !isUnsafe(post.message);
  }

  function loadPosts() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      localPosts = Array.isArray(parsed)
        ? parsed.filter(isValidStoredPost).slice(-maxStoredPosts)
        : [];
    } catch {
      localPosts = [];
    }
  }

  function savePosts() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(localPosts.slice(-maxStoredPosts)));
      return true;
    } catch {
      return false;
    }
  }

  function updateCount() {
    messageCount.textContent = `${messageInput.value.length} / 600`;
  }

  function renderPosts() {
    list.replaceChildren();

    localPosts.forEach((post, index) => {
      const article = document.createElement("article");
      article.className = "discussion-post";

      const meta = document.createElement("div");
      meta.className = "post-meta";

      const tag = document.createElement("strong");
      tag.textContent = post.tag;

      const localLabel = document.createElement("span");
      localLabel.textContent = `LOCAL—${String(index + 1).padStart(2, "0")}`;

      const message = document.createElement("p");
      message.textContent = post.message;

      meta.append(tag, localLabel);
      article.append(meta, message);
      list.prepend(article);
    });

    emptyState.hidden = localPosts.length > 0;
    clearButton.hidden = localPosts.length === 0;
  }

  messageInput.addEventListener("input", updateCount);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    const tag = tagInput.value.trim();
    const message = messageInput.value.trim();

    if (!/^[A-Za-z0-9_-]{2,24}$/.test(tag)) {
      status.textContent = "Use a 2–24 character nickname containing only letters, numbers, underscores, or hyphens.";
      tagInput.focus();
      return;
    }

    if (!message) {
      status.textContent = "Write a message before posting.";
      messageInput.focus();
      return;
    }

    if (!storageAcknowledgement.checked) {
      status.textContent = "Confirm the local-storage notice before saving this post.";
      storageAcknowledgement.focus();
      return;
    }

    if (isUnsafe(tag) || isUnsafe(message)) {
      window.alert(safetyAlert);
      status.textContent = safetyAlert;
      return;
    }

    localPosts.push({ tag, message });
    localPosts = localPosts.slice(-maxStoredPosts);
    if (!savePosts()) {
      localPosts.pop();
      status.textContent = "This browser blocked local storage, so the post could not be saved.";
      return;
    }
    renderPosts();
    form.reset();
    updateCount();
    status.textContent = "Saved only in this browser. This post was not uploaded or shared.";
    messageInput.focus();
  });

  clearButton.addEventListener("click", () => {
    localPosts = [];
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // The in-memory copy is still cleared when browser storage is unavailable.
    }
    renderPosts();
    status.textContent = "Saved posts cleared from this browser.";
  });

  updateCount();
  loadPosts();
  renderPosts();
})();
