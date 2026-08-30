# Song Youngbin — Robot Systems & Safety Engineer

[![Portfolio](https://img.shields.io/badge/Portfolio-dudqls10.github.io-2f5ce5?style=flat-square)](https://dudqls10.github.io/)
[![Deploy static content to Pages](https://github.com/dudqls10/dudqls10.github.io/actions/workflows/pages.yml/badge.svg)](https://github.com/dudqls10/dudqls10.github.io/actions/workflows/pages.yml)

송영빈의 로봇 센싱·안전 제어 포트폴리오입니다. 센서 PCB와 기구 설계부터 신호 처리, RMPflow 기반 반응형 모션 제어, 학습 기반 조작 정책까지 실제 로봇에서 검증한 작업을 정리했습니다.

**Live portfolio:** [https://dudqls10.github.io](https://dudqls10.github.io/)

## Selected work

| Project | Focus | Portfolio | Source |
| --- | --- | --- | --- |
| Robot-Mounted Proximity Sensing System | Sensor hardware, capacitive/ToF fusion, calibration | [Case study](https://dudqls10.github.io/projects/proximity-sensor-platform.html) | [`calibration_dist`](https://github.com/dudqls10/calibration_dist) |
| Self-Detection Compensation | Joint-state-conditioned baseline prediction, residual inference | [Case study](https://dudqls10.github.io/projects/self-detection-compensation.html) | [`self_detection_raw`](https://github.com/dudqls10/self_detection_raw) |
| Proximity-Based Reactive Motion Control | RMPflow, TG-RMP, RB10 obstacle avoidance | [Case study](https://dudqls10.github.io/projects/rmpflow-safety-control.html) | [`RMP_prox`](https://github.com/dudqls10/RMP_prox) |
| Interactive Diffusion Policy | Safe HRI, OOD recovery, learning-based manipulation | [Case study](https://dudqls10.github.io/projects/interactive-diffusion-policy.html) | Research preview |

## Stack

- Robot software: ROS 2, C++, Python, RViz, Pinocchio, CasADi
- Learning: PyTorch, TensorFlow, Diffusion Policy
- Embedded and sensing: STM32, Embedded C/C++, I²C, CAN, capacitive sensing, ToF
- Hardware design: Altium Designer, CATIA V5, SOLIDWORKS, Autodesk Inventor

## Repository structure

- `index.html` — production portfolio homepage
- `projects/*.html` — research and undergraduate project case studies
- `assets/` — shared styles, scripts, and local fonts
- `media/`, `projects/*-assets/` — experiment videos, figures, and result images
- `Young_Bin_Song_CV.pdf` — public CV
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `scripts/check_local_links.py` — production-page link validation

`index2.html`, `index3.html`, and `*-3.html` are retained as earlier design studies. The public site uses `index.html` and the project pages linked from it.

## Local preview

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in a browser.

## Deployment

The site is designed for the GitHub user-site repository `dudqls10.github.io`.

1. Create a public repository named `dudqls10.github.io`.
2. In `Settings → Pages → Build and deployment`, set **Source** to **GitHub Actions**.
3. Push the `main` branch. The Pages workflow validates local links and deploys the static site.

Every later push to `main` updates the live URL automatically. GitHub Pages can take several minutes to publish a new revision.

## Contact

- GitHub: [@dudqls10](https://github.com/dudqls10)
- Email: [dudqls1028@naver.com](mailto:dudqls1028@naver.com)

© 2026 Young Bin Song. Portfolio content and media are provided for professional review.
