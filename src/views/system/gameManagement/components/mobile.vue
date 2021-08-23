<template>
  <div ref="mobile">
    <Row>
      <div>
        <span class="gameHeader ft16">
          {{typeId=="10010"?'手机端标签':''}}
        </span>
      </div>
      <div
        class="btn cs"
        v-for="item in mobile"
        @click='showGame(item.id)'
        :class="mobileType == item.id ? 'active' : ''"
        :key='item.id'>
        {{item.name}}
      </div>
      <Lotter  @getLoad="loading" :typeId="mobileType" ref="lott" :isEdit="isEdit" :dataList="dataList" />
    </Row>
  </div>
</template>
<script>
import Lotter from "./lotter";
// import LotterSide from "./lotterSide";
import { getUserType } from "@/libs/util";
import Modals from "@/components/modals";
import Icons from "@/components/icons";
import draggable from "vuedraggable";
import { Spin } from "view-design";
import { systemSiteGameUp, systemSiteGameList ,gameSortLotterySelect} from "@/api/system";
export default {
  name: "Mobile",
  components: {
    draggable,
    Icons,
    Lotter,
    Modals,
    // LotterSide
  },
  props:{
    typeId: {
      type: String,
      required:true
    },
    isEdit: {
      type: Boolean,
      required:true
    },
    dataList:{
      type: Object,
      required:true,
    }
  },
  data() {
    return {
      spinShow:true,
      mobileType:'20001',
      gameTypeList:[],
      siteGameList:[],
      isLotterSide:false,
      game:[],
      mobile:[
        {id:'20001',name:'手机快捷入口'},
        {id:'20002',name:'首页推荐'},
        {id:'10000',name:'彩票分类'},
        {id:'20003',name:'彩票侧边栏'},
        {id:'10011',name:'快3侧边栏'},
      ],
    }
  },
  methods: {
    showGame(id){
      if(this.mobileType == id){ //防止二次点击
        return
      }else{
        this.$emit('childType',id)
        this.mobileType = id;
      }
    },
    loading(){
      this.$emit('getLoad',false)
    },
    upDate(){
      if(this.mobileType=='20003') { //彩票侧边栏提交事件
        this.$refs.lott.getUp()
      }else{
        this.$refs.lott.submit(); //手机端提交事件（非侧边栏）
      }
    }
  },
};
</script>
<style lang="less" scoped>
.active {
  background: #2d8cf0;
  color:white;
}
.h36 {
  height: 36px !important;
  font-size: 14px;
  line-height: 36px;
}
.btn {
  width:135px;
  height: 36px;
  display: inline-block;
  margin: 0 20px 20px 0;
  text-align: center;
  line-height: 36px;
  border-radius: 5px;
  border:1px solid #dcdee2;
}
.gameHeader {
  line-height: 60px;
  color:#2d8cf0;
}
</style>