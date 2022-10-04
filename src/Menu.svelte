<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  const dispatch = createEventDispatcher();

  export let bgColor: number;
  let shouldTrans = false;
  let trans: number;
  const transColor = () => {
    shouldTrans = true;
    const _change = () => {
      if (bgColor == 90) bgColor = 10;
      else bgColor = 90;
    };
    _change();
    trans = setInterval(_change, 8000);
  };
  const stopTrans = () => {
    //shouldTrans = false;
    clearInterval(trans);
    dispatch("game");
  };

  let outDone = false;
</script>

{#if !shouldTrans}
  <h1 transition:fade on:outroend={() => (outDone = true)}>多向棋</h1>
{:else if outDone}
  <p transition:fade>由于无服务器，该游戏目前仅支持本地对战。</p>
{/if}

<button
  on:click={shouldTrans ? stopTrans : transColor}
  style={shouldTrans ? "transform: translateY(3em);" : ""}
  transition:fade
  class="fir-but"
>
  {#if shouldTrans}
    确定
  {:else}
    开始
  {/if}
</button>
{#if !shouldTrans}
  <br />
  <button on:click={() => dispatch("helper")} transition:fade class="sec-but"
    >帮助</button
  >
{/if}

<style>
  h1,
  p {
    margin: 20vh auto 0;
    line-height: 1em;
    font-size: 3em;
    color: var(--fg-color);
  }
  p {
    font-size: 2em;
  }
  .fir-but {
    top: 50vh;
  }
  .sec-but {
    top: 65vh;
  }
  button {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
  }
</style>
