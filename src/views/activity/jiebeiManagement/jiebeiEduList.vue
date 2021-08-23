<template>
  <div>
    <div class="v2-search">
      <Button
        style="height:36px"
        type="primary"
        @click="selectMode"
        :loading="$root.tableLoading"
      >借呗模式</Button>
      <Button
        style="height:36px"
        type="primary"
        class="ml20"
        @click="filterMode"
        :loading="$root.tableLoading"
      >过滤设置</Button>
      <Button
        v-show="!isEdit && modeBtns.length"
        class="fr"
        type="primary"
        style="height:36px"
        @click="
                    () => {
                        isEdit = !isEdit;
                    }
                "
      >编辑</Button>
      <div class="ib fr" v-show="isEdit">
        <Button class="mr20" @click="quxiao" style="height:36px" :loading="$root.tableLoading">取消</Button>
        <Button type="primary" style="height:36px" :loading="$root.tableLoading" @click="submit">保存</Button>
      </div>
    </div>
    <Row v-if="spinShow" style="height:300px;line-height:300px">
      <Spin size="large" fix v-if="spinShow">
        <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
          <div v-for="t in 8" :key="'div' + t"></div>
        </div>
      </Spin>
    </Row>
    <div class="v2-search bb mt20" v-if="currentModeId">
      <span
        v-for="(item, i) in modeBtns"
        :key="i"
        class="modeBtns ib cs ft16"
        @click="getType(item.jinguanjia_class_id)"
        :class="currentModeId == item.jinguanjia_class_id ? 'active' : ''"
      >
        {{item.jinguanjia_name}}
        <Icon
          size="18"
          v-if="isEdit && currentModeId == item.jinguanjia_class_id "
          class="close ml10"
          color="#888"
          @click.native="delTag(item.id,item.jinguanjia_class_id)"
          type="md-close"
        />
      </span>
    </div>
    <div class="v2-table" v-if="modeBtns.length && !spinShow">
      <Tables
        ref="table"
        :value="table.data"
        :columns="table.columns"
        :loading="$root.tableLoading"
        @on-delete="onDelete"
        :page="false"
      ></Tables>
    </div>
    <div v-if="!spinShow && !modeBtns.length" class="txt-a" style="line-height:200px">
      <span class="else txt-a pl30 pr30 ib">
        <Icons type="danchuangtishi" color="red" :size="16" class="pl10"></Icons>请先创建借呗模式
      </span>
    </div>
    <Modals title="借呗模式" ref="Modes" :width="600">
      <div slot="content" class="mb30 ml30 mr30">
        <Form :label-width="100" class="mt40">
          <FormItem label="模式类型">
            <Select class="w400x" transfer v-model="currentMode">
              <Option
                :value="item.jinguanjia_name+','+item.jinguanjia_class_id"
                :disabled="modeBtnsId.includes(item.jinguanjia_class_id)"
                v-for="item in modeList"
                :key="item.jinguanjia_class_id"
              >{{ item.jinguanjia_name }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="txt-a">
          <Button
            type="primary"
            class="jgj-btn"
            :loading="$root.tableLoading"
            @click="modeSubmit"
          >确认保存</Button>
        </div>
      </div>
    </Modals>
    <Modals title="过滤设置" ref="filterModes" :width="600">
      <div slot="content" class="mb30 ml30 mr30">
        <p class="lh40 ft14 txt-a f4faffBg">有设置过滤时，会员既需满足借款条件还需满足以下3个条件才可提交借款成功</p>
        <Form :label-width="150" class="mt40">
          <FormItem label="利润占比≥">
            <InputNumber 
            v-model="filterData.xianjin" 
            :min="0"
            :max='100'
            class="w260x" /> %
          </FormItem>
          <FormItem label="优惠占比<">
            <InputNumber class="w260x" 
            v-model="filterData.youhui" 
            :max='100'
            :min="0"/> %
          </FormItem>
          <FormItem label="投注倍数≥">
            <InputNumber class="w260x" 
            v-model="filterData.beishu"
            :min="0"
            :max='100'
            />
          </FormItem>
        </Form>
        <div class="txt-a">
          <Button
            type="primary"
            class="jgj-btn"
            :loading="$root.tableLoading"
            @click="filterSubmit"
          >确认保存</Button>
        </div>
      </div>
    </Modals>
  </div>
</template>
<script>
import Modals from "@/components/modals";
import Icons from "_c/icons";
import Tables from "_c/tables";
import {
  jiebeiModelList,
  jiebeiModelSelect,
  jiebeiEduList,
  jiebeiModelCreate,
  jiebeiEduEdit,
  jiebeiModelDel,
  jiebeiFilterSetInfo,
  jiebeiFilterSet
} from "@/api/activity";
export default {
  name: "jiebeiEduList",
  components: {
    Modals,
    Tables,
    Icons
  },
  data() {
    return {
      spinShow: true,
      isEdit: false,
      modeList: [], //模式下拉列表
      modeBtns: [], //模式导航按钮
      modeBtnsId: [],
      currentModeId: "",
      delivery_type: "self", //派发类型：system=系统自动派送，self=自己领取
      currentMode: "", //当前选中模式
      filterData:{
        xianjin:null,
        youhui:null,
        beishu:null,
      },
      table: {
        data: [],
        pageSizeOpts: [20, 30, 40, 50],
        loading: true,
        columns: [
          {
            title: "等级",
            key: "level",
            align: "center"
          },
          {
            title: "累计打码",
            key: "betTotal",
            align: "center",
            render: (h, params) => {
              return (
                <span>{params.row.level_gift_money_requirement.betTotal}</span>
              );
            }
          },
          {
            title: "晋级礼金",
            key: "levelMoney",
            align: "center",
            render: (h, params) => {
              return (
                <span>
                  {params.row.level_gift_money_requirement.levelMoney}
                </span>
              );
            }
          },
          {
            title: "周俸禄",
            key: "level_gift_money_requirement",
            align: "center",
            render: (h, params) => {
              return (
                <span>{params.row.level_gift_money_requirement.weekMoney}</span>
              );
            }
          },
          {
            title: "月俸禄",
            key: "level_gift_money_requirement",
            align: "center",
            render: (h, params) => {
              return (
                <span>
                  {params.row.level_gift_money_requirement.monthMoney}
                </span>
              );
            }
          },
          {
            title: "借呗额度",
            key: "jiebei_edu",
            align: "center",
            render: (h, params) =>
              h("div", [
                h(
                  "span",
                  {
                    style: {
                      display: !this.isEdit ? "inline-block" : "none"
                    }
                  },

                  params.row.jiebei_edu
                ),
                h("InputNumber", {
                  style: { display: this.isEdit ? "inline-block" : "none" },
                  class: "w80",
                  props: {
                    value: Number(params.row.jiebei_edu),
                    min: 0,
                    max: 9999999999
                    //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                  },
                  on: {
                    "on-change": e => {
                      if (!e) e = 0;
                      this.table.data[params.index].jiebei_edu = e;
                    }
                  }
                })
              ])
          }
        ]
      }
    };
  },
  created() {
    this.getSeletList();
    this.tabShow();
  },
  methods: {
    delTag(id, jinguanjia_class_id) {
      let text = `您确定删除此条记录吗？`;
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          let data = {
            siteId: this.$root.nowSite.id,
            id,
            jinguanjia_class_id
          };
          jiebeiModelDel(data, true).then(res => {
            if (res && res.code == 200) {
              this.$Message.success("删除成功");
              this.tabShow();
            }
          });
        }
      });
    },
    tabShow() {
      //tab展示
      jiebeiModelList({ siteId: this.$root.nowSite.id }).then(res => {
        if (res && res.code == 200) {
          this.modeBtnsId = [];
          this.modeBtns = res.data;
          this.modeBtns.forEach(t => {
            this.modeBtnsId.push(t.jinguanjia_class_id);
          });
          if (res.data.length) {
            this.currentModeId = res.data[0].jinguanjia_class_id;
            this.getData({
              siteId: this.$root.nowSite.id,
              jinguanjia_class_id: this.currentModeId
            });
          }
        }
      });
    },
    getType(id) {
      if (this.currentModeId == id) return;
      this.currentModeId = id;
      this.getData({
        siteId: this.$root.nowSite.id,
        jinguanjia_class_id: this.currentModeId
      });
    },
    selectMode() {
      //模式选择
      this.$refs.Modes.show();
    },
    filterMode(){
      this.filterModeInfo();
      this.$refs.filterModes.show();
    },
    filterModeInfo(){
      jiebeiFilterSetInfo({siteId:this.$root.nowSite.id}).then(res=>{
        if(res&&res.code==200){
          this.filterData.xianjin=Number(res.data.xianjin)||null;
          this.filterData.youhui=Number(res.data.youhui)||null;
          this.filterData.beishu=Number(res.data.beishu)||null;
        }
      })
    },
    filterSubmit(){
      let data = {...this.filterData,siteId:this.$root.nowSite.id}
      this.$root.startTableLoading();
      for(let key in data){
        if(!data[key]&&data[key]!=0) delete data[key]
      }
      jiebeiFilterSet(data,true).then(res=>{
        if(res&&res.code==200){
          this.$refs.filterModes.hide();
          this.$root.endTableLoading();
          this.$Message.success('更新成功');
        }else{
          this.$root.endTableLoading();
        }
      }).catch(error=>this.$root.endTableLoading())
    },
    onDelete(params) {
      let text = `您确定删除【等级${params.row.level}】吗？`;
      let msg = `删除${params.row.level}成功`;
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          this.table.data.splice(params.index, 1);
        }
      });
    },
    quxiao() {
      this.getData(
        {
          siteId: this.$root.nowSite.id,
          jinguanjia_class_id: this.currentModeId
        },
        "quxiao"
      );
    },
    getSeletList() {
      //获取模式下拉列表
      let data = {
        siteId: this.$root.nowSite.id
      };
      jiebeiModelSelect(data).then(res => {
        if (res && res.code == 200) {
          this.modeList = res.data;
          this.spinShow = false;
        }
      });
    },
    modeSubmit() {
      //选择模式列表提交
      let data = {
        siteId: this.$root.nowSite.id,
        jinguanjia_class_id: this.currentMode.split(",")[1],
        jinguanjia_name: this.currentMode.split(",")[0]
      };
      jiebeiModelCreate(data, true).then(res => {
        if (res && res.code == 200) {
          this.$Message.success("模式编辑成功");
          this.tabShow();
        }
      });
      this.$refs.Modes.hide();
    },
    getData(data, type) {
      //获取列表数据
      this.$root.startTableLoading();
      jiebeiEduList(data)
        .then(res => {
          if (res && res.code == 200) {
            this.table.data = res.data&&res.data.reverse();
            this.table.data.map(item => {
              item.level_gift_money_requirement = JSON.parse(
                item.level_gift_money_requirement
              );
            });
            this.$root.endTableLoading();
            if (type == "quxiao") this.isEdit = false;
          }
        })
        .catch(error => this.$root.endTableLoading());
    },
    submit() {
      this.$root.startTableLoading();
      let newDate = [];
      this.table.data.map(item => {
        let obj = {
          id: item.id,
          jiebei_edu: item.jiebei_edu
        };
        newDate.push(obj);
      });
      let data = {
        siteId: this.$root.nowSite.id,
        jinguanjia_class_id: this.currentModeId,
        updateData: JSON.stringify(newDate)
      };
      jiebeiEduEdit(data, true)
        .then(res => {
          if (res && res.code == 200) this.$Message.success("更新成功");
          this.getData({
            siteId: this.$root.nowSite.id,
            jinguanjia_class_id: this.currentModeId
          });
          this.isEdit = false;
        })
        .catch(error => this.$root.endTableLoading());
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
.modeBtns {
  border: 0;
  border-radius: 0;
  line-height: 36px;
  height: 36px;
  text-align: center;
  padding: 0 15px;
}
.close:hover {
  color: #444 !important;
}
.active {
  border: 1px solid #2d8cf0;
  border-bottom: 0;
  color: #2d8cf0;
  box-sizing: border-box !important;
}
.else {
  line-height: 40px;
  height: 40px;
  background: rgba(137, 180, 226, 0.1);
  border-radius: 5px;
}
//添加等级样式调整
/deep/.ivu-row {
  margin-top: 0px !important;
}
</style>


