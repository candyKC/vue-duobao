<template>
  <div id="page-user-password" class="navbar-fix">
    <navbar title="密码"></navbar>

    <van-cell-group style="margin-top: 10px;">
      <van-field placeholder="请输入密码" v-model="value" type="password" clearable />
      <van-field placeholder="请输入新密码" v-model="value2" type="password" clearable />
      <van-field placeholder="请再次确认新密码" v-model="value3" type="password" clearable />
    </van-cell-group>

    <div class="button-area">
      <van-button type="primary" @click="submit" block>保存</van-button>
    </div>
  </div>
</template>

<script>
import { USER_PASSWORD_URL } from '../../api'

export default {
  name: 'userPassword',
  data () {
    return {
      value: '',
      value2: '',
      value3: ''
    }
  },
  methods: {
    submit () {
      if (this.value2.length < 6 || this.value.length < 6) {
        this.$toast('密码不能小于6位')
        return false
      }
      if (this.value2 !== this.value3) {
        this.$toast('两次密码不一致')
        return false
      }
      this.$post(USER_PASSWORD_URL, {
        password: this.value,
        newPassword: this.value2
      }).then((res) => {
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
