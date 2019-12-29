<template>
    <div id="page-user-setting" class="navbar-fix">
      <navbar title="设置"></navbar>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="头像" is-link center :to="{name: 'userAvatar'}">
          <van-image lazy-load fit="cover" round width="40px" height="40px" style="vertical-align: top;" :src="userInfo.avatar || require('../../assets/images/avatar@2x.png')">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </van-cell>
        <van-cell title="会员名" :value="userInfo.username" is-link :to="{name: 'userNickname'}" />
        <van-cell title="手机号" :value="userInfo.phone" is-link :to="{name: 'userPhone'}" />
        <van-cell title="邮箱" :value="userInfo.email" is-link :to="{name: 'userEmail'}" />
        <van-cell title="密码" value="修改密码" is-link :to="{name: 'userPassword'}" />
        <van-cell title="收货地址" is-link :to="{name: 'userAddress'}" />
      </van-cell-group>
      <van-cell-group style="margin-top: 10px;">
        <van-cell title="账户与安全" is-link :to="{name: 'userSafety'}" />
      </van-cell-group>

      <div class="button-area">
        <van-button type="primary" @click="show = true" block style="font-size: 18px;">退出当前账号</van-button>
      </div>

      <van-action-sheet cancel-text="取消" round safe-area-inset-bottom v-model="show" :actions="actions" @select="onSelect" />
    </div>
</template>

<script>
import { USER_LOGOUT_URL } from '../../api'

export default {
  name: 'userSetting',
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo || {}
    }
  },
  data () {
    return {
      show: false,
      actions: [
        { subname: '是否退出当前账号', className: 'action-subname' },
        { name: '确认退出', color: '#D63C3C' }
      ]
    }
  },
  methods: {
    onSelect (item) {
      this.show = false
      if (item.name === '确认退出') {
        this.$post(USER_LOGOUT_URL, {}).then((res) => {
          this.$toast({
            icon: 'success',
            message: '退出成功',
            forbidClick: true,
            duration: 2000
          })
          setTimeout(() => {
            this.$store.commit('logout')
            this.$router.replace({ name: 'index' })
          }, 2000)
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
