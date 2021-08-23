<template>
	<div class="v2-edit">
		<div class="items bb">
			<div class="title">基础设置</div>
			<div class="section">
				<Form :label-width="110" ref="Form" :model="formKey" :rules="rules" id="flexBox">
					<FormItem label="会员账号" prop="userName" class="ib w25">
						<Input class="s-140" placeholder="会员账号" v-model="formKey.userName" disabled />
					</FormItem>
					<FormItem label="上级代理" prop="agencyName" v-if="formKey.agencyId!==0" class="ib w25">
						<AutoSearch
							class="auto-serch"
							ref="autoSearch"
							@noChangeData="noChangeData"
							:width="140"
							:siteId="$root.nowSite.id"
							:clearable="false"
							@sendSuperior="getSuperior"
							@sendId="getId"
							:placeholder="'默认查询'"
						></AutoSearch>
					</FormItem>
					<FormItem label="真实姓名" prop="realName" class="ib w25 real">
						<Input
							:class="trueNameDis ? 's-140' : 'w80x'"
							placeholder="暂无信息"
							v-model="formKey.realName"
							disabled
						/>
						<span v-if="!trueNameDis">-</span>
						<Select
							style="width: 54px;"
							placeholder="-"
							v-model="selectedName"
							v-if="!trueNameDis"
							clearable
						>
							<Option v-for="(t,i) in realNameList" :key="'realName'+ i" :value="t.showName">{{t.showName}}</Option>
						</Select>
					</FormItem>
					<FormItem
						label="邮箱账号"
						prop="email"
						v-show="(adminType == 'super') || (authInPage.indexOf('MemberContact') != -1)"
						class="ib w25"
					>
						<Input class="s-140" placeholder="暂无信息" v-model="formKey.email" />
					</FormItem>
					<FormItem
						label="手机号码"
						prop="phone"
						v-show="(adminType == 'super') || (authInPage.indexOf('MemberContact') != -1)"
						class="ib w25"
					>
						<Input class="s-140" placeholder="暂无信息" v-model="formKey.phone" />
					</FormItem>
					<FormItem
						label="微信账号"
						prop="wechat"
						v-show="(adminType == 'super') || (authInPage.indexOf('MemberContact') != -1)"
						class="ib w25"
					>
						<Input class="s-140" placeholder="暂无信息" v-model="formKey.wechat" />
					</FormItem>
					<FormItem
						label="佣金转账"
						v-if="($route.query.account_type == 0) && (adminType == 'super' || (authInPage.indexOf('commission_type')&&authInPage.indexOf('commissionStatus')) != -1)"
						class="ib w25"
					>
						<Select class="s-140 fontColor" v-model="formKey.commission_type" placeholder="请选择佣金状态">
							<Option
								value="0"
								class="fontColor"
								v-if="$root.modeName() != 'no'&&$root.modeName() != 'mode_c'&&$root.modeName() != 'mode_e'&&$root.modeName() != 'mode_d_a'&&$root.modeName() != 'mode_d_b'"
							>未激活</Option>
							<Option
								value="1"
								class="fontColor"
								v-if="$root.modeName() != 'no'&&$root.modeName() != 'mode_c'&&$root.modeName() != 'mode_e'&&$root.modeName() != 'mode_d_a'&&$root.modeName() != 'mode_d_b'"
							>体验转账</Option>
							<Option
								value="2"
								class="fontColor"
								v-if="$root.modeName() != 'no'&&$root.modeName() != 'mode_c'&&$root.modeName() != 'mode_e'&&$root.modeName() != 'mode_d_a'&&$root.modeName() != 'mode_d_b'"
							>条件转账</Option>
							<Option value="3" class="fontColor">开启</Option>
							<Option value="4" class="fontColor">关闭</Option>
						</Select>
					</FormItem>

					<FormItem
						label="返佣状态"
						class="ib w25"
						v-if="$route.query.account_type == 0 && (adminType == 'super' || (authInPage.indexOf('rebateBonus')&&authInPage.indexOf('commissionStatus')) != -1)"
					>
						<Select class="s-140" placeholder="请选择" v-model="formKey.rebateBonus">
							<Option value="yes">开启</Option>
							<Option value="no">关闭</Option>
						</Select>
					</FormItem>
        				<FormItem label="每日取款" class="ib w25">
							<InputNumber
								class="s-140"
								placeholder="0或空为无上限次"
								:min="0"
								:precision="0"
								:value="Number(formKey.withdrawDayLimit)||null"
								@on-change="value=>{formKey.withdrawDayLimit=value}"
							/>
						</FormItem>
						
          <div
           style="display:inline"
						v-if="$route.query.account_type == 0 && (adminType == 'super' || authInPage.indexOf('refundCommissionWageProfit') != -1) && ($root.modeName() != 'mode_c')"
					>
						<!-- <FormItem label="发放分红" class="ib w25" :style="{width:itemWidth+'px'}">
							<Select class="s-140" v-model="formKey.shareoutbonusType">
								<Option value="0">关闭</Option>
								<Option value="1">开启</Option>
							</Select>
						</FormItem> -->
						<!-- <FormItem label="起始等级" class="ib" :style="{width:itemWidth+'px'}" v-if="shareDiable">
							<Input
								placeholder="暂无信息"
								class="s-140"
								v-if="formKey.shareMin"
								v-model="`第`+formKey.shareMin+`级`"
								disabled
							/>
							<Input placeholder="暂无信息" class="s-140" v-else disabled />
						</FormItem> -->
						<!-- <FormItem label="起始等级" class="ib" v-else prop="shareMin" :style="{width:itemWidth+'px'}">
							<Select class="s-140" v-model="formKey.shareMin">
								<Option v-for="(t,i) in shareoutList" :key="'share' + i" :value="t.level">{{`第${t.level}级`}}</Option>
							</Select>
						</FormItem> -->
						<!-- <FormItem label="最高等级" class="ib" :style="{width:itemWidth+'px'}" v-if="shareDiable">
							<Input
								placeholder="暂无信息"
								class="s-140"
								v-if="formKey.shareMax"
								v-model="`第`+formKey.shareMax+`级`"
								disabled
							/>
							<Input v-else placeholder="暂无信息" class="s-140" disabled />
						</FormItem> -->
						<!-- <FormItem label="最高等级" class="ib" v-else :style="{width:itemWidth+'px'}" prop="shareMax">
							<Select class="s-140" v-model="formKey.shareMax">
								<Option
									v-for="(t,i) in shareoutList"
									:key="'shareout' + i"
									:value="t.level"
								>{{`第${t.level}级`}}</Option>
							</Select>
						</FormItem> -->
					</div>
           	<FormItem label="回访记录" prop="return_visit" class="ib w25">
							<Input class="s-140" placeholder="记录用户回访情况" v-model="formKey.return_visit" />
						</FormItem>
          <div
            style="display:inline"
						v-if="$route.query.account_type == 0 && (adminType == 'super' || authInPage.indexOf('refundCommissionWageProfit') != -1) && ($root.modeName() != 'mode_c')"
					>
						<!-- <FormItem label="发放工资" class="ib" :style="{width:itemWidth+'px'}">
							<Select class="s-140" v-model="formKey.wageType">
								<Option value="0">关闭</Option>
								<Option value="1">开启</Option>
							</Select>
						</FormItem> -->
						<!-- <FormItem class="ib" label="起始等级" :style="{width:itemWidth+'px'}" v-if="wageDisable">
							<Input
								placeholder="暂无信息"
								v-if="formKey.wageConfigMin"
								v-model="`第`+formKey.wageConfigMin+`级`"
								class="s-140"
								disabled
							/>
							<Input placeholder="暂无信息" v-else class="s-140" disabled />
						</FormItem> -->
						<!-- <FormItem label="起始等级" class="ib" v-else prop="wageConfigMin" :style="{width:itemWidth+'px'}">
							<Select class="s-140" v-model="formKey.wageConfigMin">
								<Option v-for="(t,i) in wageList" :key="'wage' + i" :value="t.level">{{`第${t.level}级`}}</Option>
							</Select>
						</FormItem> -->
						<!-- <FormItem label="最高等级" class="ib" v-if="wageDisable" :style="{width:itemWidth+'px'}">
							<Input
								placeholder="暂无信息"
								v-if="formKey.wageConfigMax"
								v-model="formKey.wageConfigMax"
								disabled
							/>
							<Input class="s-140" placeholder="暂无信息" v-else disabled />
						</FormItem> -->
						<!-- <FormItem label="最高等级" class="ib" v-else prop="wageConfigMax" :style="{width:itemWidth+'px'}">
							<Select class="s-140" v-model="formKey.wageConfigMax">
								<Option v-for="(t,i) in wageList" :key="'wage' + i" :value="t.level">{{`第${t.level}级`}}</Option>
							</Select>
						</FormItem> -->
						
					</div>
								<FormItem  	class="ib w25" label="提款打码倍数"   prop="withdrawMultiple">
							<InputNumber 
							        :min="1"
									placeholder="请输入提款打码倍数"
								    class="s-140"
								    :step="0.1"
									v-model="formKey.withdrawMultiple"
									
								/>
						</FormItem>
					<FormItem
						class="ib w25"
						label="备注信息"
					>
						<Select class= "s-140" v-model="remarkText" @on-change="changeText">
							<Option v-for="t in msg" :value='t' :key='t'>{{t}}</Option>
						</Select>
					</FormItem>
					<FormItem
						class=" ib remarkInput"
						label="备注描述"
						prop="remark"
					>
				
						<Input  :style="{paddingRight:paddingNum+'px'}" placeholder="此栏位供管理者查看" v-model="formKey.remark" />
						<!-- <Input  :style="{paddingRight:paddingNum+'px'}" placeholder="此栏位供管理者查看" v-model="formKey.remark" /> -->
					</FormItem>
				</Form>
			</div>
		</div>
		<div class="items mt15 bb" v-show="['mode_f','mode_c', 'mode_a', 'no', 'mode_d_a', 'mode_d_b'].includes($root.modeName())">
			<div class="section">
				<RebateSelect
					:showParent="false"
					ref="rebateSelect"
					:data="rebate"
					:editable="editable"
					:isShareholder="isShareholder"
					@on-rebate-change="onRebateChange"
				></RebateSelect>
			</div>
		</div>
		<div class="items mt15 bb" v-show="['mode_f','mode_c', 'mode_a', 'no', 'mode_d_a', 'mode_d_b'].includes($root.modeName())">
			<div class="section">
				<RefundSelect
					:showLock="['mode_f','mode_c', 'mode_a', 'no', 'mode_d_a', 'mode_d_b'].includes($root.modeName())"
					:data="refund"
					ref="refundSelect"
					:editable="editable"
					:showParent="false"
					:isShareholder="isShareholder"
					@on-refund-change="onRefundChange"
					:isLock.sync="refundLock"
					@lockChange="lockChange"
				></RefundSelect>
			</div>
		</div>
		<div class="items mt15">
			<div class="flex-row p10">
				<div class="flex-row">
					<Button
						type="primary"
						:loading="$root.editBtnLoading"
						class="more-btn ml40 ivu-btn export-ok"
						style="width:140px;"
						@click="submit"
					>确认保存</Button>
					<Button
						class="more-btn ml40 fontColor"
						v-if="(adminType == 'super') || (authInPage.indexOf('memberResetPassword') != -1)"
						@click="resetMemberPassowrd('secret')"
					>重设密保答案</Button>
					<Button
						class="more-btn ml40 fontColor"
						@click="resetMemberPassowrd('payPwd')"
						v-if="(adminType == 'super') || (authInPage.indexOf('memberResetPassword') != -1)"
					>重设取款密码</Button>
					<Button
						class="more-btn ml40 fontColor"
						@click="resetMemberPassowrd('loginPwd')"
						v-if="(adminType == 'super') || (authInPage.indexOf('memberResetPassword') != -1)"
					>重设登录密码</Button>
				</div>
			</div>
		</div>
		<Modals ref="successModal" width="480" height="280" title="温馨提示">
			<div slot="content" class="v2-form-wrapper flex-column">
				<div class="mb40 ft20">
					<span class="gouxuan">
						<Icons type="gouxuan" color="#fff" size="20" />
					</span>
					重设{{this.okmsg}}成功！
				</div>
				<div class="mb40 clearfix">
					<Input class="fl w50 disabled" v-model="result" disabled />
					<Button
						type="primary"
						class="ml20 fl ft20 ivu-btn commonSubmit w60x"
						size="default"
						v-clipboard:copy="result"
						v-clipboard:success="onCopy"
					>
						<span class="ft20 white-font">复制</span>
					</Button>
				</div>
				<Button type="primary" class="ivu-btn export-ok ft20" @click="secondSure">确定</Button>
			</div>
		</Modals>
	</div>
</template>
<script>
	import elementResizeDetectorMaker from 'element-resize-detector'
	import Icons from "@/components/icons";
	import RebateSelect from "@/components/rebate-select";
	import AutoSearch from "_c/auto-search";
	import Modals from "@/components/modals";
	import RefundSelect from "@/components/refund-select";
	import { memberUpdate, memberDetail, memberResetPassword } from "@/api/member";
	import { agencyRebatePlatform } from "@/api/agency";
	import { getUserType } from "@/libs/util";
	import { mapState } from "vuex";
	export default {
		computed: {
			...mapState({
				collapsed: state => state.info.collapsed
			})
		},
		components: { RebateSelect, RefundSelect, Modals, AutoSearch, Icons },
		data() {
			return {
				okmsg: "",
				paddingNum:0,
				itemWidth:0,
				remarkText:'自定义',
				copyData: "", //在切换上级代理时复制的问题
				isShareholder: false,
				from: "",
				mode: this.$root.modeName(),
				editable: true,
				adminType: getUserType(),
				authInPage: JSON.parse(localStorage.authInPage),
				title: "", // 重置成功之后的信息
				result: "",
				formKey: {
					withdrawDayLimit: "",
					userName: "",
					agencyName: "",
					agencyId: -1,
					siteId: "",
					uid: "",
					realName: "",
					phone: "",
					email: "",
					wechat: "",
					remark:"",
					rebate: "",
					refund: "",
					commission_type:
						this.$root.modeName() == "no" || this.$root.modeName() == "mode_c"
							? "3"
							: "0",
					rebateBonus: "",
					// isRefundBonus: "",
					wageConfigMin: "",
					wageConfigMax: "",
					withdrawMultiple:1,
					shareMin: "",
					shareMax: "",
					shareoutbonusType: "",
					wageType: "",
					return_visit: ""
				},
				trueNameDis: true,
				wageDisable: false,
				shareDiable: false,
				realNameList: [],
				selectedName: "",
				wageList: [],
				shareoutList: [],
				rebate: [],
				refund: [],
				bankInfo: [],
				refundLock: "",
				msg:[
					'自定义'
					,'注册多个帐号，停用帐号只保留一个'
					,'严重套利视讯1倍打码，停用帐号人工提出余额，新注册帐号及时上报站长'
					,'视讯长庄长闲下注，锁定返水0.2%取消全部优惠，新注册帐号及时上报站长'
					,'锁定返水0.１%取消全部优惠，发现新注册账号一律锁定返水0.１%取消全部优惠'
					,'长期彩票1倍打码，停用帐号人工提出余额，新注册帐号及时上报站长'
					,'严重套利等待会员存款第一时间停用帐号人工提出余额'
					,'体育注单异常停用帐号人工提出余额，新注册帐号及时上报站长'
					,'体育1倍打码套利入款优惠及赔率差，停用帐号人工提出余额'
					,'游戏第三方下架游戏，停用帐号人工提出余额'
					,'游戏站内/站外对打，停用帐号人工提出余额'
					,'支付刷单，停用帐号人工提出余额'
					,'支付骗单，停用帐号人工提出余额'
					,'倍投永久冻结'
					,'此会员劣质会员停用返水，关闭线上支付，拉黑活动黑名单！取消优惠公司入款！'
					,'此会员劣质！长庄长闲永久冻结！'
					,'上级处理此会员劣质会员多账号永久冻结'
					,'上级处理多账号，倍投永久冻结'
					,'此会员劣质会员投注倍数高返水调整0.3%，关闭线上支付，拉黑活动黑名单！'
					,'拉黑活动黑名单！锁定0.5返水其他正常'
					,'超高优惠,金管家调整0级,暂时其他正常,下个月优惠超15%在关闭其他优惠！'
					,'上级处理此会员劣质,金管家调整10级,暂时其他正常!'
					,'上级处理此会员低倍套利,金管家调整0级,拉黑活动黑名单！取消优惠公司入款！'
					,'上级处理此会员劣质会员,金管家调整0级,停用返水,拉黑活动黑名单！取消优惠公司入款！'
				],
				rules: {
					userName: [
						{
							required: true,
							message: "请输入会员账号",
							trigger: "blur"
						}
					],
					agencyName: [
						{
							required: true,
							message: "请选择上级代理",
							trigger: "blur"
						}
					],
					email: [
						{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
					],
					phone: [
						{
							pattern: /^1(3|4|5|7|8|6)\d{9}$/,
							message: "请输入正确的手机格式",
							trigger: "blur"
						}
					],
					shareMin: [
						{
							required: true,
							message: "请选择起始等级",
							trigger: "change",
							pattern: /.+/
						}
					],
					shareMax: [
						{
							required: true,
							message: "请选择最高等级",
							trigger: "change",
							pattern: /.+/
						}
					],
					wageConfigMin: [
						{
							required: true,
							message: "请选择起始等级",
							trigger: "change",
							pattern: /.+/
						}
					],
					withdrawMultiple:[
						{
							required: true,
							message: "请输入提款打码倍数",
							trigger: "blur",
							pattern: /.+/
						}

					],
					wageConfigMax: [
						{
							required: true,
							message: "请选择最高等级",
							trigger: "change",
							pattern: /.+/
						}
					]
				}
			};
		},
		created() {
			const { uid, siteId } = this.$route.query;
		
			this.getDetails({ params: { uid, siteId } });
			this.$Message.config({
				top: 50,
				duration: 1
			});
		},
		watch: {
			"formKey.agencyName": {
				handler(val, oldVal) {
					this.$refs.autoSearch.setDefault(val);
					let postData = {
						uname: val,
						siteId: this.$root.nowSite.id
					};
					this.getRebateSetting(postData);
				}
			},
			"formKey.wageType"(val) {
				this.wageDisable = val == 0 ? true : false;
			},
			"formKey.shareoutbonusType"(val) {
				this.shareDiable = val == 0 ? true : false;
			},
			collapsed: {
				handler(val, oldVal) {},
				deep: true,
				immediate: true
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				if (!vm.$root.checkCommission() && vm.$route.query.agencyId == 0)
					vm.editable = true; //b模式大股东可调
				if (!vm.$root.checkCommission() && vm.$route.query.agencyId != 0)
					vm.editable = false;
				vm.isShareholder = vm.$route.query.agencyId == 0 ? true : false;
				vm.from = from.name;
			});
		},
		mounted(){
			const _this = this
			const erd = elementResizeDetectorMaker()
			erd.listenTo(document.getElementById("flexBox"),(element)=>{
				_this.$nextTick(()=>{
					_this.paddingNum = ((element.offsetWidth-1)/4)-250
					_this.itemWidth = (element.offsetWidth-1)/4
				})
			})
			
		},
		methods: {
			changeText(){
				this.formKey.remark=this.remarkText=='自定义'?'':this.$root.formatTime()+`,`+this.remarkText;
			},
			lockChange(data) {
				if (this.$root.modeName() == "no" || this.$root.modeName() == "mode_a"||this.$root.modeName() == 'mode_d_a'||this.$root.modeName() == 'mode_d_b') {
					// console.log(data)
					this.refundLock = data;
					// console.log(this.refundLock)
				}
			},
			noChangeData(val) {},
			// 获取站点返水
			getSiteData() {
				let data = {
					siteId: this.$root.nowSite.id,
					uname: ""
				};
				agencyRebatePlatform(data).then(res => {
					let { rebate, platform } = res.data;
					this.rebate.forEach(item => {
						let a = rebate.filter(k => k.id === item.id);
						item.parent_rebate = a[0] ? a[0].rebate : "";
					});
					for (let i in platform) {
						platform[i].list.forEach(item => {
							item.parent_refund = +item.value;
							item.name_cn = item.name;
							item.name_en = item.key;
							item.refund = item.value;
						});
					}
					if (this.$route.query.agencyId != "0") this.refund = platform;
					this.rebateShow = true;
				});
			},
			// 获取自动搜索框的代理名
			getSuperior(val) {
				this.formKey.agencyName = val;
			},
			getId(data) {
				this.formKey.agencyId = data;
			},
			getDetails(params) {
				memberDetail(params)
					.then(res => {
						if (res != undefined && res.code == 200) {
							const {
								basic,
								rebate,
								refund,
								bank_info,
								shareoutbonusConfig,
								wageConfigInfo,
								memberRealNameLimit
							} = res.data;
							this.trueNameDis = !(
								memberRealNameLimit && memberRealNameLimit.length > 0
							);
							this.realNameList = memberRealNameLimit;
							this.wageList = wageConfigInfo.sort((a, b) => {
								return a.level - b.level;
							});
							this.shareoutList = shareoutbonusConfig.sort((a, b) => {
								return a.level - b.level;
							});
							this.rebate = rebate;
							this.rebate.forEach(item => {
								item.rebate = Number(item.rebate).toFixed(2);
							});
							this.refund = refund;
							this.bankInfo = bank_info;
							for (let key1 in this.formKey) {
								for (let key2 in basic) {
									if (key1 !== key2) continue;
									this.formKey[key1] = basic[key2];
								}
							}
							this.formKey.shareoutbonusType =
								String(this.formKey.shareoutbonusType) || "0";
							this.formKey.wageType = String(this.formKey.wageType) || "0";
							if (basic.shareoutbonusType == 1) {
								this.formKey.shareMin = JSON.parse(basic.shareoutbonusConfig).min;
								this.formKey.shareMax = JSON.parse(basic.shareoutbonusConfig).max;
							}
							if (basic.wageType == 1) {
								this.formKey.wageConfigMin = JSON.parse(basic.wageConfig).min;
								this.formKey.wageConfigMax = JSON.parse(basic.wageConfig).max;
							}
							if (!basic.commission_type)
								this.formKey.commission_type =
									this.$root.modeName() == "no" ||
									this.$root.modeName() == "mode_c"
										? "3"
										: "1";
							// no模式大股东和代理默认佣金状态开启
							if (
								this.$root.modeName() == "no" &&
								!this.$route.query.account_type &&
								!basic.commission_type
							)
								this.formKey.commission_type = "3";
							if (
								this.formKey.commission_type == "0" ||
								this.formKey.commission_type == "1"
							)
								this.formKey.commission_type = 1; //0与1需要经历一个弹窗，对应状态相同 传后台暂时传1
							this.formKey.commission_type = String(this.formKey.commission_type);
							this.refundLock = basic.itself_refund;
						}
					})
					.then(a => {
						if (this.$route.query.agencyId == 0) {
							this.getSiteData();
						}
					});
			},
			secondSure() {
				this.$refs.successModal.hide();
				this.$Message.success(this.title);
			},
			getRebateSetting(data) {
				agencyRebatePlatform(data).then(res => {
					let { rebate, platform } = res.data;
					rebate.forEach(item => {
						let a = rebate.filter(k => k.id === item.id);
						item.parent_rebate = a[0] ? a[0].rebate : "";
					});
					this.rebateShow = true;
				});
			},
			onRebateChange(res) {
				this.formKey.rebate = res;
			},
			onRefundChange(res) {
				this.formKey.refund = res;
			},
			onCopy() {
				this.$Message.success(`复制${this.result}成功!`);
				this.$refs.successModal.hide();
			},
			submit() {
				this.$refs.Form.validate(valid => {
					if (valid) {
						const { siteId, agencyId } = this.$route.query;
						let params = { ...this.formKey };
						params.siteId = siteId;
						
						for (let key in params) {
							if (!params[key] && key != "withdrawDayLimit" && key != "remark")
								delete params[key];
							if (!params[key] && key != "withdrawDayLimit" && key != "wechat")
								delete params[key];
							
						}
						if (!params.withdrawDayLimit) params.withdrawDayLimit = 0;
						if (agencyId == 0) {
							params.agencyId = agencyId;
							params.agencyName = "";
						}
						delete params.userName;
						if (!params.remark) params.remark = "   ";
						if (!params.wechat) params.wechat = " ";
					
						if (this.$root.checkCommission()) {
							if (!params.rebate)
								params.rebate = this.$refs.rebateSelect.createData();
							if (!params.refund)
								params.refund = this.$refs.refundSelect.createData();
						}
						if (params.shareoutbonusType == 1) {
							if (Number(params.shareMin) > Number(params.shareMax)) {
								this.$Message.error("最高等级不能低于起始等级");
								return false;
							}
						}
						if (params.wageType == 1) {
							if (Number(params.wageConfigMin) > Number(params.wageConfigMax)) {
								this.$Message.error("最高等级不能低于起始等级");
								return false;
							}
						}
						this.$root.startEditLoading();
						if (params.wageType == 1)
							params.wageConfig = JSON.stringify({
								min: params.wageConfigMin,
								max: params.wageConfigMax
							});
						if (params.shareoutbonusType == 1)
							params.shareoutbonusConfig = JSON.stringify({
								min: params.shareMin,
								max: params.shareMax
							});
						if (params.wageConfigMin) delete params.wageConfigMin;
						if (params.wageConfigMax) delete params.wageConfigMax;
						if (params.shareMin) delete params.shareMin;
						if (params.shareMax) delete params.shareMax;
						// 无联系方式权限时，不传联系方式参数
						if (
							this.adminType != "super" &&
							this.authInPage.indexOf("MemberContact") == -1
						) {
							if (params.email) delete params.email;
							if (params.phone) delete params.phone;
							if (params.wechat) delete params.wechat;
	
						}
						if (!params.commission_type && this.$root.modeName() == "no") {
							params.commission_type = 3;
						}
						// no模式下会员无佣金状态
						if (this.$root.modeName() == "no" && this.$route.query.account_type)
							delete params.commission_type;
						if (this.realNameList && this.realNameList.length > 0) {
							if (this.selectedName) params.realName = this.selectedName;
						}
						if (
							this.$root.modeName() == "mode_a" ||this.$root.modeName() == "mode_d_a"||this.$root.modeName() == "mode_d_b"
							||this.$root.modeName() == "no"
						) {
							params.itself_refund = this.refundLock;
						}
						memberUpdate(params, true).then(res => {
							if (res != undefined && res.code == 200) {
								this.$Message.success("修改会员信息成功");
								const { siteId, uid,riskStatus,startTime,endTime,btnName} = this.$route.query;
										if (this.from == "memberDetails") {
									this.$router.push({
										name: this.from,
										query: { uid, siteId}
									});
								}else if(this.from == "auditDetails"){
									this.$router.push({
										name: this.from,
										params:{from:'memberEdit'},
										query: { uid, siteId,riskStatus,startTime,endTime,btnName,userName:this.formKey.userName}
									});
								} 
								else {
									this.$router.push({
										name: this.from,
										params: { editPage: this.$route.query.page }
					 				});
								}
								
							
							}
						});
					}
				});
			},
			//重设
			resetMemberPassowrd(type) {
				const { siteId, uid } = this.$route.query;
				let data = { siteId, uid, type };
				let content, msg;
				switch (type) {
					case "secret":
						content = "您确认要重设密保答案吗？";
						msg = "重设密保答案成功！";
						this.okmsg = "密保答案";
						break;
					case "loginPwd":
						content = "您确认要重设登录密码吗？";
						msg = "重设登录密码成功！";
						this.okmsg = "登录密码";
						break;
					case "payPwd":
						content = "你确定要重设取款密码吗？";
						msg = "重设取款密码成功！";
						this.okmsg = "取款密码";
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
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
	/deep/.ivu-form-item-label{
  width: 120px !important;
}
	/deep/.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
		padding-left: 0;
	}
	/deep/.ivu-collapse-content {
		color: #444;
		padding: 0;
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
	// /deep/.auto-serch {
	// 	.ivu-input-wrapper {
	// 		left: -10px;
	// 	}
	// }
	/deep/.ivu-input[disabled] {
		background-color: #fff !important;
		color: #444 !important;
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
	.real {
		/deep/.ivu-select-selection {
			height: 36px !important;
		}
	}
	/deep/.ivu-select-selected-value {
		color: #444;
	}
	#flexBox {
		display: flex;
		flex-wrap: wrap;
	}
	.remarkInput {
		display: flex;
		flex: 1;
		/deep/.ivu-form-item-content {
			// width: ~"calc(100% - 300px)";
			flex: 1;
			// padding-right: ~"calc(25%*2 - 250px)";
		}
	}


</style>
