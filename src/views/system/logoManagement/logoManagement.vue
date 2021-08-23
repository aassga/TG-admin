<template>
  <div :style="screen<1500?'zoom:0.67':screen>=1500&&screen<2000?'zoom:0.72':''">
    <div v-for="(t,x) in dataList" class="mb10" :key="'chat' + x">
      <div class="v2-button mb10 ft18" :style="screen < 1500 ? 'height:60px;line-height:60px' : ''">
        <Icons :type="t.clientType=='pc'?'zhongduan-PC':'zhongduan-shouji'" color="#C5C5C5" />
        {{t.clientType=='pc'?'PC':'MB'}}端{{t.position=='lottery_logo'?'彩票页':t.position=='register_logo'?'注册页':''}}{{t.position!="lottery_logo"&&t.position!="register_logo"?'首页':''}}Logo
      </div>
      <div class="bannerList" style="overflow:hidden">
          <div
            class="banner mr20 mb20 ib fl"
            v-for="(item,i) in t.body"
            :key="i"
            @mouseover="move"
            :draggable="draggable"
            @dragstart="menuItemDrag(x, i)"
            @dragover="menuItemOver"
            @drop="menuItemDrop($event,i,t.body,t.clientType,t.position)"
            @dragend="menuItemDragEnd"
          >
            <div class="imgbox">
              <Img
                @mouseover.stop="hand"
                :draggable="false"
                style="border-radius:10px;cursor:default"
                :src="host+item.imgShow" v-show="show" @load="imgLoad"
              />
            </div>
            <footer>
              <div class="pl10 left fl w20" @mouseover.stop="hand">
                <i-switch class="ml5" size="large" :value="item.status=='no'?false:true" @on-change="changeState(x,i,item.status)" >
                  <span slot="open"></span>
                  <span slot="close"></span>
                </i-switch>
              </div>
              <div class="right fr w50" >
                <Upload
                  :headers="uploadForm.headers"
                  :action="uploadForm.action"
                  :data="uploadForm.data"
                  :name="uploadForm.name"
                  :on-success="uploadSuccess"
                  :format="['jpg','jpeg','png','gif']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                >
                  <span @click="editBanner(t.clientType,x,i)" @mouseover.stop="hand" class="cs">编辑</span>
                </Upload>
                <span @click="delLunbo(x,i)" @mouseover.stop="hand" class="cs">删除</span>
              </div>
            </footer>
          </div>
        <!-- 新增图片 -->
        <Upload
            style="cursor:default"
            class="addBanner ib fl banner mb20 w320x txt-a" v-if="t.body.length<5"
            :headers="uploadForm.headers"
            :action="uploadForm.action"
            :data="uploadForm.data"
            :name="uploadForm.name"
            multiple
            :on-success="uploadSuccess"
            :format="['jpg','jpeg','png','gif']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
        >
            <div class="upLoad txt-a">
              <div class="addImg"  @click="addLunbo(x,t.clientType,t.position)">
                <Icons type="tianjialunbotuanniu" color='#adadad' size="36"></Icons>
              </div>
              <p class="size">{{t.logo_size.replace('x',' * ')}}</p>
            </div>
        </Upload>
      </div>
    </div>
    <!-- 查看轮播弹窗 -->
    <!-- <Modals
      ref="lookLunbo"
      :title="this.clientType=='pc'?'查看PC端logo':this.clientType=='pc_lottery'?'查看PC端彩票logo':this.clientType=='register_logo'?'查看MB端注册页logo':'查看MB端logo'"
      width="1600"
      height="630"
    >
      <div slot="content" class="mb30">
        <div class="lbList">
          <span class="toLeft cs" @click="toLeft"><Icon size="26" color="#b3b3b3" type="ios-arrow-back"></Icon></span>
          <div class="odiv">
            <p v-for='(item,i) in lookLunboList' :class="imgIndex == i?'active op':'op'" :key="'lunbo' + i" >
              <Img :src="host+item.imgShow" />
            </p>
          </div>
          <span class="toRight cs" @click="toRight"><Icon size="26" color="#b3b3b3" type="ios-arrow-forward"></Icon></span>
          <ul>
            <li v-for="(item,i) in lookLunboList" @click="setIndex(i)" :class="imgIndex==i?'actived cs':'cs'" :key="'look' + i"></li>
          </ul>
        </div>
      </div>
    </Modals> -->
  </div>
</template>
<script>
import Icons from "_c/icons";
import draggable from "vuedraggable";
import Modals from "@/components/modals";
import {
  logoList,
  addLogoHandler,
  activityImgConfigList
} from "@/api/system";
import { getUserType, getToken } from "@/libs/util";
export default {
  name: "logo",
  components: {
    Icons,
    Modals,
    draggable
  },
  data() {
    return {
      maxCount:'',
      imgCount: 0,
      show:false,
      draggable:'',
      flag:false,
      lunboIndex:'0',
      screen:screen.width,
      pc_size:'0',
      mb_size:'0',
      lottery_logo_size: "0",
      registered_logo_size:'0',
      imgIndex:0,
      lookLunboList:[],
      editType: 0,//编辑类型
      editIndex: "",
      dataList: [],//图片数据
      host: "",
      isEdit: false,
      clientType: "",
      promotionId: "",
      visible: false,
      adminType: getUserType(),
      addImgList: [], //新增图片
      editImgList: [], //编辑图片
      authInPage: JSON.parse(localStorage.authInPage),
      uploadForm: {
        headers: { Authorization: getToken() },
        action: "/api/v2/uploadImg",
        data: { siteId: this.$root.nowSite.id },
        name: "img",
        defaultList: [],
        path: "",
        src: ""
      },
    };
  },
  watch: {
    "$root.nowSite.id": function(val, oldval) {
      this.getData();
    }
  },
  created() {
    this.host=location.origin;
    //获取轮播尺寸
    this.$nextTick(() => {
      const data = { siteId: this.$root.nowSite.id };
      activityImgConfigList(data,true).then(res=>{
        if(res.code==200){
          res.data.map(item=>{
            if(item.client_type=='pc'){            
              this.pc_size=item.logo_size
              this.lottery_logo_size=item.lottery_logo_size;
            };
            if(item.client_type=='mobile'){             
              this.mb_size=item.logo_size            
              this.registered_logo_size=item.registered_logo_size;
            }
          })
        }
        this.getData();
      })
    });
    this.$Message.config({
      top: 50,
      duration: 1
    });
  },
  methods: {
    closeModal() {
      this.imgCount = 0
    },
    imgLoad(){
      let _this= this;
      _this.show=true
    },
    move(){
    this.draggable=true;
    },
    hand(){
      console.log(11)
      this.draggable=false;
    },
    setIndex(i){
      this.imgIndex = i;
    },
    toLeft(){
      this.imgIndex-- ;
      if(this.imgIndex<0){
        this.imgIndex=this.lookLunboList.length-1;
      }
    },
    toRight(){
      this.imgIndex++
      if(this.imgIndex>this.lookLunboList.length-1){
        this.imgIndex=0
      }
    },
    //查看轮播图片
    viewImg(val,x,i){
      this.$nextTick(()=>{
        this.lookLunboList = val;
        this.setClientType(x)
        this.imgIndex = i
        this.$refs.lookLunbo.show();
      })
      this.flag=true;
    },
    //关闭轮播图
    changeflag(){
      this.flag =false
    },
    //新增轮播图
    addLunbo(x, clientType,position) {
      this.imgCount = 0;
      this.editType = x;
      this.isEdit = false;
      this.setClientType(x)
      this.addImgList = [];
    },
    //设置cliengtType
    setClientType(x){
      this.clientType = this.dataList[x].position=='lottery_logo'?'pc_lottery'
        :this.dataList[x].position=='register_logo'?'register_logo'
        :this.dataList[x].clientType=='pc'?'PC':'MB';
    },
    //数据修改
    changeDate(body,success,error){
      let arr = JSON.parse(body)
      arr.map(item=>{
        if(item.imgShow) delete item.imgShow
      })
      let data = {
        siteId : this.$root.nowSite.id,
        body : JSON.stringify(arr),
        clientType : this.clientType=='MB'||this.clientType=='register_logo'?'mobile':'pc',
        position : this.clientType=='pc_lottery'?'lottery_logo':this.clientType=='register_logo'?'register_logo':'logo'
      };
      addLogoHandler(data,true).then(res => {
        if (res.code == 200) {
          this.imgCount =0;
          this.dataList = [];
          this.$Message.success(success);
            this.getData();
        }else{
          this.$Message.error(error);
        }
      });
      this.isEdit = false;
    },
    //状态切换
    changeState(x,i,status){
      this.setClientType(x)
      let newStatus = status=='yes'?'no':'yes';
      this.dataList[x].body[i].status = newStatus
      let success = newStatus=='no'?'停用状态成功':'启用状态成功';
      let error = '修改状态失败';
      let flag = false
      this.dataList[x].body.map(item=>{
        if(item.status=='yes'&&newStatus=='yes'&&item!=this.dataList[x].body[i]){
          flag = true;
          this.$Tip.confirm({
            content: "有且只能有一个为启用状态，确认替换当前启用Logo吗?",
            onOk: () => {
              item.status = 'no';
              let body = JSON.stringify(this.dataList[x].body)
              this.changeDate(body,success,error)
            },
            onCancel:() =>{
              this.dataList[x].body[i].status = 'no'
            }
          });
        }
      })
      if(!flag){
        let body = JSON.stringify(this.dataList[x].body)
        this.changeDate(body,success,error)
      }
    },
    //新增提交
    submit() {
      if (!this.isEdit) {
      } else {
        let newBody = this.dataList[this.editType].body;
        newBody[this.editIndex] = this.editImgList[0];
        let body = JSON.stringify(newBody);
        let success = "编辑Logo成功";
        let error = "编辑Logo失败";
        this.changeDate(body,success,error)
      }
    },
    //点击编辑
    editBanner(type, x, i) {
      this.isEdit = true;
      this.setClientType(x)
      this.editIndex = i;
      this.editType = x;
    },
    //载入页面获取数据
    getData() {
      this.dataList = [];
      const data = { siteId: this.$root.nowSite.id ,position:'logo', type_size:'logo_size'};
      let type=[];
      logoList(data).then(res => {
          if (res != undefined && res.code == 200) {
            res.data.map(item=>{
              if(item.clientType=='pc'&&item.position!='lottery_logo'){
                item.sort = 0
                this.dataList.push(item);
                type.push("pc");
              };
              if(item.clientType=='pc'&&item.position=='lottery_logo'){
                item.sort = 1;
                this.dataList.push(item);
                type.push("pc_lottery");
              };
              if(item.clientType=='mobile'&&item.position!='register_logo'){
                item.sort = 2;
                this.dataList.push(item);
                type.push("mobile")
              };
              if(item.clientType=='mobile'&&item.position=='register_logo'){
                item.sort = 3;
                this.dataList.push(item);
                type.push("register_logo")
              }
            })
          }
          if(!type.includes('pc')){
            let pc_obj={
              bodyFormatType:JSON,
              body: [],
              clientType:"pc",
              position: "logo",
              publish_at:"0",
              siteId:this.$root.nowSite.id,
              logo_size:this.pc_size,
              sort:0,
              promotionId:'',
              status:"yes",
              title:"",
            }
            this.dataList.unshift(pc_obj)
          };
          if(!type.includes('pc_lottery')){
            let pc_lottery={
              bodyFormatType:JSON,
              body: [],
              clientType:"pc",
              position: "lottery_logo",
              publish_at:"0",
              siteId:this.$root.nowSite.id,
              logo_size:this.lottery_logo_size,
              sort:1,
              promotionId:'',
              status:"yes",
              title:"",
            }
            this.dataList.splice(1,0,pc_lottery)
          }
          if(!type.includes('mobile')){
            let mb_obj={
              bodyFormatType:JSON,
              body: [],
              promotionId:'',
              clientType:"mobile",
              created_at:"",
              offline_at: "",
              position: "logo",
              publish_at:0,
              siteId:this.$root.nowSite.id,
              logo_size:this.mb_size,
              sort:2,
              status:"yes",
              title:"",
            }
            this.dataList.push(mb_obj)
          };
          if(!type.includes('register_logo')){
             let register_logo={
              bodyFormatType:JSON,
              body: [],
              promotionId:'',
              clientType:"mobile",
              created_at:"",
              offline_at: "",
              position: "register_logo",
              publish_at:0,
              siteId:this.$root.nowSite.id,
              logo_size:this.registered_logo_size,
              sort:3,
              status:"yes",
              title:"",
            }
            this.dataList.push(register_logo)
          }
        this.dataList.sort(function(a,b){
            return a.sort - b.sort
        })
      })
    },
    //上传之前
    handleBeforeUpload(file) {
      if(!this.isEdit){
        this.imgCount++;
        let currentNum=this.dataList[this.editType].body.length;
        this.maxCount = 5 - currentNum;
        if (this.imgCount + currentNum>5) {
          this.$Message.error(`最多可上传${ this.maxCount }张`);
          return false
        }
      }
    },
    //上传成功
    uploadSuccess(res, type, useType) {
      this.host=res.data.host;
      if (!this.isEdit) {
        let obj = {
          status: "no",
        };
        obj.img = res.data.path;
        this.addImgList.push(obj);
        let newBody = this.addImgList.concat(this.dataList[this.editType].body);
        let body = JSON.stringify(newBody);
        let success = "新增Logo成功";
        let error = "新增Logo失败";
        if(this.imgCount<=this.maxCount){
          if(this.addImgList.length==this.imgCount){
            this.changeDate(body,success,error);
          }
        }else{
          if(this.addImgList.length==this.maxCount){
            this.changeDate(body,success,error);
          }
        }
      }else{ //编辑
        this.dataList[this.editType].body[this.editIndex].img = res.data.path;
        let body =  JSON.stringify(this.dataList[this.editType].body);
        let success = "编辑Logo成功";
        let error = "编辑Logo失败";
        this.changeDate(body,success,error);
      }
    },
    handleFormatError(file) {
      this.$Tip.info({ content: "请上传图片" });
    },
    handleMaxSize(file) {
      this.$Message.error("上传图片体积最大为2M");
    },
    //删除
    delLunbo(x, i) {
      this.setClientType(x)
      this.isEdit = true;
      this.$Tip.confirm({
        content: `您确定要删除此${this.clientType=='pc_lottery'||this.clientType=='PC'?'PC':'MB'}端${this.clientType=='pc_lottery'?'彩票':this.clientType=='register_logo'?'MB端注册页':''}Logo吗？`,
        onOk: () => {
          let arr=JSON.stringify(this.dataList[x].body);
          let newArr = JSON.parse(arr);
          newArr.splice(i, 1);
          let body = JSON.stringify(newArr)
          let success='删除Logo图成功';
          let error='删除Logo图失败'
          this.changeDate(body,success,error)
        }
      });
    },
     //拖拽排序
    // end(val,list,clientType,position){
    //   console.log(clientType,position)
    //   if(val.oldIndex==val.newIndex) return;
    //   let item = {...list[val.newIndex]};
    //   let data = {
    //     siteId: this.$root.nowSite.id,
    //     body: JSON.stringify(list),
    //     clientType: clientType,
    //     position: position
    //   };
    //   addLogoHandler(data, true).then(res => {
    //     if (res.code === 200) {        
    //       this.$Message.success('排序更新成功');
    //       this.getData();            
    //     }
    //   });
    // },
    menuItemDrag(x, i) {
      this.i = i;
      this.clientType = this.dataList[x].clientType;
    },
    menuItemDragEnd() {
      this.i = null;
    },
    menuItemOver(e) {
      if (this.i !== null) e.preventDefault();
    },
    menuItemDrop($event, newIndex,list,clientType,position) {
      if (clientType!= this.clientType||this.i==newIndex) return;
      if (this.i !== null) {
        let changeOne = list[this.i];
        list.splice(this.i, 1);
        list.splice(newIndex, 0, changeOne);     
        let data = {
          siteId: this.$root.nowSite.id,
          body: JSON.stringify(list),
          clientType: clientType,
          position: position
        };
        addLogoHandler(data, true).then(res => {
          if (res.code === 200) {
            if (this.i != newIndex) {
              this.i = null;
              this.$Message.success('排序更新成功');
                   // this.getData();
            } else {
              return false;
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
@import "../../../styles/class.less";
/deep/td.ivu-table-column-center:nth-child(2) {
  text-align: left !important;
  padding-left: 20px;
  vertical-align: middle;
}
/deep/.ivu-table-cell {
  margin-top: 3px;
  color: #444;
}
.h360 {
  height: 360px;
}
.move {
  cursor: move;
}
.v2-button {
  height: 46px;
  line-height: 46px;
  color: #939393;
  font-size: 16px;
  border:1px solid #cdcdcd;
  padding: 0 30px;
  border-radius: 25px;
}
.banner {
  width:365px;
  height: 255px;
  display: inline-block;
  vertical-align: top;
  // background: rgb(243, 243, 243);
  border:1px solid #cdcdcd;
  position: relative;
  cursor: move;
  .imgbox {
    line-height: 170PX;
    height: 170px;
    margin: 15px 15px 25px 15px;
    background: white;
    border-radius: 10px;
    // border: solid 1px #c5c5c5;
    overflow: hidden;
    position: relative;
    text-align: center;
    img {
      width: 100%;
      vertical-align: middle;
    }
  }
  .upLoad {
    width: 300px !important;
    height: 180px;
    margin: 20px;
    display: inline-block;
    vertical-align: top;
    position: relative;
  }
  .left {
    line-height: 36px;
    z-index: 10;
  }
  .right {
    line-height: 36px;
    text-align: right;
    z-index: 10;
    span {
      padding-right: 10px;
      color: #2d8cf0;
    }
  }
}
.addBanner {
  background-color:#f9f9f9;
}
.size {
  margin-top: 150px;
  font-size: 1.125rem /* 18/16 */;
}

.imgbox:hover .cover {
  display: block;
}

.title {
  line-height: 40px;
  height: 40px;
  color: #939393 !important;
}

.addImg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 78px;
  border-radius: 50%;
  border: solid 1px #cccccc;
  color:#adadad;
}

.box:hover .cover {
  display: block;
}
// .cover {
//   height: 100%;
//   width: 100%;
//   position: absolute;
//   display: none;
//   text-align: center;
//   line-height: 180px;
//   background: rgba(0, 0, 0, 0.6);
//   i {
//     color: white;
//   }
// }
/deep/.ivu-upload {
  display: inline-block;
}
/deep/ .ivu-upload-list {
  display: none;
}
/deep/.ivu-form-item {
  margin-bottom: 10px;
  margin-top: 20px;
}
//lunbo样式
.lbList {
  width: 100%;
  height: 540px;
  position: relative;
  span {
    position: absolute;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border:1px solid #cdcdcd;
    line-height: 40px;
    text-align: center
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
  .odiv{
    height: 100%;
    // white-space: nowrap;
    .op {
      transition: .8s;
      position: absolute;
      // display: inline-block;
      height: 100%;
      width: 100%;
      text-align: center;
      line-height: 540px;
      opacity: 0;
      img{
        height: 360px;
        vertical-align: middle;
      }
    }
    .active {
      opacity: 1;
    }
  }
  ul{
    position: absolute;
    bottom: -20px;
    text-align: center;
    width: 100%;
    z-index: 100;
    li{
      width: 20px;
      height: 20px;
      margin:0 15px;
      display: inline-block;
      border-radius: 50%;
      border:1px solid #707070;
    }
    .actived {
      background:#707070;
    }
  }
}

.lh50 {
  line-height: 50px;
  float: right;
  margin-right: 10px;
}
</style>

