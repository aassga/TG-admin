<template>
  <div>
    <Tables
      :page="false"
      :loading="$root.tableLoading"
      :value="table.data"
      :columns="table.columns"
      @on-delete="del"
      @on-details="onDetails"
      @on-selection-change="onSelectionChange"
    ></Tables>
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
import {sendBox,letterDetail,letterDel} from "@/api/system";
import Modals from "@/components/modals";
import { getUserType } from '@/libs/util';
export default {
  mixins: [tableMixins],
  name: "sendEMail",
  components:{
    Tables,
    Modals
  },
  data() {
    return {adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      table:{
        loading:true,
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
            title: "收件人",
            key: "to_username",
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
            title: "发送时间",
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
            key: "handle",
            align: "center",
            options: ["details", "delete"]
          }
        ],
        data:[]
      },
      selectstatus:[]
    };
  },
  methods:{
    getData(data) {
      sendBox(data).then(res => {
        this.table.data = res.data.data;
      });
    },
    del(params){
      const {siteId,id} =params.row
      if(this.selectstatus.length>0){
           this.selectstatus.map(item=>{
               if(item.id==params.row.id){
                 this.$Tip.confirm({
                   content: "你确定要是删除我吗",
                   onOk: () => {
                     letterDel({siteId,ids:id}).then(res=>{
                       if(res != undefined && res.code == 200) this.table.data.splice(params.index, 1)
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
    onDetails(){
          const {siteId,id} =params.row
           letterDetail({siteId,id}).then(res=>{
                       this.$refs.ModalsMessage.show();
                       this.content=res.data.content
              })    
    },
    onSelectionChange(res){
          this.selectstatus=[]
          this.selectstatus=res
    }

  }
};
</script>