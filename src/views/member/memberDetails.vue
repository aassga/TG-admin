<template>
    <div class="v2-details">
        <div class="items p15">
            <div class="title mrt">个人信息</div>
            <div class="section br flex-row mt10">
                <div class="row ti20 btl w25">
                    <div class="col bb">
                        会员账号：{{ basicInfo.userName }} <span class="fr pr20" style="color:red">{{ basicInfo.levelName }}</span>
                    </div>
                    <div class="col bb">上级代理：{{ this.$root.text(basicInfo.agencyName) }}</div>
                    <div class="col bb">会员等级：{{ basicInfo.levelName }}<span v-if="this.$root.groupLenth()>1">({{basicInfo.group_name?basicInfo.group_name:'-'}})</span></div>
                    <div class="col bb">登录时间：{{ basicInfo.lastTime ? $root.unixTime(basicInfo.lastTime) : '-' }}</div>
                </div>
                <div class="row ti20 btl w20">
                    <!-- <div :class="[this.screen<1460?'row ti20 btl w28':'row ti20 btl w20']" v-if="(adminType == 'super') || (authInPage.indexOf('MemberContact') != -1)"> -->
                    <div class="col bb">真实姓名：{{ this.$root.text(basicInfo.realName) }}</div>
                    <div class="col bb">手机号码：<Poptip trigger="hover" style="margin-left:-40px" class="cs">
                        <div slot="content"  >{{basicInfo.phone_carrier}}</div>{{this.$root.text(basicInfo.phone)}}
                        </Poptip></div>
                    <div class="col bb">邮箱账号：{{ this.$root.text(basicInfo.email) }}</div>
                    <div class="col bb">微信账号：{{ this.$root.text(basicInfo.wechat) }}</div>
                </div>
                <div class="row ti20 btl w20">
                    <div class="col bb">存款总额：{{ basicInfo.total_deposit_amount }}</div>
                    <div class="col bb">公司入款：{{ basicInfo.offline_deposit_amount }}</div>
                    <div class="col bb">在线支付：{{ basicInfo.online_deposit_amount }}</div>
                    <div class="col bb">存款大笔：{{ Number(basicInfo.max_deposit) ? Number(basicInfo.max_deposit).toFixed(2) : '0.00' }}</div>
                </div>
                <div class="row ti20 btl w20">
                    <div class="col bb">取款总额：{{ basicInfo.withdrawals_amount }}</div>
                    <div class="col bb">有效投注：{{ basicInfo.valid_bet_amount }}</div>
                    <div class="col bb">
                        会员输赢：
                        <span v-if="basicInfo.net_amount < 0" class="red-font">{{ basicInfo.net_amount }}</span>
                        <span v-else-if="basicInfo.net_amount > 0" class="green-font">{{ basicInfo.net_amount }}</span>
                        <span v-else>{{ basicInfo.net_amount }}</span>
                    </div>
                    <div class="col bb">
                        现金利润:
                        <span v-if="Number(basicInfo.cash_profit) > 0" class="red-font">{{ Number(basicInfo.cash_profit) ? Number(basicInfo.cash_profit).toFixed(2) : '0.00' }}</span>
                        <span v-else-if="Number(basicInfo.cash_profit) < 0" class="green-font">{{ Number(basicInfo.cash_profit) ? Number(basicInfo.cash_profit).toFixed(2) : '0.00' }}</span>
                        <span v-else>{{ Number(basicInfo.cash_profit) ? Number(basicInfo.cash_profit).toFixed(2) : '0.00' }}</span>
                    </div>
                </div>

                <div class="row ti20 btl w20">
                    <div class="col bb">视讯打码量：{{ betCollectInfo.betAmountByLive }}</div>
                    <div class="col bb">棋牌打码量：{{ betCollectInfo.betAmountByChess }}</div>
                    <div class="col bb">电子打码量：{{ betCollectInfo.betAmountBySlot }}</div>
                    <div class="col bb">彩票打码量：{{ betCollectInfo.betAmountByLottery }}</div>
                </div>
                <div class="row ti20 btl w20">
                    <div class="col bb">
                        <p class="middle1">捕鱼打码量： {{betCollectInfo.betAmountByFish}}</p>
                    </div>
                    <div class="col bb">累计佣金：{{ basicInfo.commission_amount }}</div>
                    <!-- <div class="col bb">返水金额：{{basicInfo.refund_amount}}</div> -->
                    <div class="col bb">优惠金额：{{ basicInfo.bonus_amount }}</div>
                    <div class="col bb">
                        历史登录：
                        <a class="blue-font" @click="loginHistory">历史登录</a>
                    </div>
                </div>
            </div>
            <div class="remarks ti20 bl br bb clearfix">
                <span class="mr5">备注：{{ basicInfo.remark }}</span>

                <Button  size="small" class="moreBtn" v-if="basicInfo.remark_detail&&basicInfo.remark_detail.length > 0 || basicInfo.remark_member_remark&&basicInfo.remark_member_remark.length > 0 || basicInfo.remark_self&&basicInfo.remark_self.length>0||basicInfo.remark_trigger&&basicInfo.remark_trigger.length>0"  @click="onMore">更多...</Button>
                 <div class="row w20">注册IP：<Poptip trigger="hover" style="margin-left:-40px" class="cs">
                        <div slot="content" >{{basicInfo.createIp_carrier}}</div>{{this.$root.text(basicInfo.createIp)}}
                        </Poptip></div>
                <div class="row w20">
                    <p class="middle">体育打码量：{{ betCollectInfo.betAmountBySport }}</p>
                </div>
                 <div class="row w20">利润占比：<span :style="basicInfo.cashProfit>0?'color:#ff2626':'color:#19be6b'">{{basicInfo.cashProfit}}%</span></div>
                <div class="row w20">回访记录：{{ basicInfo.return_visit ? basicInfo.return_visit : '暂无记录' }}</div>
            </div>
        </div>
        <div class="items mt15">
            <div class="title mb15" >
                <Span class="ib h40x w90x txt-a cs b" 
                :style="{'border-radius':i==0?'10px 0 0 10px':'0 10px 10px 0'}" 
                :class="{'active':cardId==t.id, 'br0':i==0}" @click='showCard(t)' v-for='(t,i) in cardList' :key='t.id' >{{t.name}}</Span>
            </div>
            <div class="section clearfix b pt15 pb15 pl4 gray-bg">
                <div v-if='cardId==1'>
                    <div class="bank-card fl ml10" v-for="t in bankInfo" :key="t.id" :style="{ backgroundImage: `url(${t.img})`, backgroundSize: '100% 100%' }">
                        <!-- <Icons type="morenyinhangqia" class="morenyinhangqia" size="48" color="#62B1FD" v-show="t.default === 'yes'"></Icons> -->
                        <img src="../../assets/images/默认icon400.png" class="w55x morenyinhangqia" v-show="t.default === 'yes'"/>
                        <div class="bank-name clearfix w100%">
                            <!-- <Icons class="logo fl ml5" :type="t.icon" size="40" color="#c22527"></Icons> -->
                            <div class="fl mr20" style="color: #ffffff;">
                                <div class="name ft20 pl50">{{ t.bankName }}</div>
                                <Tooltip placement="right-start" transfer max-width="260px" v-if="t.cardAddress.length > 26">
                                    <div class="address pl50">{{ t.cardAddress.slice(0, 30) }}</div>
                                    <div slot="content">
                                        <p>{{ t.cardAddress }}</p>
                                    </div>
                                </Tooltip>
                                <div class="address pl50" v-else>{{ t.cardAddress }}</div>
                            </div>
                        </div>
                        <div class="bank-num" style="color: #ffffff;">
                            <div class="num ml5 ft18">{{ t.cardNum }}</div>
                            <div class="real-name ml5">{{ t.cardName }}</div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="bank-card usdt fl ml10" v-for="t in virtual_info" :key="t.id" >
                        <!-- <Icons type="morenyinhangqia" class="morenyinhangqia" size="48" color="white" v-show="t.default === 'yes'"></Icons> -->
                        <img src="../../assets/images/默认icon400.png" class="w55x morenyinhangqia" v-show="t.default === 'yes'"/>
                        <div class="bank-name clearfix w100%">
                            <div class="fl ft16 mb10 mt10" style="color: #ffffff;">
                                <div class="name pl50">{{'USDT-ERC20(尾号' + t.cardNum.substring(t.cardNum.length-6)+')' }}</div>
                            </div>
                        </div>
                        <div class="bank-num" style="color: #ffffff;">
                            <div class="num ml5 ft18" style="word-wrap:break-word;height:55px">{{ t.cardNum }}</div>
                            <div class="real-name ml5">{{ t.cardName }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="items mt15" v-if="$root.modeName() == 'mode_c'||$root.modeName() == 'mode_a' || $root.modeName() == 'no'||$root.modeName() == 'mode_d_a'||$root.modeName() == 'mode_d_b'">
            <RebateSelect :data="rebate" :editable="editable"></RebateSelect>
            <!-- <RebateSelect :data="rebate"></RebateSelect> -->
        </div>
        <div class="items mt15" v-if="$root.modeName() == 'mode_c'||$root.modeName() == 'mode_a' || $root.modeName() == 'no'||$root.modeName() == 'mode_d_a'||$root.modeName() == 'mode_d_b'">
            <RefundSelect :showLock="$root.modeName() == 'mode_c'||$root.modeName() == 'mode_a' || $root.modeName() == 'no'||$root.modeName() == 'mode_d_a'||$root.modeName() == 'mode_d_b'" :data="refund" :isLock.sync="refundLock"></RefundSelect>
            <!-- <RefundSelect :data="refund"></RefundSelect> -->
        </div>
        <div class="items mt15">
            <div class="flex-row pt20 bt">
                <div class="w30 flex-row">
                    <Button class="more-btn fontColor" @click="resetMemberPassowrd('secret')" v-if="adminType == 'super' || authInPage.indexOf('memberResetPassword') != -1"
                        >重设密保答案</Button
                    >
                    <Button class="more-btn ml40 fontColor" @click="resetMemberPassowrd('payPwd')" v-if="adminType == 'super' || authInPage.indexOf('memberResetPassword') != -1"
                        >重设取款密码</Button
                    >
                    <Button class="more-btn ml40 fontColor" @click="resetMemberPassowrd('loginPwd')" v-if="adminType == 'super' || authInPage.indexOf('memberResetPassword') != -1"
                        >重设登录密码</Button
                    >
                </div>
            </div>
        </div>
        <Modals title="备注详情" ref="remarkModal" width='1100' height="400" >
            <div slot="content" class="pl20 pr20 pt20 pb20">
                <div class="mb30">
                    <ul>
                        <li class="ft15 pb10" v-if="basicInfo.remark&&basicInfo.remark.length > 0">{{ basicInfo.remark }}</li>
                        <li class="ft15 pb10" v-if="basicInfo.remark_detail&&basicInfo.remark_detail.length > 0">{{ basicInfo.remark_detail }}</li>
                        <li class="ft15 pb10" v-if="basicInfo.remark_member_remark&&basicInfo.remark_member_remark.length > 0">
                            <div v-for="(item, index) in basicInfo.remark_member_remark" :key="index">
                                <div>{{ remarkStatusList[item.key] ? remarkStatusList[item.key] : item.key }}：{{ $root.unixTime(item.created_at) }}
                                    <span class="pl10">內容：{{ item.remark }}</span>
                                </div>
                            </div>
                        </li>
                        <li class="ft15">
                            <p  class="ft15" style="word-break:break-all;word-wrap:break-word;white-space:normal" v-for="(item,i) in remark_self" :key="i" >{{item}}</p>
                            <div class="ft15" v-for="t in  remark_trigger " :key="t.siteId">
                                <p><span class="mb5">站点名称：{{t.siteName}}</span> <span class="ml5">用户名：{{t.username}}</span></p>
                                <div style="word-break:break-all;word-wrap:break-word;white-space:normal" v-for="(t,i) in t.list" :key="i" ><span style="word-wrap:break-word" >{{t}}</span></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </Modals>
        <Modals ref="successModal" width="480" height="280" title="温馨提示">
            <div slot="content" class="v2-form-wrapper flex-column">
                <div class="mb40 ft20">
                    <span class="gouxuan">
                        <Icons type="gouxuan" color="#fff" size="20" />
                    </span>
                    重设{{ this.okmsg }}成功！
                </div>
                <div class="mb40 clearfix result">
                    <Input class="fl w50 disabled" v-model="result" disabled />
                    <Button type="primary" class="ml20 fl ft20 ivu-btn commonSubmit w60x" size="default" v-clipboard:copy="result" v-clipboard:success="onCopy">
                        <span class="ft20 ti20 white-font">复制</span>
                    </Button>
                </div>
                <Button type="primary" class="ivu-btn export-ok ft20" @click="secondSure">确定</Button>
            </div>
        </Modals>
        <Modals ref="historyModal" title="历史登录" width="800">
            <div slot="content" class="modal mb20 ml10 mr10">
                <!-- <div style="height:500px;overflow:auto;"> -->
                <Tables
                    :columns="historyTable.columns"
                    :loading="historyTable.loading"
                    :pageFixShow="true"
                    :page-size-opts="historyTable.pageSizeOpts"
                    :value="historyTable.data"
                    :total="historyTable.total"
                    :show-sizer="false"
                    :pageFix="10"
                    @on-page-change="onPageChange"
                ></Tables>
                <!-- </div> -->
            </div>
        </Modals>
    </div>
</template>
<script>
// import Icons from '../../assets/images/usdt.png';
import Icons from '@/components/icons';
import Modals from '@/components/modals';
import Tables from '@/components/tables';
import { getMemberLoginLog } from '@/api/data';
import RebateSelect from '@/components/rebate-select';
import RefundSelect from '@/components/refund-select';
import { memberDetail, memberResetPassword } from '@/api/member';
import { mapMutations, mapState } from 'vuex';
import { getUserType } from '@/libs/util';
export default {
    components: { Icons, Modals, Tables, RebateSelect, RefundSelect },
    data() {
        return {
            remark_self:[],
            remark_trigger:[],
            betCollectInfo: {},
            editable: false,
            title: '',
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            basicInfo: {},
            bankInfo: {},
            virtual_info:{},
            rebate: [],
            refund: [],
            refundLock: '',
            result: '',
            okmsg: '',
            cardList:[
                {name:'银行信息',id:1},
                {name:'USDT地址',id:2},
            ],
            cardId:1,
            historyTable: {
                total: 0,
                pageSizeOpts: [10],
                loading: true,
                columns: [
                    {
                        title: '登录设备',
                        key: 'device',
                        align: 'center',
                        render: (h, params) => {
                            let { device } = params.row;
                            return <span>{this.$root.text(device == 'pc' ? 'PC' : device == 'h5' ? 'H5' : device == 'android' ? 'Android' : 'IOS')}</span>;
                        }
                    },
                    {
                        title: '登录域名',
                        key: 'domain',
                        align: 'center'
                    },
                    {
                        title: '登录IP',
                        key: 'ip',
                        align: 'center'
                    },
                    {
                        title: '归属地',
                        key: 'location',
                        align: 'center'
                    },
                    {
                        title: '登录时间',
                        key: 'created_at',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    }
                ],
                data: []
            },
            remarkStatusList: {
                member_block_status_open: '啟用時間',
                member_block_status_off: '停用時間',
            }
            // editable: this.$root.checkCommission()
        };
    },
    created() {
        
        const { siteId, uid } = this.$route.query;
        let data = { params: { siteId, uid, limit: 10 } };
        this.getData(data);
    },

    computed: {
        ...mapState({
            bankImages: state => state.info.bankImages,
            bankList: state => state.info.bankList
        })
    },
    methods: {
        onMore(){
            this.$refs.remarkModal.show();
            this.remark_self=this.basicInfo.remark_self;
            this.remark_trigger=this.basicInfo.remark_trigger;
           
        },
        showCard(t){
            this.cardId = t.id;
        },
        getData(data) {
            memberDetail(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { rebate, refund, bank_info,virtual_info, basic, betCollect } = res.data;
                    this.betCollectInfo = betCollect;
                    this.basicInfo = basic;
                    // console.log(this.basicInfo)
                    this.bankInfo = bank_info;
                    this.virtual_info = virtual_info;
                    this.bankInfo.forEach(item => {
                        this.bankImages.forEach(temp => {
                            if (temp.bankName == item.bankName) item.img = temp.img;
                        });
                        // 用户自定义的未存银行 为默认银行的图标
                        if (!this.bankList.includes(item.bankName)) {
                            item.img = this.bankImages.find(key => key.bankName == '默认银行').img;
                        }
                    });
                    this.rebate = rebate;
                    this.refund = refund;
                    //控制锁的显示隐藏
                    this.refundLock = basic.itself_refund;
                }
            });
        },
        onCopy() {
            this.$Message.success(`复制${this.result}成功`);
            this.$refs.successModal.hide();
        },
        secondSure() {
            this.$refs.successModal.hide();
            this.$Message.success(this.title);
        },
        loginHistory() {
            const { login_history } = this.basicInfo;
            this.$refs.historyModal.show();
            this.historyTable.loading = true;
            setTimeout(() => {
                this.historyTable.data = login_history.data;
                this.historyTable.total = login_history.total;
                this.historyTable.loading = false;
            }, 2000);
        },
        //重设
        resetMemberPassowrd(type) {
            const { siteId, uid } = this.$route.query;
            let data = { siteId, uid, type };
            let content, msg;
            switch (type) {
                case 'secret':
                    content = '您确认要重设密保答案吗？';
                    msg = '重设密保答案成功！';
                    this.okmsg = '密保答案';
                    break;
                case 'loginPwd':
                    content = '您确认要重设登录密码吗？';
                    msg = '重设登录密码成功！';
                    this.okmsg = '登录密码';
                    break;
                case 'payPwd':
                    content = '你确定要重设取款密码吗？';
                    msg = '重设取款密码成功！';
                    this.okmsg = '取款密码';
                    break;
            }
            this.$Tip.confirm({
                content,
                onOk: () => {
                    memberResetPassword(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.result = res.data;
                            this.title = msg;
                            this.$refs.successModal.show();
                        }
                    });
                }
            });
        },
        onPageChange(page) {
            let data = {
                params: {
                    siteId: this.$route.query.siteId,
                    uid: this.$route.query.uid,
                    limit: 10
                },
                query: { page }
            };
            this.historyTable.loading = true;
            memberDetail(data).then(res => {
                this.historyTable.data = res.data.basic.login_history.data;
                this.historyTable.loading = false;
            });
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';

.bb {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
// 样式间距修改
.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
    padding-left: 0 !important;
}
// 样式间距修改
.ivu-collapse-content {
    padding: 0;
    color: #444;
}
.ivu-collapse-content > .ivu-collapse-content-box {
    padding: 0;
}
.ivu-collapse {
    border: none;
}
.info {
    justify-content: flex-start;
}
.v2-form-wrapper {
    height: 100%;
}
// 默认的样式
.usdt {
    background-image: url('../../assets/images/usdt.png') !important;
     background-size: 100% 100% !important;
}
.bank-card {
    // position: relative;
    .morenyinhangqia {
        position: absolute;
        top: 0 !important;
        right: 0 !important;
    }
    .address {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        width: 240px;
        height: 41px;
    }
    .fl80 {
        width: 82%;
    }
}
/deep/.ivu-collapse-content {
    padding: 0;
}
/deep/.ivu-collapse-item {
    .ivu-collapse-header {
        padding: 0;
    }
}
//成功弹窗勾选icon

/deep/.ivu-input[disabled] {
    background-color: #fff !important;
    color: #808080 !important;
}
.mb40,
.result {
    display: flex;
    justify-content: space-evenly;
    .gouxuan {
        width: 25px;
        height: 25px;
        border-radius: 16px;
        background-color: #62b1fd;
        display: unset;
    }
}
.modal {
    max-height: 800px;
    overflow-y: auto;
}
.mrt {
    margin-left: -15px;
    margin-top: -25px;
}
.active {
    background: #f9f9f9;
    // border-bottom: 1px solid #dcdcdc ;
    //border:1px solid red
}
/deep/.ivu-table-header {
    tr {
        th {
            .ivu-table-cell {
                font-size: 1rem;
                font-weight: 549;
            }
        }
    }
}
/deep/.ivu-page-total {
    font-size: 0.875rem;
}

/deep/.ivu-btn {
    height: 36px;
    span {
        margin-top: -5px;
    }
}
/deep/.v2-details .items .bank-card {
    position: static;
}
</style>
