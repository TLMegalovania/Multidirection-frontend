<script lang="ts">
  import Ai from "./AI.svelte";
  import Game from "./Game.svelte";
  import { Side } from "./global.js";
  import Help from "./Help.svelte";
  import Match from "./Match.svelte";
  import Menu from "./Menu.svelte";

  enum Mode {
    Menu,
    Help,
    Game,
    AI,
    Match,
  }
  let mode = Mode.Menu;
  let outDone = true;
  function setOutToDo() {
    outDone = false;
  }
  function setOutDone() {
    outDone = true;
  }
  let bgColor = 90;

  const rootStyle = document.documentElement.style;

  $: rootStyle.setProperty("--bg-color", `hsl(0,0%,${bgColor}%)`);
  $: rootStyle.setProperty("--fg-color", `hsl(0,0%,${100 - bgColor}%)`);

  let aiSide = Side.Null;
  let aiDepth = 0;

  const _location = window.location;
  const websockUrl = `${_location.protocol == "https:" ? "wss:" : "ws:"}//${
    _location.host
  }/websocket`;
  let websock: WebSocket | undefined;
  let enemySide = Side.Null;
</script>

{#if mode == Mode.Menu && outDone}
  <Menu
    on:helper={() => {
      setOutToDo();
      mode = Mode.Help;
    }}
    on:game={() => {
      setOutToDo();
      mode = Mode.Game;
    }}
    on:ai={() => {
      setOutToDo();
      mode = Mode.AI;
    }}
    on:match={() => {
      setOutToDo();
      mode = Mode.Match;
    }}
    on:onDestroy={setOutDone}
  />
{:else if mode == Mode.Match && outDone}
  <Match
    bind:bgColor
    bind:websock
    {websockUrl}
    on:cancel={() => {
      setOutToDo();
      mode = Mode.Menu;
    }}
    on:onDestroy={setOutDone}
    on:open={(sside) => {
      enemySide = sside.detail == "black" ? Side.White : Side.Black;
      setOutToDo();
      mode = Mode.Game;
    }}
  />
{:else if mode == Mode.AI && outDone}
  <Ai
    bind:aiDepth
    bind:aiSide
    on:game={() => {
      setOutToDo();
      mode = Mode.Game;
    }}
    on:onDestroy={setOutDone}
  />
{:else if mode == Mode.Help && outDone}
  <Help
    on:back={() => {
      setOutToDo();
      mode = Mode.Menu;
    }}
    on:onDestroy={setOutDone}
  />
{:else if mode == Mode.Game && outDone}
  <Game
    bind:bgColor
    on:back={() => {
      setOutToDo();
      mode = Mode.Menu;
      aiSide = Side.Null;
      aiDepth = 0;
      websock?.close();
      websock = null;
    }}
    on:rematch={() => {
      setOutToDo();
      mode = Mode.Match;
      enemySide = Side.Null;
      websock?.close();
      websock = null;
    }}
    on:onDestroy={setOutDone}
    {aiDepth}
    {aiSide}
    {enemySide}
    {websock}
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
