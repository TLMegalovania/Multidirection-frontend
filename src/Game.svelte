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
    dispatch("onDestroy");
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

  export let websock: WebSocket;

  function go(x: number, y: number) {
    if (
      board.board[x][y] != Side.Null ||
      gameResult != Side.Null ||
      flee ||
      connectionLost
    )
      return;
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
      websock?.close();
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

  export let enemySide: Side;

  let connectionLost = false;
  let flee = false;

  if (enemySide != Side.Null && websock) {
    websock.onmessage = (ev: MessageEvent<string>) => {
      if (board.side != enemySide) return;
      const [x, y] = ev.data.split(" ").map(Number);
      if (x >= 0 && x < BOARD_X && y >= 0 && y < BOARD_Y) go(x, y);
    };
    websock.onclose = (ev) => {
      setTimeout(() => {
        if (gameResult == Side.Null) {
          if (ev.code == 1000) {
            flee = true;
          } else connectionLost = true;
        }
      }, 500);
    };
  }

  function rematch() {
    dispatch("rematch");
  }
</script>

<div transition:fade class="board">
  {#each board.board as row, x}
    {#each row as area, y}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class:disabled={area != Side.Null ||
          gameResult != Side.Null ||
          board.side == aiSide ||
          board.side == enemySide ||
          flee ||
          connectionLost}
        class="area"
        bind:this={areaElements[x][y]}
        on:click={() => {
          if (board.side != enemySide) {
            aiSide == Side.Null ? go(x, y) : alphago(x, y);
            if (enemySide != Side.Null && websock) {
              websock.send(`${x} ${y}`);
            }
          }
        }}
      >
        {area == Side.Black ? "⚫" : area == Side.White ? "⚪" : ""}
      </div>
    {/each}
  {/each}
</div>

<button
  class={gameResult == Side.Null && !flee && !connectionLost ? "" : "trany"}
  id="back"
  on:click={() => dispatch("back")}
  transition:fade
>
  返回
</button>

{#if gameResult != Side.Null || flee || connectionLost}
  <p transition:fade>
    {gameResult == Side.Black
      ? "黑方获胜"
      : gameResult == Side.White
      ? "白方获胜"
      : flee
      ? "对手逃跑"
      : connectionLost
      ? "与服务器失去连接"
      : "平局"}
  </p>
  <br />
  <button
    on:click={enemySide == Side.Null ? clearState : rematch}
    transition:fade>重新开始</button
  >
  <br />
{/if}

<style>
  #back {
    margin-top: 3em;
  }
  .trany {
    transform: translateY(8em);
  }
  :root {
    --border-width: 0.5vmin;
    --border-width-neg: -0.5vmin;
  }
  * {
    transition-duration: 0.5s;
  }
  p {
    margin: -3em auto 0;
    color: var(--fg-color);
  }
  button {
    margin-top: 1em;
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
    color: black;
  }
  @media screen and (max-width: 1000px) {
    #back {
      margin-top: 4em;
    }
    :root {
      --border-width: 0.5vw;
      --border-width-neg: -0.5vw;
    }
    p {
      margin-top: -4em;
    }
    button {
      margin-top: 2em;
    }
    .trany {
      transform: translateY(7em);
    }
    .board {
      height: 96vw;
      width: 96vw;
      margin-top: 3vw;
      grid-template-rows: repeat(5, 18.8vw);
    }
    .area {
      height: 18.8vw;
      width: 18.8vw;
      line-height: 18.8vw;
      font-size: 10vw;
    }
  }
  .area.disabled {
    cursor: not-allowed;
  }
</style>
