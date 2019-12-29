<template>
  <div id="page-user-nickname" class="navbar-fix">
    <navbar title="修改会员名"></navbar>

    <van-cell-group style="margin-top: 10px;">
      <van-field placeholder="请输入会员名" v-model="value" clearable />
    </van-cell-group>

    <div class="button-area">
      <van-button type="primary" @click="submit" block>保存</van-button>
    </div>
  </div>
</template>

<script>
import { USER_UPDATE_URL } from '../../api'

export default {
  name: 'userNickname',
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
    this.value = this.userInfo.username
  },
  methods: {
    submit () {
      let username = this.value
      if (!(/^[a-zA-Z0-9_-]{4,16}$/.test(username))) {
        this.$toast('用户名不符合规范：4到16位（字母，数字，下划线，减号）')
        return false
      }
      if (username === this.userInfo.username) {
        this.$toast('用户名未做更改')
        return false
      }
      this.$post(USER_UPDATE_URL, {
        username: username
      }).then((res) => {
        this.$store.commit('updateUserInfo', {
          username: username
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
