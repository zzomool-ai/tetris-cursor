# 테트리스 (학습용)

HTML, CSS, JavaScript만 사용하는 브라우저 테트리스 게임입니다.  
빌드 도구와 외부 라이브러리 없이 정적 파일만으로 동작하며, Cursor Agent 단계별 프롬프트로 만든 **입문자용 교육 프로젝트**입니다.

## 배포 링크

| 항목 | URL |
|------|-----|
| GitHub 저장소 | https://github.com/zzomool-ai/tetris-cursor |
| GitHub Pages (플레이) | https://zzomool-ai.github.io/tetris-cursor/ |

## 실행 방법

별도 설치나 빌드 없이 브라우저에서 바로 실행할 수 있습니다.

### 방법 1: 파일 직접 열기

1. 저장소를 클론하거나 ZIP으로 받습니다.
2. `index.html`을 더블클릭하거나 브라우저로 드래그합니다.

```bash
git clone https://github.com/zzomool-ai/tetris-cursor.git
cd tetris-cursor
```

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 방법 2: 로컬 서버 (권장)

`file://`로 열 때 ES Module이 동작하지 않는 브라우저가 있을 수 있습니다.  
문제가 있으면 아래처럼 간단한 로컬 서버를 사용하세요.

```bash
python -m http.server 8080
```

브라우저에서 `http://localhost:8080` 으로 접속합니다.

## 조작법

**게임 시작** 버튼을 누른 뒤 키보드로 조작합니다.

| 키 | 동작 |
|----|------|
| `←` (`ArrowLeft`) | 왼쪽으로 한 칸 이동 |
| `→` (`ArrowRight`) | 오른쪽으로 한 칸 이동 |
| `↓` (`ArrowDown`) | 한 칸 빠르게 내리기 (소프트 드롭) |
| `↑` (`ArrowUp`) | 블록 90° 회전 |
| `Space` | 하드 드롭 (바닥·장애물까지 즉시 착지) |

- 벽·고정 블록과 충돌하는 이동·회전은 적용되지 않습니다.
- 회전 후 충돌이 발생하면 회전이 취소됩니다.

### 점수 규칙

| 삭제 줄 수 | 점수 |
|------------|------|
| 1줄 | 100 |
| 2줄 | 300 |
| 3줄 | 500 |
| 4줄 | 800 |

### 게임 오버·재시작

- 새 블록을 스폰할 공간이 없으면 **게임 오버**됩니다.
- 게임 오버 시 보드 위에 최종 점수가 표시됩니다.
- **다시 시작** 버튼으로 보드·점수·타이머·상태를 초기화합니다.

## 구현 기능

| 기능 | 설명 |
|------|------|
| 7종 테트로미노 | I, O, T, S, Z, J, L (CSS Grid 렌더링) |
| 10×20 게임 보드 | CSS Grid 기반 칸 표현 |
| 자동 낙하 | `setInterval` 기반 (800ms 간격) |
| 충돌 판정 | `canMove(piece, dx, dy, matrix)` |
| 키보드 조작 | 이동·회전·소프트/하드 드롭 |
| 줄 삭제·점수 | 1~4줄 삭제 시 점수 가산 |
| 게임 오버·재시작 | 스폰 불가 시 종료, 다시 시작으로 초기화 |

## 품질 점검 방법

프로젝트에는 Cursor 슬래시 커맨드(`.cursor/commands/`)와 품질 기록이 포함되어 있습니다.

### 자동 검사

```bash
# JavaScript 문법 검사
node --check script.js
```

### Cursor 커맨드 (채팅에서 `/` 입력)

| 커맨드 | 용도 |
|--------|------|
| `/review-structure` | 파일·함수 역할 분리 점검 |
| `/code-review` | 보드·렌더링 코드 리뷰 |
| `/review-game-logic` | 낙하·충돌·조작 로직 점검 |
| `/qa-playtest` | 사용자 시나리오 QA |
| `/bug-hunt` | 고위험 버그 수정 |
| `/refactor-safe` | 기능 변화 없는 구조 개선 |
| `/release-check` | 배포 전 최종 점검 |

### 수동 플레이테스트

1. 로컬 서버로 게임을 연다.
2. **게임 시작** → 자동 낙하·키보드 조작 확인
3. 줄을 채워 삭제·점수 증가 확인
4. 보드를 가득 채워 게임 오버·오버레이 확인
5. **다시 시작** → 초기화 확인

상세 기록은 `QUALITY-CHECK.md`를 참고하세요. (일부 항목은 이전 버전 기준이므로 최신 코드와 대조할 것)

## GitHub Pages 배포 방법

이 프로젝트는 **저장소 루트**의 정적 파일을 그대로 배포합니다.

### 1. 배포할 파일 커밋·푸시

```bash
git add index.html style.css script.js README.md QUALITY-CHECK.md
git commit -m "feat: 테트리스 게임 배포 준비"
git push origin main
```

### 2. GitHub Pages 활성화

1. GitHub 저장소 → **Settings** → **Pages**
2. **Build and deployment** → Source: **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)**
4. **Save** 클릭

### 3. 배포 확인

- 몇 분 후 `https://zzomool-ai.github.io/tetris-cursor/` 접속
- 게임 보드·스타일·스크립트가 로드되는지 확인
- 브라우저 개발자 도구(F12) → Console에 404·에러 없는지 확인

### 배포 시 주의

- `index.html`의 `style.css`, `script.js`는 **상대 경로**이므로 Pages 하위 경로에서도 정상 동작합니다.
- 빌드 단계가 없으므로 Actions 워크플로우는 필수가 아닙니다.

## 프로젝트 구조

```
tetris-cursor/
├── index.html          # 게임 페이지
├── style.css           # 스타일
├── script.js           # 게임 로직 (ES Module)
├── README.md           # 이 문서
├── QUALITY-CHECK.md    # 품질 점검 기록
└── .cursor/commands/   # Cursor 슬래시 커맨드 (선택)
```

## 기술 스택

- HTML5 / CSS3 / Vanilla JavaScript (ES Modules)
- 외부 라이브러리 없음
- 빌드 도구 없음

## 라이선스

ISC
