/** 게임 보드 가로 칸 수 */
const COLS = 10;

/** 게임 보드 세로 칸 수 */
const ROWS = 20;

/** 자동 낙하 간격 (ms) */
const DROP_INTERVAL = 800;

/** 줄 삭제 점수표 (삭제 줄 수 인덱스) */
const LINE_SCORES = [0, 100, 300, 500, 800];

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
const boardEl = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const overlayEl = document.getElementById('overlay');
const overlayTitleEl = document.getElementById('overlay-title');
const overlayMessageEl = document.getElementById('overlay-message');

/** 보드 칸 DOM 요소 목록 */
const cellElements = [];

/** 자동 낙하 타이머 ID */
let dropTimerId = null;

/** 게임 상태 */
const state = {
  board: createBoard(),
  current: null,
  score: 0,
  status: 'idle',
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
  const matrix = SHAPES[type][0];
  const spawnX = Math.floor((COLS - matrix[0].length) / 2);

  return {
    type,
    rotation: 0,
    x: spawnX,
    y: 0,
  };
}

/**
 * 피스의 블록 행렬을 반환한다.
 * @param {{ type: string, rotation: number }} piece - 피스 객체
 * @returns {number[][]} 블록 행렬
 */
function getMatrix(piece) {
  return SHAPES[piece.type][piece.rotation];
}

/**
 * 피스가 이동 가능한지 충돌 판정한다.
 * @param {{ type: string, x: number, y: number }} piece - 피스 객체
 * @param {number} dx - X 이동량
 * @param {number} dy - Y 이동량
 * @param {number[][]} matrix - 블록 행렬
 * @returns {boolean} 이동 가능하면 true
 */
function canMove(piece, dx, dy, matrix) {
  for (let row = 0; row < matrix.length; row += 1) {
    for (let col = 0; col < matrix[row].length; col += 1) {
      if (!matrix[row][col]) {
        continue;
      }

      const newRow = piece.y + row + dy;
      const newCol = piece.x + col + dx;

      if (newCol < 0 || newCol >= COLS || newRow >= ROWS) {
        return false;
      }

      if (newRow < 0) {
        continue;
      }

      if (state.board[newRow][newCol]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * 자동 낙하 타이머를 시작한다. 기존 타이머가 있으면 먼저 해제한다.
 */
function startDropTimer() {
  stopDropTimer();
  dropTimerId = setInterval(() => {
    if (state.status === 'playing') {
      moveDown();
    }
  }, DROP_INTERVAL);
}

/**
 * 자동 낙하 타이머를 해제한다.
 */
function stopDropTimer() {
  if (dropTimerId !== null) {
    clearInterval(dropTimerId);
    dropTimerId = null;
  }
}

/**
 * 보드 격자 DOM을 최초 1회 생성한다.
 */
function buildBoardGrid() {
  boardEl.innerHTML = '';
  cellElements.length = 0;

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      boardEl.appendChild(cell);
      cellElements.push(cell);
    }
  }
}

/**
 * 행·열 좌표에 해당하는 칸 DOM을 반환한다.
 * @param {number} row - 행
 * @param {number} col - 열
 * @returns {HTMLElement | undefined} 칸 요소
 */
function getCellElement(row, col) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
    return undefined;
  }

  return cellElements[row * COLS + col];
}

/**
 * 칸의 표시 상태를 초기화한다.
 * @param {HTMLElement} cell - 칸 요소
 */
function clearCell(cell) {
  cell.className = 'cell';
  cell.removeAttribute('data-type');
}

/**
 * 고정된 보드 상태를 CSS Grid 칸에 렌더링한다.
 */
function renderBoard() {
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const cell = getCellElement(row, col);
      const type = state.board[row][col];

      clearCell(cell);

      if (type) {
        cell.classList.add(`cell--${type}`);
        cell.dataset.type = type;
      }
    }
  }
}

/**
 * 현재 떨어지는 블록을 보드 위에 그린다.
 * @param {{ type: string, x: number, y: number }} piece - 피스 객체
 */
function drawPiece(piece) {
  if (!piece) {
    return;
  }

  const matrix = getMatrix(piece);

  for (let row = 0; row < matrix.length; row += 1) {
    for (let col = 0; col < matrix[row].length; col += 1) {
      if (!matrix[row][col]) {
        continue;
      }

      const boardRow = piece.y + row;
      const boardCol = piece.x + col;
      const cell = getCellElement(boardRow, boardCol);

      if (!cell) {
        continue;
      }

      clearCell(cell);
      cell.classList.add(`cell--${piece.type}`, 'cell--piece');
      cell.dataset.type = piece.type;
    }
  }
}

/**
 * 보드와 현재 블록을 함께 화면에 반영한다.
 */
function render() {
  renderBoard();
  drawPiece(state.current);
}

/**
 * 점수 UI를 갱신한다.
 */
function updateScore() {
  scoreEl.textContent = String(state.score);
}

/**
 * 완성된 줄을 삭제하고 점수를 갱신한다.
 * @returns {number} 삭제된 줄 수
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
    state.score += LINE_SCORES[cleared];
    updateScore();
  }

  return cleared;
}

/**
 * 게임 오버 오버레이를 표시한다.
 */
function showGameOverOverlay() {
  overlayTitleEl.textContent = '게임 오버';
  overlayMessageEl.textContent = `최종 점수: ${state.score}`;
  overlayEl.classList.remove('hidden');
}

/**
 * 게임 오버 오버레이를 숨긴다.
 */
function hideOverlay() {
  overlayEl.classList.add('hidden');
}

/**
 * 현재 블록을 보드에 고정한다.
 */
function lockPiece() {
  const piece = state.current;
  const matrix = getMatrix(piece);

  for (let row = 0; row < matrix.length; row += 1) {
    for (let col = 0; col < matrix[row].length; col += 1) {
      if (!matrix[row][col]) {
        continue;
      }

      const boardRow = piece.y + row;
      const boardCol = piece.x + col;

      if (boardRow < 0) {
        endGame();
        return;
      }

      state.board[boardRow][boardCol] = piece.type;
    }
  }
}

/**
 * 착지 후 줄 삭제와 새 블록 스폰을 처리한다.
 */
function settleAfterLock() {
  if (state.status !== 'playing') {
    return;
  }

  clearLines();
  spawnPiece();
}

/**
 * 새 블록을 스폰한다. 스폰 불가 시 게임 오버 처리한다.
 */
function spawnPiece() {
  state.current = createPiece();
  const matrix = getMatrix(state.current);

  if (!canMove(state.current, 0, 0, matrix)) {
    endGame();
  }
}

/**
 * 피스를 좌우로 이동한다.
 * @param {number} direction - 이동 방향 (-1: 왼쪽, 1: 오른쪽)
 * @returns {boolean} 이동에 성공했으면 true
 */
function moveHorizontal(direction) {
  const piece = state.current;
  const matrix = getMatrix(piece);

  if (canMove(piece, direction, 0, matrix)) {
    piece.x += direction;
    return true;
  }

  return false;
}

/**
 * 피스를 90도 회전한다. 충돌 시 회전을 취소한다.
 * @returns {boolean} 회전에 성공했으면 true
 */
function rotatePiece() {
  const piece = state.current;
  const nextRotation = (piece.rotation + 1) % 4;
  const nextMatrix = SHAPES[piece.type][nextRotation];

  if (canMove(piece, 0, 0, nextMatrix)) {
    piece.rotation = nextRotation;
    return true;
  }

  return false;
}

/**
 * 피스를 바닥까지 즉시 떨어뜨린다.
 */
function hardDrop() {
  while (moveDown()) {
    // 충돌할 때까지 반복
  }
}

/**
 * 피스를 아래로 한 칸 이동한다. 막히면 고정 후 줄 삭제·스폰을 진행한다.
 * @returns {boolean} 이동에 성공했으면 true
 */
function moveDown() {
  const piece = state.current;
  const matrix = getMatrix(piece);

  if (canMove(piece, 0, 1, matrix)) {
    piece.y += 1;
    return true;
  }

  lockPiece();
  settleAfterLock();
  return false;
}

/**
 * 게임 오버 상태로 전환한다.
 */
function endGame() {
  stopDropTimer();
  state.status = 'gameover';
  state.current = null;
  showGameOverOverlay();
}

/**
 * 화면 렌더링 루프를 실행한다.
 */
function gameLoop() {
  render();
  state.animationId = requestAnimationFrame(gameLoop);
}

/**
 * 게임 상태를 초기화한다.
 */
function resetGame() {
  stopDropTimer();
  state.board = createBoard();
  state.current = createPiece();
  state.score = 0;
  state.status = 'idle';
  updateScore();
  hideOverlay();
  render();
}

/**
 * 게임 시작 버튼 동작.
 */
function handleStart() {
  if (state.status === 'gameover') {
    resetGame();
  }

  hideOverlay();
  state.status = 'playing';
  startDropTimer();
  render();
}

/**
 * 키보드 입력을 처리한다.
 * @param {KeyboardEvent} event - 키보드 이벤트
 */
function handleKeyDown(event) {
  if (state.status !== 'playing' || !state.current) {
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
      moveDown();
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
 * 이벤트 리스너를 등록한다.
 */
function bindEvents() {
  startBtn.addEventListener('click', handleStart);
  restartBtn.addEventListener('click', resetGame);
  document.addEventListener('keydown', handleKeyDown);
}

/**
 * 앱을 초기화한다.
 */
function init() {
  buildBoardGrid();
  state.current = createPiece();
  bindEvents();
  updateScore();
  state.animationId = requestAnimationFrame(gameLoop);
}

init();
