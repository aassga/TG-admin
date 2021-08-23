<template>
  <div v-if="typeId == '10001' || typeId == '10004' || typeId == '10005'">
    <!-- 新版电子游艺排序 -->
    <Row>
      <Row v-if="spinShow" style="height: 300px; line-height: 300px">
        <Spin size="large" fix v-if="spinShow">
          <div
            style="color: rgba(48, 140, 240, 0.7)"
            class="la-line-spin-fade la-sm"
          >
            <div v-for="t in 8" :key="'div' + t"></div>
          </div>
        </Spin>
      </Row>
      <Row v-if="!spinShow">
        <!-- 标签 -->
        <Row class="mb20">
          <span 
            class="headTab ft16 cs" 
            :class="activeKey == i ? 'activeTab' : ''" 
            @click="getActiveKey(i)"
            v-for='(t,i) in navDate'
          >
            {{typeId == "10004"? "棋牌": typeId == "10005"? "捕鱼": "电子" + t.name}}
          </span>
        </Row>
        <Row v-if="activeKey == 0">
          <Button
            class="w135x ft14 mr20 title"
            :class="{ hotActive: aKey == i }"
            @click="() => {(aKey = i), setColor(); }"
            :key="item.id"
            v-for="(item, i) in aList"
          >
            <span class="ft14">{{ item.name }}</span>
            <span class="biaoji pl5 pr5 cd" v-if="item.leftColumn">
              <span class="ib sanjiaoxing"></span>
              移动侧栏
            </span>
          </Button>
          <Input class="w135x ml20" v-if="aList[aKey].games.length" placeholder="请输入关键字" v-model="text" clearable />
          <div class="lh60 txt-a xColor" v-if="aList.length == 0">
            暂未设置标签,请前往排序类别配置
          </div>
          <searchGame
            v-if="text"
            :searchBox="true"
            :showType="aList[aKey].games.filter((item) => item.name.includes(text)).length != 0 ? 'game': 'tip2'"
            :isEdit="isEdit"
            :typeId="typeId"
            :list="aList[aKey].games.filter((item) => item.name.includes(text))"
            :showClass="true"
            :showClose="true"
            moveType="搜索标签"
            @remove="remove"
            @lockGame="lockGame"
            @menuItemDrag="menuItemDrag"
            @menuItemOver="menuItemOver"
            @menuItemDragEnd="menuItemDragEnd"
          ></searchGame>
          <searchGame
            v-if="aList.length != 0"
            :isEdit="isEdit"
            :typeId="typeId"
            :showType="aList[aKey].games.length == 0 ? 'tip1' : 'game'"
            :list="aList[aKey].games"
            :showClass="true"
            :showClose="true"
            dropType="标签"
            moveType="标签"
            @remove="remove"
            @lockGame="lockGame"
            @menuItemDrop="menuItemDrop"
            @menuItemDrag="menuItemDrag"
            @menuItemOver="menuItemOver"
            @menuItemDragEnd="menuItemDragEnd"
          ></searchGame>
          <!-- </div> -->
        </Row>
        <!-- 以上为标签 -->
        <!-- 平台 -->
        <Row v-if="activeKey == 1">
          <div class="mb20">
            <Button
              class="mr20 mb20 w135x title"
              v-for="(item, i) in bList"
              :class="{ hotActive: bKey1 == i }"
              @click.native.prevent.stop="setList(i, 0, 0)"
              :key="item.id"
            >
              <span class="ft14">{{ item.name }}</span>
            </Button>
          </div>
          <Input
            v-if="typeId == '10005' && bList.length"
            class="w135x mb20"
            placeholder="请输入关键字"
            v-model="text"
            clearable
          />
          <div
            v-if="type == 10005 && bList.length == 0"
            class="lh60 txt-a xColor"
          >
            该平台暂未配置平台,请前往排序类别配置
          </div>
          <!-- 捕鱼全部游戏--搜索 -->
          <searchGame
            v-if="typeId == 10005 && text"
            :showType="
              !bList[bKey1].games.length
                ? 'tip3'
                : !bList[bKey1].games.filter((item) => item.name.includes(text))
                    .length
                ? 'tip2'
                : 'game'
            "
            :isEdit="isEdit"
            :typeId="typeId"
            :list="
              bList[bKey1].games.filter((item) => item.name.includes(text))
            "
            :showClass="bList[bKey1].name == '全部' ? true : false"
            :showClose="bList[bKey1].name == '全部' ? false : true"
            moveType="搜索游戏"
            @remove="remove"
            @lockGame="lockGame"
            @menuItemDrag="menuItemDrag"
            @menuItemOver="menuItemOver"
            @menuItemDragEnd="menuItemDragEnd"
          ></searchGame>
          <!-- 捕鱼游戏 -->
          <searchGame
            v-if="typeId == 10005"
            :showType="!bList[bKey1].games.length ? 'tip3' : 'game'"
            :isEdit="isEdit"
            :typeId="typeId"
            :list="bList[bKey1].games"
            :showClass="bList[bKey1].name == '全部' ? true : false"
            :showClose="bList[bKey1].name == '全部' ? false : true"
            dropType="游戏"
            moveType="游戏"
            @remove="remove"
            @lockGame="lockGame"
            @menuItemDrop="menuItemDrop"
            @menuItemDrag="menuItemDrag"
            @menuItemOver="menuItemOver"
            @menuItemDragEnd="menuItemDragEnd"
          ></searchGame>
          <!-- 二级分类 -->
          <div class="mb20" v-if="typeId != '10005'">
            <div class="mb20">
              二级分类名称 :
              <span class="fc ml20" style="font-size: 0.875rem">游戏类型</span>
            </div>
            <div
              class="platformBtn"
              v-if="showTwo && typeId != '10005'"
              style="line-height: 50px"
            >
              <Button
                class="mr20 mb20 w135x title"
                :class="{ hotActive: bKey2 == i }"
                @click.native="setList(bKey1, i, 0)"
                v-for="(item, i) in bList[bKey1].list"
                :key="item.id"
              >
                <span class="ft14">{{ item.name }}</span>
              </Button>
              <Input
                v-if="typeId != '10001'"
                class="w135x mb20 ml20"
                placeholder="请输入关键字"
                v-model="text"
                clearable
              />
            </div>
            <div v-else class="lh60 txt-a xColor">
              该平台暂未配置二级分类,请前往排序类别配置
            </div>
          </div>
          <!-- 棋牌二级分类 -->
          <div class="mb20" v-if="typeId == '10004'">
            <searchGame
              v-if="showTwo && text"
              :searchBox="true"
              :showType="
                !bList[bKey1].list[bKey2].games.length
                  ? 'tip3'
                  : !bList[bKey1].list[bKey2].games.filter((t) =>
                      t.name.includes(text)
                    ).length
                  ? 'tip2'
                  : 'game'
              "
              :isEdit="isEdit"
              :typeId="typeId"
              :list="
                bList[bKey1].list[bKey2].games.filter((item) =>
                  item.name.includes(text)
                )
              "
              :showClass="bList[bKey1].name == '全部' ? true : false"
              :showClose=" bList[bKey1].list[bKey2].name == '全部游戏' ? false : true "
              moveType="搜索游戏"
              @remove="remove"
              @lockGame="lockGame"
              @menuItemDrag="menuItemDrag"
              @menuItemOver="menuItemOver"
              @menuItemDragEnd="menuItemDragEnd"
            ></searchGame>
          </div>
          <!-- 棋牌二级分类 -->
          <div class="mb20" v-if="typeId != '10001' && showTwo">
            <searchGame
              :isEdit="isEdit"
              :typeId="typeId"
              :showType="!bList[bKey1].list[bKey2].games.length ? 'tip3' : 'game'"
              :list="bList[bKey1].list[bKey2].games"
              :showClass="bList[bKey1].name == '全部' ? true : false"
              :showClose=" bList[bKey1].list[bKey2].name == '全部游戏' ? false : true "
              moveType="游戏"
              dropType="游戏"
              @remove="remove"
              @lockGame="lockGame"
              @menuItemDrop="menuItemDrop"
              @menuItemDrag="menuItemDrag"
              @menuItemOver="menuItemOver"
              @menuItemDragEnd="menuItemDragEnd"
            ></searchGame>
          </div>
          <!-- 电子三级分类 -->
          <div class="mb20" v-if="typeId == '10001' && showTwo">
            <div class="mb20">
              三级分类名称 :
              <span class="fc ml20" style="font-size: 0.875rem">赔付线数</span>
            </div>
            <div
              class="platformBtn"
              style="line-height: 50px"
              v-if="typeId == '10001' && showTre"
            >
              <Button
                class="mr20 mb20 w135x title"
                :class="{ hotActive: bKey3 == i }"
                @click="setList(bKey1, bKey2, i)"
                v-for="(item, i) in bList[bKey1].list[bKey2].list"
                :key="item.id"
              >
                <span class="ft14">{{ item.name }}</span>
              </Button>
              <Input
                class="w135x mb20 ml20"
                placeholder="请输入关键字"
                v-model="text"
                clearable
              />
            </div>
            <div class="lh60 txt-a xColor" v-if="!showTre">
              该平台暂未配置三级分类,请前往排序类别配置
            </div>
            <searchGame
              v-if="text && showTre"
              :minNum="minNum2"
              :maxNum="maxNum2"
              :isEdit="isEdit"
              :typeId="typeId"
              :num="2"
              :list="
                bList[bKey1].list[bKey2].list[bKey3].games.filter((item) =>
                  item.name.includes(text)
                )
              "
              :showType="
                !bList[bKey1].list[bKey2].list[bKey3].games.length
                  ? 'tip3'
                  : !bList[bKey1].list[bKey2].list[bKey3].games.filter((t) =>
                      t.name.includes(text)
                    ).length
                  ? 'tip2'
                  : 'game'
              "
              :showClass="bList[bKey1].name == '全部' ? true : false"
              :showClose=" bList[bKey1].list[bKey2].name == '全部游戏' ? false : true "
              moveType="搜索游戏"
              @getScroll="getScroll"
              @remove="remove"
              @lockGame="lockGame"
              @menuItemDrag="menuItemDrag"
              @menuItemOver="menuItemOver"
              @menuItemDragEnd="menuItemDragEnd"
            ></searchGame>
            <div v-if="showTre">
              <searchGame
                :minNum="minNum3"
                :maxNum="maxNum3"
                :isEdit="isEdit"
                :typeId="typeId"
                :list="bList[bKey1].list[bKey2].list[bKey3].games"
                :showClass="bList[bKey1].name == '全部' ? true : false"
                :showClose="
                  bList[bKey1].list[bKey2].list[bKey3].name == '全部' &&
                  bList[bKey1].list[bKey2].name == '全部游戏'
                    ? false
                    : true
                "
                :showType="!bList[bKey1].list[bKey2].list[bKey3].games.length ? 'tip3' : 'game' "
                moveType="游戏"
                dropType="游戏"
                :num="3"
                @getScroll="getScroll"
                @remove="remove"
                @lockGame="lockGame"
                @menuItemDrop="menuItemDrop"
                @menuItemDrag="menuItemDrag"
                @menuItemOver="menuItemOver"
                @menuItemDragEnd="menuItemDragEnd"
              ></searchGame>
            </div>
          </div>
        </Row>
        <!-- 平台全部游戏 -->
        <div v-if="isEdit && allGamesShow">
          <div class="mb20 fc">
            <span v-show="activeKey == 0">{{
              typeId == "10001" ? "电子" : typeId == "10004" ? "棋牌" : "捕鱼"
            }}</span
            >全部游戏
            <Input
              class="w135x ml20"
              placeholder="请输入关键字"
              v-model="text2"
              clearable
            />
          </div>
          <searchGame
            v-if="isEdit"
            :minNum="minNum4"
            :maxNum="maxNum4"
            :isEdit="isEdit"
            :typeId="typeId"
            :list="allGames.filter((item) => item.name.includes(text2))"
            :showClass=" activeKey == 0 || bList[bKey1].name == '全部' ? true : false "
            :showType="!allGames.filter((item) => item.name.includes(text2)).length ? 'tip2': 'game'"
            :showLock="false"
            :showClose="false"
            moveType="全部游戏"
            :num="4"
            @getScroll="getScroll"
            @menuItemDrag="menuItemDrag"
            @menuItemOver="menuItemOver"
            @menuItemDragEnd="menuItemDragEnd"
          ></searchGame>
        </div>
        <span class="txt-a ib" style="line-height: 30px">
          <Icons
            style="vertical-align: middle"
            type="suodingpaixu1"
            size="20"
            color="#CECECE"
          />&nbsp;锁定后,排序不会因为用户习惯发生变化
        </span>
      </Row>
    </Row>
  </div>
</template>
<script>
import { getUserType } from "@/libs/util";
import Icons from "@/components/icons";
import draggable from "vuedraggable";
import { Spin } from "view-design";
import searchGame from "./searchGame";
import {
  GameSortV4Up, //修改
} from "@/api/system";
export default {
  name: "ElectronicX",
  props: {
    isEdit: {
      type: Boolean,
      required: true,
    },
    typeId: {
      type: String,
      required: true,
    },
    cId: {
      type: String,
      required: true,
    },
    dataList: {
      type: Object,
      required: true,
    },
  },
  components: {
    draggable,
    Icons,
    searchGame,
  },
  data() {
    return {
      dataCid: "",
      showTwo: false, //二级分类显示
      showTre: false, //三级分类显示
      allGamesShow: false, //全部游戏显示
      minNum1: 0,
      maxNum1: 200,
      minNum2: 0,
      maxNum2: 200,
      minNum3: 0,
      maxNum3: 200,
      minNum4: 0,
      maxNum4: 200,
      activeKey: "0",
      type: "",
      text: "", //搜索
      text2: "",
      spinShow: true,
      beforeId: null,
      dragItem: {}, //被拖动的原素
      dragType: "",
      data: [],
      bKey: 0, //电子游艺默认 key1
      aKey: "0", //电子排序当前热门选中
      bKey1: 0,
      bKey2: 0,
      bKey3: 0,
      allGames: [], //所以游戏
      aList: [], //电子游艺热门标签列表
      bList: [], //电子游艺列表
      adminType: getUserType(),
      navDate:[
        {name:'游戏标签'},
        {name:'游戏平台'}
      ]
    };
  },
  watch: {
    typeId: {
      handler(newTypeId, oldTypeId) {
        if (newTypeId == oldTypeId) return;
        this.dataCid =
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
        this.aKey = 0;
        this.bKey1 = 0;
        this.bKey2 = 0;
        this.bKey3 = 0;
        this.type = newTypeId;
        this.text = "";
        this.text2 = "";
        if (newTypeId == 10001 || newTypeId == 10004 || newTypeId == 10005)
          this.setDate(newTypeId, this.dataCid);
      },
      deep: true,
    },
    isEdit: {
      handler(newTypeId, oldTypeId) {
        if (newTypeId) {
          if (this.activeKey == "0") {
            this.allGamesShow = true;
          } else if (
            this.typeId == 10005 &&
            this.bList[this.bKey1].name != "全部"
          ) {
            this.allGamesShow = true;
          }
        }
      },
      deep: true,
    },
    spinShow: {
      handler(newTypeId, oldTypeId) {
        if (
          newTypeId == false &&
          (this.typeId == "10001" ||
            this.typeId == "10004" ||
            this.typeId == "10005")
        ) {
          this.$emit("getLoad", false);
        }
      },
      deep: true,
    },
  },
  mounted() {
    let _this = this;
    let props = { ..._this._props };
    this.data = props.dataList; //获取全部游戏列表
    this.type = props.typeId;
    this.dataCid = props.cId;
    if (
      props.typeId == 10001 ||
      props.typeId == 10004 ||
      props.typeId == 10005
    ) {
      this.setDate(props.typeId, props.cId);
    }
  },
  methods: {
    setList(key1, key2, key3) {
      this.bKey1 = key1;
      this.bKey2 = key2;
      this.bKey3 = key3;
      this.showTwo = this.bList[this.bKey1].list.length; //二级分类是否显示
      this.showTre = this.showTwo
        ? this.bList[this.bKey1].list[this.bKey2].list.length
        : 0; //三级分类是否显示
      if (this.type == 10005) {
        this.setAllGame();
        this.setColor();
        if (this.isEdit && this.bList[key1].name != "全部")
          this.allGamesShow = true;
        else this.allGamesShow = false;
      }
      if (this.showTwo && this.type == 10004) {
        if (this.activeKey == "1") {
          this.allGamesShow =
            this.bList[this.bKey1].list[this.bKey2].name == "全部游戏"
              ? false
              : true;
        }
        this.setAllGame();
        this.setColor();
      }
      if (this.type == 10001 && this.showTwo && this.showTre) {
        this.allGamesShow =
          this.bList[this.bKey1].list[this.bKey2].name == "全部游戏" &&
          this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].name ==
            "全部"
            ? false
            : true;
        this.setAllGame();
        this.setColor();
      } else {
        if (this.type == 10001 && !this.isEdit) this.allGamesShow = false;
      }
      if (this.activeKey == 0) {
        this.setAllGame();
        this.setColor();
        if (this.isEdit) this.allGamesShow = true;
      }
    },
    setAllGame() {
      this.allGames = [];
      if (this.bList[this.bKey1].name == "全部" || this.activeKey == "0") {
        this.data.allGames[this.type] &&
          this.data.allGames[this.type].list.forEach((t) => {
            if (t.list) {
              t.list.forEach((m) => {
                this.allGames.push(m);
              });
            }
          });
      } else {
        this.data.allGames[this.type] &&
          this.data.allGames[this.type].list.forEach((t) => {
            if (t.name == this.bList[this.bKey1].name) {
              this.allGames = t.list;
            }
          });
      }
    },
    setDate(typeId, cid) {
      //设置数据
      this.aList = this.data.siteData[cid].list[0].list || [];
      this.bList = this.data.siteData[cid].list[1].list || [];
      this.spinShow = false;
      this.setList(this.bKey1, this.bKey2, this.bKey3);
      this.$forceUpdate();
    },
    remove(id) {
      if (this.activeKey == 0) {
        this.aList[this.aKey].games = this.aList[this.aKey].games.filter(
          (t) => t.id != id
        );
      } else {
        if (this.typeId == "10001") {
          if (
            this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].name ==
            "全部"
          ) {
            this.bList[this.bKey1].list[this.bKey2].list.forEach((t) => {
              t.games = t.games.filter((m) => m.id != id);
            });
          } else {
            this.bList[this.bKey1].list[this.bKey2].list[
              this.bKey3
            ].games = this.bList[this.bKey1].list[this.bKey2].list[
              this.bKey3
            ].games.filter((t) => t.id != id);
          }
        } else if (this.typeId == "10004") {
          this.bList[this.bKey1].list[this.bKey2].games = this.bList[
            this.bKey1
          ].list[this.bKey2].games.filter((t) => t.id != id);
        } else {
          this.bList[this.bKey1].games = this.bList[this.bKey1].games.filter(
            (t) => t.id != id
          );
        }
      }
      this.setColor();
    },
    quxiao() {
      // this.spinShow = true;
      this.bKey1 = 0;
      this.bKey2 = 0;
      this.bKey3 = 0;
      this.setDate(this.type, this.dataCid);
    },
    getActiveKey(val) {
      //标签平台切换
      this.activeKey = val;
      this.text = "";
      this.text2 = "";
      this.setList(0, 0, 0);
    },
    setColor() {
      //全部平台样式置灰
      if (this.activeKey == "1") {
        //平台
        if (this.type == "10001") {
          if (
            this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].name ==
            "全部"
          ) {
            this.allGames.map((t) => {
              t.color = 0;
              this.bList[this.bKey1].list[this.bKey2].list[
                this.bKey3
              ].games.forEach((m) => {
                if (m.id == t.id) t.color = 1;
              });
            });
          } else {
            this.allGames.forEach((t) => {
              t.color = 0;
              this.bList[this.bKey1].list[this.bKey2].list.forEach((m) => {
                if (m.name != "全部") {
                  m.games.forEach((i) => {
                    if (i.id == t.id) t.color = 1;
                  });
                }
              });
            });
          }
        } else if (this.type == "10004") {
          //棋牌捕鱼
          this.allGames.map((t) => {
            t.color = 0;
            this.bList[this.bKey1].list.forEach((m) => {
              if (m.name != "全部游戏") {
                m.games.forEach((i) => {
                  if (i.id == t.id) t.color = 1;
                });
              }
            });
          });
        } else {
          this.allGames.map((t) => {
            t.color = 0;
            this.bList[this.bKey1].games.forEach((m) => {
              if (m.id == t.id) t.color = 1;
            });
          });
        }
      } else {
        //标签
        this.allGames.forEach((item) => {
          item.color = 0;
          this.aList[this.aKey].games.map((t) => {
            if (t.id == item.id) item.color = 1;
          });
        });
      }
      this.$forceUpdate();
    },
    getScroll(e, type) {
      //数据节流
      let scrollHeight = e.target.scrollHeight;
      let scrollTop = e.target.scrollTop;
      let height = e.target.clientHeight;
      let width = e.target.clientWidth;
      if (type == 1) {
        this.minNum1 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum1 = this.minNum1 + 400;
      }
      if (type == 2) {
        this.minNum2 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum2 = this.minNum2 + 400;
      }
      if (type == 3) {
        this.minNum3 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum3 = this.minNum3 + 400;
      }
      if (type == 4) {
        this.minNum4 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum4 = this.minNum4 + 400;
      }
      if (type == 5) {
        this.minNum5 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum5 = this.minNum5 + 400;
      }
      if (type == 6) {
        this.minNum6 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum6 = this.minNum6 + 400;
      }
      this.$forceUpdate();
    },

    //锁定排序
    lockGame(lock, list, i) {
      if (!this.isEdit) return;
      this.$set(list[i], "lock", !lock ? 1 : 0);
      if (this.adminType == "super") {
        this.$set(list[i], "slock", lock ? 0 : 1);
      }
      this.$forceUpdate(); //强制更新试图
    },
    //电子游戏排序数据更新
    updateDate() {
      let json = [];
      //标签
      this.aList.forEach((t) => {
        let obj = {
          gid: t.id,
          list: t.games,
        };
        json.push(obj);
      });
      if (this.type == "10001") {
        this.bList.forEach((t) => {
          t.list.forEach((m) => {
            if (m.list) {
              m.list.forEach((i) => {
                let obj = {
                  gid: i.id,
                  list: i.games,
                };
                json.push(obj);
              });
            }
          });
        });
      } else if (this.type == "10004") {
        this.bList.forEach((t) => {
          t.list.forEach((m) => {
            let obj = {
              gid: m.id,
              list: m.games,
            };
            json.push(obj);
          });
        });
      } else {
        this.bList.forEach((t) => {
          let obj = {
            gid: t.id,
            list: t.games,
          };
          json.push(obj);
        });
      }
      let data = {
        siteId: this.$root.nowSite.id,
        json: JSON.stringify(json),
      };
      GameSortV4Up(data, true).then((res) => {
        if (res && res.code == 200) {
          this.$Message.success("数据更新成功");
        }
        this.$emit("getLoad", false);
      });
    },
    //排序超管锁提示
    testSuper(list, newIndex, i) {
      let newItem = JSON.parse(JSON.stringify(this.dragItem));
      if (this.adminType != "super") {
        let arr = [];
        list.map((item, i) => {
          if (item.slock == 1) arr.push(i);
        });
        arr.sort((a, b) => {
          return a - b;
        });
        let minIndex = arr[arr.length - 1] || null;
        if (newIndex < minIndex && minIndex) {
          this.$Message.error("请排放在超管锁定之后");
          return;
        }
        list.splice(newIndex + 1, 0, newItem);
      } else {
        list.splice(newIndex + 1, 0, newItem);
      }
      this.$forceUpdate();
      this.$Message.success("添加成功");
      this.setColor();
    },
    //拖拽排序
    menuItemDrag(type, item, i) {
      this.i = i;
      this.dragItem = { ...item, hot: 0, lock: 0, slock: 0 };
      this.dragType = type;
    },
    menuItemDragEnd() {
      this.i = null;
    },
    menuItemOver(e) {
      if (this.i !== null) e.preventDefault();
    },
    menuItemDrop($event, newIndex, type, list, typeId) {
      if (!this.isEdit) return;
      if (this.i !== null) {
        if (this.dragType == type) {
          //排序
          if (
            (this.dragType == "搜索游戏" || this.dragType == "搜索标签") &&
            this.text
          )
            return;
          if (this.i == newIndex) return;
          if (this.adminType != "super") {
            let arr = [];
            list.map((item, i) => {
              if (item.slock == 1) arr.push(i);
            });
            arr.push(this.i);
            arr.sort((a, b) => {
              return a - b;
            });
            let currentIndex = arr.indexOf(this.i);
            let minIndex = arr[currentIndex - 1];
            let maxIndex = arr[currentIndex + 1] || 99999;
            if (newIndex <= minIndex) {
              this.$Message.error("请排在超管锁定之后");
              return;
            } else if (newIndex >= maxIndex) {
              this.$Message.error("请排在超管锁定之前");
              return;
            }
          }
          let newObj = list[this.i];
          list.splice(this.i, 1);
          list.splice(newIndex, 0, newObj);
          list.find((t, i) => {
            if (t.id == this.beforeId) this.currentPlatform = i;
          });
        } else {
          //拖拽新增
          if (this.dragType == "游戏" && type == "平台") return;
          if (this.dragType == "搜索游戏" || this.dragType == "搜索标签") {
            if (this.adminType != "super") {
              let arr = [];
              list.map((item, i) => {
                if (item.slock == 1) arr.push(i);
              });
              let index;
              list.map((item, i) => {
                if (item.id == this.dragItem.id) {
                  index = i;
                }
              });
              arr.push(index);
              arr.sort((a, b) => {
                return a - b;
              });
              let currentIndex = arr.indexOf(index);
              let minIndex = arr[currentIndex - 1];
              let maxIndex = arr[currentIndex + 1] || 99999;
              if (newIndex <= minIndex) {
                this.$Message.error("请排在超管锁定之后");
                return;
              } else if (newIndex >= maxIndex) {
                this.$Message.error("请排在超管锁定之前");
                return;
              }
            }
            list.map((item, i) => {
              if (item.id == this.dragItem.id) {
                list.splice(i, 1);
                if (i >= newIndex + 1) {
                  list.splice(newIndex + 1, 0, this.dragItem);
                } else if (i < newIndex + 1) {
                  list.splice(newIndex, 0, this.dragItem);
                } else {
                  return;
                }
              }
            });
            this.$forceUpdate();
            return;
          } else {
            let newItem = JSON.parse(JSON.stringify(this.dragItem));
            if (type == "游戏") {
              if (typeId == "10001") {
                //电子排序
                if (
                  this.bList[this.bKey1].list[this.bKey2].name != "全部游戏" ||
                  this.bList[this.bKey1].list[this.bKey2].list[this.bKey3]
                    .name != "全部"
                ) {
                  //二级分类不为全部时3级分类不为全部时
                  this.testSuper(list, newIndex, this.i);
                  this.bList[this.bKey1].list[this.bKey2].list.forEach((t) => {
                    if (t.name == "全部") {
                      let arr = t.games.filter((i) => i.id == newItem.id);
                      if (arr.length == 0) {
                        t.games.push(newItem);
                      }
                    }
                  });
                }
              } else if (typeId == 10004) {
                //棋牌捕鱼排序
                if (
                  this.bList[this.bKey1].list[this.bKey2].name != "全部游戏"
                ) {
                  //二级分类不为全部时3级分类不为全部时
                  this.testSuper(list, newIndex, this.i);
                }
              } else {
                this.testSuper(list, newIndex, this.i);
              }
            } else {
              this.testSuper(list, newIndex, this.i);
            }
          }
          this.setColor();
        }
        this.$forceUpdate();
      }
    },
  },
};
</script>
<style lang="less" scoped>
// @import "../../../styles/button.less";
.fc {
  color: #2d8cf0;
  font-size: 1rem;
}
@active: #2d8cf0;
@icon-close-border: #cecece;
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  width: 20px;
  border-radius: 10px;
  background: #2d8cf0;
}
.headTab {
  display: inline-block;
  padding: 8px 16px;
  margin-right: 15px;
}
.activeTab {
  border-bottom: 3px solid #2d8cf0;
  box-sizing: border-box;
}
.move {
  cursor: move;
}
.cd {
  cursor: default;
}
.ft16 {
  color: #666666;
}
.po-re {
  position: relative;
}
//电子游艺排序、
.hotActive {
  background: #2d8cf0;
  color: white;
  .close {
    color: #ccc;
  }
  .bianji {
    color: white;
  }
}
/deep/.ivu-tabs-bar {
  border: none;
}
.title {
  position: relative;
}
.biaoji {
  position: absolute;
  top: -11px;
  right: 0px;
  border-radius: 3px;
  font-size: 0.75rem;
  color: white;
  background: red;
}
.bianji {
  position: absolute;
  top: 9px;
  left: 20px;
  color: #ccc;
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
}
/deep/.ivu-tabs-nav {
  font-size: 1rem !important;
  font-weight: 549;
}
.ivu-btn {
  height: 36px !important;
}
.hotActive.super {
  background: #62b1fd;
}
.ivu-tabs {
  overflow: visible;
}
/deep/.ivu-form-item-label {
  padding-right: 0 !important;
}
/deep/.ivu-form-item-content {
  text-align: left;
  padding-left: 20px;
}
</style>