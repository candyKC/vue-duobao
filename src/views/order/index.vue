<template>
  <div id="page-order" class="navbar-fix">
    <navbar title="我的订单"></navbar>

    <van-tabs v-model="active" sticky color="#D63C3C" :offset-top="46" line-width="30" line-height="2" @click="onTab" :swipe-threshold="5">
      <van-tab title="待付款" />
      <van-tab title="待发货" />
      <van-tab title="待收货" />
      <van-tab title="待评价" />
    </van-tabs>

    <div class="container">
      <div class="empty" v-if="isEmpty">
        <img style="width: 115px;height: auto;" src="../../assets/images/empty2@2x.png" alt="">
        <p>没有相关订单信息</p>
      </div>
      <van-list v-model="order.loading" :finished="order.finished" finished-text="已加载完毕" :error.sync="order.error" error-text="请求失败，点击重新加载" @load="getData" v-else>
        <van-panel status="状态" v-for="(item, index) in order.list" :key="index">
          <van-cell slot="header" class="van-panel__header" value-class="van-panel__header-value">
            <div slot="title">{{item.gmtCreate}}</div>
            <span v-if="item.status === 0">等待买家付款</span>
            <span v-if="item.status === 1">等待卖家发货</span>
            <span v-if="item.status === 2">等待买家收货</span>
            <span v-if="item.status === 3">等待买家评价</span>
            <span v-if="item.status === 4">已完成</span>
          </van-cell>
          <van-card :price="item.price" :desc="'服务地区：' + item.province + item.city" :title="item.name">
            <template slot="thumb">
              <van-image lazy-load fit="cover" :src="item.avatar">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </template>
          </van-card>
          <div slot="footer" style="text-align: right;">
            <van-button size="mini" type="primary" @click="$router.push({name: 'orderPay', params: { 'id': item.id, 'type': 'service' }})" v-if="item.status === 0" round plain>去付款</van-button>
            <van-button size="mini" type="primary" v-if="item.status === 2" round plain @click="onReceive(index, item.id)">确认收货</van-button>
            <van-button size="mini" type="primary" v-if="item.status === 3" round plain>去评价</van-button>
          </div>
        </van-panel>
      </van-list>
    </div>
  </div>
</template>

<script>
import { ORDER_LIST_URL, ORDER_RECEIVE_URL } from '../../api'

export default {
  name: 'order',
  computed: {
    active: {
      get () {
        return parseInt(this.$route.query.type) || 0
      },
      set () {}
    }
  },
  data () {
    return {
      isEmpty: false,
      order: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: []
      }
    }
  },
  methods: {
    onTab (index) {
      this.$router.replace({ name: 'order', query: { type: index } })
    },
    getData () {
      this.$post(ORDER_LIST_URL, {
        page: this.order.current,
        limit: this.order.limit,
        status: this.$route.query.type || 0
      }).then((res) => {
        console.log(res)
        this.order.loading = false
        if (this.order.current === 1) {
          this.order.list = res.data.records
        } else {
          for (let i = 0; i < res.data.records.length; i++) {
            this.order.list.push(res.data.records[i])
          }
        }
        if (this.order.list.length >= res.data.total) {
          this.order.finished = true
        } else {
          this.order.current++
        }
        this.isEmpty = !parseInt(res.data.total)
      }).catch((err) => {
        console.log(err)
        this.order.error = true
      })
    },
    onReceive (index, id) {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '是否确认收货'
      }).then(() => {
        this.$post(ORDER_RECEIVE_URL, {
          id: id
        }).then((res) => {
          this.order.list.splice(index, 1)
          this.$toast('已确认收货')
        })
      }).catch(() => {})
    }
  },
  watch: {
    $route (to, from) {
      this.isEmpty = false
      this.order = {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: []
      }
      this.getData()
    }
  }
}
</script>

<style scoped lang="less">
  .van-panel {margin: 10px 0;}
  .van-panel .van-button--mini {padding: 0 8px;}
  .van-panel__header {font-size: 12px;line-height: 20px;}
  .van-card__title {font-size: 14px;line-height: 20px;max-height: 40px;}
  .van-card__content {min-height: 60px;}
  .van-panel__content .van-card {background-color: transparent;padding-top: 0;padding-bottom: 0;}
  .van-card__thumb {height: auto;border-radius: 3px;overflow: hidden;}
  .van-card__thumb .van-image {height: 60px;width: 100%;display: block;}
</style>
