<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem>
          <div class="v2-button">
            <Button @click="onBlackName" v-if="(adminType == 'super') || (authInPage.indexOf('fastLotteryBlackListAdd') != -1)" >添加黑名单</Button>
          </div>
        </FormItem>
        <FormItem label="站点名称">      
           <Select clearable v-model="searchKey.siteId" class="w120x" placeholder="全部" >
             <Option v-for="(t,i) in siteCollect" :key="i" :value="t.id">{{t.siteName}}</Option>
           </Select>
        </FormItem>
        <FormItem label="会员账号">
          <Input placeholder="多个请以,逗号隔开" v-model="searchKey.userName" clearable @keyup.enter.native="searchSubmit" class="w160x"/>
        </FormItem>
        <FormItem>
          <Button type="primary" class="ivu-btn search" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        editable
        :columns="table.columns"
        :loading="$root.tableLoading"
        :total="table.total"
        :value="table.data"
        :page-size-opts="table.pageSizeOpts"
        @on-page-change="onPageChange"
        @on-page-size-change='onPageSizeChange'
      ></Tables>
    </div>
    <Modals ref="addBlackName" :title="title" :width="570">
      <div slot="content" class="v2-form-wrapper">
        <Form ref="addBlack" :label-width="160" :rules="rules" :model="addBlack" style="width:570px;" >
          <FormItem label='站点名称' prop='siteId' v-if="title == '添加黑名单'">
           
            <Select class="w260x" placeholder='关键字查询'  v-model="addBlack.siteId" filterable clearable>
              <Option v-for="(t,i) in siteCollect" :key="'site' + i" :value="t.id">{{t.siteName}}</Option>
            </Select>
            <!-- <Select v-model="addBlack.siteId" v-else class="w260x" placeholder='关键字查询' filterable clearable>
              <Option v-for="(t,i) in postSite" :key="'site' + i" :value="t.id">{{t.siteName}}</Option>
            </Select> -->
          </FormItem>
          <FormItem label='站点名称' v-else>
            <Input class="w260x" disabled v-model="addBlack.siteName"/>
          </FormItem>
          <FormItem label="会员账号" class="mt20 mb30" v-if="title == '添加黑名单'">
            <!-- :disabled='!addBlack.siteId' -->
            <AutoSearch v-if="title == '添加黑名单'"  :siteId='addBlack.siteId' @sendSuperior="getUsername" ref="autoSearch" :placeholder="'会员账号，默认查询'" :stage="'all'" ></AutoSearch>
          </FormItem>
          <FormItem label='会员账号' v-else prop='userName'>
            <Input v-model="addBlack.userName" disabled class="w260x"/>
          </FormItem>
          <FormItem label='杀回金额' prop='killAmount'>
            <Input placeholder="请输入杀回金额" v-model="addBlack.killAmount" class="w260x"/>
          </FormItem>
          <FormItem label='需杀次数' prop='killNum'>
            <Input v-model="addBlack.killNum" placeholder='请输入需杀次数' class="w260x"/>
          </FormItem>
          <FormItem label='开杀下注金额' prop='killByMaxBetAmount'>
            <Input placeholder="请输入开杀下注金额" v-model="addBlack.killByMaxBetAmount" class="w260x"/>
          </FormItem>
          <FormItem label='状态'>
            <Select class="w260x" v-model="addBlack.status">
              <Option value="valid">概率控制</Option>
              <Option value="kill">精准控制</Option>
              <Option value="invalid">失效</Option>
            </Select>
          </FormItem>
          <FormItem class="mb40">
            <Button class="ivu-btn submit bg  ft20 w260x" @click="save" style="width:260px" type="primary">确认添加</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import Icons from "@/components/icons";
import Modals from "@/components/modals";
import AutoSearch from "_c/auto-search";
import { mapState } from "vuex";
import { getUserType, getAccessFromLocal } from "@/libs/util";
import {
  fastLotteryBlackList,
  fastLotteryBlackListAdd,
  fastLotteryBlackListDel,
  fastLotteryBlackListUpdate,
  fastLotteryBlackSiteList
} from "@/api/lottery";
import { Tooltip } from 'view-design';
export default {
  name: "fastLotteryBlack",
  components: {
    Tables,
    Modals,
    Icons,
    AutoSearch
  },
  data() {
    const validateKillAmount = (rule, value, cb) => {
      const { field } = rule
      if (value.toString().length == 0) {
        let msg = field == 'killAmount' ? '请输入杀回总额' : field == 'killNum' ? '请输入需杀次数' : '请输入开杀下注金额'
        cb(msg)
      } else if (value.toString().length == 1) {
        if (!/^(([0-9]\d*))$/.test(value)) {
          let msg = `请输入正确的${field == 'killAmount' ? '杀回总额' : field == 'killNum' ? '需杀次数' : '开杀下注金额'}`
          cb(msg)
        }  else cb()
      } else {
        if (!(/^(([0-9]\d*))$/.test(value)) || (/^(([0-9]\d*))$/.test(value) && value[0] == '0')) {
          let msg = `请输入正确的${field == 'killAmount' ? '杀回总额' : field == 'killNum' ? '需杀次数' : '开杀下注金额'}`
          cb(msg)
        } else cb()
      }
    }
    return {
      siteCollect:[],
      postSite:[],
      singleSite:'',
      searchKey: {
        userName: '',
        type:'1',
        siteId:'0',
      },
      page: 1,
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      userName: "",
      title: '添加黑名单',
      table: {
        loading: true,
        title: "快速彩票黑名单",
        data: [],
        pageSizeOpts: [20,30,40,50],
        total: 0,
        columns: [
          {
            title: '站点名称',
            key: 'siteName',
            align: 'center',
            minWidth: 80,
            tooltip: true
          },
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth:95,
            tooltip:true,
          },
          {
            title: "姓名",
            key: "realName",
            align: "center",
            minWidth:50,
            tooltip:true,
            render: (h, params) => (
              <span>{this.$root.text(params.row.realName)}</span>
            )
          },
          {
            title: '彩票名称',
            key: 'lotteryName',
            align: 'center',
            minWidth:85,
            tooltip:true,
            render: (h, params) => <span>{this.$root.text(params.row.lotteryName)}</span>
          },
          {
            title: '期数',
            align: 'center',
            key: 'issue',
            minWidth:80,
            tooltip:true,
            render: (h, params) => <span>{this.$root.text(params.row.issue)}</span>
          },
          {
            title: '实际下注金额',
            align: 'center',
            key: 'betAmount',
            minWidth:90,
            render: (h, params) => <span>{this.$root.keepTwo(params.row.betAmount)}</span>
          },
          {
            title: '杀回总额',
            align: 'center',
            key: 'killAmount',
            minWidth:60,
            render: (h, params) => <span>{this.$root.keepTwo(params.row.killAmount)}</span>
          },
          {
            title: '需杀次数',
            key: 'killNum',
            align: 'center',
            minWidth:60,
          },
          {
            title: '开杀下注金额',
            align: 'center',
            key: 'killByMaxBetAmount',
            minWidth:90,
            render: (h, params) => <span>{this.$root.keepTwo(params.row.killByMaxBetAmount)}</span>
          },
          {
            title: '状态',
            align: 'center',
            key: 'status',
            minWidth:60,
            render: (h, params) => {
              const { status } = params.row
              return <span>{status == 'valid' ? '概率控制' : status == 'invalid' ? '失效' : '精准控制'}</span>
            }
          },
          {
            title: "创建时间",
            key: "addTime",
            align: "center",
            minWidth:130,
            render: (h, params) => (
              <span>{this.$root.unixTime(params.row.addTime)}</span>
            )
          },
          {
            title: "操作",
            align: "center",
            minWidth:85,
            render: (h, params) => {
              return (
                <div>
                <a class="ib mr10"
                  style={{
                    display: this.adminType == 'super' || this.authInPage.indexOf('fastLotteryBlackListUpdate') != -1 ? 'inline-block' : "none"
                  }}
                  onClick={() => {
                    this.title = '编辑黑名单';
                    this.$refs.addBlack.resetFields();
                    let { userName, killAmount, killByMaxBetAmount, status, killNum, id, siteName, siteId } = params.row
                    this.addBlack = {
                      // siteId: this.$root.nowSite.id,
                      userName, killAmount: parseInt(killAmount), killByMaxBetAmount: parseInt(killByMaxBetAmount), status, killNum, id, siteName, siteId
                    }
                    this.$refs.addBlackName.show()
                  }}
                >编辑</a>
                <a
                  class="ib mr10"
                  onClick={() => {
                    this.onRemove(params);
                  }}
                  style={{
                    display: this.adminType == "super" || this.authInPage.indexOf("fastLotteryBlackListDel") != -1 ? "inline-block" : "none"
                  }}
                >
                  移除
                </a></div>
              );
            }
          }
        ]
      },
      addBlack: {
        siteId: this.$root.nowSite.id,
        userName: "",
        killAmount: '',
        killByMaxBetAmount: '',
        status: 'valid',
        killNum: ''
      },
      rules: {
        userName: [
          { required: true, message: "请输入会员账号", trigger: 'blur' }
        ],
        killAmount: [{ validator: validateKillAmount, required: true, trigger: 'blur' }],
        killNum: [{ validator: validateKillAmount, required: true, trigger: 'blur' }],
        killByMaxBetAmount: [{ validator: validateKillAmount, required: true, trigger: 'blur' }],
        siteId: [{ required: true, message: '请选择或输入站点'}]
      },
      timer: null // 定时请求数据的定时器
    };
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  mounted() {
    this.getType();
    this.singleSite=JSON.parse(localStorage.singleSite);
    this.postSite.push(this.$root.nowSite)
    let data = {...this.searchKey};
    for (let key in data){
      if(!data[key]) delete data[key];
    }
    this.getDataInterval()  //定时请求数据
    this.getData({ params: data }, true);
    this.$Message.config({
      top: 50,
      duration: 1
    })
  },
  methods: {
    getType(){
      fastLotteryBlackSiteList().then(res=>{
        if(res!=undefined&&res.code==200){
          const {multiple}=res.data;
          this.siteCollect=multiple;
        }
      })

    },
    resetForm() {
      for (let key in this.addBlack) {
        delete this.addBlack[key];
      }
    },
    save() {
      this.$refs.addBlack.validate(valid => {
        if (valid) {
          if (this.title == '添加黑名单') {
            if (!this.addBlack.userName) {
              this.$Message.error('请输入会员账号')
              return false
            }
            if (this.addBlack.id) delete this.addBlack.id
            if (this.addBlack.siteName) delete this.addBlack.siteName
            this.$refs.addBlackName.spinShow();
            fastLotteryBlackListAdd(this.addBlack, true).then(res => {
              this.$refs.addBlackName.spinHide()
              if (res != undefined && res.code == 200) {
                this.$Message.success('添加黑名单成功')
                this.getData({params: this.searchKey}, true)
                this.$refs.addBlackName.hide()
                this.resetForm()
              }
            }).catch(error => {
              this.$refs.addBlackName.spinHide()
            })
          } else {
            if (this.addBlack.siteName) delete this.addBlack.siteName
            this.$refs.addBlackName.spinShow()
            fastLotteryBlackListUpdate(this.addBlack, true).then(res => {
              this.$refs.addBlackName.spinHide()
              if (res != undefined && res.code == 200) {
                this.$Message.success('修改黑名单成功')
                // let obj = { siteId: this.$root.nowSite.id}
                this.getData({ params: this.searchKey }, true)
                this.$refs.addBlackName.hide()
                this.resetForm()
              }
            }).catch(error => this.$refs.addBlackName.spinHide())
          }
        }
      });
    },
    // 添加至黑名单列表
    onBlackName(params) {
      this.title = '添加黑名单'
      if (this.title == '添加黑名单') {
        this.$nextTick(() => { this.$refs.autoSearch.removeDefault(); })
      }
      this.$refs.addBlack.resetFields()
      this.$refs.addBlackName.show();
    },
    // 查询
    searchSubmit() {
      let { userName } = this.searchKey
      if (userName) this.searchKey.userName = this.$root.trimAll(userName)
      let data = { ...this.searchKey };
      if(data.siteId==undefined){
        data.siteId=0;
      }
      if(!data.siteId){
        data.siteId=0;
      }
      if (!data.userName) {
        delete data.userName;
      } else {
        if (!this.$root.validateName(data.userName)) {
          this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入'})
          return false
        }
      }
      this.$refs.table.setPage()
      this.getData({ params: data }, true);
    },
    onPageChange(page) {
      this.page = page
      this.getData({
        params: this.searchKey,
        query: { page }
      }, true);
    },
    getData(data, flag) {
      if(!data.params.siteId){
        data.params.siteId='0';
      }
      for (let key in data.params) {
        if (!data.params[key]) delete data.params[key]
      }
      if (flag) this.$root.startTableLoading(this);
      fastLotteryBlackList(data).then(res => {
        this.table.data = res.data.data;
        this.table.total = res.data.total;
        // this.siteCollect=res.data.siteCollect;
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading());
    },
    //  移除黑名单
    onRemove(params) {
      const { id, siteId } = params.row;
      this.$Tip.confirm({
        content: "你确定将此会员移出黑名单吗?",
        onOk: () => {
          let data = {
            siteId,
            id
          };
          fastLotteryBlackListDel(data, true).then(res => {
            if (res != undefined && res.code == 200)
              if (typeof res.data === "string") {
                this.$Message.config({
                  top: 150
                });
                this.$Message.success("会员移出黑名单成功！");
                this.table.data.splice(params.index, 1);
                this.table.total--;
              }
          });
        }
      });
    },
    //通过自动查询，获取会员账号
    getUsername(value) {
      this.addBlack.userName = value;
    },
    getDataInterval() {
      let { userName } = this.searchKey
      if (userName) this.searchKey.userName = this.$root.trimAll(userName)
      let data = { ...this.searchKey ,siteId:'0'}
      if(data.siteId==undefined){
        data.siteId=0;
      }
      if(!data.siteId){
        data.siteId=0;
      }
      if (!data.userName) {
        delete data.userName;
      } else {
        if (!this.$root.validateName(data.userName)) {
          this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入'})
          return false
        }
      }
      clearInterval(this.timer)
      this.timer = null
      this.timer = setInterval(() => {
        this.page == 1 ? this.getData({ params: this.searchKey }, false) : this.getData({ params: this.searchKey, query: { page: this.page }}, false)
      },5000)
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize
      this.getData({ params: this.searchKey }, true )
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
@import "../../styles/class.less";
.tjhmd {
  width: 260px;
  height: 50px;
}
.w260x {
  width: 260px;
  height: 30px;
}
/deep/.v2-button {
  margin-right:0 !important;
}
/deep/.ivu-form-item-error-tip {
  top: 40px;
  left: -8px;
}
/deep/.ivu-select-selection{
  color:#444;
}
/deep/.ivu-input-icon-validate{
  display: none!important;
}
</style>

