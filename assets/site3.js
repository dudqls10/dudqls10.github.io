/* ==========================================================================
   index3 — interaction layer
   스크롤 진행바 · 헤더 상태 · 스크롤스파이 · 모바일 메뉴 · 등장 애니메이션
   · 뷰포트 안에서만 재생하는 영상 · 연락처 복사
   ========================================================================== */

(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const body = document.body;

  /* --- 1. 스크롤 진행바 + 헤더 상태 --------------------------------------- */
  const bar = document.querySelector(".progress i");
  const topbar = document.querySelector("#topbar");
  let ticking = false;

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    if (bar) bar.style.width = `${Math.min(ratio, 1) * 100}%`;
    if (topbar) topbar.classList.toggle("is-stuck", window.scrollY > 12);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    },
    { passive: true }
  );
  onScroll();

  /* --- 2. 스크롤스파이 ----------------------------------------------------- */
  const navLinks = [...document.querySelectorAll(".topnav a[href^='#']")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${entry.target.id}`
            )
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* --- 3. 모바일 메뉴 ------------------------------------------------------ */
  const toggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  function closeMenu() {
    body.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");
  }

  toggle?.addEventListener("click", () => {
    const open = body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  });

  mobileMenu?.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", closeMenu)
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  /* --- 4. 등장 애니메이션 -------------------------------------------------- */
  const revealables = document.querySelectorAll(".reveal");

  if (reduced.matches || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    const revealer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 }
    );
    revealables.forEach((el) => revealer.observe(el));
  }

  /* --- 5. 모든 영상을 화면에 보일 때 자동 재생 ------------------------------- */
  const videos = document.querySelectorAll("video");

  videos.forEach((video) => {
    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
  });

  function stopAll() {
    videos.forEach((video) => {
      video.pause();
      video.removeAttribute("autoplay");
    });
  }

  if (reduced.matches) {
    stopAll();
  } else if ("IntersectionObserver" in window) {
    const player = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );
    videos.forEach((video) => player.observe(video));
  }

  reduced.addEventListener?.("change", (event) => {
    if (event.matches) stopAll();
  });

  /* --- 6. 도판 라이트박스 (상세 페이지에서만 동작) ---------------------- */
  const zoomables = document.querySelectorAll("[data-zoom]");

  if (zoomables.length) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="닫기">\u00d7</button><img alt="">';
    document.body.append(box);

    const boxImage = box.querySelector("img");

    const openBox = (source) => {
      boxImage.src = source.getAttribute("src");
      boxImage.alt = source.getAttribute("alt") || "";
      box.classList.add("is-open");
    };
    const closeBox = () => box.classList.remove("is-open");

    zoomables.forEach((image) => {
      image.addEventListener("click", () => openBox(image));
    });

    box.addEventListener("click", (event) => {
      if (event.target !== boxImage) closeBox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeBox();
    });
  }

  /* --- 7. 연락처 복사 ------------------------------------------------------ */
  document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy;
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const field = document.createElement("textarea");
        field.value = value;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        document.execCommand("copy");
        field.remove();
      }

      const original = button.textContent;
      button.textContent = "Copied";
      button.classList.add("is-done");
      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove("is-done");
      }, 1600);
    });
  });

})();
