<template>
  <div class="v2-edit">
    <div class="section">
      <Form inline :label-width="100" ref="Form" :model="formKey" :rules="rules">
        <FormItem label="角色标志" prop="name">
          <Input class="s-150" placeholder="请输入角色标志" v-model="formKey.name"/>
        </FormItem>
        <FormItem label="角色名称" prop="title">
          <Input class="s-160" placeholder="请输入角色名称" v-model="formKey.title"/>
        </FormItem>
        <FormItem label="角色描述" prop="description">
          <Input class="s-450" v-model="formKey.description"/>
        </FormItem>
      </Form>
    </div>
    <div>
      <div class="pb10 pl30">角色赋权</div>
      <Tabs type="card" :animated="false" value="会员管理">
        <TabPane
          v-for="grand in permissionsList"
          :key="grand.id"
          :label="grand.name"
          :name="grand.name"
        >
          <table
            cellspacing="0"
            cellpadding="0"
            border="0"
            class="ivu-table ivu-table-border bl bt"
          >
            <tr>
              <th class="ivu-table-column-center w60x no-bb">
                <Checkbox
                  v-model="grand.checked"
                  :indeterminate="grand.indeterminate"
                  @on-change="(bool)=>checkGrandPaFun(grand,bool)"
                ></Checkbox>
              </th>
              <th class="ivu-table-column-center no-bb">权限名称</th>
              <th class="ivu-table-column-center w60x no-bb">...</th>
            </tr>
          </table>
          <table
            cellspacing="0"
            cellpadding="0"
            border="0"
            class="ivu-table ivu-table-border bl"
            v-for="parent in grand.children"
            :key="parent.id"
            :class="{'bb':parent.expand}"
          >
            <tr>
              <td class="ivu-table-column-center w60x">
                <Checkbox
                  v-model="parent.checked"
                  :indeterminate="parent.indeterminate"
                  @on-change="(bool)=>checkParentFun(grand,parent,bool)"
                ></Checkbox>
              </td>
              <td class="ivu-table-column-center">{{parent.name}}</td>
              <td class="ivu-table-column-center w60x" @click="onExpand(parent)">
                <Icon v-show="!parent.expand" type="ios-arrow-forward" size="14" color="#666666"/>
                <Icon v-show="parent.expand" type="ios-arrow-down" size="14" color="#666666"/>
              </td>
            </tr>
            <tr class="bb" v-show="parent.expand">
              <td class="hidden"></td>
              <td class="no-br no-bb pb10">
                <Checkbox
                  v-for="child in parent.children"
                  :key="child.id"
                  class="w18 mt10"
                  v-model="child.checked"
                  :indeterminate="child.indeterminate"
                  @on-change="(bool)=>checkChildFun(grand,parent,child,bool)"
                >{{child.name}}</Checkbox>
              </td>
              <td class="hidden"></td>
            </tr>
          </table>
        </TabPane>
      </Tabs>
      <div class="center mt20">
        <Button
          type="primary"
          :loading="$root.editBtnLoading"
          class="more-btn ml40 ivu-btn export-ok"
          style="width:140px;"
          @click.prevent="submit"
        >确认保存</Button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  roleUpdate,
  roleAdd,
  getPermissionList,
  roleDetail
} from "@/api/system";
import Icons from "@/components/icons";

export default {
  components: { Icons },
  data() {
    return {
      permissionsList: [],
      formKey: {
        id: "",
        name: "",
        title: "",
        description: "",
        permissionId: []
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入角色标志",
            trigger: "blur"
          }
        ],
        title: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "请输入角色描述",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getRuleList().then(res => {
      if (this.$route.params.page === "edit") {
        const { id } = this.$route.query;
        this.renderEdit(id);
      }
    });
  },
  methods: {
    renderEdit(id) {
      roleDetail({ id }).then(res => {
        const { permissions } = res.data;
        for (let key in this.formKey) {
          this.formKey[key] = res.data[key];
        }
        this.formKey.permissionId = permissions;
        this.permissionsList.forEach(grand => {
          let p_count = 0;
          grand.children.forEach(parent => {
            let c_count = 0;
            permissions.forEach(permission => {
              if (parent.permission_id == permission.id) {
                p_count++;
                this.$set(parent, "checked", true);
              }
              parent.children &&
                parent.children.forEach(child => {
                  if (child.permission_id == permission.id) {
                    // p_count++;
                    c_count++;
                    this.$set(child, "checked", true);
                  }
                });
            });
            if (parent.children.length) {
              if (c_count > 0) {
                if (c_count === parent.children.length) {
                  this.$set(parent, "checked", true);
                  this.$set(parent, "indeterminate", false);
                } else {
                  this.$set(parent, "checked", false);
                  this.$set(parent, "indeterminate", true);
                }
              } else {
                this.$set(parent, "checked", false);
                this.$set(parent, "indeterminate", false);
              }
            }
          });
          if (p_count > 0) {
            if (p_count === grand.children.length) {
              this.$set(grand, "checked", true);
              this.$set(grand, "indeterminate", false);
            } else {
              this.$set(grand, "checked", false);
              this.$set(grand, "indeterminate", true);
            }
          } else {
            this.$set(grand, "checked", false);
            this.$set(grand, "indeterminate", false);
          }
        });
      });
    },
    onExpand(parent) {
      this.$set(parent, "expand", !parent.expand);
    },
    submit() {
      let params = { ...this.formKey };
      this.$root.startEditLoading();
      this.$refs.Form.validate(valid => {
        if (valid) {
          if (this.$route.params.page === "create") {
            roleAdd(params).then(res => {
              this.$Tip.success({ content: "角色添加成功！" });
            });
            this.$router.push({ name: "role" });
          }
          if (this.$route.params.page === "edit") {
            roleUpdate(params).then(res => {
              if (res.code == 200) {
                this.$Tip.success({ content: "角色编辑成功！" });
                this.$router.push({ name: "role" });
              }
            });
          }
        } else {
          this.$root.endEditLoading();
        }
      });
    },
    async getRuleList(isVerify) {
      await getPermissionList().then(res => {
        this.permissionsList = res.data;
      });
    },
    watchChildChangeFun(grand) {
      // 封装监听三级变化影响一级的的函数
      let count = 0;
      grand.children.forEach(parent => {
        if (parent.checked) count++;
      });
      if (count > 0) {
        if (count === grand.children.length) {
          this.$set(grand, "checked", true);
          this.$set(grand, "indeterminate", false);
        } else {
          this.$set(grand, "checked", false);
          this.$set(grand, "indeterminate", true);
        }
      } else {
        this.$set(grand, "checked", false);
        this.$set(grand, "indeterminate", false);
      }
    },
    checkChildFun(grand, parent, child, bool) {
      let count = 0;
      this.$set(grand, "indeterminate", false);
      this.$set(child, "checked", bool);
      parent.children.forEach(child => {
        if (child.checked) count++;
      });
      if (count > 0) {
        if (count === parent.children.length) {
          this.$set(parent, "checked", true);
          this.$set(parent, "indeterminate", false);
        } else {
          this.$set(parent, "checked", false);
          this.$set(parent, "indeterminate", true);
        }
      } else {
        this.$set(parent, "checked", false);
        this.$set(parent, "indeterminate", false);
      }
      this.watchChildChangeFun(grand);
      this.createPermissionId();
    },
    checkParentFun(grand, parent, bool) {
      this.$set(grand, "indeterminate", bool);
      this.$set(parent, "checked", bool);
      this.$set(parent, "indeterminate", false);
      parent.children.forEach(child => {
        this.$set(child, "checked", bool);
      });
      this.watchChildChangeFun(grand);
      this.createPermissionId();
    },
    checkGrandPaFun(grand, bool) {
      this.$set(grand, "checked", bool);
      this.$set(grand, "indeterminate", false);
      grand.children.forEach(parent => {
        this.$set(parent, "indeterminate", false);
        this.$set(parent, "checked", bool);
        parent.children &&
          parent.children.forEach(child => {
            this.$set(child, "checked", bool);
          });
      });
      this.createPermissionId();
    },
    createPermissionId() {
      let ids = [];
      this.permissionsList.forEach(grand => {
        grand.children.forEach(parent => {
          if (parent.checked) {
            ids.push(parent.permission_id);
          }
          parent.children &&
            parent.children.forEach(child => {
              if (child.checked) {
                ids.push(parent.permission_id);
                ids.push(child.permission_id);
              }
            });
        });
      });
      // 去重
      let _ids = [];
      ids.forEach(id => {
        if (!_ids.includes(id)) {
          _ids.push(id);
        }
      });
      this.formKey.permissionId = _ids;
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/tabs.less";
@import "../../../styles/button.less";
/deep/.ivu-tabs-bar {
  border-bottom: none;
}
/deep/.ivu-tabs-tab {
  border-bottom: 1px solid #dcdcdc !important;
}
.no-br {
  border-right: none;
}
.no-bb {
  border-bottom: none;
}
.no-bt {
  border-top: none;
}
.hidden {
  visibility: hidden;
}
</style>
