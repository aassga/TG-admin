/* eslint-disable no-trailing-spaces */
/* eslint-disable space-before-function-paren */
import TipTemplate from './tip.vue'

const myModal = {}

myModal.install = function (Vue, options) {
  const Modal = Vue.extend(TipTemplate)

  const instance = new Modal()

  let ele = document.querySelector('.my-tip')

  instance.$mount(ele)

  document.body.appendChild(instance.$el)

  function setter(option) {
    const {
      title,
      content,
      onOk,
      onCancel
    } = option
    instance.addSub = { show: false }
    instance.show = true
    instance.title = title || '温馨提示'
    instance.content = content
    instance.onOk = onOk
    instance.onCancel = onCancel
  }

  Vue.prototype.$Tip = {
    success(option) {
      setter(option)
      instance.type = 'success'
    },
    info(option) {
      setter(option)
      instance.type = 'info'
    },
    error(option) {
      setter(option)
      instance.type = 'error'
      instance.title = '错误提示'
    },
    confirm(option) {
      setter(option)
      instance.type = 'confirm'
    },
    cancel(option) {
      setter(option)
      instance.type = 'cancel'
    },
    hide() {
      // instance.onConfirm()
    },
    // funds() {
    //   console.log(111111)
    // },
    showAddSub ({ show = true, mount = 0, account = 0,blacklist=0, aDetail = '', mDetail = '',bonus='',bonusDetail='',
    bDetail='',erroruserDetial='',errorusercount='',okusercount='',whiteListContent='',whiteCount='',blackContent=''
    ,blackCount='',noBlackCount='',noBlackContent='',noWhiteCount='',noWhiteListContent='',
    activetyName='',userNameContent='',userNameCount='',userNameContentB='',userNameCountB='',
    activetyNameB=''
  } = {}) {
      instance.show = true
      instance.title = '温馨提示'
      instance.type = 'info'
      instance.addSub.show = show
      instance.addSub.mount = mount
      instance.addSub.account = account
      instance.addSub.aDetail = aDetail
      instance.addSub.mDetail = mDetail
      instance.addSub.bDetail=bDetail
      instance.addSub.blacklist=blacklist
      instance.addSub.erroruserDetial=erroruserDetial
      instance.addSub.errorusercount=errorusercount
      instance.addSub.okusercount=okusercount
      instance.addSub.whiteCount=whiteCount//活动黑名单
      instance.addSub.whiteListContent=whiteListContent;
      instance.addSub.blackCount=blackCount;
      instance.addSub.blackContent=blackContent;
      instance.addSub.noBlackCount=noBlackCount;
      instance.addSub.noBlackContent=noBlackContent;
      instance.addSub.noWhiteCount=noWhiteCount;
      instance.addSub.noWhiteListContent=noWhiteListContent;
      instance.addSub.bonus=bonus;
      instance.addSub.bonusDetail=bonusDetail;
      instance.addSub.activetyName=activetyName;
      instance.addSub.userNameContent=userNameContent;
      instance.addSub.userNameCount=userNameCount;
      instance.addSub.userNameContentB=userNameContentB;
      instance.addSub.userNameCountB=userNameCountB;
      instance.addSub.activetyNameB=activetyNameB;
    }
  }
}

export default myModal
