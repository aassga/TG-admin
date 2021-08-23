<template>
	<div>
		<div class="v2-search">
			<Form ref="searchKey" inline>
				<FormItem label="等级">
					<LevelSelect
						placeholder="全部"
						ref="LevelSelect"
						width="86"
						levelType="member"
						clearable
						@on-level-change="levelChange"
					/>
				</FormItem>
				<FormItem label="客户端">
					<Select clearable v-model="searchKey.lastDevice" class="s-95" placeholder="全部">
						<Option v-for="(t,i) in platformList" :key="i" :value="t.value">{{t.name}}</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Checkbox
						v-model="searchKey.isLike"
						:disabled="searchKey.typeTag == 'createIp' || searchKey.typeTag == 'lastIp' ? true : false"
					>
						<span class="pl5">模糊</span>
					</Checkbox>
				</FormItem>
				<FormItem>
					<Select v-model="searchKey.typeTag" class="s-100">
						<Option v-for="(t,i) in typeTagList" :key="'typeTag'+i" :value="t.value">{{t.name}}</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Input
						:placeholder="searchKey.isLike=='1'?'单个查询':'多个请以,逗号隔开'"
						class="s-160"
						v-model="searchKey.content"
						:disabled="!searchKey.typeTag"
						@keyup.enter.native="searchSubmit"
					/>
				</FormItem>
				<FormItem>
					<Button type="primary" class="search" :loading="$root.tableLoading" @click.prevent="searchSubmit">查询</Button>
				</FormItem>
				<FormItem v-if="(adminType == 'super') || (authInPage.indexOf('memberMessageExport') != -1)">
					<Button
						type="primary"
						:loading="$root.editBtnLoading"
						class="ivu-btn export"
						@click.prevent="exportExcel"
					>导出EXCEL</Button>
				</FormItem>
			</Form>
		</div>
		<div class="v2-table">
			<Tables
				ref="table"
				:rowClassName="mydefineRow"
				editable
				:columns="table.columns"
				:loading="$root.tableLoading"
				:value="table.data"
				:total="table.total"
				@on-page-change="onPageChange"
				:pageSizeOpts="table.pageSizeOpts"
				@on-page-size-change="onPageSizeChange"
				@on-sort-change="sortChange"
			></Tables>
		</div>
		<Modals ref="historyModal" title="历史登陆">
			<div slot="content" class="modal-overflow">
				<Tables
					:columns="historyTable.columns"
					:loading="historyTable.loading"
					:value="historyTable.data"
					:page="false"
				></Tables>
			</div>
		</Modals>
		<Modals ref="removeMembers" title="代理降级" width="560">
			<div slot="content">
				<div class="h50 f6Color mt20f mb10">
					<Icons type="danchuangtishi" size="22" class="ib ml20 mt8" />
					<span class="ft14 ib ml10">降级前需先将其下所有会员（代理和会员）转移到其它代理下</span>
				</div>
				<Form ref="changeMember" :model="changeMemberInfo" style="width: 560px;" :label-width="170">
					<FormItem label="原代理">
						<p class="w260x">{{changeMemberInfo.oldAgencyName}}</p>
					</FormItem>
					<FormItem label="转移至代理" class="member">
						<AutoSearch
							ref="autoSearch"
							:width="260"
							:siteId="$root.nowSite.id"
							@sendId="getAgencyId"
							@sendSuperior="getSuperior"
						></AutoSearch>
					</FormItem>
					<FormItem class="mt20">
						<Button type="primary" class="w260x ivu-btn submit " @click="agencyDown" :loading="$root.editBtnLoading">确认降级</Button>
					</FormItem>
				</Form>
			</div>
		</Modals>
		<!-- <Modals ref="exportType" title="请选择导出字段">
			<div slot="content">
				<div class="lh40 f6f8-bg ti17 bb bt">
					<Checkbox
						:indeterminate="indeterminate"
						:value="checkAll"
						@click.prevent.native="handleCheckAll"
					>全选</Checkbox>
				</div>
				<CheckboxGroup class="clearfix" v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox
						class="checkOne lh50 ib fl w16"
						v-for="(t,i) in exportDataList"
						:key="'check' + i"
						:label="t.value"
					>{{t.name}}</Checkbox>
				</CheckboxGroup>
				<div class="bt">
					<Button type="primary" class="search btn" @click="batchExport">确定</Button>
				</div>
			</div>
		</Modals> -->
		<!-- 分批导出的弹框 -->
		<!-- 导出样式更改 -->
		<!-- <Modals :width="560" ref="exportPageModal" title="温馨提示" class="modalBox">
			<div
				slot="content"
				class="modal-overflow clearfix ft14 mt5 mt20f mb20"
				:style="exportPage.length>5?'height:370px':''"
			>
				<div class="f6Color">
					<Icons class="ml23 iconColor" type="danchuangtishi" size="18" />
					<span class="pb10 pt10 ft14 ib ml10 f-color">当前查询结果共{{exportTotal}}条，需要分批导出！</span>
				</div>
				<div
					class="blue-font fl w50"
					v-for="(t,i) in exportPage"
					:style="{color: t.status == 'yes' ? '#918b8b' : ''}"
					:key="'export' + i"
					@click="batchExportIndex((t.index)+1)"
				>
					<span
						class="ft14 mt20 ib bd b w210x pt10 pb10 txt-a ml35"
						v-if="exportPage && i < (exportPage.length - 1)"
					>导出第{{(10000*(t.index) + 1)}} ~ {{10000 * ((t.index)+1)}}条数据</span>
					<span
						class="ft14 ib mt20 bd b w210x pt10 pb10 txt-a ml35"
						v-if="exportPage && i == (exportPage.length - 1)"
					>导出第{{(10000*(t.index) + 1)}}~ {{exportTotal}}条数据</span>
				</div>
			</div>
		</Modals> -->
		<!-- 重写的弹框 头大 -->
		<Modals ref="codeTip" width="460" title="温馨提示">
			<div slot="content" class="codeTip">
				<div class="top clearfix">
					<Icons type="danchuangtishi" color="#57A3F3" :size="26"></Icons>
					<p class="tipMessage">{{tip}}</p>
				</div>
				<div class="bottom">
					<Button type="primary" class="b" @click="() => { this.$refs.codeTip.hide() }">确定</Button>
				</div>
			</div>
		</Modals>
		<memberCodeDetail :uid="uid" ref="codeDetail"></memberCodeDetail>
		<ExportModal ref="exportModal" @exportData="exportData"></ExportModal>
	</div>
</template>
<script>
	import Tables from "@/components/tables";
	import Icons from "@/components/icons";
	import Modals from "@/components/modals";
	import FundsForms from "./components/funds-forms";
	import LevelSelect from "@/components/level-select";
	import { Tooltip } from "view-design";
	import AutoSearch from "_c/auto-search";
	import { sortInteraction, getUserType } from "@/libs/util";
	import memberCodeDetail from "./components/member-code-detail";
	import { mapState } from "vuex";
	import ExportModal from "./components/exportModal";
	import {
		getMemberTableData,
		memberModifyStatus,
		memberDetail,
		thirdBalanceRecycle,
		refreshThirdBalance,
		memberBalanceHandle,
		memberKickOffline,
		memberExport
	} from "@/api/member";
	import tableMixins from "@/mixins/table";
	export default {
		// name: "memberOnline",
		mixins: [tableMixins],
		components: {
			Tables,
			Icons,
			Modals,
			FundsForms,
			LevelSelect,
			memberCodeDetail,
			AutoSearch,
			ExportModal
		},
		data() {
			return {
				// exportTotal: 0,
				indeterminate: false,
				checkAll: false,
				checkAllGroup: [],
				uid: 0,
				adminType: getUserType(),
				authInPage: JSON.parse(localStorage.authInPage),
				page: 1,
				platformList: [
					{ value: "pc", name: "PC" },
					{ value: "h5", name: "H5" },
					{ value: "ios", name: "IOS" },
					{ value: "android", name: "Android" }
				],
				tip: "",
				changeMemberInfo: {
					new_parent_uid: null, // 转移的代理id
					oldAgencyName: null, // 原代理id,
					siteId: this.$root.nowSite.id,
					uid: null,
					statusKey: "",
					statusVal: ""
				},
				typeTagList: [
					{ value: "userName", name: "会员账号" },
					{ value: "agencyName", name: "上级代理" },
					{ value: "realName", name: "真实姓名" },
					{ value: "phone", name: "手机号码" },
					{ value: "shareholder", name: "大股东" },
					{ value: "lastIp", name: "登录IP" },
					{ value: "createIp", name: "注册IP" },
					{ value: "wechat", name: "微信号" },
					{ value: "email", name: "Email" }
				],
				Time: [],
				fundsModalTitle: "加款/减款",
				searchKey: {
					status: "online",
					typeTag: "userName",
					siteId: this.$root.nowSite.id
				},
				oprateTypes: {
					add: {
						manual: {
							id: 0,
							type: "deposit",
							subType: "manual",
							class: "存款",
							subClass: "人工汇款"
						},
						giftBonusAdmin: {
							id: 1,
							type: "bonus",
							subType: "giftBonusAdmin",
							class: "彩金",
							subClass: "彩金派送"
						},
						RebateBonus: {
							type: "bonus",
							subType: "manualRebateBonus",
							class: "返水",
							subClass: "返水派送"
						},
						bonus: {
							id: 3,
							type: "bonus",
							subType: "manualBonus",
							class: "优惠",
							subClass: "汇款优惠"
						},
						transfer: {
							id: 4,
							type: "deposit",
							subType: "transfer",
							class: "额度转换",
							subClass: "额度转换失败"
						},
						other: {
							id: 5,
							type: "other",
							subType: "other",
							class: "其他",
							subClass: "其他"
						}
					},
					reduce: {
						manual: {
							id: 6,
							type: "withdrawals",
							subType: "manual",
							class: "取款",
							subClass: "人工提出"
						},
						other: {
							id: 7,
							type: "other",
							subType: "other",
							class: "其他",
							subClass: "其他"
						}
					}
				},
				table: {
					loading: true,
					total: 0,
					pageSizeOpts: [20, 30, 40, 50],
					columns: [
						{
							title: "会员账号",
							key: "userName",
							align: "center",
							width:
								screen.width > 1600 && screen.width < 2000
									? 200
									: screen.width > 2000
									? 240
									: "",
							minWidth: screen.width < 1600 ? 130 : "",
							render: (h, params) => {
								let flag = true;
								const { lastDevice } = params.row;
								return (
									<div>
										<span
											style={{
												width:
													screen.width < 1600
														? "100px"
														: screen.width < 2000 && screen.width > 1600
														? "120px"
														: "125px",
												cursor: "pointer",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												display: "inline-block"
											}}
											ondblclick={() => {
												if (
													this.adminType == "super" ||
													this.authInPage.indexOf("checkBetAmount") != -1
												) {
													this.uid = params.row.uid;
													this.$nextTick(() => {
														this.$refs.codeDetail.getCodeDetail();
													});
												} else {
													this.$Tip.info({ content: "您尚未开通此权限" });
												}
											}}
										>
											{params.row.userName}
										</span>
										<Tooltip
											placement="right"
											title={
												params.row.userName.length > 9 ? params.row.userName : ""
											}
										>
											<div
												style={{
													display: "flex",
													justifyContent: "space-around",
													alignItems: "center"
												}}
											>
												<Icons
													class="ml10"
													type={
														lastDevice == "pc"
															? "zu"
															: lastDevice == "h5"
															? "zu6"
															: lastDevice == "ios"
															? "zu5"
															: "zu3"
													}
													color={
														params.row.online == "off" ? "#B3B3B3" : "#57A3F3"
													}
													size="22"
												/>
											</div>
											<div slot="content">
												{params.row.online === "off"
													? "离线"
													: params.row.lastDevice == "android"
													? "Android"
													: params.row.lastDevice.toUpperCase() + "在线"}
											</div>
										</Tooltip>
									</div>
								);
							}
						},
						{
							title: "上级代理",
							key: "agencyName",
							align: "center",
							minWidth: 95,
							tooltip: true,
							render: (h, params) => (
								<span>{this.$root.text(params.row.agencyName)}</span>
							)
						},
						{
							title: "姓名",
							key: "realname",
							align: "center",
							tooltip: true,
							minWidth: 60,
							render: (h, params) => {
								return <span>{this.$root.text(params.row.realName)}</span>;
							}
						},
						{
							title: "账号类型",
							key: "account_type",
							align: "center",
							minWidth: 60
						},
						{
							title: "等级",
							key: "levelAlias",
							align: "center",
							minWidth: 45
						},

						{
							title: "账号余额",
							key: "balance",
							align: "center",
							sortable: "custom",
							minWidth: 75,
							render: (h, params) => {
								let { last, list } = params.row.wallet;
								list.forEach(item => {
									if (item.name == "代理收入") {
										list.splice(1, 1);
									}
								});
								return (
									<Tooltip
										placement="bottom"
										width="900"
										style={{ display: "block" }}
										class="money-tip"
									>
										<a class="blue-font">{Number(params.row.balance).toFixed(2)}</a>
										<div slot="content">
											<div>
												<div class="tooltip-title flex-row">
													<div
														class="txt-right-liner mt10"
														style={{
															display:
																this.adminType == "super" ||
																this.authInPage.indexOf("thirdBalanceRecycle") !=
																	-1
																	? "inline-block"
																	: "none"
														}}
													>
														<Icons
															type="huiyuanchaxunzhuanhui"
															color="#FFF"
															size="20"
														/>
														<span
															class="icon-right-txt"
															onClick={e => {
																this.changeBalance(params);
															}}
														>
															{" "}
															转回{" "}
														</span>
													</div>
													<div
														class="txt-right-liner mt10 right-liner-none"
														style={{
															display:
																this.adminType == "super" ||
																this.authInPage.indexOf("refreshThirdBalance") !=
																	-1
																	? "inline-block"
																	: "none"
														}}
													>
														<Icons
															type="huiyuanchaxunshuaxin"
															color="#FFF"
															size="18"
														/>
														<span
															class="icon-right-txt"
															onClick={e => {
																this.refreshBalance(params);
															}}
														>
															{" "}
															刷新{" "}
														</span>
													</div>
												</div>
												<div class="tooltip-section flex-row">
													{list.length ? (
														list.map((item, index) => (
															<div class="items balance">
																<span>{item.name}</span>
																<span
																	style={{ opacity: item.balance ? "1" : "0" }}
																>
																	{" "}
																	:{" "}
																</span>
																<span>
																	{" "}
																	{item.balance &&
																		Number(item.balance).toFixed(2)}{" "}
																</span>
															</div>
														))
													) : (
														<div
															class="item"
															style={{ textAlign: "center", width: "100%" }}
														>
															{" "}
															加载中{" "}
														</div>
													)}
												</div>
											</div>
										</div>
									</Tooltip>
								);
							}
						},
						{
							title: "佣金余额",
							key: "agency_balance",
							align: "center",
							minWidth: 60,
							sortable: "custom",
							render: (h, params) => (
								<span>{Number(params.row.agency_balance).toFixed(2)}</span>
							)
						},
						{
							title: "注册时间",
							key: "created_at",
							align: "center",
							minWidth: 130,
							render: (h, params) => {
								return (
									<span>{this.$root.newUnixTime(params.row.created_at)}</span>
								);
							}
						},
						{
							title: "操作",
							align: "center",
							minWidth: 320,
							render: (h, params) => {
								return (
									<div>
										<span
											class="ib mr10 blue-font"
											style={{
												display:
													this.adminType == "super" ||
													this.authInPage.indexOf("memberKickOffline") != -1
														? "inline-block"
														: "none"
											}}
											onClick={() => {
												this.$Tip.confirm({
													content: "您确定将该会员踢下线吗？",
													onOk: () => {
														let data = {
															siteId: this.$root.nowSite.id,
															uid: params.row.uid
														};
														memberKickOffline(data, true).then(res => {
															if (res != undefined && res.code == 200) {
																this.$Message.success("踢线会员成功");
																this.searchSubmit();
															}
														});
													}
												});
											}}
										>
											踢线
										</span>
										<span
											class="ib mr10 blue-font"
											style={{
												display:
													this.adminType == "super" ||
													this.authInPage.indexOf("memberModifyStatus") != -1
														? "inline-block"
														: "none",
												color: params.row.status !== "yes" ? "red" : ""
											}}
											onClick={() => {
												this.changeStatus(params, "status");
											}}
										>
											{params.row.status == "yes" ? "状态正常" : "状态停用"}
										</span>
										<span
											class="ib mr10 blue-font"
											style={{
												display:
													this.adminType == "super" ||
													this.authInPage.indexOf("memberModifyStatus") != -1
														? "inline-block"
														: "none",
												color: params.row.refundBonus !== "yes" ? "red" : ""
											}}
											onClick={() => {
												this.changeStatus(params, "refundBonus");
											}}
										>
											{params.row.refundBonus === "yes" ? "返水正常" : "返水停用"}
										</span>
										<span
											class="ib mr10 blue-font"
											style={{
												display:
													this.adminType == "super" ||
													this.authInPage.indexOf("memberDetail") != -1
														? "inline-block"
														: "none"
											}}
											onClick={() => {
												this.$router.push({
													name: "memberDetails",
													query: {
														siteId: this.nowSite.id,
														uid: params.row.uid
													}
												});
											}}
										>
											详情
										</span>
										<span
											class="ib mr10 blue-font"
											style={{
												display:
													this.adminType == "super" ||
													this.authInPage.indexOf("memberUpdate") != -1
														? "inline-block"
														: "none"
											}}
											onClick={() => {
												const {
													uid,
													siteId,
													agencyId,
													account_type
												} = params.row;
												this.$router.push({
													name: "memberEdit",
													params: { page: "edit" },
													query: {
														uid,
														siteId,
														agencyId,
														account_type: account_type.includes("会员") ? 1 : 0,
														page: this.page
													}
												});
											}}
										>
											编辑
										</span>
										<span
											class="ib mr10 blue-font"
											style={{
												display:
													(this.adminType == "super" ||
														this.authInPage.indexOf("memberAgentUpdownControl") !=
															-1) &&
													(this.$root.modeName() == "mode_b" ||
														this.$root.modeName() == "no")
														? "inline-block"
														: "none",
												color: params.row.agencyId == 0 ? "#918b8b" : "#2D8CF0"
											}}
											onClick={() => {
												if (params.row.agencyId != 0)
													this.changeStatus(params, "is_agency");
											}}
										>
											{params.row.is_agency !== 1 ? "晋升代理" : "降为会员"}
										</span>
									</div>
								);
							}
						}
					],
					data: []
				},
				historyTable: {
					loading: true,
					columns: [
						{
							title: "登陆设备",
							key: "device",
							align: "center"
						},
						{
							title: "登陆域名",
							key: "domain",
							align: "center"
						},
						{
							title: "登陆IP",
							key: "ip",
							align: "center"
						},
						{
							title: "归属地",
							key: "location",
							align: "center"
						},
						{
							title: "登陆时间",
							key: "created_at",
							align: "center",
							render: (h, params) => (
								<span>{this.$root.unixTime(params.row.created_at)}</span>
							)
						}
					],
					data: []
				},
				exportPage: [],
				exportLimit: "10000",
				odalPostData: {}
			};
		},
		computed: {
			modalKey() {
				const { title } = this.$route.meta;
				return title !== "加款减款" ? "oneTabFundsModal" : "twoTabFundsModal";
			},
			fundsKey() {
				const { title } = this.$route.meta;
				return title !== "加款减款" ? "oneTabFundsForms" : "twoTabFundsForms";
			},
			balance() {
				return this.$store.state.app.refreshBalance;
			},
			...mapState({
				exportDataList: state => state.info.exportDataList
			})
		},
		watch: {
			nowSite: {
				handler(val, oldVal) {
					this.$nextTick(() => {
						const { name } = this.$route;
						name === "memberOnline" && this.$refs.LevelSelect.init(val.id);
					});
				},
				deep: true,
				immediate: true
			},
			"balance.count"() {
				if (this.$route.name === this.balance.name) this.searchSubmit();
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				if (to.meta.title === "加款减款") vm.$refs.twoTabFundsModal.show();
			});
		},
		methods: {
			mydefineRow(row, index) {
				if (
					row.agency_balance < 0 ||
					row.balance < 0 ||
					row.status == "ablnormal"
				) {
					return "demo-row-red";
				}
				return "";
			},
			//新的导出 超出需要分页
			exportData(obj) {
				this.exportPage = [];
				let { postData, count } = obj;
				this.modalPostData = postData;
				this.exportTotal = count;
				let num = count % 10000 == 0 ? count / 10000 : Math.ceil(count / 10000);
				for (let i = 0; i < num; i++) {
					this.exportPage.push({ index: i, status: "no" });
				}
				this.$refs.exportPageModal.show();
			},
			// exportLimitChange(val) {
			//   if (this.table.total > 0) {
			//     this.exportPage = []
			//     let num = ((this.table.total) % val) == 0 ? (this.table.total) / val : Math.floor((this.table.total) / val) + 1
			//     for (let i = 0 ;i < num; i ++) {
			//       this.exportPage.push({ index: i, status: 'no' })
			//     }
			//   }
			// },
			// 确定导出字段
			// batchExport() {
			// 	if (this.checkAllGroup.length == 0) {
			// 		this.$Message.error("请选择导出字段");
			// 		return false;
			// 	} else {
			// 		this.exportTotal = this.table.total;
			// 		if (this.table.total > 150000) {
			// 			let num =
			// 				this.table.total % 10000 == 0
			// 					? this.table.total / 10000
			// 					: Math.floor(this.table.total / 10000) + 1;
			// 			for (let i = 0; i < num; i++) {
			// 				this.exportPage.push({ index: i, status: "no" });
			// 			}
			// 			this.$refs.exportPageModal.show();
			// 			this.$refs.exportType.hide();
			// 		} else {
			// 			this.$refs.exportType.hide();
			// 			let data = {
			// 				...this.searchKey,
			// 				isExport: 1,
			// 				export_column: this.checkAllGroup.join(",")
			// 			};
			// 			if (data.isLike) data.isLike = Number(data.isLike);
			// 			let openr = window.open();
			// 			getMemberTableData({ params: data }).then(res => {
			// 				if (res != undefined && res.code == 200) {
			// 					let region = res.data.downloadUrl;
			// 					let nowHost = region.split(".com")[1];
			// 					let openr1 = openr ? openr : window;
			// 					openr1.location.href = nowHost;
			// 				} else openr.close();
			// 			});
			// 		}
			// 	}
			// },
			handleCheckAll() {
				this.checkAll = this.indeterminate ? false : !this.checkAll;
				this.indeterminate = false;
				if (this.checkAll) {
					this.exportDataList.forEach(t => {
						this.checkAllGroup.push(t.value);
					});
				} else this.checkAllGroup = [];
			},
			checkAllGroupChange(data) {
				if (data.length == this.exportDataList.length) {
					this.indeterminate = false;
					this.checkAll = true;
				} else if (data.length > 0) {
					this.indeterminate = true;
					this.checkAll = false;
				} else {
					this.indeterminate = false;
					this.checkAll = false;
				}
			},
			// batchExportIndex(index) {
			// 	this.$root.startEditLoading();
			// 	let data = { ...this.modalPostData, export_page: index };
			// 	if (10000 * index > this.exportTotal)
			// 		data.export_limit = this.exportTotal - (10000 + (index - 1) + 1);
			// 	else data.export_limit = "10000";
			// 	data.isExport = 1;
			// 	// let data = {
			// 	//   ...this.searchKey,
			// 	//   isExport: 1,
			// 	//   export_column: this.checkAllGroup.join(","),
			// 	//   export_page: index,
			// 	//   export_limit: "10000"
			// 	// };
			// 	let openr = window.open();
			// 	memberExport(data)
			// 		.then(res => {
			// 			if (res != undefined && res.code == 200) {
			// 				this.exportPage[index - 1].status = "yes";
			// 				let region = res.data.downloadUrl;
			// 				let nowHost = region.split(".com")[1];
			// 				let openr1 = openr ? openr : window;
			// 				openr1.location.href = nowHost;
			// 			} else openr.close();
			// 			this.$root.endEditLoading();
			// 		})
			// 		.catch(error => this.$root.endEditLoading());
			// },
			exportExcel() {
				this.$refs.exportModal.createModal();
				// this.checkAllGroup = []
				// this.$refs.exportType.show()
			},
			getAgencyId(val) {
				this.changeMemberInfo.new_parent_uid = val;
			},
			getSuperior(val) {
				if (val == false) delete this.changeMemberInfo.new_parent_uid;
			},
			levelChange(res) {
				this.searchKey.levelId = res.levelLabel;
			},
			onPageChange(page) {
				let data = { ...this.searchKey, siteId: this.$root.nowSite.id };
				this.page = page;
				if (!data.content) delete data.content;
				else {
					if (data.content) data.content = this.$root.trimAll(data.content);
					if (data.isLike) {
						let reg = /^[a-zA-Z0-9_-]{1,}$/;
						if (!reg.test(data.content)) {
							this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
							return false;
						}
					} else {
						if (!this.$root.validateName(data.content)) {
							this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
							return false;
						}
					}
				}
				this.getData({ params: data, query: { page } });
			},
			agencyDown() {
				let { new_parent_uid } = this.changeMemberInfo;
				if (!new_parent_uid) {
					this.$Tip.info({ content: "请选择您要转移至的代理" });
				} else {
					if (new_parent_uid == this.changeMemberInfo.uid) {
						this.$Tip.info({ content: "您不能指定自己为上级代理" });
						return false;
					}
					this.$root.startEditLoading();
					let data = { ...this.changeMemberInfo };
					delete data.oldAgencyName;
					memberModifyStatus(data, true).then(res => {
						if (res != undefined && res.code == 200) {
							this.$refs.removeMembers.hide();
							this.$Message.success(res.data);
							this.getData({
								params: this.searchKey,
								query: { page: this.page }
							});
						} else if (res == undefined) this.$refs.codeTip.show();
					});
				}
			},
			//刷新余额
			refreshBalance(params) {
				const { siteId, uid } = params.row;
				params.row.wallet.list = [];
				refreshThirdBalance({ siteId, uid }).then(res => {
					let { platform_balance, wallet_balance } = res.data;
					if (!platform_balance) {
						params.row.wallet.list = [
							{
								platform: "WALLET",
								name: "余额",
								balance: Number(wallet_balance).toFixed(2)
							}
						];
					} else {
						params.row.wallet.list = [
							{
								platform: "WALLET",
								name: "余额",
								balance: Number(wallet_balance).toFixed(2)
							},
							...res.data.platform_balance
						];
					}
				});
			},
			changeBalance(params) {
				const { siteId, uid } = params.row;
				this.$Tip.confirm({
					content: "您确定回收该用户的第三方余额吗？",
					onOk: () => {
            thirdBalanceRecycle({ siteId, uid });
            this.getData({params:this.searchKey})
					}
				});
			},
			getData(data) {
				this.$root.startTableLoading();
				if (data.params.isLike) data.params.isLike = Number(data.params.isLike);
				let { startTime, endTime } = data.params;
				if (startTime) delete data.params.startTime;
				if (endTime) delete data.params.endTime;
				for (let key in data.params) {
					if (!data.params[key]) delete data.params[key];
				}
				getMemberTableData(data).then(res => {
					if (res != undefined && res.code == 200) {
						const { data, total } = res.data;
						this.table.data = data;
						this.table.total = total;
					} else {
						this.table.data = [];
					}
					this.$root.endTableLoading();
				});
			},
			//查询
			searchSubmit() {
				let { sortKey, sortVal } = this.searchKey;
				if (sortKey) delete this.searchKey.sortKey;
				if (sortVal) delete this.searchKey.sortVal;
				this.searchKey.content =
					this.searchKey.content && this.$root.trimAll(this.searchKey.content);
				this.table.columns.forEach(item => this.$set(item, "sortType", ""));
				let params = { ...this.searchKey };
				// 校验ip
				const { typeTag, content } = this.searchKey;
				if (typeTag == "createIp" || typeTag == "lastIp") {
					if (!content) {
						this.$Tip.info({ content: "请输入您要查询的IP" });
						return false;
					}
				}
				if (
					(typeTag && typeTag == "createIp" && content) ||
					(typeTag && typeTag == "lastIp" && content)
				) {
					if (!this.$root.checkIp(content)) {
						this.$Tip.info({ content: "您所查询的IP不正确，请重新输入" });
						return false;
					}
				}
				// 微信号
				if (typeTag && typeTag == "wechat" && content) {
					let reg = /^[-_a-zA-Z0-9]{5,25}$/;
					if (!reg.test(content)) {
						this.$Tip.info({ content: "您所查询微信号不正确，请重新输入" });
						return false;
					}
				}
				// email
				if (typeTag && typeTag == "email" && content) {
					let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
					if (!reg.test(content)) {
						this.$Tip.info({ content: "您所查询Email不正确，请重新输入" });
						return false;
					}
				}
				// 手机号
				if (typeTag && typeTag == "phone" && content) {
					let reg = /^1[3456789]\d{9}$/;
					if (!reg.test(content)) {
						this.$Tip.info({ content: "您所查询手机号码不正确，请重新输入" });
						return false;
					}
				}
				// 真实姓名
				if (typeTag && content && typeTag == "realName") {
					let reg = /^[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5_a-zA-Z0-9]+$/;
					let flag;
					if (content.includes(",")) {
						for (let item of content.split(",")) {
							flag = reg.test(item);
							if (!flag) {
								this.$Tip.info({
									content: "您所查询的真实姓名不正确，请重新输入"
								});
								return false;
							}
						}
					} else {
						if (!reg.test(content)) {
							this.$Tip.info({ content: "您所查询的真实姓名不正确，请重新输入" });
							return false;
						}
					}
				}
				this.searchKey.startTime = params.startTime;
				this.searchKey.endTime = params.endTime;
				params.siteId = this.nowSite.id;
				if (params.content) params.content = this.$root.trimAll(params.content);
				for (let key in params) {
					if (!params[key]) delete params[key];
				}
				if (params.isLike) {
					let flag;
					flag =
						params.typeTag == "userName" ||
						params.typeTag == "agencyName" ||
						params.typeTag == "shareholder"
							? true
							: false;
					let reg = /^[a-zA-Z0-9-_]{1,}$/;
					if (flag && !reg.test(params.content)) {
						this.$Tip.info({
							content: `您所查询的${
								params.typeTag == "userName"
									? "会员"
									: params.typeTag == "agencyName"
									? "代理"
									: "大股东"
							}账号不正确，请重新输入`
						});
						return false;
					}
				} else {
					let flag;
					flag =
						params.typeTag == "userName" ||
						params.typeTag == "agencyName" ||
						params.typeTag == "shareholder"
							? true
							: false;
					if (flag && !this.$root.validateName(params.content)) {
						this.$Tip.info({
							content: `您所查询的${
								params.typeTag == "userName"
									? "会员"
									: params.typeTag == "agencyName"
									? "代理"
									: "大股东"
							}账号不正确，请重新输入`
						});
						return false;
					}
				}
				this.$refs.table.setPage();
				this.getData({ params });
			},
			searchReset() {},
			changeStatus(params, key) {
				let text, msg, value, rowValue;
				const { status, refundBonus, is_agency } = params.row;
				switch (key) {
					case "status":
						text =
							status === "yes"
								? "您确定要停用此会员账号吗?"
								: "您确定要启用此会员账号吗?";
						msg = status === "yes" ? "停用状态成功" : "启用状态成功";
						value = status === "yes" ? 0 : 1;
						rowValue = status === "yes" ? "no" : "yes";
						break;
					case "refundBonus":
						text =
							refundBonus === "yes"
								? "您确定要停用此会员返水吗？"
								: "您确定要启用此会员返水吗？";
						msg = refundBonus === "yes" ? "停用返水成功" : "启用返水成功";
						value = refundBonus === "yes" ? 0 : 1;
						rowValue = refundBonus === "yes" ? "no" : "yes";
						break;
					case "is_agency":
						text =
							is_agency == 0
								? "您确定要升级此会员为代理吗？"
								: "您确定要降级该代理为会员吗？?";
						msg = is_agency == 0 ? "晋升代理成功" : "降级为会员成功";
						value = is_agency == 0 ? 1 : 0;
						rowValue = is_agency == 0 ? 1 : 0;
						break;
				}
				const data = {
					siteId: this.nowSite.id,
					uid: params.row.uid,
					statusKey: key,
					statusVal: value
				};
				this.$Tip.confirm({
					content: text,
					onOk: () => {
						// 不是代理升降级都可以调接口
						memberModifyStatus(data, true).then(res => {
							if (res != undefined && res.code == 200 && res.data.code != 400) {
								this.$Message.config({ top: 150, duration: 1 });
								this.$Message.success({ content: msg });
								this.getData({
									params: this.searchKey,
									query: { page: this.page }
								});
								// params.row[key] = rowValue;
								// let { account_type } = params.row;
								// let level = account_type.split("级")[0];
								// params.row.account_type = rowValue == 0 ? `${level}级会员` : `${level}级代理`;
							} else if (
								res != undefined &&
								res.code == 200 &&
								res.data.code == 400
							) {
								this.tip = res.data.message;
								const { userName, uid } = params.row;
								this.changeMemberInfo.oldAgencyName = userName;
								this.changeMemberInfo.uid = uid;
								this.changeMemberInfo.statusKey = key;
								this.changeMemberInfo.statusVal = value;
								this.$refs.autoSearch.removeDefault();
								this.$refs.removeMembers.show();
							}
						});
					}
				});
			},
			tabChange(tabName) {
				this.fundsModalTitle =
					tabName === "single" ? "加款/减款" : "批量加款/减款";
			},
			// submitFundsForm(params) {
			//   // params.remarks = '暂无备注'
			//   this.$root.startEditLoading(this);
			//   memberBalanceHandle(params).then(res => {
			//     if (res != undefined && res.code == 200) {
			//       let msg = params.handle === "+" ? "加款成功" : "减款成功";
			//       this.$refs[this.modalKey].hide();
			//       if (!this.fundsModalTitle.includes("批量"))
			//         this.$router.push({ name: "memberOnline" });
			//       else this.$router.push({ name: "memberFundsLog" });
			//     }
			//   });
			// },
			// loginHistory(params) {
			//   this.$refs.historyModal.show();
			//   this.$refs;
			//   memberDetail({ siteId: params.siteId, uid: params.uid }).then(res => {
			//     const { basic } = res.data;
			//     this.historyTable.loading = true;
			//     setTimeout(() => {
			//       this.historyTable.data = basic.login_history;
			//       this.historyTable.loading = false;
			//     }, 2000);
			//   });
			// },
			//排序传入站点，分页时候传入page
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
				if (data.sortVal == "normal") {
					this.table.columns.forEach(item => {
						if (item.key == column.key) this.$set(item, "sortType", "asc");
					});
					this.searchKey.sortVal = "asc";
					data.sortVal = "asc";
				} else {
					this.searchKey.sortVal = order;
					this.table.columns.forEach(item => {
						delete item.sortType;
					});
				}
				this.page == 1 ? "" : this.$refs.table.setPage();
				this.page == 1
					? this.getData({ params: data })
					: this.getData({ params: data, query: { page: 1 } });
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../styles/tabs.less";
  @import "../../styles/function.less";
  @import "../../styles/button.less";
	@h: 40px;
	/deep/.v2-table {
		.ivu-table-wrapper {
			overflow: visible;
		}
	}
	/deep/.tooltip-title {
		cursor: pointer;
		height: @h;
		line-height: @h;
		margin-bottom: 5px;
		position: relative;
		&::after {
			.after(100%, 1px, #7e7e7e, 0px, 45px);
		}
		.iconfont {
			vertical-align: middle;
		}
		.txt-right-liner {
			width: 50%;
			border-right: 1px solid #7e7e7e;
			text-align: center;
		}
		.icon-right-txt {
			color: #fff;
			margin-left: 3px;
			vertical-align: middle;
		}
		.right-liner-none {
			border-right: none;
		}
	}
	/deep/.money-tip {
		.ivu-tooltip-inner {
			min-width: 320px;
			max-width: 370px;
			padding: 0;
		}
	}
	/deep/.tooltip-section {
		flex-wrap: wrap;
		line-height: @h;
		justify-content: start;
		.items.balance {
			width: 50%;
			text-align: center;
			position: relative;
			border-right: 1px solid #7e7e7e;
		}
		.items::after {
			.after(100%, 0px, #7e7e7e, 0px, 40px);
		}
		&.borrow {
			.items {
				width: 100%;
				justify-content: flex-start;
				text-align: center;
				padding-left: 10px;
				text-indent: 10px;
				position: relative;
			}
			.items::after {
				.after(100%, 1px, #7e7e7e, 0px, 40px);
			}
		}
	}
	/deep/.expand {
		@h: 40px;
		.section {
			.row > .col {
				height: @h;
				line-height: @h;
			}
		}
		.remarks {
			height: @h;
			line-height: @h;
		}
	}
	.more {
		width: 130%;
	}
	.ivu-checkbox-wrapper {
		margin-right: 0;
	}
	.ivu-checkbox-wrapper + span,
	.ivu-checkbox + span {
		margin-right: 0;
	}
	/deep/.member {
		/deep/.ivu-select-dropdown-list {
			height: 70px !important;
		}
	}
	.codeTip {
		height: 190px;
		justify-content: center;
		.top {
			height: 100px;
			i {
				padding-left: 15px;
				display: block;
				width: 40px;
				float: left;
			}
			.tipMessage {
				width: 360px;
				font-size: 1.25rem;
				margin-left: 10px;
				color: #666666;
				word-break: break-all;
				float: left;
			}
		}
		.bottom {
			.b {
				display: block;
				width: 120px;
				height: 50px;
				font-size: 1.25rem;
				margin: 0 auto;
			}
		}
	}
	.lh40 {
		height: 40px;
		line-height: 40px;
	}
	.lh50 {
		height: 50px;
		line-height: 50px;
	}
	.btn {
		display: block;
		margin: 20px auto;
	}
	.checkOne {
		text-indent: 25px;
	}
	.modal-overflow {
		max-height: 680px;
	}
	.modalBox {
		position: relative;
	}
	.select {
		position: absolute;
		right: 20px;
		bottom: 0px;
	}
	/deep/.ivu-table .demo-row-red td {
		background-color: #ffecf6 !important;
		color: #fff;
	}
</style>
