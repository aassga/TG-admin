<template>
  <div>
    <Form class="v2-search" ref="searchKey"  inline>
      <FormItem>
      <div class="v2-button mb10">
        <Button
          @click="batchReduce"
          v-show="checkedArr.length > 0"
          v-if="(adminType == 'super') || (authInPage.indexOf('whiteListDelete') != -1)"
        >删除选中</Button>
        <Button
          @click="addBlackList"
          v-if="(adminType == 'super') || (authInPage.indexOf('whiteListCreate') != -1)"
        >添加白名单</Button>
      </div>
    </FormItem>
    <FormItem >
      <Select v-model="selectType" class="s-120" @on-change="changeType">
        <Option value="1">白名单区域IP</Option>
        <Option value="2">操作账号</Option>
      </Select>
    </FormItem>
    <FormItem>
      <Input  v-model="searchKey.selectVal" class="s-120" placeholder="请输入内容"/>
    </FormItem>
    <FormItem><Button type="primary" @click="searchSubmit">查询</Button></FormItem>
      <div class="v2-table">
        <Tables
          :loading="$root.tableLoading"
          :value="table.data"
          :columns="table.columns"
          :total="table.total"
          :pageSizeOpts="table.pageSizeOpts"
          @on-selection-change="onSelectionChange"
          @on-page-change="onPageChange"
          @on-delete="onDelete"
          @on-page-size-change='onPageSizeChange'
        ></Tables>
      </div>
    </Form>
    <Modals :title="this.title" :width="620" ref="addBlackList">
      <div slot="content">
        <Form :label-width="160" ref="addBlackListInfo" :model="addBlackListInfo" :rules="rules">
          <FormItem label="白名单区域IP" prop="ip">
            <Input  :disabled="disabled" v-model="addBlackListInfo.ip" class="w320x" placeholder="请输入IP地址"/>
          </FormItem>
          <FormItem label="备注信息">
            <Input
              type="textarea"
              class="w320x max"
              v-model="addBlackListInfo.description"
              :autosize="{minRows: 2, maxRows: 4}"
              :maxlength='20'
              placeholder="请输入不超过20字备注信息"
            />
          </FormItem>
          <!-- <FormItem>
            <Button class="ivu-btn  newSubmit" type="primary" @click.prevent="submit">确认添加</Button>
          </FormItem> -->
        </Form>
        <div> <Button style="margin-left:160px" class="mb20 txt-a ivu-btn newSubmit" type="primary" @click.prevent="submit">确认添加</Button></div>
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
  whiteList,
  whiteListCreate,
  whiteListDelete,
  whiteListUp
} from "@/api/system";
export default {
  name: "whiteList",
  components: {
    Icons,
    Tables,
    SiteSelect,
    Modals
  },
  data() {
    return {
      disabled:false,
      title:"添加区域白名单",
      limit: 20,
      selectType:'1',
      searchKey: { siteId: this.$root.nowSite.id ,selectVal:''},
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      id:'',
      siteId: 0,
      siteName: "",
      checkedArr: [],
      addBlackListInfo: {
        ip: "",
        description: ''
      },
      rules: {
        ip: [
          {
            required: true,
            message: "请输入IP地址",
            trigger: "blur"
          },
          {
            pattern: /(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/,
            message: '请输入正确的IP地址',
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
            width: 60,
            align: "center",
          },
          {
            title: "白名单区域IP",
            key: "ip",
            align: "center",
            minWidth:120,
          },
          {
            title: "备注信息",
            key: "description",
            align: "center",
            minWidth:100,
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
            title: "操作账号",
            key: "created_by",
            align: "center",
            minWidth:75,
            render: (h, params) => (
              <span>{this.$root.text(params.row.created_by)}</span>
            )
          },
          {
            title: "添加时间",
            key: "created_at",
            align: "center",
            minWidth:150,
            render: (h, params) => (
              <span class="pr20 pl20">
                {this.$root.unixTime(params.row.created_at)}
              </span>
            )
          },
          {
            title: "操作",
            align: "center",
            minWidth:35,
            render: (h, params) => {
              return (
                <div>
                  <a class="mr10" onClick={()=>{ 
           
                    this.id=params.row.id;
                    this.$refs.addBlackListInfo.resetFields();
                  this.$refs.addBlackList.show();
                  this.title="编辑区域白名单";
                  this.disabled=true;
                  this.addBlackListInfo.ip=params.row.ip;
                  this.addBlackListInfo.description=params.row.description;

                }}>编辑</a>
                  <a
                  style={{
                    display:
                      this.adminType == "super" ||
                      this.authInPage.indexOf("whiteListDelete") != -1
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
    onPageSizeChange(pageSize) {
      this.limit = pageSize
      this.getData({ siteId: this.$root.nowSite.id, limit: pageSize })
    },
    // 获取黑名单列表
    getData(data) {
      this.$root.startTableLoading(this);
      whiteList(data).then(res => {
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
      this.addBlackListInfo = {
        ip: '',
        description: ''
      }
      this.disabled=false
      this.$refs.addBlackList.show();
    },
    // 删除黑名单
    onDelete(params) {
      this.$Message.config({
        top: 50,
        duration: 1
      });
      this.$Tip.confirm({
        content: `您确定将${params.row.ip}从白名单中删除吗？`,
        onOk: () => {
          let data = {
            siteId: this.siteId,
            id: params.row.id
          };
          whiteListDelete(data, true).then(res => {
            if (res != undefined && res.code == 200) {
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
      this.checkedArr.forEach(item => arr.push(item.id));
      let data = { siteId: this.siteId, id: String(arr) };
      this.$Tip.confirm({
        content: "您确定删除选中区域IP吗？",
        onOk: () => {
          whiteListDelete(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success("删除区域IP成功");
              this.getData({ siteId: this.siteId });
              this.checkedArr = []
            }
          })
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
          let data 
          this.$refs.addBlackList.spinShow();
          console.log(this.title)
          if(this.title=="编辑区域白名单"){
            data= {
            ...this.addBlackListInfo,
            id:this.id,
            siteId:this.$root.nowSite.id,
          };
           for (let key  in  data){
             if(!data[key]) delete data[key];
           }
          this.$refs.addBlackList.spinHide();
            whiteListUp(data,true).then(res=>{
              if(res!=undefined&&res.code==200){
                this.$Message.success('编辑区域IP成功')
                  this.$refs.addBlackList.hide();
                  this.getData({ siteId: this.siteId });
              }
            }).catch(error => {
                this.$refs.addBlackList.spinHide();
              });
          }else{
            // console.log(33223)
           data= {
            ...this.addBlackListInfo,
            siteId: this.siteId,
            siteName: this.siteName
          };

          for (let key  in  data){
             if(!data[key]) delete data[key];
           }
            whiteListCreate(data, true)
              .then(res => {
                this.$refs.addBlackList.spinHide();
                if (res != undefined && res.code == 200) {
                  if(res.data.code==400){
              
                         this.$Tip.info({content:res.data.message})
                  }else{
                       this.$Message.success('添加区域IP成功')
                        this.$refs.addBlackList.hide();
                        this.getData({ siteId: this.siteId });
                  }
                
                }
              })
              .catch(error => {
                this.$refs.addBlackList.spinHide();
              });
          }
          
        }
      });
    },
    onPageChange(page) {
      let data = { siteId: this.$root.nowSite.id, page, limit: this.limit };
      this.getData(data);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
@import "../../../styles/class.less";
/deep/.ivu-form-item-error-tip{
  width: 400px;
}
.max {
  max-height: 93px;
}

/deep/.ivu-table .ivu-table-tip{
  height: auto !important;
    td{
      height: 48px;
    }
}
</style>

