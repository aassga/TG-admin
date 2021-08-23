<template>
  <div>
    <div class="v2-search" style="overflow:hidden">
      <Button
        v-show="!isEdit && (currentMode&&!tipShow)"
        class="fr"
        type="primary"
        style="height:36px"
        :loading="spinShow||$root.tableLoading"
        @click="
                    () => {
                        isEdit = !isEdit;
                    }
                "
      >编辑</Button>
      <div class="ib fr" v-show="isEdit">
        <Button
          class="mr20"
          @click="quxiao"
          style="height:36px"
          :loading="$root.tableLoading||spinShow"
        >取消</Button>
        <Button
          type="primary"
          style="height:36px"
          :loading="$root.tableLoading||spinShow"
          @click="submit"
        >保存</Button>
      </div>
    </div>
    <Row v-if="spinShow" style="height:300px;line-height:300px">
      <Spin size="large" fix v-if="spinShow">
        <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
          <div v-for="t in 8" :key="'div' + t"></div>
        </div>
      </Spin>
    </Row>
    <div v-if="!spinShow && tipShow" class="txt-a" style="line-height:200px">
      <span class="else txt-a pl30 pr30 ib">
        <Icons type="danchuangtishi" color="red" :size="16" class="pl10"></Icons>请先开启金管家
      </span>
    </div>
    <div class="v2-table" v-if="!spinShow&&!tipShow">
      <Tables
        ref="table"
        :value="table.data"
        :columns="table.columns"
        :loading="$root.tableLoading"
        :page="false"
      ></Tables>
      <footer
        class="txt-a footer c62Color cs"
        style="background: #f4faff;"
        v-if="isEdit"
      >
        <Button class="w50 fr cs h48" type="primary" :disabled="$root.tableLoading||spinShow" @click="addLevel">
          <Icons type="xinzeng" size="14" class="mr5"></Icons>添加等级
        </Button>
        <Button class="w50 fl br0 cs h48" :disabled="$root.tableLoading||spinShow||(table.data.length<1)" @click="delLevel">
          <Icons type="guanbi" size="12" class="mr5"></Icons>删除最后一级
        </Button>
      </footer>
    </div>
  </div>
</template>
<script>
import Icons from "_c/icons";
import Tables from "_c/tables";
import { yuebaoLevelList, jinGuanJiaClassList,yuebaoLevelEdit } from "@/api/activity";
export default {
  name: "yuebaoLevelList",
  components: {
    Tables,
    Icons
  },
  data() {
    return {
      tipShow:true,
      spinShow: true,
      isEdit: false,
      currentMode: [], //当前选中模式
      table: {
        data: [],
        pageSizeOpts: [20, 30, 40, 50],
        loading: true,
        columns: [
          {
            title: "等级",
            align: "center",
            key: "level_id",
            render:(h,params)=>{
              return (
                <span>{params.index==this.table.data.length-1? '其他':params.row.level_id}</span>
              )
            }
          },
          {
            title: "日利率",
            align: "center",
            key: "rate",
            className:'pl20 pr20',
            render: (h, params) =>
              h("div", [
                h(
                  "span",
                  {
                    style: { display: !this.isEdit ? "inline-block" : "none" }
                  },
                  Number(params.row.rate)+'%'
                ),
                h("InputNumber", {
                  class: "w100",
                  style: { display: this.isEdit ? "inline-block" : "none" },
                  props: {
                    value: Number(params.row.rate)||null,
                    step:0.1,
                    min: 0,
                    max: 100
                    // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                  },
                  on: {
                    "on-change": e => {
                      if (!e) e = 0;
                      this.table.data[params.index].rate = e;
                    }
                  }
                })
              ])
          },
          {
            title: "最后修改时间",
            align: "center",
            key: "created_at",
            render: (h, params) => (
              <span>{this.$root.newUnixTime(params.row.created_at)}</span>
            )
          },
          {
            title: "操作人",
            align: "center",
            key: "created_by"
          }
        ]
      }
    };
  },
  mounted() {
    this.getSeletList();
  },
  methods: {
    quxiao() {
      this.getData({
        siteId: this.$root.nowSite.id,
      });
      this.isEdit = false;
    },
    addLevel() {
      //添加等级
      let obj = {
        level_id: this.table.data.length,
        rate: this.table.data.length==0?'':this.table.data.length==1?this.table.data[this.table.data.length-1].rate:this.table.data[this.table.data.length-2].rate,
        created_at:new Date().getTime()/1000
      };
      this.table.data.splice(this.table.data.length-1,0,obj);
      this.table.data[this.table.data.length-1].level_id = this.table.data.length;
    },
    delLevel() {
      //删除等级
      this.table.data.splice(this.table.data.length-2,1);
      if(this.table.data.length) {this.table.data[this.table.data.length-1].level_id = this.table.data.length};
    },
    getSeletList() {
      //获取模式下拉列表
      let data = {
        siteId: this.$root.nowSite.id,
        type: "select"
      };
      jinGuanJiaClassList(data).then(res => {
        if (res && res.code == 200) {
          this.currentMode = res.data.current.toString();
          if (this.currentMode.length) {
            this.getData();
          } else {
            this.spinShow = false;
            this.tipShow = true;
          }
        }
      });
    },
    getData() {
      //获取列表数据
      this.$root.startTableLoading();
      let data = { query: { siteId: this.$root.nowSite.id } };
      yuebaoLevelList(data,true)
        .then(res => {
          if (res && res.code == 200) {
            this.table.data = res.data;
            this.tipShow = false;
            this.$root.endTableLoading();
            this.spinShow = false;
            this.isEdit = false;
          }else{
            this.spinShow = false;
            this.tipShow = false;
            this.table.data=[];
            this.$root.endTableLoading();
          }
        })
        .catch(error =>{this.tipShow=true;this.spinShow = false;this.$root.endTableLoading()});
    },
    submit() {
      let newDate = {};
      this.table.data.forEach(k => {
        newDate[k.level_id] = k.rate;
        if(!k.rate&&k.rate!=0) {
          this.$Message.error("请输入利率");
          return
        }
      });
      let data = {
        siteId: this.$root.nowSite.id,
        json: JSON.stringify(newDate)
      };
      this.$root.startTableLoading();
      yuebaoLevelEdit(data, true)
        .then(res => {
          if (res && res.code == 200) this.$Message.success("更新成功");
          this.getData();
        })
        .catch(error => this.$root.endTableLoading());
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";

.footer {
  border-top: 0;
  line-height: 48px;
}
</style>


