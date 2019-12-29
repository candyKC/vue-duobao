<template>
    <div id="page-user-bankcard-add" class="navbar-fix">
      <navbar title="添加银行卡"></navbar>

      <van-cell-group style="margin-top: 10px;">
        <van-field label="银行卡" placeholder="请选择" v-model="bank" readonly is-link @click="onBankShow" />
        <van-field label="持卡人" placeholder="请输入" v-model="holder" clearable />
        <van-field label="卡号" type="number" placeholder="请输入" v-model="cardId" clearable />
      </van-cell-group>

      <div class="button-area">
        <van-button type="primary" block @click="onSubmit">确认</van-button>
      </div>

      <van-popup v-model="show" position="bottom">
        <van-picker :columns="columns" :loading="columnsLoading" show-toolbar @confirm="onConfirm" @cancel="show = false" />
      </van-popup>
    </div>
</template>

<script>
import { BANKCARD_LIST_URL, USER_BANKCARD_ADD_URL } from '../../api'

export default {
  name: 'userBankcardAdd',
  data () {
    return {
      show: false,
      columns: [],
      columnsLoading: true,
      bank: '',
      bankCardId: '',
      cardId: '',
      holder: ''
    }
  },
  methods: {
    onBankShow () {
      this.show = true
      if (!this.columns.length) {
        this.$post(BANKCARD_LIST_URL, {
          page: 1,
          limit: 100
        }).then((res) => {
          res.data.records.map((value) => {
            this.columns.push({
              text: value.name,
              id: value.id
            })
          })
          this.columnsLoading = false
        })
      }
    },
    onConfirm (value) {
      this.show = false
      console.log(value)
      this.bank = value.text
      this.bankCardId = value.id
    },
    onSubmit () {
      if (this.bankCardId === '') {
        this.$toast('请选择银行')
        return false
      }
      if (!(/[\u4E00-\u9FA5]/.test(this.holder))) {
        this.$toast('请输入正确的姓名')
        return false
      }
      if (this.cardId === '') {
        this.$toast('请输入正确的银行卡号')
        return false
      }
      this.$post(USER_BANKCARD_ADD_URL, {
        bankCardId: this.bankCardId,
        cardId: this.cardId,
        holder: this.holder
      }).then((res) => {
        this.$toast({
          icon: 'success',
          message: '添加成功',
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
</script>

<style scoped lang="less">

</style>
