const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const ambientVideos = document.querySelectorAll("video");

ambientVideos.forEach((video) => {
  video.autoplay = true;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("autoplay", "");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
});

const previewName = new URLSearchParams(window.location.search).get("preview");
const isPreview = previewName === "index2" || previewName === "index3";

if (isPreview) {
  document.body.classList.add("index2-preview");

  const backLink = document.querySelector(".back-link");
  if (backLink) backLink.textContent = "← Portfolio Home";

  const wordmark = document.querySelector(".wordmark");
  if (wordmark) wordmark.textContent = "SONG YOUNGBIN";

  document.querySelectorAll("a[href]").forEach((link) => {
    const raw = link.getAttribute("href");
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("http")) return;

    // index2 전용으로 하드코딩된 링크를 현재 프리뷰 기준으로 정규화한다.
    const href = raw
      .replace("../index2.html", `../${previewName}.html`)
      .replace("preview=index2", `preview=${previewName}`);

    if (href.startsWith("../index.html")) {
      link.setAttribute("href", href.replace("../index.html", `../${previewName}.html`));
      return;
    }

    const isIndex2Variant = previewName === "index2" && href.includes("-index2.html");

    if (!href.includes(".html") || href.includes(`preview=${previewName}`) || isIndex2Variant) {
      if (href !== raw) link.setAttribute("href", href);
      return;
    }

    const [path, hash = ""] = href.split("#");
    const separator = path.includes("?") ? "&" : "?";
    link.setAttribute("href", `${path}${separator}preview=${previewName}${hash ? `#${hash}` : ""}`);
  });
}

function syncAmbientVideos() {
  ambientVideos.forEach((video) => {
    if (reducedMotion.matches) {
      video.pause();
      video.removeAttribute("autoplay");
    } else if (video.dataset.visible === "true") {
      video.play().catch(() => {});
    }
  });
}

if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        video.dataset.visible = String(entry.isIntersecting);
        if (entry.isIntersecting && !reducedMotion.matches) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.2 }
  );

  ambientVideos.forEach((video) => videoObserver.observe(video));
}

reducedMotion.addEventListener?.("change", syncAmbientVideos);

function syncPanelVideos() {
  ambientVideos.forEach((video) => {
    if (video.closest("[hidden]") || reducedMotion.matches) {
      video.pause();
      return;
    }

    if (video.dataset.visible === "true") {
      video.play().catch(() => {});
    }
  });
}

function setupTabSet({ root, buttonSelector, panelSelector, dataKey, updateHash = false }) {
  if (!root) return;

  const buttons = Array.from(root.querySelectorAll(buttonSelector));
  const panels = Array.from(document.querySelectorAll(panelSelector));
  if (!buttons.length || !panels.length) return;

  const activate = (targetId, { focus = false, scroll = false, writeHash = updateHash } = {}) => {
    const activeButton = buttons.find((button) => button.dataset[dataKey] === targetId);
    const activePanel = panels.find((panel) => panel.id === targetId);
    if (!activeButton || !activePanel) return;

    buttons.forEach((button) => {
      const selected = button === activeButton;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const selected = panel === activePanel;
      panel.hidden = !selected;
      panel.classList.toggle("is-active", selected);
    });

    if (writeHash) {
      history.replaceState(null, "", `#${targetId}`);
    }

    if (focus) activeButton.focus();
    if (scroll) {
      root.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
    }

    window.requestAnimationFrame(syncPanelVideos);
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      activate(button.dataset[dataKey], { scroll: updateHash });
    });

    button.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = buttons.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      activate(buttons[nextIndex].dataset[dataKey], { focus: true, scroll: false });
    });
  });

  const hashTarget = updateHash ? window.location.hash.slice(1) : "";
  const initialTarget = buttons.some((button) => button.dataset[dataKey] === hashTarget)
    ? hashTarget
    : buttons.find((button) => button.classList.contains("is-active"))?.dataset[dataKey];

  if (initialTarget) activate(initialTarget, { writeHash: false });
}

setupTabSet({
  root: document.querySelector("[data-home-tabs]"),
  buttonSelector: "[data-home-tab]",
  panelSelector: "[data-home-panel]",
  dataKey: "homeTab",
  updateHash: true,
});

setupTabSet({
  root: document.querySelector("[data-research-tabs]"),
  buttonSelector: "[data-research-tab]",
  panelSelector: "[data-research-panel]",
  dataKey: "researchTab",
});
