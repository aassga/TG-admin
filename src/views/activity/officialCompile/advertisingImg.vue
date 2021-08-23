<template>
    <div class="v2-search advertisingImg txt-a" ref="box">
      <div class="imgbox"  :style="{'margin-top':((height-602)/2)+'px'}">
        <img class="img"
          v-if="!showDefault" @load="imgLoad" 
          v-show="show"
          ref='img'
          :src="host + '/storage/sites/'+siteId+'/uploads/' + defaultImg" />
        <img v-else ref='img'  @load="imgLoad" class="img" src="../../../assets/images/qidong.png"/>
        <span class="span1" v-if='formKey.skipStatus'>跳过</span>
        <span class="span2" v-if='formKey.detailsStatus'>查看详情</span>
        <div class="cover fl">
          <div class="edit cs" @click='toEdit'><Icons type="cebianlanyouxijilubaobiao" size="36" color="black" /></div>
        </div>
      </div>
    </div>
</template>
<script>
import UpLoads from '../components/uploads';
import { uploadImg, getActivityImgConfigSize } from '@/api/common';
import {advertisingImg} from '@/api/system';
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
          siteId:this.$root.nowSite.id,
          height:'',
          width:'',
          host:'',
          show:false,
          showDefault:false,
          defaultImg:'',
          formKey:{
            skipStatus:'',
            detailsStatus:'',
            status:'yes',
          },
        }
    },
    created() {
        //获取编辑值
        this.host = location.origin;
        this.$nextTick(() => {
            advertisingImg({siteId:this.$root.nowSite.id}).then(res=>{
              if(res&&res.code==200){
                if(!res.data){
                  this.host="";
                  this.showDefault = true;
                }else{
                  this.showDefault = false;
                  this.defaultImg = res.data.imgPath
                  this.formKey = res.data;
                }
              }
            })
        });
    },
    mounted(){
      this.height = window.getComputedStyle(this.$refs.box).height.substring(0,window.getComputedStyle(this.$refs.box).height.length-2);
    },
    methods: {
      imgLoad() {
        let _this = this;
        _this.show = true;
      },
      toEdit(){
      	this.$router.push({name: 'advertisingImgEdit'});
      },
     
    }
};
</script>
<style lang="less" >
@import '../../../styles/button.less';
.imgbox:hover .cover{
  display: block !important;
}
.advertisingImg {
  width: 100%;
  height: 100%;
  margin: 0;
  position: relative;
  .imgbox{
    width:300px;
    display: inline-block;
    z-index: 10;
    min-height: 602px;
    // height: 602px;
    position: relative;
    overflow: hidden;
    border-radius: 45px;
    // left: 0;
    // top: 0;
    // bottom: 0;
    // right: 0;
    // margin: auto;
    .cover {
      display: none;
      width: 100% !important;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 45px;
      position: absolute;
      top: 0;
      left: 0;
      .edit {
        width: 80px;
        height: 80px;
        z-index: 11;
        line-height: 80px;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        border-radius: 50%;
        background: white;
      }
    }
    .span1 {
      position: absolute;
      right: 30px;
      top:40px;
      border-radius: 10px;
      width: 61px;
      line-height:24px;
      background-color: rgba(0, 0, 0, 0.4);
      color:white;
      display: none;
    }
    .span2 {
      position: absolute;
      height: 24px;
      bottom: 35px;
      color:white;
      display: none;
      right:40px;
    }
    .img{
      width: 100%;
    }
    
    
  }
  
}
</style>

