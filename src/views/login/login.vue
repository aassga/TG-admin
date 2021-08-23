<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="bg2">
      <div class="bg3"></div>
      <div class="bg4"></div>
      <div class="login-con">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions, mapMutations } from "vuex";
import { getNavigateBar } from "@/api/common";
export default {
  components: {
    LoginForm,
  },
  methods: {
    ...mapActions(["handleLogin", "getNewRoute"]),
    ...mapMutations(['setActiveMenu']),
    handleSubmit({ userName, password, token }) {
      this.handleLogin({ userName, password, token }).then(res => {
        if (res == "success") {
          this.$Spin.show({
            render: h => {
              return <span class="ft20">数据初始化中...</span>;
            }
          });
          this.setActiveMenu('member')
          this.getNewRoute(this);
        }
      });
    }
  }
};
</script>

<style>
</style>
