<template>
  <div>
    <div class="v2-button">
      <Button @click="$router.push({name:'agencyLevelAdd'})" class="w120x mt10" >
        <span style="margin-top:-4px">添加代理等级</span>
      </Button>
    </div>
    <div class="v2-table">
      <Tables
        editable
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        :more="table.more"
        @on-change-status="changeStatus"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-edit="onEdit"
      ></Tables>
    </div>
  </div>
</template>
<script>
import { agencyLevelData } from "@/api/data";
import Tables from "@/components/tables";
import AgenccyLevelExpand from "./components/agencyLevelExpand";
export default {
  name: "agencyLevel",
  components: {
    Tables,
    AgenccyLevelExpand
  },
  data() {
    return {
      table: {
        total: 0,
        title: "代理等级",
        data: [],
        columns: [
          {
            title: "代理等级",
            key: "level",
            align: "center"
          },
          {
            title: "等级别称",
            key: "name",
            align: "center"
          },
          {
            title: "会员人数",
            key: "vipNum",
            align: "center"
          },
          {
            title: "晋级所需最低投注",
            key: "lowestBetting",
            align: "center"
          },
          {
            title: "晋级所需最低存款",
            key: "lowestDeposit",
            align: "center",
            render:(h,params)=>{
              return(
                <span style="color:#62B1FD">{params.row.lowestDeposit}</span>
              )
           }
          },
          {
            title: "晋级所需活跃人数",
            key: "activeMember",
            align: "center"
          },
          {
            title: "创建时间",
            key: "createTime",
            align: "center"
          },
          {
            title: "默认等级",
            key: "default",
            align: "center",
            render: (h, params) => {
              let color = params.row.default ? "#daa127" : "";
              return (
                <span style={{ color }}>
                  {params.row.default ? "是" : "否"}
                </span>
              );
            }
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            render: (h, params) => {
              let color = params.row.status ? "#A5A5A5" : "#F84040";
              return (
                <span style={{ color }}>
                  {params.row.status ? "正常" : "停用"}
                </span>
              );
            }
          },
          {
            title: "操作",
            key: "handle",
            align: "center",
            options: ["status", "edit"]
          },
          {
            title: "...",
            type: "expand",
            align: "center",
            render: (h, params) => {
              return h(AgenccyLevelExpand);
            }
          }
        ]
      }
    };
  },
  methods: {
    getData(query) {
      agencyLevelData().then(res => {
        this.table.loading = true;
        setTimeout(() => {
          this.table.data = res.data;
          this.table.loading = false;
        }, 2000);
      });
    },
    changeStatus(params) {
      let txt = params.row.status
        ? "您确定停用此账号吗?"
        : "您确定启用此账号吗?";
      let txt2 = params.row.status ? "停用此账号成功" : "启用此账号成功";
      this.$Tip.confirm({
        content: txt,
        onOk: () => {
          this.$Tip.success({
            content: txt2,
            onOk: () => {}
          });
        }
      });
    },
    onPageChange(page) {
      this.getData(page);
    },
    onPageSizeChange() {},
    onEdit(params) {
      this.$router.push({ name: "agencyLevelAdd", query: { ver: 1 } });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  }
};
</script>
<style lang="less" scoped>
.w120x {
  width: 120px;
  height: 30px;
}
</style>


