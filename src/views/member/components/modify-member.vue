<template>
  <div>
    <Modals ref="modifyMemberModal" title="修改会员等级" :width="screen<1690?1350:1500" @modalVisible="clearBeforeData">
      <div slot="content" class="pt10 pr30 pb20 pl30">
        <div class="v2-search">
          <Form ref="searchKey" inline v-if="(adminType == 'super') || (authInPage.indexOf('soonModifyMemberList') != -1)">
            <FormItem>
              <Checkbox v-model="searchKey.isLike">
                <span>模糊</span>
              </Checkbox>
            </FormItem>
            <FormItem>
              <Select v-model="searchKey.typeTag" class="s-100">
                <Option value="userName">会员账号</Option>
                <Option value="agencyName">上级代理</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Input :placeholder="searchKey.isLike == '1' ? '单个查询' : '多个请以,逗号隔开'" class="s-140" v-model="searchKey.content"/>
            </FormItem>
            <!-- <FormItem>
              <Poptip
                trigger="hover"
                class="ml14f"
                content="多个请以,逗号隔开,仅支持同类型多个输入"
                placement="bottom-end"
              >
                <Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
              </Poptip>
            </FormItem> -->
            <FormItem>
              <Button type="primary" class="search" :loading="btnLoading" @click.prevent="searchSubmit">查询</Button>
            </FormItem>
        
            <!-- <FormItem label="修改分组" v-if="(adminType == 'super') || (authInPage.indexOf('memberGroupModify') != -1)"  >
					<Select v-model="formKey.group_id"  style="width:140px"  @on-change="groupChange"  :disabled="levelDisabled">
						<Option v-for="(t,i) in selectList"   :value="t.group_id" :key="i">{{t.group_name}}</Option>
					</Select>
				</FormItem> -->
           <FormItem label="修改分组"  prop="group_id" v-show="(adminType == 'super'&&this.$root.groupLenth()>1) || (authInPage.indexOf('memberGroupModify') != -1&&this.$root.groupLenth()>1)" >
						<GroupSelect
						class="aaa"
						placeholder="请选择"
						ref="GroupSelect"
						clearable
						width="140"
						:levelType="'group'"
            :disabled="levelDisabled"
            :choiceShow = "true"
						@on-level-change="groupChange"
					/>
				</FormItem>

     
            <FormItem label="修改等级">
              <LevelSelect
                ref="LevelSelect"
                :width="140"
                clearable
                :levelType="'member'"
                @on-level-change="levelChange"
                :disabled="levelDisabled"
                :choiceShow = "true"
              />
            </FormItem>
            <FormItem>
              <RadioGroup v-model="formKey.status" size="large">
                <Radio :disabled="lockRadioDisabled" :label="1">锁定</Radio>
                <Radio :disabled="unlockRadioDisabled" :label="0">解锁</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem>
              <Poptip trigger="hover" class="ml14f" content="锁定会员将不能一键分配晋级,但可手动调节等级" placement="right-end">
                <Icons type="bangzhutishi" color="#E4E4E4" :size="26" class="ml0 mr8"/>
              </Poptip>
            </FormItem>
          </Form>
        </div>

        <div class="v2-table modal-overflow">
          <Tables
            ref="modalTable"
            :columns="table.columns"
            :loading="table.loading"
            :value="table.data"
            :page="table.page"
            :total="table.total"
            :more="table.more"
            :maxHeight='522'
            :showSizer="true"
            :pageSizeOpts='table.pageSizeOpts'
            @on-page-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
            @on-selection-change="onSelectionChange"
          >
            <div class="clearfix" slot="more">已选会员{{total}}人</div>
          </Tables>
        </div>
        <div class="mt10">
          <Button type="primary" class="ivu-btn submit bg h50" :disabled="submitDisabled"
            v-if="(adminType == 'super') || (authInPage.indexOf('memberLevelModifyBatch') != -1)"
           @click="submit">确认保存</Button>
        </div>
      </div>
    </Modals>
  </div>
</template>
<script>
import Modals from "@/components/modals";
import Icons from "@/components/icons";
import Tables from "@/components/tables";
import LevelSelect from "@/components/level-select";
import { getUserType } from '@/libs/util';
import GroupSelect from "@/components/group-select";
import {
  memberLevelModifyBatch,
  searchmemberList,
  getMemberGroupList
} from "@/api/member";
export default {
  components: { Modals, Icons, Tables, LevelSelect ,GroupSelect},
  data() {
    return {
      selectList:[],
      page:1,
      screen:screen.width,
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      total: 0,
      btnLoading: false,
      levelDisabled: true,
      lockRadioDisabled: true,
      unlockRadioDisabled: true,
      submitDisabled: true,
      searchKey: {
        typeTag: "userName",
        siteId: this.$root.nowSite.id,
      },
      // 批量等级
      formKey: {},
      table: {
        pageSizeOpts: [10,20,30,50],
        total: 0,
        more: true,
        page: true,
        loading: false,
        columns: [
          {
            type: "selection",
            width:screen.width<1690?65: 80,
            align: "center",
            className:'',
          },
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth:55,
            tooltip:true,
          },
            {
            title: "分组",
            key: "group_name",
            align: "center",
            minWidth:20,
            render:(h,params)=>{
              return (<span>{params.row.group_name?params.row.group_name:'-'}</span>)
            }
      
          },
          {
            title: "等级",
            key: "levelName",
            align: "center",
            minWidth:20
          },
          {
            title: "上级代理",
            key: "agencyName",
            align: "center",
            minWidth:55,
            render: (h, params) => {
              let agencyName = params.row.agencyName ? params.row.agencyName : "-";
              return <span>{agencyName}</span>;
            }
          },
          {
            title: "公司入款次数",
            key: "offline_deposit_count",
            align: "center",
            minWidth:85
          },
          {
            title: "公司入款总额",
            key: "offline_deposit_amount",
            align: "center",
            minWidth:85
          },
          {
            title: "线上支付次数",
            key: "online_deposit_count",
            align: "center",
            minWidth:85,
            render: (h, params) => <span>{params.row.online_deposit_count ? params.row.online_deposit_count : 0}</span>
          },
          {
            title: "线上支付总额",
            key: "online_deposit_amount",
            align: "center",
            minWidth:85
          },
          {
            title: "取款次数",
            key: "withdrawals_count",
            align: "center",
            minWidth:55
          },
          {
            title: "取款总额",
            key: "withdrawals_amount",
            align: "center",
            minWidth:55
          },
          {
            title: "总输赢",
            key: "net_amount",
            align: "center",
            minWidth:45
          },
          {
            title: "锁定",
            key: "lock",
            align: "center",
            minWidth:30,
            render: (h, params) => {
              let className = params.row.lock == "yes" ? "redText" : "";
              let text = params.row.lock == "yes" ? "已锁定" : "未锁定";
              return <span class={className}>{text}</span>;
            }
          },
          {
            title: "操作时间",
            key: "updated_at",
            align: "center",
            minWidth:110,
            render: (h, params) => (
              <span>{+params.row.updated_at ? this.$root.unixTime(params.row.updated_at) : '-'}</span>
            )
          }
        ],
        data: []
      }
    };
  },
  watch: {
    total(val, oldVal) {
      this.levelDisabled = this.total == 0
      this.total == 0 ? (this.$refs.LevelSelect.reset('single')||this.$refs.GroupSelect.reset('single')) : ''
    }
  },
  methods: {
    // 	      getGroupList(){
    //   getMemberGroupList({siteId:this.$root.nowSite.id}).then(res=>{
    //     if(res!=undefined&&res.code==200){
    //        this.selectList=res.data;
          
    //     }
    //   })
    // },
    getData(data) {
      // this.getGroupList()
      this.btnLoading = true
      let {isLike } = data.params
      if(isLike) data.params.isLike = Number(isLike)
      else delete data.params.isLike
      this.table.loading = true
      searchmemberList(data).then(res => {
        this.table.loading = false
        this.btnLoading = false
        let { data, total } = res.data;
        this.table.data = data
        this.table.total = total
        this.total=0;
      }).catch(error => this.table.loading = false)
    },
    LevelSelectInit() {
      this.$refs.LevelSelect.init(this.$root.nowSite.id);
      this.$refs.GroupSelect.init(this.$root.nowSite.id);
    },
    onSelectionChange(res) {
      this.levelDisabled = res.length ? false : true;
      this.submitDisabled = res.length ? false : true;
      this.total = res.length;

      let hasLock = res.some(item => item.lock === "yes");
      let hasUnlock = res.some(item => item.lock === "no");
      if (hasLock && !hasUnlock) {
        this.unlockRadioDisabled = false;
      } else if (hasUnlock && !hasLock) {
        this.lockRadioDisabled = false;
      } else if (hasLock && hasUnlock) {
        this.unlockRadioDisabled = false;
        this.lockRadioDisabled = false;
      } else {
        this.unlockRadioDisabled = true;
        this.lockRadioDisabled = true;
      }

      let ids = [];
      res.forEach(item => {
        ids.push(item.uid);
      });
      if (ids.length > 1) ids = ids.join(",");
      else ids = ids[0];
      this.formKey.uid = ids;
    },
    show() {
      this.$refs.modifyMemberModal.show();
    },
    levelChange(res) {
      console.log(res)
      this.formKey.levelLabel = res.levelLabel;
      this.formKey.levelName = res.levelName;
      this.formKey.levelAlias=res.levelAlias;

    },
    groupChange(val){
          this.formKey.group_id=val.group_id;
    },
    submit() {
      let params = { ...this.formKey };
      let data = { ...this.searchKey }
      for (let key in data) {
        if (!data[key]) delete data[key]
      }
      //     if (!params.group_id) {
      //   this.$Tip.info({ content: '请选择所要修改的分组' })
      //   return false
      // }
      if (!params.levelLabel) {
        this.$Tip.info({ content: '请选择所要修改的会员等级' })
        return false
      }
    
      if (!data.content) {
        this.$Tip.info({ content: '请输入会员账号' })
        delete data.typeTag
        return false
      }
      
      params.siteId = this.$root.nowSite.id;
      this.$refs.modifyMemberModal.spinShow();
      memberLevelModifyBatch(params,true)
        .then(res => {
          this.$refs.modifyMemberModal.spinHide();
         if( res != undefined && res.code == 200) {
          this.$Message.success("修改会员等级成功");
          //重置lock状态
          this.resetLock()
          this.page == 1 ? this.searchSubmit() : this.getData({ params: data, query: { page: this.page } })
          this.searchSubmit();
          this.resetField();
         }
        })
        .catch(err => {
          this.$refs.modifyMemberModal.spinHide();
        });
      return;
    },
    searchSubmit() {
             if(this.$root.groupLenth()<2){

            let newArr = [];
     this.table.columns.forEach(t=>{
       if(t.key != 'group_name')newArr.push(t);
        this.table.columns = newArr;
           })
        }
      let params = { ...this.searchKey };
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      if (params.isLike) params.isLike = Number(params.isLike)
      if (!params.content) {
        this.$Tip.info({ content: '请输入会员账号' })
        delete params.typeTag;
        return
      }
      this.$refs.modalTable.setPage(1);
      // if()
      this.getData({params});
    },
    clearBeforeData (flag) {
      if (!flag) {
        this.resetLock()
        this.$refs.LevelSelect.reset('single')
        this.table.data = []
        this.table.total = 0
        this.searchKey.isLike = false
        delete this.searchKey.content
        this.total = 0
        this.$emit('updateData')
      }
    },
    onPageChange(page){
      this.page = page
      this.total = 0
      let data = { ...this.searchKey }
      if (data.isLike) data.isLike = Number(data.isLike)
      else delete data.isLike
      this.getData({ params: data, query: { page}})
    },
    onPageSizeChange(pageSize){
      this.searchKey.limit = pageSize
      let data = { ...this.searchKey }
      if (data.isLike) data.isLike = Number(data.isLike)
      else delete data.isLike
      this.getData({ params: data})
    },
    resetLock () {
      this.levelDisabled = this.lockRadioDisabled = this.unlockRadioDisabled = this.submitDisabled = true
    },
    resetField () {
      this.total = 0
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../styles/button.less";
.ivu-checkbox-wrapper + span, .ivu-checkbox + span{margin-right:0px;}
.ivu-checkbox-wrapper{margin-right: 0px;}
.ml0 {
  margin-left: 0;
}

.mr8 {
  margin-right: 8px;
}

.submit {
  display: block;
  margin: 0 auto;
  text-align: center;
}

/deep/.ivu-modal-wrap {
  .ivu-modal {
    width: 1400px !important;
  }
}
/deep/div.ivu-row {
  width: 95%;
  position: absolute;
  bottom: 70px;
}
/deep/button.ivu-btn.submit {
  margin-top: 50px;
}
// 修改会员等级高度
.modal-overflow {
  max-height: 600px;
}

/deep/th .ivu-table-cell-with-selection:after {
  content: '全选';
  position: relative;
  margin-left: 8px;
  font-size: 1rem;
  font-weight: 400;
}
/deep/.ivu-table-tip {
    height: 50px;
}
/deep/.ivu-page-total{
  font-size: .875rem /* 14/16 */
}
</style>
