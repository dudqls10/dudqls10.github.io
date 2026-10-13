(() => {
  const navLinks = [...document.querySelectorAll('.project-quick-nav a[href^="#"], .study-nav a[href^="#"]')];
  const sections = [...new Set(navLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean))];
  let navFramePending = false;
  const updateNavigation = () => {
    const readingLine = Math.min(window.innerHeight * 0.3, 180);
    const active = sections.filter(section => section.getBoundingClientRect().top <= readingLine).at(-1);
    navLinks.forEach(link => {
      if (active && link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    navFramePending = false;
  };
  const scheduleNavigation = () => {
    if (navFramePending) return;
    navFramePending = true;
    requestAnimationFrame(updateNavigation);
  };
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation);
  window.addEventListener('hashchange', scheduleNavigation);
  window.addEventListener('load', scheduleNavigation);
  updateNavigation();

  const videos = [...document.querySelectorAll('video')];
  videos.forEach(video => video.addEventListener('play', () => {
    videos.forEach(other => { if (other !== video) other.pause(); });
  }));

  const hero = document.querySelector('[data-hero-video]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const submission = document.getElementById('submission-video');
  const submissionStatus = document.getElementById('submission-status');
  let chapterRequest;

  if (submission) {
    const waitForMedia = (events, isReady, signal, start) => new Promise((resolve, reject) => {
      let timeout;
      let settled = false;
      const finish = error => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        events.forEach(event => submission.removeEventListener(event, check));
        submission.removeEventListener('error', fail);
        signal.removeEventListener('abort', cancel);
        if (error) reject(error);
        else resolve();
      };
      const check = () => { if (isReady()) finish(); };
      const fail = () => finish(new Error('Video could not be loaded or seeked.'));
      const cancel = () => finish(new DOMException('Chapter request replaced.', 'AbortError'));

      if (signal.aborted) {
        cancel();
        return;
      }
      events.forEach(event => submission.addEventListener(event, check));
      submission.addEventListener('error', fail);
      signal.addEventListener('abort', cancel, { once: true });
      timeout = setTimeout(fail, 20000);
      try {
        start();
        check();
      } catch (error) {
        finish(error);
      }
    });

    document.querySelectorAll('button[data-video-time][aria-controls="submission-video"]').forEach(button => {
      button.addEventListener('click', async () => {
        const requestedTime = Number(button.dataset.videoTime);
        if (!Number.isFinite(requestedTime) || requestedTime < 0) return;

        chapterRequest?.abort();
        const request = new AbortController();
        chapterRequest = request;
        const { signal } = request;
        const minutes = String(Math.floor(requestedTime / 60)).padStart(2, '0');
        const seconds = String(Math.floor(requestedTime % 60)).padStart(2, '0');
        const label = button.dataset.label || (requestedTime === 110 ? '회복 적용 비교' : '반복 회피·작업 재개');
        const destination = `${minutes}:${seconds} ${label} 구간으로 이동했습니다.`;
        submission.controls = true;
        submission.pause();
        if (submissionStatus) submissionStatus.textContent = '선택한 영상 구간을 불러오는 중입니다.';

        try {
          if (submission.readyState < 1 || submission.error) {
            await waitForMedia(['loadedmetadata', 'durationchange'],
              () => submission.readyState >= 1 && !submission.error, signal, () => {
                submission.preload = 'auto';
                if (submission.networkState !== 2 || submission.error) submission.load();
              });
          }
          if (signal.aborted) return;

          const targetTime = Number.isFinite(submission.duration)
            ? Math.min(requestedTime, Math.max(0, submission.duration - 0.05))
            : requestedTime;
          await waitForMedia(['seeked', 'loadeddata', 'canplay'],
            () => !submission.seeking && Math.abs(submission.currentTime - targetTime) < 0.1,
            signal, () => { submission.currentTime = targetTime; });
          if (signal.aborted) return;

          submission.focus({ preventScroll: true });
          submission.scrollIntoView({
            block: 'center',
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
          });
          if (submissionStatus) submissionStatus.textContent = destination;
          try {
            await submission.play();
          } catch {
            if (!signal.aborted && submissionStatus) {
              submissionStatus.textContent = `${destination} 영상의 재생 버튼을 눌러 주세요.`;
            }
          }
        } catch {
          if (!signal.aborted && submissionStatus) {
            submissionStatus.textContent = '영상 구간을 불러오지 못했습니다. 영상의 기본 재생 버튼으로 다시 시도해 주세요.';
          }
        }
      });
    });
  }

  if (hero && !reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        hero.play().catch(() => {});
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(hero);
  }
})();
