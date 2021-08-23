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
        @click='showGame(item.gid,item.name)'
        v-if="item.show"
        :class="mobileType == item.gid ? 'active' : ''"
        :key='item.id'>
        {{item.name}}
      </div>
      <LotterX v-if="mobileType!='20004'" @getUp="getUp"   @getLoad="loading" :cId="'7'" :typeId="String(mobileType)" ref="lott" :isEdit="isEdit" :dataList="dataList" />
    </Row>
    <Row v-if="mobileType=='20004'">
      <div class="fl f6Color b pl40 pb20 mr40 w480x" :style="isEdit?'opacity:1':'opacity:0'">
        <Row class="h40x gray-font mt40">
          <Icons type="tishi" class="mr5 fl ml0" style="vertical-align:middle" :size='14' color="#888"/>
          可设置侧边栏版式样式
        </Row>
        <Form :label-width='80'>
          <FormItem label="选择版式:">
            <RadioGroup v-model="animal">
            <Radio label="版式A" class="mr80"></Radio>
            <Radio label="版式B"></Radio>
          </RadioGroup>
          </FormItem>
          <FormItem label="版本介绍:" class="mt20">
            <span v-if="animal=='版式A'">版式A，热门作为标签突出显示。</span>
            <span  v-if="animal=='版式B'">版式B，热门单独作为一个分类显示。</span>
          </FormItem>
          <!-- <FormItem class="mt20">
            <Button class="w260x lh50 h50" :loading=load type="primary" @click="submit">保存</Button>
          </FormItem> -->
        </Form>
      </div>
      <div class="fl w400x">
        <img class="w100" v-show="animal== '版式A'" src="../../../../assets/images/cebianlan2.png" />
        <img class="w100" v-show="animal== '版式B'" src="../../../../assets/images/cebianB2.jpg" />
      </div>
    </Row>
  </div>
</template>
<script>
import LotterX from "./lotterX";
import { getUserType } from "@/libs/util";
import Icons from "@/components/icons";
import { Spin } from "view-design";
import {GameSortV4Up} from "@/api/system";
export default {
  name: "MobileX",
  components: {
    Icons,
    LotterX,
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
      animal:'版式A',
      mobileType:20001,
      load:false,
      data:[],
      gameTypeList:[],
      siteGameList:[],
      isLotterSide:false,
      game:[],
      mobile:[
        // {id:'20001',name:'快捷入口',show:true},
        // {id:'20002',name:'首页推荐',show:true},
        // {id:'20003',name:'彩票侧边栏',show:true},
        // {id:'20004',name:'侧边栏版式',show:false},
      ],
    }
  },
  mounted() {
    let _this=this;
    let props = {..._this._props};
    this.data = props.dataList; //获取全部游戏列表
    this.setData();
  },
  methods: {
    getUp(){
      this.$emit("getUp", true);
    },
    setData(){
      this.mobile=this.data.siteData[7].list;
      this.mobile.forEach(t=>{
        if(t.name=='侧边栏版式'){
          this.animal =  t.games[0]&&t.games[0].layout=='B'?'版式B':'版式A'
        }
      })
      this.mobile.forEach(t=>{
        if(t.name == '侧边栏版式') {
          t.show == false;
          t.gid=20004
        }else {
          t.show = true;
          if(t.name == '快捷入口') t.gid = 20001
          if(t.name == '首页推荐') t.gid = 20002
          if(t.name == '彩票侧边栏') t.gid = 20003
        }
      })
      // this.mobileType = this.data.siteData[7].list[0].id
      this.mobileType=this.data.childType||20001;
      if(this.mobileType==20004||this.mobileType==20003) this.mobile[3].show=true
      else this.mobile[3].show=false
    },
    showGame(id,name,subId){
      if(name =='侧边栏版式'||name=='彩票侧边栏' ){
        this.mobile[3].show=true
      }else{
        this.mobile[3].show=false
      }
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
         this.$refs.lott.submit(); //手机端提交事件（非侧边栏）
      
      //  this.$emit("getUp", true);
    },
    submit(){
      let id = '';
      this.data.siteData[7].list.forEach(t=>{
        if(t.name == '侧边栏版式') id = t.id
      })
      let json=[{
        gid:id,
        list:[{"layout":this.animal=='版式A'?'A':'B'}]
      }];
      let data = {
        siteId:this.$root.nowSite.id,
        json:JSON.stringify(json)
      }
      this.load=true;
      GameSortV4Up(data,true).then(res=>{
        if(res&&res.code){
          this.$Message.success('保存成功')
          this.$nextTick(()=>{
             this.$emit("getUp", true);
            this.load = false;
          })
        }else{
           this.load = false;
        }
      }).catch(error=> {
        this.load = false;
      })
    }
  },
};
</script>
<style lang="less" scoped>
.active {
  background: #2d8cf0;
  color:white;
}
/deep/.ivu-form-item-content {
  margin-left:0  !important;
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