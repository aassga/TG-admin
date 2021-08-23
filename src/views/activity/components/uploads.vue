<template>
  <div class="content b" v-bind:pic='pic'>
    <Modal title="图片预览" v-model="visible">
			<img :src="imgName" class="w100">
		</Modal>
    <div class="content-img" v-if="pic" :key="pic">
      <img :src="pic" alt="" class="img">
      <div class="cover" v-show='cover'>
				<Icon type="ios-eye-outline" class="cs" :size="48"  @click.native="handleView"></Icon>
			</div>
    </div>
    <div class="content-body">
      <Upload
      :action="action"
      :multiple="multiple"
      :type="type"
      :headers="headers"
      :data="data"
      :name="name"
      :format="format"
      :max-size="maxSize"
      :show-upload-list="showUploadList"
      :default-file-list="defaultFileList"
      :before-upload="handleUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      >
        <p class="content-txt">鼠标拖拽图片至此区域以上传</p>
        <Button icon="ios-cloud-upload-outline" class="mb15" v-if="!pic" key="upload">上传图片</Button>
        <Button icon="ios-cloud-upload-outline" v-else class="mb15" key="reUpload">重新上传</Button>
      </Upload>
    </div>
    
  </div>
</template>

<script>
import Icons from '@/components/icons'

export default {
  name: 'uploads',
  components: { Icons },
  props: {
    useType: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'drag'
    },
    headers: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      default: 'img'
    },
    format: {
      type: Array,
      default: () => ['jpg','jpeg','png','gif']
    },
    maxSize: {
      type: Number,
      default: 2048
    },
    showUploadList: {
      type: Boolean,
      default: false
    },
    editPic: {},
  },
  data () {
    return {
      defaultFileList: [
        {}
      ],
      pic: '',
      cover:false,
      visible: false, //图片放大的功能
      imgName:'',
    }
  },
  mounted(){
   
  },
  watch: {
    editPic: {
      handler() {
        if (this.$route.params.page === 'edit') {
          this.pic = this.editPic.image;
        }
      },
      deep: true
    }
  },
  computed: {
   
  },
  methods: {
    handleView() {
      this.imgName = this.pic;
      this.visible = true;
		},
    handleUpload (file) {
      this.$emit('before-upload', file)
    },
    handleSuccess (res) {
      if (res.code === 200) {
        this.pic = `${res.data.host}/${res.data.src}`
        this.$emit('on-success', res)
      }
    },
    handleError (res) {},
    handleFormatError (res) {
       this.$emit('on-format-error', res, useType)
    },
    handleMaxSize (file) {
      this.$emit('overSize', file)
    },
  },
  created () {
    this.$nextTick(() => {
      if (this.editPic) {
        this.pic = this.editPic.image
      }
    })
  }
}
</script>

<style scoped lang="less">
/deep/.ivu-upload {
  margin: 0 auto;
  padding: 0 10px;
}
/deep/.ivu-btn {
  width: 155px;
  height: 38px;
  margin-top: 15.5px;
  border: 1px solid #62B1FD;
  color: #62B1FD;
}
/deep/.ivu-upload-drag {
  border: none;
}
.content-img:hover .cover {
      display: block !important;
      // border:5px solid red;
  }
.content {
  display: inline-block;
  height: 140px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 5px;
  border: solid 1px #e4e4e4;
  text-align: center;
  margin:10px 0; 
  width:584px !important;
  background: white;

  .content-img :hover .cover {
      display: block;
    }
  
  .content-img {
    display: inline-block;
    box-sizing: border-box;
    width: 280px;
    height: 100px;
    margin-right: 17px;
    vertical-align: top;
    position: relative;
    .cover {
      display: none;
      z-index: 1000;
      height: 100%;
      width: 100%;
      line-height: 100px;
		  position: absolute;
		  top: 0;
		  bottom: 0;
		  left: 0;
      right: 0;
      text-align: center;
      background: rgba(0, 0, 0, 0.6);
      i {
        vertical-align: middle;
        color:white;
      }
    }
    .img {
      width: 280px;
      height: 100px;
    }
  }
  
  .content-body {
    display: inline-block;
    width: 200;
    height: 130px;
    .content-title {
      height: 25px;
      .title-txt {
        margin-left: 9px;
        color: #808080;
        font-size: 1.125rem /* 18/16 */;
      }
    }
    .content-txt {
      padding-top: 9px;
      font-size: .875rem /* 14/16 */;
      color: #CCCCCC;
    }
  }
  .btn {
    border: 1px solid #C5C5C5;
    color: #C5C5C5;
  }
}
//重新上传样式未写入
.content-left {
  text-align: left;
}
/deep/.ivu-modal-footer {
  .ivu-btn-large{
    width: 80px;
  };
  .ivu-btn-primary{
    color:white;
  }
  .ivu-btn-text{
    border:0;
  }
}

</style>


