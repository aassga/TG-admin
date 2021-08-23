<template>
  <div class="v2-search">
    <div class="v2-search bb mb20" style="height:38px">
      <ButtonGroup
        class="repay-button"
      >
        <Button
          class="fontColor"
          @click="resetSingle('refund',true)"
          v-if="(adminType == 'super') || (authInPage.indexOf('SiteGameControlList') != -1)"
          :class="currentBtn == 'refund' ? 'active' : ''"
        >单站游戏控制</Button>
       <span  v-if="rentType!='rent'">
           <Button
         class="fontColor"
          @click="resetSingle('refundSet',false)"
          v-if="(adminType == 'super') || (authInPage.indexOf('AllSiteGameControlList') != -1)"
          :class="currentBtn == 'refundSet' ? 'active' : ''"
        >全站游戏控制</Button>
       </span>
      </ButtonGroup>
    </div>
    <div class="mb20">
        <Button class="mr20 lh48 h48 w120x txt-a" v-for="t in gameList" :key=t.id  :class="searchKey.id==t.id? 'activeType':''" @click.stop="searchKey.id=t.id;getData()">
          {{t.name}}
        </Button>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :value="table.data"
        :columns="table.columns"
        :total="table.total"
        @on-page-change="onPageChange"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-size-change="onPageSizeChange"
        @on-change-status="onStatus"
       
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from "_c/tables";
import Modals from "@/components/modals";
import {
  SiteGameControlList,//单站列表
  SiteGameControlStatus,//单站状态修改
  SiteGameControlTitle,//单站描述
  gameConfigTitleUp, //游戏描述(单站)
  AllSiteGameControlList,//全站列表
  AllSiteGameControlStatusUp//全站状态修改
   // AllSiteGameControlUp,//全站状态修改
} from "@/api/system";
import { getUserType } from "@/libs/util";
export default {
  name: "gameManageX",
  components: {
    Tables,
    Modals
  },
  data() {
    return {
      searchKey:{
        siteId:this.$root.nowSite.id,
        limit:20,
        page:1,
        id:'10004'
      },
      editInfo: [],
      rentType:localStorage.loginType,
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      gameList: [
        // {
        //   id: 0,
        //   name: "全部",
        //   platform: "all"
        // },
        {
          id: 10004,
          name: "棋牌游戏",
          platform: "chess"
        },
        {
          id: 10001,
          name: "电子游艺",
          platform: "slot"
        },
        {
          id: 10005,
          name: "捕鱼游戏",
          platform: "getfish"
        },
        {
          id: 10000,
          name: "彩票游戏",
          platform: "lottery"
        },
        {
          id: 10003,
          name: "真人视讯",
          platform: "live_casino"
        },
        {
          id: 10002,
          name: "体育赛事",
          platform: "sport"
        },
      ], //游戏类型
      blackGame: [],
      isSingle: true,
      currentBtn: '',
      platform: "all",
      pathUrl: "",
      table: {
        total: 0,
        data: [],
        loading: true,
        pageSizeOpts: [20, 30, 40, 50],
        columns:[],
      },
      columns: [
          {
            title: "游戏类型",
            key: "className",
            align: "center",
            minWidth:65,
          },
          {
            title: "游戏平台",
            key: "name",
            align: "center",
            minWidth:65,
          },
          {
            title: "客户端",
            key: "devices",
            align: "center",
            minWidth:65,
            render:(h,params)=><span>{this.$root.text(params.row.devices)}</span>
          },
          {
            title: "描述",
            key: "title",
            align: "center",
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
                    value: this.editInfo[params.index].title||null
                  },
                  on: {
                    "on-change": e => {
                      this.editInfo[params.index].title = e.target.value;
                    },
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
                params.row.status=='no'
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
              if (this.isSingle) {
                //单站
                return (
                  <div>
                    <a
                      class="ib mr10"
                      style={{
                        display:
                          // (this.adminType == "super" ||
                          //   this.authInPage.indexOf("gameConfigUpBlackGame") !=
                          //     -1) &&
                          params.row.showStatus == "span"
                            ? "inline-block"
                            : "none"
                      }}
                      onClick={() => {
                        this.onStatus(params);
                      }}
                    >
                      {params.row.status=='yes'
                        ? "停用"
                        : "正常"}
                    </a>
                    <a
                      class="ib mr10"
                      style={{
                        display:
                          // (this.adminType == "super" ||
                          //   this.authInPage.indexOf("gameConfigTitleUp") !=
                          //     -1) &&
                          params.row.showStatus == "span"
                            ? "inline-block"
                            : "none"
                      }}
                      onClick={() => {
                        this.$set(params.row, "showStatus", "input");       
                        let { id, title } = params.row;
                        this.editInfo[params.index] = {
                          id,
                          title,
                          siteId: this.$root.nowSite.id
                        };
                        this.table.data[params.index].showStatus = "input";
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
                          // if (!title) this.editInfo[params.index].title = "-";
                          SiteGameControlTitle(
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
                          (this.adminType == "super" ||
                            this.authInPage.indexOf("gameConfigList" != -1)) &&
                          params.row.showStatus == "span"&&this.searchKey.id!='10002'&&this.searchKey.id!='10003'
                            ? "inline-block"
                            : "none"
                      }}
                      onClick={() => {
                        this.$router.push({
                          name: "gameListX",
                          query: {
                            type: "single",
                            siteId: this.$root.nowSite.id,
                            id: params.row.id,
                            name: params.row.name,
                            upid:this.searchKey.id
                          }
                        });
                      }}
                    >
                      游戏列表
                    </a>
                  </div>
                );
              } else if (!this.isSingle) {
                let id = this.searchKey.id;
                //全站
                return (
                  <div>
                    <a
                      class="ib mr10"
                      // style={{
                      //   display:
                      //     this.adminType == "super" ||
                      //     this.authInPage.indexOf("gameConfigUpBlackGameAll") !=
                      //       -1
                      //       ? "inline-block"
                      //       : "none"
                      // }}
                      onClick={() => {
                        this.onStatus(params);
                      }}
                    >
                      {params.row.status=='yes'? "停用": "正常"}
                    </a>
                    <a
                      class="in mr5"
                      style={{
                        display:
                          id!='10003'&&id!='10002'
                            ? "inline-block"
                            : "none"
                      }}
                      onClick={() => {
                        this.$router.push({
                          name: "gameListX",
                          query: {
                            siteId: this.$root.nowSite.id,
                            id: params.row.id,
                            name: params.row.name,
                            type: "all",
                            upid:this.searchKey.id
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
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.resetSingle('refund',true);
    });
  },
  methods: {
    //游戏列表
    resetSingle(type, isSingle) {
      this.$refs.table.setPage();
      this.isSingle = isSingle;
      if (this.currentBtn == type) return;
      this.currentBtn = type;
      this.getData();
    },
    getData() {
      let data ={...this.searchKey}
      this.$root.startTableLoading();
      if(this.currentBtn=='refund'){
        SiteGameControlList(data).then(res=>{
          if(res&&res.code==200){
            this.editInfo=[]
            this.table.data = res.data.data;
            this.table.total = res.data.total;
            this.table.data.forEach(t=>{
              this.editInfo.push({
                title: t.title,
                id: t.id,
                siteId: this.$root.nowSite.id
              });
            })
            this.table.data.forEach(t=>{
              t.showStatus = 'span';
            })
            if(this.searchKey.id!='10002'&&this.searchKey.id!='10003'){
                this.table.columns = this.columns.filter(t=>t.key!='devices')
            }else{
              this.table.columns = this.columns
            }
            this.$root.endTableLoading()
          }else{
            this.$root.endTableLoading()
          }
        }).catch(error=>this.$root.endTableLoading())
      }else{
        AllSiteGameControlList(data).then(res=>{
          if(res&&res.code==200){
            this.table.data = res.data.data;
            this.table.total = res.data.total;
            this.table.data.forEach(t=>{
              t.showStatus = 'span';
              if(this.searchKey.id!='10002'&&this.searchKey.id!='10003'){
                this.table.columns = this.columns.filter(t=>t.key!='devices'&&t.key!='title')
              }else{
                this.table.columns = this.columns.filter(t=> t.key!='title')
              }
              this.$root.endTableLoading()
            })}else{
            this.$root.endTableLoading()
          }
        })
      }
      
    },
    //切换状态
    onStatus(params) {
      this.$Message.config({
        top: 50,
        duration: 1
      });
      let { id, status } = params.row;
      let data = {
        siteId: this.$root.nowSite.id,
        id,
        status: status=='yes'?'no':'yes'
      };
      this.$Tip.confirm({
        content: `您确定要${status=='yes'?'停用【'+params.row.name:'启用【'+params.row.name}】吗?`,
        onOk: () => {
          if(this.currentBtn=='refund'){
            SiteGameControlStatus(data, true).then(res => {
                if (res != undefined && res.code == 200) {
                  this.$Message.success(`${status=='yes'?'停用':'启用'}${params.row.name}成功`);
                  this.getData();
                }
            })
          }else{
            // data.payline = params.row.payline?params.row.payline:params.row.payline==0?0:'';
            // data.rebatePoints = params.row.rebatePoints||'';
            
            AllSiteGameControlStatusUp(data,true).then(res=>{
              if (res != undefined && res.code == 200) {
                  this.$Message.success(`${status=='yes'?'停用':'启用'}${params.row.name}成功`);
                  this.getData();
                }
            })
          }
            
        }
      });
    },
    onPageChange(page) {
      this.searchKey.page =  page;
      let data = {
        ...this.searchKey,
        platform: this.platform ? this.platform : "all",
      };
      this.getData(data);
    },
    // 每页显示几条
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      let data = {
        ...this.searchKey,
        platform: this.platform ? this.platform : "all",
      };
      this.getData(data);
    },
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
.activeType {
  background:#2d8cf0;
  color: white;
}
</style>
