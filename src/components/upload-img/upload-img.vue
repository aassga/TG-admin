<template>
	<div>
		<div class="upLoad">
			<div v-if="showImg" class="center">
        <Upload
          v-model="imgUrl"
					:show-upload-list="false"
					:default-file-list="uploadForm.defaultList"
					:headers="uploadForm.headers"
					:action="uploadForm.action"
					:data="uploadForm.data"
					:name="uploadForm.name"
					:on-success="onUploadSuccess"
					:max-size="2048"
					:on-exceeded-size="handleMaxSize"
          :on-format-error="handleFormatError"
          :disabled="disabled"
				>
					<Button class="w120x mt100 txt-a fontColor" icon="ios-cloud-upload-outline">上传图片</Button>
					<p>默认360x360</p>
				</Upload>
			</div>
			<div class="demo-upload-list" v-if="!showImg">
				<img :src="imgUrl" />
				<div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView()" size="60"></Icon>
		      <Icon v-if="!disabled" type="ios-trash-outline" @click.native="handleRemove()" size="60"></Icon>
				</div>
			</div>
    </div>
		<Modal title="图片预览" v-model="visible" class-name="vertical-center-modal">
			<img :src="imgSrc" v-if="visible" style="width:100%" />
		</Modal>
	</div>
</template>
<script>
  import { getToken } from "@/libs/util";
  import {getUserType} from "@/libs/util";
	export default {
		props: {
      src:{
        type:String,
        default:""
      },
      transDisabled:{
        default:""
      }
		},
		data() {
			return {
        authInPage: JSON.parse(localStorage.authInPage),
        adminType: getUserType(),
				uploadForm: {
					headers: { Authorization: getToken() },
					action: "/api/v2/uploadImg",
					data: { siteId: this.$root.nowSite.id },
					name: "img",
					defaultList: [],
					path: "",
					src: "",
        },
        imgUrl:"",
        visible: false,
        disabled:false,
        showImg:true,
			};
    },
    mounted() {
      // console.log(this.transDisabled)
      this.disabled=this.transDisabled
      if(this.src&&this.src!=""){
        this.showImg=false;
         this.imgUrl=this.src
      }else{
        this.showImg=true;
      }

     	// 有编辑权限或者是超管
				if ((this.adminType == 'super') || (this.authInPage.indexOf('QRCodeUpdate') != -1)) {
					this.disabled = this.transDisabled
				}
				//没有编辑但是有等级
				if ((this.authInPage.indexOf('QRCodeUpdate') == -1) && (this.authInPage.indexOf('incomeCardManageOpenLevel') != -1)) {
          this.disabled = this.transDisabled
        }
    },
		methods: {
      handleMaxSize(){
      	this.$Message.error("上传图片体积最大为2M");
      },
      handleFormatError(file){
        this.$Tip.info({content:"请上传图片"})
      },
			handleView() {
				this.imgSrc = this.imgUrl;
				this.visible = true;
			},
			onUploadSuccess(res, file) {
        this.showImg = false;
        const { host, path, src } = res.data;
        this.$emit('path',path)
        this.$emit('getSrc',src)
        console.log(src)
				this.imgUrl = src
			},
			onUploadError() {},
			handleRemove(file) {
       this.showImg=true;
			}
		}
	};
</script>
<style lang="less" scoped>
	// 二维码的样式
	.upLoad {
		width: 270px;
		height: 270px;
		border: 1px solid #e4e4e4;
		border-radius: 5px;
	}

	.demo-upload-list {
		display: inline-block;
		width: 100%;
		height: 100%;
		text-align: center;
		line-height: 140px;

		overflow: hidden;
		background: #fff;
		position: relative;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
		// margin-right: 4px;
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
		margin: 100px 10px;
	}
</style>