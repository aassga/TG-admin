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
          @click.native="getCurrentList(item.id,item.cid)"
          :class="type == item.id ? 'active' : ''">
          {{item.name}}
        </Tag>
      </span>
      <div class="fr" style="margin-top:6px" v-if="!spinShow">
        <Button v-if="((adminType == 'super') || (authInPage.indexOf('SynchronousGameSortV4Data') != -1))&&!isEdit" type="primary" class="mr20" style="height:36px" :loading='saveLoading' @click="showSync">同步站点</Button>
        <Button v-if="!isEdit" type="primary" style="height:36px" :loading='saveLoading' @click="()=>isEdit=true">编辑</Button>
        <Button v-if="isEdit" class="mr20" style="height:36px" :loading="loading1" @click="chanel(type)">取消</Button>
        <Button v-if="isEdit" type="primary" style="height:36px"  :loading="loading1" @click.native="updateDate(type)">保存</Button>
      </div>
    </Row>
    <Row v-if="Object.keys(siteGameList).length>0">
      <LotterX v-if="type=='10000'||type=='10003'||type=='10002'"
        ref="lotter"
        :typeId="type"
        :cId="cid"
        @getLoad="loading"
        @getUp="getUp"
        :dataList='siteGameList' :isEdit="isEdit" />
      <ElectronicX ref="electronic" v-show="type=='10001'||type=='10004'||type=='10005'"
        :cId="cid"
        :typeId="type"
        @getLoad="loading"
        :isEdit="isEdit" :dataList='siteGameList'/>
      <MobileX ref='mobile' @getLoad="loading" @getUp="getUp"  @childType="getChildType" v-if="type=='10010'" :typeId="type" :isEdit="isEdit" :dataList="siteGameList" />
    </Row>
    <Modals ref="sync" title="同步站点" :width="1200" height='750' @closeModal='closeModal'>
        <div slot="content">
          <div class="scroll">
            <div class="m20">
            <div class="mb20">
              <span class="ft16 mr20 color">请选择同步内容</span>
              <Checkbox class="checkbox ft16 pl10" v-model="checkAll" @on-change='selectAll' :disabled='AllcheckAll'>全选</Checkbox>
              <Checkbox class="checkbox ft16 pl10 mr10" v-model="AllcheckAll" :disabled='checkAll'>站点启用停用全部游戏</Checkbox>
              <Poptip trigger="hover" width='500' transfer>
                  <div slot="content" >
                    <p style="white-space: normal;">1.同步内容各分类默认功能：把启用状态下分类和游戏同步到目标站点，并按照本站游戏顺序进行排序，但目标站点的游戏状态不会受本站点影响。</p>
                    <p class="mt10" style="white-space: normal;">使用场景：建议对已在运营的站点进行同步时使用此功能，不会影响运营站游戏的状态。</p>
                    <p class="mt10" style="white-space: normal;">2.站点启用停用全部游戏同步功能：勾选后，本站点所有游戏（包含启用停用游戏）及游戏状态都会一模一样复制到目标站点，并按照本站游戏顺序进行排序。</p>
                    <p class="mt10">使用场景：建议创建新站时使用。</p>
                  </div>
                  <Icons type="bangzhutishi" color="#E4E4E4" :size="26" class="ml0 mr8"/>
              </Poptip>
            </div>
            <div v-if='!AllcheckAll'>
              <Ul class="NavUl h42">
                <li class="Nav ft14 fl h42 lh42 b cs txt-a "   @click='setNav(t)' :class="navId==t.id?'actNav':''" v-for='(t,i) in data' :key='t.id'>
                  {{t.name}}
                </li>
              </Ul>
              <Ul class="NavUl h42 mt20">
                <li class="Nav ft14 fl h42 lh42 b cs txt-a mb0" v-show='t.id==navId' v-for='t in data' :key='t.id'>
                  <Checkbox v-model="t.checked" :key='t.id+Math.random(1,100000)' @on-change='allType($event,t)'>全选</Checkbox>
                </li>
              </Ul>
              <div  class="mt20" v-if='navId==4||navId==7'>
                <Ul class="contentUl mt20">
                  <li class="Nav ft14 fl h42 lh42 b txt-a mr20" v-for='item in actList' :key='item.id'>
                    <Checkbox v-model="item.checked" :disabled="item.name=='侧边栏版式'&&actList[2].checked&&navId==7" :key='item.id+Math.random(1,100000)' @on-change='checkedOne($event,item)'>{{item.name}}</Checkbox></li>
                </Ul>
              </div>
              <div v-if='navId==1||navId==2||navId==3' class="mt20">
                <div class="lh42 h42 ft14">{{navId==1?'棋牌游戏标签':navId==2?'电子游艺标签':'捕鱼游戏标签'}}</div>
                <Ul class="contentUl">
                  <li class="Nav ft14 fl h42 lh42 b txt-a mr20" v-for='item in bqList' :key='item.id'>
                    <Checkbox v-model="item.checked" :key='item.id+Math.random(1,100000)' @on-change='checkedOne'>{{item.name}}</Checkbox></li>
                </Ul>
                <div class="lh42 h42 ft14 ">{{navId==1?'棋牌游戏平台':navId==2?'电子游艺平台':'捕鱼游戏平台'}}</div>
                <Ul class="contentUl">
                  <li class="Nav ft14 fl h42 lh42 b txt-a mr20" v-for='item in ptList' :key='item.id'>
                    <Checkbox v-model="item.checked" :key='item.id+Math.random(1,100000)' @on-change='checkedOne'>{{item.name}}</Checkbox></li>
                </Ul>
              </div>
              <div class="txt-a w100 h20 ft14" style="color:red;"><span v-show="nocontent">请选择同步内容</span></div>
            </div>
            <div class="mb20"><span class="ft16 mr20 color">请选择同步站点</span><Checkbox class="checkbox ft16 pl10" v-model="AllSite" @on-change='changeAllSite'>全选</Checkbox></div>
            <Ul class="contentUl">
              <li style="width:210px" class="Nav ft14 fl h42 lh42 b txt-a mr20" v-for='item in accessSite.filter(m=>m.id!=siteId)' :key='item.id'>
                <Checkbox v-model="item.checked" @on-change='checkedOneSite' :key='item.id+Math.random(1,100000)'>{{item.siteName}}</Checkbox></li>
            </Ul>
            <div class="w100 mt10 txt-a">
              <div class="txt-a w100 h20 ft14" style="color:red;"><span v-show="noSite">请选择同步站点</span></div>
              <Button type="primary" :loading='syncload' class="ivu-btn submit h50" @click="syncSubmit">确认同步</Button>
            </div>
          </div>
          </div>
          
        </div>
    </Modals>
  </div>
</template>
<script>
import LotterX from "./components/lotterX";
import ElectronicX from "./components/electronicX";
import MobileX from "./components/mobileX";
import Icons from "@/components/icons";
import { getUserType } from "@/libs/util";
import { Spin } from "view-design";
import Modals from '_c/modals';
import { mapState } from 'vuex';
import { systemSiteGameUp, systemSiteGameList ,GameSortV4List,SynchronousGameSortV4Data} from "@/api/system";
export default {
  name: "electronic",
  components: {
    LotterX,
    ElectronicX,
    MobileX,
    Modals,
    Icons
  },
  computed:{
        ...mapState({
        accessSite: state => state.user.accessSite,
    }),
  },
  data(){
    return {
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      type:'10000',
      cid:'4',
      siteId:this.$root.nowSite.id,
      btnList:[
        {id:'10000', name: '全部彩票',cid:'4'},
        {id:'10001', name: '电子游艺',cid:'2'},
        {id:'10002', name: '体育赛事',cid:'6'},
        {id:'10003', name: '真人视讯',cid:'5'},
        {id:'10004', name: '棋牌游戏',cid:'1'},
        {id:'10005', name: '捕鱼游戏',cid:'3'},
        {id:'10010', name: '手机端',cid:'7'},
      ],
      syncList:[
        {name:'彩票'},
        {name:'电子游艺'},
        {name:'体育赛事'},
        {name:'真人视讯'},
        {name:'棋牌游戏'},
        {name:'捕鱼游戏'},
        {name:'手机端'},
      ],
      isEdit:false,
      currentList:[],//当前列表数据
      siteGameList:{},
      spinShow:true,
      saveLoading: true,
      loading1: false,
      childType:20001,
      data:[],
      checkAll:false,
      AllcheckAll:false,
      AllSite:false,
      navId:4,
      actList:[],
      bqList:[],//标签列表
      btList:[],//平台list
      syncload:false,
      nocontent:false,
      noSite:false,
      copyData:[]
    }
  },
  created() {
    this.$nextTick(()=>{
      this.getData();
    });
  },
  methods:{
    textSite(){
      let toSiteIds =[];
        this.accessSite.forEach(t=>{
          if(t.checked) {
            toSiteIds.push(t.id)
          }
      })
      if(!toSiteIds.length)  this.noSite = true
      else this.noSite=false;
    },
    textContent(){
      let gId =[];
        if(!this.checkAll){
          this.data.forEach(item=>{
          if(item.id ==4||item.id==7){
            item.list.forEach(t=>{
              if(t.checked)  gId.push(t.id)
            })
          }else if(item.id==1||item.id==2||item.id==3){
            item.list.forEach(t=>{
              // if(t.checked) gId.push(t.id);
              t.list.forEach(m=>{
                if(m.checked) gId.push(m.id)
              })
            })
          }else{
            item.games.forEach(t=>{
              if(t.checked) gId.push(t.id)
            })
          }
        })
        }else{
          gId.push(0)
        }
        if(!gId.length)  this.nocontent = true
        else this.nocontent=false;
    },
    textAll(){
      this.checkAll=this.data.every(t=>{return t.checked==true});
    },
    selectAll(val){
      this.data.forEach(item=>{
          item.checked=val
          if(item.id==4||item.id==7){
            item.list.forEach(t=>{
              t.checked =val;
            })
          }else if(item.id == 1||item.id==2||item.id==3){
            item.list.forEach(t=>{
              t.list.forEach(m=>{
                m.checked =val;
              })
            })
          }else{
            item.games.forEach(t=>{
               t.checked =val;
            })
          }
        })
      this.textContent();
    },
    setNav(data){
      this.navId=data.id;
      if(this.navId!=5&&this.navId!=6){
        if(this.navId==4||this.navId==7){ //彩票 手机
          this.actList=data.list;
        }else{ //捕鱼 棋牌 电子
          this.bqList = data.list[0].list;
          this.ptList = data.list[1].list;
        }
      }else{
        this.actList=data.games; //真人 体育
      }
      this.textCheck(this.navId)
    },
    textCheck(id){
      if(id==4||id==7||id==6||id == 5){ //彩票 手机 真人 体育
        if(this.actList.every(t=>{return t.checked==true})&&this.actList.length) {
          this.data.forEach(t=>{
            if(t.id==id) t.checked = true
          })
        }
      }else { //捕鱼棋牌 电子
        if(this.ptList.every(t=>{return t.checked==true})&&this.bqList.every(t=>{return t.checked==true})) {
             this.data.forEach(t=>{
            if(t.id==id) t.checked = true
          })
        }
      }
    },
    checkedOne(val,item){
      if(!val) {
        this.data.forEach(t=>{
          if(t.id==this.navId) t.checked=false;
        })
      }
      if(this.navId==4||this.navId==7){
        if(this.navId==7&&item.name=='彩票侧边栏'){
        this.actList.forEach(t=>{
          if(t.name=='侧边栏版式'){
            t.checked = val
          }
        })
      }
        this.data.forEach(t=>{
          if(t.id==this.navId) t.list = this.actList;
        })
      }else if(this.navId==1||this.navId==2||this.navId==3){
        this.data.forEach(t=>{
          if(t.id==this.navId) {
            t.list[0].list = this.bqList;
            t.list[1].list = this.ptList;
          }
        })
      }else{
        this.data.forEach(t=>{
          if(t.id==this.navId) t.games = this.actList;
        })
      }
      if(!val){
        this.checkAll=false;
      }else{
        this.textCheck(this.navId)
      } 
      this.textContent()
      this.textAll()
    },
    checkedOneSite(val){
      if(!val){
        this.AllSite = false;
      }else{
        if(this.accessSite.filter(t=>t.id!=this.$root.nowSite.id).every(m=>{return m.checked == true})) this.AllSite =true;
        else this.AllSite = false;
      }
       this.textSite()
    },
    changeAllSite(val){
      this.accessSite.forEach(t=>{
          t.checked =val?true:false
      })
      this.textSite()
    },
    allType(val){
      if(!val) this.checkAll = false
      if(this.navId==1||this.navId==2||this.navId==3 ){ //捕鱼 棋牌 电子
        this.data.forEach(t=>{
          if(t.id==this.navId){
            t.list.forEach(m=>{
              m.list.forEach(k=>{
                k.checked =val;
              })
            })
            if(val){this.bqList =t.list[0].list;
                    this.ptList =t.list[1].list
            }else{
              t.list[0].list=this.bqList;
              t.list[1].list=this.ptList 
            }
          }
        })
        
      }else if(this.navId==4||this.navId==7){
        this.data.forEach(t=>{
          if(t.id==this.navId){
            t.list.forEach(m=>{
               m.checked =val;
               console.log(m)
            })
            if(val) this.actList =t.list;
            else t.list=this.actList
          }
        })
      }else{
        this.data.forEach(t=>{
          if(t.id==this.navId){
            t.games.forEach(m=>{
               m.checked =val;
            })
            if(val) this.actList =t.games
            else t.games =this.actList
          }
        })
      }
       this.textContent()
       this.textAll()
       this.$forceUpdate()
    },
    closeModal(){
      this.navId =4;
      this.accessSite.forEach(t=>t.checked = false);
      this.data =JSON.parse(JSON.stringify(this.copyData))
        this.AllSite = false;
        this.checkAll = false;
        this.AllcheckAll = false;
        this.actList = this.data[0].list;
        this.nocontent = false;
        this.noSite = false;
        this.$forceUpdate();
    },
    showSync(){this.$refs.sync.show() },
    syncSubmit(){
      let gId =[];
      let toSiteIds =[];
        this.accessSite.forEach(t=>{
          if(t.checked) {
            toSiteIds.push(t.id)
          }
        })
        if(!this.checkAll&&!this.AllcheckAll){
          this.data.forEach(item=>{
          if(item.id ==4||item.id==7){
            item.list.forEach(t=>{
              if(t.checked&&t.name!='彩票侧边栏')  gId.push(t.id)
              if(t.checked&&t.name=='彩票侧边栏') {
                t.list.forEach(m=>{
                  gId.push(m.id)
                })
              }
            })
          }else if(item.id==1||item.id==2||item.id==3){
            item.list.forEach(t=>{
              t.list.forEach(m=>{
                if(m.checked){
                 if(item.id==3) gId.push(m.id);
                 if(item.id==1) {
                   m.list.forEach(w=>{
                     gId.push(w.id);
                   })
                 }
                 if(item.id==2){
                   m.list.forEach(w=>{
                     w.list.forEach(p=>{
                       gId.push(p.id)
                     })
                   })
                 }
                } 
              })
            })
          }else{
            if(item.checked){
              gId.push(item.id)
            }
          }
        })
        }else{gId.push(0) }
        let data = {
          fromSiteIds:this.$root.nowSite.id,
          toSiteIds:toSiteIds.toString(),
          gIds:gId.toString(),
          all:this.AllcheckAll?'yes':'no'
        }
        if(!gId.length) {
          this.nocontent = true
        }else{ this.nocontent=false}
        if(!toSiteIds.length) {
          this.noSite = true
        }else{ this.noSite=false}
        if(this.nocontent||this.noSite) return
        this.syncload = true
        SynchronousGameSortV4Data(data,true).then(res=>{
          if(res&&res.code==200){
            this.$Message.success('数据同步成功')
            this.$refs.sync.hide();
            this.closeModal()
            this.syncload=false
          }else{
            this.syncload = false
          }
        }).catch(error=>this.syncload=false)
    },
    getChildType(type){
      this.isEdit = false;
      this.childType = type;
    },
    updateDate(type){
      this.loading1 = true;
      if(type=='10001'||type=='10004'||type=='10005')  { //电子 捕鱼 棋牌
        this.$refs.electronic.updateDate()
      }else if(type=='10010'){   //手机端
        if(this.childType==20004) {
          this.$refs.mobile.submit();
        }
        else this.$refs.mobile.upDate();
      }else {
        this.$refs.lotter.submit();
      }
    },
    chanel(type){
      this.loading1 = true;
      this.getData();
    },
    loading(val){
      this.loading1 = false;
      this.spinShow = false;
      this.isEdit = false;
    },
    //获取导航栏的id
    getCurrentList(id,cid){
      if(this.type == id){ //防止二次点击
        return
      }else{
        this.isEdit = false;
        this.type = id;
        this.cid = cid;
      }
    },
    getUp(){
      this.spinShow=true;
      this.getData()
    },
    getData() {
      this.siteGameList = {};
      GameSortV4List({siteId:this.$root.nowSite.id}).then(res=>{
        if(res&&res.code==200){
          for(let key in res.data.allGames){
            res.data.allGames[key].list.forEach(t => {
              t.list.forEach(m=>{
                m.hot=0;
                m.lock=0;
                m.slock=0;
              })
            });
          }
          this.siteGameList = res.data;
          for(let key in this.siteGameList.allGames){
             this.siteGameList.allGames[key].isgame = 0;
             this.siteGameList.allGames[key].list.forEach(t=>{
               t.isgame = 0;
              t.list.forEach(m=>{
                m.isgame =1;
              })
             })
          }
          this.spinShow = false;
          this.saveLoading = false;
          this.isEdit = false;
          this.loading1 = false;
          this.siteGameList.childType = this.childType
          //sync
          this.data=[];
               for(let key in res.data.siteData){
                 this.data.push(res.data.siteData[key])
               }
                this.data[0].sort=5;
                this.data[3].sort=1;
                this.data[1].sort=2;
                this.data[5].sort=3;
                this.data[4].sort=4;
                this.data[2].sort=6;
                this.data[6].sort=7;


               this.data.sort((a,b)=>{
                  return a.sort-b.sort
                })
                this.copyData =JSON.parse(JSON.stringify(this.data))
                this.actList = this.data[0].list
        }else{
          this.spinShow = false;
        }
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
  font-weight: bold;
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
ul {
  overflow: hidden;
}
li {
  margin-bottom:20px ;
  position: relative;
}
.Nav {
    width:140px;
    position: relative;
  };
  .actNav {
    background: #2d8cf0;
    color:white
  }
.color {
  color:#2d8cf0
}
.Nav{
  /deep/.ivu-checkbox-wrapper{
  display: inline-block;
  width: 100%;
  height: 100%;
}
/deep/.ivu-checkbox {
  position: absolute !important;
  left:8px;
  top: 13px;
}
}
.scroll {
  height: 750px;
  overflow: auto;
}

</style>