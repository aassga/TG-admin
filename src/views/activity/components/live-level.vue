<template>
    <Tables :loading="$root.tableLoading" :value="table.data" :total="table.total" :columns="table.columns" :page="false"></Tables>
</template>
<script>
import { jinGuanJiaLevelList } from '@/api/activity';
import Tables from '_c/tables';
export default {
    components: { Tables },
    data() {
        return {
            table: {
                total: 100,
                data: [],
                loading: true,
                columns: [
                    {
                        title: '金管家等级',
                        key: 'level',
                        align: 'center',
                        minWidth: 65,
                        render: (h, params) => {
                            return <span className="">{params.row.level}级</span>;
                        }
                    },
                    {
                        title: '累计打码',
                        key: 'betTotal',
                        align: 'center',
                        minWidth: 85
                    },
                    {
                        title: '晋级礼金',
                        key: 'levelMoney',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '月俸禄',
                        key: 'monthMoney',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '可借额度',
                        key: 'jiebeiTotal',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '晋级赠送总额',
                        key: 'levelMoneyTotal',
                        align: 'center',
                        minWidth: 85
                    },
                    {
                        title: '月俸禄赠送总额',
                        key: 'monthMoneyTotal',
                        align: 'center',
                        minWidth: 90
                    }
                    // {
                    //   title: "更新时间",
                    //   key: "updateTime",
                    //   align: "center",
                    //   minWidth: 120
                    // }
                ]
            }
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$root.startTableLoading(this);
            const data = {
                active_type: 'shixun',
                siteId: this.$root.nowSite.id
            };
            let newData = [];
            jinGuanJiaLevelList(data).then(res => {
                // 方法一
                // let newData1 = []
                // for (let key in res.data) {
                //   newData1.push(res.data[key])
                // }
                //对象套对象转化为数组

                // 方法二
                if (res != undefined && res.code == 200) {
                    res.data[Symbol.iterator] = function*() {
                        let index = 0;
                        while (this[index]) {
                            yield this[index];
                            index++;
                        }
                    };
                    newData = [...res.data];
                    newData.push(res.data['总计']);
                    this.table.data = newData;
                }
                this.$root.endTableLoading();
            }).catch(error=> this.$root.endTableLoading());
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
