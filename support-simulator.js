(() => {
  "use strict";

  const form = document.querySelector("#support-simulator-form");
  if (!form) return;

  const categorySelect = document.querySelector("#support-category");
  const reasonSelect = document.querySelector("#support-reason");
  const groupTabs = document.querySelector("#support-group-tabs");
  const categoryPanel = document.querySelector("#support-category-panel");
  const categoryGrid = document.querySelector("#support-category-grid");
  const reasonOptions = document.querySelector("#support-reason-options");
  const keywordsInput = document.querySelector("#support-keywords");
  const characterCount = document.querySelector("#support-character-count");
  const status = document.querySelector("#support-simulator-status");
  const emptyState = document.querySelector("#support-result-empty");
  const result = document.querySelector("#support-result");
  const route = document.querySelector("#result-route");
  const routeIcon = document.querySelector("#result-route-icon");
  const summary = document.querySelector("#result-summary");
  const meterFill = document.querySelector("#result-meter-fill");
  const scoreText = document.querySelector("#result-score");
  const signalsList = document.querySelector("#result-signals");
  const nextStepsList = document.querySelector("#result-next-steps");

  // Broad topics from Roblox's public Help Center and support guidance.
  // This code is not connected to Roblox and does not reproduce a private router.
  const topics = [
    ["account", "Account & login", 46, [["login", "Cannot log in"], ["password", "Forgot password or password reset"], ["hacked", "Account hacked or compromised"], ["email", "Email or phone verification problem"], ["2sv", "2-step verification problem"], ["settings", "Account settings or username"], ["delete", "Close or delete an account"]]],
    ["billing", "Payments, Robux & subscriptions", 52, [["unauthorized", "Unauthorized charge"], ["refund", "Refund request"], ["missing-purchase", "Purchased Robux or item is missing"], ["premium", "Premium or subscription problem"], ["payment", "Payment method or checkout error"], ["receipt", "Receipt or transaction question"]]],
    ["gift", "Gift cards, toy codes & virtual items", 32, [["redeem", "Redeem a gift card"], ["invalid", "Code is invalid or already redeemed"], ["credit", "Gift-card credit is missing"], ["exclusive", "Exclusive virtual item is missing"], ["toy", "Toy or promotional code problem"]]],
    ["moderation", "Moderation & appeals", 64, [["account-appeal", "Appeal account moderation"], ["content-appeal", "Appeal moderated content or asset"], ["experience-ban", "Banned from an experience"], ["duplicate", "Previously reviewed appeal"], ["question", "Question about a moderation notice"]]],
    ["safety", "Parents, safety & reporting", 72, [["report", "Report unsafe behavior or content"], ["harassment", "Harassment, threats, or bullying"], ["child-safety", "Child-safety concern"], ["scam", "Scam, phishing, or account theft"], ["privacy", "Personal-information concern"], ["parent", "Parent or guardian question"]]],
    ["technical", "Technical support", 24, [["connection", "Connection, crash, or error code"], ["desktop", "Windows or Mac app problem"], ["mobile", "iOS, Android, or Chromebook problem"], ["console", "PlayStation or Xbox problem"], ["website", "Roblox website problem"], ["install", "Install, update, or launch problem"]]],
    ["bug", "Bug report", 38, [["platform", "Platform bug"], ["studio", "Roblox Studio bug"], ["experience", "Experience-specific bug"], ["upload", "Asset or place upload failure"]]],
    ["playing", "Playing on Roblox", 22, [["join", "Cannot join an experience"], ["controls", "Controls or gameplay question"], ["chat", "Chat or communication feature"], ["voice", "Voice chat"], ["private-server", "Private server problem"]]],
    ["creating", "Creating on Roblox & Studio", 34, [["studio", "Roblox Studio help"], ["publish", "Publish or update an experience"], ["asset", "Upload or manage an asset"], ["marketplace", "Create or sell an item"], ["group", "Group or community ownership"], ["documentation", "Scripting or documentation question"]]],
    ["avatar", "Avatar, inventory & Marketplace", 28, [["appearance", "Avatar appearance problem"], ["missing-item", "Inventory item is missing"], ["purchase", "Marketplace purchase problem"], ["trade", "Trade or limited-item question"]]],
    ["devex", "DevEx & creator earnings", 62, [["eligibility", "DevEx eligibility"], ["payout", "Payout is delayed or missing"], ["tax", "Tax form or verification"], ["earned-robux", "Earned Robux question"], ["creator-store", "Creator Store or sales earnings"]]],
    ["age-parental", "Age settings & parental controls", 50, [["age", "Age setting or age check"], ["parental", "Parental controls"], ["spending", "Spending restrictions"], ["communication", "Communication restrictions"]]],
    ["privacy", "Privacy & data requests", 78, [["data", "Access or correct personal data"], ["deletion", "Delete personal data or account"], ["privacy", "Privacy concern"], ["guardian", "Parent or guardian data request"]]],
    ["legal", "Copyright, DMCA & legal", 86, [["dmca", "Copyright or DMCA notice"], ["trademark", "Trademark complaint"], ["counter", "Copyright counter-notice"], ["legal", "Other legal request"]]],
    ["social", "Social media, events & merchandise", 26, [["event", "Roblox event question"], ["merchandise", "Physical merchandise"], ["social", "Official social-media question"], ["toy", "Toy or retail-product question"]]],
    ["other", "Other or how-to question", 30, [["how-to", "General how-to question"], ["feature", "Feature information"], ["feedback", "Feedback or suggestion"], ["other", "Something else"]]]
  ].map(([value, label, base, reasons]) => ({ value, label, base, reasons }));

  const topicGroups = [
    { value: "account", label: "Account", topics: ["account", "age-parental"] },
    { value: "payments", label: "Payments", topics: ["billing", "gift"] },
    { value: "safety", label: "Safety", topics: ["moderation", "safety"] },
    { value: "technical", label: "Technical", topics: ["technical", "bug", "playing"] },
    { value: "creator", label: "Creator", topics: ["creating", "avatar", "devex"] },
    { value: "other", label: "Other", topics: ["privacy", "legal", "social", "other"] }
  ];
  let activeGroup = topicGroups[0].value;

  const humanSignals = [
    [/unauthori[sz]ed|unrecognized charge|card charge|fraud(?:ulent)? charge/, 25, "Possible unauthorized payment"],
    [/hacked|compromised|stolen account|account takeover|phishing/, 22, "Account-security concern"],
    [/appeal|moderation decision|wrongful(?:ly)? (?:ban|moderation)|content removed/, 18, "Decision-review request"],
    [/child safety|groom(?:ing)?|sexual exploitation|credible threat|imminent harm|self[- ]?harm|suicid/, 32, "Urgent safety language"],
    [/dmca|copyright|trademark|counter[- ]?notice|legal request|subpoena/, 28, "Legal or intellectual-property issue"],
    [/privacy|personal data|data deletion|right to be forgotten|gdpr|ccpa/, 25, "Privacy-rights request"],
    [/devex|creator payout|tax form|earned robux|payment verification/, 16, "Creator-finance issue"],
    [/previous ticket|prior ticket|support agent|still unresolved|steps did not work/, 12, "Standard steps may already have failed"],
    [/asset id|transaction date|error began|reproducible|reproduction steps/, 8, "Specific review details supplied"]
  ];

  const automationSignals = [
    [/forgot password|password reset|reset link|locked out/, -20, "Standard account-recovery flow"],
    [/error\s*(?:code\s*)?\d+|crash|lag|disconnect|reinstall|clear(?:ed)? cache|update loop/, -20, "Common troubleshooting pattern"],
    [/how (?:do|can) i|where (?:do|can) i|can i|instructions|tutorial/, -18, "How-to or information request"],
    [/redeem|gift card|toy code|promo code/, -10, "Standard redemption guidance"],
    [/already reviewed|appealed twice|second appeal|duplicate appeal/, -28, "Possible duplicate-review policy response"],
    [/status page|server down|outage/, -14, "Service-status guidance"]
  ];

  const reasonAdjustments = {
    unauthorized: 24, refund: 12, hacked: 22, "account-appeal": 18,
    "content-appeal": 18, duplicate: -24, "child-safety": 28,
    harassment: 18, privacy: 20, deletion: 20, dmca: 24, trademark: 22,
    counter: 24, legal: 20, payout: 14, tax: 14, connection: -14,
    install: -14, "how-to": -18, redeem: -14, controls: -12, documentation: -14
  };

  const personalDataPatterns = [
    /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i,
    /(?:\+?\d[\s().-]*){7,}/,
    /https?:\/\/|www\./i,
    /\b(?:password|passcode|pin)\s*[:=]\s*\S+/i
  ];

  function appendOption(select, value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  }

  topics.forEach((topic) => appendOption(categorySelect, topic.value, topic.label));

  function selectedTopic() {
    return topics.find((topic) => topic.value === categorySelect.value);
  }

  function topicByValue(value) {
    return topics.find((topic) => topic.value === value);
  }

  function renderGroupTabs() {
    groupTabs.replaceChildren();
    topicGroups.forEach((group) => {
      const button = document.createElement("button");
      const isActive = group.value === activeGroup;
      button.type = "button";
      button.className = "support-group-tab";
      button.id = `support-tab-${group.value}`;
      button.dataset.group = group.value;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(isActive));
      button.setAttribute("aria-controls", "support-category-panel");
      button.tabIndex = isActive ? 0 : -1;
      button.textContent = group.label;
      groupTabs.append(button);
    });
    categoryPanel.setAttribute("aria-labelledby", `support-tab-${activeGroup}`);
  }

  function renderCategories() {
    categoryGrid.replaceChildren();
    const group = topicGroups.find((item) => item.value === activeGroup);
    group.topics.map(topicByValue).filter(Boolean).forEach((topic) => {
      const button = document.createElement("button");
      const selected = topic.value === categorySelect.value;
      button.type = "button";
      button.className = "support-category-button";
      button.dataset.topic = topic.value;
      button.setAttribute("aria-pressed", String(selected));
      button.innerHTML = `<span>${topic.label}</span><small>${topic.reasons.length} reasons</small>`;
      categoryGrid.append(button);
    });
  }

  function renderReasons() {
    reasonOptions.replaceChildren();
    const topic = selectedTopic();
    if (!topic) {
      const hint = document.createElement("p");
      hint.className = "support-reason-placeholder";
      hint.textContent = "Choose a category above to see its reasons.";
      reasonOptions.append(hint);
      return;
    }

    topic.reasons.forEach(([value, label]) => {
      const button = document.createElement("button");
      const selected = value === reasonSelect.value;
      button.type = "button";
      button.className = "support-reason-button";
      button.dataset.reason = value;
      button.setAttribute("aria-pressed", String(selected));
      button.textContent = label;
      reasonOptions.append(button);
    });
  }

  function updateReasons() {
    reasonSelect.replaceChildren();
    const topic = selectedTopic();
    if (!topic) {
      appendOption(reasonSelect, "", "Choose a topic first");
      reasonSelect.disabled = true;
      return;
    }

    appendOption(reasonSelect, "", "Choose a reason");
    topic.reasons.forEach(([value, label]) => appendOption(reasonSelect, value, label));
    reasonSelect.disabled = false;
    renderReasons();
  }

  function selectTopic(value) {
    categorySelect.value = value;
    updateReasons();
    renderCategories();
    status.textContent = "";
  }

  function selectGroup(value, focusTab = false) {
    const group = topicGroups.find((item) => item.value === value);
    if (!group) return;
    activeGroup = value;
    renderGroupTabs();
    selectTopic(group.topics[0]);
    if (focusTab) document.querySelector(`[data-group="${value}"]`)?.focus();
  }

  function updateCount() {
    characterCount.textContent = `${keywordsInput.value.length} / 600`;
  }

  function addListItems(list, items) {
    list.replaceChildren();
    items.forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      list.append(item);
    });
  }

  function extractDataEvidence(text) {
    const numericValues = text.match(/\b\d+(?:[./:-]\d+)*\b/g) || [];
    const structuralTokens = text.match(/\b(?:id|log|error\s*code|timestamp|(?:transaction|receipt|invoice|reference|case|ticket)\s*(?:id|number|#))\b/gi) || [];
    return {
      numericValues,
      structuralTokens,
      hasEvidence: numericValues.length > 0 || structuralTokens.length > 0
    };
  }

  function analyze(text, topic, reason) {
    const normalized = text.toLowerCase();
    const characterCount = text.trim().length;
    const topicLabel = topic.label.toLowerCase();
    const isModerationOrAppeal = topic.value === "moderation" || /account moderation|appeals?/.test(topicLabel);
    const isBillingOrTechnical = topic.value === "billing" || topic.value === "technical" || /billing\s*&\s*payments|technical support/.test(topicLabel);
    const dataEvidence = extractDataEvidence(text);
    const conciseDataReport = isBillingOrTechnical && characterCount < 40 && dataEvidence.hasEvidence;
    let score = topic.base + (reasonAdjustments[reason] || 0);
    const signals = [`Topic baseline: ${topic.label}`];

    humanSignals.forEach(([pattern, weight, label]) => {
      if (pattern.test(normalized)) {
        score += weight;
        signals.push(label);
      }
    });

    automationSignals.forEach(([pattern, weight, label]) => {
      if (pattern.test(normalized)) {
        const isGenericTroubleshootingPenalty = label === "Common troubleshooting pattern";
        if (conciseDataReport && isGenericTroubleshootingPenalty) {
          signals.push("Structured report overrides the generic troubleshooting penalty");
        } else {
          score += weight;
          signals.push(label);
        }
      }
    });

    if (conciseDataReport) {
      score += 45;
      const evidenceTypes = [];
      if (dataEvidence.numericValues.length) evidenceTypes.push("numeric value");
      if (dataEvidence.structuralTokens.length) evidenceTypes.push("tracking or diagnostic token");
      signals.push(`Direct concise report: ${evidenceTypes.join(" and ")} supplied`);
    } else if (dataEvidence.hasEvidence) {
      score += 8;
      signals.push("Numeric or structural data supplied");
    }

    score = Math.max(5, Math.min(95, score));
    const wordCount = normalized.trim().split(/\s+/).filter(Boolean).length;

    if (isModerationOrAppeal && characterCount < 100) {
      return {
        kind: "automated", score: Math.min(score, 15), icon: "A",
        title: "Likely automated rejection: low-effort appeal",
        summary: "Moderation and appeal requests under 100 characters usually lack enough context for a meaningful review estimate.",
        signals: [...signals, `Low-Effort Appeal (${characterCount} of 100 required characters)`],
        nextSteps: ["Explain what was moderated and why the decision may be incorrect.", "Add relevant non-sensitive context and prior troubleshooting or appeal steps.", "Do not invent identifiers, evidence, or parental authorization."]
      };
    }

    if (isBillingOrTechnical && characterCount < 40 && !dataEvidence.hasEvidence) {
      return {
        kind: "insufficient", score: Math.min(score, 25), icon: "?",
        title: "Likely automated request for more information",
        summary: "This short billing or technical report has no numeric value or structural tracking token, so it may not provide enough diagnostic context for review.",
        signals: [...signals, `Short report (${characterCount} of 40 characters) with no data token`],
        nextSteps: ["Add a non-sensitive date, amount, or error number if one genuinely applies.", "Name the relevant log, transaction, receipt, or error code.", "Do not include passwords, contact details, or real account identifiers."]
      };
    }

    if (wordCount < 4 && !conciseDataReport) {
      return {
        kind: "insufficient", score: Math.min(score, 35), icon: "?",
        title: "Likely automated request for more information",
        summary: "The sample is too short for a meaningful routing estimate. A standard response would likely ask for clearer details before review.",
        signals: [...signals, "Fewer than four descriptive words"],
        nextSteps: ["Describe what happened and when it began.", "Mention non-sensitive troubleshooting already attempted.", "Do not include passwords, contact details, receipts, or real account identifiers."]
      };
    }

    if (score >= 65) {
      return {
        kind: "human", score, icon: "H", title: "Potential human or specialist review",
        summary: "The selected reason and matched language suggest that policy judgment, ownership checks, payment review, safety triage, or specialist handling may be needed.",
        signals,
        nextSteps: ["An automated acknowledgement or identity check may still happen first.", "A reviewer may request category-specific evidence through official support.", "This estimate does not guarantee escalation or a particular outcome."]
      };
    }

    return {
      kind: score <= 35 ? "automated" : "triage", score, icon: "A",
      title: score <= 35 ? "Likely automated response first" : "Likely automated triage before review",
      summary: score <= 35
        ? "The sample resembles a common help-center or troubleshooting request that may receive standard instructions before any manual review."
        : "The request has mixed signals. A system may provide standard guidance or collect more details before deciding whether a person should review it.",
      signals,
      nextSteps: ["Expect help-center steps or a request for standard diagnostic details.", "If those steps fail, a later response may route the issue differently.", "This estimate does not guarantee how Roblox will handle a real ticket."]
    };
  }

  function renderAnalysis(analysis) {
    result.dataset.route = analysis.kind;
    route.textContent = analysis.title;
    routeIcon.textContent = analysis.icon;
    summary.textContent = analysis.summary;
    meterFill.style.width = `${analysis.score}%`;
    scoreText.textContent = `${analysis.score} / 100`;
    addListItems(signalsList, analysis.signals);
    addListItems(nextStepsList, analysis.nextSteps);
    emptyState.hidden = true;
    result.hidden = false;
  }

  categorySelect.addEventListener("change", () => {
    updateReasons();
    renderCategories();
    status.textContent = "";
  });

  groupTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-group]");
    if (tab) selectGroup(tab.dataset.group);
  });

  groupTabs.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = topicGroups.findIndex((group) => group.value === activeGroup);
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % topicGroups.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + topicGroups.length) % topicGroups.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = topicGroups.length - 1;
    selectGroup(topicGroups[nextIndex].value, true);
  });

  categoryGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-topic]");
    if (button) selectTopic(button.dataset.topic);
  });

  reasonOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-reason]");
    if (!button) return;
    reasonSelect.value = button.dataset.reason;
    renderReasons();
    status.textContent = "";
  });
  keywordsInput.addEventListener("input", updateCount);

  document.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      keywordsInput.value = button.dataset.example || "";
      updateCount();
      keywordsInput.focus();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    result.hidden = true;
    emptyState.hidden = false;
    const topic = selectedTopic();
    const reason = reasonSelect.value;
    const text = keywordsInput.value.trim();

    if (!topic) {
      status.textContent = "Choose a support topic.";
      groupTabs.querySelector("[role='tab']")?.focus();
      return;
    }
    if (!reason) {
      status.textContent = "Choose a reason for the sample request.";
      reasonOptions.querySelector("button")?.focus();
      return;
    }
    if (!text) {
      status.textContent = "Enter general keywords or a fictional summary.";
      keywordsInput.focus();
      return;
    }
    if (personalDataPatterns.some((pattern) => pattern.test(text))) {
      status.textContent = "For privacy, remove contact details, links, long numbers, passwords, or other identifying information.";
      keywordsInput.focus();
      return;
    }

    renderAnalysis(analyze(text, topic, reason));
    status.textContent = "Analysis completed locally. Nothing was submitted, uploaded, or saved.";
  });

  renderGroupTabs();
  selectTopic(topicGroups[0].topics[0]);
  updateCount();
})();
