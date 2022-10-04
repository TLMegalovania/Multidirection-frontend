import { type Board, Side, BOARD_X, BOARD_Y } from "../global.js";

const DIRS = [
  [
    [
      [-1, 0],
      [-2, 0],
    ],
    [
      [1, 0],
      [2, 0],
    ],
  ],
  [
    [
      [-1, -1],
      [-2, -2],
    ],
    [
      [1, 1],
      [2, 2],
    ],
  ],
  [
    [
      [0, -1],
      [0, -2],
    ],
    [
      [0, 1],
      [0, 2],
    ],
  ],
  [
    [
      [1, -1],
      [2, -2],
    ],
    [
      [-1, 1],
      [-2, 2],
    ],
  ],
];
const MIN_COUNT_ON_LINE_MINUS_ONE = 2;
const MIN_LINE_COUNT = 2;

/**
 * no side effect. do the move before judge.
 * @param board
 * @param x
 * @param y
 * @returns winning side
 */
function judge(board: Board, x: number, y: number): Side {
  const mySide = board.side;
  let multi = 0;
  for (const dir of DIRS) {
    let count = 0;
    for (const side of dir) {
      for (const delta of side) {
        const nx = x + delta[0],
          ny = y + delta[1];
        if (outOfIndex(nx, ny) || board.board[nx][ny] != mySide) break;
        count++;
      }
    }
    if (count >= MIN_COUNT_ON_LINE_MINUS_ONE) multi++;
  }
  if (multi == 0)
    return board.board.every((rows) => rows.every((val) => val != Side.Null))
      ? Side.Tie
      : Side.Null;
  if (multi < MIN_LINE_COUNT)
    return mySide == Side.Black ? Side.White : Side.Black; //todo
  return mySide;
}

function outOfIndex(x: number, y: number) {
  return x >= BOARD_X || x < 0 || y >= BOARD_Y || y < 0;
}

export { judge };
