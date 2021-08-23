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
                    <p>用户<b>当日</b>在指定时间内，通过指定渠道完成存款目标时，可领取相应礼金。</p>
                </div>
                <div class="mt20">
                    <p>参数说明：</p>
                    <p>时间范围—指定完成任务的时间段；</p>
                    <p>存款渠道—要求通过该渠道完成存款，可以是单个或多个渠道；</p>
                    <p>存款金额—用户需满足的存款金额；</p>
                    <p>奖金金额—满足条件后，可领取的奖金金额；</p>
                    <p>单笔充值—要求用户单次充值达到指定金额；</p>
                    <p>累计充值—仅要求用户时间段内充值达到指定金额；</p>
                </div>
            </div>
    </div>
</template>

<script>
import Tables from '_c/tables';
import Icons from '_c/icons';
import { getActiveChessTaskConfigList, delActiveChessTaskConfigDel, getActiveChessTaskPayClassShow } from '@/api/activity';
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
                        minWidth: 120,
                        render: (h, params) => {
                            let timeType = params.row.time == 'today' ? '当日累计' : params.row.time + '日起';
                            if (!this.isEdit) {
                                return <span>{params.row.time}</span>;
                            } else {
                                return (
                                    'div',
                                    [
                                        h(
                                            'span',
                                            {
                                                style: {
                                                    display: params.row.time == 'today' && this.table.data[params.index].count_type == 'today' ? 'inline-block' : 'none'
                                                }
                                            },
                                            timeType
                                        ),
                                        h('TimePicker', {
                                            class: 'w30 ib',
                                            style: {
                                                display: params.row.time != 'today' || this.table.data[params.index].count_type != 'today' ? 'inline-block' : 'none'
                                            },
                                            props: {
                                                value: this.table.data[params.index].time_range[0],
                                                placeholder: '开始时间',
                                                type: 'time',
                                                format: 'HH:mm',
                                                transfer: true
                                            },
                                            on: {
                                                'on-change': e => {
                                                    this.table.data[params.index].time_range[0] = e;
                                                    let startTime = this.table.data[params.index].time_range[0];
                                                    let endTime = this.table.data[params.index].time_range[1];
                                                    this.table.data[params.index].time = startTime + '-' + endTime;
                                                }
                                            }
                                        }),
                                        h('span', { class: 'h36 ml10 mr10' }, '-'),
                                        h('TimePicker', {
                                            class: 'w30 ib',
                                            style: {
                                                display: params.row.time != 'today' || this.table.data[params.index].count_type != 'today' ? 'inline-block' : 'none'
                                            },
                                            props: {
                                                value: this.table.data[params.index].time_range[1],
                                                placeholder: '结束时间',
                                                type: 'time',
                                                format: 'HH:mm',
                                                transfer: true
                                            },
                                            on: {
                                                'on-change': e => {
                                                    this.table.data[params.index].time_range[1] = e;
                                                    let startTime = this.table.data[params.index].time_range[0];
                                                    let endTime = this.table.data[params.index].time_range[1];
                                                    this.table.data[params.index].time = startTime + '-' + endTime;
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
                        title: '存款渠道',
                        key: 'pay_name"',
                        align: 'center',
                        minWidth: 280,
                        render: (h, params) => {
                            return (
                                'div',
                                [
                                    h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, params.row.pay_name),
                                    h(
                                        'Select',
                                        {
                                            class: 'ck w400x mr50',
                                            style: { display: this.isEdit ? 'inline-block' : 'none' },
                                            props: {
                                                value: this.table.data[params.index].pay_id,
                                                placeholder: '选择支付渠道',
                                                transfer: true,
                                                labelInValue: true,
                                                clearable: true,
                                                multiple: true
                                            },
                                            on: {
                                                'on-change': e => {
                                                    let pay_name = [];
                                                    let pay_id = [];
                                                    e.forEach(t => {
                                                        pay_name.push(t.label);
                                                        pay_id.push(t.value);
                                                    });
                                                    this.table.data[params.index].pay_name = pay_name.join(',');
                                                    this.table.data[params.index].pay_id = pay_id;
                                                    this.sendMsg();
                                                }
                                            }
                                        },
                                        this.payList.map(item => {
                                            return h('Option', {
                                                props: {
                                                    value: item.pay_id,
                                                    label: item.pay_name
                                                }
                                            });
                                        })
                                    )
                                ]
                            );
                        }
                    },
                    {
                        title: '存款金额',
                        key: 'pay_money',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            return (
                                'div',
                                [
                                    h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.pay_money).toFixed(2)),
                                    h('InputNumber', {
                                        class: 'w50',
                                        style: { display: this.isEdit ? 'inline-block' : 'none' },
                                        props: {
                                            value: Number(params.row.pay_money),
                                            min: 0,
                                            max: 9999999999
                                            // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                        },
                                        on: {
                                            'on-change': e => {
                                                if (!e) e = 0;
                                                this.table.data[params.index].pay_money = e;
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
                        minWidth: 100,
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
                        minWidth: 100,
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
                                                    this.sendMsg();
                                                }
                                            }
                                        },
                                        [
                                            h(
                                                'Option',
                                                {
                                                    props: {
                                                        value: 'one'
                                                    }
                                                },
                                                '单笔充值'
                                            ),
                                            h(
                                                'Option',
                                                {
                                                    props: {
                                                        value: 'total'
                                                    }
                                                },
                                                '累计充值'
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
            level_id: '',
            payList: []
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
                        this.getPaySelect();
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
                time_range: [],
                time: '',
                pay_name: '',
                pay_id: '',
                pay_money: 0,
                gift_money: 0,
                count_type: ''
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
        },
        getPaySelect() {
            let data = { siteId: this.$root.nowSite.id };
            getActiveChessTaskPayClassShow(data).then(res => {
                if (res != undefined && res.code == 200) {
                    this.payList = res.data;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../../styles/button.less';
@import '../../../../styles/class.less';
.footer {
    border: 1px solid #dcdcdc;
    border-top: 0;
    line-height: 48px;
}
/deep/.ck {
    text-align: left;
}
</style>