<template>
  <div ref="lotter">
    <!-- 彩票游戏排序 -->
    <Row   class="" style="color:#666666" v-if="typeId!='20003'">
      <span  style="line-height:48px" v-if="typeId!='10011'&&typeId!='20003'&&isEdit">
          <Icons type="tishi"/>长按可以拖拽排序
      </span>
      <Row style="line-height:60px" v-if="typeId!='10011'" >
        <draggable
          element="div"
          :move="onMove"
          @moved="isEdit"
          :class="screen<=1690?'zoom125':''"
          :options="{disabled:!isEdit,animation: 150,group:'people',forceFallback:true}"
          filter=".super,.disabled"
          :list="currentList"
          key="user"
        >
          <div
            v-for="item in currentList"
            class="btn cs mr20"
            :class="{active:lotterId == item.id,super:item.super==1&&isEdit&&adminType!='super'}"
            @click =" typeId=='10000'?showLotter(item.id):''"
            :key="item.id">
            {{item.name}}
            <Icon
              size="18"
              v-if="isEdit&&typeId!=10002&&typeId!=10003&&typeId!=10000&&(adminType=='super'||!item.super)"
              class="close"
              @click.prevent="remove(item.id,item.name)"
              type="md-close"
            />
            <Icons
              v-if=" showLock&& (isEdit || item.lock == 1 )&&(adminType=='super'||!item.super)"
              :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
              @click="lockGame(item.id,item.lock)"
              :color="item.lock ==!0&&item.super!=1 ? '#CECECE'
              :item.lock ==!0&&item.super==1?'rgb(255, 38, 38)' : 'orange'"
              class="gameLock"
              size="20"
            ></Icons>
          </div>
        </draggable>
      </Row>
      <row style="line-height:60px" v-if="showAllGame">
        <div>
          <span class="gameHeader ft16">
            全部游戏
          </span>
        </div>
        <draggable
          :move="onMove"
          @moved="isEdit"
          :list="navList"
          :sort="false"
          :class="screen<=1690?'zoom125':''"
          :options="{filter: '.disabled',disabled:!isEdit,animation: 150,ghostClass: 'opacity:1',forceFallback:true}"
          :group="{ name: 'people', pull: 'clone', put: false }"
        >
          <div
            class="btn cs mr20"
            :key='item.id'
            :class="{disabled: currentList.find(game => game.id === item.id),active:navId==item.id}"
            v-for="(item,i) in navList"
            @click='showGameType(item.list,item.id,i)'>
            {{item.name}}
          </div>
        </draggable>
       </row>
      <Row style="line-height:60px" v-if="(isEdit&&navId)||(isEdit&&typeId=='30001')">
        <div>
          <span class="gameHeader ft16" v-if="typeId=='30001'||!showType">
            {{typeId=='30001'?'彩票游戏分类':'游戏分类'}}
          </span>
        </div>
        <div
          v-if="typeId == '30001'"
          class="btn cs mr20"
          :class="gameType == item.id ? 'active mr20':''"
          v-for="item in lotterType"
          @click="showGame(item.list,item.id)"
          :key='item.id'>
            {{item.name}}
        </div>
        <draggable
          v-if="!showType&&navId"
          :move="onMove"
          @moved="isEdit"
          :list="navGameList"
          :sort="false"
          :class="screen<=1690?'zoom125':''"
          :options="{filter: '.disabled',disabled:!isEdit,animation: 150,ghostClass: 'opacity:1',forceFallback:true}"
          :group="{ name: 'people', pull: 'clone', put: false }"
        >
          <div
            class="btn cs mr20"
            :class="{disabled: currentList.find(game => game.id === item.id),active:type==item.id}"
            v-for="item in navGameList"
            @click='showGame(item.list,item.id)'
            :key='item.id'>
            {{item.name}}
          </div>
        </draggable>
      </Row>
      <Card class="gameBox" v-if="(typeId=='20001'||typeId=='20002')&&navId==0&&isEdit">
        <draggable
          :move="onMove"
          @moved="isEdit"
          :list="navGameList"
          :sort="false"
          :class="screen<=1690?'zoom125':''"
          :options="{filter: '.disabled',disabled:!isEdit,animation: 150,ghostClass: 'opacity:1',forceFallback:true}"
          :group="{ name: 'people', pull: 'clone', put: false }"
        >
          <div
            class="btn cs mr20"
            :class="{disabled: currentList.find(game => game.id === item.id),active:type==item.id}"
            v-for="(item,i) in navGameList"
            @click='showGame(item.list,item.id)'
            :key='item.id'>
            {{item.name}}
          </div>
        </draggable>
      </Card>
      <Card v-show="showGameBox" class="gameBox" v-if="isEdit||typeId=='10011'||typeId=='10000'">
        <draggable
          element="div"
          :move="onMove"
          @moved="isEdit"
          class="boxGame"
          :list="game"
          :class="screen<=1690?'zoom125':''"
          :options="{disabled:!isEdit,animation: 150,ghostClass: 'opacity:1',forceFallback:true}"
          :group="typeId=='10000'?{}:{ name: 'people', pull: 'clone', put: false }"
          key="game"
          filter='.super,.disabled'
          :sort="typeId == '30001'||typeId == '20001'||typeId=='20002'?false:true"
        >
          <div
            class="btn cs mr20 gameBtn"
            v-for="item in game"
            :class="{disabled: currentList.find(game => game.id == item.id),super:isEdit&&item.super==1&&adminType!='super'}"
            :key='item.id'>
            <span class="over"> {{item.name}}</span>
            <Icons
              v-show=" showGameLock&& (isEdit || item.lock == 1 )&&(adminType=='super'||item.super==0)"
              :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
              @click="lockGame(item.id,item.lock)"
              :color="item.lock ==!0&&item.super!=1 ? '#CECECE'
              :item.lock ==!0&&item.super==1?'rgb(255, 38, 38)' : 'orange'"
              class="gameLock"
              size="20"
            ></Icons>
          </div>
        </draggable>
      </Card>
    </Row>
    <!-- 手机侧边栏 -->
     <Row v-if="typeId==20003">
      <div class="mb20" v-for="(item,i) in currentList" :key="i">
        <div class="mb20">
          <Button class="lotterType w135x fontColor ft16">{{item.name}}</Button>
        </div>
        <div style="line-height:32px">
          <draggable
            element="div"
            class="ib"
            :list='item.list'
            :class="screen<=1690?'zoom125':''"
            :options="{animation: 150,draggable: '.itemOne', disabled: !isEdit,hostClass: 'opacity:1',forceFallback:true}"
            :move="onMove"
            @end="isDragging=true"
            @start="isDragging=true"
            @moved="isEdit"
          >
            <div v-for="(t,x) in item.list" class="ib mb10 cs itemOne" :key="t.name+x">
              <div class="mr20 w190x b h40x ">
                <span class="ib txt-a w68x lh40" style="border-right:1px solid #dadada;">序号{{x+1}}</span>
                <span class="ib txt-a w120x lh40">
                  {{t.name}}
                </span>
                <Icons type="remen" class="remen" color='red' v-show="t.hot=='yes'"  size="16"></Icons>
              </div>
              <div class="ft12 txt-a mr20" v-if='isEdit'>
                <span class="pl10 pr10 cs fontColor" @click="delLotter(i,x)">删除</span>
                <span class="pl10 pr10 cs fontColor" @click="changeHot(currentList[i],x,t.hot)" >{{t.hot=='yes'?'取消热门':'标为热门'}}</span>
              </div>
            </div>
            <Button @click="addLotter(i)"
              v-if="current.length < Object.keys(lotterList).length&&isEdit"
              style="vertical-align:top;border:1px solid #62b1fd"
              class="w120x h40x fontColor">
              <Icons type="tianjialunbotuanniu" color='#62b1fd' size="14" class="pr10"></Icons>
              新增彩种
            </Button>
          </draggable>
        </div>
      </div>
    </Row>
    <Modals title="新增彩种" ref="addLotter" :width="600">
      <div slot="content" class="mb30">
        <ul class="ml60 mt40">
          <li class="w50 ib mb30" style="white-space:nowarp;" v-for="(item,i) in addLotterList" :key="i">
            <span class="ib w10 ft14">{{i+1}}.</span>
            <Select class="w60" placeholder="请选择彩种" v-model="addLotterList[i].id" transfer @on-change="changeLotter" clearable>
              <Option v-for='(t,x) in selectList' v-show='t.show' :value='t.id' :key="t.name+x">{{t.name}}</Option>
            </Select>
          </li>
          <li class="ib w50 mb10" v-if="addLotterList.length<20&&addLotterList.length<selectList.length">
            <Button class="w70 h36 fontColor" style="border: solid 1px #62b1fd;" @click="lotterAdd">
              <Icons type="tianjialunbotuanniu" color='#62b1fd' size="14" class="pr10"></Icons>
              新增彩种
            </Button>
          </li>
          <li class="mt50">
            <Button class="w260x h50" style="margin-left:110px" type="primary"  @click="addSubmit">确认保存</Button>
          </li>
        </ul>
      </div>
    </Modals>
  </div>
</template>
<script>
import { getUserType } from "@/libs/util";
import Modals from "@/components/modals";
import Icons from "@/components/icons";
import draggable from "vuedraggable";
import { systemSiteGameUp, systemSiteGameList ,gameSortLotterySelect } from "@/api/system";
export default {
  name: "Lotter",
  components: {
    draggable,
    Icons,
    Modals
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
    dataList: {
      type: Object,
      required:true
    },
  },
  data() {
    return {
      subType:'30001',
      x:100,
      spinShow:true,
      screen:screen.width,
      showType:true,//显示游戏类别
      showLock:false,
      showGameLock:false,
      gameTypeList:[],
      navGameList:[],
      siteGameList:[], //所有类别列表
      currentList:[], //头部克隆列表
      lotterType:[], //彩票游戏分类
      lotterId:'',//彩票分类ID
      gameType:'', //游戏类别
      type:'',
      navId:'',//全部游戏当前选中
      showGameBox:'',//游戏显示
      showAllGame:'',//显示全部游戏
      game:[],
      K3Game:[],
      navList:[],
      // isDragging:false,
      adminType: getUserType(),
      current:[],//当前以选择彩种
      addLotterList:[],//添加彩票列表
      lotterList:[],//所有彩种列表
      selectList:[],
    }
  },
   watch: {
    typeId: {
      handler(newTypeId, oldTypeId) {
        this.showAllGame = false;
        if(newTypeId == oldTypeId) return;
        this.subType = newTypeId;
        this.setData(newTypeId);
        if(newTypeId=='20003'){ //20003 获取所有彩种
          this.lotterList=[]
          const data={siteId:this.$root.nowSite.id}; //获取所有彩票游戏
          gameSortLotterySelect(data).then(res=>{
            let obj = res.data;
            for(let i in obj){
              this.lotterList.push(obj[i])
            }
          })
        }
      },
      deep: true
    },
    isEdit: {
      handler(newTypeId, oldTypeId) {
        if(newTypeId&&(this.typeId=='20001'||this.typeId=='20002')){
          this.showAllGame = this.typeId =='20001'||this.typeId == '20002'?true:false;
        }
      },
      deep: true
    },
  },
  mounted() {
    let _this=this;
    let props = {..._this._props};
    this.siteGameList = props.dataList; //获取全部游戏列表
    this.setData(props.typeId);
    this.subType = props.typeId;
  },
  methods: {
    setData(typeId){
      this.navId ='';
      this.showLock = typeId=='20002'||typeId=='20001'||typeId=='10000'?false:true;
      this.showGameLock = typeId == '10000'?true:false;
      this.showType = typeId == '10002'||typeId=='10003'||typeId=='0'||typeId=='10000'?true:false;
      this.currentList = Number(typeId) >=10011?this.siteGameList[typeId]:this.siteGameList[typeId][0].list;
      if(typeId=='30001'){
        this.lotterType = this.siteGameList[10000][0].list; //彩票分类列表;
        this.game = this.lotterType[0].list;
        this.gameType = this.lotterType[0].id;
      }
      if(typeId == '20002'||typeId == '20001') this.getNavList(typeId);
      if(typeId == '10011'){
        this.navGameList = this.siteGameList['10011'];
        this.type = typeId;
        this.game = this.navGameList[0].list;
      };
      if(typeId=='20003'){
        this.getCurrentList();
      }
      if(typeId == '10000'){
        this.lotterId = this.currentList[0].id;
        this.game=this.currentList[0].list;
      }
      this.showGameBox = typeId=='10002'||typeId=='10003'||this.navId=='0'?false:true; //游戏列表显示隐藏;
      // this.showAllGame = typeId =='20001'||typeId == '20002'?true:false;
      this.spinShow = false;
    },
    getCurrentList(){
      this.current=[];
      this.currentList.map(item=>{
        item.list.map(t=>{
          this.current.push(t.id)
        })
      });
    },
    lockGame(id,lock){
      if (!this.isEdit) return false;
      if(this.typeId!='10000'){
        for (let i = 0; i < this.currentList.length; i++) {
          if (this.currentList[i].id == id) {
            this.$set(this.currentList[i], "lock", lock? 0 : 1);
          };
          if(this.adminType == 'super'&&this.currentList[i].id == id){
            this.$set(this.currentList[i], "super", lock?0:1);
          }
        }
      }else{
        for (let i = 0; i < this.game.length; i++) {
          if (this.game[i].id == id) {
            this.$set(this.game[i], "lock", lock == 0 ? 1 : 0);
          };
          if(this.adminType == 'super'&&this.game[i].id == id){
            this.$set(this.game[i], "super", lock?0:1);
          }
        }
      }

    },
    remove(id, levelName){
      let text, msg;
      text = `您确定删除${levelName}吗？`;
      msg = `删除成功${levelName}`;
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          //去掉列表中的游戏分类
          this.currentList = this.currentList.filter(i => i.id !== id);
          //去掉要保存的游戏列表
        }
      });
    },
    showGame(list,id){ //游戏列表
      this.gameType = id;
      this.type = id;
      if(list) this.game = list
      else this.game = [];
    },
    showGameType(list,id,i){ //点击全部游戏
      this.navId = id;
      if(id!='10002'&&id!='10003') {
        this.type =id !=0? list[0].id:'';
        this.navGameList = list;
        this.game = id !=0? list[0].list:[]; //切换游戏时默认选中子类第一个
        this.showType = false;

      }else{
        this.showType = true;
        this.game = list;
      }
      this.showGameBox = this.navId=='0'?false:true; //游戏列表显示隐藏;
    },
    showLotter(id){
      this.lotterId = id;
      this.currentList.map(item=>{
        if(item.id == id) this.game = item.list;
      })
    },
    submit(){
      if(this.subType == '10001'||this.type=='20003') return;
      let json =this.subType == '30001'||this.subType == '20002'||this.subType=='20001'?this.currentList
              :this.subType == '10002'||this.subType=='10003'?[this.siteGameList[this.subType][0]]
              :this.subType == '10011'||'10000'?[this.siteGameList['10000'][0]]:'';
      if(this.subType == '20002'){
        json.forEach(t=>{
          if(t.list) delete t.list
        })
      }
      const data = {
        siteId: this.$root.nowSite.id,
        type: this.subType=='10011'?'10000':this.subType,
        json: JSON.stringify(json)
      };
      systemSiteGameUp(data,true).then(res=>{
        if(res.code){
          this.$Message.success('数据更新成功')
          this.$emit('getLoad',false)
        }
      })
    },
    getNavList(typeId){ //获取全部游戏导航
      this.navList = [];
      this.navList.push({
        id: 0,
        bid: 0,
        level: 0,
        list: [
          {
            bid: 99998,
            id: 99998,
            level: 0,
            lock: 0,
            name: "优惠活动",
            upid:99998
          },
          {
            bid: 99996,
            id: 99996,
            level: 0,
            lock: 0,
            name: "长龙助手",
            upid:99996
          },
          {
            bid: 99997,
            id: 99997,
            level: 0,
            lock: 0,
            name: "更多游戏",
            upid:99997
          }
        ],
        lock: 0,
        upid:0,
        name: "其他"
      });
      for(let key in this.siteGameList){
        if(key<10006) {
          this.navList.push(this.siteGameList[key][0]);
        }
      }
      this.navGameList = this.navList[0].list;
      this.navId = typeId =='0'?'':this.navList[0].id;//进入时选中状态
    },
      //20003数据提交
    getUp(){
      let data={
        siteId:this.$root.nowSite.id,
        type:20003,
        json:JSON.stringify(this.currentList),
      };
      systemSiteGameUp(data,true).then(res=>{
        if(res != undefined && res.code == 200){
          this.$Message.success('更新成功');
          this.getCurrentList();
          this.addLotterList=[];    
          this.$emit('getLoad',false);
        };
      })
    },
    //新增彩种
    addLotter(i){
      this.selectList=[];
      this.addIndex=i;
      this.addLotterList=[];
      this.getCurrentList();
      this.lotterList.filter(item=>{
        if(!this.current.includes(item.id)){
          item.show = true;
          this.selectList.push(item)
        }
      })
      this.$refs.addLotter.show();
    },
    lotterAdd(){
      let obj={}
      this.addLotterList.push(obj);
    },
    //下拉框变化时
    changeLotter(val){
      this.selectList.map(item=>{
        item.show = true;
        this.addLotterList.map(t=>{
          if(item.id==t.id){
            item.show = false
          }
        })
      })
    },
    //删除彩种
    delLotter(i,x){
      this.currentList[i].list.splice(x,1)
      // this.getUp("删除成功")
    },
    //热门状态切换
    changeHot(i,x,hot){
      this.currentList=this.currentList
      if(hot=='yes'){
        this.$set(i.list[x],'hot','no')
      }else{
        this.$set(i.list[x],'hot','yes')
      }
      // this.getUp("状态切换成功")
    },
    addSubmit(){
      this.addLotterList.map(item=>{
        this.lotterList.map(t=>{
          if(t.id==item.id){
            let obj={}
            obj.hot = 'no';
            obj.classId = t.classId;
            obj.id = t.id;
            obj.name = t.name;
            obj.platform =t.platform;
            this.currentList[this.addIndex].list.push(obj)
          }
        })
      });
      let data={
        siteId:this.$root.nowSite.id,
        type:20003,
        json:JSON.stringify(this.currentList),
      };
      this.$refs.addLotter.hide();
      // this.getUp("新增成功")
    },
    //拖动后改变位置 {  }
    onMove({relatedContext, draggedContext}) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      let clone = true;
      if(this.adminType!='super'&&(this.subType<=10006||this.subType==30001)){
        relatedContext.list.forEach(t=>{
          if(t.id == draggedContext.element.id){
            clone = false
          }
        })
        let arr = [];
        relatedContext.list.map((item,index)=>{
          if(item.super == 1){
            arr.push(index);
          }
        })
        arr.push(draggedContext.index);
        let newarr = arr.sort((a,b)=>{
          return a-b
        });
        newarr=Array.from(new Set(newarr))
        let currentIndex = newarr.indexOf(draggedContext.index);
        let minIndex , maxIndex;
        if(currentIndex){
          if(newarr[currentIndex]==newarr[currentIndex - 1]){
            minIndex = newarr[currentIndex - 2]||0
          }else{
            minIndex = newarr[currentIndex-1];
          }
          maxIndex = newarr[currentIndex + 1]||9999999;
        }else{
          minIndex = -1;
          maxIndex = newarr[currentIndex + 1]||9999999;
        }
         if(clone){
          minIndex = newarr[newarr.length-1]; 
          maxIndex = 99999;
        }
        if(draggedContext.futureIndex>=maxIndex||draggedContext.futureIndex<=minIndex){
          return false
        }
      }else{
        return (
          (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
        );
      }
    },
  },
};
</script>
<style lang="less" scoped>
.h36 {
  height: 36px !important;
  font-size: 14px;
  line-height: 36px;
}
.btn {
  width:135px;
  height: 36px;
  display: inline-block;
  // margin: 0 20px 20px 0;
  text-align: center;
  line-height: 36px;
  border-radius: 5px;
  border:1px solid #dcdee2;
  position: relative;
  vertical-align: middle;
}
.gameHeader {
  line-height: 48px;
  color:#2d8cf0;
}
.active {
  background: #2d8cf0;
  color:white;
}
.gameBox {
  max-height: 460px;
  background: #f6f6f8;
  // padding: 20px;
  box-sizing: border-box;
  line-height: 60px;
  border: 1px solid #dcdcdc;
  overflow-y: auto;
  overflow-x: hidden;
}
.disabled {
  color:#ddd5d5;
  background: white;
}
.gameBtn {
  background: white;
}
.disabled.active{
  color:white;
  background: #6999cc
}

//20003

.lotterType {
  border-radius: 20px;
  border: solid 1px #62b1fd;
  height: 42px;
  span{
    vertical-align: middle;
  }
}
.fontColor{
  color:#62b1fd;
}
.itemOne{
  position: relative;
  .remen {
    position: absolute;
    right: 20px;
    top: -15px;
  }
}
.close {
  position: absolute;
  background-color: #f6f6f8;
  border-radius: 50%;
  border: 1px #cecece;
  top: -8px;
  right: -6px;
  color: #cccccc;
  border:1px solid #CECECE
}
.gameLock {
  position: absolute;
  top: -14px;
  left: -8px;
  z-index: 100;
}
.over {
  width:120px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.boxGame{
  line-height: 60px;
}
/deep/.super { //超管锁定编辑置灰
  // background: #faf8f8;
  color: #ddd5d5;;
}
//小屏排序样式
.zoom125 {
  zoom:1.25;
  font-size: 0.625rem;
  .btn,.gameButton {
    height: 30px !important;
    line-height: 30px !important;
    width: 110px !important;
    span {
      width:110px;
    }
  }
  .hideOverflow{
    line-height: 30px;
  }
  .ivu-tag {
    width: 110px !important;
    height: 32px;
    line-height: 32px;
  }
  /deep/.ivu-tag-text {
    font-size: 0.825rem !important;
  }
  .itemOne {
    .remen {
      top:-10px !important;
    }
    .h40x {
      height: 32px;
      .lh40 {
        line-height: 32px !important;
        height: 32px !important;
      }
    }
    
  }
}
</style>