<script lang="ts">
  import Game from "./Game.svelte";
  import Help from "./Help.svelte";
  import Menu from "./Menu.svelte";

  enum Mode {
    Menu,
    Help,
    Game,
  }
  let mode = Mode.Menu;
  let outDone = true;
  function switchout() {
    outDone = false;
    setTimeout(() => (outDone = true), 500);
  }
  let bgColor = 90;

  const rootStyle = document.documentElement.style;

  $: rootStyle.setProperty("--bg-color", `hsl(0,0%,${bgColor}%)`);
  $: rootStyle.setProperty("--fg-color", `hsl(0,0%,${100 - bgColor}%)`);
</script>

{#if mode == Mode.Menu && outDone}
  <Menu
    on:helper={() => {
      switchout();
      mode = Mode.Help;
    }}
    on:game={() => {
      switchout();
      mode = Mode.Game;
    }}
    bind:bgColor
  />
{:else if mode == Mode.Help && outDone}
  <Help
    on:back={() => {
      switchout();
      mode = Mode.Menu;
    }}
  />
{:else if mode == Mode.Game && outDone}
  <Game
    bind:bgColor
    on:back={() => {
      switchout();
      mode = Mode.Menu;
    }}
  />
{:else if outDone}
  <h1>Error Page</h1>
{/if}

<style>
  h1 {
    margin-top: 45vh;
    font-size: xx-large;
    color: var(--fg-color);
  }
</style>
