SONG YOUNGBIN PORTFOLIO — STATIC HTML

구성
- index.html: index2를 기반으로 정리한 대표 포트폴리오
- index2.html: 대표 포트폴리오와 동일한 v2 기준본
- projects/*.html: 대표 페이지에서 연결되는 연구 및 학부 프로젝트 상세 페이지
- assets/style.css: 기존 콘텐츠별 레이아웃과 컴포넌트
- assets/style2-hybrid.css: index2 구조에 index3의 폰트, 대비, 강조를 적용한 공통 테마
- assets/site.js: 영상 재생과 페이지 동작
- index3.html, projects/*-3.html: 이전 대안 시안 보관본
- media/*.mp4, media/*-poster.jpg: 웹용으로 최적화한 실제 실험 영상과 포스터
- projects/*.png, youngbin-profile.jpg: 이미지

로컬에서 확인하는 방법
1. 이 폴더에서 터미널을 엽니다.
2. python -m http.server 8000 을 실행합니다.
3. 브라우저에서 http://localhost:8000 을 엽니다.

GitHub Pages 업로드 방법
1. 이 폴더 안의 모든 파일과 폴더를 GitHub 저장소 최상위에 업로드합니다.
2. GitHub 저장소 Settings → Pages로 이동합니다.
3. Build and deployment에서 Deploy from a branch를 선택합니다.
4. Branch를 main, 폴더를 /(root)로 지정하고 Save를 누릅니다.

주의
- index.html이 반드시 저장소 최상위에 있어야 합니다.
- assets, media, projects 폴더 구조를 그대로 유지해야 이미지·영상·상세 페이지가 정상 작동합니다.
