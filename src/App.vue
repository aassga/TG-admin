<template>
  <div id="app">
        <router-view/>
  </div>
</template>
<script>
  export default {
    watch:{
      $route(to,from){
        // console.log(to.path);gameSort
        if(to.path=='/system/gameManagement/gameSort'||to.path=='/system/gameManagement/electronic'||to.path=='/system/gameManagement/gameBanner'
          |to.path=='/activity/officialCompile/lunboManagement'||to.path=='/activity/officialCompile/logoManagement'){
          document.body.onselectstart = document.body.ondrag = ()=>{ return false }
        }else{
          document.body.onselectstart = document.body.ondrag = ()=>{ return true }
        }
      }
    },
  }
</script>

<style lang="less">
*{list-style: none;}
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
 
  color: #444 !important;
  font-family: "Microsoft YaHei,PingFang SC,Helvetica,Helvetica Neue,Tahoma,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif";
}
#app {

  width: 100%;
  height: 100%;
  color: #444 !important;
  font-family: "Microsoft YaHei,PingFang SC,Helvetica,Helvetica Neue,Tahoma,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
