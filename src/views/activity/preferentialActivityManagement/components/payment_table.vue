<template>
    <div>
        <Tables ref="table" :value="table.data" :columns="table.columns" :page="false" :loading="$root.tableLoading"> </Tables>
        <div slot="footer" v-show="level_id">
            <footer class="txt-a footer c62Color cs" style="background: #f4faff;" v-if="isEdit && table.data.length < 100" @click.prevent="addConfig" @click="sendMsg">
                <Icons type="xinzeng" size="14" class="mr5"></Icons>添加
            </footer>
        </div>
        <div slot="more" class="mt30 iconColor ft14">
            <div>*温馨提示：达到每一条件均可领取一次，实时结算，实时可领（统计时间依据北京时间）</div>
            <div class="mt20">
                <p>*活动规则：</p>
                <p>用户当日完成<b>累计充值</b>与<b>打码</b>条件后可领取相应礼金。</p>
            </div>
            <div class="mt20">
                <p>参数说明：</p>
                <p>时间范围—分为当日累计与时间段累计。当日累计，只计当日金额，时间段累计，将根据起始日期至今的数据进行统计；</p>
                <p>存款金额—用户需满足的存款金额；</p>
                <p>打码倍数—用户需满足的打码倍数；</p>
                <p>奖金金额—满足条件后，可领取的奖金金额；</p>
            </div>
        </div>
    </div>
</template>

<script>
import Tables from '_c/tables';
import Icons from '_c/icons';
import { getActiveChessTaskConfigList, delActiveChessTaskConfigDel } from '@/api/activity';
export default {
    props: ['data', 'index', 'isEdit'],
    components: {
        Tables,
        Icons
    },
    data() {
        return {
            table: {
                data: [],
                columns: [
                    {
                        title: '时间范围',
                        key: 'time"',
                        align: 'center',
                        render: (h, params) => {
                            let timeType = params.row.time == 'today' ? '当日累计' : params.row.time + '日起';
                            if (!this.isEdit) {
                                return <span>{timeType}</span>;
                            } else {
                                return (
                                    'div',
                                    [
                                        h(
                                            'span',
                                            {
                                                style: {
                                                    display: params.row.time == 'today' || this.table.data[params.index].count_type == 'today' ? 'inline-block' : 'none'
                                                }
                                            },
                                            '当日累计'
                                        ),
                                        h('DatePicker', {
                                            class: 's-130 s-120',
                                            style: {
                                                display: params.row.time != 'today' && this.table.data[params.index].count_type != 'today' ? 'inline-block' : 'none'
                                            },
                                            props: {
                                                value: this.table.data[params.index].time,
                                                placeholder: '选择时间范围',
                                                type: 'date',
                                                transfer: true,
                                                clearable: true
                                            },
                                            on: {
                                                'on-change': e => {
                                                    this.table.data[params.index].time = e;
                                                    this.sendMsg();
                                                }
                                            }
                                        })
                                    ]
                                );
                            }
                        }
                    },
                    {
                        title: '存款金额',
                        key: 'pay"',
                        align: 'center',
                        render: (h, params) => {
                            return (
                                'div',
                                [
                                    h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.pay).toFixed(2)),
                                    h('InputNumber', {
                                        class: 'w50',
                                        style: { display: this.isEdit ? 'inline-block' : 'none' },
                                        props: {
                                            value: Number(params.row.pay),
                                            min: 0,
                                            max: 9999999999
                                            // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                        },
                                        on: {
                                            'on-change': e => {
                                                if (!e) e = 0;
                                                this.table.data[params.index].pay = e;
                                                this.sendMsg();
                                            }
                                        }
                                    })
                                ]
                            );
                        }
                    },
                    {
                        title: '打码倍数',
                        key: 'bet_multiple',
                        align: 'center',
                        render: (h, params) => {
                            return (
                                'div',
                                [
                                    h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.bet_multiple)),
                                    h('InputNumber', {
                                        class: 'w50',
                                        style: { display: this.isEdit ? 'inline-block' : 'none' },
                                        props: {
                                            value: Number(params.row.bet_multiple),
                                            min: 0,
                                            max: 9999999999
                                            // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                        },
                                        on: {
                                            'on-change': e => {
                                                if (!e) e = 0;
                                                this.table.data[params.index].bet_multiple = e;
                                                this.sendMsg();
                                            }
                                        }
                                    })
                                ]
                            );
                        }
                    },
                    {
                        title: '奖金金额',
                        key: 'gift_money',
                        align: 'center',
                        render: (h, params) => {
                            return (
                                'div',
                                [
                                    h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.gift_money).toFixed(2)),
                                    h('InputNumber', {
                                        class: 'w50',
                                        style: { display: this.isEdit ? 'inline-block' : 'none' },
                                        props: {
                                            value: Number(params.row.gift_money),
                                            min: 0,
                                            max: 9999999999
                                            // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                        },
                                        on: {
                                            'on-change': e => {
                                                if (!e) e = 0;
                                                this.table.data[params.index].gift_money = e;
                                                this.sendMsg();
                                            }
                                        }
                                    })
                                ]
                            );
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return (
                                'div',
                                [
                                    h(
                                        'Select',
                                        {
                                            class: 'w150x mr50',
                                            props: {
                                                value: this.table.data[params.index].count_type,
                                                disabled: this.isEdit ? false : true,
                                                transfer: true
                                            },
                                            on: {
                                                'on-change': val => {
                                                    if (val == 'time') this.table.data[params.index].time = '';
                                                    this.table.data[params.index].count_type = val;
                                                }
                                            }
                                        },
                                        [
                                            h(
                                                'Option',
                                                {
                                                    props: {
                                                        value: 'today'
                                                    }
                                                },
                                                '当日累计'
                                            ),
                                            h(
                                                'Option',
                                                {
                                                    props: {
                                                        value: 'time'
                                                    }
                                                },
                                                '时间段累计'
                                            )
                                        ]
                                    ),
                                    h(
                                        'span',
                                        {
                                            class: 'blue-font',
                                            on: {
                                                click: () => {
                                                    if (params.row.id != undefined) this.onDelete(params);
                                                    else this.delConfig(params);
                                                }
                                            }
                                        },

                                        '删除'
                                    )
                                ]
                            );
                        }
                    }
                ]
            },
            obj: {},
            level_id: ''
        };
    },
    watch: {
        data: {
            deep: true,
            handler(newVal, oldVal) {
                this.$nextTick(() => {
                    this.data = newVal;
                    if (this.data.length&&this.data[this.index].active_type) {
                        let { active_type, id } = { ...this.data[this.index] };
                        this.level_id = id;
                        let params = { siteId: this.$root.nowSite.id, active_type: active_type, level_id: id };
                        this.getList(params);
                    } else {
                        this.table.data = [];
                        this.level_id = null;
                    }
                });
            }
        }
    },

    mounted() {},
    methods: {
        getList(data) {
            let newArr = [];
            this.$root.startTableLoading();
            getActiveChessTaskConfigList(data)
                .then(res => {
                    if (res != undefined || res.code == 200 || res.code != 400) {
                        let arr = [];
                        arr = JSON.parse(JSON.stringify(res.data));
                        arr.forEach(key => {
                            for (let t in key) {
                                if (t == 'condition') {
                                    newArr.push(JSON.parse(key[t]));
                                }
                            }
                        });
                        if (newArr.length) {
                            this.table.data = newArr;
                        } else {
                            this.table.data = [];
                        }
                        this.$root.endTableLoading();
                    }
                })
                .catch(error => this.$root.endTableLoading());
        },
        addConfig() {
            this.obj = {
                time: 'today',
                pay: 0,
                bet_multiple: 0,
                gift_money: 0,
                count_type: 'today'
            };

            this.table.data.push(this.obj);
        },
        sendMsg() {
            this.$emit('sendMsg', this.table.data);
        },
        onDelete(params) {
            let text = `您确定删除此条记录吗？`;
            let msg = `删除成功`;
            const data = {
                siteId: this.$root.nowSite.id,
                id: params.row.id,
                status: 'delete'
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    this.$root.startTableLoading();
                    delActiveChessTaskConfigDel(data, true)
                        .then(res => {
                            if (res != undefined && res.code == 200) {
                                this.$Message.success({ content: msg });
                                this.table.data.splice(params.index, 1);
                                this.$root.endTableLoading();
                            }
                        })
                        .catch(error => this.$root.endTableLoading());
                }
            });
        },
        //删除活动配置
        delConfig(params) {
            //取消
            this.table.data.splice(params.index, 1);
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../../styles/button.less';
.footer {
    border: 1px solid #dcdcdc;
    border-top: 0;
    line-height: 48px;
}
</style>