<script lang="ts">
  let deg = 0
  let shouldRotate = false
  const refresh = (time:number)=>{
    if(shouldRotate) deg+=1;
    window.requestAnimationFrame(refresh)
  }
  window.requestAnimationFrame(refresh)
  $:document.documentElement.style.setProperty('--bg-image',`linear-gradient(${deg}deg,#efefef, #101010)`)
</script>
<!-- <main style:--bg-image='linear-gradient(90deg,#efefef, #101010)'> -->
<h1>
多向棋
</h1>

<button on:click="{()=>shouldRotate=!shouldRotate}">匹配</button>
<br>
<button>帮助</button>
<svelte:body style="--bg-image:linear-gradient(#efefef, #101010)" />

<style>
  h1{
    margin: 20vh auto 0;
    line-height: 1em;
  }
  h1+button{
    margin-top: 30vh;
  }
  button{
    width: 16vw;
    margin-top: 8vh;
  }
</style>