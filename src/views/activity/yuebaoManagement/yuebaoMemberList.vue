<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem>
          <Button
            type="primary"
            class="search"
            :loading="$root.tableLoading"
            @click.prevent="removes"
          >移除</Button>
        </FormItem>
        <!-- <FormItem label="余额宝等级">
          <Input v-model="searchKey.level_min" class="w50x mr20" placeholder="下限" clearable />
          <Input v-model="searchKey.level_max" class="w50x" placeholder="上限" clearable />
        </FormItem>-->
        <FormItem>
          <Select class="w100x" v-model="searchKey.balance_type">
            <Option value="yuebao_balance">余额宝</Option>
            <Option value="member_balance">账户余额</Option>
          </Select>
        </FormItem>
        <FormItem>
          <InputNumber
            v-model="searchKey.balance_min"
            :min="0"
            :max="9999999999"
            class="w120x mr20"
            placeholder="下限"
            clearable
          />
          <InputNumber
            v-model="searchKey.balance_max"
            :min="0"
            :max="9999999999"
            class="w120x"
            placeholder="上限"
            clearable
          />
        </FormItem>
        <FormItem>
          <Select class="w100x" v-model="searchKey.account_type">
            <Option value="member">会员账号</Option>
            <Option value="agency">上级代理</Option>
            <Option value="invite">邀请者</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input v-model="searchKey.account_val" class="w120x" placeholder="请输入会员账号" clearable />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            class="search"
            :loading="$root.tableLoading"
            @click.prevent="searchSubmit"
          >查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        ref="tables"
        :value="table.data"
        :total="table.total"
        :columns="table.columns"
        :loading="$root.tableLoading"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change="sortChange"
      ></Tables>
    </div>
    <Modals ref="yuebaoRemove" title="批量移除余额宝" :width="720">
      <div slot="content" class="pt10 pr30 pb20 pl30">
        <Form ref="removeList" :label-width="120" :model="removeList" :rules="rule">
          <FormItem label="移除账号" prop="username">
            <Input
              v-model="removeList.data"
              @on-change="testUserNum"
              :rows="5"
              type="textarea"
              class="w400x"
              placeholder="*格式为*:账号 
例如:a12345
b12345
一行一个,最多操作10000个会员"
            />
            <Checkbox class="box" v-model="sendMsg">站内信</Checkbox>
          </FormItem>
        </Form>
        <div class="mt10 txt-a">
          <Button type="primary" class="ivu-btn submit bg h50" @click="submit">确认保存</Button>
        </div>
      </div>
    </Modals>
  </div>
</template>
<script>
import Icons from "_c/icons";
import Tables from "_c/tables";
import Modals from "@/components/modals";
import { yuebaoMemberList, yuebaoMemberDel } from "@/api/activity";
export default {
  name: "yuebaoMemberList",
  components: {
    Tables,
    Icons,
    Modals
  },
  data() {
    let a = (rule, val, cb) => {
      this.$nextTick(() => {
        if (this.removeList.data) {
          cb();
        } else {
          cb(new Error("请输入会员账号"));
        }
      });
    };
    return {
      page: 1,
      spinShow: true,
      sendMsg:false,
      removeList: {
        data: null
      },
      searchKey: {
        limit: 20,
        // level_min:null,//余额宝等级下限
        // level_max:null,//余额宝等级上限
        balance_type: "yuebao_balance", //member_balance: 会员余额 yuebao_balance: 余额宝余额
        balance_min: null, //金额下限
        balance_max: null, //金额上限
        account_type: "member", //member: 会员帐号 agency: 代理账号 invite: 邀请者
        account_val: "", //账户
        //sort_type:'',//排序类型 member_balance: 账户余额 yuebao_balance: 余额宝余额 fee_amount: 利息
        siteId: this.$root.nowSite.id
      },
      rule: {
        username: [
          {
            required: true,
            validator: a,
            trigger: "blur"
          }
        ]
      },
      table: {
        data: [],
        pageSizeOpts: [20, 30, 40, 50],
        loading: true,
        total: 0,
        columns: [
          {
            title: "会员账号",
            align: "center",
            key: "username"
          },
          {
            title: "账号类型",
            align: "center",
            key: "account_type"
          },
          {
            title: "上级代理",
            align: "center",
            key: "agencyName",
            render: (h, params) => (
              <span>{this.$root.text(params.row.agencyName)}</span>
            )
          },
          {
            title: "余额宝等级",
            align: "center",
            key: "level",
          },
          {
            title: "日利率",
            align: "center",
            key: "rate"
          },
          {
            title: "账户余额",
            align: "center",
            key: "member_balance",
            sortable: 'custom',
          },
          {
            title: "余额宝",
            align: "center",
            key: "yuebao_balance",
            sortable: 'custom',
          },
          {
            title: "利息",
            align: "center",
            key: "fee_amount",
            sortable: 'custom',
          },
          {
            title: "操作",
            align: "center",
            key: "created_at",
            render: (h, params) => {
              return <a onclick={() => this.remove(params)}>移除</a>;
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    searchSubmit() {
      this.page = 1;
      this.getData();
      this.$refs.tables.setPage();
    },
    submit() {
      this.$refs.removeList.validate(valid => {
        if (valid) {
          let data = {
            siteId: this.$root.nowSite.id,
            is_send_msg:this.sendMsg?'yes': 'no',
            username: this.removeList.data
          };
        if(data.username){
          let reg=/^[0-9a-zA-Z,]*$/g;
          if(data.username)data.username=this.$root.trimAll(data.username);
          if(data.username&&!reg.test(data.username)){
            this.$Tip.info({ content: '账号输入格式不正确(由数字和字母组成，请以,分隔)' });
             return false;
          }
        }
        
        
          yuebaoMemberDel(data, true).then(res => {
            if (res && res.code == 200) {
              const {not_exists } = res.data;
              let noWhiteListContent;
              if (Array.isArray(not_exists)) {
                noWhiteListContent = not_exists.toString();
              }
              let noWhiteCount = not_exists.length;
              if (noWhiteCount!=0) {
                this.$Tip.showAddSub({
                  show: true,
                  whiteListContent:'',
                  whiteCount:'',
                  noWhiteCount,
                  noWhiteListContent
                });
              } else{
                this.$Message.success("移除成功");
              }
                this.$refs.yuebaoRemove.hide();
                this.searchSubmit();
            }
          });
        }
      });
    },
    testUserNum(e) {
      let arr = e.target.value.split(",");
      if (arr.length > 10000) {
        this.$Tip.info({
          content: "用户量太大，最多可操作一万个用户，请分批操作！"
        });
      }
    },
    remove(params) {
      let text = `您确定要移除【${params.row.username}】吗?`;
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          let data = {
            siteId: this.$root.nowSite.id,
            username: params.row.username,
            is_send_msg: "no"
          };
          yuebaoMemberDel(data, true).then(res => {
            if (res && res.code == 200) {
              this.$Message.success("移除成功");
              this.table.data.splice(params.index,1)
            }
          });
        }
      });
    },
    removes() {
      this.removeList.data='';
      this.$refs.yuebaoRemove.show();
    },
    delLevel() {
      //删除等级
      this.table.data.pop();
    },
    getData() {
      //获取列表数据
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      let reg = /^[0-9A-Za-z-_]{5,20}$/;
      if (data.account_val)
        data.account_val = this.$root.trimAll(data.account_val);
      if (data.account_val && !reg.test(data.account_val)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      data.page = this.page;
      this.$root.startTableLoading();
      yuebaoMemberList(data)
        .then(res => {
          if (res && res.code == 200) {
            this.table.data = res.data.data;
            this.table.total = res.data.total;
            this.$root.endTableLoading();
          } else {
            this.$root.endTableLoading();
          }
        })
        .catch(error => this.$root.endTableLoading());
    },
    onPageChange(page) {
      this.page = page;
      this.getData();
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      this.getData();
    },
    sortChange({ column, key, order }) {
                delete this.searchKey.sortKey;
                delete this.searchKey.sortVal;
                let data = {
                    sort_type: key,
                    sort_val: order,
                    ...this.searchKey,
                    siteId: this.$root.nowSite.id
                };
                this.searchKey.sort_type = key;
                if (data.sort_val == 'normal') {
                    this.table.columns.forEach(item => {
                        if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                    });
                    this.searchKey.sortVal = 'asc';
                    data.sortVal = 'asc';
                } else {
                    this.searchKey.sort_val = order;
                    this.table.columns.forEach(item => {
                        delete item.sortType;
                    });
                }
                this.getData(data);
                // this.page == 1 ? "" : this.$refs.table.setPage();
                // this.page == 1
                //   ? this.getData({ params: data })
                //   : this.getData({ params: data, query: { page: 1 } });
            
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";

.footer {
  border-top: 0;
  line-height: 48px;
}
.box {
    vertical-align: top;
    margin-left:20px ;
}
</style>


