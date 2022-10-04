export enum Side {
  Null,
  White,
  Black,
  Tie,
}

export type Board = {
  board: Side[][];
  side: Side;
};

export const BOARD_X = 5,
  BOARD_Y = 5;

export function newBoard(): Board {
  const _board = Array<Side[]>(BOARD_X);
  for (let index = 0; index < BOARD_X; index++) {
    _board[index] = Array(BOARD_Y).fill(Side.Null);
  }
  return {
    board: _board,
    side: Side.Black,
  };
}
