<template>
  <div class="header-bar parent">
    <Menu mode="horizontal" theme="dark" :active-name="activeMenu" @on-select="onSelectMenu">
      <div class="layout-site" :class="[screen<1500&&screen>1400?'w170x':'']">
        <div class="cs" @click="changeSite" style="height: 80px;">
          <span
            class="ib w140x white-font pl10 ft22 over txt-a"
            style="font-size:1.375rem /* 22/16 */"
          >{{$root.nowSite.siteName}}</span>
          <Icons
            type="gengduoshouqi"
            color="#787878"
            :size="8"
            :style="style"
            class="child"
            v-show="!showMore"
          ></Icons>
          <Icons
            type="gengduozhankai"
            color="#787878"
            :size="8"
            :style="style"
            class="child"
            v-show="showMore"
          ></Icons>
        </div>
      </div>
      <div v-if="showMore" class="showMoreParent" @click="changeShowMore()">
        <div style="width:1200px;" v-if="showMore" class="showMore clearfix scroll">
          <div class="left br bt">
            <div class="left-child">
              <Icons type="shoucanghou" size="18" class="ib ml20"></Icons>
              <span style="color:#EEEEEE;" class="pl20 ft20">收藏站点</span>
              <div
                v-for="(t,i) in collectSiteList"
                :key="'collect'+i"
                style="width: 180px;"
                class="border cs over"
              >
                <Icons
                  type="shoucanghou"
                  color="#2D8CF0"
                  size="16"
                  class="ib ml20"
                  @click="cancel(t,i)"
                ></Icons>
                <span class="pl15 ft16 over" @click="onSiteChange(t,true)">{{t.siteName}}</span>
              </div>
            </div>
          </div>
          <div
            style="height:80px;width:1001px;margin-left:179px;background-color:#111111;margin-top:-80px;position:relative;position: absolute"
          ></div>
          <div class="right bt">
            <div class="right-child">
              <div class="top ml35">
                <Input
                  suffix="ios-search"
                  placeholder="关键字查询"
                  class="w300x"
                  v-model="searchWord"
                  @on-enter="searchSubmit"
                />
                <Button
                  type="primary"
                  class="ml20"
                  style="width: 83px;"
                  @click="searchSubmit"
                  :loading="loading"
                >搜索</Button>
              </div>
              <div class="bottom ml35" style="color: #EEEEEE;width:990px;">
                <div v-if="showCustom">
                  <span class="ft16">常用</span>
                  <span class="pl15 ft16">(站点{{siteCount.custom_site}})</span>
                  <ul class="clearfix bl" style="width: 98%;">
                    <li
                      v-for="(t,i) in customSiteList"
                      :key="'custom'+i"
                      :class="t.collect == 'yes' ? 'w16 ft14 fl blue-font ti15 cs bt br bb over' : 'w16 ft14 fl cs bt br  bb ti15 over'"
                      @click="onSiteChange(t,true)"
                    >{{t.siteName}}</li>
                  </ul>
                </div>
                <div
                  v-for="(item,key,index) in all"
                  :key="'allSite'+index"
                  v-if="siteCount[key] != 0"
                >
                  <Spin size="large" fix v-if="spinShow">
                    <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
                      <div v-for="t in 8" :key="'div'+t"></div>
                    </div>
                  </Spin>
                  <div class="ft16">
                    <span>{{key == 'yunbo' ? '云博' : key == 'lottery' ? '彩票' : '包网'}}</span>
                    <span class="pl15">(站点{{siteCount[key]}})</span>
                  </div>
                  <ul class="clearfix bl" style="width: 98%;">
                    <li
                      v-for="(t,i) in allSiteList[key]"
                      :key="'siteDetail'+i"
                      class="fl w16 bt br bb yunbo"
                    >
                      <span
                        class="ib cs ft14 ti15 ib over"
                        style="width: 80%;"
                        @click="onSiteChange(t,true)"
                      >{{t.siteName}}</span>
                      <Icons
                        class="ib"
                        :type="t.collect === 'yes' ? 'shoucanghou' : 'weishoucang'"
                        :color="t.collect == 'yes' ? '#2D8CF0' : '#2B2B2B'"
                        @click="addCollect(t, key)"
                      ></Icons>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="layout-nav" v-if="allMenu">
        <MenuItem
          v-for="(menu,index) in allMenu"
          :name="menu.name"
          :key="index"
          v-if="!menu.meta.hideInTop"
        >{{menu.meta.title}}</MenuItem>
      </div>
      <div class="custom-content-con">
        <slot></slot>
      </div>
    </Menu>
  </div>
</template>
<script>
import SiteSelect from "@/components/site-select";
import { customSiteItems, siteCollectOperate } from "@/api/common";
import { siteManagementDetail } from "@/api/system";
import { mapState, mapMutations, mapActions } from "vuex";
import Icons from "_c/icons";
import "./header-bar.less";
export default {
  name: "HeaderBar",
  components: {
    SiteSelect,
    Icons
  },
  data() {
    return {
      screen: screen.width,
      style:
        screen.width == 1440
          ? "z-index:100; transform: translateX(30px) scale(0.8)"
          : "z-index:100",
      spinShow: true,
      searchWord: "", //搜索关键字
      originData: {},
      showMore: false,
      allSiteList: {
        yunbo: [],
        lottery: [],
        cover_network: []
        // custom_site: []
      }, //所有站点,
      all: {
        yunbo: [],
        lottery: [],
        cover_network: []
      },
      customSiteList: [], //常用站点
      siteCount: {
        yunbo: null,
        lottery: null,
        cover_network: null,
        custom_site: null
      }, //站点数量
      collectSiteList: [], //收藏的站点
      showCustom: true, // 是否展示常用
      loading: false // 查询按钮的加载效果
    };
  },
  computed: {
    ...mapState({
      accessSite: state => state.user.accessSite,
      activeMenu: state => state.app.activeMenu,
      allMenu: state => state.app.allMenu,
      tagNavList: state => state.app.tagNavList,
      singleLotteryArray: state => state.app.singleLotteryArray,
      showPreIds: state => state.app.showPreIds
    })
  },
  mounted() {
    window.addEventListener("click", event => {
      const { clientX, clientY } = event;
      if ((clientX < 1190 && clientY > 809) || clientX > 1190) {
        this.searchWord = "";
        this.showMore = false;
      }
    });
    this.getWithdrawalLimit(this.$root.nowSite.id);
  },
  watch: {
    "$root.nowSite.id"(val) {
      this.getWithdrawalLimit(val);
    }
  },
  methods: {
    ...mapMutations([
      "updateNowSite",
      "setActiveMenu",
      "setAllMenu",
      "setWithdrawalsLimit",
      "setOnlineForceAudit",
      "setDepositPreferentialType",
      "setPreferentialConfig"
    ]),
    ...mapActions(["getNewRoute"]),
    changeShowMore() {
      //优化小屏点击收藏站点不关闭问题
      let site = document.querySelector(".showMore");
      if (site) {
        if (!site.contains(event.target)) {
          this.showMore = false;
        }
      }
    },
    onSelectMenu(key) {
      this.setActiveMenu(key);
      if (this.allMenu[key].children[0].children.length > 0) {
        this.allMenu[key].children.forEach(item => {
          if (item.meta.hideInMenu == false) this.$router.push(item);
        });
      } else {
        this.$router.push(this.allMenu[key].children[0]);
      }
    },
    changeSite() {
      this.collectSiteList = [];
      this.showMore = !this.showMore;
      this.searchWord = "";
      if (this.showMore) {
        this.getShowList({ searchWord: "" }, true);
        this.showCustom = true;
        this.allSiteList.yunbo = [];
        this.allSiteList.lottery = [];
        this.allSiteList.cover_network = [];
        this.siteCount = {
          yunbo: null,
          lottery: null,
          cover_network: null
        };
      }
    },
    // 获取站点最低取款
    getWithdrawalLimit(data) {
      siteManagementDetail({ id: data }).then(res => {
        if (res != undefined && res.code == 200) {
          this.setWithdrawalsLimit(res.data.siteConfig.limit.withdrawalsLimit);
          this.setOnlineForceAudit(res.data.siteConfig.limit.onlineForceAudit);
          this.setDepositPreferentialType(
            res.data.siteConfig.limit.depositPreferentialType
          );
          this.setPreferentialConfig(
            res.data.siteConfig.preferential_config
              ? res.data.siteConfig.preferential_config
              : ""
          );
        }
      });
    },
    // 收藏列表的收藏功能
    cancel(t, i) {
      let data = { collect: "no", siteId: t.id };
      siteCollectOperate(data, true).then(res => {
        if (res != undefined && res.code == 200) {
          if (this.customSiteList.find(item => item.id == t.id) != undefined)
            this.customSiteList.find(item => item.id == t.id).collect = "no";
          for (let key in this.all) {
            if (this.allSiteList[key].find(item => item.id == t.id) != undefined)
              this.allSiteList[key].find(item => item.id == t.id).collect = "no";
          }
          this.collectSiteList.splice(i, 1);
        }
      });
    },
    // 获取右边的显示数据
    getShowList(data, flag, stage) {
      this.spinShow = true;
      if (data.searchWord == "") delete data.searchWord;
      customSiteItems(data).then(res => {
        if (res != undefined && res.code == 200) {
          const { site_list, custom_site } = res.data;
          if (stage != "site") {
            //最开始进来的未变动的收藏数据
            site_list.forEach(item => {
              if (item.collect == "yes") this.collectSiteList.push(item);
            });
          }
          for (let key in this.allSiteList) {
            site_list.forEach(item => {
              if (key == item.site_class) this.allSiteList[key].push(item);
            });
            for (let key2 in this.siteCount) {
              if (key == key2)
                this.siteCount[key] = this.allSiteList[key].length;
            }
          }
          if (flag && custom_site) {
            this.customSiteList = custom_site;
            this.siteCount.custom_site = custom_site.length;
          }
        }
        this.spinShow = false;
        this.loading = false;
      });
    },
    onSiteChange(site, flag) {
      this.updateNowSite(site);
      this.saveSite(site.id);
      // 增加点击次数  后台做常用站点
      let data = { siteId: site.id };
      siteCollectOperate(data, true);
      // 用户没有单站权限
      this.allMenu.system.children && this.allMenu.system.children.forEach(item => {
        if (item.path == "lotterysManagement") {
          this.accessSite.forEach(y => {
            if (y.id == site.id && y.fastLotteryModel == "single") {
              item.children.forEach(nav => {
                if (nav.name == "singleFastLottery")
                  nav.meta.hideInMenu = false;
                if (nav.name == "fastLottery") nav.meta.hideInMenu = true;
              });
            } else if (y.id == site.id && y.fastLotteryModel == "multiple") {
              item.children.forEach(nav => {
                if (nav.name == "singleFastLottery") nav.meta.hideInMenu = true;
                if (nav.name == "fastLottery") nav.meta.hideInMenu = false;
              });
            }
          });
        }
      })
      // this.allMenu.activity.children && this.allMenu.activity.children.forEach(t => {
      //   if (t.path == 'discountActivity') {
      //     t.children && t.children.forEach(y => {
      //       if (y.name == 'preferentialList') {
      //         y.meta.hideInMenu = !this.showPreIds.includes(site.id)
      //       }
      //     })
      //   }
      // })
      if (flag) {
        this.onSelectMenu(this.activeMenu);
        this.$emit("on-close-all", this.handRoute(), "all");
      }
      this.searchWord = "";
      this.showMore = false;
    },
    handRoute() {
      let arr;
      arr = this.tagNavList.filter(el => el.name === this.$config.homeName);
      return arr;
    },
    // 站点的收藏和取消收藏
    addCollect(obj, key) {
      let data = {
        siteId: obj.id,
        collect: obj.collect == "yes" ? "no" : "yes"
      };
      siteCollectOperate(data, true).then(res => {
        if (res != undefined && res.code == 200) {
          this.allSiteList[key].forEach((item, index) => {
            if (item.id == obj.id) item.collect = data.collect;
            if (data.collect == "yes" && item.id == obj.id)
              this.collectSiteList.push(item);
            if (data.collect == "no" && item.id == obj.id) {
              this.collectSiteList.filter((t, i) => {
                if (t.id == item.id) this.collectSiteList.splice(i, 1);
              });
            }
          });
          this.customSiteList.forEach(item => {
            if (item.id == obj.id) item.collect = data.collect;
          });
          this.showMore = true;
        }
      });
    },
    // 搜索站点关键字
    searchSubmit() {
      this.loading = true;
      if (this.searchWord == "") this.showCustom = true;
      else this.showCustom = false;
      this.allSiteList.yunbo = [];
      this.allSiteList.lottery = [];
      this.allSiteList.cover_network = [];
      this.siteCount = {
        yunbo: null,
        lottery: null,
        cover_network: null
      };
      let data = { searchWord: this.searchWord };
      this.getShowList(data, false, "site");
    },
    saveSite(val) {
      sessionStorage.setItem("site", val);
    }
  }
};
</script>
<style lang="less" scoped>
.showMore {
  position: fixed;
  top: 80px;
  left: 0;
  height: 100%;
  z-index: 9999999 !important;
  line-height: 60px !important;
}
.showMoreParent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 180px;
  right: 0;
  background-color: rgba(55, 55, 55, 0.6);
  z-index: 9999999 !important;
}

.left {
  background: #111111;
  width: 180px;
  float: left;
  height: 100%;
  overflow: hidden;
}
.left-child {
  background: #111111;
  width: 200px;
  float: left;
  height: 100%;
  overflow-y: scroll;
}
.right {
  float: left;
  width: 1000px;
  height: 100%;
  overflow: hidden;
  background: #111111;
}
.right-child {
  float: left;
  width: 1020px;
  height: 100%;
  overflow-y: scroll;
  background: #111111;
}
.border {
  border-top: 1px solid #2b2b2b;
  &:nth-last-child(1) {
    border-bottom: 1px solid #2b2b2b;
  }
}
.parent {
  position: relative;
}
.child {
  position: absolute;
  left: 140px;
  top: 2px;
}
/deep/.ivu-input-suffix {
  top: 4px !important;
  i {
    font-size: 1.5rem /* 24/16 */ !important;
  }
}
/deep/.ivu-input-with-suffix {
  background: #111111 !important;
  border: 1px solid #2b2b2b !important;
  box-shadow: none !important;
  color: #ffffff;
}
.b {
  border: 1px solid #2b2b2b;
}
.bt {
  border-top: 1px solid #2b2b2b;
}
.br {
  border-right: 1px solid #2b2b2b;
}
.bl {
  border-left: 1px solid #2b2b2b;
}
.bb {
  border-bottom: 1px solid #2b2b2b;
}
.bottom {
  position: relative;
  ul {
    li {
      line-height: 50px;
      height: 50px;
      &:ntn-child(6n) {
        border-right: 0;
      }
      &:not(:nth-child(1)) {
        border-top: 0;
      }
      &:not(:nth-child(2)) {
        border-top: 0;
      }
      &:not(:nth-child(3)) {
        border-top: 0;
      }
      &:not(:nth-child(4)) {
        border-top: 0;
      }
      &:not(:nth-child(5)) {
        border-top: 0;
      }
      &:not(:nth-child(6)) {
        border-top: 0;
      }
      &:nth-child(1) {
        border-top: 1px solid #2b2b2b;
      }
      &:nth-child(2) {
        border-top: 1px solid #2b2b2b;
      }
      &:nth-child(3) {
        border-top: 1px solid #2b2b2b;
      }
      &:nth-child(4) {
        border-top: 1px solid #2b2b2b;
      }
      &:nth-child(5) {
        border-top: 1px solid #2b2b2b;
      }
      &:nth-child(6) {
        border-top: 1px solid #2b2b2b;
      }
    }
  }
}
// 收藏图标的位置
.yunbo {
  position: relative;
  i {
    position: absolute;
    right: 10px;
    top: 0;
  }
}
// 加载皮肤的样式修改
/deep/.ivu-spin-fix {
  background-color: rgba(17, 17, 17, 0.9) !important;
}
.over {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
