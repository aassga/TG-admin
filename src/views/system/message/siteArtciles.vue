<template>
  <div>
    <div class="v2-button" style="height:38px">
      <Button @click="addArtciles()"
        v-if="(adminType == 'super') || (authInPage.indexOf('articleIns') != -1)"
      ><Icons type="xinzeng" size="14" class="mr5"/>新增文章</Button>
    </div>
    <Tables
      :page="table.page"
      :loading="$root.tableLoading"
      :value="table.data"
      :columns="table.columns"
      :total="table.total"
      :showSizer="true"
      @on-delete="del"
      @on-edit="edit"
      @on-change-status="onChangeStatus"
      @on-page-change="onPageChange"
      @on-page-size-change="onPageSizeChange"
    ></Tables>
  </div>
</template>
<script>
import { articleList, articleStatusChange, articleDel } from "@/api/system";
import { borrowDataO } from "@/api/data";
import Modals from "@/components/modals";
import { getUserType } from '@/libs/util';
import Tables from "_c/tables";
import Icons from "@/components/icons";
export default {
  name: "siteArtciles",
  components: {
    Tables,
    Modals,
    Icons
  },
  data() {
    return {
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      typeList: [{ value: "1", name: "正常" }, { value: "2", name: "停用" }],
      Time: [],
      table: {
        total: 0,
        more: true,
        page: true,
        loading: true,
        columns: [
          {
            title: "标题",
            key: "title",
            align: "center",
            minWidth:95,
            tooltip:true,
          },
          {
            title: "客户端",
            key: "client_type",
            align: "center",
            minWidth:120,
          },
          {
            title: "发布人",
            key: "who",
            align: "center",
            minWidth:95,
            tooltip:true,
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            minWidth:40,
            render: (h, params) => {
              const { status } = params.row;
              return (
                <span
                  style={{
                    color: status === "yes" ? "#444" : "#FF2626"
                  }}
                >
                  {status === "yes" ? "正常" : "停用"}
                </span>
              );
            }
          },
          {
            title: "操作",
            align: "center",
            minWidth:120,
            render: (h,params) => (
              <div>
                <a class="ib mr10"
                  onClick={() => {this.onChangeStatus(params)}}
                  style={{
                    display: (this.adminType == 'super') || (this.authInPage.indexOf('articleStatusChange') != -1) ? 'inline-block' : 'none'
                  }}
                >{params.row.status == 'yes' ? '停用' : '正常'}</a>
                <a class="ib mr10"
                  onClick={() => {this.edit(params)}}
                  style={{
                    display: (this.adminType == 'super') || (this.authInPage.indexOf('articleUpt') != -1) ? 'inline-block' : 'none'
                  }}
                >编辑</a>
                <a class="ib mr10"
                  onClick={() => {this.del(params)}}
                  style={{
                    display: (this.adminType == 'super') || (this.authInPage.indexOf('articleDel') != -1) ? 'inline-block' : 'none'
                  }}
                >删除</a>
              </div>
            )
          }
        ],
        data: []
      }
    };
  },
  mounted() {
    const params = { siteId: this.$root.nowSite.id, type: "article" };
    this.getData({params});
    this.$Message.config({
      top: 50,
      duration: 1
    })
  },
  methods: {
    getData(data) {
       this.$root.startTableLoading();
      articleList(data).then(res => {
        if (res != undefined && res.code == 200) {
          let {data,total} =res.data
        this.table.data = data;
        this.table.total=total
        }
        this.$root.endTableLoading()
      }).catch(error=>this.$root.endTableLoading());
    },
    edit(params) {
      this.$router.push({
        name: "addArtciles",
        params: { page: "edit" },
        query: { id: params.row.id }
      });
    },
    addArtciles() {
      this.$router.push({
        name: "addArtciles",
        params: { page: "create" }
      });
    },
    onChangeStatus(params) {
      let text, msg;
      const { status, id } = params.row;
      if (status === "yes") {
        text = `您确定停用吗？`;
        msg = `停用状态成功`;
      }
      if (status === "no") {
        text = `您确定启用吗？`;
        msg = `启用状态成功`;
      }
      const data = {
        siteId: this.$root.nowSite.id,
        id,
        status: status === "yes" ? "no" : "yes"
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          articleStatusChange(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success(res.data)
              params.row.status = status === "yes" ? "no" : "yes";
            }
          });
        }
      });
    },
    del(params) {
      let msg = "删除成功";
      let text = "您确定要删除" + params.row.title + "吗？";
      const data = {
        siteId: this.$root.nowSite.id,
        id: params.row.id
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          articleDel(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success(res.data)
              this.table.data.splice(params.index, 1);
            }
          });
        }
      });
    },
    onPageChange(page){
      this.total = 0
      let data = {siteId:this.$root.nowSite.id,type:"article"}
      this.getData({params:data,query: { page}});
    },
    onPageSizeChange(pageSize){
      let data = {siteId:this.$root.nowSite.id,type:"article"}
      data.limit=pageSize
      this.getData({params:data})
    }
  }
};
</script>
<style scoped lang="less">
@import "../../../styles/button.less";
/deep/.ivu-form-item-content{width:270px;}
/deep/.ivu-table-header{
  font-size: 1rem;
  font-weight:normal;
  .ivu-table-cell{
    font-weight: 549;
  }
}
/deep/.ivu-table {
  color:#444;
}
</style>


