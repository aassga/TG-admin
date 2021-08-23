<template>
	<div>
		<Form :model="imgInfor">
			<FormItem label="终端:" v-if="$route.query.page === 'create'">
				<CheckboxGroup @on-change="checkAllGroupChange" v-model="imgInfor.newclient_type">
					<Checkbox label="pc" :disabled="showpc"></Checkbox>
					<Checkbox label="h5" :disabled="showphone"></Checkbox>
					<Checkbox label="android" :disabled="showphone"></Checkbox>
					<Checkbox label="ios" :disabled="showphone"></Checkbox>
					<Checkbox label="mobile" :disabled="showphone"></Checkbox>
				</CheckboxGroup>
			</FormItem>
			<FormItem>
				<table class="ivu-table bt bl br w100" border="0" cellspacing="0" cellpadding="0">
					<thead>
						<tr>
							<th class="w5  font-none ivu-table-column-center br">排序</th>
							<th class="w20 font-none ivu-table-column-center br">标题</th>
							<th class="w20 font-none ivu-table-column-center br">跳转地址</th>
							<th class="w30 font-none ivu-table-column-center br">时间选择</th>
							<th class="w15 font-none ivu-table-column-center br">图片</th>
							<th class="w5 font-none ivu-table-column-center br">状态</th>
							<th class="w10 font-none ivu-table-column-center">操作</th>
						</tr>
					</thead>
					<tbody ref="list" v-if="tbodyShow">
						<tr v-for="(item,index) in carouselList" :key="'item'+index">
							<!-- 排序列 -->
							<td class="w5 ivu-table-column-center br">
								<Icons type="paixukongjian" color="#dadada" size="20"/>
							</td>
							<!-- 标题列 -->
							<td class="w20 ivu-table-column-center br">
								<Input
									class="w80 pl10 pr10"
									style="height:32px !important"
									v-model="item.title"
									:key="'title'+index"
                  placeholder="请输入标题"
									:disabled="item.edit"
								/>
							</td>
							<!-- 跳转地址 -->
							<td class="w15 ivu-table-column-center br">
								<FormItem  :key="'foward_type'+index" class="ml10 mr10">
									<Select
										v-model="item.foward_type"
										transfer
										class="w80 pt30"
										:disabled="item.edit"
									>
										<Option v-for="(t,i) in item.options" :key="'options1'+i" :value="t.value">{{t.name}}</Option>
									</Select>
								</FormItem>

								<!-- 自定义的框 -->
								<FormItem v-if="item.foward_type=='1'" class="mr10 ml10">
                <!-- <FormItem > -->
									<Input  placeholder="请输入跳转地址" v-model="item.target" class="w80" :disabled="item.edit"/>
								</FormItem>
							</td>
							<!-- 时间选择 -->
							<td class="w30 ivu-table-column-center br">
								<FormItem class="mr10 ml10">
									<Select
										v-model="item.online_type"
										transfer
										:class="screen<1600?'w94 pt30':'w80 pt30'"
										:key="'online_type'+index"
										:disabled="item.edit"
									>
										<Option v-for="(t,i) in item.options2" :key="'options2'+i" :value="t.value">{{t.name}}</Option>
									</Select>
								</FormItem>
								<div v-if="item.online_type=='1'" class="mr10 ml10">
                  <FormItem>
										<DatePicker
											:key="'date1'+index"
											type="datetime"
											format="yyyy-MM-dd HH:mm"
											placeholder="开始日期"
											:disabled="item.edit"
											:class="screen<1600?'w41':'w34'"
											v-model="item.Time[0]"
											:options="options3"
											transfer
										></DatePicker>
										<span style="display:inline-block;width:12%;text-algin:center">——</span>
										<DatePicker
											:key="'date2'+index"
											type="datetime"
											format="yyyy-MM-dd HH:mm"
											:disabled="item.edit"
											placeholder="结束日期"
											:class="screen<1600?'w41':'w34'"
											v-model="item.Time[1]"
											:options="options3"
											transfer
										></DatePicker>
                  </FormItem>
								</div>
							</td>
							<!-- 图片 -->
							<td class=" ivu-table-column-center br">
								<div class="center">
									<div class="demo-upload-list" v-if="showImg"  >
										<template v-if="item.newstatus == 'finished'">
											<img :src="item.url">
                      <div >
											<div class="demo-upload-list-cover" v-if="noneImg">
												<Icon type="ios-eye-outline" @click.native="handleView(item)" ></Icon>
												<Icon type="ios-trash-outline" @click.native="handleRemove(item)" v-if="item.edit==false"></Icon>
											</div>
                    </div>
										</template>
										<!-- <template v-else>
											<Progress :percent="item.percentage" hide-info></Progress>
										</template> -->
									</div>
									<Upload
										:key="'upload'+index"
									  	ref="upload"
										:disabled="item.edit"
										:show-upload-list="false"
										:default-file-list="defaultList"
										:headers="uploadForm.headers"
										:action="uploadForm.action"
										:data="uploadForm.data"
										:name="uploadForm.name"
										:on-success="(res)=>{ onUploadSuccess(res,item) }"
										:format="['jpg','jpeg','png']"
										:max-size="2048"
										:on-format-error="handleFormatError"
										:on-exceeded-size="handleMaxSize"
										:before-upload="handleBeforeUpload"
										class="ib w58x"
										multiple
										type="drag"
										v-if=!item.edit
									>
										<div class="w58x">
											<!-- <Icon type="ios-camera" size="20"></Icon> -->
											<p class="h32">{{ item.url? '修改图片': '选择图片' }}</p>
											<p class="h32">{{ imageSize }}</p>
										</div>
										<!-- <Button icon="ios-cloud-upload-outline">上传图片</Button> -->
									</Upload>
								</div>
							</td>
							<!-- 状态列 -->
							<td class="w5 ivu-table-column-center br">
								<Switch size="large" v-model="item.status">
									<span slot="open">开启</span>
									<span slot="close">关闭</span>
								</Switch>
								<!-- <Icons type="paixukongjian" color="#dadada" size="20"/> -->
							</td>
							<!-- 操作列 -->
							<td class="w10 ivu-table-column-center" :key="'handle'+index">
								<span
									size="small"
									class="mrb5 blue-font"
									@click="changedit(item)"
									v-if="($route.params.page == 'edit' && showedit) && ((adminType == 'super') || (authInPage.indexOf('slideImgInfoUpt')) != -1)"
								>{{item.edit ? "编辑":"确定"}}</span>
								<span
									size="small"
									class="mrb5 blue-font"
									v-if="!item.edit && item.del"
									@click="changDetail(index,item)"
								>取消</span>
								<span
									size="small"
									class="mrb5 blue-font"
									@click="deleteCarousel(index)"
									v-if="item.edit||!item.del"
								>删除</span>
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td colspan="7">
								<Button long class="button fontColor" @click="addCarouselItem">添加轮播图</Button>
							</td>
						</tr>
					</tfoot>
				</table>
			</FormItem>
		</Form>
		<div class="flex-row">
			<Button type="primary" class="w320x hf50x " @click="submit">确认保存</Button>
		</div>

		<Modal title="图片预览" v-model="visible">
			<img :src="imgName" v-if="visible" class="w100">
		</Modal>
	</div>
</template>
<script>
	import Icons from "_c/icons";
	import Tables from "_c/tables";
	import { slideIns, slideImgInfo, slideImgInfoUpt } from "@/api/system";
	import Sortable from "sortablejs";
	import ViewImg from "./../components/ViewImg";
	import Modals from "@/components/modals";
	import { uploadImg, getActivityImgConfigSize } from "@/api/common";
	import { getUserName } from "@/libs/util";
	import { getToken, getUserType } from "@/libs/util";
	import { mapState } from "vuex";
	export default {
		name: "lunboEdit",
		components: {
			Tables,
			Icons
		},
		data() {
			return {
				screen:screen.width,
        showImg:false,//上传图片成功后展示
        changeImg:false,//编辑页面修改图片的框
        noneImg:false,//不展示放大和删除
				showText: true,
				adminType: getUserType(),
				authInPage: JSON.parse(localStorage.authInPage),
				tbodyShow: true,
				defaultList: [],
				imgName: "",
				showedit: true,
				visible: false, //图片放大的功能
				uploadList: [],
				uploadForm: {
					headers: { Authorization: getToken() },
					action: "/api/v2/uploadImg",
					data: { siteId: "" },
					name: "img",
					defaultList: [],
					path: "",
					src: ""
				},
				imgLimitSize: {
					pc: "200x300",
					mobile: "200x300"
				},
				options3: {
					disabledDate: date => {
						return date && date.valueOf() < Date.now() - 86400000;
					}
				},
				isModify: -1,
				showpc: false,
				showphone: false,
				carouselList: [],
				oldcarouseList: [], //每一行的数据组成的新的数组
				Time: [],
				imgInfor: {
					newclient_type: []
				}
			};
		},
		created() {
			if (this.$route.params.page == "edit") {
				const { siteId, clientType } = this.$route.query;
        this.ondeatail({ siteId, clientType });
        this.showImg=true;
         this.noneImg=true;
			}
			if (this.$route.params.page == "create") {
				this.addCarouselItem();
			}
			this.sortInit();
			this.uploadForm.data.siteId = this.$root.nowSite.id;
			this.getSlideShowSize();
		},
		computed: {
			imageSize() {
				return this.imgInfor.newclient_type.length > 0
					? this.imgLimitSize[
							this.imgInfor.newclient_type.includes("pc") ? "pc" : "mobile"
					  ]
					: "1920x410";
			}
		},
		methods: {
			sortInit() {
				this.tbodyShow = true;
				this.$nextTick(() => {
					let el = this.$refs.list; //找到tbody的值
					let that = this;
					Sortable.create(el, {
						onEnd: that.endFunc
					});
				});
			},
			//拖拽排序
			endFunc(e) {
				let _carouselList = [...this.carouselList]; //整合的几行的表格
				let movedRow = _carouselList[e.oldIndex];
				let targetRow = _carouselList[e.newIndex];
				_carouselList.splice(e.oldIndex, 1);
				_carouselList.splice(e.newIndex, 0, movedRow);
				this.carouselList = [];

				this.carouselList = [..._carouselList];
				setTimeout(() => {
					this.tbodyShow = false;
				}, 10);
				setTimeout(() => {
					this.sortInit();
				}, 30);
			},
			//点击操作的编辑按钮
			changedit(item) {
				if(item.title==''){
							this.$Message.error('标题不能为空')
							return
				}
				// if(item.foward_type=='1'&&item.edit==false){  //点击确定提示信息
				// 		if(item.target==''){
				// 			this.$Message.error('跳转地址不能为空')
				// 			return
				// 		}
				// }
				if(item.online_type=='1'&&item.edit==false){  //点击确定判断时间提示信息
						if(item.Time[0]==''){
							this.$Message.error('开始时间不能为空')
							return
						};
						if(item.Time[1]==''){
							this.$Message.error('结束时间不能为空')
							return
						}
				}
				if(item.foward_type!='1'&&item.edit==false){  //非自定义点击确定清除自定义内容
					if(item.target!=''){
						item.target=''
					}
				}
				this.showedit = false;
        item.edit = !item.edit; //点击编辑的时候可编辑（状态为确定和取消），否则不可编辑（状态为编辑和删除）
        // //可编辑
        if(item.edit==false){
					this.noneImg=true;
        }
        // //不可编辑
        if(item.edit==true){
					this.noneImg=true;
        }
				this.showedit = true;
				item.Time[0]=this.$root.newFormatTime(item.Time[0]);
				item.Time[1]=this.$root.newFormatTime(item.Time[1]);
			},
			//选择终端
			checkAllGroupChange(res) {
				if (this.imgInfor.newclient_type.length != 0) {
					let haslock = this.imgInfor.newclient_type.some(item => item == "pc");
					if (haslock) {
						this.showpc = false;
						this.showphone = true;
					} else {
						this.showpc = true;
						this.showphone = false;
					}
				} else {
					this.showpc = false;
					this.showphone = false;
				}
			},
			//确认保存
			submit() {
				//新增轮播图提交
				if (this.$route.params.page == "create") {
					let body = [];
					for (let item of this.carouselList) {
						let obj = {};
						obj.title = item.title;
						obj.status = item.status == false ? "no" : "yes";
						obj.foward_type = item.foward_type;
						if (obj.foward_type == "1") {
							if (!item.target) {
								// this.$Message.error("请填写自定义跳转地址");
								// return;
							}
							// obj.target = item.target;
								obj.target = "#";
						} else {
							obj.target = "#";
						}
						obj.online_type = item.online_type;
						if (obj.online_type == "1") {
							let validator = item.Time.some(
								el => el === "" || el == "Invalid date"
							);
							if (validator || item.Time.length < 1) {
								this.$Message.error("请填写自定义上线时间");
								return;
							}
							if (!this.$root.effectTime(item.Time)) {
								this.$Tip.info({ content: "结束时间必须大于开始时间" });
								return false;
							}
							obj.publish_at = this.$root.newFormatTime(item.Time[0]);
							obj.offline_at = this.$root.newFormatTime(item.Time[1]);
							// obj.offline_at = this.$root.formatnightTimeS(item.Time[1]);
						}
						obj.img = item.image;
						body.push(obj);
					}
					if (!this.imgInfor.newclient_type.length) {
						this.$Message.error("请选择终端");
						return false;
					}
					var mess = false;
					let errorType = 0;
					if (body.length > 0) {
						body.forEach(item => {
							// if (item.img== "" || item.title == "" || !(/^(1|2)$/).test(item.online_type)) {
							// // if (item.img== "" || item.title == "" || !(/^[1-8]$/).test(item.foward_type) || !(/^(1|2)$/).test(item.online_type)) {
							//   mess = true;
							//   return false;
							// }
							if (item.title === "") {
								errorType = "标题";
							}
							// else if (!(/^[1-8]$/).test(item.foward_type)) {
							//   errorType = '跳转地址'
							// }
							else if (!/^(1|2)$/.test(item.online_type)) {
								errorType = "时间";
							} else if (item.img === "") {
								errorType = "图片";
							}
						});
					} else {
						this.$Message.error("请填写轮播信息");
						return false;
					}
					if (errorType !== 0) {
						this.$Message.error(`请填写${errorType}信息`);
						return false;
					}
					const params = {};
					params.body = JSON.stringify(body);
					params.siteId = this.$root.nowSite.id;
					params.bodyFormatType = "JSON";
					if (this.imgInfor.newclient_type.length > 1)
						params.clientType = this.imgInfor.newclient_type.join(",");
					else params.clientType = this.imgInfor.newclient_type[0];
					slideIns(params, true).then(res => {
						if (res.code === 200) {
							this.$Message.success("添加轮播图成功");
							this.$router.go(-1);
						}
					});
				}
				//编辑轮播图提交

				if (this.$route.params.page == "edit") {
					let body = [];
					for (let item of this.carouselList) {
						let obj = {};
						obj.title = item.title;
						obj.status = item.status == false ? "no" : "yes";
						obj.foward_type = item.foward_type;
						if (obj.foward_type == "1") {
							// if (!item.target) {
							// 	this.$Message.error("请填写自定义跳转地址");
							// 	return;
							// }
							obj.target = item.target;
						} else {
							obj.target = "#";
						}
						obj.online_type = item.online_type;
						if (obj.online_type == "1") {
							let validator = item.Time.some(el => el === "");
							if (validator || item.Time.length < 1) {
								this.$Message.error("请填写自定义上线时间");
								return;
							}
							if (!this.$root.effectTime(item.Time)) {
								this.$Tip.info({ content: "结束时间必须大于开始时间" });
								return false;
							}
							obj.publish_at = this.$root.newFormatTime(item.Time[0]);
							// /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/ 验证时间正则
							obj.offline_at = this.$root.newFormatTime(item.Time[1]);
						}
						obj.img = item.image;
						body.push(obj);
					}
					var mess = false;
					let errorType = 0;
					if (body.length > 0) {
						body.forEach(item => {
							// if (item.img == "" || item.title == "" || !(/^(1|2)$/).test(item.online_type)) {
							// // if (item.img == "" || item.title == "" || !(/^[1-8]$/).test(item.foward_type) || !(/^(1|2)$/).test(item.online_type)) {
							//   mess = true;
							//   return false;
							// }
							if (item.title === "") {
								errorType = "标题";
							}
							// else if (!(/^[1-8]$/).test(item.foward_type)) {
							//   errorType = '跳转地址'
							// }
							else if (!/^(1|2)$/.test(item.online_type)) {
								errorType = "时间";
							} else if (item.img === "") {
								errorType = "图片";
							}
						});
					} else {
						this.$Message.error("请填写轮播信息");
						return false;
					}
					if (errorType !== 0) {
						this.$Message.error(`请填写${errorType}信息`);
						return false;
					}
					const params = {};
					params.body = JSON.stringify(body);
					params.siteId = this.$root.nowSite.id;
					params.promotionId = this.$route.query.promotionId;
					params.clientType = this.$route.query.clientType;
					slideImgInfoUpt(params, true).then(res => {
						if (res.code === 200) {
							this.$Message.success("轮播图更新成功");
							this.$router.go(-1);
						}
					});
				}
			},
			// 操作的删除按钮
			deleteCarousel(index) {
				let msg = "删除成功";
				this.$Tip.confirm({
					content: `你确定要删除删除该轮播图吗？`,
					onOk: () => {
						this.carouselList.splice(index, 1);
						this.$Message.success("删除成功");
					}
				});
			},
			//操作的取消按钮
			changDetail(index,item) {
				this.tbodyShow = false;
				this.carouselList[index]= Object.assign(this.carouselList[index], this.oldcarouseList[index]);
				setTimeout(() => {
					this.tbodyShow = true;
					this.changeImg=false;
				}, 10);
				item.Time[0]=this.$root.newFormatTime(item.Time[0]);
				item.Time[1]=this.$root.newFormatTime(item.Time[1]);
			},
			ondeatail(data) {
				slideImgInfo(data).then(res => {
					const { body, clientType } = res.data;
					JSON.parse(body).forEach(t => {
						if(t.target=='#'){
							t.target=''
						}
						let obj = {
							id: "",
							actionType: "",
							edit: true,
							del: true,
							status: t.status == "no" ? false : true,
							image: t.img,
							target: "",
							title: t.title,
							foward_type: t.foward_type,
							target: t.target,
							url: t.img,
							online_type: t.online_type,
							Time: [
								this.$root.newFormatTime(t.publish_at),
								this.$root.newFormatTime(t.offline_at)
							],
							newstatus: "finished",
							options: [
								{ name: "自定义", value: "1" },
								{ name: "真人视讯", value: "2" },
								{ name: "彩票游戏", value: "3" },
								{ name: "棋牌游戏", value: "4" },
								{ name: "电子游艺", value: "5" },
								{ name: "体育投注", value: "6" },
								{ name: "捕鱼达人", value: "7" },
								{ name: "优惠活动", value: "8" }
							],
							options2: [
								{ name: "自定义上线", value: "1" },
								{ name: "即时上线", value: "2" }
							]
            };
						this.carouselList.push(obj);
						this.oldcarouseList = JSON.parse(JSON.stringify(this.carouselList));
					});
					if (clientType.length == 1)
						this.imgInfor.newclient_type.push(clientType);
					else
						clientType.split(",").map(item => {
							this.imgInfor.newclient_type.push(item);
						});
					this.showpc = true;
					this.showphone = true;
				});
			},
			//添加轮播图按钮
			addCarouselItem() {
				let obj = {
					id: "",
					actionType: "",
					image: "",
					target: "",
					title: "",
					status: true,
					foward_type: "1",
					target: "",
					online_type: "1",
					url: "",
					Time: [],
					newstatus: "statr",
					options: [
						{ name: "自定义", value: "1" },
						{ name: "真人视讯", value: "2" },
						{ name: "彩票游戏", value: "3" },
						{ name: "棋牌游戏", value: "4" },
						{ name: "电子游艺", value: "5" },
						{ name: "体育投注", value: "6" },
						{ name: "捕鱼达人", value: "7" },
						{ name: "优惠活动", value: "8" }
					],
					options2: [
						{ name: "自定义上线", value: "1" },
						{ name: "即时上线", value: "2" }
					]
        };

				if (this.$route.params.page == "edit") {
					obj.edit = false;
					obj.del = false;
				}
				let _carouselList = [...this.carouselList];

        _carouselList.push(obj);
				this.carouselList = [];
        this.carouselList = [..._carouselList];

				this.isModify = this.carouselList.length - 1;
			},
			// deleteCarouselItem(index) {
			//   this.carouselList.splice(index, 1);
			// },
			onUploadSuccess(res, item) {
				const { path, src, host } = res.data;
				if (path) {
					item.newstatus = "finished";
					item.url = `${host}/${src}`;
					item.image = path;
        }
        this.showImg=true;
        item.edit=false;
        this.noneImg=true;
			},
			handleView(item) {
				this.imgName = item.url;
				this.visible = true;
			},
			handleRemove(file) {

        // this.showImg=false;
				file.newstatus = "start";
				file.url = "";
				file.image = "";
			},
			handleFormatError(file) {
				this.$Tip.info({ content: "请上传图片" });
			},
			handleMaxSize(file) {
				this.$Message.error('上传图片体积最大为2M')
			},
			handleBeforeUpload() {
				const check = this.uploadList.length < 5;
				if (!check) {
					this.$Notice.warning({
						title: "Up to five pictures can be uploaded."
					});
				}
				return check;
			},
			// 获取轮播图尺寸
			getSlideShowSize() {
				const data = {
					siteId: this.$root.nowSite.id,
					type: "slideshow_size"
				};
				getActivityImgConfigSize(data).then(res => {
					if (res && res.code === 200) {
						const { data } = res;
						if (Array.isArray(data)) {
							data.forEach(el => {
								this.imgLimitSize[el.client_type] = el.slideshow_size;
							});
						}
					}
				});
			}
		}
	};
</script>
<style  lang="less" scoped >
	.ivu-table-column-center {
		&:last-child {
			button {
				background-color: #2d8cf0;
				color: #fff;
				border: none;
				// padding: no
			}
    }
    //input  高度
		/deep/.ivu-input {
      text-align: center;
      height: 32px !important;
		}
  }


	.w58x {
		width: 80px;
		height: 58px;
		line-height: 58px;
	}
	.img {
		width: 180px;
		height: 60px;
		line-height: 60px;
		color: #666666;
		border: 1px solid #dfdfdf;
		margin: auto;
		margin-top: 10px;
		margin-bottom: 10px;
		text-align: center;
	}
	.upLoadImg {
		width: 100%;
		margin: auto;
		color: #62b1fd;
		background: #f5faff;
		text-align: center;
		cursor: pointer;
	}
	.button {
		height: 47px;
		background-color: #f5faff;
		border: none;
	}
	.demo-upload-list {
		display: inline-block;
		width: 60px;
		height: 60px;
		text-align: center;
		line-height: 60px;
		border: 1px solid transparent;
		border-radius: 4px;
		overflow: hidden;
		background: #fff;
		position: relative;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
		margin-right: 4px;
	}
	.demo-upload-list img {
		width: 100%;
		height: 100%;
	}
	.demo-upload-list-cover {
		display: none;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.6);
	}
	.demo-upload-list:hover .demo-upload-list-cover {
		display: block;
	}
	.demo-upload-list-cover i {
		color: #fff;
		font-size: 1.25rem /* 20/16 */;
		cursor: pointer;
		margin: 0 2px;
  }

  /deep/.ivu-table{
    color:#444;
    font-size: 1rem /* 16/16 */;
  }
</style>