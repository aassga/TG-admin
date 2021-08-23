<template>
  <div>
    <Tables
      ref="table"
      :value="table.data"
      :columns="table.columns"
      :page="false"
      :loading="$root.tableLoading"
    >
    </Tables>
    <!-- TODO 設定獲獎名單 -->
    <Modals
      ref="sitePresetModal"
      :title="(sitePresetModalTitle = '编辑获奖名单')"
      :width="750"
    >
      <div slot="content" class="modal-overflow v2-form-wrapper pt10">
        <Form
          ref="periodNewForm"
          :model="presetForm"
          :rules="presetRule"
          :label-width="250"
          style="width: 700px"
        >
          <FormItem label="比赛期数" prop="stage"
            ><span style="position: relative; top: 1px"
              >第 {{ presetForm.stage }} 期</span
            ></FormItem
          >
          <FormItem label="会员账号" prop="userName">
            <Input
              v-model="presetForm.userName"
              placeholder="请输入1~20个字的活动标题"
              class="w340x"
              :maxlength="20"
              disabled
            />
          </FormItem>
          <FormItem label="赛间打码" prop="bet_amount">
            <Input
              v-model="presetForm.bet_amount"
              placeholder="请输入累积有效打码"
              class="w340x"
            />
          </FormItem>
          <FormItem>
            <Button
              class="submit h50"
              type="primary"
              :loading="$root.editBtnLoading"
              @click.prevent="submit"
              >确认保存</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>
    <!-- TODO 設定獲獎名單 -->
  </div>
</template>

<script>
import Tables from "_c/tables";

import Modals from "@/components/modals";
import {
  getZhengbasaiPrearrangedList,
  zhengbasaiDelPrearranged,
  zhengbasaiEditPrearranged,
} from "@/api/activity";
export default {
  props: ["data", "index", "isEdit", "activeType"],
  components: {
    Tables,
    Modals,
  },
  data() {
    return {
      presetKey: {
        siteId: 1, // TODO siteId: this.$root.nowSite.id,
        // status: "all",
        // page: 1,
        // start_time: this.$root.yesterdayStartTime(),
        // end_time: this.$root.yesterdayEndTime(),
      },
      table: {
        data: [],
        columns: [
          {
            title: "期数",
            key: "stage",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let stage = params.row.stage;
              return <span>第 {stage} 期</span>;
            },
          },
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let userName = params.row.userName;
              let startUserName = userName.slice(0, 3);
              let endUserName = userName.slice(-4);
              return (
                <span>
                  {startUserName}****{endUserName}
                </span>
              );
            },
          },
          {
            title: "赛间打码",
            key: "bet_amount",
            align: "center",
            minWidth: 160,
          },
          {
            title: "排名",
            key: "rank",
            align: "center",
            minWidth: 100,
          },
          {
            title: "奖金金额",
            key: "reward_amount",
            align: "center",
            minWidth: 100,
          },
          {
            title: "比赛日期",
            key: "race_date",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let raceDatege = params.row.race_date;
              return (
                <span>
                  {raceDatege == 0
                    ? null
                    : this.$root.formatTime(raceDatege * 1000)}
                </span>
              );
            },
          },
          {
            title: "名单状态",
            key: "status",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let status = params.row.status === "no" ? "未公开" : "已公开";
              let color = params.row.status === "no" ? "#FF2626" : "#666666";
              return <span style={{ color }}>{status}</span>;
            },
          },
          {
            title: "操作",
            align: "center",
            minWidth: 90,
            render: (h, params) => {
              return (
                <div>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.status !== "open" ||
                        params.row.status == "off"
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      this.openEditPreset(params);
                    }}
                  >
                    編輯
                  </span>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.status !== "open" ||
                        params.row.status == "off"
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      this.delPresetConfig(params);
                    }}
                  >
                    刪除
                  </span>
                </div>
              );
            },
          },
        ],
      },
      presetForm: {
        id:"",
        stage: "",
        userName: "",
        bet_amount: "",
      },
      presetRule: {
        stage: [],
        userName: [],
        bet_amount: [
          {
            required: true,
            message: "请输入赛间打码",
            trigger: "blur",
            pattern: /^[0-9]\d*$/,
          },
        ],
      },
      obj: {},
      level_id: 0,
      active_type: "zhengbasai",
      sitePresetModalTitle: "",
    };
  },
  watch: {
    data: {
      deep: true,
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.data = newVal;
          if (this.data.length && this.data[this.index].active_type) {
            let { active_type } = { ...this.data[this.index] };
            this.active_Type = active_type;
            this.params = {
              siteId: this.$root.nowSite.id,
              active_type: active_type,
              level_id: 0,
            };
            // this.getList(this.params);
          } else {
            this.table.data = [];
          }
        });
      },
    },
    isEdit: {
      deep: true,
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.isEdit = newVal;
        });
      },
    },
  },
  mounted() {
    this.getPresetList(this.presetKey);
  },
  methods: {
    getPresetList() {
      let params = {
        siteId: 1, // TODO this.$root.nowSite.id
        // status:
        //   this.recordForm.status === undefined ? "all" : this.recordForm.status,
      };
      this.$root.startTableLoading();
      getZhengbasaiPrearrangedList(params)
        .then((res) => {
          if (res && res.code === 200) {
            const { data, total } = res.data;
            this.table.data = data;
            this.table.total = total;
            this.sendMsg();
          }
          this.$root.endTableLoading();
        })
        .catch((error) => {
          this.$root.endTableLoading();
        });
    },
    openEditPreset(params) {
      this.$refs.sitePresetModal.show();
      this.presetForm.id = params.row.id;
      this.presetForm.stage = params.row.stage;
      let startUserName = params.row.userName.slice(0, 3);
      let endUserName = params.row.userName.slice(-4);
      this.presetForm.userName = startUserName + "****" + endUserName;
      this.presetForm.bet_amount = parseInt(params.row.bet_amount);
    },

    //刪除配置
    delPresetConfig(params) {
      let text =
        params.row === "yes"
          ? ""
          : "您确定删除【第" + `${params.row.stage}` + "期】吗？";
      let msg = params.row === "yes" ? "" : "刪除成功";
      const data = {
        siteId: "1", // TODO this.$root.nowSite.id
        id: params.row.id,
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          // 不是代理升降级都可以调接口
          zhengbasaiDelPrearranged(data, true).then((res) => {
            if (res != undefined && res.code == 200 && res.data.code != 400) {
              this.$Message.config({ top: 150, duration: 1 });
              this.$Message.success({ content: msg });
              this.getPresetList(); //reload api
            } else if (
              res != undefined &&
              res.code == 200 &&
              res.data.code == 400
            ) {
              this.tip = res.data.message;
              this.$refs.autoSearch.removeDefault();
              this.$refs.removeMembers.show();
            }
          });
        },
      });
    },
    resetPresetForm() {
      for (let res in this.presetForm) {
        this.presetForm[res] = "";
      }
    },
    submit() {
      let data = {
        siteId: 1, // TODO this.$root.nowSite.id
        id: this.presetForm.id,
        bet_amount: this.presetForm.bet_amount,
      };
      this.$root.startTableLoading();
      zhengbasaiEditPrearranged(data).then((res) => {
        if (res != undefined && res.code == 200) {
          this.$Message.success("修改成功");
          this.resetPresetForm();
          this.$refs.sitePresetModal.hide();
          this.getPresetList();
          this.$root.endTableLoading();
        } else {
          this.$refs.sitePresetModal.hide();
        }
      });
    },
    // sendMsg() {
    //   this.$emit("sendMsg", this.table.data);
    // },
  },
};
</script>

<style lang="less" scoped>
@import "../../../../styles/button.less";
.footer {
  border: 1px solid #dcdcdc;
  border-top: 0;
  line-height: 48px;
}
</style>