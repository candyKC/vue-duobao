<template>
  <div id="page-remind-setting" class="navbar-fix tabbar-fix">
    <navbar title="提醒设置"></navbar>

    <div class="van-hairline--bottom remind-setting">
      <h4>提醒时间：</h4>
      <van-row>
        <van-col span="12"><van-icon size="20px" :name="require('../../assets/images/goods-icon1@2x.png')" />商品开拍时</van-col>
        <van-col span="12"><van-icon size="20px" :name="require('../../assets/images/goods-icon1@2x.png')" />结束前30分钟</van-col>
      </van-row>
    </div>

    <van-cell-group>
      <van-cell title="短信" :label="userInfo.phone || '请前往个人中心设置手机号码'">
        <van-switch v-model="telNotice" size="20px" active-color="#D63C3C" :disabled="!userInfo.phone" />
      </van-cell>
      <van-cell title="邮箱" :label="userInfo.email || '请前往个人中心设置邮箱'">
        <van-switch v-model="emailNotice" size="20px" active-color="#D63C3C" :disabled="!userInfo.email" />
      </van-cell>
      <van-cell title="站内信息">
        <van-switch v-model="messageNotice" size="20px" active-color="#D63C3C" />
      </van-cell>
    </van-cell-group>

    <van-button class="remind-setting-save-button" type="primary" square block @click="onSubmit">保存</van-button>
  </div>
</template>

<script>
import { REMIND_SETTINGINFO_URL, REMIND_SETTINGSAVE_URL } from '../../api'

export default {
  name: 'remindSetting',
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo || {}
    }
  },
  data () {
    return {
      telNotice: false,
      emailNotice: false,
      messageNotice: false
    }
  },
  created () {
    this.$post(REMIND_SETTINGINFO_URL, {}).then((res) => {
      this.id = res.data.id
      this.telNotice = res.data.telNotice
      this.emailNotice = res.data.emailNotice
      this.messageNotice = res.data.messageNotice
    })
  },
  methods: {
    onSubmit () {
      let data = {
        telNotice: this.telNotice,
        emailNotice: this.emailNotice,
        messageNotice: this.messageNotice
      }
      this.id && (data.id = this.id)
      this.$post(REMIND_SETTINGSAVE_URL, data).then((res) => {
        this.$toast({
          icon: 'success',
          message: '保存成功',
          forbidClick: true,
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  .van-switch {vertical-align: top;}
  .remind-setting-save-button {position: fixed;bottom: 0;left: 0;z-index: 100;}

  .remind-setting {background-color: #fff;margin-bottom: 10px;text-align: center;color: #666;padding: 15px;}
  .remind-setting h4 {margin: 0 0 15px;text-align: left;color: #333;}
  .remind-setting .van-icon {display: block;margin-bottom: 5px;}
</style>
