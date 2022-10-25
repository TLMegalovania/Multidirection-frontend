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
  websock.onclose = () => {
    failed = true;
    outdone = false;
    stopTrans();
  };
  websock.onmessage = (ev: MessageEvent<string>) => {
    stopTrans();
    websock.onclose = null;
    dispatch("open", ev.data);
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

  let failed = false;
  let outdone = true;
</script>

{#if outdone}
  {#if failed}
    <h2 transition:fade>连接由于意外被关闭。</h2>
  {:else}
    <h2 transition:fade on:outroend={() => (outdone = true)}>匹配中...</h2>
  {/if}
{/if}

<button on:click={cancel} transition:fade>
  {#if failed}
    确定
  {:else}
    取消
  {/if}
</button>

<style>
  h2 {
    margin-top: 30vh;
    color: var(--fg-color);
    font-size: 2.2em;
  }
  button {
    position: fixed;
    bottom: 20vh;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  }
</style>
