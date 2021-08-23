<template>
  <div>
    <div class="v2-search">
      <Form inline>
        <FormItem label="游戏平台：">
          <span class="bold">{{$route.query.name}}</span>
        </FormItem>
        <FormItem label="游戏名称">
          <Input v-model="searchKey.gameName" class="w160x" placeholder="关键字" />
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
    <div class="v2-table">
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
  </div>
</template>
<script>
import {
  AllSiteGameControlList, //全站游戏列表
  SiteGameControlList, //单站游戏列表
  SiteGameControlStatus, //单站状态修改
  AllSiteGameControlStatusUp, //全站状态修改
  SiteGameControlTitle, //单站描述修改
  AllSiteGameControlUp,
} from "@/api/system";
import Tables from "@/components/tables";
import { getUserType } from "@/libs/util";
export default {
  name: "gameListX",
  components: { Tables },
  data() {
    return {
      editInfo: [],
      searchKey: {
        limit: 20,
        page: 1,
        gameName: "",
      },
      page: "",
      adminType: getUserType(),
      type: "",
      load:false,
      authInPage: JSON.parse(localStorage.authInPage),
      table: {
        loading: true,
        data: [],
        total: 0,
        pageSizeOpts: [20, 30, 40, 50],
        columns: []
      },
      columns: [
        {
          title: "游戏名称",
          key: "name",
          align: "center",
          minWidth: 90
        },
        {
          title: "客户端",
          key: "devices",
          align: "center",
          minWidth: 90,
          render: (h, params) => (
            <span>{this.$root.text(params.row.devices.replace('pc','PC').replace('ios','IOS').replace('h5','H5').replace('android','Android'))}</span>
          )
        },
        {
          title: "描述",
          key: "title",
          align: "center",
          minWidth: 120,
          render: (h, params) =>
            h("div", [
              h(
                "span",
                {
                  style: {
                    display:
                      params.row.showStatus == "span" ? "inline-block" : "none"
                  }
                },
                this.$root.text(params.row.title)
              ),
              h("Input", {
                style: {
                  display:
                    params.row.showStatus == "input" ? "inline-block" : "none",
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
          title: "线数",
          key: "payline",
          align: "center",
          minWidth: 90,
          render: (h, params) =>
            h("div", [
              h(
                "span",
                {
                  style: {
                    display:
                      params.row.showStatus == "span" ? "inline-block" : "none"
                  }
                },
                params.row.payline !=0? params.row.payline : "-"
              ),
              h("Input", {
                style: {
                  display:
                    params.row.showStatus != "span" ? "inline-block" : "none",
                  width: "70%",
                  margin: "0 auto",
                },
                props: {
                   value: this.editInfo[params.index].payline=='0'?null:this.editInfo[params.index].payline,
                  maxLength:10,
                },
                on: {
                  "on-change": e => {
                    this.editInfo[params.index].payline = e.target.value==0?'':e.target.value;
                  }
                }
              }),
            ])
        },
        {
          title: "返水比例",
          key: "rebatePoints",
          align: "center",
          minWidth: 90,
          render: (h, params) =>
            h("div", [
              h(
                "span",
                {
                  style: {
                    display:
                      params.row.showStatus == "span" ? "inline-block" : "none"
                  }
                },
                params.row.rebatePoints ? params.row.rebatePoints : "-"
              ),
              h("InputNumber", {
                style: {
                  display:
                    params.row.showStatus != "span" ? "inline-block" : "none",
                  width: "50%",
                  margin: "0 auto",
                  textAlign: "center"
                },
                props: {
                  value: Number(this.editInfo[params.index].rebatePoints) || null,
                  min:0,
                  max:100,
                },
                on: {
                  "on-change": e => {
                    this.editInfo[params.index].rebatePoints = Number(e);
                  }
                }
              }),
              h(
                "span",
                params.row.rebatePoints ?'%': ""
              ),
            ])
        },
        {
          title: "显示",
          key: "status",
          align: "center",
          minWidth: 50,
          render: (h, params) => {
            if (params.row.status == "no") {
              return <span class="pr20 pl20 red-font">停用</span>;
            } else {
              return <span class="pr20 pl20">正常</span>;
            }
          }
        },
        {
          title: "操作",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            const { type } = this.$route.query;
            return (
              <div>
                <a
                  class="ib mr10"
                  style={{
                    display:
                      params.row.showStatus == "span"
                        ? "inline-block"
                        : "none"
                  }}
                  onClick={() => {
                    this.changeStatus(params);
                  }}
                >
                  {params.row.status == "no" ? "正常" : "停用"}
                </a>

                <a
                  class="ib mr10"
                  disabled={this.load}
                  style={{
                    display:
                      params.row.showStatus == "span" &&
                      this.$route.query.id != "10006"
                        ? "inline-block"
                        : "none"
                  }}
                  onClick={() => {
                    this.$set(
                      this.table.data[params.index],
                      "showStatus",
                      "input"
                    );
                    let {
                      id,
                      title,
                      payline,
                      rebatePoints,
                      status
                    } = params.row;
                    this.editInfo[params.index] = {
                      id,
                      title,
                      payline,
                      rebatePoints,
                      status,
                      siteId:this.$root.nowSite.id
                    };
                  }}
                >
                  编辑
                </a>
                <div
                  style={{
                    display:
                      params.row.showStatus == "input" ? "inline-block" : "none"
                  }}
                >
                  <a
                    class="ib mr10"
                    disabled={this.load}
                    onClick={() => {
                      this.set(this.editInfo[params.index], params.index);
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
          }
        }
      ]
    };
  },
  mounted() {
    this.type = this.$route.query.type;
    const { siteId, id ,upid} = this.$route.query;
    let data = { siteId, id ,upid};
    this.getData(data);
  },
  methods: {
    //描述编辑
    searchSubmit() {
    this.searchKey.page = 1;
      const { siteId, id ,upid} = this.$route.query;
      let data = { siteId, id, name: this.searchKey.gameName };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData(data);
    },
    set(data, i) {
      if (this.type == "single") {
        if(data.title==this.table.data[i].title){
        this.table.data[i].showStatus = "span";
        this.$Message.error("未做任何更改");
        return
      }
        this.load = true;
        delete data.payline;
        delete data.rebatePoints;
        delete data.status;
        let { title } = data;
        if(!data.title&&data.title!=0) data.title='';
        SiteGameControlTitle(data, true).then(res => {
          if (res && res.code == 200) {
            this.$Message.success("描述修改成功");
            this.table.data[i].title = title;
            this.table.data[i].showStatus = "span";
            this.load = false;
          } else {
            this.$Message.error("描述修改失败");
            this.load = false;
          }
        });
      } else {
        if(data.rebatePoints==this.table.data[i].rebatePoints&&data.payline==this.table.data[i].payline){
        this.table.data[i].showStatus = "span";
        this.$Message.error("未做任何更改");
        return
      }
        let { rebatePoints, payline, title } = data;
        if(!data.rebatePoints) data.rebatePoints = '0';
        if(!data.payline) {
            data.payline ='0';
        }

        AllSiteGameControlUp(data, true).then(res => {
          if (res != undefined && res.code == 200) {
            this.$Message.success("修改成功");
            this.table.data[i].rebatePoints = rebatePoints;
            this.table.data[i].payline = payline;
            this.table.data[i].title = title;
            this.table.data[i].showStatus = "span";
            this.load = false;
          } else {
            this.$Message.error("修改失败");
            this.load = false;
          }
        });
      }
    },
    getData(data) {
      this.$root.startTableLoading();
      data.limit = this.searchKey.limit;
      data.page = this.searchKey.page;
      if (this.$route.query.type == "single") {
        //单站
        
        SiteGameControlList(data)
          .then(res => {
            if (res != undefined && res.code == 200) {
              this.editInfo=[];
              res.data.data.forEach(item => (item.showStatus = "span"));
              this.table.data = res.data.data;
              this.table.data.forEach(t=>{
                
              this.editInfo.push({
                title: t.title,
                id: t.id,
                siteId: this.$root.nowSite.id
              });
            })
              this.table.total = res.data.total;
              this.table.columns = this.columns.filter(
                t => t.key != "payline" && t.key != "rebatePoints"
              );
              this.$root.endTableLoading();
            } else {
              this.$root.endTableLoading();
            }
          })
          .catch(error => this.$root.endTableLoading());
      } else {
        //全站
        AllSiteGameControlList(data)
          .then(res => {
            if (res != undefined && res.code == 200) {
              this.editInfo=[];
              res.data.data.forEach(item => (item.showStatus = "span"));
              this.table.data = res.data.data;
              this.table.data.forEach(t=>{
              this.editInfo.push({
                title: t.title,
                rebatePoints:Number(t.rebatePoints),
                payline:t.payline,
                id: t.id,
                siteId: this.$root.nowSite.id
              });
            })
            
              this.table.total = res.data.total;
              if (data.upid == "10004"||data.upid=="10005") {
                this.table.columns = this.columns.filter(
                  t => t.key != "payline"
                );
              } else {
                this.table.columns = this.columns.filter(
                  t => t.key!='title'
                );
              }
              this.$root.endTableLoading();
            } else {
              this.$root.endTableLoading();
            }
          })
          .catch(error => this.$root.endTableLoading());
      }
    },
    onPageChange(page) {
      const { siteId, id ,upid} = this.$route.query;
      let data = { siteId, id,upid, limit: this.searchKey.limit };
      data.page = this.searchKey.page = page;
      this.getData(data);
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      const { siteId, id ,upid} = this.$route.query;
      let data = { siteId, id,upid, limit: pageSize };
      this.getData(data);
    },
    changeStatus(params) {
      this.$Message.config({
        top: 50,
        duration: 1
      });
      let { siteId, id, type } = this.$route.query;
      let content = params.row.status == "yes" ? "停用" : "启用";
      let data = {
        siteId,
        id: params.row.id,
        status: params.row.status == "yes" ? "no" : "yes"
      };
      this.$Tip.confirm({
        content: `您确定要${content}${params.row.name}吗？`,
        onOk: () => {
          if (type == "single") {
            SiteGameControlStatus(data, true).then(res => {
              if (res != undefined && res.code == 200) {
                this.$Message.success(`${content}${params.row.name}成功`);
                let postData = {
                  siteId,
                  id,
                  limit: this.searchKey.limit,
                  page: this.searchKey.page
                };
                this.getData(postData);
              }
            });
          } else {
            data.payline = params.row.payline;
            data.rebatePoints = params.row.rebatePoints;
            AllSiteGameControlStatusUp(data, true).then(res => {
              if (res != undefined && res.code == 200) {
                this.$Message.success(`${content}${params.row.name}成功`);
                let postData = {
                  siteId,
                  id,
                  limit: this.searchKey.limit,
                  page: this.searchKey.page
                };
                this.getData(postData);
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

.ivu-table {
  color: #444;
}
</style>