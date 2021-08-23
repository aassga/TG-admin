<template>
  <div>
    <Form class="v2-search" ref="searchKey"  inline>
      <FormItem >
        <div class="v2-button mb10">
          <Button
          @click="batchReduce"
          v-show="checkedArr.length > 0"
          v-if="(adminType == 'super') || (authInPage.indexOf('blackListDelete') != -1)"
        >删除选中</Button>
        <Button
          @click="addBlackList"
          v-if="(adminType == 'super') || (authInPage.indexOf('blackListCreate') != -1)"
        >添加黑名单</Button>
        </div>
      </FormItem>
      <FormItem >
        <Select v-model="selectType" class="s-120" @on-change="changeType">
          <Option value="1">操作区域IP</Option>
          <Option value="2">操作账号</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Input  v-model="searchKey.selectVal" class="s-120" placeholder="请输入内容"/>
      </FormItem>
      <FormItem><Button type="primary" @click="searchSubmit">查询</Button></FormItem>
    </Form>
  
    <div class="v2-table">
      <Tables
        :loading="$root.tableLoading"
        :value="table.data"
        :columns="table.columns"
        :total="table.total"
        :pageSizeOpts="table.pageSizeOpts"
        @on-selection-change="onSelectionChange"
        @on-page-size-change='onPageSizeChange'
        @on-page-change="onPageChange"
        @on-delete="onDelete"
      ></Tables>
    </div>
    <Modals :title="this.title" :width="620" ref="addBlackList" @modalVisible="resetFieldBlack">
      <div slot="content">
        <Form :label-width="160" ref="addBlackListInfo" :model="addBlackListInfo" :rules="rules">
          <FormItem label="限制区域IP" prop="ip">
            <Input :disabled="disabled" v-model="addBlackListInfo.ip" class="w320x" placeholder="请输入IP地址  多个以英文逗号隔开"/>
          </FormItem>
          <FormItem label="黑名单时效">
            <Select :disabled="disabled" v-model="addBlackListInfo.type" class="w320x" placeholder="立即生效（永久）">
              <Option value="forever">立即生效（永久）</Option>
              <Option value="expire">按照时间</Option>
            </Select>
          </FormItem>
          <FormItem label="结束日期" v-if="addBlackListInfo.type == 'expire'">
            <!-- <DatePicker type="date" class="w120x" v-model="addBlackListInfo.startTime" transfer placeholder="开始日期" :options='timeOptions'></DatePicker> -->
            <!-- <span class="pl20 pr5">结束日期</span> -->
            <DatePicker :disabled="disabled" type="date" class="w320x" v-model="addBlackListInfo.endTime" transfer placeholder="结束日期" :options='timeOptions2'></DatePicker>
          </FormItem>
          <FormItem label="备注信息">
            <Input
              type="textarea"
              class="w320x"
              v-model="addBlackListInfo.description"
              :rows="4"
              placeholder="请输入不超过20字备注信息"
              :maxlength="20"
            />
          </FormItem>
          <FormItem>
            <Button class=" ivu-btn newSubmit " type="primary" @click.prevent="submit">确认保存</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>

<script>
import Icons from "_c/icons";
import Tables from "_c/tables";
import Modals from "_c/modals";
import SiteSelect from "_c/site-select";
import { getUserType } from "@/libs/util";
import {
  siteManagementList,
  blackList,
  blackListCreate,
  blackListDelete
} from "@/api/system";
import { getAccessFromLocal } from "@/libs/util";
export default {
  name: "siteBlackList",
  components: {
    Icons,
    Tables,
    SiteSelect,
    Modals
  },
  data() {
    return {
      disabled:false,
      title:"添加区域黑名单",
      selectType:'1',
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      searchKey: { siteId: this.$root.nowSite.id,selectVal:'', },
      timeOptions: {
        disabledDate: date => date && date.valueOf() < new Date(this.$root.todayStartTime()).getTime()
      },
      timeOptions2: {
        disabledDate: date => date && date.valueOf() < new Date(this.$moment().add(1,'days').startOf('day')).getTime()
      },
      siteId: 0,
      siteName: "",
      checkedArr: [],
      addBlackListInfo: {
        type: "forever",
        ip: ""
      },
      rules: {
        ip: [
          {
            required: true,
            message: "请输入ip",
            trigger: "blur"
          },
          {
            // pattern: /^((((\d{1})|([1-9]\d{1})|(1\d{2})|(2[0-5]{2}))\.){3}((\d{1})|([1-9]\d{1})|(1\d{2})|(2[0-5]{2})),)*(((\d{1})|([1-9]\d{1})|(1\d{2})|(2[0-5]{2}))\.){3}((\d{1})|([1-9]\d{1})|(1\d{2})|(2[0-5]{2}))$/,
            pattern: /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/,
            message: '请输入正确的ip地址',
            trigger: 'blur'
          }
        ]
      },
      table: {
        total: 0,
        data: [],
        loading: true,
        pageSizeOpts: [20,30,40,50],
        columns: [
          {
            type: "selection",
            width: screen.width>1600?60:'',
            minWidth:screen.width < 1600 ?35:'',
            align: "center"
          },
          {
            title: "限制区域IP",
            key: "ip",
            align: "center",
            minWidth:screen.width < 1600 ?100:'',
          },
          {
            title: "备注信息",
            key: "description",
            align: "center",
            // tooltip:true,
            minWidth:screen.width < 1600 ?100:'',
            render:(h,params)=>{
              let newDescription=params.row.description?params.row.description.substring(0,15):'-';
              if(newDescription!='-'&&params.row.description.length>15)
              return(
                <Tooltip transfer maxLength="500" >
                  {newDescription+`...`}
                   <div slot="content"  style="white-space: normal">{params.row.description}</div>
                </Tooltip>
              )
              else{
                return(
                  <span> {this.$root.text(params.row.description)}</span>
                )
              }
            }
          },
          {
            title: "解封时间",
            key: "expire",
            align: "center",
            minWidth:screen.width < 1600 ?120:'',
            render: (h, params) => {
              if (params.row.expire == 0) {
                return <span>永久封禁</span>;
              } else {
                return <span>{params.row.expire ? this.$root.unixTime(params.row.expire) : "-"}</span>;
              }
            }
          },
          {
            title: "操作账号",
            key: "who",
            align: "center",
            minWidth:screen.width < 1600 ?75:'',
            render: (h, params) => (
              <span>{this.$root.text(params.row.who)}</span>
            )
          },
          {
            title: "添加时间",
            key: "created_at",
            align: "center",
            minWidth:screen.width < 1600 ?150:'',
            render: (h, params) => (
              <span class="pr20 pl20">
                {params.row.created_at ? this.$root.unixTime(params.row.created_at) : '-'}
              </span>
            )
          },
          {
            title: "操作",
            align: "center",
            minWidth:screen.width < 1600 ?35:'',
            render: (h, params) => {
              return (
               <div>
                <a class="mr10" onClick={()=>{ 
                  this.$refs.addBlackList.show();
                  this.title="编辑区域黑名单";
                  this.$refs.addBlackListInfo.resetFields();
                  this.disabled=true;
                  if(params.row.expire=='0'){
                      this.addBlackListInfo.type="forever";
                  }else{
                    this.addBlackListInfo.type="expire";
                    this.addBlackListInfo.endTime= this.$root.returnDayTime(params.row.expire);
                  }
                  this.addBlackListInfo.ip=params.row.ip;
                  this.addBlackListInfo.description=params.row.description;

                }}>编辑</a>
                <a
                  style={{
                    display:
                      this.adminType == "super" ||
                      this.authInPage.indexOf("blackListDelete") != -1
                        ? "inline-block"
                        : "none"
                  }}
                     onClick={() => {
                    this.onDelete(params);
                  }}
                >
                  删除
                </a>
                </div>
              );
            }
          }
        ]
      }
    };
  },
  watch: {
    "$root.nowSite": {
      handler(val, oldVal) {
        this.$nextTick(() => {
          const { id, siteName } = val;
          this.siteId = id;
          this.siteName = siteName;
          this.getData({ siteId: this.siteId });
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changeType(val){
      this.selectType=val;
      this.searchKey.selectVal='';
      
    },
    searchSubmit(){
      let data={...this.searchKey};
      data.selectType=this.selectType;
      if(data.selectType=='1'&&data.selectVal){
        if (!this.$root.checkIp(data.selectVal)) {
						this.$Tip.info({ content: "您所查询的IP不正确，请重新输入" });
						return false;
					}
      }
      if(data.selectType=='2'&&data.selectVal){
        let reg = /^[a-zA-Z0-9-_]{1,}$/;
        if(!reg.test(data.selectVal)){
          this.$Tip.info({
            content:'您输入操作账号不正确,请重新输入'
          
          })
          return false;
        }
      }

      for (let key in data){
            if(!data[key]) delete data[key];
          }
      this.getData(data);
    },
    onSelectionChange(selection) {
      this.checkedArr = selection;
    },
    // 获取黑名单列表
    getData(data) {
      this.$root.startTableLoading(this);
      blackList(data).then(res => {
        if (res != undefined && res.code == 200) {
          const { data, total } = res.data;
          this.table.data = data;
          this.table.total = total;
        }
        this.$root.endTableLoading()
      }).catch(error=>this.$root.endTableLoading());
    },
    addBlackList() {
      this.title="添加区域黑名单";
      this.$refs.addBlackListInfo.resetFields();
      this.addBlackListInfo.type = 'forever';
      this.disabled=false
      this.$refs.addBlackList.show();
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize
      this.getData(this.searchKey)
    },
    // 删除黑名单
    onDelete(params) {
      this.$Message.config({
        top: 50,
        duration: 1
      });
      this.$Tip.confirm({
        content: `您确定将${params.row.ip}从黑名单中删除吗？`,
        onOk: () => {
          let data = {
            siteId: this.siteId,
            ip: params.row.ip
          };
          blackListDelete(data, true).then(res => {
            if ( res != undefined && res.code == 200) {
              this.$Message.success("删除区域IP成功");
              this.table.data.splice(params.index, 1);
              this.table.total--;
              this.checkedArr = []
            }
          });
        }
      });
    },
    batchReduce() {
      this.$Message.config({
        top: 50,
        duration: 1
      });
      let arr = [];
      this.checkedArr.forEach(item => arr.push(item.ip));
      let data = { siteId: this.siteId, ip: String(arr) };
      this.$Tip.confirm({
        content: "您确定删除选中区域IP吗？",
        onOk: () => {
          blackListDelete(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success("删除区域IP成功");
              this.getData({ siteId: this.siteId });
              this.checkedArr = []
            }
          });
        }
      });
    },
    submit() {
       this.$Message.config({
        top: 50,
        duration: 1
      });
      this.$refs.addBlackListInfo.validate(valid => {
        if (valid) {
          let data = {
            ...this.addBlackListInfo,
            siteId: this.siteId,
            siteName: this.siteName
          };
      
       
          let { startTime, endTime } = data;
       
          this.$refs.addBlackList.spinShow();
          if (endTime) {
            data.expire = this.$moment(endTime).format("X");
            delete data.endTime;
          }
          if (data.type == "expire") {
            if (!data.expire) {
              this.$Tip.info({ content: "请选择时间" });
              this.$refs.addBlackList.spinHide();
              return false;
            }
          }
          for (let key in data){
            if(!data[key]) delete data[key];
          }
          blackListCreate(data, true)
            .then(res => {
              this.$refs.addBlackList.spinHide();
              if (res != undefined && res.code == 200) {
                if(this.title=='添加区域黑名单'){
                  this.$Message.success('添加区域IP成功')
                }else{
                  this.$Message.success('编辑区域IP成功')
                }
                
                this.$refs.addBlackList.hide();
                this.getData({ siteId: this.siteId });
              }
            })
            .catch(error => {
              this.$refs.addBlackList.spinHide();
            });
          
        }
      });
    },
    onPageChange(page) {
      let data = { siteId: this.$root.nowSite.id, page };
      this.getData(data);
    },
    resetFieldBlack (flag) {
      if (!flag) {
        for (let val in this.addBlackListInfo) {
          this.addBlackListInfo[val] = undefined
          this.disabled=false;
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
@import "../../../styles/class.less";

.w320x {
/deep/textarea.ivu-input {
    max-height: 400px;
  }
}

/deep/.ivu-table .ivu-table-tip{
  height: auto !important;
    td{
      height: 48px;
    }
}
</style>

