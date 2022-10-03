<script lang="ts">
  let deg = 90;
  let shouldTrans = false;
  let trans: number;
  const transColor = () => {
    shouldTrans = true;
    const _change = () => {
      if (deg == 90) deg = 10;
      else deg = 90;
    };
    _change();
    trans = setInterval(_change, 4500);
  };
  const stopTrans = () => {
    shouldTrans = false;
    clearInterval(trans);
  };
  const rootStyle = document.documentElement.style;

  $: rootStyle.setProperty("--bg-color", `hsl(0,0%,${deg}%)`);
  $: rootStyle.setProperty("--fg-color", `hsl(0,0%,${100 - deg}%)`);
</script>

<!-- <main style:--bg-image='linear-gradient(90deg,#efefef, #101010)'> -->
<h1>多向棋</h1>

<button on:click={shouldTrans ? stopTrans : transColor}>
  {#if shouldTrans}
    取消
  {:else}
    匹配
  {/if}
</button>
<br />
<button>帮助</button>

<style>
  h1 {
    margin: 20vh auto 0;
    line-height: 1em;
  }
  h1 + button {
    margin-top: 30vh;
  }
  button {
    width: 16vw;
    margin-top: 8vh;
  }
</style>
