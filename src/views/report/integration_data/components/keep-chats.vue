<template>
    <div style="width:100%;height:350px" ref="chatsEl"></div>
</template>
<script>
import echarts from 'echarts';
import { type } from 'os';
import { types } from 'util';
export default {
    props: {
        chatsData: {
            type: Object,
            default: () => null
        },
        title: {
            type: String,
            default: ''
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
            let xData = this.chatsData.xData;
            let yData = this.chatsData.yData;
            this.renderChats(xData, yData);
        },
        renderChats(x, y) {
            var num = 0;
            let option = {
                notMerge: true,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        var relVal = params[0].name;
                        for (var i = 0, l = params.length; i < l; i++) {
                            if (params[i].value) relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + '%';
                            else relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value;
                        }
                        return relVal;
                    }
                },
                //legend: { data: [] },
                grid: {
                    left: '4%',
                    right: '6%',
                    bottom: '8%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: x,
                    boundaryGap: false,
                    splitLine: {
                        //网格线
                        show: true,
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#d1d1d1'
                        }
                    },
                    axisLabel: {
                        show: true,
                        padding: [3, 0, 0, 0],
                        textStyle: {
                            color: '#666',
                            fontSize: '14'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    minInterval: 10,
                    splitLine: {
                        //网格线
                        show: true
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#d1d1d1'
                        }
                    },
                    axisLabel: {
                        show: true,
                        padding: [0, 35, 0, 0],
                        formatter: function(val) {
                            if (val == 0) {
                                return num.toFixed(2) + '%';
                            } else {
                                return val.toFixed(2) + '%';
                            }
                        },
                        textStyle: {
                            color: '#666',
                            fontSize: '12'
                        }
                    }
                },
                series: []
            };
            let obj = {};
            obj.data = y;
            obj.name = this.title;
            obj.type = 'line';
            obj.smooth = false;
            obj.symbol = 'circle';
            obj.symbolSize = 12;
            obj.itemStyle = {};
            obj.itemStyle.normal = {
                color: '#2d89e1',
                lineStyle: {
                    color: '#2d89e1',
                    width: 3,
                    type: 'dotted' //'dotted'虚线 'solid'实线
                }
            };
            option.series.push(obj);
            this.ecInstance.setOption(option);
            window.addEventListener('resize', () => {
                this.ecInstance.resize();
            });
        }
    }
};
</script>
<style scoped>
</style>
