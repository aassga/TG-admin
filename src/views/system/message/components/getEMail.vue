<template>
  <div>
    <Tables
      :page="false"
      :loading="$root.tableLoading"
      :value="table.data"
      :columns="table.columns"
      @on-details="onDetails"
      @on-delete="del"
      @on-reply="reply"
      @on-selection-change="onSelectionChange"
    ></Tables>
    <!-- <Modals ref="Modals"   title="收件箱回复" width="620">
      <div slot="content" class="modal-overflow" style="width:620px">
        <Form ref="formKey" :model="formKey" :rules="rules"  :label-width="180">
          <FormItem label="回复标题" prop="title" >
            <Input class="w290x"  v-model="formKey.title"/>
          </FormItem>
          <FormItem label="回复内容" prop="content" >
            <Input class="w290x" v-model="formKey.content" type="textarea" placeholder="请输入内容(150字内)" :rows="4"/>
          </FormItem>
          <FormItem inline>
            <Button class="ivu-btn send-close ft20" @click="close()">取消</Button>
            <Button class="ivu-btn send ft20 fr "  style="margin-left:50px"  @click="send()">发送</Button>
          </FormItem> 
        </Form>
      </div>
    </Modals> -->
    <Modals ref="ModalsMessage" title="充值信息" width="480">
      <div slot="content" class="modal-overflow" style="width:480px">
        <Form ref="formKey" :label-width="180">
          <FormItem>
            <div>{{content}}</div>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "_c/tables";
import tableMixins from "@/mixins/table";
import { inBox,letterDetail,letterDel,sendBox} from "@/api/system";
import Modals from "@/components/modals";
import { getUserType } from '@/libs/util'
import { parse } from "path";
export default {
  mixins: [tableMixins],
  name: "getEMail",
  components: {
    Tables,
    Modals
  },
  data() {
    return {
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      formKey:{},
       rules: {
          title: [
          {
            required: true,
            message: "请输入回复标题",
            trigger: "blur"
          }
        ],
        content: [
          {
            required: true,
            message: "请输入回复内容",
            trigger: "blur"
          }
        ],
      },
      table: {
        loading: true,
        columns: [
          {
            type: "selection",
            title: "全选",
            width: 60,
            align: "center"
          },
          {
            title: "发件人",
            key: "send_username",
            align: "center"
          },
          {
            title: "标题",
            key: "title",
            align: "center"
          },
          {
            title: "内容",
            key: "content",
            align: "center"
          },
          {
            title: "收取时间",
            key: "created_at",
            align: "center",
            render: (h, params) => {
              return <span>{this.$root.unixTime(params.row.created_at)}</span>;
            }
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            render: (h, params) => {
              let color = params.row.status === "success" ? "" : "#FF2626FF";
              return (
                <span style={{ color }}>
                  {params.row.status === "success" ? "已读" : "未读"}
                </span>
              );
            }
          },
          {
            title: "操作",
            align: "center",
            render: (h,params) => {
              return(
                <div>
                  <a class="ib mr10"
                    style={{
                      display: (this.admingType == 'super') || (this.authInPage.indexOf('letterReply') != -1) ? 'inline-block' : 'none'
                    }}
                    onClick={() => {this.reply(params)}}
                  >回复</a>
                  <a class="ib mr10"
                    onClick={() => {this.onDetails(params)}}
                  >详情</a>
                  <a class="ib mr10"
                    onClick={() => {this.del(params)}}
                  >删除</a>
                </div>
              )
            }
          }
        ],
        data: []
      },
      content:"",
      selectstatus:[]
    };
  },
  methods: {
    getData(data) {
      inBox(data).then(res => {
        this.table.data = res.data.data;
      });
    },
    send() {
      this.$refs.Modals.hide();
    },
    close() {
      this.$refs.Modals.hide();
    },
    del(params) {
      const {siteId,id} =params.row
      if(this.selectstatus.length>0){
           this.selectstatus.map(item=>{
               if(item.id==params.row.id){
                 this.$Tip.confirm({
                   content: "你确定要是删除我吗",
                   onOk: () => {
                     letterDel({siteId,ids:id}).then(res=>{
                        if(res != undefined && res.code == 200) this.table.data.splice(params.index, 1);
                     })    
                   }
                 });   
               }else{
                   this.$Message.success("请先选中");
               }
           })
      }else{
           this.$Message.success("请先选中");
      }
    },
    onDetails(params) {
       const {siteId,id} =params.row
       if(this.selectstatus.length>0){
         this.selectstatus.map(item=>{
               if(item.id==params.row.id){
                 letterDetail({siteId,id}).then(res=>{
                       this.$refs.ModalsMessage.show();
                       this.content=res.data.content
                 })    
               }else{
                   this.$Message.success("请先选中");
               }
         })
       }else{
           this.$Message.success("请先选中");
       }
     
    },
    onSelectionChange(res){
         this.selectstatus=[]
         this.selectstatus=res
    },
    // 回复
    reply(params) {
      if(this.selectstatus.length>0){
           this.selectstatus.map(item=>{
               if(item.id==params.row.id){
                    this.$refs.Modals.show();
               }else{
                   this.$Message.success("请先选中");
               }
           })
       }else{
         this.$Message.success("请先选中");
       }
      
    }
  }
};
</script>
<style scoped lang="less">
@import "../../../../styles/button.less";
</style>