<template>
  <div :class="{'ib':inline}">
    <FormItem label="游戏类型">
      <Select v-model="game" @on-change="onGameChange"  class="s-95" placeholder="全部"  @on-clear='onClear' :clearable='gameClear'>
        <Option v-for="(game,i) in gameList" @click.native="onGameValue(game)" :value="game.type+':'+i" :key="game.type">{{game.name}}</Option>
      </Select>
    </FormItem>
    <FormItem label="游戏平台" v-if="showPlateform">
      <Select class="w90x" v-model="platform" @on-change="onPlatformChange" v-if="this.gameList[index]" :clearable="clearable" :placeholder="placeholder">
        <Option
          v-for="platform in this.gameList[index].list"
          :value="platform.platform"
          :key="platform.id"
        >{{platform.name}}</Option>
      </Select>
    </FormItem>
  </div>
</template>

<script>
import { getgameClassData } from "@/api/common";
export default {
  props: {
    // 是否显示二游戏平台
    showPlateform: {
      type: Boolean,
      default: true
    },
    // 水平还是垂直排列，默认水平
    inline: {
      type: Boolean,
      default: true
    },
    platforname:{
      type:Object,
      default: () => ({})
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    gameClear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gameList: [],
      index: 0,
      game: '',
      platform: "all"
    };
  },
  created () {

    if(JSON.stringify(this.platforname) != "{}"){
        const {game,platform}=this.platforname
        this.game= game
        this.platform=platform
      
        this.onGameChange(this.game)
    }
    // 游戏表动态处理下拉字段
    // this.init().then(() => {
    //   if(JSON.stringify(this.platforname) !== "{}"){
    //       const {game,platform} = this.platforname
    //       const gameChange = game ? game.split(':') : game
    //       let index = 0
    //       index = this.gameList.findIndex(el => el.type === gameChange[0]) || gameChange[1]
    //       this.game = `${gameChange[0]}:${index}`
    //       this.platform=platform
    //       this.onGameChange(this.game)
    //   }
    // })
  },
  methods: {
    async init() {
      await getgameClassData().then(res => {
        this.gameList = res.data;
      });
      // this.showPlateform ? this.addPlatformAll() : this.addAll()
    },
    addAll () {
      this.game = 'ALL:0'
      this.gameList.unshift({name: '全部', type: 'ALL'})
    },
    addPlatformAll () {
      this.gameList.forEach(el => el.list.unshift({name: '全部', id: 0, platform: 'all'}))
    },
    //切换游戏类型
    onGameChange(game) {
  
      //未选择不知道传什么数据先传空字符串
      const [value, index] = game ? game.split(":") : '';
      // console.log(value,index)
      if (this.showPlateform) this.index = index;
      this.$emit("on-game-change", value);
    },
    onGameValue(val){
    
      this.$emit('on-game-value',val)

    },
    //切换游戏平台
    onPlatformChange(platform) {
      this.$emit("on-platform-change", platform);
    },
    //清空
    onClear() {
      this.$emit('clearData')
    }
  }
};
</script>
<style lang="less" scoped>
</style>


