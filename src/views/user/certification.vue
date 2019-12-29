<template>
  <div id="page-user-certification" class="navbar-fix">
    <navbar title="实名认证"></navbar>

    <van-cell-group style="margin-top: 10px;">
      <van-field label="姓名" v-model="realName" placeholder="请输入" :readonly="!!userInfo.isReal" clearable />
      <van-field label="性别" v-model="sex" placeholder="请选择" readonly :is-link="!userInfo.isReal" @click="onShow" />
      <van-field label="身份证" v-model="idCard" placeholder="请输入" :readonly="!!userInfo.isReal" clearable />
    </van-cell-group>

    <div class="button-area" v-if="!userInfo.isReal">
      <van-button type="primary" @click="submit" block>保存</van-button>
    </div>

    <van-action-sheet cancel-text="取消" round safe-area-inset-bottom v-model="show" :actions="actions" @select="onSelect" />
  </div>
</template>

<script>
import { USER_IDCARD_URL } from '../../api'

export default {
  name: 'userCertification',
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo
    }
  },
  data () {
    return {
      show: false,
      realName: '',
      sex: '',
      sexVal: '',
      idCard: '',
      actions: [
        { name: '男', value: 1 },
        { name: '女', value: 0 }
      ]
    }
  },
  created () {
    this.realName = this.userInfo.realName
    this.sexVal = this.userInfo.sex
    if (this.userInfo.sex !== 0 && this.userInfo.sex !== 1) {
      this.sex = ''
    } else {
      this.sex = this.userInfo.sex ? '男' : '女'
    }
    this.idCard = this.userInfo.idCard
  },
  methods: {
    onSelect (item) {
      this.show = false
      this.sexVal = item.value
      this.sex = item.name
    },
    onShow () {
      if (!this.userInfo.isReal) {
        this.show = true
      }
    },
    submit () {
      if (!(/[\u4E00-\u9FA5]/.test(this.realName))) {
        this.$toast('请输入正确的姓名')
        return false
      }
      if (this.sexVal === '') {
        this.$toast('请选择性别')
        return false
      }
      if (!(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|[A-Z])$/i.test(this.idCard))) {
        this.$toast('请输入正确的身份证')
        return false
      }
      this.$post(USER_IDCARD_URL, {
        realName: this.realName,
        sex: this.sexVal,
        idCard: this.idCard
      }).then((res) => {
        this.$store.commit('updateUserInfo', {
          realName: this.realName,
          idCard: this.idCard,
          sex: this.sexVal,
          isReal: 1
        })
        this.$toast({
          icon: 'success',
          message: '修改成功',
          forbidClick: true,
          duration: 2000
        })
        setTimeout(() => {
          this.$router.back(-1)
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
