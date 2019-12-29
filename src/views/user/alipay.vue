<template>
  <div id="page-user-email" class="navbar-fix">
    <navbar title="支付宝账号"></navbar>

    <van-cell-group style="margin-top: 10px;">
      <van-field placeholder="请输入微信账号" v-model="value" clearable />
    </van-cell-group>

    <div class="button-area">
      <van-button type="primary" @click="submit" block>保存</van-button>
    </div>
  </div>
</template>

<script>
import { USER_UPDATE_URL } from '../../api'

export default {
  name: 'userAlipay',
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo
    }
  },
  data () {
    return {
      value: ''
    }
  },
  created () {
    this.value = this.userInfo.alipayInfo
  },
  methods: {
    submit () {
      let alipayInfo = this.value
      if (!alipayInfo) {
        this.$toast('请输入正确的支付宝账号')
        return false
      }
      if (alipayInfo === this.userInfo.alipayInfo) {
        this.$toast('支付宝账号未做更改')
        return false
      }
      this.$post(USER_UPDATE_URL, {
        alipayInfo: alipayInfo
      }).then((res) => {
        this.$store.commit('updateUserInfo', {
          alipayInfo: alipayInfo
        })
        this.$toast({
          icon: 'success',
          message: '修改成功',
          forbidClick: true,
          duration: 2000
        })
        setTimeout(() => {
          this.$router.replace({ name: 'userSafety' })
        }, 2000)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
