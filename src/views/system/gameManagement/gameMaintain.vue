<template>
  <div>
    <Row>
      <Tag
        v-for="(item, index) in gameNav"
        :class="isCurrentTag(item.id) ? 'v2-tag-active' : ''"
        :key="index"
        class="tag  ft16"
        :name="item.name"
        :data-route-item="item"
        @on-close="remove(item.id,item.name,index)"
        @click.native="showIdData(item.id)"
      >
        {{item.name}}
        <span
          v-if="!item.status"
          :class="item.status ? 'hide' : 'show'"
        >维护</span>
      </Tag>
      <Button
        v-if="istoMaintain && isOk"
        class="ml10 mb10 ft16"
        @click="maintain('全挂维护')"
        type="info"
        ghost
        icon="ios-build"
      >全挂维护</Button>
      <Button
        v-if="!istoMaintain && isOk"
        class="ml10 mb10"
        @click="maintain('恢复正常')"
        type="info"
        ghost
        icon="md-refresh"
      >恢复正常</Button>

      <div ref="gameRow">
        <Row class="gameRow">
          <Spin size="large" fix v-if="spinShow" style="margin-top:100px">
            <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
            <div v-for="t in 8" :key="'div'+t"></div>
          </div>
          </Spin>
          <Col
            span="4"
            v-for="(item, index) in gameList"
            :key="index"
            class="gameMaintain"
            :name="item.name"
            :data-route-item="item"
          >
            <Row>
              <Col span="14">{{item.name}}</Col>
              <Col span="10">
                <Switch
                  :disabled=flag
                  @on-change="change(item.id,item.status,item.name)"
                  v-model="item.status"
                  size="large"
                >
                  <span slot="open">正常</span>
                  <span slot="close">维护</span>
                </Switch>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Row class="mt50" v-if="!istoMaintain && isOk">
        <Col>
          <span class="ml10 mr15 weihu">维护</span>
          表示当前游戏类型中所有游戏在客户端都会处在维护中
        </Col>
      </Row>
    </Row>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import { Modal, Spin } from "view-design";
import { gameConfigForMaintain, gameConfigUpGameStatus } from "@/api/system";
import { getUserType } from "@/libs/util";
export default {
  name: "gameMaintain",
  data() {
    return {
      flag:false,
      gameMaintainList: [],
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      gameNav: [
        {
          id: 10000,
          name: "彩票游戏",
          status: true
        },
        {
          id: 10001,
          name: "电子游艺",
          status: true
        },
        {
          id: 10002,
          name: "体育赛事",
          status: true
        },
        {
          id: 10003,
          name: "真人视讯",
          status: true
        },
        {
          id: 10004,
          name: "棋牌游戏",
          status: true
        },
        {
          id: 10005,
          name: "捕鱼游戏",
          status: true
        }
      ],
      RowNum: 0,
      isOk: false,
      sitegameMaintainList: {},
      gameList: [],
      switch1: false,
      istoMaintain: true,
      clickId: 10000,
      formData: {},
      timer: false,
      screenWidth: document.body.clientWidth,
      spinShow: true //加载效果
    };
  },
  watch: {
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = true;
        let that = this;
        setTimeout(function() {
          const num = Math.floor(Number(that.screenWidth) / 200);
          that.timer = false;
        }, 400);
      }
    },
  },
  created() {
    this.getData();
  },
  mounted() {
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;
    const w =
      that.$root.$children[0].$children[0].$children[0].$children[1]
        .$children[0].width;
    if (w) {
      that.screenWidth -= w + 45;
    }
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
  },
  methods: {
    //获取游戏列表数据
    toMaintain() {
      this.toMaintain = true;
    },
    isFrist(evt) {},
    getData() {
      const data = {
        platform: "sport",
        siteId: this.$root.nowSite.id
      };
      gameConfigForMaintain(data).then(res => {
        res.data.forEach(item => {
          this.gameNav.forEach(temp => {
            if (temp.id == item.id) {
              temp.status = item.status == 'yes' ? true : false
            }
          })
        })
        this.gameMaintainList = res.data;
        this.spinShow = false;
        this.sitegameMaintainList = {};
        for (var key in this.gameMaintainList) {
          return key == 0
            ? this.showList(this.gameMaintainList[0], "data")
            : false;
        }
      });
    },
    isCurrentTag(item) {
      return item == this.clickId ? true : false;
    },
    remove() {},
    maintain(type) {
      if (this.formData === {}) return;
      const status = this.formData.status === "yes" ? "no" : "yes";
      const data = {
        id: this.formData.id,
        status: status,
        name: this.formData.name
      };
      this.$Message.config({
        top: 50,
        duration: 1
      })
      this.$Tip.confirm({
        content: "您确定要" + type + "(" + this.formData.name + ")" + "吗",
        onOk: () => {
          gameConfigUpGameStatus(data, true).then(res => {
            if (res!= undefined && res.code == 200) {
              this.$Message.success(`${type}${this.formData.name}成功`)
              this.istoMaintain = this.formData.status === "yes" ? false : true;
              this.formData.status = status;
              this.gameNav.find(item => item.id == this.formData.id).status = this.istoMaintain
            }
          });
        }
      });
    },
    showList(data, type) {
      type === "data" ? this.showData(data) : this.showIdData(id);
    },
    showData(data) {
      this.clickId = data.id;
      this.formData = data;
      this.toStatus(data);
    },
    toStatus(data) {
      if (this.spinShow === true) return false;
      this.istoMaintain = data.status === "yes" ? true : false;
      this.gameList = data.list.map(i => {
        return {
          id: i.id,
          name: i.name,
          status: i.status === "yes" ? true : false
        };
      });
      this.isOk = true;
    },
    showIdData(id) {
      this.spinShow = true
      this.clickId = id;
      setTimeout(() => {
        this.formData = {};
        this.formData = this.gameMaintainList.find(i => i.id === id);
        this.spinShow = false
      this.toStatus(this.formData);
      },500)
    },
    change(id, status, name) {
      this.flag=true
      if ( this.adminType == "super" || this.authInPage.indexOf("gameConfigUpGameStatus") != -1 ) {
        const data = { id: id, status: status == true ? "yes" : "no" };
        gameConfigUpGameStatus(data, true).then(res => {
          if (!res || res.code !== 200) {
            this.ruter(data);
          } else {
            this.$Message.config({
              top: 50,
              duration: 1
            })
            this.gameList.forEach(item => {
              if (item.id == id) item.status = status
            })
            this.formData.list.forEach(item => {
              if (item.id == id) item.status = status ? 'yes' : 'no'
            })
            this.$Message.success('状态修改成功')
             this.flag=false
          }
        });
      } else {
        this.$Tip.info({ content: '您尚未开通此权限' })
      }
    },
    ruter(data, type, status) {
      if (type && type == "all") {
        this.gameList = this.gameList.map(i => {
          let obj = {
            id: i.id,
            name: i.name,
            status: status
          };
          return obj;
        });
      } else {
        this.gameList = this.gameList.map(i => {
          let obj = {
            id: i.id,
            name: i.name,
            status: i.status
          };
          if (i.id === data.id) {
            obj.status = data.status == "yes" ? false : true;
          }
          return obj;
        });
      }
    }
  },
  components: {
    Icons
  }
};
</script>
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
.ivu-btn-ghost.ivu-btn-info{height: 36px;padding: 0 12px;}
.gameMaintain {
  border: 1px solid #e4e4e4;
  padding: 0 5px;
  margin: 10px 0;
  line-height: 76px;
  width: 200px;
  font-size: .875rem /* 14/16 */;
  height: 76px;
  border-radius: 0;
  text-align: center;
}
.ivu-col {
  text-overflow: "…" !important;
}
.hide {
  display: none;
}
.ivu-switch-large {
  width: 60px !important;
}
.ivu-switch:after {
  margin-left: 3px !important;
}
.weihu {
  width: 38px;
  height: 20px;
  line-height: 20px;
  border: 1px solid #ff6e6e;
  border-radius: 4px;
  color: #ff6e6e;
  display: inline-block;
  text-align: center;
  font-size: .75rem /* 12/16 */;
}
.show {
  position: absolute;
  color: #e4393c;
  top: -10px;
  right: 0;
  width: 38px;
  height: 20px;
  background-color: #fff;
  line-height: 20px;
  border: 1px solid #ff6e6e;
  border-radius: 4px;
  color: #ff6e6e;
  z-index: 888;
  text-align: center;
  font-size: .75rem /* 12/16 */;
}
.tag {
  position: relative;
}
// .gameMaintain:not(:first-child){
//   border-right: none ;
// }
// .gameMaintain:last-child{
//   border-right: 1px solid #E4E4E4;
// }
// .gameMaintain:first-child{
//   border-right: none;
// }
.gameMaintain:nth-child(0) {
  border-left: 1px #eaeaea;
}
// .maintain{
//   position: absolute;
//   border: 1px solid #FF0000;
// }
@active: #2d8cf0;
@icon-close-border: #cecece;
.nav-body {
  padding: 1px 4px 0;
  height: ~"calc(100% - 1px)";
  display: inline-block;
  overflow-x: visible;
  white-space: nowrap;
  transition: left 0.3s ease;
  .ivu-tag-dot-inner {
    transition: background 0.2s ease;
  }
}
/deep/.ivu-tag {
  // border:none;
  border-left: none;
  overflow: visible !important;
  padding: 0;
  margin: 0 0 10px;
  width: 139px;
  height: 39px;
  line-height: 39px;
}
/deep/.ivu-tag:nth-child(1) {
  border-left: 1px solid #dcdcdc;
}
/deep/.v2-tag-active {
  // border-right: 1px solid #dcdcdc;
  border-top: 2px solid @active;
  background: #fff;
  margin: 0 1px 10px;
  // font-size: 18px;
}
/deep/.ivu-tag:nth-child(1) {
  border-left: 1px solid #dcdcdc;
}

/deep/.ivu-tag-text{
  color: #444;
}
</style>