<template>
    <div id="page-goods-bid-service" class="navbar-fix tabbar-fix">
      <navbar title="多宝服务协议"></navbar>
      <div class="container goods-service">
        <h4>多宝拍卖竞拍服务协议</h4>
        <div class="t">
          <p>生效日期：自2018年8月3日起</p>
          <p>本协议根据《中华共和国民事诉讼》及最高人民法院相关司法解释所制定，请您仔细阅读本协议的全部内容（特别是以下粗体下划线标志的内容）。如果您对协议内容有疑问请通过多宝渠道进行询问，多宝网络将向您解释。如果您不同意本须知的任意内容，或者无法准确理解多宝网络对内容的解释，请您不要继续进行下一步的操作。</p>
        </div>
        <div class="b">
          <p>1.多宝上涉及的司法拍卖/变卖系由西安市多宝网络有限公司（以下简称多宝，从事拍卖/变卖活动，多宝网络提供司法拍卖平台相关的互联网信息服务及技术支持</p>
          <p>2.多宝网上的司法拍卖/变卖活动应当遵循“公开、公平、公正、诚实信用”的原则，及时有效的变价处理涉案财产</p>
          <p>3.凡有意向通过多宝网拍平台猜拍的竞买人，均应自</p>
        </div>
        <van-checkbox v-model="checked" checked-color="#d63c3c">同意以上协议</van-checkbox>
      </div>

      <van-button class="goods-service-button" square type="primary" block @click="onNext">下一步</van-button>
    </div>
</template>

<script>
import { USER_UPDATE_URL } from '../../api'

export default {
  name: 'GoodsBidService',
  data () {
    return {
      checked: false
    }
  },
  methods: {
    onNext () {
      if (!this.checked) {
        this.$toast('请勾选同意以上协议')
      } else {
        this.$post(USER_UPDATE_URL, {
          bidServiceStatus: 1
        }).then((res) => {
          this.$store.commit('updateUserInfo', {
            bidServiceStatus: true
          })
          this.$router.replace({
            name: 'goodsIdentification',
            query: { 'goods-id': this.$route.query['goods-id'] },
            params: { 'type': 'signup' }
          })
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
  .goods-service {padding-top: 30px;padding-bottom: 30px;}
  .goods-service h4 {margin: 0 0 15px;text-align: center;font-size: 16px;}
  .goods-service .t {color: #999;}
  .goods-service .b p {text-decoration: underline;}
  .goods-service-button {position: fixed;bottom: 0;left: 0;z-index: 100;}
</style>
