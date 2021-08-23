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
  // props: ["qirizoushi", "showshuzi"],
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
      let xData = this.chatsData.days;
      let yData = {};
      for (const key in this.chatsData) {
        if (key !== "days") {
          yData[key] = this.chatsData[key];
        }
      }
      this.renderChats(xData, yData);
    },
    renderChats(x, y) {
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: { data: [] },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: x,
          boundaryGap: false
        },
        yAxis: {
          type: "value"
        },
        series: []
      };
      let colorList = [
        "#58D68D",
        "#58D6CC",
        "#58A1D6",
        "#5862D6",
        "#8D58D6",
        "#CC58D6",
        "#EA3D22"
      ];
      const yTconfig = {
        agency: "代理注册人数",
        member: "会员注册人数",
        "report_deposit:amount": "存款金额",
        "report_deposit:person": "存款人数",
        "report_deposit:quantity": "存款笔数",
        "report_withdrawals:amount": "取款金额",
        "report_withdrawals:person": "取款人数",
        "report_withdrawals:quantity": "取款笔数"
      };
      for (const key in y) {
        let obj = {};
        obj.data = y[key];
        obj.name = yTconfig[key];
        obj.type = "line";
        obj.smooth = true;
        obj.itemStyle = {};
        obj.itemStyle.normal = { color: colorList[option.series.length] };
        option.series.push(obj);
        option.legend.data.push(key);
      }
      this.ecInstance.setOption(option);

      window.addEventListener("resize", () => {
        this.ecInstance.resize();
      });
    }
  }
};
</script>
<style scoped>
</style>
