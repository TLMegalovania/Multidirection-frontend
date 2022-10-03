<script lang="ts">
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
  let deg = 90;
</script>

{#if mode == Mode.Menu && outDone}
  <Menu
    on:helper={() => {
      switchout();
      mode = Mode.Help;
    }}
    bind:deg
  />
{:else if mode == Mode.Help && outDone}
  <Help
    on:back={() => {
      switchout();
      mode = Mode.Menu;
    }}
  />
{/if}
