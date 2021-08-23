<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem>
          <Button
            type="primary"
            v-if="checkedArr.length > 0"
            :style="checkedArr.length > 0 ? 'margin-right:20px' : ''"
            @click="selectDel"
            >删除选中</Button
          >
          <Button type="primary" @click="addBlank">添加黑名单</Button>
        </FormItem>
        <FormItem label="代理账号">
          <Input placeholder="请输入代理账号" v-model="searchKey.username" />
        </FormItem>
        <FormItem label="广告名称">
          <Input placeholder="请输入广告名称" v-model="searchKey.domain" />
        </FormItem>
        <FormItem>
          <Button
            class="search"
            @click="searchSubmit"
            :loading="$root.tableLoading"
            type="primary"
            >查询</Button
          >
        </FormItem>
      </Form>
    </div>
    <Tables
      editable
      :columns="table.columns"
      :loading="$root.tableLoading"
      :value="table.data"
      :total="table.total"
      @on-page-change="onPageChange"
      @on-page-size-change="onPageSizeChange"
      @on-selection-change="onSelectionChange"
    ></Tables>
    <Modals title="添加黑名单" ref="blankModal" width="600">
      <div slot="content">
        <Form
          ref="formKey"
          :model="formKey"
          :rules="rules"
          :label-width="180"
          style="position: relative"
        >
          <FormItem label="代理账号">
            <span class="red-font ib" style="position: absolute; left: -78px"
              >*</span
            >
            <AutoSearch
              v-if="type == 'add'"
              class="auto-serch"
              ref="autoSearh"
              :width="260"
              :siteId="$root.nowSite.id"
              @sendSuperior="getUserName"
              :placeholder="'关键字查询'"
            ></AutoSearch>
            <Input
              class="w260x"
              v-if="type == 'edit'"
              disabled
              v-model="formKey.username"
              placeholder="关键字查询"
            />
          </FormItem>
          <FormItem label="广告名称" prop="main_domain">
            <Input
              v-model="formKey.main_domain"
              type="textarea"
              class="w260x"
              :autosize="{ minRows: 2, maxRows: 6 }"
              placeholder="可批量添加，一行一个，如xxx.comyyy.com"
            />
          </FormItem>
          <FormItem label="描述">
            <Input
              type="textarea"
              v-model="formKey.remark"
              maxlength="20"
              class="w260x"
              :autosize="{ minRows: 2, maxRows: 6 }"
              placeholder="请输入不超过20字描述"
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="saveSubmit"
              class="ivu-btn submit w260x ft14"
              :loading="$root.editBtnLoading"
              >确认添加</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>
    <Modals
      title="温馨提示"
      ref="blackTipSub"
      width="600"
      :mask-closable="false"
    >
      <div slot="content" style="text-align: center">
        <div class="content w400x ib txt-a">
          <p class="ft16 mb10 txt-l">
            <Icon type="ios-alert" size="30" color="#2d8cf0" />
            以下有<span class="red-font">{{ existsDomainCount }}个</span
            >广告正在进行中，不可添加为黑名单
          </p>
          <Input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            :placeholder="existsDomainList"
            class="w400x"
            readonly
          />
          <Button
            class="btn mt30 ft20 mb20"
            type="primary"
            @click.prevent="onConfirmSub"
            >确认</Button
          >
        </div>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import Modals from "@/components/modals";
import AutoSearch from "_c/auto-search";
import Icons from "@/components/icons";
import {
  adBlacklistList,
  adBlacklistDelete,
  adBlacklistCreate,
  adBlacklistEdit,
} from "@/api/report";
export default {
  components: {
    Tables,
    Modals,
    AutoSearch,
    Icons,
  },
  data() {
    return {
      type: "add",
      existsDomainCount: "",
      existsDomainList: "",
      pageSize: "20",
      page: 1,
      checkedArr: [],
      rules: {
        main_domain: [
          {
            required: true,
            message: "请输入主域名",
            trigger: "blur",
          },
        ],
      },
      formKey: {
        siteId: this.$root.nowSite.id,
        main_domain: "",
        remark: "",
      },
      searchKey: {
        siteId: this.$root.nowSite.id,
      },
      table: {
        total: 0,
        title: "代理域名",
        data: [],
        columns: [
          {
            type: "selection",
            width: screen.width > 1600 ? 60 : "",
            minWidth: screen.width < 1600 ? 35 : "",
            align: "center",
          },
          {
            title: "广告名称",
            key: "main_domain",
            align: "center",
            minWidth: 60,
            render: (h, params) => {
              const { sub_domain, main_domain } = params.row;
              let c = Array(main_domain).concat(sub_domain);
              if (main_domain == "-") {
                return <span>-</span>;
              } else
                return (
                  <div style=" display: flex;flex-direction: row;justify-content: center;">
                    <span style="width:120px;">{params.row.main_domain}</span>
                    <div class="ib">
                      <Poptip
                        width="200"
                        trigger="hover"
                        placement="bottom-end"
                        word-wrap
                        transfer
                      >
                        <div slot="content">
                          <ul>
                            {c.map((t) => (
                              <li>{t}</li>
                            ))}
                          </ul>
                        </div>
                        <Icons
                          style={{
                            display: c.length > 1 ? "inline-block" : "none",
                          }}
                          type="bangzhutishi"
                          class="ml5"
                          color="#E4E4E4"
                          size="16"
                        />
                      </Poptip>
                    </div>
                  </div>
                );
            },
          },

          {
            title: "代理账号",
            key: "username",
            width: 200,
            align: "center",
          },
          {
            title: "备注",
            key: "remark",
            align: "center",
            render: (h, params) => {
              const { remark } = params.row;
              return (
                <div>
                  <span
                    style={{
                      display:
                        params.row.showStatus == "input"
                          ? "none"
                          : "inline-block",
                    }}
                  >
                    {remark ? remark : "-"}
                  </span>
                  <Input
                    style={{
                      width: "80%",
                      display:
                        params.row.showStatus == "input"
                          ? "inline-block"
                          : "none",
                    }}
                    placeholder="请输入备注"
                    maxlength="20"
                    value={remark}
                    onInput={(e) => {
                      if (e) {
                        this.$set(params.row, "remark", e);
                      }
                    }}
                  />
                </div>
              );
            },
          },
          {
            title: "操作者",
            key: "updated_by",
            align: "center",
          },
          {
            title: "添加时间",
            key: "created_at",
            align: "center",
            width: "160",
            render: (h, params) => {
              return <span>{this.$root.unixTime(params.row.created_at)}</span>;
            },
          },
          {
            title: "操作",
            key: "",
            align: "center",
            width: "200",
            render: (h, params) => {
              const { id, remark } = params.row;
              return (
                <div class="blue-font">
                  <span
                    style={{
                      display:
                        params.row.showStatus == "span"
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      this.$set(params.row, "showStatus", "input");
                    }}
                  >
                    {" "}
                    编辑
                  </span>
                  <div
                    style={{
                      display:
                        params.row.showStatus == "input"
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      let data = {
                        siteId: this.$root.nowSite.id,
                        id,
                        remark,
                      };
                      adBlacklistEdit(data, true).then((res) => {
                        this.$Message.success("修改成功");
                        params.row.showStatus = "span";
                        this.table.data[params.index].remark = remark;
                      });
                    }}
                  >
                    确定
                  </div>
                  <a
                    class="ml10"
                    style={{
                      display:
                        params.row.showStatus == "input"
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      params.row.showStatus = "span";
                    }}
                  >
                    取消
                  </a>
                  <span
                    style={{
                      display:
                        params.row.showStatus == "input"
                          ? "none"
                          : "inline-block",
                    }}
                    onClick={() => {
                      this.onDelete(params);
                    }}
                    class="ml5"
                  >
                    移除
                  </span>
                </div>
              );
            },
          },
        ],
      },
    };
  },
  mounted() {
    let data = { ...this.searchKey };
    for (let key in data) {
      if (!data[key]) delete data[key];
    }
    this.getData({ params: data });
  },
  methods: {
    onConfirmSub() {},
    onDelete(params) {
      let data = {
        siteId: this.$root.nowSite.id,
        id: params.row.id,
      };
      this.$Tip.confirm({
        content: "您确定要将此广告移出黑名单吗？",
        onOk: () => {
          adBlacklistDelete(data, true).then((res) => {
            if (res && res.code == 200) {
              this.$Message.success("移出黑名单成功");
              this.table.data.splice(params.index, 1);
            }
          });
        },
      });
    },
    selectDel() {
      let id = [];
      this.checkedArr.forEach((t) => {
        id.push(t.id);
      });
      let data = {
        siteId: this.$root.nowSite.id,
        id: id.join(","),
      };
      this.$Tip.confirm({
        content: "您确定将所选广告移出黑名单吗？",
        onOk: () => {
          adBlacklistDelete(data, true).then((res) => {
            if (res && res.code == 200) {
              this.$Message.success("移出黑名单成功");
              this.searchSubmit();
              this.checkedArr = [];
            }
          });
        },
      });
    },
    onSelectionChange(data) {
      this.checkedArr = data;
    },
    saveSubmit() {
      let data = { ...this.formKey };
      this.$refs.formKey.validate((valid) => {
        if (valid) {
          if (!data.username) {
            this.$Tip.info({ content: "请输入代理账号" });
            return false;
          }
          adBlacklistCreate(data).then((res) => {
            if (res && res.code == 200) {
              let params = { ...this.searchKey };
              this.getData({ params });
              this.$refs.blankModal.hide();
              const { exists_domain } = res.data;
              if (exists_domain) {
                this.existsDomainCount = exists_domain.length;
              }
              this.existsDomainList = exists_domain.join(",");
              if (this.existsDomainCount > 0) {
                this.$refs.blackTipSub.show();
              }
            }
          });
        }
      });
    },
    addBlank() {
      this.$refs.blankModal.show();
    },
    getUserName(val) {
      this.formKey.username = val;
    },
    searchSubmit() {
      if (this.page != 1) this.$refs.table.setPage();
      let data = { ...this.searchKey };
      if (data.username) data.username = this.$root.trimAll(data.username);
      if (data.domain) data.domain = this.$root.trimAll(data.domain);
      if (data.username) {
        if (!this.$root.validateName(data.username)) {
          this.$Tip.info({ content: "您所查询的代理账号不正确，请重新输入" });
          return false;
        }
      }

      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data });
    },
    getData(data) {
      this.$root.startTableLoading();
      adBlacklistList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            const { data, total } = res.data;
            data.forEach((item) => (item.showStatus = "span"));
            this.table.data = data;
            this.table.total = total;
          }
          this.$root.endTableLoading();
        })
        .catch((error) => this.$root.endTableLoading());
    },
    onConfirmSub() {
      this.$refs.blackTipSub.hide();
    },
    onPageChange(page) {
      this.page = page;
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data, query: { page } });
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data });
      this.pageSize = pageSize;
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
/deep/.content {
  text-align: center;
  form {
    margin: 40px auto;
  }
  .ivu-btn {
    width: 120px;
    height: 50px;
    font-size: 20px;
  }
}
</style>