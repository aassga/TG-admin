<template>
  <div>
    <div class="v2-search">
      <Button type="primary" @click="onEdit('add')">添加层级</Button>
    </div>
    <div class="v2-table">
      <Tables
        :loading="$root.tableLoading"
        :value="table.data"
        :columns="table.columns"
        :total="table.total"
        @on-edit="onEdit"
        :page="false"
      ></Tables>
    </div>
    <Modals ref="domainLevel" width="500" :title="title">
      <div slot="content">
        <Form ref="formKey" :rules="rules" :model="formKey" :label-width="150">
          <FormItem label="域名层级" prop="level">
            <Select
              class="w260x"
              v-model="formKey.level"
              :disabled="title == '编辑域名层级'"
              clearable
              transfer
            >
              <Option
                v-for="t in domainLevelList"
                :value="t.value"
                :key="t.value"
                :disabled="t.disabled"
                >{{ t.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="最小存款" prop="deposit_amount">
            <Input
              class="w260x"
              v-model="formKey.deposit_amount"
              maxlength="15"
              placeholder="请输入最小存款"
            />
          </FormItem>
          <FormItem label="存款次数" prop="deposit_count">
            <Input
              class="w260x"
              v-model="formKey.deposit_count"
              maxlength="15"
              placeholder="请输入最低存款次数"
            />
          </FormItem>
          <FormItem label="APP域名" prop="app_domains">
              <Input
                type="textarea"
                :rows="4"
                class="w260x"
                v-model="formKey.app_domains"
                placeholder="可批量添加,一行一个,如xxx.comyyy.com"
                style="resize: none;"
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
  domainLevelList,
  domainLevelCreate,
  domainLevelUpdate,
} from "@/api/system";
import Tables from "_c/tables";
export default {
  name: "domainLevelList",
  components: {
    Tables,
    Modals,
  },
  data() {
    return {
      title: "添加域名分组",
      type: '',
      domainLevelList: [
        {
            value: '1',
            label: '第一层',
            disabled: false,
        },
        {
            value: '2',
            label: '第二层',
            disabled: false,
        },
        {
            value: '3',
            label: '第三层',
            disabled: false,
        },
        {
            value: '4',
            label: '第四层',
            disabled: false,
        },
        {
            value: '5',
            label: '第五层',
            disabled: false,
        },
        {
            value: '6',
            label: '第六层',
            disabled: false,
        },
        {
            value: '7',
            label: '第七层',
            disabled: false,
        },
        {
            value: '8',
            label: '第八层',
            disabled: false,
        },
        {
            value: '9',
            label: '第九层',
            disabled: false,
        },
        {
            value: '10',
            label: '第十层',
            disabled: false,
        },
        {
            value: '11',
            label: '第十一层',
            disabled: false,
        },
        {
            value: '12',
            label: '第十二层',
            disabled: false,
        },
        {
            value: '13',
            label: '第十三层',
            disabled: false,
        },
        {
            value: '14',
            label: '第十四层',
            disabled: false,
        },
        {
            value: '15',
            label: '第十五层',
            disabled: false,
        },
        {
            value: '16',
            label: '第十六层',
            disabled: false,
        },
        {
            value: '17',
            label: '第十七层',
            disabled: false,
        },
        {
            value: '18',
            label: '第十八层',
            disabled: false,
        },
        {
            value: '19',
            label: '第十九层',
            disabled: false,
        },
        {
            value: '20',
            label: '第二十层',
            disabled: false,
        }
      ],
      formKey: {
        siteId: this.$root.nowSite.id,
        level: '',
        deposit_amount: '',
        deposit_count: '',
        app_domains: '',
      },
      rules: {
        level: [
          {
            required: true,
            message: "请选择游戏类型",
            trigger: "change",
          },
        ],
        deposit_amount: [
          {
            required: true,
            message: "请输入最小存款",
            trigger: "blur",
          },
        ],
        deposit_count: [
          {
            required: true,
            message: "请输入最低存款次数",
            trigger: "blur",
          },
        ],
        app_domains: [
          {
            required: true,
            message: "请输入APP域名",
            trigger: "blur",
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
            title: "域名层级",
            key: "level",
            align: "center",
            render: (h, params) => {
                return <span>{ this.domainLevelList[params.row.level - 1].label }</span>;
            }
          },
          {
            title: "会员人数",
            key: "member_count",
            align: "center",
          },
          {
            title: "最小存款",
            key: "deposit_amount",
            align: "center",
          },
          {
            title: "存款次数",
            key: "deposit_count",
            align: "center",
          },
          {
            title: "APP域名",
            key: "app_domains",
            align: "center",
            minWidth: 75,
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
              </div>
            ),
          },
        ],
      },
    };
  },
  mounted() {
    let data = { ...this.formKey };
    this.getData(data);
  },
  methods: {
    filterDomainList() {
        const level = this.table.data.length;
        for (let i = 0; i < level; i++) {
            this.domainLevelList[i].disabled = true;
        }
    },
    getData(data) {
      this.$root.startTableLoading();
      domainLevelList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.table.data = res.data;
            this.$root.endTableLoading();
          }
          this.filterDomainList();
        })
        .catch((error) => this.$root.endTableLoading());
    },
    onEdit(type, params) {
      if (type == "add") {
        this.$refs.formKey.resetFields();
        this.$set(this.rules['deposit_count'][0], 'message', '请输入最低存款次数');
        this.title = "添加域名层级";
        this.type = 'add';
      } else {
        this.$refs.formKey.resetFields();
        this.$set(this.rules['deposit_count'][0], 'message', '请输入打码倍数');
        this.title = "编辑域名层级";
        this.type = 'edit';
        this.$refs.domainLevel.spinShow();
        const { id, level, deposit_amount, deposit_count, app_domains } = params.row;
        this.formKey.level = String(level);
        this.formKey.deposit_amount = deposit_amount;
        this.formKey.deposit_count = String(deposit_count);
        this.formKey.app_domains = app_domains;
        this.formKey.id = id;
        this.$refs.domainLevel.spinHide();
      }
      this.$refs.domainLevel.show();
    },
    save() {
      let data = { ...this.formKey };
      this.$root.startEditLoading();
      this.$refs.formKey.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
          domainLevelCreate(data, true)
            .then((res) => {
              if (res && res.code == 200) {
                this.$Message.success({ content: "添加域名层级成功" });
                this.$refs.domainLevel.hide();
                this.getData(this.formKey);
                this.$refs.formKey.resetFields();
                this.$root.endEditLoading();
              }
            })
            .catch((error) => {
              this.$root.endEditLoading();
            });
          } else {
          domainLevelUpdate(data, true)
              .then((res) => {
              if (res && res.code == 200) {
                  this.$Message.success({ content: "编辑域名层级成功" });
                  this.$refs.domainLevel.hide();
                  this.getData(this.formKey);
                  this.$root.endEditLoading();
              }
              })
              .catch((error) => {
              this.$root.endEditLoading();
              });
          }
        } else {
          this.$root.endEditLoading();
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
</style>