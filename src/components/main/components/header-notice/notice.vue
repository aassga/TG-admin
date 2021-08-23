<template>
  <div class="notice">
    <marquee class="roll-txt" width=600 onmouseover=this.stop()  onmouseout=this.start() >
      <!-- <span class="txt" @click="aa(notice)">
        {{notice}}
      </span> -->
      <span  v-if="this.newStr.length>0"  class="cs">
      <span  class="txt ml5" @click="onOpen(t.code)"  v-for="(t,i) in  newStr " :key="i">{{t.name}}{{t.count}}条</span>
      </span>
       <span class="txt cs" v-else >
        {{notice}}
      </span>
    </marquee>
  </div>
</template>

<script>

export default {
  props: ['notice','newStr'],
  methods:{
    onOpen(code){
      switch(code){
        //公司入款
        case "deposit_offline":
        this.$router.push({name:'payCompany'});
         break;
           case "deposit_usdt":
        this.$router.push({name:'virtualIncome'});
         break;
           case "jiebei":
        this.$router.push({name:'activityBorrow'});
         break;
           case "withdrawals":
        this.$router.push({name:'withdrawalsOnline'}); 
         break;
           case "withdrawals_usdt":
        this.$router.push({name:'moneyWithdrawal'});
         break;
           case "message":
        this.$router.push({name:'mail'});
         break;
           case "deposit_online":
        this.$router.push({name:'payOnline'});
         break;
           case "abnormal":
        this.$router.push({name:'memberSearch',query: { code }});
        default:;
      }

    },
  }
}
</script>

<style lang="less" scoped>
  .notice {
    position: absolute;
    right: 15%;
    width: 33%;
    padding: 0;
    .roll-txt {
      display: block;
      .txt {
        color: white;
      }
    }
  }
</style>
