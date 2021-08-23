<template>
  <div>
    <div class="today-chats">
      <h3>
        <Icon type="ios-podium-outline"></Icon>
        <span class="ml10">今日营运状况</span>
      </h3>
      <div>
        <TodayChats ref="TodayChats" :chats-data="todayChatsData"></TodayChats>
      </div>
    </div>
    <div class="seven-days-chats mt20">
      <h3>
        <Icon type="ios-trending-up"></Icon>
        <span class="ml10">最近七日营运状况</span>
      </h3>
      <div>
        <SevenDaysChats ref="SevenDaysChats" :chats-data="sevenDaysChatsData"></SevenDaysChats>
      </div>
    </div>
    <div class="summary-chats mt20">
      <h3>
        <Icon type="ios-paper-outline"></Icon>
        <span class="ml10">报表汇总</span>
      </h3>
    </div>
  </div>
</template>
<script>
import TodayChats from "./components/today-chats";
import SevenDaysChats from "./components/seven-days-chats";
// import { getTodayReport, getSevenDaysReport } from "@/api/home";
export default {
  components: {
    TodayChats,
    SevenDaysChats
  },
  data() {
    return {
      todayChatsData: null,
      sevenDaysChatsData: null
    };
  },
  created() {
    // getTodayReport().then(res => {
    //   this.todayChatsData = res.data;
    //   this.$refs.TodayChats.init();
    // });
    // getSevenDaysReport().then(res => {
    //   this.sevenDaysChatsData = res.data;
    //   this.$refs.SevenDaysChats.init();
    // });
  }
};
</script>

