<template>
  <div>
    <div class="clearfix">
      <div class="v2-button fl w70">
        <Button @click.prevent="addLevel" v-if="(adminType == 'super') || (authInPage.indexOf('refundLevelCreate') != -1)" >添加返水等级</Button>
      </div>
      <div class="fr mr20 r10">
        <Poptip trigger='hover' placement='right-start' content='大股东继承默认等级返水'>
          <Icons type='bangzhutishi' color='#E4E4E4' :size='26'/>
        </Poptip>
      </div>
    </div>
    <div class="v2-table">
      <Tables
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        :page="false"
        @on-details="onDetails"
        @on-change-status="onChangeStatus"
        @on-edit="onEdit"
        @on-page-change="onPageChange"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-size-change="onPageSizeChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import Icons from '_c/icons';
import { getUserType } from '@/libs/util';
import {
  getMemberRefundLevelData,
  refundLevelModifyStatus
} from "@/api/member";
export default {
  name: "memberRefund",
  components: { Tables, Icons },
  data() {
    return {
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      table: {
        loading: true,
        total: 0,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "返水等级",
            key: "levelName",
            align: "center",
            minWidth:60,
          },
          {
            title: "返水等级别称",
            key: "levelAlias",
            align: "center",
            minWidth:80,
          },
          {
            title: "最低下注",
            key: "lessBetAmount",
            align: "center",
            minWidth:60,
          },
          {
            title: "最大返水",
            key: "maxBonusAmonut",
            align: "center",
            minWidth:60,
          },
          {
            title: "创建日期",
            key: "created_at",
            align: "center",
            minWidth:110,
            render: (h, params) => (
              <span class="pl5 pr5">{this.$root.newUnixTime(params.row.created_at)}</span>
            )
          },
          {
            title: "默认等级",
            key: "default",
            align: "center",
            minWidth:60,
            render: (h, params) => (
              <span
                style={{
                  color: params.row.default === "yes" ? "#444" : "#ff2626"
                }}
              >
                {params.row.default === "yes" ? "是" : "否"}
              </span>
            )
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            minWidth:35,
            render: (h, params) => {
              return (
                <span
                  style={{
                    color:
                      params.row.status === "yes" ? " #444 " : "#FF2626 "
                  }}
                >
                  {params.row.status === "yes" ? "正常" : "停用"}
                </span>
              );
            }
          },
          {
            title: "操作",
            align: "center",
            minWidth:80,
            render: (h,params) => {
              let color = params.row.default == 'yes' ? '#918b8b' : ''
              return (
                <div>
                  <a class='ib mr10'
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('refundLevelUpdate') != -1) ? 'inline-block' : 'none'
                    }}
                    onClick={() => {
                      this.onEdit(params)
                    }}
                  >编辑</a>
                  <a class="ib mr10"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('refundLevelModifyStatus') != -1) ? 'inline-block' : 'none',
                      color
                    }}
                    onClick={() => {
                      if (params.row.default == 'no') this.onChangeStatus(params)}
                    }
                  >{params.row.status == 'yes' ? '停用' : '启用'}</a>
                </div>
              )
            }
          }
        ],
        data: []
      }
    };
  },
  watch: {
    "$root.nowSite": {
      handler(newVal, oldVal) {
        this.getData({siteId: newVal.id});
      },
      deep: true,
      immediate: true
    }
  },
  mounted(){
    if(this.authInPage.indexOf('refundLevelUpdate')==-1&&this.authInPage.indexOf('refundLevelModifyStatus')==-1){
      let arr=[]; 
      this.table.columns.forEach(t=>{
        if(t.title!='操作'){arr.push(t)}
      })
      this.table.columns=arr;
    }
  },
   methods: {
    getData(data) {
      this.$root.startTableLoading();
      getMemberRefundLevelData(data).then(res => {
       if ( res != undefined && res.code == 200) {
          this.table.data = res.data;
          this.table.total = res.data.length;
       }
       this.$root.endTableLoading()
      });
    },
    addLevel() {
      this.$router.push({
        name: "memberRefundEdit",
        params: { page: "create" },
        query: { siteId: this.$root.nowSite.id, id: 0 }
      });
    },
    onDetails(params) {
      this.$router.push({
        name: "memberRefundDetails",
        query: {
          siteId: this.$root.nowSite.id,
          id: params.row.id
        }
      });
    },
    onPageSizeChange() {},
    onEdit(params) {
      const { id, status } = params.row
      this.$router.push({
        name: "memberRefundEdit",
        params: { page: "edit" },
        query: { siteId: this.$root.nowSite.id, id, status }
      });
    },
    onPageChange(page) {
      let data = { siteId: this.$root.nowSite.id, page }
      this.getData(data)
    },
    onChangeStatus(params) {
      let text, msg;
      const { status, levelName, id } = params.row;
      if (status === "yes") {
        text = `您确定停用${levelName}吗？`;
        msg = `停用${levelName}成功`;
      }
      if (status === "no") {
        text = `您确定启用${levelName}吗？`;
        msg = `启用${levelName}成功`;
      }
      const data = {
        siteId: this.$root.nowSite.id,
        id: id,
        statusKey: "status",
        statusVal: status === "yes" ? 0 : 1
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          refundLevelModifyStatus(data, true).then(res => {
            if(res != undefined && res.code == 200) {
              this.$Message.success(msg)
              params.row.status = status === "yes" ? "no" : "yes";
            }
          });
        }
      });
    }
  }
};
</script>

