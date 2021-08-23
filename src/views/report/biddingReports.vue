
<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem>
          <Button type="primary" @click="addUser" :loading="$root.editBtnLoading">新增推广代理</Button>
        </FormItem>
        <FormItem label="首存日期">
          <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="代理账号">
          <Input v-model="searchKey.userName" clearable placeholder="请输入代理账号" />
        </FormItem>
        <FormItem>
          <Button
            class="search"
            type="primary"
            @click="searchSubmit"
            :loading="$root.editBtnLoading"
          >查询</Button>
        </FormItem>
        <FormItem>
          <Button
            :loading="$root.editBtnLoading"
            class="ivu-btn export"
            @click="exportExcel"
            type="primary"
          >导出Excel</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :value="table.data"
        :columns="table.columns"
        :total="table.total"
        :showSummary="true"
        @summary-method="handleSummary"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      ></Tables>
    </div>
    <Modals ref="addModals" @closeModal='closeModal' :title="formKey.type==1?'新增推广代理':'编辑推广代理'" :width="760">
      <div slot="content">
        <Form :label-width="280" ref="Form" :model="formKey" :rules="rules">
          <FormItem label="上级代理" class="ib w25" prop='userName'>
            <AutoSearch
              v-if='formKey.type==1'
              class="auto-serch"
              ref="autoSearh"
              :width="260"
              :siteId="$root.nowSite.id"
              @sendSuperior="getUserName"
              :placeholder="'默认查询'"
            ></AutoSearch>
            <Input v-else class="w260x" disabled v-model="formKey.userName" />
          </FormItem>
          <FormItem label="户名" prop="accountName">
            <Input v-model="formKey.accountName" maxlength="20"placeholder="请输入户名" class="w260x" />
          </FormItem>
          <FormItem label="新增费用" prop="accountMoney">
            <!-- <Input
              class="w260x"
              v-model="formKey.accountMoney"
              placeholder="请输入推广费用"
            /> -->
             <InputNumber
                :max="999999999"
                :min='0'
                :step="1"
                class="w260x"
                placeholder="请输入推广费用"
                :value="Number(formKey.accountMoney)||null"
                :formatter="value =>formKey.accountMoney= value =  /\d+(\.\d)?/g.exec(`${value}`)[0]"
                @on-change="(e)=>{if(!e){modalData.initialAmount=e=0}}"
              />
          </FormItem>
          <FormItem>
            <Button class="ft20 ivu-btn submit" @click="save" type="primary">提交保存</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "_c/tables";
import Icons from "_c/icons";
import AutoSearch from "_c/auto-search";
import { biddingReports, biddingAffiliatedUser } from "@/api/report";
import Modals from "_c/modals";
export default {
  name: "fastLotteryTop",
  components: {
    Tables,
    Modals,
    Icons,
    AutoSearch
  },
  data() {
    	const validatePassTwo = (rule, value, callback) => {
				if (
					this.$refs.autoSearh.value === "" ||
					this.$refs.autoSearh.value === undefined
				) {
					// this.$Message.error("请输入或选择会员账号");
					// return;
					callback(new Error("请输入或选择会员账号"));
				} else {
					callback();
				}
			};
    return {
      page: 1,
      authInPage: JSON.parse(localStorage.authInPage),
      // Time: [this.$root.newstartTime()],
      Time:[
        this.$root.formatTime(
          new Date(this.$root.newstartTime()).getTime() - 60 * 60 * 24 * 30 * 1000
        )
      ],
      searchKey: {
        siteId: this.$root.nowSite.id,
        userName: "",
        limit: 20,
        date:'',
      },
      formKey: {
        type: "",
        siteId: this.$root.nowSite.id,
        userName: "",
        accountName: "",
        accountMoney: ""
      },
      table: {
        data: [],
        loading: true,
        total: 0,
        columns: [
          {
            title: "代理账号",
            key: "userName",
            align: "center",
            minWidth: 95
          },
          {
            title: "户名",
            key: "accountName",
            align: "center",
            minWidth: 95,
            tooltip: true
          },
          {
            title: "推广费用",
            key: "accountMoney",
            align: "center",
            minWidth: 95
          },
          {
            title: "首存人数",
            key: "num",
            align: "center",
            minWidth: 95,
            render: (h, params) => <span>{!params.row['1num']?'0':params.row['1num']}</span>
          },
          {
            title: "1日留存",
            key: "1num",
            align: "center",
            minWidth: 95,
            render: (h, params) => <span>{!params.row['1num']?'0':params.row['1num']}</span>
          },
          {
            title: "2日留存",
            key: "2num",
            align: "center",
            minWidth: 95,
            render: (h, params) => <span>{!params.row['2num']?'0':params.row['2num']}</span>
          },
          {
            title: "3日留存",
            key: "3num",
            align: "center",
            minWidth: 95,
            render: (h, params) => <span>{!params.row['3num']?'0':params.row['3num']}</span>
          },
          {
            title: "4日留存",
            key: "4num",
            align: "center",
            minWidth: 95,
            render: (h, params) => <span>{!params.row['4num']?'0':params.row['4num']}</span>
          },
          {
            title: "5日留存",
            key: "5num",
            align: "center",
            minWidth: 95,
            render: (h, params) => <span>{!params.row['5num']?'0':params.row['5num']}</span>
          },
          {
            title: "6日留存",
            key: "6num",
            align: "center",
            minWidth: 95,
            render: (h, params) => <span>{!params.row['6num']?'0':params.row['6num']}</span>
          },
          {
            title: "7日留存",
            key: "7num",
            align: "center",
            minWidth: 95,
            render: (h, params) => <span>{!params.row['7num']?'0':params.row['7num']}</span>
          },
          {
            title: "15日留存",
            key: "15num",
            align: "center",
            minWidth: 95,
            render: (h, params) => <span>{!params.row['15num']?'0':params.row['15num']}</span>
          },
          {
            title: "30日留存",
            key: "30num",
            align: "center",
            minWidth: 95,
            render: (h, params) => <span>{!params.row['30num']?'0':params.row['30num']}</span>
          },
          {
            title: "操作",
            align: "center",
            key:'caozuo',
            minWidth: 85,
            render: (h, params) => {
              return (
                <div>
                  <a
                    class="ib mr10"
                    onClick={() => {
                      this.onEdit(params);
                    }}
                  >
                    编辑
                  </a>
                  <a
                    class="ib"
                    onClick={() => {
                      this.onRemove(params);
                    }}
                  >
                    删除
                  </a>
                </div>
              );
            }
          }
        ]
      },
      rules: {
        userName:[
          {
            required: true,
            message: "请输入代理账号",
            validator: validatePassTwo,
            trigger: "change",
          }
        ],
        accountName: [
          {
            required: true,
            message: "请输入户名",
            trigger: "blur",
            pattern: /.+/
          }
        ],
        accountMoney: [
          {
            required: true,
            message: "请输入推广费用",
            trigger: "blur",
            pattern: /.+/
          }
        ]
      }
    };
  },
  mounted() {
    let data = { ...this.searchKey };
    this.getData({ params: data });
    this.Time = [
				this.$root.formatTime(this.Time[0]),
		];
		this.searchKey.date = this.Time[0]
  },
  methods: {
    closeModal(){
      this.$refs.autoSearh.removeDefault();
    },
    // 获取自动搜索框的代理名
    getUserName(val) {
      this.formKey.userName = val;
    },
    addUser() {
      this.formKey={
        siteId:this.$root.nowSite.id,
        type:1,
        userName:'',
        accountName:'',
        accountMoney:'',
      }
      this.$nextTick(() => { 
        
        this.$refs['Form'].resetFields();
        this.$refs.addModals.show();
      })
    },
    onRemove(params){
      this.$Tip.confirm({
                content: `您确定删除【${params.row.userName}】代理线吗？`,
                onOk: () => {
                    let data = {
                        userName: params.row.userName,
                        type:2,
                        siteId: this.$root.nowSite.id
                    };
                    biddingAffiliatedUser(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.$Message.success('删除成功');
                            this.getData({params:{...this.searchKey}})
                        }
                    });
                }
            });
    },
    onEdit(params){
      this.formKey={
        siteId:this.$root.nowSite.id,
        type:3,
        userName:params.row.userName,
        accountName:params.row.accountName,
        accountMoney:params.row.accountMoney,
      }
      this.$refs['Form'].resetFields();
      this.$refs.addModals.show();
    },
    save() {
      this.$refs.Form.validate(valid => {
					if (valid) {
            if(!this.formKey.userName) {
              this.$Message.error('请输入正确的会员账号');
              return
            };
            let Msg =this.formKey.type == 1? "新增成功": "修改成功";
            biddingAffiliatedUser({ ...this.formKey }, true).then(res => {
              if (res && res.code == 200) {
                this.$Message.success(Msg);
                this.getData({params:{ ...this.searchKey },query:{page:this.page}});
                this.$refs.addModals.hide();
              }
            });
          }
      })
     
    },
    exportExcel() {
      this.searchKey.date=this.$root.formatTime(this.Time[0])
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      if(data.date=="Invalid date"||!data.date){
        this.$Message.error('请选择日期')
        return 
      }
      data.isExport = 1;
      data.date = this.Time[0]
      let openr = window.open();
      biddingReports({ params: data }).then(res => {
        if (res != undefined && res.code == 200) {
          let region = res.data.downloadUrl;
          let nowHost = region.split(".com")[1];
          let openr1 = openr ? openr : window;
          openr1.location.href = nowHost;
        } else {
          openr.close();
        }
      });
    },
    getData(data) {
      this.$root.startTableLoading();
      for (let key in data.params) {
        if (!data.params[key]) delete data.params[key];
      }
      data.params.date = this.$root.formatTime(this.Time[0]);
      biddingReports(data)
        .then(res => {
          if (res != undefined && res.code == 200) {
            this.table.data = res.data.data;
            this.table.total = res.data.total;
            this.$root.endTableLoading();
          }
        })
        .catch(error => this.$root.endTableLoading());
    },
    searchSubmit() {
      this.searchKey.date=this.Time[0];
      if (
        this.searchKey.userName &&
        !this.$root.validateName(this.searchKey.userName)
      ) {
        this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
        return false;
      }
      let data = { ...this.searchKey };
      if(data.date=="Invalid date"||data.date==''){
        this.$Message.error('请选择日期')
        return 
      }
      this.$refs.table.setPage();
      this.getData({ params: data });
    },
    onPageChange(page) {
      this.page = page;
      let data = { ...this.searchKey };
      if (this.searchKey.siteIds == "全部") {
        data.siteIds = this.qList;
      } else {
        data.siteIds = JSON.stringify(this.ids);
      }
      for (let key in data.params) {
        if (!data.params[key]) delete data.params[key];
      }
      data.page = page;
      if (data.userName && !this.$root.validateName(data.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
        return false;
      }
      this.getData({ params: data, query: { page } });
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      let data = { ...this.searchKey };
      if (this.searchKey.siteIds == "全部") {
        data.siteIds = this.qList;
      } else {
        data.siteIds = JSON.stringify(this.ids);
      }
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      if (data.userName && !this.$root.validateName(data.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
        return false;
      }
      this.getData({ params: data });
    },
    handleSummary(columns, data, callback) {
            const sums = {};
            columns.forEach((column, index) => {
                const key = column.key;
                if (index === 0) {
                    sums[key] = { key, value: '总计' };
                    return;
                }
                const values = data.map(item => Number(item[key]));
                let dayNum =key.substring(0,key.length-3);
                if(!dayNum) dayNum=0;
                if(key=='accountName'||key=='caozuo') dayNum=null
                if(dayNum=='accountMo') dayNum=0;
                //Number(new Date(this.searchKey.date).getTime())+Number(dayNum*60*60*24*1000))<new Date().getTime()
                if ((dayNum==0||dayNum)&&!values.every(value => isNaN(value))) {
                    const v = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[key] = {
                        key,
                        value: v
                    };
                } else {
                    sums[key] = {
                        key,
                        value: '-'
                    };
                }
            });
            callback(sums);
            return sums;
        },
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
/deep/.ivu-table-summary {
		border-bottom:1.3px solid #dcdcdc !important;
		border-top:1.3px solid #dcdcdc !important;
	}
</style>

