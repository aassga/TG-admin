<template>
  <div ref="dragable">
    <Row>
      <span class="gameHeader">排序类别</span>
      <Select v-model="typeId" style="width:250px" label="彩票游戏">
        <Option v-for="(item,index) in siteGameType" :key="index.id" :value="item.id">{{item.name}}</Option>
      </Select>
      <span class="gameHeader" style v-if="isEdit">
        <Icons type="tishi"/>长按可以拖拽排序
      </span>
      <div class="v2-button fr">
        <Button v-if="!isEdit" type="primary" @click="toEdit()" class :loading='saveLoading' :disabled='this.disabled'>编辑</Button>
        <!-- <Button v-if="isEdit"  type="primary" @click="toEdit()" class="w120x fr gameHeader">取消编辑</Button> -->
        <Button v-if="isEdit" type="primary" @click="submit()" class :loading='loading1' :disabled='this.disabled'>保存</Button>
      </div>
    </Row>
    <!-- 彩票游戏排序 -->

    <Row v-if="isGame&&!isMbLotter" class="a">
      <Spin size="large" fix v-if="spinShow">
        <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
          <div v-for="t in 8" :key="'div'+t"></div>
        </div>
      </Spin>
      <Row ref="gameTypeList">
        <draggable
          element="div"
          v-show="isGame"
          class="gameTypeList"
          :class="screen<=1690?'zoom125':''"
          :move="onMove"
          @moved="isEdit"
          @end="isDragging=true"
          @start="isDragging=true"
          :options="options"
          filter=".super"
          :list="gameTypeList"
          :group="{}"
          key="user"
        >
        <!-- 二级 -->
          <div
            type="default"
            v-for="(item,index) in gameTypeList"
            :key="index"
            class="w120x gameListBotton "
            
            :title="item.title"
            :class="isNavCurrentBtn(item.id)&&(isEdit&&adminType!='super'&&item.super==1) ? 'v2-tag-active1 super'
              : !isNavCurrentBtn(item.id)&&(isEdit&&adminType!='super'&&item.super==1)?'super'
              : isNavCurrentBtn(item.id)&&!(isEdit&&adminType!='super'&&item.super==1)?'v2-tag-active1 sort':'sort' "
            @click="showList(item,gameTypeList)"
            :value="item.id"
          >
            {{item.name}}
            <Icons
              :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
              v-if="AllGameId!=10000 && (isEdit || item.lock == 1 )&&(adminType=='super'||item.super==0)"
              @click="lockGame(item.id,item.lock)"
              :color="item.lock ==!0&&item.super!=1 ? '#CECECE'
              :item.lock ==!0&&item.super==1?'rgb(255, 38, 38)' : '#2D8CF0'"
              class="gameLock"
              size="20"
            ></Icons>
          </div>
        </draggable>
      </Row>
      <Card class="gameList scoll" ref="gameList" v-if="isGameList">
        <span class="gameHeader" style v-if="isEdit">
          <Icons type="tishi"/>长按可以拖拽排序
        </span>
        <draggable
          element="div"
          v-if="showGameList"
          class="mt10"
          :options="options2"
          :filter="typeId==10011?'':'.super'"
          :class="screen<=1690?'zoom125':''"
          :move="onMove"
          @end="isDragging=true"
          @moved="isEdit"
          @start="isDragging=true"
          :list="gameList"
          key="usersort"
        >
          <div style="margin:10px"
            v-for="(item,index) in gameList"
            class="w120x gameButton" :key="'bbbb'+index"
            :class="(adminType!='super'&&isEdit&&item.super==1&&typeId!=10011)?'super':'sort'"
            >
            <div
              type="default"
              class="w120x hideOverflow"
              :class="(adminType!='super'&&isEdit&&item.super==1&&typeId!=10011)?'super':'sort'"
              :key="index"
              :title="item.name"
              :value="item.id"
            >{{item.name}}</div>
            <Icons
              :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
              v-if="( isEdit || item.lock == 1) &&!isK3Game&&(adminType=='super'||item.super==0) "
              @click="lockLottery(item)"
              :color="item.lock ==!0&&item.super==0 ? '#CECECE'
                :item.lock ==!0&&item.super==1?'rgb(255, 38, 38)' : '#2D8CF0'"
              class="lotteryLock"
              size="20"
            ></Icons>
          </div>
        </draggable>
      </Card>
      <Row v-if="!spinShow">
        <Col class="gameBottom" style v-if="isEdit&&!isK3Game">
          <Icons type="tishi"/>锁定后，排序不会因用户习惯发生变化
        </Col>
      </Row>
    </Row>
    <!-- 导航排序 非彩票游戏List  可以克隆且上方非彩票游戏不可有重复数据 -->
    <Row v-if="!isGame&&!isMbLotter">
      <Spin size="large" fix v-if="spinShow">
        <div class="sk-circle">
            <div v-for="t in 13" :key='t' :class="'sk-circle'+t+' '+'sk-child'"></div>
        </div>
      </Spin>
      <Row ref="gameTypeList">
        <draggable
          element="div"
          class="mt10 list-group-item"
          :class="screen<=1690?'zoom125':''"
          :move="onMove"
          :options="{group:'people',disabled:!isEdit,fallbackClass:true}"
          @end="isDragging=false"
          @moved="isEdit"
          @start="isDragging=true"
          :list="allGameList"
        >
          <div
            type="default"
            style="margin:10px"
            v-for="(item,index) in allGameList"
            :key="index"
            class="gameButton"
            :class="isNavCurrentBtn(item.id) ? 'v2-tag-active1' : ''"
            :title="item.name"
            :value="item.id"
          >
            {{item.name}}
            <Icon
              size="18"
              v-if="isEdit && (isAllGame||AllGameId==20001||20002) "
              class="close"
              style="border:1px #CECECE "
              @click="remove(item.id,item.name,index)"
              type="md-close"
            />
          </div>
        </draggable>
      </Row>
      <Card class="gameList" ref="gameList" v-if="showGameList && !isAllGame">
        <span class="gameHeader" style=" " v-if="isEdit">
          <Icons type="tishi"/>下方可以拖动到上方排序,该列表仅做克隆不做排序
        </span>
        <draggable
          element="div"
          class="gameTypeList"
          :class="screen<=1690?'zoom125':''"
          :move="onMove"
          @moved="isEdit"
          @end="isDragging=true"
          @start="isDragging=true"
          :list="allGameTypeList"
          :sort="false"
          :options="{filter: '.disabled,.disable-button',fallbackClass:true,group:{ name: 'people', pull: 'clone', put: false },disabled:!isEdit,animation: 150,ghostClass: 'opacity:1'}"
        >
          <Tag
            v-for="(item, index) in allGameTypeList"
            :class="[isNavCurrentTag(item.id) ? 'v2-tag-active' : '',
                allGameList.find(
                  game => game.id === item.id
                ) ? 'disable-button' :'']  "
            :key="index"
            :title="allGameList.find(
                  game => game.id === item.id
                ) ? item.name + ' 不可拖拽' : item.name + ' 可拖拽'"
            @click.native="showAllList(item.id)"
          >{{item.name}}</Tag>
        </draggable>
        <!-- 二级菜单 -->
        <draggable
          element="div"
          class="gameTypeList"
          :class="screen<=1690?'zoom125':''"
          :move="onMove"
          @moved="isEdit"
          @end="isDragging=true"
          @start="isDragging=true"
          :list="navGameTypeList"
          :sort="false"
          :options="{
                filter: '.disabled',fallbackClass:true,group:{ name: 'people', pull: 'clone', put: false },disabled:!isEdit,animation: 150,ghostClass: 'opacity:1'}"
        >
          <div
            type="default"
            :title="item.name"
            style="margin:10px"
            v-for="(item,index) in navGameTypeList"
            :key="index"
            :class="[{disabled: allGameList.find(game => game.id === item.id)},isNavCurrentBtn1(item.id) ? 'v2-tag-active1 secondary-menu ' : 'secondary-menu ']"
            @click="showNavAllList(item)"
            class="w120x gameButton"
            :value="item.id"
          >{{item.name}}</div>
        </draggable>
        <Card v-if="isNavGameList  " class="gameList isgerry">
          <draggable
            element="div"
            class="gameTypeList list-group-item"
            :class="screen<=1690?'zoom125':''"
            :move="onMove"
            :options="{filter: '.disabled',fallbackClass:true,disabled:!isEdit,animation: 150,ghostClass: 'opacity:1'}"
            @moved="isEdit"
            @end="isDragging=true"
            @start="isDragging=true"
            :list="navGameList"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :sort="false"
          >
            <div
              type="default"
              style="margin:10px"
              :title="item.name"
              v-for="(item,index) in navGameList"
              :key="index"
              class="w120x gameButton hideOverflow secondary-menu"
              :class="{disabled: allGameList.find(game => game.id === item.id)}"
              :value="item.id"
            >{{item.name}}</div>
          </draggable>
        </Card>
      </Card>

      <Card class="gameList" ref="gameList" v-if="showGameList && isAllGame&&isEdit">
        <!-- <div class="gameTypeList">
          <Tag class="disabled disable-button">{{AllGameId=='30001'?'彩票':'电子'}}</Tag>
        </div> -->
        <div
          type="default"
          :title="item.name"
          style="margin:10px"
          v-for="(item,index) in navGameTypeList"
          :key="index"
          :class="[isNavCurrentBtn1(item.id) ? 'v2-tag-active1 secondary-menu ' : 'secondary-menu ']"
          @click="showNavAllList(item)"
          class="w120x gameButton"
          :value="item.id"
        >{{item.name}}</div>
        <!-- </draggable> -->
        <Card v-if="isNavGameList  " class="gameList isgerry">
          <draggable
            element="div"
            class="gameTypeList list-group-item"
            :class="screen<=1690?'zoom125':''"
            :move="onMove"
            :options="{filter: '.disabled',fallbackClass:true,disabled:!isEdit,animation: 150,ghostClass: 'opacity:1'}"
            @moved="isEdit"
            @end="isDragging=true"
            @start="isDragging=true"
            :list="navGameList"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :sort="false"
            key="game"
          >
            <div
              type="default"
              style="margin:10px"
              :title="item.name"
              v-for="(item,index) in navGameList"
              :key="index"
              class="w120x gameButton hideOverflow secondary-menu"
              :class="{disabled: allGameList.find(game => game.id === item.id)}"
              :value="item.id"
            >{{item.name}}</div>
          </draggable>
        </Card>
      </Card>
    </Row>
    <!-- 手机彩票侧边栏 -->
    <Row v-if="isMbLotter">
      <div class="mb20" v-for="(item,i) in allGameList" :key="i">
        <div class="mb20">
          <Button class="lotterType w135x fontColor">{{item.name}}</Button>
        </div>
        <div style="line-height:32px">
          <draggable
            element="div"
            class="ib"
            :list='item.list'
            :options="options2"
            :class="screen<=1690?'zoom125':''"
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
              <div class="ft12 txt-a mr20">
                <span class="pl10 pr10 cs fontColor" @click="delLotter(i,x)">删除</span>
                <span class="pl10 pr10 cs fontColor" @click="changeHot(allGameList[i],x,t.hot)" >{{t.hot=='yes'?'取消热门':'标为热门'}}</span>
              </div>
            </div>
            <Button @click="addLotter(i)"
              v-if="currentList.length < Object.keys(lotterList).length"
              draggable="false"
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
            <Button class="w70 h36 fontColor" style="border: solid 1px #62b1fd;line-height:36px!important"  @click="lotterAdd">
             <div class="mtf5">
                <Icons type="tianjialunbotuanniu" color='#62b1fd' size="14" class="pr10"></Icons>
              <span>新增彩种</span>
             </div>
            </Button>
          </li>
          <li class="mt50">
            <Button class="w260x h50 ft16" style="margin-left:110px" type="primary"  @click="addSubmit">确认保存</Button>
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
// import { Spin } from "view-design";
import { systemSiteGameUp, systemSiteGameList ,gameSortLotterySelect} from "@/api/system";
export default {
  // mixins: [mixins],
  name: "gameSort",
  watch: {
    typeId: {
      handler(newTypeId, oldTypeId) {
        this.AllGameId = newTypeId
        //如果重复点击则不操作
        if (newTypeId == oldTypeId) return false;
        this.gameTypeList = [];
        this.isEdit = false;
        if(newTypeId !=20003){
          this.isMbLotter = false
        }
        //重置是否可拖拽
        this.isLottery = newTypeId <= 10011 ? true : false;
        this.isDragging = false;
        this.toChangeDisabled(true);
        //重置当前config
        this.resetList(newTypeId);
        //从上方gameId list 来判断是否是游戏 或者是导航
        this.isGame =
          this.gameId.indexOf(newTypeId) !== -1
            ? true
            : this.navGationId.indexOf(newTypeId) !== -1
            ? false
            : undefined;
        if(newTypeId<30002){
          if (
            this.siteGameList[newTypeId] == undefined ||
            newTypeId == "99999" ||
            this.siteGameList[newTypeId][0] == null ||
            this.siteGameList[newTypeId] == null
          )
            return (this.allGameList = []), (this.gameList = []);
        }

        //重置彩票游戏二大类
        this.gameList = [];
        //取出当前对象中的值 数组中的第一个对象的List 显示在card中
        if(this.siteGameList[newTypeId].length>0){
          if (typeof this.siteGameList[newTypeId][0].list == Array) {
            this.gameList = this.siteGameList[newTypeId][0].list[0];
          }
        }

        //如果是导航 重置allGameList
        if (!this.isGame) {
          this.allGameList = [];
          this.allGameList = this.siteGameList[newTypeId];
        }
        //数据处理  10006后为导航排序
        this.gameTypeList =
          newTypeId < 10011
            ? this.siteGameList[newTypeId][0].list
            : this.toArray(this.siteGameList[newTypeId]);
        //显示游戏
        //如果是K3游戏的话隐藏其他
        if (newTypeId >= 30001) {
          this.isAllGame = true;
        } else {
          this.isAllGame = false;
        }
        if (newTypeId == 10011) {
          this.isK3Game = true;
          this.showList(this.siteGameList[newTypeId]["0"]);
        } else {
          this.isK3Game = false;
          if(newTypeId>30001){
              this.isGame
            ? this.showList(this.siteGameList[newTypeId]["0"].list["0"])
            : this.showAllList(10001);
          }else{
             this.isGame
            ? this.showList(this.siteGameList[newTypeId]["0"].list["0"])
            : this.showAllList(10000);
          }
        }
        if(newTypeId == 20003){
          this.isMbLotter = true;
          this.currentList=[];
          this.allGameList.map(item=>{
            item.list.map(t=>{
              this.currentList.push(t.id)
            })
          })
        };
      },
      deep: true
    },
    isDragging: {
      handler(newValue, oldValue) {
        if (newValue) {
          return (this.delayedDragging = false);
        }
        this.$nextTick(() => {
          this.delayedDragging = false;
        });
      },
      deep: true
    }
  },
  data() {
    return {
      // sortIndex:'',
      // newIndex:'',
      // type:'',
      // sortArr:[],
      screen: screen.width,
      addIndex:'',
      adminType: getUserType(),
      currentList:[],//当前以选择彩种
      addLotterList:[],//添加彩票列表
      lotterList:[],//所有彩种列表
      selectList:[],
      modal:false,
      isMbLotter:false,
      disabled:false,
      saveLoading: true,
      loading1: false,
      gameId: [10000, 10001, 10002, 10003, 10004, 10005, 10011], //游戏排序ID
      navGationId: [20001, 20002,20004,30001, 30002, 30003, 30004, 30005, 99999], //导航排序Id
      mblotterId: [20003],
      isEdit: false, //是否为编辑状态
      spinShow: true, //加载效果
      isClose: false, //是否又删除按钮 只有导航排序有
      allGameList: [], //导航排序显示数组
      k3Obj: {
        id: 10011,
        name: "手机端快3侧边栏"
      },
      allObj: {
        id: 88888,
        name: "所有端彩票侧边栏"
      },
      list: [],
      clickNavId: 10000, //默认为彩票游戏ID
      isLottery: false,
      isNavGameList: true, //navList为空数组 则隐藏card 针对 彩票游戏
      isGameList: true, //gameList为空数组 则隐藏card 针对导航游戏
      allGameTypeList: [], //所有彩票游戏 待拖拽到导航栏
      allGame: [], //全部游戏
      k3Game: [], //k3游戏
      isK3Game: false, //是否为k3游戏
      isGame: true, //是否是彩票游戏
      isDragging: false, //防止二次拖拽
      delayedDragging: false, //防止二次拖拽
      siteGameList: {}, //游戏所有
      siteGameType: [
        {
          id: 20003,
          name: "手机端彩票侧边栏"
        },
        {
          id: 10004,
          upid:10004,
          name: "棋牌游戏",
        },
        {
          id: 10003,
          upid: 10003,
          name: "真人视讯"
        },
        {
          id: 10005,
          upid: 10005,
          name: "捕鱼游戏"
        },
        {
          id: 10001,
          upid: 10001,
          name: "电子游艺"
        },
        {
          id: 10002,
          upid: 10002,
          name: "体育赛事"
        },
        // {
        //   id: 30002,
        //   name: "全部彩票"
        // },
        {
          id: 10000,
          upid: 10000,
          name: "彩票分类"
        },

        {
          id: 10011,
          name: "手机端快3侧边栏"
        },
        {
          id: 20001,
          name: "手机端首页快捷入口"
        },
        {
          id: 20002,
          name: "手机端首页热门"
        },
        {
          id: 20004,
          name: "推荐电子"
        },
        {
          id: 30001,
          name: "全部彩票"
        },
        {
          id: 30003,
          name:'电子-热门游戏',
        },
        {
          id: 30004,
          name:'电子-最新游戏',
        },
        {
          id: 30005,
          name:'电子-彩金池游戏',
        }
      ], //游戏2大类
      listCfig: [], //游戏配置显示删除，锁等
      // gameType:[],
      gameTypeList: [], //暂存游戏2大类
      navGameTypeList: [], //二级菜单
      gameSonList: [], //暂存游戏2大类
      showGameList: false,
      typeId: null, //排序类型选中
      gameList: [], //重置游戏 2大类
      navGameList: [], //导航游戏3大类
      newFormGameList: [], //处理后最后提交给后台的数据
      formGameList: [],
      clickId: 88888, //nav导航点击id
      isAllGame: false,
      AllGameId:'',
      clickId1: 0, //选中效果
      options: {
        animation: 150,
        disabled: false,
        ghostClass: "opacity:1",
        forceFallback:true
      },
      options1: {
        animation: 150,
        disabled: false,
        forceFallback:true,
        ghostClass: "opacity:1"
      },
      options2: {
        animation: 150,
        disabled: false,
        forceFallback:true,
        ghostClass: "opacity:1"
      },
      navOptions: {
        animation: 150,
        disabled: false,
        forceFallback:true,
        ghostClass: "opacity:1"
      }
      //暂存提交表单游戏列表
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
      //获取彩种
      const data={siteId:this.$root.nowSite.id};
      this.lotterList=[]
      gameSortLotterySelect(data).then(res=>{
        let obj = res.data;
        for(let i in obj){
          this.lotterList.push(obj[i])
        }
      })
    });
    // document.body.ondrop = function(event) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // };
  },
  methods: {
    //编辑过 这个方法输入后将编辑变为灰色
    // changeFunc(item, index) {
    // 	return item;
    // },
    //编辑按钮
    toEdit() {
      this.toChangeDisabled(false);
      this.isEdit = true;
    },
    lockLottery(data) {
      if (!this.isEdit) return false;
      for (let i = 0; i < this.gameList.length; i++) {
        if (this.gameList[i].id == data.id) {
          this.$set(this.gameList[i], "lock", data.lock == 0 ? 1 : 0);
        };
        if(this.gameList[i].id == data.id && this.adminType == 'super'){
           this.$set(this.gameList[i], "super", data.lock ? 1 : 0);
        }
      }
    },
    //20003数据提交
    getUp(msg){
      let data={
        siteId:this.$root.nowSite.id,
        type:20003,
        json:JSON.stringify(this.allGameList),
      };
      systemSiteGameUp(data,true).then(res=>{
        if(res != undefined && res.code == 200){
          this.currentList=[];
          this.allGameList.map(item=>{
            item.list.map(t=>{
              this.currentList.push(t.id)
            })
          })
          this.$Message.success(msg);
          this.$refs.addLotter.hide();
          this.addLotterList=[];
        };
      })
    },
    //新增彩种
    addLotter(i){
      this.selectList=[];
      this.addIndex=i;
      this.addLotterList=[];
      this.lotterList.filter(item=>{
        if(!this.currentList.includes(item.id)){
          item.show = true;
          this.selectList.push(item)
        }
      })
      if(this.selectList.length==0){
        this.$Message.error("当前暂无可新增彩种");
        return
      }
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
      this.allGameList[i].list.splice(x,1)
      this.getUp("删除成功")
    },
    //热门状态切换
    changeHot(i,x,hot){
      this.allGameList=this.allGameList
      if(hot=='yes'){
        this.$set(i.list[x],'hot','no')
      }else{
        this.$set(i.list[x],'hot','yes')
      }
      this.getUp("状态切换成功")
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
            this.allGameList[this.addIndex].list.push(obj)
          }
        })
      });
      let data={
        siteId:this.$root.nowSite.id,
        type:20003,
        json:JSON.stringify(this.allGameList),
      };
      this.getUp("新增成功")
    },
    isNavCurrentBtn(item) {
      return item == this.clickId ? true : false;
    },
    isNavCurrentBtn1(item) {
      return item == this.clickId1 ? true : false;
    },
    //是否为当前点击Id
    isNavCurrentTag(item) {
      return item == this.clickNavId ? true : false;
    },
    //锁定排序
    lockGame(id, lock) {
      if (!this.isEdit) return false;
      for (let i = 0; i < this.gameTypeList.length; i++) {
        if (this.gameTypeList[i].id == id) {
          this.$set(this.gameTypeList[i], "lock", lock == 0 ? 1 : 0);
        };
        if(this.adminType == 'super'&&this.gameTypeList[i].id == id){
          this.$set(this.gameTypeList[i], "super", lock?0:1);
        }
      }
    },
    //重置当前list 配置
    resetList(newTypeId) {
      this.listCfig = {};
      //重置当前list 配置
      this.listCfig = this.siteGameType.filter(i => i.id === newTypeId);
    },
    //获取游戏列表数据
    getData() {
      this.$root.startTableLoading(this);
      const data = {
        siteId: this.$root.nowSite.id
      };
      systemSiteGameList(data).then(res => {
        if (res === undefined) return false;
        this.siteGameList = {};
        let gameList = res.data.siteGameList;
        this.formGameList = res.data.siteGameList;
        this.siteGameList = res.data.siteGameList;
        //别删
        // for(let key in this.siteGameList){
        //   if(key<=10005||key>30002){
        //     this.siteGameList[key].map(item=>{
        //       item.upid = key;
        //       if(item.list){
        //         item.list.map(t=>{
        //           t.upid = item.id;
        //           if(t.list){
        //             t.list.map(x=>{
        //               x.upid=t.id
        //               if(x.list){
        //                 x.list.map(z=>{
        //                   z.upid=x.id
        //                 })
        //               }
        //             })
        //           }
        //         })
        //       }
        //     })
        //   }
        // }
        //把全部游戏提取出来
        this.getNavTypeList(gameList);
        this.siteGameList["10000"]["0"].list.forEach(i => {
          if (i.id === 88888) {
            this.allGame = [];
            this.allGame.push(i);
          } else if (i.id === 10011) {
            this.k3Game = [];
            this.k3Game.push(i)
          }
        });
        this.siteGameList["10011"] = this.k3Game;
        this.typeId = 10000;
        this.spinShow = false;
        this.saveLoading = false
        this.$root.endTableLoading()
      }).catch(error=>{this.$root.endTableLoading()});
    },
    //导航
    getNavTypeList(gameList) {
      this.allGameTypeList.push({
        id: 0,
        bid: 0,
        level: 0,
        list: [],
        lock: 0,
        upid:0,
        name: "其他"
      });
      for (var key in gameList) {
        //小于10005 1.提交的数据为当前id的改变完的所有数据。2.没有删除按钮 3.有锁状态 4 子类只能在当前父id 中拖拽 5 没有title按钮 简介可编辑
        // let isGame = key > 10011 && key != 30001 ? false : true;
        let isGame = key > 10011 ? false : true;
        //配置列表
        if (!isGame) return false;
        if (Number(key) == undefined) return false;
        if (gameList[key] !== null) {
          let obj = {
            id: Number(key),
            bid: gameList[key][0].bid,
            level: gameList[key][0].level,
            list: gameList[key][0].list,
            lock: gameList[key][0].lock,
            name: gameList[key][0].name,
            upid: gameList[key][0].bid,
          };
          if (isGame) {
            this.allGameTypeList.push(obj);
          }
        } else if (gameList[key] == null) {
          let m = Number(key);
          this.siteGameType = this.siteGameType.filter(i => i.id !== m);
        }
      }
    },
    submit() {
      //提交过滤
      this.disabled=true;
      if ( !this.siteGameList[this.typeId] || this.siteGameList[this.typeId] == undefined ) return false;
      if (this.listCfig[0].id == 10011) {
        let { bid, id, level, list, lock, name } = this.siteGameList[10000][0];
        let obj = { id , name, level, lock, bid, list };
        this.newFormGameList = [];
        this.newFormGameList.push(obj);
      } else {
        this.newFormGameList = this.isGame ? [...this.gameTypeList] : [...this.allGameList];
      }
      if (!this.isGame) {
        if (this.newFormGameList.length === 0) return false;
        if(this.listCfig[0].id == 20003){
          this.newFormGameList = this.newFormGameList.map(i => {
            let { lock, id, level, name, list } = i
            return { lock, id, level, name,list };
          });
        }else{
          this.newFormGameList = this.newFormGameList.map(i => {
            let { bid, id, level, name, title,upid } = i
            return { bid, id, level, name, upid,title: title || '' };
          });
        }

      }
      if (this.listCfig[0].id == 10011) {
        const data = {
          siteId: this.$root.nowSite.id,
          type: this.listCfig[0].id == 10011 ? 10000 : this.listCfig[0].id,
          json: JSON.stringify(this.newFormGameList)
        };
        this.sendData(data);
      } else {
        const data = {
          siteId: this.$root.nowSite.id,
          type: this.listCfig[0].id == 10011 ? 10000 : this.listCfig[0].id,
          json: this.isGame
            ? JSON.stringify([
                {
                  id: this.siteGameList[this.typeId][0].id,
                  name: this.siteGameList[this.typeId][0].name,
                  level: this.siteGameList[this.typeId][0].level,
                  lock: this.siteGameList[this.typeId][0].lock,
                  bid: this.siteGameList[this.typeId][0].bid,
                  upid:this.siteGameList[this.typeId][0].bid,
                  list:
                    this.typeId === 10000
                      ? [...this.newFormGameList]
                      : [...new Set(this.newFormGameList)]
                }
              ])
            : JSON.stringify(this.newFormGameList)
        };
        this.sendData(data);
      }
    },
    sendData(data) {
      this.saveLoading = true
      this.loading1 = true
      systemSiteGameUp(data, true).then(res => {
        if (res != undefined && res.code == 200) {
          this.toChangeDisabled(true);
          this.$Message.success("排序修改成功");
          this.saveLoading = false
          this.isEdit = false;
          this.loading1 = false
        }
      });
      //防止连续点击报错
      var that=this
      function timer(){
        setTimeout(function(){
          that.disabled=false
        },1200)
      }
      timer()
    },
    //重置是否可拖拽
    toChangeDisabled(type) {
      this.options.disabled = type;
      this.options1.disabled = type;
      this.options2.disabled = type;
      this.navOptions.disabled = type;
    },
    //删除
    remove(id, levelName, dataIndex) {
      let text, msg;
      text = `您确定删除${levelName}吗？`;
      msg = `删除成功${levelName}`;
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          //去掉列表中的游戏分类
          this.allGameList = this.allGameList.filter(i => i.id !== id);
          //去掉要保存的游戏列表
        }
      });
    },
    // 去重
    //显示游戏3大类
    showAllList(id) {
      this.showGameList = true
      //重置当前游戏3大类，重置当前选中游戏大类id
      this.navGameTypeList = [];
      this.clickNavId = id;
      if (id == 0) {
        this.navGameTypeList = [
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
        ];
        this.navGameList = [];
        this.isNavGameList = false;
      } else {
        if (
          this.siteGameList[id] == undefined ||
          id == "99999" ||
          this.siteGameList[id][0] == null ||
          this.siteGameList[id] == null
        )
          return;
        this.navGameList = [];
        this.navGameTypeList =
          id < 10006
            ? this.siteGameList[id][0].list.filter(i => i.id !== 88888)
            : this.toArray(this.siteGameList[id]);
        this.navGameList = this.navGameTypeList[0].list
          ? this.navGameTypeList[0].list
          : [];
        this.isNavGameList = this.navGameList.length === 0 ? false : true;
        this.clickId1 =
          this.navGameList.length > 0 ? this.navGameList[0].id : 0;
      }
    },
    showNavAllList(data) {
      this.clickId1 = data.id;
      if (data.list) {
        this.navGameList = data.list;
      }
    },
    showList(data) {
      //重置当前游戏3大类，重置当前选中游戏大类id
      if (!data.list || data.list.length == 0) {
        this.isGameList = false;
        this.clickId = data.id;
      } else {
        this.isGameList = true;
        this.showGameList = true;
        this.gameList = data.list;
        this.clickId = data.id;
        this.clickId1 = data.list[0].id;
      }
    },
    // 对象变数组
    toArray(data) {
      var arr = [];
      for (let key in data) {
        arr.push(data[key]);
      }
      return arr;
    },
    //拖动后改变位置 {  }
    onMove({relatedContext, draggedContext}) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      if(this.adminType!='super'&&this.AllGameId<=10006){
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
        let currentIndex = newarr.indexOf(draggedContext.index);
        let minIndex , maxIndex;
        if(currentIndex){
          minIndex = newarr[currentIndex - 1];
          maxIndex = newarr[currentIndex + 1]||9999999;
        }else{
          minIndex = -1;
          maxIndex = newarr[currentIndex + 1]||9999999;
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
  components: {
    draggable,
    Icons,
    Modals
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";


.gameHeader {
  margin: 0 15px 0 0;
}
.gameBottom {
  top: 20px;
  left: 20px;
}
.gameNav {
  border-radius: 0;
}
.ivu-upload-drag {
  height: 50px;
  margin-top: 20px;
}
.isgerry {
  background-color: #f6f6f8;
  max-height: 400px;
}
.gameButton {
  cursor: pointer;
  position: relative;
  min-width: 120px;
  text-overflow: "…" !important;
  display: inline-block;
  border: 1px solid #d3d3d3;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 5px;
  margin: 10px;
  // font-size: .875rem;
}
.gameListBotton {
  cursor: pointer;
  position: relative;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 5px;
  margin: 10px;
  display: inline-block;
  border: 1px solid #d3d3d3;
  color: #444;
}
.scoll {
  max-height: 500px;
}
.a {
  position: relative;
}
.lotteryLock {
  position: absolute;
  top: -14px;
  right: -8px;
}
.hideOverflow {
  color: #444;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 36px;
}
// .gameButton:hover .edit{
//   bottom: -35px;
//   left: -1px;
//   opacity: 1;
// }
.gameClose {
  position: absolute;
  top: -14px;
  right: 15px;
}
.close {
  position: absolute;
  background-color: #f6f6f8;
  border-radius: 50%;
  border: 1px #cecece;
  top: -11px;
  right: -9px;
  color: #cccccc;
}
.ivu-icon-md-close {
  border: 1px solid #cccccc !important;
}
.close:hover {
  color: #2d8cf0;
}
.gameLock {
  position: absolute;
  top: -19px;
  right: -10px;
}
.edit {
  transition: all 0.3s;
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0;
  z-index: 700;
}
.gameList {
  overflow-y: auto;
  padding-bottom: 25px;
  margin-top: 30px;
}
.gameTypeList {
  & > button {
    margin: 10px;
    height: 36px;
  }
}
.gameTypeList {
  & > button:first-child {
    margin: 10px 10px 10px 0;
  }
}
.gameButton:hover .edit {
  bottom: -35px;
  left: -1px;
  opacity: 1;
}
@active: #2d8cf0;
@icon-close-border: #cecece;
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  width: 20px;
  border-radius: 10px;
  background: #2d8cf0;
}
.nav-body {
  width: 100%;
  padding: 1px 4px 0;
  height: ~"calc(100% - 1px)";
  display: inline-block;
  white-space: nowrap;
  transition: left 0.3s ease;
  .ivu-tag-dot-inner {
    transition: background 0.2s ease;
  }
}
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
/deep/.secondary-menu.disabled {
  background: #f6f6f8 !important;
  color: #bcbcbc;
}
/deep/.ivu-tag {
  // border:none;
  border-left: none;
  padding: 0;
  margin: 10px 0;
  width: 139px;
  height: 39px;
  overflow: hidden;
  line-height: 39px;
}
/deep/.ivu-tag:nth-child(1) {
  border-left: 1px solid #eaeaea;
}
/deep/.v2-tag-active {
  // border-right: 1px solid #eaeaea;
  border-top: 2px solid @active;
  margin: 0 1px;
  color: #2d8cf0 !important;
  background-color: #fff;
  // font-size: 18px;
  .ivu-tag-text {
    color: #2d8cf0 !important;
  }
}
/deep/.v2-tag-active1 {
  // background-color: #2d8cf0;
  // color:#fff;
  color: #2d8cf0;
  border: 1px solid #2d8cf0;
}
/deep/.super {
  background: #cccccc;
  color:#afadad;
}

/deep/.disable-button {
  color: #c5c8ce;
  background-color: #f6f6f8 !important;
  .ivu-tag-text {
    color: #bcbcbc !important;
  }
}
/deep/.disable-button.v2-tag-active {
  .ivu-tag-text {
    color: #afadad !important;
  }
}

/deep/.ivu-select{
  color: #444;
}
/deep/.ivu-select-item{
  color: #444;
}
/deep/.ivu-tag-text {
  color: #444;
  font-size: 1rem;
}
 .ivu-select{
   height: 36px !important;
   /deep/.ivu-select-selection {
      height: 36px !important;
      div{
        height: 36px !important;
        .ivu-select-selected-value{
          height: 36px !important;
          line-height: 36px;
        }
        .ivu-select-placeholder{
          height: 36px !important;
          line-height: 36px;
        }
      }

   }

 }
 //小屏排序样式
 .zoom125 {
  zoom:1.25;
  font-size: 0.625rem;
  .gameListBotton,.gameButton {
    height: 30px !important;
    line-height: 30px !important;
    width: 110px !important;
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
} 

</style>