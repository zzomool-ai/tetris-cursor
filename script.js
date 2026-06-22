/** 게임 보드 가로 칸 수 */
const COLS = 10;

/** 게임 보드 세로 칸 수 */
const ROWS = 20;

/** 한 칸의 픽셀 크기 */
const BLOCK_SIZE = 30;

/** 레벨당 속도 증가량 (ms) */
const LEVEL_SPEED_STEP = 80;

/** 기본 낙하 간격 (ms) */
const BASE_DROP_INTERVAL = 900;

/** 줄 삭제 점수표 */
const LINE_SCORES = [0, 100, 300, 500, 800];

/** 테트로미노 색상 */
const COLORS = {
  I: '#22d3ee',
  O: '#facc15',
  T: '#c084fc',
  S: '#4ade80',
  Z: '#f87171',
  J: '#60a5fa',
  L: '#fb923c',
};

/** 테트로미노 회전 상태 정의 */
const SHAPES = {
  I: [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
  ],
  O: [
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
  ],
  T: [
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
    [[0, 1, 0], [1, 1, 0], [0, 1, 0]],
  ],
  S: [
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
    [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
    [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
  ],
  J: [
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
    [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
  ],
  L: [
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
    [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
    [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
  ],
};

/** DOM 요소 */
const canvas = document.getElementById('game-canvas');
const nextCanvas = document.getElementById('next-canvas');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const linesEl = document.getElementById('lines');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

/** 2D 렌더링 컨텍스트 */
const ctx = canvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');

/** 게임 상태 */
const state = {
  board: createBoard(),
  current: null,
  next: null,
  score: 0,
  level: 1,
  lines: 0,
  status: 'menu',
  lastDrop: 0,
  animationId: null,
};

/**
 * 빈 게임 보드를 생성한다.
 * @returns {string[][]} 2차원 보드 배열
 */
function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(''));
}

/**
 * 랜덤 테트로미노를 생성한다.
 * @returns {{ type: string, rotation: number, x: number, y: number }} 피스 객체
 */
function createPiece() {
  const types = Object.keys(SHAPES);
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    type,
    rotation: 0,
    x: Math.floor(COLS / 2) - 1,
    y: 0,
  };
}

/**
 * 현재 회전 상태의 블록 행렬을 반환한다.
 * @param {{ type: string, rotation: number }} piece - 피스 객체
 * @returns {number[][]} 블록 행렬
 */
function getMatrix(piece) {
  return SHAPES[piece.type][piece.rotation];
}

/**
 * 피스가 보드 안에 유효한 위치인지 검사한다.
 * @param {{ type: string, rotation: number, x: number, y: number }} piece - 검사할 피스
 * @param {number} offsetX - X 이동량
 * @param {number} offsetY - Y 이동량
 * @param {number} [rotation] - 회전 상태
 * @returns {boolean} 유효하면 true
 */
function isValidPosition(piece, offsetX, offsetY, rotation = piece.rotation) {
  const matrix = SHAPES[piece.type][rotation];

  for (let row = 0; row < matrix.length; row += 1) {
    for (let col = 0; col < matrix[row].length; col += 1) {
      if (!matrix[row][col]) {
        continue;
      }

      const x = piece.x + col + offsetX;
      const y = piece.y + row + offsetY;

      if (x < 0 || x >= COLS || y >= ROWS) {
        return false;
      }

      if (y >= 0 && state.board[y][x]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * 현재 피스를 보드에 고정한다.
 */
function lockPiece() {
  const matrix = getMatrix(state.current);

  for (let row = 0; row < matrix.length; row += 1) {
    for (let col = 0; col < matrix[row].length; col += 1) {
      if (!matrix[row][col]) {
        continue;
      }

      const x = state.current.x + col;
      const y = state.current.y + row;

      if (y < 0) {
        endGame();
        return;
      }

      state.board[y][x] = state.current.type;
    }
  }
}

/**
 * 완성된 줄을 삭제하고 점수를 갱신한다.
 */
function clearLines() {
  let cleared = 0;

  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (state.board[row].every((cell) => cell !== '')) {
      state.board.splice(row, 1);
      state.board.unshift(Array(COLS).fill(''));
      cleared += 1;
      row += 1;
    }
  }

  if (cleared > 0) {
    state.lines += cleared;
    state.score += LINE_SCORES[cleared] * state.level;
    state.level = Math.floor(state.lines / 10) + 1;
    updateStats();
  }
}

/**
 * 다음 피스를 현재 피스로 교체한다.
 */
function spawnPiece() {
  state.current = state.next ?? createPiece();
  state.next = createPiece();

  if (!isValidPosition(state.current, 0, 0)) {
    endGame();
  }
}

/**
 * 피스를 아래로 한 칸 이동한다.
 * @returns {boolean} 이동 성공 여부
 */
function moveDown() {
  if (!isValidPosition(state.current, 0, 1)) {
    lockPiece();
    clearLines();
    spawnPiece();
    return false;
  }

  state.current.y += 1;
  return true;
}

/**
 * 피스를 좌우로 이동한다.
 * @param {number} direction - 이동 방향 (-1: 왼쪽, 1: 오른쪽)
 */
function moveHorizontal(direction) {
  if (isValidPosition(state.current, direction, 0)) {
    state.current.x += direction;
  }
}

/**
 * 피스를 회전한다.
 */
function rotatePiece() {
  const nextRotation = (state.current.rotation + 1) % 4;

  if (isValidPosition(state.current, 0, 0, nextRotation)) {
    state.current.rotation = nextRotation;
    return;
  }

  // 벽 차기: 좁은 공간에서 회전 허용
  const kicks = [-1, 1, -2, 2];
  for (const kick of kicks) {
    if (isValidPosition(state.current, kick, 0, nextRotation)) {
      state.current.x += kick;
      state.current.rotation = nextRotation;
      return;
    }
  }
}

/**
 * 피스를 즉시 바닥까지 떨어뜨린다.
 */
function hardDrop() {
  while (moveDown()) {
    state.score += 2;
  }
  updateStats();
}

/**
 * 현재 레벨의 낙하 간격을 반환한다.
 * @returns {number} 낙하 간격(ms)
 */
function getDropInterval() {
  return Math.max(120, BASE_DROP_INTERVAL - (state.level - 1) * LEVEL_SPEED_STEP);
}

/**
 * 점수 UI를 갱신한다.
 */
function updateStats() {
  scoreEl.textContent = String(state.score);
  levelEl.textContent = String(state.level);
  linesEl.textContent = String(state.lines);
}

/**
 * 단일 칸을 캔버스에 그린다.
 * @param {CanvasRenderingContext2D} context - 캔버스 컨텍스트
 * @param {number} x - X 좌표(칸)
 * @param {number} y - Y 좌표(칸)
 * @param {string} type - 블록 타입
 * @param {number} [cellSize=BLOCK_SIZE] - 칸 크기
 */
function drawCell(context, x, y, type, cellSize = BLOCK_SIZE) {
  const color = COLORS[type];
  const px = x * cellSize;
  const py = y * cellSize;

  context.fillStyle = color;
  context.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);

  context.fillStyle = 'rgba(255, 255, 255, 0.25)';
  context.fillRect(px + 2, py + 2, cellSize - 8, 4);
}

/**
 * 게임 보드를 렌더링한다.
 */
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (state.board[row][col]) {
        drawCell(ctx, col, row, state.board[row][col]);
      }
    }
  }

  if (state.current && (state.status === 'playing' || state.status === 'paused')) {
    const matrix = getMatrix(state.current);
    for (let row = 0; row < matrix.length; row += 1) {
      for (let col = 0; col < matrix[row].length; col += 1) {
        if (matrix[row][col]) {
          drawCell(ctx, state.current.x + col, state.current.y + row, state.current.type);
        }
      }
    }
  }
}

/**
 * 다음 블록 미리보기를 렌더링한다.
 */
function drawNextPiece() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

  if (!state.next) {
    return;
  }

  const matrix = getMatrix(state.next);
  const cellSize = 24;
  const offsetX = Math.floor((nextCanvas.width / cellSize - matrix[0].length) / 2);
  const offsetY = Math.floor((nextCanvas.height / cellSize - matrix.length) / 2);

  for (let row = 0; row < matrix.length; row += 1) {
    for (let col = 0; col < matrix[row].length; col += 1) {
      if (matrix[row][col]) {
        drawCell(nextCtx, offsetX + col, offsetY + row, state.next.type, cellSize);
      }
    }
  }
}

/**
 * 게임 루프를 실행한다.
 * @param {number} timestamp - requestAnimationFrame 타임스탬프
 */
function gameLoop(timestamp) {
  if (state.status === 'playing') {
    if (timestamp - state.lastDrop >= getDropInterval()) {
      moveDown();
      state.lastDrop = timestamp;
    }
  }

  drawBoard();
  drawNextPiece();
  state.animationId = requestAnimationFrame(gameLoop);
}

/**
 * 오버레이 UI를 표시한다.
 * @param {string} title - 제목
 * @param {string} message - 안내 문구
 * @param {'start' | 'restart'} mode - 버튼 모드
 */
function showOverlay(title, message, mode) {
  overlay.classList.remove('hidden');
  overlayTitle.textContent = title;
  overlayMessage.textContent = message;
  startBtn.classList.toggle('hidden', mode !== 'start');
  restartBtn.classList.toggle('hidden', mode !== 'restart');
}

/**
 * 오버레이 UI를 숨긴다.
 */
function hideOverlay() {
  overlay.classList.add('hidden');
}

/**
 * 게임 상태를 초기화하고 시작한다.
 */
function startGame() {
  state.board = createBoard();
  state.current = null;
  state.next = createPiece();
  state.score = 0;
  state.level = 1;
  state.lines = 0;
  state.status = 'playing';
  state.lastDrop = performance.now();
  updateStats();
  spawnPiece();
  hideOverlay();
}

/**
 * 게임 오버 처리를 수행한다.
 */
function endGame() {
  state.status = 'gameover';
  showOverlay('게임 오버', `최종 점수: ${state.score}`, 'restart');
}

/**
 * 일시정지 상태를 토글한다.
 */
function togglePause() {
  if (state.status === 'playing') {
    state.status = 'paused';
    startBtn.textContent = '계속하기';
    showOverlay('일시정지', '계속하려면 버튼을 누르세요', 'start');
    return;
  }

  if (state.status === 'paused') {
    state.status = 'playing';
    state.lastDrop = performance.now();
    startBtn.textContent = '게임 시작';
    hideOverlay();
  }
}

/**
 * 키보드 입력을 처리한다.
 * @param {KeyboardEvent} event - 키보드 이벤트
 */
function handleKeyDown(event) {
  if (state.status === 'menu' || state.status === 'gameover') {
    return;
  }

  if (event.code === 'KeyP') {
    togglePause();
    return;
  }

  if (state.status !== 'playing') {
    return;
  }

  switch (event.code) {
    case 'ArrowLeft':
      moveHorizontal(-1);
      break;
    case 'ArrowRight':
      moveHorizontal(1);
      break;
    case 'ArrowDown':
      if (moveDown()) {
        state.score += 1;
        updateStats();
      }
      break;
    case 'ArrowUp':
      rotatePiece();
      break;
    case 'Space':
      event.preventDefault();
      hardDrop();
      break;
    default:
      break;
  }
}

/**
 * 터치 버튼 입력을 처리한다.
 * @param {string} action - 조작 종류
 */
function handleTouchAction(action) {
  if (state.status !== 'playing') {
    return;
  }

  switch (action) {
    case 'left':
      moveHorizontal(-1);
      break;
    case 'right':
      moveHorizontal(1);
      break;
    case 'down':
      if (moveDown()) {
        state.score += 1;
        updateStats();
      }
      break;
    case 'rotate':
      rotatePiece();
      break;
    case 'drop':
      hardDrop();
      break;
    default:
      break;
  }
}

/**
 * 이벤트 리스너를 등록한다.
 */
function bindEvents() {
  document.addEventListener('keydown', handleKeyDown);

  startBtn.addEventListener('click', () => {
    if (state.status === 'paused') {
      togglePause();
      return;
    }
    startGame();
  });

  restartBtn.addEventListener('click', startGame);

  document.querySelectorAll('.touch-btn').forEach((button) => {
    button.addEventListener('click', () => {
      handleTouchAction(button.dataset.action);
    });
  });
}

/**
 * 게임을 초기화한다.
 */
function init() {
  bindEvents();
  showOverlay('테트리스', '7가지 블록을 쌓고 줄을 없애 보세요!', 'start');
  state.animationId = requestAnimationFrame(gameLoop);
}

init();
