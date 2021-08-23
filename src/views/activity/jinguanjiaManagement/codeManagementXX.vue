<template>
    <div v-show="modeBtns.length">
        <div class="v2-search">
            <Form ref="searchKey" inline class="pb10">
                <FormItem label="金管家等级">
                    <Select v-model="searchKey.level" class="s-86" clearable placeholder="全部">
                        <Option v-for="(item, i) in levelList" :key="'level' + i" :value="item.value">{{ item.name }}级</Option>
                    </Select>
                </FormItem>
                <FormItem label="锁定状态">
                    <Select v-model="searchKey.status" class="s-86" placeholder="全部" clearable>
                        <Option value="no">未锁定</Option>
                        <Option value="yes">已锁定</Option>
                    </Select>
                </FormItem>
                <FormItem label="会员账号">
                    <Input placeholder="多个请以,逗号隔开" @keyup.enter.native="searchSubmit" class="s-160" v-model="searchKey.userName" />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" :loading="$root.tableLoading" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
          
                <Button
                    v-show="!isEdit && table.data.length"
                    class="bb-color blue-bd w80x fr "
                    style="height:36px"
                    @click.prevent="
                        () => {
                            isEdit = !isEdit;
                        }
                    "
                    :loading="$root.tableLoading"
                    >编辑</Button
                >
                    

                <div class="ib fr" v-show="isEdit">
                    <Button class="w80x ml20 fr" @click.prevent="cancel" style="height:36px" :loading="$root.tableLoading">取消</Button>
                    <Button type="primary" class="blue-bd w80x fr" style="height:36px" :loading="$root.tableLoading" @click.prevent="statusSave">保存</Button>
                </div>
                  <Button   class="bb-color blue-bd w80x fr  mr10"
                    style="height:36px" @click="batchEdit"  >批量编辑</Button>
            </Form>
        </div>
        <div class="v2-search bb">
            <span v-for="item in modeBtns" :key="item.id" v-if="item.id!=0" class="modeBtns ib cs ft16" @click="changeType(item)" :class="searchKey.classId == item.id ? 'active' : ''">{{
                item.class_name
            }}</span>
        </div>
        <div class="v2-table" v-if="modeBtns.length">
            <Tables
                ref="table"
                :value="table.data"
                :columns="table.columns"
                :total="table.total"
                :loading="$root.tableLoading"
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
            >
            </Tables>
        </div>
        <Modals  ref="editModals"  title="批量编辑" :width="800" :height="400">
             <div slot="content">
                  <Form :label-width="220" ref="formKey" :model="formKey" :rules="rules">
                      <FormItem label="类别" >
                          <!-- <Select class="w400x"  v-model="modeBtns[0].id"  disabled>
                              <Option v-for="(t,i) in  modeBtns" :key="i" :value="t.id"  v-if="t.id!=0"  > 
                                  {{ t.class_name}}
                              </Option>
                          </Select> -->
                            <Input class="w400x"  v-model="this.searchKey.calssName"  disabled />
                         
                      </FormItem>
                      <FormItem label="批量累计打码">

                          	<Input
				    v-model="formKey.updateData"
                    class="w400x"
					@on-change="testUserNum"
					:rows="10"
					type="textarea"
				
					placeholder="*格式为*:账号,金额 例如:a123,100 注意逗号为英文格式,一行一个,最多操作10000个用户"
				/>
                      </FormItem>
                      <FormItem>
                             <Button
					type="primary"
					class="h50 w160x ft20 ml110"
					@click.prevent="addSubmit"
					:loading="$root.editBtnLoading"
					:disabled="disabledBtn"
				>确定添加</Button>
                      </FormItem>
                   
                  </Form>
                  
             </div>
        </Modals>
    </div>
</template>
<script>
import { jinGuanJiaClassList, jinGuanJiaBetList, jinGuanJiaBetEdit,jinGuanJiaBetBatEdit} from '@/api/activity';
import Tables from '_c/tables';
import Icons from '_c/icons';
import Modals from "@/components/modals";
export default {
    name: 'codeManagement',
    components: {
        Icons,
        Tables,
        Modals
    },
    data() {
        return {
				disabledBtn: false,
            formKey:{
              classId:'',
              updateData:'',
              siteId:this.$root.nowSite.id,
            },
            rules:{
                //   classId: [
                //     { required: true, message: '请添加类别', trigger: 'change',pattern: /.+/ },
                //     // { required: true, pattern: /(^(\d{9,30})$)|\*+/, message: '请输入正确的银行卡卡号', trigger: 'blur' }
                // ],

            },
            className: '',
            modeBtns: [], //模式导航按钮
            levelList: [], //等级列表
            newLiveData: [], //视讯改变状态之后的数据
            newOtherData: [], //其他平台改变之后的数据
            currentBtn: 'shixun', //默认加载视讯页面
            searchKey: {
                siteId: this.$root.nowSite.id,
                classId: '',
                status: '',
                level: '',
                userName: '',
                limit: 20
            },
            isEdit: false,
            table: {
                pageSizeOpts: [20, 30, 40, 50],
                total: 0,
                data: [],
                columns: [
                    {
                        title: '金管家打码奖励',
                        key: 'code_gift_money_requirement',
                        align: 'center',
                        className:'bb13',
                        children: [
                            {
                                title: '会员账号',
                                key: 'userName',
                                align: 'center',
                                minWidth: 80,
                                tooltip: true
                            },
                            {
                                title: '金管家等级',
                                key: 'level',
                                align: 'center',
                                minWidth: 85,
                                render: (h, params) => {
                                    return <span>{params.row.level}级</span>;
                                }
                            },
                            {
                                title: '累积打码',
                                key: 'bet_money',
                                align: 'center',
                                minWidth: 100,
                                className: 'pl10 pr10',
                                render: (h, params) =>
                                    h('div', [
                                        h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.bet_money).toFixed(2)),
                                        h('InputNumber', {
                                            class: 'w100',
                                            style: { display: this.isEdit ? 'inline-block' : 'none' },
                                            props: {
                                                value: Number(params.row.bet_money),
                                                min: 0,
                                                max: 9999999999
                                                // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                            },
                                            on: {
                                                'on-change': e => {
                                                    if (!e) e = 0;
                                                    this.table.data[params.index].bet_money = e;
                                                }
                                            }
                                        })
                                    ])
                            },
                            {
                                title: '晋级礼金',
                                key: 'level_gift_money',
                                align: 'center',
                                minWidth: 70,
                                render: (h, params) =>
                                    h('div', [
                                        h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.level_gift_money).toFixed(2)),
                                        h('InputNumber', {
                                            class: 'w100',
                                            style: { display: this.isEdit ? 'inline-block' : 'none' },
                                            props: {
                                                value: Number(params.row.level_gift_money),
                                                min: 0,
                                                max: 99999999
                                                // formatter:value =>this.table.data[params.index].level_gift_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                            },
                                            on: {
                                                'on-change': e => {
                                                    if (!e) e = 0;
                                                    this.table.data[params.index].level_gift_money = e;
                                                }
                                            }
                                        })
                                    ])
                            },
                            {
                                title: '周俸禄',
                                key: 'week_gift_money',
                                align: 'center',
                                minWidth: 60,
                                render: (h, params) =>
                                    h('div', [
                                        h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.week_gift_money).toFixed(2)),
                                        h('InputNumber', {
                                            class: 'w100',
                                            style: { display: this.isEdit ? 'inline-block' : 'none' },
                                            props: {
                                                value: Number(params.row.week_gift_money),
                                                min: 0,
                                                max: 99999999
                                                //  formatter:value =>this.table.data[params.index].week_gift_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                            },
                                            on: {
                                                'on-change': e => {
                                                    if (!e) e = 0;
                                                    this.table.data[params.index].week_gift_money = e;
                                                }
                                            }
                                        })
                                    ])
                            },
                            {
                                title: '月俸禄',
                                key: 'month_gift_money',
                                align: 'center',
                                minWidth: 60,
                                render: (h, params) =>
                                    h('div', [
                                        h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.month_gift_money).toFixed(2)),
                                        h('InputNumber', {
                                            class: 'w100',
                                            style: { display: this.isEdit ? 'inline-block' : 'none' },
                                            props: {
                                                value: Number(params.row.month_gift_money),
                                                min: 0,
                                                max: 99999999
                                                // formatter:value =>this.table.data[params.index].month_gift_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                            },
                                            on: {
                                                'on-change': e => {
                                                    if (!e) e = 0;
                                                    this.table.data[params.index].month_gift_money = e;
                                                }
                                            }
                                        })
                                    ])
                            }
                        ]
                    },

                    {
                        title: '周俸禄/月俸禄达标情况',
                        key: 'week_gift_money_requirement',
                        align: 'center',
                        className:'bb13',
                        children: [
                            // {
                            //     title: '当周存款',
                            //     key: 'payTotal',
                            //     align: 'center',
                            //     minWidth: 100,
                            //     className: 'pl10 pr10',
                            //     render: (h, params) =>
                            //         h('div', [
                            //             h(
                            //                 'span',
                            //                 { style: { display: !this.isEdit ? 'inline-block' : 'none' } },
                            //                 Number(params.row.week_gift_money_requirement.payTotal).toFixed(2)
                            //             ),
                            //             h('InputNumber', {
                            //                 class: 'w100',
                            //                 style: { display: this.isEdit ? 'inline-block' : 'none' },
                            //                 props: {
                            //                     value: Number(params.row.week_gift_money_requirement.payTotal),
                            //                     min: 0,
                            //                     max: 99999999
                            //                     //	formatter:value =>this.table.data[params.index].week_gift_money_requirement.payTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                            //                 },
                            //                 on: {
                            //                     'on-change': e => {
                            //                         if (!e) e = 0;
                            //                         this.table.data[params.index].week_gift_money_requirement.payTotal = e;
                            //                     }
                            //                 }
                            //             })
                            //         ])
                            // },
                            {
                                title: '当周打码',
                                key: 'betTotal',
                                align: 'center',
                                minWidth: 100,
                                className: 'pl10 pr10',
                                render: (h, params) =>
                                    h('div', [
                                        h(
                                            'span',
                                            { style: { display: !this.isEdit ? 'inline-block' : 'none' } },
                                            Number(params.row.week_gift_money_requirement.betTotal).toFixed(2)
                                        ),
                                        h('InputNumber', {
                                            class: 'w100',
                                            style: { display: this.isEdit ? 'inline-block' : 'none' },
                                            props: {
                                                value: Number(params.row.week_gift_money_requirement.betTotal),
                                                min: 0,
                                                max: 99999999
                                                //	formatter:value =>this.table.data[params.index].week_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                            },
                                            on: {
                                                'on-change': e => {
                                                    if (!e) e = 0;
                                                    this.table.data[params.index].week_gift_money_requirement.betTotal = e;
                                                }
                                            }
                                        })
                                    ])
                            },
                               {
                                title: '当月打码',
                                key: 'betTotal',
                                align: 'center',
                                className: 'pl10 pr10',
                                minWidth: 100,
                                render: (h, params) =>
                                    h('div', [
                                        h(
                                            'span',
                                            { style: { display: !this.isEdit ? 'inline-block' : 'none' } },
                                            Number(params.row.month_gift_money_requirement.betTotal).toFixed(2)
                                        ),
                                        h('InputNumber', {
                                            class: 'w100',
                                            style: { display: this.isEdit ? 'inline-block' : 'none' },
                                            props: {
                                                value: Number(params.row.month_gift_money_requirement.betTotal),
                                                min: 0,
                                                max: 99999999
                                                //	formatter:value =>this.table.data[params.index].month_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                            },
                                            on: {
                                                'on-change': e => {
                                                    if (!e) e = 0;
                                                    this.table.data[params.index].month_gift_money_requirement.betTotal = e;
                                                }
                                            }
                                        })
                                    ])
                            },
                            // {
                            //     title: '存款次数',
                            //     key: 'payCount',
                            //     align: 'center',
                            //     minWidth: 70,
                            //     render: (h, params) =>
                            //         h('div', [
                            //             h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.week_gift_money_requirement.payCount)),
                            //             h('InputNumber', {
                            //                 style: { display: this.isEdit ? 'inline-block' : 'none' },
                            //                 props: {
                            //                     value: Number(params.row.week_gift_money_requirement.payCount),
                            //                     min: 0,
                            //                     max: 99999999
                            //                     //	formatter:value =>this.table.data[params.index].week_gift_money_requirement.payCount= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                            //                 },
                            //                 on: {
                            //                     'on-change': e => {
                            //                         if (!e) e = 0;
                            //                         this.table.data[params.index].week_gift_money_requirement.payCount = e;
                            //                     }
                            //                 }
                            //             })
                            //         ])
                            // }
                        ]
                    },
                    // {
                    //     title: '月俸禄达标情况',
                    //     key: 'month_gift_money_requirement',
                    //     align: 'center',
                    //     className:'bb13',
                    //     children: [
                    //         // {
                    //         //     title: '当月存款',
                    //         //     key: 'payTotal',
                    //         //     align: 'center',
                    //         //     className: 'pl10 pr10',
                    //         //     minWidth: 100,
                    //         //     render: (h, params) =>
                    //         //         h('div', [
                    //         //             h(
                    //         //                 'span',
                    //         //                 { style: { display: !this.isEdit ? 'inline-block' : 'none' } },
                    //         //                 Number(params.row.month_gift_money_requirement.payTotal).toFixed(2)
                    //         //             ),
                    //         //             h('InputNumber', {
                    //         //                 class: 'w100',
                    //         //                 style: { display: this.isEdit ? 'inline-block' : 'none' },
                    //         //                 props: {
                    //         //                     value: Number(params.row.month_gift_money_requirement.payTotal),
                    //         //                     min: 0,
                    //         //                     max: 99999999
                    //         //                     //	formatter:value =>this.table.data[params.index].month_gift_money_requirement.payTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    //         //                 },
                    //         //                 on: {
                    //         //                     'on-change': e => {
                    //         //                         if (!e) e = 0;
                    //         //                         this.table.data[params.index].month_gift_money_requirement.payTotal = e;
                    //         //                     }
                    //         //                 }
                    //         //             })
                    //         //         ])
                    //         // },
                    //         // {
                    //         //     title: '当月打码',
                    //         //     key: 'betTotal',
                    //         //     align: 'center',
                    //         //     className: 'pl10 pr10',
                    //         //     minWidth: 100,
                    //         //     render: (h, params) =>
                    //         //         h('div', [
                    //         //             h(
                    //         //                 'span',
                    //         //                 { style: { display: !this.isEdit ? 'inline-block' : 'none' } },
                    //         //                 Number(params.row.month_gift_money_requirement.betTotal).toFixed(2)
                    //         //             ),
                    //         //             h('InputNumber', {
                    //         //                 class: 'w100',
                    //         //                 style: { display: this.isEdit ? 'inline-block' : 'none' },
                    //         //                 props: {
                    //         //                     value: Number(params.row.month_gift_money_requirement.betTotal),
                    //         //                     min: 0,
                    //         //                     max: 99999999
                    //         //                     //	formatter:value =>this.table.data[params.index].month_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    //         //                 },
                    //         //                 on: {
                    //         //                     'on-change': e => {
                    //         //                         if (!e) e = 0;
                    //         //                         this.table.data[params.index].month_gift_money_requirement.betTotal = e;
                    //         //                     }
                    //         //                 }
                    //         //             })
                    //         //         ])
                    //         // },
                    //         // {
                    //         //     title: '存款次数',
                    //         //     key: 'payCount',
                    //         //     align: 'center',
                    //         //     minWidth: 70,
                    //         //     render: (h, params) =>
                    //         //         h('div', [
                    //         //             h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.month_gift_money_requirement.payCount)),
                    //         //             h('InputNumber', {
                    //         //                 class: 'w100',
                    //         //                 style: { display: this.isEdit ? 'inline-block' : 'none' },
                    //         //                 props: {
                    //         //                     value: Number(params.row.month_gift_money_requirement.payCount),
                    //         //                     min: 0,
                    //         //                     max: 99999999
                    //         //                     //	formatter:value =>this.table.data[params.index].month_gift_money_requirement.payCount= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    //         //                 },
                    //         //                 on: {
                    //         //                     'on-change': e => {
                    //         //                         if (!e) e = 0;
                    //         //                         this.table.data[params.index].month_gift_money_requirement.payCount = e;
                    //         //                     }
                    //         //                 }
                    //         //             })
                    //         //         ])
                    //         // }
                    //     ]
                    // },
                    // {
                    //     title: '邀请者奖励',
                    //     key: 'month_gift_money_requirement',
                    //     align: 'center',
                    //     children: [
                    //         {
                    //             title: '礼金比例',
                    //             key: 'month_gift_percentage',
                    //             align: 'center',
                    //             minWidth: 90,
                    //             render: (h, params) =>
                    //                 h('div', [
                    //                     h(
                    //                         'span',
                    //                         { style: { display: !this.isEdit ? 'inline-block' : 'none' } },
                    //                         Number(params.row.month_gift_money_requirement.month_gift_percentage)
                    //                     ),
                    //                     h('InputNumber', {
                    //                         style: { display: this.isEdit ? 'inline-block' : 'none' },
                    //                         props: {
                    //                             value: Number(params.row.month_gift_money_requirement.month_gift_percentage),
                    //                             min: 0,
                    //                             max: 99999999
                    //                             //	formatter:value =>this.table.data[params.index].month_gift_money_requirement.month_gift_percentage= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    //                         },
                    //                         on: {
                    //                             'on-change': e => {
                    //                                 if (!e) e = 0;
                    //                                 this.table.data[params.index].month_gift_money_requirement.month_gift_percentage = e;
                    //                             }
                    //                         }
                    //                     }),
                    //                     h('span', { style: { display: !(!this.isEdit && params.row.level == 0) ? 'inline-block' : 'none' } }, '%')
                    //                 ])
                    //         },
                    //         {
                    //             title: '上限金额',
                    //             key: 'month_gift_limit',
                    //             align: 'center',
                    //             minWidth: 80,
                    //             className: 'pl10 pr10',
                    //             render: (h, params) =>
                    //                 h('div', [
                    //                     h(
                    //                         'span',
                    //                         { style: { display: !this.isEdit ? 'inline-block' : 'none' } },
                    //                         Number(params.row.month_gift_money_requirement.month_gift_limit).toFixed(2)
                    //                     ),
                    //                     h('InputNumber', {
                    //                         class: 'w100',
                    //                         style: { display: this.isEdit ? 'inline-block' : 'none' },
                    //                         class: 'w100',
                    //                         props: {
                    //                             value: Number(params.row.month_gift_money_requirement.month_gift_limit),
                    //                             min: 0,
                    //                             max: 99999999
                    //                             //	formatter:value =>this.table.data[params.index].month_gift_money_requirement.month_gift_limit= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    //                         },
                    //                         on: {
                    //                             'on-change': e => {
                    //                                 if (!e) e = 0;
                    //                                 this.table.data[params.index].month_gift_money_requirement.month_gift_limit = e;
                    //                             }
                    //                         }
                    //                     })
                    //                 ])
                    //         }
                    //     ]
                    // },
                    {
                        title: ' ',
                        align: 'center',
                        className:'bb13',
                        children: [
                            {
                                // title: "状态",
                                key: 'status',
                                align: 'center',
                                className: 'pl10 pr10',
                                minWidth: 55,
                                renderHeader: (h, params) => {
                                    return (
                                        <div>
                                            <span>状态</span>
                                            <Poptip trigger="hover" placement="top-end" transfer>
                                                <div slot="content">
                                                    <p>锁定会员不可自动晋级，可手动调节等级</p>
                                                </div>
                                                <Icons type="bangzhutishi" color="#E4E4E4" size="16" class="ib ml5" style="paddingLeft: 0px;" />
                                            </Poptip>
                                        </div>
                                    );
                                },
                                render: (h, params) => {
                                    let color = params.row.status == 'no' ? 'red' : '#2D8cF0';
                                    let input = (
                                        <Select v-model={this.table.data[params.index].status} transfer>
                                            <Option value="yes">未锁定</Option>
                                            <Option value="no">已锁定</Option>
                                        </Select>
                                    );
                                    if (this.isEdit) {
                                        return <div>{input}</div>;
                                    } else {
                                        return (
                                            <span
                                                class="cs"
                                                style={{ color }}
                                                onClick={() => {
                                                    this.setStatus(params);
                                                }}
                                            >
                                                {params.row.status == 'yes' ? '未锁定' : '已锁定'}
                                            </span>
                                        );
                                    }
                                }
                            }
                        ]
                    },
                    {
                        title: ' ',
                        align: 'center',
                        className:'bb13',
                        children: [
                            {
                                title: '更新时间',
                                key: 'updated_at',
                                align: 'center',
                                className: 'pl5 pr5',
                                minWidth: 130,
                                render: (h, params) => {
                                    return <span>{this.$root.returnDayTime(params.row.updated_at)}</span>;
                                }
                            }
                        ]
                    }
                ]
            }
        };
    },
    created() {
        this.$nextTick(() => {
            for (let i = 0; i < 101; i++) {
                this.levelList.push({ name: i, value: i });
            }
        });
    },
    mounted() {
        this.$nextTick(() => {
            jinGuanJiaClassList({ siteId: this.$root.nowSite.id, type: 'classNameList' }).then(res => {
                //获取当前模式
                if (res && res.code == 200) {
                    this.modeBtns = res.data;
                    if (res.data.length == 0) {
                        this.$Tip.info({ content: '当前站点未创建模式' });
                        return;
                    }
                    this.searchKey.classId = this.modeBtns[0].id;
                    this.searchKey.calssName=this.modeBtns[0].model_name;
                    let data = { ...this.searchKey };
                    this.getData({ params: data });
                }
            });
        });
    },
    methods: {
        addSubmit(){
           
            // this.$refs.formKey.validate(valid=>{
            //     if(valid){
                    
                    // if(!this.disabledBtn){
                      if(!this.formKey.updateData.includes(",")){
                          this.$Tip.info({
									content: "存入金额，名字与金额请以，英文逗号间隔"
								});
                        this.$root.endEditLoading();
								return false

                      }

                    // }
                  
                    let data={...this.formKey,siteId:this.$root.nowSite.id,
                    classId:this.searchKey.classId
                    };
                     jinGuanJiaBetBatEdit(data).then(res=>{
                         if(res!=undefined&&res.code==200){
                           	this.disabledBtn = true;
					this.$root.startEditLoading();
                    this.$refs.editModals.hide();
                     this.getData({ params: this.searchKey });

                         }
                     })

            //     }
            // })
           

        },
        testUserNum(e){
            	let arr = e.target.value.split(",");
				if (arr.length > 10000) {
					this.$Tip.info({
						content: "用户量太大，最多可操作一万个用户，请分批操作！"
					});
				}


        },
        batchEdit(){
            this.$refs.editModals.show();
            this.formKey={};
             this.$refs.formKey.resetFields();
             this.disabledBtn=false;
        },
        changeType(item) {
            const { id, class_name } = item;
            this.searchKey.classId = id;
            this.searchKey.className = class_name;
            let data = { ...this.searchKey };
            this.getData({ params: data });
        },
        getData(data) {
            let dataParams = data.params;
            for (let key in dataParams) {
                if (!dataParams[key]) delete dataParams[key];
            }
            this.$root.startTableLoading();
            for (let key in data) {
                if (!data[key] && data[key] != '0') delete data[key];
            }
            jinGuanJiaBetList(data)
                .then(res => {
                    if (res && res.code == 200) {
                        this.table.data = res.data.data;
                        this.table.total = res.data.total;
                        this.table.data.map(item => {
                            item.week_gift_money_requirement = JSON.parse(item.week_gift_money_requirement);
                            item.month_gift_money_requirement = JSON.parse(item.month_gift_money_requirement);
                        });
                        this.$root.endTableLoading();
                    }
                })
                .catch(error => this.$root.endTableLoading());
        },
        searchSubmit() {
            let params = { ...this.searchKey };
            if (params.userName) params.userName = this.$root.trimAll(params.userName);
            if (params.userName && params.userName.length < 5) {
                this.$Tip.success({ content: '会员账号小于5个字符！' });
                return false;
            }
            this.getData({ params });
        },
        statusSave() {
            //保存
            this.$root.startTableLoading();
            let newDate = [];
            this.table.data.map(item => {
                let obj = {
                    id: item.id,
                    bet_money: item.bet_money,
                    level_gift_money: item.level_gift_money,
                    week_gift_money: item.week_gift_money,
                    month_gift_money: item.month_gift_money,
                    week_gift_money_requirement: JSON.stringify(item.week_gift_money_requirement),
                    month_gift_money_requirement: JSON.stringify(item.month_gift_money_requirement),
                    status: item.status
                };
                newDate.push(obj);
            });
            let data = {
                siteId: this.$root.nowSite.id,
                classId: this.searchKey.classId,
                updateData: JSON.stringify(newDate)
            };
            jinGuanJiaBetEdit(data, true)
                .then(res => {
                    if (res && res.code == 200) {
                        this.isEdit = false;
                        this.$Message.success('修改成功');
                        this.getData({ params: this.searchKey });
                        this.$root.endTableLoading();
                    }
                })
                .catch(error => this.$root.endTableLoading());
        },
        // //取消编辑
        cancel() {
            this.isEdit = false;
            this.getData({ params: this.searchKey });
        },
        onPageChange(page) {
            let data = {
                ...this.searchKey,
                limit: this.searchKey.limit
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let data = {
                ...this.searchKey,
                limit: pageSize
            };
            this.getData({ params: data });
        },
        setStatus(params) {
            //修改锁定状态
            let msg = `您确定${params.row.status == 'yes' ? '锁定' : '解除锁定'}${this.className}【等级${params.row.level}】吗？`;
            this.$Tip.confirm({
                content: msg,
                onOk: () => {
                    this.$root.startTableLoading();
                    this.table.data[params.index].status = this.table.data[params.index].status == 'yes' ? 'no' : 'yes';
                    let newDate = [];
                    this.table.data.map(item => {
                        let obj = {
                            id: item.id,
                            bet_money: item.bet_money,
                            level_gift_money: item.level_gift_money,
                            week_gift_money: item.week_gift_money,
                            month_gift_money: item.month_gift_money,
                            week_gift_money_requirement: JSON.stringify(item.week_gift_money_requirement),
                            month_gift_money_requirement: JSON.stringify(item.month_gift_money_requirement),
                            status: item.status
                        };
                        newDate.push(obj);
                    });
                    let data = {
                        siteId: this.$root.nowSite.id,
                        classId: this.searchKey.classId,
                        updateData: JSON.stringify(newDate)
                    };
                    jinGuanJiaBetEdit(data, true)
                        .then(res => {
                            if (res && res.code == 200) {
                                this.$Message.success(`${params.row.status == 'yes' ? '锁定' : '解除锁定'}成功`);
                                this.$root.endTableLoading();
                            }
                        })
                        .catch(error => this.$root.endTableLoading());
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
/deep/.v2-search {
    .blue-bd {
        background: #2d8cf0;
        color: #fff;
    }
}
/deep/.bb13{
    border-bottom: 1.3px solid #dcdcdc !important;
}
.modeBtns {
    border: 0;
    border-radius: 0;
    line-height: 36px;
    height: 36px;
    text-align: center;
    padding: 0 15px;
}
.active {
    border: 1px solid #2d8cf0;
    border-bottom: 0;
    color: #2d8cf0;
    box-sizing: border-box !important;
}
/deep/.ivu-table-header thead tr:nth-child(1) th{
    height:37px!important;
    line-height:37px!important;
    padding:0;
    .ivu-table-cell span{
      font-size: 1rem;
    }
}
/deep/.ivu-table-header thead tr:nth-child(2) th{
    height:37px!important;
    line-height:37px!important;
    padding:0;
    .ivu-table-cell span{
      font-size: 0.9375rem;
    }
} 
</style>



