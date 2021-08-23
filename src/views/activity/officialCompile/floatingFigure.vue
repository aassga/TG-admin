<template>
  <div>
    <div class="v2-button mb10">
      <Button
        @click="addFuDong"
        v-if="flag&&((adminType == 'super') || (authInPage.indexOf('floatImgAdd') != -1))"
      >新增浮动图</Button>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :draggable="true"
        @on-edit="onEdit"
        @on-drag-drop="onDragDrop"
        :page="false"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from "_c/tables";
import tableMixins from "@/mixins/table";
import { getUserType } from "@/libs/util";
import {
  floatImgList,
  floatImgStatusChange,
  floatImgDel,
  floatImgDrag,
  floatImgEdit
} from "@/api/activity";
import Icons from "_c/icons";
export default {
  name: "floatImgList",
  components: {
    Tables,
    Icons
  },
  data() {
    return {
      flag:false,
      statusList: [],
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      table: {
        data: [],
        total: 0,
        loading: true,
        pageSizeOpts: [20, 30, 40],
        columns: [
          {
            title: "排序",
            align: "center",
            width: 70,
            render: (h, params) => {
              // let that = this
              return h(Icons, {
                props: {
                  type: "paixukongjian",
                  color: "#dadada",
                  size: 20
                }
              });
            }
          },
          {
            title: "浮动标题",
            key: "title",
            align: "center",
            minWidth: 100,
            tooltip: true,
            className: "pl5 pr5"
          },
          // {
          //   title: "显示页面",
          //   key: "show_page",
          //   align: "center",
          //   minWidth: 100,
          //   className: "pl5 pr5",
          //   render: (h, params) => {
          //     let arr = params.row.show_page.split(",");
          //     arr = arr.sort(function(a, b) {
          //       return a - b;
          //     });
          //     let str2 = arr.join(",");
          //     let str = str2
          //       .replace("1", "首页")
          //       .replace("2", "游戏页")
          //       .replace("3", "文案页")
          //       .replace("4", "优惠页");
          //     return <span>{str}</span>;
          //   }
          // },
          {
            title: "浮动位置",
            key: "show_location",
            align: "center",
            minWidth: 60,
            render: (h, params) => {
              return (
                <span>
                  {params.row.show_location == "left" ? "左侧" : "右侧"}
                </span>
              );
            }
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            minWidth: 30,
            render: (h, params) => {
              const statu = params.row.status == "yes" ? true : false;
              if (
                this.adminType == "super" ||
                this.authInPage.indexOf("floatImgStatusChange")
              ) {
                return h("i-switch", {
                  props: {
                    value: statu,
                    size: "large",
                    loading: this.statusList[params.index]
                  },
                  scopedSlots: {
                    open: () => h("span", "开启"),
                    close: () => h("span", "停用")
                  },
                  style: {
                    display:
                      this.adminType == "super" ||
                      this.authInPage.indexOf("floatImgStatusChange") != -1
                        ? "inline-block"
                        : "none"
                  },
                  on: {
                    "on-change": value => {
                      this.$set(this.statusList, params.index, true);
                      this.switch(params.row);
                    }
                  }
                });
              } else {
                return <span>{statu ? '开启' : '关闭'}</span>
              }
            }
          },
          {
            title: "操作",
            align: "center",
            minWidth: 80,
            className: "pl5 pr5",
            render: (h, params) => {
              return (
                <div>
                  <a
                    class="ib mr10"
                    style={{
                      display:
                        this.adminType == "super" ||
                        this.authInPage.indexOf("floatImgEdit") != -1
                          ? "inline-block"
                          : "none"
                    }}
                    onClick={() => {
                      this.onEdit(params);
                    }}
                  >
                    编辑
                  </a>
                  <a
                    class="ib"
                    style={{
                      display:
                        this.adminType == "super" ||
                        this.authInPage.indexOf("floatImgDel") != -1
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
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$root.startTableLoading()
      floatImgList({ siteId: this.$root.nowSite.id }).then(res => {      
        if (res != undefined && res.code == 200) {
          this.table.data = res.data;
          this.table.total = res.total;
          let str="",arr=[],str2="",arr2=[],left=false,right=false;
          this.table.data.map(item=>{
            if(item.show_location=='left'){
              str += item.show_page;
              
            }else{
              str2 += item.show_page;
            }
          })
          arr=str.split("");
           
            if(arr.includes('1')&&arr.includes('2')&&arr.includes('3')){
              left = true;
            }
          arr2=str2.split('');
            if(arr2.includes('1')&&arr2.includes('2')&&arr2.includes('3')){
              right = true
            }
          if(left&&right){
            this.flag=false
          }else{
            this.flag=true;
          }
        }
        this.$root.endTableLoading()
      }).catch(error => this.$root.endTableLoading())
    },
    onEdit(params) {
      this.$router.push({
        name: "addFuDong",
        params: { page: "edit" },
        query: { id: params.row.id, siteId: this.$root.nowSite.id }
      });
    },
    addFuDong() {
      this.$router.push({
        name: "addFuDong",
        params: { page: "create" }
      });
    },
    //删除事件
    onDelete(params) {
      this.$Tip.confirm({
        content: `您确定删除${params.row.title}吗？`,
        onOk: () => {
          let data = {
            id: params.row.id,
            siteId: this.$root.nowSite.id
          };
          floatImgDel(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success({ content: "浮动图删除成功" });
              // this.getall();
              this.getData({ params: this.searchKey });
            }
          });
        }
      });
    },
    //状态切换
    switch(index) {
      const { siteId, id, status ,show_location} = index;
      const data = { siteId, id, status: status == "yes" ? "no" : "yes" ,show_location};
      floatImgStatusChange(data, true).then(res => {
        if (res != undefined && res.code == 200) {
          this.$Message.success("启用状态成功");
          this.$set(this.statusList, index._index, false);
          this.getData({ params: this.searchKey });
        }else{
          return false
        }
      });
    },
    onDragDrop(oldIndex, newIndex) {
      const params = {
        id: this.$refs.table.insideTableData[oldIndex].id,
        siteId: this.$root.nowSite.id,
        oldIndex: this.$refs.table.insideTableData[oldIndex].sort,
        newIndex: this.$refs.table.insideTableData[newIndex].sort
      };
      if (
        this.adminType == "super" ||
        this.authInPage.indexOf("floatImgDrag") != -1
      ) {
        floatImgDrag(params, true).then(res => {
          if (res != undefined && res.code === 200) {
            this.$Message.success({ content: "排序更新成功" });
            this.getData();
          }
        });
      } else {
        this.$Tip.info({ content: "对不起，您暂时没有此权限" });
      }
    }
  }
};
</script>
<style lang="less">
</style>


