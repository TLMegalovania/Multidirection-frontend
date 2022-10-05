<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { BOARD_X, BOARD_Y, newBoard, Side } from "./global.js";
  import { ai } from "./lib/ai.js";
  import { judge } from "./lib/logic.js";

  const dispatch = createEventDispatcher();

  const rootStyle = document.documentElement.style;
  rootStyle.setProperty("transition", "all 0.5s");
  onDestroy(() => {
    rootStyle.removeProperty("transition");
  });

  export let bgColor: number;
  let board = newBoard();
  bgColor = 10;

  let lastTarget: HTMLElement;
  let gameResult = Side.Null;

  const areaElements = Array<HTMLElement[]>(BOARD_X);
  for (let i = 0; i < BOARD_X; i++) {
    areaElements[i] = Array(BOARD_Y);
  }

  function clearState() {
    bgColor = 10;
    board = newBoard();
    lastTarget?.classList.remove("emit");
    lastTarget = undefined;
    gameResult = Side.Null;
    if (aiSide == Side.Black) {
      setTimeout(() => {
        go(...ai(board, aiDepth));
      });
    }
  }

  function go(x: number, y: number) {
    if (board.board[x][y] != Side.Null || gameResult != Side.Null) return;
    lastTarget?.classList.remove("emit");
    board.board[x][y] = board.side;
    const result = judge(board.board, x, y);
    if (result == Side.Null) {
      if (board.side == Side.Black) {
        board.side = Side.White;
        bgColor = 90;
      } else {
        board.side = Side.Black;
        bgColor = 10;
      }
    } else {
      gameResult = result;
    }
    lastTarget = areaElements[x][y];
    lastTarget.classList.add("emit");
  }

  export let aiSide: Side;
  export let aiDepth: number;

  function alphago(x: number, y: number) {
    if (
      board.board[x][y] != Side.Null ||
      gameResult != Side.Null ||
      board.side == aiSide
    )
      return;
    go(x, y);
    if (gameResult == Side.Null)
      setTimeout(() => {
        go(...ai(board, aiDepth));
      }, 1000);
  }
  if (aiSide == Side.Black) {
    setTimeout(() => {
      go(...ai(board, aiDepth));
    }, 1000);
  }
</script>

<div transition:fade class="board">
  {#each board.board as row, x}
    {#each row as area, y}
      <div
        class:disabled={area != Side.Null ||
          gameResult != Side.Null ||
          board.side == aiSide}
        class="area"
        bind:this={areaElements[x][y]}
        on:click={() => (aiSide == Side.Null ? go(x, y) : alphago(x, y))}
      >
        {area == Side.Black ? "⚫" : area == Side.White ? "⚪" : ""}
      </div>
    {/each}
  {/each}
</div>

<button
  style={gameResult != Side.Null ? "" : "transform: translateY(-15vh);"}
  id="back"
  on:click={() => dispatch("back")}
  transition:fade
>
  返回
</button>

{#if gameResult != Side.Null}
  <p transition:fade>
    {gameResult == Side.Black
      ? "黑方获胜"
      : gameResult == Side.White
      ? "白方获胜"
      : "平局"}
  </p>
  <br />
  <button on:click={clearState} transition:fade>重新开始</button>
  <br />
{/if}

<style>
  #back {
    margin-top: 23vh;
  }
  :root {
    --border-width: 0.5vmin;
    --border-width-neg: -0.5vmin;
  }
  * {
    transition: all 0.5s;
  }
  p {
    margin: -24vh auto -1vh;
    color: var(--fg-color);
  }
  button {
    margin-top: 2vh;
  }
  .board {
    height: 52vmin;
    width: 52vmin;
    margin: 10vmin auto 0;
    background-color: var(--mid-color);
    border: var(--border-width) solid var(--fg-color);
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(5, 10vmin);
    gap: var(--border-width);
  }
  .area {
    height: 10vmin;
    width: 10vmin;
    margin: var(--border-width-neg);
    cursor: pointer;
    border: var(--border-width) solid var(--fg-color);
    text-align: center;
    line-height: 10vmin;
    font-size: 5vmin;
  }
  .area.disabled {
    cursor: not-allowed;
  }
</style>
