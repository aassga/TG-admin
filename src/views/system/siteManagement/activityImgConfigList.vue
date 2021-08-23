<template>
	<div>
		<Tables :loading="$root.tableLoading" :value="table.data" :columns="table.columns" :page="false"></Tables>
	</div>
</template>
<script>
	import Tables from "_c/tables";
	import { getUserType } from "@/libs/util";
	import {
		activityImgConfigUpt,
		activityImgConfigIns,
		activityImgConfigList
	} from "@/api/system";
	export default {
		name: "activityImgConfigList",
		components: { Tables },
		data() {
			return {
				adminType: getUserType(),
				authInPage: JSON.parse(localStorage.authInPage),
				//放置点击编辑后的数据
				editInfo: {
					pc: {
						id: null,
						siteId: this.$root.nowSite.id,
						slideshow_size: "",
						activity_size: "",
						logo_size: "",
						lottery_logo_size: "",
						registered_logo_size: "",
						game_shuffling_size: ""
					},
					mobile: {
						id: null,
						siteId: this.$root.nowSite.id,
						slideshow_size: "",
						activity_size: "",
						logo_size: "",
						lottery_logo_size: "",
						registered_logo_size: "",
						game_shuffling_size: ""
					}
				}, //编辑数据
				table: {
					loading: true,
					data: [],
					columns: [
						{
							title: "客户端",
							key: "client_type",
							align: "center",
							minWidth: 80,
							render: (h, params) => {
								return (
									<span>{params.row.client_type == "mobile" ? "MB" : "PC"}</span>
								);
							}
						},
						{
							title: "轮播图",
							key: "slideshow_size",
							align: "center",
							minWidth: 100,
							render: (h, params) =>
								h("div", [
									h(
										"span",
										{
											style: {
												display:
													params.row.showStatus == "span"
														? "inline-block"
														: "none"
											}
										},
										this.$root.text(params.row.slideshow_size)
									),
									h("Input", {
										style: {
											display:
												params.row.showStatus == "input"
													? "inline-block"
													: "none",
											width: "50%",
											margin: "0 auto",
											textAlign: "center"
										},
										props: {
                      value: this.editInfo[params.row.client_type].slideshow_size,
                      placeholder:params.row.client_type=='pc'?'1920x410':'750x270'
										},
										on: {
											"on-change": e => {
												this.editInfo[params.row.client_type].slideshow_size =
													e.target.value;
											}
										}
									})
								])
						},
						{
							title: "活动图",
							key: "activity_size",
							align: "center",
							minWidth: 100,
							render: (h, params) =>
								h("div", [
									h(
										"span",
										{
											style: {
												display:
													params.row.showStatus == "span"
														? "inline-block"
														: "none"
											}
										},
										this.$root.text(params.row.activity_size)
									),
									h("Input", {
										style: {
											display:
												params.row.showStatus == "input"
													? "inline-block"
													: "none",
											width: "50%",
											margin: "0 auto",
											textAlign: "center"
										},
										props: {
                      value: this.editInfo[params.row.client_type].activity_size,
                      placeholder:params.row.client_type=='pc'?'1000x150':'750x270'
										},
										on: {
											"on-change": e => {
												this.editInfo[params.row.client_type].activity_size =
													e.target.value;
											}
										}
									})
								])
						},
						{
							title: "首页LOGO",
							minWidth: 100,
							key: "slideshow_size",
							align: "center",
							render: (h, params) => {
								const { logo_size, showStatus } = params.row;
								return (
									<div>
										<span
											style={{
												display: showStatus == "span" ? "inline-block" : "none"
											}}
										>
											{this.$root.text(logo_size)}
										</span>
                    <Input
                    placeholder="请输入尺寸"
											type="text"
											value={logo_size}
											onInput={e => {
												this.editInfo[params.row.client_type].logo_size = e;
											}}
											class="w50 ma txt-a"
											style={{
												display: showStatus == "input" ? "inline-block" : "none"
											}}
										/>
									</div>
								);
							}
						},
						{
							title: "彩票页LOGO",
							minWidth: 100,
							key: "slideshow_size",
							align: "center",
							render: (h, params) => {
								const { lottery_logo_size, client_type, showStatus } = params.row;
								return (
									<div>
										<span
											style={{
												display: showStatus == "span" ? "inline-block" : "none"
											}}
										>
											{this.$root.text(lottery_logo_size)}
										</span>
										<Input
                      type="text"
                      placeholder="请输入尺寸"
											value={lottery_logo_size}
											onInput={e => {
												this.editInfo[
													params.row.client_type
												].lottery_logo_size = e;
											}}
											class="w50 ma txt-a"
											style={{
												display:
													showStatus == "input" && client_type == "pc"
														? "inline-block"
														: "none"
											}}
										/>
										<span
											style={{
												display:
													showStatus == "input" && client_type == "mobile"
														? "inline-block"
														: "none"
											}}
										>
											{this.$root.text(lottery_logo_size)}
										</span>
									</div>
								);
							}
						},
						{
							title: "注册页LOGO",
							minWidth: 100,
							key: "slideshow_size",
							align: "center",
							render: (h, params) => {
								const {
									registered_logo_size,
									client_type,
									showStatus
								} = params.row;
								return (
									<div>
										<span
											style={{
												display: showStatus == "span" ? "inline-block" : "none"
											}}
										>
											{this.$root.text(registered_logo_size)}
										</span>
                    <Input
                       placeholder="请输入尺寸"
											type="text"
											value={registered_logo_size}
											onInput={e => {
												this.editInfo[
													params.row.client_type
												].registered_logo_size = e;
											}}
											class="w50 ma txt-a"
											style={{
												display:
													showStatus == "input" && client_type == "mobile"
														? "inline-block"
														: "none"
											}}
										/>
										<span
											style={{
												display:
													showStatus == "input" && client_type == "pc"
														? "inline-block"
														: "none"
											}}
										>
											{this.$root.text(registered_logo_size)}
										</span>
									</div>
								);
							}
						},
						{
							title: "游戏轮播",
							minWidth: 100,
							key: "slideshow_size",
							align: "center",
							render: (h, params) => {
								const {
									game_shuffling_size,
									showStatus,
									client_type
								} = params.row;
								return (
									<div>
										<span
											style={{
												display: showStatus == "span" ? "inline-block" : "none"
											}}
										>
											{this.$root.text(game_shuffling_size)}
										</span>
										<Input
                      type="text"
                      placeholder="请输入尺寸"
											value={game_shuffling_size}
											onInput={e => {
												this.editInfo[
													params.row.client_type
												].game_shuffling_size = e;
											}}
											class="w50 ma txt-a"
											style={{
												display:
													showStatus == "input" && client_type == "mobile"
														? "inline-block"
														: "none"
											}}
										/>
										<span
											style={{
												display:
													showStatus == "input" && client_type == "pc"
														? "inline-block"
														: "none"
											}}
										>
											{this.$root.text(game_shuffling_size)}
										</span>
									</div>
								);
							}
						},
						{
							title: "操作",
							align: "center",
							minWidth: 50,
							render: (h, params) => (
								<div>
									<a
										class="ib"
										style={{
											display:
												(this.adminType == "super" ||
													this.authInPage.indexOf("activityImgConfigUpt") !=
														-1) &&
												params.row.showStatus == "span"
													? "inline-block"
													: "none"
										}}
										onClick={() => {
											this.$set(params.row, "showStatus", "input");
											let {
												id,
												slideshow_size,
												activity_size,
												logo_size,
												client_type,
												lottery_logo_size,
												registered_logo_size,
												game_shuffling_size
											} = params.row;
                      if (client_type == "mobile") lottery_logo_size = "-";
                      if (client_type == "pc") {
                        registered_logo_size='-';
                        game_shuffling_size='-'
                      }
											//this.editInfo[params.row.client_type]所在端的值
											this.editInfo[params.row.client_type] = {
												id,
												slideshow_size,
												activity_size,
												logo_size,
												siteId: this.$root.nowSite.id,
												lottery_logo_size,
												registered_logo_size,
												game_shuffling_size
											};
										}}
									>
										编辑
									</a>
									<div
										style={{
											display:
												params.row.showStatus == "input" ? "inline-block" : "none"
										}}
									>
										<a
											class="ib mr10"
											onClick={() => {
												this.editInfo[
													params.row.client_type
												].slideshow_size = this.$root.trimAll(
													this.editInfo[params.row.client_type].slideshow_size
												);
												this.editInfo[
													params.row.client_type
												].activity_size = this.$root.trimAll(
													this.editInfo[params.row.client_type].activity_size
												);
												this.editInfo[
													params.row.client_type
												].logo_size = this.$root.trimAll(
													this.editInfo[params.row.client_type].logo_size
												);
												this.editInfo[
													params.row.client_type
												].lottery_logo_size = this.$root.trimAll(
													this.editInfo[params.row.client_type].lottery_logo_size
												);
												this.editInfo[
													params.row.client_type
												].registered_logo_size = this.$root.trimAll(
													this.editInfo[params.row.client_type]
														.registered_logo_size
												);
												this.editInfo[
													params.row.client_type
												].game_shuffling_size = this.$root.trimAll(
													this.editInfo[params.row.client_type]
														.game_shuffling_size
												);
												let {
													slideshow_size,
													activity_size,
													logo_size,
													lottery_logo_size,
													registered_logo_size,
													game_shuffling_size,
													client_type
												} = this.editInfo[params.row.client_type];
												let reg = /^[1-9]{1}\d{1,3}(x)[1-9]{1}\d{1,3}$/;
												if (params.row.client_type == "pc") {
													if (
														!reg.test(slideshow_size) ||
														!reg.test(activity_size) ||
														!reg.test(logo_size) ||
														!reg.test(lottery_logo_size)
													) {
														this.$Message.error(
															"您所设置的图片尺寸不正确，请重新输入"
														);
														return false;
													} else {
														activityImgConfigUpt(
															this.editInfo[params.row.client_type],
															true
														).then(res => {
															if (res != undefined && res.code == 200) {
																this.$Message.success("尺寸修改成功");
																params.row.showStatus = "span";
																this.table.data[
																	params.index
																].slideshow_size = slideshow_size;
																this.table.data[
																	params.index
																].activity_size = activity_size;
																this.table.data[
																	params.index
																].logo_size = logo_size;
																this.table.data[
																	params.index
																].lottery_logo_size = lottery_logo_size;
															}
														});
													}
												} else if (params.row.client_type == "mobile") {
													if (
														!reg.test(slideshow_size) ||
														!reg.test(activity_size) ||
														!reg.test(logo_size) ||
														!reg.test(registered_logo_size) ||
														!reg.test(game_shuffling_size)
													) {
														this.$Message.error(
															"您所设置的图片尺寸不正确，请重新输入"
														);
														return false;
													} else {
														activityImgConfigUpt(
															this.editInfo[params.row.client_type],
															true
														).then(res => {
															if (res != undefined && res.code == 200) {
																this.$Message.success("尺寸修改成功");
																params.row.showStatus = "span";
																this.table.data[
																	params.index
																].slideshow_size = slideshow_size;
																this.table.data[
																	params.index
																].activity_size = activity_size;
																this.table.data[
																	params.index
																].logo_size = logo_size;
																this.table.data[
																	params.index
																].game_shuffling_size = game_shuffling_size;
																this.table.data[
																	params.index
																].registered_logo_size = registered_logo_size;
															}
														});
													}
												}
											}}
										>
											确定
										</a>
										<a
											class="ib mr10"
											onClick={() => {
												params.row.showStatus = "span";
											}}
										>
											取消
										</a>
									</div>
								</div>
							)
						}
					]
				}
			};
		},
		mounted() {
			this.$Message.config({
				top: 50,
				duration: 1
			});
			this.getData({ siteId: this.$root.nowSite.id });
		},
		methods: {
			getData(data) {
				this.$root.startTableLoading();
				activityImgConfigList(data).then(res => {
					if (res != undefined && res.code == 200) {
						res.data.forEach(item => (item.showStatus = "span"));
						this.table.data = res.data;
					}
					this.$root.endTableLoading();
				}).catch(error=>this.$root.endTableLoading());
			}
		}
	};
</script>
<style lang="less" scoped>
	/deep/.ivu-table-header {
		font-size: 1rem !important;
		font-weight: normal;
		.ivu-table-cell {
			font-weight: 549;
		}
	}
	/deep/.ivu-table {
		color: #444;
	}
</style>
