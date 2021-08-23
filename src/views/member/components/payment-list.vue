<template>
  <Modals ref="paymentListModal" title="支付通道详情" :width="1188">
    <div slot="content" class="modal" style="overflow:auto">
      <div
        :style="pc_payment_info.length>5&&status=='pc'?{width:`${(pc_payment_info.length)*192+92}px`}
            :h5_payment_info.length>5&&status=='h5'?{width:`${(h5_payment_info.length)*192+92}px`}
            :ios_payment_info.length>5&&status=='ios'?{width:`${(ios_payment_info.length)*192+92}px`}
            :android_payment_info.length>5&&status=='android'?{width:`${(android_payment_info.length)*192+92}px`}:'1157px'"
      >
        <div
          class="v2-search bb clearfix"
          style="margin-left:16px;margin-right:16px;"
          :style="pc_payment_info.length<=5?'width:1152px':h5_payment_info.length<=5?'width:1152px':''"
        >
          <ButtonGroup class="repay-button1 clearfix" style="margin-bottom:0.5px !important">
            <Button
              :class="status==t.value ? 'active' : ''"
              @click="statusSet(t.value)"
              v-for="(t,i) in btnList"
              :key="i"
              style="boxsizing:border-box"
            >{{t.name}}</Button>
          </ButtonGroup>
        </div>
        <div>
          <div class="paymentTable" v-if="info.length&&lvl_name.length">
            <div class="head ft16" style="height:40px;line-height:40px">
              <div
                class="th ib"
                :style="info.length<=5?{width:`${1150/(info.length+1)}px`}:'width:60px'"
              >等级</div>
              <div
                class="th ib"
                :style="info.length<=5?{width:`${1150/(info.length+1)}px`}:'width:192px'"
                v-for="(item,i) in info"
                :key="i"
              >{{item}}</div>
            </div>
            <div class="main mb20 bb" :style="info.length<=5?'width:1152px':''">
              <div
                v-for="(value,key) in obj"
                :key="key"
                class="info"
                clearfix
                :style="obj[key].maxLength>1?{height: `${30 * obj[key].maxLength}px`,lineHeight:`${30 * obj[key].maxLength}px`}:{height: `${40 * obj[key].maxLength}px`,lineHeight:`${40 * obj[key].maxLength}px`}"
              >
                <div
                  class="td w10 box"
                  :style="info.length<=5?{width:`${1150/(info.length+1)}px`}:'width:60px'"
                >{{key}}</div>
                <div
                  class="td tdbox"
                  style="height:100%"
                  :style="info.length<=5?{width:`${1150/(info.length+1)}px`}:'width:192px'"
                  v-for="(item,i) in info"
                  :key="i"
                >
                  <p v-for="(v,k) in value" class="ib" :key="k" style="vertical-align:middle">
                    <span v-if="k==item">
                      <span
                        class="payment_name"
                        v-for="(m,x) in v.payment_info[0].payment_name"
                        :key="x"
                        v-if="m"
                      >
                        {{m}}
                        <I class="ib ml5">{{x+1}}</I>
                        <Icons
                          type="suodingpaixu1"
                          :color="v.payment_info[0].locked_payment_name.includes(m)?'rgb(255, 38, 38)':'transparent'"
                          class="gameLock ml5 cd"
                          size="16"
                        ></Icons>
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="no-data txt-a" v-else style="line-height:60px">暂无数据</div>
        </div>
      </div>
    </div>
  </Modals>
</template>
<script>
import Modals from "@/components/modals";
import { payMentDetail } from "@/api/member";
import Icons from "@/components/icons";
export default {
  components: { Modals, Icons },
  data() {
    return {
      screen: screen.width,
      obj: {},
      info: [],
      lvl_name: [],
      pcObj: {},
      h5Obj: {},
      iosObj: {},
      androidObj: {},
      h5List: [],
      pcList: [],
      androidList: [],
      iosList: [],
      status: "pc",
      h5_payment_info: [],
      pc_payment_info: [],
      ios_payment_info: [],
      android_payment_info: [],
      pclvl_name: [],
      h5lvl_name: [],
      ioslvl_name: [],
      androidlvl_name: [],
      pc_data: [],
      payment_name: [],
      btnList: [
        { name: "PC端", value: "pc" },
        { name: "H5端", value: "h5" },
        { name: "苹果端", value: "ios" },
        { name: "安卓端", value: "android" }
      ]
    };
  },
  methods: {
    statusSet(val) {
      this.status = val;
      this.info = this[val + "_payment_info"];
      this.obj = this[val + "Obj"];
      this.lvl_name = this[val + "lvl_name"];
    },
    init() {
      this.status = 'pc'
      this.$nextTick(() => {
        this.$refs.paymentListModal.spinShow();
        payMentDetail({ siteId: this.$root.nowSite.id })
          .then(res => {
            this.$refs.paymentListModal.spinHide();
            const { h5, pc, ios, android } = res.data;
            this.h5List = h5 || [];
            this.pcList = pc || [];
            this.iosList = ios || [];
            this.androidList = android || [];
            this.$refs.paymentListModal.show();
            for (let key in res.data) {
              res.data[key].map(item => {
                if (
                  this[key + "lvl_name"].indexOf(item.lvl_alias_name) == -1 &&
                  item.payment_info[0].payment_name.some(m => m && m != "null")
                ) {
                  this[key + "lvl_name"].push(item.lvl_alias_name);
                }
                if (
                  this[key + "_payment_info"].indexOf(
                    item.payment_info[0].payment_class
                  ) == -1 &&
                  item.payment_info[0].payment_class &&
                  item.payment_info[0].payment_name.some(m => m && m != "null")
                ) {
                  this[key + "_payment_info"].push(
                    item.payment_info[0].payment_class
                  );
                }
              });
              this[key + "Obj"] = {};
            }
            for (let key in res.data) {
              this[key + "lvl_name"].map(k => {
                let obj = {};
                this[key + "_payment_info"].map(t => {
                  this[key + "List"].map(m => {
                    let arr = [];
                    m.payment_info[0].payment_name.forEach(y => {
                      if (y && y != "null" && y != null) arr.push(y);
                    });
                    m.payment_info[0].payment_name = arr;
                    if (
                      m.lvl_alias_name == k &&
                      m.payment_info[0].payment_class == t
                    ) {
                      obj[t] = m;
                    }
                  });
                });
                let _list = [];
                for (let p in obj) {
                  _list.push(obj[p].payment_info[0].payment_name.length);
                }
                _list.sort((a, b) => {
                  return b - a;
                });
                if (_list) this.$set(obj, "maxLength", _list[0]);
                this[key + "Obj"][k] = obj;
              });
            }
            this.info = this["pc_payment_info"];
            this.obj = this["pcObj"];
            this.lvl_name = this["pclvl_name"];
            
          })
          .catch(err => {
            this.$refs.paymentListModal.spinHide();
          });
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
@import "../../../styles/tabs.less";
.main {
  border-left: 1px solid #dcdcdc;
}
.main.h5 {
  overflow: hidden;
}
.head {
  border-left: 1px solid #dcdcdc !important;
}
.paymentTable {
  text-align: center;
  font-size: 0.875rem /* 14/16 */;
  border-collapse: collapse;
  margin: 0 15px;
  .head .th {
    background: #f6f6f8;
    // float: left;
  }
  .th {
    line-height: 40px;
  }
  .info {
    min-height: 40px !important;
  }
  .th,
  .td {
    float: left;
    // width: 160px;
    min-height: 40px;
    height: 100% !important;
    border-top: 1px solid #dcdcdc;
    border-right: 1px solid #dcdcdc;
  }
  .th.last,
  .td.last {
    border-right: 1px solid #dcdcdc;
  }
  .td.other-td {
    border-top: none;
    color: transparent;
  }
  .no-data {
    height: 40px;
    line-height: 40px;
    border-right: 1px solid #dcdcdc;
  }
}
.modal {
  max-height: 650px;
  overflow-y: scroll;
  // &::-webkit-scrollbar-thumb{

  // }
}
&::-webkit-scrollbar {
  height: 8px !important;
}
.payment_name {
  display: block;
  line-height: 30px;
  height: 30px;
  text-align: right;
  i {
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    text-align: center;
    border: 1px solid #dcdcdc;
    font-style: normal;
  }
}
.gameLock {
  border: 0 !important;
}

// .box:nth-child(1){ width: 5%}
// .boxth:nth-child(1){width: 5%}
// .tdbox:nth-child(1){width: 8%}
// .tdbox:nth-child(1){width: 150px}
</style>


