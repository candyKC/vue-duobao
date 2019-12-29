<template>
  <div id="page-account">
    <navbar bg-color="transparent" :border="false" :white-color="true"></navbar>
    <div class="account-box" :style="{height: screenHeight + 'px'}">
      <div class="account-inner">
        <div class="logo">
          <span><img src="../../assets/images/logo.png" alt=""></span>
          多宝置权
        </div>

        <van-button :to="{name: 'accountLogin'}" type="default" round block style="background-color: #fff;border-color: #fff;color: #D63C3C;font-size: 18px;">登陆</van-button>
        <br>
        <van-button :to="{name: 'accountRegister'}" type="primary" round block style="background-color: #651414;border-color: #651414;font-size: 18px;">注册</van-button>
        <div class="tips">
          登录或注册代表您已阅读并同意
          <br>
          <router-link :to="{name: 'thread'}">《多宝平台服务协议》</router-link>和<router-link :to="{name: 'thread'}">《用户隐私政策》</router-link><router-link :to="{name: 'thread'}">《法律政策》</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'account',
  data () {
    return {
      screenHeight: document.body.clientHeight
    }
  },
  mounted () {
    window.onresize = () => {
      this.screenHeight = document.body.clientHeight
    }
  }
}
</script>

<style scoped lang="less">
  .account-box {display: table;width: 100%;background-color: #D63C3C;color: #fff;}
  .account-inner {display: table-cell;vertical-align: middle;padding: 40px;}
  .account-box .logo {text-align: center;font-size: 20px;padding-bottom: 60px;}
  .account-box .logo span {display: block;width: 66px;height: 66px;background-color: #fff;border-radius: 50%;overflow: hidden;margin: 0 auto 10px;}
  .account-box .logo span img {display: block;width: 100%;height: 100%;}
  .account-box .tips {text-align: center;font-size: 12px;margin: 40px -20px 0;line-height: 2;}
  .account-box .tips a {color: #fff;}
</style>
