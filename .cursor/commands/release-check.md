# 릴리스 점검 (README·배포 준비)

이 프로젝트는 **HTML · CSS · JavaScript만 사용하는 입문자용 테트리스**입니다.
**배포 전** 문서·파일 연결·GitHub Pages 설정을 점검하세요.

**사용자가 명시적으로 요청하지 않는 한 코드를 수정하지 마세요.** (문서 오류·깨진 링크는 수정 제안 가능)

## 점검 범위

- `index.html` — CSS·JS 경로, 메타 태그, 필수 UI 요소
- `style.css`, `script.js` — 존재 및 상대 경로 참조
- `README.md` — 실행 방법, 기능 설명, 프로젝트 구조
- (있는 경우) `.github/workflows/`, `CNAME`, GitHub Pages 관련 설정

## 점검 항목

### 파일 연결

- `index.html` → `style.css`, `script.js` 상대 경로가 올바른지
- `script type="module"` 사용 여부
- 404·대소문자 불일치·누락 파일 없는지
- 브라우저 콘솔에 로드 오류가 없을 구조인지

### 실행 방법 (README)

- `file://` 직접 열기 vs 로컬 서버 안내가 정확한지
- Windows / macOS / Linux 예시 명령이 유효한지
- **현재 구현된 기능**만 기능 목록에 포함되어 있는지
- 프로젝트 구조 트리가 실제 파일과 일치하는지

### GitHub Pages

- 저장소 루트 또는 `/docs` 중 Pages 소스 설정과 파일 위치가 맞는지
- `index.html`이 배포 루트에 있는지
- 절대 경로(`/style.css` 등)가 Pages 하위 경로에서 깨지지 않는지
- (조직/프로젝트 Pages URL 형식) `https://<user>.github.io/<repo>/` 접근 가능 구조인지
- 커스텀 도메인·`CNAME` 사용 시 설정 일치 여부

### 출시 품질

- 미구현 기능이 README에 완성된 것처럼 적혀 있지 않은지
- LICENSE·저작권 표기 필요 여부
- `QUALITY-CHECK.md` 등 품질 기록이 최신인지 (있는 경우)

## 출력 형식

한국어로 작성하세요.

```markdown
# 릴리스 점검 보고서

## 요약
| 항목 | 결과 |
|------|------|
| 파일 연결 | OK / 수정 필요 |
| README | OK / 수정 필요 |
| GitHub Pages | OK / 미설정 / 수정 필요 |
| 출시 판정 | 배포 가능 / 보류 |

## 점검 결과
| 항목 | 상태 | 상세 |
|------|------|------|
| HTML → CSS | | |
| HTML → JS | | |
| README 실행법 | | |
| ... | | |

## 수정 제안 (우선순위)
1. ...

## 배포 체크리스트
- [ ] `main` 브랜치 푸시
- [ ] GitHub Pages 활성화 (Settings → Pages)
- [ ] 배포 URL에서 게임 로드 확인
- [ ] README에 플레이 링크 반영
```

## 제약

- 기본적으로 **리포트만 작성**; 사용자가 수정을 요청한 경우에만 README 등 최소 수정
- 빌드 파이프라인·npm 의존성 도입은 이 프로젝트 제약과 맞지 않으면 제안하지 마세요
