<script lang="ts">
  import { Side } from "./global.js";
  import { createEventDispatcher, onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();
  onDestroy(() => dispatch("onDestroy"));

  let panel = 0;
  export let aiSide: Side;
  export let aiDepth: number;

  function chooseSide(side: Side) {
    aiSide = side;
    panel = 1;
  }

  function chooseDepth(depth: number) {
    aiDepth = depth;
    dispatch("game");
  }

  let outDone = false;
</script>

{#if panel == 0}
  <div transition:fade on:outroend={() => (outDone = true)}>
    <p>电脑执</p>
    <button on:click={() => chooseSide(Side.Black)}>黑棋</button>
    <br />
    <button on:click={() => chooseSide(Side.White)}>白棋</button>
  </div>
{:else if outDone}
  <div transition:fade>
    <p>难度</p>
    <button on:click={() => chooseDepth(2)}>简单</button>
    <br />
    <button on:click={() => chooseDepth(4)}>普通</button>
    <br />
    <button on:click={() => chooseDepth(6)}>困难</button>
  </div>
{/if}

<style>
  p {
    margin: 20vh auto 0;
    line-height: 1em;
    font-size: 3em;
    color: var(--fg-color);
  }
  p + button {
    margin-top: 26vh;
  }
  button {
    margin-top: 12vh;
  }
</style>
