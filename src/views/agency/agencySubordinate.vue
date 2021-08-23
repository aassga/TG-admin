<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="代理等级">
          <Select v-model="searchKey.agencyLevel" class="s-86" clearable>
            <Option
              v-for="(item,index) in agencyLevelList"
              :key="index"
              :value="item.key"
            >{{item.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态">
          <Select v-model="searchKey.status" class="s-86" clearable>
            <Option value="yes">启用</Option>
            <Option value="no">停用</Option>
          </Select>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker type="date" placeholder="开始时间" class="s-120" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker type="date" placeholder="结束时间" class="s-120" v-model="Time[1]"></DatePicker>
        </FormItem>
        <FormItem label="模糊">
          <Checkbox></Checkbox>
        </FormItem>
        <FormItem>
          <Select v-model="searchKey.searchType" class="s-100" clearable>
            <Option value="vip">会员账号</Option>
            <Option value="agency">上级代理</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input v-model="searchKey.name" placeholder="账号/姓名" class="s-140"/>
        </FormItem>
        <FormItem>
          <Poptip trigger="hover" content="多个请以,逗号隔开,仅支持同类型多个输入" placement="bottom-end">
            <Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
          </Poptip>
        </FormItem>
        <FormItem>
          <Button type="primary" class="search" @click="searchSubmit">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        editable
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      ></Tables>
    </div>
    <Modals ref="changeAgency" title="切换上级代理" width="766">
      <div slot="content" class="v2-form-wrapper">
        <Form
          ref="agencyInfo"
          style="width:766px;"
          :model="agencyInfo"
          :rules="agencyInfoRulesValidate"
          :label-width="253"
        >
          <FormItem label="会员账号">
            <Input class="w260x" v-model="agencyInfo.changingAgency" disabled/>
          </FormItem>
          <FormItem label="上级代理" prop="superior">
            <Input class="w260x" v-model="agencyInfo.superior"/>
          </FormItem>
          <FormItem label="代理等级" v-show="searchKey.searchType == 'vip'">
            <Select clearable v-model="agencyInfo.level" class="w260x">
              <Option
                v-for="(item,index) in agencyLevelList"
                :key="index"
                :value="item.key"
              >{{item.value}}</Option>
            </Select>
          </FormItem>
          <FormItem label="备注信息">
            <Input
              v-model="agencyInfo.remarks"
              type="textarea"
              :rows="6"
              class="w260x"
              placeholder="此栏位仅供管理者记录其他咨询，会员无法检视"
            />
          </FormItem>
          <FormItem>
            <Button class="ivu-btn submit bg" @click="save">提交保存</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import { Tooltip } from "view-design";
import Tables from "@/components/tables";
import Icons from "@/components/icons";
import { agencySearchData } from "@/api/data";
import Modals from "@/components/modals";
import ShowMore from "./components/agencyShowMore";
export default {
  name: "xj",
  components: { Icons, Tables, Modals, ShowMore },
  data() {
    return {
      searchKey: {},
      agencyLevelList: [
        { key: "default", value: "默认等级" },
        { key: "two", value: "等级二" },
        { key: "three", value: "等级三" },
        { key: "four", value: "等级四" },
        { key: "five", value: "等级五" }
      ],
      Time: [],
      table: {
        data: [],
        loading: true,
        total: 100,
        columns: [
          {
            title: "会员账号",
            key: "account",
            align: "center",
            render: (h, params) => {
              return (
                <Tooltip placement="right">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ width: "50px" }}>{params.row.account}</span>
                    <Icons
                      type="huiyuanchaxunzaixian"
                      color={params.row.online ? "#57A3F3" : "#B3B3B3"}
                      size="20"
                    />
                  </div>
                  <div slot="content">
                    {params.row.online ? "在线" : "离线"}
                  </div>
                </Tooltip>
              );
            }
          },
          {
            title: "账号类型",
            key: "type",
            align: "center"
          },
          {
            title: "代理等级",
            key: "level",
            align: "center"
          },
          {
            title: "上级代理",
            key: "superior",
            align: "center"
          },
          {
            title: "下级人数",
            key: "subordinate",
            align: "center",
            render: (h, params) => {
              return (
                <a>
                  <span
                    style="color:#57A3F3FF"
                    class="cs"
                    onClick={() => {
                      // this.$router.push({ name: "agencySearch" });
                    }}
                  >
                    {params.row.subordinate}
                  </span>
                </a>
              );
            }
          },
          {
            title: "有效人数",
            key: "valid",
            align: "center"
          },
          {
            title: "新增人数",
            key: "newAdd",
            align: "center"
          },
          {
            title: "首存人数",
            key: "deposit",
            align: "center"
          },
          {
            title: "团队净盈利",
            key: "profit",
            align: "center"
          },
          {
            title: "团队余额",
            key: "balance",
            align: "center"
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            render: (h, params) => {
              // let color = params.row.return ? "#515a6e" : "#FF2626";
              return (
                <span style={{color:params.row.return ? "#515a6e" : "#FF2626"}}>
                  {params.row.return ? "正常" : "停用"}
                </span>
              );
            }
          },
          {
            title: "操作",
            align: "center",
            width: "150",
            render: (h, params) => (
              <div class="flex-row">
                <a
                  class="blue-font"
                  onClick={e => {
                    let txt = params.row.return
                      ? "您确定停用该会员状态吗?"
                      : "您确定启用该会员状态吗";
                    let txt2 = params.row.return
                      ? "停用状态成功"
                      : "启用状态成功";
                    this.$Tip.confirm({
                      content: txt,
                      onOk: () => {
                        // this.getData();
                        this.$Tip.success({
                          content: txt2,
                          onOk: () => {}
                        });
                      }
                    });
                  }}
                >
                  {params.row.return ? "停用" : "启用"}
                </a>
                <a
                  class="blue-font"
                  onClick={e => {
                    this.agencyInfo.changingAgency = params.row.account;
                    this.$refs.changeAgency.show();
                  }}
                >
                  切换上级代理
                </a>
              </div>
            )
          },
          {
            title: "...",
            type: "expand",
            align: "center",
            width: "50",
            render: (h, params) => {
              let that = this;
              return h(ShowMore, {
                props: {
                  fd_type: that.fd_type,
                  fs_type: that.fs_type,
                  search_type: that.searchKey.searchType
                },
                on: {
                  change_fd_type: type => {
                    that.fd_type = type;
                  },
                  change_fs_type: type => {
                    that.fs_type = type;
                  }
                }
              });
            }
          }
        ]
      },
      agencyInfo: {
        changingAgency: "sadasa"
      },
      agencyInfoRulesValidate: {
        superior: [
          {
            required: true,
            message: "请输入上级代理",
            trigger: "blur"
          }
        ]
      },
      fd_type: "liuhecai",
      fs_type: "zhenrenshixun",
      index: 0
    };
  },
  methods: {
    searchSubmit() {},
    getData(query) {
      agencySearchData().then(res => {
        this.table.loading = true;
        setTimeout(() => {
          this.table.data = res.data;
          this.table.loading = false;
        }, 2000);
      });
    },
    save() {
      this.$refs.changeAgency.hide();
      this.$Tip.success({
        content: "修改成功",
        onOk: () => {
        }
      });
    },
    onPageChange(page) {
      this.getData(page);
    },
    onPageSizeChange() {}
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
@import "../../styles/class.less";
/deep/.expand {
  @h: 40px;
  .section {
    .row > .col {
      height: @h;
      line-height: @h;
    }
  }
  .remarks {
    height: @h;
    line-height: @h;
  }
}

</style>

