<template>
  <div id="page-user-paypass" class="navbar-fix">
    <navbar title="支付密码"></navbar>

    <div class="number-keyboard-title">设置支付密码<p>请输入支付密码，以验证身份</p></div>

    <van-password-input :value="passOld" v-if="step === 0" gutter="5px" :info="payPassInfo" @focus="showKeyboard = true" />
    <van-password-input :value="passNew" v-else-if="step === 1" gutter="5px" :info="payPassInfo" @focus="showKeyboard = true" />
    <van-password-input :value="passConfirm" v-else gutter="5px" :info="payPassInfo" @focus="showKeyboard = true" />

    <div class="button-area">
      <van-button type="primary" v-if="step === 1" @click="onNext" block>下一步</van-button>
      <van-button type="primary" v-else @click="onSubmit" block>完成</van-button>
    </div>

    <van-number-keyboard :show="showKeyboard" @input="onInput" @delete="onDelete" @blur="showKeyboard = false" safe-area-inset-bottom />
  </div>
</template>

<script>
import { USER_PAYPASS_URL } from '../../api'

export default {
  name: 'userPaypass',
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo
    },
    payPassInfo () {
      let str = ''
      if (this.step === 0) {
        str = '旧的支付密码'
      } else if (this.step === 1) {
        if (this.userInfo.payPasswordStatus) {
          str = '新的支付密码'
        } else {
          str = '密码为 6 位数字'
        }
      } else {
        str = '重复上一步的密码'
      }
      return str
    }
  },
  data () {
    return {
      step: 1,
      passOld: '',
      passNew: '',
      passConfirm: '',
      showKeyboard: false
    }
  },
  created () {
    this.step = this.userInfo.payPasswordStatus ? 0 : 1
  },
  methods: {
    onInput (key) {
      if (this.step === 0) {
        this.passOld = (this.passOld + key).slice(0, 6)
      } else if (this.step === 1) {
        this.passNew = (this.passNew + key).slice(0, 6)
      } else {
        this.passConfirm = (this.passConfirm + key).slice(0, 6)
      }
    },
    onDelete () {
      if (this.step === 0) {
        this.passOld = this.passOld.slice(0, this.passOld.length - 1)
      } else if (this.step === 1) {
        this.passNew = this.passNew.slice(0, this.passNew.length - 1)
      } else {
        this.passConfirm = this.passConfirm.slice(0, this.passConfirm.length - 1)
      }
    },
    onNext () {
      if ((this.step === 0 && this.passOld.length < 6) || (this.step === 1 && this.passNew.length < 6)) {
        this.$toast('请输入支付密码')
        return false
      }
      this.step++
    },
    onSubmit () {
      if (this.passNew !== this.passConfirm) {
        this.$toast('两次密码不一致')
      } else {
        this.$post(USER_PAYPASS_URL, {
          oldPassword: this.passOld,
          payPassword: this.passNew
        }).then((res) => {
          this.$store.commit('updateUserInfo', {
            payPasswordStatus: true
          })
          this.$toast({
            icon: 'success',
            message: '设置成功',
            forbidClick: true,
            duration: 2000
          })
          setTimeout(() => {
            this.$router.back(-1)
          }, 2000)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
