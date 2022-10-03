<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  const dispatch = createEventDispatcher();

  export let deg = 90;
  let shouldTrans = false;
  let trans: number;
  const transColor = () => {
    shouldTrans = true;
    const _change = () => {
      if (deg == 90) deg = 10;
      else deg = 90;
    };
    _change();
    trans = setInterval(_change, 8000);
  };
  const stopTrans = () => {
    shouldTrans = false;
    clearInterval(trans);
  };
  const rootStyle = document.documentElement.style;

  $: rootStyle.setProperty("--bg-color", `hsl(0,0%,${deg}%)`);
  $: rootStyle.setProperty("--fg-color", `hsl(0,0%,${100 - deg}%)`);
</script>

<h1 transition:fade>多向棋</h1>

<button
  on:click={shouldTrans ? stopTrans : transColor}
  style={shouldTrans ? "transform: translateY(3em);" : ""}
  transition:fade
>
  {#if shouldTrans}
    取消
  {:else}
    匹配
  {/if}
</button>
{#if !shouldTrans}
  <br />
  <button on:click={() => dispatch("helper")} transition:fade>帮助</button>
{/if}

<style>
  h1 {
    margin: 20vh auto 0;
    line-height: 1em;
    color: var(--fg-color, hsl(0, 0%, 10%));
  }
  h1 + button {
    margin-top: 30vh;
  }
  button {
    margin-top: 8vh;
  }
</style>
