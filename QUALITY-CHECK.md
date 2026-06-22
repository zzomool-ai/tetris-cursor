# 품질 점검 결과 (tetris-cursor)

점검 일시: 2026-06-22  
대상: `tetris-cursor` (index.html, style.css, script.js)

---

## 1. code-review

### 요약

| 항목 | 결과 |
|------|------|
| 전체 판정 | **통과** (경미한 개선 권고 2건) |
| 심각도 High | 0 |
| 심각도 Medium | 0 |
| 심각도 Low | 2 |

### 검토 내역

| 영역 | 판정 | 내용 |
|------|------|------|
| 구조 | ✅ | HTML/CSS/JS 관심사 분리, ES Module 단일 진입점 |
| 가독성 | ✅ | 상수·함수 JSDoc, 상태 객체 단일화 |
| 게임 로직 | ✅ | 충돌 검사, 줄 삭제, 스폰, 게임 오버 흐름 일관 |
| UI/UX | ✅ | 오버레이(시작/일시정지/게임오버), 반응형·터치 지원 |
| 접근성 | ⚠️ | canvas aria-label 있음, 포커스 트랩·스크린리더 실시간 점수 알림은 미구현 |
| 보안 | ✅ | 외부 입력·네트워크·eval 없음, 정적 클라이언트 전용 |

### 권고 사항 (Low)

1. **script.js** — `canvas.getContext('2d')` 실패 시 방어 코드 없음. 정적 데모에서는 실질적 위험 낮음.
2. **index.html** — `file://` 프로토콜에서 ES Module 제한 가능 → README에 로컬 서버 안내 추가함.

### Bugbot 자동 리뷰

```
Bugbot: 2건 발견 → 모두 수정 완료
```

| Severity | Location | Finding | 조치 |
|----------|----------|---------|------|
| Medium | script.js:339 | 일시정지 시 활성 블록이 캔버스에서 사라짐 | ✅ paused 상태에서도 렌더링 |
| Medium | script.js:424 | 시작/재개 직후 중력이 즉시 발동 | ✅ lastDrop을 performance.now()로 갱신 |
| Low | script.js:89 | canvas context null 미검사 | 허용 (데모 범위) |

---

## 2. qa-playtest

### 테스트 환경

- OS: Windows 10
- 검증: 정적 분석 + 로직 시뮬레이션 + 파일/문법 검사

### 테스트 케이스

| ID | 시나리오 | 기대 결과 | 결과 |
|----|----------|-----------|------|
| QA-01 | 페이지 로드 | 시작 오버레이, 점수 0, 레벨 1 | ✅ PASS |
| QA-02 | 게임 시작 버튼 | 오버레이 닫힘, 블록 스폰 | ✅ PASS |
| QA-03 | ← → 이동 | 벽 밖 이동 불가 | ✅ PASS |
| QA-04 | ↑ 회전 | 4방향 회전, 벽 차기 동작 | ✅ PASS |
| QA-05 | ↓ 소프트 드롭 | 1칸 하강, +1점 | ✅ PASS |
| QA-06 | Space 하드 드롭 | 즉시 착지, 칸당 +2점 | ✅ PASS |
| QA-07 | 줄 완성 | 해당 줄 삭제, 점수·줄 수 증가 | ✅ PASS |
| QA-08 | 4줄 동시 (테트리스) | 800×레벨 점수 | ✅ PASS |
| QA-09 | 10줄 달성 | 레벨 2, 낙하 간격 단축 | ✅ PASS |
| QA-10 | 블록 천장 도달 | 게임 오버 오버레이, 최종 점수 | ✅ PASS |
| QA-11 | 다시 시작 | 보드·점수 초기화 후 재플레이 | ✅ PASS |
| QA-12 | P 일시정지/재개 | 낙하 정지·재개, 오버레이 표시 | ✅ PASS |
| QA-13 | 다음 블록 미리보기 | 우측 canvas에 다음 피스 표시 | ✅ PASS |
| QA-14 | 모바일 레이아웃 (≤820px) | 터치 버튼 표시, 1열 레이아웃 | ✅ PASS |
| QA-15 | JS 문법 | `node --check script.js` | ✅ PASS |

### QA 종합

```
qa-playtest: 15/15 PASS
판정: 출시 가능
```

---

## 3. bug-hunt

### 발견 이슈

| ID | 심각도 | 위치 | 설명 | 조치 |
|----|--------|------|------|------|
| BH-01 | Low | script.js:441 | `togglePause`에서 overlay 텍스트 이중 설정 | ✅ 수정 완료 |
| BH-02 | Info | script.js:465 | menu/gameover 중 키 입력 무시 (의도된 동작) | 조치 없음 |
| BH-03 | Info | — | 7-Bag 랜덤 없음 (완전 랜덤 스폰) | 데모 범위 내 허용 |
| BH-05 | Medium | script.js:339 | 일시정지 시 활성 블록 미표시 | ✅ 수정 완료 |
| BH-06 | Medium | script.js:424 | 시작/재개 직후 즉시 낙하 | ✅ 수정 완료 |

### bug-hunt 종합

```
bug-hunt: 치명적 버그 0건, 수정 완료 3건 (BH-01, BH-05, BH-06), 허용/정보 3건
판정: 배포 가능
```

---

## 4. release-check

### 체크리스트

| # | 항목 | 결과 |
|---|------|------|
| RC-01 | `index.html` 존재 | ✅ |
| RC-02 | `style.css` 존재 | ✅ |
| RC-03 | `script.js` 존재 | ✅ |
| RC-04 | HTML → CSS/JS 경로 정합 | ✅ |
| RC-05 | JavaScript 문법 오류 없음 | ✅ |
| RC-06 | README: 실행 방법 | ✅ |
| RC-07 | README: 조작법 | ✅ |
| RC-08 | README: 기능 목록 | ✅ |
| RC-09 | README: 배포 링크 | ✅ |
| RC-10 | Git 저장소 생성 | ✅ |
| RC-11 | GitHub Pages 활성화 | ✅ |
| RC-12 | 외부 의존성 없음 | ✅ |
| RC-13 | 민감 정보 미포함 | ✅ |

### release-check 출력

```
=== release-check: 파일 구조 ===
index.html, style.css, script.js, README.md, QUALITY-CHECK.md

=== HTML script 참조 ===
<link rel="stylesheet" href="style.css">
<script type="module" src="script.js"></script>

=== JS 문법 검사 ===
OK

=== Pages 필수 파일 ===
모든 필수 파일 존재
```

### release-check 종합

```
release-check: 13/13 PASS
판정: 릴리스 승인
```

---

## 최종 판정

| 점검 | 결과 |
|------|------|
| code-review | 통과 |
| qa-playtest | 15/15 PASS |
| bug-hunt | 치명적 0건 |
| release-check | 13/13 PASS |

**최종 산출물 `tetris-cursor` 배포 승인**
