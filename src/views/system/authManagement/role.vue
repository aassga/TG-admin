<template>
  <div>
    <div class="mt10 mb20">
      <Button class="w130x oldColor" @click="addRole">新增角色</Button>
    </div>
    <div class="v2-table">
      <Tables
        ref="dragable"
        :columns="table.columns"
        :page="table.page"
        :loading="$root.tableLoading"
        :value="table.data"
        @on-edit="onEdit"
        @on-delete="onDelete"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import { getRoleList, roleDel } from "@/api/system";
export default {
  components: { Tables },
  data() {
    return {
      table: {
        page: false,
        loading: true,
        columns: [
          {
            title: "ID",
            key: "id",
            align: "center",
            width: 50
          },
          {
            title: "角色名称",
            key: "title",
            align: "center"
          },
          {
            title: "角色描述",
            key: "description",
            align: "center"
          },
          {
            title: "更新时间",
            key: "updated_at",
            align: "center",
            render: (h, params) => {
              return <span>{this.$root.unixTime(params.row.updated_at)}</span>;
            }
          },
          {
            title: "操作",
            key: "handle",
            align: "center",
            width: 220,
            options: ["edit", "delete"]
          }
        ],
        data: []
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$root.startTableLoading();
      getRoleList().then(res => {
        this.table.data = res.data.data;
      }).catch(error=>this.$root.endTableLoading());
    },
    addRole() {
      this.$router.push({ name: "roleEdit", params: { page: "create" } });
    },
    onEdit(params) {
      const { id } = params.row;
      this.$router.push({
        name: "roleEdit",
        params: { page: "edit" },
        query: { id }
      });
    },
    onDelete(params) {
      this.$Tip.confirm({
        content: "确定删除此角色吗",
        onOk: () => {
          roleDel({ id: params.row.id }).then(res => {
            if( res != undefined && res.code == 200) this.table.data.splice(params.index, 1);
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
</style>


