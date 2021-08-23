
<template>
	<div>
		<div class="v2-search clearfix">
			<Form ref="searchKey" inline class="fl">
				<FormItem label="状态">
					<Select clearable v-model="searchKey.status" class="s-86" placeholder="全部">
						<Option v-for="(t,i) in statusList" :key="'status'+i" :value="t.value">{{t.name}}</Option>
					</Select>
				</FormItem>
				<FormItem label="客户端">
					<Select clearable v-model="searchKey.lastDevice" placeholder="全部" class="s-86">
						<Option v-for="(t,i) in platformList" :key="i" :value="t.value">{{t.name}}</Option>
					</Select>
				</FormItem>
				
				<FormItem label="分组"  v-show="this.$root.groupLenth()&&this.$root.groupLenth()>1" >
						<GroupSelect
						class="aaa"
						placeholder="全部"
						ref="GroupSelect"
						
						clearable
						width="86"
						:levelType="'group'"
						@on-level-change="groupChange"
					/>
				</FormItem>
				<FormItem label="等级">
					<LevelSelect
						class="aaa"
						placeholder="全部"
						ref="LevelSelect"
						clearable
						width="86"
						:levelType="'member'"
						@on-level-change="levelChange"
					/>
				</FormItem>
				
				<FormItem label="开始日期">
					<DatePicker type="date" placeholder="开始日期" :class="screen==1440?'s-130':'s-120'" v-model="Time[0]"></DatePicker>
				</FormItem>
				<FormItem label="结束日期">
					<DatePicker type="date" placeholder="结束日期" :class="screen==1440?'s-130':'s-120'" v-model="Time[1]"></DatePicker>
				</FormItem>
				<FormItem>
					<Checkbox
						v-model="searchKey.isLike"
						:disabled="searchKey.typeTag == 'createIp' || searchKey.typeTag == 'lastIp' ? true : false"
					>
						<span>模糊</span>
					</Checkbox>
				</FormItem>
				<FormItem>
					<Select v-model="searchKey.typeTag" class="s-140" placeholder="请选择查询类型"  @on-change="changeFriends">
						<Option
							v-if="typeTagListType.length!=0"
              v-for="(t,i) in typeTagListType"

							:key="'typeTag'+i"
							:value="t.value"
						>{{t.name}}</Option>
						<Option
							v-if="typeTagListType.length==0"
							v-for="(t,i) in newList"
							:key="'typeTag'+i"
              :value="t.value"
						>{{t.name}}</Option>
					</Select>
				</FormItem>
				<!-- <FormItem>
					<Input
						:placeholder="placeholder"
						class="s-140"
						v-model="searchKey.content"
						:disabled="!searchKey.typeTag"
						@keyup.enter.native="searchSubmit"
					/>
				</FormItem>
				<FormItem>
					<Button type="primary" :loading="table.loading" class="search" @click="searchSubmit">查询</Button>
				</FormItem>
				<FormItem v-if="(adminType == 'super') || (authInPage.indexOf('memberMessageExport') != -1)">
					<Button
						type="primary"
						:loading="$root.editBtnLoading"
						class="ivu-btn export"
						@click="exportExcel"
					>导出Excel</Button>
        </FormItem> -->

      </Form>
       <div class="fl" >
           	<Input
						:placeholder="placeholder"
						class="s-140 ml20"
						v-model="searchKey.content"
						:disabled="!searchKey.typeTag"
						@keyup.enter.native="searchSubmit"
          />
            <Button  type="primary" :loading="table.loading" class="search ml20" @click="searchSubmit">查询</Button>
            <div  class="fr ml20" v-if="(adminType == 'super') || (authInPage.indexOf('memberMessageExport') != -1)">
              	<Button
						type="primary"
						:loading="$root.editBtnLoading"
						class="ivu-btn export"
						@click="exportExcel"
					>导出Excel</Button>
            </div>
       </div>

		</div>
		<div class="v2-table">
			<Tables
				ref="tables"
				:rowClassName="mydefineRow"
				:loading="table.loading"
				:columns="table.columns"
				:value="table.data"
				:total="table.total"
				:pageSizeOpts="table.pageSizeOpts"
				@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
				@on-sort-change="sortChange"
			></Tables>
		</div>
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
					<Button
						type="primary"
						class="search btn"
						@click.prevent="batchExport"
						:loading="$root.editBtnLoading"
					>确定</Button>
				</div>
			</div>
		</Modals> -->
		<!-- 一键转移会员 -->
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
						<Button type="primary" class=" ivu-btn submit  w260x" @click="agencyDown" :loading="$root.editBtnLoading">确认降级</Button>
					</FormItem>
				</Form>
			</div>
		</Modals>
		<!-- 根据需求重写的弹框 -->
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
		<!-- 打码详情 -->
		<memberCodeDetail :uid="uid" ref="codeDetail"></memberCodeDetail>
		<!-- 新的导出弹框 -->
		<ExportModal ref="exportModal"></ExportModal>
		<!-- 必填備註彈框 -->
		<Modals ref="remarkModal" width="460" title="温馨提示" showHeader>
			<div slot="content" class="remarkModal">
				<div>
					<div class="flex-row-center">
						<Icons type="danchuangtishi" color="#57A3F3" :size="26"></Icons>
						<p class="font">{{ remarkModal.info.text }}</p>
					</div>
					<div class="flex-row-center mt10">
						<Form ref="remarkForm" :model="remarkModal.data" :label-width="60" :rules="remarkModalRule" inline>
							<FormItem label="備註" prop="remark">
								<Input v-model.trim="remarkModal.data.remark" />		
							</FormItem>
						</Form>
					</div>
				</div>
				
				<div class="flex-row-center btns">
					<div class="bottom cancel">
						<Button @click="() => { this.$refs.remarkModal.hide() }">取消</Button>
					</div>
					<div class="bottom">
						<Button type="primary" @click="remarkModalSubmit">确定</Button>
					</div>
				</div>
			</div>
		</Modals>
	</div>
</template>
<script>
	import Tables from "@/components/tables";
	import Icons from "@/components/icons";
	import Modals from "@/components/modals";
	import FundsForms from "./components/funds-forms";
	import LevelSelect from "@/components/level-select";
	import GroupSelect from "@/components/group-select";
	import { Tooltip } from "view-design";
	import { getUserType } from "@/libs/util";
	import memberCodeDetail from "./components/member-code-detail";
	import AutoSearch from "_c/auto-search";
	import { mapState, mapActions, mapMutations } from "vuex";
	import ExportModal from "./components/exportModal";

	import {
		getMemberTableData,
		// getMemberLoginLog,
		memberModifyStatus,
		// memberDetail,
		thirdBalanceRecycle,
		refreshThirdBalance,
		// memberBalanceHandle,
		// getMemberGroupList,
		memberExport
	} from "@/api/member";
	export default {
		components: {
			Tables,
			Icons,
			Modals,
			FundsForms,
			LevelSelect,
			memberCodeDetail,
			AutoSearch,
			ExportModal,
			memberExport,
			GroupSelect,
		},
		data() {
			return {
			
				screen:screen.width,
				pageSize: 20,
				// exportTotal: 0,
				indeterminate: false,
				checkAll: false,
				checkAllGroup: [],
        oldName: null,
        newType:"",
				uid: null, // 打码详情需要的uid
				flag: {
					member: [],
					refund: []
				},
				newList: [],
				tip: "",
				remarkModal: {
					info: {},
					data: {},
				},
				remarkModalRule: {
					remark: [
						{ required: true ,message: '请输入备註', trigger: "blur" },
					],
				},
				statusList: [
					{ value: "yes", name: "正常" },
					{ value: "no", name: "停用" },
					{ value: "online", name: "在线" },
					{ value: "offline", name: "离线" },
					{ value: "catch", name: "异常" }
				],
				changeMemberInfo: {
					new_parent_uid: null, // 转移的代理id
					oldAgencyName: null, // 原代理id,
					siteId: this.$root.nowSite.id,
					uid: null,
					statusKey: "",
					statusVal: ""
				},
				placeholder: screen.width < 1500 ? "请输入账号" : "多个请以,逗号隔开",
				adminType: getUserType(),
				sort: false,
				authInPage: JSON.parse(localStorage.authInPage),
				sortParams: {},
				routes: [],
				page: 1, //当前页码
				searchKey: {
					typeTag: "userName",
					siteId: this.$root.nowSite.id,
					levelId: "",
					group_id:'',
				},
				Time: [],
				platformList: [
					{ value: "pc", name: "PC" },
					{ value: "h5", name: "H5" },
					{ value: "ios", name: "IOS" },
					{ value: "android", name: "Android" }
				],
				fundsModalTitle: "加款/减款",
				table: {
					total: 0,
					loading: true,
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
												{" "}
												{params.row.online === "off"
													? params.row.lastDevice == "android"
														? "Android"
														: params.row.lastDevice.toUpperCase() + "离线"
													: params.row.lastDevice == "android"
													? "Android"
													: params.row.lastDevice.toUpperCase() + "在线"}{" "}
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
							render: (h, params) => (
								<span>{this.$root.text(params.row.agencyName)}</span>
							)
						},
						{
							title: "姓名",
							key: "realName",
							align: "center",
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
							title: "分组",
							key: "group_name",
							align: "center",
							minWidth: 60
						},
						{
							title: "等级",
							key: "levelAlias",
							align: "center",
							minWidth: 50
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
								if (list.length && list.length % 2 == 1) {
									list.push({ platform: "", name: "", balance: "" });
								}
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
															转回
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
							align: "center",
							key: "agency_balance",
							minWidth: 75,
							sortable: "custom",
							render: (h, params) => (
								<span>{Number(params.row.agency_balance).toFixed(2)}</span>
							)
						},
						{
							title: "未登录/天",
							key: "not_login_day",
							align: "center",
							minWidth: 80,
							sortable: "custom"
						},
						{
							title: "注册时间",
							key: "created_at",
							align: "center",
							minWidth: 130,
							render: (h, params) => (
								<span>{this.$root.newUnixTime(params.row.created_at)}</span>
							)
						},
						{
							title: "操作",
							align: "center",
							minWidth: 270,
							render: (h, params) => {
								return (
									<div>
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
														siteId: this.$root.nowSite.id,
														uid: params.row.uid,
														page: this.page
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
													query: {
														uid,
														agencyId,
														siteId,
														account_type: account_type.includes("会员") ? 1 : 0,
														page: this.page
													},
													params: { page: "edit" }
												});
											}}
										>
											编辑
										</span>
										<span
											class="ib blue-font"
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
				exportPage: [],
				modalPostData: {},
				// exportLimit: '2000'
			};
		},
		computed: {
			...mapState({
				exportDataList: state => state.info.exportDataList,
				typeTagList: state => state.member.typeTagList,
				typeTagListNo: state => state.member.typeTagListNo,
				typeTagListType: state => state.member.typeTagListType
			}),
			balance() {
				return this.$store.state.app.refreshBalance;
			}
		},
		watch: {
			"$root.nowSite": {
				handler(val, oldVal) {
					//切换站点页面变化问题
					(this.table.pageSizeOpts = [19, 20, 30, 40, 50]),
						setTimeout(() => {
							this.table.pageSizeOpts = [20, 30, 40, 50];
							this.$refs.tables.setPage();
						}, 1);
					this.$nextTick(() => {
						const { name } = this.$route;
						name === "memberSearch" &&this.$refs.LevelSelect.init(this.$root.nowSite.id);
						name === "memberSearch" &&this.$refs.GroupSelect.init(this.$root.nowSite.id);
						this.searchKey = {};
						this.searchKey.siteId = this.$root.nowSite.id;
						this.searchKey.typeTag = "userName";
						this.Time = [];
						this.$refs.LevelSelect.reset("single");
						this.getData({
							params: { ...this.searchKey, siteId: this.$root.nowSite.id }
						});
					});
				},
				deep: true
			},
			searchKey: {
				handler(val, oldVal) {
					if (val.isLike) this.placeholder = "单个查询";
					if (val.isLike == false) this.placeholder = "多个请以,逗号隔开";
				},
				deep: true
			},
			"balance.count"() {
				if (this.$route.name === this.balance.name) this.searchSubmit();
			}
		},
		mounted() {
			this.$root.modeName() != "no"
				? (this.newList = this.typeTagList)
				: (this.newList = this.typeTagListNo);

			this.$nextTick(() => {
				const { name, query } = this.$route;
				//会员等级-》会员人数-》查询对应层级
				if (query) {
					const { levelLabel, levelAlias, maxDeposit } = query;
					this.searchKey.levelId = levelLabel;
					this.searchKey.max_deposit = maxDeposit && maxDeposit.split(".")[0];
					this.$refs.LevelSelect.init(this.$root.nowSite.id, {
						levelLabel,
						levelAlias
					});
				}
				name == "memberSearch" &&
					this.$refs.LevelSelect.init(this.$root.nowSite.id);
						name == "memberSearch" &&
					this.$refs.GroupSelect.init(this.$root.nowSite.id);
				
				let postData = {
					params: { ...this.searchKey, siteId: this.$root.nowSite.id }
				};
				const { editPage } = this.$route.params;
				if (editPage && editPage != 1) {
					postData.query = { page: editPage };
					this.$nextTick(() => {
						this.$refs.tables.setPage(editPage);
						this.page = editPage;
					});
				}
				this.getData(postData);
			});
		},

		beforeRouteEnter(to, from, next) {
			next(vm => {
				
				if (to.meta.title === "加款减款") {
					vm.routes = [];
					vm.routes.push(...[to, from]);
					vm.$refs.twoTabFundsForms.setOrigin();
					vm.$refs.twoTabFundsModal.show();
				}
				if(vm.$route.params.from == 'riskUser'){
					let data = {typeTag:'userName',siteId:vm.$root.nowSite.id,content:vm.$route.query.riskUserSum}
					vm.getData({params:data})
				}else if(vm.$route.params.from == 'lossUsers'){
					let data = {typeTag:'userName',siteId:vm.$root.nowSite.id,content:vm.$route.query.lossUsersSum}
					vm.getData({params:data})
				}else if(vm.$route.query=='abnormal'){
					data.status="catch";
					 vm.getData({params:data})
				}
				    if(vm.$root.groupLenth()<2){

            let newArr = [];
     vm.table.columns.forEach(t=>{
       if(t.key != 'group_name')newArr.push(t);
        vm.table.columns = newArr;
           })
        }
			});
		},
		methods: {
      ...mapMutations(["setNoTable"]),
      changeFriends(val){
         this.newType=val;
        if(val="InviteFriendsRegister"){
          this.searchSubmit()
        }

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
				// this.$refs.exportPageModal.show()
			},
			mydefineRow(row, index) {
				if (row.status < 0 || row.balance < 0 || row.status == "ablnormal") {
					return "demo-row-red";
				}
				return "";
			},
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
			// 			console.log(555)
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
			// 		data.export_limit = this.exportTotal - (10000 * (index - 1) + 1);
			// 	else data.export_limit = "10000";
			// 	data.isExport = 1;
			// 	let openr = window.open();
			// 	console.log(1111)
			// 	memberExport(data,true)
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
			// 导出报表
			exportExcel() {
				this.$refs.exportModal.createModal();
				// this.checkAllGroup = [];
				// this.exportPage = [];
				// this.$refs.exportType.show();
			},
			getSuperior(val) {
				if (val == false) delete this.changeMemberInfo.new_parent_uid;
			},
			getAgencyId(val) {
				this.changeMemberInfo.new_parent_uid = val;
			},
			levelChange(res) {
				this.searchKey.levelId = res.levelLabel;
			},
			groupChange(res){
                this.searchKey.group_id = res.group_id;
			},
			onPageChange(page) {
				this.page = page;
				let data = { ...this.searchKey, siteId: this.$root.nowSite.id };
				data = { ...data, ...this.sortParams };
				this.getData({ params: data, query: { page } });
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
						thirdBalanceRecycle({ siteId, uid }).then(res => {
							if (res != undefined && res.code === 200)
								this.$Message.success("第三方余额回收成功");
                	this.getData({ params: this.searchKey});
						});
					}
				});
			},
			getData(data) {
				this.table.loading = true;
				let dataParams = data.params;
				for (let key in dataParams) {
					if (!dataParams[key]) delete dataParams[key];
				}
				if (!dataParams.startTime || dataParams.startTime == "Invalid date")
					delete data.params.startTime;
				if (!dataParams.endTime || dataParams.endTime == "Invalid date")
					delete data.params.endTime;
				if (!data.params.typeTag) delete data.params.content;
				this.searchKey = { ...dataParams };
				if (data.params.isLike) data.params.isLike = Number(data.params.isLike);
				getMemberTableData(data)
					.then(res => {
						if (res != undefined && res.code == 200) {
							const { data, total } = res.data;
							this.setNoTable(this.table.columns);
							this.table.data = data;
							this.table.total = total;
							this.table.loading = false;
						} else {
							this.table.data = [];
							this.table.loading = false;
						}
					})
					.catch(error => {
						this.table.data = [];
						this.table.loading = false;
					});
			},
			onPageSizeChange(pageSize) {
				this.searchKey.limit = pageSize;
				let data = { ...this.searchKey, siteId: this.$root.nowSite.id };
				this.getData({ params: data });
			},
			//排序
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
					this.table.columns.forEach(item => {
						delete item.sortType;
					});
					this.searchKey.sortVal = order;
				}
				this.page == 1 ? "" : this.$refs.tables.setPage();
				this.page == 1
					? this.getData({ params: data })
					: this.getData({ params: data, query: { page: 1 } });
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
					memberModifyStatus(data, true,true).then(res => {
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
			//提交查询
			searchSubmit() {
				let { sortKey, sortVal, content } = this.searchKey;
				if (sortKey) delete this.searchKey.sortKey;
				if (sortVal) delete this.searchKey.sortVal;
				this.table.columns.forEach(item => {
					if (item.sortable == "custom") this.$set(item, "sortType", "");
				});
				if (content) this.searchKey.content = this.$root.trimAll(content);
				let params = { ...this.searchKey };
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					params.startTime = startTime && this.$root.formatTime(startTime);
					params.endTime = endTime && this.$root.formatTime(endTime);
				} else {
					return false;
				}
				// 校验ip
				let { typeTag } = this.searchKey;
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
					let flag;
					let reg = /^[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5_a-zA-Z0-9]+$/; //以汉字字母开头
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
				params.siteId = this.$root.nowSite.id;
				if (params.content) params.content = this.$root.trimAll(params.content);
				if (
					(typeTag && typeTag == "createIp" && !content) ||
					(typeTag && typeTag == "lastIp" && !content)
				) {
					this.$Tip.info({ content: "请输入正确IP地址" });
					return false;
				}
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
				if (this.$root.modeName() == "no"&&this.newType=='InviteFriendsRegister') {
					this.table.columns.forEach(t => {
						if (t.title == "上级代理") {
							t.title = "邀请者";
						}
					});
				}else{
          	this.table.columns.forEach(t => {
						if (t.title == "邀请者") {
							t.title = "上级代理";
						}
					});
        }
				this.$refs.tables.setPage();
				this.page = 1;
				this.getData({ params });
			},
			changeStatus(params, key) {
				let text, msg, value, rowValue;
        const { status, refundBonus, is_agency, userName, uid } = params.row;
				switch (key) {
					case "status":
						text =
							status === "yes"
								? "您确定停用该会员状态吗?"
								: "您确定启用该会员状态吗?";
						msg = status === "yes" ? "停用状态成功" : "启用状态成功";
						value = status === "yes" ? 0 : 1;
						rowValue = status === "yes" ? "no" : "yes";
						break;
					case "refundBonus":
						text =
							refundBonus === "yes"
								? "您确定停用该会员返水吗？"
								: "您确定启用该会员返水吗？";
						msg = refundBonus === "yes" ? "停用返水成功" : "启用返水成功";
						value = refundBonus === "yes" ? 0 : 1;
						rowValue = refundBonus === "yes" ? "no" : "yes";
						break;
					case "is_agency":
						text =
							is_agency == 0
								? "您确定晋升会员为代理吗？"
								: "您确定降级该代理为会员吗？";
						msg = is_agency == 0 ? "晋升代理成功" : "降级为会员成功";
						value = is_agency == 0 ? 1 : 0;
						rowValue = is_agency == 0 ? 1 : 0;
						break;
				}
				const data = {
					siteId: this.$root.nowSite.id,
					uid: params.row.uid,
					statusKey: key,
					statusVal: value
				};
				if (key === 'status') {
					this.remarkModal.info = {
						uid,
						userName,
						text,
						msg,
						value,
						rowValue,
					}
					this.remarkModal.data = { ...data }
					this.$refs.remarkForm.resetFields();
					this.$refs.remarkModal.show()
				} else {
					this.$Tip.confirm({
						content: text,
						onOk: () => {
							// 不是代理升降级都可以调接口
							memberModifyStatus(data, true).then(res => {
								if (res != undefined && res.code == 200 && res.data.code != 400) {
									this.$Message.config({ top: 150, duration: 1 });
									this.$Message.success({ content: msg });
									if (this.page)
										this.getData({
											params: this.searchKey,
											query: { page: this.page }
										});
									else this.searchSubmit();
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
				}
			},
			remarkModalSubmit() {
				const key = 'status'
				this.$refs.remarkForm.validate(valid => {
					if (valid) {
						memberModifyStatus(this.remarkModal.data, true).then(res => {
							if (res != undefined && res.code == 200 && res.data.code != 400) {
								this.$Message.config({ top: 150, duration: 1 });
								this.$Message.success({ content: this.remarkModal.info.msg });
								if (this.page)
									this.getData({
										params: this.searchKey,
										query: { page: this.page }
									});
								else this.searchSubmit();
							} else if (
								res != undefined &&
								res.code == 200 &&
								res.data.code == 400
							) {
								this.tip = res.data.message;
								this.changeMemberInfo.oldAgencyName = this.remarkModal.info.userName;
								this.changeMemberInfo.uid = this.remarkModal.info.uid;
								this.changeMemberInfo.statusKey = key;
								this.changeMemberInfo.statusVal = this.remarkModal.info.value;
								this.$refs.autoSearch.removeDefault();
								this.$refs.removeMembers.show();
							}
						}).finally(() => {
							this.$refs.remarkModal.hide()
						});
					}
				})
			},
			//Modal弹框的状态改变
			modalVisible(flag) {
				// if (!flag && !this.subSts) {
				//   this.$store.commit('closeTag', this.routes[0])
				//   this.$router.push(this.routes[1])
				// }
				if (!flag) {
					this.$store.commit("closeTag", this.routes[0]);
					// this.$router.push(this.routes[1])
				}
			}
		}
	};
</script>
<style lang="less"  scoped>
	@import "../../styles/tabs.less";
	@import "../../styles/button.less";
	@import "../../styles/function.less";

	.pt2 {
		position: relative;
		top: 2px;
	}
	.aa {
		transition: all 2s;
	}
	.go {
		transform: rotate(-180deg);
		transition: all 2s;
	}
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
	//放上去tooltip的效果
	/deep/.money-tip {
		.ivu-tooltip-inner {
			min-width: 300px;
			max-width: 350px;
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
	.ivu-table-expanded-cell {
		padding: 10px 10px !important;
		.expand {
			width: 100%;
		}
	}
	.pconment {
		padding: 10;
	}
	.more {
		width: 130%;
	}
	.ivu-form-item {
		.ivu-checkbox-wrapper {
			margin-right: 0px;
		}
		.ivu-checkbox + span {
			margin-right: 0px;
		}
	}
	/deep/.ivu-select-dropdown {
		max-height: 240px;
	}
	/deep/.ivu-select-visible .ivu-select-selection {
		box-shadow: none;
	}
	/deep/.v2-search .ivu-select {
		.ivu-select-selection:hover {
			border-color: #57a3f3;
		}
		.ivu-select-selection-focused {
			border-color: #57a3f3;
		}
	}
	/deep/.tooltip-section .items.balance:last-child {
		border-right: none;
	}
	/deep/.tooltip-section.borrow .items:last-child::after {
		height: 0;
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
	.remarkModal {
		.font {
			font-size: 20px;
			margin-left: 10px;
			color: #444;
			word-break: break-all;
		}

		.btns {
      padding-bottom: 33px;
      .ivu-btn {
        width: 120px;
        height: 50px;
        font-size: 20px;
        // border: none;
      }
      .cancel {
        margin-right: 40px;
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
	// .modalBox {
	// 	position: relative;
	// }
	.select {
		position: absolute;
		right: 20px;
		bottom: 0px;
	}

	.flex-row-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/deep/.ivu-table .demo-row-red td {
		background-color: #ffecf6 !important;
		color: #fff;
	}
	/deep/.money-tip .ivu-tooltip-content .tooltip-section{
    max-height: 320px;
    overflow-y: hidden;
	}
	/deep/.money-tip .ivu-tooltip-content .tooltip-section::-webkit-scrollbar{
		width: 0.5px;
	}
/deep/.money-tip .ivu-tooltip-content .tooltip-section:hover {
    overflow-y: auto;
}
</style>