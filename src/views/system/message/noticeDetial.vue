<template>
	<div class="v2-search">
		<Form ref="formKey" :model="formKey" :rules="rules" class="mb40">
			<div class="mb25">
				<FormItem label="公告标题" prop="title" class="mb15">
					<Input placeholder="请输入标题(25字以内)" class="w622x ml5" v-model="formKey.title" :maxlength="25" />
				</FormItem>
			</div>
			<div label="起止时间" class="clearfix duringTime" :class="mb">
				<FormItem label="开始日期" prop="publish_at" class="fl">
					<DatePicker
						type="datetime"
						placeholder="开始日期"
						transfer
						class="ml5"
						v-model="formKey.publish_at"
						:options="optDisabled"
						format="yyyy-MM-dd HH:mm"
					></DatePicker>
				</FormItem>
				<FormItem label="结束日期" prop="offline_at" class="fl">
					<DatePicker
						type="datetime"
						placeholder="结束日期"
						transfer
						v-model="formKey.offline_at"
						:options="optDisabled"
						format="yyyy-MM-dd HH:mm"
					></DatePicker>
				</FormItem>
			</div>
			<div :class="mb" style="height:84px">
				<FormItem label="客户端" prop="newclient_type" class=" ib">
					<div class="h36 mb15">
						<CheckboxGroup class="ml5 w255x ib mr20" v-model="formKey.newclient_type" @on-change="checkAllGroupChange">
							<Checkbox label="PC"></Checkbox>
							<!-- <Checkbox label="H5"></Checkbox> -->
							<Checkbox label="Android"></Checkbox>
							<Checkbox label="IOS"></Checkbox>
						</CheckboxGroup>
						<span class="w80x ib mr12 ft14 txt-r">弹跳位置</span>
						<Select class="w255x " v-model="formKey.bounce_location">
							<Option v-for="(item,index) in  list" :key="index" :value="item.value">{{item.name}}</Option>
						</Select>
					</div>
					<div class="h36">
						<CheckboxGroup class="ml5 w255x ib mr20" v-model="formKey.newclient_type" @on-change="checkAllGroupChange">
							<Checkbox label="H5"></Checkbox>
						</CheckboxGroup>
						<span class="w80x ib mr12 ft14 txt-r"  v-if="formKey.newclient_type.includes('H5')">弹跳位置</span>
						<Select v-if="formKey.newclient_type.includes('H5')" class="w255x " transfer v-model="formKey.bounce_location_h5">
							<Option v-for="(item,index) in  list" :key="index" :value="item.value">{{item.name}}</Option>
						</Select>
					</div>
				</FormItem>
			</div>
			<div :class="mb">
				<FormItem label="出现位置" prop="newappears_location">
					<CheckboxGroup class="ml5" v-model="formKey.newappears_location" @on-change="Checkappears">
						<Checkbox label="首页"></Checkbox>
						<Checkbox label="游戏页"></Checkbox>
					</CheckboxGroup>
				</FormItem>
			</div>
			
			<div class="mb" :class="mb">
				<FormItem label="编辑内容" prop="desc_format_type">
					<div class="v2-button ml5">
						<Button class="w139x fl" :class="this.seText==true?'active':''" @click="onText">文本</Button>
						<Button class="w139x fl" :class="this.seImg==true?'active':''" @click="onImg">使用图片</Button>
					</div>
				</FormItem>
			</div>
			<!-- 使用图片显示的内容 -->
			<!-- 选择pc和手机 -->
			<div class="mt30 clearfix ml20 ml95" v-if="seImg && showh5">
				<div class="upLoad fl">
					<div class="txt-a" v-if="showimg">
						<p class="ft18 txt-a mt100">PC端</p>
						<Upload
							:default-file-list="uploadForm.defaultList"
							:headers="uploadForm.headers"
							:action="uploadForm.action"
							:data="uploadForm.data"
							:name="uploadForm.name"
							:max-size="2048"
							:on-exceeded-size="handleMaxSize"
							:on-success="(res)=>{ onUploadSuccess(res,'pc') }"
							:format="['jpg','jpeg','png','gif']"
							:on-format-error="handleFormatError"
						>
							<Button class="w148x mt20" icon="ios-cloud-upload-outline">上传图片</Button>
						</Upload>
					</div>
					<div class="demo-upload-list" v-if="!showimg">
						<img :src="formKey.pc_pic" />
						<div class="demo-upload-list-cover">
							<Icon type="ios-eye-outline" @click.native="handleView('pc')" size="26"></Icon>
							<Icon type="ios-trash-outline" @click.native="handleRemove('pc')" size="26"></Icon>
						</div>
					</div>
				</div>

				<div class="upLoad fl ml20">
					<!-- 上传 -->
					<div class="txt-a" v-if="showimgPhone">
						<p class="ft18 txt-a mt100">手机端</p>
						<Upload
							:default-file-list="uploadForm.defaultList"
							:headers="uploadForm.headers"
							:action="uploadForm.action"
							:data="uploadForm.data"
							:name="uploadForm.name"
							:max-size="2048"
							:on-exceeded-size="handleMaxSize"
							:on-success="(res)=>{ onUploadSuccess(res,'phone') }"
							:format="['jpg','jpeg','png','gif']"
							:on-format-error="handleFormatError"
						>
							<Button class="w148x mt20" icon="ios-cloud-upload-outline">上传图片</Button>
						</Upload>
					</div>
					<div class="demo-upload-list" v-if="!showimgPhone">
						<img :src="formKey.mob_pic" />
						<div class="demo-upload-list-cover">
							<Icon type="ios-eye-outline" @click.native="handleView('phone')" size="26"></Icon>
							<Icon type="ios-trash-outline" @click.native="handleRemove('phone')" size="26"></Icon>
						</div>
					</div>
				</div>
			</div>
			<!-- 只选择pc -->
			<div class="mt30 clearfix" v-if="seImg && !showh5 && formKey.newclient_type.length > 0">
				<div class="upLoadPC fl">
					<div class="txt-a" v-if="showimg2">
						<p class="ft18 txt-a mt100">{{pc? "PC端":"手机端"}}</p>
						<Upload
							:default-file-list="uploadForm.defaultList"
							:headers="uploadForm.headers"
							:action="uploadForm.action"
							:data="uploadForm.data"
							:name="uploadForm.name"
							:on-success="(res)=>{ onUploadSuccess(res,pc) }"
							:format="['jpg','jpeg','png','gif']"
							:max-size="2048"
							:on-exceeded-size="handleMaxSize"
							:on-format-error="handleFormatError"
						>
							<Button class="w148x mt20" icon="ios-cloud-upload-outline">上传图片</Button>
						</Upload>
					</div>
					<div class="demo-upload-list" v-if="!showimg2">
						<img :src="pc?formKey.pc_pic:formKey.mob_pic" />
						<div class="demo-upload-list-cover">
							<Icon type="ios-eye-outline" @click.native="handleView(pc)" size="26"></Icon>
							<Icon type="ios-trash-outline" @click.native="handleRemove(pc)" size="26"></Icon>
						</div>
					</div>
				</div>
			</div>

			<div class="ml10 mb20 ueBox" v-show="seText">
				<UE :defaultMsg="defaultContent" :config="config" :id="ue1" ref="ue1"></UE>
				<!-- <kindeditor class="fl" :width="'750'" :height="'250'" :content="defaultContent" :config="config" :id="ue1" ref="ue1" :key="ue1"></kindeditor> -->
			</div>

			<FormItem label="状态" class="mt10 ml5 type">
				<!-- <Switch v-model="formKey.status" class="ml15" size="large"></Switch>
				<span class="ml20">{{formKey.status==false?"未启用":'已启用'}}</span> -->
				<Select class="w190x" v-model="formKey.status">
					<Option value="yes">正常</Option>
					<Option value="no">停用</Option>
				</Select>
			</FormItem>
			<FormItem >
				<Button
				style="margin-bottom:50px"
					class="ivu-btn addSave mt20"
					@click.prevent="save"
				>{{$route.params.page === "edit"? "确认保存":"确认新增"}}</Button>
			</FormItem>
		</Form>
		<!-- 查看轮播弹窗 -->
		<Modals ref="lookLunbo" title="图片预览" width="1600" height="570">
			<div slot="content" :class="visible?'':'mb30'">
				<div class="lbList txt-a">
					<img :src="url" v-if="visible" class="h100" />
				</div>
			</div>
		</Modals>
	</div>
</template>
<script>
	import UE from "_c/UE";
	//import kindeditor from '_c/kindeditor';
	import Modals from "@/components/modals";
	import { popupsIns, popupsDetail, popupsUpt } from "@/api/system";
	import { uploadImg } from "@/api/common";
	import { getUserName } from "@/libs/util";
	import { getToken } from "@/libs/util";
	import { mapState } from "vuex";
	export default {
		name: "noticeDetial",
		components: {
			Modals, //kindeditor
			UE
		},
		data() {
			return {
				mb: screen.width > 1980 ? "mb20" : "mb15",
				rules: {
					title: [
						{
							required: true,
							message: "请输入标题",
							trigger: "blur"
						},
						{
							type: "string",
							min: 1,
							message: "请输入1-20位标题",
							trigger: "blur"
						}
					],
					publish_at: [
						{
							required: true,
							message: "请选择开始日期",
							trigger: "blur",
							pattern: /.+/
						}
					],
					offline_at: [
						{
							required: true,
							message: "请选择结束日期",
							trigger: "blur",
							pattern: /.+/
						}
					],
					newappears_location: [
						{
							required: true,
							message: "请选择出现位置",
							trigger: "change",
							pattern: /.+/
						}
					],
					newclient_type: [
						{
							required: true,
							message: "请选择客户端",
							trigger: "change",
							pattern: /.+/
						}
					]
				},
				defaultContent: "",
				config: {
					initialFrameWidth: 900,
					initialFrameHeight: 350
				},
				ue1: "ue1",
				uploadForm: {
					headers: { Authorization: getToken() },
					action: "/api/v2/uploadImg",
					data: { siteId: "" },
					name: "img",
					defaultList: [],
					path: "",
					src: ""
				},
				optDisabled: {
					disabledDate: date => {
						return date && date.valueOf() < Date.now() - 86400000;
					}
				},
				showimg: true,
				showimg2: true,
				showimgPhone: true,
				visible: false,
				indeterminate: true,
				checkAll: false,
				pc: true,
				h5: false,
				phone: false,
				checkAllGroup: ["PC"],
				formKey: {
					siteId: "",
					siteName: "",
					type: "popups",
					title: "",
					publish_at: "",
					offline_at: "",
					bounce_location: "2",
					bounce_location_h5:'2',
					desc_format_type: "text",
					description: "",
					status: "yes",
					appears_location: "",
					client_type: "",
					newappears_location: [],
					newclient_type: [],
					pc_pic: "",
					mob_pic: "",
					url: "",
					pcpath: "",
					phonepath: ""
				},
				seText: true,
				seImg: false,
				showh5: false,
				list: [
				    { value: "2", name: "登录后" },
					{ value: "1", name: "登录前" },
					{ value: "3", name: "不限制" }
				]
			};
		},
		computed: {
			username() {return getUserName();},
			...mapState({token: state => state.user.token})
		},
		watch: {
			"$root.nowSite": {
				handler(val) {
					this.uploadForm.data.siteId = val.id;
				},
				deep: true
			}
		},
		mounted() {
      	this.uploadForm.data.siteId = this.$root.nowSite.id;
			if (this.$route.params.page === "edit") {
				const data = { id: this.$route.query.id, siteId: this.$root.nowSite.id };
				this.onDetails(data);
			}
			if (this.$route.params.page == "create") {
				this.formKey.newclient_type = ["PC", "H5", "Android", "IOS"];
				this.checkAllGroupChange();
			}
		},
		methods: {
			onText() {
				this.seText = true;
				this.seImg = false;
				this.formKey.desc_format_type = "text";
			},
			onImg() {
				this.seImg = true;
				this.seText = false;
				this.formKey.desc_format_type = "pic";
			},
			handleMaxSize(file) {
				this.$Message.error("上传图片体积最大为2M");
			},
			//新增公告成功
			save() {
				this.$refs.formKey.validate(valid => {
					if (valid) {
						if (this.$route.params.page === "create") {
							let params = { ...this.formKey };
							let Time = [params.publish_at, params.offline_at];
							if (this.$root.validatecourseTime(Time)) {
								params.publish_at = this.$root.formatTimeS(params.publish_at);
								params.offline_at = this.$root.formatTimeS(params.offline_at);
							} else {
								return false;
							}
							params.siteId = this.$root.nowSite.id;
							params.siteName = this.$root.nowSite.siteName;

							params.pc_pic = params.pcpath;
							params.mob_pic = params.phonepath;

							delete params.pcpath;
							delete params.phonepath;

							delete params.newappears_location;
							delete params.newclient_type;

							if (params.desc_format_type == "text") {
								//params.description = this.$refs.ue1.outContent;
								params.description = this.$refs.ue1.getUEContent();
								if (params.description === "") {
									this.$Message.error("请填写内容");
									return;
								}
								delete params.pc_pic;
								delete params.mob_pic;
							} else {
								delete params.description;
								if (this.pc && !this.h5) {
									delete params.mob_pic;
									if (!params.pc_pic) {
										this.$Message.error("请上传图片");
										return false;
									}
								}
								if (!this.pc && this.h5) {
									delete params.pc_pic;
									if (!params.mob_pic) {
										this.$Message.error("请上传图片");
										return false;
									}
								}
								if (this.pc && this.h5) {
									if (!params.pc_pic) {
										this.$Message.error("请上传pc端图片");
										return false;
									}
									if (!params.mob_pic) {
										this.$Message.error("请上传手机端图片");
										return false;
									}
								}
							}
							delete params.url;
							for (let key in params) {
								if (!params[key]) delete params[key];
							}
							if(!params.client_type.split(',').includes('H5')){
								params.bounce_location_h5 = '3'
							}
							popupsIns(params, true).then(res => {
								if (res != undefined && res.code == 200) {
									this.$Message.success("新增公告成功");
									this.$router.go(-1);
								}
							});
						}
						if (this.$route.params.page === "edit") {
							const params = { ...this.formKey };
							let Time = [params.publish_at, params.offline_at];
							if (this.$root.validatecourseTime(Time)) {
								params.publish_at = this.$root.formatTimeS(params.publish_at);
								params.offline_at = this.$root.formatTimeS(params.offline_at);
							} else {
								return false;
							}
							params.siteId = this.$root.nowSite.id;
							params.siteName = this.$root.nowSite.siteName;
							params.id = this.$route.query.id;
							for (let key in params) {
								if (!params[key]) delete params[key];
							}

							if (params.pcpath) {
								params.pc_pic = params.pcpath;
							}
							if (params.phonepath) {
								params.mob_pic = params.phonepath;
							}
							delete params.pcpath;
							delete params.phonepath;

							delete params.newappears_location;
							delete params.newclient_type;

							if (params.desc_format_type == "text") {
								params.description = this.$refs.ue1.getUEContent();
								delete params.pc_pic;
								delete params.mob_pic;
							} else {
								delete params.description;
								if (this.pc && !this.h5) {
									delete params.mob_pic;
									if (!params.pc_pic) {
										this.$Message.error("请上传图片");
										return false;
									}
								}
								if (!this.pc && this.h5) {
									delete params.pc_pic;
									if (!params.mob_pic) {
										this.$Message.error("请上传图片");
										return false;
									}
								}
								if (this.pc && this.h5) {
									if (!params.pc_pic) {
										this.$Message.error("请上传pc端图片");
										return false;
									}
									if (!params.mob_pic) {
										this.$Message.error("请上传手机端图片");
										return false;
									}
								}
							}

							delete params.url;
							if(!params.client_type.split(',').includes('H5')){
								params.bounce_location_h5 = '3'
							}
							popupsUpt(params, true).then(res => {
								if (res != undefined && res.code == 200) {
									this.$Message.success("编辑公告成功");
									this.$router.push({ name: "notice" });
								}
							});
						}
					}
				});
			},
			// 改变富文本框
			handleChange(html, text) {
				this.formKey.description = html.toString();
			},
			handleFormatError(file) {
				this.$Tip.info({ content: "请上传图片" });
			},
			checkAllGroupChange() {
				let clientlist = [];
				this.h5 = this.formKey.newclient_type.some(
					item => item == "H5" || item == "Android" || item == "IOS"
				);
				this.pc = this.formKey.newclient_type.some(item => item == "PC");
				if (this.pc && this.h5) this.showh5 = true;
				else this.showh5 = false;
				// *判断客户端选择显示图片信息开始
				if (this.showh5) {
					if (this.formKey.pc_pic) {
						this.showimg = false;
					} else {
						this.showimg = true;
					}
					if (this.formKey.mob_pic) {
						this.showimgPhone = false;
					} else {
						this.showimgPhone = true;
					}
				} else {
					if (this.pc) {
						if (this.formKey.pc_pic) {
							this.showimg2 = false;
						} else {
							this.showimg2 = true;
						}
					} else if (this.h5) {
						if (this.formKey.mob_pic) {
							this.showimg2 = false;
						} else {
							this.showimg2 = true;
						}
					} else {
						this.showimg2 = true;
					}
				}
				// *判断客户端选择显示图片信息开始结束
				this.formKey.newclient_type.map(item => {
					clientlist.push(item);
				});

				if (clientlist.length > 1)
					this.formKey.client_type = clientlist.join(",");
				else this.formKey.client_type = clientlist[0];
			},
			//出现位置
			Checkappears() {
				let appears = [];
				this.formKey.newappears_location.map(item => {
					if (item == "首页") {
						appears.push("1");
					} else {
						appears.push("2");
					}
				});
				if (appears.length > 1) this.formKey.appears_location = appears.join(",");
				else this.formKey.appears_location = appears[0];
			},
			handleView(val) {
				if (val == "pc" || val == true) this.url = this.formKey.pc_pic;
				else this.url = this.formKey.mob_pic;
				this.visible = true;
				this.$forceUpdate();
				this.$refs.lookLunbo.show();
			},
			handleRemove(val) {
				if (val == "pc" || val == true) {
					this.formKey.pc_pic = "";
					this.formKey.pcpath = " ";
					this.showimg = true;
					this.showimg2 = true;
				} else {
					if (!val) {
						this.showimg = true;
						this.showimgPhone = true;
						this.showimg2 = true;
					}
					this.formKey.mob_pic = "";
					this.formKey.phonepath = "";
					this.showimgPhone = true;
				}
			},
			onUploadSuccess(res, val) {
				const { path, src, host } = res.data;
				if (val == "pc" || val == true) {
					this.formKey.pc_pic = `${host}/${src}`;
					this.formKey.pcpath = path;
					this.showimg = false;
					this.showimg2 = false;
				} else {
					if (!val) {
						this.showimg = false;
						this.showimg2 = false;
					}
					this.showimgPhone = false;
					this.formKey.mob_pic = `${host}/${src}`;
					this.formKey.phonepath = path;
				}
			},
			onDetails(data) {
				popupsDetail(data).then(res => {
					Object.keys(this.formKey).forEach(key => {
						if (key == "status") {
							this.formKey[key] = res.data[key];
						} else if (key == "newclient_type" || key == "newappears_location") {
							this.formKey[key] = this.formKey[key];
						} else if (key == "bounce_location"||key == "bounce_location_h5") {
							this.formKey[key] = res.data[key].toString();
						} else if (key == "publish_at" || key == "offline_at") {
							this.formKey[key] = this.$root.unixTime(res.data[key]);
						} else {
							this.formKey[key] = res.data[key];
						}
					});
					if (this.formKey.desc_format_type === "pic") {
						this.formKey.description = "";
					} else if (this.formKey.desc_format_type === "text") {
						this.formKey.pc_pic = this.formKey.mob_pic = "";
					}
					const {
						newclient_type,
						client_type,
						appears_location,
						newappears_location,
						publish_at,
						offline_at,
						desc_format_type,
						bounce_location,
						bounce_location_h5,
						description
					} = this.formKey;
					if (client_type.length == 1) newclient_type.push(client_type);
					else
						client_type.split(",").map(item => {
							newclient_type.push(item);
						});
					// 编辑进触发事件
					this.checkAllGroupChange();
					if (appears_location.length == 1)
						if (appears_location == "1") newappears_location.push("首页");
						else newappears_location.push("游戏页");
					else
						appears_location.split(",").map(item => {
							if (item == "1") {
								item = "首页";
							} else {
								item = "游戏页";
							}
							newappears_location.push(item);
						});
					if (description) {
						//编辑器未创建好就编辑内容
						this.$refs.ue1.setContent(description);
						console.log(description,this.$refs.ue1.setContent(description))
						//this.defaultContent = description
						//this.$refs.ue1._data.editor.body.innerHTML = description;
					}
					if (desc_format_type == "pic") {
						this.seImg = true;
						this.seText = false;
						this.h5 = this.formKey.newclient_type.some(
							item => item == "H5" || item == "Android" || item == "IOS"
						);
						this.pc = this.formKey.newclient_type.some(item => item == "PC");
						if (this.pc && this.h5) this.showh5 = true;
						else this.showh5 = false;
						if (this.pc && this.h5) {
							this.showimg = false;
							this.showimgPhone = false;
						} else if (this.pc && !this.h5) {
							this.showimg2 = false;
							this.formKey.mob_pic = "";
						} else if (this.h5 && !this.pc) {
							this.showimg2 = false;
							this.formKey.pc_pic = "";
						}
					}
				});
			}
		}
	};
</script>
<style scoped lang="less">
	@import "../../../styles/button.less";
	/deep/.ivu-date-picker-rel {
		width: 255px;
	}

	.v2-button .ivu-btn {
		border-color: #dcdcdc;
		color: #666;
		background-color: #f6f6f8;
		&.active {
			border-color: #2d8cf0;
			color: #fff;
			background-color: #2d8cf0;
			box-shadow: none !important;
		}

		&:hover {
			border-color: #2d8cf0;
		}
	}
	.upLoad {
		width: 300px;
		height: 300px;
		border: 1px solid #e4e4e4;
		padding: 10px;
		box-sizing: border-box;
	}
	.upLoad :nth-child(1) {
		border-left: 0;
	}
	.upLoadPC {
		width: 300px;
		height: 300px;
		margin-left: 70px;
		border: 1px solid #e4e4e4;
	}
	/deep/.ivu-form-item-error-tip {
		top: 33px;
	}
	.demo-upload-list {
		display: inline-block;
		width: 100%;
		height: 100%;
		text-align: center;
		line-height: 278px;
		// border: 1px solid transparent;
		// border-radius: 4px;
		overflow: hidden;
		background: #fff;
		position: relative;
		// box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
		// margin-right: 4px;
	}
	.demo-upload-list img {
		width: 100%;
		vertical-align: middle;
		border-radius: 10px;
		// height: 100%;
	}
	.demo-upload-list-cover {
		display: none;
		border-radius: 10px;
		line-height: 300px;
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
	.vertical-center-modal {
		display: flex;
		align-items: center;
		justify-content: center;

		/deep/.ivu-modal {
			top: 0;
		}
	}
	.bounce {
		width: 80px;
		margin-right: 12px;
		display: inline-block;
		text-align: right;
	}
	.duringTime {
		//日历样式
		/deep/.ivu-select-dropdown {
			width: 255px;
			z-index: 1000;
			height: 343px;
			.ivu-picker-panel-body {
				width: 100%;
				height: 290px;
				.ivu-time-picker-cells-list {
					width: 50%;
					box-sizing: border-box;
					min-height: 290px;
				}
				.ivu-picker-panel-content {
					.ivu-time-picker-cells-cell {
						padding: 0;
						text-align: center;
					}
				}
				.ivu-date-picker-cells {
					width: 238px;
					span {
						width: 34px;
						height: 34px;
						margin: 0;
					}
					em {
						width: 34px;
						height: 34px;
						margin: 0;
						line-height: 34px;
					}
				}
			}
		}
	}
	/deep/.ivu-form-item {
		.ivu-form-item-label {
			width: 80px;
		}
	}
	.ueBox {
		margin-left: 95px;
		overflow: hidden;
  }
 .addSave{
	 margin-left:95px;
 }
 .lbList {
    width: 100%;
    height: 540px;
    position: relative;
    span {
        position: absolute;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 1px solid #cdcdcd;
        line-height: 40px;
        text-align: center;
    }
    .toLeft {
        left: 10px;
        top: 0;
        bottom: 0;
        margin: auto;
        z-index: 100;
    }
    .toRight {
        right: 10px;
        top: 0;
        bottom: 0;
        margin: auto;
        z-index: 100;
    }
    .odiv {
        height: 100%;
        // white-space: nowrap;
        .op {
            transition: 0.8s;
            position: absolute;
            // display: inline-block;
            height: 100%;
            width: 100%;
            text-align: center;
            line-height: 540px;
            opacity: 0;
            img {
                height: 360px;
                vertical-align: middle;
            }
        }

    }
}
/deep/.type .ivu-select-dropdown{
	z-index: 1000
}
</style>
