<template>
  <div id="page-user-phone" class="navbar-fix">
    <navbar title="修改手机号码"></navbar>

    <van-cell-group style="margin-top: 10px;">
      <van-field placeholder="请输入手机号码" v-model="value" type="tel" clearable />
    </van-cell-group>

    <div class="button-area">
      <van-button type="primary" @click="submit" block>保存</van-button>
    </div>
  </div>
</template>

<script>
import { USER_UPDATE_URL } from '../../api'

export default {
  name: 'userPhone',
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
    this.value = this.userInfo.phone
  },
  methods: {
    submit () {
      let phone = this.value
      if (!(/^1([3456789])\d{9}$/.test(phone))) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (phone === this.userInfo.phone) {
        this.$toast('手机号未做更改')
        return false
      }
      this.$post(USER_UPDATE_URL, {
        phone: phone
      }).then((res) => {
        this.$store.commit('updateUserInfo', {
          phone: phone
        })
        this.$toast({
          icon: 'success',
          message: '修改成功',
          forbidClick: true,
          duration: 2000
        })
        setTimeout(() => {
          this.$router.replace({ name: 'userSetting' })
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
