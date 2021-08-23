<template>
  <Tables
    ref="dragable"
    :columns="table.columns"
    :page="table.page"
    :value="table.data"
    @on-edit="onEdit"
    @on-delete="onDelete"
  ></Tables>
</template>
<script>
import Icons from "@/components/icons";
import mixins from "../mixins";
export default {
  mixins: [mixins],
  props: {
    data: {
      type: Array,
      required: true
    },
    showEditModal: {
      type: Function,
      required: true
    },
    getData: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      table: {
        page: false,
        columns: [
          {
            title: "排序",
            align: "center",
            className: "hidden",
            width: 80,
            render: (h, params) => {
              return <Icons type="paixukongjian" color="#dadada" size="20" />;
            }
          },
          {
            title: "权限名称",
            key: "name",
            className: "hidden text-indent-20",
            minWidth: 400,
            render: (h, params) => {
              return (
                <div>
                  <span>{params.row.name}</span>
                  <span>
                    [{params.row.permission ? params.row.permission.name : "#"}]
                  </span>
                  <span>[{params.row.type || "#"}]</span>
                </div>
              );
            }
          },
          {
            title: "操作",
            key: "handle",
            className: "hidden",
            align: "center",
            width: 220,
            options: ["edit", "delete"]
          },
          {
            type: "expand",
            title: "...",
            align: "center",
            className: "hidden",
            width: 60,
            render: (h, params) => {
              if (!params.row.children.length) {
                return <span style="text-indent:30px">暂无信息！</span>;
              }
              return params.row.children.map(item => {
                return (
                  <div class="fl mb8 pl30 pr30">
                    <span>{item.name}</span>
                    <span>
                      [{item.permission ? item.permission.name : "#"}]
                    </span>
                    <span>[{item.type || "#"}]</span>
                    <span
                      class="blue-font ml10"
                      onClick={() => this.onEdit(params)}
                    >
                      编辑
                    </span>
                    <span
                      class="blue-font ml10"
                      onClick={() => this.onDelete(params)}
                    >
                      删除
                    </span>
                  </div>
                );
              });
            }
          }
        ],
        data: []
      }
    };
  },
  created() {
    this.table.data = this.data;
  }
};
</script>
<style lang="less" scoped>
/deep/.text-indent-20 {
  text-indent: 20px;
}
/deep/th.hidden {
  display: none;
}
</style>


