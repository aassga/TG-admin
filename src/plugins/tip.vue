<template>
  <div class="my-tip">
    <Modal v-model="show" :width="addSub.show?'700':'550'" :mask-closable="false" :style="{display: delay}" @on-visible-change='visibleChange'>
      <div class="header" :class="{'error':type==='error'}" slot="header">{{title}}</div>
      <Icons slot="close" type="guanbi" color="white" class="lh50" :size="24"></Icons>
      <div class="content" :style="{height:addSub.show?'230px':'190px'}">
        <div class="txt flex-row" style="padding:0 10px">
          <Icons v-if="type==='info'" type="danchuangtishi" color="#57A3F3" :size="26"></Icons>
          <Icons v-else-if="type==='success'" type="chenggongtishi" color="#57A3F3" :size="26" class="ib ml20"></Icons>
          <Icons v-else-if="type==='error'"  type="danchuangguanbi" color="#ed4014" :size="26"></Icons>
          <Icons
            v-else-if="type==='confirm'"
            type="danchuangtishi"
            color="#57A3F3"
            :size="26"
            class="pl10"
          ></Icons>
          <div class="font" v-if="!addSub.show">{{content}}</div>

          <div class="font" v-if="addSub.mount">
               <p class="mt65" v-if="addSub.mount">
              {{addSub.mount}}个会员余额不足
            </p>
            <Input type="textarea"  :rows="4" class="mt10" :readonly="true" :value="addSub.mDetail" v-if="addSub.mount"/>
          </div>

          <div v-if="addSub.account" style="width:400px" class="ml5">
              <p  v-if="addSub.account" :class="!addSub.mount?'mt70':'' " >
              以下有<span class="red-font ib ">{{addSub.account}}个</span>账户不存在
            </p>
            <Input type="textarea" :rows="4"  class="mt10" :readonly="true" :value="addSub.aDetail" v-if="addSub.account"/>
          </div>


          <div v-if="addSub.blacklist" class="ml20" style="width:400px">
              <p v-if="addSub.blacklist" :class="!addSub.blacklist?'mt70 ':'mt70'" >
              以下有<span class="red-font ib">{{addSub.blacklist}}个</span>会员加入黑名单，不可加款活动优惠
           </p>
            <Input type="textarea" :rows="4"  class="mt10" :readonly="true" :value="addSub.bDetail" v-if="addSub.blacklist"/>
          </div>
          <div v-if="addSub.bonus" class="ml20" style="width:400px">
              <p v-if="addSub.bonus" :class="!addSub.bonus?'mt70 ':'mt70'" >
              以下有<span class="red-font ib">{{addSub.bonus}}个</span>会员加入黑名单，不可添加红包
           </p>
            <Input type="textarea" :rows="4"  class="mt10" :readonly="true" :value="addSub.bonusDetail" v-if="addSub.bonus"/>
          </div>


           <div v-if="addSub.errorusercount" class="ml20" style="width:400px">
              <p v-if="addSub.errorusercount" :class="!addSub.blacklist?'mt70 ':'mt70'" >
              <p v-if="addSub.okusercount>0">{{addSub.okusercount}}个会员添加成功</p>
              以下有<span class="red-font ib">{{addSub.errorusercount}}个</span>账户不存在
           </p>
            <Input type="textarea" :rows="4"  class="mt10" :readonly="true" :value="addSub.erroruserDetial" v-if="addSub.errorusercount"/>
          </div>

       
          <!-- 1黑名单添加重复提示 -->
          <div v-if="addSub.userNameCount" class="ml20" style="width:400px">
            <p v-if="addSub.userNameCount" class="mt70">
              以下有<span class="red-font ib">{{addSub.userNameCount}}个</span>
              会员已存在【{{addSub.activetyName}}】黑名单中,不可重复添加
            </p>
            <Input type="textarea" :rows="4"  class="mt10" :readonly="true" :value="addSub.userNameContent"
             v-if="addSub.userNameContent"/>
          </div>
           <!-- 2要添加账户在白名单不可添加 -->
          <div v-if="addSub.whiteCount" class="ml20" style="width:400px">
            <p v-if="addSub.whiteCount" class="mt70">
            以下有<span class="red-font ib">{{addSub.whiteCount}}个</span>
            账户在活动白名单,不可添加到黑名单
            </p>
            <Input type="textarea" :rows="4"  class="mt10" :readonly="true" 
            :value="addSub.whiteListContent" v-if="addSub.whiteListContent"/>
          </div>
           <!-- 3 不存在的账户 -->
          <div v-if="addSub.noBlackCount" style="width:400px" class="ml5">
            <p  v-if="addSub.noBlackCount" class="mt70" >
            以下有<span class="red-font ib ">{{addSub.noBlackCount}}个</span>账户不存在
            </p>
            <Input type="textarea" :rows="4"  class="mt10" :readonly="true"
             :value="addSub.noBlackContent" v-if="addSub.noBlackContent"/>
          </div>

           <!-- 1白名单添加重复提示 -->
           <div v-if="addSub.userNameCountB" class="ml20" style="width:400px">
            <p v-if="addSub.userNameCountB" class="mt70">
              以下有<span class="red-font ib">{{addSub.userNameCountB}}个</span>
              会员已存在【{{addSub.activetyNameB}}】白名单中,不可重复添加
            </p>
            <Input type="textarea" :rows="4"  class="mt10" :readonly="true" :value="addSub.userNameContentB"
             v-if="addSub.userNameContentB"/>
           </div>

            
          <!-- 2要添加账户在黑名单不可添加 -->
          <div v-if="addSub.blackCount" class="ml20" style="width:400px">
            <p v-if="addSub.blackCount" class="mt70" >
            以下有<span class="red-font ib">{{addSub.blackCount}}个</span>
            账户在活动黑名单,不可添加到白名单
            </p>
            <Input type="textarea" :rows="4"  class="mt10" :readonly="true" 
            :value="addSub.blackContent" v-if="addSub.blackContent"/>
          </div>

           <!-- 3 不存在的账户 -->
          <div v-if="addSub.noWhiteCount" style="width:400px" class="ml5">
            <p  v-if="addSub.noWhiteCount" class="mt70" >
            以下有<span class="red-font ib ">{{addSub.noWhiteCount}}个</span>账户不存在
            </p>
            <Input type="textarea" :rows="4"  class="mt10" :readonly="true" 
            :value="addSub.noWhiteListContent" v-if="addSub.noWhiteListContent"/>
          </div>

        </div>

        <div class="btns flex-row" v-if="!addSub.show">
          <Button v-if="type==='confirm'" class="cancel  fontColor " @click="onCancel1">取消</Button>
          <Button v-if="type==='error'" type="error"  @click="onConfirm">确定</Button>
          <Button v-else type="primary"  @click="onConfirm">确定</Button>
        </div>
        <div class="btns flex-row mt65" v-else>
          <Button type="primary" @click="remove">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import Icons from "_c/icons/icons";
export default {
  components: { Icons },
  data() {
    return {
      show: false,
      title: "",
      content: "",
      type: "",
      delay: "none",
      addSub: {
        show: false
      },
      showAccount:false,
      count: 0
    };
  },
  watch: {
    show (val) {
      if (val === true) {
        this.count = 0
        setTimeout(() => this.delay = "block", 500)
      } else {
        this.delay = "none"
      }
    }
  },
  mounted() {
  },
  methods: {
    onConfirm() {
      this.show = false;
      if (this.onOk) {
        this.count++
        this.onOk();
      }
    },
    onCancel1() {
      this.show = false
      if (this.onCancel) {
        this.count++
        this.onCancel()
      }
    },
    remove() {
      this.show = false
    },
    visibleChange(flag) {
      if (!flag && this.count == 0) {
        this.onCancel1()
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../styles/color.less";
@errorColor: #ed4014;
/deep/.ivu-modal-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
    margin: 0;
  }
}
// .mt10 {
//   /deep/textarea.ivu-input {
//     height: 55px;
//     max-height: 55px;
//   }
// }
/deep/.ivu-modal-content {
  overflow: hidden;
  color: #444;
  .ivu-modal-body {
    padding: 0;
  }
  .ivu-modal-header {
    padding: 0;
    .header {
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 23px;
      color: #fff;
      background: @btnColor;
    }
    .header.error {
      background: @errorColor;
    }
  }
  .ivu-modal-close {
    top: 0;
  }
  .content {
    height: 190px;
    .txt {
      justify-content: center;
      height: 107px;
      .font {
        font-size: 20px;
        margin-left: 10px;
        color: #444;
        word-break: break-all;
        //margin-top: 10px;
      }
    }
    .btns {
      padding-bottom: 33px;
      justify-content: center;
      .ivu-btn {
        width: 120px;
        height: 50px;
        font-size: 20px;
        // border: none;
      }
      .cancel {
        margin-right: 40px;
      }
    }
  }
  .ivu-modal-footer {
    display: none;
  }
}
.txt,
.font,
.flex-row,
.font {
  padding-top: 0 !important;
}
.lh50 {
  line-height: 50px;
}
	// 备注栏最大拉伸高度设置
	/deep/textarea.ivu-input {
		max-height: 100px;
	}

</style>

