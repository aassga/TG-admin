<template>
 <Modals ref="auditModal" title="取款详情">
     <div slot="content">
        <div class="v2-search bb clearfix">
            <ButtonGroup class="repay-button1">
                <Button
                    class="fontColor"
                    :class="tabName==item.name?'active':''"
                    v-for="(item,index) in  tabNameList"
                    :key="index"
                    @click="changeType(item.name)"
                >{{item.name}}</Button>
            </ButtonGroup>
        </div>
        <!-- v-if="status && ((adminType == 'super') || (authInPage.indexOf('withdrawalsDetail') != -1))" -->
        <div
        style="height:690px;"
      
    >
        <div class="modal-overflow box" style="position: relative;">
            <div class="detail">
                <p>
                    <label>订单号</label>
                    <span>{{this.detailData.code}}</span>
                </p>
                <p>
                    <label>账号余额</label>
                    <span>{{this.detailData.balance!==undefined ? Number(this.detailData.balance).toFixed(2):""}}</span>
                </p>
                <p>
                    <label>会员账号</label>
                    <span>{{this.detailData.username}}</span>
                </p>
                <p>
                    <label>取款金额</label>
                    <span>{{this.detailData.bankAccount}}</span>
                </p>
                <p>
                    <label>取款类型</label>
                    <span>{{this.detailData.bankAccount}}</span>
                </p>
                <p>
                    <label>收获地址</label>
                    <span>{{this.detailData.bankAddress}}</span>
                    <Button
                        v-if="copyButton"
                        type="info"
                        size="small"
                        class="ml50 ivu-btn copy lh14"
                        v-clipboard:copy="this.detailData.bankAddress"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                    >复制</Button>
                </p>
                <p>
                    <label>货币数量</label>
                    <span class="font-bold" style="color:red !important">{{this.detailData.actualAmount}}</span>
                    <Button
                        v-if="copyButton"
                        type="info"
                        size="small"
                        class="ml50 ivu-btn copy lh14"
                        v-clipboard:copy="this.detailData.actualAmount"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                    >复制</Button>
                </p>
                <p>
                    <label>备注信息</label>
                    <span>{{this.detailData.member_remark}}</span>
                </p>
                <!-- 审核详情页面展示操作类型 -->
                <p v-if="waitModal">
                    <label>操作类型</label>
                    <!-- v-if="detailModal == 'fail'" -->
                    <RadioGroup
                      
                        v-model="auditType"
                        @on-change="changeReason"
                        class="select"
                    >
                        <Radio label="pass" class="mr30">
                            <span>通过</span>
                        </Radio>
                        <Radio label="reject">
                            <span>拒绝</span>
                        </Radio>
                    </RadioGroup>
                    <!-- v-else -->
                    <span
                       
                        :class="this.detailData.status ? '' : 'redText'"
                    >{{this.detailData.status == 'success' ? '通过' : (this.detailData.status=='fail'?"拒绝":'自动出款')}}</span>
                </p>
                <!-- 成功状态也会显示加入状态判断 -->
                <P v-if="showRemark&&this.detailData.status=='fail'">
                    <label>拒绝原因</label>
                    <span>{{remark}}</span>
                </P>
                <!-- 审核页面展示拒原因 -->
                <p v-if="auditType=='pass'" style="height:50px"></p>
                <!-- 如果未清空会显示拒绝原因修正 -->
                <!-- <p v-if="detailModal == 'fail'&&auditType=='reject'" style="height:50px"> -->
                  <p>
                    <label>拒绝原因</label>
                    <Select transfer style="width:200px;" class="select fontColor" v-model="rejectmark">
                        <Option v-for="(t,i) in rejectReason" class="fontColor" :key="i" :value="t">{{t}}</Option>
                    </Select>
                </p>
                <!-- 审核详情页面展示确认提交和自动出款 -->
                <!-- v-if="detailModal == 'fail'&&waitModal" -->
                <!-- <div class="txt-a clearfix" >
                    <Button class="moneySubmit ml20" type="primary" @click="submit" v-if="showBtn">确认提交</Button>
                    <Button class="moneySubmit fl ml20"  type="primary"
                        @click="submit"
                        v-if="moneyAutomatically"
                    >确认提交</Button> -->
        <!-- <div class="fr clearfix">
                            <Button
                                :class="{'gray':times>0}"
                                class="moneySubmit fl ml10"
                                :disabled="disabled"
          type="primary"
          @click="loanSubmit"
                                v-if="moneyAutomatically"
                            >自动出款</Button>
                        </div> -->
                </div>
            </div>
</div>
        <Tables
            ref="tables"
            class="pt10 ml30"
            :width="810"
            :columns="tableData.columns"
            :loading="tableData.loading"
            :value="tableData.data"
            :page="tableData.page"
            :total="tableData.total"
            :more="tableData.more"
        ></Tables>
        <div
        style="height:685px"
        v-if="nextStatus"
    >
        <Tables
            class="ml20 mr20 mt20 "
            :height="codeDetail.data.length > 9 ? '665' : ''"
            :page="false"
            :columns="codeDetail.columns"
            :value="codeDetail.data"
        ></Tables>
    </div>
    </div>
     </div>
 </Modals>
</template>
<script>
import Modals from "_c/modals";
import Tables from "_c/tables";
    export default{
        name:'auditModal',
        components:{Modals,Tables},
        props:['detailData',"tableDataArr"],
        data(){
           return{
            rejectmark: "",
            nextStatus: false, //控制显示打码详情
            showBtn: true, //按钮显示
            auditType: "pass", //默认通过
            showRemark: true, //拒绝原因显示
            copyButton: true, //复制的button
            moneyAutomatically: false, //自动出款的显示隐藏
            status:"",
            tabName:'取款详情',
            tabNameList:[{ name: "取款详情", value: "1" },
            { name: "打码详情", value: "2" }],
            waitModal: true, //点击待审核的弹框
            rejectReason:["打码量不足",
					"注单审核中",
					"银行信息有误",
					"跨行维护中",
					"当日提款金额已超限",
					"额度异常",
					"请联系在线客服",
					"其他情况"],
            tableData: {
					page: false,
					loading: false,
					columns: [
						{
							title: "日期",
							key: "date",
							align: "center"
						},
						{
							title: "公司入款",
							key: "deposit_offline_amount",
							align: "center"
						},
						{
							title: "在线支付",
							key: "deposit_online_amount",
							align: "center"
						},
						{
							title: "线上取款",
							key: "withdrawals_amount",
							align: "center"
						},
						{
							title: "现金利润",
							key: "cash_profit",
							align: "center"
						},
						{
							title: "有效投注",
							key: "validBetAmount",
							align: "center"
						},
						{
							title: "会员输赢",
							key: "net_amount",
							align: "center",
							width: 120
						},
						{
							title: "代理佣金",
							key: "agency_amount",
							align: "center"
						},
						{
							title: "优惠金额",
							key: "bonus_amount",
							align: "center"
						}
					],
					data: []
                },
                codeDetail: {
					data: [],
					columns: [
						{
							title: "类型",
							key: "type",
							align: "center"
						},
						{
							title: "金额",
							key: "amount",
							align: "center"
						},
						{
							title: "打码倍数",
							key: "multiple",
							align: "center"
						},
						{
							title: "已打码",
							key: "betAmount",
							align: "center"
						},
						{
							title: "累计打码",
							key: "needBetAmount",
							align: "center"
						},
						{
							title: "时间",
							key: "time",
							width: 160,
							align: "center",
							render: (h, params) => {
								return (
									<span class="mr5 ml5">
										{this.$root.unixTime(params.row.time)}
									</span>
								);
							}
						}
					]
				},
                
           }

        },
        methods:{
            submit(){},
            show(){
                this.tableData.data=this.tableDataArr;
                this.$refs.auditModal.show();

            },
            	// 复制功能--成功
			onCopy: function(e) {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.$Message.destroy();
					this.$Message.success("复制成功");
				}, 200);
			},
			//复制功能--失败
			onError: function(e) {
				this.$Message.destroy();
				this.$Message.error("复制失败");
            },
            changeReason(val) {
				this.rejectmark = "";
				if (val == "reject") this.disabled = true;
				if (val == "pass") this.disabled = false;
            },
            changeType(name){
                this.tabName=name;
                if (item == "取款详情") {
					this.status = true;
					this.nextStatus = false;
				}
				if (item == "打码详情") {
					this.status = false;
					this.nextStatus = true;
					
				}

            },
            getCodeDetial(){

            },

        }
    }
</script>
<style lang="less" scoped>
 /* @import "../../styles/tabs.less";
@import "../../styles/button.less"; */
@import "../../../styles/tabs.less";
@import "../../../styles/button.less";
.box {
		display: flex;
		justify-content: center;

		.detail {
			margin: 0px 0 auto -40px;
			font-size: 1rem;

			p {
				line-height: 2;
				margin-bottom: 10px;
				position: relative;

				> label {
					position: absolute;
					display: inline-block;
					width: 110px;
					text-align: center;
				}

				> span {
					margin-left: 110px;
					display: inline-block;
					width: 260px;
					color: #444;
				}

				> .ivu-btn-small {
					background-color: #2d8cf0;
					color: #fff;
					border-color: #2d8cf0;
					padding: 3px 7px;
				}

				/deep/.select {
					margin-left: 110px;
				}

				&:last-child {
					> button {
						// position: relative;
						// margin-left: 65px;
					}
				}
			}
		}
	}
</style>