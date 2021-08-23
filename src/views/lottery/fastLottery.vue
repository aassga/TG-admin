<template>
	<div>
		<div class="v2-table">
			<Tables
				editable
				:columns="table.columns"
				:loading="$root.tableLoading"
				:value="table.data"
				:total="table.total"
				:page="false"
				@on-expand="onExpand"
			></Tables>
			<!-- 编辑配置 -->
			<Modals ref="editSetting" title="设置杀数" width="560">
				<div slot="content" class="v2-form-wrapper">
					<Form ref="editSet" :label-width="150" style="width:560px;">
						<!-- <FormItem label="当前风控" prop="当前风控">
              <Select class="w260x" v-model="editSet.level">
                <Option value="rand">随机</Option>
                <Option value="kill">控制</Option>
                <Option value="open">放水</Option>
              </Select>
						</FormItem>-->
						<FormItem label="设置杀数">
							<InputNumber :step="0.01" class="w260x" v-model="editSet.configRate" />%
						</FormItem>
						<!-- <FormItem label="状态变更">
              <Switch v-model="editSet.lock" size="large">
                <span slot="open">锁定</span>
                <span slot="close">未锁定</span>
              </Switch>
						</FormItem>-->
						<FormItem>
							<Button class="ivu-btn submit w260x ft20" @click.prevent="submit" type="primary">确认保存</Button>
						</FormItem>
					</Form>
				</div>
			</Modals>
		</div>
	</div>
</template>
<script>
	import { fastLottery, fastLotteryInit, fastLotteryUpdate,fastLotteryBySite,fastLotteryUpdateBySite} from "@/api/lottery";
	import Tables from "@/components/tables";
	import Modals from "@/components/modals";
	import Icons from "@/components/icons";
	import { getUserType } from "@/libs/util";
	import { Poptip } from "view-design";
	export default {
		name: "fastLottery",
		components: {
			Tables,
			Modals,
			Icons
		},
		data() {
			return {
				spinShow: true,
				expandData: {},
				adminType: getUserType(),
				authInPage: JSON.parse(localStorage.authInPage),
				headerLotteryName: [],
				table: {
					loading: true,
					total: 0,
					title: "快速彩票",
					data: [],
					columns: [
						{
							key: "lotteryName",
							align: "center",
							minWidth: 75,
							tooltip: true,
							renderHeader: (h, params) => {
								// return <Poptip trigger='hover' placement='right-start' transfer style={{verticalAlign: 'middle'}}>
								//   <div slot='content' style={{width: '320px'}}>
								//     <div style={{width: '300px'}} class='ml10 mr10 b'>
								//       <p class='txt-a pt5 pb5'>24h可开奖，达到间隔时间可开奖</p>
								//       <div class='clearfix'>
								//         <div class='fl w50 txt-a pt5 pb5 br bt'>彩票名称</div>
								//         <div class='fl w50 txt-a pt5 pb5 bt'>统计时间</div>
								//       </div>
								//       {this.headerLotteryName.length > 0 && this.headerLotteryName.map(t => {
								//         return (
								//           <div class='clearfix'>
								//             <div class='fl w50 txt-a pb5 pt5 br bt'>{t.lotteryName}</div>
								//             <div class='fl w50 txt-a pt5 pb5 bt'>{this.$moment.unix(t.lastCountTime).format('YYYY/MM/DD HH:mm')}</div>
								//           </div>
								//         )
								//       })}
								//     </div>
								//   </div>
								//     <span>彩票名称</span>
								//     <Icons type='bangzhutishi' color='#E4E4E4' style={{paddingLeft: '8px'}}/>
								// </Poptip>
								return (
									<Poptip
										trigger="hover"
										placement="right-start"
										transfer
										style={{ verticalAlign: "middle" }}
									>
										<div slot="content" style={{ width: "320px" }}>
											<div style={{ width: "300px" }} class="ml10 mr10">
												<p class="pt5 pb5" style="color:#888888">
													24h可开奖，达到间隔时间可开奖
												</p>
												<p style="color:#888888">
													每月1号00:00点会自动初始化并重新开始统计
												</p>
											</div>
										</div>
										<span>彩票名称</span>
										<Icons
											type="bangzhutishi"
											color="#E4E4E4"
											style={{ paddingLeft: "8px" }}
										/>
									</Poptip>
								);
							},
							render: (h, params) => {
								let stage = this.$route.meta.title;
								if (params.row.lotteryName == "总计") {
									return <span>总计</span>;
								} else {
									if (stage == "快速彩票"&&this.singleSite=='multiple'){
										return (
											<a
												onClick={() => {
													this.$router.push({
														name: "fastLotteryAll",
														query: {
															lotteryId: params.row.lotteryId,
															lotteryName: params.row.lotteryName
														}
													});
												}}
											>
												{params.row.lotteryName}
											</a>
										)
									}else{
										return(
											<span>{params.row.lotteryName}</span>
										)
									}
										
								}
							}
						},
						{
							title: "有效投注",
							key: "betAmount",
							align: "center",
							minWidth: 60
						},
						{
							title: "会员输赢",
							key: "netAmount",
							align: "center",
							minWidth: 60
						},
						{
							title: "设置杀数",
							key: "configRate",
							align: "center",
							minWidth: 60
						},
						{
							title: "实际杀数",
							key: "rate",
							align: "center",
							minWidth: 60,
							render: (h, params) => (
								<span>{this.$root.text(params.row.rate)}</span>
							)
						},
						{
							title: "总杀数",
							key: "totalRate",
							align: "center",
							minWidth: 55
						},
						{
							title: "奖池",
							key: "prizePool",
							align: "center",
							minWidth: 75,
							render: (h, params) => (
								<span>{this.$root.keepTwo(params.row.prizePool)}</span>
							)
						},
						{
							title: "当期投注金额",
							key: "nowbetAmount",
							align: "center",
							minWidth: 80,
							render: (h, params) => (
								<span>{this.$root.keepTwo(params.row.nowbetAmount)}</span>
							)
						},
						{
							title: "当期投注人数",
							key: "betUserCount",
							align: "center",
							minWidth: 80,
							render: (h, params) => <span>{params.row.betUserCount}</span>
						},
						// {
						//   title: "风控状态",
						//   key: "level",
						//   align: "center",
						//   minWidth:60,
						//   render: (h, params) => {
						//     const { level } = params.row;
						//     return  <span> {level == "rand" ? "随机" : level == "kill" ? "控制" : "放水"} </span>
						//   }
						// },
						// {
						//   title: "有效投注（黑名单）",
						//   key: "blackBetMoney",
						//   align: "center",
						//   minWidth:110,
						// },
						// {
						//   title: "会员输赢（黑名单）",
						//   key: "blackWin",
						//   align: "center",
						//   minWidth:110,
						// },
						{
							title: "开奖间隔",
							key: "openTimeSet",
							align: "center",
							minWidth: 55,
							render: (h, params) => {
								const { openTimeSet, lotteryName } = params.row;
								let min = Math.floor(openTimeSet / 60);
								let second = openTimeSet % 60;
								if (lotteryName == "总计") return <span>-</span>;
								else
									return (
										<span>
											{second == 0 ? `${min}分/期` : `${openTimeSet}秒/期`}
										</span>
									);
							}
						},
						// {
						//   title: "状态",
						//   key: "lock",
						//   align: "center",
						//   minWidth:40,
						//   render: (h, params) => {
						//     const { lock } = params.row;
						//     return (
						//       <span style={{ color: lock == "0" ? "#515a6e" : "#FF2626" }}>
						//         {lock == "0" ? "未锁" : "锁定"}
						//       </span>
						//     );
						//   }
						// },
						{
							title: "操作",
							align: "center",
							minWidth: 180,
							render: (h, params) => {
								if (params.row.lotteryName == "总计") return <span>-</span>;

								else
									return (
										// <div>
										// 	<a
										// 		class="ib"
										// 		style={{
										// 			display:
										// 				this.adminType == "super" ||
										// 				this.authInPage.indexOf("fastLotteryUpdate") != -1
										// 					? "inline-block"
										// 					: "none"
										// 		}}
										// 		onClick={() => {
										// 			this.onEdit(params, "site");
										// 		}}
										// 	>
										// 		设置杀数
										// 	</a>
                    // </div>
                  
					// <a class="ib mr10"
					// 					    style={{
					// 					      display: (this.adminType == 'super') || (this.authInPage.indexOf('fastLotteryDetail') != -1) ? 'inline-block' : 'none'
					// 					    }}
					// 					    onClick={() => {this.onDetails(params)}}
					// 					  >预设开奖</a>
					// <a class="ib mr10"
					// 					    style={{
					// 					      display: (this.adminType == 'super') || (this.authInPage.indexOf('fastLotteryInit') != -1) ? 'inline-block' : 'none'
					// 					    }}
					// 					    onClick={() => {this.onInitialize(params)}}
					// 					  >初始化</a>
										  <div>
										
										

										  <a class="ib"
										    style={{
										      display: (this.adminType == 'super') || (this.authInPage.indexOf('fastLotteryUpdate') != -1) ? 'inline-block' : 'none'
										    }}
										    onClick={() => {this.onEdit(params,'site')}}
										  >设置杀数</a>
										</div>
									);
							}
						},
						{
							type: "expand",
							align: "center",
							title: "...",
							width: 50,
							render: (h, params) => {
							if(params.row.lotteryName=="总计")return;
							else
								return (
									<div>
										<Spin
											size="large"
											style={{ display: this.spinShow ? "block" : "none" }}
											fix
										></Spin>
										<table
											style={{
												width: "100%",
												borderTop: "1.5px solid #dcdcdc",
												borderLeft: "1.5px solid #dcdcdc"
											}}
											cellspacing="0"
											cellpadding="0"
											border="0"
										>
											{this.expandData[params.index] &&
												this.expandData[params.index].map(t => {
													return (
														<tr>
															<td
																style={{ textAlign: "center" }}
															>
																{t.rateTypeName}
															</td>
															<td style={{ textAlign: "center" }}>
																{t.betAmount}
															</td>
															<td style={{ textAlign: "center" }}>
																{t.netAmount}
															</td>
															<td style={{ textAlign: "center" }}>
																{t.configRate}
															</td>
															<td style={{ textAlign: "center" }}>{t.rate}</td>
															<td style={{ textAlign: "center" }}>
																{t.totalRate}
															</td>
															<td style={{ textAlign: "center" }}>
																{this.$root.keepTwo(t.prizePool)}
															</td>
															<td style={{ textAlign: "center" }}>
																{this.$root.keepTwo(t.nowbetAmount)}
															</td>
															<td style={{ textAlign: "center" }}>
																{t.betUserCount}
															</td>
															<td
																style={{ textAlign: "center" }}
																class="blue-font"
																onClick={() => {
																	this.onEdit(t, "table");
																}}
															>
																设置杀数
															</td>
														</tr>
													);
												})}
										</table>
									</div>
								);
							}

						}
					]
				},
				editSet: {
		  configRate: null,
		  currentSiteId:this.$root.nowSite.id,
        }
			};
		},
		mounted() {
			this.singleSite=JSON.parse(localStorage.singleSite);
			this.$nextTick(() => {
				this.getData();
			});
		},
		methods: {
			onExpand(row, status) {
				const { lotteryId } = row;
				if (status) {
					this.spinShow = true;
					if (
						this.expandData[row.initRowIndex] &&
						this.expandData[row.initRowIndex].length == 0
					) {
						let data = { lotteryId, allRateType: "yes",currentSiteId:this.$root.nowSite.id };
						if(this.singleSite=='multiple'){
							fastLottery(data)
							.then(res => {
								if (res != undefined && res.code == 200) {
									this.expandData[row.initRowIndex] = res.data.list;
									this.spinShow = false;
								}
								this.spinShow = false;
							})
							.catch(error => (this.spinShow = false));
						}
						if(this.singleSite=='single'){
							data.siteId=this.$root.nowSite.id;
							for (let key  in data){
									if(key=='currentSiteId') delete data[key];
								}
							fastLotteryBySite(data)
							.then(res => {
								if (res != undefined && res.code == 200) {
									this.expandData[row.initRowIndex] = res.data.list;
									this.spinShow = false;
								}
								this.spinShow = false;
							})
							.catch(error => (this.spinShow = false));

						}
					
					} else {
						this.spinShow = false;
					}
				}
      },
      onD(params){
        	const { lotteryId, lotteryName } = params.row;
				this.$router.push({
					name: "fastLotteryD",
					query: { lotteryId, lotteryName, stage: "fast" }
				});

      },
			// 详情
			onDetails(params) {
				const { lotteryId, lotteryName } = params.row;
				this.$router.push({
					name: "fastLotteryDetails",
					query: { lotteryId, lotteryName, stage: "fast" }
				});
			},
			//编辑配置
			onEdit(params, type) {
				if (type == "site") {
          //table的
					this.editSet.lotteryId = params.row.lotteryId;
					this.editSet.configRate = params.row.configRate
						? Number(params.row.configRate)
            : 0;
          for(let key  in this.editSet){
            if(key=="rateType"){
              delete this.editSet[key]
            }
          }
				} else {
          //下方表格
					this.editSet.lotteryId = params.lotteryId;
					this.editSet.configRate = params.configRate
						? Number(params.configRate)
            : 0;
          this.editSet.rateType=params.rateType;
				}
				this.$refs.editSetting.show();
			},
			// 初始化
			onInitialize(params) {
				this.$Tip.confirm({
					content: "您确定要初始化吗?",
					onOk: () => {
						fastLotteryInit({ id: params.row.lotteryId }, true).then(res => {
							if (res != undefined && res.code == 200)
								if (typeof res.data === "string") {
									this.$Message.config({
										top: 150
									});
									this.$Message.success("初始化成功！");
									this.getData();
								}
						});
					}
				});
			},
			getData() {
				this.$root.startTableLoading(this);
				let  data={currentSiteId:this.$root.nowSite.id};
				if(this.singleSite=='multiple'){
					fastLottery(data).then(res => {
					if (res != undefined && res.code == 200) {
						let { list, total } = res.data;
						list.length > 0 &&
							list.forEach(t => {
								this.headerLotteryName.push({
									lotteryName: t.lotteryName,
									lastCountTime: t.lastCountTime,
									netAmount: t.netAmount
								});
							});
						this.headerLotteryName.sort((a, b) => {
							return Number(b.netAmount) - Number(a.netAmount);
						});
						this.table.data = res.data;
						list.length && list.push(this.createTotalData(total));

						this.table.data = list;

						this.table.data.forEach((t, i) => {
							this.expandData[i] = [];
						});
					}
					this.$root.endTableLoading();
				}).catch(error=> this.$root.endTableLoading());
				}
				if(this.singleSite=='single'){
					data.siteId=this.$root.nowSite.id;
					for (let key  in data){
				if(key=='currentSiteId') delete data[key];
			}
					fastLotteryBySite(data).then(res => {
					if (res != undefined && res.code == 200) {
						let { list, total } = res.data;
						list.length > 0 &&
							list.forEach(t => {
								this.headerLotteryName.push({
									lotteryName: t.lotteryName,
									lastCountTime: t.lastCountTime,
									netAmount: t.netAmount
								});
							});
						this.headerLotteryName.sort((a, b) => {
							return Number(b.netAmount) - Number(a.netAmount);
						});
						this.table.data = res.data;
						list.length && list.push(this.createTotalData(total));

						this.table.data = list;

						this.table.data.forEach((t, i) => {
							this.expandData[i] = [];
						});
					}
					this.$root.endTableLoading();
				}).catch(error=> this.$root.endTableLoading());

				}
			
			},
			createTotalData(total) {
				const {
					betAmount,
					netAmount,
					rate,
					totalRate,
					prizePool,
					nowbetAmount,
					betUserCount
				} = total;
				let item = {
					lotteryName: "总计",
					betAmount,
					netAmount,
					configRate: "-",
					rate,
					totalRate,
					prizePool,
					nowbetAmount,
					betUserCount
				};
				return item;
			},
			//  编辑配置确认
			submit() {
				this.$refs.editSetting.spinShow();
		let data = { ...this.editSet };
		if(this.singleSite=='multiple'){
			fastLotteryUpdate(data, true)
					.then(res => {
						this.$refs.editSetting.spinHide();
						if (res != undefined && res.code == 200) {
							this.$Message.success("更新成功");
              this.getData()
							this.$refs.editSetting.hide();
						}
					})
					.catch(error => {
						this.$refs.editSetting.spinHide();
					});

		}
		if(this.singleSite=='single'){
			data.siteId=this.$root.nowSite.id;
			for (let key  in data){
				if(key=='currentSiteId') delete data[key];
			}
			
			fastLotteryUpdateBySite(data, true)
					.then(res => {
						this.$refs.editSetting.spinHide();
						if (res != undefined && res.code == 200) {
							this.$Message.success("更新成功");
              this.getData()
							this.$refs.editSetting.hide();
						}
					})
					.catch(error => {
						this.$refs.editSetting.spinHide();
					});


		}
			
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
	.w260x {
		width: 260px;
		height: 30px;
	}

	/deep/.ivu-form-item-error-tip {
		top: 0;
		left: 270px;
	}
	.pt5 {
		padding-top: 8px;
	}
	.pb5 {
		padding-bottom: 8px;
	}
	/deep/.ivu-table-expanded-cell {
		position: relative;
		table {
			background: #ffffff !important;
		}
		div {
			&:nth-child(1) {
				margin-left: -20px;
				margin-right: -20px;
			}
		}
	}
</style>
