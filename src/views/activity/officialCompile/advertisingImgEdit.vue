<template>
    <div >
      <div class="leftd fl">
        <Img :src="host+imgShow" v-if="imgShow" v-show='show' @load="imgLoad"  />
        <img v-else class="defaultimg" src="../../../assets/images/qiDafault.png" />
        <span class="span1 txt-a" v-if="formKey.skipStatus=='yes'">跳过</span>
        <span class="span2" :style="{color:formKey.captionColour}" v-if='formKey.detailsStatus'>{{formKey.details}}</span>
      </div>
      <div class="right fl">
        <div class="mb20 mt20">上传图片</div>
        <div class="upImg w458x">
          <div class="up-left fl txt-a" ><Icon type="ios-exit-outline" color="#dcdcdc" size='48'/></div>
          <div class="up-right fl" >
            <p class='ft14 mt10 mb5' style="color:'#dcdcdc'">图片支持4M以下，1125*2436像素的pn文件</p>
            <Upload
                style="cursor:default"
                class="ib up ft16"
                :disabled="disable"
                :headers="uploadForm.headers"
                :action="uploadForm.action"
                :data="uploadForm.data"
                :name="uploadForm.name"
                :on-success="uploadSuccess"
                :show-upload-list="false"
                :format="['jpg', 'jpeg', 'png', 'gif']"
                :max-size="4096"
                :before-upload='handleUpload'
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
              >
              <div class="upLoad txt-a blue-font">
                {{disable?'上传中...':imgShow?'重新上传':'上传图片'}}
              </div>
            </Upload>
          </div>
        </div>
        <Form class="advertisingImgEdit" label-position="left">
          <div class="mb20">
            <p class="lh40">图片超链接(可选)</p>
            <Input class="w458x" v-model="formKey.advertisingUrl" placeholder="可设置链接地址" />
          </div>
          <div class="mb20">
            <p>
              跳转方式
              <Poptip trigger='hover' placement='right-start'>
                <div slot="content" style="white-space: normal;">
                  <div class="mb15">若选择'添加跳转按钮',5秒后自动跳转至app</div>
                  <div class="mb15">若选择'不添加跳转按钮',3秒后自动跳转至app</div>
                </div>
                <Icons type='bangzhutishi' color='#E4E4E4' :size='18'/>
              </Poptip>
            </p>
            <RadioGroup class="db lh40" v-model="formKey.skipStatus">
              <Radio  label="yes"><span>添加跳转按钮</span></Radio>
              <Radio label="no"><span>不添加跳转按钮</span></Radio>
            </RadioGroup> 
            <div>
              <Input class="w458x" disabled value='跳过' />
            </div>
          </div>
          <div class="mb20">
            <P>编辑链接</P>
            <RadioGroup class="db lh40" v-model="formKey.detailsStatus">
              <Radio label="yes"><span>添加链接</span></Radio>
              <Radio label="no"><span>不添链接</span></Radio>
            </RadioGroup> 
            <div v-if="formKey.detailsStatus=='yes'">
              <Input class="w310x" v-model="formKey.details" />
              <div class="ib w148x" :class="screen<1690?'w148':''" >
                <span :class="screen<1450?'pl5 pr15 ft10':'pr20 pl10'">选择颜色</span>
                <div class="ib" :class="screen<1690?'color':''" v-if="screen<1690">
                  <ColorPicker v-model="formKey.captionColour" />
                </div>
                <ColorPicker v-else v-model="formKey.captionColour" />
              </div>
              <Input class="w458x db mt20" maxlength="20" v-model="formKey.detailsUrl" placeholder="可设置链接地址" />
            </div>
          </div>
          <div class="mb20">
            <span class="pr20">启用状态</span>
            <RadioGroup v-model="formKey.status">
              <Radio label="yes"><span>启用</span></Radio>
              <Radio label="no"><span>禁用</span></Radio>
            </RadioGroup>
          </div>
        </Form>
        <Button class="submit" type='primary' @click="submit">确认保存</Button>
      </div>
    </div>
</template>
<script>
import Modals from '@/components/modals';
import UpLoads from '../components/uploads';
import { uploadImg } from '@/api/common';
import {advertisingImg,AdvertisingImgConfigIns} from '@/api/system';
import { mapState } from 'vuex';
import Icons from '_c/icons';
import { getUserName, getToken } from '@/libs/util';
export default {
    name: 'qidongtupian',
    components: {
        UpLoads,
        Icons
    },
    data() {
      return {
        host: '',
        show:'',
        imgShow:'',
        disable:false,
        screen:screen.width,
        formKey:{
          siteId:this.$root.nowSite.id,
          imgPath:'',//图片地址
          advertisingUrl:'',
          detailsUrl:'',//详情地址
          skipStatus:'yes',
          detailsStatus:'yes',
          details:'',
          captionColour:"#666",
          status:'yes',
        },
         uploadForm: {
                headers: { Authorization: getToken() },
                action: '/api/v2/uploadImg',
                data: { siteId: this.$root.nowSite.id },
                name: 'img',
                defaultList: [],
                path: '',
                src: ''
            },
      }
    },
    created() {
      this.host = location.origin;
      //获取编辑值
      this.$nextTick(() => {
        advertisingImg({siteId:this.$root.nowSite.id}).then(res=>{
          if(res&&res.code==200&&res.data){
            this.formKey= res.data;
            this.imgShow ='/storage/sites/'+this.formKey.siteId+'/uploads/'+ res.data.imgPath;
          }else{}
        })
      });
    },
    methods: {
      imgLoad() {
        let _this = this;
        _this.show = true;
      },
      submit(){
        let data = {...this.formKey};
        for(let key in data){
          if(!data[key]) delete data[key]
        }
        if(!data.imgPath) {
          this.$Message.error('请上传图片');
          return
        }
        AdvertisingImgConfigIns(data,true).then(res=>{
          if(res&&res.code==200) {
            this.$Message.success("广告图配置成功");
            this.$router.push({name:'advertisingImg'})
          }
        })
      },
      handleUpload(){
        this.disable=true;
      },
      //上传成功
      uploadSuccess(res, type, useType) {
        this.host = res.data.host;
        this.formKey.imgPath = res.data.path;
        this.imgShow = res.data.src;
        this.disable = false;
      },
      handleFormatError(file) {
        this.$Tip.info({ content: '请上传图片' });
      },
      handleMaxSize(file) {
        this.$Message.error('上传图片体积最大为4M');
      },
    }
};
</script>
<style lang="less" >
@import '../../../styles/button.less';
.ivu-btn-small {
  height: 36px;
 
}
.leftd {
  width: 294px;
  height: 640px;
  background: rgb(236, 236, 233);
  margin:0 80px 0 160px; 
  background: white;
  border:1px solid #dcdcdc;
  position: relative;
  img {
    width: 100%;
  }
  .defaultimg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .span1 {
    position: absolute;
    right: 20px;
    top:20px;
    border-radius: 10px;
    width: 61px;
    line-height:24px;
    background-color: rgba(0, 0, 0, 0.4);
    color:white;
  }
  .span2 {
    position: absolute;
    bottom: 20px;
    right:20px;
  }
}
.upImg {
  height: 69px;
  position: relative;
  border:1px #dcdcdc dotted;
  .up-left {
    width: 30%;
    height: 100%;
    line-height: 69px;
  }
  .up-right {
    width:70%;
    height: 120%;
  }
}
.submit {
  height: 50px;
  width: 260px;
}
.advertisingImgEdit {
  .ivu-form-item {
    margin-bottom: 15px;
  }
  .ivu-form-item-label {
    width:100%;
  }
}
.w148 {
  // height: 30px
  vertical-align: top;
  position: relative;
  line-height: 36px;
  height: 36px;
  span {
    vertical-align: middle
  }

}
.color{
  zoom:1.25;
  position:absolute;
  .ivu-color-picker-input {
    height:30px !important;
    /deep/.ivu-icon {
      width: 26px !important;
    }
    .ivu-color-picker-color{
      width: 13px;height: 13px;
    }
  }
}

</style>

