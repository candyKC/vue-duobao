<template>
  <div id="page-order-pay-status" class="navbar-fix">
    <navbar :title="title"></navbar>

    <div class="empty">
      <img style="width: 114px;height: auto;" src="../../assets/images/pay-status-icon1@2x.png" alt="">
      <template v-if="$route.params.type === 'add-price'">
        <p>恭喜您已加价成功，请及时查收加价通知（{{this.second}}秒返回）</p>
      </template>
      <template v-if="$route.params.type === 'signup'">
        <p>您已成功交付了保证金，赶紧去拍卖吧</p>
        <van-button round type="primary" style="width: 140px;margin-top: 30px;" replace :to="{name: 'goods', query: {id: this.$route.query.id}}">查看详情</van-button>
      </template>
      <template v-if="$route.params.type === 'one-price' || $route.params.type === 'service' || $route.params.type === 'shopcart'">
        <p>已支付成功，现在可以通过以下方式</p>
        <van-button round type="primary" style="width: 140px;margin-top: 30px;" replace :to="{name: 'order', query: {type: 1}}">查看订单</van-button>
      </template>
    </div>

    <div class="container">
      <div class="section-title">可能你喜欢</div>
      <goods-like></goods-like>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orderStatus',
  computed: {
    title () {
      return this.$route.params.status === 'success' && '支付成功'
    }
  },
  data () {
    return {
      timer: null,
      second: 3
    }
  },
  created () {
    if (this.$route.params.type === 'add-price') {
      this.timer = setInterval(() => {
        if (this.second === 0) {
          this.$router.replace({ name: 'goods', query: { id: this.$route.query.id } })
        } else {
          this.second--
        }
      }, 1000)
    }
  },
  methods: {
  },
  beforeRouteLeave (to, from, next) {
    if (this.$route.params.type === 'add-price') clearInterval(this.timer)
    next()
  }
}
</script>

<style scoped>

</style>
