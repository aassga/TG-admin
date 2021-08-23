<template>
    <Tables :loading="$root.tableLoading" :value="table.data" :total="table.total" :columns="table.columns" :page="false"></Tables>
</template>
<script>
// import { levelMan } from "@/api/data";
import { jinGuanJiaLevelList } from '@/api/activity';
import Tables from '_c/tables';
export default {
    props: ['type'], //chess || game || lottery
    components: { Tables },
    data() {
        return {
            newType: '',
            table: {
                data: [],
                loading: true,
                columns: [
                    {
                        title: '金管家等级',
                        key: 'level',
                        align: 'center',
                        minWidth: 75,
                        render: (h, params) => {
                            return <span className="">{params.row.level}级</span>;
                        }
                    },
                    {
                        title: '累计打码',
                        key: 'betTotal',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '晋级礼金',
                        key: 'levelMoney',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '月俸禄',
                        key: 'monthMoney',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '周俸禄',
                        key: 'weekMoney',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '可借额度',
                        key: 'jiebeiTotal',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '晋级赠送总额',
                        key: 'levelMoneyTotal',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '月俸禄赠送总额',
                        key: 'monthMoneyTotal',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '周俸禄赠送总额',
                        key: 'weekMoneyTotal',
                        align: 'center',
                        minWidth: 75
                    }
                    // {
                    // 	title: "更新时间",
                    // 	key: "updateTime",
                    // 	align: "center",
                    // 	minWidth:120,
                    // }
                ]
            }
        };
    },
    watch: {
        type: {
            handler(val, oldVal) {
                this.newType = val;
                this.getData();
            },
            immediate: true
        }
    },
    methods: {
        getData() {
            this.$root.startTableLoading(this);
            const data = {
                active_type: this.newType,
                siteId: this.$root.nowSite.id
            };
            jinGuanJiaLevelList(data).then(res => {
                let newData = [];
                for (let key in res.data) {
                    newData.push(res.data[key]);
                }
                this.table.data = newData;
                this.$root.endTableLoading();
            }).catch(error=> this.$root.endTableLoading());
        },
        totalData() {
            let item = {
                level: '总计',
                code: '-',
                bonus: '-',
                monWage: '-',
                weekWage: '-',
                borrowLimit: '-',
                bonusUp: '200000000.00',
                monthUp: '200000000.00',
                weekUp: '200000000.00',
                updateTime: '-'
            };
            return item;
        }
    }
};
</script>
<style lang="less" scoped>
/deep/.ivu-table-header {
    font-size: 1rem;
    font-weight: normal;
    .ivu-table-cell {
        font-weight: 549;
    }
}
/deep/.ivu-table {
    color: #444;
}
</style>

