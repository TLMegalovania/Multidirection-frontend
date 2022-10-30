<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  const dispatch = createEventDispatcher();
  onDestroy(() => dispatch("onDestroy"));
</script>

<h1 transition:fade>多向棋</h1>

<button on:click={() => dispatch("game")} transition:fade>本地对战</button>
<br />
<button on:click={() => dispatch("match")} transition:fade>在线匹配</button>
<br />
<button on:click={() => dispatch("ai")} transition:fade>电脑对战</button>
<br />
<button on:click={() => dispatch("helper")} transition:fade>帮助</button>

<style>
  h1 {
    margin: 20vh auto 0;
    line-height: 1em;
    font-size: 3em;
    color: var(--fg-color);
  }
  h1 + button {
    margin-top: 20vh;
  }
  button {
    margin-top: 7vh;
  }

  @media screen and (max-width: 1000px) {
    h1 {
      margin-top: 2em;
    }
    h1 + button {
      margin-top: 6em;
    }
  }
</style>
