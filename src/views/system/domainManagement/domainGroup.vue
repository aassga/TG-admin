<template>
  <div>
    <div class="v2-search">
      <Button type="primary" @click="onEdit('add')">添加域名分组</Button>
    </div>
    <div class="v2-table">
      <Tables
        :loading="$root.tableLoading"
        :value="table.data"
        :columns="table.columns"
        :total="table.total"
        @on-edit="onEdit"
        @on-delete="onDelete"
        :page="false"
      ></Tables>
    </div>
    <Modals ref="domainGroup" width="500" :title="title">
      <div slot="content">
        <Form ref="formKey" :rules="rules" :model="formKey" :label-width="150">
          <FormItem label="域名分组" prop="group_id">
            <Select
              class="w260x"
              v-model="formKey.group_id"
              :disabled="title == '编辑域名分组'"
              clearable
              transfer
            >
              <Option
                :disabled="
                  domainSumList.length > 0 && String(domainSumList).includes(t)
                "
                v-for="(t, i) in domainList"
                :value="t"
                :key="i"
                >{{ t }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="分组别称" prop="group_alias">
            <Input
              class="w260x"
              v-model="formKey.group_alias"
              maxlength="15"
              placeholder="请输入分组别称"
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              class="ivu-btn submit"
              :loading="$root.editBtnLoading"
              @click.prevent="save"
              >确认保存</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Modals from "_c/modals";
import {
  domainGroupList,
  domainGroupDelete,
  domainGroupCreate,
  domainGroupUpdate,
} from "@/api/system";
import Tables from "_c/tables";
export default {
  name: "domainGroup",
  components: {
    Tables,
    Modals,
  },
  data() {
    return {
      domainSumList: [],
      title: "添加域名分组",
      domainList: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
      ],
      formKey: {
        siteId: this.$root.nowSite.id,
        group_alias: "",
        group_id: "",
      },
      searchKey: {
        siteId: this.$root.nowSite.id,
        show_count: "yes",
      },
      rules: {
        group_id: [
          {
            required: true,
            message: "请选择域名分组",
            trigger: "change",
            pattern: /.+/,
          },
        ],
        group_alias: [
          {
            required: true,
            message: "请输入分组别称",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
      },
      table: {
        total: 0,
        data: [],
        loading: true,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "域名分组",
            key: "group_id",
            align: "center",
            minWidth: 65,
          },
          {
            title: "分组别称",
            key: "group_alias",
            align: "center",
            minWidth: 55,
          },
          {
            title: "域名个数",
            key: "domain_count",
            align: "center",
            minWidth: 55,
          },
          {
            title: "创建日期",
            key: "created_at",
            align: "center",
            render: (h, params) => {
              return <span>{this.$root.unixTime(params.row.created_at)}</span>;
            },
          },
          {
            title: "操作",
            align: "center",
            render: (h, params) => (
              <div>
                <a
                  class="ib mr5"
                  onClick={() => {
                    this.onEdit("edit", params);
                  }}
                >
                  编辑
                </a>
                <a
                  class="ib mr5"
                  onClick={() => {
                    this.onDelete(params);
                  }}
                >
                  删除
                </a>
              </div>
            ),
          },
        ],
      },
    };
  },
  mounted() {
    let data = { ...this.searchKey };
    this.getData(data);
  },
  methods: {
    getData(data) {
      this.$root.startTableLoading();
      domainGroupList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.table.data = res.data;
            let arr = [];
            res.data.forEach((t) => {
              arr.push(t.group_id);
            });
            console.log("arr", arr);
            this.domainSumList = arr;
            console.log("domainSumList", this.domainSumList);
            this.$store.commit("successDomainList", arr);
            this.$root.endTableLoading();
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },
    onEdit(type, params) {
      if (type == "add") {
        this.title = "添加域名分组";
        this.$refs.formKey.resetFields();
      } else {
        this.title = "编辑域名分组";
        this.$refs.domainGroup.spinShow();
        const { group_alias, id, group_id } = params.row;
        this.formKey.group_alias = group_alias;
        this.formKey.group_id = group_id;
        this.formKey.id = id;
        this.$refs.domainGroup.spinHide();
      }
      this.$refs.domainGroup.show();
    },
    onDelete(params) {
      const { group_id, id } = params.row;
      this.$Tip.confirm({
        content: `您确定删除等级【${group_id}】吗？`,
        onOk: () => {
          let data = {
            id,
          };
          domainGroupDelete(data, true).then((res) => {
            if (res && res.code == 200) {
              this.table.data.splice(params.index, 1);
              this.$Message.success({ content: "删除成功" });
              this.getData(this.searchKey);
            }
          });
        },
      });
    },
    save() {
      let data = { ...this.formKey };
      this.$root.startEditLoading();
      this.$refs.formKey.validate((valid) => {
        if (valid) {
          if (this.title == "添加域名分组") {
            domainGroupCreate(data, true)
              .then((res) => {
                if (res && res.code == 200) {
                  this.$Message.success({ content: "添加域名分组成功" });
                  this.$refs.domainGroup.hide();
                  this.getData(this.searchKey);
                  this.$refs.formKey.resetFields();
                  this.$root.endEditLoading();
                }
              })
              .catch((error) => {
                this.$root.endEditLoading();
              });
          } else {
            domainGroupUpdate(data, true)
              .then((res) => {
                if (res && res.code == 200) {
                  this.$Message.success({ content: "编辑域名分组成功" });
                  this.$refs.domainGroup.hide();
                  this.getData(this.searchKey);
                  this.$refs.formKey.resetFields();
                  this.$root.endEditLoading();
                }
              })
              .catch((error) => {
                this.$root.endEditLoading();
              });
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
</style>