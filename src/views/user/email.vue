<template>
  <div id="page-user-email" class="navbar-fix">
    <navbar title="邮箱"></navbar>

    <van-cell-group style="margin-top: 10px;">
      <van-field placeholder="请输入邮箱" type="email" v-model="value" clearable />
    </van-cell-group>

    <div class="button-area">
      <van-button type="primary" @click="submit" block>保存</van-button>
    </div>
  </div>
</template>

<script>
import { USER_UPDATE_URL } from '../../api'

export default {
  name: 'userEmail',
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
    this.value = this.userInfo.email
  },
  methods: {
    submit () {
      let email = this.value
      // eslint-disable-next-line no-useless-escape
      if (!(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email))) {
        this.$toast('请输入正确的邮箱')
        return false
      }
      if (email === this.userInfo.email) {
        this.$toast('邮箱未做更改')
        return false
      }
      this.$post(USER_UPDATE_URL, {
        email: email
      }).then((res) => {
        this.$store.commit('updateUserInfo', {
          email: email
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
