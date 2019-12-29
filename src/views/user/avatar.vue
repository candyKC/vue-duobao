<template>
    <div id="page-user-avatar" class="navbar-fix">
      <navbar title="修改头像"></navbar>

      <div class="avatar">
        <van-image lazy-load fit="cover" round width="200px" height="200px" style="vertical-align: top;" :src="userInfo.avatar || require('../../assets/images/avatar@2x.png')">
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
      </div>

      <div class="button-area" style="text-align: center;">
        <van-uploader :after-read="afterRead" :before-read="beforeRead" accept="image/gif, image/jpeg, image/png" :max-size="500 * 1024">
          <van-button icon="photo" type="primary">修改头像</van-button>
        </van-uploader>
      </div>
    </div>
</template>

<script>
import { Uploader } from 'vant'
import { UPLOAD_URL, USER_UPDATE_URL } from '../../api'

export default {
  name: 'userAvatar',
  components: {
    [Uploader.name]: Uploader
  },
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo
    }
  },
  created () {
  },
  methods: {
    beforeRead (file) {
      if (file.size > 500 * 1024) {
        this.$toast('图片不能超过500KB')
        return false
      }
      return true
    },
    afterRead (file) {
      let formData = new FormData()
      formData.append('files', file.file)
      this.$post(UPLOAD_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        let avatar = res.data[0]
        this.$post(USER_UPDATE_URL, {
          avatar: avatar
        }).then((res) => {
          this.$store.commit('updateUserInfo', {
            avatar: avatar
          })
          this.$toast({
            icon: 'success',
            message: '修改成功',
            forbidClick: true,
            duration: 2000
          })
        }).catch((err) => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="less">
  .avatar {text-align: center;margin: 40px 0;}
</style>
