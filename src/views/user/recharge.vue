<template>
  <div id="page-recharge" class="navbar-fix">
    <navbar title="充值"></navbar>

    <div class="container">
      <div class="recharge user-box">
        <div class="empty">
          <img style="width: 237px;height: auto;" src="../../assets/images/recharge@2x.png" alt="">
        </div>
        <div class="section-title" style="text-align: left;">充值金额</div>
        <div class="recharge-input">
          <label>¥</label><p><input type="text" v-model="amount"></p>
        </div>
        <van-cell-group>
          <van-field label="银行卡" :placeholder="columns.length ? '请选择' : '添加银行卡'" input-align="right" v-model="bank" readonly right-icon="arrow" @click="onBankShow" />
        </van-cell-group>
      </div>
    </div>

    <div class="button-area">
      <van-button type="primary" block @click="onSubmit">充值</van-button>
    </div>

    <van-popup v-model="show" position="bottom">
      <van-picker :columns="columns" show-toolbar @confirm="onConfirm" @cancel="show = false" />
    </van-popup>

    <van-popup v-model="payPassShow" round position="bottom" :style="{ height: '80%' }">
      <div class="number-keyboard-title">支付密码<p>请输入支付密码，以验证身份</p></div>
      <van-password-input :value="payPass" gutter="5px" info="密码为 6 位数字" @focus="showKeyboard = true" />
      <van-number-keyboard :show="true" close-button-text="完成" :hide-on-click-outside="false" @input="onInput" @delete="onDelete" @close="onClose" safe-area-inset-bottom />
    </van-popup>
  </div>
</template>

<script>
import { USER_RECHARGE_URL, USER_BANKCARD_LIST_URL } from '../../api'
export default {
  name: 'userRecharge',
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo
    }
  },
  data () {
    return {
      show: false,
      amount: '',
      payPass: '',
      columns: [],
      columnsLoading: true,
      payPassShow: false,
      bank: '',
      userCardId: ''
    }
  },
  created () {
    this.$post(USER_BANKCARD_LIST_URL, {
      page: 1,
      limit: 100
    }).then((res) => {
      console.log(res)
      res.data.records.map((value) => {
        this.columns.push({
          text: value.bankName,
          id: value.bankCardId
        })
      })
    })
  },
  methods: {
    onSubmit () {
      if (!(/(^[1-9]\d*$)/.test(this.amount))) {
        this.$toast('请输入正确的金额')
        return false
      }
      if (!this.userCardId) {
        this.$toast('请选择银行卡')
        return false
      }
      if (this.userInfo.payPasswordStatus) {
        if (this.payPass.length === 6) {
          this.$post(USER_RECHARGE_URL, {
            amount: this.amount,
            payPassword: this.payPass,
            userCardId: this.userCardId
          }).then((res) => {
            this.$store.commit('updateUserInfo', {
              balance: parseFloat(this.userInfo.balance) + parseFloat(this.amount)
            })
            this.$toast({
              icon: 'success',
              message: '充值成功',
              forbidClick: true,
              duration: 2000
            })
            setTimeout(() => {
              this.$router.back(-1)
            }, 2000)
          }).catch(() => {
            this.payPass = ''
          })
        } else {
          this.payPassShow = true
        }
      } else {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '请设置支付密码'
        }).then(() => {
          this.$router.push({
            name: 'userPaypass'
          })
        }).catch(() => {})
      }
    },
    onBankShow () {
      if (this.columns.length) {
        this.show = true
      } else {
        this.$router.push({ name: 'userBankcardAdd' })
      }
    },
    onConfirm (value) {
      this.show = false
      console.log(value)
      this.bank = value.text
      this.userCardId = value.id
    },
    onInput (key) {
      this.payPass = (this.payPass + key).slice(0, 6)
    },
    onDelete () {
      this.payPass = this.payPass.slice(0, this.payPass.length - 1)
    },
    onClose () {
      this.onSubmit()
      this.payPassShow = false
    }
  }
}
</script>

<style scoped lang="less">
  .recharge {margin: 20px 0 0;padding: 15px;}
  .recharge .empty {padding: 30px 0;}
  .recharge-input {overflow: hidden;margin-bottom: 20px;}
  .recharge-input label {float: left;font-size: 38px;line-height: 1;}
  .recharge-input p {margin: 0 0 0 35px;}
  .recharge-input input {display: block;width: 100%;padding: 0;border: 0;background-color: transparent;line-height: 1;font-size: 38px;height: 38px;}
  .recharge .van-cell-group {padding-top: 15px;}
  .recharge .van-cell-group:after {border-top-width: 1px;border-bottom-width: 0;}
  .recharge .van-cell {padding: 0;}

  .van-password-input__security li {border: 1px solid #eee;}
</style>
