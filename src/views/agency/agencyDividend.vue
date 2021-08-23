<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="发放日期">
          <!-- <Select v-model="searchKey.date" class="s-260"></Select> -->
          <DatePicker
            v-model="searchKey.date"
            format="yyyy/MM/dd"
            type="daterange"
            placement="bottom"
            class="s-260"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Button :class="sendStatus ? 'ivu-btn lottery bg' : 'ivu-btn lottery grayBg'" @click="send">立即发放</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        editable
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        :more="table.more"
        @on-delete="onDelete"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change='sortChange'
      >
        <div class="clearfix" slot="more">
          <div class="fl">
            <!-- <Tag class="v2-tag">总盈利</Tag> -->
            <span class="b txt-a ib h32 w82 ft14 bd cs">总盈利</span>
            <span class="ml10 red-font">1000000000.00</span>
          </div>
          <div class="fl ml40">
            <!-- <Tag class="v2-tag">总分红</Tag> -->
            <span class="b txt-a ib h32 w82 ft14 bd cs">总分红</span>
            <span class="ml10 red-font">10000000000.00</span>
          </div>
          <div class="fl ml40">
            <!-- <Tag class="v2-tag">发放基数</Tag> -->
            <span class="b txt-a ib h32 w82 ft14 bd cs">发放基数</span>
            <span class="ml10 red-font">-10000000.00</span>
          </div>
        </div>
      </Tables>
    </div>
  </div>
</template>
<script>
import { agencyDividendData } from "@/api/data";
import Tables from "@/components/tables";
import Icons from "@/components/icons";
import {sortInteraction} from '@/libs/util';
export default {
  name: "agencyDividend",
  components: { Tables, Icons },
  data() {
    return {
      //控制发放按钮的状态,
      sendStatus: false,
      sendTime: {},
      searchKey: {},
      table: {
        loading: true,
        total: 100,
        title: "代理分红结算",
        data: [],
        more: true,
        columns: [
          {
            title: "代理账号",
            key: "account",
            align: "center"
          },
          {
            title: "代理等级",
            key: "level",
            align: "center"
          },
          {
            title: "总投注",
            key: "totalBetting",
            align: "center"
          },
          {
            title: "总盈利",
            key: "totalProfit",
            align: "center"
          },
          {
            title: "总返水,返点,彩金,优惠",
            key: "total",
            align: "center",
            width: 180
          },
          {
            title: "上次盈利",
            key: "prevProfit",
            align: "center"
          },
          {
            key: "currentProfit",
            align: "center",
            width: 200,
            renderHeader: (h, params) => {
              return h(
                "div",
                {
                  class: "yl",
                  style: "float:left;margin-top:-2px"
                },
                [
                  h("span", "本次盈利"),
                  h(
                    "Poptip",
                    {
                      class: "yiTip",
                      style: "margin-left:5px;margin-right:3px",
                      props: {
                        trigger: "hover",
                        content:
                          "最后一次发发放分红后到上一次发放分红时的累计盈利金额"
                      }
                    },
                    [
                      h(Icons, {
                        props: {
                          type: "bangzhutishi"
                        },
                        style: {
                          color: "#b3b3b3"
                        }
                      })
                    ]
                  )
                ]
              );
            }
          },
          {
            title: "最低负盈利",
            key: "lowestDeficit",
            align: "center"
          },
          {
            title: "发放比例",
            key: "grantScale",
            align: "center"
          },
          {
            key: "grantNum",
            width: 130,
            align: "center",
            renderHeader: (h, params) => {
              return h(
                "div",
                {
                  class: "js",
                  style: "float:left;margin-top:-2px"
                },
                [
                  h("span", "发放基数"),
                  h(
                    "Poptip",
                    {
                      class: "jstip",
                      style: "margin-left:5px;margin-right:3px",
                      props: {
                        trigger: "hover",
                        width: "300",
                        placement: "bottom",
                        wordWrap: true,
                        content:
                          "发放基数会累积历史未达最低负盈利的金额和扣除之前未计算的正盈利金额 \n  盈利为正数表示会员赢钱，负数表示会员输钱 \n（1）上一次未达到发放条件未发放分红，本次达到条件时  发放基数=  上次盈利+本次盈利 \n （2）上一次达到发放条件有发放分红，本次也达到条件时 发放基数=本次盈利"
                      }
                    },
                    [
                      h(Icons, {
                        props: {
                          type: "bangzhutishi"
                        },
                        style: {
                          color: "#b3b3b3"
                        }
                      })
                    ]
                  )
                ]
              );
            }
          },
          {
            key: "currentDividend",
            title: "本次分红",
            align: "center",
            width: 120,
          },
          {
            title: "操作",
            key: "handle",
            align: "center",
            options: ["delete"]
          }
        ]
      }
    };
  },
  methods: {
    getData(query) {
      agencyDividendData().then(res => {
        this.table.loading = true;
        setTimeout(() => {
          this.table.data = res.data;
          this.table.loading = false;
        }, 2000);
      });
    },
    onDelete() {
      this.$Tip.confirm({
        content: "您确定删除此代理，不予以分红？",
        onOk: () => {
          this.$Tip.success({
            content: "删除代理成功"
          });
        }
      });
    },
    onPageChange(page) {
      this.getData(page);
    },
    onPageSizeChange() {},
    send() {
      if (this.sendStatus) {
        this.$Tip.confirm({
          content: `发放总额1000000.00`,
          onOk: () => {
            this.$Tip.success({
              content: "发放分红成功",
              onOk: () => {}
            });
          }
        });
      } else {
        this.$Tip.info({
          content:'未到结算时间，尚不能结算',
          onOk:() => {}
        })
      }
    },
    getTime() {
      this.sendTime = {
        date: new Date().getDate(), //当前日期为几号 1号发放上月的下半月   16号后发放当月上半月
        hour: new Date().getHours() //1号12点  16号12点以后
      };
    },
    sortChange(obj){
      sortInteraction(obj)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
      this.getTime();
      setInterval(() => {
        this.getTime();
      }, 600000);
    });
  },
  watch: {
     sendTime:{
       handler(value){
         if(value.date == 1 && value.hour >= 12){
           this.sendStatus = true;
         }else if(value.date >= 16 && value.hour >= 12){
           this.sendStatus = true;
         }else{
           this.sendStatus = false;
         }
       },
       deep:true
     }
  }
};
</script>
<style lang="less"  scoped>
@import "../../styles/button.less";
.grayBg{
  background: gray;
  color: #ffffff;
}
</style>

