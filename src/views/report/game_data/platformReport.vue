<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem>
                    <GameSelect ref="GameSelect" :showPlateform="false" @on-game-change="onGameChange" :gameClear="true" @clearData="clearData"></GameSelect>
                </FormItem>
                <FormItem label="时区">
                    <Select v-model="searchKey.timeType" :class="[screen < 1600 ? 's-100' : 's-120']">
                        <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker type="date" placeholder="开始日期" :class="screen < 1450 ? 's-130' : 's-120'" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker type="date" placeholder="结束日期" :class="screen < 1450 ? 's-130' : 's-120'" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem>
                    <Select v-model="searchKey.selectType" class="s-120">
                        <Option value="0">会员账号</Option>
                        <Option value="1" selected>上级代理</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Input v-model="searchKey.userName" @keyup.enter.native="searchSubmit" placeholder="多个请以,逗号隔开" class="s-140" />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" class="search" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.editBtnLoading" class="ivu-btn export" @click.prevent="exportExcel">导出Excel</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                :loading="$root.tableLoading"
                :columns="sortable == 'custom' ? table.columns : table.columns1"
                :value="table.data"
                :page="false"
                @on-sort-change="sortChange"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Icons from '@/components/icons';
import Tables from '@/components/tables';
import GameSelect from '@/components/game-select';
import tableMixins from '@/mixins/table';
import { getplatformReportData, getPlatformReportsSelect } from '@/api/report';
export default {
    name: 'platformReport',
    components: { Tables, Icons, GameSelect },
    data() {
        return {
            screen: screen.width,
            page: 1,
            sortable: 'custom',
            downUrl: '',
            timeList: [
                { value: 'cn', name: '北京时间' },
                { value: 'en', name: '美东时间' }
            ],
            currentSite: this.$root.nowSite.id,
            currentSiteName: '',
            siteid: 0,
            searchKey: {
                timeType: 'cn',
                startTime: this.$root.startTime(),
                endTime: this.$root.midnight(),
                siteId: this.$root.nowSite.id,
                selectType: '0'
            },
            Time: [this.$root.startTime(), this.$root.midnight()],
            table: {
                total: 0,
                pageSizeOpts: [20, 30, 40, 50],
                data: [],
                columns: [
                    {
                        title: '游戏平台',
                        align: 'center',
                        key: 'platformName',
                        minWidth: 65,
                        render: (h, params) => {
                            const { platformName } = params.row;
                            return (
                                <span
                                    class={{ 'blue-font': platformName !== '总计' }}
                                    onClick={() => {
                                        if (platformName != '总计') this.goDetailPage(params);
                                    }}
                                >
                                    {platformName}
                                </span>
                            );
                        }
                    },
                    {
                        title: '投注人数',
                        key: 'betUser',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75
                    },
                    {
                        title: '注单数量',
                        key: 'betCount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75
                    },
                    {
                        title: '投注金额',
                        key: 'betAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 85,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.betAmount)}</span>
                    },
                    {
                        title: '有效投注',
                        key: 'validBetAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 85,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.validBetAmount)}</span>
                    },
                    {
                        title: '平台输赢',
                        key: 'netAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 100,
                        render: (h, params) => {
                            let color = params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return <span style={{ color }}>{this.$root.keepTwo(params.row.netAmount)}</span>;
                        }
                    },
                    {
                        title: '盈率',
                        key: 'winRate',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 70,
                        render: (h, params) => {
                            let color = params.row.winRate > 0 ? '#FF2626' : 'rgb(35, 153, 97) ';
                            return <span style={{ color }}>{params.row.winRate}%</span>;
                        }
                    },
                    {
                        align: 'center',
                        minWidth: 150,
                        tooltip: 'custom',
                        renderHeader: (h, params) => (
                            <Poptip trigger="hover" placement="right-end" content="平台方活动" transfer style={{ verticalAlign: 'middle' }}>
                                <span>活动类型</span>
                                <Icons color="#b3b3b3" type="bangzhutishi" class="ml5" />
                            </Poptip>
                        ),
                        render: (h, params) => {
                            return params.row.activity
                                ? params.row.activity.length
                                    ? params.row.activity.map(item => {
                                          return h(
                                              'div',
                                              {
                                                  style: {
                                                      color: '#666666'
                                                  }
                                              },
                                              item.typeName
                                          );
                                      })
                                    : h('span', '-')
                                : h('span', '-');
                        },
                        width: '200'
                    },
                    {
                        title: '活动人数',
                        key: 'activity',
                        align: 'center',
                        minWidth: 55,
                        render: (h, params) => {
                            return params.row.activity
                                ? params.row.activity.length
                                    ? params.row.activity.map(item => {
                                          return h(
                                              'div',
                                              {
                                                  style: {
                                                      color: '#666666'
                                                  }
                                              },
                                              item.actUser
                                          );
                                      })
                                    : h('span', '-')
                                : h('span', '-');
                        }
                    },
                    {
                        title: '活动金额',
                        key: 'c',
                        align: 'center',
                        minWidth: 75,
                        render: (h, params) => {
                            return params.row.activity
                                ? params.row.activity.length
                                    ? params.row.activity.map(item => {
                                          return h(
                                              'div',
                                              {
                                                  style: {
                                                      color: '#666666'
                                                  }
                                              },
                                              item.amount
                                          );
                                      })
                                    : h('span', '-')
                                : h('span', '-');
                        }
                    }
                ],
                columns1: [
                    {
                        title: '游戏平台',
                        align: 'center',
                        key: 'platformName',
                        minWidth: 65,
                        render: (h, params) => {
                            const { platformName } = params.row;
                            return (
                                <span
                                    class={{ 'blue-font': platformName !== '总计' }}
                                    onClick={() => {
                                        if (platformName != '总计') this.goDetailPage(params);
                                    }}
                                >
                                    {platformName}
                                </span>
                            );
                        }
                    },

                    {
                        title: '投注人数',
                        key: 'betUser',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '注单数量',
                        key: 'betCount',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '投注金额',
                        key: 'betAmount',
                        align: 'center',
                        minWidth: 85,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.betAmount)}</span>
                    },
                    {
                        title: '有效投注',
                        key: 'validBetAmount',
                        align: 'center',
                        minWidth: 85,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.validBetAmount)}</span>
                    },
                    {
                        title: '平台输赢',
                        key: 'netAmount',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            let color = params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return <span style={{ color }}>{this.$root.keepTwo(params.row.netAmount)}</span>;
                        }
                    },
                    {
                        title: '盈率',
                        key: 'winRate',
                        align: 'center',
                        minWidth: 70,
                        render: (h, params) => {
                            let color = params.row.winRate > 0 ? '#FF2626' : 'rgb(35, 153, 97) ';
                            return <span style={{ color }}>{params.row.winRate}%</span>;
                        }
                    },
                    {
                        align: 'center',
                        minWidth: 150,
                        tooltip: 'custom',
                        renderHeader: (h, params) => (
                            <Poptip trigger="hover" placement="right-end" content="平台方活动" transfer style={{ verticalAlign: 'middle' }}>
                                <span>活动类型</span>
                                <Icons color="#b3b3b3" type="bangzhutishi" class="ml5" />
                            </Poptip>
                        ),
                        render: (h, params) => {
                            return params.row.activity
                                ? params.row.activity.length
                                    ? params.row.activity.map(item => {
                                          return h(
                                              'div',
                                              {
                                                  style: {
                                                      color: '#666666'
                                                  }
                                              },
                                              item.typeName
                                          );
                                      })
                                    : h('span', '-')
                                : h('span', '-');
                        },
                        width: '200'
                    },
                    {
                        title: '活动人数',
                        key: 'activity',
                        align: 'center',
                        minWidth: 55,
                        render: (h, params) => {
                            return params.row.activity
                                ? params.row.activity.length
                                    ? params.row.activity.map(item => {
                                          return h(
                                              'div',
                                              {
                                                  style: {
                                                      color: '#666666'
                                                  }
                                              },
                                              item.actUser
                                          );
                                      })
                                    : h('span', '-')
                                : h('span', '-');
                        }
                    },
                    {
                        title: '活动金额',
                        key: 'c',
                        align: 'center',
                        minWidth: 75,
                        render: (h, params) => {
                            return params.row.activity
                                ? params.row.activity.length
                                    ? params.row.activity.map(item => {
                                          return h(
                                              'div',
                                              {
                                                  style: {
                                                      color: '#666666'
                                                  }
                                              },
                                              item.amount
                                          );
                                      })
                                    : h('span', '-')
                                : h('span', '-');
                        }
                    }
                ]
            }
        };
    },
    beforeRouteEnter(to, from, next) {
      next(vm=>{
        if(from.name=='memberAudit' || from.name == 'auditDetails'){
            vm.Time[0] = vm.$route.query.startTime;
            vm.Time[1] = vm.$route.query.endTime;

            vm.searchKey.userName = vm.$route.query.userName;
            vm.searchKey.startTime = vm.$route.query.startTime;
            vm.searchKey.endTime = vm.$route.query.endTime;
            vm.getData(vm.searchKey);
        }
      })
  },
    created() {
        this.$nextTick(() => {
            this.$refs.GameSelect.init();
            this.getData(this.searchKey);
        });
    },
    watch: {
        downUrl() {
            window.open(`http://${this.downUrl}`, '_blank');
        }
    },
    methods: {
        goDetailPage(params) {
            const { platform, platformName } = params.row;
            const { timeType, userName } = this.searchKey;
            let [startTime, endTime] = this.Time;
            startTime = this.$root.formatTimeS(startTime);
            endTime = this.$root.formatnightTimeS(endTime);
            this.$router.push({
                name: 'platformReportDetail',
                query: {
                    platform,
                    startTime,
                    endTime,
                    timeType,
                    platformName,
                    userName
                }
            });
        },
        sortChange({ column, key, order }) {
            delete this.searchKey.sortKey;
            delete this.searchKey.sortVal;
            let data = {
                sortKey: key,
                sortVal: order,
                ...this.searchKey,
                siteId: this.$root.nowSite.id
            };
            this.searchKey.sortKey = key;
            if (data.sortVal == 'normal') {
                this.table.columns.forEach(item => {
                    if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                });
                this.searchKey.sortVal = 'asc';
                data.sortVal = 'asc';
            } else {
                this.searchKey.sortVal = order;
                this.table.columns.forEach(item => delete item.sortType);
            }
            this.getData(data);
        },
        checkAll(res) {
            return res === 'ALL' ? Reflect.deleteProperty(this.searchKey, 'type') : false;
        },
        onGameChange(res) {
            if (this.checkAll(res)) return;
            this.searchKey.type = res;
        },
        getData(data) {
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.$root.startTableLoading();
            if (data.isLike) data.isLike = Number(data.isLike);
            if (!data.type) delete data.type;
            getplatformReportData(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { list, total } = res.data;
                    list.length && list.push(this.createTotalData(total));
                    this.table.data = list;
                }
                this.$root.endTableLoading();
            }).catch(error=> this.$root.endTableLoading());
        },
        clearData() {
            delete this.searchKey.type;
        },
        createTotalData(total) {
            const { betUser, betCount, betAmount, validBetAmount, netAmount, winRate, actUser, actAmount } = total;
            let item = {
                platformName: '总计',
                betUser,
                betCount,
                betAmount,
                validBetAmount,
                netAmount,
                winRate,
                actUser,
                actAmount
            };
            return item;
        },
        exportExcel() {
            let params = { ...this.searchKey };
            const { timeType } = params;
            if (timeType == 'cn') {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    params.startTime = startTime && this.$root.formatTimeS(startTime);
                    params.endTime = endTime && this.$root.formatnightTimeS(endTime);
                } else return false;
            } else {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    params.startTime = startTime && this.$root.enTimeS(startTime);
                    params.endTime = endTime && this.$root.enNightTime(endTime);
                } else return false;
            }
            let { startTime, endTime } = params;
            this.searchKey.startTime = startTime;
            this.searchKey.endTime = endTime;

            if (!params.userName) delete params.isLike;

            if (params.userName) params.userName = this.$root.trimAll(params.userName);
            if (!this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            params.isExport = 1;
            this.$root.startEditLoading(this);
            let openr = window.open();
            getplatformReportData(params,true).then(res => {
                if (res.code == 200) {
                    let region = res.data.downloadUrl;
                    let nowHost = region.split('.com')[1];
                    let openr1 = openr ? openr : window;
                    openr1.location.href = nowHost;
                } else {
                    openr.close();
                }
            });
        },

        searchSubmit() {
            let { sortKey, sortVal } = this.searchKey;
            if (sortKey) delete this.searchKey.sortKey;
            if (sortVal) delete this.searchKey.sortVal;
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });

            if (!this.searchKey.siteName) delete this.searchKey.siteName;
            let params = { ...this.searchKey };

            const { timeType } = params;
            if (timeType == 'cn') {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    params.startTime = startTime && this.$root.formatTimeS(startTime);
                    params.endTime = endTime && this.$root.formatnightTimeS(endTime);
                } else return false;
            } else {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    params.startTime = startTime && this.$root.enTimeS(startTime);
                    params.endTime = endTime && this.$root.enNightTime(endTime);
                } else return false;
            }
            let { startTime, endTime } = params;
            this.searchKey.startTime = startTime;
            this.searchKey.endTime = endTime;
            if (!params.userName) delete params.isLike, delete params.userName;
            if (params.userName) params.userName = this.$root.trimAll(params.userName);
            if (!this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.getData(params);
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
.w985 {
    width: 9.7%;
}
.w983 {
    width: 9.7%;
}
.w115 {
    width: 11%;
}
.w102 {
    width: 10%;
}
.w1015 {
    width: 10.15%;
}
.w840 {
    width: 8.4%;
}
.w1014 {
    width: 10.14%;
}
.w200x {
    width: 200px;
}
.w97 {
    width: 9.7%;
}

/deep/.ivu-table-row {
    td {
        // &:nth-child(3) {
        // 	.ivu-table-cell {
        // 		color: rgb(35, 153, 97);
        // 	}
        // }
    }
}
</style>
