<template>
  <div ref="lotter">
    <Row
      style="line-height: 60px"
      v-if="typeId == '20003' || typeId == '10000'"
    >
      <div
        class="btn cs mr20"
        :class="lotterNavId == item.name ? 'active mr20' : ''"
        v-for="(item,i) in lotterNav"
        @click="showLotterGame(item,i)"
        :key="item.id"
      >
        {{item.name}}
      </div>
    </Row>
    <!-- 彩票--手机侧边栏排序 -->
    <Row style="color: #666666">
      <span style="line-height: 48px" v-if="isEdit">
        <Icons type="tishi" />长按可以拖拽排序
      </span>
      <Row
        v-if='typeId==10000||typeId==20003'
        style="line-height: 60px"
        :class="typeId == 10000 || 20003 ? 'currentBox' : ''"
      >
        <draggable
          element="div"
          v-if='lotterNav.length'
          :move="onMove"
          @moved="isEdit"
          :class="screen <= 1690 ? 'zoom125' : ''"
          :options="{
            disabled: !isEdit,
            filter: '.super,.disabled',
            animation: 150,
            group: 'people',
          }"
          :list="lotterNav[index].games"
          key="user"
        >
          <div
            v-for="(item, i) in lotterNav[index].games"
            class="btn cs mr20"
            :class="{
              super: item.slock == 1 && isEdit && adminType != 'super',
            }"
            :key="item.id"
          >
            {{ item.name }}
            <Icon
              size="18"
              v-if="isEdit && (adminType == 'super' || !item.slock)"
              class="close"
              @click.prevent="lotterNav[index].games=lotterNav[index].games.filter((i) => i.id !== item.id)"
              type="md-close"
            />
            <Icons
              v-if="
                showLock &&
                (isEdit || item.lock == 1||item.slock)
              "
              :type="item.lock == !0 ? 'suodingpaixu1' : 'jiesuopaixu'"
              @click="lockGame(item.lock, lotterNav[index].games, i)"
              :color="
                item.lock == !0 && item.slock != 1
                  ? '#CECECE'
                  : item.lock == !0 && item.slock == 1
                  ? 'rgb(255, 38, 38)'
                  : 'orange'
              "
              class="gameLock"
              size="20"
            ></Icons>
            <span
              class="line gamePlatform"
              v-if="item.isgame&&(typeId==20001||typeId==20002)"
            >
              <span class="ib sanjiaoxing"></span>
              {{ item.className }}
            </span>
            <span class="hot" :style="item.hot?'color:blue':'color:red'"  @click='setHot(item.id,item.hot)'  v-if="typeId==20003&&layout=='A'&&isEdit">{{item.hot?'取消热门':'标记热门'}}</span>
            <Icons class="showhot" size='18' type='remen1' v-if="typeId==20003&&layout=='A'&&!isEdit&&item.hot"></Icons>
          </div>
        </draggable>
      </Row>
      <!-- 真人体育--手机快捷入口 推荐排序 -->
      <Row
         v-if='typeId!=10000&&typeId!=20003'
        style="line-height: 60px"
        :class="typeId == 20001 || 20002  ? 'currentBox' : ''"
      >
        <draggable
          element="div"
          :move="onMove"
          @moved="isEdit"
          :class="screen <= 1690 ? 'zoom125' : ''"
          :options="{
            disabled: !isEdit,
            filter: '.super,.disabled',
            animation: 150,
            group: 'people',
          }"
          :list="currentList"
          key="user"
        >
          <div
            v-for="(item, i) in currentList"
            class="btn cs mr20"
            :class="{
              super: item.slock == 1 && isEdit && adminType != 'super',
            }"
            :key="item.id"
          >
            {{ item.name }}
            <Icon
              size="18"
              v-if="isEdit && (adminType == 'super' || !item.slock)"
              class="close"
              @click.prevent="remove(item.id, item.name)"
              type="md-close"
            />
            <Icons
              v-if="
                showLock &&
                (isEdit || item.lock == 1||item.slock)
              "
              :type="item.lock == !0 ? 'suodingpaixu1' : 'jiesuopaixu'"
              @click="lockGame(item.lock, currentList, i)"
              :color="
                item.lock == !0 && item.slock != 1
                  ? '#CECECE'
                  : item.lock == !0 && item.slock == 1
                  ? 'rgb(255, 38, 38)'
                  : 'orange'
              "
              class="gameLock"
              size="20"
            ></Icons>
            <span
              class="line gamePlatform"
              v-if="item.isgame&&(typeId==20001||typeId==20002)"
            >
              <span class="ib sanjiaoxing"></span>
              {{ item.className }}
            </span>
          </div>
        </draggable>
      </Row>
      <!-- 体育真人配置项 -->
      <row
        style="line-height: 60px"
        v-if="(typeId == 10002 || typeId == 10003) && isEdit"
      >
        <div>
          <span class="gameHeader ft16">
            {{ typeId == 10002 ? "体育全部游戏" : "视讯全部游戏" }}
          </span>
          <span class="ml5"> （ 可将下方游戏拖拽配置到上方中 ） </span>
        </div>
        <draggable
          :move="onMove"
          @moved="isEdit"
          :list="tiyugame"
          :sort="false"
          :class="screen <= 1690 ? 'zoom125' : ''"
          :options="{
            filter: '.disabled',
            disabled: !isEdit,
            animation: 150,
            ghostClass: 'opacity:1',
          }"
          :group="{ name: 'people', pull: 'clone', put: false }"
        >
          <div
            class="btn cs mr20"
            :key="item.id"
            :class="{
              disabled: currentList.find((game) => game.id === item.id),
              active: navId == item.id,
            }"
            v-for="item in tiyugame"
          >
            {{ item.name }}
          </div>
        </draggable>
      </row>
      <!--  -->
      <row style="line-height: 60px" v-if="showAllGame">
        <div>
          <span class="gameHeader ft16"> 全部游戏 </span>
        </div>
        <draggable
          :move="onMove"
          @moved="isEdit"
          :list="navList"
          :sort="false"
          :class="screen <= 1690 ? 'zoom125' : ''"
          :options="{
            filter: '.disabled',
            disabled: !isEdit,
            animation: 150,
            ghostClass: 'opacity:1',
          }"
          :group="{ name: 'people', pull: 'clone', put: false }"
        >
          <div
            class="btn cs mr20"
            :key="item.id"
            :class="{
              disabled: currentList.find((game) => game.id === item.id),
              active: navId == item.id,
            }"
            v-for="(item, i) in navList"
            @click="showGameType(item.list, item.id, i, item)"
          >
            {{ item.name }}
          </div>
        </draggable>
      </row>
      <Row style="line-height: 60px" v-if="isEdit && showType">
        <div>
          <span
            class="gameHeader ft16"
            v-show="
              navId == '10000' || (typeId == '20003')
            "
          >
            {{
              typeId == "10000" || typeId == "20003"
                ? "彩票游戏分类"
                : "游戏分类"
            }}
          </span>
        </div>
        <div
          class="btn cs mr20"
          v-show="
            typeId != 20001 &&
            typeId != 20002
          "
          :class="gameType == item.id ? 'active mr20' : ''"
          v-for="item in lotterType"
          @click="showGame(item.list, item.id)"
          :key="item.id"
        >
          {{ item.name}}
        </div>
        <draggable
          v-if="navId"
          :move="onMove"
          @moved="isEdit"
          :list="navGameList"
          :sort="false"
          :class="screen <= 1690 ? 'zoom125' : ''"
          :options="{
            filter: '.disabled',
            disabled: !isEdit,
            animation: 150,
            ghostClass: 'opacity:1',
          }"
          :group="{ name: 'people', pull: 'clone', put: false }"
        >
          <div
            class="btn cs mr20"
            :class="{
              disabled: currentList.find((game) => game.id === item.id),
              active: type == item.id,
            }"
            v-for="item in navGameList"
            @click="showGame(item.list, item.id)"
            :key="item.id"
          >
            {{ item.name }}
          </div>
        </draggable>
      </Row>
      <Card
        class="gameBox"
        v-if="!arr.includes(subType) && typeId != 20003 && navId == 0 && isEdit"
      >
        <draggable
          :move="onMove"
          @moved="isEdit"
          :list="navGameList"
          :sort="false"
          :class="screen <= 1690 ? 'zoom125' : ''"
          :options="{
            filter: '.disabled',
            disabled: !isEdit,
            animation: 150,
            ghostClass: 'opacity:1',
          }"
          :group="{ name: 'people', pull: 'clone', put: false }"
        >
          <div
            class="btn cs mr20"
            :class="{
              disabled: currentList.find((game) => game.id === item.id),
              active: type == item.id,
            }"
            v-for="item in navGameList"
            @click="showGame(item.list, item.id)"
            :key="item.id"
          >
            {{ item.name }}
          </div>
        </draggable>
      </Card>
      <div class="searchGame mb10 mt10 ft16" v-if='showSearch&&isEdit'>
        搜索游戏<Input class="ml20 w180x" placeholder="请输入关键字"  v-model="text" clearable />
      </div>
      <Card
        v-if="
          (showGameBox || (typeId == '20003' )) &&isEdit
        "
        class="gameBox"
      >
        <draggable
          element="div"
          :move="onMove"
          @moved="isEdit"
          class="boxGame"
          :list="game.filter(t=>t.name.includes(text))"
          :class="screen <= 1690 ? 'zoom125' : ''"
          :options="{
            disabled: !isEdit,
            animation: 150,
            ghostClass: 'opacity:1',
            forceFallback: true,
          }"
          :group="{ name: 'people', pull: 'clone', put: false }"
          key="game"
          filter=".super,.disabled"
          :sort="false"
        >
          <div
            class="btn cs mr20 gameBtn"
            v-for="item in game.filter(t=>t.name.includes(text))"
            :class="{
              disabled: typeId==10000||typeId==20003?lotterNav[index].games.find((game)=>game.id==item.id):currentList.find((game) => game.id == item.id),
              super: isEdit && item.slock == 1 && adminType != 'super',
            }"
            :key="item.id"
          >
            <span class="over"> {{ item.name }}</span>
          </div>
        </draggable>
      </Card>
    </Row>
  </div>
</template>
<script>
import { getUserType } from "@/libs/util";
import Modals from "@/components/modals";
import Icons from "@/components/icons";
import draggable from "vuedraggable";
import { GameSortV4Up } from "@/api/system";
export default {
  name: "LotterX",
  components: {
    draggable,
    Icons,
    Modals,
  },
  props: {
    typeId: {
      type: String,
      required: true,
    },
    cId: {
      type: String,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    dataList: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeId:'',
      index:0,
      subType: "10000",
      gid: "",
      text:'',//搜索关键字
      showSearch:false,//搜索框显示隐藏
      spinShow: true,
      screen: screen.width,
      showLock: false,
      showGameLock: false,
      tiyugame: [], //体育视讯游戏
      navGameList: [],
      lotterNav: [], //彩票侧边栏导航
      data: [],
      currentList: [], //头部克隆列表
      lotterType: [], //彩票游戏分类
      lotterId: "", //彩票分类ID
      lotterNavId: "", //彩票侧边栏导航名称
      gameType: "", //游戏类别
      type: "",
      navId: "", //全部游戏当前选中
      showGameBox: "", //游戏显示
      showType: true, //游戏分类显示
      showAllGame: "", //显示全部游戏
      game: [],
      K3Game: [],
      navList: [],
      layout:'B',
      arr: ["10000", "10001", "10002", "10003", "10004", "10005"],
      // isDragging:false,
      adminType: getUserType(),
      current: [], //当前以选择彩种
      addLotterList: [], //添加彩票列表
      lotterList: [], //所有彩种列表
    };
  },
  watch: {
    typeId: {
      handler(newTypeId, oldTypeId) {
        
         this.showAllGame = false;
         if (newTypeId == oldTypeId) return;
         this.gid =
           newTypeId == "10000"
             ? "4"
             : newTypeId == "10001"
             ? "2"
             : newTypeId == "10002"
             ? "6"
             : newTypeId == "10003"
             ? "5"
             : newTypeId == "10004"
             ? "1"
             : newTypeId == "10005"
             ? "3"
             : "7";
          this.$nextTick(()=>{
            this.subType = newTypeId;
          })
       
         //20003 是彩票侧边栏
         this.setData(newTypeId, this.gid);
        
      },
      deep: true,
    },
    isEdit: {
      handler(newTypeId, oldTypeId) {
        if (newTypeId) {
          this.showAllGame =
            !this.arr.includes(this.subType) && this.subType != "20003"
              ? true
              : false;
        }
      },
      deep: true,
    },
  },
  mounted() {
    let _this = this;
    let props = { ..._this._props };
    this.data = props.dataList; //获取全部游戏列表
    for(let key in this.data.siteData){
      if(this.data.siteData[key].name=='手机端'){
        this.data.siteData[key].list.forEach(t=>{
          if(t.name=='侧边栏版式'){
            this.layout =t.games[0]? t.games[0].layout:'B'
          }
        })
      }
    }
    this.$nextTick(()=>{
       this.setData(props.typeId, props.cId);
      this.subType = props.typeId;
      this.gid = props.cId;
    })
  },
  methods: {
    setData(typeId, cId) {
      this.showSearch=false;
      this.navId = "";
      this.showLock = !this.arr.includes(typeId) ? false : true;
      this.showGameLock = typeId == "10000" ? true : false;
      this.showType = typeId == "10000" || typeId == "20003" ? true : false;
      this.tiyugame = [];
      if (typeId == 10002 || typeId == 10003) {
        this.data.allGames[typeId].list.forEach((t) => {
          if (t.list) {
            t.list.forEach((m) => {
              this.tiyugame.push(m);
            });
          }
        });
      }
      if (this.arr.includes(typeId) && typeId != "10000") {
        this.currentList = this.data.siteData[cId].games;
      } else if (typeId == "10000") {
        this.lotterNav = this.data.siteData[cId].list;
        this.lotterNavId = this.data.siteData[cId].list[0].name;
        this.lotterNav.forEach((t) => {
          if (t.name == this.lotterNavId) {
            this.currentList = t.games;
          }
        });
      } else {
        this.data.siteData[cId].list.forEach((t) => {
          if (typeId == "20001" && t.name == "快捷入口")
            this.currentList = t.games;
          if (typeId == "20002" && t.name == "首页推荐")
            this.currentList = t.games;
          if (typeId == "20003" && t.name == "彩票侧边栏") {
            this.lotterNav = this.layout=='A'?t.list.filter(t=>t.name!='热门'):t.list.filter(t=>t.name=='热门');
            this.lotterNavId = this.lotterNav[0].name;
            t.list.forEach((m) => {
              if (m.name == this.lotterNavId) {
                this.currentList = m.games;
              }
            });
             console.log(this.lotterNav,)
             console.log(this.layout)
          }

        });
      }
      if (typeId == "10000" || typeId == "20003") {
        if (typeId == 10000) {
          this.lotterType = this.data.allGames[10000].list.filter(
            (t) => t.name == this.lotterNavId
          );
        } else{ //20003
          if(this.lotterNavId=='热门') this.lotterType = this.data.allGames[10000].list; //彩票分类列表;
          else {
            this.lotterType=this.data.allGames[10000].list.filter(t=>this.lotterNavId.includes(t.name))
          }
        }
         if (!this.lotterType.length) this.lotterType = this.data.allGames[10000].list; //彩票分类列表;
        this.game = this.lotterType[0].list;
        this.gameType = this.lotterType[0].id;
      }
    
      if (!this.arr.includes(typeId)) this.getNavList(typeId);
      this.showGameBox =
        typeId == "10002" || typeId == "10003" || this.navId == "0"
          ? false
          : true; //游戏列表显示隐藏;
      this.spinShow = false;
    },
    lockGame(lock, list, i) {
      if (!this.isEdit) return;
      if(this.adminType != "super"&&list[i].slock) return;
      this.$set(list[i], "lock", !lock ? 1 : 0);
      if (this.adminType == "super") {
        this.$set(list[i], "slock", lock ? 0 : 1);
      }
      this.$forceUpdate(); //强制更新试图
    },
    setHot(id,hot){
      this.lotterNav[this.index].games.forEach(t=>{
        if(t.id == id) t.hot = hot?0:1
      })
    },
    remove(id, levelName) {
      // let text, msg;
      // text = `您确定删除${levelName}吗？`;
      // msg = `删除成功${levelName}`;
      // this.$Tip.confirm({
      //   content: text,
      //   onOk: () => {
          //去掉列表中的游戏分类
          this.currentList = this.currentList.filter((i) => i.id !== id);
          // if(this.typeId=='10002'||this.typeId=='10003'){
          //   this.data.siteData[this.gid].games = this.data.siteData[this.gid].games.filter((i) => i.id !== id)
          // }else if(this.typeId=='20001'||this.typeId=='20002'){
          //    this.data.siteData[this.gid].list.forEach(t=>{
          //      if(t.gid == this.typeId) t.games = t.games.filter((i) => i.id !== id)
          //    })
          // }
          //去掉要保存的游戏列表
        // },
      // });
    },
    showLotterGame(item,i) {

      this.index=i;
      this.activeId=item.id;
      this.lotterNavId = item.name;
      this.currentList = item.games;
      if (this.typeId == 10000) {
        this.lotterType = this.data.allGames[10000].list.filter(
          (t) => t.name == this.lotterNavId
        );
      } else if(this.typeId == 20003){
        if(this.lotterNavId=='热门') this.lotterType = this.data.allGames[10000].list; //彩票分类列表;
          else {
            this.lotterType=this.data.allGames[10000].list.filter(t=>this.lotterNavId.includes(t.name))
          }
      }
      else this.lotterType = this.data.allGames[10000].list; //彩票分类列表;
       if (!this.lotterType.length)
          this.lotterType = this.data.allGames[10000].list; //彩票分类列表;
      this.game = this.lotterType[0].list;
      this.gameType = this.lotterType[0].id;
    },
    showGame(list, id) {
      //游戏列表
      this.gameType = id;
      this.type = id;
      if (list) this.game = list;
      else this.game = [];
      this.$forceUpdate();
    },
    showGameType(list, id, i) {
      this.text=''
      //点击全部游戏
      if (id == "10000" || id == "10001" || id == "10004" || id == "10005") {
        this.showType = true;
      } else {
        this.showType = false;
      }
      this.navId = id;
      if(id ==10001||id==10004){
        this.showSearch = true;
      }else {
        this.showSearch = false;
        this.text = ''
      }
      if (id != "10002" && id != "10003") {
        if (list.length) {
          this.type = id != 0 ? list[0].id : "";
          this.game = id != 0 ? list[0].list : []; //切换游戏时默认选中子类第一个
        } else {
          this.game = [];
        }
        this.navGameList = list;
      } else {
        this.game = [];
        list.forEach((t) => {
          if (t.list && t.list.length) {
            t.list.forEach((m) => {
              this.game.push(m);
            });
          }
        });
      }
      this.showGameBox = this.navId == "0" ? false : true; //游戏列表显示隐藏;
    },
    submit() {
      //保存
      let id = "";
      let copyCurrentList = JSON.parse(JSON.stringify(this.currentList))
      copyCurrentList.forEach((t) => {
        if (t.list) delete t.list;
      });
      let json = [];
      if (this.subType == "10000") {
        this.data.siteData[this.gid].list.forEach((t) => {
          if (t.name == this.lotterNavId) id = t.id;
        });
      } else if (this.subType == "20001") {
        this.data.siteData[this.gid].list.forEach((t) => {
          if (t.name == "快捷入口") id = t.id;
        });
      } else if (this.subType == "20002") {
        
        this.data.siteData[this.gid].list.forEach((t) => {
          if (t.name == "首页推荐") id = t.id;
        });
      }
      if (this.subType == "20003"||this.subType=='10000') {
        if(this.layout=='A'){
               this.lotterNav.forEach(t=>{
              // console.log(this.activeId)
              // console.log(this.lotterNavId)
            if( t.id==this.activeId||t.name==this.lotterNavId){
              let obj = {
                gid:t.id,
                list:t.games
              }
              json.push(obj)
            }
          })
        }
        if(this.layout=='B'){
              this.lotterNav.forEach(t=>{
              let obj = {
                gid:t.id,
                list:t.games
              }
              json.push(obj)    
          })
        }
      
      } else {
        json = [
          {
            gid:
              this.arr.includes(this.subType) && this.subType != "10000"
                ? this.gid
                : id,
            list: copyCurrentList,
          },
        ];
      }

      let data = {
        siteId: this.$root.nowSite.id,
        json: JSON.stringify(json),
      };
      GameSortV4Up(data, true).then((res) => {
        if (res.code&&res.code==200) {
          this.$Message.success("数据更新成功");
          this.$emit("getLoad", false);
          this.$emit("getUp", true);
        }
      });
    },
    getNavList(typeId) {
      //获取全部游戏导航
      this.navList = [];
      this.navList.push({
        id: 0,
        bid: 0,
        level: 0,
        list: [
          {
            // bid: 99998,
            id: 99998,
            // level: 0,
            lock: 0,
            isgame: 0,
            name: "优惠活动",
            // upid:99998
          },
          {
            // bid: 99996,
            id: 99996,
            // level: 0,
            lock: 0,
            isgame: 0,
            name: "长龙助手",
            // upid:99996
          },
           {
            // bid: 99997,
            id: 99991,
            // level: 0,
            lock: 0,
            isgame: 0,
            name: "站内信",
            // upid:99997
          },
          {
            // bid: 99997,
            id: 99997,
            // level: 0,
            lock: 0,
            isgame: 0,
            name: "更多游戏",
            // upid:99997
          },
          
        ],
        lock: 0,
        upid: 0,
        isgame: 0,
        name: "其他",
      });
      // 只有快捷入口開啟争霸赛選項
      if (this.typeId === "20001") { 
        this.navList[0].list.unshift(
          {
            // bid: 99995,
            id: 99995,
            // level: 0,
            lock: 0,
            isgame: 0,
            name: "争霸赛",
            // upid:99995
          }
        )
      }
      for (let key in this.data.allGames) {
        this.data.allGames[key].isgame = 0;
        this.navList.push(this.data.allGames[key]);
      }
      this.navGameList = this.navList[0].list;
      this.navId = typeId == "0" ? "" : this.navList[0].id; //进入时选中状态
    },
    //拖动后改变位置 {  }
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      if (this.adminType != "super" && Number(this.subType) - 20001 < 0) {
        let clone = true;
        relatedContext.list.forEach((t) => {
          if (t.id == draggedContext.element.id) {
            clone = false;
          }
        });
        let arr = [];
        let sortArr=[]
        relatedContext.list.map((item, index) => {
          if (item.slock == 1) {
            arr.push(index);
            sortArr.push(index);

          }
        });
        arr.push(draggedContext.index);
        let newarr = arr.sort((a, b) => {
          return a - b;
        });
        let newSortarr = sortArr.sort((a, b) => {
          return a - b;
        });
        newarr = Array.from(new Set(newarr));
        let currentIndex = newarr.indexOf(draggedContext.index);
        let minIndex, maxIndex;
        if (currentIndex) {
          if (newarr[currentIndex] == newarr[currentIndex - 1]) {
            minIndex = newarr[currentIndex - 2] || 0;
          } else {
            minIndex = newarr[currentIndex - 1];
          }
          maxIndex = newarr[currentIndex + 1] || 9999999;
        } else {
          minIndex = -1;
          maxIndex = newarr[currentIndex + 1] || 9999999;
        }
        if (clone) {
          minIndex = newarr[newSortarr.length - 1];
          maxIndex = 99999;
        }
        if (
          draggedContext.futureIndex >= maxIndex ||
          draggedContext.futureIndex <= minIndex
        ) {
          return false;
        }
      } else {
        return (
          (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
        );
      }
    },
  },
};
</script>
<style lang="less" scoped>
.searchGame {
  height: 40px;
  color: #2d8cf0;
}
.h36 {
  height: 36px !important;
  font-size: 14px;
  line-height: 36px;
}
.btn {
  width: 135px;
  height: 36px;
  background: white;
  display: inline-block;
  // margin: 0 20px 20px 0;
  text-align: center;
  line-height: 36px;
  border-radius: 5px;
  border: 1px solid #dcdee2;
  position: relative;
  vertical-align: middle;
}
.gameHeader {
  line-height: 48px;
  color: #2d8cf0;
}
.active {
  background: #2d8cf0;
  color: white;
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
  color: #ddd5d5;
  background: white;
}
.gameBtn {
  background: white;
}
.disabled.active {
  color: white;
  background: #6999cc;
}
.currentBox {
  background: #f6f6f8;
  border: 1px solid #dcdcdc;
  padding: 20px;
}

//20003

.lotterType {
  border-radius: 20px;
  border: solid 1px #62b1fd;
  height: 42px;
  span {
    vertical-align: middle;
  }
}
.fontColor {
  color: #62b1fd;
}
.itemOne {
  position: relative;
  .remen {
    position: absolute;
    right: 20px;
    top: -15px;
  }
}
.close:hover {
  color: red;
  border: 1px solid red;
}
.close {
  position: absolute;
  background-color: #f6f6f8;
  border-radius: 50%;
  border: 1px #cecece;
  top: -8px;
  right: -6px;
  color: #cccccc;
  border: 1px solid #cecece;
}
.gameLock {
  position: absolute;
  top: -14px;
  left: -8px;
  z-index: 100;
}
.over {
  width: 120px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.boxGame {
  line-height: 60px;
}
/deep/.super {
  //超管锁定编辑置灰
  // background: #faf8f8;
  color: #ddd5d5;
}
.line {
  display: inline-block;
  vertical-align: top !important;
  line-height: 35px;
}
.gamePlatform {
  position: absolute;
  bottom: -12px;
  right: 0;
  width: 62px !important;
  height: 16px;
  background: #c2dffd;
  z-index: 100;
  color: #5188be;
  line-height: 16px;
  text-align: center;
  font-size: 0.75rem;
}
.showhot {
  display: block;
  position: absolute;
  top: -15px;
  left:0 ;
  color:red;
}
.hot {
  display: block;
  position: absolute;
  top: -18px;
  left: 0;
  width:62px !important;
  height: 24px;
  line-height: 24px;
  border-radius: 3px;
  font-size: 0.75rem;
  border:1px solid;
  background: white;
  // background: red;
  // color:white;
  // .san {
  //   position: absolute;
  //   left:60px;
  //   width: 0 !important;
  //   height: 0;
  //   border-top:12px solid transparent;
  //   border-bottom:12px solid transparent;
  //   border-left:12px solid red;

  // }
}
.sanjiaoxing {
  display: block;
  width: 0;
  height: 0;
  border-width: 8px 0 8px 5px;
  border-style: solid;
  border-color: transparent transparent transparent white; /*透明 透明 透明 黄*/
  position: absolute;
  top: 0px;
  left: 0px;
  width: 62px !important;
}
//小屏排序样式
.zoom125 {
  zoom: 1.25;
  font-size: 0.625rem;
  .btn,
  .gameButton {
    height: 30px !important;
    line-height: 30px !important;
    width: 110px !important;
    span {
      width: 110px;
    }
  }
  .hideOverflow {
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
      top: -10px !important;
    }
    .h40x {
      height: 32px;
      .lh40 {
        line-height: 32px !important;
        height: 32px !important;
      }
    }
  }
  .gamePlatform {
    font-size: 0.625rem !important;
  }
}
</style>