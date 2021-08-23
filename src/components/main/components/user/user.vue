<template>
  <div>
    <div class="ava">
      <div class="parent cs">
        <Dropdown>
          <Avatar icon="md-person"></Avatar>
          <DropdownMenu slot="list">

      <div class="mod">
      <!-- <div class="mod" :style="{display: showMode ? 'block' : 'none'}"> -->
        <div class="clearfix" style="height: 72px;">
          <div class="fl w30"  style="height: 72px;">
            <Avatar icon="md-person" class="ml50"></Avatar>
          </div>
          <div class="fl w50 ml20 mt15">
            <p class="blue-font ft20" style="lineHeight: 36px;">{{username}}</p>
            <p style="lineHeight:36px;" class="cdColor">别称：{{userInfo.type == 'super' ? '超级管理员' : this.$root.text(userInfo.otherName)}}</p>
          </div>
        </div>
        <div class="bottom clearfix">
          <Button class="ml20 fl fontColor " @click="handleClick('password')">变更密码</Button>
          <Button class="mr20 fr fontColor " @click="handleClick('logout')">安全退出</Button>
        </div>
      </div>
          </DropdownMenu>
        </Dropdown>
      <!-- <div @click="showMode = !showMode" class="parent cs"> -->
      </div>
    </div>
    <!-- <div class="user-avatar-dropdown"> -->
    <!-- <Dropdown @on-click="handleClick"> -->
    <!-- <Avatar icon='md-person'/> -->
    <!-- <span class="cs ml10 ft18 mr5" style="font-size:18px">{{username}}</span> -->
    <!-- <Icon type="ios-arrow-down" size="22"></Icon> -->
    <!-- <DropdownMenu slot="">
    <div style="width: 100px;height: 100px;backgroundColor: red;"></div>-->
    <!-- <DropdownItem name="password">变更密码</DropdownItem> -->
    <!-- <DropdownItem name="userInfo">个人信息</DropdownItem> -->
    <!-- <DropdownItem name="logout">安全退出</DropdownItem> -->
    <!-- </DropdownMenu>
    </Dropdown>-->
    <Modals title="修改密码" ref="changePwd" :width="664">
      <div slot="content">
           <div class="passBox" v-if=" (adminType == 'super')||(authInPage.indexOf('adResetPassword') != -1 )"    >
          <span v-for="(item,i) in   itemList"  @click.prevent="changeBtn(item)" :class="activeName==item?'activeClass':''" :key='i'>{{item}}</span>
        </div>
         <div class="passBox" v-else  >
          <span v-for="(item,i) in advList"  @click.prevent="changeBtn(item)"  :key='i'>{{item}}</span>
        </div>
        <div  class="h50  iconPassWord"  v-if="userInfo.type == 'super'&&activeName=='登录密码'"  :class="activeName=='登录密码'?'f6Color':''" >
        
             <Icons type="danchuangtishi" size="20" class="ib ml20 mt8" style="color: #b3b3b3"/>
          <span class="ft14 ib ml10">密码变更后,请重新登录</span>
        </div>
      
        <Form ref="userinfo" :label-width="140" class="mt20" :model="userinfo" :rules="rules">
          <FormItem label="管理员">
            <Input v-model="username" disabled class="w379x"/>
          </FormItem>
           <FormItem label="原密码" prop="password">
            <Input v-model="userinfo.password" class="w379x" maxlength="20" placeholder="请输入您的原密码" />
          </FormItem>
         
          <FormItem label="新密码" prop="new_password">
            <Input v-model="userinfo.new_password" class="w379x" maxlength="20" placeholder="请输入您的新密码"/>
          </FormItem>
          <FormItem label="确认密码" prop="new_password_confirmation">
            <Input
              v-model="userinfo.new_password_confirmation"
              class="w379x"
              placeholder="请确认您的新密码"
            />
          </FormItem>
          <FormItem>
            <Button type="primary" class="ivu  commonSubmit w120x ml120" @click="submit">确认保存</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>

<script>
import Icons from "@/components/icons";
import userAvatar from "@/assets/images/userAvatar.jpg";
import { mapActions } from "vuex";
import { adminResetPassword ,adResetPassword} from "@/api/user";
import { getUserType } from "@/libs/util"
import Modals from "@/components/modals";
import "./user.less";
export default {
  name: "User",
  components: { Icons, Modals },
  data() {

       const validatorPassword=(rule,val,cb)=>{
        if(!val||val==''||val==undefined){
          cb('请输入您的原密码');
      }else{
        // let reg=/^\w{8,20}$/;
       let reg= /^[0-9a-zA-Z_-]{8,20}$/;
        if(!reg.test(val)){ //未通过
          if(val.length<8||val.length>20){ 
            cb('请输入长度为8~20位字符的密码');
              return;
          }else{ 
              cb('必须为字母，数字，中划线或下划线字符构成');
                return;
          }
        }else{
          cb();
        }
      }
      
    }

    const validatorNewpassword=(rule,val,cb)=>{

       if(!val||val==''||val==undefined){
          cb('请输入您的新密码');
      }else{
        // let reg=/^\w{8,20}$/;
       let reg= /^[0-9a-zA-Z_-]{8,20}$/;
        if(!reg.test(val)){ //未通过
          if(val.length<8||val.length>20){ 
            cb('请输入长度为8~20位字符的密码');
              return;
          }else{
         
              cb('必须为字母，数字，中划线或下划线字符构成');
                return;
          }
        }else{
          cb();
        }
      }
    }

    
    return {
      
        adminType: getUserType(),
        authInPage: JSON.parse(localStorage.authInPage),
      activeName:'登录密码',
      itemList:['登录密码','广告报表密码','代理报表密码'],
      advList:['登录密码'],
      showMode: false,
      userAvatar: userAvatar,
      userInfo: JSON.parse(localStorage.userInfo),
      username: JSON.parse(localStorage.userInfo).userName,
      userinfo: {
        siteId:this.$root.nowSite.id,
        password: '',
        new_password: "",
        new_password_confirmation: ""
      },
      rules: {
        password: [
          {
            required: true,
            validator:validatorPassword,
            trigger: 'blur'
          }
        ],
        new_password: [
          {
            required: true,
            validator:validatorNewpassword,
            trigger: "blur"
          }
        ],
        new_password_confirmation: [
          {
            required: true,
            message: "请确认您的新密码",
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    ...mapActions(["handleLogOut"]),
    logout() {
      this.handleLogOut().then(() => {
        // this.$router.push({
        //   name: "login"
        // });
      });
    },
    changeBtn(item){
      if(item=='广告报表密码'){
         this.activeName='广告报表密码'
      }else if(item=='代理报表密码'){
          this.activeName='代理报表密码'
      }
      else{
         this.activeName='登录密码'
      }
    },
    handleClick(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        // case 'message':
        //   this.message()
        //   break
        case "password":
          this.activeName='登录密码';
          this.userinfo={};
        
          this.$refs.changePwd.show();
         
          break;
      }
    },
    submit() {
      this.$refs.userinfo.validate(valid => {
        if (valid) {
        this.$refs.changePwd.spinShow();
        if(this.activeName=='登录密码'){

          adminResetPassword(this.userinfo)
            .then(res => {
              if (res != undefined && res.code === 200) {
                this.$refs.changePwd.spinHide();
                this.$refs.changePwd.hide();
                this.$router.push({ name: "login" });
              } else this.$refs.changePwd.spinHide();
            })
            .catch(error => {
              this.$refs.changePwd.spinHide();
            });
        }
      
       
        if(this.activeName=='广告报表密码'||this.activeName=='代理报表密码'){
           let newId=JSON.parse(localStorage.nowSite);
           this.userinfo.siteId=newId.id;
           if(this.activeName=='代理报表密码'){this.userinfo.type='pwd_agency_report';}
                 if(this.activeName=='广告报表密码'){this.userinfo.type='password_ad';}
           adResetPassword(this.userinfo)
            .then(res => {
              if (res != undefined && res.code === 200) {
                this.$refs.changePwd.spinHide();
                this.$refs.changePwd.hide();
                this.$router.push({ name: "login" });
              } else this.$refs.changePwd.spinHide();
            })
            .catch(error => {
              this.$refs.changePwd.spinHide();
            });

        }

        }
      });
    },
   
  }
};
</script>
<style lang="less" scoped>
@import "../../../../styles/button.less";
/deep/.ivu-form-item-error-tip{
   width:400px!important;
}
.parent {
  /deep/.ivu-avatar {
    display: inline-block !important;
    width: 35px !important;
    height: 35px !important;
    border-radius: 50% !important;
    background: #efefef;
    /deep/.ivu-icon-md-person {
      color: #9b9b9b;
      font-size: 1.5rem /* 24/16 */;
      top: -1px !important;
    }
  }
}
.mod {
  // height: 172px;
  // display: none;
  /deep/.ivu-avatar {
    border: 1px solid #ACACAC;
    display: inline-block !important;
    width: 45px !important;
    height: 45px !important;
    border-radius: 50% !important;
    margin-top: 30px!important;
    /deep/.ivu-icon-md-person {
      color: #9b9b9b;
      font-size: 1.625rem /* 26/16 */;
      top: 3px !important;
    }
  }
}
.ava:hover .mod{
  // display: block;
}
.bottom {
  margin-bottom: 20px;
  button{
    width: 110px;height: 36px;vertical-align: middle;margin-top: 30px;
  }
}
.passBox{
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  padding-left: 50px;
  margin-bottom:10px;
  span{
  
    width: 120px;
    display: inline-block;
    text-align: center;
  
    border:1px #ccc solid;
  }
  span:nth-child(2){
    border-left: 0;
  }
}
.iconPassWord{
  display: flex;
    justify-content: center;
    align-items: center;
    i{
          margin: 0;
    vertical-align: middle;
    }
}
.activeClass {
  background-color: #2d8cf0;
  color: #fff;
}
</style>

