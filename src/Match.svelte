<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  const globalTranTime = 8000;
  let transId: number;

  export let bgColor: number;
  export let websock: WebSocket | undefined;
  export let websockUrl: string;

  startTrans();
  websock = new WebSocket(websockUrl);
  websock.onclose = (event) => {
    if (event.code != 1000) alert("连接由于意外被关闭。");
    cancel();
  };

  const dispatch = createEventDispatcher();
  onDestroy(() => dispatch("onDestroy"));

  function doTrans() {
    if (bgColor == 10) bgColor = 90;
    else bgColor = 10;
  }
  function startTrans() {
    doTrans();
    transId = setInterval(doTrans, globalTranTime);
  }
  function stopTrans() {
    clearInterval(transId);
    transId = undefined;
  }
  function cancel() {
    stopTrans();
    websock.onclose = null;
    websock.close();
    dispatch("cancel");
  }
</script>

<h2 transition:fade>匹配中...</h2>
<button on:click={cancel} transition:fade>取消</button>

<style>
  h2 {
    margin-top: 30vh;
    color: var(--fg-color);
    font-size: 2.2em;
  }
  button {
    margin-top: 30vh;
  }
</style>
