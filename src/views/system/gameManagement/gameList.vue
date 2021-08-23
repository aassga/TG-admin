<template>
  <div>
    <div class="v2-search">
      <Form inline>
        <FormItem label="游戏平台：">
          <span class="bold">{{$route.query.name}}</span>
        </FormItem>
        <FormItem label="游戏名称">
          <Input v-model="gameName" class="w160x" placeholder="关键字"/>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.tableLoading"
            class="search"
            @click.prevent="searchSubmit"
          >查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table" v-if="this.type!=='refundSet'">
      <Tables
        ref="tables"
        :columns="type == 'level' ? table.copyColumns : table.columns"
        :value="table.data"
        :total="table.total"
        :loading="$root.tableLoading"
        @on-page-change="onPageChange"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-size-change="onPageSizeChange"
      ></Tables>
    </div>
    <div class="v2-table" v-if="this.type==='refundSet'">
      <Tables
        ref="tables"
        :columns="table2.columns"
        :value="table2.data"
        :total="table2.total"
        :loading="$root.tableLoading"
        @on-page-change="onPageChange"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-size-change="onPageSizeChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import {
  gameConfigTitleUp,
  gameConfigRebatePointsUp,
  gameConfigListAll,
  gameConfigList,
  gameConfigUpBlackGameAll,
  gameConfigUpBlackGame
} from "@/api/system";
import Tables from "@/components/tables";
import { getUserType } from "@/libs/util";
export default {
  name: "gameList",
  components: { Tables },
  data() {
    return {
      editInfo: [],
      page:"",
      // editInfo: {
      //   title:'',
      //   id: null,
      //   siteId: this.$root.nowSite.id
      // }, //编辑数据
      adminType: getUserType(),
      type: "",
      authInPage: JSON.parse(localStorage.authInPage),
      gameName: "",
      blackGame: null,
      limit: 20,
      table: {
        loading: true,
        data: [],
        total: 0,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "游戏名称",
            key: "name",
            align: "center",
            minWidth:90,
          },
          {
            title: "标签",
            key: "tag",
            align: "center",
            minWidth:90,
            render: (h, params) => (
              <span>{this.$root.text(params.row.tag)}</span>
            )
          },
          {
            title: "显示客户端",
            key: "devices",
            align: "center",
            minWidth:90,
            render: (h, params) => (
              <span>{this.$root.text(params.row.devices)}</span>
            )
          },
          {
            title: "描述",
            key: "title",
            align: "center",
            minWidth:120,
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
                      params.row.showStatus == "input"
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
            minWidth:50,
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
          // {
          //   title: "创建时间",
          //   key: "created_at",
          //   align: "center",
          //   render: (h, params) => (
          //     <span>
          //       {this.$route.query.stage != "single"
          //         ? this.$root.unixTime(params.row.created_at)
          //         : "-"}
          //     </span>
          //   )
          // },
          {
            title: "操作",
            align: "center",
            minWidth:80,
            render: (h, params) => {
              const { stage } = this.$route.query;
              if (stage === "single") {
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
                        this.changeStatus(params);
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
                        this.$set(
                          this.table.data[params.index],
                          "showStatus",
                          "input"
                        );
                        let gameId = params.row.classId;
                        let { id, title } = params.row;
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
                          // params.row.showStatus = "span";
                          gameConfigTitleUp(
                            this.editInfo[params.index],
                            true
                          ).then(res => {
                            if (res!= undefined && res.code == 200) {
                              this.$Message.success("描述修改成功");
                              this.table.data[params.index].title = title;
                              this.table.data[params.index].showStatus = "span";
                            } else {
                              this.$Message.error("描述修改失败");
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
                  </div>
                );
              } else {
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
                        this.changeStatus(params);
                      }}
                    >
                      {this.blackGame.length > 0 &&
                      this.blackGame.find(i => i === params.row.id)
                        ? "启用"
                        : "停用"}
                    </a>
                  </div>
                );
              }
            }
          }
        ]
      },
      copyColumns: [],
      table2: {
        loading: true,
        data: [],
        total: 0,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "游戏名称",
            key: "name",
            align: "center"
          },
          {
            title: "返水比例",
            key: "rebatePoints",
            align: "center",
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
                  // this.$root.text(params.row.rebatePoints)
                  params.row.rebatePoints
                ),
                h("InputNumber", {
                  style: {
                    display:
                      params.row.showStatus == "input"
                        ? "inline-block"
                        : "none",
                    width: "30%",
                    margin: "0 auto",
                    textAlign: "center"
                  },

                  props: {
                    value: Number(this.editInfo[params.index].rebatePoints),
                    max: 100,
                    min: 0
                  },
                  on: {
                    "on-change": value => {
                      this.editInfo[params.index].rebatePoints = value;
                    }
                  }
                }),
                "%"
              ])
          },
          {
            title: "操作",
            align: "center",
            render: (h, params) => {
              const { stage } = this.$route.query;
              let display = "";
              if (stage == "single") {
                display =
                  this.adminType == "super" ||
                  this.authInPage.indexOf("gameConfigUpBlackGame") != -1
                    ? "inline-block"
                    : "none";
              } else {
                display =
                  this.adminType == "super" ||
                  this.authInPage.indexOf("gameConfigUpBlackGame") != -1
                    ? "inline-block"
                    : "none";
              }
              return (
                <div>
                  <a
                    class="ib mr10"
                    style={{
                      display:
                        (this.adminType == "super" ||
                          this.authInPage.indexOf("gameConfigRebatePointsUp") !=
                            -1) &&
                        params.row.showStatus == "span"
                          ? "inline-block"
                          : "none"
                    }}
                    onClick={() => {
                      this.$set(
                        this.table2.data[params.index],
                        "showStatus",
                        "input"
                      );
                      // let gameId = params.row.classId;
                      let { id, rebatePoints, title } = params.row;
                      this.editInfo[params.index] = {
                        id,
                        rebatePoints
                      };
                      this.editInfo[ params.index].copyRebatePoints = rebatePoints;
                    }}
                  >
                    返水设置
                  </a>
                  <div
                    style={{
                      display: params.row.showStatus == "input" ? "inline-block" : "none"
                    }}
                  >
                    <a
                      class="ib mr10"
                      onClick={() => {
                        let { rebatePoints, copyRebatePoints } = this.editInfo[
                          params.index
                        ];
                        if (rebatePoints == copyRebatePoints) {
                          params.row.showStatus = "span";
                          this.table2.data[params.index].showStatus = "span";
                          this.$Message.success("返水修改成功");
                        } else {
                          // if (!rebatePoints) {
                          //   this.$Tip.info({ content: '请输入修改的返水比例'})
                          //   return false
                          // }
                          gameConfigRebatePointsUp( this.editInfo[params.index], true ).then(res => {
                            if (res!= undefined && res.code == 200) {
                              this.$Message.success("返水修改成功");
                              this.table2.data[params.index].showStatus =
                                "span";
                              this.table2.data[
                                params.index
                              ].rebatePoints = rebatePoints;
                            }
                          });
                        }
                        // params.row.showStatus = "span";
                      }}
                    >
                      确定
                    </a>
                    <a
                      class="ib mr10"
                      onClick={() => {
                        params.row.showStatus = "span";
                        this.table2.data[params.index].showStatus = "span";
                      }}
                    >
                      取消
                    </a>
                  </div>
                </div>
              );
            }
          }
        ]
      }
    };
  },

  mounted() {
    this.type = this.$route.query.type;
    const { stage, siteId, platform, classId, name, type } = this.$route.query;
    let data = { siteId, platform, classId };
    this.getData({ params: data });
  },
  methods: {
    //描述编辑
    searchSubmit() {
      const { stage, siteId, platform, classId, name } = this.$route.query;
      let data = { siteId, platform, classId, name: this.gameName };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data });
    },
    getData(data) {
      this.$root.startTableLoading();
      if (this.$route.query.stage == "single") {
        gameConfigList(data).then(res => {
          if (res!= undefined && res.code == 200) {
            res.data.list.data.forEach(item => (item.showStatus = "span"));
          }
          // let blackGame = res.data.black_game;
          let newBlackGame=[];
      for(let key  in  res.data.black_game){
        newBlackGame.push(res.data.black_game[key])
      }
          this.blackGame = newBlackGame.map(i => (i = Number(i)));
          this.table.data = res.data.list.data;
          for (let i = 0; i < this.table.data.length; i++) {
            this.editInfo.push({
              title: "",
              gameId: null,
              siteId: this.$root.nowSite.id
            });
          }
          this.table.total = res.data.list.total;
          this.$root.endTableLoading()
        }).catch(error => this.$root.endTableLoading())
      } else {
   
        gameConfigListAll(data).then(res => {
          if (res!= undefined && res.code == 200) {
            //返水编辑
            res.data.list.data.forEach(item => (item.showStatus = "span"));
          }
          // let blackGame = Array(res.data.black_game);
                 // let blackGame = res.data.black_game;
                 let newBlackGame=[];
      for(let key  in  res.data.black_game){
        newBlackGame.push(res.data.black_game[key])
      } 
          this.blackGame = newBlackGame.map(i => (i = Number(i)));
          this.table.data = res.data.list.data;
          this.table.total = res.data.list.total;
          this.table2.data = res.data.list.data;
          for (let i = 0; i < this.table.data.length; i++) {
            this.editInfo.push({
              rebatePoints: "",
              copyRebatePoints: "",
              id: null
            });
          }
          this.table2.total = res.data.list.total;
          this.table.copyColumns = this.table.columns.filter(
            item => item.key != "title"
          );
          this.$root.endTableLoading()
        }).catch(error => this.$root.endTableLoading())
      }
      // if (this.type === "refundSet") {
      //   gameConfigRebatePointsUp(data)
      // }
    },
    onPageChange(page) {
      const { stage, siteId, platform, classId, name } = this.$route.query;
      let data = { siteId, platform, classId, limit: this.limit };
      this.page=page;
      this.getData({ params: data, query: { page } });
    },
    onPageSizeChange(pageSize) {
      this.limit = pageSize;
      const { stage, siteId, platform, classId, name } = this.$route.query;
      let data = { siteId, platform, classId, limit: pageSize };
      this.getData({ params: data });
    },
    changeStatus(params) {
      this.$Message.config({
        top: 50,
        duration: 1
      });
      let { stage, siteId, platform, classId } = this.$route.query;
      let content =
        this.blackGame.length > 0 &&
        this.blackGame.find(i => i === params.row.id)
          ? "启用"
          : "停用";
      let data = {
        siteId,
        id: params.row.id,
        status:
          this.blackGame.length > 0 &&
          this.blackGame.find(i => i === params.row.id)
            ? "0"
            : "1"
      };
      this.$Tip.confirm({
        content: `您确定要${content}${params.row.name}吗？`,
        onOk: () => {
          if (stage == "single") {
            gameConfigUpBlackGame(data, true).then(res => {
              if (res!= undefined && res.code == 200) {
                this.$Message.success(`${content}${params.row.name}成功`);
                let postData = { siteId, platform, classId,limit:this.limit};
                let page=this.page;
                this.getData({ params: postData,query: { page } });
              }
            });
          } else {
            gameConfigUpBlackGameAll(data, true).then(res => {
              if (res!= undefined && res.code == 200) {
                this.$Message.success(`${content}${params.row.name}成功`);
                let postData = { siteId, classId, platform,limit:this.limit};
                 let page=this.page;
                this.getData({ params: postData,query: { page } });
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../styles/button.less";
.bold {
  font-weight: bold;
}

.ivu-table{
  color: #444;
}
</style>