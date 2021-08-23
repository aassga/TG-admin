<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="状态">
          <Select v-model="searchKey.status" class="s-86">
            <Option value="all">全部</Option>
            <Option value="yes">启用</Option>
            <Option value="no">停用</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="开始日期">
          <DatePicker type="date" placeholder="开始时间" class="s-120" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker type="date" placeholder="结束时间" class="s-120" v-model="Time[1]"></DatePicker>
        </FormItem> -->
        <FormItem>
          <Checkbox v-model="searchKey.isLike">
            <span class="pl5">模糊</span>
          </Checkbox>
        </FormItem>
        <FormItem>
          <Select v-model="searchKey.checktype" class="s-100">
            <Option value="0">会员账号</Option>
            <Option value="1">上级代理</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input v-model="searchKey.val" placeholder="多个请以,逗号隔开" class="s-140"/>
        </FormItem>
        <FormItem>
          <Poptip
            trigger="hover"
            content="多个请以,逗号隔开,仅支持同类型多个输入"
            placement="bottom-end"
            class="ml14f"
          >
            <Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
          </Poptip>
        </FormItem>
        <FormItem>
          <Button type="primary" class="search" @click="searchSubmit" :loading="$root.searchBtnLoading">查询</Button>
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
        @on-sort-change="sortChange"
        :pageSizeOpts="table.pageSizeOpts"
      ></Tables>
    </div>
    <Modals ref="changeAgency" title="切换上级代理" width="766">
      <div slot="content" class="v2-form-wrapper">
        <Form
          ref="agencyInfo"
          style="width:766px;"
          :model="agencyInfo"
          :rules="agencyInfoRulesValidate"
          :label-width="233"
        >
          <FormItem label="会员账号">
            <Input class="w260x" v-model="agencyInfo.changingAgency" disabled/>
          </FormItem>
          <FormItem label="上级代理" prop="superior">
            <Input class="w260x" v-model="agencyInfo.superior"/>
          </FormItem>
          <FormItem label="代理等级" v-show="searchKey.searchType == 'vip'">
            <!-- <Select clearable v-model="agencyInfo.level" class="w260x">
              <Option
                v-for="(item,index) in agencyLevelList"
                :key="index"
                :value="item.key"
              >{{item.value}}</Option>
            </Select> -->
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
            <Button class="ivu-btn submit bg" @click="save" :loading="$root.editBtnLoading">确认保存</Button>
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
import { sortInteraction } from "@/libs/util";
import { agencyList } from '@/api/agency';
import tableMixins from "@/mixins/table";
import Modals from "@/components/modals";
import ShowMore from "./components/agencyShowMore";
export default {
  name: "agencySearch",
  mixins: [tableMixins],
  components: { Icons, Tables, Modals, ShowMore },
  data() {
    return {
      searchKey: {
        checktype: '0',
        status: 'all',
        val: '',
        isLike: true
      },
      Time: [this.$root.startTime(),this.$root.formatnightTimeS()],
      table: {
        data: [],
        total: 0,
        pageSizeOpts: [20],
        columns: [
          {
            title: "会员账号",
            key: "userName",
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
                    <span style={{ width: "80px" }}>{params.row.userName}</span>
                    <Icons
                      type="huiyuanchaxunzaixian"
                      color={params.row.active === 'yes' ? "#57A3F3" : "#B3B3B3"}
                      size="20"
                    />
                  </div>
                  <div slot="content">
                    {params.row.active === 'yes' ? "在线" : "离线"}
                  </div>
                </Tooltip>
              );
            }
          },
          {
            title: "账号类型",
            key: "agencyType",
            align: "center",
            render: (h,params) => <span>{params.row.agencyType == 'agency' ? `${params.row.levelId}级代理` : '大股东'}</span>
          },
          {
            title: "上级代理",
            key: "superiorUserName",
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
                      this.$router.push({ name: "agencySubordinate" });
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
              return (
                <span
                  style={{ color: params.row.return ? "#515a6e" : "#FF2626" }}
                >
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
                <a>
                  <span
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
                  </span>
                </a>
                <a>
                  <span
                    class="blue-font"
                    onClick={e => {
                      this.agencyInfo.changingAgency = params.row.account;
                      this.$refs.changeAgency.show();
                    }}
                  >
                    切换上级代理
                  </span>
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
  mounted() {
    this.searchKey.siteId = this.$root.nowSite.id
  },
  methods: {
    searchSubmit() {},
    getData(data) {
      this.$root.startTableLoading();
      agencyList(data).then(res => {
         const { total, data } = res.data
         this.table.total = total
         this.table.data = data
      }).catch(error=> this.$root.endTableLoading())
    },
    save() {
      this.$refs.changeAgency.hide();
      this.$Tip.success({
        content: "修改成功",
        onOk: () => {}
      });
    },
    sortChange(obj) {
      sortInteraction(obj);
    }
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

.ivu-form-item {
  &:nth-child(4) {
    margin-right: -5px;
  }
  &:nth-child(7) {
    margin-top: 1px !important;
  }
}
</style>

