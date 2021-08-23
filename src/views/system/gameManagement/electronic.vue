<template>
  <div class="v2-search">
    <Row>
      <Row v-if='spinShow' style="height:100px">
        <Spin size="large" fix v-if="spinShow">
          <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
            <div v-for="t in 8" :key="'div'+t"></div>
          </div>
        </Spin>
      </Row>
      <span class="fl tagbox" style="line-height:50px" v-if='!spinShow'>
				<Tag class="pl20 pr20 ib ft14 w135x cs tag"
          v-for="(item,i) in btnList"
          :key='i'
          @click.native="getCurrentList(item.id)"
          :class="type == item.id ? 'active' : ''">
          {{item.name}}
        </Tag>
      </span>
      <div class="fr" style="margin-top:6px" v-if='!spinShow'>
        <Button v-if="!isEdit" type="primary" style="height:36px" :loading='saveLoading' @click="()=>isEdit=true">编辑</Button>
        <Button v-if="isEdit" class="mr20" style="height:36px" :loading="loading1" @click="chanel(type)">取消</Button>
        <Button v-if="isEdit" type="primary" style="height:36px" :loading="loading1" @click.native="updateDate(type)">保存</Button>
      </div>
    </Row>
    <Row v-if="Object.keys(siteGameList).length>0">
      <Lotter v-if="type=='30001'||type=='10003'||type=='10002'"
        ref="lotter"
        :typeId="type"
        @getLoad="loading"
        :dataList='siteGameList' :isEdit="isEdit" />
      <Electronic ref="electronic" v-show="type=='10001'||type=='10004'||type=='10005'"
        :typeId="type"
        @getLoad="loading"
        :isEdit="isEdit" :dataList='siteGameList'/>
      <Mobile ref='mobile' @getLoad="loading"  @childType="getChildType" v-if="type=='10010'" :typeId="type" :isEdit="isEdit" :dataList="siteGameList" />
    </Row>
  </div>
</template>
<script>
import Lotter from "./components/lotter";
import Electronic from "./components/electronic";
import Mobile from "./components/mobile";
import { getUserType } from "@/libs/util";
import { Spin } from "view-design";
import { systemSiteGameUp, systemSiteGameList ,gameSortLotterySelect} from "@/api/system";
export default {
  name: "electronic",
  components: {
    Lotter,
    Electronic,
    Mobile
  },
  data(){
    return {
      type:'30001',
      btnList:[
        {id:'30001', name: '全部彩票'},
        {id:'10003', name: '真人视讯'},
        {id:'10004', name: '棋牌游戏'},
        {id:'10001', name: '电子游艺'},
        {id:'10005', name: '捕鱼游戏'},
        {id:'10002', name: '体育赛事'},
        {id:'10010', name: '手机端'},
      ],
      isEdit:false,
      currentList:[],//当前列表数据
      siteGameList:[],
      spinShow:true,
      saveLoading: true,
      loading1: false,
    }
  },
  created() {
    this.$nextTick(()=>{
      this.getData();
    });
  },
  methods:{
    getChildType(type){
      this.isEdit = false;
      this.childType = type;
    },
    updateDate(type){
      this.loading1 = true;
      if(type=='10001'||type=='10004'||type=='10005')  { //电子 捕鱼 棋牌
        this.$refs.electronic.updateDate()
      }else if(type=='10010'){   //手机端
        this.$refs.mobile.upDate();
      }else {
        this.$refs.lotter.submit();
      }
    },
    chanel(type){
      this.loading1 = true;
      if(type=='10001'||type=='10004'||type=='10005')  { //电子 捕鱼 棋牌
        this.$refs.electronic.quxiao()
      }else if(type=='10010'){   //手机端
        this.getData();
      }else {
        this.getData();
      }
    },
    loading(val){
      this.loading1 = false;
      this.spinShow = false;
      this.isEdit = false;
    },
    getCurrentList(id){
      if(this.type == id){ //防止二次点击
        return
      }else{
        this.isEdit = false;
        this.type = id;
        this.currentList = this.siteGameList[id]||[];
      }
    },
    getData() {
      this.siteGameList = [];
      const data = { siteId: this.$root.nowSite.id };
      systemSiteGameList(data).then(res=>{
        let k3Game = [];
        if(res.code == 200) {
          this.siteGameList = res.data.siteGameList;
          this.siteGameList["10000"]["0"].list.forEach(i => {
            if(i.id == '10011'){
              k3Game.push(i)
            }
          });
          this.siteGameList["10011"] = k3Game;
          this.spinShow = false;
          this.saveLoading = false;
          this.isEdit = false;
        };
      }).catch(error=>{
        this.spinShow = false;
      })
    },
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
.fc {
  color: #2d8cf0;
  font-size: 16px;
}
.active {
  background: white !important;
  box-sizing: border-box;
  border-top: 3px solid #2d8cf0;
  line-height: 33px !important;
  /deep/.ivu-tag-text{
    color:#2d8cf0 !important;
  }
}
@icon-close-border: #cecece;
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  width: 20px;
  border-radius: 10px;
  background: #2d8cf0;
}
.hotActive {
  background: #2d8cf0;
  color: white;
  .close {
    color: white;
  }
  .bianji {
    color: white;
  }
}
.tag {
  height:36px;
  line-height:36px;
  margin-right:0;
  border-left:0;
}
.tag{
  &:nth-child(1){
    border-left:1px solid #dcdcdc;
  }
}
// .ivu-btn-default{
//   color:#666666 !important;
//   border:#dcdcdc;
//   background-color:white !important;
// }
</style>