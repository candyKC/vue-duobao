<template>
  <div id="page-goods-identification" class="tabbar-fix navbar-fix">
    <navbar title="身份确认"></navbar>
    <van-cell-group style="margin-top: 10px;">
      <van-cell title="姓名/企业名" :value="userInfo.realName" is-link :to="{name: 'userCertification'}" />
      <van-cell title="银行卡账号" value="内容" is-link />
      <van-cell title="证件号码" label="身份证" :value="userInfo.idCard" is-link :to="{name: 'userCertification'}" />
      <van-cell title="联系地址" :value="(address.province + address.city + address.county + address.detail) || ''" is-link :to="{name: 'userAddress'}" />
    </van-cell-group>

    <div class="goods-identification-title">竞买人确认事项并勾选</div>
    <div class="goods-identification-checkbox">
      <van-checkbox v-model="checked1" checked-color="#d63c3c">竞买人知晓拍下不买的后果；保证金不予退还并承担相应的司法处罚。</van-checkbox>
      <van-checkbox v-model="checked2" checked-color="#d63c3c">竞买人知晓本次报名仅代表本人，本人未接受任何他人委托参与本次竞拍。（如需办理委托竞买，请在报名前联系资产处置单位委托双方信息录入系统，否则委托关系将不生效）。</van-checkbox>
      <van-checkbox v-model="checked3" checked-color="#d63c3c">竞买人知晓并同意，如您报名成功，您的姓名，证件号码、手机号、联系地址等信息等被披露给资产处置单位及相关服务提供方，用于核实竞买人的真实身份和竞买资格。</van-checkbox>
    </div>

    <van-button class="goods-identification-button" square type="primary" block @click="onNext">下一步</van-button>
  </div>
</template>

<script>
import { GOODS_AUCTION_URL, ORDER_ONEPRICE_URL } from '../../api'

export default {
  name: 'goodsIdentification',
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo
    }
  },
  data () {
    return {
      checked1: false,
      checked2: false,
      checked3: false,
      address: {}
    }
  },
  created () {
    if (this.userInfo.address) {
      this.address = JSON.parse(this.userInfo.address)
    }
  },
  methods: {
    onNext () {
      if (!this.checked1 || !this.checked2 || !this.checked3) {
        this.$toast('请勾选竞买人确认事项')
      } else if (!this.address.detail || !this.userInfo.isReal) {
        this.$toast('请完善信息')
      } else {
        if (this.$route.params.type === 'one-price') {
          this.$post(ORDER_ONEPRICE_URL, {
            goodsId: this.$route.query['goods-id']
          }).then((res) => {
            this.$router.replace({
              name: 'orderPay',
              params: { 'id': res.orderId, 'type': this.$route.params.type }
            })
          })
        } else {
          this.$post(GOODS_AUCTION_URL, {
            goodsId: this.$route.query['goods-id']
          }).then((res) => {
            this.$router.replace({
              name: 'orderPay',
              params: { 'id': res.orderId, 'type': this.$route.params.type }
            })
          })
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
  .goods-identification-title {margin: 0;font-weight: 400;font-size: 14px;color: rgba(69,90,100,.6);padding: 25px 15px 10px;}
  .goods-identification-button {position: fixed;bottom: 0;left: 0;z-index: 100;}
  .goods-identification-checkbox {background-color: #fff;padding: 5px 15px;}
  .goods-identification-checkbox .van-checkbox {margin: 10px 0;font-size: 12px;}
</style>
