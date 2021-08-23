<template>
  <div>
    <div class="mt10 mb20">
      <Button @click="addRule" class="w130x oldColor">新增权限</Button>
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
    <Modals ref="menuModal" :title="menuModalTitle==='create'?'添加权限':'编辑权限'" :width="760">
      <div slot="content" class="v2-form-wrapper modal-overflow">
        <Form
          ref="menuForm"
          :model="menuForm"
          :rules="menuRule"
          :label-width="260"
          style="width:700px;"
        >
          <FormItem label="父类" prop="parent_id">
            <Cascader
              class="w260x"
              :data="menuSelect.data"
              v-model="menuSelect.value"
              :render-format="labels => labels[labels.length -1]"
              @on-change="onParentChange"
              change-on-select
            ></Cascader>
          </FormItem>
          <FormItem label="名称" prop="name">
            <Input v-model="menuForm.name" placeholder="请输入权限名称" class="w260x"/>
          </FormItem>
          <FormItem label="URI路径" prop="permission_id">
            <AutoComplete
              :clearable="false"
              :disabled="!menuForm.parent_id"
              v-model="uriComplete.value"
              @on-select="autoSelect"
              @on-search="autoSearch"
              placeholder="以'api'开头,最小长度为3字符"
              class="w260x"
            >
              <div class="center" v-if="uriComplete.tip===1">搜索中...</div>
              <div class="center" v-else-if="uriComplete.tip===2">至少输入api三个字符</div>
              <div class="center" v-else-if="uriComplete.tip===3">搜索完成</div>
              <div class="center" v-else-if="uriComplete.tip===4">该权限不存在，请重新搜索</div>
              <div v-else class="center">请输入您要查询的内容</div>
              <Option
                v-for="(item,key,index) in uriComplete.data"
                :label="item"
                :value="item"
                :key="index"
              ></Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="类型" prop="type">
            <Select v-model="menuForm.type" class="w260x">
              <Option value="nav">导航</Option>
              <Option value="menu">子菜单</Option>
              <Option value="link">链接</Option>
              <Option value="button">按钮</Option>
            </Select>
          </FormItem>
          <FormItem label="状态">
            <Select v-model="menuForm.status" class="w260x">
              <Option value="open">开启</Option>
              <Option value="close">关闭</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button
              class="submit"
              type="primary"
              @click.prevent="submit"
              :loading="$root.editBtnLoading"
            >{{menuModalTitle==='create'?'确认添加':'确认修改'}}</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import Modals from "@/components/modals";
import Expand from "./components/menu-expand";
import {
  getPermissionList,
  addMenu,
  searchUri,
  updateMenu
} from "@/api/system";
import mixins from "./mixins";
export default {
  mixins: [mixins],
  components: { Modals },
  watch:{
    'table.data':{

    }
  },
  data() {
    return {
      uriComplete: {
        value: "",
        data: [],
        tip: ""
      },
      menuModalTitle: "",
      menuForm: {
        id: "",
        parent_id: "",
        name: "",
        permission_id: "",
        type: "",
        status: ""
      },
      menuSelect: {
        data: [],
        value: []
      },
      menuRule: {
        parent_id: [
          {
            required: true,
            message: '请选择父类',
            trigger: 'change',
            pattern: /.+/
          }
        ],
        name: [
          {
            required: true,
            pattern: /^.*$/,
            message: "权限名称不能为空",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            pattern: /^.*$/,
            message: "请选择权限类型！",
            trigger: "change"
          }
        ]
      },
      table: {
        page: false,
        loading: true,
        columns: [
          {
            title: "排序",
            key: "drag",
            align: "center",
            width: 80,
            render: (h, params) => {
              return <Icons type="paixukongjian" color="#dadada" size="20" />;
            }
          },
          {
            title: "权限名称",
            key: "name",
            align: "center",
            minWidth: 400
          },
          {
            title: "操作",
            key: "handle",
            align: "center",
            width: 220,
            options: ["edit", "delete"]
          },
          {
            type: "expand",
            title: "...",
            align: "center",
            width: 60,
            render: (h, params) => {
              if (!params.row.children.length) {
                return <span>暂无信息！</span>;
              }
              return (
                <Expand
                  data={params.row.children}
                  showEditModal={this.showEditModal}
                  getData={this.getData}
                />
              );
            }
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
    onParentChange(values, selectedData) {
      this.menuForm.parent_id = values[values.length - 1];
    },
    showEditModal(params) {
      const menuType = {
        "导航": "nav",
        "菜单": "menu",
        "链接": "link",
        "按钮": "button"
      };
      const { parent_id } = params.row;
      const { permission } = params.row;
      const { name } = !!permission && permission;
      this.menuModalTitle = "edit";
      this.$refs.menuModal.show();
      this.resetForm();
      for (let key in this.menuForm) {
        this.menuForm[key] = params.row[key];
        if(key === "type") this.menuForm[key] = menuType[params.row[key]]
      }
      if (name) this.uriComplete.value = name;
      if (!parent_id) {
        this.menuSelect.value = [0];
      } else {
        const { data } = this.table;
        for (let i = 0; i <= data.length; i++) {
          if (parent_id == data[i].id) {
            this.menuSelect.value = [data[i].id];
            break;
          }
        }
      }
    },
    getData() {
      this.$root.startTableLoading();
      getPermissionList().then(res => {
        this.table.data = res.data;
        this.menuSelect.data = [];
        res.data.forEach(menu => {
          menu.label = menu.name;
          menu.value = menu.id;
          menu.children.forEach(sub => {
            sub.label = sub.name;
            sub.value = sub.id;
          });
        });
        this.menuSelect.data = [...res.data];
        this.menuSelect.data.unshift({
          label: "顶级菜单",
          value: 0
        });
      }).catch(error=>this.$root.endTableLoading());
    },
    addRule() {
      this.$refs.menuModal.show();
      this.menuModalTitle = "create";
      this.resetForm();
    },
    resetForm() {
      for (let key in this.menuForm) {
        this.menuForm[key] = "";
      }
      this.uriComplete.value = "";
      this.menuSelect.value = [];
    },
    submit() {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          let params = { ...this.menuForm };
          if (!this.menuSelect.value) {
            this.$Message.error("父级不能为空!");
            return false;
          }
          for (let key in params) {
            if (!params[key]) delete params[key];
          }
          this.$root.startEditLoading();
          if (this.menuModalTitle === "create") {
            delete params.id;
            addMenu(params).then(res => {
              this.$refs.msidemenuModal.hide();
              this.getData();
              this.resetForm();
              this.getMenu();
            });
          }
          if (this.menuModalTitle === "edit") {
            updateMenu(params).then(res => {
              this.$refs.menuModal.hide();
              this.getData();
              this.resetForm();
              this.getMenu();
            });
          }
        }
      });
    },
    autoSearch(query) {
      // 顶级菜单不需要填写URI路径！
      this.uriComplete.tip = 1;
      let params = { ...this.uriComplete };
      if (!params.value) {
        this.uriComplete.tip = 0;
        return false;
      }
      if (params.value.length <= 2) {
        this.uriComplete.tip = 2;
        return false;
      }
      searchUri({ uri: params.value }).then(res => {
        if (Object.keys(res.data).length) {
          this.uriComplete.tip = 3;
          if (Object.keys(res.data).length === 1) {
            // 解决当粘贴整条url,选中不传递权限id的bug
            this.menuForm.permission_id = Object.keys(res.data)[0];
          }
        } else {
          this.uriComplete.tip = 4;
          this.$Message.error("该权限不存在，请重新搜索！");
        }
        this.uriComplete.data = res.data;
      });
    },
    autoSelect(url) {
      for (const key in this.data) {
        if (this.data[key] === url) {
          this.menuForm.permission_id = key;
          break;
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
</style>


