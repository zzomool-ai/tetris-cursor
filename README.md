# tetris-cursor

Cursor Agent 단계별 프롬프트로 만든 브라우저 테트리스 게임입니다.

## 배포 링크

| 항목 | URL |
|------|-----|
| **GitHub 저장소** | https://github.com/zzomool-ai/tetris-cursor |
| **GitHub Pages (플레이)** | https://zzomool-ai.github.io/tetris-cursor/ |

## 실행 방법

별도 설치나 빌드 없이 정적 파일만으로 실행됩니다.

### 방법 1: 파일 직접 열기

1. 이 저장소를 클론하거나 ZIP으로 받습니다.
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

### 방법 2: 로컬 서버 (선택)

ES Module을 일부 브라우저에서 `file://`로 열 때 제한될 수 있으므로, 문제가 있으면 간단한 로컬 서버를 사용하세요.

```bash
npx --yes serve .
# 또는
python -m http.server 8080
```

브라우저에서 `http://localhost:8080` (또는 serve가 안내하는 주소)로 접속합니다.

## 조작법

### 키보드

| 키 | 동작 |
|----|------|
| `←` `→` | 블록 좌우 이동 |
| `↓` | 소프트 드롭 (한 칸 아래, +1점) |
| `↑` | 블록 90° 회전 |
| `Space` | 하드 드롭 (즉시 착지, 칸당 +2점) |
| `P` | 일시정지 / 재개 |

### 터치 (모바일)

화면 하단 버튼으로 이동·회전·드롭을 조작할 수 있습니다. (820px 이하 화면에서 표시)

### 게임 흐름

1. **시작 화면** → `게임 시작` 클릭
2. 블록을 쌓아 가로줄을 채우면 줄이 삭제됩니다.
3. 블록이 맨 위까지 쌓이면 **게임 오버** → `다시 시작`으로 재시작

## 기능 목록

| 기능 | 설명 |
|------|------|
| 7종 테트로미노 | I, O, T, S, Z, J, L (각기 다른 색상) |
| 10×20 게임 보드 | HTML5 Canvas 렌더링 |
| 다음 블록 미리보기 | 우측 패널에 표시 |
| 줄 삭제 & 점수 | 1줄 100 / 2줄 300 / 3줄 500 / 4줄 800 (×현재 레벨) |
| 레벨 시스템 | 10줄마다 레벨 상승, 낙하 속도 증가 |
| 충돌 & 벽 차기 | 벽·바닥·고정 블록 충돌, 좁은 공간 회전 보정 |
| 일시정지 | P 키 또는 오버레이 버튼 |
| 게임 오버 & 재시작 | 최종 점수 표시 후 재시작 |
| 반응형 UI | 데스크톱·모바일 레이아웃 분기 |
| 터치 조작 | 모바일용 화면 버튼 |
| 접근성 | canvas `aria-label`, 키보드 전용 조작 가능 |

## 프로젝트 구조

```
tetris-cursor/
├── index.html      # 게임 페이지
├── style.css       # 스타일
├── script.js       # 게임 로직 (ES Module)
├── README.md       # 이 문서
└── QUALITY-CHECK.md  # 품질 점검 기록
```

## 기술 스택

- HTML5 / CSS3 / Vanilla JavaScript (ES Modules)
- 외부 라이브러리 없음

## 품질 점검

`QUALITY-CHECK.md`에 code-review, qa-playtest, bug-hunt, release-check 결과가 기록되어 있습니다.

## 라이선스

ISC
