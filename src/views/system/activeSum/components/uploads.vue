<template>
  <div class="content b">
    <div class="content-img" v-if="pic" :key="pic">
      <img :src="pic" alt="" class="img">
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
        <div class="content-title">
          <Icons :type="`zhongduan-${showType==='pc'?'PC':'shouji'}`" size="19" color="#C5C5C5"></Icons>
          <span class="title-txt">{{imgType}}</span>
        </div>
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
    showType: {
      type: String,
      required: true,
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
    editPic: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      defaultFileList: [
        {}
      ],
      pic: '',
    }
  },
  watch: {
    //监听值变化更新pic的值
    showType () {
      this.pic = ''
    },
    editPic: {
      handler() {
        if (this.$route.params.page === 'edit') {
          this.pic = this.editPic[this.showType]
        }
      },
      deep: true
    }
  },
  computed: {
    imgType () {
      return this.showType === 'pc' ? 'PC端' : '移动端'
    }
  },
  methods: {
    handleUpload () {},
    handleSuccess (res) {
      if (res.code === 200) {
        this.pic = `${res.data.host}/${res.data.src}`
        this.$emit('on-success', res, this.showType, this.useType)
      }
    },
    handleError (res) {},
    handleFormatError (res) {
       this.$emit('on-format-error', res, useType)
    },
    handleMaxSize (file) {
      this.$emit('overSize', file)
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.editPic[this.showType]) {
        // this.pic = `${'/storage/sites/171/uploads/201905/IMG1D_F475.png'}/${this.editPic[this.showType]}`
        //后版本直接传入src
        this.pic = this.editPic[this.showType]
      }
    })
  }
}
</script>

<style scoped lang="less">
/deep/.ivu-upload {
  margin: 0 auto;
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
.content {
  border:0;
  display: inline-block;
  width: 48%;
  height: 150;
  margin: 0 auto;
  margin-top: 25px;
  margin-bottom:10px !important; 
  text-align: center;
  .content-img {
    display: inline-block;
    width: 35%;
    height: 125.5px;
    margin-right: 17px;
    vertical-align: top;
    .img {
      width: 114px;
      height: 55px;
      margin-left: 10px;
      margin-top: 37px;
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
      margin-top: 9px;
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

</style>


