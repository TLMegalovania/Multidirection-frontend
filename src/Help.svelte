<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();
</script>

<p transition:fade>
  多向棋的规则与井字棋基本类似，但胜负条件不同。<br />
  为了获得胜利，必须在一步棋内在至少两个方向上将己方棋子连成一条直线。<br />
  若只能在一个方向上将己方棋子连成一条直线，则己方立即失败。
</p>
<button on:click={() => dispatch("back")} transition:fade> 返回 </button>

<style>
  p {
    margin-top: 30vh;
    margin-bottom: 30vh;
    font-size: large;
    color: var(--fg-color);
  }
</style>
