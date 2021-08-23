<template>
  <div style="width:100%;height:300px" ref="chatsEl"></div>
</template>
<script>
import echarts from "echarts";
export default {
  props: {
    chatsData: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      ecInstance: null
    };
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.ecInstance = echarts.init(this.$refs.chatsEl);
        this.ecInstance.clear(); // 清除实例图表和数据
        this.buildData(); // 构建数据
      });
    },
    buildData() {
      let xData = []; // x轴显示文字
      let yData = []; // y轴数据
      const xTconfig = {
        member: "会员注册",
        member_bank: "会员绑卡",
        agency: "代理注册",
        agency_bank: "代理绑卡",
        message: "站内信",
        transfer: "转账次数",
        report_deposit_amount: "存款金额",
        report_deposit_quantity: "存款笔数",
        report_withdrawals_amount: "提款金额",
        report_withdrawals_quantity: "提款笔数",
        report_slots_betCount: "老虎机注单数",
        report_slots_betAmount: "老虎机投注额",
        report_slots_validBetAmount: "老虎机有效投注额",
        report_slots_netAmount: "老虎机派彩",
        report_sport_betCount: "体育注单数",
        report_sport_betAmount: "体育投注额",
        report_sport_validBetAmount: "体育有效投注额",
        report_sport_netAmount: "体育派彩",
        report_lottery_betCount: "彩票注单数",
        report_lottery_betAmount: "彩票投注额",
        report_lottery_validBetAmount: "彩票有效投注额",
        report_lottery_netAmount: "彩票派彩",
        report_livecasino_betCount: "真人注单数",
        report_livecasino_betAmount: "真人投注额",
        report_livecasino_validBetAmount: "真人有效投注额",
        report_livecasino_netAmount: "真人派彩",
        report_chess_betCount: "棋牌注单数",
        report_chess_betAmount: "棋牌投注额",
        report_chess_validBetAmount: "棋牌有效投注额",
        report_chess_netAmount: "棋牌派彩"
      };
      for (let key in this.chatsData) {
        if (xTconfig[key]) {
          xData.push(xTconfig[key]);
          yData.push(this.chatsData[key]);
        }
      }
      // 渲染图表
      this.renderChats(xData, yData);
    },
    renderChats(x, y) {
      const option = {
        color: [
          "#03A9F4",
          "#00BCD4",
          "#009688",
          "#4CAF50",
          "#8BC34A",
          "#FFEB3B",
          "#00BCD4",
          "#009688",
          "#4CAF50",
          "#8BC34A",
          "#FFEB3B",
          "#009688",
          "#4CAF50"
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: x,
          // triggerEvent: true
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            type: "bar",
            barWidth: "50%",
            data: y,
            itemStyle: {
              normal: {
                color: function(param) {
                  var colorList = [
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1",
                    "#4FC3F7",
                    "#0288D1"
                  ];
                  return colorList[param.dataIndex];
                }
              }
            }
          }
        ],
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: { readOnly: false },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {}
          },
          right: 40,
          iconStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "red" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "blue" // 100% 处的颜色
                }
              ],
              globalCoord: false // 缺省为 false
            }
          }
        }
      };
      this.ecInstance.setOption(option);
      // 响应式
      window.addEventListener("resize", () => {
        this.ecInstance.resize();
      });
    }
  }
};
</script>
<style scoped>
</style>
