<template>
  <div class="v2-search">
    <Form inline class="mb10">
      <!-- <Button class="w130x cardNutton" @click="addPlatform">添加游戏</Button> -->
      <FormItem label="游戏类型">
        <Select
          clearable
          class="s-140"
          v-model="platform"
          @on-change="changePlatForm"
          placeholder="全部"
          size="large"
        >
          <Option v-for="(item,i)  in  gameList" :key="i" :value="item.platform">{{item.name}}</Option>
        </Select>
      </FormItem>
      <!-- <FormItem label="关键字">
        <Input v-model="searchKey.name" placeholder="请输入关键字" clearable/>
      </FormItem>-->
      <Button
        type="primary"
        class="search"
        @click.prevent="search"
        :loading="$root.tableLoading"
        size="large"
      >查询</Button>
    </Form>
    <div class="v2-search bb mb20" style="height:38px" v-if="(adminType == 'super') || ((authInPage.indexOf('gameConfigList')!=-1) && (authInPage.indexOf('gameConfigListAll')!=-1))">
      <ButtonGroup
        class="repay-button"
        v-if="(adminType == 'super') || ((authInPage.indexOf('gameConfigList')!=-1) && (authInPage.indexOf('gameConfigListAll')!=-1))"
      >
        <Button
          class="fontColor"
          @click="resetSingle('refund',true)"
          v-if="(adminType == 'super') || (authInPage.indexOf('gameConfigList') != -1)"
          :class="currentBtn == 'refund' ? 'active' : ''"
        >单站游戏</Button>
        <span v-if="rentType!='rent'">
              <Button
         class="fontColor"
          @click="resetSingle('level',false)"
          v-if="(adminType == 'super') || (authInPage.indexOf('gameConfigListAll') != -1)"
          :class="currentBtn == 'level' ? 'active' : ''"
        >单站游戏控制</Button>
        </span>
       <span  v-if="rentType!='rent'">
           <Button
         class="fontColor"
          @click="resetSingle('refundSet',false)"
          v-if="(adminType == 'super') || (authInPage.indexOf('gameConfigListAll') != -1)"
          :class="currentBtn == 'refundSet' ? 'active' : ''"
        >全站返水设置</Button>
       </span>

      </ButtonGroup>
    </div>
    <div class="v2-table" v-if="currentBtn!=='refundSet'">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :value="table.data"
        :columns="currentBtn == 'level' ? table.copyColumns : table.columns"
        :total="table.total"
        @on-page-change="onPageChange"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-size-change="onPageSizeChange"
        @on-edit="onEdit"
        @on-change-status="onStatus"
        @on-list="onList"
      ></Tables>
    </div>
    <div class="v2-table" v-if="currentBtn==='refundSet'">
      <Tables
        ref="table"
        :more='true'
        :showSizer="currentBtn == 'refundSet' ? false : true"
        :loading="$root.tableLoading"
        :value="table2.data"
        :columns="table2.columns"
        :total="table2.total"
        :pageSizeOpts="table2.pageSizeOpts" 
        @on-edit="onEdit"
        @on-change-status="onStatus"
        @on-list="onList"
        :page='false'
      >
    <div slot="more">
      <div class="h44">
        注：控制所有站电子，棋牌，和捕鱼的小游戏返水
      </div>
    </div>
    </Tables>
    </div>

    <Modals ref="gamePlatform" :title="gamePlatformTitle==='create'?'添加游戏':'编辑游戏'" width="670">
      <div slot="content">
        <Form :label-width="210" :model="gameFrom" :rules="gameRule">
          <FormItem label="创建人" prop="created_user">
            <Input class="w320x" v-model="gameFrom.created_user"/>
          </FormItem>
          <FormItem label="游戏类型">
            <Select class="w320x" v-model="gameFrom.className">
              <Option v-for="(item,i)  in  gameList" :key="i" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="游戏平台" prop="platform">
            <Input class="w320x" v-model="gameFrom.platform"/>
          </FormItem>
          <FormItem label="平台编号" prop="sequence">
            <Input class="w320x" v-model="gameFrom.id"/>
          </FormItem>
          <FormItem label="简介" prop="tag">
            <Input class="w320x" v-model="gameFrom.tag"/>
          </FormItem>
          <FormItem label="显示状态" prop="status">
            <Select class="w320x" v-model="gameFrom.status">
              <Option value="yes">正常</Option>
              <Option value="no">停用</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="submit"
              :loading="$root.editLoading"
              class="ivu-btn submit mb20"
            >确认保存</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "_c/tables";
import Modals from "@/components/modals";
import {
  gameConfigTitleUp, //游戏描述(单站)
  // gameConfigDelGame, //游戏管理-游戏删除（全站 停）
  gameConfigUpGame, //游戏管理-游戏修改（全站 停）
  gameConfigList, //游戏管理-游戏列表（单站）
  gameConfigClassification, //游戏分类列表（全站）
  gameConfigAddGame, //游戏管理-新增游戏（全站 停）
  gameConfigUpGameStatus, //游戏维护-游戏状态修改（全站）
  gameConfigUpBlackGame, //游戏管理-添加游戏黑名单（单站）
  gameConfigListAll, //游戏管理-游戏列表（全站）
  gameConfigUpBlackGameAll //游戏管理-添加游戏黑名单（全站）
} from "@/api/system";
import { getUserType } from "@/libs/util";
import { constants } from "crypto";
export default {
  name: "gameManage",
  components: {
    Tables,
    Modals
  },
  watch: {
    searchKey: {
      handler(newVal, oldVal) {
        if (newVal.name == "") {
          if (this.table.data.length > 1) return false;
          this.resetData();
        }
      },
      deep: true
    },
    currentBtn(val, oldVal) {
      if (val == "refundSet") {
        this.gameList = [
          { id: 10001, name: "电子游艺", platform: "slot" },
          { id: 10004, name: "棋牌游戏", platform: "chess" },
          { id: 10005, name: "捕鱼游戏", platform: "getfish" }
        ];
      } else {
        this.gameList = [
          { id: 10000, name: "彩票游戏", platform: "lottery" },
          { id: 10001, name: "电子游艺", platform: "slot" },
          { id: 10002, name: "体育赛事", platform: "sport" },
          { id: 10003, name: "真人视讯", platform: "live_casino" },
          { id: 10004, name: "棋牌游戏", platform: "chess" },
          { id: 10005, name: "捕鱼游戏", platform: "getfish" }
        ]
      }
    }
  },
  data() {
    return {
      page:null,
      oldTitle:'',
      copyTable: [],
      editInfo: [],
      rentType:localStorage.loginType,
      //  editInfo: {
      //   title:'',
      //   id: null,
      //   siteId: this.$root.nowSite.id,
      // }, //编辑数据
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      gamePlatformTitle: "", //添加和编辑的标题
      gameList: [
        // {
        //   id: 99999,
        //   name: "全部",
        //   platform: "all"
        // },
        {
          id: 10000,
          name: "彩票游戏",
          platform: "lottery"
        },
        {
          id: 10001,
          name: "电子游艺",
          platform: "slot"
        },
        {
          id: 10002,
          name: "体育赛事",
          platform: "sport"
        },
        {
          id: 10003,
          name: "真人视讯",
          platform: "live_casino"
        },
        {
          id: 10004,
          name: "棋牌游戏",
          platform: "chess"
        },
        {
          id: 10005,
          name: "捕鱼游戏",
          platform: "getfish"
        }
      ], //游戏类型
      blackGame: [],
      // showSingleNav:true,
      isSingle: true,
      currentBtn: "refund",
      platform: "all",
      searchKey: {
        siteId: this.$root.nowSite.id
      },
      pathUrl: "",
      table: {
        total: 0,
        data: [],
        loading: true,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "游戏平台",
            key: "className",
            align: "center",
            minWidth:65,
          },
          {
            title: "游戏名称",
            key: "name",
            align: "center",
            minWidth:65,
          },
          {
            title: "描述",
            key: "title",
            align: "center",
            display: "",
            minWidth:100,
            render: (h, params) =>
              h("div", [
                h(
                  "span",
                  {
                    style: {
                      display:
                        params.row.showStatus == "span"
                          ? "inline-block"
                          : "none"
                    }
                  },
                  this.$root.text(params.row.title)
                ),
                h("Input", {
                  style: {
                    display:
                      params.row.showStatus != "span"
                        ? "inline-block"
                        : "none",
                    width: "50%",
                    margin: "0 auto",
                    textAlign: "center"
                  },
                  props: {
                    value: this.editInfo[params.index].title
                  },
                  on: {
                    "on-change": e => {
                      this.editInfo[params.index].title = e.target.value;
                    }
                  }
                })
              ])
          },
          {
            title: "显示",
            key: "status",
            align: "center",
            minWidth:35,
            render: (h, params) => {
              if (
                this.blackGame.length > 0 &&
                this.blackGame.find(i => i === params.row.id)
              ) {
                return <span class="pr20 pl20 red-font">停用</span>;
              } else {
                return <span class="pr20 pl20">正常</span>;
              }
            }
          },
          {
            title: "操作",
            align: "center",
            minWidth:120,
            render: (h, params) => {
              const { level } = params.row;
              if (this.isSingle) {
                //单站
                return (
                  <div>
                    <a
                      class="ib mr10"
                      style={{
                        display:
                          (this.adminType == "super" ||
                            this.authInPage.indexOf("gameConfigUpBlackGame") !=
                              -1) &&
                          params.row.showStatus == "span"
                            ? "inline-block"
                            : "none"
                      }}
                      onClick={() => {
                        this.onStatus(params);
                      }}
                    >
                      {this.blackGame.length > 0 &&
                      this.blackGame.find(i => i === params.row.id)
                        ? "启用"
                        : "停用"}
                    </a>

                    <a
                      class="ib mr10"
                      style={{
                        display:
                          (this.adminType == "super" ||
                            this.authInPage.indexOf("gameConfigTitleUp") !=
                              -1) &&
                          params.row.showStatus == "span"
                            ? "inline-block"
                            : "none"
                      }}
                      onClick={() => {
                        this.$set(params.row, "showStatus", "input");
                        let gameId = params.row.classId;
                        let { id, title } = params.row;
                        this.table.data[params.index].showStatus = "input";
                        this.editInfo[params.index] = {
                          gameId: id,
                          title,
                          siteId: this.$root.nowSite.id
                        };
                      }}
                    >
                      编辑
                    </a>
                    <div
                      style={{
                        display:
                          params.row.showStatus == "input"
                            ? "inline-block"
                            : "none"
                      }}
                    >
                      <a
                        class="ib mr10"
                        onClick={() => {
                          let { title } = this.editInfo[params.index];
                          if (!title) this.editInfo[params.index].title = "-";
                          gameConfigTitleUp(
                            this.editInfo[params.index],
                            true
                          ).then(res => {
                            if (res != undefined && res.code == 200) {
                              this.$Message.success("描述修改成功");
                              this.table.data[params.index].title = title;
                              this.$set(params.row, "showStatus", "span");
                              this.table.data[params.index].showStatus = "span";
                              this.$set(params.row,'showStatus', 'span')
                            }
                          });
                        }}
                      >
                        确定
                      </a>
                      <a
                        class="ib mr10"
                        onClick={() => {
                          params.row.showStatus = "span";
                          this.table.data[params.index].showStatus = "span";
                        }}
                      >
                        取消
                      </a>
                    </div>
                    <a
                      class="mr10"
                      style={{
                        display:
                          (level > 2 || level == 2) &&
                          (this.adminType == "super" ||
                            this.authInPage.indexOf("gameConfigList" != -1)) &&
                          params.row.showStatus == "span"
                            ? "inline-block"
                            : "none"
                      }}
                      onClick={() => {
                        this.$router.push({
                          name: "gameList",
                          query: {
                            type: "refund",
                            siteId: this.$root.nowSite.id,
                            platform: params.row.platform,
                            classId: params.row.id,
                            name: params.row.name,
                            stage: "single"
                          }
                        });
                      }}
                    >
                      游戏列表
                    </a>
                  </div>
                );
              } else if (!this.isSingle) {
                //全站
                return (
                  <div>
                    <a
                      class="ib mr10"
                      style={{
                        display:
                          this.adminType == "super" ||
                          this.authInPage.indexOf("gameConfigUpBlackGameAll") !=
                            -1
                            ? "inline-block"
                            : "none"
                      }}
                      onClick={() => {
                        this.onStatus(params);
                      }}
                    >
                      {this.blackGame.length > 0 &&
                      this.blackGame.find(i => i === params.row.id)
                        ? "启用"
                        : "停用"}
                    </a>
                    <a
                      class="in mr5"
                      style={{
                        display:
                          (this.adminType == "super" ||
                            this.authInPage.indexOf(
                              "gameConfigClassification"
                            ) != -1) &&
                          (params.row.level > 2 || params.row.level == 2)
                            ? "inline-block"
                            : "none"
                      }}
                      onClick={() => {
                        this.$router.push({
                          name: "gameList",
                          query: {
                            type: "level",
                            siteId: this.$root.nowSite.id,
                            platform: params.row.platform,
                            classId: params.row.id,
                            name: params.row.name,
                            stage: "all"
                          }
                        });
                      }}
                    >
                      游戏列表
                    </a>
                  </div>
                );
              }
            }
          }
        ],
        copyColumns: []
      },
      table2: {
        total: 0,
        data: [],
        loading: true,
        // pageSizeOpts: [20, 30, 40],
        columns: [
          {
            title: "游戏平台",
            key: "className",
            align: "center"
          },
          {
            title: "游戏名称",
            key: "name",
            align: "center"
          },
          {
            title: "操作",
            align: "center",
            render: (h, params) => {
              const { level } = params.row;
              return (
                <div>
                  <a
                    class="mr10"
                    style={{
                      display:
                        (level > 2 || level == 2) &&
                        (this.adminType == "super" ||
                          this.authInPage.indexOf("gameConfigList" != -1))
                          ? "inline-block"
                          : "none"
                    }}
                    onClick={() => {
                      this.$router.push({
                        name: "gameList",
                        query: {
                          type: "refundSet",
                          siteId: this.$root.nowSite.id,
                          platform: params.row.platform,
                          classId: params.row.id,
                          name: params.row.name,
                          stage: "all"
                        }
                      });
                    }}
                  >
                    游戏列表
                  </a>
                </div>
              );
            }
          }
        ]
      },
      gameFrom: {},
      gameRule: {
        status: [
          {
            required: true,
            message: "请选择等级状态",
            trigger: "change"
          }
        ],
        created_user: [
          {
            required: true,
            message: "请填写创建人",
            trigger: "change"
          }
        ],
        className: [
          {
            required: true,
            message: "请填写游戏类型",
            trigger: "change"
          }
        ],
        platform: [
          {
            required: true,
            message: "请填写游戏平台",
            trigger: "change"
          }
        ],
        sequence: [
          {
            required: true,
            message: "请填写平台编号",
            trigger: "change"
          }
        ],
        tag: [
          {
            required: true,
            message: "请填写平台简介",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.resetData();
    });
  },
  methods: {
    //游戏列表
    resetSingle(type, isSingle) {
      this.$refs.table.setPage();
      this.isSingle = isSingle;
      if (this.currentBtn == type) return;
      this.currentBtn = type;
      this.resetData();
    },
    resetData() {
      let postData = {
        platform: this.platform ? this.platform : "all",
        siteId: this.$root.nowSite.id,
        limit: this.searchKey.limit
      };
      this.isSingleGetData(postData);
    },
    getData(data) {
      if (this.currentBtn === "refundSet") {
        data.params.platform ? data.params.platform : "all";
        data.params.limit = 100;
      }
      if (this.isSingle == undefined) return false;
      if (!data || !data.params.platform) return false;
      this.$root.startTableLoading()
      if (!this.isSingle) {
        gameConfigListAll(data).then(res => {
          if (res) this.resToTable(res, 'all')
          this.$root.endTableLoading()
        }).catch(error => this.$root.endTableLoading())
      } else {
        gameConfigList(data).then(res => {
          if (res) this.resToTable(res, 'single')
          if (res != undefined && res.code == 200) {
            res.data.list.data.forEach(t => t.showStatus = 'span')
          }
          this.$root.endTableLoading()
        }).catch(error => this.$root.endTableLoading())
      }
      // this.isSingle == false ? gameConfigListAll(data).then(res => { if (res) return this.resToTable(res, "all") }) : gameConfigList(data).then(res => {
      //       if (res != undefined && res.code == 200) res.data.list.data.forEach(item => (item.showStatus = "span"))
      //       if (res) return this.resToTable(res, "single");
      //     });
    },
    isSingleGetData(data) {
      // this.getGameList()
      let page = { page : this.page }
      this.isSingle == false
        ? this.getData({ params: data, query: page })
        : this.getData({ params: data, query: page });
    },
    resToTable(res, flag) {
      let newBlackGame=[];
      for(let key  in  res.data.black_game){
        newBlackGame.push(res.data.black_game[key])
      }
    
      this.blackGame = newBlackGame.map(i => (i = Number(i)));
      if (res.data.list.path) this.pathUrl = res.data.list.path;
    
      this.table.total = res.data.list.total;
      this.table.data = res.data.list.data;
      for (let i = 0; i < this.table.data.length; i++) {
        this.editInfo.push({
          title: "",
          id: null,
          siteId: this.$root.nowSite.id
        });
      }
      this.table.copyColumns = this.table.columns.filter(
        item => item.key != "title"
      );
      this.table2.data = res.data.list.data.filter(item => {
        return item.classId == 10001 || item.classId == 10004||item.classId==10005;
      });
      this.table2.total = this.table2.data.length;
    },
    //游戏类型
    // getGameList() {
    //   gameConfigClassification().then(res => {
    //     if(!res) return false
    //     this.gameList = res.data;
    //   });
    // },
    changePlatForm(e) {
      if (e === undefined) {
        let postData = {
          platform: "all",
          siteId: this.$root.nowSite.id
        };
        this.isSingleGetData(postData);
      } else {
        let postData = {
          platform: this.platform,
          siteId: this.$root.nowSite.id
        };
        this.isSingleGetData(postData);
      }
    },
    //添加游戏平台
    // addPlatform() {
    //   this.gameFrom = {}
    //   this.gamePlatformTitle = "create";
    //   this.$refs.gamePlatform.show();
    // },
    //编辑
    onEdit(data) {
      this.gameFrom = data.row;
      this.gamePlatformTitle = "edit";
      this.$refs.gamePlatform.show();
    },
    //切换状态
    onStatus(params) {
      this.$Message.config({
        top: 50,
        duration: 1
      });
      const content =
        this.blackGame.length > 0 &&
        this.blackGame.find(i => i === params.row.id)
          ? "启用"
          : "停用";
      let { id, status } = params.row;
      let data = {
        siteId: this.$root.nowSite.id,
        id: id,
        status: this.blackGame.find(i => i === params.row.id) ? "0" : "1"
      };
      this.$Tip.confirm({
        content: "您确定要" + content + params.row.name + "吗？",
        onOk: () => {
          this.isSingle == false
            ? gameConfigUpBlackGameAll(data, true).then(res => {
                if (res != undefined && res.code == 200) {
                  this.$Message.success(`${content}${params.row.name}成功`);
                  this.resetData();
                }
              })
            : gameConfigUpBlackGame(data, true).then(res => {
                if (res != undefined && res.code == 200) {
                  this.$Message.success(`${content}${params.row.name}成功`);
                  this.resetData();
                }
              });
        }
      });
    },
    //删除
    // onDelete(params) {
    //   let { id, status } = params.row;
    //   let data = {
    //     id: id
    //   };
    //   this.$Tip.confirm({
    //     content: `您确定删除${params.row.name}吗？`,
    //     onOk: () => {
    //       gameConfigDelGame(data).then(res => {
    //         if (res != undefined && res.code == 200) {
    //           this.table.data.splice(params.index, 1);
    //           this.table.total--;
    //         }
    //       });
    //     }
    //   });
    // },
    //列表
    onList(classId) {
      this.currentBtn = "level";
      let data = {
        platform: this.platform ? this.platform : "all",
        siteId: this.$root.nowSite.id,
        classId: classId
      };
      this.isSingleGetData(data);
      // this.$router.push({name:"gameList"})
    },
    onPageChange(page) {
      this.page =  page;
      let data = {
        ...this.searchKey,
        platform: this.platform ? this.platform : "all",
        siteId: this.$root.nowSite.id
      };
      this.getData({ params: data, query: { page } });
    },
    // 每页显示几条
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      let data = {
        ...this.searchKey,
        platform: this.platform ? this.platform : "all",
        siteId: this.$root.nowSite.id
      };
      this.getData({ params: data });
    },
    // 弹窗的提交
    search() {
      let data = {
        ...this.searchKey,
        platform: this.platform ? this.platform : "all",
        siteId: this.$root.nowSite.id
      };
      this.isSingleGetData(data);
    },
    submit() {
      this.$refs.gamePlatform.validate(valid => {
        if (valid) {
          // 添加等级
          this.$refs.gamePlatform.spinShow();
          if (this.gamePlatformTitle == "create") {
            gameConfigAddGame(this.gameFrom)
              .then(res => {
                this.$refs.gamePlatform.spinHide();
                if (res != undefined && res.code == 200) {
                  this.$refs.gamePlatform.hide();
                  let data = {
                    params: { limit: this.limit, siteId: this.$root.nowSite.id }
                  };
                  this.getData(data);
                }
              })
              .catch(error => {
                this.$refs.gamePlatform.spinHide();
              });
          } else {
            gameConfigUpGame(this.gameFrom)
              .then(res => {
                this.$refs.gamePlatform.spinHide();
                if (res != undefined && res.code == 200) {
                  this.$refs.gamePlatform.hide();
                  let data = {
                    params: { limit: this.limit, siteId: this.$root.nowSite.id }
                  };
                  this.getData(data);
                }
              })
              .catch(error => {
                this.$refs.gamePlatform.spinHide();
              });
          }
        }
      });
    }
  }
};
</script>

<style lang="less"  scoped>
@import "../../../styles/button.less";
@import "../../../styles/class.less";
.ivu-btn-group .ivu-btn + .ivu-btn {
  margin-left: 0;
}
.stop {
  color: #e4396c;
}
</style>
