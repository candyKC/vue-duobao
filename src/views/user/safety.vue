<template>
    <div id="page-user-safety" class="navbar-fix">
      <navbar title="账户与安全"></navbar>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="实名认证" :value="userInfo.isReal ? '已认证' : '未认证'" is-link :to="{name: 'userCertification'}" />
        <van-cell title="支付密码" is-link :to="{name: 'userPaypass'}" />
      </van-cell-group>
      <van-cell-group style="margin-top: 10px;">
        <van-cell title="充值" :value="'￥' + userInfo.balance" is-link :to="{name: 'userRecharge'}" />
        <van-cell title="支付宝账号" :value="userInfo.alipayInfo" is-link :to="{name: 'userAlipay'}" />
        <van-cell title="微信账号" :value="userInfo.wechatInfo" is-link :to="{name: 'userWechat'}" />
        <van-cell title="银行卡" is-link :to="{name: 'userBankcards'}" />
      </van-cell-group>
    </div>
</template>

<script>
export default {
  name: 'userSafety',
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo
    }
  }
}
</script>

<style scoped lang="less">
</style>
