<template>
  <div>
    <div class="v2-search clearfix mb10">
      <Form inline>
        <div class="fl">
          <Button
            class="cardNutton activity-btn pl20 pr20 fontColor"
            style="line-height:36px"
            @click="addActivity"
            v-if="(adminType == 'super') || (authInPage.indexOf('activityIns') != -1)"
          >
            新增活动
          </Button>
        </div>
        <div class="fl">
          <Button
            class="cardNutton fr ml20 activity-btn bc-c1 w100x fontColor"
            @click="selectWay('mobile')"
            :class="searchKey.client_type==='mobile'?'active':''"
          >移动端</Button>
          <Button
            class="cardNutton fr ml20 activity-btn bc-c1 w100x fontColor"
            @click="selectWay('pc')"
            :class="searchKey.client_type==='pc'?'active':''"
          >PC</Button>
          <Button
            class="cardNutton fr ml20 activity-btn bc-c1 w100x fontColor"
            @click="selectWay('')"
            style="line-height:36px"
            :class="searchKey.client_type===''?'active':''"
          >全部</Button>
        </div>
      </Form>
    </div>
    <div class="v2-search bb mb20 pt5">
      <ButtonGroup class="repay-button">
        <Button class="fontColor"   @click="getall()" :class="currentBtn == 'all' ? 'active' : 'noactive'">
          全部
        </Button>
        <Button
          class="fontColor"
          @dblclick.native="modifyActivityCate(item, index)"
          @click="gettable(item,index)"
          :class="currentBtn == index ? 'active text-overflow-ellipsis' : 'noactive text-overflow-ellipsis'"
          v-for="(item,index) in buttonlist"
          :key="index"
          draggable
          @dragstart.native="menuItemDrag(index)"
          @dragover.native="menuItemOver"
          @drop.native="menuItemDrop($event, index)"
          @dragend.native="menuItemDragEnd"
        >
          {{item.activity_cate_name}}
          <i
            v-if="(adminType == 'super') || (authInPage.indexOf('activityCateDel') != -1)"
            class="ivu-icon ivu-icon-ios-close"
            @click.stop="delactity(item)"
          ></i>
        </Button>

        <span class="addfenlei" @click="addfenlei" v-if="(adminType == 'super') || (authInPage.indexOf('activityCateIns') != -1)">+</span>
      </ButtonGroup>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :draggable="true"
        @on-edit="onEdit"
        @on-details="onDetails"
        @on-preview="preview"
        @on-delete="onDelete"
        @on-drag-drop="onDragDrop"
        :page="false"
      ></Tables>
      <!--
        :columns="table.columns"
        @on-change-status="onStatusChange"
        @on-page-size-change="onPageSizeChange"
        @on-page-change="onPageChange"
      -->
      <Modals ref="ModalsDetial" title="预览地址" :width="previewlist.activity_type==='url_activity'?'760px':'895px'">
        <div slot="content" class="modal-overflow" style="width:760px" v-if="previewlist.activity_type==='url_activity'">
          <Form ref="formKey" :label-width="230">
            <FormItem label="预览地址：" class="address_item">
              <input v-model="previewlist.url_link.pc" disabled>
              <Button v-clipboard:copy="previewlist.url_link.pc" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>
            </FormItem>
            <FormItem label="有效时间：">
              <span>{{$root.unixTime(previewlist.online_time)}}</span>
              <span>(预览只限20分钟之内有效)</span>
            </FormItem>
            <FormItem label="预览方式：">打开网页后，粘贴网址打开即可预览</FormItem>
          </Form>
        </div>
        <div slot="content" class="modal-overflow" style="width:auto;font-size:1rem;color:#000;margin:8px;font-family:sans-sefiry" v-else-if="previewlist.activity_type==='normal_activity'">
          <div v-html="previewlist.description.pc" v-if="previewlist.desc_type==='text'"></div>
          <img :src="previewlist.descriptionShow.pc" v-else>
        </div>
      </Modals>
    </div>
    <Modals ref="addfenleiModal" :title="updActivity===''?'新增分类':'修改分类'" width="500px" @modalVisible="initActivityStatus">
      <div slot="content" class="modal-overflow" style="width:500px">
        <Form
          ref="memberLevelForm"
          :rules="addActivityRules"
          :label-width="150"
          :model="memberLevelForm"
        >
          <FormItem label="分类名称" prop="fenleiName">
            <Input placeholder="请输入分类名称" class="w260x" v-model="memberLevelForm.fenleiName"/>
          </FormItem>
          <Button class="ivu-btn addSave mt40" @click.prevent="updActivity===''?addsave():updActivityCate()" :loading='$root.editBtnLoading'>{{updActivity===''?'确认添加':'确认修改'}}</Button>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "_c/tables";
import tableMixins from "@/mixins/table";
import Icons from "_c/icons";
import Modals from "@/components/modals";
import { getUserType } from "@/libs/util";
import {
  activityList,
  activityCateList,
  activityCateIns,
  activityDel,
  activityCateDel,
  activityDetail,
  activityBySort,
  activityChangeStatus,
  activityCateUpt,
  activityCateBySort
} from "@/api/system";
export default {
  // name: "activeList",
  mixins: [tableMixins],
  components: {
    Tables,
    Icons,
    Modals
  },
  data() {
    return {
      index: null, //更新分类时点击的下标
      statusList: [],
      flag: false,
      index: null,
      updActivity: '',
      timer: -1,
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      id: "",
      canDrag: false,
      searchKey: {
        siteId: this.$root.nowSite.id,
        client_type: "",
        activity_cate_id: ""
      },
      previewlist: "",
      currentBtn: "all",
      buttonlist: [],
      addActivityRules: {
        fenleiName: [ { required: true, message: "请输入分类名称", trigger: "blur" } ]
      },
      memberLevelForm: {
        fenleiName: ""
      },
      table: {
        total: 0,
        data: [],
        loading: true,
        pageSizeOpts: [20, 30, 40],
        columns: [
          {
            title: "排序",
            align: "center",
            width:70,
            render: (h, params) => {
              // let that = this
              return h(Icons, {
                props: {
                  type: "paixukongjian",
                  color: "#dadada",
                  size: 20
                },
                // 拖拽特效
                // nativeOn: {
                //   mousedown() {
                //     that.index = params.index
                //   },
                //   dragenter() {
                //     if (that.index !== null)
                //     that.table.data.splice(params.index, 0, ...that.table.data.splice(that.index, 1))
                //   }
                // }
              });
            }
          },
          {
            title: "活动标题",
            key: "title",
            align: "center",
            minWidth:100,
            tooltip:true,
            className:'pl5 pr5'
          },
          {
            title: "下架时间",
            key: "offline_time",
            align: "center",
            minWidth:120,
            render: (h, params) => {
              return (<span>{params.row.activity_date_type==='custom'?this.$root.unixTime(params.row.offline_time):'永久上架'}</span>)
            }
          },
          {
            title: "发布人",
            key: "adminName",
            align: "center",
            minWidth:95,
          },
          {
            title: "状态",
            key: "",
            align: "center",
            minWidth:65,
            render: (h, params) => {
              const statu = params.row.status == "yes" ? true : false;
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
                  display: this.adminType == 'super' || this.authInPage.indexOf('activityChangeStatus') != -1 ? 'inline-block' : 'none'
                },
                on: {
                  "on-change": value => {
                    this.$set(this.statusList, params.index, true)
                    this.switch(params.row)
                  }
                }
              });
            }
          },
          {
            title: "终端",
            key: "client_type",
            align: "center",
            minWidth:140,
            render: (h, params) => {
              let { client_type } = params.row
              if (client_type.includes(',')) {
                   return (
                  <table style={{ width: "100%" }}>
                    <th
                      style={{
                        width: "50%",
                        textAlign: "center",
                        background: "none",
                        borderBottom: "none",
                        fontWeight: "normal"
                      }}
                    >
                      <div>
                        <Icons type="zhongduan-PC" color="#C5C5C5" />
                        <span class="ml10 fontColor" style="font-weight: normal">
                          PC
                        </span>
                      </div>
                    </th>
                    <th
                      style={{
                        width: "50%",
                        textAlign: "center",
                        background: "none",
                        borderBottom: "none",
                        borderRight: "none",
                        fontWeight: "normal"
                      }}
                    >
                      <div>
                        <Icons type="zhongduan-shouji" color="#C5C5C5" />
                        <span class="ml10 fontColor" style="font-weight: normal">
                          手机
                        </span>
                      </div>
                    </th>
                  </table>
                );
              } else {
                return h('div',[
                  h(Icons, {
                    props: {
                      type: `zhongduan-${client_type == 'pc' ? 'PC' : 'shouji'}`,
                      color: '#C5C5C5'
                    }
                  }),
                  h('span',{
                    class: 'ml10 f-color'
                  }, client_type == 'pc' ? 'PC' : '手机')
                ])
              }
            }
          },
          {
            title: "操作",
            align: "center",
            minWidth:100,
            render: (h, params) => {
              return (
                <div>
                  <a
                    class="ib mr10"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('activityDetail') != -1) ? 'inline-block' : 'none'
                    }}
                    onClick={() => {
                      // this.preview(params);
                      if (!params.row.domain) {
                        this.$Tip.confirm({ content: "暂未开放域名"})
                      } else {
                        window.open(`${params.row.domain}#/home/youhui?preview=1`)
                      }
                    }}
                  >
                    预览
                  </a>
                  <a
                    class="ib mr10"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('activityUpt') != -1) ? 'inline-block' : "none"
                    }}
                    onClick={() => {
                      this.onEdit(params);
                    }}
                  >
                    编辑
                  </a>
                  <a
                    class="ib mr10"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('activityDel') != -1) ? 'inline-block' : "none"
                    }}
                    onClick={() => {
                      this.onDelete(params);
                    }}
                  >
                    {this.currentBtn === 'all' ? '删除' : '移除'}
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
    this.$Message.config({
      top: 50,
      duration: 1
    })
    //这里除了limit还要传个值给后台   具体字段找后台商量下
    // this.getData({params: {limit:10}})
  },
  created() {
    this.getActivelist();
  },
  methods: {
    getData(data) {
      let dataParams = data.params;
      for (let key in dataParams) {
        if (!dataParams[key]) delete dataParams[key];
      }
      this.$root.startTableLoading();
      activityList(data).then(res => {
        //不带分页
        if (res != undefined && res.code == 200) {
          const data = res.data;
        this.table.data = data;
        this.table.data.forEach((item,index) => this.statusList.push(false))
        }
        this.$root.endTableLoading()
      }).catch(error=>this.$root.endTableLoading());
    },
    //删除事件
    onDelete(params) {
      this.$Tip.confirm({
        content: `您确定${this.currentBtn === "all" ? '删除' : '移除'}${params.row.title}吗？`,
        onOk: () => {
          let data = {
            id: params.row.id,
            siteId: this.$root.nowSite.id
          };
          if (this.currentBtn === 'all') {
            data.activity_cate_id = 0
          } else {
            data.activity_cate_id = this.buttonlist[this.currentBtn].id
          }
          activityDel(data, true).then(res => {
            if ( res != undefined && res.code == 200) {
              // this.table.data.splice(params.index, 1);
            if (this.currentBtn === "all") {
              this.$Message.success({ content: '活动删除成功' })
                this.getall();
              } else {
                //此处返回数据有问题
                this.$Message.success({ content: '活动移除成功' })
                this.gettable(this.buttonlist[this.currentBtn], this.currentBtn);
              }
            }
          });
        }
      });
    },
    gettable(item, index) {
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(() => {
        this.currentBtn = index;
        this.searchKey.activity_cate_id = item.id;
        let params = { ...this.searchKey };
        params.siteId = this.$root.nowSite.id;
        this.getData({ params });
      }, 300)
    },
    selectWay(way) {
      this.searchKey.client_type = way;
      let params = { ...this.searchKey };
      params.siteId = this.$root.nowSite.id;
      this.getData({ params });
    },
    getall() {
      this.currentBtn = "all";
      this.searchKey.activity_cate_id = "";
      let params = { ...this.searchKey };
      params.siteId = this.$root.nowSite.id;
      delete params.activity_cate_id;
      this.getData({ params });
    },
    preview(params) {
      //预览
      activityDetail({ siteId: this.$root.nowSite.id, id: params.row.id }).then(
        res => {
          this.previewlist = res.data;
          if (this.previewlist.activity_type === 'normal_activity') {
            if (this.previewlist.desc_type === 'pic') this.previewlist.descriptionShow = this.previewlist.descriptionShow && JSON.parse(this.previewlist.descriptionShow)
            else this.previewlist.description = this.previewlist.description && JSON.parse(this.previewlist.description)
          } else {
            this.previewlist.url_link = this.previewlist.url_link.startsWith('{') ? JSON.parse(this.previewlist.url_link) : this.previewlist.url_link
          }
          this.$refs.ModalsDetial.show();
        }
      );
    },
    //编辑路由跳转编辑活动
    onEdit(params) {
      this.$router.push({
        name: "addActivities",
        params: { page: "edit" },
        query: { id: params.row.id, siteId: this.$root.nowSite.id }
      });
    },
    getActivelist() {
      activityCateList({ siteId: this.$root.nowSite.id }).then(res => {
        if (res != undefined && res.code == 200) this.buttonlist = res.data;
      });
    },
    addsave() {
      //添加分类
      this.$refs.memberLevelForm.validate(valid => {
        if (valid) {
          let params = {
            siteId: this.$root.nowSite.id,
            activity_cate_name: this.memberLevelForm.fenleiName
          };
          params.activity_cate_name = this.$root.trimAll(params.activity_cate_name)
          if (!params.activity_cate_name) {
            this.$Message.error('请输入分类名称')
            return false
          }
          this.$root.startEditLoading()
          activityCateIns(params, true).then(res => {
            if (res.code === 200) {
              this.$refs.addfenleiModal.hide();
              this.$Message.success('活动分类添加成功')
              this.getActivelist();
            }
          });
        }
      });
    },
    onDetails(params) {
      const data = { id: params.row.id, siteId: this.$root.nowSite.id };
      lanternDetail(data).then(res => {
        this.poplist = res.data;
        this.$refs.ModalsDetial.show();
      });
    },
    switch(index) {
      const { siteId, id, status } = index;
      const data = { siteId, id, status: status == "yes" ? "no" : "yes" };
      activityChangeStatus(data, true).then(res => {
        if (res != undefined && res.code == 200) {
          this.$Message.success('活动状态切换成功')
          this.$set(this.statusList, index._index, false)
          this.getData({ params: this.searchKey });
        }
      });
    },
    delactity(item) {
      this.$Tip.confirm({
        content: `您确定删除${item.activity_cate_name}吗？`,
        onOk: () => {
          let data = {
            id: item.id,
            siteId: this.$root.nowSite.id
          };
          if (this.currentBtn === 'all') {
            data.ac
          }
          activityCateDel(data, true).then(res => {
            if ( res != undefined && res.code == 200) {
              this.getActivelist();
              this.$Message.success('活动分类删除成功')
              this.getall()
            }
          });
        }
      });
    },
    onCopy (e) {
      this.$Message.success("复制成功");
    },
    onError (e) {
      this.$Message.error("复制失败");
    },
    //新增活动
    addActivity() {
      this.$router.push({
        name: "addActivities",
        params: { page: "create" }
      });
    },
    //新增分类
    addfenlei() {
      this.memberLevelForm.fenleiName = "";
      this.$refs.addfenleiModal.show();
    },
    //拖住排序id参数不知道是啥
    onDragDrop(oldIndex, newIndex) {
      if(oldIndex==newIndex) return;
      const params = {
        id: this.$refs.table.insideTableData[oldIndex].id,
        siteId: this.$root.nowSite.id,
        oldIndex: this.$refs.table.insideTableData[oldIndex].sort,
        newIndex: this.$refs.table.insideTableData[newIndex].sort,
      };
      if ((this.adminType == 'super') || (this.authInPage.indexOf('activityBySort') != -1)) {
        activityBySort(params, true).then(res => {
          if (res != undefined && res.code === 200) {
            this.$Message.success({ content: '排序更新成功' })
            if (this.currentBtn === "all") {
              this.getall();
            } else {
              //此处返回数据有问题
              this.gettable(this.buttonlist[this.currentBtn], this.currentBtn);
            }
          } else {
            if (this.currentBtn === "all") {
              this.getall();
            } else {
              //此处返回数据有问题
              this.gettable(this.buttonlist[this.currentBtn], this.currentBtn);
            }
          }
        });
      } else {
        this.$Tip.info({content: '对不起，您暂时没有此权限'})
      }
    },
    //打开修改活动分类ui
    modifyActivityCate (item, index) {
      this.index = index
      window.clearTimeout(this.timer)
      this.addfenlei()
      this.updActivity = item.id
      this.memberLevelForm.fenleiName = item.activity_cate_name
    },
    initActivityStatus (flag) {
      // 关闭模态框字体变化加入延时
      setTimeout(() => {
        if (!flag) this.updActivity = ''
      }, 200)
    },
    // 修改活动分类
    updActivityCate () {
      this.$root.startEditLoading()
      this.$refs.memberLevelForm.validate(valid => {
        if (valid) {
          let params = {
            siteId: this.$root.nowSite.id,
            activity_cate_name: this.memberLevelForm.fenleiName,
            id: this.updActivity
          };
          activityCateUpt(params, true).then(res => {
            if (res.code === 200) {
              this.$refs.addfenleiModal.hide();
              this.buttonlist[this.index].activity_cate_name = this.memberLevelForm.fenleiName
              this.$Message.success('活动分类更新成功')
            }
          });
        }
      })
    },
    //头部按钮拖拽事件
    menuItemDrag () {
      this.index = arguments[0]
    },
    menuItemDragEnd() {
      this.index = null
    },
    menuItemOver (e) {
      if (this.index !== null) e.preventDefault()
    },
    menuItemDrop ($event) {
      if (this.index !== null) {
        const params = {
          id: this.buttonlist[this.index].id,
          siteId: this.buttonlist[this.index].siteId,
          oldIndex: this.buttonlist[this.index].sort,
          newIndex: this.buttonlist[arguments[1]].sort,
        }
        activityCateBySort(params,true).then(res => {
          if (typeof res === "object" && res.code === 200) {
            if(params.oldIndex != params.newIndex){
              this.index = null
              this.$Message.success({ content: '排序更新成功' })
              this.getActivelist()
              this.getall()
            }else{
              return false
            }
          }
        })
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
@import "../../../styles/class.less";
.fr.activity-btn {
  height: 36px;
  background-color: #fff;
}
.fl {
  .bc-c1 {
    border-color: #dcdcdc;
    color: #666666;
    &:hover{
      background-color: #f6f6f8;
      color: #57a3f3;
      border-color: #2d8cf0;
    }
    &.active{
      background-color: #2d8cf0;
      color: #ffffff;
      border-color: #2d8cf0;
      box-shadow: none;
    }
  }
  .w150x{width: 150px;}
}
.ivu-btn.addSave {
  margin: 15px 125px auto;
  width: 250px;
}
.repay-button {
  height: 39px;
  .noactive {
    height: 39px;
    border: 1px solid #eaeaea;
    background: #f7f7f7;
    border-radius: 0;
  }
  button.active {
    height: 39px;
    border-radius: 0;
    border: none;
    border-top: 2px solid #2d8cf0;
    border-left: 1px solid #eaeaea;
    border-right: 1px solid #eaeaea;
    background: #fff;
    color: #2d8cf0;
  }
  .addfenlei {
    font-size: 1.5625rem;
    padding: 0 10px;
    cursor: pointer;
  }
}
.ivu-icon-ios-close {
  position: absolute;
  right: 5px;
  top: 6px;
  width: 25px;
  height: 25px;
  margin-left: 2px;
  border-radius: 15px;
  cursor: pointer;
  color: #666;
  font-size: 1.5rem;
  opacity: 0.66;
}
.modal-overflow form {
  margin-top: 45px;
  margin-bottom: 50px;
}
.address_item {
  input {
    color: #808080;
    border-radius: 7px;
    border: 1px solid #eaeaea;
    width: 293px;
    outline: none;
    padding: 0 20px;
  }
  button {
    margin-left: 15px;
    width: 70px;
    color: #62b1fd;
    border: 1px solid #62b1fd;
    display: inline-block;
    text-align: center;
    border-radius: 5px;
  }
}

</style>
