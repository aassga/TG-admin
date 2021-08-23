<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="统计日期">
                    <DatePicker type="date" placeholder="开始日期" class="w120x" v-model="Time[0]"></DatePicker>
                    <span class="pl10 pr10">至</span>
                    <DatePicker type="date" placeholder="结束日期" class="w120x" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click.prevent="searchSubmit" class="w80x" :loading="$root.tableLoading">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                :value="table.data"
                :columns="table.columns"
                :loading="$root.tableLoading"
                :total="table.total"
                :more="true"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                @on-sort-change="onSortChange"
            >
                <div slot="more">
                    <div class="h44">
                        <span class="pl20">总统计：</span>
                        <span class="pl20">投注红包总额：{{ allData.betting_gift_total }}</span>
                        <span class="pl20">负盈利红包总额：{{ allData.negative_profit_gift_total }}</span>
                    </div>
                </div>
            </Tables>
        </div>
        <!-- 查看详情 -->
        <HistoryDetail ref="HistoryDetail" :detailData="detailData"></HistoryDetail>
    </div>
</template>
<script>
import Tables from '_c/tables';
import { activityHongyundangtouList } from '@/api/activity';
import HistoryDetail from './historyDetail';
export default {
    components: {
        Tables,
        HistoryDetail
    },
    data() {
        return {
            page: 1,
            Time: [this.$root.weekDayStartTimeY(), this.$root.weekDayEndTimeY()],
            allData: {
                betting_gift_total: 0,
                negative_profit_gift_total: 0
            },
            searchKey: {
                siteId: this.$root.nowSite.id,
                show_type: 'history',
                history_start_date: this.$root.weekDayStartTimeY(),
                history_end_date: this.$root.weekDayEndTimeY()
            },
            detailData: {},
            table: {
                data: [],
                total: 0,
                columns: [
                    {
                        title: '红包组成',
                        key: 'gift_type',
                        align: 'center',
                        width: 160,
                        render: (h, params) => (
                            <span>{params.row.gift_type == 'negativeProfit' ? '负盈利红包' : params.row.gift_type == 'betting' ? '投注红包' : '投注红包,负盈利红包'}</span>
                        )
                    },
                    {
                        title: '发放节点',
                        align: 'center',
                        render: (h, params) => {
                            let nowDate = this.$moment()
                                .startOf('day')
                                .format('YYYYMMDD');
                            let { delivery_time_type, delivery_time } = params.row;
                            if (delivery_time_type == 'cycle') {
                                return <span>{params.row.delivery_time}</span>;
                            } else {
                                return <span>{params.row.count_date.split(',')[params.row.count_date.split(',').length - 1]}</span>;
                                // let arr = [];
                                // let _arr = [];
                                // let timelist = params.row.delivery_time.split(",");
                                // timelist.forEach(t => {
                                //   arr.push({ value: t, abs: Math.abs(t - nowDate) });
                                // });
                                // arr.sort(function(a, b) {
                                //   return a.abs - b.abs;
                                // }); //从小到大  用来取里今天最近一天的时间
                                // arr.forEach(t => {
                                //   t.value = this.$root.formatTime(
                                //     this.$moment(t.value).format("X") * 1000
                                //   );
                                // });
                                // timelist.forEach(t => {
                                //   _arr.push(
                                //     this.$root.formatTime(this.$moment(t).format("X") * 1000)
                                //   );
                                // });
                                // let index = _arr.indexOf(arr[0].value);
                                // return (
                                //   <Tooltip max-width="430" transfer>
                                //     <span class="cs">{_arr[0]}</span>
                                //     <div slot="content">
                                //       <p class="txt-a mb15">发放时间</p>
                                //       {_arr.length > 0 &&
                                //         _arr.map((t, i) => {
                                //           return h(
                                //             "span",
                                //             {
                                //               style: {
                                //                 border: "solid 1px #858484",
                                //                 width: "120px",
                                //                 display: "inline-block",
                                //                 height: "36px",
                                //                 lineHeight: "36px",
                                //                 textAlign: "center",
                                //                 marginLeft: "13px",
                                //                 marginBottom: "10px",
                                //                 background: i == index ? "#57a3f3" : i < index ? "#666666" : ""
                                //               }
                                //             },
                                //             t
                                //           );
                                //         })}
                                //     </div>
                                //   </Tooltip>
                                // );
                            }
                        }
                    },
                    {
                        title: '投注红包',
                        key: 'betting_gift',
                        align: 'center',
                        sortable: 'custom',
                        maxWidth: 150
                    },
                    {
                        title: '负盈利红包',
                        key: 'negative_profit_gift',
                        align: 'center',
                        sortable: 'custom',
                        maxWidth: 150,
                        tooltip: true
                    },
                    {
                        title: '待领取红包',
                        key: 'wait_gift',
                        align: 'center',
                        maxWidth: 120,
                        tooltip: true
                    },
                    {
                        title: '失效金额',
                        key: 'fail_amount',
                        align: 'center',
                        maxWidth: 120,
                        tooltip: true
                    },
                    {
                        title: '领取人数',
                        key: 'person_total',
                        align: 'center',
                        maxWidth: 100,
                        tooltip: true
                    },
                    {
                        title: '统计时段',
                        key: 'count_date',
                        align: 'center',
                        render: (h, params) => {
                            let { count_date } = params.row;
                            if (String(count_date).includes(',')) {
                                return <span>{`${count_date.split(',')[0]}至${count_date.split(',')[1]}`}</span>;
                            } else return <span>-</span>;
                        }
                    },
                    {
                        title: '状态',
                        key: 'config_status',
                        align: 'center',
                        maxWidth: 70,
                        render: (h, params) => {
                            const { config_status } = params.row;
                            let text = config_status == 'close' ? '已关闭' : config_status == 'open' ? '启用中' : '已结束';
                            let color = config_status == 'open' ? '#239961' : '';
                            return <span style={{ color }}>{text}</span>;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        maxWidth: 80,
                        render: (h, params) => (
                            <span
                                class="blue-font"
                                onClick={() => {
                                    this.detailData = params.row;
                                    this.$refs.HistoryDetail.getData();
                                }}
                            >
                                查看详情
                            </span>
                        )
                    }
                ]
            }
        };
    },
    mounted() {
        this.searchSubmit();
    },
    methods: {
        getData(data) {
            this.$root.startTableLoading();
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            activityHongyundangtouList(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        let { data, total, negative_profit_gift_total, betting_gift_total } = res.data;
                        this.table.data = data;
                        this.table.total = total;
                        this.allData = { negative_profit_gift_total, betting_gift_total };
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        searchSubmit() {
            let { sortName, sort } = this.searchKey;
            if (sortName) delete this.searchKey.sortName;
            if (sort) delete this.searchKey.sort;
            this.table.columns.forEach(t => {
                if (t.sortable == 'custom') this.$set(t, 'sortType', '');
            });
            if (this.$root.validateTime(this.Time)) {
                let [startTime, endTime] = this.Time;
                this.searchKey.history_start_date = startTime && this.$root.formatTime2(startTime);
                this.searchKey.history_end_date = endTime && this.$root.formatTime2(endTime);
            } else return false;
            let params = { ...this.searchKey };
            this.$refs.table.setPage();
            this.getData({ params });
        },
        onPageChange(page) {
            this.page = page;
            let data = { ...this.searchKey };
            this.getData({ params: data, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let data = { ...this.searchKey };
            this.getData({ params: data });
        },
        onSortChange({ column, key, order }) {
            delete this.searchKey.sortName;
            delete this.searchKey.sort;
            let data = { ...this.searchKey, sortName: key, sort: order };
            this.searchKey.sortName = key;
            if (data.sort == 'normal') {
                this.table.columns.forEach(t => {
                    if (t.key == column.key) this.$set(t, 'sortType', 'asc');
                });
                this.searchKey.sort = 'smallToBig';
                data.sort = 'smallToBig';
            } else {
                this.searchKey.sort = order == 'asc' ? 'smallToBig' : 'bigToSmall';
                data.sort = order == 'asc' ? 'smallToBig' : 'bigToSmall';
                this.table.columns.forEach(t => delete t.sortType);
            }
            this.page = 1 ? this.$refs.table.setPage() : '';
            this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: this.page } });
        }
    }
};
</script>
<style lang="less" scoped>
.h44 {
    height: 44px;
    line-height: 44px;
    background: #f4faff;
}
.lh32 {
    height: 32px;
    line-height: 32px;
}
</style>
