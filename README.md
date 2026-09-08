# Young Bin Song — Robotics Sensing & Control Engineer

[![Portfolio](https://img.shields.io/badge/Portfolio-dudqls10.github.io-2f5ce5?style=flat-square)](https://dudqls10.github.io/)
[![Deploy static content to Pages](https://github.com/dudqls10/dudqls10.github.io/actions/workflows/pages.yml/badge.svg)](https://github.com/dudqls10/dudqls10.github.io/actions/workflows/pages.yml)

송영빈의 로봇 센싱·제어 포트폴리오입니다. 센서 PCB와 기구 설계부터 STM32 펌웨어, 신호 보상, RMPflow 기반 반응형 모션 제어, 학습 기반 조작 정책의 실로봇 통합까지 정리했습니다. 진행 중인 회피–순응 제어 연구도 함께 소개합니다.

**Sensor Hardware → Robot Control → Physical AI**

**Live portfolio:** [https://dudqls10.github.io](https://dudqls10.github.io/)

## Selected work

| Project | Focus | Portfolio | Source |
| --- | --- | --- | --- |
| Robot-Mounted Proximity Sensing System | Modular sensor hardware, STM32 firmware, capacitive/ToF distance fusion | [Case study](https://dudqls10.github.io/projects/proximity-sensor-platform.html) | [`STM32-embedded-Algorithm`](https://github.com/dudqls10/STM32-embedded-Algorithm) |
| Self-Detection Compensation | Joint-state-conditioned baseline prediction, residual inference | [Case study](https://dudqls10.github.io/projects/self-detection-compensation.html) | [`self_detection_raw`](https://github.com/dudqls10/self_detection_raw) |
| Proximity-Based Reactive Motion Control | RMPflow, TG-RMP, RB10 obstacle avoidance | [Case study](https://dudqls10.github.io/projects/rmpflow-safety-control.html) | [`RMP_prox`](https://github.com/dudqls10/RMP_prox) |
| Interactive Diffusion Policy | RB10 closed-loop integration, proximity/RMPflow execution, LPB/OOD runtime | [Case study](https://dudqls10.github.io/projects/interactive-diffusion-policy.html) | [Project code](https://github.com/Bookjean/Diffusion_policy_for_youngbin) |
| REACT: Reactive Environment-Aware Safety Framework for Avoidance-Compliance Transition Using RMPflow-Based Control | Intrinsic application experiments, contact/non-contact sensing, and RMPflow-based transition control (ongoing) | [Case study](https://dudqls10.github.io/projects/avoidance-compliance-control.html) | Ongoing research |

## Stack

- Hardware and embedded: Altium Designer, STM32, Embedded C/C++, I²C, CAN
- Mechanical design: Autodesk Inventor, CATIA V5, SOLIDWORKS
- Robot control and software: ROS 2, RMPflow, Pinocchio, C++, PREEMPT_RT
- Learning and data: Python, PyTorch, TensorFlow, MATLAB
- Robot platforms: Indy7, UR10, RB10

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
