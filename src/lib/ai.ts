import { BOARD_X, BOARD_Y, Side, type Board } from "../global.js";
import { judge } from "./logic.js";

function whenMe(
  board: Side[][],
  thisSide: Side,
  oppoSide: Side,
  depth: number
) {
  let max = 0;
  for (let x = 0; x < BOARD_X; x++) {
    for (let y = 0; y < BOARD_Y; y++) {
      if (board[x][y] != Side.Null) continue;
      board[x][y] = thisSide;
      const result = judge(board, x, y);
      if (result == thisSide) {
        board[x][y] = Side.Null;
        return 4;
      } else if (result == Side.Null) {
        if (depth <= 2) {
          board[x][y] = Side.Null;
          if (max < 3) max = 3;
        } else {
          const next = whenOppo(board, oppoSide, thisSide, depth - 1);
          board[x][y] = Side.Null;
          if (next == 4) return 4;
          if (max < next) max = next;
        }
      } else if (result == Side.Tie) {
        board[x][y] = Side.Null;
        return 2;
      } else {
        board[x][y] = Side.Null;
      }
    }
  }
  return max;
}

function whenOppo(
  board: Side[][],
  thisSide: Side,
  oppoSide: Side,
  depth: number
) {
  let min = 4;
  for (let x = 0; x < BOARD_X; x++) {
    for (let y = 0; y < BOARD_Y; y++) {
      if (board[x][y] != Side.Null) continue;
      board[x][y] = thisSide;
      const result = judge(board, x, y);
      if (result == thisSide) {
        board[x][y] = Side.Null;
        return 0;
      } else if (result == Side.Null) {
        if (depth <= 2) {
          board[x][y] = Side.Null;
          if (min > 3) min = 3;
        } else {
          const next = whenMe(board, oppoSide, thisSide, depth - 1);
          board[x][y] = Side.Null;
          if (next == 0) return 0;
          if (min > next) min = next;
        }
      } else if (result == Side.Tie) {
        board[x][y] = Side.Null;
        return 2;
      } else {
        board[x][y] = Side.Null;
      }
    }
  }
  return min;
}

function rand(board: Side[][]): [number, number] {
  const size = BOARD_X * BOARD_Y;
  while (true) {
    const next = Math.floor(Math.random() * size);
    const row = Math.floor(next / BOARD_X);
    const col = next % BOARD_X;
    if (board[row][col] == Side.Null) {
      return [row, col];
    }
  }
}

export function ai(_board: Board, depth: number): [number, number] {
  const thisSide = _board.side;
  if (thisSide != Side.Black && thisSide != Side.White)
    throw "invalid side in ai";
  const oppoSide = thisSide == Side.Black ? Side.White : Side.Black;

  const board = _board.board;

  const _gone = board.reduce(
    (sum, arr) =>
      sum + arr.reduce((asum, s) => asum + (s == Side.Null ? 0 : 1), 0),
    0
  );
  if (_gone < 4) return rand(board);

  let max = -1,
    resx = 0,
    resy = 0,
    maxrand = 0;

  for (let x = 0; x < BOARD_X; x++) {
    for (let y = 0; y < BOARD_Y; y++) {
      if (board[x][y] != Side.Null) continue;
      board[x][y] = thisSide;
      const result = judge(board, x, y);
      if (result == thisSide) {
        board[x][y] = Side.Null;
        return [x, y];
      } else if (result == Side.Null) {
        if (depth <= 1) {
          board[x][y] = Side.Null;
          let eq3 = false;
          if (max == 3) {
            const ra = Math.random();
            if (ra > maxrand) {
              maxrand = ra;
              eq3 = true;
            }
          }
          if (max < 3 || eq3) {
            max = 3;
            resx = x;
            resy = y;
          }
        } else {
          const next = whenOppo(board, oppoSide, thisSide, depth);

          board[x][y] = Side.Null;
          if (next == 4) return [x, y];
          let eq3 = false;
          if (max == next) {
            const ra = Math.random();
            if (ra > maxrand) {
              maxrand = ra;
              eq3 = true;
            }
          }
          if (max < next || eq3) {
            max = next;
            resx = x;
            resy = y;
          }
        }
      } else if (result == Side.Tie) {
        board[x][y] = Side.Null;
        return [x, y];
      } else {
        board[x][y] = Side.Null;
        if (max < 0) {
          max = 0;
          resx = x;
          resy = y;
        }
      }
    }
  }
  return [resx, resy];
}
